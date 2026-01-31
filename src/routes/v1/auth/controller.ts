import express, { Request, Response } from "express";
import config from "@/config";
import {
  AttributeType,
  AuthFlowType,
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  GlobalSignOutCommand,
  InitiateAuthCommand,
  SignUpCommand,
  UpdateUserAttributesCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import AuthenticationError from "@/errors/AuthenticationError";
import logger from "@/logger";
import EntityNotFoundError from "@/errors/EntityNotFoundError";

const client = new CognitoIdentityProviderClient({
  region: config.cognito.awsRegion,
});

export const authRouter = express.Router();

export const signup = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  const command = new SignUpCommand({
    ClientId: config.cognito.clientId,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: "name",
        Value: name,
      },
      {
        Name: "email",
        Value: email,
      },
    ],
  });

  const response = await client.send(command);

  res.status(201).json({
    message: "User registration successful",
    user_id: response.UserSub,
  });
};

export const confirm = async (req: Request, res: Response) => {
  const { email, confirmation_code } = req.body;

  const command = new ConfirmSignUpCommand({
    ClientId: config.cognito.clientId,
    Username: email,
    ConfirmationCode: confirmation_code,
  });

  await client.send(command);

  res.status(200).json({
    message: "Email confirmed successfully",
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const command = new InitiateAuthCommand({
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    ClientId: config.cognito.clientId,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  });

  const response = await client.send(command);
  const tokens = response.AuthenticationResult;

  if (!tokens) {
    logger.error(response);
    throw new AuthenticationError({
      message:
        "No tokens received. Please check if USER_PASSWORD_AUTH is enabled in your Cognito User Pool Client settings",
      statusCode: 422,
      code: "ERR_AUTH",
    });
  }

  res.status(200).json({
    message: "Login successful",
    tokens: {
      access_tokens: tokens.AccessToken,
      refresh_token: tokens.RefreshToken,
      id_token: tokens.IdToken,
      expires_in: tokens.ExpiresIn,
    },
  });
};

export const updateProfile = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new EntityNotFoundError({
      message: "Access token is required",
      statusCode: 401,
      code: "ERR_AUTH",
    });
  }

  const accessToken = authHeader.replace("Bearer ", "");

  const { attributes }: { attributes: AttributeType[] } = req.body;

  if (!attributes || !Array.isArray(attributes)) {
    throw new AuthenticationError({
      message: "Request body must include an 'attributes' array.",
      statusCode: 400,
      code: "ERR_VALID",
    });
  }

  const command = new UpdateUserAttributesCommand({
    AccessToken: accessToken,
    UserAttributes: attributes,
  });

  await client.send(command);

  res.status(200).json({ message: "User profile updated successfully" });
};

export const logout = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new EntityNotFoundError({
      message: "Access token is required",
      statusCode: 401,
      code: "ERR_AUTH",
    });
  }

  const accessToken = authHeader.replace("Bearer ", "");

  const command = new GlobalSignOutCommand({
    AccessToken: accessToken,
  });

  await client.send(command);

  res.status(200).json({
    message: "Logout Successful",
  });
};

export const token = async (req: Request, res: Response) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    throw new EntityNotFoundError({
      message: "Refresh token is required",
      statusCode: 401,
      code: "ERR_AUTH",
    });
  }

  const command = new InitiateAuthCommand({
    AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
    ClientId: config.cognito.clientId,
    AuthParameters: {
      REFRESH_TOKEN: refresh_token,
    },
  });

  const response = await client.send(command);
  const tokens = response.AuthenticationResult;

  if (!tokens) {
    throw new AuthenticationError({
      message: "No authentication token received",
      statusCode: 422,
      code: "ERR_AUTH",
    });
  }

  res.status(200).json({
    message: "Token refreshed successfully",
    tokens: {
      access_token: tokens.AccessToken,
      id_token: tokens.IdToken,
      expires_in: tokens.ExpiresIn,
    },
  });
};
