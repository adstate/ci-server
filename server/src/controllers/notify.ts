import {Request, Response} from 'express';
import agentService from '../services/agentService';

async function notifyAgent(req: Request, res: Response): Promise<Response> {
    console.log('notify agent');

    const {
        host: agentHost,
        port: agentPort
    } = req.body;

    agentService.register(agentHost, agentPort);

    return res.json({
        status: 'success'
    });
}

export {
    notifyAgent
}
