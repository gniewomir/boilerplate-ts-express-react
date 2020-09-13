import request, {Response} from 'supertest';
import app from '../../loader';
import {Container} from "typedi";
import UserRepository from "../../repository/user";
import {IUserRepository} from "../../interface/IUserRepository";
import * as faker from 'faker';
import AuthenticationService from "../../service/authentication";
import {IAuthenticationService} from "../../interface/IAuthenticationService";
import config from "../../config";

describe('Token routes', () => {
    describe(`POST ${config.api.prefix}/token`, () => {
        it('should return status code 422 and list of errors on invalid request', async () => {
            const application = await app();

            await request(application)
                .post(`${config.api.prefix}/token`)
                .expect(422)
                .expect({
                    email: 'This field is required',
                    password: 'This field is required'
                })
        })
        it('should return status code 200 and valid token with credentials matching user', async () => {
            const application = await app();
            const repository = Container.get(UserRepository) as IUserRepository;
            const email = faker.internet.email();
            const password = faker.internet.password();
            await repository.createAndSave(faker.name.findName(), email, password);

            await request(application)
                .post(`${config.api.prefix}/token`)
                .send({
                    email,
                    password
                })
                .expect(200)
                .expect(async (res: Response) => {
                    const authenticationService = Container.get(AuthenticationService) as IAuthenticationService;
                    await authenticationService.checkAuthentication(res.body.token);
                });
        })
    });
});