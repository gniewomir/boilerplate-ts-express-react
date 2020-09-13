import {IUser} from "../interface/IUser";
import app from "../loader";
import faker from "faker";
import {Container} from "typedi";
import UserRepository from "../repository/user";
import UserService from "./user";
import {IUserService} from "../interface/IUserService";
import TokenRepository from "../repository/token";

const getTestSubjectAndUser = async (): Promise<{ subject: IUserService, user: IUser, password: string }> => {
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
            const authentication = await subject.authenticateByCredentials(user.email, password);
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
});