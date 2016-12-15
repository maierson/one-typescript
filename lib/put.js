"use strict";
var CacheMap_1 = require("./CacheMap");
var locate_1 = require("./locate");
var util_1 = require("./util");
var ref_1 = require("./ref");
var flush_1 = require("./flush");
exports.putItem = function (entity, instance) {
    if ((util_1.isArray(entity) || util_1.isObject(entity))) {
        var evictMap = new CacheMap_1.default();
        var flushMap = new CacheMap_1.default();
        flushMap['__UPDATED__'] = false;
        var flushArgs = {
            entity: entity,
            flushMap: flushMap,
            evictMap: evictMap,
            parentUid: null,
            refPath: "",
            instance: instance
        };
        flush_1.buildFlushMap(flushArgs);
        ref_1.updatePointers(flushArgs);
        if (flushArgs.flushMap.size() > 0 && flushMap['__UPDATED__'] === true) {
            return commitPut(flushArgs);
        }
    }
    return locate_1.getCallStats(false, instance);
};
var commitPut = function (flushArgs) {
    flush_1.preFlush(flushArgs);
    return locate_1.getCallStats(true, flushArgs.instance);
};
