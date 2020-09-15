import {Service} from "typedi";
import {Token} from "../entity/Token";
import {InjectConnection} from "typeorm-typedi-extensions";
import {Connection} from "typeorm";
import {ITokenRepository} from "../../application/type/ITokenRepository";
import UserRepository from "./user";


@Service()
export default class TokenRepository implements ITokenRepository {

    constructor(
        @InjectConnection() private connection: Connection,
        private userRepository: UserRepository
    ) {
    }

    public async blacklist(token: string, userId: number, expiration: Date): Promise<Token> {
        if (!await this.exist(token)) {
            const entity = new Token()

            entity.token = token;
            entity.user = await this.userRepository.findById(userId);
            entity.expiration = expiration;
            entity.blacklisted = true;

            await this.connection.manager.save(Token, entity);
        }
        if (!await this.isBlacklisted(token)) {
            await this.connection.manager.update(Token, {token}, {blacklisted: true});
        }
        return this.find(token);
    }

    public async exist(token: string): Promise<boolean> {
        const entity = await this.find(token);
        return entity !== undefined;
    }

    public async find(token: string): Promise<Token | undefined> {
        return this.connection.manager.findOne(Token, {token});
    }

    public async isBlacklisted(token: string): Promise<boolean> {
        const entity = await this.find(token);
        if (entity === undefined) {
            return false;
        }
        return entity.blacklisted;
    }

}
