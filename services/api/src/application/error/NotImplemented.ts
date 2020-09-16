import {IError} from "../type/error";
import {ApiError} from "./ApiError";

export class NotImplemented extends ApiError implements IError {

    constructor(message: string = 'Not implemented', previous?: any) {
        super(message, 500, previous)
    }

}