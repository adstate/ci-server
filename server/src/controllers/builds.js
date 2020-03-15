const fs = require('fs');
const ciApi = require('../core/ci-api');
const ServerError = require('../errors/server-error');
const logCache = require('../core/log-cache');

async function getBuilds(req, res) {
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 25;

    let apiResponse;

    try {
        apiResponse = await ciApi.get('/build/list', {
            params: { offset, limit },
        });
    } catch (e) {
        throw new ServerError(500);
    }

    return res.json({
        status: 'success',
        data: apiResponse.data.data,
    });
}

async function addBuild(req, res) {
    let apiResponse;

    try {
        apiResponse = await ciApi.post('/build/request', {
            commitMessage: req.body.commitMessage,
            commitHash: req.body.commitHash,
            branchName: req.body.branchName,
            authorName: req.body.authorName,
        });
    } catch (e) {
        throw new ServerError(500);
    }

    return res.json({
        status: 'success',
    });
}

async function getBuild(req, res) {
    let apiResponse;

    try {
        apiResponse = await ciApi.get('/build/details', {
            params: { buildId: req.params.buildId },
        });
    } catch (e) {
        throw new ServerError(500);
    }

    return res.json({
        status: 'success',
        data: apiResponse.data.data,
    });
}

async function getBuildLog(req, res) {
    let apiResponse;
    let logs;

    const buildId = req.params.buildId;
    const cachedLog = logCache.getValidItem(buildId);

    if (cachedLog) {
        return res.json({
            status: 'success',
            data: cachedLog
        })
    }

    try {
        apiResponse = await ciApi.get('/build/log', {
            responseType: 'stream',
            params: { buildId }
        });
    
        apiResponse.data.on('data', (chunk) => {
            logs += chunk;
        });
    
        apiResponse.data.on('end', () => {
            logCache.addItem(buildId, logs);

            return res.json({
                status: 'success',
                data: logs
            })
        });        
    } catch (e) {
        throw new ServerError(500);
    }
}

module.exports = {
    getBuilds,
    addBuild,
    getBuild,
    getBuildLog
};
