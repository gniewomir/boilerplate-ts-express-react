import {IAuthentication, IToken} from "../../type/authentication";
import {IUserDto} from "../../../domain/type/user";
import {IPermission} from "../../type/authorization";

export class Authentication implements IAuthentication {
    constructor(
        private authenticated: boolean,
        private token: IToken | null,
        private user: IUserDto | null,
    ) {
    }

    denied(permission: IPermission): boolean {
        return !this.granted(permission);
    }

    granted(permission: IPermission): boolean {
        return this.hasPermission(permission);
    }

    getToken(): IToken | null {
        if (!this.token) {
            return null
        }
        return {
            ...this.token,
            payload: {
                ...this.token.payload,
                permissions: {
                    ...this.token.payload.permissions
                }
            }
        } as IToken;
    }

    getUser(): IUserDto | null {
        if (!this.user) {
            return null
        }
        return {
            ...this.user
        } as IUserDto;
    }

    isAuthenticated(): boolean {
        return this.authenticated;
    }

    private hasPermission(permission: IPermission): boolean {
        if (this.token === null) {
            return false;
        }
        return this.token.payload.permissions.indexOf(permission.toString()) !== -1;
    }

}