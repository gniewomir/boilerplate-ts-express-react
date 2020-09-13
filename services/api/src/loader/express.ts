import express, {NextFunction, Request, Response} from "express";
import config from '../config';
import bodyParser from "body-parser";
import routes from '../api/index';
import Log from "./logger";
import Logger from "./logger";
import cors from "cors";
import NotFound from "../error/NotFound";
import ApiError from "../error/ApiError";

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

    // We are always running behind reverse proxy
    application.enable('trust proxy');

    // Configure cors
    application.use(cors({
        origin: `${config.api.scheme}://${config.api.domain}${config.env === 'development' ? ':8000' : ''}`,
        optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    }));

    // Middleware that transforms the raw string of req.body into json
    application.use(bodyParser.json());

    // Load routes
    application.use(config.api.prefix, routes());

    // catch 404 and forward to error handler
    application.use((req: Request, res: Response, next: NextFunction) => {
        next(new NotFound(`Route or resource not found.`));
    });

    // error handler
    application.use((err: any, req: Request, res: Response, next: NextFunction) => {
        if (!(err instanceof ApiError)) {
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
        application.listen(config.api.port, () => Logger.info(`Listening on port ${config.api.port}`))
    }

    return application;
};
