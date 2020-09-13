import {IDTO} from "../../database/interface/IDTO";


export interface IUserLoginDTO {
    email: string;
    password: string;
}

export interface IUserRegistrationDTO {
    name: string;
    email: string;
    password: string;
}

export interface IUserDto extends IDTO {
    id: number;
    name: string;
    email: string;
}
