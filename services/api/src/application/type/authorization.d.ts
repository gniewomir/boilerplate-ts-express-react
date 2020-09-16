export interface IPermission {
    toString(): string
}

export interface IAuthorization {
    granted(permission: IPermission): boolean

    denied(permission: IPermission): boolean
}
