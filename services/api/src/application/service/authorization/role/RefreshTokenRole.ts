import {Service} from "typedi";
import {AbstractRole} from "./AbstractRole";
import {IRole, PermissionsList, Role} from "../../../type/authorization";
import {UseRefreshTokenPermission} from "../permission/UseRefreshTokenPermission";

@Service()
export class RefreshTokenRole extends AbstractRole implements IRole {

    name(): Role {
        return 'refresh_token';
    }

    permissions(userId: number): PermissionsList {
        return this.createPermissionsList(
            new UseRefreshTokenPermission()
        );
    }

}