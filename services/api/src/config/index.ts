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
    authentication: {
        jwt: {
            secret: process.env.JWT_SECRET,
            token_expiration_in_minutes: 5
        },
        clients: [
            {
                name: process.env.WEB_CLIENT_NAME,
                secret: process.env.WEB_CLIENT_SECRET
            }
        ]
    },
    testing: {
        database: {
            drop: process.env.NODE_ENV === 'testing' && process.env.TESTING_DB_DROP_AFTER_CONNECTION === 'true'
        }
    }
};
