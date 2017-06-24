"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
exports.getCallStats = function (success, instance) {
    var result = {};
    result.success = success;
    result.nodeId = exports.node(instance);
    result.length = length(instance);
    result.name = instance.name;
    return result;
};
exports.node = function (instance, nodeId) {
    if (typeof nodeId === 'undefined') {
        var currentNode = getCurrentNode(instance);
        return currentNode ? currentNode.id : -1;
    }
    if (!util_1.isNumber(nodeId)) {
        throw new TypeError('The node id must be a number.');
    }
    var cacheNode = getRepoNode(nodeId, instance);
    if (!cacheNode) {
        return exports.getCallStats(false, instance);
    }
    instance.thread.current = binaryIndexOf(instance.thread.nodes, nodeId);
    return exports.getCallStats(true, instance);
};
function getCurrentNode(instance) {
    var currentNodeId = instance.thread.nodes[instance.thread.current];
    return currentNodeId >= 0 ? getRepoNode(currentNodeId, instance) : undefined;
}
exports.getCurrentNode = getCurrentNode;
function getRepoNode(cacheNodeId, instance) {
    return instance.repo.get(cacheNodeId);
}
exports.getRepoNode = getRepoNode;
var length = function (instance) { return instance.thread.nodes.length; };
function binaryIndexOf(array, searchElement) {
    var minIndex = 0;
    var maxIndex = array.length - 1;
    var currentIndex;
    var currentElement;
    while (minIndex <= maxIndex) {
        currentIndex = (minIndex + maxIndex) / 2 | 0;
        currentElement = array[currentIndex];
        if (currentElement < searchElement) {
            minIndex = currentIndex + 1;
        }
        else if (currentElement > searchElement) {
            maxIndex = currentIndex - 1;
        }
        else {
            return currentIndex;
        }
    }
}
