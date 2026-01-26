import "express";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        sub?: string;
        email?: string;
        name?: string;
        scopes?: string[];
      };
    }
  }
}
