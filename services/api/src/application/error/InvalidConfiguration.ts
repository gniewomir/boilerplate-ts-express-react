import {IError} from "../type/error";
import {ApiError} from "./ApiError";

export class InvalidConfiguration extends ApiError implements IError {

}