import {getConnection} from "typeorm";
import {setupApplication} from "../../application/loader";
import faker from "faker";
import {Container} from "typedi";
import {AuthenticationService} from "../../application/service/authentication/AuthenticationService";
import {UserService} from "../../domain/service/UserService";
import {UserRepository} from "../../database/repository/UserRepository";

export const cleanupTestDatabaseConnection = async () => {
    const connection = getConnection();
    if (connection.isConnected) {
        await connection.close();
    }
}

export const setupTestApplication = async () => {
    return await setupApplication();
}

export const fakeUniqueUserEmail = async (): Promise<string> => {
    let email = faker.internet.email();
    if (!getConnection().isConnected) {
        throw Error('No database connection is open!');
    }
    while (await Container.get(UserRepository).findByEmail(email)) {
        email = faker.internet.email();
    }
    return email;
}

export const setupTestApplicationUserAndAuthentication = async () => {
    const application = await setupTestApplication();
    const name = faker.name.findName();
    const email = await fakeUniqueUserEmail();
    const plainPassword = faker.internet.password();
    const user = await Container.get(UserService).register({
        name,
        email,
        password: plainPassword
    })
    const authentication = await Container.get(AuthenticationService).createUserAuthentication(user);
    return {
        application,
        authentication,
        user,
        plainPassword
    };
}
