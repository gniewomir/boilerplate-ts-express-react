import {Router} from 'express';
import {controller} from "../controller";
import {Container} from "typedi";
import {forUnauthenticated, middleware} from "../middleware";
import {celebrate, Joi, Segments} from "celebrate";
import {UserController} from "../controller/user";

const route = Router();

export default (app: Router) => {
    const userController = controller(Container.get(UserController));
    app.use('/user', route);

    route.post(
        '/',
        middleware(
            forUnauthenticated(
                celebrate(
                    {
                        [Segments.BODY]: Joi.object().keys({
                            name: Joi.string().required(),
                            email: Joi.string().required(),
                            password: Joi.string().required(),
                        })
                    })
            )
        ),
        userController
    );

};