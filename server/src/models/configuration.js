const repoStatus = require('./repo-status');

module.exports = class Configuration {
    constructor(opts) {
        this.set(opts);
    }

    set(opts) {
        opts = opts || {};

        this.id = opts.id || null;
        this.repoName = opts.repoName;
        this.buildCommand = opts.buildCommand;
        this.mainBranch = opts.mainBranch;
        this.period = opts.period;
        this.repoStatus = opts.repoStatus || repoStatus.Empty;
        this.lastBuildedCommit = opts.lastBuildedCommit || null;
        this.actual = !!opts.id;
    }

    update(opts) {
        opts = opts || {};

        this.id = opts.id || this.id;
        this.repoName = opts.repoName || this.repoName;
        this.buildCommand = opts.buildCommand || this.buildCommand;
        this.mainBranch = opts.mainBranch || this.mainBranch;
        this.period = opts.period || this.period;
        this.repoStatus = opts.repoStatus || this.repoStatus;
        this.lastBuildedCommit = opts.lastBuildedCommit || this.lastBuildedCommit;
        this.actual = opts.actual || !!opts.id;
    }
}

