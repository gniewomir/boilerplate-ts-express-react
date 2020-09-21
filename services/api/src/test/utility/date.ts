export const tokenExpirationToDateTestHelper = (exp: number): Date => {
    return new Date(exp * 1000);
}