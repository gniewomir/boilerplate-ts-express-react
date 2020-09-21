import {NextFunction, Request, RequestHandler, Response} from "express";
import {Container} from "typedi";
import {AuthenticationService} from "../../application/service/authentication/AuthenticationService";

export const forAuthenticated = (conditionalMiddleware: RequestHandler): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authentication = Container.get(AuthenticationService).getAuthenticationFromResponse(res);
        if (authentication.isAuthenticated()) {
            return conditionalMiddleware(req, res, next);
        }
        next();
    }
}