import axios, { AxiosAdapter, AxiosInstance } from 'axios';
import * as config from '../agent-conf.json';


async function notify(host: string, port: number) {
    const serverHost = config.serverHost;
    const serverPort = config.serverPort;

    console.log(serverHost, serverPort);

    return axios.post(`http://${serverHost}:${serverPort}/notify-agent`, {
        host,
        port
    });
}

export {
    notify
}