import faker from "faker";
import {Container} from "typedi";
import {UserRepository} from "../../database/repository/UserRepository";
import {UserService} from "./UserService";
import {TokenRepository} from "../../database/repository/TokenRepository";
import {User} from "../../database/entity/User";
import {UnprocessableEntity} from "../../application/error/UnprocessableEntity";
import {getConnection} from "typeorm";
import {SetupApplication, SetupApplicationUserAndAuthentication} from "../../test/utility";
import {InvalidAuthentication} from "../../application/error/InvalidAuthentication";

afterAll(async () => {
    const connection = getConnection();
    if (connection.isConnected) {
        await connection.close();
    }
})

describe('User service', () => {
    describe('authenticateByCredentials', () => {
        it('creates valid authentication object', async () => {
            const {user, plainPassword} = await SetupApplicationUserAndAuthentication();
            const subject = Container.get(UserService);
            const authentication = await subject.authenticateByCredentials(
                {
                    email: user.email,
                    password: plainPassword
                });
            expect(authentication.isAuthenticated()).toBe(true);
            expect(authentication.getUser().id).toBe(user.id);
        });
        it('must reject empty password', async () => {
            const {user} = await SetupApplicationUserAndAuthentication();
            const subject = Container.get(UserService);
            expect.assertions(2)
            try {
                await subject.authenticateByCredentials(
                    {
                        email: user.email,
                        password: ''
                    });
            } catch (error) {
                expect(error).toBeInstanceOf(UnprocessableEntity)
                expect(error.getMessage()).toContain('Password cannot be empty')
            }
        });
        it('must reject invalid password', async () => {
            const {user} = await SetupApplicationUserAndAuthentication();
            const subject = Container.get(UserService);
            expect.assertions(2)
            try {
                await subject.authenticateByCredentials(
                    {
                        email: user.email,
                        password: 'invalid_password_for_sure'
                    });
            } catch (error) {
                expect(error).toBeInstanceOf(InvalidAuthentication)
                expect(error.getMessage()).toContain('invalid credentials')
            }
        });
    });
    describe('authenticateById', () => {
        it('authenticates user', async () => {
            const {user} = await SetupApplicationUserAndAuthentication();
            const subject = Container.get(UserService);
            const authentication = await subject.authenticateById(user.id);
            expect(authentication.isAuthenticated()).toBe(true);
            expect(authentication.getUser().id).toBe(user.id);
        });
    });
    describe('revokeAuthentication', () => {
        it('revokes user authentication', async () => {
            const {user} = await SetupApplicationUserAndAuthentication();
            const subject = Container.get(UserService);
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
            await SetupApplication();
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
            await SetupApplication();
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
            await SetupApplication();
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
            await SetupApplication();
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
    describe('update', () => {
        it('throws on empty password', async () => {
            await SetupApplication();
            const name = faker.name.findName();
            const email = faker.internet.email();
            const password = faker.internet.password();
            const user = await Container.get(UserService).register({
                name,
                email,
                password
            });
            expect.assertions(1);
            try {
                await Container.get(UserService).update(user.id, {
                    name,
                    email,
                    password: ''
                });
            } catch (error) {
                expect(error).toBeInstanceOf(UnprocessableEntity);
            }
        });
        it('throws on empty email', async () => {
            await SetupApplication();
            const name = faker.name.findName();
            const email = faker.internet.email();
            const password = faker.internet.password();
            const user = await Container.get(UserService).register({
                name,
                email,
                password
            });
            expect.assertions(1);
            try {
                await Container.get(UserService).update(user.id, {
                    name,
                    email: '',
                    password
                });
            } catch (error) {
                expect(error).toBeInstanceOf(UnprocessableEntity);
            }
        });
    });
});