"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const agentStatus_1 = __importDefault(require("../models/agentStatus"));
class AgentService {
    //status: waiting, busy
    constructor() {
        this.agents = [];
    }
    register(host, port) {
        const agent = {
            host,
            port,
            status: agentStatus_1.default.Waiting
        };
        this.agents.push(agent);
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
    startBuild(build, agent) {
    }
}
exports.default = new AgentService();
