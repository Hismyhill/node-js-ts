import { Exclude, Expose, instanceToPlain } from "class-transformer";
import { ITask } from "../repositories/repository";

export class Task implements ITask {
  id: string;
  user_id: string;
  project_id: string | null;
  name: string;
  description: string | null;
  due_date: Date | null;
  completed_on: Date | null;
  @Exclude({ toPlainOnly: true })
  created_at: Date;

  constructor(
    id: string,
    user_id: string,
    project_id: string | null,
    name: string,
    description: string | null,
    due_date: Date | null,
    completed_on: Date | null,
    created_at: Date,
  ) {
    this.id = id;
    this.user_id = user_id;
    this.project_id = project_id;
    this.name = name;
    this.description = description;
    this.due_date = due_date;
    this.created_at = created_at;
    this.completed_on = completed_on;
  }

  markAsCompleted(): void {
    if (this.completed_on) throw new Error("Task is already completed");

    this.completed_on = new Date();
  }

  setPriorityLevel(): "high" | "medium" | "low" | null {
    if (!this.due_date) return null;

    const today = new Date();
    const oneDayFromNow = new Date();
    const threeDaysFromNow = new Date();
    oneDayFromNow.setDate(today.getDate() + 1);
    threeDaysFromNow.setDate(today.getDate() + 3);

    if (this.due_date <= oneDayFromNow) return "high";
    if (this.due_date <= threeDaysFromNow) return "medium";
    if (this.due_date > threeDaysFromNow) return "low";
    else return null;
  }

  @Expose({ name: "priority_level" })
  get priorityLevel() {
    return this.setPriorityLevel();
  }

  asDto(): TaskDto {
    return instanceToPlain(this) as TaskDto;
  }
}
