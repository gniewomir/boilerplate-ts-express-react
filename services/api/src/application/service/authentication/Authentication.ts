import {IAuthentication, IToken} from "../../type/authentication";
import {IUserDto} from "../../../domain/type/user";
import {IPermission} from "../../type/authorization";
import {SuperAdminPermission} from "../../permission/SuperAdminPermission";
import {Sealed} from "../../../util";
import cloneDeep from "lodash/cloneDeep";

@Sealed
export class Authentication implements IAuthentication {
    constructor(
        private readonly authenticated: boolean,
        private readonly token: IToken | null,
        private readonly user: IUserDto | null,
    ) {
        this.authenticated = authenticated;
        this.token = token;
        this.user = user;
    }

    public denied(permission: IPermission): boolean {
        return !this.granted(permission);
    }

    public granted(permission: IPermission): boolean {
        return this.hasPermission(permission) || this.hasPermission(new SuperAdminPermission());
    }

    public getToken(): IToken | null {
        return cloneDeep(this.token);
    }

    public getUser(): IUserDto | null {
        return cloneDeep(this.user);
    }

    public isAuthenticated(): boolean {
        return this.authenticated;
    }

    private hasPermission(permission: IPermission): boolean {
        return this.token !== null && this.token.payload.permissions.indexOf(permission.toString()) !== -1;
    }

}