import {Request, Response} from 'express';
import agentService from '../services/agentService';
import Agent from '../models/agent';
import buildService from '../services/buildService';

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

async function notifyBuildResult(req: Request, res: Response): Promise<any> {
    console.log('notify build result');

    const {
        buildId,
        buildStatus,
        buildLog
    } = req.body;

    const agent: Agent | undefined = agentService.getAgentByBuild(buildId);

    console.log(agent);

    if (agent) {
        agentService.setAgentToWaiting(agent);
    }

    buildService.finishBuild({
        buildId,
        buildStatus,
        buildLog
    });

    return res.json({
        status: 'success'
    });
}

export {
    notifyAgent,
    notifyBuildResult
}
