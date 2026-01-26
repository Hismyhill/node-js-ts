const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT ?? "3000"),
  debug: process.env.APP_DEBUG === "true",
  logLevel: process.env.LOG_LEVEL || "info",
  consoleLogEmails: process.env.CONSOLE_LOG_EMAILS || "true",
  defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE ?? "10"),
  db: {
    url: process.env.DATABASE_URL || "",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 33061,
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "secret",
  },
  appSecret: process.env.APP_SECRET || "",
  issuerBaseUrl: process.env.ISSUER_BASE_URL || "",
  audience: process.env.AUDIENCE || "",
  mail: {
    mailer: process.env.MAIL_MAILER || "smtp",
    host: process.env.MAIL_HOST || "",
    port: Number(process.env.MAIL_HOST) || 0,
    username: process.env.MAIL_USERNAME || "",
    password: process.env.MAIL_PASSWORD || "",
  },
  adminEmail: process.env.ADMIN_EMAIL || "",
  cognito: {
    awsRegion: process.env.AWS_REGION,
    clientId: process.env.COGNITO_CLIENT_ID,
    userPool: process.env.COGNITO_USER_POOL_ID || "",
  },
};

export default config;
