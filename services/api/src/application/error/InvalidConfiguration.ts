import {IError} from "../interface/error";
import ApiError from "./ApiError";

export default class InvalidConfiguration extends ApiError implements IError {

}