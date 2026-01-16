import { Request, Response } from "express";
import EntityNotFoundError from "../../../errors/EntityNotFoundError";
import prisma from "../../../prisma-client";

export const listTasks = async (req: Request, res: Response) => {
  const tasks = await prisma.task.findMany({
    where: {
      user_id: req.auth?.payload.sub,
    },
  });
  res.status(200).json({ tasks });
};

export const getTask = async (req: Request, res: Response) => {
  const task = await prisma.task.findUnique({
    where: {
      id: req.params.id as string,
      user_id: req.auth?.payload.sub,
    },
  });

  if (!task)
    throw new EntityNotFoundError({
      message: "Project not found",
      statusCode: 404,
      code: "ERR_NF",
    });

  res.status(200).json({ task });
};
