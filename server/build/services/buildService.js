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
class BuildService {
    constructor() {
        this.builds = [];
        this.lastLoadedBuildNum = 0;
        this.initLimit = 500;
        this.initOffset = 0;
        this.processLimit = 5;
        this.processOffset = 0;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            // load all builds on init service
            yield this.initLoad();
            this.buildInterval = setInterval(this.processBuild.bind(this), 30 * 1000);
        });
    }
    addBuilds(builds) {
        const waitingBuilds = builds.filter((build) => {
            return build.status === buildStatus_1.default.Waiting && build.buildNumber > this.lastLoadedBuildNum;
        });
        //waitingBuilds.sort((a: Build, b: Build) => a.buildNumber - b.buildNumber);
        if (waitingBuilds.length > 0) {
            this.builds = [...waitingBuilds, ...this.builds];
        }
    }
    processLoad() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('process load');
            try {
                const buildListRes = yield ci_api_1.getBuilds({ offset: this.processOffset, limit: this.processLimit });
                const builds = buildListRes.data;
                //console.log(builds);
                this.addBuilds(builds);
                if (builds.length > 0) {
                    const curLastLoadedBuildNum = builds[0].buildNumber;
                    this.processLimit = (curLastLoadedBuildNum > this.lastLoadedBuildNum) ? this.processOffset + this.processLimit : 0;
                    this.lastLoadedBuildNum = curLastLoadedBuildNum;
                }
                //console.log(this.lastLoadedBuildNum);
            }
            catch (e) {
                console.error('Builds is not loaded', e.Error);
            }
        });
    }
    processBuild() {
        return __awaiter(this, void 0, void 0, function* () {
            const agent = agentService_1.default.getFreeAgent();
            if (!agent) {
                return;
            }
            const build = this.builds.pop();
            if (!build) {
                return;
            }
            agentService_1.default.startBuild(build, agent);
            yield ci_api_1.buildStart(build.id);
            console.log('build', build);
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
                //console.log(builds);
                this.addBuilds(builds);
                if (builds.length < this.initLimit) {
                    this.processInterval = setInterval(this.processLoad.bind(this), 30 * 1000);
                }
                else {
                    this.initOffset += builds.length;
                    this.initLoad();
                }
            }
            catch (e) {
                console.error('Builds is not loaded', e);
            }
        });
    }
}
exports.default = new BuildService();
