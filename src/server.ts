import express, { Response, Request } from "express";
import morgan from "morgan";
import cors from "cors";

export function createServer() {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(cors());

  app.get("/health", (req: Request, res: Response) => {
    res.json({ ok: true });
  });

  return app;
}
