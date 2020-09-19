import {IUserDto} from "../../domain/type/user";
import {IAuthorization} from "./authorization";

type PermissionsList = string[]

export interface ITokenPayload {
    userId: number;
    exp: number;
    permissions: PermissionsList
}

export interface IToken {
    token: string;
    payload: ITokenPayload
}

export interface IAuthentication extends IAuthorization {
    isAuthenticated(): boolean

    getUser(): IUserDto | null;

    getToken(): IToken | null;
}