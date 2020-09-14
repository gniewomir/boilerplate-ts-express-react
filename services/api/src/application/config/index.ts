import dotenv from "dotenv";
import {HttpWhitelist} from "../type/whitelist";
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";

dotenv.config();

const apiPrefix = '/api';

export default {
    env: process.env.NODE_ENV,
    time: {
        timezone: process.env.TZ
    },
    logging: {
        level: ((env: string): string => {
            // Available levels
            // https://github.com/winstonjs/winston#logging
            if (env === 'development') {
                return 'silly';
            }
            if (env === 'production') {
                return 'error';
            }
            return 'warn';
        })(process.env.NODE_ENV)
    },
    database: {
        connections: {
            default: {
                type: "postgres",
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT, 10),
                username: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                synchronize: false,
                dropSchema: false,
                migrationsRun: false,
                logging: false,
                entities: [
                    process.env.NODE_ENV === 'development' ? "src/database/entity/**/*.ts" : "dist/database/entity/**/*.js",
                ],
                migrations: [
                    process.env.NODE_ENV === 'development' ? "src/database/migration/**/*.ts" : "dist/database/migration/**/*.js",
                ],
                subscribers: [
                    process.env.NODE_ENV === 'development' ? "src/subscriber/**/*.ts" : "dist/subscriber/**/*.js"
                ],
                cli: {
                    "entitiesDir": "src/database/entity",
                    "migrationsDir": "src/database/migration",
                    "subscribersDir": "src/subscriber"
                }
            } as PostgresConnectionOptions,
            testing: {
                type: "postgres",
                host: process.env.RUNNING_IN_CONTAINER === 'true' ? process.env.TESTING_DB_HOST : 'localhost',
                port: process.env.RUNNING_IN_CONTAINER === 'true' ? parseInt(process.env.TESTING_DB_PORT, 10) : 5433,
                username: process.env.TESTING_DB_USER,
                password: process.env.TESTING_DB_PASSWORD,
                database: process.env.TESTING_DB_NAME,
                synchronize: false,
                dropSchema: true,
                migrationsRun: true,
                logging: false,
                entities: [
                    process.env.NODE_ENV === 'development' ? "src/database/entity/**/*.ts" : "dist/database/entity/**/*.js",
                ],
                migrations: [
                    process.env.NODE_ENV === 'development' ? "src/database/migration/**/*.ts" : "dist/database/migration/**/*.js",
                ],
                subscribers: [
                    process.env.NODE_ENV === 'development' ? "src/subscriber/**/*.ts" : "dist/subscriber/**/*.js"
                ],
                cli: {
                    "entitiesDir": "src/database/entity",
                    "migrationsDir": "src/database/migration",
                    "subscribersDir": "src/subscriber"
                }
            } as PostgresConnectionOptions
        }
    },
    security: {
        authentication: {
            jwt: {
                secret: process.env.JWT_SECRET,
                token_expiration_in_minutes: 5
            },
            whitelist: [
                {
                    method: "POST",
                    route: `${apiPrefix}/token`
                },
                {
                    method: "POST",
                    route: `${apiPrefix}/user`
                }
            ] as HttpWhitelist
        }
    },
    api: {
        scheme: process.env.NODE_ENV === 'development' ? 'http' : 'https',
        port: parseInt(process.env.API_PORT, 10),
        prefix: apiPrefix,
        domain: process.env.API_DOMAIN,
        public_port: parseInt(process.env.PUBLIC_API_PORT, 10),
        public_domain: process.env.PUBLIC_API_DOMAIN,
    },
};
