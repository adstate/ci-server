export default class RepoStatusError extends Error {
    statusCode: number;

    constructor(statusCode: number, message?: string) {
        super();
        this.statusCode = statusCode;
        this.message = message || 'Repository is not cloned yet';
    }
}
