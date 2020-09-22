import {NextFunction, Request, Response} from "express";
import {ApiError} from "./ApiError";
import {config} from "../config";
import {Log} from "../loader/logger";


export const apiErrorsMiddleware = () => {
    return (error: any, req: Request, res: Response, next: NextFunction) => {
        if (!(error instanceof ApiError)) {
            if (config.env === 'development') {
                throw error;
            } else {
                Log.error('Unrecognized error.', error);
            }
            error = new ApiError('Unrecognized error.', 500, error);
        }
        if (error instanceof ApiError) {
            return res
                .status(error.getHttpStatusCode())
                .send(error.getAsLiteral())
                .end();
        }
        return next(error);
    }
}