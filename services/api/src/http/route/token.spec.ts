import request from 'supertest';
import {setupApplication as app} from '../../application/loader';
import {Container} from "typedi";
import {UserRepository} from "../../database/repository/UserRepository";
import {IUserRepository} from "../../domain/type/IUserRepository";
import * as faker from 'faker';
import {IAuthenticationService} from "../../application/type/IAuthenticationService";
import {config} from "../../application/config";
import {getConnection} from "typeorm";
import {AuthenticationService} from "../../application/service/authentication/AuthenticationService";
import crypto from 'crypto';


const signedTokenCookie = (token: string) => {
    const signed = 's:' + token + '.' + crypto
        .createHmac('sha256', config.security.cookies.secrets[0])
        .update(token)
        .digest('base64')
        .replace(/=+$/, '')
    return `${config.security.cookies.refresh_token_cookie_name}=${signed};`
};

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
        it('should return status code 201 and valid token with credentials matching user', async () => {
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
                    expect(authenticated.getUser().email).toBe(email);
                });
        })
        it('should set refresh token cookie', async () => {
            const application = await app();
            const repository = Container.get(UserRepository) as IUserRepository;
            const email = faker.internet.email();
            const password = faker.internet.password();
            await repository.createAndSave(faker.name.findName(), email, password);

            expect.assertions(7);
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
                    expect(authenticated.getUser().email).toBe(email);
                    expect(response.headers['set-cookie'][0]).toContain(config.security.cookies.refresh_token_cookie_name)
                    expect(response.headers['set-cookie'][0]).toContain(`Domain=${config.api.public_domain};`)
                    expect(response.headers['set-cookie'][0]).toContain(`Path=${config.api.prefix}/token;`)
                    expect(response.headers['set-cookie'][0]).toContain('HttpOnly;')
                    expect(response.headers['set-cookie'][0]).toContain('Secure;')
                    expect(response.headers['set-cookie'][0]).toContain('SameSite=Strict')
                });
        })
    });

    describe(`POST ${config.api.prefix}/token/refresh`, () => {
        it('should return status code 201 and valid token with credentials matching user', async () => {
            const application = await app();
            const repository = Container.get(UserRepository) as IUserRepository;
            const email = faker.internet.email();
            const password = faker.internet.password();
            const user = await repository.createAndSave(faker.name.findName(), email, password);
            const authenticationService = Container.get(AuthenticationService) as IAuthenticationService;
            const refreshTokenAuthentication = await authenticationService.createRefreshTokenAuthentication(user);

            expect.assertions(1);
            await request(application)
                .post(`${config.api.prefix}/token/refresh`)
                .set('Cookie', [signedTokenCookie(refreshTokenAuthentication.getToken().token)])
                .expect(201)
                .then(async (response) => {
                    const testAuthenticationService = Container.get(AuthenticationService) as IAuthenticationService;
                    const authenticated = await testAuthenticationService.checkAuthentication(response.body.token);
                    expect(authenticated.getUser().email).toBe(email);
                });
        })
    });
});