"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(err, req, res, next) {
    const { statusCode = 500, message = 'Internal server error', } = err;
    console.error(err);
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
    });
}
exports.default = default_1;
;
