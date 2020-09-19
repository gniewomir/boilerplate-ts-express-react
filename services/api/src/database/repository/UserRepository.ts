import {IUserRepository} from "../../domain/type/IUserRepository";
import {User} from "../entity/User";
import {Connection} from "typeorm";
import {Service} from "typedi";
import {InjectConnection} from "typeorm-typedi-extensions";
import {PasswordService} from "../../application/service/password/PasswordService";
import {IUserDto, IUserUpdateInputDTO} from "../../domain/type/user";

@Service()
export class UserRepository implements IUserRepository {

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

    public async update(userId: number, update: IUserUpdateInputDTO): Promise<User | undefined> {
        const user = await this.findById(userId);
        update = {
            ...user as IUserDto,
            ...update,
        }
        if (update.password) {
            const hashed = await this.passwordService.hashPassword(update.password);
            update = {
                ...update,
                password: hashed.hashedPassword,
                salt: hashed.salt
            } as User
        }
        await this.connection.manager.update(
            User,
            {id: userId},
            update
        );
        return await this.findById(userId);
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

    public getEntityName(): string {
        return User.name;
    }


}
