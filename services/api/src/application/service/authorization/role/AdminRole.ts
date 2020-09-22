import {IRole, PermissionsList, Role} from "../../../type/authorization";
import {AbstractRole} from "./AbstractRole";
import {Service} from "typedi";
import {UseCredentialsPermission} from "../permission/UseCredentialsPermission";
import {IsAdminPermission} from "../permission/IsAdminPermission";

@Service()
export class AdminRole extends AbstractRole implements IRole {
    name(): Role {
        return 'admin';
    }

    permissions(userId: number): PermissionsList {
        return this.createPermissionsList(
            new IsAdminPermission(),
            new UseCredentialsPermission()
        );
    }

}