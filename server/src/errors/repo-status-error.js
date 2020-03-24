class RepoStatusError extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message || 'Repository is not cloned yet';
    }
}

module.exports = RepoStatusError;
