import express from "express";

import configureExpress from "./express";
import establishDatabaseConnection from "./postgres";
import validateConfig from "./config";
import loadFixtures from "./fixtures";

export default async (): Promise<express.Application> => {
    await validateConfig();
    await establishDatabaseConnection();
    await loadFixtures();
    return await configureExpress(express());
}
