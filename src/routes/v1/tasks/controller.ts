import { Request, Response } from "express";
import { repository } from "@/data/repositories";
import {
  encodeBase64,
  getCursorPaginationParams,
  getPaginationParams,
} from "@/utils";
import { reset } from "module-alias";

export const listTasks = async (req: Request, res: Response) => {
  // const { limit, offset, perPage, page } = getPaginationParams(req);

  //  const result = await repository.listTasks(
  //    {
  //      limit,
  //      offset,
  //    },
  //    req.auth?.payload.sub
  //  );
  //  res.status(200).json({
  //    projects: result.tasks,
  //    page,
  //    perP_page: perPage,
  //    total_page: Math.ceil(result.totalCount / perPage),
  //    total_count: result.totalCount,
  //  });

  const { limit, nextCursor, prevCursor } = getCursorPaginationParams(req);
  const result = await repository.listTasks(
    {
      limit,
      prevCursor,
      nextCursor,
    },
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

export const getTask = async (req: Request, res: Response) => {
  const task = await repository.getTask(
    req.params.id as string,
    req.auth?.payload.sub
  );
  res.status(200).json({ task });
};

export const createTask = async (req: Request, res: Response) => {
  const task = await repository.createTask(req.body, req.auth?.payload.sub);

  res.status(201).json({ task });
};

export const updateTask = async (req: Request, res: Response) => {
  const task = await repository.updateTask(
    req.params.id as string,
    req.body,
    req.auth?.payload.sub
  );

  res.status(200).json({ task });
};
