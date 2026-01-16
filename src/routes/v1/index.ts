import express, { Router } from "express";
import tasks from "./tasks";
import projects from "./projects";
import authenticateUser from "../../middleware/authenticate-user";

const v1: Router = express.Router();

v1.use("/tasks", authenticateUser, tasks);
v1.use("/projects", projects);

export default v1;
