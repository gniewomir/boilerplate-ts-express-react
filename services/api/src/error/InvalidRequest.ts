import {IErrorValidation} from "../interface/IErrorValidation";

export default class InvalidRequest implements IErrorValidation {

    private readonly statusCode: number;
    private readonly message: string;
    private readonly previous: any;
    private readonly validationErrors: any;

    constructor(validationErrors: object, previous?: any) {
        this.statusCode = 422;
        this.message = 'Unprocessable request';
        this.previous = previous;
        this.validationErrors = validationErrors;
    }

    getHttpStatusCode(): number {
        return this.statusCode;
    }

    getMessage(): string {
        return this.message;
    }

    getPreviousError(): any {
        return this.previous;
    }

    getValidationErrors(): object {
        return this.validationErrors;
    }
}