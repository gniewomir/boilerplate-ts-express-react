type HttpMethod = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH";

interface IWhitelistEntry {
    method: HttpMethod
    route: string
}

export type HttpWhitelist = IWhitelistEntry[];
