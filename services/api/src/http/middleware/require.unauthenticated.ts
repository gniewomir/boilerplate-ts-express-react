import {NextFunction, Request, RequestHandler, Response} from "express";
import {Container} from "typedi";
import {AuthenticationService} from "../../application/service/authentication/AuthenticationService";
import {Forbidden} from "../../application/error/Forbidden";

export const requireUnauthenticated = (message: string): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authentication = Container.get(AuthenticationService).getAuthenticationFromResponse(res);
        if (authentication.isAuthenticated()) {
            throw new Forbidden(message);
        }
        next();
    }
}