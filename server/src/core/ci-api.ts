import axios, { AxiosAdapter, AxiosInstance } from 'axios';
import { Agent } from 'https';
import Settings from '../models/settings';
import SettingReponse from '../models/settingResponse';
import BuildListResponse from '../models/buildListResponse';


const httpsAgent: Agent = new Agent({
    rejectUnauthorized: false,
});

const instance: AxiosInstance = axios.create({
    baseURL: 'https://hw.shri.yandex/api',
    timeout: 10000,
    headers: { Authorization: `Bearer ${process.env.JWT_TOKEN}` },
    httpsAgent,
});

async function getSettings(): Promise<SettingReponse> {
    return instance.get('/conf').then(res => res.data);
}

async function getBuilds(opts: {
    limit: number,
    offset: number
}): Promise<BuildListResponse> {
    return instance.get('/build/list', {params: opts}).then(res => res.data);
}

async function getBuild(buildId: string) {
    return instance.get('/build/details', {
        params: { buildId },
    });
}

async function getBuildLog(buildId: string) {
    return instance.get('/build/log', {
        responseType: 'stream',
        params: { buildId },
    });
}

async function buildStart(buildId: string) {
    return instance.post('build/start', {
        buildId,
        dateTime: new Date().toISOString
    })
}

async function buildFinish(data: any) {
    return instance.post('build/finish', data);
}

export {
    instance,
    getSettings,
    getBuilds,
    getBuild,
    getBuildLog,
    buildStart,
    buildFinish,
};
