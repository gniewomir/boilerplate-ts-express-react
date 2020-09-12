import {Connection, createConnection, getConnection, useContainer} from "typeorm";

import config from "../config";
import {User} from "../entity/User";
import {Container} from "typedi";
import {Token} from "../entity/Token";

const createPostgresConnection = async (): Promise<Connection> => {
    useContainer(Container);
    return await createConnection({
        type: "postgres",
        host: config.database.host,
        port: config.database.port,
        username: config.database.user,
        password: config.database.password,
        database: config.database.name,
        entities: [
            User,
            Token
        ],
        synchronize: config.env === 'testing' && config.testing.database.drop,
        dropSchema: config.env === 'testing' && config.testing.database.drop,
        migrationsRun: config.env === 'testing' && config.testing.database.drop,
        logging: false
    });
};

export default async (): Promise<Connection> => {
    try {
        return await createPostgresConnection();
    } catch (error) {

        if (error.name === 'AlreadyHasActiveConnectionError') {
            return getConnection();
        }

        throw error;
    }
}
