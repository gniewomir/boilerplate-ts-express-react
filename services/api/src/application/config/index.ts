import dotenv from "dotenv";
import {HttpWhitelist} from "../type/whitelist";
import {User} from "../../database/entity/User";
import {Token} from "../../database/entity/Token";
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
                entities: [
                    User,
                    Token
                ],
                synchronize: false,
                dropSchema: false,
                migrationsRun: false,
                logging: false
            } as PostgresConnectionOptions,
            testing: {
                type: "postgres",
                host: process.env.TESTING_DB_HOST,
                port: parseInt(process.env.TESTING_DB_PORT, 10),
                username: process.env.TESTING_DB_USER,
                password: process.env.TESTING_DB_PASSWORD,
                database: process.env.TESTING_DB_NAME,
                entities: [
                    User,
                    Token
                ],
                synchronize: process.env.TESTING_DB_DROP_AFTER_CONNECTION === 'true',
                dropSchema: process.env.TESTING_DB_DROP_AFTER_CONNECTION === 'true',
                migrationsRun: process.env.TESTING_DB_DROP_AFTER_CONNECTION === 'true',
                logging: false
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
