import {IApiResponse, IController} from "../type/controller";
import {NextFunction, Request, Response} from "express";
import {Container} from "typedi";
import {Entity} from "typeorm";
import {InternalServerError} from "../../application/error/InternalServerError";
import {AuthenticationService} from "../../application/service/authentication/AuthenticationService";
import {NotFound} from "../../application/error/NotFound";

export const controller = (routeController: IController) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const controllerMethods = [
                `${req.method.toUpperCase()}${req.path.replace('/', '_')}`,
                req.method.toUpperCase()
            ];
            for (const method of controllerMethods) {
                // @ts-ignore
                if (typeof routeController[method] === 'function') {
                    // @ts-ignore
                    const apiResponse = await routeController[method](
                        req,
                        res,
                        Container.get(AuthenticationService).authenticationFromResponse(res)
                    ) as IApiResponse;
                    if (apiResponse.body instanceof Entity) {
                        throw new InternalServerError('Entities cannot be returned from controllers, use DTO to prevent leaking sensitive data.');
                    }
                    return res
                        .status(apiResponse.statusCode)
                        .json(apiResponse.body);
                }
            }
            throw new NotFound();
        } catch (error) {
            return next(error);
        }
    }
}