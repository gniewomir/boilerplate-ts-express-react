import {IError} from "../interface/IError";
import ApiError from "./ApiError";

export default class UnprocessableEntity extends ApiError implements IError {

    constructor(message: string = 'Unprocessable entity', previous?: any) {
        super(message, 422, previous)
    }

}