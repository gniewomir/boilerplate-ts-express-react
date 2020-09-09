import {Connection, createConnection, EntityMetadata, getConnection} from "typeorm";

import config from "../config";
import {User} from "../entity/User";

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
        synchronize: config.env === 'testing' && config.database.name === 'testing' && config.database.user === 'testing',
        dropSchema: config.env === 'testing' && config.database.name === 'testing' && config.database.user === 'testing',
        migrationsRun: config.env === 'testing' && config.database.name === 'testing' && config.database.user === 'testing',
        logging: false
    });
};

export default async (): Promise<Connection> => {
    try {
        return await createPostgresConnection();
    } catch (error) {
        // FIXME: throw error if it is not "already have active connection" error

        if (config.env === 'testing') {
            await getConnection().close();
            return await createPostgresConnection();
        }

        return getConnection();
    }
}
