const axios = require('axios');

const instance = axios.create({
    baseURL: '/api',
    timeout: 10000
});

async function saveSettings(settings) {
    return instance.post('/settings', {
        repoName: settings.repoName,
        buildCommand: settings.buildCommand,
        mainBranch: settings.mainBranch || 'master',
        period: Number(settings.period)
    });
}

async function getSettings() {
    return instance.get('/settings').then(response => response.data);
}

async function addBuild(commitHash) {
    return instance.post(`/builds/${commitHash}`).then(response => response.data);
}

async function getBuilds(params) {
    return instance.get('/builds', {params}).then(response => response.data);
}

async function getBuild(buildId) {
    return instance.get(`/builds/${buildId}`).then(response => response.data);
}

async function getBuildLog(buildId) {
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
