import {Controller} from "./controller";
import {Service} from "typedi";
import {Request, Response} from "express";
import {IAuthentication} from "../../application/interface/IAuthenticated";
import UserService from "../../domain/service/user";
import Forbidden from "../../application/error/Forbidden";
import {IApiResponse} from "../interface/IApiResponse";

@Service()
export class UserController extends Controller {

    constructor(
        private userService: UserService,
    ) {
        super();
    }

    public async POST(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse> {
        const user = await this.userService.register({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        })
        return {
            statusCode: 201,
            body: user
        }
    }

    public async GET(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse> {
        const id = parseInt(req.params.userId, 10);
        if (id !== authentication.user.id) {
            throw new Forbidden('Accessing other users is forbidden.');
        }
        return {
            statusCode: 200,
            body: await this.userService.find(id)
        }
    }

}