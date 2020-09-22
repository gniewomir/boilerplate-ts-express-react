import {AuthenticationFailed} from "./AuthenticationFailed";
import {InvalidAuthentication} from "../../error/InvalidAuthentication";
import {Permission} from "../../permission/Permission";
import {IPermission} from "../../type/authorization";

describe('AuthenticationFailed object', () => {
    it('Is sealed', async () => {
        const subject = new AuthenticationFailed();
        try {
            // @ts-ignore
            subject.test = 'test';
        } catch (error) {
            expect(error.name).toBe('TypeError');
        }
    });
    it('To throw when asked for token', async () => {
        expect(() => {
            const subject = new AuthenticationFailed();
            subject.getToken();
        }).toThrow(InvalidAuthentication);
    })
    it('To throw when asked for user', async () => {
        expect(() => {
            const subject = new AuthenticationFailed();
            subject.getToken();
        }).toThrow(InvalidAuthentication);
    })
    it('Deny permissions', async () => {
        class TestPermission extends Permission implements IPermission {
        }

        expect((new AuthenticationFailed()).granted(new TestPermission())).toBe(false);
        expect((new AuthenticationFailed()).denied(new TestPermission())).toBe(true);
    })
    it('Deny authentication', async () => {
        expect((new AuthenticationFailed()).isAuthenticated()).toBe(false);
    })
});
