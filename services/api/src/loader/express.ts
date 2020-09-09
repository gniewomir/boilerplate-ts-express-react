import express from "express";
import config from '../config';
import bodyParser from "body-parser";
import routes from '../api/index';

export default async (app: express.Application) => {

    /**
     * Health Check endpoints
     */
    app.get(`${config.api.prefix}/status`, (req, res) => {
        res.write("OK");
        res.status(200).end();
    });
    app.head(`${config.api.prefix}/status`, (req, res) => {
        res.status(200).end();
    });

    // Middleware that transforms the raw string of req.body into json
    app.use(bodyParser.json());

    // Load API routes
    app.use(config.api.prefix, routes());

    return app;
};
