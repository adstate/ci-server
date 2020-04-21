import {Request, Response} from 'express';
import agentService from '../services/agentService';
import Agent from '../models/agent';

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

    if (agent) {
        agentService.setAgentToWaiting(agent);
    }

    console.log('build is done', buildId);
    // change and save build status 

    return res.json({
        status: 'success'
    });
}

export {
    notifyAgent,
    notifyBuildResult
}
