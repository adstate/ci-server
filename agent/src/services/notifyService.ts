import * as config from '../agent-conf.json';
import os from 'os';
import {notify} from '../core/server-api';
import AgentStatus from '../../../server/src/models/agentStatus';
import buildService from '../services/buildService';

export class NotifyService {
    agentHost: string = '';
    agentPort: number = 0;
    notifyInterval: any = null;
    serverConnection: boolean = false;

    constructor() {
        
    }

    async init() {
        this.agentHost = os.hostname();
        this.agentPort = config.port;

        this.sendNotify();
        this.notifyInterval = setInterval(this.sendNotify.bind(this), 60 * 1000);
    }

    async sendNotify() {
        try {
            await notify(this.agentHost, this.agentPort);
            if (!this.serverConnection) {
                console.log(`Connected to server ${config.serverHost}:${config.serverPort}`);
                this.serverConnection = true;
            }
        } catch(e) {
            this.serverConnection = false;
            console.error(`Not connected to server ${config.serverHost}:${config.serverPort}`);
        }
    }
}

export default new NotifyService();
