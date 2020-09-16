import {NextFunction, Request, RequestHandler, Response} from "express";
import {Container} from "typedi";
import {config} from "../../application/config";
import {IRouteListEntry} from "../../application/type/http";
import {InvalidAuthentication} from "../../application/error/InvalidAuthentication";
import {AuthenticationService} from "../../application/service/authentication/AuthenticationService";

const getTokenFromHeader = (req: Request): string => {
    if (
        (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
        (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
    ) {
        return req.headers.authorization.split(' ')[1];
    }
    return '';
};

const normalizePath = (str: string): string => {
    str = str.split('?')[0];
    str = str.toLowerCase();
    if (str.substr(-1) === '/') {
        return str.substr(0, str.length - 1);
    }
    return str;
}

const isWhitelisted = (req: Request): boolean => {
    return config.security.authentication.whitelist.reduce(
        (carry: boolean, entry: IRouteListEntry) => {
            return carry || (
                entry.method.toUpperCase() === req.method.toUpperCase() &&
                normalizePath(entry.route) === normalizePath(req.originalUrl)
            );
        },
        false
    );
}

export const authenticate = (): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await Container.get(AuthenticationService).authenticateResponse(getTokenFromHeader(req), res);
            next();
            return;
        } catch (error) {
            if (isWhitelisted(req) && error instanceof InvalidAuthentication) {
                next();
                return;
            }
            next(error);
        }
    }
}
