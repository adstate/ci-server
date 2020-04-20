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
const axios_1 = __importDefault(require("axios"));
const https_1 = require("https");
const httpsAgent = new https_1.Agent({
    rejectUnauthorized: false,
});
const instance = axios_1.default.create({
    baseURL: 'https://hw.shri.yandex/api',
    timeout: 10000,
    headers: { Authorization: `Bearer ${process.env.JWT_TOKEN}` },
    httpsAgent,
});
exports.instance = instance;
function getSettings() {
    return __awaiter(this, void 0, void 0, function* () {
        return instance.get('/conf').then(res => res.data);
    });
}
exports.getSettings = getSettings;
function getBuilds(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        return instance.get('/build/list', { params: opts }).then(res => res.data);
    });
}
exports.getBuilds = getBuilds;
function getBuild(buildId) {
    return __awaiter(this, void 0, void 0, function* () {
        return instance.get('/build/details', {
            params: { buildId },
        });
    });
}
exports.getBuild = getBuild;
function getBuildLog(buildId) {
    return __awaiter(this, void 0, void 0, function* () {
        return instance.get('/build/log', {
            responseType: 'stream',
            params: { buildId },
        });
    });
}
exports.getBuildLog = getBuildLog;
function buildStart(buildId) {
    return __awaiter(this, void 0, void 0, function* () {
        return instance.post('build/start', {
            buildId,
            dateTime: new Date().toISOString
        });
    });
}
exports.buildStart = buildStart;
function buildFinish(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return instance.post('build/finish', data);
    });
}
exports.buildFinish = buildFinish;
