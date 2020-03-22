const path = require('path');
const GitUtils = require('../utils/git-utils');
const buildConfig = require('../core/buildConf');
const ciApi = require('./ci-api');
const repoStatus = require('../models/repo-status');

class GitService {
    constructor(buildConfig, gitUtils) {
        this.repoDir = './var/repo';
        this.repoUrl = null;
        this.repoInternalPath = null;
        this.shortRepoName = null;

        this.buildConfig = buildConfig;
        this.gitUtils = gitUtils;

        buildConfig.on('init', () => {
            setInterval(this.checkNewCommits.bind(this), this.buildConfig.period * 60 * 1000);
        });

        buildConfig.on('change', () => {
            console.log('onConfigChange');
            this.update();
        });
    }

    clone() {
        return this.gitUtils.clone(this.repoUrl, this.repoInternalPath);
    }

    pull() {
        return this.gitUtils.pull(this.repoInternalPath);
    }

    checkout() {
        return this.gitUtils.checkout(this.buildConfig.mainBranch, this.repoInternalPath);
    }

    contains() {
        return this.gitUtils.contains(this.repoInternalPath);
    }

    getLastCommit() {
        return this.gitUtils.getLastCommit(this.repoInternalPath);
    }

    getNewCommits() {
        return this.gitUtils.getNewCommits(this.buildConfig.lastBuildedCommit.hash, this.repoInternalPath);
    }

    clean() {
        return this.gitUtils.clean(this.repoDir);
    }

    update() {
        this.repoUrl = `https://github.com/${this.buildConfig.repoName}`;
        this.shortRepoName = this.buildConfig.repoName.split('/')[1];
        this.repoInternalPath = path.join(this.repoDir, this.shortRepoName);
    }

    async checkNewCommits() {
        if (this.buildConfig.lastBuildedCommit && this.buildConfig.repoStatus == repoStatus.Cloned) {
            const lastCommitHash = this.buildConfig.lastBuildedCommit.hash;
            const mainBranch = this.buildConfig.mainBranch;

            await this.pull();
            const commits = await this.gitUtils.getNewCommits(lastCommitHash, this.repoInternalPath);

            commits.reverse().forEach(async (commit) => {
                try {
                    const buildData = {
                        commitMessage: commit.message,
                        commitHash: commit.hash,
                        branchName: mainBranch,
                        authorName: commit.author,
                    };

                    await ciApi.addBuild(buildData);

                    this.buildConfig.lastBuildedCommit = commit;
                } catch(e) {
                   console.log(e.stack);
                }
            });
        }
    }

}

module.exports = new GitService(buildConfig, new GitUtils());