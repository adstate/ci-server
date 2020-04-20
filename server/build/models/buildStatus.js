"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BuildStatus;
(function (BuildStatus) {
    BuildStatus["Waiting"] = "Waiting";
    BuildStatus["InProgress"] = "InProgress";
    BuildStatus["Success"] = "Success";
    BuildStatus["Fail"] = "Fail";
    BuildStatus["Canceled"] = "Canceled";
})(BuildStatus || (BuildStatus = {}));
exports.default = BuildStatus;
