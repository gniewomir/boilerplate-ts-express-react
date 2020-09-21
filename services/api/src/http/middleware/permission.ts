import {IPermission} from "../../application/type/authorization";
import {NextFunction, Request, RequestHandler, Response} from "express";
import {Container} from "typedi";
import {AuthenticationService} from "../../application/service/authentication/AuthenticationService";
import {Forbidden} from "../../application/error/Forbidden";

export const requirePermissions = (...args: IPermission[]): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authentication = Container.get(AuthenticationService).getAuthenticationFromResponse(res);
        args.forEach((permission: IPermission) => {
            if (authentication.denied(permission)) {
                throw new Forbidden(`You lack permission ${permission.toString()}`);
            }
        });
        next();
    }
}