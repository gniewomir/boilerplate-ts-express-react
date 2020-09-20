import {Controller} from "./Controller";
import {Service} from "typedi";
import {Request, Response} from "express";
import {IAuthentication} from "../../application/type/authentication";
import {UserService} from "../../domain/service/UserService";
import {IApiResponse} from "../type/controller";
import {config} from "../../application/config";
import {InvalidAuthentication} from "../../application/error/InvalidAuthentication";
import {AuthenticationService} from "../../application/service/authentication/AuthenticationService";
import {AuthenticationRefreshPermission} from "../../application/permission/AuthenticationRefreshPermission";
import {Forbidden} from "../../application/error/Forbidden";
import {CookieOptions} from "express-serve-static-core";
import {AuthenticatePermission} from "../../application/permission/AuthenticatePermission";

@Service()
export class TokenController extends Controller {

    private readonly refreshCookieDefaults = {
        ...config.security.cookies.default,
        path: `${config.api.prefix}/token`,
    } as CookieOptions

    constructor(
        private userService: UserService,
        private authenticationService: AuthenticationService
    ) {
        super();
    }

    public async POST(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse> {
        const newAuthentication = await this.userService.authenticateByCredentials(
            {
                email: req.body.email,
                password: req.body.password
            }
        );
        if (newAuthentication.denied(new AuthenticatePermission())) {
            throw new Forbidden(`lack of ${(new AuthenticatePermission()).toString()}`);
        }

        const refreshTokenAuthentication = await this.authenticationService.createRefreshTokenAuthentication(newAuthentication.getUser())

        res.cookie(
            config.security.cookies.refresh_token_cookie_name,
            refreshTokenAuthentication.getToken().token,
            {
                ...this.refreshCookieDefaults,
                expires: new Date(refreshTokenAuthentication.getToken().payload.exp * 1000)
            }
        );

        return {
            statusCode: 201,
            body: {
                token: newAuthentication.getToken().token
            }
        }
    }

    public async POST_refresh(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse> {
        if (!req.signedCookies || !req.signedCookies.refresh_token) {
            throw new InvalidAuthentication('no refresh token');
        }
        const refreshAuthentication = await this.authenticationService.checkAuthentication(req.signedCookies.refresh_token)
        if (refreshAuthentication.denied(new AuthenticationRefreshPermission())) {
            throw new Forbidden(`lack of ${(new AuthenticationRefreshPermission()).toString()}`);
        }
        const refreshTokenAuthentication = await this.authenticationService.createRefreshTokenAuthentication(refreshAuthentication.getUser())
        res.cookie(
            config.security.cookies.refresh_token_cookie_name,
            refreshTokenAuthentication.getToken().token,
            {
                ...this.refreshCookieDefaults,
                expires: new Date(refreshTokenAuthentication.getToken().payload.exp)
            }
        );
        return {
            statusCode: 201,
            body: {
                token: (await this.userService.authenticateById(refreshTokenAuthentication.getUser().id)).getToken().token
            }
        }
    }

    public async DELETE(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse> {
        if (authentication.isAuthenticated()) {
            await this.userService.revokeAuthentication(authentication.getToken().token);
        }
        if (req.signedCookies && req.signedCookies.refresh_token) {
            try {
                await this.authenticationService.revokeToken(req.signedCookies.refresh_token)
            } catch (error) {
                if (!(error instanceof InvalidAuthentication)) {
                    throw error;
                }
            } finally {
                res.cookie(
                    config.security.cookies.refresh_token_cookie_name,
                    '',
                    {
                        ...this.refreshCookieDefaults,
                        expires: new Date(1970, 1, 1)
                    }
                );
            }
        }
        return {
            statusCode: 204,
            body: {}
        }
    }

}