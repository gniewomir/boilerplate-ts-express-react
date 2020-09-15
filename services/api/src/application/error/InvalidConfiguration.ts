import {IError} from "../type/error";
import ApiError from "./ApiError";

export default class InvalidConfiguration extends ApiError implements IError {

}