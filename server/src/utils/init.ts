import settingService from '../services/settingService';
import buildService from '../services/buildService';
import agentService from '../services/agentService';

async function init() {
    await settingService.init();
    await buildService.init();
}

export default init;
