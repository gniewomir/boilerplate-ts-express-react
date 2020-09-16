export type HttpMethod = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH";

export interface IRouteListEntry {
    method: HttpMethod
    route: string
}

export type HttpRouteList = IRouteListEntry[];
