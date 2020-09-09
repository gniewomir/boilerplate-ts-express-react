import {Connection, createConnection, getConnection} from "typeorm";

import config from "../config";
import {User} from "../entity/User";

const usingTestDatabase = config.env === 'testing' && config.database.name === 'testing' && config.database.user === 'testing';

const createPostgresConnection = async (): Promise<Connection> => {
    return await createConnection({
        type: "postgres",
        host: config.database.host,
        port: config.database.port,
        username: config.database.user,
        password: config.database.password,
        database: config.database.name,
        entities: [
            User
        ],
        synchronize: usingTestDatabase,
        dropSchema: usingTestDatabase,
        migrationsRun: usingTestDatabase,
        logging: false
    });
};

export default async (): Promise<Connection> => {
    try {
        return await createPostgresConnection();
    } catch (error) {

        if (error.name === 'AlreadyHasActiveConnectionError' && usingTestDatabase) {
            await getConnection().close();
            return await createPostgresConnection();
        }

        throw error;
    }
}
