import {Service} from "typedi";
import ky, {Hooks, Options} from 'ky';
import {config} from "../config";
import {
    ApiValidationErrors,
    IApiError,
    ILoginCredentialsInput,
    IRegisterCredentialsInput,
    ITokenPayload,
    ITokenResponse,
    IUserResponse
} from "../type/api";
import reduce from "lodash/reduce";
import jwt from "jsonwebtoken";
import {Log} from "./Log";

@Service()
export class Api {

    private token: string = '';

    public async GetUserByRefreshToken(): Promise<IUserResponse> {
        const response = await this.PostTokenRefresh();
        if ('statusCode' in response && response['statusCode'] !== 201) {
            throw response;
        }
        const tokenPayload = jwt.decode(response.token) as ITokenPayload;
        this.token = response.token;
        return await this.GetUser(tokenPayload.userId);
    }

    public async PostToken(credentials: ILoginCredentialsInput): Promise<number> {
        const response = await ky.post(
            `${config.api.url}/token`,
            {
                ...this.defaultOptions(false),
                json: {
                    email: credentials.email,
                    password: credentials.password
                }
            }
        ).json() as ITokenResponse;
        const tokenPayload = jwt.decode(response.token) as ITokenPayload;
        this.token = response.token;
        return tokenPayload.userId;
    }

    public async DeleteToken(): Promise<boolean> {
        try {
            await ky.delete(
                `${config.api.url}/token`,
                this.defaultOptions(!!this.token)
            ).json();
        } catch (error) {
            return false;
        } finally {
            this.token = ''
        }
        return true;
    }

    public async PostUser(credentials: IRegisterCredentialsInput): Promise<IUserResponse> {
        return await ky.post(
            `${config.api.url}/user`,
            {
                ...this.defaultOptions(false),
                json: credentials
            }
        ).json();
    }

    public async PatchUser(id: number, credentials: IRegisterCredentialsInput): Promise<IUserResponse> {
        return await ky.patch(
            `${config.api.url}/user/${id}`,
            {
                ...this.defaultOptions(true),
                json: credentials
            }
        ).json();
    }

    public async GetUser(id: number): Promise<IUserResponse> {
        return await ky.get(
            `${config.api.url}/user/${id}`,
            this.defaultOptions(true)
        ).json();
    }

    private defaultOptions = (authenticate: boolean): Options => {
        return {
            throwHttpErrors: false,
            hooks: this.getHooks(),
            headers: this.getHeaders(authenticate)
        }
    }

    private getHeaders(authenticate: boolean): Headers {
        if (authenticate) {
            if (!this.token) {
                throw new Error('No token to authenticate request!');
            }
            return new Headers({
                'content-type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            });
        }
        return new Headers({
            'content-type': 'application/json',
        });
    }

    private async PostTokenRefresh(): Promise<ITokenResponse> {
        return await ky.post(
            `${config.api.url}/token/refresh`,
            {
                ...this.defaultOptions(false)
            }
        ).json();
    }

    private getHooks(): Hooks {
        return {
            afterResponse: [
                async (request, options, response) => {
                    if (response.status === 401 && (await response.clone().json()).message === 'jwt expired') {
                        try {
                            const token = await this.PostTokenRefresh();
                            this.token = token.token;
                            request.headers.set('Authorization', `Bearer ${token.token}`);
                            return ky(request);
                        } catch (error) {
                            Log.error('Cannot refresh token', error);
                            return response;
                        }
                    }
                    return response;
                },
                async (request, options, response) => {
                    if (response.status === 400 || response.status === 422) {
                        const parsed = await response.clone().json();

                        // celebrate validation messages
                        if (parsed.validation && parsed.message.indexOf('celebrate') !== -1) {
                            // eslint-disable-next-line no-throw-literal
                            throw {
                                ...parsed,
                                validation: reduce(
                                    parsed.validation.body.keys,
                                    (carry: ApiValidationErrors, key: string) => {
                                        carry[key] = parsed.validation.body.message;
                                        return carry;
                                    },
                                    {} as ApiValidationErrors
                                ),
                                celebrate: parsed.validation
                            } as IApiError;
                        }

                        // api validation messages
                        // eslint-disable-next-line no-throw-literal
                        throw {
                            ...parsed,
                            validation: parsed.validation ? parsed.validation as ApiValidationErrors : {} as ApiValidationErrors
                        } as IApiError;
                    }
                    return response;
                },
            ]
        }
    }
}