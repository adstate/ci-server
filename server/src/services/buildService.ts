import BuildListResponse from '../models/buildListResponse';
import Build from '../models/build';
import BuildData from '../models/buildData';
import BuildStatus from '../models/buildStatus';
import BuildResult from '../models/buildResult';
import buildFinishInput from '../models/buildFinishInput';
import {getBuilds, buildStart, buildFinish} from '../core/ci-api';
import agentService from '../services/agentService';
import settingService from '../services/settingService';
import Agent from '../models/agent';

class BuildService {
    builds: Build[] = [];
    processBuilds: {
        [id: string]: Build
    } = {};
    lastLoadedBuildNum: number = 0;

    initLimit: number = 500;
    initOffset: number = 0;
    processLimit: number = 5;
    processOffset: number = 0;

    processInterval: any;
    buildInterval: any;

    buildIntervalTime: number = 60 * 1000;
    retryTimeout: number = 30 * 1000;

    constructor() {
        
    }

    async init() {
        // load all builds on init service
        await this.initLoad();
        
        this.buildInterval = setInterval(this.processBuild.bind(this), this.buildIntervalTime);
    }

    addBuilds(builds: Build[]) {
        const waitingBuilds = builds.filter((build: Build) => {
           return (build.status === BuildStatus.Waiting || build.status === BuildStatus.InProgress) 
                  && build.buildNumber > this.lastLoadedBuildNum
                  && !this.processBuilds[build.id]
                  && !this.builds.some((b: Build) => b.id === build.id)
        });
        
        if (waitingBuilds.length > 0) {
            this.builds = [...waitingBuilds, ...this.builds];
        }
    }

    async processLoad() {
        try {
            const buildListRes: BuildListResponse = await getBuilds({
                offset: this.processOffset,
                limit: this.processLimit
            });
            
            const builds: Build[] = buildListRes.data;

            this.addBuilds(builds);

            if (builds.length > 0) {
                const curLastLoadedBuildNum: number = builds[0].buildNumber;
                this.processOffset = (curLastLoadedBuildNum > this.lastLoadedBuildNum) ? this.processOffset + this.processLimit : 0;
                this.lastLoadedBuildNum = curLastLoadedBuildNum;
            }
        } catch(e) {
            console.error('Builds is not loaded');
        }
    }

    async processBuild() {
        if (this.builds.length === 0 || !settingService.repoName) {
            return;
        }

        const agent: Agent | null = agentService.getFreeAgent();

        if (!agent) {
            return;
        }

        const build: Build | undefined = this.builds.pop();

        if (!build) {
            return;
        }
        
        try {
            if (build.status === BuildStatus.Waiting) {
                await buildStart(build.id);
                console.log('ci-api: set in progress', build.id);
            } else {
                if (agentService.checkBuildRunning(build.id)) {
                    console.log('Build is already running on some agent');
                    this.addBuildToInProgress(build);
                    return;
                }
            }

            await agentService.startBuild(build, agent);
            this.addBuildToInProgress(build);
            console.log('send build to start', build.id);
        } catch(e) {
            console.log('Error of start building');
            this.addBuildToWaiting(build);
        }
    }

    async initLoad() {
        console.log('init load');
        try {
            const buildListRes: BuildListResponse = await getBuilds({
                offset: this.initOffset,
                limit: this.initLimit
            });
            const builds: Build[] = buildListRes.data;

            this.addBuilds(builds);

            if (builds.length < this.initLimit) {
                this.processInterval = setInterval(this.processLoad.bind(this), this.buildIntervalTime);
                this.lastLoadedBuildNum = builds[0].buildNumber;
            } else {
                this.initOffset += builds.length;
                this.initLoad();
            }
        } catch(e) {
            console.error('Builds is not loaded');
            setTimeout(this.initLoad.bind(this), this.retryTimeout);
        }
    }

    async finishBuild(buildResult: BuildResult) {
        console.log('build is done', buildResult.buildId, buildResult.buildStatus);

        const waitBuildIndex = this.builds.findIndex((b: Build) => b.id === buildResult.buildId);
        if (waitBuildIndex  > -1) {
            this.builds.splice(waitBuildIndex, 1);
        }

        if (this.processBuilds[buildResult.buildId]) {
            delete this.processBuilds[buildResult.buildId];
        }

        const buildFinishData: buildFinishInput = {
            buildId: buildResult.buildId,
            duration: buildResult.duration,
            success: (buildResult.buildStatus === BuildStatus.Success) ? true : false,
            buildLog: buildResult.buildLog
        }

        this.sendBuildFinish(buildFinishData);
    }

    async sendBuildFinish(data: buildFinishInput) {
        try {
            await buildFinish(data);
        } catch(e) {
            console.log('error of send build finish', data.buildId);
            setTimeout(async () => {
                try {
                    await buildFinish(data);
                } catch(e) {
                    console.log('result of build was lost', data.buildId);
                }
            }, this.retryTimeout);
        }
    }

    addBuildToWaiting(build: Build) {
        this.builds.push(build);
    }

    addBuildToInProgress(build: Build) {
        build.status = BuildStatus.InProgress;
        build.start = new Date().toISOString();

        this.processBuilds[build.id] = build;
    }

    returnBuildToWaiting(buildId: string) {
        const build = this.processBuilds[buildId];

        if (build) {
            delete this.processBuilds[buildId];

            this.addBuildToWaiting(build);
            console.log('build was returned to waiting:', build.id);
        }
    }

    resetProcessOffset() {
        this.processOffset = 0;
        this.lastLoadedBuildNum = 0;
    }
}

export default new BuildService();
