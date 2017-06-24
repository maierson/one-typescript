"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CacheRepo_1 = require("./CacheRepo");
var CacheThread_1 = require("./CacheThread");
var CacheInstance = (function () {
    function CacheInstance(name) {
        var _this = this;
        this.repo = new CacheRepo_1.default();
        this.thread = new CacheThread_1.default();
        this.nextNodeKey = 0;
        this.reset = function () {
            _this.repo = new CacheRepo_1.default();
            _this.thread = new CacheThread_1.default();
            _this.nextNodeKey = 0;
        };
        this.addNode = function (node) {
            if (_this.repo.add(node)) {
                _this.thread.addNode(node.id);
                _this.nextNodeKey++;
                return true;
            }
            return false;
        };
        this.length = function () { return _this.thread.nodes.length; };
        this.size = function () { return _this.repo.length; };
        this.name = name;
    }
    return CacheInstance;
}());
exports.default = CacheInstance;
