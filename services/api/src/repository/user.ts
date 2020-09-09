import {IUserRepository} from "../interface/IUserRepository";
import {User} from "../entity/User";
import {AbstractRepository, EntityRepository} from "typeorm";
import argon2 from "argon2";

@EntityRepository(User)
export default class UserRepository extends AbstractRepository<User> implements IUserRepository {
    async createAndSave(name: string, email: string, password: string): Promise<User | undefined> {
        const user = new User();
        const passwordHash = await argon2.hash(password);
        user.name = name;
        user.email = email;
        user.password = passwordHash;
        return this.manager.save(user);
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return this.manager.findOne(User, {email});
    }

    async findById(id: number): Promise<User | undefined> {
        return this.manager.findOne(User, {id});
    }
}