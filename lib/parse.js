"use strict";
var util_1 = require("./util");
var cacheUtil_1 = require("./cacheUtil");
var ref_1 = require("./ref");
var cache_1 = require("./cache");
exports.parse = function (entity, flushArgs) {
    if (util_1.hasUid(entity)) {
        if (cacheUtil_1.isOnCache(entity, flushArgs.instance))
            return;
        _addToFlushMap(entity, flushArgs);
    }
    else {
        if (util_1.isArray(entity)) {
            _parseArray(entity, null, [], flushArgs);
        }
        else if (util_1.isObject(entity)) {
            _parseObject(entity, null, [], flushArgs);
        }
    }
};
var _addToFlushMap = function (entity, flushArgs) {
    cacheUtil_1.ensureOnFlushMap(entity, flushArgs);
    _parseEntity(entity, entity[cache_1.config.uidName], [], flushArgs);
    ref_1.updateRefTos(String(entity[cache_1.config.uidName]), flushArgs);
};
var _parseEntity = function (entity, parentUid, path, flushArgs) {
    if (path === void 0) { path = []; }
    for (var key in entity) {
        if (entity.hasOwnProperty(key)) {
            var ref = entity[key];
            if (util_1.isArray(ref)) {
                _parseArray(ref, parentUid, path.concat([key]), flushArgs);
            }
            else if (util_1.isObject(ref)) {
                _parseObject(ref, parentUid, path.concat([key]), flushArgs);
            }
            Object.freeze(ref);
        }
    }
};
var _parseArray = function (arr, parentUid, path, flushArgs) {
    if (path === void 0) { path = []; }
    arr.forEach(function (item, index) {
        if (util_1.isArray(item)) {
            _parseArray(item, parentUid, path.concat([index]), flushArgs);
        }
        else if (util_1.isObject(item)) {
            _parseObject(item, parentUid, path.concat([index]), flushArgs);
        }
    });
};
var _parseObject = function (obj, parentUid, path, flushArgs) {
    if (util_1.hasUid(obj)) {
        _cacheUidObj(obj, parentUid, path, flushArgs);
    }
    else {
        _parseEntity(obj, parentUid, path, flushArgs);
    }
};
var _cacheUidObj = function (entity, parentUid, path, flushArgs) {
    var item = cacheUtil_1.ensureItem(entity, flushArgs);
    if (parentUid)
        ref_1.assignRefToParent(item, parentUid, path, flushArgs);
    if (cacheUtil_1.isOnCache(entity, flushArgs.instance)
        || cacheUtil_1.isOnFlushMap(entity, flushArgs.flushMap))
        return;
    exports.parse(entity, flushArgs);
};
