import {Request, Response} from "express";
import {IApiResponse} from "../type/api";
import {MethodNotAllowed} from "../../application/error/MethodNotAllowed";
import {IAuthentication} from "../../application/type/authentication";

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

export class Controller implements IController {
    public async CONNECT(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse> {
        throw new MethodNotAllowed();
    }

    public async DELETE(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse> {
        throw new MethodNotAllowed();
    }

    public async GET(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse> {
        throw new MethodNotAllowed();
    }

    public async HEAD(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse> {
        throw new MethodNotAllowed();
    }

    public async OPTIONS(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse> {
        throw new MethodNotAllowed();
    }

    public async PATCH(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse> {
        throw new MethodNotAllowed();
    }

    public async POST(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse> {
        throw new MethodNotAllowed();
    }

    public async PUT(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse> {
        throw new MethodNotAllowed();
    }

    public async TRACE(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse> {
        throw new MethodNotAllowed();
    }
}