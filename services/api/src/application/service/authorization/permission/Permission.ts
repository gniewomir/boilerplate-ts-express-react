import {IPermission} from "../../../type/authorization";

export abstract class Permission implements IPermission {
    toString(): string {
        return this.constructor.name;
    }
}