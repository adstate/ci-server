const ciApi = require('../core/ci-api');
const RepoStatusError = require('../errors/repo-status-error');
const ServerError = require('../errors/server-error');
const logCache = require('../core/log-cache');
const repoStatus = require('../models/repo-status');
const buildConfig = require('../models/configuration');

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

    if (buildConfig.repoStatus === repoStatus.Cloning) {
        throw new RepoStatusError(200);
    }

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
    let logCacheWriteStream;

    const { buildId } = req.params;
    const cachedLog = logCache.getValidItem(buildId);

    try {
        if (cachedLog) {
            cachedLog.on('data', (chunk) => {
                res.statusCode = 200;
                res.write(chunk);
            });

            cachedLog.on('close', () => {
                res.statusCode = 200;
                res.end();
            });
        } else {
            logCacheWriteStream = logCache.addItem(buildId);

            apiResponse = await ciApi.get('/build/log', {
                responseType: 'stream',
                params: { buildId },
            });

            apiResponse.data.on('data', (chunk) => {
                if (logCacheWriteStream) {
                    logCacheWriteStream.write(chunk);
                }

                res.statusCode = 200;
                res.write(chunk);
            });

            apiResponse.data.on('end', () => {
                if (logCacheWriteStream) {
                    logCacheWriteStream.end();
                }

                res.statusCode = 200;
                res.end();
            });
        }
    } catch (e) {
        throw new ServerError(500);
    }
}

module.exports = {
    getBuilds,
    addBuild,
    getBuild,
    getBuildLog,
};
