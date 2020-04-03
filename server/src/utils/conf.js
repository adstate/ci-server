const buildConfig = require('../core/buildConf');
const ciApi = require('../core/ci-api');
const gitService = require('../core/git-service');
const repoStatus = require('../models/repo-status');
const fs = require('fs');

const util = require('util');
const exists = util.promisify(fs.exists);
const mkdir = util.promisify(fs.mkdir);

async function load() {
    const varFolder = './var';

    if (!await exists(varFolder)) {
        try {
            mkdir(varFolder);
        } catch(e) {
            console.error('Error of creating var folder', err);
        }
    }

    const config = await ciApi.getSettings();

    let lastBuildData;
    let lastBuild;

    try {
        lastBuildData = await ciApi.getBuilds({ offset: 0, limit: 1 });

        [lastBuild] = lastBuildData.data.data;
    } catch (e) {
        lastBuildData = null;
        lastBuild = null;
    }

    buildConfig.init(config.data.data || config.data);

    buildConfig.lastBuildedCommit = (lastBuild) ? {
        hash: lastBuild.commitHash,
        message: lastBuild.commitMessage,
        author: lastBuild.authorName,
    } : null;

    await checkRepo();
}

async function checkRepo() {
    if (!buildConfig.repoName) {
        return;
    }

    if (!gitService.contains()) {
        await gitService.clean();
        buildConfig.repoStatus = repoStatus.Cloning;

        await gitService.clone();
        buildConfig.repoStatus = repoStatus.Cloned;
    } else {
        buildConfig.repoStatus = repoStatus.Cloned;
    }
}

module.exports = {
    load,
};
