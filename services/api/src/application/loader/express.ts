import express, {NextFunction, Request, Response} from "express";
import {config} from '../config';
import bodyParser from "body-parser";
import {routes} from '../../http/route';
import {Log} from "./logger";
import {NotFound} from "../error/NotFound";
import {ApiError} from "../error/ApiError";
import {errors} from "celebrate";
import cookieParser from "cookie-parser";

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

    // error handler
    application.use(errors()); // celebrate validation
    application.use((err: any, req: Request, res: Response, next: NextFunction) => {
        if (!(err instanceof ApiError)) {
            Log.error('Unrecognized error.', err);
            err = new ApiError('Unrecognized error.', 500, err);
        }
        if (err instanceof ApiError) {
            return res
                .status(err.getHttpStatusCode())
                .send(err.getAsLiteral())
                .end();
        }
        return next(err);
    });

    Log.info('Express configured.');

    if (config.env !== 'testing') {
        application.listen(config.api.port, () => Log.info(`Listening on port ${config.api.port}`))
    }

    return application;
};
