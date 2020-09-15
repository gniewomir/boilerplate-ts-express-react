import {Controller} from "./controller";
import {Service} from "typedi";
import {Request, Response} from "express";
import {IAuthentication} from "../../application/interface/IAuthentication";
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
        return {
            statusCode: 201,
            body: {
                token: authentication.authenticated
                    ? (await this.userService.authenticateById(authentication.user.id)).token.token
                    : (await this.userService.authenticateByCredentials(
                        {
                            email: req.body.email,
                            password: req.body.password
                        }
                    )).token.token
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