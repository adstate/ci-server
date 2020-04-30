import ciApi from '../core/ci-api';
import ServerError from '../errors/server-error';
import gitService from '../core/git-service';
import buildConfig from '../core/buildConf';
import repoStatus from '../models/repoStatus';
import {ConfigurationInput, ConfigurationModelApiResponse, ConfigurationModel} from '../models';
import {CommitInfo} from '../utils/git-utils';
import SettingsResponse from '../models/settingsResponse';
import {Request, Response} from 'express';

async function saveSettings(
    req: Request<any, any, ConfigurationInput, any>,
    res: Response<SettingsResponse>
) {
    let apiResponse: ConfigurationModelApiResponse;

    const {
        repoName,
        buildCommand,
        mainBranch,
        period,
    } = req.body;

    if (buildConfig.repoStatus === repoStatus.Cloning) {
        return res.json({
            status: 'success',
            repoStatus: buildConfig.repoStatus
        });
    }

    const isNewRepo: boolean = buildConfig.repoName !== repoName;

    try {
        const currentBranch = buildConfig.mainBranch;

        apiResponse = await ciApi.saveSettings({
            repoName,
            buildCommand,
            mainBranch,
            period,
        });

        buildConfig.update({
            repoName,
            buildCommand,
            mainBranch,
            period,
        });
        buildConfig.actual = false;

        // make clone and add last commit to queue only if repository was changed and wasn't cloned before
        if (isNewRepo) {
            await gitService.clean(); // clean folder var/repo before clone new repository

            buildConfig.repoStatus = repoStatus.Cloning;

            gitService.clone()
                .then(async () => {
                    await gitService.checkout(mainBranch);

                    buildConfig.repoStatus = repoStatus.Cloned;

                    const lastCommit: CommitInfo = await gitService.getLastCommit();

                    apiResponse = await ciApi.addBuild({
                        commitMessage: lastCommit.message,
                        commitHash: lastCommit.hash,
                        branchName: mainBranch,
                        authorName: lastCommit.author,
                    });

                    buildConfig.lastBuildedCommit = lastCommit;
                })
                .catch((err: any) => {
                    buildConfig.repoStatus = repoStatus.NotCloned;
                    console.error('ERROR:repository not found', err);
                });
        } else if (currentBranch !== mainBranch) {
            gitService.pull().then(async () => {
                await gitService.checkout(mainBranch);

                const lastCommit: CommitInfo = await gitService.getLastCommit();

                if (lastCommit.hash !== buildConfig.lastBuildedCommit.hash) {
                    apiResponse = await ciApi.addBuild({
                        commitMessage: lastCommit.message,
                        commitHash: lastCommit.hash,
                        branchName: mainBranch,
                        authorName: lastCommit.author,
                    });

                    buildConfig.lastBuildedCommit = lastCommit;
                }
            });
        }
    } catch (e) {
        throw new ServerError(500, e);
    }

    return res.json({
        status: 'success',
        repoStatus: buildConfig.repoStatus
    });
}

async function getSettings(req: Request, res: Response<SettingsResponse>) {
    let apiResponse: ConfigurationModelApiResponse;

    try {
        apiResponse = await ciApi.getSettings();
    } catch (e) {
        throw new ServerError(500);
    }

    const result: ConfigurationModel | undefined = apiResponse?.data;

    if (result) {
        buildConfig.update(result);
    }

    return res.json({
        status: 'success',
        repoStatus: buildConfig.repoStatus,
        data: result
    });
}

export default {
    saveSettings,
    getSettings,
};
