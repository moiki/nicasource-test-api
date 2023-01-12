import {Body, Controller, Delete, Get, Params, Post, Put, Request, Response} from "@decorators/express";
import {Response as Resp} from "express";
import {ITaskInput, ITaskRepository} from "../../interfaces/ITaskRepository";
import TaskRepoService from "../../RepositoryServices/taskRepo.service";
import AuthMiddleware, {CustomRequest} from "../../middlewares/auth.middleware";
import {TaskCreateInput, TaskUpdateInput} from "./input";
import {validate} from "class-validator";
import validateHelper from "../../helpers/validate.helper";
import {TASK_STATUS} from "../../entities/task.entity";
import ErrorREST, {Errors} from "../../helpers/error.helper";

@Controller("/task", [AuthMiddleware])
export default class TaskController {
    private readonly taskManager: ITaskRepository;
    constructor() {
        this.taskManager = new TaskRepoService()
    }

    @Post("/create")
    async CreateTask(@Response() response: Resp, @Body() body: TaskCreateInput, @Request() request: CustomRequest ) {
        try {
            const newTask = new TaskCreateInput();
            newTask.title = body.title;
            newTask.description = body.description;
            await validateHelper(newTask);
            await this.taskManager.createTask(body, request.user.id);
            response.send({message: "Task created successfully!"});
        }  catch (error) {
            const {error: restError} = error;
            response.status(restError?.status || 500).json(restError || error.message || 'Server Error!');
        }
    }

    @Put("/update")
    async UpdateTask(@Response() response: Resp, @Body() body: TaskUpdateInput ) {
        try {
            const _updateTask = new TaskUpdateInput();
            _updateTask.title = body.title;
            _updateTask.description = body.description;
            _updateTask.status = body.status;
            _updateTask.id = body.id;
            await validateHelper(_updateTask);
            const result = await this.taskManager.updateTask(_updateTask);
            if (!result) response.status(400).send({error: "The task couldn't be updated!"})
            response.send({message: "Task updated successfully!"});
        }  catch (error) {
            const {error: restError} = error;
            response.status(restError?.status || 500).json(restError || error.message || 'Server Error!');
        }
    }

    @Delete("/remove/:id")
    async RemoveTask(@Response() response: Resp, @Params() id: number ) {
        try {
            const result = await this.taskManager.removeTask(id);
            if (!result) throw new ErrorREST(Errors.Aborted, "The task couldn't be deleted!")
            response.send({message: "Task was deleted successfully!"});
        }  catch (error) {
            const {error: restError} = error;
            response.status(restError?.status || 500).json(restError || error.message || 'Server Error!');
        }
    }

    @Get("/list")
    async ListTask(@Response() response: Resp, @Request() request: CustomRequest ) {
        try {
            const result = await this.taskManager.listTask(request.user?.email);
            response.send({tasks: result});
        }  catch (error) {
            const {error: restError} = error;
            response.status(restError?.status || 500).json(restError || error.message || 'Server Error!');
        }
    }

    @Get("/:id")
    async GetOneTask(@Response() response: Resp, @Params("id") id: number, @Request() request: CustomRequest ) {
        try {
            const result = await this.taskManager.findTaskById(id, request.user?.email);
            response.send({...result});
        }  catch (error) {
            const {error: restError} = error;
            response.status(restError?.status || 500).json(restError || error.message || 'Server Error!');
        }
    }

    @Put("/set-status")
    async UpdateStatus(@Response() response: Resp, @Body() body: any) {
        try {
            const {id, status} = body;
            const result = await this.taskManager.updateStatus(id, status);
            if (!result) throw new ErrorREST(Errors.Aborted, "The status couldn't be updated!")
            response.send({message: "Status updated successfully!"});
        }  catch (error) {
            const {error: restError} = error;
            response.status(restError?.status || 500).json(restError || error.message || 'Server Error!');
        }
    }
}