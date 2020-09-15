import AuthenticationService from "./authentication";
import {Container} from "typedi";
import UserRepository from "../../database/repository/user";
import faker from "faker";
import {User} from "../../database/entity/User";
import config from "../config";
import jwt from "jsonwebtoken";
import InvalidAuthentication from "../error/InvalidAuthentication";
import {IUserDto} from "../../domain/type/user";
import {IAuthenticationService} from "../type/IAuthenticationService";
import app from "../loader";
import {getConnection} from "typeorm";
import {ITokenPayload} from "../type/authentication";

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
    describe('createAuthentication', () => {
        it('returns token when user exists', async () => {
            const {subject, user} = await getTestSubjectAndUser();
            const authenticated = await subject.createAuthentication(user);
            expect(authenticated.token).toBeTruthy()
            expect(authenticated.user).toBeInstanceOf(User)
            expect(authenticated.user.id).toBe(user.id);
        });
    });

    describe('checkAuthentication', () => {
        it('reject expired tokens', async () => {
            const {subject, user} = await getTestSubjectAndUser();
            const expiration = Math.floor(Date.now() / 1000) - (config.security.authentication.jwt.token_expiration_in_minutes * 60);
            const payload = {
                user_id: user.id,
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
            const payload = {
                user_id: user.id,
                exp: Math.floor(Date.now() / 1000) + (config.security.authentication.jwt.token_expiration_in_minutes * 60),
            } as ITokenPayload;
            const token = jwt.sign(
                payload,
                config.security.authentication.jwt.secret,
            );

            await subject.revokeAuthentication(token);

            expect.assertions(2);
            try {
                await subject.checkAuthentication(token);
            } catch (error) {
                expect(error).toBeInstanceOf(InvalidAuthentication);
                expect(error.message).toBe("jwt blacklisted");
            }
        });
        it('reject token without valid signature', async () => {
            const {subject, user} = await getTestSubjectAndUser();
            const expiration = Math.floor(Date.now() / 1000) + (config.security.authentication.jwt.token_expiration_in_minutes * 60);
            const payload = {
                user_id: user.id,
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
                user_id: 2147483647,
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
