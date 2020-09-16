import {Router} from 'express';
import {userRoutes} from './user';
import {tokenRoutes} from "./token";


export const routes = (): Router => {
    const app = Router();
    userRoutes(app);
    tokenRoutes(app);
    return app
}