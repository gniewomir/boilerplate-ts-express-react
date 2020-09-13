import config from "../config";
import Log from "./logger";

export default async () => {
    if (config.env !== 'testing') {
        Log.info('Skipped loading fixtures.');
        return;
    }

    Log.info('Fixtures loaded.');
    return;
}