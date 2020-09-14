import {Controller} from "./controller";
import {Service} from "typedi";
import {Request, Response} from "express";
import {IAuthentication} from "../../application/interface/IAuthenticated";
import UserService from "../../domain/service/user";
import {IApiResponse} from "../interface/IApiResponse";

@Service()
export class TokenController extends Controller {

    constructor(
        private userService: UserService,
    ) {
        super();
    }

    public async POST(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse> {
        if (authentication.authenticated) {
            const newAuthentication = await this.userService.authenticateById(authentication.user.id);
            return {
                statusCode: 201,
                body: {
                    token: newAuthentication.token.token
                }
            }
        } else {
            const newAuthentication = await this.userService.authenticateByCredentials({
                email: req.body.email,
                password: req.body.password
            });
            return {
                statusCode: 201,
                body: {
                    token: newAuthentication.token.token
                }
            }
        }
    }

    public async DELETE(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse> {
        if (authentication.authenticated) {
            await this.userService.revokeAuthentication(authentication.token.token);
        }
        return {
            statusCode: 204,
            body: {}
        }
    }

}