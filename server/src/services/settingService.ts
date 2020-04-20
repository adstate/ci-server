import Settings from '../models/settings';
import SettingResponse from '../models/settingResponse';
import { getSettings } from '../core/ci-api';

class SettingService implements Settings {
    id: string;
    repoName: string;
    buildCommand: string;
    mainBranch: string;
    period: number;

    constructor() {
        this.id = '';
        this.repoName = '';
        this.buildCommand = '';
        this.mainBranch = '';
        this.period = 0;
    }

    async init() {
        await this.load();

        setInterval(this.load.bind(this), 60 * 1000);
    }

    update(settings: Settings) {
        this.id = settings.id;
        this.repoName = settings.repoName;
        this.buildCommand = settings.buildCommand;
        this.mainBranch = settings.mainBranch;
        this.period = settings.period;

        //console.log(settings);
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
