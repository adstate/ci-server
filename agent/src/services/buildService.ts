import BuildData from '../../../server/src/models/buildData';
import BuildStatus from '../../../server/src/models/buildStatus';
import gitService from './gitService';

class BuildService {
    processingBuildId: string = '';
    repoUrl: string = '';
    buildCommand: string = '';
    commitHash: string = '';
    buildStatus: BuildStatus | null = null;
    repoDir: string = './repo';

    constructor() {

    }

    async runBuild(buildData: BuildData) {
        console.log('runnig build', buildData.commitHash);

        this.processingBuildId = buildData.buildId;
        this.repoUrl = buildData.repoUrl;
        this.buildCommand = buildData.buildCommand;
        this.commitHash = buildData.commitHash;
        this.buildStatus = BuildStatus.InProgress;

        await gitService.clone(this.repoUrl);
        console.log('repo is cloned');
        await gitService.checkout(this.commitHash);
    }

    async runBuildCommand() {
        
    }

}

export default new BuildService();
