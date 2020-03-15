const ciApi = require('../core/ci-api');
const ServerError = require('../errors/server-error');
const GitUtils = require('../utils/git-utils');
const buildConfig = require('../models/configuration');
const repoStatus = require('../models/repo-status');

async function saveSettings(req, res) {
    let apiResponse;

    const {
        repoName,
        buildCommand,
        mainBranch,
        period
    } = req.body;

    const gitUtils = new GitUtils(repoName);

    try {
        //make clone and add last commit to queue only if repository was changed and wasn't cloned before
        if (!gitUtils.contains()) {
            await gitUtils.clean(); //clean folder var/repo before clone new repository
            
            buildConfig.repoStatus = repoStatus.Cloning;

            gitUtils.clone().then(async () => {
                buildConfig.repoStatus = repoStatus.Cloned;

                apiResponse = await ciApi.post('/conf', {
                    repoName,
                    buildCommand,
                    mainBranch,
                    period
                });
    
                const lastCommit = await gitUtils.getLastCommit();
    
                apiResponse = await ciApi.post('/build/request', {
                    commitMessage: lastCommit.message,
                    commitHash: lastCommit.hash,
                    branchName: mainBranch,
                    authorName: lastCommit.author,
                });
            });
        }
    } catch (e) {
        throw new ServerError(500, e.message);
    }

    return res.json({
        status: 'success',
    });
}

async function getSettings(req, res) {
    let apiResponse;

    if (buildConfig.id) {
        return res.json({
            status: 'success',
            data: {
                id: buildConfig.id,
                repoName: buildConfig.repoName,
                buildCommand: buildConfig.buildCommand,
                mainBranch: buildConfig.mainBranch,
                period: buildConfig.period
            },
        })
    }

    try {
        apiResponse = await ciApi.get('/conf');
    } catch (e) {
        throw new ServerError(500);
    }

    buildConfig.set(Object.assign(apiResponse.data.data, {repoStatus: buildConfig.repoStatus}));

    return res.json({
        status: 'success',
        data: apiResponse.data.data,
    });
}

module.exports = {
    saveSettings,
    getSettings
};
