const repoStatus = require('./repo-status');

class Configuration {
    // по хорошему надо бы на случай рестарта сервера, перезапрашивать конфиг и проверять склонирован ли репозиторий
    // пока не хватает времени на реализацию

    constructor(opts) {
        opts = opts || {};

        this.id = opts.id || null;
        this.repoName = opts.repoName;
        this.buildCommand = opts.buildCommand;
        this.mainBranch = opts.mainBranch;
        this.period = opts.period;
        this.repoStatus = opts.repoStatus || repoStatus.Empty;
        this.actual = !!opts.id;
    }

    set(opts) {
        this.id = opts.id || null;
        this.repoName = opts.repoName;
        this.buildCommand = opts.buildCommand;
        this.mainBranch = opts.mainBranch;
        this.period = opts.period;
        this.repoStatus = opts.setRepoStatus || repoStatus.Empty;
    }

    update(opts) {
        this.set({ ...opts, repoStatus: this.repoStatus });
    }
}

module.exports = new Configuration();
