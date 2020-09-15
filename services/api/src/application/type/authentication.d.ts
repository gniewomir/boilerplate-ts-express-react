import {IUserDto} from "../../domain/type/user";

export interface ITokenPayload {
    user_id: number;
    exp: number;
}

export interface IToken {
    token: string;
    payload: ITokenPayload
}

export interface IAuthentication {
    authenticated: boolean;
    user: IUserDto | null;
    token: IToken | null;
}