import express from "express";

import configureExpress from "./express";
import establishDatabaseConnection from "./postgres";
import validateConfig from "./config";

export default async (): Promise<express.Application> => {
    await validateConfig();
    await establishDatabaseConnection();
    return await configureExpress(express());
}
