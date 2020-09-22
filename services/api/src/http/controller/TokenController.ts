import {Controller} from "./Controller";
import {Service} from "typedi";
import {Request, Response} from "express";
import {IAuthentication} from "../../application/type/authentication";
import {UserService} from "../../domain/service/UserService";
import {IApiResponse} from "../type/api";
import {config} from "../../application/config";
import {InvalidAuthentication} from "../../application/error/InvalidAuthentication";
import {AuthenticationService} from "../../application/service/authentication/AuthenticationService";
import {UseRefreshTokenPermission} from "../../application/permission/UseRefreshTokenPermission";
import {Forbidden} from "../../application/error/Forbidden";
import {CookieOptions} from "express-serve-static-core";
import {UseCredentialsPermission} from "../../application/permission/UseCredentialsPermission";
import {Log} from "../../application/loader/logger";
import {IUserDto} from "../../domain/type/user";

@Service()
export class TokenController extends Controller {

    private readonly refreshTokenCookieDefaults = {
        ...config.security.cookies.default,
        path: `${config.api.prefix}/token`,
    } as CookieOptions

    constructor(
        private userService: UserService,
        private authenticationService: AuthenticationService
    ) {
        super();
    }

    private async setRefreshTokenCookie(res: Response, user: IUserDto): Promise<undefined> {
        const refreshTokenAuthentication = await this.authenticationService.createRefreshTokenAuthentication(user)
        res.cookie(
            config.security.cookies.refresh_token_cookie_name,
            refreshTokenAuthentication.getToken().token,
            {
                ...this.refreshTokenCookieDefaults,
                expires: new Date(refreshTokenAuthentication.getToken().payload.exp * 1000)
            }
        );
        return;
    }

    private async clearRefreshTokenCookie(req: Request, res: Response): Promise<undefined> {
        try {
            await this.authenticationService.revokeToken(req.signedCookies.refresh_token)
        } catch (error) {
            Log.error(error);
        } finally {
            res.cookie(
                config.security.cookies.refresh_token_cookie_name,
                '',
                {
                    ...this.refreshTokenCookieDefaults,
                    expires: new Date(1970, 1, 1)
                }
            );
        }
        return;
    }

    public async POST(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse> {

        const newAuthentication = await this.userService.authenticateByCredentials(
            {
                email: req.body.email,
                password: req.body.password
            }
        );
        if (newAuthentication.denied(new UseCredentialsPermission())) {
            throw new Forbidden(`lack of ${(new UseCredentialsPermission()).toString()}`);
        }

        await this.setRefreshTokenCookie(res, newAuthentication.getUser());

        return {
            statusCode: 201,
            body: {
                token: newAuthentication.getToken().token
            }
        }
    }

    // noinspection JSUnusedGlobalSymbols
    public async POST_refresh(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse> {

        if (!req.signedCookies || !req.signedCookies.refresh_token) {
            throw new InvalidAuthentication('no refresh token');
        }
        const refreshAuthentication = await this.authenticationService.checkAuthentication(req.signedCookies.refresh_token)
        if (refreshAuthentication.denied(new UseRefreshTokenPermission())) {
            throw new Forbidden(`lack of ${(new UseRefreshTokenPermission()).toString()}`);
        }

        await this.setRefreshTokenCookie(res, refreshAuthentication.getUser());

        return {
            statusCode: 201,
            body: {
                token: (await this.userService.authenticateById(refreshAuthentication.getUser().id)).getToken().token
            }
        }
    }

    public async DELETE(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse> {

        await this.clearRefreshTokenCookie(req, res);

        if (authentication.isAuthenticated()) {
            try {
                await this.userService.revokeAuthentication(authentication.getToken().token);
            } catch (error) {
                Log.error(error);
            }
        }

        return {
            statusCode: 204,
            body: {}
        }
    }

}