import {IDTO} from "../../database/type/IDTO";


export interface IUserLoginInputDTO {
    email: string;
    password: string;
}

export interface IUserRegistrationInputDTO {
    name: string;
    email: string;
    password: string;
}

export interface IUserDto extends IDTO {
    id: number;
    name: string;
    email: string;
}
