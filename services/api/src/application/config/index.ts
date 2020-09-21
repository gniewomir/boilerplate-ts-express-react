import dotenv from "dotenv";
import {HttpRouteList} from "../type/http";
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";
import {CookieOptions} from "express-serve-static-core";

dotenv.config();

const apiPrefix = '/api';
const useTypeScript = process.env.RUNNING_IN_CONTAINER !== 'true' || process.env.NODE_ENV === 'development'

export const config = {
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
                host: process.env.RUNNING_IN_CONTAINER === 'true' ? process.env.DB_HOST : 'localhost',
                port: parseInt(process.env.DB_PORT, 10),
                username: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                synchronize: false,
                dropSchema: false,
                migrationsRun: false,
                logging: false,
                entities: [
                    useTypeScript ? "src/database/entity/**/*.ts" : "dist/database/entity/**/*.js",
                ],
                migrations: [
                    useTypeScript ? "src/database/migration/**/*.ts" : "dist/database/migration/**/*.js",
                ],
                subscribers: [
                    useTypeScript ? "src/subscriber/**/*.ts" : "dist/subscriber/**/*.js"
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
                port: process.env.RUNNING_IN_CONTAINER === 'true' ? parseInt(process.env.TESTING_DB_PORT, 10) : 5442,
                username: process.env.TESTING_DB_USER,
                password: process.env.TESTING_DB_PASSWORD,
                database: process.env.TESTING_DB_NAME,
                synchronize: false,
                dropSchema: false,
                migrationsRun: false,
                logging: false,
                entities: [
                    useTypeScript ? "src/database/entity/**/*.ts" : "dist/database/entity/**/*.js",
                ],
                migrations: [
                    useTypeScript ? "src/database/migration/**/*.ts" : "dist/database/migration/**/*.js",
                ],
                subscribers: [
                    useTypeScript ? "src/subscriber/**/*.ts" : "dist/subscriber/**/*.js"
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
            passwords: {
                min_length: 12
            },
            jwt: {
                secret: process.env.JWT_SECRET,
                token_expiration_in_minutes: 1,
                refresh_token_expiration_in_minutes: 60
            },
            whitelist: [
                {
                    method: "POST",
                    route: `${apiPrefix}/token`
                },
                {
                    method: "DELETE",
                    route: `${apiPrefix}/token`
                },
                {
                    method: "POST",
                    route: `${apiPrefix}/token/refresh`
                },
                {
                    method: "POST",
                    route: `${apiPrefix}/user`
                }
            ] as HttpRouteList
        },
        cookies: {
            refresh_token_cookie_name: 'refresh_token',
            default: {
                signed: true,
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                domain: process.env.PUBLIC_API_DOMAIN,
            } as CookieOptions,
            secrets: [
                process.env.COOKIES_SECRET
            ]
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
