import { Prisma } from "@/generated/prisma/client";
import BaseRepository, { Constructor } from "./BaseRepository";
import {
  ITask,
  ITaskQueryParams,
  ITaskQueryResult,
  ITaskRepository,
} from "./repository";
import EntityNotFoundError from "@/errors/EntityNotFoundError";
import { getPaginationParams } from "@/utils";

type PrismaTask = Prisma.TaskGetPayload<{}>;

export function AddTaskRespository<TBase extends Constructor<BaseRepository>>(
  Base: TBase
) {
  return class TaskRepositoryMixin extends Base implements ITaskRepository {
    mapTask(task: PrismaTask): ITask {
      return {
        id: task.id,
        user_id: task.user_id,
        project_id: task.project_id,
        name: task.name,
        description: task.description,
        due_date: task.due_date,
        completed_on: task.completed_on,
        created_at: task.created_at,
      };
    }

    async listTasks(
      query: ITaskQueryParams,
      userId?: string
    ): Promise<ITaskQueryResult> {
      const where: Prisma.TaskWhereInput = {
        user_id: userId,
        project_id: query.project_id,

        name: {
          contains: query.search,
        },
      };

      if (query.completed !== undefined) {
        if (query.completed) {
          where.completed_on = { not: null };
        } else {
          where.completed_on = null;
        }
      }

      // Cursor pagination
      // const where = {
      //   user_id: userId,
      //   project_id: query.project_id,
      //   // created_at: { [operator]: cursor },
      // };
      // const { limit, sortOrder, operator, cursor } =
      //   this.getPaginationQueryParams(query);

      // const tasks = await this.client.task.findMany({
      //   where,
      //   take: limit + 1,
      //   orderBy: {
      //     created_at: sortOrder,
      //   },
      // });

      // const { nextCursorTimestamp, prevCursorTimestamp } =
      //   this.getPaginationCursors(query, tasks, limit, sortOrder);

      // if (sortOrder === "desc") tasks.reverse();

      const [tasks, count] = await this.client.$transaction([
        this.client.task.findMany({
          where,
          take: query.limit || this.defaultLimit,
          skip: query.offset || this.defaultOffset,
          orderBy: query.orderBy,
        }),
        this.client.task.count({ where }),
      ]);

      return {
        tasks: tasks.map((task) => this.mapTask(task)),
        totalCount: count,
      };
    }

    async getTask(id: string, userId?: string): Promise<ITask> {
      const task = await this.client.task.findUnique({
        where: {
          id,
          user_id: userId,
        },
      });

      if (!task)
        throw new EntityNotFoundError({
          message: "No Task found",
          statusCode: 404,
          code: "ERR_NF",
        });

      return this.mapTask(task);
    }

    async createTask(payload: ITask, userId?: string): Promise<ITask> {
      const task = await this.client.task.create({
        data: {
          ...payload,
          user_id: userId as string,
        },
      });

      return this.mapTask(task);
    }

    async updateTask(
      id: string,
      payload: Partial<ITask>,
      userId?: string
    ): Promise<ITask> {
      const task = await this.client.task.update({
        where: {
          id,
          user_id: userId,
        },
        data: { ...payload },
      });

      return this.mapTask(task);
    }
  };
}
