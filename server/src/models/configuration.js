module.exports = class Configuration {
    constructor(opts) {
        if (opts) {
            this.id = opts.id || null;
            this.repoName = opts.repoName;
            this.buildCommand = opts.buildCommand;
            this.mainBranch = opts.mainBranch;
            this.period = opts.period;
        }
    }

    set(opts) {
        this.id = opts.id || null;
        this.repoName = opts.repoName;
        this.buildCommand = opts.buildCommand;
        this.mainBranch = opts.mainBranch;
        this.period = opts.period;
    }
}
