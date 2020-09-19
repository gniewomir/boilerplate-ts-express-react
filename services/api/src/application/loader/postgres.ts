import {Connection, createConnection, getConnection, useContainer} from "typeorm";

import {config} from "../config";
import {Container} from "typedi";
import {Log} from "./logger";
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";

const attempt = async (): Promise<Connection> => {
    try {
        useContainer(Container);
        const configuration = config.env === 'testing'
            ? config.database.connections.testing
            : config.database.connections.default;
        const connection = await createConnection(configuration as PostgresConnectionOptions);
        Log.info('Database connection: established.');
        return connection;
    } catch (error) {

        if (error.name && error.name === 'AlreadyHasActiveConnectionError') {
            Log.info('Database connection: already established.');
            return getConnection();
        }

        throw error;

    }
}

const sleep = (ms: number) => {
    Log.warn(`Database connection: Next attempt in ${ms}ms.`);
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const establishDatabaseConnection = async (): Promise<Connection> => {
    while (true) {
        try {
            Log.info('Database connection: attempting.');
            return await attempt();
        } catch (error) {
            Log.error('Database connection error', error);
            await sleep(5000)
        }
    }
}
