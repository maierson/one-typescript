"use strict";
var objectAssign = require('object-assign');
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
            var newInstance = objectAssign({}, _this.paths);
            var clone = new CacheMap();
            clone.paths = newInstance;
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
