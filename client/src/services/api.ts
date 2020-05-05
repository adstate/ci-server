import axios from 'axios';
import {
    ConfigurationInput,
    SettingsResponse,
    BuildRequestReponse,
    GetBuildReponse,
    BuildListResponse
} from '../../../webserver/src/models';

const instance = axios.create({
    baseURL: 'http://localhost:9000/api',
    timeout: 10000
});

async function saveSettings(settings: ConfigurationInput): Promise<SettingsResponse> {
    return instance.post('/settings', {
        repoName: settings.repoName,
        buildCommand: settings.buildCommand,
        mainBranch: settings.mainBranch || 'master',
        period: Number(settings.period)
    });
}

async function getSettings(): Promise<SettingsResponse> {
    return instance.get('/settings').then(response => response.data);
}

async function addBuild(commitHash: string): Promise<BuildRequestReponse> {
    return instance.post(`/builds/${commitHash}`).then(response => response.data);
}

async function getBuilds(params: {
    offset: number,
    limit: number
}): Promise<BuildListResponse> {
    return instance.get('/builds', {params}).then(response => response.data);
}

async function getBuild(buildId: string): Promise<GetBuildReponse> {
    return instance.get(`/builds/${buildId}`).then(response => response.data);
}

async function getBuildLog(buildId: string): Promise<string> {
    return instance.get(`/builds/${buildId}/logs`).then(response => response.data);
}

export default {
    saveSettings,
    getSettings,
    addBuild,
    getBuilds,
    getBuild,
    getBuildLog,
};
