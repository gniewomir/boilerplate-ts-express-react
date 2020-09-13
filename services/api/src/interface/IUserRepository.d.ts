import {User} from "../entity/User";

export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>;

    findById(id: number): Promise<User | null>;

    createAndSave(email: string, name: string, password: string): Promise<User | null>;

    exists(id: number): Promise<boolean>;
}
