import {Service} from "typedi";
import {UserRepository} from "../../../database/repository/UserRepository";
import {TokenRepository} from "../../../database/repository/TokenRepository";
import {IUserDto} from "../../../domain/type/user";
import {IAuthentication, IToken, ITokenPayload} from "../../type/authentication";
import {config} from "../../config";
import jwt from "jsonwebtoken";
import {InvalidAuthentication} from "../../error/InvalidAuthentication";
import {Response} from "express";
import {Authentication} from "./Authentication";
import {PasswordService} from "../password/PasswordService";
import {PermissionsList} from "../../type/authorization";
import {Forbidden} from "../../error/Forbidden";
import {AuthenticationFailed} from "./AuthenticationFailed";
import {UserRole} from "../authorization/role/UserRole";
import {RefreshTokenRole} from "../authorization/role/RefreshTokenRole";

export interface IAuthenticationService {

    checkAuthentication(token: string): Promise<IAuthentication>

    createAuthentication(user: IUserDto, permissions: PermissionsList, tokenExpirationInMinutes: number): Promise<IAuthentication>

    createUserAuthentication(user: IUserDto): Promise<IAuthentication>

    createRefreshTokenAuthentication(user: IUserDto): Promise<IAuthentication>

    revokeToken(token: string): Promise<void>

    authenticateResponse(token: string, res: Response): Promise<void>;

    getAuthenticationFromResponse(res: Response): IAuthentication;

}

@Service()
export class AuthenticationService implements IAuthenticationService {

    constructor(
        private passwordService: PasswordService,
        private userRepository: UserRepository,
        private tokenRepository: TokenRepository,
        private userRole: UserRole,
        private refreshTokenRole: RefreshTokenRole
    ) {
    }

    private static createToken(user: IUserDto, permissions: PermissionsList, expirationInMinutes: number): IToken {
        const now = Date.now();
        const payload = {
            userId: user.id,
            exp: Math.floor(now / 1000) + (expirationInMinutes * 60),
            iat: now / 1000,
            permissions
        } as ITokenPayload;
        return {
            token: jwt.sign(
                payload,
                config.security.authentication.jwt.secret
            ),
            payload
        };
    }

    public async checkAuthentication(token: string): Promise<IAuthentication> {
        try {
            const payload = jwt.verify(token, config.security.authentication.jwt.secret) as ITokenPayload;
            const user = await this.userRepository.findById(payload.userId);
            if (!user) {
                throw new InvalidAuthentication('user not found');
            }
            if (await this.tokenRepository.isBlacklisted(token)) {
                throw new InvalidAuthentication('jwt blacklisted');
            }
            return new Authentication(
                {
                    token,
                    payload
                },
                user.toDTO()
            );
        } catch (error) {
            if (error instanceof InvalidAuthentication || error instanceof Forbidden) {
                throw error;
            }
            throw new InvalidAuthentication(error.message, error);
        }
    }

    public async createAuthentication(user: IUserDto, permissions: PermissionsList, expirationInMinutes: number): Promise<IAuthentication> {
        return new Authentication(
            AuthenticationService.createToken(
                user,
                permissions,
                expirationInMinutes
            ),
            user
        );
    }

    public async createUserAuthentication(user: IUserDto): Promise<IAuthentication> {
        return this.createAuthentication(
            user,
            this.userRole.permissions(user.id),
            config.security.authentication.jwt.token_expiration_in_minutes
        );
    }

    public async createRefreshTokenAuthentication(user: IUserDto): Promise<IAuthentication> {
        return this.createAuthentication(
            user,
            this.refreshTokenRole.permissions(user.id),
            config.security.authentication.jwt.refresh_token_expiration_in_minutes
        );
    }

    public async revokeToken(token: string): Promise<void> {
        try {
            const authentication = await this.checkAuthentication(token);
            const {payload} = authentication.getToken();
            await this.tokenRepository.blacklist(token, payload.userId, new Date(payload.exp * 1000));
        } catch (error) {
            if (error instanceof InvalidAuthentication) {
                return;
            }
            throw error;
        }
    }

    public async authenticateResponse(token: string, res: Response): Promise<void> {
        if (!token) {
            throw new InvalidAuthentication('Token cannot be empty.');
        }
        res.locals.authentication = await this.checkAuthentication(token);
    }

    public getAuthenticationFromResponse(res: Response): IAuthentication {
        if (res.locals.authentication && res.locals.authentication instanceof Authentication) {
            return res.locals.authentication;
        }
        return new AuthenticationFailed();
    }
}