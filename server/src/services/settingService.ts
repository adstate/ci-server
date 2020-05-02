import Settings from '../models/settings';
import SettingResponse from '../models/settingResponse';
import { getSettings } from '../core/ci-api';
import buildService from '../services/buildService';

class SettingService implements Settings {
    id: string;
    repoName: string;
    buildCommand: string;
    mainBranch: string;
    period: number;
    repoUrl: string;

    repoBaseUrl: string = 'https://github.com';

    constructor() {
        this.id = '';
        this.repoName = '';
        this.buildCommand = '';
        this.mainBranch = '';
        this.period = 0;
        this.repoUrl = '';
    }

    async init() {
        await this.load();

        setInterval(this.load.bind(this), 60 * 1000);
    }

    update(settings: Settings) {
        if (this.id !== settings.id) {
            buildService.resetProcessOffset();
        }

        this.id = settings.id;
        this.repoName = settings.repoName;
        this.buildCommand = settings.buildCommand;
        this.mainBranch = settings.mainBranch;
        this.period = settings.period;
        this.repoUrl = `${this.repoBaseUrl}/${this.repoName}`;
    }

    async load() {
        try {
            const settingRes: SettingResponse = await getSettings();
            const settings: Settings = settingRes.data;
            
            this.update(settings);
        } catch(e) {
            console.error('Settings is not loaded');
        }
    }

}

export default new SettingService();
