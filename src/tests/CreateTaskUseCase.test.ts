import config from "@/config";
import { repository } from "@/data/repositories";
import logger from "@/logger";
import { IMailer } from "@/services/mailer/interface";
import { CreateTaskUseCase } from "@/use-cases/CreateTaskUseCase";
import { Request } from "express";

jest.mock("@/data/repositories", () => ({
  repository: {
    createTask: jest.fn(),
  },
}));

jest.mock("@/logger", () => ({
  error: jest.fn(),
}));

describe("CreateTaskUseCase", () => {
  let req: Request;
  let mailer: IMailer;

  beforeEach(() => {
    req = {
      body: { name: "Test task" },
      auth:  { sub: "user123" } ,
    } as Request;

    mailer = {
      send: jest.fn().mockResolvedValue(undefined),
    };
  });

  test("should create a task and send an email", async () => {
    const taskData = { id: 1, name: "Test task" };
    // @ts-expect-error typescrit is in the way
    repository.createTask.mockResolvedValue(taskData);

    const useCase = new CreateTaskUseCase(req, mailer);
    const result = await useCase.execute();

    expect(repository.createTask).toHaveBeenCalledWith(req.body, "user123");
    expect(mailer.send).toHaveBeenCalledWith({
      to: config.adminEmail,
      subject: "New Task",
      text: "Task 'Test task' was created and is ready for your review",
    });
    expect(result).toEqual(taskData);
  });

  test("should log an error if email sending fails", async () => {
    const taskData = { id: 1, name: "Test task" };
    // @ts-expect-error
    repository.createTask.mockResolvedValue(taskData);

    // @ts-expect-error
    mailer.send.mockRejectedValue(new Error("Email sending failed"));

    const useCase = new CreateTaskUseCase(req, mailer);
    await useCase.execute();

    expect(logger.error).toHaveBeenCalledWith(
      new Error("Email sending failed"),
    );
  });
});
