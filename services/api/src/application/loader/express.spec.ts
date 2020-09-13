import request from 'supertest';
import application from './index';
import config from "../config";

describe('The express loader', () => {
    describe(`GET ${config.api.prefix}/status`, () => {
        it('should return status code 200', async () => {
            const app = await application();
            await request(app)
                .get(`${config.api.prefix}/status`)
                .expect(200)
        })
    });
    describe(`HEAD ${config.api.prefix}/status`, () => {
        it('should return status code 200', async () => {
            const app = await application();
            await request(app)
                .head(`${config.api.prefix}/status`)
                .expect(200)
        })
    });
});