import {Request, Response} from 'express';
import AgentStatus from '../models/agentStatus';
import buildService from '../services/buildService';

async function build(req: Request, res: Response): Promise<Response> {
    const {
        buildId,
        repoUrl,
        commitHash,
        buildCommand,
    } = req.body;

    if (buildService.processingBuildId) {
        return res.json({
            status: AgentStatus.Busy
        });
    }

    buildService.runBuild({
        buildId,
        repoUrl,
        commitHash,
        buildCommand,
    });

    return res.json({
        status: 'success'
    });
}

export {
    build
}