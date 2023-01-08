import {DataSource} from "typeorm";
import configCommon from "../common/enviroment.common";
const dbConfig = configCommon.db_config;

export const DataBaseConnection = (Entities: any[]) => new DataSource({
    type: 'mysql',
    ...dbConfig,
    entities: Entities,
    subscribers: [],
    migrations: [],
})