import {User} from "../../database/entity/User";
import {IRepository} from "../../database/type/IRepository";
import {IUserUpdateInputDTO} from "./user";

export interface IUserRepository extends IRepository {
    findByEmail(email: string): Promise<User | undefined>;

    findById(id: number): Promise<User | undefined>;

    createAndSave(email: string, name: string, password: string): Promise<User | undefined>;

    update(userId: number, update: IUserUpdateInputDTO): Promise<User | undefined>;

    exists(id: number): Promise<boolean>;
}
