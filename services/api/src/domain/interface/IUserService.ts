import {IAuthentication} from "../../application/interface/IAuthenticated";
import {IUserDto, IUserLoginDTO, IUserRegistrationDTO} from "./user";

export interface IUserService {
    authenticateById(id: number): Promise<IAuthentication>;

    authenticateByCredentials(credentials: IUserLoginDTO): Promise<IAuthentication>;

    revokeAuthentication(token: string): Promise<undefined>;

    register(input: IUserRegistrationDTO): Promise<IUserDto>;
}