import {IUserDto} from "../../domain/interface/user";
import {IToken} from "./IToken";

export interface IAuthenticated {
    authenticated: boolean;
    user: IUserDto | null;
    token: IToken | null;
}