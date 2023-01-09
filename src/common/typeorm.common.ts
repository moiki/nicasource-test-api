import {DataSource} from "typeorm";
import configCommon from "../common/enviroment.common";
const dbConfig = configCommon.db_config;

export const DataBaseConnection = new DataSource({
    type: 'mysql',
    ...dbConfig,
    entities: ["src/entities/*.entity.ts"],
    subscribers: [],
    migrations: [],
})