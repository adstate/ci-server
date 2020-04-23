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
import { AxiosResponse } from 'axios';

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

    constructor() {
        
    }

    async init() {
        // load all builds on init service
        await this.initLoad();
        
        this.buildInterval = setInterval(this.processBuild.bind(this), 30 * 1000);
    }

    addBuilds(builds: Build[]) {
        const waitingBuilds = builds.filter((build: Build) => {
           return (build.status === BuildStatus.Waiting || build.status === BuildStatus.InProgress) 
                  && build.buildNumber > this.lastLoadedBuildNum;
        });
        //waitingBuilds.sort((a: Build, b: Build) => a.buildNumber - b.buildNumber);
        if (waitingBuilds.length > 0) {
            this.builds = [...waitingBuilds, ...this.builds];
        }
    }

    async processLoad() {
        console.log('process load');
        try {
            const buildListRes: BuildListResponse = await getBuilds({
                offset: this.processOffset,
                limit: this.processLimit
            });
            
            const builds: Build[] = buildListRes.data;
            //console.log(builds);

            this.addBuilds(builds);

            if (builds.length > 0) {
                const curLastLoadedBuildNum: number = builds[0].buildNumber;
                this.processOffset = (curLastLoadedBuildNum > this.lastLoadedBuildNum) ? this.processOffset + this.processLimit : 0;
                this.lastLoadedBuildNum = curLastLoadedBuildNum;
            }
    
            //console.log(this.lastLoadedBuildNum);
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

        let apiRes: AxiosResponse | null = null;
        
        if (build.status === BuildStatus.Waiting) {
            try {
                console.log('ci-api: set in progress', build.id)
                apiRes = await buildStart(build.id);
            } catch(e) {
                console.log('Error of change status in CI Api');
                this.addBuildToWaiting(build);
            }

            if (apiRes?.status !== 200) {
                console.log('API RES !== 200', apiRes);
                return;
            }
        }

        try {
            await agentService.startBuild(build, agent);
            this.addBuildToInProgress(build);
        } catch(e) {
            console.error('Error of start building');
            this.addBuildToWaiting(build);
        }

        console.log('send build to start', build.id);
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
                this.processInterval = setInterval(this.processLoad.bind(this), 30 * 1000);
                this.lastLoadedBuildNum = builds[0].buildNumber;
            } else {
                this.initOffset += builds.length;
                this.initLoad();
            }
        } catch(e) {
            console.error('Builds is not loaded');
            setTimeout(this.initLoad.bind(this), 30 * 100);
        }
    }

    async finishBuild(buildResult: BuildResult) {
        console.log('build is done', buildResult.buildId, buildResult.buildStatus);

        const waitBuildIndex = this.builds.findIndex((b: Build) => b.id === buildResult.buildId);
        if (waitBuildIndex) {
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

        try {
            await buildFinish(buildFinishData);
        } catch(e) {
            console.log('error of send build finish');
            setTimeout(function () {
                buildFinish(buildFinishData)
            }, 30 * 1000);
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
