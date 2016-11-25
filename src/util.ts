import { ICacheInstance } from './CacheInstance';
import { config, instances } from './cache';
import { CacheNode, ICacheNode } from './CacheNode';
import { getCurrentNode } from './locate';
declare let require: any;
const objectAssign = require('object-assign');

const toString: any = Object.prototype.toString;
var _hasOwnProperty = Object.prototype.hasOwnProperty;

export function isNumber(value) {
    return typeof value === 'number' || toString(value) === "[object Number]";
}

export function isString(obj) {
    return typeof obj === 'string' || toString(obj) === "[object String]";
}

/**
 * Checks if argument is an object
 * @param mixed_var
 * @returns {boolean}
 */
export function isObject(mixed_var) {
    if (Object.prototype.toString.call(mixed_var) === '[object Array]') {
        return false;
    }
    // javascript considers null to be an object so excluding null here
    // would cause all existing properties to be replaced by null
    // if such property existed and was null on the incoming object
    return mixed_var !== null && typeof mixed_var === 'object';
}

/**
 * checks if argument is an array
 */
export function isArray(value) {

    if (!value || value === null) {
        return false;
    }
    // Douglas Crockford JavascriptTheGoodParts pge.61
    // works across iFrames
    return Array.isArray(value) || (
        value && typeof value === 'object'
        && typeof value.length === 'number'
        && typeof value.splice === 'function'
        && !(value.propertyIsEnumerable('length'))
    );
}

/**
 *
 * @param o
 * @returns {string}
 */
function objToStr(o) {
    return Object.prototype.toString.call(o);
}

/**
 *
 * @param value
 * @returns {boolean}
 */
export function isDate(value) {
    return isObject(value) && objToStr(value) === '[object Date]';
}

export function isEmpty(value) {
    if (!value) {
        return true;
    }
    if (isArray(value) && value.length === 0) {
        return true;
    } else if (!isString(value)) {
        for (var i in value) {
            if (_hasOwnProperty.call(value, i)) {
                return false;
            }
        }
        return true;
    }
    return false;
}

/**
 * Creates a new cache node and adds it to the repo.
 *
 * @returns {*} a newly created cache node after adding it to the repo.
 */
export function getNewCacheNode(instance: ICacheInstance) {
    let node: ICacheNode = new CacheNode(instance.nextNodeKey)// getNewLengthObj();
    node.id = instance.nextNodeKey;
    instance.nextNodeKey += 1;
    instance.repo.add(node);
    return node;
}

export function hasUid(obj) {
    if (!obj) {
        return false;
    }
    if (!isObject(obj)) {
        return false;
    }
    if (typeof obj[config.uidName] === "undefined") {
        return false;
    }
    let uid = obj[config.uidName];
    return uid.length !== 0;
};

/**
 *
 * @param {Object} obj object to be cloned
 * @param {Object} uidReference optional uid entity to be replaced inside the item because of having been updated
 * @param freeze set to false if the items should not be frozen upon cloning = getEdit()
 * @param force
 * @returns {*}
 */
export function deepClone(obj, uidReference?, freeze = true) {
    if (!obj || (!isObject(obj) && !isArray(obj))) {
        return obj;
    }

    if (freeze === true && uidReference && !Object.isFrozen(uidReference)) {
        Object.freeze(uidReference);
    }

    // the uid reference is already cloned here - safe to return
    if (uidReference && hasUid(obj) && obj[config.uidName] === uidReference[config.uidName]) {
        return uidReference;
    }

    // shallow copy first
    let result = objectAssign({}, obj);
    for (let propName in obj) {
        // if (obj.hasOwnProperty(propName)) {
        let value = obj[propName];
        if (value) {
            if (isArray(value)) {
                result[propName] = deepCloneArray(value, uidReference, freeze);
            } else if (isDate(value)) {
                let date = new Date(value.getTime());
                if (freeze === true) {
                    Object.freeze(date);
                }
                result[propName] = date;
            } else if (isObject(value)) {
                if (hasUid(value)) {
                    result[propName] = value;
                    if (uidReference && hasUid(uidReference)) {
                        if (value !== uidReference
                            && value.uid === uidReference.uid
                            && value !== uidReference) {
                            result[propName] = uidReference;
                        }
                    } else {
                        // do nothing here - keep the uid reference - not editable
                        //result[propName] = deepClone(value);
                    }
                } else {
                    result[propName] = deepClone(value, uidReference, freeze);
                }
            } else {
                // functions and primitives
                result[propName] = value;
            }
        }
        // }
    }
    if (freeze === true && !Object.isFrozen(result)) {
        Object.freeze(result);
    }
    return result;
}

function deepCloneArray(arr, uidReference, freeze) {
    return arr.map(item => {
        if (isArray(item)) {
            return deepCloneArray(item, uidReference, freeze);
        } else if (isObject(item)) {
            // *** keep items inside clones as we're not editing them = must getEdit on item
            if (hasUid(item)) {
                if (uidReference && (item[config.uidName] === uidReference[config.uidName])) {
                    return uidReference;
                }
                return item;
            } else {
                return deepClone(item, uidReference, freeze);
            }
        } else {
            return item;
        }
    });
}

export const cacheSize = (instance: ICacheInstance): number => {
    let cacheNode = getCurrentNode(instance);
    return cacheNode ? cacheNode.items.size() : 0;
}

export const cacheLength = (instance: ICacheInstance): number => {
    return instance.thread.nodes.length;
}
