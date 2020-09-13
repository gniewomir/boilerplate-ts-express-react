import {IAuthenticated} from "../../application/interface/IAuthenticated";
import {IUserDto, IUserLoginDTO, IUserRegistrationDTO} from "./user";

export interface IUserService {
    authenticateById(id: number): Promise<IAuthenticated>;

    authenticateByCredentials(credentials: IUserLoginDTO): Promise<IAuthenticated>;

    revokeAuthentication(token: string): Promise<undefined>;

    register(input: IUserRegistrationDTO): Promise<IUserDto>;
}