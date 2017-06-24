"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CacheMap_1 = require("./CacheMap");
var CacheItem = (function () {
    function CacheItem(entity, liveItem) {
        var _this = this;
        this.clone = function () { return new CacheItem(_this.entity, _this); };
        this.entity = entity;
        if (liveItem) {
            this.mapFrom = liveItem.mapFrom.clone();
            this.mapTo = liveItem.mapTo.clone();
        }
        else {
            this.mapFrom = new CacheMap_1.default();
            this.mapTo = new CacheMap_1.default();
        }
    }
    return CacheItem;
}());
exports.default = CacheItem;
