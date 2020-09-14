import {IDTO} from "../../database/interface/IDTO";


export interface IUserLoginIntputDTO {
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
