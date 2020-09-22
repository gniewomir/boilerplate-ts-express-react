import {IRole, PermissionsList, Role} from "../../../type/authorization";
import {AbstractRole} from "./AbstractRole";
import {IsAdminPermission} from "../../../permission/IsAdminPermission";
import {UseCredentialsPermission} from "../../../permission/UseCredentialsPermission";
import {Service} from "typedi";

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