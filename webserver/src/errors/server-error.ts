export default class ServerError extends Error {
    statusCode: number;
    
    constructor(statusCode: number, message?: string) {
        super();
        this.statusCode = statusCode;
        this.message = message || 'Internal server error';
    }
}

