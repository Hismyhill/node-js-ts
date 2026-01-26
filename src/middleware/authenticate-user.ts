import config from "@/config";
import AuthenticationError from "@/errors/AuthenticationError";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { NextFunction, Request, Response } from "express";

const userPoolId = config.cognito.userPool;
const clientId = config.cognito.clientId;

if (!userPoolId || !clientId) {
  throw new Error("Cognito configuration is missing");
}

const verifier = CognitoJwtVerifier.create({
  userPoolId,
  tokenUse: "access",
  clientId,
});

const authenticateUser =
  (requiredScopes?: []) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AuthenticationError({
        message: "Authorization header missing or malformed",
        statusCode: 401,
        code: "ERR_AUTH",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    try {
      // verify the jwt token
      const payload = await verifier.verify(token);

      // extract scopes from the token
      const tokensScopes = ((payload.scope as string) || "").split(" ");

      // If scopes are required, check them.
      if (requiredScopes && requiredScopes.length > 0) {
        const hasRequiredScopes = requiredScopes.every((scope) =>
          tokensScopes.includes(scope),
        );

        if (!hasRequiredScopes) {
          throw new AuthenticationError({
            message: `Insufficient permissions. Required scopes: ${requiredScopes.join(", ")}`,
            statusCode: 403,
            code: "ERR_VALID",
          });
        }
      }

      req.auth = {
        sub: payload.sub,
        email: payload["email"] as string | undefined,
        name: payload["name"] as string | undefined,
        scopes: tokensScopes,
      };

      next();
    } catch (error) {
      next(error);
    }
  };

export default authenticateUser;
