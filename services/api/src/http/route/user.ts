import {Router} from 'express';
import {controller} from "../controller";
import {Container} from "typedi";
import {middleware, requireUnauthenticated} from "../middleware";
import {celebrate, Joi, Segments} from "celebrate";
import {UserController} from "../controller/UserController";

const route = Router();

export const userRoutes = (app: Router) => {
    const userController = controller(Container.get(UserController));
    app.use('/user', route);

    route.post(
        '/',
        middleware(
            requireUnauthenticated('Already authenticated user cannot register'),
            celebrate(
                {
                    [Segments.BODY]: Joi.object().keys({
                        name: Joi.string().required(),
                        email: Joi.string().required(),
                        password: Joi.string().required(),
                    })
                })
        ),
        userController
    );

    route.get(
        '/:userId',
        middleware(
            celebrate(
                {
                    [Segments.PARAMS]: Joi.object().keys({
                        userId: Joi.number().required(),
                    })
                })
        ),
        userController
    );

};