import { Request } from "express";
import config from "./config";
import { ITaskQueryParams } from "./data/repositories/repository";

export function add(a: number, b: number) {
  return a + b;
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;

  if (error && typeof error === "object" && "message" in error)
    return String(error.message);

  if (typeof error === "string") return error;

  return "An error occured";
}

export function getPaginationParams(req: Request) {
  const page = parseInt(req.query.page as string, 10);
  const perPage = parseInt(req.query.perPage as string, 10);

  const validPage = isNaN(page) || page < 1 ? 1 : page;
  const validPerPage =
    isNaN(perPage) || perPage < 1 ? config.defaultPageSize : perPage;

  const limit = validPerPage;
  const offset = (validPage - 1) * validPerPage;

  return {
    page: validPage,
    perPage: validPerPage,
    limit,
    offset,
  };
}

export function parseTaskQueryParams(req: Request) {
  const {
    search,
    completed: completedParam,
    orderBy: orderByParam,
  } = req.query;

  let completed: boolean | undefined;
  if (completedParam === "1" || completedParam === "true") completed = true;
  else if (completedParam === "0" || completedParam === "false")
    completed = false;
  else completed = undefined;

  let orderBy: ITaskQueryParams["orderBy"] = { created_at: "asc" };

  if (typeof orderByParam === "string") {
    const [field, direction] = orderByParam.split("-");
    if (
      ["created_at", "dur_date"].includes(field) &&
      ["asc", "desc"].includes(direction)
    ) {
      orderBy = { [field]: direction as "asc" | "desc" };
    }
  }

  return {
    search: search as string | undefined,
    completed,
    orderBy,
  };
}

export function getCursorPaginationParams(req: Request) {
  const perPage = parseInt(req.query.perPage as string, 10);
  const limit =
    isNaN(perPage) || perPage < 1 ? config.defaultPageSize : perPage;

  const nextCursor = req.query.nextCursor as string | undefined;
  const prevCursor = req.query.prevCursor as string | undefined;

  return {
    limit,
    nextCursor: nextCursor ? decodeBase64(nextCursor) : undefined,
    prevCursor: prevCursor ? decodeBase64(prevCursor) : undefined,
  };
}

export function encodeBase64(input: string) {
  return Buffer.from(input).toString("base64");
}

export function decodeBase64(input: string) {
  return Buffer.from(input, "base64").toString("utf-8");
}
