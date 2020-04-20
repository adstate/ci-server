import * as config from '../agent-conf.json';
import os from 'os';
import {notify} from '../core/server-api';


async function init() {
    const agentHost = os.hostname();
    const agentPort = config.port;
    
    try {
        await notify(agentHost, agentPort);
    } catch(e) {
        console.error('Build server is not available. Agent was not registered');
    }
}

export default init;
