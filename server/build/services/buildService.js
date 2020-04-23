"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const buildStatus_1 = __importDefault(require("../models/buildStatus"));
const ci_api_1 = require("../core/ci-api");
const agentService_1 = __importDefault(require("../services/agentService"));
const settingService_1 = __importDefault(require("../services/settingService"));
class BuildService {
    constructor() {
        this.builds = [];
        this.processBuilds = {};
        this.lastLoadedBuildNum = 0;
        this.initLimit = 500;
        this.initOffset = 0;
        this.processLimit = 5;
        this.processOffset = 0;
        this.buildIntervalTime = 60 * 1000;
        this.retryTimeout = 30 * 1000;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            // load all builds on init service
            yield this.initLoad();
            this.buildInterval = setInterval(this.processBuild.bind(this), this.buildIntervalTime);
        });
    }
    addBuilds(builds) {
        const waitingBuilds = builds.filter((build) => {
            return (build.status === buildStatus_1.default.Waiting || build.status === buildStatus_1.default.InProgress)
                && build.buildNumber > this.lastLoadedBuildNum
                && !this.processBuilds[build.id]
                && !this.builds.some((b) => b.id === build.id);
        });
        if (waitingBuilds.length > 0) {
            this.builds = [...waitingBuilds, ...this.builds];
        }
    }
    processLoad() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const buildListRes = yield ci_api_1.getBuilds({
                    offset: this.processOffset,
                    limit: this.processLimit
                });
                const builds = buildListRes.data;
                this.addBuilds(builds);
                if (builds.length > 0) {
                    const curLastLoadedBuildNum = builds[0].buildNumber;
                    this.processOffset = (curLastLoadedBuildNum > this.lastLoadedBuildNum) ? this.processOffset + this.processLimit : 0;
                    this.lastLoadedBuildNum = curLastLoadedBuildNum;
                }
            }
            catch (e) {
                console.error('Builds is not loaded');
            }
        });
    }
    processBuild() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.builds.length === 0 || !settingService_1.default.repoName) {
                return;
            }
            const agent = agentService_1.default.getFreeAgent();
            if (!agent) {
                return;
            }
            const build = this.builds.pop();
            if (!build) {
                return;
            }
            try {
                if (build.status === buildStatus_1.default.Waiting) {
                    yield ci_api_1.buildStart(build.id);
                    console.log('ci-api: set in progress', build.id);
                }
                else {
                    if (agentService_1.default.checkBuildRunning(build.id)) {
                        console.log('Build is already running on some agent');
                        this.addBuildToInProgress(build);
                        return;
                    }
                }
                yield agentService_1.default.startBuild(build, agent);
                this.addBuildToInProgress(build);
                console.log('send build to start', build.id);
            }
            catch (e) {
                console.log('Error of start building');
                this.addBuildToWaiting(build);
            }
        });
    }
    initLoad() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('init load');
            try {
                const buildListRes = yield ci_api_1.getBuilds({
                    offset: this.initOffset,
                    limit: this.initLimit
                });
                const builds = buildListRes.data;
                this.addBuilds(builds);
                if (builds.length < this.initLimit) {
                    this.processInterval = setInterval(this.processLoad.bind(this), this.buildIntervalTime);
                    this.lastLoadedBuildNum = builds[0].buildNumber;
                }
                else {
                    this.initOffset += builds.length;
                    this.initLoad();
                }
            }
            catch (e) {
                console.error('Builds is not loaded');
                setTimeout(this.initLoad.bind(this), this.retryTimeout);
            }
        });
    }
    finishBuild(buildResult) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('build is done', buildResult.buildId, buildResult.buildStatus);
            const waitBuildIndex = this.builds.findIndex((b) => b.id === buildResult.buildId);
            if (waitBuildIndex > -1) {
                this.builds.splice(waitBuildIndex, 1);
            }
            if (this.processBuilds[buildResult.buildId]) {
                delete this.processBuilds[buildResult.buildId];
            }
            const buildFinishData = {
                buildId: buildResult.buildId,
                duration: buildResult.duration,
                success: (buildResult.buildStatus === buildStatus_1.default.Success) ? true : false,
                buildLog: buildResult.buildLog
            };
            this.sendBuildFinish(buildFinishData);
        });
    }
    sendBuildFinish(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ci_api_1.buildFinish(data);
            }
            catch (e) {
                console.log('error of send build finish', data.buildId);
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    try {
                        yield ci_api_1.buildFinish(data);
                    }
                    catch (e) {
                        console.log('result of build was lost', data.buildId);
                    }
                }), this.retryTimeout);
            }
        });
    }
    addBuildToWaiting(build) {
        this.builds.push(build);
    }
    addBuildToInProgress(build) {
        build.status = buildStatus_1.default.InProgress;
        build.start = new Date().toISOString();
        this.processBuilds[build.id] = build;
    }
    returnBuildToWaiting(buildId) {
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
exports.default = new BuildService();
