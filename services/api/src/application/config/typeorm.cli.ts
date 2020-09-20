import {config} from "./index";

export = process.env.NODE_ENV === 'testing' ? config.database.connections.testing : config.database.connections.default;

