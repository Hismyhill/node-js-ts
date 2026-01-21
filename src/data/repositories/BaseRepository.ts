import config from "@/config";
import { Prisma, PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { ITaskQueryParams } from "./repository";

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

  // protected getPaginationQueryParams(query: ITaskQueryParams): any {
  //   const limit = query.limit || this.defaultLimit;
  //   let sortOrder: Prisma.SortOrder = "asc";
  //   let operator: string = "gt";
  //   let cursor = query?.nextCursor;

  //   if (query.prevCursor) {
  //     sortOrder = "desc";
  //     operator = "lt";
  //     cursor = query.prevCursor;
  //   }

  //   return { limit, sortOrder, operator, cursor };
  // }

  //   protected getPaginationCursors(
  //     query: ITaskQueryParams,
  //     entities: Prisma.TaskGetPayload<{}>[] | Prisma.ProjectGetPayload<{}>[],
  //     limit: number,
  //     sortOrder: string
  //   ) {
  //     const hasMoreResults = entities.length > limit;

  //     if (hasMoreResults) entities.pop();

  //     let nextCursorTimestamp: Date | null = null;
  //     let prevCursorTimestamp: Date | null = null;

  //     if (sortOrder === "asc" && hasMoreResults)
  //       nextCursorTimestamp = entities[entities.length - 1].created_at;

  //     if (sortOrder === "asc" && query.nextCursor)
  //       prevCursorTimestamp = entities[0].created_at;

  //     if (sortOrder === "desc" && hasMoreResults)
  //       prevCursorTimestamp = entities[entities.length - 1].created_at;

  //     if (sortOrder === "desc" && query.prevCursor)
  //       nextCursorTimestamp = entities[0].created_at;

  //     return { nextCursorTimestamp, prevCursorTimestamp };
  //   }
}

export type Constructor<T = {}> = new (...args: any[]) => T;
