class Configuration {
    constructor(opts) {
        this.id = opts.id || null;
        this.repoName = opts.repoName;
        this.buildCommand = opts.buildCommand;
        this.mainBranch = opts.mainBranch;
        this.period = opts.period;
    }
}

module.exports = Configuration;
