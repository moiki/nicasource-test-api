import Express, {Router} from "express";

export default class BaseController {
    router: Router
    constructor(app: Express.Application) {
        this.router = Express.Router();
        app.use("/account", this.router);
    }
}