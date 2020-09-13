import {Router} from 'express';
import user from './route/user';
import token from "./route/token";


export default () => {
    const app = Router();
    user(app);
    token(app);
    return app
}