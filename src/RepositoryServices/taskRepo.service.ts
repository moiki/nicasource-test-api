import {ITaskInput, ITaskRepository} from "../interfaces/ITaskRepository";
import {Task, TASK_STATUS} from "../entities/task.entity";
import {Repository} from "typeorm";
import {DataBaseConnection} from "../common/typeorm.common";
import {User} from "../entities/user.entity";
import ErrorREST, {Errors} from "../helpers/error.helper";


export default class TaskRepoService implements ITaskRepository {
    private readonly taskRepo: Repository<Task>;
    private readonly userRepo: Repository<User>;

    constructor() {
        this.taskRepo = DataBaseConnection.getRepository(Task);
        this.userRepo = DataBaseConnection.getRepository(User);
    }

    async createTask(task: ITaskInput, userId: string): Promise<any> {
        const user = await this.userRepo.findOne({where: {id: userId}});
        if (!user) throw Error("User not found!");
        const newTask = {...task, user}
        return await this.taskRepo.save(newTask);
    }

    async findTaskById(taskId: number, email: string): Promise<any> {

        const task = await this.taskRepo.findOne({
            where: {id: taskId, user: {email}},
            select: {
                description: true,
                status: true,
                title: true,
                id: true
            }
        });
        if (!task) throw new ErrorREST(Errors.NotFound, "Task not found!");
        return task;
    }

    async listTask(email: string): Promise<any[]> {
        return await this.taskRepo.find({
            where: {user: {email}},
            select: {
                description: true,
                status: true,
                title: true,
                id: true
            }
        });
    }

    async removeTask(taskId: number): Promise<boolean> {
        const taskFound = await this.taskRepo.findOne({where: {id: taskId}});
        if (!taskFound) throw new ErrorREST(Errors.Aborted, "This task is no longer available");
        const result = await this.taskRepo.delete(Number(taskFound?.id));
        return Number(result.affected) > 0;
    }

    async updateTask(task: ITaskInput): Promise<boolean> {
        const taskFound = await this.taskRepo.findOne({where: {id: task.id}});
        if (!taskFound) throw new ErrorREST(Errors.Aborted, "This task is no longer available");
        return !!(await this.taskRepo.update(taskFound, {...task}));
    }

    async updateStatus(taskId: number, status: TASK_STATUS): Promise<boolean> {
        if (!Object.values<string>(TASK_STATUS).some(st => st === status)) {
            throw new ErrorREST(Errors.Aborted, "The given status is not a valid status, please use 'Pending', 'Progress' or 'Done'.");
        }
        const taskFound = await this.taskRepo.findOne({where: {id: taskId}});
        if (!taskFound) throw new ErrorREST(Errors.Aborted, "This task is no longer available");
        const result = await this.taskRepo.update(taskId, {status});
        return !!result?.affected;
    }
}