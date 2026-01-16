import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./generated/prisma/client";
import config from "./config";

const adapter = new PrismaMariaDb({
  host: config.host || "localhost",
  port: config.db_port || 33061,
  user: config.db_user,
  password: config.db_password,
  database: "prisma_api",
});

const prisma = new PrismaClient({ adapter });

export default prisma;
