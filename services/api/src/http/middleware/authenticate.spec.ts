import {config} from '../../application/config';
import request from "supertest";
import {cleanupTestDatabaseConnection, setupTestApplication, setupTestApplicationUserAndAuthentication} from "../../test/utility";

afterAll(cleanupTestDatabaseConnection)

describe('Authenticate middleware', () => {
    it('requires valid token for not whitelisted routes', async () => {
        config.security.authentication.whitelist = [];
        const application = await setupTestApplication();
        await request(application)
            .post(`${config.api.prefix}/token`)
            .expect(401);
    });
    it('does nothing for routes whitelisted in config', async () => {
        config.security.authentication.whitelist = [
            {
                method: "POST",
                route: `${config.api.prefix}/token`
            }
        ];
        const application = await setupTestApplication();
        await request(application)
            .post(`${config.api.prefix}/token`)
            .expect(400);
    });
    it('ignores request path trailing slash for routes whitelisted in config', async () => {
        config.security.authentication.whitelist = [
            {
                method: "POST",
                route: `${config.api.prefix}/token`
            }
        ];
        const application = await setupTestApplication();
        await request(application)
            .post(`${config.api.prefix}/token/`)
            .expect(400);
    });
    it('ignores request query string for routes whitelisted in config', async () => {
        config.security.authentication.whitelist = [
            {
                method: "POST",
                route: `${config.api.prefix}/token`
            }
        ];
        const application = await setupTestApplication();
        await request(application)
            .post(`${config.api.prefix}/token`)
            .query({
                test: "test"
            })
            .expect(400);
    });
    it('authenticates even whitelisted routes if possible', async () => {
        config.security.authentication.whitelist = [
            {
                method: "POST",
                route: `${config.api.prefix}/token`
            }
        ];
        const {application, authentication} = await setupTestApplicationUserAndAuthentication();
        await request(application)
            .post(`${config.api.prefix}/token`)
            .set('authorization', `Bearer ${authentication.getToken().token}`)
            .expect(400);
    });
})