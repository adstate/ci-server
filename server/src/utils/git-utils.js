const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require("fs");

module.exports = class GitUtils {
    constructor(repoName) {
        this.repoName = repoName;
        this.shortRepoName = repoName.split('/')[1];

        this.repoUrl = `https://github.com/${repoName}`;
        this.repoInternalPath = `var/repo/${this.shortRepoName}`;

        this.codes = {
          'SUCCESS': 0,
          'NOTFOUND': 128
        }
    }

    clone() {
        return new Promise((resolve, reject) => {
            const git = spawn("git", ["clone", this.repoUrl, this.repoInternalPath]);

            git.stderr.on('data', err => {
              const error = err.toString('UTF-8');
              console.log('git clone error', error);
            });
          
            git.on('close', code => {
              if (code === this.codes.SUCCESS) {
                resolve();
              } if (code === this.codes.NOTFOUND) {
                reject({ message: 'Repository not found' });
              } else {
                reject({ message: 'Error of clone repository' });
              }

              console.log('git clone close', code);
            });
        })
    }

    contains() {
      if (fs.existsSync(this.repoInternalPath)) {
        return true
      }

      return false;
    }

    clean() {
      return new Promise((resolve, reject) => {
        const rm = spawn("rm", ["-rf", `./var/repo`]);

        rm.stderr.on('data', err => {
          console.log(err.toString('UTF-8'));
        });
      
        rm.on('close', code => {
          if (code === this.codes.SUCCESS) {
            resolve();
          } else {
            reject();
          }
        });
      });
    }

    getLastCommit() {
      return new Promise((resolve, reject) => {
        const appDir = path.dirname(require.main.filename)
        const gitDir = path.join(appDir, '../', this.repoInternalPath);

        let result = '';

        const spawnOpts = {cwd: gitDir};
        const git = spawn('git', ['log', '-1', '--format="%H;%cn;%s;%D'], spawnOpts);
        
        git.stderr.on('data', err => {
          console.log(err.toString('UTF-8'));
        });
    
        git.stdout.on('data', data => {
          result += data;
        });
    
        git.on('close', code => {
          if (code === this.codes.SUCCESS) {
            resolve(this.parseCommitInfo(result));
          } else {
            reject();
          }
        });
    })
  }

  parseCommitInfo(commitStr) {
    const commitData = commitStr.split(';');

    return {
      hash: commitData[0],
      author: commitData[1],
      message: commitData[2]
    }
  }
}