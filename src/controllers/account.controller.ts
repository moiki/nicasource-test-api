import {IAccountRepository, ILoginInput} from "../interfaces/IAccountRepository";
import AccountRepoService from "../RepositoryServices/accountRepo.service";
import {Response as Resp, Request as Req} from "express";
import {Body, Controller, Get, Post, Request, Response} from "@decorators/express";
import AuthMiddleware, {CustomRequest} from "../middlewares/auth.middleware";

@Controller('/account')
export default class AccountController {
    private readonly accountRepo: IAccountRepository

    constructor() {
        this.accountRepo = new AccountRepoService();
    }

    @Post("/login")
    async Login(@Response() response: Resp, @Body() {email, password}: ILoginInput) {
        try {
            const {result, error} = await this.accountRepo.login(email, password);
            if (error) response.status(400).send(error)
            response.send(result)
        } catch (error) {
            console.log(error.message)
        }
    }

    @Get("/login", [AuthMiddleware])
    async GetSessionUser(@Response() response: Resp, @Request() request: CustomRequest) {
        try {
            const result = await this.accountRepo.getSessionUser(request.user?.email);
            response.send(result)
        } catch (error) {
            response.status(401).send({error: error.message})
        }
    }
}