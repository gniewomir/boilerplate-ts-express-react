import {IUserDto} from "../../../domain/type/user";
import {setupApplication as app} from "../../loader";
import faker from "faker";
import {Container} from "typedi";
import {UserRepository} from "../../../database/repository/UserRepository";
import {AuthenticationService} from "./AuthenticationService";
import {IAuthentication} from "../../type/authentication";
import {getConnection} from "typeorm";

const getUserAndSubject = async (): Promise<{ authentication: IAuthentication, user: IUserDto, password: string }> => {
    await app();

    const name = faker.name.findName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const user = await Container.get(UserRepository).createAndSave(name, email, password);

    return {
        authentication: await Container.get(AuthenticationService).createAuthentication(user),
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

describe('Authentication object', () => {
    it('Is sealed', async () => {
        const {authentication} = await getUserAndSubject();

        try {
            // @ts-ignore
            authentication.test = 'test';
        } catch (error) {
            expect(error.name).toBe('TypeError');
        }

    });
    it('Is immutable', async () => {
        const {authentication} = await getUserAndSubject();

        const token = authentication.getToken();
        const user = authentication.getUser();
        const mutatedToken = 'test';
        const mutatedUserId = user.id + 1;

        token.token = mutatedToken;
        user.id = mutatedUserId;

        expect(authentication.getToken().token).not.toBe(mutatedToken)
        expect(authentication.getUser().id).not.toBe(mutatedUserId)
    })
});
