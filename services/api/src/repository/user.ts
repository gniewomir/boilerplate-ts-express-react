import {IUserRepository} from "../interface/IUserRepository";
import {User} from "../entity/User";
import {Connection} from "typeorm";
import {Service} from "typedi";
import {InjectConnection} from "typeorm-typedi-extensions";
import PasswordService from "../service/password";

@Service()
export default class UserRepository implements IUserRepository {

    constructor(
        @InjectConnection() private connection: Connection,
        private passwordService: PasswordService,
    ) {
    }

    public async createAndSave(name: string, email: string, password: string): Promise<User | undefined> {
        const user = new User();
        const hashed = await this.passwordService.hashPassword(password);
        user.name = name;
        user.email = email;
        user.password = hashed.hashedPassword;
        user.salt = hashed.salt;
        return this.connection.manager.save(User, user);
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        return this.connection.manager.findOne(User, {email});
    }

    public async findById(id: number): Promise<User | undefined> {
        return this.connection.manager.findOne(User, {id});
    }

    public async exists(id: number): Promise<boolean> {
        const user = await this.findById(id);
        return user !== undefined;
    }
}
