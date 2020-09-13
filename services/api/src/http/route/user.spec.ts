import request from 'supertest';
import app from '../../application/loader';
import config from "../../application/config";
import faker from "faker";
import {Container} from "typedi";
import UserRepository from "../../database/repository/user";
import {User} from "../../database/entity/User";

describe('User routes', () => {
    describe(`POST ${config.api.prefix}/user`, () => {
        it('should return create user', async () => {
            const application = await app();
            const name = faker.name.findName();
            const email = faker.internet.email();
            const password = faker.internet.password();

            expect.assertions(2);
            await request(application)
                .post(`${config.api.prefix}/user`)
                .send({
                    name,
                    email,
                    password
                })
                .expect(201)
                .then(response => {
                    expect(response.body.data.email).toStrictEqual(["email"]);
                });
            await expect(await Container.get(UserRepository).findByEmail(email)).toBeInstanceOf(User);
        });
    });
});