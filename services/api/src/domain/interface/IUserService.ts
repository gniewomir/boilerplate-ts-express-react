import {IAuthentication} from "../../application/interface/authentication";
import {IUserDto, IUserLoginIntputDTO, IUserRegistrationInputDTO} from "./user";

export interface IUserService {
    authenticateById(id: number): Promise<IAuthentication>;

    authenticateByCredentials(credentials: IUserLoginIntputDTO): Promise<IAuthentication>;

    revokeAuthentication(token: string): Promise<undefined>;

    register(input: IUserRegistrationInputDTO): Promise<IUserDto>;

    find(id: number): Promise<IUserDto>;
}