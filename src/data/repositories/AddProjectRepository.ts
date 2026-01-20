import { Prisma } from "@/generated/prisma/client";
import BaseRepository, { Constructor } from "./BaseRepository";
import {
  IProject,
  IProjectQueryParams,
  IProjectQueryResult,
  IProjectRepository,
  ITask,
} from "./repository";
import EntityNotFoundError from "@/errors/EntityNotFoundError";

type PrismaProject = Prisma.ProjectGetPayload<{}>;

export function AddProjectRepository<TBase extends Constructor<BaseRepository>>(
  Base: TBase
) {
  return class ProjectRepositoryMixins
    extends Base
    implements IProjectRepository
  {
    mapProject(project: PrismaProject) {
      return {
        id: project.id,
        user_id: project.user_id,
        name: project.name,
        description: project.description,
        created_at: project.created_at,
      };
    }

    async listProjects(
      query: IProjectQueryParams,
      userId?: string
    ): Promise<IProjectQueryResult> {
      const where = {
        user_id: userId,
      };

      const [projects, count] = await this.client.$transaction([
        this.client.project.findMany({
          where,
          take: query.limit || this.defaultLimit,
          skip: query.offset || this.defaultOffset,
        }),
        this.client.project.count({ where }),
      ]);

      if (!projects || projects.length === 0)
        throw new EntityNotFoundError({
          message: "No Project found",
          statusCode: 404,
          code: "ERR_NF",
        });

      return {
        projects: projects.map((project) => this.mapProject(project)),
        totalCount: count,
      };
    }

    async getProject(id: string, userId?: string): Promise<IProject> {
      const project = await this.client.project.findUnique({
        where: {
          id,
          user_id: userId,
        },
      });

      if (!project)
        throw new EntityNotFoundError({
          message: "No Project found",
          statusCode: 404,
          code: "ERR_NF",
        });

      return this.mapProject(project);
    }

    async getProjectTasks(
      query: IProjectQueryParams,
      id: string,
      userId?: string
    ): Promise<ITask[]> {
      const tasks = await this.client.task.findMany({
        where: {
          id,
          user_id: userId,
        },

        take: query.limit || this.defaultLimit,
        skip: query.offset || this.defaultOffset,
      });

      if (!tasks || tasks.length === 0)
        throw new EntityNotFoundError({
          message: "No Task found",
          statusCode: 404,
          code: "ERR_NF",
        });

      return tasks;
    }
  };
}
