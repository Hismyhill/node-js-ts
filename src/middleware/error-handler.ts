import { NextFunction, Request, Response } from "express";
import config from "../config";
import { getErrorMessage } from "../utils";
import CustomError from "../errors/CustomError";
import { UnauthorizedError } from "express-oauth2-jwt-bearer";
import Joi from "joi";

export default function (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent || config.debug) {
    next(error);
    return;
  }

  if (Joi.isError(error)) {
    const validationError: ValidationError = {
      error: {
        message: "Validation error",
        statusCode: 422,
        code: "ERR_VALID",
        errors: error.details.map((err) => ({
          message: err.message,
        })),
      },
    };

    res.status(422).json(validationError);
    return;
  }

  if (error instanceof CustomError) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
        statusCode: error.statusCode,
        code: error.code,
      },
    });

    return;
  }

  if (error instanceof UnauthorizedError) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
        statusCode: error.statusCode,
        code: "code" in error ? error.code : "ERR_AUTH",
      },
    });

    return;
  }

  res.status(500).json({
    message:
      getErrorMessage(error) ||
      "An error occured. Please view the log for more details",
  });
}
