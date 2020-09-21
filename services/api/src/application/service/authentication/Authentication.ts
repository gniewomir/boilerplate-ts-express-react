import {IAuthentication, IToken} from "../../type/authentication";
import {IUserDto} from "../../../domain/type/user";
import {IPermission} from "../../type/authorization";
import {IsAdminPermission} from "../../permission/IsAdminPermission";
import {Sealed} from "../../../util";
import cloneDeep from "lodash/cloneDeep";

@Sealed
export class Authentication implements IAuthentication {
    constructor(
        private readonly token: IToken | null,
        private readonly user: IUserDto | null,
    ) {
        this.token = token;
        this.user = user;
    }

    public denied(permission: IPermission): boolean {
        return !this.granted(permission);
    }

    public granted(permission: IPermission): boolean {
        return this.hasPermission(permission) || this.hasPermission(new IsAdminPermission());
    }

    public getToken(): IToken | null {
        return cloneDeep(this.token);
    }

    public getUser(): IUserDto | null {
        return cloneDeep(this.user);
    }

    public isAuthenticated(): boolean {
        return !!this.token && !!this.user;
    }

    private hasPermission(permission: IPermission): boolean {
        return this.token !== null && this.token.payload.permissions.indexOf(permission.toString()) !== -1;
    }

}