import {config} from "./index";

export = (() => {

    if (process.env.RUNNING_IN_CONTAINER !== 'true' && process.env.NODE_ENV === 'testing') {
        return {
            ...config.database.connections.testing,
            host: 'localhost',
            port: 5433,
        }
    }

    if (process.env.RUNNING_IN_CONTAINER !== 'true' && process.env.NODE_ENV === 'development') {
        return {
            ...config.database.connections.default,
            host: 'localhost',
            port: 5432,
        }
    }

    return process.env.NODE_ENV === 'testing' ? config.database.connections.testing : config.database.connections.default;

})();
