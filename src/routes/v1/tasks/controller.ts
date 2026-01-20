import { Request, Response } from "express";
import { repository } from "@/data/repositories";

export const listTasks = async (req: Request, res: Response) => {
  const tasks = await repository.listTasks({}, req.auth?.payload.sub);
  res.status(200).json({ tasks });
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
