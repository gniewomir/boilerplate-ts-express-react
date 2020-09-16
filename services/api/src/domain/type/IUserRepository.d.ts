import {User} from "../../database/entity/User";
import {IRepository} from "../../database/type/IRepository";

export interface IUserRepository extends IRepository {
    findByEmail(email: string): Promise<User | null>;

    findById(id: number): Promise<User | null>;

    createAndSave(email: string, name: string, password: string): Promise<User | null>;

    exists(id: number): Promise<boolean>;
}
