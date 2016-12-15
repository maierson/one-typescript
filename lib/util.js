"use strict";
var cache_1 = require("./cache");
var CacheNode_1 = require("./CacheNode");
var locate_1 = require("./locate");
var objectAssign = require('object-assign');
var toString = Object.prototype.toString;
var _hasOwnProperty = Object.prototype.hasOwnProperty;
function isNumber(value) {
    return typeof value === 'number' || toString(value) === "[object Number]";
}
exports.isNumber = isNumber;
function isString(obj) {
    return typeof obj === 'string' || toString(obj) === "[object String]";
}
exports.isString = isString;
function isObject(mixed_var) {
    if (Object.prototype.toString.call(mixed_var) === '[object Array]') {
        return false;
    }
    return mixed_var !== null && typeof mixed_var === 'object';
}
exports.isObject = isObject;
function isFunction(item) {
    return typeof item === 'function';
}
exports.isFunction = isFunction;
function isArray(value) {
    if (!value || value === null) {
        return false;
    }
    return Array.isArray(value) || (value && typeof value === 'object'
        && typeof value.length === 'number'
        && typeof value.splice === 'function'
        && !(value.propertyIsEnumerable('length')));
}
exports.isArray = isArray;
function objToStr(o) {
    return Object.prototype.toString.call(o);
}
function isDate(value) {
    return isObject(value) && objToStr(value) === '[object Date]';
}
exports.isDate = isDate;
function isEmpty(value) {
    if (!value) {
        return true;
    }
    if (isArray(value) && value.length === 0) {
        return true;
    }
    else if (!isString(value)) {
        for (var i in value) {
            if (_hasOwnProperty.call(value, i)) {
                return false;
            }
        }
        return true;
    }
    return false;
}
exports.isEmpty = isEmpty;
function getNewCacheNode(instance) {
    var node = new CacheNode_1.CacheNode(instance.nextNodeKey);
    node.id = instance.nextNodeKey;
    instance.nextNodeKey += 1;
    instance.repo.add(node);
    return node;
}
exports.getNewCacheNode = getNewCacheNode;
function hasUid(obj) {
    if (!obj) {
        return false;
    }
    if (!isObject(obj)) {
        return false;
    }
    if (typeof obj[cache_1.config.uidName] === "undefined") {
        return false;
    }
    var uid = obj[cache_1.config.uidName];
    return uid.length !== 0;
}
exports.hasUid = hasUid;
;
Function.prototype.clone = function (target) {
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var ARGUMENT_NAMES = /([^\s,]+)/g;
    function getParamNames(func) {
        var fnStr = func.toString().replace(STRIP_COMMENTS, '');
        var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
        if (result === null)
            result = [];
        return result;
    }
    var stringify = this.toString();
    stringify = stringify.replace(new RegExp('_this', 'g'), 'this');
    var body = stringify.match(/function[^{]+\{([\s\S]*)\}$/)[1];
    var paramNames = getParamNames(this);
    var func = new Function(paramNames, body);
    return func.bind(target);
};
function deepClone(obj, uidReference, freeze) {
    if (freeze === void 0) { freeze = true; }
    if (!obj
        || (!isObject(obj)
            && !isArray(obj))) {
        return obj;
    }
    if (freeze === true
        && uidReference
        && !Object.isFrozen(uidReference)) {
        Object.freeze(uidReference);
    }
    if (uidReference
        && hasUid(obj)
        && obj[cache_1.config.uidName] === uidReference[cache_1.config.uidName]) {
        return uidReference;
    }
    var result = objectAssign({}, obj);
    for (var propName in obj) {
        var value = obj[propName];
        if (value) {
            if (isArray(value)) {
                result[propName] = deepCloneArray(value, uidReference, freeze);
            }
            else if (isDate(value)) {
                var date = new Date(value.getTime());
                if (freeze === true) {
                    Object.freeze(date);
                }
                result[propName] = date;
            }
            else if (isObject(value)) {
                if (hasUid(value)) {
                    result[propName] = value;
                    if (uidReference && hasUid(uidReference)) {
                        if (value !== uidReference
                            && value.uid === uidReference.uid
                            && value !== uidReference) {
                            result[propName] = uidReference;
                        }
                    }
                    else {
                    }
                }
                else {
                    result[propName] = deepClone(value, uidReference, freeze);
                }
            }
            else if (isFunction(value)) {
                if (propName !== 'constructor') {
                    result[propName] = value.clone(result);
                }
            }
            else {
                result[propName] = value;
            }
        }
    }
    if (freeze === true
        && !Object.isFrozen(result)
        && typeof result !== 'function') {
        Object.freeze(result);
    }
    return result;
}
exports.deepClone = deepClone;
function deepCloneArray(arr, uidReference, freeze) {
    return arr.map(function (item) {
        if (isArray(item)) {
            return deepCloneArray(item, uidReference, freeze);
        }
        else if (isObject(item)) {
            if (hasUid(item)) {
                if (uidReference && (item[cache_1.config.uidName] === uidReference[cache_1.config.uidName])) {
                    return uidReference;
                }
                return item;
            }
            else {
                return deepClone(item, uidReference, freeze);
            }
        }
        else {
            return item;
        }
    });
}
exports.cacheSize = function (instance) {
    var cacheNode = locate_1.getCurrentNode(instance);
    return cacheNode ? cacheNode.items.size() : 0;
};
exports.cacheLength = function (instance) {
    return instance.thread.nodes.length;
};
