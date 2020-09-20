import {ApiError} from "./ApiError";
import {IErrorValidation} from "../type/error";

export class BadRequest extends ApiError implements IErrorValidation {

    private readonly validationErrors: any;

    constructor(validationErrors: object, previous?: any) {
        super('Malformed request', 400, previous);
        this.validationErrors = validationErrors;
    }

    getValidationErrors(): object {
        return this.validationErrors;
    }

    getAsLiteral(): object {
        return {
            ...super.getAsLiteral(),
            validation: this.getValidationErrors()
        };
    }
}