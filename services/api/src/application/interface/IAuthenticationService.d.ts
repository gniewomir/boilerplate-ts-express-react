import {IUserDto} from "../../domain/interface/user";
import {IAuthentication} from "./IAuthentication";
import {Response} from "express";

export interface IAuthenticationService {

    checkAuthentication(token: string): Promise<IAuthentication>

    createAuthentication(user: IUserDto): Promise<IAuthentication>

    revokeAuthentication(token: string): Promise<boolean>

    authenticateResponse(token: string, res: Response): Promise<Response>;

    authenticationFromResponse(res: Response): IAuthentication;

}
