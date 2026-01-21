import { Request, Response } from "express";
import prisma from "../../../prisma-client";
import EntityNotFoundError from "../../../errors/EntityNotFoundError";
import { repository } from "@/data/repositories";
import {
  encodeBase64,
  getCursorPaginationParams,
  getPaginationParams,
} from "@/utils";

export const listProjects = async (req: Request, res: Response) => {
  // const { limit, offset, perPage, page } = getPaginationParams(req);

  // const result = await repository.listProjects(
  //   {
  //     limit,
  //     offset,
  //   },
  //   req.auth?.payload.sub
  // );

  const { limit, nextCursor, prevCursor } = getCursorPaginationParams(req);

  const result = await repository.listProjects(
    {
      limit,
      nextCursor,
      prevCursor,
    },
    req.auth?.payload.sub
  );
  res.status(200).json({
    projects: result.projects,
    nextCursor: result.nextCursor
      ? encodeBase64(result.nextCursor.toISOString())
      : null,
    prevCursor: result.prevCursor
      ? encodeBase64(result.prevCursor.toISOString())
      : null,
  });
};

export const getProject = async (req: Request, res: Response) => {
  const project = await repository.getProject(
    req.params.id as string,
    req.auth?.payload.sub
  );

  res.status(200).json({ project });
};

export const listProjectTasks = async (req: Request, res: Response) => {
  // const { limit, offset, perPage, page } = getPaginationParams(req);
  // const result = await repository.listTasks(
  //   { project_id: req.params.id as string, limit, offset },
  //   req.auth?.payload.sub
  // );

  const { limit, nextCursor, prevCursor } = getCursorPaginationParams(req);

  const result = await repository.listTasks(
    { project_id: req.params.id as string, limit, nextCursor, prevCursor },
    req.auth?.payload.sub
  );

  res.status(200).json({
    tasks: result.tasks,
    nextCursor: result.nextCursor
      ? encodeBase64(result.nextCursor.toISOString())
      : null,
    prevCursor: result.prevCursor
      ? encodeBase64(result.prevCursor.toISOString())
      : null,
  });
};
