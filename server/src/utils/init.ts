import settingService from '../services/settingService';
import buildService from '../services/buildService';
import agentService from '../services/agentService';
import * as config from '../server-conf.json';


async function init() {
    await settingService.init();
    await buildService.init();
}

export default init;
