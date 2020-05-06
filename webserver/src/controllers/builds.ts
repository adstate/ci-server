import ciApi from '../core/ci-api';
import { AxiosResponse } from 'axios';
import {Stream} from 'stream';
import {WriteStream, ReadStream} from 'fs';
import RepoStatusError from '../errors/repo-status-error';
import ServerError from '../errors/server-error';
import logCache from '../core/log-cache';
import repoStatus from '../models/repoStatus';
import buildConfig from '../core/buildConf';
import gitService from '../core/git-service';
import {Request, Response} from 'express';
import {
    BuildModelArrayApiResponse,
    BuildRequestResultModelApiResponse,
    BuildModelApiResponse,
    QueueBuildInput
} from '../models';
import BuildListResponse from '../models/buildListResponse';
import BuildRequestReponse from '../models/buildRequestResponse';
import GetBuildResponse from '../models/getBuildResponse';
import { CommitInfo } from '../utils/git-utils';

interface BuildListQueryParams {
    offset: number;
    limit: number;
}

async function getBuilds(req: Request<any, any, any, BuildListQueryParams>, res: Response<BuildListResponse>) {
    const offset: number = req.query.offset || 0;
    const limit: number = req.query.limit || 25;

    let apiResponse: BuildModelArrayApiResponse;

    try {
        apiResponse = await ciApi.getBuilds({offset, limit});
    } catch (e) {
        throw new ServerError(500);
    }

    return res.json({
        status: 'success',
        data: apiResponse.data,
    });
}

async function addBuild(req: Request, res: Response<BuildRequestReponse>) {
    let apiResponse: BuildRequestResultModelApiResponse;

    if (buildConfig.repoStatus === repoStatus.Cloning) {
        throw new RepoStatusError(500);
    }

    const {commitHash} = req.params;
    const commit: CommitInfo = await gitService.getCommitInfo(commitHash);
    
    const commitData: QueueBuildInput = {
        commitMessage: commit.message,
        commitHash: commitHash,
        branchName: buildConfig.mainBranch,
        authorName: commit.author,
    }

    try {
        apiResponse = await ciApi.addBuild(commitData);
    } catch (e) {
        throw new ServerError(500, 'error of add build');
    }

    if (apiResponse.data) {
        return res.json({
            status: 'success',
            data: {
                ...apiResponse.data,
                ...commitData
            }
        });
    } else {
        return res.json({
            status: 'error',
        });
    }
}

async function getBuild(req: Request, res: Response<GetBuildResponse>) {
    let apiResponse: BuildModelApiResponse;

    try {
        apiResponse = await ciApi.getBuild(req.params.buildId);
    } catch (e) {
        throw new ServerError(500);
    }

    return res.json({
        status: 'success',
        data: apiResponse.data,
    });
}

async function getBuildLog(req: Request, res: Response) {
    let apiResponse: AxiosResponse<Stream>;
    let logCacheWriteStream: WriteStream;

    const { buildId } = req.params;
    const cachedLog: ReadStream | null = await logCache.getValidItem(buildId);

    if (cachedLog) {
        cachedLog.on('data', (chunk: Buffer) => {
            res.statusCode = 200;
            res.write(chunk);
        });

        cachedLog.on('close', () => {
            res.statusCode = 200;
            res.end();
        });
    } else {
        logCacheWriteStream = logCache.addItem(buildId);

        try {
            apiResponse = await ciApi.getBuildLog(buildId);

            apiResponse.data.on('data', (chunk: Buffer) => {
                if (logCacheWriteStream) {
                    logCacheWriteStream.write(chunk);
                }

                res.statusCode = 200;
                res.write(chunk);
            });

            apiResponse.data.on('end', () => {
                if (logCacheWriteStream) {
                    logCacheWriteStream.end();
                }

                res.statusCode = 200;
                res.end();
            });
        } catch (e) {
            throw new ServerError(500, e.message);
        }
    }
}

export default {
    getBuilds,
    addBuild,
    getBuild,
    getBuildLog,
};
