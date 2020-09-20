import {NextFunction, Request, RequestHandler, Response} from "express";
import cors from "cors";
import {config} from "../../application/config";
import {authenticate} from "./authenticate";
import {Container} from "typedi";
import {Forbidden} from "../../application/error/Forbidden";
import {AuthenticationService} from "../../application/service/authentication/AuthenticationService";
import {Log} from "../../application/loader/logger";

const developmentMiddleware = [
    (req: Request, res: Response, next: NextFunction) => {
        if (config.env === 'development') {
            Log.debug(`Body as JSON: ${JSON.stringify(req.body)}`);
        }
        next();
    }
]

export const middleware = (...args: RequestHandler[]): RequestHandler[] => {
    return [
        ...(config.env === 'development' ? developmentMiddleware : []),
        cors({
            origin: `${config.api.scheme}://${config.api.public_domain}${config.api.public_port !== 80 ? ':' + config.api.public_port : ''}`,
            optionsSuccessStatus: 204
        }),
        authenticate(),
        ...args
    ];
}
export const forAuthenticated = (conditionalMiddleware: RequestHandler): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authentication = Container.get(AuthenticationService).authenticationFromResponse(res);
        if (authentication.isAuthenticated()) {
            return conditionalMiddleware(req, res, next);
        }
        next();
    }
}
export const forUnauthenticated = (conditionalMiddleware: RequestHandler): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authentication = Container.get(AuthenticationService).authenticationFromResponse(res);
        if (!authentication.isAuthenticated()) {
            return conditionalMiddleware(req, res, next);
        }
        next();
    }
}

export const requireUnauthenticated = (message: string): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authentication = Container.get(AuthenticationService).authenticationFromResponse(res);
        if (authentication.isAuthenticated()) {
            throw new Forbidden(message);
        }
        next();
    }
}

