"use strict";
var get_1 = require("./get");
var cache_1 = require("./cache");
var util_1 = require("./util");
var path_1 = require("./path");
var CacheItem_1 = require("./CacheItem");
var CacheMap_1 = require("./CacheMap");
var ref_1 = require("./ref");
exports.buildFlushMap = function (flushArgs) {
    if (util_1.hasUid(flushArgs.entity)) {
        buildEntityFlushMap(flushArgs);
    }
    else {
        if (util_1.isArray(flushArgs.entity)) {
            cacheArrRefs(flushArgs);
        }
        else {
            cacheEntityRefs(flushArgs);
        }
    }
};
var buildEntityFlushMap = function (flushArgs) {
    flushArgs.refPath = "";
    if (isDirty(flushArgs) === true) {
        ensureOnFlushMap(flushArgs);
        cacheEntityRefs(flushArgs);
        ref_1.updateRefTos(String(flushArgs.entity[cache_1.config.uidName]), flushArgs);
    }
};
var ensureOnFlushMap = function (flushArgs) {
    var entityUid = String(flushArgs.entity[cache_1.config.uidName]);
    if (flushArgs.flushMap.has(entityUid) === false) {
        exports.ensureItem(flushArgs);
        flushArgs.parentUid = String(entityUid);
    }
};
var cacheEntityRefs = function (flushArgs) {
    var parentEntity = flushArgs.entity;
    for (var prop in parentEntity) {
        if (parentEntity.hasOwnProperty(prop)) {
            var refEntity = parentEntity[prop];
            if (util_1.isObject(refEntity) || (util_1.isArray(refEntity) && refEntity.length > 0)) {
                flushArgs.entity = refEntity;
                if (parentEntity[cache_1.config.uidName]) {
                    flushArgs.parentUid = parentEntity[cache_1.config.uidName];
                }
                if (flushArgs.parentUid) {
                    flushArgs.refPath = path_1.concatProp(flushArgs.refPath, prop);
                }
                if (!flushArgs.refPath) {
                    flushArgs.refPath = prop;
                }
            }
            if (util_1.isArray(refEntity) && refEntity.length > 0) {
                cacheArrRefs(flushArgs);
            }
            else if (util_1.isObject(refEntity)) {
                cacheObjRefs(flushArgs);
            }
            Object.freeze(refEntity);
        }
    }
};
var cacheArrRefs = function (flushArgs) {
    var entity = flushArgs.entity;
    var arrayPath = flushArgs.refPath;
    var arrayUid;
    if (!arrayUid) {
        arrayUid = flushArgs.parentUid;
    }
    entity.forEach(function (next, index) {
        flushArgs.entity = next;
        flushArgs.parentUid = arrayUid;
        if (flushArgs.refPath || arrayPath) {
            flushArgs.refPath = arrayPath + "." + index;
        }
        if (util_1.isArray(next)) {
            cacheArrRefs(flushArgs);
        }
        else if (util_1.isObject(next)) {
            cacheObjRefs(flushArgs);
        }
    });
    Object.freeze(entity);
};
var cacheObjRefs = function (flushArgs) {
    if (util_1.hasUid(flushArgs.entity)) {
        cacheUidObjRefs(flushArgs);
    }
    else {
        cacheEntityRefs(flushArgs);
    }
};
var cacheUidObjRefs = function (flushArgs) {
    var refItem = exports.ensureItem(flushArgs);
    ref_1.assignRefToParent(refItem, flushArgs);
    if (get_1.isOnCache(flushArgs) === true)
        return;
    exports.buildFlushMap(flushArgs);
};
var isDirty = function (flushArgs) {
    var cachedItem = get_1.getCachedItem(flushArgs.entity[cache_1.config.uidName], flushArgs.instance);
    return !cachedItem || cachedItem.entity !== flushArgs.entity;
};
exports.getItemFlushOrCached = function (uid, flushArgs) {
    if (uid) {
        uid = String(uid);
        var item = flushArgs.flushMap.get(uid);
        if (!item) {
            item = get_1.getCachedItem(uid, flushArgs.instance);
        }
        if (item && Object.isFrozen(item)) {
            item = item.clone();
        }
        return item;
    }
};
exports.ensureItem = function (flushArgs) {
    var itemUid = String(flushArgs.entity[cache_1.config.uidName]);
    var item = flushArgs.flushMap.get(itemUid);
    if (item) {
        return item;
    }
    var live = get_1.getCachedItem(itemUid, flushArgs.instance);
    item = new CacheItem_1.default(flushArgs.entity, live);
    flushArgs.flushMap.set(itemUid, item);
    flushArgs.flushMap['__UPDATED__'] = true;
    return item;
};
exports.preFlush = function (flushArgs) {
    var temp = new CacheMap_1.default();
    var currentStack = get_1.getCacheCurrentStack(flushArgs.instance);
    if (currentStack) {
        currentStack.forEach(function (key, item) {
            temp.set(key, item);
        });
    }
    flushArgs.flushMap.forEach(function (key, item) {
        var itemUid = item.entity[cache_1.config.uidName];
        freezeItem(item);
        temp.set(String(itemUid), item);
    });
    if (flushArgs.evictMap.size() > 0) {
        flushArgs.evictMap.forEach(function (key, value) {
            temp.delete(String(key));
        });
    }
    exports.flush(temp, flushArgs.instance);
};
var freezeItem = function (item) {
    Object.freeze(item);
    Object.freeze(item.entity);
    Object.freeze(item.mapTo);
    Object.freeze(item.mapFrom);
};
exports.flush = function (temp, instance) {
    if (temp !== null) {
        Object.freeze(temp);
        var cacheNode = util_1.getNewCacheNode(instance);
        cacheNode.items = temp;
        if (instance.thread.nodes.indexOf(cacheNode.id) < 0) {
            instance.thread.nodes.push(cacheNode.id);
            instance.thread.current += 1;
        }
    }
};
