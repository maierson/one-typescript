"use strict";
var CacheMap_1 = require("./CacheMap");
var cacheUtil_1 = require("./cacheUtil");
var cache_1 = require("./cache");
var util_1 = require("./util");
exports.preFlush = function (flushArgs, instance) {
    var temp = new CacheMap_1.default();
    var currentStack = cacheUtil_1.getCacheCurrentStack(instance);
    if (currentStack) {
        currentStack.forEach(function (key, item) {
            temp.set(key, item);
        });
    }
    flushArgs.flushMap.forEach(function (key, item) {
        var itemUid = item.entity[cache_1.config.uidName];
        _freezeItem(item);
        temp.set(String(itemUid), item);
    });
    if (flushArgs.evictMap.size() > 0) {
        flushArgs.evictMap.forEach(function (key, value) {
            temp.delete(String(key));
        });
    }
    exports.flush(temp, instance);
};
var _freezeItem = function (item) {
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
