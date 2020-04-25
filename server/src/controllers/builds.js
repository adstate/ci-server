const ciApi = require('../core/ci-api');
const RepoStatusError = require('../errors/repo-status-error');
const ServerError = require('../errors/server-error');
const logCache = require('../core/log-cache');
const repoStatus = require('../models/repo-status');
const buildConfig = require('../core/buildConf');
const gitService = require('../core/git-service');

async function getBuilds(req, res) {
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 25;

    let apiResponse;

    try {
        apiResponse = await ciApi.getBuilds({ offset, limit });
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
        throw new RepoStatusError(500);
    }

    const {commitHash} = req.params;
    const commit = await gitService.getCommitInfo(commitHash);
    
    const commitData = {
        commitMessage: commit.message,
        commitHash: commitHash,
        branchName: buildConfig.mainBranch,
        authorName: commit.author,
    }

    try {
        apiResponse = await ciApi.addBuild(commitData);
    } catch (e) {
        throw new ServerError(apiResponse.status || 500);
    }

    return res.json({
        status: 'success',
        data: {
            ...apiResponse.data.data,
            ...commitData
        }
    });
}

async function getBuild(req, res) {
    let apiResponse;

    try {
        apiResponse = await ciApi.getBuild(req.params.buildId);
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
    const cachedLog = await logCache.getValidItem(buildId);

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

        try {
            apiResponse = await ciApi.getBuildLog(buildId);

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
        } catch (e) {
            throw new ServerError(500, e.message);
        }
    }
}

async function buildFinish(req, res) {
    const {
        buildId,
        duration,
        success,
        buildLog
    } = req.body;

    let apiResponse;

    try {
        apiResponse = ciApi.buildFinish({
            buildId,
            duration,
            success,
            buildLog
        });

    } catch(e) {
        throw new ServerError(apiResponse.status || 500, e.message);
    }

    return res.json({
        status: 'success',
        data: apiResponse.data.data,
    });
}

module.exports = {
    getBuilds,
    addBuild,
    getBuild,
    getBuildLog,
    buildFinish
};
