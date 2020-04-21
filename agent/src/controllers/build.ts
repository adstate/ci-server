import {Request, Response} from 'express';
import BuildData from '../../../server/src/models/buildData';
import buildService from '../services/buildService';

async function build(req: Request, res: Response): Promise<Response> {
    const {
        buildId,
        repoUrl,
        commitHash,
        buildCommand,
    } = req.body;

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