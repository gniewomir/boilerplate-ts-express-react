import {Service} from "typedi";
import {IPasswordService} from "../../type/IPasswordService";
import {randomBytes} from "crypto";
import argon2 from "argon2";
import {UnprocessableEntity} from "../../error/UnprocessableEntity";

@Service()
export class PasswordService implements IPasswordService {

    public async hashPassword(password: string): Promise<{ hashedPassword: string, salt: string }> {
        if (!password) {
            throw new UnprocessableEntity('Cannot process empty password!', 'password')
        }
        const salt = randomBytes(32);
        const hashedPassword = await argon2.hash(password, {salt});
        return Promise.resolve({hashedPassword, salt: salt.toString('hex')});
    }

    public async verifyPassword(password: string, hashedPassword: string, salt: string): Promise<boolean> {
        if (!password) {
            throw new UnprocessableEntity('Cannot process empty password!', 'password')
        }
        return await argon2.verify(hashedPassword, password, {salt: Buffer.from(salt, 'hex')});
    }

}