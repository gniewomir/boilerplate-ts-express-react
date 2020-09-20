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
import {TokenRepository} from "../../database/repository/TokenRepository";
import {ITokenRepository} from "../../application/type/ITokenRepository";


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
        it('should set refresh token cookie expiring in future', async () => {
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
                    expect(response.headers['set-cookie'][0]).toContain(`${config.security.cookies.refresh_token_cookie_name}=s%3`)
                    expect(response.headers['set-cookie'][0]).toContain(`Domain=${config.api.public_domain};`)
                    expect(response.headers['set-cookie'][0]).toContain(`Path=${config.api.prefix}/token;`)
                    expect(response.headers['set-cookie'][0]).toContain('HttpOnly;')
                    expect(response.headers['set-cookie'][0]).toContain('Secure;')
                    expect(response.headers['set-cookie'][0]).toContain('SameSite=Strict')

                    response.headers['set-cookie'][0].split(';').forEach((val: string) => {
                        const name = val.split('=')[0];
                        if (name === 'Expires') {
                            expect((new Date(val.split('=')[1])) > (new Date())).toBe(true)
                        }
                    })

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

    describe(`DELETE ${config.api.prefix}/token`, () => {
        it('should blacklist token used to authenticate request', async () => {
            const application = await app();
            const repository = Container.get(UserRepository) as IUserRepository;
            const email = faker.internet.email();
            const password = faker.internet.password();
            const user = await repository.createAndSave(faker.name.findName(), email, password);
            const authenticationService = Container.get(AuthenticationService) as IAuthenticationService;
            const authentication = await authenticationService.createUserAuthentication(user);

            await request(application)
                .get(`${config.api.prefix}/user/${user.id}`)
                .set('authorization', `Bearer ${authentication.getToken().token}`)
                .expect(200);

            await request(application)
                .delete(`${config.api.prefix}/token`)
                .set('authorization', `Bearer ${authentication.getToken().token}`)
                .expect(204);

            await request(application)
                .get(`${config.api.prefix}/user/${user.id}`)
                .set('authorization', `Bearer ${authentication.getToken().token}`)
                .expect(401);
        })
        it('should blacklist refresh token sent with request', async () => {
            const application = await app();
            const userRepository = Container.get(UserRepository) as IUserRepository;
            const tokenRepository = Container.get(TokenRepository) as ITokenRepository;
            const email = faker.internet.email();
            const password = faker.internet.password();
            const user = await userRepository.createAndSave(faker.name.findName(), email, password);
            const authenticationService = Container.get(AuthenticationService) as IAuthenticationService;
            const authentication = await authenticationService.createUserAuthentication(user);
            const refreshTokenAuthentication = await authenticationService.createRefreshTokenAuthentication(user);

            const beforeUserTokensCount = (await tokenRepository.findByUser(user.id)).length;

            await request(application)
                .get(`${config.api.prefix}/user/${user.id}`)
                .set('authorization', `Bearer ${authentication.getToken().token}`)
                .expect(200);

            await request(application)
                .delete(`${config.api.prefix}/token`)
                .set('Cookie', [signedTokenCookie(refreshTokenAuthentication.getToken().token)])
                .set('authorization', `Bearer ${authentication.getToken().token}`)
                .expect(204);

            const afterUserTokensCount = (await tokenRepository.findByUser(user.id)).length;

            expect(beforeUserTokensCount).toBe(0);
            expect(afterUserTokensCount).toBe(2);
        })
    });
});