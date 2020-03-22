const buildConfig = require('../core/buildConf');
const ciApi = require('../core/ci-api');
const GitUtils = require('../utils/git-utils');
const repoStatus = require('../models/repo-status');

async function load() {
    const config = await ciApi.get('/conf');
    
    let lastBuildData;
    let lastBuild;

    try {
        lastBuildData = await ciApi.get('/build/list', {
            params: { offset: 0, limit: 1}
        });

        [ lastBuild ] = lastBuildData.data.data;
    } catch(e) {
        lastBuildData = null;
        lastBuild = null;
    }

    buildConfig.update(config.data.data || config.data);

    buildConfig.lastBuildedCommit = (lastBuild) ? {
        hash: lastBuild.commitHash,
        message: lastBuild.commitMessage,
        author: lastBuild.authorName
    } : null;

    await checkRepo();
}

async function checkRepo() {
    if (!buildConfig.repoName) {
        return;
    }

    const gitUtils = new GitUtils(buildConfig.repoName);

    if (!gitUtils.contains()) {
        await gitUtils.clean();
        buildConfig.repoStatus = repoStatus.Cloning;

        await gitUtils.clone();
        buildConfig.repoStatus = repoStatus.Cloned;
    }
}

module.exports = {
    load,
};
