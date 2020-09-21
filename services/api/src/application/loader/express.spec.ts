import request from 'supertest';
import {config} from "../config";
import {CleanupAfterAll, SetupApplication} from "../../test/utility";

afterAll(CleanupAfterAll)

describe('The express loader', () => {
    describe(`GET ${config.api.prefix}/status`, () => {
        it('should return status code 200', async () => {
            const app = await SetupApplication();
            await request(app)
                .get(`${config.api.prefix}/status`)
                .expect(200)
        })
    });
    describe(`HEAD ${config.api.prefix}/status`, () => {
        it('should return status code 200', async () => {
            const app = await SetupApplication();
            await request(app)
                .head(`${config.api.prefix}/status`)
                .expect(200)
        })
    });
});