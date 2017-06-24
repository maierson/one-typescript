"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var opath = require("./path");
var util_1 = require("./util");
var cacheUtil_1 = require("./cacheUtil");
var ref_1 = require("./ref");
var CacheMap_1 = require("./CacheMap");
var cache_1 = require("./cache");
var flush_1 = require("./flush");
var locate_1 = require("./locate");
var get_1 = require("./get");
var parse_1 = require("./parse");
var buildEvictUidArray = function (obj) {
    var uidArray = [];
    if (util_1.isArray(obj)) {
        obj.forEach(function (item) {
            if (util_1.hasUid(item)) {
                uidArray.push(String(item[cache_1.config.uidName]));
            }
            else {
                if (typeof item === 'string' || typeof item === 'number') {
                    uidArray.push(String(item));
                }
            }
        });
    }
    else {
        var uid = obj;
        if (util_1.isObject(obj)) {
            uid = obj[cache_1.config.uidName];
        }
        if (uid === undefined) {
            return uidArray;
        }
        uidArray.push(String(uid));
    }
    return uidArray;
};
exports.evictItem = function (obj, instance) {
    var uidArray = buildEvictUidArray(obj);
    if (uidArray.length == 0) {
        return locate_1.getCallStats(false, instance);
    }
    var currentState = cacheUtil_1.getCacheCurrentStack(instance);
    var found = uidArray.some(function (item) {
        return currentState && currentState.has(String(item));
    });
    if (!found) {
        return locate_1.getCallStats(false, instance);
    }
    var tempState = new CacheMap_1.default();
    currentState.forEach(function (key, value) {
        tempState.set(key, value);
    });
    var flushMap = new CacheMap_1.default();
    var evictMap = new CacheMap_1.default();
    var flushArgs = {
        flushMap: flushMap,
        evictMap: evictMap,
        instance: instance
    };
    var parentsChanged = [];
    uidArray.forEach(function (uid) {
        clearTargetRefFroms(uid, flushArgs);
        evictMap.set(uid, null);
        clearParentRefTos(uid, uidArray, parentsChanged, flushArgs);
    });
    putParentsChanged(parentsChanged, flushMap, evictMap, instance);
    flushMap.forEach(function (key, item) {
        tempState.set(key, item);
    });
    evictMap.forEach(function (key, item) {
        tempState.delete(key);
    });
    flush_1.flush(tempState, instance);
    return locate_1.getCallStats(true, instance);
};
var putParentsChanged = function (parentsChanged, flushMap, evictMap, instance) {
    if (parentsChanged && parentsChanged.length > 0 && util_1.cacheSize(instance) > 0) {
        var flushArgs_1 = {
            flushMap: flushMap,
            evictMap: evictMap,
            instance: instance
        };
        parse_1.parse(parentsChanged, flushArgs_1);
        flushArgs_1.flushMap.forEach(function (key, item) {
            ref_1.updateRefFroms(item, flushArgs_1);
        });
    }
};
var clearRefFrom = function (refItem, parentUid) {
    var refsArray = refItem.mapFrom.get(parentUid);
    if (!refsArray) {
        return;
    }
    refItem.mapFrom = refItem.mapFrom.clone();
    refItem.mapFrom.delete(parentUid);
};
var clearRefTo = function (parentItem, refUid, instance) {
    var parent = parentItem.entity;
    if (Object.isFrozen(parent)) {
        parent = get_1.getEditItem(parent[cache_1.config.uidName], instance);
        parentItem.entity = parent;
    }
    var refPaths = parentItem.mapTo.get(refUid);
    refPaths.forEach(function (path) {
        opath.del(parent, path);
    });
    if (!Object.isFrozen(parent)) {
        Object.freeze(parent);
    }
    parentItem.entity = parent;
    parentItem.mapTo = parentItem.mapTo.clone();
    parentItem.mapTo.delete(refUid);
    return true;
};
var clearTargetRefFroms = function (entityUid, flushArgs) {
    var item = cacheUtil_1.getCachedItem(entityUid, flushArgs.instance);
    if (item) {
        item.mapTo.forEach(function (toUid, paths) {
            var refItem = cacheUtil_1.getItemFlushOrCached(toUid, flushArgs);
            if (refItem) {
                clearRefFrom(refItem, entityUid);
                if (refItem.mapFrom.size() === 0) {
                    clearTargetRefFroms(toUid, flushArgs);
                    flushArgs.evictMap.set(toUid, refItem);
                }
                else {
                    flushArgs.flushMap.set(toUid, refItem);
                }
            }
        });
    }
};
var clearParentRefTos = function (entityUid, uidArray, parentsChanged, flushArgs) {
    var item = cacheUtil_1.getItemFlushOrCached(entityUid, flushArgs);
    if (item) {
        item.mapFrom.forEach(function (parentUid, paths) {
            var parentItem = cacheUtil_1.getItemFlushOrCached(parentUid, flushArgs);
            if (parentItem) {
                var success = clearRefTo(parentItem, entityUid, flushArgs.instance);
                if (success === true) {
                    flushArgs.flushMap.set(parentUid, parentItem);
                    if (uidArray.indexOf(parentUid) < 0) {
                        parentsChanged.push(parentItem);
                    }
                }
            }
        });
    }
};
