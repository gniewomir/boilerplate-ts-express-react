import {IAuthentication} from "../../application/type/authentication";
import {IUserDto, IUserLoginInputDTO, IUserRegistrationInputDTO} from "./user";

export interface IUserService {
    authenticateById(id: number): Promise<IAuthentication>;

    authenticateByCredentials(credentials: IUserLoginInputDTO): Promise<IAuthentication>;

    revokeAuthentication(token: string): Promise<undefined>;

    register(input: IUserRegistrationInputDTO): Promise<IUserDto>;

    find(id: number): Promise<IUserDto>;
}