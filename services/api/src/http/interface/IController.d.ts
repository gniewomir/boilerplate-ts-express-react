import {Request, Response} from "express";
import {IAuthentication} from "../../application/interface/IAuthenticated";
import {IApiResponse} from "./IApiResponse";

export interface IController {
    CONNECT(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse>

    TRACE(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse>

    OPTIONS(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse>

    HEAD(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse>

    POST(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse>

    PUT(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse>

    PATCH(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse>

    DELETE(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse>

    GET(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse>
}
