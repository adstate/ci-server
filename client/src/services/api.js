const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://localhost:9000/api',
    timeout: 3000
});

async function saveSettings(settingsData) {
    return instance.post('/settings', settingsData);
}

async function getSettings() {
    return instance.get('/settings').then(response => response.data);
}

async function addBuild(buildData) {
    return instance.post('/build/request', buildData);
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
