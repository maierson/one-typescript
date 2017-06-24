"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cache_1 = require("./cache");
exports.evict = cache_1.evict;
exports.get = cache_1.get;
exports.getCache = cache_1.getCache;
exports.getEdit = cache_1.getEdit;
exports.print = cache_1.print;
exports.put = cache_1.put;
exports.reset = cache_1.reset;
exports.uuid = cache_1.uuid;
(function () {
    if (typeof window !== 'undefined' && window !== null) {
        window.One = {
            getCache: cache_1.getCache,
            put: cache_1.put,
            get: cache_1.get,
            getEdit: cache_1.getEdit,
            evict: cache_1.evict,
            reset: cache_1.reset,
            uuid: cache_1.uuid,
            print: cache_1.print,
        };
    }
})();
