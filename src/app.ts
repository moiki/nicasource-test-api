import express, {Application as ExApplication} from 'express';
import path from "path";
import configCommon from "./common/enviroment.common";
import cors from "cors";
import {DataBaseConnection} from "./common/typeorm.common";

class Application {
    private readonly app: ExApplication;
    // get instanceApp(): ExApplication {
    //     return this.app;
    // }
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
        }
    }

    private startDatabaseInstance() {
        DataBaseConnection.initialize()
            .then(_ => console.log("********* DATABASE CONNECTED **********"))
            .catch(err => console.log("[TYPEORM INIT ERROR] ", err))
    }

    private registerRouters() {
        this.app.get("/", (_, res) => {
            res.sendFile(path.join(__dirname, '/templates/hello.html'));
        });
        // TODO: register routers
    }

    public start() {
        return this.app.listen(configCommon.port, () =>
            console.log(`Server is flying on http://localhost:${configCommon.port} !!!`))
    }
}

export default new Application();