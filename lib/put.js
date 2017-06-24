"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var CacheMap_1 = require("./CacheMap");
var locate_1 = require("./locate");
var parse_1 = require("./parse");
var flush_1 = require("./flush");
var ref_1 = require("./ref");
exports.putItem = function (entity, instance) {
    if ((util_1.isArray(entity) || util_1.isObject(entity))) {
        var evictMap = new CacheMap_1.default();
        var flushMap = new CacheMap_1.default();
        flushMap['__UPDATED__'] = false;
        var flushArgs = {
            flushMap: flushMap,
            evictMap: evictMap,
            instance: instance,
        };
        parse_1.parse(entity, flushArgs);
        ref_1.updatePointers(flushArgs);
        if (flushArgs.flushMap.size() > 0) {
            flush_1.preFlush(flushArgs, instance);
            return locate_1.getCallStats(true, instance);
        }
    }
    return locate_1.getCallStats(false, instance);
};
