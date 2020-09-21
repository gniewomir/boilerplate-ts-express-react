import {Controller} from "./Controller";
import {Service} from "typedi";
import {Request, Response} from "express";
import {IAuthentication} from "../../application/type/authentication";
import {UserService} from "../../domain/service/UserService";
import {IApiResponse} from "../type/api";
import {IUserUpdateInput} from "../../domain/type/user";

@Service()
export class UserController extends Controller {

    constructor(
        private userService: UserService,
    ) {
        super();
    }

    public async POST(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse> {
        return {
            statusCode: 201,
            body: await this.userService.register({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            })
        }
    }

    public async GET(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse> {
        return {
            statusCode: 200,
            body: await this.userService.find(parseInt(req.params.userId, 10))
        }
    }

    public async PATCH(req: Request, res: Response, authentication: IAuthentication): Promise<IApiResponse> {
        return {
            statusCode: 200,
            body: await this.userService.update(parseInt(req.params.userId, 10), req.body as IUserUpdateInput)
        }
    }

}