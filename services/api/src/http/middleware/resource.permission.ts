import {IRepository} from "../../database/type/IRepository";
import {NextFunction, Request, RequestHandler, Response} from "express";
import {Container} from "typedi";
import {AuthenticationService} from "../../application/service/authentication/AuthenticationService";
import {ResourcePermission} from "../../application/permission/ResourcePermission";
import {HttpMethod} from "../../application/type/http";
import {Forbidden} from "../../application/error/Forbidden";

export const requireResourcePermissions = (repository: IRepository, entityIdParamName?: string | null): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authentication = Container.get(AuthenticationService).getAuthenticationFromResponse(res);
        const resourceHttpMethodPermission = new ResourcePermission(req.method.toUpperCase() as HttpMethod, repository, req.params[entityIdParamName]);
        const entityHttpMethodPermission = new ResourcePermission(req.method.toUpperCase() as HttpMethod, repository);
        if (authentication.granted(entityHttpMethodPermission)) {
            next();
            return;
        }
        if (authentication.granted(resourceHttpMethodPermission)) {
            next();
            return;
        }
        throw new Forbidden(`You lack permission ${entityHttpMethodPermission.toString()} or ${resourceHttpMethodPermission.toString()}`);
    }
}