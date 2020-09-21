import {IDataTransferObject} from "../../database/type/IDataTransferObject";


export interface IUserLoginInput {
    email: string;
    password: string;
}

export interface IUserRegistrationInput {
    name: string;
    email: string;
    password: string;
}

export interface IUserUpdateInput {
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
