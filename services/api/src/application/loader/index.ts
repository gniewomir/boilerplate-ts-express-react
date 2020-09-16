import express from "express";

import {configureExpress} from "./express";
import {establishDatabaseConnection} from "./postgres";
import {configValidator} from "./config";

export const setupApplication = async (): Promise<express.Application> => {
    await configValidator();
    await establishDatabaseConnection();
    return configureExpress(express());
}
