import {Request, Response} from 'express';
import agentService from '../services/agentService';
import Agent from '../models/agent';
import buildService from '../services/buildService';

async function notifyAgent(req: Request, res: Response): Promise<Response> {
    //console.log('notify agent');

    const {
        host: agentHost,
        port: agentPort
    } = req.body;

    agentService.processNotify(agentHost, agentPort);

    return res.json({
        status: 'success'
    });
}

async function notifyBuildResult(req: Request, res: Response): Promise<any> {
    const {
        buildId,
        buildStatus,
        buildLog,
        duration
    } = req.body;

    const agent: Agent | undefined = agentService.getAgentByBuild(buildId);

    if (agent) {
        agentService.setAgentToWaiting(agent);
    }

    buildService.finishBuild({
        buildId,
        buildStatus,
        buildLog,
        duration
    });

    return res.json({
        status: 'success'
    });
}

export {
    notifyAgent,
    notifyBuildResult
}
