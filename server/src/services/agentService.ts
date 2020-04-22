import Agent from '../models/agent';
import AgentStatus from '../models/agentStatus';
import Build from '../models/build';
import BuildData from '../models/buildData';
import {startBuild as startBuildOnAgent} from '../core/agent-api';
import settingService from '../services/settingService';

class AgentService {
    agents: Agent[] = [];

    //status: waiting, busy

    constructor() {
        
    }

    register(host: string, port: number) {
        if (this.getAgent(host, port)) {
            return;
        }

        const agent: Agent = {
            host,
            port,
            status: AgentStatus.Waiting,
            processingBuildId: null
        }

        this.agents.push(agent);
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
}

export default new AgentService();
