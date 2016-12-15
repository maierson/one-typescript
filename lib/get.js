"use strict";
var cache_1 = require("./cache");
var util_1 = require("./util");
exports.getItem = function (entity, instance, nodeId) {
    if (!entity) {
        throw new TypeError("One get(): requires a uid to retrieve an item from the cache.");
    }
    if (util_1.isArray(entity)) {
        return entity.map(function (item) {
            return getObject(item, instance);
        }).filter(function (item) {
            return item !== null && item !== undefined;
        });
    }
    return getObject(entity, instance);
};
var getObject = function (uidOrEntity, instance) {
    var realUid = getActualUid(uidOrEntity);
    if (!realUid) {
        return;
    }
    var item = exports.getCachedItem(realUid, instance);
    return item ? item.entity : undefined;
};
exports.getEditItem = function (obj, instance, nodeId) {
    console.log("GET EDIT ITEM");
    if (util_1.isArray(obj)) {
        return obj.map(function (item) {
            return getEditableObject(item, instance);
        }).filter(function (item) {
            return item !== null && item !== undefined;
        });
    }
    return getEditableObject(obj, instance);
};
var getEditableObject = function (uidOrEntity, instance) {
    var realUid = getActualUid(uidOrEntity);
    var existing = exports.getItem(realUid, instance);
    return existing ? util_1.deepClone(existing, undefined, false) : undefined;
};
var getActualUid = function (uidOrEntity) {
    if (typeof uidOrEntity === "string") {
        return uidOrEntity;
    }
    else if (typeof uidOrEntity === "number") {
        return String(uidOrEntity);
    }
    else if (util_1.isObject(uidOrEntity)) {
        if (util_1.hasUid(uidOrEntity)) {
            return uidOrEntity[cache_1.config.uidName];
        }
    }
};
exports.isOnCache = function (flushArgs) {
    var uid = flushArgs.entity[cache_1.config.uidName];
    var existingItem = exports.getCachedItem(uid, flushArgs.instance);
    return existingItem && existingItem.entity === flushArgs.entity;
};
exports.getCachedItem = function (uid, instance) {
    var currentNode = getCurrentNode(instance);
    return currentNode ? currentNode.items.get(String(uid)) : undefined;
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
