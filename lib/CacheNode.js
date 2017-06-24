"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CacheMap_1 = require("./CacheMap");
var CacheNode = (function () {
    function CacheNode(nodeId) {
        this.items = new CacheMap_1.default();
        this.id = nodeId;
    }
    return CacheNode;
}());
exports.CacheNode = CacheNode;
