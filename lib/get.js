"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var cache_1 = require("./cache");
var cacheUtil_1 = require("./cacheUtil");
var getActualUid = function (uidOrEntity) {
    if (typeof uidOrEntity === 'string') {
        return uidOrEntity;
    }
    else if (typeof uidOrEntity === 'number') {
        return String(uidOrEntity);
    }
    else if (util_1.isObject(uidOrEntity)) {
        if (util_1.hasUid(uidOrEntity)) {
            return uidOrEntity[cache_1.config.uidName];
        }
    }
};
var getObject = function (uidOrEntity, instance) {
    var realUid = getActualUid(uidOrEntity);
    if (!realUid) {
        return;
    }
    var item = cacheUtil_1.getCachedItem(realUid, instance);
    return item ? item.entity : undefined;
};
exports.getItem = function (entity, instance, nodeId) {
    if (!entity) {
        throw new TypeError('One get(): requires a uid to retrieve an item from the cache.');
    }
    if (util_1.isArray(entity)) {
        return entity
            .map(function (item) { return getObject(item, instance); })
            .filter(function (item) { return (item !== null && item !== undefined); });
    }
    return getObject(entity, instance);
};
var getEditableObject = function (uidOrEntity, instance) {
    var realUid = getActualUid(uidOrEntity);
    var existing = exports.getItem(realUid, instance);
    return existing ? util_1.deepClone(existing, undefined, false) : undefined;
};
exports.getEditItem = function (obj, instance, nodeId) {
    if (util_1.isArray(obj)) {
        return obj
            .map(function (item) { return getEditableObject(item, instance); })
            .filter(function (item) { return (item !== null && item !== undefined); });
    }
    return getEditableObject(obj, instance);
};
