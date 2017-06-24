"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cache_1 = require("./cache");
var stringifyMap = function (map) {
    var result = '';
    map.forEach(function (key, item) {
        var itemResult = JSON.stringify(item, null, 2);
        result += itemResult + ',\n';
    });
    return result;
};
exports.printCache = function (instance) {
    var result = '';
    var index = 0;
    var current = instance.thread.current;
    var nodeIndices = instance.thread.nodes;
    nodeIndices.map(function (cacheNodeId) {
        var cacheNode = instance.repo.get(cacheNodeId);
        var streamData = '';
        var state = index + ":" + streamData + "[" + stringifyMap(cacheNode.items) + "]\n\n";
        if (index === current) {
            state = '-> ' + state;
        }
        result += state;
        index++;
    });
    result = result.substring(0, (result.length - 2));
    index = 0;
    return '\n------ One -------'
        + '\nSTACK:\n' + result
        + '\n\nCONFIG:' + JSON.stringify(cache_1.config, null, 2)
        + '\n\nREPO SIZE:' + instance.repo.length
        + '\n===================\n';
};
