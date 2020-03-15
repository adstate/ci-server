const buildConfig = require('../models/configuration');
const repoStatus = require('../models/repo-status');
const RepoStatusError = require('../errors/repo-status-error');

module.exports = (req, res, next) => {
    console.log('middleware', buildConfig.repoStatus);
    if (buildConfig.repoStatus === repoStatus.Cloning) {
        throw new RepoStatusError(200);
    }

    next();
};