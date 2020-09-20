import {IUserService} from "../type/IUserService";
import {IAuthentication} from "../../application/type/authentication";
import {Service} from "typedi";
import {UserRepository} from "../../database/repository/UserRepository";
import {InvalidAuthentication} from "../../application/error/InvalidAuthentication";
import {IUserDto, IUserLoginInputDTO, IUserRegistrationInputDTO, IUserUpdateInputDTO} from "../type/user";
import {UnprocessableEntity} from "../../application/error/UnprocessableEntity";
import {AuthenticationService} from "../../application/service/authentication/AuthenticationService";
import {PasswordService} from "../../application/service/password/PasswordService";

@Service()
export class UserService implements IUserService {

    constructor(
        private userRepository: UserRepository,
        private authenticationService: AuthenticationService,
        private passwordService: PasswordService
    ) {
    }

    public async authenticateByCredentials(credentials: IUserLoginInputDTO): Promise<IAuthentication> {
        if (!credentials.email) {
            throw new UnprocessableEntity('Email cannot be empty', 'password');
        }
        if (!credentials.password) {
            throw new UnprocessableEntity('Password cannot be empty', 'password');
        }
        const user = await this.userRepository.findByEmail(credentials.email);
        if (!user) {
            throw new InvalidAuthentication('user not found');
        }
        await this.passwordService.verifyPassword(credentials.password, user.password, user.salt);
        return await this.authenticationService.createUserAuthentication(user);
    }

    public async authenticateById(id: number): Promise<IAuthentication> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new InvalidAuthentication('user not found');
        }
        return await this.authenticationService.createUserAuthentication(user);
    }

    public async revokeAuthentication(token: string): Promise<undefined> {
        return await this.authenticationService.revokeToken(token);
    }

    public async register(input: IUserRegistrationInputDTO): Promise<IUserDto> {
        if (!input.email) {
            throw new UnprocessableEntity('Email cannot be empty', 'email');
        }
        if (await this.userRepository.findByEmail(input.email)) {
            throw new UnprocessableEntity('User already exists', 'email');
        }
        if (!input.password) {
            throw new UnprocessableEntity('Password cannot be empty', 'password');
        }
        const user = await this.userRepository.createAndSave(input.name, input.email, input.password);
        return user.toDTO();
    }

    public async update(userId: number, input: IUserUpdateInputDTO): Promise<IUserDto> {
        if ('email' in input && input.email === '') {
            throw new UnprocessableEntity('Email cannot be empty', 'email');
        }
        if ('email' in input && await this.userRepository.findByEmail(input.email)) {
            throw new UnprocessableEntity('Email already taken', 'email');
        }
        if ('password' in input && input.password === '') {
            throw new UnprocessableEntity('Password cannot be empty', 'password');
        }
        const user = await this.userRepository.update(userId, input);
        return user.toDTO();
    }

    public async find(id: number): Promise<IUserDto> {
        const user = await this.userRepository.findById(id);
        return user.toDTO();
    }

}