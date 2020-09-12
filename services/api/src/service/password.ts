import {Service} from 'typedi';
import {randomBytes} from 'crypto';
import argon2 from "argon2";

@Service()
export default class PasswordService implements IPasswordService {

    public async hashPassword(password: string): Promise<{ hashedPassword: string, salt: string }> {
        const salt = randomBytes(32);
        const hashedPassword = await argon2.hash(password, {salt});
        return Promise.resolve({hashedPassword, salt: salt.toString('hex')});
    }

    public async verifyPassword(password: string, hashedPassword: string, salt: string): Promise<boolean> {
        return await argon2.verify(hashedPassword, password, {salt: Buffer.from(salt, 'hex')});
    }

}