import axios, { AxiosAdapter, AxiosInstance } from 'axios';
import * as config from '../agent-conf.json';
import BuildResult from '../models/buildResult';


async function notify(host: string, port: number) {
    const serverHost = config.serverHost;
    const serverPort = config.serverPort;

    return axios.post(`http://${serverHost}:${serverPort}/notify-agent`, {
        host,
        port
    });
}

async function notifyBuildResult(buildResult: BuildResult): Promise<any> {
    const serverHost = config.serverHost;
    const serverPort = config.serverPort;

    return axios.post(`http://${serverHost}:${serverPort}/notify-build-result`, buildResult);
}

export {
    notify,
    notifyBuildResult
}