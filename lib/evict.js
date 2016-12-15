"use strict";
var util_1 = require("./util");
var cache_1 = require("./cache");
var get_1 = require("./get");
var CacheMap_1 = require("./CacheMap");
var opath = require("./path");
var flush_1 = require("./flush");
var locate_1 = require("./locate");
var ref_1 = require("./ref");
exports.evictItem = function (obj, instance) {
    var uidArray = buildEvictUidArray(obj);
    if (uidArray.length == 0) {
        return locate_1.getCallStats(false, instance);
    }
    var currentState = get_1.getCacheCurrentStack(instance);
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
        flushArgs.entityUid = uid;
        clearTargetRefFroms(flushArgs);
        evictMap.set(uid, null);
        clearParentRefTos(uidArray, parentsChanged, flushArgs);
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
        flush_1.buildFlushMap(flushArgs_1);
        flushArgs_1.flushMap.forEach(function (key, item) {
            ref_1.updateRefFroms(item, flushArgs_1);
        });
    }
};
var clearTargetRefFroms = function (flushArgs) {
    var item = get_1.getCachedItem(flushArgs.entityUid, flushArgs.instance);
    if (item) {
        item.mapTo.forEach(function (toUid, paths) {
            var refItem = flush_1.getItemFlushOrCached(toUid, flushArgs);
            if (refItem) {
                clearRefFrom(refItem, flushArgs.entityUid);
                if (refItem.mapFrom.size() === 0) {
                    flushArgs.entityUid = toUid;
                    clearTargetRefFroms(flushArgs);
                    flushArgs.evictMap.set(toUid, refItem);
                }
                else {
                    flushArgs.flushMap.set(toUid, refItem);
                }
            }
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
var clearParentRefTos = function (uidArray, parentsChanged, flushArgs) {
    var item = flush_1.getItemFlushOrCached(flushArgs.entityUid, flushArgs);
    if (item) {
        item.mapFrom.forEach(function (parentUid, paths) {
            var parentItem = flush_1.getItemFlushOrCached(parentUid, flushArgs);
            if (parentItem) {
                var success = clearRefTo(parentItem, flushArgs.entityUid, flushArgs.instance);
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
var buildEvictUidArray = function (obj) {
    var uidArray = [];
    if (util_1.isArray(obj)) {
        obj.forEach(function (item) {
            if (util_1.hasUid(item)) {
                uidArray.push(String(item[cache_1.config.uidName]));
            }
            else {
                if (typeof item === "string" || typeof item === "number") {
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
exports.clearNext = function (instance) {
    var thread = instance.thread;
    if (thread.current < thread.nodes.length - 1) {
        var removedNodes = thread.nodes.slice(thread.current + 1, thread.nodes.length);
        thread.nodes = thread.nodes.slice(0, thread.current + 1);
        thread.current = thread.nodes.length - 1;
        truncateThreads(removedNodes, instance);
    }
};
var truncateThreads = function (removedNodes, instance) {
    removedNodes.forEach(function (cacheNodeId) {
        var cacheNode = instance.repo.get(cacheNodeId);
        if (cacheNode) {
            instance.repo.delete(cacheNodeId);
        }
    });
};
