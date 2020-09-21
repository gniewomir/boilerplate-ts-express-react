import request from 'supertest';
import {config} from "../config";
import {cleanupTestDatabaseConnection, setupTestApplication} from "../../test/utility";

afterAll(cleanupTestDatabaseConnection)

describe('The express loader', () => {
    describe(`GET ${config.api.prefix}/status`, () => {
        it('should return status code 200', async () => {
            const app = await setupTestApplication();
            await request(app)
                .get(`${config.api.prefix}/status`)
                .expect(200)
        })
    });
    describe(`HEAD ${config.api.prefix}/status`, () => {
        it('should return status code 200', async () => {
            const app = await setupTestApplication();
            await request(app)
                .head(`${config.api.prefix}/status`)
                .expect(200)
        })
    });
});