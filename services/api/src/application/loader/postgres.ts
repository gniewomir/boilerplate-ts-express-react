import {Connection, createConnection, getConnection, useContainer} from "typeorm";

import config from "../config";
import {Container} from "typedi";
import Log from "./logger";
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";

export default async (): Promise<Connection> => {
    try {
        useContainer(Container);
        const configuration = config.env !== 'testing'
            ? config.database.connections.default
            : config.database.connections.testing;
        const connection = await createConnection(configuration as PostgresConnectionOptions);
        Log.info('Database connection established.');
        return connection;
    } catch (error) {

        if (error.name && error.name === 'AlreadyHasActiveConnectionError') {
            return getConnection();
        }

        throw error;
    }
}
