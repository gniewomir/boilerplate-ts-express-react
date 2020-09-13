import {IError} from "../interface/IError";
import ApiError from "./ApiError";

export default class InvalidConfiguration extends ApiError implements IError {

}