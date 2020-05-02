import axios, { AxiosAdapter, AxiosInstance } from 'axios';
import Agent from '../models/agent';
import Build from '../models/build';
import BuildData from '../models/buildData';


async function startBuild(buildData: BuildData, agent: Agent) {
    return axios.post(`http://${agent.host}:${agent.port}/build`, buildData);
}

export {
    startBuild
}