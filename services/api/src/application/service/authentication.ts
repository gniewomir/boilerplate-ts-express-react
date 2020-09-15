import {Service} from 'typedi';
import PasswordService from "./password";
import UserRepository from "../../database/repository/user";
import jwt from "jsonwebtoken";
import config from '../config';
import InvalidAuthentication from "../error/InvalidAuthentication";
import TokenRepository from "../../database/repository/token";
import {IUserDto} from "../../domain/interface/user";
import {IAuthentication} from "../interface/IAuthentication";
import {IAuthenticationService} from "../interface/IAuthenticationService";
import {IToken} from "../interface/IToken";
import {ITokenPayload} from "../interface/ITokenPayload";
import {Response} from "express";
import InternalServerError from "../error/InternalServerError";
import {Entity} from "typeorm";

@Service()
export default class AuthenticationService implements IAuthenticationService {

    constructor(
        private passwordService: PasswordService,
        private userRepository: UserRepository,
        private tokenRepository: TokenRepository,
    ) {
    }

    private static generateToken(user: IUserDto): IToken {
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

    private static createAuthenticationObject(authenticated: boolean, user: IUserDto | null, token: IToken | null): IAuthentication {
        if (authenticated && (user === null || token === null)) {
            throw new InternalServerError('Creating successful authentication require both user and token.');
        }
        if (user instanceof Entity) {
            throw new InternalServerError('We do not pass entities around - only DTOs.');
        }
        return {
            authenticated,
            user,
            token
        };
    }

    public async checkAuthentication(token: string): Promise<IAuthentication> {
        try {
            const payload = jwt.verify(token, config.security.authentication.jwt.secret) as ITokenPayload;
            const user = await this.userRepository.findById(payload.user_id);
            if (!user) {
                throw new InvalidAuthentication('user not found');
            }
            if (await this.tokenRepository.isBlacklisted(token)) {
                throw new InvalidAuthentication('jwt blacklisted');
            }
            return AuthenticationService.createAuthenticationObject(
                true,
                user.toDTO(),
                {
                    token,
                    payload
                }
            );
        } catch (error) {
            throw new InvalidAuthentication(error.message, error);
        }
    }

    public async createAuthentication(user: IUserDto): Promise<IAuthentication> {
        return AuthenticationService.createAuthenticationObject(
            true,
            user,
            AuthenticationService.generateToken(user)
        );
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

    public authenticationFromResponse(res: Response): IAuthentication {
        if (res.locals.authentication) {
            return res.locals.authentication;
        }
        return AuthenticationService.createAuthenticationObject(
            false,
            null,
            null
        );
    }
}