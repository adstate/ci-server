import Agent from '../models/agent';
import AgentStatus from '../models/agentStatus';
import Build from '../models/build';

class AgentService {
    agents: Agent[] = [];

    //status: waiting, busy

    constructor() {
        
    }

    register(host: string, port: string) {
        const agent: Agent = {
            host,
            port,
            status: AgentStatus.Waiting
        }

        this.agents.push(agent);
    }

    getFreeAgent() {
        const freeAgents = this.agents.filter((agent: Agent) => agent.status === AgentStatus.Waiting);
        if (freeAgents.length > 0) {
            return freeAgents[0];
        } else {
            return null;
        }
    }

    startBuild(build: Build, agent: Agent) {
        
    }
}

export default new AgentService();
