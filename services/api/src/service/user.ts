import {IUserService} from "../interface/IUserService";
import {IAuthenticated} from "../interface/IAuthenticated";
import {Service} from "typedi";
import UserRepository from "../repository/user";
import AuthenticationService from "./authentication";
import PasswordService from "./password";
import InvalidAuthentication from "../error/InvalidAuthentication";

@Service()
export default class UserService implements IUserService {

    constructor(
        private userRepository: UserRepository,
        private authenticationService: AuthenticationService,
        private passwordService: PasswordService
    ) {
    }

    public async authenticateByCredentials(email: string, password: string): Promise<IAuthenticated> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new InvalidAuthentication('user not found');
        }
        await this.passwordService.verifyPassword(password, user.password, user.salt);
        return await this.authenticationService.createAuthentication(user);
    }

    public async authenticateById(id: number): Promise<IAuthenticated> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new InvalidAuthentication('user not found');
        }
        return await this.authenticationService.createAuthentication(user);
    }

    public async revokeAuthentication(token: string): Promise<undefined> {
        return await this.authenticationService.revokeAuthentication(token);
    }

}