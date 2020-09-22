import {IAuthentication, IToken} from "../../type/authentication";
import {IUserDto} from "../../../domain/type/user";
import {IPermission} from "../../type/authorization";
import {IsAdminPermission} from "../../permission/IsAdminPermission";
import {Sealed} from "../../../util";
import cloneDeep from "lodash/cloneDeep";
import {InvalidAuthentication} from "../../error/InvalidAuthentication";

@Sealed
export class Authentication implements IAuthentication {
    constructor(
        private readonly token: IToken,
        private readonly user: IUserDto,
    ) {
        if (token.payload.userId !== user.id) {
            throw new InvalidAuthentication('token and user mismatch');
        }
        this.token = token;
        this.user = user;
    }

    public denied(permission: IPermission): boolean {
        return !this.granted(permission);
    }

    public granted(permission: IPermission): boolean {
        return this.isAuthenticated() && (this.hasPermission(permission) || this.hasPermission(new IsAdminPermission()));
    }

    public getToken(): IToken {
        return cloneDeep(this.token);
    }

    public getUser(): IUserDto {
        return cloneDeep(this.user);
    }

    public isAuthenticated(): boolean {
        return true;
    }

    private hasPermission(permission: IPermission): boolean {
        return this.isAuthenticated() && this.token.payload.permissions.indexOf(permission.toString()) !== -1;
    }

}