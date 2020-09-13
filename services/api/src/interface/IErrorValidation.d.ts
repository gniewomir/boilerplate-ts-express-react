import {IError} from "./IError";


export interface IErrorValidation extends IError {
    getValidationErrors(): object;
}