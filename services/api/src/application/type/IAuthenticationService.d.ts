import {IUserDto} from "../../domain/type/user";
import {IAuthentication, PermissionsList} from "./authentication";
import {Response} from "express";

export interface IAuthenticationService {

    checkAuthentication(token: string): Promise<IAuthentication>

    createAuthentication(user: IUserDto, permissions: PermissionsList, tokenExpirationInMinutes: number): Promise<IAuthentication>

    createUserAuthentication(user: IUserDto): Promise<IAuthentication>

    createRefreshTokenAuthentication(user: IUserDto): Promise<IAuthentication>

    revokeToken(token: string): Promise<boolean>

    authenticateResponse(token: string, res: Response): Promise<Response>;

    authenticationFromResponse(res: Response): IAuthentication;

}
