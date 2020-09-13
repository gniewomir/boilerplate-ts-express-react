import {Request, Response} from "express";
import {IAuthenticated} from "./IAuthenticated";

export interface IController {
    CONNECT(req: Request, res: Response, authentication: IAuthenticated): Promise<any>

    TRACE(req: Request, res: Response, authentication: IAuthenticated): Promise<any>

    OPTIONS(req: Request, res: Response, authentication: IAuthenticated): Promise<any>

    HEAD(req: Request, res: Response, authentication: IAuthenticated): Promise<any>

    POST(req: Request, res: Response, authentication: IAuthenticated): Promise<any>

    PUT(req: Request, res: Response, authentication: IAuthenticated): Promise<any>

    PATCH(req: Request, res: Response, authentication: IAuthenticated): Promise<any>

    DELETE(req: Request, res: Response, authentication: IAuthenticated): Promise<any>

    GET(req: Request, res: Response, authentication: IAuthenticated): Promise<any>
}
