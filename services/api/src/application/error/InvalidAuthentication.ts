import {IError} from "../type/error";
import ApiError from "./ApiError";

export default class InvalidAuthentication extends ApiError implements IError {
    constructor(message: string, previous?: any) {
        super(message, 401, previous)
    }
}