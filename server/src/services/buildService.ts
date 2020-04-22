import BuildListResponse from '../models/buildListResponse';
import Build from '../models/build';
import BuildData from '../models/buildData';
import BuildStatus from '../models/buildStatus';
import BuildResult from '../models/buildResult';
import {getBuilds, buildStart, buildFinish} from '../core/ci-api';
import agentService from '../services/agentService';
import settingService from '../services/settingService';
import Agent from '../models/agent';

class BuildService {
    builds: Build[] = [];
    processBuilds: Build[] = [];
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
           return build.status === BuildStatus.Waiting && build.buildNumber > this.lastLoadedBuildNum;
        });
        //waitingBuilds.sort((a: Build, b: Build) => a.buildNumber - b.buildNumber);
        if (waitingBuilds.length > 0) {
            this.builds = [...waitingBuilds, ...this.builds];
        }

        const processBuilds = builds.filter((build: Build) => {
            return build.status === BuildStatus.InProgress && build.buildNumber > this.lastLoadedBuildNum;
        });

        if (processBuilds.length > 0) {
            this.processBuilds = [...processBuilds, ...this.processBuilds];
        }
    }

    async processLoad() {
        console.log('process load');
        //console.log('offset', this.processOffset, 'limit', this.processLimit);
        try {
            const buildListRes: BuildListResponse = await getBuilds({offset: this.processOffset, limit: this.processLimit});
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
            console.error('Builds is not loaded', e.Error);
        }
    }

    async processBuild() {
        if (this.builds.length === 0) {
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

        let apiRes = null;
        
        try {
            console.log('ci-api: set in progress', build.id)
            apiRes = await buildStart(build.id);
        } catch(e) {
            console.log('Error of change status in CI Api');
            this.addBuildToWaiting(build);
        }

        if (!apiRes) {
            return;
        }

        this.addBuildToInProgress(build);

        let agentRes = null;
        try {
            agentRes = await agentService.startBuild(build, agent);
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
            //console.log(builds);

            this.addBuilds(builds);

            if (builds.length < this.initLimit) {
                this.processInterval = setInterval(this.processLoad.bind(this), 30 * 1000);
                this.lastLoadedBuildNum = builds[0].buildNumber;
            } else {
                this.initOffset += builds.length;
                this.initLoad();
            }
        } catch(e) {
            console.error('Builds is not loaded', e);
        }
    }

    async finishBuild(buildResult: BuildResult) {
        console.log('build is done', buildResult.buildId, buildResult.buildStatus);

        try {
            await buildFinish({
                buildId: buildResult.buildId,
                duration: 10000,
                success: (buildResult.buildStatus === BuildStatus.Success) ? true : false,
                buildLog: buildResult.buildLog
            });
        } catch(e) {
            console.log('error of send build finish');
        }
    }

    addBuildToWaiting(build: Build) {
        build.status = BuildStatus.Waiting;
        this.builds.push(build);
    }

    addBuildToInProgress(build: Build) {
        build.status = BuildStatus.InProgress;
        build.start = new Date().toISOString();
        this.processBuilds.push(build);
    }
}

export default new BuildService();
