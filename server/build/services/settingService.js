"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ci_api_1 = require("../core/ci-api");
const buildService_1 = __importDefault(require("../services/buildService"));
class SettingService {
    constructor() {
        this.repoBaseUrl = 'https://github.com';
        this.id = '';
        this.repoName = '';
        this.buildCommand = '';
        this.mainBranch = '';
        this.period = 0;
        this.repoUrl = '';
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.load();
            setInterval(this.load.bind(this), 60 * 1000);
        });
    }
    update(settings) {
        if (this.id !== settings.id) {
            buildService_1.default.resetProcessOffset();
        }
        this.id = settings.id;
        this.repoName = settings.repoName;
        this.buildCommand = settings.buildCommand;
        this.mainBranch = settings.mainBranch;
        this.period = settings.period;
        this.repoUrl = `${this.repoBaseUrl}/${this.repoName}`;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const settingRes = yield ci_api_1.getSettings();
                const settings = settingRes.data;
                this.update(settings);
            }
            catch (e) {
                console.error('Settings is not loaded');
            }
        });
    }
}
exports.default = new SettingService();
