import axios from 'axios';
import { Agent } from 'https';
import {AxiosResponse} from 'axios';
import {Stream} from 'stream';
import {
    ConfigurationInput,
    QueueBuildInput,
    ConfigurationModelApiResponse,
    BuildModelApiResponse,
    BuildModelArrayApiResponse
} from '../models';

const httpsAgent = new Agent({
    rejectUnauthorized: false,
});

const instance = axios.create({
    baseURL: 'https://hw.shri.yandex/api',
    timeout: 10000,
    headers: { Authorization: `Bearer ${process.env.JWT_TOKEN}` },
    httpsAgent,
});

async function saveSettings(settingsData: ConfigurationInput): Promise<ConfigurationModelApiResponse> {
    return instance.post('/conf', settingsData).then(res => res.data);
}

async function getSettings(): Promise<ConfigurationModelApiResponse> {
    return instance.get('/conf').then(res => res.data);
}

async function deleteSettings(): Promise<ConfigurationModelApiResponse> {
    return instance.delete('/conf').then(res => res.data);
}

async function addBuild(buildData: QueueBuildInput): Promise<any> {
    return instance.post('/build/request', buildData).then(res => res.data);
}

async function getBuilds(opts: {
    offset: number,
    limit: number
}): Promise<BuildModelArrayApiResponse> {
    return instance.get('/build/list', {
        params: opts,
    })
    .then(res => res.data);
}

async function getBuild(buildId: string): Promise<BuildModelApiResponse> {
    return instance.get('/build/details', {
        params: { buildId },
    })
    .then(res => res.data);
}

async function getBuildLog(buildId: string): Promise<AxiosResponse<Stream>> {
    return instance.get('/build/log', {
        responseType: 'stream',
        params: { buildId },
    })
}

export default {
    instance,
    saveSettings,
    getSettings,
    deleteSettings,
    addBuild,
    getBuilds,
    getBuild,
    getBuildLog,
};
