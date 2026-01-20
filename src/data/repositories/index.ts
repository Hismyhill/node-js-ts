import { AddProjectRepository } from "./AddProjectRepository";
import { AddTaskRespository } from "./AddTaskRepository";
import BaseRepository from "./BaseRepository";

export const repository = new (AddProjectRepository(
  AddTaskRespository(BaseRepository)
))();
