import {Permission} from "./Permission";
import {IAuthentication} from "../type/authentication";
import {Container} from "typedi";
import {setupApplication as app} from "../loader";
import faker from "faker";
import {UserRepository} from "../../database/repository/UserRepository";
import {getConnection} from "typeorm";
import {IPermission} from "../type/authorization";
import {AuthenticationService} from "../service/authentication/AuthenticationService";


describe('Permission', () => {
    afterAll(async () => {
        const connection = getConnection();
        if (connection.isConnected) {
            await connection.close();
        }
    })
    describe('To string', () => {
        it('Returns correct name', async () => {
            class TestPermission extends Permission implements IPermission {
                public constructor(authentication: IAuthentication) {
                    super(authentication);
                }
            }

            await app();
            const name = faker.name.findName();
            const email = faker.internet.email();
            const password = faker.internet.password();
            const user = await Container.get(UserRepository).createAndSave(name, email, password);
            const testAuthentication = await Container.get(AuthenticationService).createAuthentication(user);
            const subject = new TestPermission(testAuthentication);

            expect(subject.toString()).toBe('TestPermission');
        })
    })
})