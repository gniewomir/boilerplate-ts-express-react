import request from 'supertest';
import express from 'express';
import app from '../../loaders';

describe('The user route', () => {
    describe('POST /api/user', () => {
        it('should return status code 200', async () => {
            const application = await app(express());
            // FIXME: only for testing
            return request(application)
                .post(`/api/user`)
                .expect(200)
        })
    });
});