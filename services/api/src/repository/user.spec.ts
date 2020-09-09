import UserRepository from "./user";
import * as faker from 'faker';
import {User} from "../entity/User";
import postgres from "../loaders/postgres";

describe('The user repository', () => {
    describe('createAndSave', () => {
        it('should create user', async () => {
            const postgresConnection = await postgres();
            const repository = postgresConnection.getCustomRepository(UserRepository);
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
    describe('findById', () => {
        it('should find user by id', async () => {
            const postgresConnection = await postgres();
            const repository = postgresConnection.getCustomRepository(UserRepository);
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
        })
    });
    describe('findById', () => {
        it('should return undefined for non existent user', async () => {
            const postgresConnection = await postgres();
            const repository = postgresConnection.getCustomRepository(UserRepository);
            const user = await repository.findById(2147483647);
            expect(user).toBeUndefined();
        })
    });
    describe('findByEmail', () => {
        it('should find user by email', async () => {
            const postgresConnection = await postgres();
            const repository = postgresConnection.getCustomRepository(UserRepository);
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
            const postgresConnection = await postgres();
            const repository = postgresConnection.getCustomRepository(UserRepository);
            const user = await repository.findByEmail('email.faker.cannot.even.dream.about@gmail.com');
            expect(user).toBeUndefined();
        })
    });
});