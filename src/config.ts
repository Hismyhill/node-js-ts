const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT ?? "3000"),
  debug: process.env.APP_DEBUG === "true",
  db_url:
    process.env.DATABASE_URL ||
    "mysql://root:secret@localhost:33061/prisma_api",
  db_port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 33061,
  host: process.env.DB_HOST || "localhost",
  db_user: process.env.DB_USER || "root",
  db_password: process.env.DB_PASSWORD || "secret",
  appSecret: process.env.APP_SECRET || "",
  issuerBaseUrl: process.env.ISSUER_BASE_URL || "",
  audience: process.env.AUDIENCE || "",
};

export default config;
