import {TokenRepository} from "./TokenRepository";
import {Container} from "typedi";
import {UserRepository} from "./UserRepository";
import {Token} from "../entity/Token";
import * as faker from 'faker';
import {AuthenticationService} from "../../application/service/authentication/AuthenticationService";
import {cleanupTestDatabaseConnection, fakeUniqueUserEmail, setupTestApplicationUserAndAuthentication} from "../../test/utility";
import {TokenExpirationToDate} from "../../test/utility/date";

afterAll(cleanupTestDatabaseConnection)

describe('The token repository', () => {

    describe('blacklist', () => {
        it('saves token to database as blacklisted', async () => {
            const {authentication, user} = await setupTestApplicationUserAndAuthentication();
            const token = authentication.getToken();
            const subject = await Container.get(TokenRepository);

            await subject.blacklist(token.token, user.id, TokenExpirationToDate(token.payload.exp));

            const entity = await subject.find(token.token);

            expect(entity).toBeInstanceOf(Token);
            expect(entity.token).toBe(token.token);
            expect(entity.blacklisted).toBe(true);

            expect(entity.expiration.getMinutes()).toBe(TokenExpirationToDate(token.payload.exp).getMinutes());
            expect(entity.expiration.getMonth()).toBe(TokenExpirationToDate(token.payload.exp).getMonth());
            expect(entity.expiration.getFullYear()).toBe(TokenExpirationToDate(token.payload.exp).getFullYear());
        });
    });

    describe('isBlacklisted', () => {
        it('returns true when provided with blacklisted token', async () => {
            const {authentication, user} = await setupTestApplicationUserAndAuthentication();
            const token = authentication.getToken();
            const subject = await Container.get(TokenRepository);

            await subject.blacklist(token.token, user.id, new Date(token.payload.exp * 1000));
            const blacklisted = await subject.isBlacklisted(token.token);
            expect(blacklisted).toBe(true);
        });
        it('returns false when provided with non existent token', async () => {
            const subject = await Container.get(TokenRepository);
            const user = await Container.get(UserRepository).createAndSave(faker.name.findName(), await fakeUniqueUserEmail(), faker.internet.password());
            const authentication = await Container.get(AuthenticationService).createUserAuthentication(user.toDTO());
            const token = authentication.getToken();
            const blacklisted = await subject.isBlacklisted(token.token);
            expect(blacklisted).toBe(false);
        });
    });

    describe('exist', () => {
        it('returns true when provided with existing token', async () => {
            const {authentication, user} = await setupTestApplicationUserAndAuthentication();
            const token = authentication.getToken();
            const subject = await Container.get(TokenRepository);

            await subject.blacklist(token.token, user.id, new Date(token.payload.exp * 1000));
            const exists = await subject.exist(token.token);
            expect(exists).toBe(true);
        });
        it('returns false when provided with non existent token', async () => {
            const {authentication, user} = await setupTestApplicationUserAndAuthentication();
            const token = authentication.getToken();
            const subject = await Container.get(TokenRepository);

            const exists = await subject.exist(token.token);
            expect(exists).toBe(false);
        });
    });

    describe('find', () => {
        it('returns token when token exists', async () => {
            const {authentication, user} = await setupTestApplicationUserAndAuthentication();
            const token = authentication.getToken();
            const subject = await Container.get(TokenRepository);

            await subject.blacklist(token.token, user.id, new Date(token.payload.exp * 1000));
            const entity = await subject.find(token.token);
            expect(entity).toBeInstanceOf(Token);
            expect(entity.token).toBe(token.token);
        });
        it('returns undefined when token not exists', async () => {
            const {authentication, user} = await setupTestApplicationUserAndAuthentication();
            const token = authentication.getToken();
            const subject = await Container.get(TokenRepository);

            const entity = await subject.find(token.token);
            expect(entity).not.toBeInstanceOf(Token);
            expect(entity).toBe(undefined);
        });
    });

    describe('findByUser', () => {
        it('returns user tokens', async () => {
            const {authentication, user} = await setupTestApplicationUserAndAuthentication();
            const token = authentication.getToken();
            const subject = await Container.get(TokenRepository);

            await subject.blacklist('test_first', user.id, new Date(token.payload.exp * 1000));
            await subject.blacklist('test_second', user.id, new Date(token.payload.exp * 1000));
            const tokens = await subject.findByUser(user.id);

            expect(tokens[0].token).toBe('test_first');
            expect(tokens[1].token).toBe('test_second');
        });
        it('returns empty array when no tokes exist for user', async () => {
            const {user} = await setupTestApplicationUserAndAuthentication();
            const subject = await Container.get(TokenRepository);

            const tokens = await subject.findByUser(user.id);
            expect(tokens).toStrictEqual([]);
        });
    });

});