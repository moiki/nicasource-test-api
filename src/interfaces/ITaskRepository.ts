import {TASK_STATUS} from "../entities/task.entity";

export  interface ITaskInput {
    id?: number;
    title: string;
    description: string;
    status?: TASK_STATUS;
}

export interface ITaskRepository {
    createTask(task: ITaskInput, userId: string): Promise<any>;
    updateTask(task: ITaskInput): Promise<boolean>;
    removeTask(taskId: number): Promise<boolean>;
    findTaskById(taskId: number): Promise<any>;
    listTask(email: string): Promise<any[]>;
}