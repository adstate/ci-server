const buildConfig = require('../../src/core/buildConf');

buildConfig.update({
    repoName: 'adstate/ci-server',
    repoStatus: 'Cloned',
    mainBranch: 'master'
});

module.exports = buildConfig;