import crypto from "crypto";
import {config} from "../../application/config";

export const SignedCookiePayload = (payload: string) => {
    const signed = 's:' + payload + '.' + crypto
        .createHmac('sha256', config.security.cookies.secrets[0])
        .update(payload)
        .digest('base64')
        .replace(/=+$/, '')
    return `${config.security.cookies.refresh_token_cookie_name}=${signed};`
};