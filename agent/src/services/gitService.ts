import path from 'path';
import fs from 'fs';
import util from 'util';
import rimraf from 'rimraf';
import GitUtils from '../utils/git-utils';
import buildService from '../services/buildService';

const exists = util.promisify(fs.exists);
const mkdir = util.promisify(fs.mkdir);
const rimrafPromisify = util.promisify(rimraf);

export class GitService {
    repoDir: string = './var/repo';
    gitUtils: GitUtils;

    constructor(gitUtils: GitUtils) {
        this.gitUtils = gitUtils;
    }

    async init() {
        await this.clean();
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
        return rimrafPromisify(this.repoDir);;
    }

}

export default new GitService(new GitUtils());
