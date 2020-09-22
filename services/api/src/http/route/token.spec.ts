import request from 'supertest';
import {Container} from "typedi";
import {config} from "../../application/config";
import {
    AuthenticationService,
    IAuthenticationService
} from "../../application/service/authentication/AuthenticationService";
import {ITokenRepository, TokenRepository} from "../../database/repository/TokenRepository";
import {
    cleanupTestDatabaseConnection,
    setupTestApplication,
    setupTestApplicationUserAndAuthentication
} from "../../test/utility";
import {signedCookiePayloadTestHelper} from "../../test/utility/cookie";


afterAll(cleanupTestDatabaseConnection)

describe('Token routes', () => {
    describe(`POST ${config.api.prefix}/token`, () => {
        it('should return status code 400 and list of errors on invalid request', async () => {
            const application = await setupTestApplication();
            expect.assertions(1);
            await request(application)
                .post(`${config.api.prefix}/token`)
                .expect(400)
                .then(response => {
                    expect(response.body.validation.body.keys).toStrictEqual(["email"]);
                })
        })
        it('should return status code 201 and valid token with credentials matching user', async () => {
            const {application, user: {email}, plainPassword} = await setupTestApplicationUserAndAuthentication();
            expect.assertions(1);
            await request(application)
                .post(`${config.api.prefix}/token`)
                .send({
                    email,
                    password: plainPassword
                })
                .expect(201)
                .then(async (response) => {
                    const authenticationService = Container.get(AuthenticationService) as IAuthenticationService;
                    const authenticated = await authenticationService.checkAuthentication(response.body.token);
                    expect(authenticated.getUser().email).toBe(email);
                });
        })
        it('should return status code 401 when password is invalid', async () => {
            const {application, user: {email}, plainPassword} = await setupTestApplicationUserAndAuthentication();
            await request(application)
                .post(`${config.api.prefix}/token`)
                .send({
                    email,
                    password: plainPassword + 'invalid_password'
                })
                .expect(401);
        })
        it('should return status code 401 when email is invalid', async () => {
            const {application, user: {email}, plainPassword} = await setupTestApplicationUserAndAuthentication();
            await request(application)
                .post(`${config.api.prefix}/token`)
                .send({
                    email: 'invalidemail@gmail.com',
                    password: plainPassword
                })
                .expect(401);
        })
        it('should set refresh token cookie expiring in future', async () => {
            const {application, user: {email}, plainPassword} = await setupTestApplicationUserAndAuthentication();
            expect.assertions(7);
            await request(application)
                .post(`${config.api.prefix}/token`)
                .send({
                    email,
                    password: plainPassword
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
            const {application, user} = await setupTestApplicationUserAndAuthentication();
            const authenticationService = Container.get(AuthenticationService) as IAuthenticationService;
            const refreshTokenAuthentication = await authenticationService.createRefreshTokenAuthentication(user);
            expect.assertions(1);
            await request(application)
                .post(`${config.api.prefix}/token/refresh`)
                .set('Cookie', [signedCookiePayloadTestHelper(refreshTokenAuthentication.getToken().token)])
                .expect(201)
                .then(async (response) => {
                    const testAuthenticationService = Container.get(AuthenticationService) as IAuthenticationService;
                    const authenticated = await testAuthenticationService.checkAuthentication(response.body.token);
                    expect(authenticated.getUser().email).toBe(user.email);
                });
        })
    });

    describe(`DELETE ${config.api.prefix}/token`, () => {
        it('should blacklist token used to authenticate request', async () => {
            const {application, user} = await setupTestApplicationUserAndAuthentication();
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
            const {application, user} = await setupTestApplicationUserAndAuthentication();
            const tokenRepository = Container.get(TokenRepository) as ITokenRepository;
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
                .set('Cookie', [signedCookiePayloadTestHelper(refreshTokenAuthentication.getToken().token)])
                .set('authorization', `Bearer ${authentication.getToken().token}`)
                .expect(204);

            const afterUserTokensCount = (await tokenRepository.findByUser(user.id)).length;

            expect(beforeUserTokensCount).toBe(0);
            expect(afterUserTokensCount).toBe(2);
        })
        it('should blacklist refresh token sent with request even if authentication was invalid', async () => {
            const {application, user} = await setupTestApplicationUserAndAuthentication();
            const tokenRepository = Container.get(TokenRepository) as ITokenRepository;
            const authenticationService = Container.get(AuthenticationService) as IAuthenticationService;
            const refreshTokenAuthentication = await authenticationService.createRefreshTokenAuthentication(user);

            const beforeUserTokensCount = (await tokenRepository.findByUser(user.id)).length;

            await request(application)
                .delete(`${config.api.prefix}/token`)
                .set('Cookie', [signedCookiePayloadTestHelper(refreshTokenAuthentication.getToken().token)])
                .set('authorization', `Bearer invalid_token`)
                .expect(204);

            const afterUserTokensCount = (await tokenRepository.findByUser(user.id)).length;

            expect(beforeUserTokensCount).toBe(0);
            expect(afterUserTokensCount).toBe(1);
        })
        it('should blacklist token used to authenticate request even if refresh token was invalid', async () => {
            const {authentication, application, user} = await setupTestApplicationUserAndAuthentication();
            const tokenRepository = Container.get(TokenRepository) as ITokenRepository;
            const authenticationService = Container.get(AuthenticationService) as IAuthenticationService;
            const refreshTokenAuthentication = await authenticationService.createRefreshTokenAuthentication(user);

            const beforeUserTokensCount = (await tokenRepository.findByUser(user.id)).length;

            await request(application)
                .delete(`${config.api.prefix}/token`)
                .set('Cookie', [signedCookiePayloadTestHelper(refreshTokenAuthentication.getToken().token + '_invalid_signed_cookie')])
                .set('authorization', `Bearer ${authentication.getToken().token}`)
                .expect(204);

            const afterUserTokensCount = (await tokenRepository.findByUser(user.id)).length;

            expect(beforeUserTokensCount).toBe(0);
            expect(afterUserTokensCount).toBe(1);
        })
    });
});