import NotImplemented from "../error/NotImplemented";
import InvalidConfiguration from "../error/InvalidConfiguration";
import config from "../config";
import Log from "./logger";

export default async (): Promise<boolean> => {
    if (config.time.timezone !== 'utc') {
        throw new NotImplemented('Support for timezones other than UTC is currently not implemented.');
    }

    if (config.database.name !== 'testing' && config.env === 'testing') {
        throw new InvalidConfiguration('Wrong database name or environment.');
    }

    if (config.testing.database.drop && config.database.name !== 'testing') {
        throw new InvalidConfiguration('Cannot automatically drop database outside testing.');
    }

    Log.info('Configuration validated.');

    return true;
}