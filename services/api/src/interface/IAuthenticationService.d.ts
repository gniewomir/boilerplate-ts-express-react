import {IUser} from "./IUser";
import {IAuthenticated} from "./IAuthenticated";

export interface IAuthenticationService {

    checkAuthentication(token: string): Promise<IAuthenticated>

    createAuthentication(user: IUser): Promise<IAuthenticated>

    revokeAuthentication(token: string): Promise<boolean>

}
