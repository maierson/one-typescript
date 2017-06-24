"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
function getKey(key) {
    var intKey = parseInt(key);
    if (intKey.toString() === key) {
        return intKey;
    }
    return key;
}
function del(obj, path) {
    if (util_1.isNumber(path)) {
        path = [path];
    }
    if (util_1.isEmpty(obj)) {
        return void 0;
    }
    if (util_1.isEmpty(path)) {
        return obj;
    }
    if (util_1.isString(path)) {
        return del(obj, path.split('.'));
    }
    var currentPath = getKey(path[0]);
    var oldVal = obj[currentPath];
    if (path.length === 1) {
        if (oldVal !== void 0) {
            if (util_1.isArray(obj)) {
                obj.splice(currentPath, 1);
            }
            else {
                delete obj[currentPath];
            }
        }
    }
    else {
        if (obj[currentPath] !== void 0) {
            return del(obj[currentPath], path.slice(1));
        }
    }
    return obj;
}
exports.del = del;
function get(obj, path, defaultValue) {
    if (util_1.isNumber(path)) {
        path = [path];
    }
    if (util_1.isEmpty(path)) {
        return obj;
    }
    if (util_1.isEmpty(obj)) {
        return defaultValue;
    }
    if (util_1.isString(path)) {
        return get(obj, path.split('.'), defaultValue);
    }
    var currentPath = getKey(path[0]);
    if (path.length === 1) {
        if (obj[currentPath] === void 0) {
            return defaultValue;
        }
        return obj[currentPath];
    }
    return get(obj[currentPath], path.slice(1), defaultValue);
}
exports.get = get;
