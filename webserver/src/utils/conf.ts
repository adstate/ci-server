import buildConfig from '../core/buildConf';
import ciApi from '../core/ci-api';
import gitService from '../core/git-service';
import repoStatus from '../models/repoStatus';
import {ConfigurationModelApiResponse, BuildModelArrayApiResponse, BuildModel} from '../models';


async function load(): Promise<void> {
    if (!process.env.JWT_TOKEN) {
        throw Error('Token is not defined!');
    }

    const config: ConfigurationModelApiResponse = await ciApi.getSettings();

    let lastBuildData: BuildModelArrayApiResponse;
    let lastBuild: BuildModel | null = null;

    try {
        lastBuildData = await ciApi.getBuilds({ offset: 0, limit: 1 });

        if (lastBuildData.data && lastBuildData.data.length > 0) {
            [lastBuild] = lastBuildData.data;
        }
    } catch (e) {
        lastBuild = null;
    }

    buildConfig.init(config.data || config);

    buildConfig.lastBuildedCommit = (lastBuild) ? {
        hash: lastBuild.commitHash,
        message: lastBuild.commitMessage,
        author: lastBuild.authorName,
    } : null;

    await checkRepo();
}

async function checkRepo() {
    if (!buildConfig.repoName) {
        return;
    }

    if (!gitService.contains()) {
        await gitService.clean();
        buildConfig.repoStatus = repoStatus.Cloning;

        await gitService.clone();
        buildConfig.repoStatus = repoStatus.Cloned;
    } else {
        buildConfig.repoStatus = repoStatus.Cloned;
    }
}

export default {
    load,
};
