import express from "express";
import { createConnection } from "typeorm";

import config from "../config";

export default async (app: express.Application) =>
    createConnection({
        type: "postgres",
        host: config.database.host,
        port: config.database.port,
        username: config.database.user,
        password: config.database.password,
        database: config.database.name,
        entities: [],
        synchronize: true,
        logging: false
    });
