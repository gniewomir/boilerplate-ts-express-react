import {Controller} from "./controller";
import {Service} from "typedi";
import {Request, Response} from "express";
import {IAuthenticated} from "../../application/interface/IAuthenticated";
import UserService from "../../domain/service/user";
import Forbidden from "../../application/error/Forbidden";

@Service()
export class UserController extends Controller {

    constructor(
        private userService: UserService,
    ) {
        super();
    }

    public async POST(req: Request, res: Response, authentication: IAuthenticated): Promise<any> {
        if (authentication.authenticated) {
            throw new Forbidden('Already authenticated user cannot register');
        }
        const user = await this.userService.register({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        })
        res.status(201).json(user);
    }
}