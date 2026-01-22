import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./generated/prisma/client";
import config from "./config";

const adapter = new PrismaMariaDb({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: "prisma_api",
});

const prisma = new PrismaClient({ adapter });

export default prisma;
