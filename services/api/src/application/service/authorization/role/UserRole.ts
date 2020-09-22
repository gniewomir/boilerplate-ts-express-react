import {IRole, PermissionsList, Role} from "../../../type/authorization";
import {AbstractRole} from "./AbstractRole";
import {UserRepository} from "../../../../database/repository/UserRepository";
import {Service} from "typedi";
import {ResourcePermission} from "../permission/ResourcePermission";
import {UseCredentialsPermission} from "../permission/UseCredentialsPermission";

@Service()
export class UserRole extends AbstractRole implements IRole {

    constructor(private userRepository: UserRepository) {
        super();
    }

    name(): Role {
        return 'user';
    }

    permissions(userId: number): PermissionsList {
        return this.createPermissionsList(
            new ResourcePermission('GET', this.userRepository, userId),
            new ResourcePermission('PATCH', this.userRepository, userId),
            new UseCredentialsPermission()
        );
    }

}