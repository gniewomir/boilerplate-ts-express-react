import {Service} from "typedi";
import ky, {Hooks, Options} from 'ky';
import {config} from "../config";
import {
    IApiError,
    ILoginCredentialsInput,
    IRegisterCredentialsInput,
    ITokenResponse,
    IUserResponse,
    ValidationErrors
} from "../type/api";
import reduce from "lodash/reduce";

@Service()
export class Api {

    constructor(private token: string = '') {
    }

    public setToken(token: string) {
        this.token = token;
    }

    public getToken() {
        return this.token;
    }

    public async login(credentials: ILoginCredentialsInput): Promise<ITokenResponse> {
        return await ky.post(
            `${config.api.url}/token`,
            {
                ...this.defaultOptions(false),
                json: {
                    email: credentials.email,
                    password: credentials.password
                }
            }
        ).json();
    }

    public async logout(): Promise<object> {
        return await ky.delete(
            `${config.api.url}/token`,
            {
                ...this.defaultOptions(true)
            }
        ).json();
    }

    public async register(credentials: IRegisterCredentialsInput): Promise<IUserResponse> {
        return await ky.post(
            `${config.api.url}/user`,
            {
                ...this.defaultOptions(false),
                json: credentials
            }
        ).json();
    }

    public async profile(id: number): Promise<IUserResponse> {
        return await ky.post(
            `${config.api.url}/user/${id}`,
            {
                ...this.defaultOptions(true)
            }
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
                'Authorization': `Bearer ${this.getToken()}`
            });
        }
        return new Headers({
            'content-type': 'application/json',
        });
    }

    private getHooks(): Hooks {
        return {
            afterResponse: [
                async (request, options, response) => {
                    if (response.status < 200 || response.status > 299) {
                        const parsed = await response.clone().json();
                        if (parsed.validation) {
                            // eslint-disable-next-line no-throw-literal
                            throw {
                                ...parsed,
                                validation: reduce(
                                    parsed.validation.body.keys,
                                    (carry: ValidationErrors, key: string) => {
                                        carry[key] = parsed.validation.body.message;
                                        return carry;
                                    },
                                    {} as ValidationErrors
                                )
                            } as IApiError;
                        } else {
                            // eslint-disable-next-line no-throw-literal
                            throw {
                                ...parsed,
                                validation: {} as ValidationErrors
                            } as IApiError;
                        }
                    }
                    return response;
                }
            ]
        }
    }
}