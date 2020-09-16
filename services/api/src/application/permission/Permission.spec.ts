import {Permission} from "./Permission";
import {IPermission} from "../type/authorization";


describe('Permission', () => {
    describe('To string', () => {
        it('Returns correct name', async () => {
            class TestPermission extends Permission implements IPermission {
            }

            expect((new TestPermission()).toString()).toBe('TestPermission');
        })
    })
})