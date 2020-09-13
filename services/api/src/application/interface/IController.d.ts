import {Request, Response} from "express";
import {IAuthentication} from "./IAuthenticated";

export interface IController {
    CONNECT(req: Request, res: Response, authentication: IAuthentication): Promise<any>

    TRACE(req: Request, res: Response, authentication: IAuthentication): Promise<any>

    OPTIONS(req: Request, res: Response, authentication: IAuthentication): Promise<any>

    HEAD(req: Request, res: Response, authentication: IAuthentication): Promise<any>

    POST(req: Request, res: Response, authentication: IAuthentication): Promise<any>

    PUT(req: Request, res: Response, authentication: IAuthentication): Promise<any>

    PATCH(req: Request, res: Response, authentication: IAuthentication): Promise<any>

    DELETE(req: Request, res: Response, authentication: IAuthentication): Promise<any>

    GET(req: Request, res: Response, authentication: IAuthentication): Promise<any>
}
