export interface ITask {
  id: string;
  user_id: string;
  project_id: string | null;
  name: string;
  description: string | null;
  due_date: Date | null;
  completed_on: Date | null;
  created_at: Date;
}

export interface IProject {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: Date;
}

interface IQueryParams {
  limit?: number;
  offset?: number;
}

// Cursor Pagination
// interface IQueryParams {
//   limit?: number;
//   nextCursor?: string;
//   prevCursor?: string;
// }

export interface ITaskQueryParams extends IQueryParams {
  project_id?: string;
  search?: string;
  completed?: boolean;
  orderBy?: { [key in "created_at" | "due_date"]?: "asc" | "desc" };
}

export interface ITaskQueryResult {
  tasks: ITask[];
  totalCount: number;
}

// Cursor Pagination
// export interface ITaskQueryResult {
//   tasks: ITask[];
//   nextCursor: Date | null;
//   prevCursor: Date | null;
// }

export interface IProjectQueryResult {
  projects: IProject[];
  totalCount: number;
}

//   Cursor pagination
// export interface IProjectQueryResult {
//   projects: IProject[];
//   nextCursor: Date | null;
//   prevCursor: Date | null;
// }

export interface IProjectQueryParams extends IQueryParams {}

export interface ITaskRepository {
  listTasks(
    query: ITaskQueryParams,
    userId?: string
  ): Promise<ITaskQueryResult>;
  getTask(id: string, userId?: string): Promise<ITask>;
  createTask(payload: Partial<ITask>, userId?: string): Promise<ITask>;
  updateTask(
    id: string,
    payload: Partial<ITask>,
    userId?: string
  ): Promise<ITask>;
}

export interface IProjectRepository {
  listProjects(
    query: IProjectQueryParams,
    userId?: string
  ): Promise<IProjectQueryResult>;
  getProject(id: string, userId?: string): Promise<IProject>;
}
