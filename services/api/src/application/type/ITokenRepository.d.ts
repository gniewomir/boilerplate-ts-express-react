import {Token} from "../../database/entity/Token";
import {IRepository} from "../../database/type/IRepository";

export interface ITokenRepository extends IRepository {
    blacklist(token: string, user_id: number, expiration: Date): Promise<Token | undefined>

    isBlacklisted(token: string): Promise<boolean>

    find(token: string): Promise<Token | undefined>

    findByUser(userId: number): Promise<Token[]>

    exist(token: string): Promise<boolean>
}