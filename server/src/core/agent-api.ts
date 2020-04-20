import axios, { AxiosAdapter, AxiosInstance } from 'axios';
import Agent from '../models/agent';
import Build from '../models/build';


async function startBuild(agent: Agent, build: Build) {
    return axios.post(`http://${agent.host}:${agent.port}/build`, build);
}

export {
    startBuild
}