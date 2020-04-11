const ciApi = require('../core/ci-api');
const ServerError = require('../errors/server-error');
const gitService = require('../core/git-service');
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

    const isNewRepo = buildConfig.repoName !== repoName;

    if (isNewRepo) {
        try {
            apiResponse = await ciApi.deleteSettings();
        } catch (e) {
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
            await gitService.clean(); // clean folder var/repo before clone new repository

            buildConfig.repoStatus = repoStatus.Cloning;

            gitService.clone()
                .then(async () => {
                    await gitService.checkout(mainBranch);

                    buildConfig.repoStatus = repoStatus.Cloned;

                    const lastCommit = await gitService.getLastCommit();

                    console.log('lastCommit', lastCommit);

                    apiResponse = await ciApi.addBuild({
                        commitMessage: lastCommit.message,
                        commitHash: lastCommit.hash,
                        branchName: mainBranch,
                        authorName: lastCommit.author,
                    });

                    buildConfig.lastBuildedCommit = lastCommit;
                })
                .catch((err) => {
                    buildConfig.repoStatus = repoStatus.NotCloned;
                    console.error('ERROR:repository not found', err);
                });
        } else if (currentBranch !== mainBranch) {
            gitService.pull().then(async () => {
                await gitService.checkout(mainBranch);

                const lastCommit = await gitService.getLastCommit();

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
        throw new ServerError(500, e);
    }

    return res.json({
        status: 'success',
        repoStatus: buildConfig.repoStatus
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
                repoStatus: buildConfig.repoStatus,
            },
        });
    }

    try {
        apiResponse = await ciApi.getSettings();
    } catch (e) {
        throw new ServerError(500);
    }

    const result = apiResponse.data.data || apiResponse.data;

    buildConfig.update(result);

    return res.json({
        status: 'success',
        data: {
            ...result,
            repoStatus: buildConfig.repoStatus
        },
    });
}

module.exports = {
    saveSettings,
    getSettings,
};
