const ciApi = require('../core/ci-api');
const ServerError = require('../errors/server-error');
const GitUtils = require('../utils/git-utils');

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
        if (!gitUtils.contains()) {
            await gitUtils.clean(); //clean folder var/repo before clone new repository
            await gitUtils.clone();
        }

        const lastCommit = await gitUtils.getLastCommit();
        console.log(lastCommit);

        apiResponse = await ciApi.post('/conf', {
            repoName,
            buildCommand,
            mainBranch,
            period
        });
    } catch (e) {
        throw new ServerError(500, e.message);
    }

    return res.json({
        status: 'success',
    });
}

async function getSettings(req, res) {
    let apiResponse;

    try {
        apiResponse = await ciApi.get('/conf');
    } catch (e) {
        throw new ServerError(500);
    }

    return res.json({
        status: 'success',
        data: apiResponse.data.data,
    });
}

module.exports = {
    saveSettings,
    getSettings
};
