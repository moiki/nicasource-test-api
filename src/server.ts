import express from "express";
import cors from "cors";
import 'dotenv/config'
import configCommon from "./common/enviroment.common";
import {DataBaseConnection} from "./common/typeorm.common";
import path from "path";
// import productsRoutes from "./routes/products.routes";
// import routes from "./routes";

DataBaseConnection(["src/entities/*.entity.ts"]).initialize()
    .then((db)=> {
        const app = express();
        console.log(`Database connected`);
        if (configCommon.environment === 'production') {
            app.use(cors({origin: ["http://localhost:3000", "http://localhost:8080", "http://localhost:4200"]}));

        } else {
            app.use(cors({origin: "*"}));
        }
        app.use(express.json());

        // routes(app, db);
        app.get("/", (_, res) => {
            res.sendFile(path.join(__dirname, '/templates/hello.html'));
        });

        app.listen(configCommon.port, () => console.log(`Server is flying on http://localhost:${configCommon.port} !!!`))
    })
    .catch((error) => console.log(error))