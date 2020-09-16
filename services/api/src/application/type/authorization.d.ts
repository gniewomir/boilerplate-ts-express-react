export interface IPermission {
    granted(): boolean

    denied(): boolean

    toString(): string
}

export interface IAuthorization {
    granted(permission: IPermission): boolean

    denied(permission: IPermission): boolean
}
