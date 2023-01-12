import "reflect-metadata";
import express, {Application as ExApplication} from 'express';
import configCommon from "./common/enviroment.common";
import cors from "cors";
import {DataBaseConnection} from "./common/typeorm.common";
import {attachControllers} from "@decorators/express";
import seedHelper from "./helpers/seed.helper";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "./swagger.json";
import controllers from "./controllers";
class Application {
    private readonly app: ExApplication;

    constructor() {
        this.app = express();
        this.startMiddlewares();
        this.startDatabaseInstance()
        this.registerRouters();
    }

    private startMiddlewares() {
        this.app.use(express.json());
        if (configCommon.environment === 'production') {
            this.app.use(cors({origin: configCommon.allowed_origins}));
        } else {
            this.app.use(cors({origin: "*"}));
            this.app.use(morgan("tiny"));
        }
        this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    private startDatabaseInstance() {
        DataBaseConnection.initialize()
            .then(_ => {
                console.log("********* DATABASE CONNECTED **********");
                seedHelper.SeedUser()
                    .then(_ => console.log("Seed Process finished"))
                    .catch(_ => console.log("Error seeding!"))
            })
            .catch(err => console.log("[TYPEORM INIT ERROR] ", err))
    }

    private registerRouters() {
        this.app.get("/", (_, res) => {
            // res.sendFile(path.join(__dirname, '/templates/hello.html'));
            res.redirect("/api-docs");
        });
        // TODO: register routers
        attachControllers(this.app, controllers);
    }

    public start() {
        return this.app.listen(configCommon.port, () =>
            console.log(`Server is flying on http://localhost:${configCommon.port} !!!`))
    }
}

export default new Application();