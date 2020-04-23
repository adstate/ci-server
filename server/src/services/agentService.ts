import Agent from '../models/agent';
import AgentStatus from '../models/agentStatus';
import Build from '../models/build';
import BuildData from '../models/buildData';
import {startBuild as startBuildOnAgent} from '../core/agent-api';
import settingService from '../services/settingService';
import buildService from '../services/buildService';

class AgentService {
    agents: Agent[] = [];
    checkAgentsInterval: any = null;
    checkAgentsIntervalTime: number = 60 * 1000;
    agentAliveTimeout: number = 2 * 60 * 1000;

    constructor() {
        this.checkAgentsInterval = setInterval(this.checkAgents.bind(this), this.checkAgentsIntervalTime);   
    }

    processNotify(host: string, port: number) {
        const agent: Agent | undefined = this.getAgent(host, port);

        if (agent) {
            agent.lastNotify = new Date();
        } else {
            this.register(host, port);
        }
    }

    register(host: string, port: number) {
        const newAgent: Agent = {
            host,
            port,
            status: AgentStatus.Waiting,
            processingBuildId: null,
            lastNotify: new Date()
        }

        this.agents.push(newAgent);
        console.log('register agent', host, port);
    }

    getFreeAgent() {
        const freeAgents = this.agents.filter((agent: Agent) => agent.status === AgentStatus.Waiting);
        if (freeAgents.length > 0) {
            return freeAgents[0];
        } else {
            return null;
        }
    }

    getAgent(host: string, port: number): Agent | undefined {
        return this.agents.find((a: Agent) => a.host === host && a.port === port);
    }

    getAgentByBuild(buildId: string): Agent | undefined {
        return this.agents.find((a: Agent) => a.processingBuildId === buildId);
    }

    async startBuild(build: Build, agent: Agent) {
        const buildData: BuildData = {
            buildId: build.id,
            repoUrl: settingService.repoUrl,
            commitHash: build.commitHash,
            buildCommand: settingService.buildCommand
        }

        const result = await startBuildOnAgent(buildData, agent);

        if (result.data.status === AgentStatus.Busy) {
            console.log('selected agent is busy');
            this.setAgentToBusy(agent, '');
            return Promise.reject();
        }

        this.setAgentToBusy(agent, build.id);

        return result.data;
    }

    setAgentToBusy(agent: Agent, buildId: string) {
        agent.status = AgentStatus.Busy;
        agent.processingBuildId = buildId;
    }

    setAgentToWaiting(agent: Agent) {
        agent.status = AgentStatus.Waiting;
        agent.processingBuildId = null;
    }

    checkAgents() {
        const forbiddenAgents = this.agents.filter((a: Agent) => {
            return new Date().getTime() - a.lastNotify.getTime() > this.agentAliveTimeout;
        });

        forbiddenAgents.forEach((a: Agent) => {
            const index: number = this.agents.indexOf(a);
            if (index > -1) {
                this.agents.splice(index, 1);
                if (a.processingBuildId) {
                    buildService.returnBuildToWaiting(a.processingBuildId);
                }
                console.log(`agent ${a.host}:${a.port} was forbidden by timeout`);
            }
        });
    }

    checkBuildRunning(buildId: string) {
         return this.agents.some((a: Agent) => a.processingBuildId === buildId);
    }
}

export default new AgentService();
