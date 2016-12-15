"use strict";
var cache_1 = require("./cache");
exports.getCache = cache_1.getCache;
exports.put = cache_1.put;
exports.get = cache_1.get;
exports.getEdit = cache_1.getEdit;
exports.evict = cache_1.evict;
exports.reset = cache_1.reset;
exports.uuid = cache_1.uuid;
exports.print = cache_1.print;
(function () {
    if (window) {
        window.One = {
            getCache: cache_1.getCache, put: cache_1.put, get: cache_1.get, getEdit: cache_1.getEdit, evict: cache_1.evict, reset: cache_1.reset, uuid: cache_1.uuid, print: cache_1.print
        };
    }
})();
