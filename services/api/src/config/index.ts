import dotenv from "dotenv";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

dotenv.config();

export default {
    env: process.env.NODE_ENV,
    api: {
        port: parseInt(process.env.API_PORT, 10),
        prefix: '/api'
    },
    database: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    },
    logging: {
        level: 'silly'
    }
};
