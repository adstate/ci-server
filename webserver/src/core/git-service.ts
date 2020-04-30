import path from 'path';
import GitUtils, {CommitInfo} from '../utils/git-utils';
import Configuration from '../models/configuration';
import buildConfig from './buildConf';
import ciApi from './ci-api';
import repoStatus from '../models/repoStatus';
import { QueueBuildInput } from '../models';

class GitService {
    repoDir: string;
    repoUrl: any;
    repoInternalPath: any;
    shortRepoName: any;
    buildConfig: Configuration;
    gitUtils: GitUtils;

    constructor(config: any, gitUtils: GitUtils) {
        this.repoDir = './var/repo';
        this.repoUrl = null;
        this.repoInternalPath = null;
        this.shortRepoName = null;

        this.buildConfig = config;
        this.gitUtils = gitUtils;

        // TODO при e2e тестых генерировалось большое количество событий на git pull
        // временно закоментировал
        // this.buildConfig.on('init', () => {
        //     setInterval(this.checkNewCommits.bind(this), this.buildConfig.period * 60 * 1000);
        // });

        this.buildConfig.on('change', () => {
            this.update();
        });
    }

    clone(): Promise<any> {
        return this.gitUtils.clone(this.repoUrl, this.repoInternalPath);
    }

    pull(): Promise<any> {
        return this.gitUtils.pull(this.repoInternalPath);
    }

    checkout(branch: string): Promise<any> {
        return this.gitUtils.checkout(branch, this.repoInternalPath);
    }

    contains() {
        return this.gitUtils.contains(this.repoInternalPath);
    }

    getLastCommit(): Promise<CommitInfo> {
        return this.gitUtils.getLastCommit(this.repoInternalPath);
    }

    getNewCommits(): Promise<CommitInfo[]> {
        return this.gitUtils.getNewCommits(this.buildConfig.lastBuildedCommit.hash, this.repoInternalPath);
    }

    getCommitInfo(hash: string): Promise<CommitInfo> {
        return this.gitUtils.getCommitInfo(hash, this.repoInternalPath);
    }

    clean(): Promise<any> {
        return this.gitUtils.clean(this.repoDir);
    }

    update() {
        if (this.buildConfig.repoName) {
            this.repoUrl = `https://github.com/${this.buildConfig.repoName}`;
            this.shortRepoName = this.buildConfig.repoName.split('/')[1] || '';
            this.repoInternalPath = path.join(this.repoDir, this.shortRepoName);    
        }
    }

    async checkNewCommits() {
        if (this.buildConfig.lastBuildedCommit && this.buildConfig.repoStatus == repoStatus.Cloned) {
            const lastCommitHash = this.buildConfig.lastBuildedCommit.hash;
            const { mainBranch } = this.buildConfig;

            await this.pull();
            console.log('check commits');
            const commits = await this.gitUtils.getNewCommits(lastCommitHash, this.repoInternalPath);

            commits.reverse().forEach(async (commit: any) => {
                try {
                    const buildData: QueueBuildInput = {
                        commitMessage: commit.message,
                        commitHash: commit.hash,
                        branchName: mainBranch,
                        authorName: commit.author,
                    };

                    await ciApi.addBuild(buildData);

                    this.buildConfig.lastBuildedCommit = commit;
                } catch (e) {
                    console.error(e.stack);
                }
            });
        }
    }
}

export default new GitService(buildConfig, new GitUtils());
