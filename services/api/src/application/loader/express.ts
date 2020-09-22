import express, {NextFunction, Request, Response} from "express";
import {config} from '../config';
import bodyParser from "body-parser";
import {routes} from '../../http/route';
import {Log} from "./logger";
import {NotFound} from "../error/NotFound";
import {errors as celebrateErrorsMiddleware} from "celebrate";
import cookieParser from "cookie-parser";
import {apiErrorsMiddleware} from "../error";

export const configureExpress = (application: express.Application) => {

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

    // We are always running behind reverse proxy
    application.enable('trust proxy');

    application.use(bodyParser.json());
    application.use(cookieParser(config.security.cookies.secrets));

    // Load routes
    application.use(config.api.prefix, routes());

    // catch 404 and forward to error handler
    application.use((req: Request, res: Response, next: NextFunction) => {
        next(new NotFound(`Route or resource not found.`));
    });

    // error handlers
    application.use(celebrateErrorsMiddleware());
    application.use(apiErrorsMiddleware());

    Log.info('Express configured.');

    if (config.env !== 'testing') {
        application.listen(config.api.port, () => Log.info(`Listening on port ${config.api.port}`))
    }

    return application;
};
