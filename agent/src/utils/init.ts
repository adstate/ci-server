import * as config from '../agent-conf.json';
import fs from 'fs';
import util from 'util';
import buildService from '../services/buildService';
import gitService from '../services/gitService';
import notifyService from '../services/notifyService';

const exists = util.promisify(fs.exists);
const mkdir = util.promisify(fs.mkdir);


async function init() {
    const varDir = './var';
    if (!await exists(varDir)) {
        try {
            mkdir(varDir);
        } catch(e) {
            console.error('Error of creating var directory', e);
        }
    }

    await gitService.init();
    await notifyService.init();
}

export default init;
