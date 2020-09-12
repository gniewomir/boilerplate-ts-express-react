import postgres from "../loader/postgres";
import {ITokenRepository} from "../interface/ITokenRepository";
import TokenRepository from "./token";
import {User} from "../entity/User";
import {Container} from "typedi";
import UserRepository from "./user";
import AuthenticationService from "../service/authentication";
import {Token} from "../entity/Token";
import * as faker from 'faker';

const getSubjectAndUser = async (): Promise<{ subject: ITokenRepository, user: User }> => {
    await postgres();
    return {
        subject: await Container.get(TokenRepository),
        user: await Container.get(UserRepository).createAndSave(faker.name.findName(), faker.internet.email(), faker.internet.password())
    };
}

describe('The token repository', () => {

    describe('blacklist', () => {
        it('saves token to database as blacklisted', async () => {
            const {subject, user} = await getSubjectAndUser();
            const {token} = await Container.get(AuthenticationService).createAuthentication(user);
            await subject.blacklist(token.token, user.id, token.payload.exp);
            const entity = await subject.find(token.token);
            expect(entity).toBeInstanceOf(Token);
            expect(entity.token).toBe(token.token);
            expect(entity.blacklisted).toBe(true);
        });
    });

    describe('isBlacklisted', () => {
        it('returns true when provided with blacklisted token', async () => {
            const {subject, user} = await getSubjectAndUser();
            const {token} = await Container.get(AuthenticationService).createAuthentication(user);
            await subject.blacklist(token.token, user.id, token.payload.exp);
            const blacklisted = await subject.isBlacklisted(token.token);
            expect(blacklisted).toBe(true);
        });
        it('returns false when provided with non existent token', async () => {
            const {subject, user} = await getSubjectAndUser();
            const {token} = await Container.get(AuthenticationService).createAuthentication(user);
            const blacklisted = await subject.isBlacklisted(token.token);
            expect(blacklisted).toBe(false);
        });
    });

    describe('exist', () => {
        it('returns true when provided with existing token', async () => {
            const {subject, user} = await getSubjectAndUser();
            const {token} = await Container.get(AuthenticationService).createAuthentication(user);
            await subject.blacklist(token.token, user.id, token.payload.exp);
            const exists = await subject.exist(token.token);
            expect(exists).toBe(true);
        });
        it('returns false when provided with non existent token', async () => {
            const {subject, user} = await getSubjectAndUser();
            const {token} = await Container.get(AuthenticationService).createAuthentication(user);
            const exists = await subject.exist(token.token);
            expect(exists).toBe(false);
        });
    });

    describe('find', () => {
        it('returns token when token exists', async () => {
            const {subject, user} = await getSubjectAndUser();
            const {token} = await Container.get(AuthenticationService).createAuthentication(user);
            await subject.blacklist(token.token, user.id, token.payload.exp);
            const entity = await subject.find(token.token);
            expect(entity).toBeInstanceOf(Token);
            expect(entity.token).toBe(token.token);
        });
        it('returns undefined when token not exists', async () => {
            const {subject, user} = await getSubjectAndUser();
            const {token} = await Container.get(AuthenticationService).createAuthentication(user);
            const entity = await subject.find(token.token);
            expect(entity).not.toBeInstanceOf(Token);
            expect(entity).toBe(undefined);
        });
    });

});