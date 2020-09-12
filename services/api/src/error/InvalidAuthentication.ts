export default class InvalidAuthentication implements IError {

    private readonly statusCode: number = 401;
    private readonly message: string;
    private readonly previous: any;

    constructor(message: string, previous?: any) {
        this.statusCode = 401;
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