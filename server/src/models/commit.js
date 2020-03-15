module.exports = class Commit {
    constructor(opts) {
        this.hash = opts.hash;
        this.author = opts.author;
        this.message = opts.message;
    }
}