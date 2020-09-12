import {IUser} from "./IUser";

interface IAuthenticated {
    user: IUser | null;
    token: IToken;
}