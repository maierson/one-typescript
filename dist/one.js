/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var cache_1 = __webpack_require__(1);
	exports.getCache = cache_1.getCache;
	exports.put = cache_1.put;
	exports.get = cache_1.get;
	exports.getEdit = cache_1.getEdit;
	exports.evict = cache_1.evict;
	exports.reset = cache_1.reset;
	exports.uuid = cache_1.uuid;
	exports.print = cache_1.print;
	(function () {
	    if (typeof window !== 'undefined' && window !== null) {
	        window.One = {
	            getCache: cache_1.getCache,
	            put: cache_1.put,
	            get: cache_1.get,
	            getEdit: cache_1.getEdit,
	            evict: cache_1.evict,
	            reset: cache_1.reset,
	            uuid: cache_1.uuid,
	            print: cache_1.print
	        };
	    }
	})();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var config_1 = __webpack_require__(2);
	var put_1 = __webpack_require__(3);
	var print_1 = __webpack_require__(14);
	var CacheInstance_1 = __webpack_require__(15);
	var util_1 = __webpack_require__(6);
	var get_1 = __webpack_require__(18);
	var evict_1 = __webpack_require__(19);
	var cacheUtil_1 = __webpack_require__(10);
	exports.instances = {};
	var cacheTest = false;
	function setTesting(testing) {
	    cacheTest = testing;
	}
	exports.setTesting = setTesting;
	function getCache(instanceName, configuration) {
	    if (instanceName === void 0) {
	        instanceName = "one";
	    }
	    if (configuration === void 0) {
	        configuration = config_1.defaultConfig;
	    }
	    if (!exports.config) {
	        exports.config = config_1.configure(configuration);
	    }
	    if (!exports.instances[instanceName]) {
	        exports.instances[instanceName] = createCache(instanceName);
	    }
	    if (typeof window !== 'undefined' && window !== null && window[instanceName] === undefined) {
	        window[instanceName] = exports.instances[instanceName];
	    }
	    return exports.instances[instanceName];
	}
	exports.getCache = getCache;
	exports.put = function (item) {
	    getCache().put(item);
	};
	exports.get = function (entity, nodeId) {
	    return getCache().get(entity, nodeId);
	};
	exports.getEdit = function (uidOrEntityOrArray, nodeId) {
	    return getCache().getEdit(uidOrEntityOrArray, nodeId);
	};
	exports.evict = function (uidOrEntityOrArray) {
	    return getCache().evict(uidOrEntityOrArray);
	};
	exports.print = function () {
	    return getCache().print();
	};
	exports.reset = function () {
	    getCache().reset();
	};
	exports.uuid = function () {
	    var lut = [];
	    for (var i = 0; i < 256; i++) {
	        lut[i] = (i < 16 ? '0' : '') + i.toString(16);
	    }
	    var d0 = Math.random() * 0x100000000 | 0;
	    var d1 = Math.random() * 0x100000000 | 0;
	    var d2 = Math.random() * 0x100000000 | 0;
	    var d3 = Math.random() * 0x100000000 | 0;
	    return lut[d0 & 0xFF] + lut[d0 >> 8 & 0xFF] + lut[d0 >> 16 & 0xFF] + lut[d0 >> 24 & 0xFF] + '-' + lut[d1 & 0xFF] + lut[d1 >> 8 & 0xFF] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xFF] + '-' + lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xFF] + '-' + lut[d2 >> 16 & 0xFF] + lut[d2 >> 24 & 0xFF] + lut[d3 & 0xFF] + lut[d3 >> 8 & 0xFF] + lut[d3 >> 16 & 0xFF] + lut[d3 >> 24 & 0xFF];
	};
	function createCache(name) {
	    var instance = new CacheInstance_1.default(name);
	    var reset = function () {
	        instance.reset();
	    };
	    var put = function (item) {
	        return put_1.putItem(item, instance);
	    };
	    var get = function (entity, nodeId) {
	        return get_1.getItem(entity, instance, nodeId);
	    };
	    var getEdit = function (uidOrEntityOrArray, nodeId) {
	        return get_1.getEditItem(uidOrEntityOrArray, instance, nodeId);
	    };
	    var evict = function (uidOrEntityOrArray) {
	        return evict_1.evictItem(uidOrEntityOrArray, instance);
	    };
	    var size = function () {
	        return util_1.cacheSize(instance);
	    };
	    var length = function () {
	        return util_1.cacheLength(instance);
	    };
	    var print = function () {
	        return print_1.printCache(instance);
	    };
	    var result = {
	        put: put,
	        get: get,
	        getEdit: getEdit,
	        evict: evict,
	        reset: reset,
	        size: size,
	        length: length,
	        print: print
	    };
	    if (cacheTest === true) {
	        result.refTo = function (uid) {
	            var item = cacheUtil_1.getCachedItem(uid, instance);
	            return item.mapTo;
	        };
	        result.refFrom = function (uid) {
	            var item = cacheUtil_1.getCachedItem(uid, instance);
	            return item.mapFrom;
	        };
	    }
	    return result;
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	exports.defaultConfig = {
	    uidName: "uid",
	    maxHistoryStates: 1000
	};
	function configure(conf) {
	    for (var p in exports.defaultConfig) {
	        if (exports.defaultConfig.hasOwnProperty(p) && conf.hasOwnProperty(p)) {
	            exports.defaultConfig[p] = conf[p];
	        }
	    }
	    return exports.defaultConfig;
	}
	exports.configure = configure;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var CacheMap_1 = __webpack_require__(4);
	var locate_1 = __webpack_require__(5);
	var util_1 = __webpack_require__(6);
	var ref_1 = __webpack_require__(8);
	var flush_1 = __webpack_require__(12);
	var parse_1 = __webpack_require__(13);
	exports.putItem = function (entity, instance) {
	    if (util_1.isArray(entity) || util_1.isObject(entity)) {
	        var evictMap = new CacheMap_1.default();
	        var flushMap = new CacheMap_1.default();
	        flushMap['__UPDATED__'] = false;
	        var flushArgs = {
	            flushMap: flushMap,
	            evictMap: evictMap,
	            instance: instance
	        };
	        parse_1.parse(entity, flushArgs);
	        ref_1.updatePointers(flushArgs);
	        if (flushArgs.flushMap.size() > 0) {
	            flush_1.preFlush(flushArgs, instance);
	            return locate_1.getCallStats(true, instance);
	        }
	    }
	    return locate_1.getCallStats(false, instance);
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	var __assign = this && this.__assign || Object.assign || function (t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	    }
	    return t;
	};
	var CacheMap = function () {
	    function CacheMap() {
	        var _this = this;
	        this.paths = {};
	        this.length = 0;
	        this.get = function (key) {
	            return _this.paths[key];
	        };
	        this.delete = function (key) {
	            if (typeof _this.paths[key] !== "undefined" && _this.length > 0) {
	                var val = _this.paths[key];
	                delete _this.paths[key];
	                _this.length--;
	                return val;
	            }
	        };
	        this.has = function (key) {
	            return typeof _this.paths[key] !== 'undefined';
	        };
	        this.forEach = function (callback) {
	            for (var key in _this.paths) {
	                if (_this.paths.hasOwnProperty(key)) {
	                    callback(key, _this.paths[key]);
	                }
	            }
	        };
	        this.clone = function () {
	            var clone = new CacheMap();
	            clone.paths = __assign({}, _this.paths);
	            clone.length = _this.length;
	            return clone;
	        };
	    }
	    CacheMap.prototype.set = function (key, value) {
	        if (typeof this.paths[key] === "undefined") {
	            this.length++;
	            this.paths[key] = value;
	            return true;
	        }
	        this.paths[key] = value;
	        return false;
	    };
	    CacheMap.prototype.size = function () {
	        return this.length;
	    };
	    return CacheMap;
	}();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = CacheMap;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var util_1 = __webpack_require__(6);
	exports.getCallStats = function (success, instance) {
	    var result = {};
	    result.success = success;
	    result.nodeId = exports.node(instance);
	    result.length = length(instance);
	    result.name = instance.name;
	    return result;
	};
	exports.node = function (instance, nodeId) {
	    if (typeof nodeId === "undefined") {
	        var currentNode = getCurrentNode(instance);
	        return currentNode ? currentNode.id : -1;
	    }
	    if (!util_1.isNumber(nodeId)) {
	        throw new TypeError("The node id must be a number.");
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
	var length = function (instance) {
	    return instance.thread.nodes.length;
	};
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
	        } else if (currentElement > searchElement) {
	            maxIndex = currentIndex - 1;
	        } else {
	            return currentIndex;
	        }
	    }
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var __assign = this && this.__assign || Object.assign || function (t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	    }
	    return t;
	};
	var CacheNode_1 = __webpack_require__(7);
	var cache_1 = __webpack_require__(1);
	var locate_1 = __webpack_require__(5);
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
	    return Array.isArray(value) || value && typeof value === 'object' && typeof value.length === 'number' && typeof value.splice === 'function' && !value.propertyIsEnumerable('length');
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
	        if (result === null) result = [];
	        return result;
	    }
	    var stringify = this.toString();
	    stringify = stringify.replace(new RegExp('_this', 'g'), 'this');
	    var body = stringify.match(/function[^{]+\{([\s\S]*)\}$/)[1];
	    body = body.trim();
	    var paramNames = getParamNames(this);
	    var func;
	    if (body.indexOf('native code') < 0) {
	        func = Function(paramNames, body);
	        func = func.bind(target);
	    }
	    return func;
	};
	function deepClone(obj, uidReference, freeze) {
	    if (freeze === void 0) {
	        freeze = true;
	    }
	    if (!obj || !isObject(obj) && !isArray(obj)) {
	        return obj;
	    }
	    if (freeze === true && uidReference && !Object.isFrozen(uidReference)) {
	        Object.freeze(uidReference);
	    }
	    if (uidReference && hasUid(obj) && obj[cache_1.config.uidName] === uidReference[cache_1.config.uidName]) {
	        return uidReference;
	    }
	    var result = __assign({}, obj);
	    for (var propName in obj) {
	        var value = obj[propName];
	        if (value) {
	            if (isArray(value)) {
	                result[propName] = deepCloneArray(value, uidReference, freeze);
	            } else if (isDate(value)) {
	                var date = new Date(value.getTime());
	                if (freeze === true) {
	                    Object.freeze(date);
	                }
	                result[propName] = date;
	            } else if (isObject(value)) {
	                if (hasUid(value)) {
	                    result[propName] = value;
	                    if (uidReference && hasUid(uidReference)) {
	                        if (value !== uidReference && value.uid === uidReference.uid && value !== uidReference) {
	                            result[propName] = uidReference;
	                        }
	                    } else {}
	                } else {
	                    result[propName] = deepClone(value, uidReference, freeze);
	                }
	            } else if (isFunction(value)) {
	                if (propName !== 'constructor') {
	                    result[propName] = value.clone(result);
	                }
	            } else {
	                result[propName] = value;
	            }
	        }
	    }
	    if (freeze === true && !Object.isFrozen(result) && typeof result !== 'function') {
	        Object.freeze(result);
	    }
	    return result;
	}
	exports.deepClone = deepClone;
	function deepCloneArray(arr, uidReference, freeze) {
	    return arr.map(function (item) {
	        if (isArray(item)) {
	            return deepCloneArray(item, uidReference, freeze);
	        } else if (isObject(item)) {
	            if (hasUid(item)) {
	                if (uidReference && item[cache_1.config.uidName] === uidReference[cache_1.config.uidName]) {
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
	exports.cacheSize = function (instance) {
	    var cacheNode = locate_1.getCurrentNode(instance);
	    return cacheNode ? cacheNode.items.size() : 0;
	};
	exports.cacheLength = function (instance) {
	    return instance.thread.nodes.length;
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var CacheMap_1 = __webpack_require__(4);
	var CacheNode = function () {
	    function CacheNode(nodeId) {
	        this.items = new CacheMap_1.default();
	        this.id = nodeId;
	    }
	    return CacheNode;
	}();
	exports.CacheNode = CacheNode;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var cache_1 = __webpack_require__(1);
	var opath = __webpack_require__(9);
	var util_1 = __webpack_require__(6);
	var cacheUtil_1 = __webpack_require__(10);
	exports.assignRefToParent = function (refItem, parentUid, path, flushArgs) {
	    if (parentUid) {
	        var parentItem = cacheUtil_1.getItemFlushOrCached(parentUid, flushArgs);
	        if (parentItem && path.length > 0) {
	            assignRefs(parentItem, refItem, path);
	        }
	    }
	};
	var assignRefs = function (parentItem, refItem, path) {
	    var parentUid = parentItem.entity[cache_1.config.uidName];
	    var refUid = refItem.entity[cache_1.config.uidName];
	    var refPath = path.join('.');
	    addRefTo(parentItem, refUid, refPath);
	    addRefFrom(refItem, parentUid, refPath);
	};
	var addRefTo = function (parentItem, refUid, path) {
	    if (parentItem.mapTo.has(refUid) === false) {
	        parentItem.mapTo.set(refUid, []);
	    }
	    var refArray = parentItem.mapTo.get(refUid);
	    if (refArray.indexOf(path) < 0) {
	        refArray.push(path);
	    }
	    return parentItem;
	};
	var addRefFrom = function (refItem, parentUid, path) {
	    if (refItem.mapFrom.has(parentUid) === false) {
	        refItem.mapFrom.set(parentUid, []);
	    }
	    var fromArray = refItem.mapFrom.get(parentUid);
	    if (fromArray.indexOf(path) < 0) {
	        fromArray.push(path);
	    }
	    return refItem;
	};
	exports.updatePointers = function (flushArgs) {
	    flushArgs.flushMap.forEach(function (key, item) {
	        updateItemRefTos(item, flushArgs);
	        exports.updateRefFroms(item, flushArgs);
	    });
	};
	exports.updateRefFroms = function (item, flushArgs) {
	    if (item.mapFrom.length > 0) {
	        item.mapFrom.forEach(function (parentUid, paths) {
	            var parentItem = flushArgs.flushMap.get(parentUid);
	            if (!parentItem) {
	                parentItem = cacheUtil_1.getCachedItem(parentUid, flushArgs.instance);
	            }
	            if (parentItem && paths.length > 0) {
	                var firstPath = paths[0];
	                var targetRef = opath.get(parentItem.entity, firstPath);
	                if (targetRef && targetRef !== item.entity) {
	                    var args = {
	                        flushMap: flushArgs.flushMap,
	                        instance: flushArgs.instance
	                    };
	                    parentItem = cacheUtil_1.ensureItem(parentItem.entity, args);
	                    parentItem.entity = util_1.deepClone(parentItem.entity, item.entity, true);
	                }
	            }
	        });
	    }
	};
	exports.updateRefTos = function (entityUid, flushArgs) {
	    var item = cacheUtil_1.getItemFlushOrCached(entityUid, flushArgs);
	    updateItemRefTos(item, flushArgs);
	};
	var updateItemRefTos = function (item, flushArgs) {
	    if (!item || !item.mapTo) return;
	    item.mapTo.forEach(function (toUid, paths) {
	        var updatedPaths = paths.filter(function (path) {
	            var reference = opath.get(item.entity, path);
	            var hasRef = reference && String(reference[cache_1.config.uidName]) === String(toUid);
	            if (!hasRef) removeRefFrom_Value(item.entity[cache_1.config.uidName], toUid, flushArgs, path);
	            return hasRef;
	        });
	        if (updatedPaths.length > 0) {
	            item.mapTo.set(toUid, updatedPaths);
	        } else {
	            item.mapTo.delete(toUid);
	        }
	    });
	};
	var removeRefFrom_Value = function (parentUid, refUid, flushArgs, path) {
	    var refItem = cacheUtil_1.getItemFlushOrCached(refUid, flushArgs);
	    if (refItem) {
	        refItem = refItem.clone();
	        if (refItem.mapFrom.has(parentUid)) {
	            removeRefFrom(refItem, parentUid, path);
	            if (refItem.mapFrom.size() === 0) {
	                flushArgs.evictMap.set(refUid, refItem);
	                flushArgs.flushMap.delete(refUid);
	            } else {
	                flushArgs.flushMap.set(refUid, refItem);
	                flushArgs.evictMap.delete(refUid);
	            }
	        }
	    }
	};
	var removeRefFrom = function (item, parentUid, path) {
	    var refsArray = item.mapFrom.get(parentUid);
	    var index = refsArray.indexOf(path);
	    refsArray = refsArray.slice();
	    refsArray.splice(index, 1);
	    item.mapFrom.set(parentUid, refsArray);
	    if (refsArray.length == 0) {
	        item.mapFrom.delete(parentUid);
	    }
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var util_1 = __webpack_require__(6);
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
	            } else {
	                delete obj[currentPath];
	            }
	        }
	    } else {
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

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var CacheItem_1 = __webpack_require__(11);
	var cache_1 = __webpack_require__(1);
	exports.isOnCache = function (entity, instance) {
	    var cachedItem = exports.getCachedItem(entity[cache_1.config.uidName], instance);
	    return cachedItem && cachedItem.entity === entity;
	};
	exports.isOnFlushMap = function (entity, flushMap) {
	    return !!flushMap.get(entity[cache_1.config.uid]);
	};
	exports.getCachedItem = function (uid, instance) {
	    var currentNode = getCurrentNode(instance);
	    return currentNode ? currentNode.items.get(String(uid)) : undefined;
	};
	exports.getItemFlushOrCached = function (uid, flushArgs) {
	    if (uid) {
	        uid = String(uid);
	        var item = flushArgs.flushMap.get(uid);
	        if (!item) {
	            item = exports.getCachedItem(uid, flushArgs.instance);
	        }
	        if (item && Object.isFrozen(item)) {
	            item = item.clone();
	        }
	        return item;
	    }
	};
	function getCurrentNode(instance) {
	    var currentNodeId = instance.thread.nodes[instance.thread.current];
	    return currentNodeId >= 0 ? getRepoNode(currentNodeId, instance.repo) : undefined;
	}
	function getRepoNode(nodeId, repo) {
	    return repo.get(nodeId);
	}
	exports.getCacheCurrentStack = function (instance) {
	    var currentNode = getCurrentNode(instance);
	    return currentNode ? currentNode.items : undefined;
	};
	exports.ensureOnFlushMap = function (entity, flushArgs) {
	    var entityUid = String(entity[cache_1.config.uidName]);
	    if (!flushArgs.flushMap.has(entityUid)) {
	        exports.ensureItem(entity, flushArgs);
	    }
	};
	exports.ensureItem = function (entity, flushArgs) {
	    var itemUid = String(entity[cache_1.config.uidName]);
	    var item = flushArgs.flushMap.get(itemUid);
	    if (item) {
	        return item;
	    }
	    var live = exports.getCachedItem(itemUid, flushArgs.instance);
	    item = new CacheItem_1.default(entity, live);
	    flushArgs.flushMap.set(itemUid, item);
	    flushArgs.flushMap['__UPDATED__'] = true;
	    return item;
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var CacheMap_1 = __webpack_require__(4);
	var CacheItem = function () {
	    function CacheItem(entity, liveItem) {
	        var _this = this;
	        this.clone = function () {
	            return new CacheItem(_this.entity, _this);
	        };
	        this.entity = entity;
	        if (liveItem) {
	            this.mapFrom = liveItem.mapFrom.clone();
	            this.mapTo = liveItem.mapTo.clone();
	        } else {
	            this.mapFrom = new CacheMap_1.default();
	            this.mapTo = new CacheMap_1.default();
	        }
	    }
	    return CacheItem;
	}();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = CacheItem;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var CacheMap_1 = __webpack_require__(4);
	var cacheUtil_1 = __webpack_require__(10);
	var cache_1 = __webpack_require__(1);
	var util_1 = __webpack_require__(6);
	exports.preFlush = function (flushArgs, instance) {
	    var temp = new CacheMap_1.default();
	    var currentStack = cacheUtil_1.getCacheCurrentStack(instance);
	    if (currentStack) {
	        currentStack.forEach(function (key, item) {
	            temp.set(key, item);
	        });
	    }
	    flushArgs.flushMap.forEach(function (key, item) {
	        var itemUid = item.entity[cache_1.config.uidName];
	        _freezeItem(item);
	        temp.set(String(itemUid), item);
	    });
	    if (flushArgs.evictMap.size() > 0) {
	        flushArgs.evictMap.forEach(function (key, value) {
	            temp.delete(String(key));
	        });
	    }
	    exports.flush(temp, instance);
	};
	var _freezeItem = function (item) {
	    Object.freeze(item);
	    Object.freeze(item.entity);
	    Object.freeze(item.mapTo);
	    Object.freeze(item.mapFrom);
	};
	exports.flush = function (temp, instance) {
	    if (temp !== null) {
	        Object.freeze(temp);
	        var cacheNode = util_1.getNewCacheNode(instance);
	        cacheNode.items = temp;
	        if (instance.thread.nodes.indexOf(cacheNode.id) < 0) {
	            instance.thread.nodes.push(cacheNode.id);
	            instance.thread.current += 1;
	        }
	    }
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var util_1 = __webpack_require__(6);
	var cacheUtil_1 = __webpack_require__(10);
	var ref_1 = __webpack_require__(8);
	var cache_1 = __webpack_require__(1);
	exports.parse = function (entity, flushArgs) {
	    if (util_1.hasUid(entity)) {
	        if (cacheUtil_1.isOnCache(entity, flushArgs.instance)) return;
	        _addToFlushMap(entity, flushArgs);
	    } else {
	        if (util_1.isArray(entity)) {
	            _parseArray(entity, null, [], flushArgs);
	        } else if (util_1.isObject(entity)) {
	            _parseObject(entity, null, [], flushArgs);
	        }
	    }
	};
	var _addToFlushMap = function (entity, flushArgs) {
	    cacheUtil_1.ensureOnFlushMap(entity, flushArgs);
	    _parseEntity(entity, entity[cache_1.config.uidName], [], flushArgs);
	    ref_1.updateRefTos(String(entity[cache_1.config.uidName]), flushArgs);
	};
	var _parseEntity = function (entity, parentUid, path, flushArgs) {
	    if (path === void 0) {
	        path = [];
	    }
	    for (var key in entity) {
	        if (entity.hasOwnProperty(key)) {
	            var ref = entity[key];
	            if (util_1.isArray(ref)) {
	                _parseArray(ref, parentUid, path.concat([key]), flushArgs);
	            } else if (util_1.isObject(ref)) {
	                _parseObject(ref, parentUid, path.concat([key]), flushArgs);
	            }
	            Object.freeze(ref);
	        }
	    }
	};
	var _parseArray = function (arr, parentUid, path, flushArgs) {
	    if (path === void 0) {
	        path = [];
	    }
	    arr.forEach(function (item, index) {
	        if (util_1.isArray(item)) {
	            _parseArray(item, parentUid, path.concat([index]), flushArgs);
	        } else if (util_1.isObject(item)) {
	            _parseObject(item, parentUid, path.concat([index]), flushArgs);
	        }
	    });
	};
	var _parseObject = function (obj, parentUid, path, flushArgs) {
	    if (util_1.hasUid(obj)) {
	        _cacheUidObj(obj, parentUid, path, flushArgs);
	    } else {
	        _parseEntity(obj, parentUid, path, flushArgs);
	    }
	};
	var _cacheUidObj = function (entity, parentUid, path, flushArgs) {
	    var item = cacheUtil_1.ensureItem(entity, flushArgs);
	    if (parentUid) ref_1.assignRefToParent(item, parentUid, path, flushArgs);
	    if (cacheUtil_1.isOnCache(entity, flushArgs.instance) || cacheUtil_1.isOnFlushMap(entity, flushArgs.flushMap)) return;
	    exports.parse(entity, flushArgs);
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var cache_1 = __webpack_require__(1);
	exports.printCache = function (instance) {
	    var result = "";
	    var index = 0;
	    var current = instance.thread.current;
	    var nodeIndices = instance.thread.nodes;
	    nodeIndices.map(function (cacheNodeId) {
	        var cacheNode = instance.repo.get(cacheNodeId);
	        var streamData = "";
	        var state = index + ":" + streamData + "[" + stringifyMap(cacheNode.items) + "]\n\n";
	        if (index === current) {
	            state = "-> " + state;
	        }
	        result += state;
	        index++;
	    });
	    result = result.substring(0, result.length - 2);
	    index = 0;
	    return "\n------ One -------" + "\nSTACK:\n" + result + "\n\nCONFIG:" + JSON.stringify(cache_1.config, null, 2) + "\n\nREPO SIZE:" + instance.repo.length + "\n===================\n";
	};
	var stringifyMap = function (map) {
	    var result = "";
	    map.forEach(function (key, item) {
	        var itemResult = JSON.stringify(item, null, 2);
	        result += itemResult + ",\n";
	    });
	    return result;
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var CacheRepo_1 = __webpack_require__(16);
	var CacheThread_1 = __webpack_require__(17);
	var CacheInstance = function () {
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
	        this.length = function () {
	            return _this.thread.nodes.length;
	        };
	        this.size = function () {
	            return _this.repo.length;
	        };
	        this.name = name;
	    }
	    return CacheInstance;
	}();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = CacheInstance;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var CacheMap_1 = __webpack_require__(4);
	var CacheRepo = function () {
	    function CacheRepo() {
	        var _this = this;
	        this.items = new CacheMap_1.default();
	        this.length = 0;
	        this.get = function (nodeId) {
	            return _this.items.get(nodeId);
	        };
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
	}();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = CacheRepo;

/***/ },
/* 17 */
/***/ function(module, exports) {

	"use strict";
	
	var CacheThread = function () {
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
	}();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = CacheThread;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var cache_1 = __webpack_require__(1);
	var util_1 = __webpack_require__(6);
	var cacheUtil_1 = __webpack_require__(10);
	exports.getItem = function (entity, instance, nodeId) {
	    if (!entity) {
	        throw new TypeError("One get(): requires a uid to retrieve an item from the cache.");
	    }
	    if (util_1.isArray(entity)) {
	        return entity.map(function (item) {
	            return getObject(item, instance);
	        }).filter(function (item) {
	            return item !== null && item !== undefined;
	        });
	    }
	    return getObject(entity, instance);
	};
	var getObject = function (uidOrEntity, instance) {
	    var realUid = getActualUid(uidOrEntity);
	    if (!realUid) {
	        return;
	    }
	    var item = cacheUtil_1.getCachedItem(realUid, instance);
	    return item ? item.entity : undefined;
	};
	exports.getEditItem = function (obj, instance, nodeId) {
	    if (util_1.isArray(obj)) {
	        return obj.map(function (item) {
	            return getEditableObject(item, instance);
	        }).filter(function (item) {
	            return item !== null && item !== undefined;
	        });
	    }
	    return getEditableObject(obj, instance);
	};
	var getEditableObject = function (uidOrEntity, instance) {
	    var realUid = getActualUid(uidOrEntity);
	    var existing = exports.getItem(realUid, instance);
	    return existing ? util_1.deepClone(existing, undefined, false) : undefined;
	};
	var getActualUid = function (uidOrEntity) {
	    if (typeof uidOrEntity === "string") {
	        return uidOrEntity;
	    } else if (typeof uidOrEntity === "number") {
	        return String(uidOrEntity);
	    } else if (util_1.isObject(uidOrEntity)) {
	        if (util_1.hasUid(uidOrEntity)) {
	            return uidOrEntity[cache_1.config.uidName];
	        }
	    }
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var util_1 = __webpack_require__(6);
	var cache_1 = __webpack_require__(1);
	var get_1 = __webpack_require__(18);
	var CacheMap_1 = __webpack_require__(4);
	var opath = __webpack_require__(9);
	var locate_1 = __webpack_require__(5);
	var ref_1 = __webpack_require__(8);
	var cacheUtil_1 = __webpack_require__(10);
	var flush_1 = __webpack_require__(12);
	var parse_1 = __webpack_require__(13);
	exports.evictItem = function (obj, instance) {
	    var uidArray = buildEvictUidArray(obj);
	    if (uidArray.length == 0) {
	        return locate_1.getCallStats(false, instance);
	    }
	    var currentState = cacheUtil_1.getCacheCurrentStack(instance);
	    var found = uidArray.some(function (item) {
	        return currentState && currentState.has(String(item));
	    });
	    if (!found) {
	        return locate_1.getCallStats(false, instance);
	    }
	    var tempState = new CacheMap_1.default();
	    currentState.forEach(function (key, value) {
	        tempState.set(key, value);
	    });
	    var flushMap = new CacheMap_1.default();
	    var evictMap = new CacheMap_1.default();
	    var flushArgs = {
	        flushMap: flushMap,
	        evictMap: evictMap,
	        instance: instance
	    };
	    var parentsChanged = [];
	    uidArray.forEach(function (uid) {
	        clearTargetRefFroms(uid, flushArgs);
	        evictMap.set(uid, null);
	        clearParentRefTos(uid, uidArray, parentsChanged, flushArgs);
	    });
	    putParentsChanged(parentsChanged, flushMap, evictMap, instance);
	    flushMap.forEach(function (key, item) {
	        tempState.set(key, item);
	    });
	    evictMap.forEach(function (key, item) {
	        tempState.delete(key);
	    });
	    flush_1.flush(tempState, instance);
	    return locate_1.getCallStats(true, instance);
	};
	var putParentsChanged = function (parentsChanged, flushMap, evictMap, instance) {
	    if (parentsChanged && parentsChanged.length > 0 && util_1.cacheSize(instance) > 0) {
	        var flushArgs_1 = {
	            flushMap: flushMap,
	            evictMap: evictMap,
	            instance: instance
	        };
	        parse_1.parse(parentsChanged, flushArgs_1);
	        flushArgs_1.flushMap.forEach(function (key, item) {
	            ref_1.updateRefFroms(item, flushArgs_1);
	        });
	    }
	};
	var clearTargetRefFroms = function (entityUid, flushArgs) {
	    var item = cacheUtil_1.getCachedItem(entityUid, flushArgs.instance);
	    if (item) {
	        item.mapTo.forEach(function (toUid, paths) {
	            var refItem = cacheUtil_1.getItemFlushOrCached(toUid, flushArgs);
	            if (refItem) {
	                clearRefFrom(refItem, entityUid);
	                if (refItem.mapFrom.size() === 0) {
	                    entityUid = toUid;
	                    clearTargetRefFroms(entityUid, flushArgs);
	                    flushArgs.evictMap.set(toUid, refItem);
	                } else {
	                    flushArgs.flushMap.set(toUid, refItem);
	                }
	            }
	        });
	    }
	};
	var clearRefFrom = function (refItem, parentUid) {
	    var refsArray = refItem.mapFrom.get(parentUid);
	    if (!refsArray) {
	        return;
	    }
	    refItem.mapFrom = refItem.mapFrom.clone();
	    refItem.mapFrom.delete(parentUid);
	};
	var clearParentRefTos = function (entityUid, uidArray, parentsChanged, flushArgs) {
	    var item = cacheUtil_1.getItemFlushOrCached(entityUid, flushArgs);
	    if (item) {
	        item.mapFrom.forEach(function (parentUid, paths) {
	            var parentItem = cacheUtil_1.getItemFlushOrCached(parentUid, flushArgs);
	            if (parentItem) {
	                var success = clearRefTo(parentItem, entityUid, flushArgs.instance);
	                if (success === true) {
	                    flushArgs.flushMap.set(parentUid, parentItem);
	                    if (uidArray.indexOf(parentUid) < 0) {
	                        parentsChanged.push(parentItem);
	                    }
	                }
	            }
	        });
	    }
	};
	var clearRefTo = function (parentItem, refUid, instance) {
	    var parent = parentItem.entity;
	    if (Object.isFrozen(parent)) {
	        parent = get_1.getEditItem(parent[cache_1.config.uidName], instance);
	        parentItem.entity = parent;
	    }
	    var refPaths = parentItem.mapTo.get(refUid);
	    refPaths.forEach(function (path) {
	        opath.del(parent, path);
	    });
	    if (!Object.isFrozen(parent)) {
	        Object.freeze(parent);
	    }
	    parentItem.entity = parent;
	    parentItem.mapTo = parentItem.mapTo.clone();
	    parentItem.mapTo.delete(refUid);
	    return true;
	};
	var buildEvictUidArray = function (obj) {
	    var uidArray = [];
	    if (util_1.isArray(obj)) {
	        obj.forEach(function (item) {
	            if (util_1.hasUid(item)) {
	                uidArray.push(String(item[cache_1.config.uidName]));
	            } else {
	                if (typeof item === "string" || typeof item === "number") {
	                    uidArray.push(String(item));
	                }
	            }
	        });
	    } else {
	        var uid = obj;
	        if (util_1.isObject(obj)) {
	            uid = obj[cache_1.config.uidName];
	        }
	        if (uid === undefined) {
	            return uidArray;
	        }
	        uidArray.push(String(uid));
	    }
	    return uidArray;
	};

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDI5M2I1ZjYxNjlkMzFhMWI0MTEiLCJ3ZWJwYWNrOi8vLy4vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vY2FjaGUudHMiLCJ3ZWJwYWNrOi8vLy4vY29uZmlnLnRzIiwid2VicGFjazovLy8uL3B1dC50cyIsIndlYnBhY2s6Ly8vLi9DYWNoZU1hcC50cyIsIndlYnBhY2s6Ly8vLi9sb2NhdGUudHMiLCJ3ZWJwYWNrOi8vLy4vdXRpbC50cyIsIndlYnBhY2s6Ly8vLi9DYWNoZU5vZGUudHMiLCJ3ZWJwYWNrOi8vLy4vcmVmLnRzIiwid2VicGFjazovLy8uL3BhdGgudHMiLCJ3ZWJwYWNrOi8vLy4vY2FjaGVVdGlsLnRzIiwid2VicGFjazovLy8uL0NhY2hlSXRlbS50cyIsIndlYnBhY2s6Ly8vLi9mbHVzaC50cyIsIndlYnBhY2s6Ly8vLi9wYXJzZS50cyIsIndlYnBhY2s6Ly8vLi9wcmludC50cyIsIndlYnBhY2s6Ly8vLi9DYWNoZUluc3RhbmNlLnRzIiwid2VicGFjazovLy8uL0NhY2hlUmVwby50cyIsIndlYnBhY2s6Ly8vLi9DYWNoZVRocmVhZC50cyIsIndlYnBhY2s6Ly8vLi9nZXQudHMiLCJ3ZWJwYWNrOi8vLy4vZXZpY3QudHMiXSwibmFtZXMiOlsiY2FjaGVfMSIsInJlcXVpcmUiLCJleHBvcnRzIiwiZ2V0Q2FjaGUiLCJwdXQiLCJnZXQiLCJnZXRFZGl0IiwiZXZpY3QiLCJyZXNldCIsInV1aWQiLCJwcmludCIsIndpbmRvdyIsIk9uZSIsImNvbmZpZ18xIiwicHV0XzEiLCJwcmludF8xIiwiQ2FjaGVJbnN0YW5jZV8xIiwidXRpbF8xIiwiZ2V0XzEiLCJldmljdF8xIiwiY2FjaGVVdGlsXzEiLCJpbnN0YW5jZXMiLCJjYWNoZVRlc3QiLCJzZXRUZXN0aW5nIiwidGVzdGluZyIsImluc3RhbmNlTmFtZSIsImNvbmZpZ3VyYXRpb24iLCJkZWZhdWx0Q29uZmlnIiwiY29uZmlnIiwiY29uZmlndXJlIiwiY3JlYXRlQ2FjaGUiLCJ1bmRlZmluZWQiLCJpdGVtIiwiZW50aXR5Iiwibm9kZUlkIiwidWlkT3JFbnRpdHlPckFycmF5IiwibHV0IiwiaSIsInRvU3RyaW5nIiwiZDAiLCJNYXRoIiwicmFuZG9tIiwiZDEiLCJkMiIsImQzIiwibmFtZSIsImluc3RhbmNlIiwiZGVmYXVsdCIsInB1dEl0ZW0iLCJnZXRJdGVtIiwiZ2V0RWRpdEl0ZW0iLCJldmljdEl0ZW0iLCJzaXplIiwiY2FjaGVTaXplIiwibGVuZ3RoIiwiY2FjaGVMZW5ndGgiLCJwcmludENhY2hlIiwicmVzdWx0IiwicmVmVG8iLCJ1aWQiLCJnZXRDYWNoZWRJdGVtIiwibWFwVG8iLCJyZWZGcm9tIiwibWFwRnJvbSIsInVpZE5hbWUiLCJtYXhIaXN0b3J5U3RhdGVzIiwiY29uZiIsInAiLCJoYXNPd25Qcm9wZXJ0eSIsIkNhY2hlTWFwXzEiLCJsb2NhdGVfMSIsInJlZl8xIiwiZmx1c2hfMSIsInBhcnNlXzEiLCJpc0FycmF5IiwiaXNPYmplY3QiLCJldmljdE1hcCIsImZsdXNoTWFwIiwiZmx1c2hBcmdzIiwicGFyc2UiLCJ1cGRhdGVQb2ludGVycyIsInByZUZsdXNoIiwiZ2V0Q2FsbFN0YXRzIiwiX19hc3NpZ24iLCJPYmplY3QiLCJhc3NpZ24iLCJ0IiwicyIsIm4iLCJhcmd1bWVudHMiLCJwcm90b3R5cGUiLCJjYWxsIiwiQ2FjaGVNYXAiLCJfdGhpcyIsInBhdGhzIiwia2V5IiwiZGVsZXRlIiwidmFsIiwiaGFzIiwiZm9yRWFjaCIsImNhbGxiYWNrIiwiY2xvbmUiLCJzZXQiLCJ2YWx1ZSIsImRlZmluZVByb3BlcnR5Iiwic3VjY2VzcyIsIm5vZGUiLCJjdXJyZW50Tm9kZSIsImdldEN1cnJlbnROb2RlIiwiaWQiLCJpc051bWJlciIsIlR5cGVFcnJvciIsImNhY2hlTm9kZSIsImdldFJlcG9Ob2RlIiwidGhyZWFkIiwiY3VycmVudCIsImJpbmFyeUluZGV4T2YiLCJub2RlcyIsImN1cnJlbnROb2RlSWQiLCJjYWNoZU5vZGVJZCIsInJlcG8iLCJhcnJheSIsInNlYXJjaEVsZW1lbnQiLCJtaW5JbmRleCIsIm1heEluZGV4IiwiY3VycmVudEluZGV4IiwiY3VycmVudEVsZW1lbnQiLCJDYWNoZU5vZGVfMSIsIl9oYXNPd25Qcm9wZXJ0eSIsImlzU3RyaW5nIiwib2JqIiwibWl4ZWRfdmFyIiwiaXNGdW5jdGlvbiIsIkFycmF5Iiwic3BsaWNlIiwicHJvcGVydHlJc0VudW1lcmFibGUiLCJvYmpUb1N0ciIsIm8iLCJpc0RhdGUiLCJpc0VtcHR5IiwiZ2V0TmV3Q2FjaGVOb2RlIiwiQ2FjaGVOb2RlIiwibmV4dE5vZGVLZXkiLCJhZGQiLCJoYXNVaWQiLCJGdW5jdGlvbiIsInRhcmdldCIsIlNUUklQX0NPTU1FTlRTIiwiQVJHVU1FTlRfTkFNRVMiLCJnZXRQYXJhbU5hbWVzIiwiZnVuYyIsImZuU3RyIiwicmVwbGFjZSIsInNsaWNlIiwiaW5kZXhPZiIsIm1hdGNoIiwic3RyaW5naWZ5IiwiUmVnRXhwIiwiYm9keSIsInRyaW0iLCJwYXJhbU5hbWVzIiwiYmluZCIsImRlZXBDbG9uZSIsInVpZFJlZmVyZW5jZSIsImZyZWV6ZSIsImlzRnJvemVuIiwicHJvcE5hbWUiLCJkZWVwQ2xvbmVBcnJheSIsImRhdGUiLCJEYXRlIiwiZ2V0VGltZSIsImFyciIsIm1hcCIsIml0ZW1zIiwib3BhdGgiLCJhc3NpZ25SZWZUb1BhcmVudCIsInJlZkl0ZW0iLCJwYXJlbnRVaWQiLCJwYXRoIiwicGFyZW50SXRlbSIsImdldEl0ZW1GbHVzaE9yQ2FjaGVkIiwiYXNzaWduUmVmcyIsInJlZlVpZCIsInJlZlBhdGgiLCJqb2luIiwiYWRkUmVmVG8iLCJhZGRSZWZGcm9tIiwicmVmQXJyYXkiLCJwdXNoIiwiZnJvbUFycmF5IiwidXBkYXRlSXRlbVJlZlRvcyIsInVwZGF0ZVJlZkZyb21zIiwiZmlyc3RQYXRoIiwidGFyZ2V0UmVmIiwiYXJncyIsImVuc3VyZUl0ZW0iLCJ1cGRhdGVSZWZUb3MiLCJlbnRpdHlVaWQiLCJ0b1VpZCIsInVwZGF0ZWRQYXRocyIsImZpbHRlciIsInJlZmVyZW5jZSIsImhhc1JlZiIsIlN0cmluZyIsInJlbW92ZVJlZkZyb21fVmFsdWUiLCJyZW1vdmVSZWZGcm9tIiwicmVmc0FycmF5IiwiaW5kZXgiLCJnZXRLZXkiLCJpbnRLZXkiLCJwYXJzZUludCIsImRlbCIsInNwbGl0IiwiY3VycmVudFBhdGgiLCJvbGRWYWwiLCJkZWZhdWx0VmFsdWUiLCJDYWNoZUl0ZW1fMSIsImlzT25DYWNoZSIsImNhY2hlZEl0ZW0iLCJpc09uRmx1c2hNYXAiLCJnZXRDYWNoZUN1cnJlbnRTdGFjayIsImVuc3VyZU9uRmx1c2hNYXAiLCJpdGVtVWlkIiwibGl2ZSIsIkNhY2hlSXRlbSIsImxpdmVJdGVtIiwidGVtcCIsImN1cnJlbnRTdGFjayIsIl9mcmVlemVJdGVtIiwiZmx1c2giLCJfYWRkVG9GbHVzaE1hcCIsIl9wYXJzZUFycmF5IiwiX3BhcnNlT2JqZWN0IiwiX3BhcnNlRW50aXR5IiwicmVmIiwiY29uY2F0IiwiX2NhY2hlVWlkT2JqIiwibm9kZUluZGljZXMiLCJzdHJlYW1EYXRhIiwic3RhdGUiLCJzdHJpbmdpZnlNYXAiLCJzdWJzdHJpbmciLCJKU09OIiwiaXRlbVJlc3VsdCIsIkNhY2hlUmVwb18xIiwiQ2FjaGVUaHJlYWRfMSIsIkNhY2hlSW5zdGFuY2UiLCJhZGROb2RlIiwiQ2FjaGVSZXBvIiwiQ2FjaGVUaHJlYWQiLCJnZXRPYmplY3QiLCJ1aWRPckVudGl0eSIsInJlYWxVaWQiLCJnZXRBY3R1YWxVaWQiLCJnZXRFZGl0YWJsZU9iamVjdCIsImV4aXN0aW5nIiwidWlkQXJyYXkiLCJidWlsZEV2aWN0VWlkQXJyYXkiLCJjdXJyZW50U3RhdGUiLCJmb3VuZCIsInNvbWUiLCJ0ZW1wU3RhdGUiLCJwYXJlbnRzQ2hhbmdlZCIsImNsZWFyVGFyZ2V0UmVmRnJvbXMiLCJjbGVhclBhcmVudFJlZlRvcyIsInB1dFBhcmVudHNDaGFuZ2VkIiwiZmx1c2hBcmdzXzEiLCJjbGVhclJlZkZyb20iLCJjbGVhclJlZlRvIiwi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d0QsR0FBZixDQUFKLEVBQXlCO0FBQ3JCQSxhQUFJL0IsT0FBSixDQUFZLFVBQVVuRSxJQUFWLEVBQWdCO0FBQ3hCLGlCQUFJZixPQUFPK0gsTUFBUCxDQUFjaEgsSUFBZCxDQUFKLEVBQXlCO0FBQ3JCZ08sMEJBQVNwRSxJQUFULENBQWNlLE9BQU8zSyxLQUFLaEMsUUFBUTRCLE1BQVIsQ0FBZW9DLE9BQXBCLENBQVAsQ0FBZDtBQUNILGNBRkQsTUFHSztBQUNELHFCQUFJLE9BQU9oQyxJQUFQLEtBQWdCLFFBQWhCLElBQTRCLE9BQU9BLElBQVAsS0FBZ0IsUUFBaEQsRUFBMEQ7QUFDdERnTyw4QkFBU3BFLElBQVQsQ0FBY2UsT0FBTzNLLElBQVAsQ0FBZDtBQUNIO0FBQ0o7QUFDSixVQVREO0FBVUgsTUFYRCxNQVlLO0FBQ0QsYUFBSTJCLE1BQU11RSxHQUFWO0FBQ0EsYUFBSWpILE9BQU8wRCxRQUFQLENBQWdCdUQsR0FBaEIsQ0FBSixFQUEwQjtBQUN0QnZFLG1CQUFNdUUsSUFBSWxJLFFBQVE0QixNQUFSLENBQWVvQyxPQUFuQixDQUFOO0FBQ0g7QUFDRCxhQUFJTCxRQUFRNUIsU0FBWixFQUF1QjtBQUNuQixvQkFBT2lPLFFBQVA7QUFDSDtBQUNEQSxrQkFBU3BFLElBQVQsQ0FBY2UsT0FBT2hKLEdBQVAsQ0FBZDtBQUNIO0FBQ0QsWUFBT3FNLFFBQVA7QUFDSCxFQXpCRCxDIiwiZmlsZSI6Im9uZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGQyOTNiNWY2MTY5ZDMxYTFiNDExIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgY2FjaGVfMSA9IHJlcXVpcmUoXCIuL2NhY2hlXCIpO1xuZXhwb3J0cy5nZXRDYWNoZSA9IGNhY2hlXzEuZ2V0Q2FjaGU7XG5leHBvcnRzLnB1dCA9IGNhY2hlXzEucHV0O1xuZXhwb3J0cy5nZXQgPSBjYWNoZV8xLmdldDtcbmV4cG9ydHMuZ2V0RWRpdCA9IGNhY2hlXzEuZ2V0RWRpdDtcbmV4cG9ydHMuZXZpY3QgPSBjYWNoZV8xLmV2aWN0O1xuZXhwb3J0cy5yZXNldCA9IGNhY2hlXzEucmVzZXQ7XG5leHBvcnRzLnV1aWQgPSBjYWNoZV8xLnV1aWQ7XG5leHBvcnRzLnByaW50ID0gY2FjaGVfMS5wcmludDtcbihmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdyAhPT0gbnVsbCkge1xuICAgICAgICB3aW5kb3cuT25lID0ge1xuICAgICAgICAgICAgZ2V0Q2FjaGU6IGNhY2hlXzEuZ2V0Q2FjaGUsXG4gICAgICAgICAgICBwdXQ6IGNhY2hlXzEucHV0LFxuICAgICAgICAgICAgZ2V0OiBjYWNoZV8xLmdldCxcbiAgICAgICAgICAgIGdldEVkaXQ6IGNhY2hlXzEuZ2V0RWRpdCxcbiAgICAgICAgICAgIGV2aWN0OiBjYWNoZV8xLmV2aWN0LFxuICAgICAgICAgICAgcmVzZXQ6IGNhY2hlXzEucmVzZXQsXG4gICAgICAgICAgICB1dWlkOiBjYWNoZV8xLnV1aWQsXG4gICAgICAgICAgICBwcmludDogY2FjaGVfMS5wcmludFxuICAgICAgICB9O1xuICAgIH1cbn0pKCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9pbmRleC50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIGNvbmZpZ18xID0gcmVxdWlyZShcIi4vY29uZmlnXCIpO1xudmFyIHB1dF8xID0gcmVxdWlyZShcIi4vcHV0XCIpO1xudmFyIHByaW50XzEgPSByZXF1aXJlKFwiLi9wcmludFwiKTtcbnZhciBDYWNoZUluc3RhbmNlXzEgPSByZXF1aXJlKFwiLi9DYWNoZUluc3RhbmNlXCIpO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG52YXIgZ2V0XzEgPSByZXF1aXJlKFwiLi9nZXRcIik7XG52YXIgZXZpY3RfMSA9IHJlcXVpcmUoXCIuL2V2aWN0XCIpO1xudmFyIGNhY2hlVXRpbF8xID0gcmVxdWlyZShcIi4vY2FjaGVVdGlsXCIpO1xuZXhwb3J0cy5pbnN0YW5jZXMgPSB7fTtcbnZhciBjYWNoZVRlc3QgPSBmYWxzZTtcbmZ1bmN0aW9uIHNldFRlc3RpbmcodGVzdGluZykge1xuICAgIGNhY2hlVGVzdCA9IHRlc3Rpbmc7XG59XG5leHBvcnRzLnNldFRlc3RpbmcgPSBzZXRUZXN0aW5nO1xuZnVuY3Rpb24gZ2V0Q2FjaGUoaW5zdGFuY2VOYW1lLCBjb25maWd1cmF0aW9uKSB7XG4gICAgaWYgKGluc3RhbmNlTmFtZSA9PT0gdm9pZCAwKSB7IGluc3RhbmNlTmFtZSA9IFwib25lXCI7IH1cbiAgICBpZiAoY29uZmlndXJhdGlvbiA9PT0gdm9pZCAwKSB7IGNvbmZpZ3VyYXRpb24gPSBjb25maWdfMS5kZWZhdWx0Q29uZmlnOyB9XG4gICAgaWYgKCFleHBvcnRzLmNvbmZpZykge1xuICAgICAgICBleHBvcnRzLmNvbmZpZyA9IGNvbmZpZ18xLmNvbmZpZ3VyZShjb25maWd1cmF0aW9uKTtcbiAgICB9XG4gICAgaWYgKCFleHBvcnRzLmluc3RhbmNlc1tpbnN0YW5jZU5hbWVdKSB7XG4gICAgICAgIGV4cG9ydHMuaW5zdGFuY2VzW2luc3RhbmNlTmFtZV0gPSBjcmVhdGVDYWNoZShpbnN0YW5jZU5hbWUpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93ICE9PSBudWxsICYmIHdpbmRvd1tpbnN0YW5jZU5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgd2luZG93W2luc3RhbmNlTmFtZV0gPSBleHBvcnRzLmluc3RhbmNlc1tpbnN0YW5jZU5hbWVdO1xuICAgIH1cbiAgICByZXR1cm4gZXhwb3J0cy5pbnN0YW5jZXNbaW5zdGFuY2VOYW1lXTtcbn1cbmV4cG9ydHMuZ2V0Q2FjaGUgPSBnZXRDYWNoZTtcbmV4cG9ydHMucHV0ID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICBnZXRDYWNoZSgpLnB1dChpdGVtKTtcbn07XG5leHBvcnRzLmdldCA9IGZ1bmN0aW9uIChlbnRpdHksIG5vZGVJZCkge1xuICAgIHJldHVybiBnZXRDYWNoZSgpLmdldChlbnRpdHksIG5vZGVJZCk7XG59O1xuZXhwb3J0cy5nZXRFZGl0ID0gZnVuY3Rpb24gKHVpZE9yRW50aXR5T3JBcnJheSwgbm9kZUlkKSB7XG4gICAgcmV0dXJuIGdldENhY2hlKCkuZ2V0RWRpdCh1aWRPckVudGl0eU9yQXJyYXksIG5vZGVJZCk7XG59O1xuZXhwb3J0cy5ldmljdCA9IGZ1bmN0aW9uICh1aWRPckVudGl0eU9yQXJyYXkpIHtcbiAgICByZXR1cm4gZ2V0Q2FjaGUoKS5ldmljdCh1aWRPckVudGl0eU9yQXJyYXkpO1xufTtcbmV4cG9ydHMucHJpbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGdldENhY2hlKCkucHJpbnQoKTtcbn07XG5leHBvcnRzLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIGdldENhY2hlKCkucmVzZXQoKTtcbn07XG5leHBvcnRzLnV1aWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGx1dCA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMjU2OyBpKyspIHtcbiAgICAgICAgbHV0W2ldID0gKGkgPCAxNiA/ICcwJyA6ICcnKSArIChpKS50b1N0cmluZygxNik7XG4gICAgfVxuICAgIHZhciBkMCA9IE1hdGgucmFuZG9tKCkgKiAweDEwMDAwMDAwMCB8IDA7XG4gICAgdmFyIGQxID0gTWF0aC5yYW5kb20oKSAqIDB4MTAwMDAwMDAwIHwgMDtcbiAgICB2YXIgZDIgPSBNYXRoLnJhbmRvbSgpICogMHgxMDAwMDAwMDAgfCAwO1xuICAgIHZhciBkMyA9IE1hdGgucmFuZG9tKCkgKiAweDEwMDAwMDAwMCB8IDA7XG4gICAgcmV0dXJuIGx1dFtkMCAmIDB4RkZdICsgbHV0W2QwID4+IDggJiAweEZGXSArIGx1dFtkMCA+PiAxNiAmIDB4RkZdXG4gICAgICAgICsgbHV0W2QwID4+IDI0ICYgMHhGRl0gKyAnLScgKyBsdXRbZDEgJiAweEZGXVxuICAgICAgICArIGx1dFtkMSA+PiA4ICYgMHhGRl0gKyAnLScgKyBsdXRbZDEgPj4gMTYgJiAweDBmIHwgMHg0MF1cbiAgICAgICAgKyBsdXRbZDEgPj4gMjQgJiAweEZGXSArICctJyArIGx1dFtkMiAmIDB4M2YgfCAweDgwXVxuICAgICAgICArIGx1dFtkMiA+PiA4ICYgMHhGRl0gKyAnLScgKyBsdXRbZDIgPj4gMTYgJiAweEZGXVxuICAgICAgICArIGx1dFtkMiA+PiAyNCAmIDB4RkZdICsgbHV0W2QzICYgMHhGRl0gKyBsdXRbZDMgPj4gOCAmIDB4RkZdXG4gICAgICAgICsgbHV0W2QzID4+IDE2ICYgMHhGRl0gKyBsdXRbZDMgPj4gMjQgJiAweEZGXTtcbn07XG5mdW5jdGlvbiBjcmVhdGVDYWNoZShuYW1lKSB7XG4gICAgdmFyIGluc3RhbmNlID0gbmV3IENhY2hlSW5zdGFuY2VfMS5kZWZhdWx0KG5hbWUpO1xuICAgIHZhciByZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaW5zdGFuY2UucmVzZXQoKTtcbiAgICB9O1xuICAgIHZhciBwdXQgPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICByZXR1cm4gcHV0XzEucHV0SXRlbShpdGVtLCBpbnN0YW5jZSk7XG4gICAgfTtcbiAgICB2YXIgZ2V0ID0gZnVuY3Rpb24gKGVudGl0eSwgbm9kZUlkKSB7XG4gICAgICAgIHJldHVybiBnZXRfMS5nZXRJdGVtKGVudGl0eSwgaW5zdGFuY2UsIG5vZGVJZCk7XG4gICAgfTtcbiAgICB2YXIgZ2V0RWRpdCA9IGZ1bmN0aW9uICh1aWRPckVudGl0eU9yQXJyYXksIG5vZGVJZCkge1xuICAgICAgICByZXR1cm4gZ2V0XzEuZ2V0RWRpdEl0ZW0odWlkT3JFbnRpdHlPckFycmF5LCBpbnN0YW5jZSwgbm9kZUlkKTtcbiAgICB9O1xuICAgIHZhciBldmljdCA9IGZ1bmN0aW9uICh1aWRPckVudGl0eU9yQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIGV2aWN0XzEuZXZpY3RJdGVtKHVpZE9yRW50aXR5T3JBcnJheSwgaW5zdGFuY2UpO1xuICAgIH07XG4gICAgdmFyIHNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB1dGlsXzEuY2FjaGVTaXplKGluc3RhbmNlKTtcbiAgICB9O1xuICAgIHZhciBsZW5ndGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB1dGlsXzEuY2FjaGVMZW5ndGgoaW5zdGFuY2UpO1xuICAgIH07XG4gICAgdmFyIHByaW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gcHJpbnRfMS5wcmludENhY2hlKGluc3RhbmNlKTtcbiAgICB9O1xuICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgIHB1dDogcHV0LFxuICAgICAgICBnZXQ6IGdldCxcbiAgICAgICAgZ2V0RWRpdDogZ2V0RWRpdCxcbiAgICAgICAgZXZpY3Q6IGV2aWN0LFxuICAgICAgICByZXNldDogcmVzZXQsXG4gICAgICAgIHNpemU6IHNpemUsXG4gICAgICAgIGxlbmd0aDogbGVuZ3RoLFxuICAgICAgICBwcmludDogcHJpbnQsXG4gICAgfTtcbiAgICBpZiAoY2FjaGVUZXN0ID09PSB0cnVlKSB7XG4gICAgICAgIHJlc3VsdC5yZWZUbyA9IGZ1bmN0aW9uICh1aWQpIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gY2FjaGVVdGlsXzEuZ2V0Q2FjaGVkSXRlbSh1aWQsIGluc3RhbmNlKTtcbiAgICAgICAgICAgIHJldHVybiBpdGVtLm1hcFRvO1xuICAgICAgICB9O1xuICAgICAgICByZXN1bHQucmVmRnJvbSA9IGZ1bmN0aW9uICh1aWQpIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gY2FjaGVVdGlsXzEuZ2V0Q2FjaGVkSXRlbSh1aWQsIGluc3RhbmNlKTtcbiAgICAgICAgICAgIHJldHVybiBpdGVtLm1hcEZyb207XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9jYWNoZS50cyIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5kZWZhdWx0Q29uZmlnID0ge1xuICAgIHVpZE5hbWU6IFwidWlkXCIsXG4gICAgbWF4SGlzdG9yeVN0YXRlczogMTAwMFxufTtcbmZ1bmN0aW9uIGNvbmZpZ3VyZShjb25mKSB7XG4gICAgZm9yICh2YXIgcCBpbiBleHBvcnRzLmRlZmF1bHRDb25maWcpIHtcbiAgICAgICAgaWYgKGV4cG9ydHMuZGVmYXVsdENvbmZpZy5oYXNPd25Qcm9wZXJ0eShwKSAmJiBjb25mLmhhc093blByb3BlcnR5KHApKSB7XG4gICAgICAgICAgICBleHBvcnRzLmRlZmF1bHRDb25maWdbcF0gPSBjb25mW3BdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBleHBvcnRzLmRlZmF1bHRDb25maWc7XG59XG5leHBvcnRzLmNvbmZpZ3VyZSA9IGNvbmZpZ3VyZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2NvbmZpZy50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIENhY2hlTWFwXzEgPSByZXF1aXJlKFwiLi9DYWNoZU1hcFwiKTtcbnZhciBsb2NhdGVfMSA9IHJlcXVpcmUoXCIuL2xvY2F0ZVwiKTtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xudmFyIHJlZl8xID0gcmVxdWlyZShcIi4vcmVmXCIpO1xudmFyIGZsdXNoXzEgPSByZXF1aXJlKFwiLi9mbHVzaFwiKTtcbnZhciBwYXJzZV8xID0gcmVxdWlyZShcIi4vcGFyc2VcIik7XG5leHBvcnRzLnB1dEl0ZW0gPSBmdW5jdGlvbiAoZW50aXR5LCBpbnN0YW5jZSkge1xuICAgIGlmICgodXRpbF8xLmlzQXJyYXkoZW50aXR5KSB8fCB1dGlsXzEuaXNPYmplY3QoZW50aXR5KSkpIHtcbiAgICAgICAgdmFyIGV2aWN0TWFwID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgICAgICB2YXIgZmx1c2hNYXAgPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgICAgIGZsdXNoTWFwWydfX1VQREFURURfXyddID0gZmFsc2U7XG4gICAgICAgIHZhciBmbHVzaEFyZ3MgPSB7XG4gICAgICAgICAgICBmbHVzaE1hcDogZmx1c2hNYXAsXG4gICAgICAgICAgICBldmljdE1hcDogZXZpY3RNYXAsXG4gICAgICAgICAgICBpbnN0YW5jZTogaW5zdGFuY2VcbiAgICAgICAgfTtcbiAgICAgICAgcGFyc2VfMS5wYXJzZShlbnRpdHksIGZsdXNoQXJncyk7XG4gICAgICAgIHJlZl8xLnVwZGF0ZVBvaW50ZXJzKGZsdXNoQXJncyk7XG4gICAgICAgIGlmIChmbHVzaEFyZ3MuZmx1c2hNYXAuc2l6ZSgpID4gMCkge1xuICAgICAgICAgICAgZmx1c2hfMS5wcmVGbHVzaChmbHVzaEFyZ3MsIGluc3RhbmNlKTtcbiAgICAgICAgICAgIHJldHVybiBsb2NhdGVfMS5nZXRDYWxsU3RhdHModHJ1ZSwgaW5zdGFuY2UpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBsb2NhdGVfMS5nZXRDYWxsU3RhdHMoZmFsc2UsIGluc3RhbmNlKTtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wdXQudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICB9XG4gICAgcmV0dXJuIHQ7XG59O1xudmFyIENhY2hlTWFwID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDYWNoZU1hcCgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5wYXRocyA9IHt9O1xuICAgICAgICB0aGlzLmxlbmd0aCA9IDA7XG4gICAgICAgIHRoaXMuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLnBhdGhzW2tleV07XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZGVsZXRlID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBfdGhpcy5wYXRoc1trZXldICE9PSBcInVuZGVmaW5lZFwiICYmIF90aGlzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsID0gX3RoaXMucGF0aHNba2V5XTtcbiAgICAgICAgICAgICAgICBkZWxldGUgX3RoaXMucGF0aHNba2V5XTtcbiAgICAgICAgICAgICAgICBfdGhpcy5sZW5ndGgtLTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmhhcyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgX3RoaXMucGF0aHNba2V5XSAhPT0gJ3VuZGVmaW5lZCc7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZm9yRWFjaCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIF90aGlzLnBhdGhzKSB7XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLnBhdGhzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soa2V5LCBfdGhpcy5wYXRoc1trZXldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY2xvbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY2xvbmUgPSBuZXcgQ2FjaGVNYXAoKTtcbiAgICAgICAgICAgIGNsb25lLnBhdGhzID0gX19hc3NpZ24oe30sIF90aGlzLnBhdGhzKTtcbiAgICAgICAgICAgIGNsb25lLmxlbmd0aCA9IF90aGlzLmxlbmd0aDtcbiAgICAgICAgICAgIHJldHVybiBjbG9uZTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgQ2FjaGVNYXAucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5wYXRoc1trZXldID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLmxlbmd0aCsrO1xuICAgICAgICAgICAgdGhpcy5wYXRoc1trZXldID0gdmFsdWU7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhdGhzW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgQ2FjaGVNYXAucHJvdG90eXBlLnNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxlbmd0aDtcbiAgICB9O1xuICAgIHJldHVybiBDYWNoZU1hcDtcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDYWNoZU1hcDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NhY2hlTWFwLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbmV4cG9ydHMuZ2V0Q2FsbFN0YXRzID0gZnVuY3Rpb24gKHN1Y2Nlc3MsIGluc3RhbmNlKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHJlc3VsdC5zdWNjZXNzID0gc3VjY2VzcztcbiAgICByZXN1bHQubm9kZUlkID0gZXhwb3J0cy5ub2RlKGluc3RhbmNlKTtcbiAgICByZXN1bHQubGVuZ3RoID0gbGVuZ3RoKGluc3RhbmNlKTtcbiAgICByZXN1bHQubmFtZSA9IGluc3RhbmNlLm5hbWU7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5leHBvcnRzLm5vZGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIG5vZGVJZCkge1xuICAgIGlmICh0eXBlb2Ygbm9kZUlkID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHZhciBjdXJyZW50Tm9kZSA9IGdldEN1cnJlbnROb2RlKGluc3RhbmNlKTtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnROb2RlID8gY3VycmVudE5vZGUuaWQgOiAtMTtcbiAgICB9XG4gICAgaWYgKCF1dGlsXzEuaXNOdW1iZXIobm9kZUlkKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVGhlIG5vZGUgaWQgbXVzdCBiZSBhIG51bWJlci5cIik7XG4gICAgfVxuICAgIHZhciBjYWNoZU5vZGUgPSBnZXRSZXBvTm9kZShub2RlSWQsIGluc3RhbmNlKTtcbiAgICBpZiAoIWNhY2hlTm9kZSkge1xuICAgICAgICByZXR1cm4gZXhwb3J0cy5nZXRDYWxsU3RhdHMoZmFsc2UsIGluc3RhbmNlKTtcbiAgICB9XG4gICAgaW5zdGFuY2UudGhyZWFkLmN1cnJlbnQgPSBiaW5hcnlJbmRleE9mKGluc3RhbmNlLnRocmVhZC5ub2Rlcywgbm9kZUlkKTtcbiAgICByZXR1cm4gZXhwb3J0cy5nZXRDYWxsU3RhdHModHJ1ZSwgaW5zdGFuY2UpO1xufTtcbmZ1bmN0aW9uIGdldEN1cnJlbnROb2RlKGluc3RhbmNlKSB7XG4gICAgdmFyIGN1cnJlbnROb2RlSWQgPSBpbnN0YW5jZS50aHJlYWQubm9kZXNbaW5zdGFuY2UudGhyZWFkLmN1cnJlbnRdO1xuICAgIHJldHVybiBjdXJyZW50Tm9kZUlkID49IDAgPyBnZXRSZXBvTm9kZShjdXJyZW50Tm9kZUlkLCBpbnN0YW5jZSkgOiB1bmRlZmluZWQ7XG59XG5leHBvcnRzLmdldEN1cnJlbnROb2RlID0gZ2V0Q3VycmVudE5vZGU7XG5mdW5jdGlvbiBnZXRSZXBvTm9kZShjYWNoZU5vZGVJZCwgaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gaW5zdGFuY2UucmVwby5nZXQoY2FjaGVOb2RlSWQpO1xufVxuZXhwb3J0cy5nZXRSZXBvTm9kZSA9IGdldFJlcG9Ob2RlO1xudmFyIGxlbmd0aCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIHJldHVybiBpbnN0YW5jZS50aHJlYWQubm9kZXMubGVuZ3RoO1xufTtcbmZ1bmN0aW9uIGJpbmFyeUluZGV4T2YoYXJyYXksIHNlYXJjaEVsZW1lbnQpIHtcbiAgICB2YXIgbWluSW5kZXggPSAwO1xuICAgIHZhciBtYXhJbmRleCA9IGFycmF5Lmxlbmd0aCAtIDE7XG4gICAgdmFyIGN1cnJlbnRJbmRleDtcbiAgICB2YXIgY3VycmVudEVsZW1lbnQ7XG4gICAgd2hpbGUgKG1pbkluZGV4IDw9IG1heEluZGV4KSB7XG4gICAgICAgIGN1cnJlbnRJbmRleCA9IChtaW5JbmRleCArIG1heEluZGV4KSAvIDIgfCAwO1xuICAgICAgICBjdXJyZW50RWxlbWVudCA9IGFycmF5W2N1cnJlbnRJbmRleF07XG4gICAgICAgIGlmIChjdXJyZW50RWxlbWVudCA8IHNlYXJjaEVsZW1lbnQpIHtcbiAgICAgICAgICAgIG1pbkluZGV4ID0gY3VycmVudEluZGV4ICsgMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjdXJyZW50RWxlbWVudCA+IHNlYXJjaEVsZW1lbnQpIHtcbiAgICAgICAgICAgIG1heEluZGV4ID0gY3VycmVudEluZGV4IC0gMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50SW5kZXg7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9sb2NhdGUudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICB9XG4gICAgcmV0dXJuIHQ7XG59O1xudmFyIENhY2hlTm9kZV8xID0gcmVxdWlyZShcIi4vQ2FjaGVOb2RlXCIpO1xudmFyIGNhY2hlXzEgPSByZXF1aXJlKFwiLi9jYWNoZVwiKTtcbnZhciBsb2NhdGVfMSA9IHJlcXVpcmUoXCIuL2xvY2F0ZVwiKTtcbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG52YXIgX2hhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbmZ1bmN0aW9uIGlzTnVtYmVyKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgfHwgdG9TdHJpbmcodmFsdWUpID09PSBcIltvYmplY3QgTnVtYmVyXVwiO1xufVxuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xuZnVuY3Rpb24gaXNTdHJpbmcob2JqKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdzdHJpbmcnIHx8IHRvU3RyaW5nKG9iaikgPT09IFwiW29iamVjdCBTdHJpbmddXCI7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5mdW5jdGlvbiBpc09iamVjdChtaXhlZF92YXIpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG1peGVkX3ZhcikgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gbWl4ZWRfdmFyICE9PSBudWxsICYmIHR5cGVvZiBtaXhlZF92YXIgPT09ICdvYmplY3QnO1xufVxuZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuZnVuY3Rpb24gaXNGdW5jdGlvbihpdGVtKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBpdGVtID09PSAnZnVuY3Rpb24nO1xufVxuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcbmZ1bmN0aW9uIGlzQXJyYXkodmFsdWUpIHtcbiAgICBpZiAoIXZhbHVlIHx8IHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpIHx8ICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnXG4gICAgICAgICYmIHR5cGVvZiB2YWx1ZS5sZW5ndGggPT09ICdudW1iZXInXG4gICAgICAgICYmIHR5cGVvZiB2YWx1ZS5zcGxpY2UgPT09ICdmdW5jdGlvbidcbiAgICAgICAgJiYgISh2YWx1ZS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgnbGVuZ3RoJykpKTtcbn1cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5mdW5jdGlvbiBvYmpUb1N0cihvKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKTtcbn1cbmZ1bmN0aW9uIGlzRGF0ZSh2YWx1ZSkge1xuICAgIHJldHVybiBpc09iamVjdCh2YWx1ZSkgJiYgb2JqVG9TdHIodmFsdWUpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcbmZ1bmN0aW9uIGlzRW1wdHkodmFsdWUpIHtcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBlbHNlIGlmICghaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIGZvciAodmFyIGkgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChfaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgaSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbmV4cG9ydHMuaXNFbXB0eSA9IGlzRW1wdHk7XG5mdW5jdGlvbiBnZXROZXdDYWNoZU5vZGUoaW5zdGFuY2UpIHtcbiAgICB2YXIgbm9kZSA9IG5ldyBDYWNoZU5vZGVfMS5DYWNoZU5vZGUoaW5zdGFuY2UubmV4dE5vZGVLZXkpO1xuICAgIG5vZGUuaWQgPSBpbnN0YW5jZS5uZXh0Tm9kZUtleTtcbiAgICBpbnN0YW5jZS5uZXh0Tm9kZUtleSArPSAxO1xuICAgIGluc3RhbmNlLnJlcG8uYWRkKG5vZGUpO1xuICAgIHJldHVybiBub2RlO1xufVxuZXhwb3J0cy5nZXROZXdDYWNoZU5vZGUgPSBnZXROZXdDYWNoZU5vZGU7XG5mdW5jdGlvbiBoYXNVaWQob2JqKSB7XG4gICAgaWYgKCFvYmopIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIWlzT2JqZWN0KG9iaikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG9ialtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciB1aWQgPSBvYmpbY2FjaGVfMS5jb25maWcudWlkTmFtZV07XG4gICAgcmV0dXJuIHVpZC5sZW5ndGggIT09IDA7XG59XG5leHBvcnRzLmhhc1VpZCA9IGhhc1VpZDtcbjtcbkZ1bmN0aW9uLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICB2YXIgU1RSSVBfQ09NTUVOVFMgPSAvKChcXC9cXC8uKiQpfChcXC9cXCpbXFxzXFxTXSo/XFwqXFwvKSkvbWc7XG4gICAgdmFyIEFSR1VNRU5UX05BTUVTID0gLyhbXlxccyxdKykvZztcbiAgICBmdW5jdGlvbiBnZXRQYXJhbU5hbWVzKGZ1bmMpIHtcbiAgICAgICAgdmFyIGZuU3RyID0gZnVuYy50b1N0cmluZygpLnJlcGxhY2UoU1RSSVBfQ09NTUVOVFMsICcnKTtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGZuU3RyLnNsaWNlKGZuU3RyLmluZGV4T2YoJygnKSArIDEsIGZuU3RyLmluZGV4T2YoJyknKSkubWF0Y2goQVJHVU1FTlRfTkFNRVMpO1xuICAgICAgICBpZiAocmVzdWx0ID09PSBudWxsKVxuICAgICAgICAgICAgcmVzdWx0ID0gW107XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIHZhciBzdHJpbmdpZnkgPSB0aGlzLnRvU3RyaW5nKCk7XG4gICAgc3RyaW5naWZ5ID0gc3RyaW5naWZ5LnJlcGxhY2UobmV3IFJlZ0V4cCgnX3RoaXMnLCAnZycpLCAndGhpcycpO1xuICAgIHZhciBib2R5ID0gc3RyaW5naWZ5Lm1hdGNoKC9mdW5jdGlvbltee10rXFx7KFtcXHNcXFNdKilcXH0kLylbMV07XG4gICAgYm9keSA9IGJvZHkudHJpbSgpO1xuICAgIHZhciBwYXJhbU5hbWVzID0gZ2V0UGFyYW1OYW1lcyh0aGlzKTtcbiAgICB2YXIgZnVuYztcbiAgICBpZiAoYm9keS5pbmRleE9mKCduYXRpdmUgY29kZScpIDwgMCkge1xuICAgICAgICBmdW5jID0gRnVuY3Rpb24ocGFyYW1OYW1lcywgYm9keSk7XG4gICAgICAgIGZ1bmMgPSBmdW5jLmJpbmQodGFyZ2V0KTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmM7XG59O1xuZnVuY3Rpb24gZGVlcENsb25lKG9iaiwgdWlkUmVmZXJlbmNlLCBmcmVlemUpIHtcbiAgICBpZiAoZnJlZXplID09PSB2b2lkIDApIHsgZnJlZXplID0gdHJ1ZTsgfVxuICAgIGlmICghb2JqXG4gICAgICAgIHx8ICghaXNPYmplY3Qob2JqKVxuICAgICAgICAgICAgJiYgIWlzQXJyYXkob2JqKSkpIHtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgaWYgKGZyZWV6ZSA9PT0gdHJ1ZVxuICAgICAgICAmJiB1aWRSZWZlcmVuY2VcbiAgICAgICAgJiYgIU9iamVjdC5pc0Zyb3plbih1aWRSZWZlcmVuY2UpKSB7XG4gICAgICAgIE9iamVjdC5mcmVlemUodWlkUmVmZXJlbmNlKTtcbiAgICB9XG4gICAgaWYgKHVpZFJlZmVyZW5jZVxuICAgICAgICAmJiBoYXNVaWQob2JqKVxuICAgICAgICAmJiBvYmpbY2FjaGVfMS5jb25maWcudWlkTmFtZV0gPT09IHVpZFJlZmVyZW5jZVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSkge1xuICAgICAgICByZXR1cm4gdWlkUmVmZXJlbmNlO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gX19hc3NpZ24oe30sIG9iaik7XG4gICAgZm9yICh2YXIgcHJvcE5hbWUgaW4gb2JqKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IG9ialtwcm9wTmFtZV07XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W3Byb3BOYW1lXSA9IGRlZXBDbG9uZUFycmF5KHZhbHVlLCB1aWRSZWZlcmVuY2UsIGZyZWV6ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh2YWx1ZS5nZXRUaW1lKCkpO1xuICAgICAgICAgICAgICAgIGlmIChmcmVlemUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmZyZWV6ZShkYXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzdWx0W3Byb3BOYW1lXSA9IGRhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoaGFzVWlkKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRbcHJvcE5hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1aWRSZWZlcmVuY2UgJiYgaGFzVWlkKHVpZFJlZmVyZW5jZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gdWlkUmVmZXJlbmNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdmFsdWUudWlkID09PSB1aWRSZWZlcmVuY2UudWlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdmFsdWUgIT09IHVpZFJlZmVyZW5jZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtwcm9wTmFtZV0gPSB1aWRSZWZlcmVuY2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtwcm9wTmFtZV0gPSBkZWVwQ2xvbmUodmFsdWUsIHVpZFJlZmVyZW5jZSwgZnJlZXplKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wTmFtZSAhPT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRbcHJvcE5hbWVdID0gdmFsdWUuY2xvbmUocmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbcHJvcE5hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZyZWV6ZSA9PT0gdHJ1ZVxuICAgICAgICAmJiAhT2JqZWN0LmlzRnJvemVuKHJlc3VsdClcbiAgICAgICAgJiYgdHlwZW9mIHJlc3VsdCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBPYmplY3QuZnJlZXplKHJlc3VsdCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5leHBvcnRzLmRlZXBDbG9uZSA9IGRlZXBDbG9uZTtcbmZ1bmN0aW9uIGRlZXBDbG9uZUFycmF5KGFyciwgdWlkUmVmZXJlbmNlLCBmcmVlemUpIHtcbiAgICByZXR1cm4gYXJyLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICBpZiAoaXNBcnJheShpdGVtKSkge1xuICAgICAgICAgICAgcmV0dXJuIGRlZXBDbG9uZUFycmF5KGl0ZW0sIHVpZFJlZmVyZW5jZSwgZnJlZXplKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpc09iamVjdChpdGVtKSkge1xuICAgICAgICAgICAgaWYgKGhhc1VpZChpdGVtKSkge1xuICAgICAgICAgICAgICAgIGlmICh1aWRSZWZlcmVuY2UgJiYgKGl0ZW1bY2FjaGVfMS5jb25maWcudWlkTmFtZV0gPT09IHVpZFJlZmVyZW5jZVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVpZFJlZmVyZW5jZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVlcENsb25lKGl0ZW0sIHVpZFJlZmVyZW5jZSwgZnJlZXplKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5leHBvcnRzLmNhY2hlU2l6ZSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIHZhciBjYWNoZU5vZGUgPSBsb2NhdGVfMS5nZXRDdXJyZW50Tm9kZShpbnN0YW5jZSk7XG4gICAgcmV0dXJuIGNhY2hlTm9kZSA/IGNhY2hlTm9kZS5pdGVtcy5zaXplKCkgOiAwO1xufTtcbmV4cG9ydHMuY2FjaGVMZW5ndGggPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gaW5zdGFuY2UudGhyZWFkLm5vZGVzLmxlbmd0aDtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi91dGlsLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQ2FjaGVNYXBfMSA9IHJlcXVpcmUoXCIuL0NhY2hlTWFwXCIpO1xudmFyIENhY2hlTm9kZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2FjaGVOb2RlKG5vZGVJZCkge1xuICAgICAgICB0aGlzLml0ZW1zID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmlkID0gbm9kZUlkO1xuICAgIH1cbiAgICByZXR1cm4gQ2FjaGVOb2RlO1xufSgpKTtcbmV4cG9ydHMuQ2FjaGVOb2RlID0gQ2FjaGVOb2RlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2FjaGVOb2RlLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgY2FjaGVfMSA9IHJlcXVpcmUoXCIuL2NhY2hlXCIpO1xudmFyIG9wYXRoID0gcmVxdWlyZShcIi4vcGF0aFwiKTtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xudmFyIGNhY2hlVXRpbF8xID0gcmVxdWlyZShcIi4vY2FjaGVVdGlsXCIpO1xuZXhwb3J0cy5hc3NpZ25SZWZUb1BhcmVudCA9IGZ1bmN0aW9uIChyZWZJdGVtLCBwYXJlbnRVaWQsIHBhdGgsIGZsdXNoQXJncykge1xuICAgIGlmIChwYXJlbnRVaWQpIHtcbiAgICAgICAgdmFyIHBhcmVudEl0ZW0gPSBjYWNoZVV0aWxfMS5nZXRJdGVtRmx1c2hPckNhY2hlZChwYXJlbnRVaWQsIGZsdXNoQXJncyk7XG4gICAgICAgIGlmIChwYXJlbnRJdGVtICYmIHBhdGgubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYXNzaWduUmVmcyhwYXJlbnRJdGVtLCByZWZJdGVtLCBwYXRoKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG52YXIgYXNzaWduUmVmcyA9IGZ1bmN0aW9uIChwYXJlbnRJdGVtLCByZWZJdGVtLCBwYXRoKSB7XG4gICAgdmFyIHBhcmVudFVpZCA9IHBhcmVudEl0ZW0uZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgIHZhciByZWZVaWQgPSByZWZJdGVtLmVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXTtcbiAgICB2YXIgcmVmUGF0aCA9IHBhdGguam9pbignLicpO1xuICAgIGFkZFJlZlRvKHBhcmVudEl0ZW0sIHJlZlVpZCwgcmVmUGF0aCk7XG4gICAgYWRkUmVmRnJvbShyZWZJdGVtLCBwYXJlbnRVaWQsIHJlZlBhdGgpO1xufTtcbnZhciBhZGRSZWZUbyA9IGZ1bmN0aW9uIChwYXJlbnRJdGVtLCByZWZVaWQsIHBhdGgpIHtcbiAgICBpZiAocGFyZW50SXRlbS5tYXBUby5oYXMocmVmVWlkKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcGFyZW50SXRlbS5tYXBUby5zZXQocmVmVWlkLCBbXSk7XG4gICAgfVxuICAgIHZhciByZWZBcnJheSA9IHBhcmVudEl0ZW0ubWFwVG8uZ2V0KHJlZlVpZCk7XG4gICAgaWYgKHJlZkFycmF5LmluZGV4T2YocGF0aCkgPCAwKSB7XG4gICAgICAgIHJlZkFycmF5LnB1c2gocGF0aCk7XG4gICAgfVxuICAgIHJldHVybiBwYXJlbnRJdGVtO1xufTtcbnZhciBhZGRSZWZGcm9tID0gZnVuY3Rpb24gKHJlZkl0ZW0sIHBhcmVudFVpZCwgcGF0aCkge1xuICAgIGlmIChyZWZJdGVtLm1hcEZyb20uaGFzKHBhcmVudFVpZCkgPT09IGZhbHNlKSB7XG4gICAgICAgIHJlZkl0ZW0ubWFwRnJvbS5zZXQocGFyZW50VWlkLCBbXSk7XG4gICAgfVxuICAgIHZhciBmcm9tQXJyYXkgPSByZWZJdGVtLm1hcEZyb20uZ2V0KHBhcmVudFVpZCk7XG4gICAgaWYgKGZyb21BcnJheS5pbmRleE9mKHBhdGgpIDwgMCkge1xuICAgICAgICBmcm9tQXJyYXkucHVzaChwYXRoKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlZkl0ZW07XG59O1xuZXhwb3J0cy51cGRhdGVQb2ludGVycyA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICBmbHVzaEFyZ3MuZmx1c2hNYXAuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgIHVwZGF0ZUl0ZW1SZWZUb3MoaXRlbSwgZmx1c2hBcmdzKTtcbiAgICAgICAgZXhwb3J0cy51cGRhdGVSZWZGcm9tcyhpdGVtLCBmbHVzaEFyZ3MpO1xuICAgIH0pO1xufTtcbmV4cG9ydHMudXBkYXRlUmVmRnJvbXMgPSBmdW5jdGlvbiAoaXRlbSwgZmx1c2hBcmdzKSB7XG4gICAgaWYgKGl0ZW0ubWFwRnJvbS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGl0ZW0ubWFwRnJvbS5mb3JFYWNoKGZ1bmN0aW9uIChwYXJlbnRVaWQsIHBhdGhzKSB7XG4gICAgICAgICAgICB2YXIgcGFyZW50SXRlbSA9IGZsdXNoQXJncy5mbHVzaE1hcC5nZXQocGFyZW50VWlkKTtcbiAgICAgICAgICAgIGlmICghcGFyZW50SXRlbSkge1xuICAgICAgICAgICAgICAgIHBhcmVudEl0ZW0gPSBjYWNoZVV0aWxfMS5nZXRDYWNoZWRJdGVtKHBhcmVudFVpZCwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXJlbnRJdGVtICYmIHBhdGhzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgZmlyc3RQYXRoID0gcGF0aHNbMF07XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldFJlZiA9IG9wYXRoLmdldChwYXJlbnRJdGVtLmVudGl0eSwgZmlyc3RQYXRoKTtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0UmVmICYmIHRhcmdldFJlZiAhPT0gaXRlbS5lbnRpdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmbHVzaE1hcDogZmx1c2hBcmdzLmZsdXNoTWFwLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2U6IGZsdXNoQXJncy5pbnN0YW5jZVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnRJdGVtID0gY2FjaGVVdGlsXzEuZW5zdXJlSXRlbShwYXJlbnRJdGVtLmVudGl0eSwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudEl0ZW0uZW50aXR5ID0gdXRpbF8xLmRlZXBDbG9uZShwYXJlbnRJdGVtLmVudGl0eSwgaXRlbS5lbnRpdHksIHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcbmV4cG9ydHMudXBkYXRlUmVmVG9zID0gZnVuY3Rpb24gKGVudGl0eVVpZCwgZmx1c2hBcmdzKSB7XG4gICAgdmFyIGl0ZW0gPSBjYWNoZVV0aWxfMS5nZXRJdGVtRmx1c2hPckNhY2hlZChlbnRpdHlVaWQsIGZsdXNoQXJncyk7XG4gICAgdXBkYXRlSXRlbVJlZlRvcyhpdGVtLCBmbHVzaEFyZ3MpO1xufTtcbnZhciB1cGRhdGVJdGVtUmVmVG9zID0gZnVuY3Rpb24gKGl0ZW0sIGZsdXNoQXJncykge1xuICAgIGlmICghaXRlbSB8fCAhaXRlbS5tYXBUbylcbiAgICAgICAgcmV0dXJuO1xuICAgIGl0ZW0ubWFwVG8uZm9yRWFjaChmdW5jdGlvbiAodG9VaWQsIHBhdGhzKSB7XG4gICAgICAgIHZhciB1cGRhdGVkUGF0aHMgPSBwYXRocy5maWx0ZXIoZnVuY3Rpb24gKHBhdGgpIHtcbiAgICAgICAgICAgIHZhciByZWZlcmVuY2UgPSBvcGF0aC5nZXQoaXRlbS5lbnRpdHksIHBhdGgpO1xuICAgICAgICAgICAgdmFyIGhhc1JlZiA9IHJlZmVyZW5jZSAmJiBTdHJpbmcocmVmZXJlbmNlW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdKSA9PT0gU3RyaW5nKHRvVWlkKTtcbiAgICAgICAgICAgIGlmICghaGFzUmVmKVxuICAgICAgICAgICAgICAgIHJlbW92ZVJlZkZyb21fVmFsdWUoaXRlbS5lbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV0sIHRvVWlkLCBmbHVzaEFyZ3MsIHBhdGgpO1xuICAgICAgICAgICAgcmV0dXJuIGhhc1JlZjtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh1cGRhdGVkUGF0aHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaXRlbS5tYXBUby5zZXQodG9VaWQsIHVwZGF0ZWRQYXRocyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpdGVtLm1hcFRvLmRlbGV0ZSh0b1VpZCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG52YXIgcmVtb3ZlUmVmRnJvbV9WYWx1ZSA9IGZ1bmN0aW9uIChwYXJlbnRVaWQsIHJlZlVpZCwgZmx1c2hBcmdzLCBwYXRoKSB7XG4gICAgdmFyIHJlZkl0ZW0gPSBjYWNoZVV0aWxfMS5nZXRJdGVtRmx1c2hPckNhY2hlZChyZWZVaWQsIGZsdXNoQXJncyk7XG4gICAgaWYgKHJlZkl0ZW0pIHtcbiAgICAgICAgcmVmSXRlbSA9IHJlZkl0ZW0uY2xvbmUoKTtcbiAgICAgICAgaWYgKHJlZkl0ZW0ubWFwRnJvbS5oYXMocGFyZW50VWlkKSkge1xuICAgICAgICAgICAgcmVtb3ZlUmVmRnJvbShyZWZJdGVtLCBwYXJlbnRVaWQsIHBhdGgpO1xuICAgICAgICAgICAgaWYgKHJlZkl0ZW0ubWFwRnJvbS5zaXplKCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZXZpY3RNYXAuc2V0KHJlZlVpZCwgcmVmSXRlbSk7XG4gICAgICAgICAgICAgICAgZmx1c2hBcmdzLmZsdXNoTWFwLmRlbGV0ZShyZWZVaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZmx1c2hBcmdzLmZsdXNoTWFwLnNldChyZWZVaWQsIHJlZkl0ZW0pO1xuICAgICAgICAgICAgICAgIGZsdXNoQXJncy5ldmljdE1hcC5kZWxldGUocmVmVWlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG52YXIgcmVtb3ZlUmVmRnJvbSA9IGZ1bmN0aW9uIChpdGVtLCBwYXJlbnRVaWQsIHBhdGgpIHtcbiAgICB2YXIgcmVmc0FycmF5ID0gaXRlbS5tYXBGcm9tLmdldChwYXJlbnRVaWQpO1xuICAgIHZhciBpbmRleCA9IHJlZnNBcnJheS5pbmRleE9mKHBhdGgpO1xuICAgIHJlZnNBcnJheSA9IHJlZnNBcnJheS5zbGljZSgpO1xuICAgIHJlZnNBcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIGl0ZW0ubWFwRnJvbS5zZXQocGFyZW50VWlkLCByZWZzQXJyYXkpO1xuICAgIGlmIChyZWZzQXJyYXkubGVuZ3RoID09IDApIHtcbiAgICAgICAgaXRlbS5tYXBGcm9tLmRlbGV0ZShwYXJlbnRVaWQpO1xuICAgIH1cbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9yZWYudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xuZnVuY3Rpb24gZ2V0S2V5KGtleSkge1xuICAgIHZhciBpbnRLZXkgPSBwYXJzZUludChrZXkpO1xuICAgIGlmIChpbnRLZXkudG9TdHJpbmcoKSA9PT0ga2V5KSB7XG4gICAgICAgIHJldHVybiBpbnRLZXk7XG4gICAgfVxuICAgIHJldHVybiBrZXk7XG59XG5mdW5jdGlvbiBkZWwob2JqLCBwYXRoKSB7XG4gICAgaWYgKHV0aWxfMS5pc051bWJlcihwYXRoKSkge1xuICAgICAgICBwYXRoID0gW3BhdGhdO1xuICAgIH1cbiAgICBpZiAodXRpbF8xLmlzRW1wdHkob2JqKSkge1xuICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbiAgICBpZiAodXRpbF8xLmlzRW1wdHkocGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgaWYgKHV0aWxfMS5pc1N0cmluZyhwYXRoKSkge1xuICAgICAgICByZXR1cm4gZGVsKG9iaiwgcGF0aC5zcGxpdCgnLicpKTtcbiAgICB9XG4gICAgdmFyIGN1cnJlbnRQYXRoID0gZ2V0S2V5KHBhdGhbMF0pO1xuICAgIHZhciBvbGRWYWwgPSBvYmpbY3VycmVudFBhdGhdO1xuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBpZiAob2xkVmFsICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgIGlmICh1dGlsXzEuaXNBcnJheShvYmopKSB7XG4gICAgICAgICAgICAgICAgb2JqLnNwbGljZShjdXJyZW50UGF0aCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgb2JqW2N1cnJlbnRQYXRoXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKG9ialtjdXJyZW50UGF0aF0gIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgcmV0dXJuIGRlbChvYmpbY3VycmVudFBhdGhdLCBwYXRoLnNsaWNlKDEpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqO1xufVxuZXhwb3J0cy5kZWwgPSBkZWw7XG5mdW5jdGlvbiBnZXQob2JqLCBwYXRoLCBkZWZhdWx0VmFsdWUpIHtcbiAgICBpZiAodXRpbF8xLmlzTnVtYmVyKHBhdGgpKSB7XG4gICAgICAgIHBhdGggPSBbcGF0aF07XG4gICAgfVxuICAgIGlmICh1dGlsXzEuaXNFbXB0eShwYXRoKSkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBpZiAodXRpbF8xLmlzRW1wdHkob2JqKSkge1xuICAgICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgIH1cbiAgICBpZiAodXRpbF8xLmlzU3RyaW5nKHBhdGgpKSB7XG4gICAgICAgIHJldHVybiBnZXQob2JqLCBwYXRoLnNwbGl0KCcuJyksIGRlZmF1bHRWYWx1ZSk7XG4gICAgfVxuICAgIHZhciBjdXJyZW50UGF0aCA9IGdldEtleShwYXRoWzBdKTtcbiAgICBpZiAocGF0aC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgaWYgKG9ialtjdXJyZW50UGF0aF0gPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2JqW2N1cnJlbnRQYXRoXTtcbiAgICB9XG4gICAgcmV0dXJuIGdldChvYmpbY3VycmVudFBhdGhdLCBwYXRoLnNsaWNlKDEpLCBkZWZhdWx0VmFsdWUpO1xufVxuZXhwb3J0cy5nZXQgPSBnZXQ7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wYXRoLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQ2FjaGVJdGVtXzEgPSByZXF1aXJlKFwiLi9DYWNoZUl0ZW1cIik7XG52YXIgY2FjaGVfMSA9IHJlcXVpcmUoXCIuL2NhY2hlXCIpO1xuZXhwb3J0cy5pc09uQ2FjaGUgPSBmdW5jdGlvbiAoZW50aXR5LCBpbnN0YW5jZSkge1xuICAgIHZhciBjYWNoZWRJdGVtID0gZXhwb3J0cy5nZXRDYWNoZWRJdGVtKGVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSwgaW5zdGFuY2UpO1xuICAgIHJldHVybiBjYWNoZWRJdGVtICYmIGNhY2hlZEl0ZW0uZW50aXR5ID09PSBlbnRpdHk7XG59O1xuZXhwb3J0cy5pc09uRmx1c2hNYXAgPSBmdW5jdGlvbiAoZW50aXR5LCBmbHVzaE1hcCkge1xuICAgIHJldHVybiAhIWZsdXNoTWFwLmdldChlbnRpdHlbY2FjaGVfMS5jb25maWcudWlkXSk7XG59O1xuZXhwb3J0cy5nZXRDYWNoZWRJdGVtID0gZnVuY3Rpb24gKHVpZCwgaW5zdGFuY2UpIHtcbiAgICB2YXIgY3VycmVudE5vZGUgPSBnZXRDdXJyZW50Tm9kZShpbnN0YW5jZSk7XG4gICAgcmV0dXJuIGN1cnJlbnROb2RlID8gY3VycmVudE5vZGUuaXRlbXMuZ2V0KFN0cmluZyh1aWQpKSA6IHVuZGVmaW5lZDtcbn07XG5leHBvcnRzLmdldEl0ZW1GbHVzaE9yQ2FjaGVkID0gZnVuY3Rpb24gKHVpZCwgZmx1c2hBcmdzKSB7XG4gICAgaWYgKHVpZCkge1xuICAgICAgICB1aWQgPSBTdHJpbmcodWlkKTtcbiAgICAgICAgdmFyIGl0ZW0gPSBmbHVzaEFyZ3MuZmx1c2hNYXAuZ2V0KHVpZCk7XG4gICAgICAgIGlmICghaXRlbSkge1xuICAgICAgICAgICAgaXRlbSA9IGV4cG9ydHMuZ2V0Q2FjaGVkSXRlbSh1aWQsIGZsdXNoQXJncy5pbnN0YW5jZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0gJiYgT2JqZWN0LmlzRnJvemVuKGl0ZW0pKSB7XG4gICAgICAgICAgICBpdGVtID0gaXRlbS5jbG9uZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cbn07XG5mdW5jdGlvbiBnZXRDdXJyZW50Tm9kZShpbnN0YW5jZSkge1xuICAgIHZhciBjdXJyZW50Tm9kZUlkID0gaW5zdGFuY2UudGhyZWFkLm5vZGVzW2luc3RhbmNlLnRocmVhZC5jdXJyZW50XTtcbiAgICByZXR1cm4gY3VycmVudE5vZGVJZCA+PSAwID8gZ2V0UmVwb05vZGUoY3VycmVudE5vZGVJZCwgaW5zdGFuY2UucmVwbykgOiB1bmRlZmluZWQ7XG59XG5mdW5jdGlvbiBnZXRSZXBvTm9kZShub2RlSWQsIHJlcG8pIHtcbiAgICByZXR1cm4gcmVwby5nZXQobm9kZUlkKTtcbn1cbmV4cG9ydHMuZ2V0Q2FjaGVDdXJyZW50U3RhY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICB2YXIgY3VycmVudE5vZGUgPSBnZXRDdXJyZW50Tm9kZShpbnN0YW5jZSk7XG4gICAgcmV0dXJuIGN1cnJlbnROb2RlID8gY3VycmVudE5vZGUuaXRlbXMgOiB1bmRlZmluZWQ7XG59O1xuZXhwb3J0cy5lbnN1cmVPbkZsdXNoTWFwID0gZnVuY3Rpb24gKGVudGl0eSwgZmx1c2hBcmdzKSB7XG4gICAgdmFyIGVudGl0eVVpZCA9IFN0cmluZyhlbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV0pO1xuICAgIGlmICghZmx1c2hBcmdzLmZsdXNoTWFwLmhhcyhlbnRpdHlVaWQpKSB7XG4gICAgICAgIGV4cG9ydHMuZW5zdXJlSXRlbShlbnRpdHksIGZsdXNoQXJncyk7XG4gICAgfVxufTtcbmV4cG9ydHMuZW5zdXJlSXRlbSA9IGZ1bmN0aW9uIChlbnRpdHksIGZsdXNoQXJncykge1xuICAgIHZhciBpdGVtVWlkID0gU3RyaW5nKGVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSk7XG4gICAgdmFyIGl0ZW0gPSBmbHVzaEFyZ3MuZmx1c2hNYXAuZ2V0KGl0ZW1VaWQpO1xuICAgIGlmIChpdGVtKSB7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cbiAgICB2YXIgbGl2ZSA9IGV4cG9ydHMuZ2V0Q2FjaGVkSXRlbShpdGVtVWlkLCBmbHVzaEFyZ3MuaW5zdGFuY2UpO1xuICAgIGl0ZW0gPSBuZXcgQ2FjaGVJdGVtXzEuZGVmYXVsdChlbnRpdHksIGxpdmUpO1xuICAgIGZsdXNoQXJncy5mbHVzaE1hcC5zZXQoaXRlbVVpZCwgaXRlbSk7XG4gICAgZmx1c2hBcmdzLmZsdXNoTWFwWydfX1VQREFURURfXyddID0gdHJ1ZTtcbiAgICByZXR1cm4gaXRlbTtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9jYWNoZVV0aWwudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBDYWNoZU1hcF8xID0gcmVxdWlyZShcIi4vQ2FjaGVNYXBcIik7XG52YXIgQ2FjaGVJdGVtID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDYWNoZUl0ZW0oZW50aXR5LCBsaXZlSXRlbSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmNsb25lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBDYWNoZUl0ZW0oX3RoaXMuZW50aXR5LCBfdGhpcyk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZW50aXR5ID0gZW50aXR5O1xuICAgICAgICBpZiAobGl2ZUl0ZW0pIHtcbiAgICAgICAgICAgIHRoaXMubWFwRnJvbSA9IGxpdmVJdGVtLm1hcEZyb20uY2xvbmUoKTtcbiAgICAgICAgICAgIHRoaXMubWFwVG8gPSBsaXZlSXRlbS5tYXBUby5jbG9uZSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tYXBGcm9tID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5tYXBUbyA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gQ2FjaGVJdGVtO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IENhY2hlSXRlbTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NhY2hlSXRlbS50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIENhY2hlTWFwXzEgPSByZXF1aXJlKFwiLi9DYWNoZU1hcFwiKTtcbnZhciBjYWNoZVV0aWxfMSA9IHJlcXVpcmUoXCIuL2NhY2hlVXRpbFwiKTtcbnZhciBjYWNoZV8xID0gcmVxdWlyZShcIi4vY2FjaGVcIik7XG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbmV4cG9ydHMucHJlRmx1c2ggPSBmdW5jdGlvbiAoZmx1c2hBcmdzLCBpbnN0YW5jZSkge1xuICAgIHZhciB0ZW1wID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgIHZhciBjdXJyZW50U3RhY2sgPSBjYWNoZVV0aWxfMS5nZXRDYWNoZUN1cnJlbnRTdGFjayhpbnN0YW5jZSk7XG4gICAgaWYgKGN1cnJlbnRTdGFjaykge1xuICAgICAgICBjdXJyZW50U3RhY2suZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgICAgICB0ZW1wLnNldChrZXksIGl0ZW0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZmx1c2hBcmdzLmZsdXNoTWFwLmZvckVhY2goZnVuY3Rpb24gKGtleSwgaXRlbSkge1xuICAgICAgICB2YXIgaXRlbVVpZCA9IGl0ZW0uZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgICAgICBfZnJlZXplSXRlbShpdGVtKTtcbiAgICAgICAgdGVtcC5zZXQoU3RyaW5nKGl0ZW1VaWQpLCBpdGVtKTtcbiAgICB9KTtcbiAgICBpZiAoZmx1c2hBcmdzLmV2aWN0TWFwLnNpemUoKSA+IDApIHtcbiAgICAgICAgZmx1c2hBcmdzLmV2aWN0TWFwLmZvckVhY2goZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHRlbXAuZGVsZXRlKFN0cmluZyhrZXkpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGV4cG9ydHMuZmx1c2godGVtcCwgaW5zdGFuY2UpO1xufTtcbnZhciBfZnJlZXplSXRlbSA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgT2JqZWN0LmZyZWV6ZShpdGVtKTtcbiAgICBPYmplY3QuZnJlZXplKGl0ZW0uZW50aXR5KTtcbiAgICBPYmplY3QuZnJlZXplKGl0ZW0ubWFwVG8pO1xuICAgIE9iamVjdC5mcmVlemUoaXRlbS5tYXBGcm9tKTtcbn07XG5leHBvcnRzLmZsdXNoID0gZnVuY3Rpb24gKHRlbXAsIGluc3RhbmNlKSB7XG4gICAgaWYgKHRlbXAgIT09IG51bGwpIHtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZSh0ZW1wKTtcbiAgICAgICAgdmFyIGNhY2hlTm9kZSA9IHV0aWxfMS5nZXROZXdDYWNoZU5vZGUoaW5zdGFuY2UpO1xuICAgICAgICBjYWNoZU5vZGUuaXRlbXMgPSB0ZW1wO1xuICAgICAgICBpZiAoaW5zdGFuY2UudGhyZWFkLm5vZGVzLmluZGV4T2YoY2FjaGVOb2RlLmlkKSA8IDApIHtcbiAgICAgICAgICAgIGluc3RhbmNlLnRocmVhZC5ub2Rlcy5wdXNoKGNhY2hlTm9kZS5pZCk7XG4gICAgICAgICAgICBpbnN0YW5jZS50aHJlYWQuY3VycmVudCArPSAxO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2ZsdXNoLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbnZhciBjYWNoZVV0aWxfMSA9IHJlcXVpcmUoXCIuL2NhY2hlVXRpbFwiKTtcbnZhciByZWZfMSA9IHJlcXVpcmUoXCIuL3JlZlwiKTtcbnZhciBjYWNoZV8xID0gcmVxdWlyZShcIi4vY2FjaGVcIik7XG5leHBvcnRzLnBhcnNlID0gZnVuY3Rpb24gKGVudGl0eSwgZmx1c2hBcmdzKSB7XG4gICAgaWYgKHV0aWxfMS5oYXNVaWQoZW50aXR5KSkge1xuICAgICAgICBpZiAoY2FjaGVVdGlsXzEuaXNPbkNhY2hlKGVudGl0eSwgZmx1c2hBcmdzLmluc3RhbmNlKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgX2FkZFRvRmx1c2hNYXAoZW50aXR5LCBmbHVzaEFyZ3MpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKHV0aWxfMS5pc0FycmF5KGVudGl0eSkpIHtcbiAgICAgICAgICAgIF9wYXJzZUFycmF5KGVudGl0eSwgbnVsbCwgW10sIGZsdXNoQXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodXRpbF8xLmlzT2JqZWN0KGVudGl0eSkpIHtcbiAgICAgICAgICAgIF9wYXJzZU9iamVjdChlbnRpdHksIG51bGwsIFtdLCBmbHVzaEFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxufTtcbnZhciBfYWRkVG9GbHVzaE1hcCA9IGZ1bmN0aW9uIChlbnRpdHksIGZsdXNoQXJncykge1xuICAgIGNhY2hlVXRpbF8xLmVuc3VyZU9uRmx1c2hNYXAoZW50aXR5LCBmbHVzaEFyZ3MpO1xuICAgIF9wYXJzZUVudGl0eShlbnRpdHksIGVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSwgW10sIGZsdXNoQXJncyk7XG4gICAgcmVmXzEudXBkYXRlUmVmVG9zKFN0cmluZyhlbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV0pLCBmbHVzaEFyZ3MpO1xufTtcbnZhciBfcGFyc2VFbnRpdHkgPSBmdW5jdGlvbiAoZW50aXR5LCBwYXJlbnRVaWQsIHBhdGgsIGZsdXNoQXJncykge1xuICAgIGlmIChwYXRoID09PSB2b2lkIDApIHsgcGF0aCA9IFtdOyB9XG4gICAgZm9yICh2YXIga2V5IGluIGVudGl0eSkge1xuICAgICAgICBpZiAoZW50aXR5Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIHZhciByZWYgPSBlbnRpdHlba2V5XTtcbiAgICAgICAgICAgIGlmICh1dGlsXzEuaXNBcnJheShyZWYpKSB7XG4gICAgICAgICAgICAgICAgX3BhcnNlQXJyYXkocmVmLCBwYXJlbnRVaWQsIHBhdGguY29uY2F0KFtrZXldKSwgZmx1c2hBcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHV0aWxfMS5pc09iamVjdChyZWYpKSB7XG4gICAgICAgICAgICAgICAgX3BhcnNlT2JqZWN0KHJlZiwgcGFyZW50VWlkLCBwYXRoLmNvbmNhdChba2V5XSksIGZsdXNoQXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBPYmplY3QuZnJlZXplKHJlZik7XG4gICAgICAgIH1cbiAgICB9XG59O1xudmFyIF9wYXJzZUFycmF5ID0gZnVuY3Rpb24gKGFyciwgcGFyZW50VWlkLCBwYXRoLCBmbHVzaEFyZ3MpIHtcbiAgICBpZiAocGF0aCA9PT0gdm9pZCAwKSB7IHBhdGggPSBbXTsgfVxuICAgIGFyci5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xuICAgICAgICBpZiAodXRpbF8xLmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgICAgICAgIF9wYXJzZUFycmF5KGl0ZW0sIHBhcmVudFVpZCwgcGF0aC5jb25jYXQoW2luZGV4XSksIGZsdXNoQXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodXRpbF8xLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICAgICAgICBfcGFyc2VPYmplY3QoaXRlbSwgcGFyZW50VWlkLCBwYXRoLmNvbmNhdChbaW5kZXhdKSwgZmx1c2hBcmdzKTtcbiAgICAgICAgfVxuICAgIH0pO1xufTtcbnZhciBfcGFyc2VPYmplY3QgPSBmdW5jdGlvbiAob2JqLCBwYXJlbnRVaWQsIHBhdGgsIGZsdXNoQXJncykge1xuICAgIGlmICh1dGlsXzEuaGFzVWlkKG9iaikpIHtcbiAgICAgICAgX2NhY2hlVWlkT2JqKG9iaiwgcGFyZW50VWlkLCBwYXRoLCBmbHVzaEFyZ3MpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgX3BhcnNlRW50aXR5KG9iaiwgcGFyZW50VWlkLCBwYXRoLCBmbHVzaEFyZ3MpO1xuICAgIH1cbn07XG52YXIgX2NhY2hlVWlkT2JqID0gZnVuY3Rpb24gKGVudGl0eSwgcGFyZW50VWlkLCBwYXRoLCBmbHVzaEFyZ3MpIHtcbiAgICB2YXIgaXRlbSA9IGNhY2hlVXRpbF8xLmVuc3VyZUl0ZW0oZW50aXR5LCBmbHVzaEFyZ3MpO1xuICAgIGlmIChwYXJlbnRVaWQpXG4gICAgICAgIHJlZl8xLmFzc2lnblJlZlRvUGFyZW50KGl0ZW0sIHBhcmVudFVpZCwgcGF0aCwgZmx1c2hBcmdzKTtcbiAgICBpZiAoY2FjaGVVdGlsXzEuaXNPbkNhY2hlKGVudGl0eSwgZmx1c2hBcmdzLmluc3RhbmNlKVxuICAgICAgICB8fCBjYWNoZVV0aWxfMS5pc09uRmx1c2hNYXAoZW50aXR5LCBmbHVzaEFyZ3MuZmx1c2hNYXApKVxuICAgICAgICByZXR1cm47XG4gICAgZXhwb3J0cy5wYXJzZShlbnRpdHksIGZsdXNoQXJncyk7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcGFyc2UudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBjYWNoZV8xID0gcmVxdWlyZShcIi4vY2FjaGVcIik7XG5leHBvcnRzLnByaW50Q2FjaGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICB2YXIgcmVzdWx0ID0gXCJcIjtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBjdXJyZW50ID0gaW5zdGFuY2UudGhyZWFkLmN1cnJlbnQ7XG4gICAgdmFyIG5vZGVJbmRpY2VzID0gaW5zdGFuY2UudGhyZWFkLm5vZGVzO1xuICAgIG5vZGVJbmRpY2VzLm1hcChmdW5jdGlvbiAoY2FjaGVOb2RlSWQpIHtcbiAgICAgICAgdmFyIGNhY2hlTm9kZSA9IGluc3RhbmNlLnJlcG8uZ2V0KGNhY2hlTm9kZUlkKTtcbiAgICAgICAgdmFyIHN0cmVhbURhdGEgPSBcIlwiO1xuICAgICAgICB2YXIgc3RhdGUgPSBpbmRleCArIFwiOlwiICsgc3RyZWFtRGF0YSArIFwiW1wiICsgc3RyaW5naWZ5TWFwKGNhY2hlTm9kZS5pdGVtcykgKyBcIl1cXG5cXG5cIjtcbiAgICAgICAgaWYgKGluZGV4ID09PSBjdXJyZW50KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IFwiLT4gXCIgKyBzdGF0ZTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgKz0gc3RhdGU7XG4gICAgICAgIGluZGV4Kys7XG4gICAgfSk7XG4gICAgcmVzdWx0ID0gcmVzdWx0LnN1YnN0cmluZygwLCAocmVzdWx0Lmxlbmd0aCAtIDIpKTtcbiAgICBpbmRleCA9IDA7XG4gICAgcmV0dXJuIFwiXFxuLS0tLS0tIE9uZSAtLS0tLS0tXCJcbiAgICAgICAgKyBcIlxcblNUQUNLOlxcblwiICsgcmVzdWx0XG4gICAgICAgICsgXCJcXG5cXG5DT05GSUc6XCIgKyBKU09OLnN0cmluZ2lmeShjYWNoZV8xLmNvbmZpZywgbnVsbCwgMilcbiAgICAgICAgKyBcIlxcblxcblJFUE8gU0laRTpcIiArIGluc3RhbmNlLnJlcG8ubGVuZ3RoXG4gICAgICAgICsgXCJcXG49PT09PT09PT09PT09PT09PT09XFxuXCI7XG59O1xudmFyIHN0cmluZ2lmeU1hcCA9IGZ1bmN0aW9uIChtYXApIHtcbiAgICB2YXIgcmVzdWx0ID0gXCJcIjtcbiAgICBtYXAuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgIHZhciBpdGVtUmVzdWx0ID0gSlNPTi5zdHJpbmdpZnkoaXRlbSwgbnVsbCwgMik7XG4gICAgICAgIHJlc3VsdCArPSBpdGVtUmVzdWx0ICsgXCIsXFxuXCI7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wcmludC50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIENhY2hlUmVwb18xID0gcmVxdWlyZShcIi4vQ2FjaGVSZXBvXCIpO1xudmFyIENhY2hlVGhyZWFkXzEgPSByZXF1aXJlKFwiLi9DYWNoZVRocmVhZFwiKTtcbnZhciBDYWNoZUluc3RhbmNlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDYWNoZUluc3RhbmNlKG5hbWUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5yZXBvID0gbmV3IENhY2hlUmVwb18xLmRlZmF1bHQoKTtcbiAgICAgICAgdGhpcy50aHJlYWQgPSBuZXcgQ2FjaGVUaHJlYWRfMS5kZWZhdWx0KCk7XG4gICAgICAgIHRoaXMubmV4dE5vZGVLZXkgPSAwO1xuICAgICAgICB0aGlzLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMucmVwbyA9IG5ldyBDYWNoZVJlcG9fMS5kZWZhdWx0KCk7XG4gICAgICAgICAgICBfdGhpcy50aHJlYWQgPSBuZXcgQ2FjaGVUaHJlYWRfMS5kZWZhdWx0KCk7XG4gICAgICAgICAgICBfdGhpcy5uZXh0Tm9kZUtleSA9IDA7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYWRkTm9kZSA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMucmVwby5hZGQobm9kZSkpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy50aHJlYWQuYWRkTm9kZShub2RlLmlkKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5uZXh0Tm9kZUtleSsrO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmxlbmd0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy50aHJlYWQubm9kZXMubGVuZ3RoO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMucmVwby5sZW5ndGg7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgfVxuICAgIHJldHVybiBDYWNoZUluc3RhbmNlO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IENhY2hlSW5zdGFuY2U7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DYWNoZUluc3RhbmNlLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQ2FjaGVNYXBfMSA9IHJlcXVpcmUoXCIuL0NhY2hlTWFwXCIpO1xudmFyIENhY2hlUmVwbyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2FjaGVSZXBvKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLml0ZW1zID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmxlbmd0aCA9IDA7XG4gICAgICAgIHRoaXMuZ2V0ID0gZnVuY3Rpb24gKG5vZGVJZCkgeyByZXR1cm4gKF90aGlzLml0ZW1zLmdldChub2RlSWQpKTsgfTtcbiAgICAgICAgdGhpcy5hZGQgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgaWYgKCFfdGhpcy5pdGVtcy5oYXMobm9kZS5pZCkpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5pdGVtcy5zZXQobm9kZS5pZCwgbm9kZSk7XG4gICAgICAgICAgICAgICAgX3RoaXMubGVuZ3RoKys7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZGVsZXRlID0gZnVuY3Rpb24gKG5vZGVJZCkge1xuICAgICAgICAgICAgaWYgKF90aGlzLml0ZW1zLmhhcyhub2RlSWQpKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuaXRlbXMuZGVsZXRlKG5vZGVJZCk7XG4gICAgICAgICAgICAgICAgX3RoaXMubGVuZ3RoLS07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBDYWNoZVJlcG87XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ2FjaGVSZXBvO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2FjaGVSZXBvLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQ2FjaGVUaHJlYWQgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENhY2hlVGhyZWFkKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSAtMTtcbiAgICAgICAgdGhpcy5ub2RlcyA9IFtdO1xuICAgICAgICB0aGlzLmFkZE5vZGUgPSBmdW5jdGlvbiAobm9kZUlkKSB7XG4gICAgICAgICAgICBfdGhpcy5ub2Rlcy5wdXNoKG5vZGVJZCk7XG4gICAgICAgICAgICBfdGhpcy5jdXJyZW50Kys7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBDYWNoZVRocmVhZDtcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDYWNoZVRocmVhZDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NhY2hlVGhyZWFkLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgY2FjaGVfMSA9IHJlcXVpcmUoXCIuL2NhY2hlXCIpO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG52YXIgY2FjaGVVdGlsXzEgPSByZXF1aXJlKFwiLi9jYWNoZVV0aWxcIik7XG5leHBvcnRzLmdldEl0ZW0gPSBmdW5jdGlvbiAoZW50aXR5LCBpbnN0YW5jZSwgbm9kZUlkKSB7XG4gICAgaWYgKCFlbnRpdHkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9uZSBnZXQoKTogcmVxdWlyZXMgYSB1aWQgdG8gcmV0cmlldmUgYW4gaXRlbSBmcm9tIHRoZSBjYWNoZS5cIik7XG4gICAgfVxuICAgIGlmICh1dGlsXzEuaXNBcnJheShlbnRpdHkpKSB7XG4gICAgICAgIHJldHVybiBlbnRpdHkubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0T2JqZWN0KGl0ZW0sIGluc3RhbmNlKTtcbiAgICAgICAgfSkuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbSAhPT0gbnVsbCAmJiBpdGVtICE9PSB1bmRlZmluZWQ7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZ2V0T2JqZWN0KGVudGl0eSwgaW5zdGFuY2UpO1xufTtcbnZhciBnZXRPYmplY3QgPSBmdW5jdGlvbiAodWlkT3JFbnRpdHksIGluc3RhbmNlKSB7XG4gICAgdmFyIHJlYWxVaWQgPSBnZXRBY3R1YWxVaWQodWlkT3JFbnRpdHkpO1xuICAgIGlmICghcmVhbFVpZCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBpdGVtID0gY2FjaGVVdGlsXzEuZ2V0Q2FjaGVkSXRlbShyZWFsVWlkLCBpbnN0YW5jZSk7XG4gICAgcmV0dXJuIGl0ZW0gPyBpdGVtLmVudGl0eSA6IHVuZGVmaW5lZDtcbn07XG5leHBvcnRzLmdldEVkaXRJdGVtID0gZnVuY3Rpb24gKG9iaiwgaW5zdGFuY2UsIG5vZGVJZCkge1xuICAgIGlmICh1dGlsXzEuaXNBcnJheShvYmopKSB7XG4gICAgICAgIHJldHVybiBvYmoubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0RWRpdGFibGVPYmplY3QoaXRlbSwgaW5zdGFuY2UpO1xuICAgICAgICB9KS5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtICE9PSBudWxsICYmIGl0ZW0gIT09IHVuZGVmaW5lZDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBnZXRFZGl0YWJsZU9iamVjdChvYmosIGluc3RhbmNlKTtcbn07XG52YXIgZ2V0RWRpdGFibGVPYmplY3QgPSBmdW5jdGlvbiAodWlkT3JFbnRpdHksIGluc3RhbmNlKSB7XG4gICAgdmFyIHJlYWxVaWQgPSBnZXRBY3R1YWxVaWQodWlkT3JFbnRpdHkpO1xuICAgIHZhciBleGlzdGluZyA9IGV4cG9ydHMuZ2V0SXRlbShyZWFsVWlkLCBpbnN0YW5jZSk7XG4gICAgcmV0dXJuIGV4aXN0aW5nID8gdXRpbF8xLmRlZXBDbG9uZShleGlzdGluZywgdW5kZWZpbmVkLCBmYWxzZSkgOiB1bmRlZmluZWQ7XG59O1xudmFyIGdldEFjdHVhbFVpZCA9IGZ1bmN0aW9uICh1aWRPckVudGl0eSkge1xuICAgIGlmICh0eXBlb2YgdWlkT3JFbnRpdHkgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgcmV0dXJuIHVpZE9yRW50aXR5O1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgdWlkT3JFbnRpdHkgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZyh1aWRPckVudGl0eSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHV0aWxfMS5pc09iamVjdCh1aWRPckVudGl0eSkpIHtcbiAgICAgICAgaWYgKHV0aWxfMS5oYXNVaWQodWlkT3JFbnRpdHkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdWlkT3JFbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV07XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZ2V0LnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbnZhciBjYWNoZV8xID0gcmVxdWlyZShcIi4vY2FjaGVcIik7XG52YXIgZ2V0XzEgPSByZXF1aXJlKFwiLi9nZXRcIik7XG52YXIgQ2FjaGVNYXBfMSA9IHJlcXVpcmUoXCIuL0NhY2hlTWFwXCIpO1xudmFyIG9wYXRoID0gcmVxdWlyZShcIi4vcGF0aFwiKTtcbnZhciBsb2NhdGVfMSA9IHJlcXVpcmUoXCIuL2xvY2F0ZVwiKTtcbnZhciByZWZfMSA9IHJlcXVpcmUoXCIuL3JlZlwiKTtcbnZhciBjYWNoZVV0aWxfMSA9IHJlcXVpcmUoXCIuL2NhY2hlVXRpbFwiKTtcbnZhciBmbHVzaF8xID0gcmVxdWlyZShcIi4vZmx1c2hcIik7XG52YXIgcGFyc2VfMSA9IHJlcXVpcmUoXCIuL3BhcnNlXCIpO1xuZXhwb3J0cy5ldmljdEl0ZW0gPSBmdW5jdGlvbiAob2JqLCBpbnN0YW5jZSkge1xuICAgIHZhciB1aWRBcnJheSA9IGJ1aWxkRXZpY3RVaWRBcnJheShvYmopO1xuICAgIGlmICh1aWRBcnJheS5sZW5ndGggPT0gMCkge1xuICAgICAgICByZXR1cm4gbG9jYXRlXzEuZ2V0Q2FsbFN0YXRzKGZhbHNlLCBpbnN0YW5jZSk7XG4gICAgfVxuICAgIHZhciBjdXJyZW50U3RhdGUgPSBjYWNoZVV0aWxfMS5nZXRDYWNoZUN1cnJlbnRTdGFjayhpbnN0YW5jZSk7XG4gICAgdmFyIGZvdW5kID0gdWlkQXJyYXkuc29tZShmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICByZXR1cm4gY3VycmVudFN0YXRlICYmIGN1cnJlbnRTdGF0ZS5oYXMoU3RyaW5nKGl0ZW0pKTtcbiAgICB9KTtcbiAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgIHJldHVybiBsb2NhdGVfMS5nZXRDYWxsU3RhdHMoZmFsc2UsIGluc3RhbmNlKTtcbiAgICB9XG4gICAgdmFyIHRlbXBTdGF0ZSA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICBjdXJyZW50U3RhdGUuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICB0ZW1wU3RhdGUuc2V0KGtleSwgdmFsdWUpO1xuICAgIH0pO1xuICAgIHZhciBmbHVzaE1hcCA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICB2YXIgZXZpY3RNYXAgPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgdmFyIGZsdXNoQXJncyA9IHtcbiAgICAgICAgZmx1c2hNYXA6IGZsdXNoTWFwLFxuICAgICAgICBldmljdE1hcDogZXZpY3RNYXAsXG4gICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZVxuICAgIH07XG4gICAgdmFyIHBhcmVudHNDaGFuZ2VkID0gW107XG4gICAgdWlkQXJyYXkuZm9yRWFjaChmdW5jdGlvbiAodWlkKSB7XG4gICAgICAgIGNsZWFyVGFyZ2V0UmVmRnJvbXModWlkLCBmbHVzaEFyZ3MpO1xuICAgICAgICBldmljdE1hcC5zZXQodWlkLCBudWxsKTtcbiAgICAgICAgY2xlYXJQYXJlbnRSZWZUb3ModWlkLCB1aWRBcnJheSwgcGFyZW50c0NoYW5nZWQsIGZsdXNoQXJncyk7XG4gICAgfSk7XG4gICAgcHV0UGFyZW50c0NoYW5nZWQocGFyZW50c0NoYW5nZWQsIGZsdXNoTWFwLCBldmljdE1hcCwgaW5zdGFuY2UpO1xuICAgIGZsdXNoTWFwLmZvckVhY2goZnVuY3Rpb24gKGtleSwgaXRlbSkge1xuICAgICAgICB0ZW1wU3RhdGUuc2V0KGtleSwgaXRlbSk7XG4gICAgfSk7XG4gICAgZXZpY3RNYXAuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgIHRlbXBTdGF0ZS5kZWxldGUoa2V5KTtcbiAgICB9KTtcbiAgICBmbHVzaF8xLmZsdXNoKHRlbXBTdGF0ZSwgaW5zdGFuY2UpO1xuICAgIHJldHVybiBsb2NhdGVfMS5nZXRDYWxsU3RhdHModHJ1ZSwgaW5zdGFuY2UpO1xufTtcbnZhciBwdXRQYXJlbnRzQ2hhbmdlZCA9IGZ1bmN0aW9uIChwYXJlbnRzQ2hhbmdlZCwgZmx1c2hNYXAsIGV2aWN0TWFwLCBpbnN0YW5jZSkge1xuICAgIGlmIChwYXJlbnRzQ2hhbmdlZCAmJiBwYXJlbnRzQ2hhbmdlZC5sZW5ndGggPiAwICYmIHV0aWxfMS5jYWNoZVNpemUoaW5zdGFuY2UpID4gMCkge1xuICAgICAgICB2YXIgZmx1c2hBcmdzXzEgPSB7XG4gICAgICAgICAgICBmbHVzaE1hcDogZmx1c2hNYXAsXG4gICAgICAgICAgICBldmljdE1hcDogZXZpY3RNYXAsXG4gICAgICAgICAgICBpbnN0YW5jZTogaW5zdGFuY2VcbiAgICAgICAgfTtcbiAgICAgICAgcGFyc2VfMS5wYXJzZShwYXJlbnRzQ2hhbmdlZCwgZmx1c2hBcmdzXzEpO1xuICAgICAgICBmbHVzaEFyZ3NfMS5mbHVzaE1hcC5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIGl0ZW0pIHtcbiAgICAgICAgICAgIHJlZl8xLnVwZGF0ZVJlZkZyb21zKGl0ZW0sIGZsdXNoQXJnc18xKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbnZhciBjbGVhclRhcmdldFJlZkZyb21zID0gZnVuY3Rpb24gKGVudGl0eVVpZCwgZmx1c2hBcmdzKSB7XG4gICAgdmFyIGl0ZW0gPSBjYWNoZVV0aWxfMS5nZXRDYWNoZWRJdGVtKGVudGl0eVVpZCwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICBpZiAoaXRlbSkge1xuICAgICAgICBpdGVtLm1hcFRvLmZvckVhY2goZnVuY3Rpb24gKHRvVWlkLCBwYXRocykge1xuICAgICAgICAgICAgdmFyIHJlZkl0ZW0gPSBjYWNoZVV0aWxfMS5nZXRJdGVtRmx1c2hPckNhY2hlZCh0b1VpZCwgZmx1c2hBcmdzKTtcbiAgICAgICAgICAgIGlmIChyZWZJdGVtKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJSZWZGcm9tKHJlZkl0ZW0sIGVudGl0eVVpZCk7XG4gICAgICAgICAgICAgICAgaWYgKHJlZkl0ZW0ubWFwRnJvbS5zaXplKCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5VWlkID0gdG9VaWQ7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGFyZ2V0UmVmRnJvbXMoZW50aXR5VWlkLCBmbHVzaEFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZXZpY3RNYXAuc2V0KHRvVWlkLCByZWZJdGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZsdXNoQXJncy5mbHVzaE1hcC5zZXQodG9VaWQsIHJlZkl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcbnZhciBjbGVhclJlZkZyb20gPSBmdW5jdGlvbiAocmVmSXRlbSwgcGFyZW50VWlkKSB7XG4gICAgdmFyIHJlZnNBcnJheSA9IHJlZkl0ZW0ubWFwRnJvbS5nZXQocGFyZW50VWlkKTtcbiAgICBpZiAoIXJlZnNBcnJheSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlZkl0ZW0ubWFwRnJvbSA9IHJlZkl0ZW0ubWFwRnJvbS5jbG9uZSgpO1xuICAgIHJlZkl0ZW0ubWFwRnJvbS5kZWxldGUocGFyZW50VWlkKTtcbn07XG52YXIgY2xlYXJQYXJlbnRSZWZUb3MgPSBmdW5jdGlvbiAoZW50aXR5VWlkLCB1aWRBcnJheSwgcGFyZW50c0NoYW5nZWQsIGZsdXNoQXJncykge1xuICAgIHZhciBpdGVtID0gY2FjaGVVdGlsXzEuZ2V0SXRlbUZsdXNoT3JDYWNoZWQoZW50aXR5VWlkLCBmbHVzaEFyZ3MpO1xuICAgIGlmIChpdGVtKSB7XG4gICAgICAgIGl0ZW0ubWFwRnJvbS5mb3JFYWNoKGZ1bmN0aW9uIChwYXJlbnRVaWQsIHBhdGhzKSB7XG4gICAgICAgICAgICB2YXIgcGFyZW50SXRlbSA9IGNhY2hlVXRpbF8xLmdldEl0ZW1GbHVzaE9yQ2FjaGVkKHBhcmVudFVpZCwgZmx1c2hBcmdzKTtcbiAgICAgICAgICAgIGlmIChwYXJlbnRJdGVtKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN1Y2Nlc3MgPSBjbGVhclJlZlRvKHBhcmVudEl0ZW0sIGVudGl0eVVpZCwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICBpZiAoc3VjY2VzcyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZmx1c2hNYXAuc2V0KHBhcmVudFVpZCwgcGFyZW50SXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1aWRBcnJheS5pbmRleE9mKHBhcmVudFVpZCkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRzQ2hhbmdlZC5wdXNoKHBhcmVudEl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59O1xudmFyIGNsZWFyUmVmVG8gPSBmdW5jdGlvbiAocGFyZW50SXRlbSwgcmVmVWlkLCBpbnN0YW5jZSkge1xuICAgIHZhciBwYXJlbnQgPSBwYXJlbnRJdGVtLmVudGl0eTtcbiAgICBpZiAoT2JqZWN0LmlzRnJvemVuKHBhcmVudCkpIHtcbiAgICAgICAgcGFyZW50ID0gZ2V0XzEuZ2V0RWRpdEl0ZW0ocGFyZW50W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdLCBpbnN0YW5jZSk7XG4gICAgICAgIHBhcmVudEl0ZW0uZW50aXR5ID0gcGFyZW50O1xuICAgIH1cbiAgICB2YXIgcmVmUGF0aHMgPSBwYXJlbnRJdGVtLm1hcFRvLmdldChyZWZVaWQpO1xuICAgIHJlZlBhdGhzLmZvckVhY2goZnVuY3Rpb24gKHBhdGgpIHtcbiAgICAgICAgb3BhdGguZGVsKHBhcmVudCwgcGF0aCk7XG4gICAgfSk7XG4gICAgaWYgKCFPYmplY3QuaXNGcm96ZW4ocGFyZW50KSkge1xuICAgICAgICBPYmplY3QuZnJlZXplKHBhcmVudCk7XG4gICAgfVxuICAgIHBhcmVudEl0ZW0uZW50aXR5ID0gcGFyZW50O1xuICAgIHBhcmVudEl0ZW0ubWFwVG8gPSBwYXJlbnRJdGVtLm1hcFRvLmNsb25lKCk7XG4gICAgcGFyZW50SXRlbS5tYXBUby5kZWxldGUocmVmVWlkKTtcbiAgICByZXR1cm4gdHJ1ZTtcbn07XG52YXIgYnVpbGRFdmljdFVpZEFycmF5ID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHZhciB1aWRBcnJheSA9IFtdO1xuICAgIGlmICh1dGlsXzEuaXNBcnJheShvYmopKSB7XG4gICAgICAgIG9iai5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICBpZiAodXRpbF8xLmhhc1VpZChpdGVtKSkge1xuICAgICAgICAgICAgICAgIHVpZEFycmF5LnB1c2goU3RyaW5nKGl0ZW1bY2FjaGVfMS5jb25maWcudWlkTmFtZV0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgaXRlbSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgICAgICB1aWRBcnJheS5wdXNoKFN0cmluZyhpdGVtKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHZhciB1aWQgPSBvYmo7XG4gICAgICAgIGlmICh1dGlsXzEuaXNPYmplY3Qob2JqKSkge1xuICAgICAgICAgICAgdWlkID0gb2JqW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1aWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHVpZEFycmF5O1xuICAgICAgICB9XG4gICAgICAgIHVpZEFycmF5LnB1c2goU3RyaW5nKHVpZCkpO1xuICAgIH1cbiAgICByZXR1cm4gdWlkQXJyYXk7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZXZpY3QudHMiXSwic291cmNlUm9vdCI6IiJ9