import NotImplemented from "../error/NotImplemented";
import config from "../config";
import Log from "./logger";

export default async (): Promise<boolean> => {
    if (config.time.timezone !== 'utc') {
        throw new NotImplemented('Support for timezones other than UTC is currently not implemented.');
    }

    Log.info('Configuration validated.');

    return true;
}