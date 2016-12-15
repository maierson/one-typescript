"use strict";
var flush_1 = require("./flush");
var cache_1 = require("./cache");
var opath = require("./path");
var get_1 = require("./get");
var util_1 = require("./util");
exports.assignRefToParent = function (refItem, flushArgs) {
    if (flushArgs.parentUid) {
        var parentItem = flush_1.getItemFlushOrCached(flushArgs.parentUid, flushArgs);
        if (parentItem && flushArgs.refPath) {
            assignRefs(parentItem, refItem, flushArgs.refPath);
        }
    }
};
var assignRefs = function (parentItem, refItem, refPath) {
    var parentUid = parentItem.entity[cache_1.config.uidName];
    var refUid = refItem.entity[cache_1.config.uidName];
    addRefTo(parentItem, refUid, refPath);
    addRefFrom(refItem, parentUid, refPath);
};
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
exports.updatePointers = function (flushArgs) {
    flushArgs.flushMap.forEach(function (key, item) {
        updateItemRefTos(item, flushArgs);
        exports.updateRefFroms(item, flushArgs);
    });
};
exports.updateRefFroms = function (item, flushArgs) {
    item.mapFrom.forEach(function (parentUid, paths) {
        var parentItem = flushArgs.flushMap.get(parentUid);
        if (!parentItem) {
            parentItem = get_1.getCachedItem(parentUid, flushArgs.instance);
        }
        if (parentItem && paths.length > 0) {
            var firstPath = paths[0];
            var targetRef = opath.get(parentItem.entity, firstPath);
            var dirty = (targetRef && targetRef !== item.entity);
            if (dirty === true) {
                var args = {
                    entity: parentItem.entity,
                    flushMap: flushArgs.flushMap,
                    instance: flushArgs.instance
                };
                parentItem = flush_1.ensureItem(args);
                parentItem.entity = util_1.deepClone(parentItem.entity, item.entity, true);
            }
        }
    });
};
exports.updateRefTos = function (entityUid, flushArgs) {
    var item = flush_1.getItemFlushOrCached(entityUid, flushArgs);
    updateItemRefTos(item, flushArgs);
};
var updateItemRefTos = function (item, flushArgs) {
    if (item) {
        item.mapTo.forEach(function (toUid, paths) {
            var updatedPaths = paths.map(function (path) {
                var reference = opath.get(item.entity, path);
                if (reference) {
                    var targetUid = reference[cache_1.config.uidName];
                    if (targetUid) {
                        var found = targetUid == toUid;
                        if (found === true) {
                            return path;
                        }
                    }
                }
                removeRefFrom_Value(item.entity[cache_1.config.uidName], toUid, flushArgs);
            }).filter(function (item) {
                return item !== null && item !== undefined;
            });
            if (updatedPaths.length > 0) {
                item.mapTo.set(toUid, updatedPaths);
            }
            else {
                item.mapTo.delete(toUid);
            }
        });
    }
};
var removeRefFrom_Value = function (parentUid, refUid, flushArgs) {
    var refItem = flush_1.getItemFlushOrCached(refUid, flushArgs);
    if (refItem) {
        refItem = refItem.clone();
        if (refItem.mapFrom.has(parentUid)) {
            removeRefFrom(refItem, parentUid, flushArgs.refPath);
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
