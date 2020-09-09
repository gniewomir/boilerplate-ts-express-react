import express from "express";

import expressLoader from "./express";
import postgresLoader from "./postgres";

export default async (app: express.Application) => {
    const postgresConnection = await postgresLoader(app);
    return await expressLoader(app);
}
