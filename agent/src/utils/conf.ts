import * as config from '../agent-conf.json';
import yargs from 'yargs';

function loadConfig() {
    const argv = yargs.options({
        port: { type: 'number' }
    }).argv;
}

export {
    loadConfig
};
