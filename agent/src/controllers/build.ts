import {Request, Response} from 'express';

async function build(req: Request, res: Response): Promise<Response> {
    return res.json({
        status: 'success',
        data: {
            build: 'build'
        }
    });
}

export {
    build
}