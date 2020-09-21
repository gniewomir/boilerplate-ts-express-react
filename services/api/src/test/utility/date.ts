export const TokenExpirationToDate = (exp: number): Date => {
    return new Date(exp * 1000);
}