import * as config from '../agent-conf.json';
import os from 'os';
import fs from 'fs';
import util from 'util';
import {notify} from '../core/server-api';
import buildService from '../services/buildService';
import gitService from '../services/gitService';

const exists = util.promisify(fs.exists);
const mkdir = util.promisify(fs.mkdir);


async function init() {
    const agentHost = os.hostname();
    const agentPort = config.port;

    try {
        await notify(agentHost, agentPort);
    } catch(e) {
        console.error('Build server is not available.');
    }
    
    setInterval(async () => {
        try {
            await notify(agentHost, agentPort);
        } catch(e) {
            console.error('Build server is not available.');
        }
    }, 60 * 1000);

    const varDir = './var';
    if (!await exists(varDir)) {
        try {
            mkdir(varDir);
        } catch(e) {
            console.error('Error of creating var directory', e);
        }
    }

    await gitService.init();
}

export default init;
