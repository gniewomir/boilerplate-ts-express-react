import {IDataTransferObject} from "../../database/type/IDataTransferObject";


export interface IUserLoginInputDTO {
    email: string;
    password: string;
}

export interface IUserRegistrationInputDTO {
    name: string;
    email: string;
    password: string;
}

export interface IUserUpdateInputDTO {
    name?: string;
    email?: string;
    password?: string;
}

export interface IUserDto extends IDataTransferObject {
    id: number;
    name: string;
    email: string;
    password?: string;
}
