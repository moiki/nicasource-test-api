import * as dotenv from "dotenv";
dotenv.config();
const config = {
    node_env: process.env.NODE_ENV || "development",
    salt_rounds: Number(process.env.NODE_ENV||8),
    allowed_origins: JSON.parse(process.env.ALLOWED_ORIGINS || "[]") || [],
    base_url: process.env.BASE_URL || "http://localhost:5000",
    secret_key: process.env.SECRET_KEY || "MySecretKey",
    expiration_token: process.env.EXP_TOKEN || "1d",
    port: process.env.PORT || 5000,
    db_config: {
        database: process.env.DB_NAME || 'task_manager_db',
        port: Number(process.env.DB_PORT) || 3306,
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || 'local2020',
        host: process.env.DB_HOST || 'MYSQL_DB',
        synchronize: true,
        logging: false,
    },
    environment: process.env.NODE_ENV || "development",
};

export default config;