import ApiError from "./ApiError";
import {IError} from "../interface/IError";

export default class InternalServerError extends ApiError implements IError {
    constructor(message: string, previous?: any) {
        super(message, 500, previous)
    }
}