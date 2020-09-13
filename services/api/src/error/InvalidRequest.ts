import {IErrorValidation} from "../interface/IErrorValidation";
import ApiError from "./ApiError";

export default class InvalidRequest extends ApiError implements IErrorValidation {

    private readonly validationErrors: any;

    constructor(validationErrors: object, previous?: any) {
        super('Unprocessable request', 422, previous);
        this.validationErrors = validationErrors;
    }

    getValidationErrors(): object {
        return this.validationErrors;
    }

    getAsLiteral(): object {
        return this.getValidationErrors();
    }
}