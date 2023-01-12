import {IAccountRepository} from "../../interfaces/IAccountRepository";
import AccountRepoService from "../../RepositoryServices/accountRepo.service";
import {Response as Resp} from "express";
import {Body, Controller, Get, Post, Request, Response} from "@decorators/express";
import AuthMiddleware, {CustomRequest} from "../../middlewares/auth.middleware";
import {LoginInput, RegisterInput} from "./input";
import ErrorREST, {Errors} from "../../helpers/error.helper";
import validateHelper from "../../helpers/validate.helper";

@Controller('/account')
export default class AccountController {
    private readonly accountRepo: IAccountRepository

    constructor() {
        this.accountRepo = new AccountRepoService();
    }

    @Post("/signup")
    async SignUp(@Response() response: Resp, @Body() body: RegisterInput) {
        try {
            const newUser = new RegisterInput();
            newUser.email = body.email;
            newUser.password = body.password;
            newUser.firstName = body.firstName;
            newUser.lastName = body.lastName;
            newUser.confirmPassword = body.confirmPassword;

            await validateHelper(newUser);
            const result = await this.accountRepo.signup(body);
            if (!result) throw new ErrorREST(Errors.BadRequest, "The account couldn't be created!")
            response.send({message: "Account created successfully!"})
        } catch (error) {
            const {error: restError} = error;
            response.status(restError?.status || 500).json(restError || error.message || 'Server Error!');
        }
    }

    @Post("/login")
    async Login(@Response() response: Resp, @Body() {email, password}: any) {
        try {
            let credentials = new LoginInput();
            credentials.email = email;
            credentials.password = password;
            await validateHelper(credentials);
            const result = await this.accountRepo.login(email, password);
            response.send(result);
        } catch (error) {
            const {error: restError} = error;
            response.status(restError?.status || 500).json(restError || error.message || 'Server Error!');
        }
    }

    @Get("/me", [AuthMiddleware])
    async GetSessionUser(@Response() response: Resp, @Request() request: CustomRequest) {
        try {
            const result = await this.accountRepo.getSessionUser(request.user?.email);
            response.send(result)
        } catch (error) {
            const {error: restError} = error;
            response.status(restError?.status || 500).json(restError || error.message || 'Server Error!');
        }
    }

    @Get("/logout", [AuthMiddleware])
    async Logout(@Response() response: Resp, @Request() request: CustomRequest) {
        try {
            const {session, email} = request.user;
            const result = await this.accountRepo.logout(email, session);
            if (!result) throw new ErrorREST(Errors.ServerError, "Logout failed!");
            response.send({message: "Logged Out!"})
        } catch (error) {
            const {error: restError} = error;
            response.status(restError?.status || 500).json(restError || error.message || 'Server Error!');
        }
    }
}