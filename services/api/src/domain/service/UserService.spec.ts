import {IUserDto} from "../type/user";
import {setupApplication as app} from "../../application/loader";
import faker from "faker";
import {Container} from "typedi";
import {UserRepository} from "../../database/repository/UserRepository";
import {UserService} from "./UserService";
import {IUserService} from "../type/IUserService";
import {TokenRepository} from "../../database/repository/TokenRepository";
import {User} from "../../database/entity/User";
import {UnprocessableEntity} from "../../application/error/UnprocessableEntity";
import {getConnection} from "typeorm";

const getTestSubjectAndUser = async (): Promise<{ subject: IUserService, user: IUserDto, password: string }> => {
    await app();

    const name = faker.name.findName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const user = await Container.get(UserRepository).createAndSave(name, email, password);

    return {
        subject: Container.get(UserService),
        user,
        password
    };
};

afterAll(async () => {
    const connection = getConnection();
    if (connection.isConnected) {
        await connection.close();
    }
})

describe('User service', () => {
    describe('authenticateByCredentials', () => {
        it('authenticates user', async () => {
            const {subject, user, password} = await getTestSubjectAndUser();
            const authentication = await subject.authenticateByCredentials(
                {
                    email: user.email,
                    password
                });
            expect(authentication.isAuthenticated()).toBe(true);
            expect(authentication.getUser().id).toBe(user.id);
        });
    });
    describe('authenticateById', () => {
        it('authenticates user', async () => {
            const {subject, user} = await getTestSubjectAndUser();
            const authentication = await subject.authenticateById(user.id);
            expect(authentication.isAuthenticated()).toBe(true);
            expect(authentication.getUser().id).toBe(user.id);
        });
    });
    describe('revokeAuthentication', () => {
        it('revokes user authentication', async () => {
            const {subject, user} = await getTestSubjectAndUser();
            const tokenRepository = Container.get(TokenRepository);
            const authentication = await subject.authenticateById(user.id);
            expect(authentication.isAuthenticated()).toBe(true);
            expect(authentication.getUser().id).toBe(user.id);
            await subject.revokeAuthentication(authentication.getToken().token);
            const token = await tokenRepository.find(authentication.getToken().token);
            expect(token.blacklisted).toBe(true);
        });
    });
    describe('register', () => {
        it('creates new user', async () => {
            const name = faker.name.findName();
            const email = faker.internet.email();
            const password = faker.internet.password();
            await Container.get(UserService).register({
                name,
                email,
                password
            });
            await expect(await Container.get(UserRepository).findByEmail(email)).toBeInstanceOf(User);
        });
        it('throws on already existing user', async () => {
            const name = faker.name.findName();
            const email = faker.internet.email();
            const password = faker.internet.password();
            await Container.get(UserService).register({
                name,
                email,
                password
            });
            expect.assertions(1);
            try {
                await Container.get(UserService).register({
                    name,
                    email,
                    password
                });
            } catch (error) {
                expect(error).toBeInstanceOf(UnprocessableEntity);
            }
        });
        it('returns DTO not entity', async () => {
            const name = faker.name.findName();
            const email = faker.internet.email();
            const password = faker.internet.password();
            const dto = await Container.get(UserService).register({
                name,
                email,
                password
            });
            expect(dto).not.toBeInstanceOf(User);
        });
    });
    describe('find', () => {
        it('returns DTO not entity', async () => {
            const name = faker.name.findName();
            const email = faker.internet.email();
            const password = faker.internet.password();
            const subject = Container.get(UserService)
            const user = await subject.register({
                name,
                email,
                password
            });
            const dto = subject.find(user.id)
            expect(dto).not.toBeInstanceOf(User);
        });
    });
});