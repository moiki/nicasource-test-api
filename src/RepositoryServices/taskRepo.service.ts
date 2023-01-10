import {ITaskInput, ITaskRepository} from "../interfaces/ITaskRepository";
import {Task} from "../entities/task.entity";
import {Repository} from "typeorm";
import {DataBaseConnection} from "../common/typeorm.common";
import {User} from "../entities/user.entity";


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

    async findTaskById(taskId: number): Promise<any> {
        return await this.taskRepo.findOne({
            where: {id: taskId},
            select: {
                description: true,
                status: true,
                title: true,
                id: true
            }
        });
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
        if (!taskFound) throw Error("This task is no longer available");
        const result = await this.taskRepo.delete(Number(taskFound?.id));
        return Number(result.affected) > 0;
    }

    async updateTask(task: ITaskInput): Promise<boolean> {
        const taskFound = await this.taskRepo.findOne({where: {id: task.id}});
        if (!taskFound) throw Error("This task is no longer available");
        return !!(await this.taskRepo.update(taskFound, {...task}));
    }

}