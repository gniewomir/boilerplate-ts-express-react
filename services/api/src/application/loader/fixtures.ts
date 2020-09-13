import config from "../config";
import Log from "./logger";
import {Container} from "typedi";
import UserRepository from "../../database/repository/user";

export default async () => {
    if (config.env === 'development') {
        const repository = Container.get(UserRepository);
        const user = await repository.findByEmail('gniewomir.swiechowski@gmail.com');
        if (!user) {
            await repository.createAndSave('Gniewomir Świechowski', 'gniewomir.swiechowski@gmail.com', 'kNcy64fWbcAGBPY3')
        }
        Log.info('Fixtures loaded.');
        return;
    }

    Log.info('Skipped loading fixtures.');
    return;
}