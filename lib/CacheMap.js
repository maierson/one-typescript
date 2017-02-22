"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var CacheMap = (function () {
    function CacheMap() {
        var _this = this;
        this.paths = {};
        this.length = 0;
        this.get = function (key) {
            return _this.paths[key];
        };
        this.delete = function (key) {
            if (typeof _this.paths[key] !== "undefined" && _this.length > 0) {
                var val = _this.paths[key];
                delete _this.paths[key];
                _this.length--;
                return val;
            }
        };
        this.has = function (key) {
            return typeof _this.paths[key] !== 'undefined';
        };
        this.forEach = function (callback) {
            for (var key in _this.paths) {
                if (_this.paths.hasOwnProperty(key)) {
                    callback(key, _this.paths[key]);
                }
            }
        };
        this.clone = function () {
            var clone = new CacheMap();
            clone.paths = __assign({}, _this.paths);
            clone.length = _this.length;
            return clone;
        };
    }
    CacheMap.prototype.set = function (key, value) {
        if (typeof this.paths[key] === "undefined") {
            this.length++;
            this.paths[key] = value;
            return true;
        }
        this.paths[key] = value;
        return false;
    };
    CacheMap.prototype.size = function () {
        return this.length;
    };
    return CacheMap;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CacheMap;
