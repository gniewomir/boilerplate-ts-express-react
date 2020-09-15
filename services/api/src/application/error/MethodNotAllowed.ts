import {IError} from "../type/error";
import ApiError from "./ApiError";

export default class MethodNotAllowed extends ApiError implements IError {

    constructor(message: string = 'Method not allowed', previous?: any) {
        super(message, 405, previous)
    }

}



