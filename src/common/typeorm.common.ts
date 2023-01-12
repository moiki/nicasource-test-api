import {DataSource} from "typeorm";
import configCommon from "../common/enviroment.common";
import entities from "../entities";
const dbConfig = configCommon.db_config;

export const DataBaseConnection = new DataSource({
    type: 'mysql',
    ...dbConfig,
    entities: ['src/**/*.entity.ts']
})