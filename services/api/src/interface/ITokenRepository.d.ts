import {Token} from "../entity/Token";

interface ITokenRepository {
    blacklist(token: string, user_id: number, expiration: Date): Promise<Token | undefined>

    isBlacklisted(token: string): Promise<boolean>

    find(token: string): Promise<Token | undefined>

    exist(token: string): Promise<boolean>
}