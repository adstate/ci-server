import {spawn, SpawnOptions, ChildProcess} from 'child_process';
import path from 'path';
import fs from 'fs';

export interface CommitInfo {
    hash: string;
    author: string;
    message: string;
}

enum ProcessCodes {
    SUCCESS = 0,
    NOTFOUND = 128
}

export default class GitUtils {
    spawn: any;

    constructor() {
        this.spawn = spawn;
    }

    clone(url: string, internalPath: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const git = this.spawn('git', ['clone', url, internalPath]);

            git.stderr.on('data', (err: Buffer) => {                
                console.log('git clone', err.toString('UTF-8'));
            });

            git.on('close', (code: number) => {
                if (code === ProcessCodes.SUCCESS) {
                    resolve({message: 'success'});
                } if (code === ProcessCodes.NOTFOUND) {
                    reject({ message: 'Repository not found' });
                } else {
                    reject({ message: 'Error of clone repository' });
                }

                console.log('git clone close', code);
            });
        });
    }

    pull(repoInternalPath: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const gitDir: string = path.join(process.cwd(), repoInternalPath);
            const git = this.spawn('git', ['pull'], { cwd: gitDir });

            git.stderr.on('data', (err: string) => {
                //console.log(err);
            });

            git.on('close', (code: number) => {
                if (code === ProcessCodes.SUCCESS) {
                    resolve({message: 'success'});
                } else {
                    reject({ message: 'Error of pull repository' });
                }
            });
        });
    }

    checkout(point: string, repoInternalPath: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const gitDir: string = path.join(process.cwd(), repoInternalPath);
            const git = this.spawn('git', ['checkout', point], { cwd: gitDir });

            git.stderr.on('data', (err: Buffer) => {
               // console.log(err.toString('UTF-8'));
            });

            git.on('close', (code: number) => {
                if (code === ProcessCodes.SUCCESS) {
                    resolve({message: 'success'});
                } else {
                    reject({message: 'Branch/commit does not exists' });
                }

                //console.log('git checkout close', code);
            });
        });
    }

    contains(repoInternalPath: string): boolean {
        if (fs.existsSync(repoInternalPath)) {
            return true;
        }

        return false;
    }

    clean(repoDir: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const rm = this.spawn('rm', ['-rf', repoDir]);

            rm.stderr.on('data', (err: string) => {
                //console.error(err);
            });

            rm.on('close', (code: number) => {
                if (code === ProcessCodes.SUCCESS) {
                    resolve();
                } else {
                    reject();
                }
            });
        });
    }

    getLastCommit(repoInternalPath: string): Promise<CommitInfo> {
        return new Promise((resolve, reject) => {
            const gitDir: string = path.join(process.cwd(), repoInternalPath);

            let result: string = '';

            const git = this.spawn('git', ['log', '-1', '--format=%h;%cn;%s'], { cwd: gitDir });

            git.stderr.on('data', (err: string) => {
                console.error(err);
            });

            git.stdout.on('data', (data: string) => {
                result += data;
            });

            git.on('close', (code: number) => {
                if (code === ProcessCodes.SUCCESS) {
                    resolve(this.parseCommitInfo(result));
                } else {
                    reject();
                }
            });
        });
    }

    getNewCommits(commitHash: string, repoInternalPath: string): Promise<CommitInfo[]> {
        return new Promise((resolve, reject) => {
            const gitDir: string = path.join(process.cwd(), repoInternalPath);

            let result: string = '';

            const git = this.spawn('git', ['log', '--format=%h;%cn;%s', `${commitHash}..HEAD`], { cwd: gitDir });

            git.stderr.on('data', (err: string) => {
                console.error(err);
            });

            git.stdout.on('data', (data: string) => {
                result += data;
            });

            git.on('close', (code: number) => {
                if (code === ProcessCodes.SUCCESS) {
                    result = result.trim();
                    const commits: CommitInfo[] = result ? result.split('\n').map((str) => this.parseCommitInfo(str)) : [];

                    resolve(commits);
                } else {
                    reject();
                }
            });
        });
    }

    getCommitInfo(commitHash: string, repoInternalPath: string): Promise<CommitInfo> {
        return new Promise((resolve, reject) => {
            const gitDir: string = path.join(process.cwd(), repoInternalPath);

            let result = '';

            const git = this.spawn('git', ['log', '-1', '--format=%h;%cn;%s', commitHash], { cwd: gitDir });

            git.stderr.on('data', (err: string) => {
                //console.error(err);
            });

            git.stdout.on('data', (data: string) => {
                result += data;
            });

            git.on('close', (code: number) => {
                if (code === ProcessCodes.SUCCESS) {
                    resolve(this.parseCommitInfo(result));
                } else {
                    reject();
                }
            });
        });
    }

    parseCommitInfo(commitStr: string): CommitInfo {
        const [hash, author, message] = commitStr.trim().split(';');

        return {
            hash,
            author,
            message,
        };
    }
};
