import {IController} from "../../interface/IController";
import {NextFunction, Request, Response} from "express";
import {Container} from "typedi";
import AuthenticationService from "../../service/authentication";

export const controller = (routeController: IController) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // @ts-ignore
            await routeController[req.method.toUpperCase()](
                req,
                res,
                Container.get(AuthenticationService).authenticationFromResponse(res)
            );
            return res;
        } catch (error) {
            return next(error);
        }
    }
}