"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = {
    uidName: 'uid',
    maxHistoryStates: 1000,
};
function configure(conf) {
    for (var p in exports.defaultConfig) {
        if (exports.defaultConfig.hasOwnProperty(p) && conf.hasOwnProperty(p)) {
            exports.defaultConfig[p] = conf[p];
        }
    }
    return exports.defaultConfig;
}
exports.configure = configure;
