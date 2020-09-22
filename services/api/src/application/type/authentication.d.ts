import {IUserDto} from "../../domain/type/user";
import {IAuthorization, PermissionsList} from "./authorization";

export interface ITokenPayload {
    userId: number;
    exp: number;
    iat: number;
    permissions: PermissionsList
}

export interface IToken {
    token: string;
    payload: ITokenPayload
}

export interface IAuthentication extends IAuthorization {
    isAuthenticated(): boolean

    getUser(): IUserDto;

    getToken(): IToken;
}