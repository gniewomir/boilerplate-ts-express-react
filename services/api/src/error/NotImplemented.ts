import {IError} from "../interface/IError";
import ApiError from "./ApiError";

export default class NotImplemented extends ApiError implements IError {

    constructor(message: string = 'Not implemented', previous?: any) {
        super(message, 500, previous)
    }

}