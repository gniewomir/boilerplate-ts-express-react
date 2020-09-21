import {cleanupTestDatabaseConnection, setupTestApplicationUserAndAuthentication} from "../../../test/utility";

afterAll(cleanupTestDatabaseConnection)

describe('Authentication object', () => {
    it('Is sealed', async () => {
        const {authentication} = await setupTestApplicationUserAndAuthentication();
        try {
            // @ts-ignore
            authentication.test = 'test';
        } catch (error) {
            expect(error.name).toBe('TypeError');
        }
    });
    it('Is immutable', async () => {
        const {authentication} = await setupTestApplicationUserAndAuthentication();

        const token = authentication.getToken();
        const user = authentication.getUser();
        const mutatedToken = 'test';
        const mutatedUserId = user.id + 1;

        token.token = mutatedToken;
        user.id = mutatedUserId;

        expect(authentication.getToken().token).not.toBe(mutatedToken)
        expect(authentication.getUser().id).not.toBe(mutatedUserId)
    })
});
