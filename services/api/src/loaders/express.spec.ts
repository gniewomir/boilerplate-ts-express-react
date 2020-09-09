import request from 'supertest';
import express from 'express';
import expressLoader from './express';

describe('The express loader', () => {
    describe('GET /api/status', () => {
        it('should return status code 200', async () => {
            const app = await expressLoader(express());
            return request(app)
                .get(`/api/status`)
                .expect(200)
        })
    });
    describe('HEAD /api/status', () => {
        it('should return status code 200', async () => {
            const app = await expressLoader(express());
            return request(app)
                .head(`/api/status`)
                .expect(200)
        })
    });
});