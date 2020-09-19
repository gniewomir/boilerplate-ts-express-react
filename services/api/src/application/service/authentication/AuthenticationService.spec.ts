import {Container} from "typedi";
import {UserRepository} from "../../../database/repository/UserRepository";
import faker from "faker";
import {config} from "../../config";
import jwt from "jsonwebtoken";
import {InvalidAuthentication} from "../../error/InvalidAuthentication";
import {IUserDto} from "../../../domain/type/user";
import {IAuthenticationService} from "../../type/IAuthenticationService";
import {setupApplication as app} from "../../loader";
import {getConnection} from "typeorm";
import {ITokenPayload} from "../../type/authentication";
import {AuthenticationService} from "./AuthenticationService";
import {AuthenticatePermission} from "../../permission/AuthenticatePermission";
import {AuthenticationRefreshPermission} from "../../permission/AuthenticationRefreshPermission";

const getTestSubjectAndUser = async (): Promise<{ subject: IAuthenticationService, user: IUserDto, password: string }> => {
    await app();

    const name = faker.name.findName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const user = await Container.get(UserRepository).createAndSave(name, email, password);

    return {
        subject: Container.get(AuthenticationService),
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

describe('Authentication service', () => {
    describe('createUserAuthentication', () => {
        it('returns token when user exists', async () => {
            const {subject, user} = await getTestSubjectAndUser();
            const authenticated = await subject.createUserAuthentication(user);
            expect(authenticated.getToken()).toBeTruthy()
            expect(authenticated.getUser().id).toBe(user.id);
        });
        it('contains permission to authenticate, but not to refresh ', async () => {
            const {subject, user} = await getTestSubjectAndUser();
            const authenticated = await subject.createUserAuthentication(user);
            expect(authenticated.granted(new AuthenticationRefreshPermission())).toBe(false)
            expect(authenticated.granted(new AuthenticatePermission())).toBe(true)
        });
    });

    describe('createRefreshTokenAuthentication', () => {
        it('returns token when user exists', async () => {
            const {subject, user} = await getTestSubjectAndUser();
            const authenticated = await subject.createRefreshTokenAuthentication(user);
            expect(authenticated.getToken()).toBeTruthy()
            expect(authenticated.getUser().id).toBe(user.id);
        });
        it('contains permission to refresh, but not to authenticate', async () => {
            const {subject, user} = await getTestSubjectAndUser();
            const authenticated = await subject.createRefreshTokenAuthentication(user);
            expect(authenticated.granted(new AuthenticationRefreshPermission())).toBe(true)
            expect(authenticated.granted(new AuthenticatePermission())).toBe(false)
        });
    });

    describe('checkAuthentication', () => {
        it('reject expired tokens', async () => {
            const {subject, user} = await getTestSubjectAndUser();
            const expiration = Math.floor(Date.now() / 1000) - (config.security.authentication.jwt.token_expiration_in_minutes * 60);
            const payload = {
                userId: user.id,
                exp: expiration,
            } as ITokenPayload;

            expect.assertions(2);
            try {
                await subject.checkAuthentication(jwt.sign(
                    payload,
                    config.security.authentication.jwt.secret,
                ));
            } catch (error) {
                expect(error).toBeInstanceOf(InvalidAuthentication);
                expect(error.message).toBe("jwt expired");
            }
        });
        it('reject blacklisted tokens', async () => {
            const {subject, user} = await getTestSubjectAndUser();
            const authentication = await subject.createUserAuthentication(user);

            await subject.revokeToken(authentication.getToken().token);

            expect.assertions(2);
            try {
                await subject.checkAuthentication(authentication.getToken().token);
            } catch (error) {
                expect(error).toBeInstanceOf(InvalidAuthentication);
                expect(error.getMessage()).toBe("jwt blacklisted");
            }
        });
        it('reject token without valid signature', async () => {
            const {subject, user} = await getTestSubjectAndUser();
            const expiration = Math.floor(Date.now() / 1000) + (config.security.authentication.jwt.token_expiration_in_minutes * 60);
            const payload = {
                userId: user.id,
                exp: expiration,
            } as ITokenPayload;

            expect.assertions(2);
            try {
                await subject.checkAuthentication(jwt.sign(
                    payload,
                    `INVALID_${config.security.authentication.jwt.secret}`,
                ));
            } catch (error) {
                expect(error).toBeInstanceOf(InvalidAuthentication);
                expect(error.message).toBe("invalid signature");
            }
        });

        it('reject token for non existent user', async () => {
            const {subject} = await getTestSubjectAndUser();
            const expiration = Math.floor(Date.now() / 1000) + (config.security.authentication.jwt.token_expiration_in_minutes * 60);
            const payload = {
                userId: 2147483647,
                exp: expiration,
            } as ITokenPayload;

            expect.assertions(2);
            try {
                await subject.checkAuthentication(jwt.sign(
                    payload,
                    config.security.authentication.jwt.secret,
                ));
            } catch (error) {
                expect(error).toBeInstanceOf(InvalidAuthentication);
                expect(error.message).toBe('user not found');
            }
        });

    });

});
