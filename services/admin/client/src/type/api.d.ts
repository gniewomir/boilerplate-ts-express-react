export type HttpMethod = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH";

export interface ILoginCredentialsInput {
    email: string,
    password: string,
    remember: boolean
}

export interface IRegisterCredentialsInput {
    name: string,
    email: string,
    password: string,
}

export interface ITokenResponse {
    token: string
}

export interface IUserResponse {
    id: number,
    email: string,
    name: string
}

export interface IApiError {
    statusCode: number,
    error: string,
    message: string,
    validation: ApiValidationErrors
}

type PermissionsList = string[]

export interface ITokenPayload {
    userId: number;
    exp: number;
    permissions: PermissionsList
}

export interface IToken {
    token: string;
    payload: ITokenPayload
}

export type ApiValidationErrors = { [id: string]: string }
