import {IApiResponse} from "../type/api";
import {NextFunction, Request, Response} from "express";
import {Container} from "typedi";
import {AuthenticationService} from "../../application/service/authentication/AuthenticationService";
import {NotFound} from "../../application/error/NotFound";
import {IController} from "./Controller";

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
                        Container.get(AuthenticationService).getAuthenticationFromResponse(res)
                    ) as IApiResponse;
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