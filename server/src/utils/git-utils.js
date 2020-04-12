const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

module.exports = class GitUtils {
    constructor() {
        this.codes = {
            SUCCESS: 0,
            NOTFOUND: 128,
        };

        this.spawn = spawn;
    }

    clone(url, internalPath) {
        return new Promise((resolve, reject) => {
            const git = this.spawn('git', ['clone', url, internalPath]);

            git.stderr.on('data', (err) => {
                const error = err.toString('UTF-8');
                console.log('git clone', error);
            });

            git.on('close', (code) => {
                if (code === this.codes.SUCCESS) {
                    resolve({message: 'success'});
                } if (code === this.codes.NOTFOUND) {
                    reject({ message: 'Repository not found' });
                } else {
                    reject({ message: 'Error of clone repository' });
                }

                console.log('git clone close', code);
            });
        });
    }

    pull(repoInternalPath) {
        return new Promise((resolve, reject) => {
            const appDir = path.dirname(require.main.filename);
            const gitDir = path.join(appDir, '../', repoInternalPath);

            const git = this.spawn('git', ['pull'], { cwd: gitDir });

            git.stderr.on('data', (err) => {
                console.log(err.toString('UTF-8'));
            });

            git.on('close', (code) => {
                if (code === this.codes.SUCCESS) {
                    resolve({message: 'success'});
                } else {
                    reject({ message: 'Error of pull repository' });
                }

                console.log('git pull close', code);
            });
        });
    }

    checkout(branchName, repoInternalPath) {
        return new Promise((resolve, reject) => {
            const appDir = path.dirname(require.main.filename);
            const gitDir = path.join(appDir, '../', repoInternalPath);

            const git = this.spawn('git', ['checkout', branchName], { cwd: gitDir });

            git.stderr.on('data', (err) => {
                console.log(err.toString('UTF-8'));
            });

            git.on('close', (code) => {
                if (code === this.codes.SUCCESS) {
                    resolve({message: 'success'});
                } else {
                    reject({ message: 'Branch does not exists' });
                }

                console.log('git checkout close', code);
            });
        });
    }

    contains(repoInternalPath) {
        if (fs.existsSync(repoInternalPath)) {
            return true;
        }

        return false;
    }

    clean(repoDir) {
        return new Promise((resolve, reject) => {
            const rm = this.spawn('rm', ['-rf', repoDir]);

            rm.stderr.on('data', (err) => {
                console.error(err.toString('UTF-8'));
            });

            rm.on('close', (code) => {
                if (code === this.codes.SUCCESS) {
                    resolve();
                } else {
                    reject();
                }
            });
        });
    }

    getLastCommit(repoInternalPath) {
        return new Promise((resolve, reject) => {
            const appDir = path.dirname(require.main.filename);
            const gitDir = path.join(appDir, '../', repoInternalPath);

            let result = '';

            const spawnOpts = { cwd: gitDir };
            const git = this.spawn('git', ['log', '-1', '--format=%h;%cn;%s'], spawnOpts);

            git.stderr.on('data', (err) => {
                console.error(err.toString('UTF-8'));
            });

            git.stdout.on('data', (data) => {
                result += data;
            });

            git.on('close', (code) => {
                if (code === this.codes.SUCCESS) {
                    resolve(this.parseCommitInfo(result));
                } else {
                    reject();
                }
            });
        });
    }

    getNewCommits(commitHash, repoInternalPath) {
        return new Promise((resolve, reject) => {
            const appDir = path.dirname(require.main.filename);
            const gitDir = path.join(appDir, '../', repoInternalPath);

            let result = '';

            const git = this.spawn('git', ['log', '--format=%h;%cn;%s', `${commitHash}..HEAD`], { cwd: gitDir });

            git.stderr.on('data', (err) => {
                console.error(err.toString('UTF-8'));
            });

            git.stdout.on('data', (data) => {
                result += data;
            });

            git.on('close', (code) => {
                if (code === this.codes.SUCCESS) {
                    result = result.trim();
                    result = result ? result.split('\n').map((str) => this.parseCommitInfo(str)) : [];

                    resolve(result);
                } else {
                    reject();
                }
            });
        });
    }

    getCommitInfo(commitHash, repoInternalPath) {
        return new Promise((resolve, reject) => {
            const appDir = path.dirname(require.main.filename);
            const gitDir = path.join(appDir, '../', repoInternalPath);

            let result = '';

            const git = this.spawn('git', ['log', '-1', '--format=%h;%cn;%s', commitHash], { cwd: gitDir });

            git.stderr.on('data', (err) => {
                console.error(err.toString('UTF-8'));
            });

            git.stdout.on('data', (data) => {
                result += data;
            });

            git.on('close', (code) => {
                if (code === this.codes.SUCCESS) {
                    resolve(this.parseCommitInfo(result));
                } else {
                    reject();
                }
            });
        });
    }

    parseCommitInfo(commitStr) {
        const [hash, author, message] = commitStr.trim().split(';');

        return {
            hash,
            author,
            message,
        };
    }
};
