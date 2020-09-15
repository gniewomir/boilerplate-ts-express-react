export interface IError {

    getHttpStatusCode(): number;

    getMessage(): string;

    getPreviousError(): any;

    getAsLiteral(): object;

}

export interface IErrorValidation extends IError {
    getValidationErrors(): object;
}