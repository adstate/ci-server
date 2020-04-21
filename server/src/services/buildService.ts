import BuildListResponse from '../models/buildListResponse';
import Build from '../models/build';
import BuildData from '../models/buildData';
import BuildStatus from '../models/buildStatus';
import {getBuilds, buildStart} from '../core/ci-api';
import agentService from '../services/agentService';
import settingService from '../services/settingService';
import Agent from '../models/agent';

class BuildService {
    builds: Build[] = [];
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
    }

    async processLoad() {
        console.log('process load');
        try {
            const buildListRes: BuildListResponse = await getBuilds({offset: this.processOffset, limit: this.processLimit});
            const builds: Build[] = buildListRes.data;
            //console.log(builds);

            this.addBuilds(builds);

            if (builds.length > 0) {
                const curLastLoadedBuildNum: number = builds[0].buildNumber;
                this.processLimit = (curLastLoadedBuildNum > this.lastLoadedBuildNum) ? this.processOffset + this.processLimit : 0;
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

        let agentRes = null;
        try {
            agentRes = await agentService.startBuild(build, agent);
        } catch(e) {
            console.error('Error of start building');
            this.builds.push(build);
        }

        let apiRes = null;
        if (agentRes) {
            apiRes = await buildStart(build.id);
        }

        console.log('build', build);
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
            } else {
                this.initOffset += builds.length;
                this.initLoad();
            }
        } catch(e) {
            console.error('Builds is not loaded', e);
        }
    }
}

export default new BuildService();
