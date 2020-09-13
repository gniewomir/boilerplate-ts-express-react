import request from 'supertest';
import app from '../../application/loader';
import config from "../../application/config";
import faker from "faker";
import {Container} from "typedi";
import AuthenticationService from "../../application/service/authentication";
import UserRepository from "../../database/repository/user";

describe('User routes', () => {
    describe(`POST ${config.api.prefix}/user`, () => {
        it('should return created user', async () => {
            const application = await app();
            const name = faker.name.findName();
            const email = faker.internet.email();
            const password = faker.internet.password();

            expect.assertions(1);
            await request(application)
                .post(`${config.api.prefix}/user`)
                .send({
                    name,
                    email,
                    password
                })
                .expect(201)
                .then(response => {
                    expect(response.body.email).toStrictEqual(email);
                });
        });
        it('should return validation error', async () => {
            const application = await app();

            expect.assertions(1);
            await request(application)
                .post(`${config.api.prefix}/user`)
                .send({})
                .expect(400)
                .then(response => {
                    expect(response.body.validation.body.keys).toStrictEqual(["name"]);
                });
        });
        it('should return error on existing user', async () => {
            const application = await app();
            const name = faker.name.findName();
            const email = faker.internet.email();
            const password = faker.internet.password();

            await request(application)
                .post(`${config.api.prefix}/user`)
                .send({
                    name,
                    email,
                    password
                })
                .expect(201);
            await request(application)
                .post(`${config.api.prefix}/user`)
                .send({
                    name,
                    email,
                    password
                })
                .expect(422);
        });
        it('should return error if user is authenticated therefore registered already', async () => {
            const application = await app();
            const name = faker.name.findName();
            const email = faker.internet.email();
            const password = faker.internet.password();

            await request(application)
                .post(`${config.api.prefix}/user`)
                .send({
                    name,
                    email,
                    password
                })
                .expect(201);

            const authentication = await Container
                .get(AuthenticationService)
                .createAuthentication(await Container.get(UserRepository).findByEmail(email));

            await request(application)
                .post(`${config.api.prefix}/user`)
                .set('authorization', `Bearer ${authentication.token.token}`)
                .send({
                    name: faker.name.findName(),
                    email: faker.internet.email(),
                    password: faker.internet.password()
                })
                .expect(403);
        });
    });
});