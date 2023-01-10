import {Body, Controller, Delete, Get, Params, Post, Put, Request, Response} from "@decorators/express";
import {Response as Resp} from "express";
import {ITaskInput, ITaskRepository} from "../../interfaces/ITaskRepository";
import TaskRepoService from "../../RepositoryServices/taskRepo.service";
import AuthMiddleware, {CustomRequest} from "../../middlewares/auth.middleware";
import {TaskCreateInput, TaskUpdateInput} from "./input";
import {validate} from "class-validator";

@Controller("/task", [AuthMiddleware])
export default class TaskController {
    private readonly taskManager: ITaskRepository;
    constructor() {
        this.taskManager = new TaskRepoService()
    }

    @Post("/")
    async createTask(@Response() response: Resp, @Body() body: TaskCreateInput, @Request() request: CustomRequest ) {
        try {
            await this.taskManager.createTask(body, request.user.id);
            response.send({message: "Task created successfully!"});
        } catch (error) {
            response.status(500).send({error: error.message})
        }
    }

    @Put("/")
    async updateTask(@Response() response: Resp, @Body() body: TaskUpdateInput ) {
        try {
            await validate(body)
            const result = await this.taskManager.updateTask(body);
            if (!result) response.status(400).send({error: "The task couldn't be updated!"})
            response.send({message: "Task created successfully!"});
        } catch (error) {
            response.status(500).send({error: error.message})
        }
    }

    @Delete("/:id")
    async removeTask(@Response() response: Resp, @Params() id: number ) {
        try {
            const result = await this.taskManager.removeTask(id);
            if (!result) response.status(400).send({error: "The task couldn't be deleted!"})
            response.send({message: "Task was deleted successfully!"});
        } catch (error) {
            response.status(500).send({error: error.message})
        }
    }

    @Get("/")
    async listTask(@Response() response: Resp, @Request() request: CustomRequest ) {
        try {
            const result = await this.taskManager.listTask(request.user?.email);
            response.send({tasks: result});
        } catch (error) {
            response.status(500).send({error: error.message})
        }
    }

    @Get("/:id")
    async getOneTask(@Response() response: Resp, @Params() id: number ) {
        try {
            const result = await this.taskManager.findTaskById(id);
            response.send({task: result});
        } catch (error) {
            response.status(500).send({error: error.message})
        }
    }
}