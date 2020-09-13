import {NextFunction, Request, RequestHandler, Response} from "express";
import {Container} from "typedi";
import AuthenticationService from "../../service/authentication";
import config from "../../config";
import {IWhitelistEntry} from "../../type/whitelist";
import InvalidAuthentication from "../../error/InvalidAuthentication";

const getTokenFromHeader = (req: Request) => {
    if (
        (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
        (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
    ) {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
};

const normalize = (str: string): string => {
    str = str.toLowerCase();
    if (str.substr(-1) === '/') {
        return str.substr(0, str.length - 1);
    }
    return str;
}

const isWhitelisted = (req: Request): boolean => {
    return config.security.authentication.whitelist.reduce(
        (carry: boolean, entry: IWhitelistEntry) => {
            return carry || (
                normalize(entry.method) === normalize(req.method) &&
                normalize(entry.route) === normalize(req.originalUrl)
            );
        },
        false
    );
}

export default (): RequestHandler => {
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
