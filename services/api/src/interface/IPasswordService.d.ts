interface IPasswordService {
    hashPassword(password: string): Promise<{ hashedPassword: string, salt: string }>;

    verifyPassword(password: string, hashedPassword: string, salt: string): Promise<boolean>;
}