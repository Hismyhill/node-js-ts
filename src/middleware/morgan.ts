import morgan from "morgan";
import logger from "../logger";

const morganMiddleware = morgan(
  ":method :url :res[content-length] - :response-time ms",
  {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  }
);

export default morganMiddleware;
