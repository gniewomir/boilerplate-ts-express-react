import dotenv from "dotenv";
import {HttpWhitelist} from "../type/whitelist";

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
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
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
                    route: '/api/token'
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

    // DEV and TESTING stuff

    testing: {
        database: {
            drop: process.env.NODE_ENV === 'testing' && process.env.TESTING_DB_DROP_AFTER_CONNECTION === 'true'
        }
    }
};
