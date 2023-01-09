import {IAccountRepository} from "../interfaces/IAccountRepository";
import AccountRepoService from "../RepositoryServices/accountRepo.service";
import Express from "express";
import BaseController from "./base.controller";

export default class AccountController extends BaseController {
    private readonly accountRepo: IAccountRepository

    constructor(app: Express.Application) {
        super(app);
        this.accountRepo = new AccountRepoService();
    }
}