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
const agentStatus_1 = __importDefault(require("../models/agentStatus"));
const agent_api_1 = require("../core/agent-api");
const settingService_1 = __importDefault(require("../services/settingService"));
const buildService_1 = __importDefault(require("../services/buildService"));
class AgentService {
    constructor() {
        this.agents = [];
        this.checkAgentsInterval = null;
        this.checkAgentsIntervalTime = 60 * 1000;
        this.agentAliveTimeout = 2 * 60 * 1000;
        this.checkAgentsInterval = setInterval(this.checkAgents.bind(this), this.checkAgentsIntervalTime);
    }
    processNotify(host, port) {
        const agent = this.getAgent(host, port);
        if (agent) {
            agent.lastNotify = new Date();
        }
        else {
            this.register(host, port);
        }
    }
    register(host, port) {
        const newAgent = {
            host,
            port,
            status: agentStatus_1.default.Waiting,
            processingBuildId: null,
            lastNotify: new Date()
        };
        this.agents.push(newAgent);
        console.log('register agent', host, port);
    }
    getFreeAgent() {
        const freeAgents = this.agents.filter((agent) => agent.status === agentStatus_1.default.Waiting);
        if (freeAgents.length > 0) {
            return freeAgents[0];
        }
        else {
            return null;
        }
    }
    getAgent(host, port) {
        return this.agents.find((a) => a.host === host && a.port === port);
    }
    getAgentByBuild(buildId) {
        return this.agents.find((a) => a.processingBuildId === buildId);
    }
    startBuild(build, agent) {
        return __awaiter(this, void 0, void 0, function* () {
            const buildData = {
                buildId: build.id,
                repoUrl: settingService_1.default.repoUrl,
                commitHash: build.commitHash,
                buildCommand: settingService_1.default.buildCommand
            };
            const result = yield agent_api_1.startBuild(buildData, agent);
            if (result.data.status === agentStatus_1.default.Busy) {
                console.log('selected agent is busy');
                this.setAgentToBusy(agent, '');
                return Promise.reject();
            }
            this.setAgentToBusy(agent, build.id);
            return result.data;
        });
    }
    setAgentToBusy(agent, buildId) {
        agent.status = agentStatus_1.default.Busy;
        agent.processingBuildId = buildId;
    }
    setAgentToWaiting(agent) {
        agent.status = agentStatus_1.default.Waiting;
        agent.processingBuildId = null;
    }
    checkAgents() {
        const forbiddenAgents = this.agents.filter((a) => {
            return new Date().getTime() - a.lastNotify.getTime() > this.agentAliveTimeout;
        });
        forbiddenAgents.forEach((a) => {
            const index = this.agents.indexOf(a);
            if (index > -1) {
                this.agents.splice(index, 1);
                if (a.processingBuildId) {
                    buildService_1.default.returnBuildToWaiting(a.processingBuildId);
                }
                console.log(`agent ${a.host}:${a.port} was forbidden by timeout`);
            }
        });
    }
    checkBuildRunning(buildId) {
        return this.agents.some((a) => a.processingBuildId === buildId);
    }
}
exports.default = new AgentService();
