import {IErrorValidation} from "../interface/IErrorValidation";
import ApiError from "./ApiError";

export default class BadRequest extends ApiError implements IErrorValidation {

    private readonly validationErrors: any;

    constructor(validationErrors: object, previous?: any) {
        super('Malformed request', 400, previous);
        this.validationErrors = validationErrors;
    }

    getValidationErrors(): object {
        return this.validationErrors;
    }

    getAsLiteral(): object {
        return this.getValidationErrors();
    }
}