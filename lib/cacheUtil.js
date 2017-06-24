"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CacheItem_1 = require("./CacheItem");
var cache_1 = require("./cache");
exports.getCachedItem = function (uid, instance) {
    var currentNode = getCurrentNode(instance);
    return currentNode ? currentNode.items.get(String(uid)) : undefined;
};
exports.isOnCache = function (entity, instance) {
    var cachedItem = exports.getCachedItem(entity[cache_1.config.uidName], instance);
    return cachedItem && cachedItem.entity === entity;
};
exports.isOnFlushMap = function (entity, flushMap) {
    return !!flushMap.get(entity[cache_1.config.uid]);
};
exports.getItemFlushOrCached = function (uid, flushArgs) {
    if (uid) {
        var uuid = String(uid);
        var item = flushArgs.flushMap.get(uuid);
        if (!item) {
            item = exports.getCachedItem(uuid, flushArgs.instance);
        }
        if (item && Object.isFrozen(item)) {
            item = item.clone();
        }
        return item;
    }
};
function getCurrentNode(instance) {
    var currentNodeId = instance.thread.nodes[instance.thread.current];
    return currentNodeId >= 0 ? getRepoNode(currentNodeId, instance.repo) : undefined;
}
function getRepoNode(nodeId, repo) {
    return repo.get(nodeId);
}
exports.getCacheCurrentStack = function (instance) {
    var currentNode = getCurrentNode(instance);
    return currentNode ? currentNode.items : undefined;
};
exports.ensureItem = function (entity, flushArgs) {
    var itemUid = String(entity[cache_1.config.uidName]);
    var item = flushArgs.flushMap.get(itemUid);
    if (item) {
        return item;
    }
    var live = exports.getCachedItem(itemUid, flushArgs.instance);
    item = new CacheItem_1.default(entity, live);
    flushArgs.flushMap.set(itemUid, item);
    flushArgs.flushMap['__UPDATED__'] = true;
    return item;
};
exports.ensureOnFlushMap = function (entity, flushArgs) {
    var entityUid = String(entity[cache_1.config.uidName]);
    if (!flushArgs.flushMap.has(entityUid)) {
        exports.ensureItem(entity, flushArgs);
    }
};
