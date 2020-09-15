import {IApiResponse, IController} from "../type/controller";
import {NextFunction, Request, Response} from "express";
import {Container} from "typedi";
import AuthenticationService from "../../application/service/authentication";
import {Entity} from "typeorm";
import InternalServerError from "../../application/error/InternalServerError";

export const controller = (routeController: IController) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // @ts-ignore
            const apiResponse = await routeController[req.method.toUpperCase()](
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
        } catch (error) {
            return next(error);
        }
    }
}