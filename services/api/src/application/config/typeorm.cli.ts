import config from "./index";

export = (() => {
    const connectionConfig = process.env.NODE_ENV !== 'testing'
        ? config.database.connections.default
        : config.database.connections.testing;

    if (process.env.RUNNING_IN_CONTAINER !== 'true' && process.env.NODE_ENV === 'testing') {
        return {
            ...connectionConfig,
            host: 'localhost',
            port: 5433,
        }
    }
    if (process.env.RUNNING_IN_CONTAINER !== 'true' && process.env.NODE_ENV === 'development') {
        return {
            ...connectionConfig,
            host: 'localhost',
            port: 5432,
        }
    }
    return connectionConfig;
})();
