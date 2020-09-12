import {Service} from 'typedi';
import PasswordService from "./password";
import UserRepository from "../repository/user";
import jwt from "jsonwebtoken";
import config from '../config';
import moment from "moment";
import InvalidAuthentication from "../error/InvalidAuthentication";
import TokenRepository from "../repository/token";
import {IUser} from "../interface/IUser";
import {IAuthenticated} from "../interface/IAuthenticated";
import {IAuthenticationService} from "../interface/IAuthenticationService";

@Service()
export default class AuthenticationService implements IAuthenticationService {

    constructor(
        private passwordService: PasswordService,
        private userRepository: UserRepository,
        private tokenRepository: TokenRepository,
    ) {
    }

    private static generateToken(user: IUser): IToken {
        const expiration = moment(new Date())
            .add(config.authentication.jwt.token_expiration_in_minutes, 'm')
            .toDate()
            .getSeconds();
        const payload = {
            user_id: user.id,
            exp: expiration
        };
        return {
            token: jwt.sign(
                payload,
                config.authentication.jwt.secret
            ),
            payload
        };
    }

    public async checkAuthentication(token: string): Promise<IAuthenticated> {
        try {
            const payload = jwt.verify(token, config.authentication.jwt.secret) as ITokenPayload;
            const user = await this.userRepository.findById(payload.user_id);
            if (!user) {
                throw new InvalidAuthentication('user not found');
            }
            if (await this.tokenRepository.isBlacklisted(token)) {
                throw new InvalidAuthentication('jwt blacklisted');
            }
            return {
                user,
                token: {
                    token,
                    payload
                }
            };
        } catch (error) {
            throw new InvalidAuthentication(error.message, error);
        }
    }

    public async createAuthentication(user: IUser): Promise<IAuthenticated> {
        return {
            user,
            token: AuthenticationService.generateToken(user)
        };
    }

    public async revokeAuthentication(token: string): Promise<undefined> {
        try {
            const {token: {payload}} = await this.checkAuthentication(token);
            await this.tokenRepository.blacklist(token, payload.user_id, payload.exp);
        } catch (error) {
            if (error instanceof InvalidAuthentication) {
                return;
            }
            throw error;
        }
    }
}