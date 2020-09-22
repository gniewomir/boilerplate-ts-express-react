import {IPermission, IRole, PermissionsList, Role} from "../../../type/authorization";

export abstract class AbstractRole implements IRole {

    public abstract name(): Role;

    public abstract permissions(userId: number): PermissionsList;

    public toString(): Role {
        return this.name();
    };

    protected createPermissionsList(...args: IPermission[]): PermissionsList {
        return args.map((permission: IPermission): string => {
            return permission.toString();
        })
    }
}