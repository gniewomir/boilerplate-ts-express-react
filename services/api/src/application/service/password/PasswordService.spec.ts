import * as faker from 'faker';
import {PasswordService} from "./PasswordService";

describe('Password service', () => {
    describe('hashPassword', () => {
        it('returns password hash', async () => {
            const subject = new PasswordService();
            const password = faker.internet.password(12);
            const hashed = await subject.hashPassword(password);
            expect(hashed.hashedPassword).not.toEqual(password);
            expect(hashed.hashedPassword).toContain('argon2');
            expect(hashed.salt).not.toBeFalsy();
        });
    });
    describe('verifyPassword', () => {
        it('return true on valid password', async () => {
            const subject = new PasswordService();
            const password = faker.internet.password(12);
            const hashed = await subject.hashPassword(password);
            const valid = await subject.verifyPassword(password, hashed.hashedPassword, hashed.salt);
            expect(valid).toBeTruthy();
        });
    });
    describe('verifyPassword', () => {
        it('return false on invalid password', async () => {
            const subject = new PasswordService();
            const password = faker.internet.password(12);
            const invalidPassword = faker.internet.password(12);
            const hashed = await subject.hashPassword(password);
            const valid = await subject.verifyPassword(invalidPassword, hashed.hashedPassword, hashed.salt);
            expect(valid).toBeFalsy();
        });
    });
});