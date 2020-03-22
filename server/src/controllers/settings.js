const ciApi = require('../core/ci-api');
const ServerError = require('../errors/server-error');
const GitUtils = require('../utils/git-utils');
const buildConfig = require('../core/buildConf');
const repoStatus = require('../models/repo-status');

async function saveSettings(req, res) {
    let apiResponse;

    const {
        repoName,
        buildCommand,
        mainBranch,
        period,
    } = req.body;

    const gitUtils = new GitUtils(repoName);
    const isNewRepo = buildConfig.repoName != repoName;

    if (isNewRepo) {
        try {
            apiResponse = await ciApi.deleteSettings();
        } catch(e) {
            throw new ServerError(500, e);
        }
    }

    try {
        const currentBranch = buildConfig.mainBranch;

        apiResponse = await ciApi.saveSettings({
            repoName,
            buildCommand,
            mainBranch,
            period,
        });

        buildConfig.update({
            repoName,
            buildCommand,
            mainBranch,
            period, 
        });
        buildConfig.actual = false;

        // make clone and add last commit to queue only if repository was changed and wasn't cloned before
        if (isNewRepo) {
            await gitUtils.clean(); // clean folder var/repo before clone new repository

            buildConfig.repoStatus = repoStatus.Cloning;

            gitUtils.clone()
                .then(async () => {
                    await gitUtils.checkout(mainBranch);

                    buildConfig.repoStatus = repoStatus.Cloned;

                    const lastCommit = await gitUtils.getLastCommit();

                    apiResponse = await ciApi.addBuild({
                        commitMessage: lastCommit.message,
                        commitHash: lastCommit.hash,
                        branchName: mainBranch,
                        authorName: lastCommit.author,
                    });

                    buildConfig.lastBuildedCommit = lastCommit;
                })
                .catch(err => {
                    console.log('ERROR:repository not found', err);
                })

        } else if (currentBranch != mainBranch) {
            gitUtils.pull().then(async () => {
                await gitUtils.checkout(mainBranch);

                const lastCommit = await gitUtils.getLastCommit();
    
                if (lastCommit.hash !== buildConfig.lastBuildedCommit.hash) {
                    apiResponse = await ciApi.addBuild({
                        commitMessage: lastCommit.message,
                        commitHash: lastCommit.hash,
                        branchName: mainBranch,
                        authorName: lastCommit.author,
                    });
    
                    buildConfig.lastBuildedCommit = lastCommit;
                }
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

    if (buildConfig.id && !buildConfig.actual) {
        return res.json({
            status: 'success',
            data: {
                id: buildConfig.id,
                repoName: buildConfig.repoName,
                buildCommand: buildConfig.buildCommand,
                mainBranch: buildConfig.mainBranch,
                period: buildConfig.period,
            },
        });
    }

    try {
        apiResponse = await ciApi.getSettings();
    } catch (e) {
        throw new ServerError(500);
    }

    buildConfig.update(apiResponse.data.data || apiResponse.data);

    return res.json({
        status: 'success',
        data: apiResponse.data.data || apiResponse.data,
    });
}

module.exports = {
    saveSettings,
    getSettings,
};
