import express from "express";
import config from '../config';
import bodyParser from "body-parser";
import routes from '../api/index';
import Log from "./logger";
import Logger from "./logger";

export default async (application: express.Application) => {

    /**
     * Health Check endpoints
     */
    application.get(`${config.api.prefix}/status`, (req, res) => {
        res.write("OK");
        res.status(200).end();
    });
    application.head(`${config.api.prefix}/status`, (req, res) => {
        res.status(200).end();
    });

    // We are running behind reverse proxy
    application.enable('trust proxy');

    // Middleware that transforms the raw string of req.body into json
    application.use(bodyParser.json());

    // Load routes
    application.use(config.api.prefix, routes());

    Log.info('Express configured.');

    if (config.env !== 'testing') {
        application.listen(config.api.port, () => Logger.info(`Listening on port ${config.api.port}`))
    }

    return application;
};
