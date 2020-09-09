import { Router, Request, Response } from 'express';
const route = Router();

export default (app: Router) => {
    app.use('/user', route);

    // FIXME: only for testing
    route.post('', (req: Request, res: Response) => {
        return res.json({}).status(200);
    });
};