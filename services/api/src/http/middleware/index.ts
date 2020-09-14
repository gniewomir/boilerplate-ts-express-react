import {NextFunction, Request, RequestHandler, Response} from "express";
import cors from "cors";
import config from "../../application/config";
import authenticate from "./authenticate";
import {Container} from "typedi";
import AuthenticationService from "../../application/service/authentication";
import Forbidden from "../../application/error/Forbidden";

export const middleware = (...args: RequestHandler[]): RequestHandler[] => {
    return [
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
        if (authentication.authenticated) {
            return conditionalMiddleware(req, res, next);
        }
        next();
    }
}
export const forUnauthenticated = (conditionalMiddleware: RequestHandler): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authentication = Container.get(AuthenticationService).authenticationFromResponse(res);
        if (!authentication.authenticated) {
            return conditionalMiddleware(req, res, next);
        }
        next();
    }
}

export const requireUnauthenticated = (message: string): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authentication = Container.get(AuthenticationService).authenticationFromResponse(res);
        if (authentication.authenticated) {
            throw new Forbidden(message);
        }
        next();
    }
}