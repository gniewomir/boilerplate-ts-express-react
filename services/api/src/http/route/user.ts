import {Router} from 'express';
import {controller} from "../controller";
import {Container} from "typedi";
import {middleware, requireResourcePermissions, requireUnauthenticated} from "../middleware";
import {celebrate, Joi, Segments} from "celebrate";
import {UserController} from "../controller/UserController";
import {UserRepository} from "../../database/repository/UserRepository";

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
            requireResourcePermissions(Container.get(UserRepository), 'userId'),
            celebrate(
                {
                    [Segments.PARAMS]: Joi.object().keys({
                        userId: Joi.number().required(),
                    })
                })
        ),
        userController
    );

    route.patch(
        '/:userId',
        middleware(
            requireResourcePermissions(Container.get(UserRepository), 'userId'),
            celebrate(
                {
                    [Segments.PARAMS]: Joi.object().keys({
                        name: Joi.string().optional(),
                        email: Joi.string().optional(),
                        password: Joi.string().optional(),
                    }),
                    [Segments.PARAMS]: Joi.object().keys({
                        userId: Joi.number().required(),
                    })
                })
        ),
        userController
    );

};