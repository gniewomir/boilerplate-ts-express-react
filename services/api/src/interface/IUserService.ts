import {IAuthenticated} from "./IAuthenticated";

export interface IUserService {
    authenticateById(id: number): Promise<IAuthenticated>;

    authenticateByCredentials(email: string, password: string): Promise<IAuthenticated>;

    revokeAuthentication(token: string): Promise<undefined>;
}