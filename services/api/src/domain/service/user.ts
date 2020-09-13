import {IUserService} from "../interface/IUserService";
import {IAuthentication} from "../../application/interface/IAuthenticated";
import {Service} from "typedi";
import UserRepository from "../../database/repository/user";
import AuthenticationService from "../../application/service/authentication";
import PasswordService from "../../application/service/password";
import InvalidAuthentication from "../../application/error/InvalidAuthentication";
import {IUserDto, IUserLoginDTO, IUserRegistrationDTO} from "../interface/user";
import UnprocessableEntity from "../../application/error/UnprocessableEntity";

@Service()
export default class UserService implements IUserService {

    constructor(
        private userRepository: UserRepository,
        private authenticationService: AuthenticationService,
        private passwordService: PasswordService
    ) {
    }

    public async authenticateByCredentials(credentials: IUserLoginDTO): Promise<IAuthentication> {
        const user = await this.userRepository.findByEmail(credentials.email);
        if (!user) {
            throw new InvalidAuthentication('user not found');
        }
        await this.passwordService.verifyPassword(credentials.password, user.password, user.salt);
        return await this.authenticationService.createAuthentication(user);
    }

    public async authenticateById(id: number): Promise<IAuthentication> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new InvalidAuthentication('user not found');
        }
        return await this.authenticationService.createAuthentication(user);
    }

    public async revokeAuthentication(token: string): Promise<undefined> {
        return await this.authenticationService.revokeAuthentication(token);
    }

    public async register(input: IUserRegistrationDTO): Promise<IUserDto> {
        if (await this.userRepository.findByEmail(input.email)) {
            throw new UnprocessableEntity('User already exists');
        }
        const user = await this.userRepository.createAndSave(input.name, input.email, input.password);
        return user.toDTO();
    }

}