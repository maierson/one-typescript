"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CacheMap_1 = require("./CacheMap");
var CacheRepo = (function () {
    function CacheRepo() {
        var _this = this;
        this.items = new CacheMap_1.default();
        this.length = 0;
        this.get = function (nodeId) { return (_this.items.get(nodeId)); };
        this.add = function (node) {
            if (!_this.items.has(node.id)) {
                _this.items.set(node.id, node);
                _this.length++;
                return true;
            }
            return false;
        };
        this.delete = function (nodeId) {
            if (_this.items.has(nodeId)) {
                _this.items.delete(nodeId);
                _this.length--;
            }
        };
    }
    return CacheRepo;
}());
exports.default = CacheRepo;
