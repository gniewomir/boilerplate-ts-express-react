import { Router } from 'express';
import user from './route/user';

export default () => {
    const app = Router();
    user(app);
    return app
}