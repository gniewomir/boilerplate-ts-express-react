import {UserRepository} from "./UserRepository";
import * as faker from 'faker';
import {User} from "../entity/User";
import {establishDatabaseConnection} from "../../application/loader/postgres";
import {IUserRepository} from "../../domain/type/IUserRepository";
import {Container} from "typedi";
import {PasswordService} from "../../application/service/password/PasswordService";
import {CleanupAfterAll} from "../../test/utility";

const getRepository = async (): Promise<IUserRepository> => {
    const postgresConnection = await establishDatabaseConnection();
    return new UserRepository(
        postgresConnection,
        Container.get(PasswordService)
    );
}

afterAll(CleanupAfterAll)

describe('The user repository', () => {
    describe('createAndSave', () => {
        it('must create user', async () => {
            const repository = await getRepository();

            const name = faker.name.findName();
            const email = faker.internet.email();
            const password = faker.internet.password();
            const user = await repository.createAndSave(name, email, password);
            expect(user).toBeInstanceOf(User);
            expect(user.name).toBe(name);
            expect(user.email).toBe(email);
            expect(user.password).toBeTruthy();
            expect(user.password).not.toBe(password);
        })
    });

    describe('update', () => {
        it('must hash provided password', async () => {
            const repository = await getRepository();

            const name = faker.name.findName();
            const email = faker.internet.email();
            const password = faker.internet.password();
            const user = await repository.createAndSave(name, email, password);

            const newPassword = faker.internet.password();

            await repository.update(
                user.id,
                {
                    password: newPassword
                }
            );

            const userAfterUpdate = await repository.findById(user.id);

            expect(userAfterUpdate.password).not.toBe(newPassword);
        })
        it('must update email and name', async () => {
            const repository = await getRepository();

            const name = faker.name.findName();
            const email = faker.internet.email();
            const password = faker.internet.password();
            const user = await repository.createAndSave(name, email, password);

            const newName = faker.name.findName();
            const newEmail = faker.internet.email();

            const userAfterUpdate = await repository.update(
                user.id,
                {
                    name: newName,
                    email: newEmail,
                }
            );

            expect(userAfterUpdate).toBeInstanceOf(User);
            expect(userAfterUpdate.id).toBe(user.id);
            expect(userAfterUpdate.name).toBe(newName);
            expect(userAfterUpdate.email).toBe(newEmail);
        })

    });

    describe('findById', () => {
        it('should find user by id', async () => {
            const repository = await getRepository();

            const name = faker.name.findName();
            const email = faker.internet.email();
            const password = faker.internet.password();
            const user = await repository.createAndSave(name, email, password);
            const found = await repository.findById(user.id);
            expect(found).toBeInstanceOf(User);
            expect(found.name).toBe(name);
            expect(found.email).toBe(email);
            expect(found.password).toBeTruthy();
            expect(found.password).not.toBe(password);
            expect(found.salt).toBeTruthy();
        })
    });

    describe('findById', () => {
        it('should return undefined for non existent user', async () => {
            const repository = await getRepository();

            const user = await repository.findById(2147483647);
            expect(user).toBeUndefined();
        })
    });

    describe('findByEmail', () => {
        it('should find user by email', async () => {
            const repository = await getRepository();

            const name = faker.name.findName();
            const email = faker.internet.email();
            const password = faker.internet.password();
            const user = await repository.createAndSave(name, email, password);
            const found = await repository.findByEmail(user.email);
            expect(found).toBeInstanceOf(User);
            expect(found.name).toBe(name);
            expect(found.email).toBe(email);
            expect(found.password).toBeTruthy();
            expect(found.password).not.toBe(password);
        })
    });

    describe('findByEmail', () => {
        it('should return undefined for non existent user', async () => {
            const repository = await getRepository();

            const user = await repository.findByEmail('email.faker.cannot.even.dream.about@gmail.com');
            expect(user).toBeUndefined();
        })
    });

    describe('exists', () => {
        it('should return false for non existent user', async () => {
            const repository = await getRepository();
            const exist = await repository.exists(2147483647);

            expect(exist).toBe(false);
        });
        it('should return true for existing user', async () => {
            const repository = await getRepository();

            const name = faker.name.findName();
            const email = faker.internet.email();
            const password = faker.internet.password();
            const user = await repository.createAndSave(name, email, password);
            const exist = await repository.exists(user.id);

            expect(exist).toBe(true);
        })
    });
});