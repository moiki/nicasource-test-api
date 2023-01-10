import {ITaskInput} from "../../interfaces/ITaskRepository";
import {IsNotEmpty} from "class-validator";
import {TASK_STATUS} from "../../entities/task.entity";

export class TaskCreateInput implements ITaskInput {
    @IsNotEmpty({message: "Please add a brief description of this task."})
    description: string;
    @IsNotEmpty({message: "Please add title"})
    title: string;
}

export class TaskUpdateInput implements ITaskInput {
    @IsNotEmpty({message: "The description is required"})
    description: string;
    id: number;
    status: TASK_STATUS;
    @IsNotEmpty({message: "The title is required"})
    title: string;
}