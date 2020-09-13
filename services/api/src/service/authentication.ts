import {Service} from 'typedi';
import PasswordService from "./password";
import UserRepository from "../repository/user";
import jwt from "jsonwebtoken";
import config from '../config';
import InvalidAuthentication from "../error/InvalidAuthentication";
import TokenRepository from "../repository/token";
import {IUser} from "../interface/IUser";
import {IAuthenticated} from "../interface/IAuthenticated";
import {IAuthenticationService} from "../interface/IAuthenticationService";
import {IToken} from "../interface/IToken";
import {ITokenPayload} from "../interface/ITokenPayload";
import {Response} from "express";

@Service()
export default class AuthenticationService implements IAuthenticationService {

    constructor(
        private passwordService: PasswordService,
        private userRepository: UserRepository,
        private tokenRepository: TokenRepository,
    ) {
    }

    private static generateToken(user: IUser): IToken {
        const payload = {
            user_id: user.id,
            exp: Math.floor(Date.now() / 1000) + (config.security.authentication.jwt.token_expiration_in_minutes * 60)
        };
        return {
            token: jwt.sign(
                payload,
                config.security.authentication.jwt.secret
            ),
            payload
        };
    }

    public async checkAuthentication(token: string): Promise<IAuthenticated> {
        try {
            const payload = jwt.verify(token, config.security.authentication.jwt.secret) as ITokenPayload;
            const user = await this.userRepository.findById(payload.user_id);
            if (!user) {
                throw new InvalidAuthentication('user not found');
            }
            if (await this.tokenRepository.isBlacklisted(token)) {
                throw new InvalidAuthentication('jwt blacklisted');
            }
            return {
                authenticated: true,
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
            authenticated: true,
            user,
            token: AuthenticationService.generateToken(user)
        };
    }

    public async revokeAuthentication(token: string): Promise<undefined> {
        try {
            const {token: {payload}} = await this.checkAuthentication(token);
            await this.tokenRepository.blacklist(token, payload.user_id, new Date(payload.exp * 1000));
        } catch (error) {
            if (error instanceof InvalidAuthentication) {
                return;
            }
            throw error;
        }
    }

    public async authenticateResponse(token: string, res: Response): Promise<Response> {
        res.locals.authentication = await this.checkAuthentication(token);
        return undefined;
    }

    public authenticationFromResponse(res: Response): IAuthenticated {
        if (res.locals.authentication) {
            return res.locals.authentication;
        }
        return {
            authenticated: false,
            user: null,
            token: null
        };
    }
}