import {spawn} from 'child_process';
import path from 'path';
import {notifyBuildResult} from '../core/server-api';
import BuildData from '../../../server/src/models/buildData';
import BuildStatus from '../../../server/src/models/buildStatus';
import BuildResult from '../../../server/src/models/buildResult';
import gitService, {GitService} from '../services/gitService';

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
    buildStartTime: Date | null = null;

    repoDir: string = './var/repo';

    spawn: any;
    gitService: GitService;

    supportCommands: string[] = ['npm', 'mvn', 'npx', 'jest', 'mocha', 'hermione', 'yarn'];

    addCommandOptions: {
        [key: string]: string[]
    } = {
        npm: ['--color', 'always']
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
        console.log('runnig build', buildData.buildId, buildData.commitHash);
        this.buildStartTime = new Date();
        this.buildStatus = BuildStatus.InProgress;

        this.processingBuildId = buildData.buildId;
        this.repoUrl = buildData.repoUrl;
        this.buildCommand = buildData.buildCommand;
        this.commitHash = buildData.commitHash;
        this.buildLog = '';
        this.buildStatus = BuildStatus.InProgress;

        let repoCloned = false;
        try {
            await this.gitService.clone(this.repoUrl);
            await this.gitService.checkout(this.commitHash);
            repoCloned = true;
        } catch(e) {
            this.sendBuildResult({
                buildId: this.processingBuildId,
                buildStatus: BuildStatus.Fail,
                buildLog: this.buildLog,
                duration: 0
            });
            this.clearState();
        }
        if (repoCloned) {
            await this.runBuildCommand(this.buildCommand);
        }        
    }

    async runBuildCommand(command: string) {
        const commandList: Command[] = this.parseBuildCommand(command);

        try {
            for (let i = 0; i < commandList.length; i++) {
                this.buildLog += await this.runCommand(commandList[i]);
            }
            this.buildStatus = BuildStatus.Success;
        } catch(e) {
            this.buildStatus = BuildStatus.Fail;
            this.buildLog += e;
        }
        const buildEndTime = new Date();
        const buildStartTime = this.buildStartTime || new Date();

        const buildResult = {
            buildId: this.processingBuildId,
            buildStatus: this.buildStatus,
            buildLog: this.buildLog,
            duration: buildEndTime.getTime() - buildStartTime.getTime()
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
            let result: string = `\n> ${command.cmd} ${command.args.join(' ')}\n`;

            const workDir = path.join(process.cwd(), this.repoDir);    
            //console.log('workDir', workDir);
            const cmd = this.spawn(normalizeCommand, normalizeArgs, {cwd: workDir});

            cmd.stderr.on('data', (err: Buffer) => {
                //console.error(err.toString('UTF-8'));
                result += err.toString('UTF-8');
            });

            cmd.stdout.on('data', (data: Buffer) => {
                //console.error(data.toString('UTF-8'));
                result += data.toString('UTF-8');
            });

            cmd.on('close', (code: number) => {
                result = escapeJSON(result);

                if (code === 0) {
                    resolve(result);
                } else {
                    reject(result);
                }
            });
        });
    }

    async sendBuildResult(buildResult: BuildResult) {
        try {
            console.log('send result', buildResult.buildId, buildResult.buildStatus);
            await notifyBuildResult(buildResult);
            this.clearState();
        } catch(e) {
            this.notifyResultInterval = setInterval(async () => {
                try {
                    console.log('send result', buildResult.buildId);
                    await notifyBuildResult(buildResult);

                    clearInterval(this.notifyResultInterval);
                    this.clearState();
                } catch(e) {
                    this.notifyRetries += 1;
                }

                if (this.notifyRetries >= this.notifyRetryCount) {
                    console.log('fail sending', buildResult.buildId);
                    clearInterval(this.notifyResultInterval);
                    this.clearState();
                }

            }, this.notifyRetryInterval);
        }
    }

    async clearState() {
        await this.gitService.clean();

        this.processingBuildId = '';
        this.repoUrl = '';
        this.buildCommand = '';
        this.commitHash = '';
        this.buildStatus = null;
        this.buildLog = '';
        this.buildStartTime = null;

        this.notifyRetries = 0;
    }

}

export default new BuildService();
