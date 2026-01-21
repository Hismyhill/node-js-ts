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

      return {
        projects: projects.map((project) => this.mapProject(project)),
        totalCount: count,
      };

      // const { cursor, limit, operator, sortOrder } =
      //   this.getPaginationQueryParams(query);
      // const where = {
      //   user_id: userId,
      //   created_at: { [operator]: cursor },
      // };

      // const projects = await this.client.project.findMany({
      //   where,
      //   take: limit + 1,
      //   orderBy: {
      //     created_at: sortOrder,
      //   },
      // });

      // const { nextCursorTimestamp, prevCursorTimestamp } =
      //   this.getPaginationCursors(query, projects, limit, sortOrder);

      // if (sortOrder === "desc") projects.reverse();

      // return {
      //   projects: projects.map((project) => this.mapProject(project)),
      //   nextCursor: nextCursorTimestamp,
      //   prevCursor: prevCursorTimestamp,
      // };
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

    // async getProjectTasks(
    //   query: IProjectQueryParams,
    //   id: string,
    //   userId?: string
    // ): Promise<ITask[]> {
    //   const where = {
    //     project_id: id,
    //     user_id: userId,
    //   };
    //   const [tasks, count] = await this.client.$transaction(
    //     this.client.task.findMany({
    //       where,
    //       take: query.limit || this.defaultLimit,
    //       skip: query.offset || this.defaultOffset,
    //     }),
    //     this.client.project.count({ where })
    //   );

    //   return { tasks: tasks.map((task) => mapTask(task)), totalCount: count };
    // }
  };
}
