import path from 'path';
import fs from 'fs';
import util from 'util';
import rimraf from 'rimraf';
import GitUtils from '../utils/git-utils';
import buildService from '../services/buildService';

const exists = util.promisify(fs.exists);
const mkdir = util.promisify(fs.mkdir);
const rimrafPromisify = util.promisify(rimraf);

class GitService {
    repoDir: string = './repo';
    gitUtils: GitUtils;

    constructor(gitUtils: GitUtils) {
        this.gitUtils = gitUtils;
    }

    async init() {
        await rimrafPromisify(this.repoDir);

        // if (!await exists(this.repoDir)) {
        //     try {
        //         mkdir(this.repoDir);
        //     } catch(e) {
        //         console.error('Error of creating repo folder', e);
        //     }
        // }
    }

    clone(repoUrl: string): Promise<any> {
        return this.gitUtils.clone(repoUrl, this.repoDir);
    }

    pull(): Promise<any> {
        return this.gitUtils.pull(this.repoDir);
    }

    checkout(commitHash: string): Promise<any> {
        return this.gitUtils.checkout(commitHash, this.repoDir);
    }

    clean() {
        return this.gitUtils.clean(this.repoDir);
    }

}

export default new GitService(new GitUtils());
