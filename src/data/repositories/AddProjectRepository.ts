import { Prisma } from "@/generated/prisma/client";
import BaseRepository, { Constructor } from "./BaseRepository";
import {
  IProject,
  IProjectQueryParams,
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
    ): Promise<IProject[]> {
      const projects = await this.client.project.findMany({
        where: {
          user_id: userId,
        },

        take: query.limit || this.defaultLimit,
        skip: query.offset || this.defaultOffset,
      });

      if (!projects || projects.length === 0)
        throw new EntityNotFoundError({
          message: "No Project found",
          statusCode: 404,
          code: "ERR_NF",
        });

      return projects.map((project) => this.mapProject(project));
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
