import request from 'supertest';
import {setupApplication as app} from '../../application/loader';
import {config} from "../../application/config";
import faker from "faker";
import {Container} from "typedi";
import {UserRepository} from "../../database/repository/UserRepository";
import {UserService} from "../../domain/service/UserService";
import {getConnection} from "typeorm";
import {AuthenticationService} from "../../application/service/authentication/AuthenticationService";

afterAll(async () => {
    const connection = getConnection();
    if (connection.isConnected) {
        await connection.close();
    }
})

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
            const user = await Container.get(UserService).register({
                name,
                email,
                password
            });

            const authentication = await Container
                .get(AuthenticationService)
                .createUserAuthentication(await Container.get(UserRepository).findByEmail(user.email));

            await request(application)
                .post(`${config.api.prefix}/user`)
                .set('authorization', `Bearer ${authentication.getToken().token}`)
                .send({
                    name: faker.name.findName(),
                    email: faker.internet.email(),
                    password: faker.internet.password()
                })
                .expect(403);
        });
    });
    describe(`GET ${config.api.prefix}/user/:userId`, () => {
        it('should return correct user', async () => {
            const application = await app();
            const name = faker.name.findName();
            const email = faker.internet.email();
            const password = faker.internet.password();
            const user = await Container.get(UserService).register({
                name,
                email,
                password
            });
            const authentication = await Container.get(AuthenticationService).createUserAuthentication(user);

            expect.assertions(1);
            await request(application)
                .get(`${config.api.prefix}/user/${user.id}`)
                .set('authorization', `Bearer ${authentication.getToken().token}`)
                .expect(200)
                .then(response => {
                    expect(response.body.id).toStrictEqual(user.id);
                });
        });
        it('should prevent user from accessing other users', async () => {
            const application = await app();
            const name = faker.name.findName();
            const email = faker.internet.email();
            const password = faker.internet.password();
            const user = await Container.get(UserService).register({
                name,
                email,
                password
            });
            const authentication = await Container.get(AuthenticationService).createUserAuthentication(user);

            const otherUser = await Container.get(UserService).register({
                name: faker.name.findName(),
                email: faker.internet.email(),
                password: faker.internet.password()
            });

            await request(application)
                .get(`${config.api.prefix}/user/${otherUser.id}`)
                .set('authorization', `Bearer ${authentication.getToken().token}`)
                .expect(403);
        });
    });
    describe(`PATCH ${config.api.prefix}/user`, () => {
        it('should update user', async () => {
            const application = await app();
            const name = faker.name.findName();
            const email = faker.internet.email();
            const password = faker.internet.password();
            const user = await Container.get(UserService).register({
                name,
                email,
                password
            });
            const authentication = await Container.get(AuthenticationService).createUserAuthentication(user);

            const newName = faker.name.findName();
            const newEmail = faker.internet.email()

            expect.assertions(3);
            await request(application)
                .patch(`${config.api.prefix}/user/${user.id}`)
                .set('authorization', `Bearer ${authentication.getToken().token}`)
                .send({
                    email: newEmail,
                    name: newName
                })
                .expect(200)
                .then(response => {
                    expect(response.body.id).toStrictEqual(user.id);
                    expect(response.body.name).toStrictEqual(newName);
                    expect(response.body.email).toStrictEqual(newEmail);
                });
        });
    });
});