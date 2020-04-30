import {Errback, Request, Response, NextFunction} from 'express';

export default (err: any, req: Request, res: Response, next: NextFunction) => {
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
