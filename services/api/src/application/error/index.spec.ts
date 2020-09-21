import {UnprocessableEntity} from "./UnprocessableEntity";
import {ApiError} from "./ApiError";
import {BadRequest} from "./BadRequest";
import {Forbidden} from "./Forbidden";
import {InternalServerError} from "./InternalServerError";
import {InvalidAuthentication} from "./InvalidAuthentication";
import {InvalidConfiguration} from "./InvalidConfiguration";
import {MethodNotAllowed} from "./MethodNotAllowed";
import {NotFound} from "./NotFound";
import {NotImplemented} from "./NotImplemented";

describe('Test errors', () => {
    it('are instances of APiError', () => {
        expect(new ApiError('')).toBeInstanceOf(ApiError);
        expect(new BadRequest({})).toBeInstanceOf(ApiError);
        expect(new Forbidden('')).toBeInstanceOf(ApiError);
        expect(new InternalServerError('')).toBeInstanceOf(ApiError);
        expect(new InvalidAuthentication('')).toBeInstanceOf(ApiError);
        expect(new InvalidConfiguration('')).toBeInstanceOf(ApiError);
        expect(new MethodNotAllowed()).toBeInstanceOf(ApiError);
        expect(new NotFound()).toBeInstanceOf(ApiError);
        expect(new NotImplemented()).toBeInstanceOf(ApiError);
        expect(new UnprocessableEntity()).toBeInstanceOf(ApiError);
    })
})