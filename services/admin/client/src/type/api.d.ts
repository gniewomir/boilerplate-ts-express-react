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
    status: number,
    error: string,
    message: string,
    validation: ValidationErrors
}

export type ValidationErrors = { [id: string]: string }
