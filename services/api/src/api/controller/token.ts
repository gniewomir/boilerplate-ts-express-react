import {Controller} from "./controller";
import {Service} from "typedi";
import {Request, Response} from "express";
import {IAuthenticated} from "../../interface/IAuthenticated";
import UserService from "../../service/user";

@Service()
export class TokenController extends Controller {

    constructor(
        private userService: UserService,
    ) {
        super();
    }

    public async POST(req: Request, res: Response, authentication: IAuthenticated): Promise<any> {
        if (authentication.authenticated) {
            const newAuthentication = await this.userService.authenticateById(authentication.user.id);
            res
                .status(201)
                .json({
                    token: newAuthentication.token.token
                });
            return;
        } else {
            const newAuthentication = await this.userService.authenticateByCredentials(req.body.email, req.body.password);
            res
                .status(201)
                .json({
                    token: newAuthentication.token.token
                });
        }
    }

    public async DELETE(req: Request, res: Response, authentication: IAuthenticated): Promise<any> {
        if (authentication.authenticated) {
            await this.userService.revokeAuthentication(authentication.token.token);
        }
        res.status(204).end();
    }

}