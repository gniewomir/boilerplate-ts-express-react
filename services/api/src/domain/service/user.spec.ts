import {IUserDto} from "../interface/user";
import app from "../../application/loader";
import faker from "faker";
import {Container} from "typedi";
import UserRepository from "../../database/repository/user";
import UserService from "./user";
import {IUserService} from "../interface/IUserService";
import TokenRepository from "../../database/repository/token";
import {User} from "../../database/entity/User";
import UnprocessableEntity from "../../application/error/UnprocessableEntity";

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

describe('User service', () => {
    describe('authenticateByCredentials', () => {
        it('authenticates user', async () => {
            const {subject, user, password} = await getTestSubjectAndUser();
            const authentication = await subject.authenticateByCredentials(
                {
                    email: user.email,
                    password
                });
            expect(authentication.authenticated).toBe(true);
            expect(authentication.user.id).toBe(user.id);
        });
    });
    describe('authenticateById', () => {
        it('authenticates user', async () => {
            const {subject, user} = await getTestSubjectAndUser();
            const authentication = await subject.authenticateById(user.id);
            expect(authentication.authenticated).toBe(true);
            expect(authentication.user.id).toBe(user.id);
        });
    });
    describe('revokeAuthentication', () => {
        it('revokes user authentication', async () => {
            const {subject, user} = await getTestSubjectAndUser();
            const tokenRepository = Container.get(TokenRepository);
            const authentication = await subject.authenticateById(user.id);
            expect(authentication.authenticated).toBe(true);
            expect(authentication.user.id).toBe(user.id);
            await subject.revokeAuthentication(authentication.token.token);
            const token = await tokenRepository.find(authentication.token.token);
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
});