import {IAccountRepository, ILoginInput} from "../../interfaces/IAccountRepository";
import AccountRepoService from "../../RepositoryServices/accountRepo.service";
import {Response as Resp} from "express";
import {Body, Controller, Get, Post, Request, Response} from "@decorators/express";
import AuthMiddleware, {CustomRequest} from "../../middlewares/auth.middleware";
import {RegisterInput} from "./input";
import {validate} from "class-validator";

@Controller('/account')
export default class AccountController {
    private readonly accountRepo: IAccountRepository

    constructor() {
        this.accountRepo = new AccountRepoService();
    }

    @Post("/signup")
    async SignUp(@Response() response: Resp, @Body() body: RegisterInput) {
        try {
            await validate(body);
            const result = await this.accountRepo.register(body);
            if (!result) response.status(400).send({error: "The account couldn't be created!"})
        } catch (error) {
            response.status(500).send({error: error.message})
        }
    }

    @Post("/login")
    async Login(@Response() response: Resp, @Body() {email, password}: ILoginInput) {
        try {
            const result = await this.accountRepo.login(email, password);
            response.send(result);
        } catch (error) {
            response.status(401).send({error: error.message})
        }
    }

    @Get("/me", [AuthMiddleware])
    async GetSessionUser(@Response() response: Resp, @Request() request: CustomRequest) {
        try {
            const result = await this.accountRepo.getSessionUser(request.user?.email);
            response.send(result)
        } catch (error) {
            response.status(401).send({error: error.message})
        }
    }
}