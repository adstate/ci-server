const Emitter = require('events');
import repoStatus from './repoStatus';
import {ConfigurationModel} from './configurationModel';

export default class Configuration extends Emitter implements ConfigurationModel {
    id: string = '';
    repoName: string = '';
    buildCommand: string = '';
    mainBranch: string = '';
    period: number = 0;
    repoStatus: repoStatus = repoStatus.Empty;
    lastBuildedCommit: any;

    constructor() {
        super();
    }

    init(opts: any) {
        this.update(opts);
        this.emit('init');
    }

    set(opts: any, event?: string) {
        opts = opts || {};

        this.id = opts.id || null;
        this.repoName = opts.repoName;
        this.buildCommand = opts.buildCommand;
        this.mainBranch = opts.mainBranch;
        this.period = opts.period;
        this.repoStatus = opts.repoStatus || repoStatus.Empty;
        this.lastBuildedCommit = opts.lastBuildedCommit || null;
        this.actual = !!opts.id;

        if (event !== 'init') {
            this.emit('change');
        }
    }

    update(opts: any) {
        opts = opts || {};

        this.id = opts.id || this.id;
        this.repoName = opts.repoName || this.repoName;
        this.buildCommand = opts.buildCommand || this.buildCommand;
        this.mainBranch = opts.mainBranch || this.mainBranch;
        this.period = opts.period || this.period;
        this.repoStatus = opts.repoStatus || this.repoStatus;
        this.lastBuildedCommit = opts.lastBuildedCommit || this.lastBuildedCommit;
        this.actual = opts.actual || !!opts.id;

        this.emit('change');
    }
};
