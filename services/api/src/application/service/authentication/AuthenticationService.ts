import {Service} from "typedi";
import {IAuthenticationService} from "../../type/IAuthenticationService";
import {UserRepository} from "../../../database/repository/UserRepository";
import {TokenRepository} from "../../../database/repository/TokenRepository";
import {IUserDto} from "../../../domain/type/user";
import {IAuthentication, IToken, ITokenPayload, PermissionsList} from "../../type/authentication";
import {config} from "../../config";
import jwt from "jsonwebtoken";
import {InternalServerError} from "../../error/InternalServerError";
import {InvalidAuthentication} from "../../error/InvalidAuthentication";
import {Response} from "express";
import {Authentication} from "./Authentication";
import {PasswordService} from "../password/PasswordService";
import {ResourceCrudPermission} from "../../permission/ResourceCrudPermission";
import {IPermission} from "../../type/authorization";

@Service()
export class AuthenticationService implements IAuthenticationService {

    constructor(
        private passwordService: PasswordService,
        private userRepository: UserRepository,
        private tokenRepository: TokenRepository,
    ) {
    }

    private static createToken(user: IUserDto, permissions: PermissionsList): IToken {
        const payload = {
            userId: user.id,
            exp: Math.floor(Date.now() / 1000) + (config.security.authentication.jwt.token_expiration_in_minutes * 60),
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

    private static createPermissionsList(...args: IPermission[]): PermissionsList {
        return args.map((permission: IPermission): string => {
            return permission.toString();
        })
    }

    private static createAuthenticationObject(authenticated: boolean, user: IUserDto | null, token: IToken | null): IAuthentication {
        if (authenticated && (user === null || token === null)) {
            throw new InternalServerError('Creating successful authentication require both user and token.');
        }
        return Object.seal(new Authentication(authenticated, token, user));
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
            AuthenticationService.createToken(
                user,
                AuthenticationService.createPermissionsList(
                    new ResourceCrudPermission('GET', this.userRepository, user.id)
                )
            )
        );
    }

    public async revokeAuthentication(token: string): Promise<undefined> {
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