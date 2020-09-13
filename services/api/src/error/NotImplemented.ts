import {IError} from "../interface/IError";

export default class NotImplemented implements IError {

    private readonly statusCode: number;
    private readonly message: string;
    private readonly previous: any;

    constructor(message: string, previous?: any) {
        this.statusCode = 500;
        this.message = message;
        this.previous = previous;
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
}