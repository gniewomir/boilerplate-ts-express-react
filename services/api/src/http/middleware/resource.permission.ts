import {IRepository} from "../../database/type/IRepository";
import {NextFunction, Request, RequestHandler, Response} from "express";
import {Container} from "typedi";
import {AuthenticationService} from "../../application/service/authentication/AuthenticationService";
import {ResourceCrudPermission} from "../../application/permission/ResourceCrudPermission";
import {HttpMethod} from "../../application/type/http";
import {Forbidden} from "../../application/error/Forbidden";

export const requireResourcePermissions = (repository: IRepository, entityIdParamName?: string | null): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authentication = Container.get(AuthenticationService).getAuthenticationFromResponse(res);
        const repositoryPermission = new ResourceCrudPermission(req.method.toUpperCase() as HttpMethod, repository, req.params[entityIdParamName]);
        const entityPermission = new ResourceCrudPermission(req.method.toUpperCase() as HttpMethod, repository);
        if (authentication.granted(entityPermission)) {
            next();
            return;
        }
        if (authentication.granted(repositoryPermission)) {
            next();
            return;
        }
        throw new Forbidden(`You lack permission ${entityPermission.toString()} or ${repositoryPermission.toString()}`);
    }
}