const GitUtils = require('../utils/git-utils');
const buildConfig = require('../core/buildConf');

class GitService {
    constructor(buildConfig, gitUtils) {
        this.buildConfig = buildConfig;
        this.gitUtils = gitUtils;

        setInterval(this.checkNewCommits.bind(this), 0.5 * 60 * 1000);
    }

    checkNewCommits() {
        console.log('checking new commites');
        this.gitUtils.getNewCommits(buildConfig.lastBuildedCommit).then((res) => {
            //console.log('NEW COMMITES___res', res);
        });
    }

}

const gitUtils = new GitUtils(buildConfig.repoName);

module.export = new GitService(
    buildConfig,
    gitUtils
);