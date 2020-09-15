import {IUserDto} from "../../domain/type/user";
import {IAuthentication} from "./authentication";
import {Response} from "express";

export interface IAuthenticationService {

    checkAuthentication(token: string): Promise<IAuthentication>

    createAuthentication(user: IUserDto): Promise<IAuthentication>

    revokeAuthentication(token: string): Promise<boolean>

    authenticateResponse(token: string, res: Response): Promise<Response>;

    authenticationFromResponse(res: Response): IAuthentication;

}
