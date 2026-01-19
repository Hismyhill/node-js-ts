import winston from "winston";
import config from "./config";
import DailyRotateFile from "winston-daily-rotate-file";

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logger = winston.createLogger({
  levels: logLevels,
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SS A",
    }),
    winston.format.printf(
      ({ timestamp, level, message, logMetaData, stack }) => {
        return `${timestamp} ${level}: ${logMetaData || ""} ${message} ${stack || ""}`;
      }
    )
  ),
  transports: [new winston.transports.Console()],
});

const fileRotateTransport = new DailyRotateFile({
  filename: "logs/application-%DATE%.log",
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.json()
  ),
});

logger.add(fileRotateTransport);

export default logger;
