"use strict";
var CacheThread = (function () {
    function CacheThread() {
        var _this = this;
        this.current = -1;
        this.nodes = [];
        this.addNode = function (nodeId) {
            _this.nodes.push(nodeId);
            _this.current++;
        };
    }
    return CacheThread;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CacheThread;
