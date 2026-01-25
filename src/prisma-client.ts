import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./generated/prisma/client";
import config from "./config";

// Parse DATABASE_URL if available, otherwise use config
const databaseUrl = process.env.DATABASE_URL;
let adapter;

if (databaseUrl) {
  // Parse URL: mysql://user:password@host:port/database
  const url = new URL(databaseUrl);
  const host = url.hostname;
  const port = parseInt(url.port || "3306");
  const user = url.username;
  const password = url.password;
  const database = url.pathname.slice(1); // Remove leading slash

  adapter = new PrismaMariaDb({
    host,
    port,
    user,
    password,
    database,
  });
} else {
  adapter = new PrismaMariaDb({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: "task_manager",
  });
}

const prisma = new PrismaClient({
  adapter,
  log: ["query", "error", "warn"],
});

export default prisma;
