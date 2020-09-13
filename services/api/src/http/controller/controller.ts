import {Request, Response} from "express";
import {IController} from "../../application/interface/IController";
import MethodNotAllowed from "../../application/error/MethodNotAllowed";
import {IAuthentication} from "../../application/interface/IAuthenticated";

export class Controller implements IController {
    public async CONNECT(req: Request, res: Response, authentication: IAuthentication): Promise<any> {
        throw new MethodNotAllowed();
    }

    public async DELETE(req: Request, res: Response, authentication: IAuthentication): Promise<any> {
        throw new MethodNotAllowed();
    }

    public async GET(req: Request, res: Response, authentication: IAuthentication): Promise<any> {
        throw new MethodNotAllowed();
    }

    public async HEAD(req: Request, res: Response, authentication: IAuthentication): Promise<any> {
        throw new MethodNotAllowed();
    }

    public async OPTIONS(req: Request, res: Response, authentication: IAuthentication): Promise<any> {
        throw new MethodNotAllowed();
    }

    public async PATCH(req: Request, res: Response, authentication: IAuthentication): Promise<any> {
        throw new MethodNotAllowed();
    }

    public async POST(req: Request, res: Response, authentication: IAuthentication): Promise<any> {
        throw new MethodNotAllowed();
    }

    public async PUT(req: Request, res: Response, authentication: IAuthentication): Promise<any> {
        throw new MethodNotAllowed();
    }

    public async TRACE(req: Request, res: Response, authentication: IAuthentication): Promise<any> {
        throw new MethodNotAllowed();
    }
}