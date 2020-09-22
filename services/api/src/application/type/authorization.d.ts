export interface IPermission {
    toString(): string
}

export type PermissionsList = string[]

export interface IAuthorization {
    granted(permission: IPermission): boolean

    denied(permission: IPermission): boolean
}

export type Role = 'admin' | 'user' | 'refresh_token'

export interface IRole {
    name(): Role

    permissions(userId: number): PermissionsList

    toString(): Role
}