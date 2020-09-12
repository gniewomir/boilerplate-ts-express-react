interface IError {

    getHttpStatusCode(): number;

    getMessage(): string;

    getPreviousError(): any;


}