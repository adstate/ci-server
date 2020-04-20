import {Request, Response, NextFunction, Errback} from 'express';

export default function (err: any, req: Request, res: Response, next: NextFunction) {
    const {
        statusCode = 500,
        message = 'Internal server error',
    } = err;

    console.error(err);

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
    });
};
