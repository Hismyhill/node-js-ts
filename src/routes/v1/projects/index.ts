import express, { Router } from "express";
import { listProjects, getProject, listPorjectTasks } from "./controller";

const projects: Router = express.Router();

projects.get("/", listProjects);
projects.get("/:id", getProject);
projects.get("/:id/tasks", listPorjectTasks);

export default projects;
