import {getConnection} from "typeorm";
import {setupApplication} from "../../application/loader";
import faker from "faker";
import {Container} from "typedi";
import {AuthenticationService} from "../../application/service/authentication/AuthenticationService";
import {UserService} from "../../domain/service/UserService";


export const CleanupAfterAll = async () => {
    const connection = getConnection();
    if (connection.isConnected) {
        await connection.close();
    }
}

export const SetupApplication = async () => {
    return await setupApplication();
}

export const SetupApplicationUserAndAuthentication = async () => {
    const application = await SetupApplication();
    const name = faker.name.findName();
    const email = faker.internet.email();
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
