import {IPermission} from "../type/authorization";

export abstract class Permission implements IPermission {

    abstract denied(): boolean

    abstract granted(): boolean

    toString(): string {
        return this.constructor.name;
    }
}