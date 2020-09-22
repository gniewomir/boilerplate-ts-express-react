import {IAuthentication, IToken} from "../../type/authentication";
import {IUserDto} from "../../../domain/type/user";
import {IPermission} from "../../type/authorization";
import {Sealed} from "../../../util";
import {InvalidAuthentication} from "../../error/InvalidAuthentication";

@Sealed
export class AuthenticationFailed implements IAuthentication {

    public denied(permission: IPermission): boolean {
        return true;
    }

    public granted(permission: IPermission): boolean {
        return false;
    }

    public getToken(): IToken {
        throw new InvalidAuthentication('failed authentication');
    }

    public getUser(): IUserDto {
        throw new InvalidAuthentication('failed authentication');
    }

    public isAuthenticated(): boolean {
        return false;
    }
}