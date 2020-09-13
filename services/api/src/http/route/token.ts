import {Router} from 'express';
import {celebrate, Joi, Segments} from "celebrate";
import {TokenController} from "../controller/token";
import {Container} from "typedi";
import {forUnauthenticated, middleware} from "../middleware";
import {controller} from "../controller";

const route = Router();

export default (app: Router) => {
    const tokenController = controller(Container.get(TokenController));
    app.use('/token', route);

    route.post(
        '/',
        middleware(
            forUnauthenticated(
                celebrate(
                    {
                        [Segments.BODY]: Joi.object().keys({
                            email: Joi.string().required(),
                            password: Joi.string().required(),
                        })
                    })
            )
        ),
        tokenController
    );

    route.delete(
        '/',
        middleware(),
        tokenController
    );
};