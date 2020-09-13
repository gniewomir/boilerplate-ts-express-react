import {IUser} from "./IUser";
import {IToken} from "./IToken";

export interface IAuthenticated {
    authenticated: boolean;
    user: IUser | null;
    token: IToken | null;
}