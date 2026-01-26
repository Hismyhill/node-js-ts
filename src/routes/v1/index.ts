import express, { Router } from "express";
import tasks from "./tasks";
import projects from "./projects";
import auth from "./auth";

const v1: Router = express.Router();

v1.use("/tasks", tasks);
v1.use("/projects", projects);
v1.use("/auth", auth);

export default v1;
