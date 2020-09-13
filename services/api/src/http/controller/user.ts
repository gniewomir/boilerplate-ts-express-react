import {Controller} from "./controller";
import {Service} from "typedi";
import {Request, Response} from "express";
import {IAuthenticated} from "../../application/interface/IAuthenticated";
import UserService from "../../domain/service/user";

@Service()
export class UserController extends Controller {

    constructor(
        private userService: UserService,
    ) {
        super();
    }

    public async POST(req: Request, res: Response, authentication: IAuthenticated): Promise<any> {
        const user = await this.userService.register({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        })
        res.status(201).json(user);
    }
}