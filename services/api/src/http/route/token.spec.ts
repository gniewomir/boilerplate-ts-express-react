import request from 'supertest';
import app from '../../application/loader';
import {Container} from "typedi";
import UserRepository from "../../database/repository/user";
import {IUserRepository} from "../../domain/type/IUserRepository";
import * as faker from 'faker';
import AuthenticationService from "../../application/service/authentication";
import {IAuthenticationService} from "../../application/type/IAuthenticationService";
import config from "../../application/config";
import {getConnection} from "typeorm";

afterAll(async () => {
    const connection = getConnection();
    if (connection.isConnected) {
        await connection.close();
    }
})

describe('Token routes', () => {
    describe(`POST ${config.api.prefix}/token`, () => {
        it('should return status code 400 and list of errors on invalid request', async () => {
            const application = await app();
            expect.assertions(1);
            await request(application)
                .post(`${config.api.prefix}/token`)
                .expect(400)
                .then(response => {
                    expect(response.body.validation.body.keys).toStrictEqual(["email"]);
                })
        })
        it('should return status code 200 and valid token with credentials matching user', async () => {
            const application = await app();
            const repository = Container.get(UserRepository) as IUserRepository;
            const email = faker.internet.email();
            const password = faker.internet.password();
            await repository.createAndSave(faker.name.findName(), email, password);

            expect.assertions(1);
            await request(application)
                .post(`${config.api.prefix}/token`)
                .send({
                    email,
                    password
                })
                .expect(201)
                .then(async (response) => {
                    const authenticationService = Container.get(AuthenticationService) as IAuthenticationService;
                    const authenticated = await authenticationService.checkAuthentication(response.body.token);
                    expect(authenticated.user.email).toBe(email);
                });
        })
    });
});