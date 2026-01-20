import { Request, Response } from "express";
import prisma from "../../../prisma-client";
import EntityNotFoundError from "../../../errors/EntityNotFoundError";
import { repository } from "@/data/repositories";
import { getPaginationParams } from "@/utils";

export const listProjects = async (req: Request, res: Response) => {
  const { limit, offset, perPage, page } = getPaginationParams(req);

  const result = await repository.listProjects(
    {
      limit,
      offset,
    },
    req.auth?.payload.sub
  );
  res.status(200).json({
    projects: result.projects,
    page,
    perP_page: perPage,
    total_page: Math.ceil(result.totalCount / perPage),
    total_count: result.totalCount,
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
  const { limit, offset, perPage, page } = getPaginationParams(req);
  const result = await repository.listTasks(
    { project_id: req.params.id as string, limit, offset },
    req.auth?.payload.sub
  );

  res.status(200).json({
    tasks: result.tasks,
    page,
    per_page: perPage,
    total_page: Math.ceil(result.totalCount / perPage),
    total_count: result.totalCount,
  });
};
