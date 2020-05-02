class Build {
    constructor(opts) {
        this.id = opts.id || null;
        this.configurationId = opts.configurationId;
        this.buildNumber = opts.buildNumber;
        this.commitMessage = opts.commitMessage;
        this.commitHash = opts.commitHash;
        this.branchName = opts.branchName;
        this.authorName = opts.authorName;
        this.status = opts.status;
    }
}

module.exports = Build;
