import {IError} from "../interface/IError";
import ApiError from "./ApiError";

export default class NotFound extends ApiError implements IError {

    constructor(message: string = 'Not found', previous?: any) {
        super(message, 404, previous)
    }

}