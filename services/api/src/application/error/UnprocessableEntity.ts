import {IError} from "../type/error";
import {ApiError} from "./ApiError";

export class UnprocessableEntity extends ApiError implements IError {

    constructor(message: string = 'Unprocessable entity', previous?: any) {
        super(message, 422, previous)
    }

}