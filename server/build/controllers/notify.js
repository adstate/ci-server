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
const agentService_1 = __importDefault(require("../services/agentService"));
const buildService_1 = __importDefault(require("../services/buildService"));
function notifyAgent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //console.log('notify agent');
        const { host: agentHost, port: agentPort } = req.body;
        agentService_1.default.processNotify(agentHost, agentPort);
        return res.json({
            status: 'success'
        });
    });
}
exports.notifyAgent = notifyAgent;
function notifyBuildResult(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { buildId, buildStatus, buildLog, duration } = req.body;
        const agent = agentService_1.default.getAgentByBuild(buildId);
        if (agent) {
            agentService_1.default.setAgentToWaiting(agent);
        }
        buildService_1.default.finishBuild({
            buildId,
            buildStatus,
            buildLog,
            duration
        });
        return res.json({
            status: 'success'
        });
    });
}
exports.notifyBuildResult = notifyBuildResult;
