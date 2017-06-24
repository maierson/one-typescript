"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var opath = require("./path");
var cacheUtil_1 = require("./cacheUtil");
var cache_1 = require("./cache");
var util_1 = require("./util");
var addRefTo = function (parentItem, refUid, path) {
    if (parentItem.mapTo.has(refUid) === false) {
        parentItem.mapTo.set(refUid, []);
    }
    var refArray = parentItem.mapTo.get(refUid);
    if (refArray.indexOf(path) < 0) {
        refArray.push(path);
    }
    return parentItem;
};
var addRefFrom = function (refItem, parentUid, path) {
    if (refItem.mapFrom.has(parentUid) === false) {
        refItem.mapFrom.set(parentUid, []);
    }
    var fromArray = refItem.mapFrom.get(parentUid);
    if (fromArray.indexOf(path) < 0) {
        fromArray.push(path);
    }
    return refItem;
};
var assignRefs = function (parentItem, refItem, path) {
    var parentUid = parentItem.entity[cache_1.config.uidName];
    var refUid = refItem.entity[cache_1.config.uidName];
    var refPath = path.join('.');
    addRefTo(parentItem, refUid, refPath);
    addRefFrom(refItem, parentUid, refPath);
};
exports.assignRefToParent = function (refItem, parentUid, path, flushArgs) {
    if (parentUid) {
        var parentItem = cacheUtil_1.getItemFlushOrCached(parentUid, flushArgs);
        if (parentItem && path.length > 0) {
            assignRefs(parentItem, refItem, path);
        }
    }
};
exports.updateRefFroms = function (item, flushArgs) {
    if (item.mapFrom.length > 0) {
        item.mapFrom.forEach(function (parentUid, paths) {
            var parentItem = flushArgs.flushMap.get(parentUid);
            if (!parentItem) {
                parentItem = cacheUtil_1.getCachedItem(parentUid, flushArgs.instance);
            }
            if (parentItem && paths.length > 0) {
                var firstPath = paths[0];
                var targetRef = opath.get(parentItem.entity, firstPath);
                if (targetRef && targetRef !== item.entity) {
                    var args = {
                        flushMap: flushArgs.flushMap,
                        instance: flushArgs.instance,
                    };
                    parentItem = cacheUtil_1.ensureItem(parentItem.entity, args);
                    parentItem.entity = util_1.deepClone(parentItem.entity, item.entity, true);
                }
            }
        });
    }
};
var removeRefFrom = function (item, parentUid, path) {
    var refsArray = item.mapFrom.get(parentUid);
    var index = refsArray.indexOf(path);
    refsArray = refsArray.slice();
    refsArray.splice(index, 1);
    item.mapFrom.set(parentUid, refsArray);
    if (refsArray.length == 0) {
        item.mapFrom.delete(parentUid);
    }
};
var removeRefFromValue = function (parentUid, refUid, flushArgs, path) {
    var refItem = cacheUtil_1.getItemFlushOrCached(refUid, flushArgs);
    if (refItem) {
        refItem = refItem.clone();
        if (refItem.mapFrom.has(parentUid)) {
            removeRefFrom(refItem, parentUid, path);
            if (refItem.mapFrom.size() === 0) {
                flushArgs.evictMap.set(refUid, refItem);
                flushArgs.flushMap.delete(refUid);
            }
            else {
                flushArgs.flushMap.set(refUid, refItem);
                flushArgs.evictMap.delete(refUid);
            }
        }
    }
};
var updateItemRefTos = function (item, flushArgs) {
    if (!item || !item.mapTo) {
        return;
    }
    item.mapTo.forEach(function (toUid, paths) {
        var updatedPaths = paths.filter(function (path) {
            var reference = opath.get(item.entity, path);
            var hasRef = reference && String(reference[cache_1.config.uidName]) === String(toUid);
            if (!hasRef) {
                removeRefFromValue(item.entity[cache_1.config.uidName], toUid, flushArgs, path);
            }
            return hasRef;
        });
        if (updatedPaths.length > 0) {
            item.mapTo.set(toUid, updatedPaths);
        }
        else {
            item.mapTo.delete(toUid);
        }
    });
};
exports.updatePointers = function (flushArgs) {
    flushArgs.flushMap.forEach(function (key, item) {
        updateItemRefTos(item, flushArgs);
        exports.updateRefFroms(item, flushArgs);
    });
};
exports.updateRefTos = function (entityUid, flushArgs) {
    var item = cacheUtil_1.getItemFlushOrCached(entityUid, flushArgs);
    updateItemRefTos(item, flushArgs);
};
