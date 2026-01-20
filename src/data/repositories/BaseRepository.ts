import config from "@/config";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

export default class BaseRepository {
  protected defaultLimit = 10;
  protected defaultOffset = 0;
  protected client: PrismaClient;
  constructor() {
    const adapter = new PrismaMariaDb({
      host: config.host || "localhost",
      port: config.db_port || 33061,
      user: config.db_user,
      password: config.db_password,
      database: "prisma_api",
    });
    this.client = new PrismaClient({ adapter });
  }

  getClient() {
    return this.client;
  }
}

export type Constructor<T = {}> = new (...args: any[]) => T;
