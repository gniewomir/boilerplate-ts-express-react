import {IError} from "../type/error";

export class ApiError implements IError {

    readonly statusCode: number;
    readonly message: string;
    readonly previous: any;

    constructor(message: string, statusCode: number = 500, previous?: any) {
        this.statusCode = statusCode;
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

    getAsLiteral(): object {
        return {
            statusCode: this.getHttpStatusCode(),
            error: this.constructor.name,
            message: this.getMessage()
        };
    }
}