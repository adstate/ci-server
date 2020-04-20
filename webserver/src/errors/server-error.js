class ServerError extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message || 'Internal server error';
    }
}

module.exports = ServerError;
