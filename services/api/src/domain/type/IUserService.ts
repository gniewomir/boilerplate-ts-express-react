import {IAuthentication} from "../../application/type/authentication";
import {IUserDto, IUserLoginInputDTO, IUserRegistrationInputDTO, IUserUpdateInputDTO} from "./user";

export interface IUserService {
    authenticateById(id: number): Promise<IAuthentication>;

    authenticateByCredentials(credentials: IUserLoginInputDTO): Promise<IAuthentication>;

    revokeAuthentication(token: string): Promise<undefined>;

    register(input: IUserRegistrationInputDTO): Promise<IUserDto>;

    update(userId: number, input: IUserUpdateInputDTO): Promise<IUserDto>

    find(id: number): Promise<IUserDto>;
}