import { Request, Response } from "express";
import { repository } from "@/data/repositories";
import {
  encodeBase64,
  getCursorPaginationParams,
  getPaginationParams,
  parseTaskQueryParams,
} from "@/utils";
import { CreateTaskUseCase } from "@/use-cases/CreateTaskUseCase";
import { mailer } from "@/services/mailer";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { Task } from "@/data/entities/Task";
import tasks from ".";

export const listTasks = async (req: Request, res: Response) => {
  const { limit, offset, perPage, page } = getPaginationParams(req);
  const queryParams = parseTaskQueryParams(req);

  const result = await repository.listTasks(
    {
      limit,
      offset,
      ...queryParams,
    },
    req.auth?.payload.sub,
  );

  const tasks = result.tasks.map((taskData) => plainToInstance(Task, taskData));
  res.status(200).json({
    tasks: tasks.map((task) => task.asDto()),
    page,
    per_page: perPage,
    total_pages: Math.ceil(result.totalCount / perPage),
    total_count: result.totalCount,
  });

  //  cursor Pagination
  // const { limit, nextCursor, prevCursor } = getCursorPaginationParams(req);
  // const result = await repository.listTasks(
  //   {
  //     limit,
  //     prevCursor,
  //     nextCursor,
  //   },
  //   req.auth?.payload.sub
  // );

  // res.status(200).json({
  //   tasks: result.tasks,
  //   nextCursor: result.nextCursor
  //     ? encodeBase64(result.nextCursor.toISOString())
  //     : null,
  //   prevCursor: result.prevCursor
  //     ? encodeBase64(result.prevCursor.toISOString())
  //     : null,
  // });
};

export const getTask = async (req: Request, res: Response) => {
  const taskData = await repository.getTask(
    req.params.id as string,
    req.auth?.payload.sub,
  );
  const task = plainToInstance(Task, taskData);
  res.status(200).json({ task: task.asDto() });
};

export const createTask = async (req: Request, res: Response) => {
  const createTaskUseCase = new CreateTaskUseCase(req, mailer);
  const task = await createTaskUseCase.execute();

  res.status(201).json({ task });
};

export const updateTask = async (req: Request, res: Response) => {
  const taskData = await repository.getTask(
    req.params.id as string,
    req.auth?.payload.sub,
  );
  const task = plainToInstance(Task, taskData);
  await repository.updateTask(
    req.params.id as string,
    req.body,
    req.auth?.payload.sub,
  );

  res.status(200).json({ task: task.asDto() });
};

export const markTaskAsCompleted = async (req: Request, res: Response) => {
  const taskData = await repository.getTask(
    req.params.id as string,
    req.auth?.payload.sub,
  );
  const task = plainToInstance(Task, taskData);
  task.markAsCompleted();
  await repository.updateTask(
    req.params.id as string,
    task,
    req.auth?.payload.sub,
  );

  res.status(200).json({ task: task.asDto() });
};
