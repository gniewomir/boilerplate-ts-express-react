import {Request, Response, Router} from 'express';

const route = Router();

export default (app: Router) => {
    app.use('/token', route);

    // FIXME: only for testing
    // Obtain JWT token
    route.post('', (req: Request, res: Response) => {
        return res.json({}).status(200);
    });
    // Blacklist JWT token
    route.delete('', (req: Request, res: Response) => {
        return res.json({}).status(200);
    });
};