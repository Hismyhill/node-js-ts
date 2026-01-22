import express, { Router } from "express";
import {
  listTasks,
  getTask,
  createTask,
  updateTask,
  markTaskAsCompleted,
} from "./controller";
import validateRequest from "../../../middleware/validate-request";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../../../data/request-schema";
import authenticateUser from "@/middleware/authenticate-user";

const tasks: Router = express.Router();

tasks.use(authenticateUser);
tasks.get("/", listTasks);
tasks.get("/:id", getTask);
tasks.post("/", validateRequest(createTaskSchema), createTask);
tasks.put("/:id", validateRequest(updateTaskSchema), updateTask);
tasks.patch("/:id/completed", markTaskAsCompleted);

export default tasks;
