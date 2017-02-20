"use strict";
var config_1 = require("./config");
var put_1 = require("./put");
var print_1 = require("./print");
var CacheInstance_1 = require("./CacheInstance");
var util_1 = require("./util");
var get_1 = require("./get");
var evict_1 = require("./evict");
exports.instances = {};
var cacheTest = false;
function setTesting(testing) {
    cacheTest = testing;
}
exports.setTesting = setTesting;
function getCache(instanceName, configuration) {
    if (instanceName === void 0) { instanceName = "one"; }
    if (configuration === void 0) { configuration = config_1.defaultConfig; }
    if (!exports.config) {
        exports.config = config_1.configure(configuration);
    }
    if (!exports.instances[instanceName]) {
        exports.instances[instanceName] = createCache(instanceName);
    }
    if (window) {
        if (window[instanceName] === undefined) {
            window[instanceName] = exports.instances[instanceName];
        }
    }
    return exports.instances[instanceName];
}
exports.getCache = getCache;
exports.put = function (item) {
    getCache().put(item);
};
exports.get = function (entity, nodeId) {
    return getCache().get(entity, nodeId);
};
exports.getEdit = function (uidOrEntityOrArray, nodeId) {
    return getCache().getEdit(uidOrEntityOrArray, nodeId);
};
exports.evict = function (uidOrEntityOrArray) {
    return getCache().evict(uidOrEntityOrArray);
};
exports.print = function () {
    return getCache().print();
};
exports.reset = function () {
    getCache().reset();
};
exports.uuid = function () {
    var lut = [];
    for (var i = 0; i < 256; i++) {
        lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
    }
    var d0 = Math.random() * 0x100000000 | 0;
    var d1 = Math.random() * 0x100000000 | 0;
    var d2 = Math.random() * 0x100000000 | 0;
    var d3 = Math.random() * 0x100000000 | 0;
    return lut[d0 & 0xFF] + lut[d0 >> 8 & 0xFF] + lut[d0 >> 16 & 0xFF]
        + lut[d0 >> 24 & 0xFF] + '-' + lut[d1 & 0xFF]
        + lut[d1 >> 8 & 0xFF] + '-' + lut[d1 >> 16 & 0x0f | 0x40]
        + lut[d1 >> 24 & 0xFF] + '-' + lut[d2 & 0x3f | 0x80]
        + lut[d2 >> 8 & 0xFF] + '-' + lut[d2 >> 16 & 0xFF]
        + lut[d2 >> 24 & 0xFF] + lut[d3 & 0xFF] + lut[d3 >> 8 & 0xFF]
        + lut[d3 >> 16 & 0xFF] + lut[d3 >> 24 & 0xFF];
};
function createCache(name) {
    var instance = new CacheInstance_1.default(name);
    var reset = function () {
        instance.reset();
    };
    var put = function (item) {
        return put_1.putItem(item, instance);
    };
    var get = function (entity, nodeId) {
        return get_1.getItem(entity, instance, nodeId);
    };
    var getEdit = function (uidOrEntityOrArray, nodeId) {
        return get_1.getEditItem(uidOrEntityOrArray, instance, nodeId);
    };
    var evict = function (uidOrEntityOrArray) {
        return evict_1.evictItem(uidOrEntityOrArray, instance);
    };
    var size = function () {
        return util_1.cacheSize(instance);
    };
    var length = function () {
        return util_1.cacheLength(instance);
    };
    var print = function () {
        return print_1.printCache(instance);
    };
    var result = {
        put: put,
        get: get,
        getEdit: getEdit,
        evict: evict,
        reset: reset,
        size: size,
        length: length,
        print: print,
    };
    if (cacheTest === true) {
        result.refTo = function (uid) {
            var item = get_1.getCachedItem(uid, instance);
            return item.mapTo;
        };
        result.refFrom = function (uid) {
            var item = get_1.getCachedItem(uid, instance);
            return item.mapFrom;
        };
    }
    return result;
}
