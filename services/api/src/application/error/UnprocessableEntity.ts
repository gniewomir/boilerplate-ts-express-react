import {IErrorValidation} from "../type/error";
import {ApiError} from "./ApiError";

export class UnprocessableEntity extends ApiError implements IErrorValidation {
    private readonly field: string;

    constructor(message: string = 'Unprocessable entity', field: string = '', previous?: any) {
        super(message, 422, previous)
        this.field = field;
    }

    getValidationErrors(): object {
        return {
            [this.field]: this.getMessage()
        };
    }

    getAsLiteral(): object {
        return {
            ...super.getAsLiteral(),
            validation: this.getValidationErrors()
        };
    }

}