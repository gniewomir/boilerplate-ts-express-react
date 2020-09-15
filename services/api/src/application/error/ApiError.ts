import {IError} from "../type/error";

export default class ApiError implements IError {

    private readonly statusCode: number;
    private readonly message: string;
    private readonly previous: any;

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
            status: this.getHttpStatusCode(),
            error: this.constructor.name,
            message: this.getMessage()
        };
    }
}