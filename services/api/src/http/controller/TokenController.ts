import {Controller} from "./Controller";
import {Service} from "typedi";
import {Request, Response} from "express";
import {IAuthentication} from "../../application/type/authentication";
import {UserService} from "../../domain/service/UserService";
import {IApiResponse} from "../type/controller";

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
                token: authentication.isAuthenticated()
                    ? (await this.userService.authenticateById(authentication.getUser().id)).getToken().token
                    : (await this.userService.authenticateByCredentials(
                        {
                            email: req.body.email,
                            password: req.body.password
                        }
                    )).getToken().token
            }
        }
    }

    public async DELETE(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse> {
        if (authentication.isAuthenticated()) {
            await this.userService.revokeAuthentication(authentication.getToken().token);
        }
        return {
            statusCode: 204,
            body: {}
        }
    }

}