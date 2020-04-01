const axios = require('axios');
const { Agent } = require('https');

const httpsAgent = new Agent({
    rejectUnauthorized: false,
});

const instance = axios.create({
    baseURL: 'https://hw.shri.yandex/api',
    timeout: 10000,
    headers: { Authorization: `Bearer ${process.env.JWT_TOKEN}` },
    httpsAgent,
});

async function saveSettings(settingsData) {
    return instance.post('/conf', settingsData);
}

async function getSettings() {
    return instance.get('/conf');
}

async function deleteSettings() {
    return instance.delete('/conf');
}

async function addBuild(buildData) {
    return instance.post('/build/request', buildData);
}

async function getBuilds(opts) {
    return instance.get('/build/list', {
        params: opts,
    });
}

async function getBuild(buildId) {
    return instance.get('/build/details', {
        params: { buildId },
    });
}

async function getBuildLog(buildId) {
    return instance.get('/build/log', {
        responseType: 'stream',
        params: { buildId },
    });
}

async function buildFinish(data) {
    return instance.post('build/finish', data);
}

module.exports = {
    instance,
    saveSettings,
    getSettings,
    deleteSettings,
    addBuild,
    getBuilds,
    getBuild,
    getBuildLog,
    buildFinish,
};
