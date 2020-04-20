"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller = __importStar(require("../controllers/notify"));
const express_1 = require("express");
const notifyRouter = express_1.Router();
notifyRouter.post('/notify-agent', controller.notifyAgent);
exports.default = notifyRouter;
