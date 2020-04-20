import {Request, Response} from 'express';

async function notifyAgent(req: Request, res: Response): Promise<Response> {
    return res.json({
        status: 'success',
        data: {
            notify: 'agent'
        }
    });
}

export {
    notifyAgent
}
