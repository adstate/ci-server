import {spawn} from 'child_process';
import path from 'path';
import {notifyBuildResult} from '../core/server-api';
import BuildData from '../../../server/src/models/buildData';
import BuildStatus from '../../../server/src/models/buildStatus';
import BuildResult from '../../../server/src/models/buildResult';
import gitService, {GitService} from './gitService';

var escapeJSON = require('escape-json-node');

interface Command {
    cmd: string | undefined,
    args: string[]
}

class BuildService {
    processingBuildId: string = '';
    repoUrl: string = '';
    buildCommand: string = '';
    commitHash: string = '';
    buildStatus: BuildStatus | null = null;
    buildLog: string = '';
    repoDir: string = './var/repo';

    spawn: any;
    gitService: GitService;

    supportCommands: string[] = ['npm', 'mvn', 'npx', 'jest', 'mocha', 'hermione'];

    addCommandOptions: {
        [key: string]: string[]
    } = {
        npm: ['-d', '--color', 'always']
    }

    notifyResultInterval: any = null;
    notifyRetryInterval: number = 60 * 1000;
    notifyRetryCount: number = 3;
    notifyRetries: number = 0;

    constructor() {
        this.gitService = gitService;
        this.spawn = spawn;
    }

    async runBuild(buildData: BuildData) {
        console.log('runnig build', buildData.commitHash);
        this.buildStatus = BuildStatus.InProgress;

        this.processingBuildId = buildData.buildId;
        this.repoUrl = buildData.repoUrl;
        this.buildCommand = buildData.buildCommand;
        this.commitHash = buildData.commitHash;
        this.buildLog = '';
        this.buildStatus = BuildStatus.InProgress;

        await this.gitService.clone(this.repoUrl);
        await this.gitService.checkout(this.commitHash);
        await this.runBuildCommand(this.buildCommand);
    }

    async runBuildCommand(command: string) {
        const commandList: Command[] = this.parseBuildCommand(command);

        console.log('commandList', commandList);

        try {
            for (let i = 0; i < commandList.length; i++) {
                this.buildLog += await this.runCommand(commandList[i]);
            }
            console.log('BUILD SUCCESS');
            this.buildStatus = BuildStatus.Success;
        } catch(e) {
            console.log('BUILD FAIL');
            this.buildStatus = BuildStatus.Fail;
            this.buildLog += e;
        }

        const buildResult = {
            buildId: this.processingBuildId,
            buildStatus: this.buildStatus,
            buildLog: this.buildLog
        }

        this.sendBuildResult(buildResult);
    }

    parseBuildCommand(buildCommand: string): Command[] {
        const commandList: string[] = buildCommand.trim().split('&&');
        const commandObjList: Command[]  = commandList.map((c: string): Command => {
            const list = c.trim().split(' ');
            const cmd: string | undefined = list.shift();
            return { cmd, args: list }
        });

        return commandObjList;
    }

    async runCommand(command: Command) {
        if (!command.cmd || !this.supportCommands.includes(command.cmd)) {
            return Promise.reject(`Command is not supported: ${command.cmd}`);
        }

        const normalizeCommand = (/^win/.test(process.platform) && command.cmd === 'npm') ? 'npm.cmd' : command.cmd;
        
        const additionalArgs = this.addCommandOptions[command.cmd];
        const normalizeArgs = (additionalArgs) ? [...command.args, ...additionalArgs] : command.args;

        console.log(normalizeCommand, normalizeArgs);

        return new Promise((resolve, reject) => {
            let result: string = '';

            const workDir = path.join(process.cwd(), this.repoDir);    
            console.log('workDir', workDir);
            const cmd = this.spawn(normalizeCommand, normalizeArgs, {cwd: workDir});

            cmd.stderr.on('data', (err: Buffer) => {
                //console.error(err.toString('UTF-8'));
                result += err.toString('UTF-8').trim();
            });

            cmd.stdout.on('data', (data: Buffer) => {
                //console.error(data.toString('UTF-8'));
                result += data.toString('UTF-8').trim();
            });

            cmd.on('close', (code: number) => {
                //console.log('result', result);
                result = escapeJSON(result);
                //result = result.replace(/[\n\r]/g, '');
                // result = result.replace(/\\n/g, "\\n")
                //                       .replace(/\\'/g, "\\'")
                //                       .replace(/\\"/g, '\\"')
                //                       .replace(/\\&/g, "\\&")
                //                       .replace(/\\r/g, "\\r")
                //                       .replace(/\\t/g, "\\t")
                //                       .replace(/\\b/g, "\\b")
                //                       .replace(/\\f/g, "\\f");

                if (code === 0) {
                    resolve(result);
                } else {
                    reject(result);
                }
            });
        });
    }

    async sendBuildResult(buildResult: BuildResult) {
        console.log('send result');
        try {
            await notifyBuildResult(buildResult);
            this.clearState();
        } catch(e) {
            this.notifyResultInterval = setInterval(async () => {
                try {
                    console.log('send result');
                    await notifyBuildResult(buildResult);

                    clearInterval(this.notifyResultInterval);
                    this.clearState();
                } catch(e) {
                    this.notifyRetries += 1;
                }

                if (this.notifyRetries >= this.notifyRetryCount) {
                    console.log('fail sending');
                    clearInterval(this.notifyResultInterval);
                    this.clearState();
                }

            }, this.notifyRetryInterval);
        }
    }

    clearState() {
        this.processingBuildId = '';
        this.repoUrl = '';
        this.buildCommand = '';
        this.commitHash = '';
        this.buildStatus = null;
        this.buildLog = '';

        this.notifyRetries = 0;
        this.gitService.clean();
    }

}

export default new BuildService();
