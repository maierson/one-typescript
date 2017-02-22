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
	var print_1 = __webpack_require__(15);
	var CacheInstance_1 = __webpack_require__(16);
	var util_1 = __webpack_require__(6);
	var get_1 = __webpack_require__(19);
	var evict_1 = __webpack_require__(20);
	var cacheUtil_1 = __webpack_require__(11);
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
	var ref_1 = __webpack_require__(9);
	var flush_1 = __webpack_require__(13);
	var parse_1 = __webpack_require__(14);
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
	
	var cache_1 = __webpack_require__(1);
	var CacheNode_1 = __webpack_require__(7);
	var locate_1 = __webpack_require__(5);
	var objectAssign = __webpack_require__(8);
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
	    var result = objectAssign({}, obj);
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
/***/ function(module, exports) {

	'use strict';
	/* eslint-disable no-unused-vars */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;
	
	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}
	
		return Object(val);
	}
	
	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}
	
			// Detect buggy property enumeration order in older V8 versions.
	
			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}
	
			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}
	
			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}
	
			return true;
		} catch (e) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}
	
	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;
	
		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);
	
			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}
	
			if (Object.getOwnPropertySymbols) {
				symbols = Object.getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}
	
		return to;
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var cache_1 = __webpack_require__(1);
	var opath = __webpack_require__(10);
	var util_1 = __webpack_require__(6);
	var cacheUtil_1 = __webpack_require__(11);
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
/* 10 */
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var CacheItem_1 = __webpack_require__(12);
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
/* 12 */
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
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var CacheMap_1 = __webpack_require__(4);
	var cacheUtil_1 = __webpack_require__(11);
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
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var util_1 = __webpack_require__(6);
	var cacheUtil_1 = __webpack_require__(11);
	var ref_1 = __webpack_require__(9);
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
/* 15 */
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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var CacheRepo_1 = __webpack_require__(17);
	var CacheThread_1 = __webpack_require__(18);
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
/* 17 */
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
/* 18 */
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
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var cache_1 = __webpack_require__(1);
	var util_1 = __webpack_require__(6);
	var cacheUtil_1 = __webpack_require__(11);
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
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var util_1 = __webpack_require__(6);
	var cache_1 = __webpack_require__(1);
	var get_1 = __webpack_require__(19);
	var CacheMap_1 = __webpack_require__(4);
	var opath = __webpack_require__(10);
	var locate_1 = __webpack_require__(5);
	var ref_1 = __webpack_require__(9);
	var cacheUtil_1 = __webpack_require__(11);
	var flush_1 = __webpack_require__(13);
	var parse_1 = __webpack_require__(14);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYWI2YTUzNTM0MzJlNzhkMTQzNzAiLCJ3ZWJwYWNrOi8vLy4vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vY2FjaGUudHMiLCJ3ZWJwYWNrOi8vLy4vY29uZmlnLnRzIiwid2VicGFjazovLy8uL3B1dC50cyIsIndlYnBhY2s6Ly8vLi9DYWNoZU1hcC50cyIsIndlYnBhY2s6Ly8vLi9sb2NhdGUudHMiLCJ3ZWJwYWNrOi8vLy4vdXRpbC50cyIsIndlYnBhY2s6Ly8vLi9DYWNoZU5vZGUudHMiLCJ3ZWJwYWNrOi8vLy4uL34vb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9yZWYudHMiLCJ3ZWJwYWNrOi8vLy4vcGF0aC50cyIsIndlYnBhY2s6Ly8vLi9jYWNoZVV0aWwudHMiLCJ3ZWJwYWNrOi8vLy4vQ2FjaGVJdGVtLnRzIiwid2VicGFjazovLy8uL2ZsdXNoLnRzIiwid2VicGFjazovLy8uL3BhcnNlLnRzIiwid2VicGFjazovLy8uL3ByaW50LnRzIiwid2VicGFjazovLy8uL0NhY2hlSW5zdGFuY2UudHMiLCJ3ZWJwYWNrOi8vLy4vQ2FjaGVSZXBvLnRzIiwid2VicGFjazovLy8uL0NhY2hlVGhyZWFkLnRzIiwid2VicGFjazovLy8uL2dldC50cyIsIndlYnBhY2s6Ly8vLi9ldmljdC50cyJdLCJuYW1lcyI6WyJjYWNoZV8xIiwicmVxdWlyZSIsImV4cG9ydHMiLCJnZXRDYWNoZSIsInB1dCIsImdldCIsImdldEVkaXQiLCJldmljdCIsInJlc2V0IiwidXVpZCIsInByaW50Iiwid2luZG93IiwiT25lIiwiY29uZmlnXzEiLCJwdXRfMSIsInByaW50XzEiLCJDYWNoZUluc3RhbmNlXzEiLCJ1dGlsXzEiLCJnZXRfMSIsImV2aWN0XzEiLCJjYWNoZVV0aWxfMSIsImluc3RhbmNlcyIsImNhY2hlVGVzdCIsInNldFRlc3RpbmciLCJ0ZXN0aW5nIiwiaW5zdGFuY2VOYW1lIiwiY29uZmlndXJhdGlvbiIsImRlZmF1bHRDb25maWciLCJjb25maWciLCJjb25maWd1cmUiLCJjcmVhdGVDYWNoZSIsInVuZGVmaW5lZCIsIml0ZW0iLCJlbnRpdHkiLCJub2RlSWQiLCJ1aWRPckVudGl0eU9yQXJyYXkiLCJsdXQiLCJpIiwidG9TdHJpbmciLCJkMCIsIk1hdGgiLCJyYW5kb20iLCJkMSIsImQyIiwiZDMiLCJuYW1lIiwiaW5zdGFuY2UiLCJkZWZhdWx0IiwicHV0SXRlbSIsImdldEl0ZW0iLCJnZXRFZGl0SXRlbSIsImV2aWN0SXRlbSIsInNpemUiLCJjYWNoZVNpemUiLCJsZW5ndGgiLCJjYWNoZUxlbmd0aCIsInByaW50Q2FjaGUiLCJyZXN1bHQiLCJyZWZUbyIsInVpZCIsImdldENhY2hlZEl0ZW0iLCJtYXBUbyIsInJlZkZyb20iLCJtYXBGcm9tIiwidWlkTmFtZSIsIm1heEhpc3RvcnlTdGF0ZXMiLCJjb25mIiwicCIsImhhc093blByb3BlcnR5IiwiQ2FjaGVNYXBfMSIsImxvY2F0ZV8xIiwicmVmXzEiLCJmbHVzaF8xIiwicGFyc2VfMSIsImlzQXJyYXkiLCJpc09iamVjdCIsImV2aWN0TWFwIiwiZmx1c2hNYXAiLCJmbHVzaEFyZ3MiLCJwYXJzZSIsInVwZGF0ZVBvaW50ZXJzIiwicHJlRmx1c2giLCJnZXRDYWxsU3RhdHMiLCJfX2Fzc2lnbiIsIk9iamVjdCIsImFzc2lnbiIsInQiLCJzIiwibiIsImFyZ3VtZW50cyIsInByb3RvdHlwZSIsImNhbGwiLCJDYWNoZU1hcCIsIl90aGlzIiwicGF0aHMiLCJrZXkiLCJkZWxldGUiLCJ2YWwiLCJoYXMiLCJmb3JFYWNoIiwiY2FsbGJhY2siLCJjbG9uZSIsInNldCIsInZhbHVlIiwiZGVmaW5lUHJvcGVydHkiLCJzdWNjZXNzIiwibm9kZSIsImN1cnJlbnROb2RlIiwiZ2V0Q3VycmVudE5vZGUiLCJpZCIsImlzTnVtYmVyIiwiVHlwZUVycm9yIiwiY2FjaGVOb2RlIiwiZ2V0UmVwb05vZGUiLCJ0aHJlYWQiLCJjdXJyZW50IiwiYmluYXJ5SW5kZXhPZiIsIm5vZGVzIiwiY3VycmVudE5vZGVJZCIsImNhY2hlTm9kZUlkIiwicmVwbyIsImFycmF5Iiwic2VhcmNoRWxlbWVudCIsIm1pbkluZGV4IiwibWF4SW5kZXgiLCJjdXJyZW50SW5kZXgiLCJjdXJyZW50RWxlbWVudCIsIkNhY2hlTm9kZV8xIiwib2JqZWN0QXNzaWduIiwiX2hhc093blByb3BlcnR5IiwiaXNTdHJpbmciLCJvYmoiLCJtaXhlZF92YXIiLCJpc0Z1bmN0aW9uIiwiQXJyYXkiLCJzcGxpY2UiLCJwcm9wZXJ0eUlzRW51bWVyYWJsZSIsIm9ialRvU3RyIiwibyIsImlzRGF0ZSIsImlzRW1wdHkiLCJnZXROZXdDYWNoZU5vZGUiLCJDYWNoZU5vZGUiLCJuZXh0Tm9kZUtleSIsImFkZCIsImhhc1VpZCIsIkZ1bmN0aW9uIiwidGFyZ2V0IiwiU1RSSVBfQ09NTUVOVFMiLCJBUkdVTUVOVF9OQU1FUyIsImdldFBhcmFtTmFtZXMiLCJmdW5jIiwiZm5TdHIiLCJyZXBsYWNlIiwic2xpY2UiLCJpbmRleE9mIiwibWF0Y2giLCJzdHJpbmdpZnkiLCJSZWdFeHAiLCJib2R5IiwidHJpbSIsInBhcmFtTmFtZXMiLCJiaW5kIiwiZGVlcENsb25lIiwidWlkUmVmZXJlbmNlIiwiZnJlZXplIiwiaXNGcm96ZW4iLCJwcm9wTmFtZSIsImRlZXBDbG9uZUFycmF5IiwiZGF0ZSIsIkRhdGUiLCJnZXRUaW1lIiwiYXJyIiwibWFwIiwiaXRlbXMiLCJvcGF0aCIsImFzc2lnblJlZlRvUGFyZW50IiwicmVmSXRlbSIsInBhcmVudFVpZCIsInBhdGgiLCJwYXJlbnRJdGVtIiwiZ2V0SXRlbUZsdXNoT3JDYWNoZWQiLCJhc3NpZ25SZWZzIiwicmVmVWlkIiwicmVmUGF0aCIsImpvaW4iLCJhZGRSZWZUbyIsImFkZFJlZkZyb20iLCJyZWZBcnJheSIsInB1c2giLCJmcm9tQXJyYXkiLCJ1cGRhdGVJdGVtUmVmVG9zIiwidXBkYXRlUmVmRnJvbXMiLCJmaXJzdFBhdGgiLCJ0YXJnZXRSZWYiLCJhcmdzIiwiZW5zdXJlSXRlbSIsInVwZGF0ZVJlZlRvcyIsImVudGl0eVVpZCIsInRvVWlkIiwidXBkYXRlZFBhdGhzIiwiZmlsdGVyIiwicmVmZXJlbmNlIiwiaGFzUmVmIiwiU3RyaW5nIiwicmVtb3ZlUmVmRnJvbV9WYWx1ZSIsInJlbW92ZVJlZkZyb20iLCJyZWZzQXJyYXkiLCJpbmRleCIsImdldEtleSIsImludEtleSIsInBhcnNlSW50IiwiZGVsIiwic3BsaXQiLCJjdXJyZW50UGF0aCIsIm9sZFZhbCIsImRlZmF1bHRWYWx1ZSIsIkNhY2hlSXRlbV8xIiwiaXNPbkNhY2hlIiwiY2FjaGVkSXRlbSIsImlzT25GbHVzaE1hcCIsImdldENhY2hlQ3VycmVudFN0YWNrIiwiZW5zdXJlT25GbHVzaE1hcCIsIml0ZW1VaWQiLCJsaXZlIiwiQ2FjaGVJdGVtIiwibGl2ZUl0ZW0iLCJ0ZW1wIiwiY3VycmVudFN0YWNrIiwiX2ZyZWV6ZUl0ZW0iLCJmbHVzaCIsIl9hZGRUb0ZsdXNoTWFwIiwiX3BhcnNlQXJyYXkiLCJfcGFyc2VPYmplY3QiLCJfcGFyc2VFbnRpdHkiLCJyZWYiLCJjb25jYXQiLCJfY2FjaGVVaWRPYmoiLCJub2RlSW5kaWNlcyIsInN0cmVhbURhdGEiLCJzdGF0ZSIsInN0cmluZ2lmeU1hcCIsInN1YnN0cmluZyIsIkpTT04iLCJpdGVtUmVzdWx0IiwiQ2FjaGVSZXBvXzEiLCJDYWNoZVRocmVhZF8xIiwiQ2FjaGVJbnN0YW5jZSIsImFkZE5vZGUiLCJDYWNoZVJlcG8iLCJDYWNoZVRocmVhZCIsImdldE9iamVjdCIsInVpZE9yRW50aXR5IiwicmVhbFVpZCIsImdldEFjdHVhbFVpZCIsImdldEVkaXRhYmxlT2JqZWN0IiwiZXhpc3RpbmciLCJ1aWRBcnJheSIsImJ1aWxkRXZpY3RVaWRBcnJheSIsImN1cnJlbnRTdGF0ZSIsImZvdW5kIiwic29tZSIsInRlbXBTdGF0ZSIsInBhcmVudHNDaGFuZ2VkIiwiY2xlYXJUYXJnZXRSZWZGcm9tcyIsImNsZWFyUGFyZW50UmVmVG9zIiwicHV0UGFyZW50c0NoYW5nZWQiLCJmbHVzaEFyZ3NfMSIsImNsZWFyUmVmRnJvbSIsImNsZWFyUmVmVG8iLCJwYXJlbnQiLCJyZWZQYXRocyJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7O0FBQ0EsS0FBSUEsVUFBVSxtQkFBQUMsQ0FBUSxDQUFSLENBQWQ7QUFDQUMsU0FBUUMsUUFBUixHQUFtQkgsUUFBUUcsUUFBM0I7QUFDQUQsU0FBUUUsR0FBUixHQUFjSixRQUFRSSxHQUF0QjtBQUNBRixTQUFRRyxHQUFSLEdBQWNMLFFBQVFLLEdBQXRCO0FBQ0FILFNBQVFJLE9BQVIsR0FBa0JOLFFBQVFNLE9BQTFCO0FBQ0FKLFNBQVFLLEtBQVIsR0FBZ0JQLFFBQVFPLEtBQXhCO0FBQ0FMLFNBQVFNLEtBQVIsR0FBZ0JSLFFBQVFRLEtBQXhCO0FBQ0FOLFNBQVFPLElBQVIsR0FBZVQsUUFBUVMsSUFBdkI7QUFDQVAsU0FBUVEsS0FBUixHQUFnQlYsUUFBUVUsS0FBeEI7QUFDQSxFQUFDLFlBQVk7QUFDVCxTQUFJLE9BQU9DLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUNBLFdBQVcsSUFBaEQsRUFBc0Q7QUFDbERBLGdCQUFPQyxHQUFQLEdBQWE7QUFDVFQsdUJBQVVILFFBQVFHLFFBRFQ7QUFFVEMsa0JBQUtKLFFBQVFJLEdBRko7QUFHVEMsa0JBQUtMLFFBQVFLLEdBSEo7QUFJVEMsc0JBQVNOLFFBQVFNLE9BSlI7QUFLVEMsb0JBQU9QLFFBQVFPLEtBTE47QUFNVEMsb0JBQU9SLFFBQVFRLEtBTk47QUFPVEMsbUJBQU1ULFFBQVFTLElBUEw7QUFRVEMsb0JBQU9WLFFBQVFVO0FBUk4sVUFBYjtBQVVIO0FBQ0osRUFiRCxJOzs7Ozs7QUNW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QWlCbUMsTUFBakIsQ0FBd0J1RixNQUF4QjtBQUNBLFlBQU8sSUFBUDtBQUNILEVBakJEO0FBa0JBLEtBQUkyRSxxQkFBcUIsVUFBVS9ILEdBQVYsRUFBZTtBQUNwQyxTQUFJOEgsV0FBVyxFQUFmO0FBQ0EsU0FBSWhQLE9BQU95RCxPQUFQLENBQWV5RCxHQUFmLENBQUosRUFBeUI7QUFDckJBLGFBQUloQyxPQUFKLENBQVksVUFBVW5FLElBQVYsRUFBZ0I7QUFDeEIsaUJBQUlmLE9BQU9nSSxNQUFQLENBQWNqSCxJQUFkLENBQUosRUFBeUI7QUFDckJpTywwQkFBU3BFLElBQVQsQ0FBY2UsT0FBTzVLLEtBQUtoQyxRQUFRNEIsTUFBUixDQUFlb0MsT0FBcEIsQ0FBUCxDQUFkO0FBQ0gsY0FGRCxNQUdLO0FBQ0QscUJBQUksT0FBT2hDLElBQVAsS0FBZ0IsUUFBaEIsSUFBNEIsT0FBT0EsSUFBUCxLQUFnQixRQUFoRCxFQUEwRDtBQUN0RGlPLDhCQUFTcEUsSUFBVCxDQUFjZSxPQUFPNUssSUFBUCxDQUFkO0FBQ0g7QUFDSjtBQUNKLFVBVEQ7QUFVSCxNQVhELE1BWUs7QUFDRCxhQUFJMkIsTUFBTXdFLEdBQVY7QUFDQSxhQUFJbEgsT0FBTzBELFFBQVAsQ0FBZ0J3RCxHQUFoQixDQUFKLEVBQTBCO0FBQ3RCeEUsbUJBQU13RSxJQUFJbkksUUFBUTRCLE1BQVIsQ0FBZW9DLE9BQW5CLENBQU47QUFDSDtBQUNELGFBQUlMLFFBQVE1QixTQUFaLEVBQXVCO0FBQ25CLG9CQUFPa08sUUFBUDtBQUNIO0FBQ0RBLGtCQUFTcEUsSUFBVCxDQUFjZSxPQUFPakosR0FBUCxDQUFkO0FBQ0g7QUFDRCxZQUFPc00sUUFBUDtBQUNILEVBekJELEMiLCJmaWxlIjoib25lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYWI2YTUzNTM0MzJlNzhkMTQzNzAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBjYWNoZV8xID0gcmVxdWlyZShcIi4vY2FjaGVcIik7XG5leHBvcnRzLmdldENhY2hlID0gY2FjaGVfMS5nZXRDYWNoZTtcbmV4cG9ydHMucHV0ID0gY2FjaGVfMS5wdXQ7XG5leHBvcnRzLmdldCA9IGNhY2hlXzEuZ2V0O1xuZXhwb3J0cy5nZXRFZGl0ID0gY2FjaGVfMS5nZXRFZGl0O1xuZXhwb3J0cy5ldmljdCA9IGNhY2hlXzEuZXZpY3Q7XG5leHBvcnRzLnJlc2V0ID0gY2FjaGVfMS5yZXNldDtcbmV4cG9ydHMudXVpZCA9IGNhY2hlXzEudXVpZDtcbmV4cG9ydHMucHJpbnQgPSBjYWNoZV8xLnByaW50O1xuKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93ICE9PSBudWxsKSB7XG4gICAgICAgIHdpbmRvdy5PbmUgPSB7XG4gICAgICAgICAgICBnZXRDYWNoZTogY2FjaGVfMS5nZXRDYWNoZSxcbiAgICAgICAgICAgIHB1dDogY2FjaGVfMS5wdXQsXG4gICAgICAgICAgICBnZXQ6IGNhY2hlXzEuZ2V0LFxuICAgICAgICAgICAgZ2V0RWRpdDogY2FjaGVfMS5nZXRFZGl0LFxuICAgICAgICAgICAgZXZpY3Q6IGNhY2hlXzEuZXZpY3QsXG4gICAgICAgICAgICByZXNldDogY2FjaGVfMS5yZXNldCxcbiAgICAgICAgICAgIHV1aWQ6IGNhY2hlXzEudXVpZCxcbiAgICAgICAgICAgIHByaW50OiBjYWNoZV8xLnByaW50XG4gICAgICAgIH07XG4gICAgfVxufSkoKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2luZGV4LnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgY29uZmlnXzEgPSByZXF1aXJlKFwiLi9jb25maWdcIik7XG52YXIgcHV0XzEgPSByZXF1aXJlKFwiLi9wdXRcIik7XG52YXIgcHJpbnRfMSA9IHJlcXVpcmUoXCIuL3ByaW50XCIpO1xudmFyIENhY2hlSW5zdGFuY2VfMSA9IHJlcXVpcmUoXCIuL0NhY2hlSW5zdGFuY2VcIik7XG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbnZhciBnZXRfMSA9IHJlcXVpcmUoXCIuL2dldFwiKTtcbnZhciBldmljdF8xID0gcmVxdWlyZShcIi4vZXZpY3RcIik7XG52YXIgY2FjaGVVdGlsXzEgPSByZXF1aXJlKFwiLi9jYWNoZVV0aWxcIik7XG5leHBvcnRzLmluc3RhbmNlcyA9IHt9O1xudmFyIGNhY2hlVGVzdCA9IGZhbHNlO1xuZnVuY3Rpb24gc2V0VGVzdGluZyh0ZXN0aW5nKSB7XG4gICAgY2FjaGVUZXN0ID0gdGVzdGluZztcbn1cbmV4cG9ydHMuc2V0VGVzdGluZyA9IHNldFRlc3Rpbmc7XG5mdW5jdGlvbiBnZXRDYWNoZShpbnN0YW5jZU5hbWUsIGNvbmZpZ3VyYXRpb24pIHtcbiAgICBpZiAoaW5zdGFuY2VOYW1lID09PSB2b2lkIDApIHsgaW5zdGFuY2VOYW1lID0gXCJvbmVcIjsgfVxuICAgIGlmIChjb25maWd1cmF0aW9uID09PSB2b2lkIDApIHsgY29uZmlndXJhdGlvbiA9IGNvbmZpZ18xLmRlZmF1bHRDb25maWc7IH1cbiAgICBpZiAoIWV4cG9ydHMuY29uZmlnKSB7XG4gICAgICAgIGV4cG9ydHMuY29uZmlnID0gY29uZmlnXzEuY29uZmlndXJlKGNvbmZpZ3VyYXRpb24pO1xuICAgIH1cbiAgICBpZiAoIWV4cG9ydHMuaW5zdGFuY2VzW2luc3RhbmNlTmFtZV0pIHtcbiAgICAgICAgZXhwb3J0cy5pbnN0YW5jZXNbaW5zdGFuY2VOYW1lXSA9IGNyZWF0ZUNhY2hlKGluc3RhbmNlTmFtZSk7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cgIT09IG51bGwgJiYgd2luZG93W2luc3RhbmNlTmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB3aW5kb3dbaW5zdGFuY2VOYW1lXSA9IGV4cG9ydHMuaW5zdGFuY2VzW2luc3RhbmNlTmFtZV07XG4gICAgfVxuICAgIHJldHVybiBleHBvcnRzLmluc3RhbmNlc1tpbnN0YW5jZU5hbWVdO1xufVxuZXhwb3J0cy5nZXRDYWNoZSA9IGdldENhY2hlO1xuZXhwb3J0cy5wdXQgPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgIGdldENhY2hlKCkucHV0KGl0ZW0pO1xufTtcbmV4cG9ydHMuZ2V0ID0gZnVuY3Rpb24gKGVudGl0eSwgbm9kZUlkKSB7XG4gICAgcmV0dXJuIGdldENhY2hlKCkuZ2V0KGVudGl0eSwgbm9kZUlkKTtcbn07XG5leHBvcnRzLmdldEVkaXQgPSBmdW5jdGlvbiAodWlkT3JFbnRpdHlPckFycmF5LCBub2RlSWQpIHtcbiAgICByZXR1cm4gZ2V0Q2FjaGUoKS5nZXRFZGl0KHVpZE9yRW50aXR5T3JBcnJheSwgbm9kZUlkKTtcbn07XG5leHBvcnRzLmV2aWN0ID0gZnVuY3Rpb24gKHVpZE9yRW50aXR5T3JBcnJheSkge1xuICAgIHJldHVybiBnZXRDYWNoZSgpLmV2aWN0KHVpZE9yRW50aXR5T3JBcnJheSk7XG59O1xuZXhwb3J0cy5wcmludCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZ2V0Q2FjaGUoKS5wcmludCgpO1xufTtcbmV4cG9ydHMucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgZ2V0Q2FjaGUoKS5yZXNldCgpO1xufTtcbmV4cG9ydHMudXVpZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbHV0ID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAyNTY7IGkrKykge1xuICAgICAgICBsdXRbaV0gPSAoaSA8IDE2ID8gJzAnIDogJycpICsgKGkpLnRvU3RyaW5nKDE2KTtcbiAgICB9XG4gICAgdmFyIGQwID0gTWF0aC5yYW5kb20oKSAqIDB4MTAwMDAwMDAwIHwgMDtcbiAgICB2YXIgZDEgPSBNYXRoLnJhbmRvbSgpICogMHgxMDAwMDAwMDAgfCAwO1xuICAgIHZhciBkMiA9IE1hdGgucmFuZG9tKCkgKiAweDEwMDAwMDAwMCB8IDA7XG4gICAgdmFyIGQzID0gTWF0aC5yYW5kb20oKSAqIDB4MTAwMDAwMDAwIHwgMDtcbiAgICByZXR1cm4gbHV0W2QwICYgMHhGRl0gKyBsdXRbZDAgPj4gOCAmIDB4RkZdICsgbHV0W2QwID4+IDE2ICYgMHhGRl1cbiAgICAgICAgKyBsdXRbZDAgPj4gMjQgJiAweEZGXSArICctJyArIGx1dFtkMSAmIDB4RkZdXG4gICAgICAgICsgbHV0W2QxID4+IDggJiAweEZGXSArICctJyArIGx1dFtkMSA+PiAxNiAmIDB4MGYgfCAweDQwXVxuICAgICAgICArIGx1dFtkMSA+PiAyNCAmIDB4RkZdICsgJy0nICsgbHV0W2QyICYgMHgzZiB8IDB4ODBdXG4gICAgICAgICsgbHV0W2QyID4+IDggJiAweEZGXSArICctJyArIGx1dFtkMiA+PiAxNiAmIDB4RkZdXG4gICAgICAgICsgbHV0W2QyID4+IDI0ICYgMHhGRl0gKyBsdXRbZDMgJiAweEZGXSArIGx1dFtkMyA+PiA4ICYgMHhGRl1cbiAgICAgICAgKyBsdXRbZDMgPj4gMTYgJiAweEZGXSArIGx1dFtkMyA+PiAyNCAmIDB4RkZdO1xufTtcbmZ1bmN0aW9uIGNyZWF0ZUNhY2hlKG5hbWUpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSBuZXcgQ2FjaGVJbnN0YW5jZV8xLmRlZmF1bHQobmFtZSk7XG4gICAgdmFyIHJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpbnN0YW5jZS5yZXNldCgpO1xuICAgIH07XG4gICAgdmFyIHB1dCA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHJldHVybiBwdXRfMS5wdXRJdGVtKGl0ZW0sIGluc3RhbmNlKTtcbiAgICB9O1xuICAgIHZhciBnZXQgPSBmdW5jdGlvbiAoZW50aXR5LCBub2RlSWQpIHtcbiAgICAgICAgcmV0dXJuIGdldF8xLmdldEl0ZW0oZW50aXR5LCBpbnN0YW5jZSwgbm9kZUlkKTtcbiAgICB9O1xuICAgIHZhciBnZXRFZGl0ID0gZnVuY3Rpb24gKHVpZE9yRW50aXR5T3JBcnJheSwgbm9kZUlkKSB7XG4gICAgICAgIHJldHVybiBnZXRfMS5nZXRFZGl0SXRlbSh1aWRPckVudGl0eU9yQXJyYXksIGluc3RhbmNlLCBub2RlSWQpO1xuICAgIH07XG4gICAgdmFyIGV2aWN0ID0gZnVuY3Rpb24gKHVpZE9yRW50aXR5T3JBcnJheSkge1xuICAgICAgICByZXR1cm4gZXZpY3RfMS5ldmljdEl0ZW0odWlkT3JFbnRpdHlPckFycmF5LCBpbnN0YW5jZSk7XG4gICAgfTtcbiAgICB2YXIgc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHV0aWxfMS5jYWNoZVNpemUoaW5zdGFuY2UpO1xuICAgIH07XG4gICAgdmFyIGxlbmd0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHV0aWxfMS5jYWNoZUxlbmd0aChpbnN0YW5jZSk7XG4gICAgfTtcbiAgICB2YXIgcHJpbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBwcmludF8xLnByaW50Q2FjaGUoaW5zdGFuY2UpO1xuICAgIH07XG4gICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgcHV0OiBwdXQsXG4gICAgICAgIGdldDogZ2V0LFxuICAgICAgICBnZXRFZGl0OiBnZXRFZGl0LFxuICAgICAgICBldmljdDogZXZpY3QsXG4gICAgICAgIHJlc2V0OiByZXNldCxcbiAgICAgICAgc2l6ZTogc2l6ZSxcbiAgICAgICAgbGVuZ3RoOiBsZW5ndGgsXG4gICAgICAgIHByaW50OiBwcmludCxcbiAgICB9O1xuICAgIGlmIChjYWNoZVRlc3QgPT09IHRydWUpIHtcbiAgICAgICAgcmVzdWx0LnJlZlRvID0gZnVuY3Rpb24gKHVpZCkge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBjYWNoZVV0aWxfMS5nZXRDYWNoZWRJdGVtKHVpZCwgaW5zdGFuY2UpO1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW0ubWFwVG87XG4gICAgICAgIH07XG4gICAgICAgIHJlc3VsdC5yZWZGcm9tID0gZnVuY3Rpb24gKHVpZCkge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBjYWNoZVV0aWxfMS5nZXRDYWNoZWRJdGVtKHVpZCwgaW5zdGFuY2UpO1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW0ubWFwRnJvbTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2NhY2hlLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLmRlZmF1bHRDb25maWcgPSB7XG4gICAgdWlkTmFtZTogXCJ1aWRcIixcbiAgICBtYXhIaXN0b3J5U3RhdGVzOiAxMDAwXG59O1xuZnVuY3Rpb24gY29uZmlndXJlKGNvbmYpIHtcbiAgICBmb3IgKHZhciBwIGluIGV4cG9ydHMuZGVmYXVsdENvbmZpZykge1xuICAgICAgICBpZiAoZXhwb3J0cy5kZWZhdWx0Q29uZmlnLmhhc093blByb3BlcnR5KHApICYmIGNvbmYuaGFzT3duUHJvcGVydHkocCkpIHtcbiAgICAgICAgICAgIGV4cG9ydHMuZGVmYXVsdENvbmZpZ1twXSA9IGNvbmZbcF07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGV4cG9ydHMuZGVmYXVsdENvbmZpZztcbn1cbmV4cG9ydHMuY29uZmlndXJlID0gY29uZmlndXJlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vY29uZmlnLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQ2FjaGVNYXBfMSA9IHJlcXVpcmUoXCIuL0NhY2hlTWFwXCIpO1xudmFyIGxvY2F0ZV8xID0gcmVxdWlyZShcIi4vbG9jYXRlXCIpO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG52YXIgcmVmXzEgPSByZXF1aXJlKFwiLi9yZWZcIik7XG52YXIgZmx1c2hfMSA9IHJlcXVpcmUoXCIuL2ZsdXNoXCIpO1xudmFyIHBhcnNlXzEgPSByZXF1aXJlKFwiLi9wYXJzZVwiKTtcbmV4cG9ydHMucHV0SXRlbSA9IGZ1bmN0aW9uIChlbnRpdHksIGluc3RhbmNlKSB7XG4gICAgaWYgKCh1dGlsXzEuaXNBcnJheShlbnRpdHkpIHx8IHV0aWxfMS5pc09iamVjdChlbnRpdHkpKSkge1xuICAgICAgICB2YXIgZXZpY3RNYXAgPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgICAgIHZhciBmbHVzaE1hcCA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICAgICAgZmx1c2hNYXBbJ19fVVBEQVRFRF9fJ10gPSBmYWxzZTtcbiAgICAgICAgdmFyIGZsdXNoQXJncyA9IHtcbiAgICAgICAgICAgIGZsdXNoTWFwOiBmbHVzaE1hcCxcbiAgICAgICAgICAgIGV2aWN0TWFwOiBldmljdE1hcCxcbiAgICAgICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZVxuICAgICAgICB9O1xuICAgICAgICBwYXJzZV8xLnBhcnNlKGVudGl0eSwgZmx1c2hBcmdzKTtcbiAgICAgICAgcmVmXzEudXBkYXRlUG9pbnRlcnMoZmx1c2hBcmdzKTtcbiAgICAgICAgaWYgKGZsdXNoQXJncy5mbHVzaE1hcC5zaXplKCkgPiAwKSB7XG4gICAgICAgICAgICBmbHVzaF8xLnByZUZsdXNoKGZsdXNoQXJncywgaW5zdGFuY2UpO1xuICAgICAgICAgICAgcmV0dXJuIGxvY2F0ZV8xLmdldENhbGxTdGF0cyh0cnVlLCBpbnN0YW5jZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGxvY2F0ZV8xLmdldENhbGxTdGF0cyhmYWxzZSwgaW5zdGFuY2UpO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3B1dC50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XG4gICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgIH1cbiAgICByZXR1cm4gdDtcbn07XG52YXIgQ2FjaGVNYXAgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENhY2hlTWFwKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLnBhdGhzID0ge307XG4gICAgICAgIHRoaXMubGVuZ3RoID0gMDtcbiAgICAgICAgdGhpcy5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMucGF0aHNba2V5XTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5kZWxldGUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIF90aGlzLnBhdGhzW2tleV0gIT09IFwidW5kZWZpbmVkXCIgJiYgX3RoaXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciB2YWwgPSBfdGhpcy5wYXRoc1trZXldO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBfdGhpcy5wYXRoc1trZXldO1xuICAgICAgICAgICAgICAgIF90aGlzLmxlbmd0aC0tO1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaGFzID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBfdGhpcy5wYXRoc1trZXldICE9PSAndW5kZWZpbmVkJztcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5mb3JFYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gX3RoaXMucGF0aHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMucGF0aHMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhrZXksIF90aGlzLnBhdGhzW2tleV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjbG9uZSA9IG5ldyBDYWNoZU1hcCgpO1xuICAgICAgICAgICAgY2xvbmUucGF0aHMgPSBfX2Fzc2lnbih7fSwgX3RoaXMucGF0aHMpO1xuICAgICAgICAgICAgY2xvbmUubGVuZ3RoID0gX3RoaXMubGVuZ3RoO1xuICAgICAgICAgICAgcmV0dXJuIGNsb25lO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBDYWNoZU1hcC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnBhdGhzW2tleV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMubGVuZ3RoKys7XG4gICAgICAgICAgICB0aGlzLnBhdGhzW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGF0aHNba2V5XSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICBDYWNoZU1hcC5wcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGVuZ3RoO1xuICAgIH07XG4gICAgcmV0dXJuIENhY2hlTWFwO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IENhY2hlTWFwO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2FjaGVNYXAudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xuZXhwb3J0cy5nZXRDYWxsU3RhdHMgPSBmdW5jdGlvbiAoc3VjY2VzcywgaW5zdGFuY2UpIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgcmVzdWx0LnN1Y2Nlc3MgPSBzdWNjZXNzO1xuICAgIHJlc3VsdC5ub2RlSWQgPSBleHBvcnRzLm5vZGUoaW5zdGFuY2UpO1xuICAgIHJlc3VsdC5sZW5ndGggPSBsZW5ndGgoaW5zdGFuY2UpO1xuICAgIHJlc3VsdC5uYW1lID0gaW5zdGFuY2UubmFtZTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbmV4cG9ydHMubm9kZSA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgbm9kZUlkKSB7XG4gICAgaWYgKHR5cGVvZiBub2RlSWQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgdmFyIGN1cnJlbnROb2RlID0gZ2V0Q3VycmVudE5vZGUoaW5zdGFuY2UpO1xuICAgICAgICByZXR1cm4gY3VycmVudE5vZGUgPyBjdXJyZW50Tm9kZS5pZCA6IC0xO1xuICAgIH1cbiAgICBpZiAoIXV0aWxfMS5pc051bWJlcihub2RlSWQpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJUaGUgbm9kZSBpZCBtdXN0IGJlIGEgbnVtYmVyLlwiKTtcbiAgICB9XG4gICAgdmFyIGNhY2hlTm9kZSA9IGdldFJlcG9Ob2RlKG5vZGVJZCwgaW5zdGFuY2UpO1xuICAgIGlmICghY2FjaGVOb2RlKSB7XG4gICAgICAgIHJldHVybiBleHBvcnRzLmdldENhbGxTdGF0cyhmYWxzZSwgaW5zdGFuY2UpO1xuICAgIH1cbiAgICBpbnN0YW5jZS50aHJlYWQuY3VycmVudCA9IGJpbmFyeUluZGV4T2YoaW5zdGFuY2UudGhyZWFkLm5vZGVzLCBub2RlSWQpO1xuICAgIHJldHVybiBleHBvcnRzLmdldENhbGxTdGF0cyh0cnVlLCBpbnN0YW5jZSk7XG59O1xuZnVuY3Rpb24gZ2V0Q3VycmVudE5vZGUoaW5zdGFuY2UpIHtcbiAgICB2YXIgY3VycmVudE5vZGVJZCA9IGluc3RhbmNlLnRocmVhZC5ub2Rlc1tpbnN0YW5jZS50aHJlYWQuY3VycmVudF07XG4gICAgcmV0dXJuIGN1cnJlbnROb2RlSWQgPj0gMCA/IGdldFJlcG9Ob2RlKGN1cnJlbnROb2RlSWQsIGluc3RhbmNlKSA6IHVuZGVmaW5lZDtcbn1cbmV4cG9ydHMuZ2V0Q3VycmVudE5vZGUgPSBnZXRDdXJyZW50Tm9kZTtcbmZ1bmN0aW9uIGdldFJlcG9Ob2RlKGNhY2hlTm9kZUlkLCBpbnN0YW5jZSkge1xuICAgIHJldHVybiBpbnN0YW5jZS5yZXBvLmdldChjYWNoZU5vZGVJZCk7XG59XG5leHBvcnRzLmdldFJlcG9Ob2RlID0gZ2V0UmVwb05vZGU7XG52YXIgbGVuZ3RoID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLnRocmVhZC5ub2Rlcy5sZW5ndGg7XG59O1xuZnVuY3Rpb24gYmluYXJ5SW5kZXhPZihhcnJheSwgc2VhcmNoRWxlbWVudCkge1xuICAgIHZhciBtaW5JbmRleCA9IDA7XG4gICAgdmFyIG1heEluZGV4ID0gYXJyYXkubGVuZ3RoIC0gMTtcbiAgICB2YXIgY3VycmVudEluZGV4O1xuICAgIHZhciBjdXJyZW50RWxlbWVudDtcbiAgICB3aGlsZSAobWluSW5kZXggPD0gbWF4SW5kZXgpIHtcbiAgICAgICAgY3VycmVudEluZGV4ID0gKG1pbkluZGV4ICsgbWF4SW5kZXgpIC8gMiB8IDA7XG4gICAgICAgIGN1cnJlbnRFbGVtZW50ID0gYXJyYXlbY3VycmVudEluZGV4XTtcbiAgICAgICAgaWYgKGN1cnJlbnRFbGVtZW50IDwgc2VhcmNoRWxlbWVudCkge1xuICAgICAgICAgICAgbWluSW5kZXggPSBjdXJyZW50SW5kZXggKyAxO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGN1cnJlbnRFbGVtZW50ID4gc2VhcmNoRWxlbWVudCkge1xuICAgICAgICAgICAgbWF4SW5kZXggPSBjdXJyZW50SW5kZXggLSAxO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRJbmRleDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xvY2F0ZS50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIGNhY2hlXzEgPSByZXF1aXJlKFwiLi9jYWNoZVwiKTtcbnZhciBDYWNoZU5vZGVfMSA9IHJlcXVpcmUoXCIuL0NhY2hlTm9kZVwiKTtcbnZhciBsb2NhdGVfMSA9IHJlcXVpcmUoXCIuL2xvY2F0ZVwiKTtcbnZhciBvYmplY3RBc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xudmFyIF9oYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5mdW5jdGlvbiBpc051bWJlcih2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInIHx8IHRvU3RyaW5nKHZhbHVlKSA9PT0gXCJbb2JqZWN0IE51bWJlcl1cIjtcbn1cbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcbmZ1bmN0aW9uIGlzU3RyaW5nKG9iaikge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnc3RyaW5nJyB8fCB0b1N0cmluZyhvYmopID09PSBcIltvYmplY3QgU3RyaW5nXVwiO1xufVxuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xuZnVuY3Rpb24gaXNPYmplY3QobWl4ZWRfdmFyKSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChtaXhlZF92YXIpID09PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIG1peGVkX3ZhciAhPT0gbnVsbCAmJiB0eXBlb2YgbWl4ZWRfdmFyID09PSAnb2JqZWN0Jztcbn1cbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcbmZ1bmN0aW9uIGlzRnVuY3Rpb24oaXRlbSkge1xuICAgIHJldHVybiB0eXBlb2YgaXRlbSA9PT0gJ2Z1bmN0aW9uJztcbn1cbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5mdW5jdGlvbiBpc0FycmF5KHZhbHVlKSB7XG4gICAgaWYgKCF2YWx1ZSB8fCB2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKSB8fCAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0J1xuICAgICAgICAmJiB0eXBlb2YgdmFsdWUubGVuZ3RoID09PSAnbnVtYmVyJ1xuICAgICAgICAmJiB0eXBlb2YgdmFsdWUuc3BsaWNlID09PSAnZnVuY3Rpb24nXG4gICAgICAgICYmICEodmFsdWUucHJvcGVydHlJc0VudW1lcmFibGUoJ2xlbmd0aCcpKSk7XG59XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuZnVuY3Rpb24gb2JqVG9TdHIobykge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59XG5mdW5jdGlvbiBpc0RhdGUodmFsdWUpIHtcbiAgICByZXR1cm4gaXNPYmplY3QodmFsdWUpICYmIG9ialRvU3RyKHZhbHVlKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG5mdW5jdGlvbiBpc0VtcHR5KHZhbHVlKSB7XG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSBpZiAoIWlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICBmb3IgKHZhciBpIGluIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoX2hhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5leHBvcnRzLmlzRW1wdHkgPSBpc0VtcHR5O1xuZnVuY3Rpb24gZ2V0TmV3Q2FjaGVOb2RlKGluc3RhbmNlKSB7XG4gICAgdmFyIG5vZGUgPSBuZXcgQ2FjaGVOb2RlXzEuQ2FjaGVOb2RlKGluc3RhbmNlLm5leHROb2RlS2V5KTtcbiAgICBub2RlLmlkID0gaW5zdGFuY2UubmV4dE5vZGVLZXk7XG4gICAgaW5zdGFuY2UubmV4dE5vZGVLZXkgKz0gMTtcbiAgICBpbnN0YW5jZS5yZXBvLmFkZChub2RlKTtcbiAgICByZXR1cm4gbm9kZTtcbn1cbmV4cG9ydHMuZ2V0TmV3Q2FjaGVOb2RlID0gZ2V0TmV3Q2FjaGVOb2RlO1xuZnVuY3Rpb24gaGFzVWlkKG9iaikge1xuICAgIGlmICghb2JqKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCFpc09iamVjdChvYmopKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBvYmpbY2FjaGVfMS5jb25maWcudWlkTmFtZV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgdWlkID0gb2JqW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgIHJldHVybiB1aWQubGVuZ3RoICE9PSAwO1xufVxuZXhwb3J0cy5oYXNVaWQgPSBoYXNVaWQ7XG47XG5GdW5jdGlvbi5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgdmFyIFNUUklQX0NPTU1FTlRTID0gLygoXFwvXFwvLiokKXwoXFwvXFwqW1xcc1xcU10qP1xcKlxcLykpL21nO1xuICAgIHZhciBBUkdVTUVOVF9OQU1FUyA9IC8oW15cXHMsXSspL2c7XG4gICAgZnVuY3Rpb24gZ2V0UGFyYW1OYW1lcyhmdW5jKSB7XG4gICAgICAgIHZhciBmblN0ciA9IGZ1bmMudG9TdHJpbmcoKS5yZXBsYWNlKFNUUklQX0NPTU1FTlRTLCAnJyk7XG4gICAgICAgIHZhciByZXN1bHQgPSBmblN0ci5zbGljZShmblN0ci5pbmRleE9mKCcoJykgKyAxLCBmblN0ci5pbmRleE9mKCcpJykpLm1hdGNoKEFSR1VNRU5UX05BTUVTKTtcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gbnVsbClcbiAgICAgICAgICAgIHJlc3VsdCA9IFtdO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICB2YXIgc3RyaW5naWZ5ID0gdGhpcy50b1N0cmluZygpO1xuICAgIHN0cmluZ2lmeSA9IHN0cmluZ2lmeS5yZXBsYWNlKG5ldyBSZWdFeHAoJ190aGlzJywgJ2cnKSwgJ3RoaXMnKTtcbiAgICB2YXIgYm9keSA9IHN0cmluZ2lmeS5tYXRjaCgvZnVuY3Rpb25bXntdK1xceyhbXFxzXFxTXSopXFx9JC8pWzFdO1xuICAgIGJvZHkgPSBib2R5LnRyaW0oKTtcbiAgICB2YXIgcGFyYW1OYW1lcyA9IGdldFBhcmFtTmFtZXModGhpcyk7XG4gICAgdmFyIGZ1bmM7XG4gICAgaWYgKGJvZHkuaW5kZXhPZignbmF0aXZlIGNvZGUnKSA8IDApIHtcbiAgICAgICAgZnVuYyA9IEZ1bmN0aW9uKHBhcmFtTmFtZXMsIGJvZHkpO1xuICAgICAgICBmdW5jID0gZnVuYy5iaW5kKHRhcmdldCk7XG4gICAgfVxuICAgIHJldHVybiBmdW5jO1xufTtcbmZ1bmN0aW9uIGRlZXBDbG9uZShvYmosIHVpZFJlZmVyZW5jZSwgZnJlZXplKSB7XG4gICAgaWYgKGZyZWV6ZSA9PT0gdm9pZCAwKSB7IGZyZWV6ZSA9IHRydWU7IH1cbiAgICBpZiAoIW9ialxuICAgICAgICB8fCAoIWlzT2JqZWN0KG9iailcbiAgICAgICAgICAgICYmICFpc0FycmF5KG9iaikpKSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICAgIGlmIChmcmVlemUgPT09IHRydWVcbiAgICAgICAgJiYgdWlkUmVmZXJlbmNlXG4gICAgICAgICYmICFPYmplY3QuaXNGcm96ZW4odWlkUmVmZXJlbmNlKSkge1xuICAgICAgICBPYmplY3QuZnJlZXplKHVpZFJlZmVyZW5jZSk7XG4gICAgfVxuICAgIGlmICh1aWRSZWZlcmVuY2VcbiAgICAgICAgJiYgaGFzVWlkKG9iailcbiAgICAgICAgJiYgb2JqW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdID09PSB1aWRSZWZlcmVuY2VbY2FjaGVfMS5jb25maWcudWlkTmFtZV0pIHtcbiAgICAgICAgcmV0dXJuIHVpZFJlZmVyZW5jZTtcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9IG9iamVjdEFzc2lnbih7fSwgb2JqKTtcbiAgICBmb3IgKHZhciBwcm9wTmFtZSBpbiBvYmopIHtcbiAgICAgICAgdmFyIHZhbHVlID0gb2JqW3Byb3BOYW1lXTtcbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbcHJvcE5hbWVdID0gZGVlcENsb25lQXJyYXkodmFsdWUsIHVpZFJlZmVyZW5jZSwgZnJlZXplKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHZhbHVlLmdldFRpbWUoKSk7XG4gICAgICAgICAgICAgICAgaWYgKGZyZWV6ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZnJlZXplKGRhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXN1bHRbcHJvcE5hbWVdID0gZGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGlmIChoYXNVaWQodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtwcm9wTmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVpZFJlZmVyZW5jZSAmJiBoYXNVaWQodWlkUmVmZXJlbmNlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlICE9PSB1aWRSZWZlcmVuY2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB2YWx1ZS51aWQgPT09IHVpZFJlZmVyZW5jZS51aWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB2YWx1ZSAhPT0gdWlkUmVmZXJlbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W3Byb3BOYW1lXSA9IHVpZFJlZmVyZW5jZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W3Byb3BOYW1lXSA9IGRlZXBDbG9uZSh2YWx1ZSwgdWlkUmVmZXJlbmNlLCBmcmVlemUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByb3BOYW1lICE9PSAnY29uc3RydWN0b3InKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtwcm9wTmFtZV0gPSB2YWx1ZS5jbG9uZShyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtwcm9wTmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoZnJlZXplID09PSB0cnVlXG4gICAgICAgICYmICFPYmplY3QuaXNGcm96ZW4ocmVzdWx0KVxuICAgICAgICAmJiB0eXBlb2YgcmVzdWx0ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIE9iamVjdC5mcmVlemUocmVzdWx0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmV4cG9ydHMuZGVlcENsb25lID0gZGVlcENsb25lO1xuZnVuY3Rpb24gZGVlcENsb25lQXJyYXkoYXJyLCB1aWRSZWZlcmVuY2UsIGZyZWV6ZSkge1xuICAgIHJldHVybiBhcnIubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIGlmIChpc0FycmF5KGl0ZW0pKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVlcENsb25lQXJyYXkoaXRlbSwgdWlkUmVmZXJlbmNlLCBmcmVlemUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICAgICAgICBpZiAoaGFzVWlkKGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgaWYgKHVpZFJlZmVyZW5jZSAmJiAoaXRlbVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSA9PT0gdWlkUmVmZXJlbmNlW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdWlkUmVmZXJlbmNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWVwQ2xvbmUoaXRlbSwgdWlkUmVmZXJlbmNlLCBmcmVlemUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmV4cG9ydHMuY2FjaGVTaXplID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgdmFyIGNhY2hlTm9kZSA9IGxvY2F0ZV8xLmdldEN1cnJlbnROb2RlKGluc3RhbmNlKTtcbiAgICByZXR1cm4gY2FjaGVOb2RlID8gY2FjaGVOb2RlLml0ZW1zLnNpemUoKSA6IDA7XG59O1xuZXhwb3J0cy5jYWNoZUxlbmd0aCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIHJldHVybiBpbnN0YW5jZS50aHJlYWQubm9kZXMubGVuZ3RoO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3V0aWwudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBDYWNoZU1hcF8xID0gcmVxdWlyZShcIi4vQ2FjaGVNYXBcIik7XG52YXIgQ2FjaGVOb2RlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDYWNoZU5vZGUobm9kZUlkKSB7XG4gICAgICAgIHRoaXMuaXRlbXMgPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuaWQgPSBub2RlSWQ7XG4gICAgfVxuICAgIHJldHVybiBDYWNoZU5vZGU7XG59KCkpO1xuZXhwb3J0cy5DYWNoZU5vZGUgPSBDYWNoZU5vZGU7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DYWNoZU5vZGUudHMiLCIndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuLi9+L29iamVjdC1hc3NpZ24vaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgY2FjaGVfMSA9IHJlcXVpcmUoXCIuL2NhY2hlXCIpO1xudmFyIG9wYXRoID0gcmVxdWlyZShcIi4vcGF0aFwiKTtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xudmFyIGNhY2hlVXRpbF8xID0gcmVxdWlyZShcIi4vY2FjaGVVdGlsXCIpO1xuZXhwb3J0cy5hc3NpZ25SZWZUb1BhcmVudCA9IGZ1bmN0aW9uIChyZWZJdGVtLCBwYXJlbnRVaWQsIHBhdGgsIGZsdXNoQXJncykge1xuICAgIGlmIChwYXJlbnRVaWQpIHtcbiAgICAgICAgdmFyIHBhcmVudEl0ZW0gPSBjYWNoZVV0aWxfMS5nZXRJdGVtRmx1c2hPckNhY2hlZChwYXJlbnRVaWQsIGZsdXNoQXJncyk7XG4gICAgICAgIGlmIChwYXJlbnRJdGVtICYmIHBhdGgubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYXNzaWduUmVmcyhwYXJlbnRJdGVtLCByZWZJdGVtLCBwYXRoKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG52YXIgYXNzaWduUmVmcyA9IGZ1bmN0aW9uIChwYXJlbnRJdGVtLCByZWZJdGVtLCBwYXRoKSB7XG4gICAgdmFyIHBhcmVudFVpZCA9IHBhcmVudEl0ZW0uZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgIHZhciByZWZVaWQgPSByZWZJdGVtLmVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXTtcbiAgICB2YXIgcmVmUGF0aCA9IHBhdGguam9pbignLicpO1xuICAgIGFkZFJlZlRvKHBhcmVudEl0ZW0sIHJlZlVpZCwgcmVmUGF0aCk7XG4gICAgYWRkUmVmRnJvbShyZWZJdGVtLCBwYXJlbnRVaWQsIHJlZlBhdGgpO1xufTtcbnZhciBhZGRSZWZUbyA9IGZ1bmN0aW9uIChwYXJlbnRJdGVtLCByZWZVaWQsIHBhdGgpIHtcbiAgICBpZiAocGFyZW50SXRlbS5tYXBUby5oYXMocmVmVWlkKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcGFyZW50SXRlbS5tYXBUby5zZXQocmVmVWlkLCBbXSk7XG4gICAgfVxuICAgIHZhciByZWZBcnJheSA9IHBhcmVudEl0ZW0ubWFwVG8uZ2V0KHJlZlVpZCk7XG4gICAgaWYgKHJlZkFycmF5LmluZGV4T2YocGF0aCkgPCAwKSB7XG4gICAgICAgIHJlZkFycmF5LnB1c2gocGF0aCk7XG4gICAgfVxuICAgIHJldHVybiBwYXJlbnRJdGVtO1xufTtcbnZhciBhZGRSZWZGcm9tID0gZnVuY3Rpb24gKHJlZkl0ZW0sIHBhcmVudFVpZCwgcGF0aCkge1xuICAgIGlmIChyZWZJdGVtLm1hcEZyb20uaGFzKHBhcmVudFVpZCkgPT09IGZhbHNlKSB7XG4gICAgICAgIHJlZkl0ZW0ubWFwRnJvbS5zZXQocGFyZW50VWlkLCBbXSk7XG4gICAgfVxuICAgIHZhciBmcm9tQXJyYXkgPSByZWZJdGVtLm1hcEZyb20uZ2V0KHBhcmVudFVpZCk7XG4gICAgaWYgKGZyb21BcnJheS5pbmRleE9mKHBhdGgpIDwgMCkge1xuICAgICAgICBmcm9tQXJyYXkucHVzaChwYXRoKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlZkl0ZW07XG59O1xuZXhwb3J0cy51cGRhdGVQb2ludGVycyA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICBmbHVzaEFyZ3MuZmx1c2hNYXAuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgIHVwZGF0ZUl0ZW1SZWZUb3MoaXRlbSwgZmx1c2hBcmdzKTtcbiAgICAgICAgZXhwb3J0cy51cGRhdGVSZWZGcm9tcyhpdGVtLCBmbHVzaEFyZ3MpO1xuICAgIH0pO1xufTtcbmV4cG9ydHMudXBkYXRlUmVmRnJvbXMgPSBmdW5jdGlvbiAoaXRlbSwgZmx1c2hBcmdzKSB7XG4gICAgaWYgKGl0ZW0ubWFwRnJvbS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGl0ZW0ubWFwRnJvbS5mb3JFYWNoKGZ1bmN0aW9uIChwYXJlbnRVaWQsIHBhdGhzKSB7XG4gICAgICAgICAgICB2YXIgcGFyZW50SXRlbSA9IGZsdXNoQXJncy5mbHVzaE1hcC5nZXQocGFyZW50VWlkKTtcbiAgICAgICAgICAgIGlmICghcGFyZW50SXRlbSkge1xuICAgICAgICAgICAgICAgIHBhcmVudEl0ZW0gPSBjYWNoZVV0aWxfMS5nZXRDYWNoZWRJdGVtKHBhcmVudFVpZCwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXJlbnRJdGVtICYmIHBhdGhzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgZmlyc3RQYXRoID0gcGF0aHNbMF07XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldFJlZiA9IG9wYXRoLmdldChwYXJlbnRJdGVtLmVudGl0eSwgZmlyc3RQYXRoKTtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0UmVmICYmIHRhcmdldFJlZiAhPT0gaXRlbS5lbnRpdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmbHVzaE1hcDogZmx1c2hBcmdzLmZsdXNoTWFwLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2U6IGZsdXNoQXJncy5pbnN0YW5jZVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnRJdGVtID0gY2FjaGVVdGlsXzEuZW5zdXJlSXRlbShwYXJlbnRJdGVtLmVudGl0eSwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudEl0ZW0uZW50aXR5ID0gdXRpbF8xLmRlZXBDbG9uZShwYXJlbnRJdGVtLmVudGl0eSwgaXRlbS5lbnRpdHksIHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcbmV4cG9ydHMudXBkYXRlUmVmVG9zID0gZnVuY3Rpb24gKGVudGl0eVVpZCwgZmx1c2hBcmdzKSB7XG4gICAgdmFyIGl0ZW0gPSBjYWNoZVV0aWxfMS5nZXRJdGVtRmx1c2hPckNhY2hlZChlbnRpdHlVaWQsIGZsdXNoQXJncyk7XG4gICAgdXBkYXRlSXRlbVJlZlRvcyhpdGVtLCBmbHVzaEFyZ3MpO1xufTtcbnZhciB1cGRhdGVJdGVtUmVmVG9zID0gZnVuY3Rpb24gKGl0ZW0sIGZsdXNoQXJncykge1xuICAgIGlmICghaXRlbSB8fCAhaXRlbS5tYXBUbylcbiAgICAgICAgcmV0dXJuO1xuICAgIGl0ZW0ubWFwVG8uZm9yRWFjaChmdW5jdGlvbiAodG9VaWQsIHBhdGhzKSB7XG4gICAgICAgIHZhciB1cGRhdGVkUGF0aHMgPSBwYXRocy5maWx0ZXIoZnVuY3Rpb24gKHBhdGgpIHtcbiAgICAgICAgICAgIHZhciByZWZlcmVuY2UgPSBvcGF0aC5nZXQoaXRlbS5lbnRpdHksIHBhdGgpO1xuICAgICAgICAgICAgdmFyIGhhc1JlZiA9IHJlZmVyZW5jZSAmJiBTdHJpbmcocmVmZXJlbmNlW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdKSA9PT0gU3RyaW5nKHRvVWlkKTtcbiAgICAgICAgICAgIGlmICghaGFzUmVmKVxuICAgICAgICAgICAgICAgIHJlbW92ZVJlZkZyb21fVmFsdWUoaXRlbS5lbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV0sIHRvVWlkLCBmbHVzaEFyZ3MsIHBhdGgpO1xuICAgICAgICAgICAgcmV0dXJuIGhhc1JlZjtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh1cGRhdGVkUGF0aHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaXRlbS5tYXBUby5zZXQodG9VaWQsIHVwZGF0ZWRQYXRocyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpdGVtLm1hcFRvLmRlbGV0ZSh0b1VpZCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG52YXIgcmVtb3ZlUmVmRnJvbV9WYWx1ZSA9IGZ1bmN0aW9uIChwYXJlbnRVaWQsIHJlZlVpZCwgZmx1c2hBcmdzLCBwYXRoKSB7XG4gICAgdmFyIHJlZkl0ZW0gPSBjYWNoZVV0aWxfMS5nZXRJdGVtRmx1c2hPckNhY2hlZChyZWZVaWQsIGZsdXNoQXJncyk7XG4gICAgaWYgKHJlZkl0ZW0pIHtcbiAgICAgICAgcmVmSXRlbSA9IHJlZkl0ZW0uY2xvbmUoKTtcbiAgICAgICAgaWYgKHJlZkl0ZW0ubWFwRnJvbS5oYXMocGFyZW50VWlkKSkge1xuICAgICAgICAgICAgcmVtb3ZlUmVmRnJvbShyZWZJdGVtLCBwYXJlbnRVaWQsIHBhdGgpO1xuICAgICAgICAgICAgaWYgKHJlZkl0ZW0ubWFwRnJvbS5zaXplKCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZXZpY3RNYXAuc2V0KHJlZlVpZCwgcmVmSXRlbSk7XG4gICAgICAgICAgICAgICAgZmx1c2hBcmdzLmZsdXNoTWFwLmRlbGV0ZShyZWZVaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZmx1c2hBcmdzLmZsdXNoTWFwLnNldChyZWZVaWQsIHJlZkl0ZW0pO1xuICAgICAgICAgICAgICAgIGZsdXNoQXJncy5ldmljdE1hcC5kZWxldGUocmVmVWlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG52YXIgcmVtb3ZlUmVmRnJvbSA9IGZ1bmN0aW9uIChpdGVtLCBwYXJlbnRVaWQsIHBhdGgpIHtcbiAgICB2YXIgcmVmc0FycmF5ID0gaXRlbS5tYXBGcm9tLmdldChwYXJlbnRVaWQpO1xuICAgIHZhciBpbmRleCA9IHJlZnNBcnJheS5pbmRleE9mKHBhdGgpO1xuICAgIHJlZnNBcnJheSA9IHJlZnNBcnJheS5zbGljZSgpO1xuICAgIHJlZnNBcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIGl0ZW0ubWFwRnJvbS5zZXQocGFyZW50VWlkLCByZWZzQXJyYXkpO1xuICAgIGlmIChyZWZzQXJyYXkubGVuZ3RoID09IDApIHtcbiAgICAgICAgaXRlbS5tYXBGcm9tLmRlbGV0ZShwYXJlbnRVaWQpO1xuICAgIH1cbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9yZWYudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xuZnVuY3Rpb24gZ2V0S2V5KGtleSkge1xuICAgIHZhciBpbnRLZXkgPSBwYXJzZUludChrZXkpO1xuICAgIGlmIChpbnRLZXkudG9TdHJpbmcoKSA9PT0ga2V5KSB7XG4gICAgICAgIHJldHVybiBpbnRLZXk7XG4gICAgfVxuICAgIHJldHVybiBrZXk7XG59XG5mdW5jdGlvbiBkZWwob2JqLCBwYXRoKSB7XG4gICAgaWYgKHV0aWxfMS5pc051bWJlcihwYXRoKSkge1xuICAgICAgICBwYXRoID0gW3BhdGhdO1xuICAgIH1cbiAgICBpZiAodXRpbF8xLmlzRW1wdHkob2JqKSkge1xuICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbiAgICBpZiAodXRpbF8xLmlzRW1wdHkocGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgaWYgKHV0aWxfMS5pc1N0cmluZyhwYXRoKSkge1xuICAgICAgICByZXR1cm4gZGVsKG9iaiwgcGF0aC5zcGxpdCgnLicpKTtcbiAgICB9XG4gICAgdmFyIGN1cnJlbnRQYXRoID0gZ2V0S2V5KHBhdGhbMF0pO1xuICAgIHZhciBvbGRWYWwgPSBvYmpbY3VycmVudFBhdGhdO1xuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBpZiAob2xkVmFsICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgIGlmICh1dGlsXzEuaXNBcnJheShvYmopKSB7XG4gICAgICAgICAgICAgICAgb2JqLnNwbGljZShjdXJyZW50UGF0aCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgb2JqW2N1cnJlbnRQYXRoXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKG9ialtjdXJyZW50UGF0aF0gIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgcmV0dXJuIGRlbChvYmpbY3VycmVudFBhdGhdLCBwYXRoLnNsaWNlKDEpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqO1xufVxuZXhwb3J0cy5kZWwgPSBkZWw7XG5mdW5jdGlvbiBnZXQob2JqLCBwYXRoLCBkZWZhdWx0VmFsdWUpIHtcbiAgICBpZiAodXRpbF8xLmlzTnVtYmVyKHBhdGgpKSB7XG4gICAgICAgIHBhdGggPSBbcGF0aF07XG4gICAgfVxuICAgIGlmICh1dGlsXzEuaXNFbXB0eShwYXRoKSkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBpZiAodXRpbF8xLmlzRW1wdHkob2JqKSkge1xuICAgICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgIH1cbiAgICBpZiAodXRpbF8xLmlzU3RyaW5nKHBhdGgpKSB7XG4gICAgICAgIHJldHVybiBnZXQob2JqLCBwYXRoLnNwbGl0KCcuJyksIGRlZmF1bHRWYWx1ZSk7XG4gICAgfVxuICAgIHZhciBjdXJyZW50UGF0aCA9IGdldEtleShwYXRoWzBdKTtcbiAgICBpZiAocGF0aC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgaWYgKG9ialtjdXJyZW50UGF0aF0gPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2JqW2N1cnJlbnRQYXRoXTtcbiAgICB9XG4gICAgcmV0dXJuIGdldChvYmpbY3VycmVudFBhdGhdLCBwYXRoLnNsaWNlKDEpLCBkZWZhdWx0VmFsdWUpO1xufVxuZXhwb3J0cy5nZXQgPSBnZXQ7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wYXRoLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQ2FjaGVJdGVtXzEgPSByZXF1aXJlKFwiLi9DYWNoZUl0ZW1cIik7XG52YXIgY2FjaGVfMSA9IHJlcXVpcmUoXCIuL2NhY2hlXCIpO1xuZXhwb3J0cy5pc09uQ2FjaGUgPSBmdW5jdGlvbiAoZW50aXR5LCBpbnN0YW5jZSkge1xuICAgIHZhciBjYWNoZWRJdGVtID0gZXhwb3J0cy5nZXRDYWNoZWRJdGVtKGVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSwgaW5zdGFuY2UpO1xuICAgIHJldHVybiBjYWNoZWRJdGVtICYmIGNhY2hlZEl0ZW0uZW50aXR5ID09PSBlbnRpdHk7XG59O1xuZXhwb3J0cy5pc09uRmx1c2hNYXAgPSBmdW5jdGlvbiAoZW50aXR5LCBmbHVzaE1hcCkge1xuICAgIHJldHVybiAhIWZsdXNoTWFwLmdldChlbnRpdHlbY2FjaGVfMS5jb25maWcudWlkXSk7XG59O1xuZXhwb3J0cy5nZXRDYWNoZWRJdGVtID0gZnVuY3Rpb24gKHVpZCwgaW5zdGFuY2UpIHtcbiAgICB2YXIgY3VycmVudE5vZGUgPSBnZXRDdXJyZW50Tm9kZShpbnN0YW5jZSk7XG4gICAgcmV0dXJuIGN1cnJlbnROb2RlID8gY3VycmVudE5vZGUuaXRlbXMuZ2V0KFN0cmluZyh1aWQpKSA6IHVuZGVmaW5lZDtcbn07XG5leHBvcnRzLmdldEl0ZW1GbHVzaE9yQ2FjaGVkID0gZnVuY3Rpb24gKHVpZCwgZmx1c2hBcmdzKSB7XG4gICAgaWYgKHVpZCkge1xuICAgICAgICB1aWQgPSBTdHJpbmcodWlkKTtcbiAgICAgICAgdmFyIGl0ZW0gPSBmbHVzaEFyZ3MuZmx1c2hNYXAuZ2V0KHVpZCk7XG4gICAgICAgIGlmICghaXRlbSkge1xuICAgICAgICAgICAgaXRlbSA9IGV4cG9ydHMuZ2V0Q2FjaGVkSXRlbSh1aWQsIGZsdXNoQXJncy5pbnN0YW5jZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0gJiYgT2JqZWN0LmlzRnJvemVuKGl0ZW0pKSB7XG4gICAgICAgICAgICBpdGVtID0gaXRlbS5jbG9uZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cbn07XG5mdW5jdGlvbiBnZXRDdXJyZW50Tm9kZShpbnN0YW5jZSkge1xuICAgIHZhciBjdXJyZW50Tm9kZUlkID0gaW5zdGFuY2UudGhyZWFkLm5vZGVzW2luc3RhbmNlLnRocmVhZC5jdXJyZW50XTtcbiAgICByZXR1cm4gY3VycmVudE5vZGVJZCA+PSAwID8gZ2V0UmVwb05vZGUoY3VycmVudE5vZGVJZCwgaW5zdGFuY2UucmVwbykgOiB1bmRlZmluZWQ7XG59XG5mdW5jdGlvbiBnZXRSZXBvTm9kZShub2RlSWQsIHJlcG8pIHtcbiAgICByZXR1cm4gcmVwby5nZXQobm9kZUlkKTtcbn1cbmV4cG9ydHMuZ2V0Q2FjaGVDdXJyZW50U3RhY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICB2YXIgY3VycmVudE5vZGUgPSBnZXRDdXJyZW50Tm9kZShpbnN0YW5jZSk7XG4gICAgcmV0dXJuIGN1cnJlbnROb2RlID8gY3VycmVudE5vZGUuaXRlbXMgOiB1bmRlZmluZWQ7XG59O1xuZXhwb3J0cy5lbnN1cmVPbkZsdXNoTWFwID0gZnVuY3Rpb24gKGVudGl0eSwgZmx1c2hBcmdzKSB7XG4gICAgdmFyIGVudGl0eVVpZCA9IFN0cmluZyhlbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV0pO1xuICAgIGlmICghZmx1c2hBcmdzLmZsdXNoTWFwLmhhcyhlbnRpdHlVaWQpKSB7XG4gICAgICAgIGV4cG9ydHMuZW5zdXJlSXRlbShlbnRpdHksIGZsdXNoQXJncyk7XG4gICAgfVxufTtcbmV4cG9ydHMuZW5zdXJlSXRlbSA9IGZ1bmN0aW9uIChlbnRpdHksIGZsdXNoQXJncykge1xuICAgIHZhciBpdGVtVWlkID0gU3RyaW5nKGVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSk7XG4gICAgdmFyIGl0ZW0gPSBmbHVzaEFyZ3MuZmx1c2hNYXAuZ2V0KGl0ZW1VaWQpO1xuICAgIGlmIChpdGVtKSB7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cbiAgICB2YXIgbGl2ZSA9IGV4cG9ydHMuZ2V0Q2FjaGVkSXRlbShpdGVtVWlkLCBmbHVzaEFyZ3MuaW5zdGFuY2UpO1xuICAgIGl0ZW0gPSBuZXcgQ2FjaGVJdGVtXzEuZGVmYXVsdChlbnRpdHksIGxpdmUpO1xuICAgIGZsdXNoQXJncy5mbHVzaE1hcC5zZXQoaXRlbVVpZCwgaXRlbSk7XG4gICAgZmx1c2hBcmdzLmZsdXNoTWFwWydfX1VQREFURURfXyddID0gdHJ1ZTtcbiAgICByZXR1cm4gaXRlbTtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9jYWNoZVV0aWwudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBDYWNoZU1hcF8xID0gcmVxdWlyZShcIi4vQ2FjaGVNYXBcIik7XG52YXIgQ2FjaGVJdGVtID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDYWNoZUl0ZW0oZW50aXR5LCBsaXZlSXRlbSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmNsb25lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBDYWNoZUl0ZW0oX3RoaXMuZW50aXR5LCBfdGhpcyk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZW50aXR5ID0gZW50aXR5O1xuICAgICAgICBpZiAobGl2ZUl0ZW0pIHtcbiAgICAgICAgICAgIHRoaXMubWFwRnJvbSA9IGxpdmVJdGVtLm1hcEZyb20uY2xvbmUoKTtcbiAgICAgICAgICAgIHRoaXMubWFwVG8gPSBsaXZlSXRlbS5tYXBUby5jbG9uZSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tYXBGcm9tID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5tYXBUbyA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gQ2FjaGVJdGVtO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IENhY2hlSXRlbTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NhY2hlSXRlbS50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIENhY2hlTWFwXzEgPSByZXF1aXJlKFwiLi9DYWNoZU1hcFwiKTtcbnZhciBjYWNoZVV0aWxfMSA9IHJlcXVpcmUoXCIuL2NhY2hlVXRpbFwiKTtcbnZhciBjYWNoZV8xID0gcmVxdWlyZShcIi4vY2FjaGVcIik7XG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbmV4cG9ydHMucHJlRmx1c2ggPSBmdW5jdGlvbiAoZmx1c2hBcmdzLCBpbnN0YW5jZSkge1xuICAgIHZhciB0ZW1wID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgIHZhciBjdXJyZW50U3RhY2sgPSBjYWNoZVV0aWxfMS5nZXRDYWNoZUN1cnJlbnRTdGFjayhpbnN0YW5jZSk7XG4gICAgaWYgKGN1cnJlbnRTdGFjaykge1xuICAgICAgICBjdXJyZW50U3RhY2suZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgICAgICB0ZW1wLnNldChrZXksIGl0ZW0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZmx1c2hBcmdzLmZsdXNoTWFwLmZvckVhY2goZnVuY3Rpb24gKGtleSwgaXRlbSkge1xuICAgICAgICB2YXIgaXRlbVVpZCA9IGl0ZW0uZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgICAgICBfZnJlZXplSXRlbShpdGVtKTtcbiAgICAgICAgdGVtcC5zZXQoU3RyaW5nKGl0ZW1VaWQpLCBpdGVtKTtcbiAgICB9KTtcbiAgICBpZiAoZmx1c2hBcmdzLmV2aWN0TWFwLnNpemUoKSA+IDApIHtcbiAgICAgICAgZmx1c2hBcmdzLmV2aWN0TWFwLmZvckVhY2goZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHRlbXAuZGVsZXRlKFN0cmluZyhrZXkpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGV4cG9ydHMuZmx1c2godGVtcCwgaW5zdGFuY2UpO1xufTtcbnZhciBfZnJlZXplSXRlbSA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgT2JqZWN0LmZyZWV6ZShpdGVtKTtcbiAgICBPYmplY3QuZnJlZXplKGl0ZW0uZW50aXR5KTtcbiAgICBPYmplY3QuZnJlZXplKGl0ZW0ubWFwVG8pO1xuICAgIE9iamVjdC5mcmVlemUoaXRlbS5tYXBGcm9tKTtcbn07XG5leHBvcnRzLmZsdXNoID0gZnVuY3Rpb24gKHRlbXAsIGluc3RhbmNlKSB7XG4gICAgaWYgKHRlbXAgIT09IG51bGwpIHtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZSh0ZW1wKTtcbiAgICAgICAgdmFyIGNhY2hlTm9kZSA9IHV0aWxfMS5nZXROZXdDYWNoZU5vZGUoaW5zdGFuY2UpO1xuICAgICAgICBjYWNoZU5vZGUuaXRlbXMgPSB0ZW1wO1xuICAgICAgICBpZiAoaW5zdGFuY2UudGhyZWFkLm5vZGVzLmluZGV4T2YoY2FjaGVOb2RlLmlkKSA8IDApIHtcbiAgICAgICAgICAgIGluc3RhbmNlLnRocmVhZC5ub2Rlcy5wdXNoKGNhY2hlTm9kZS5pZCk7XG4gICAgICAgICAgICBpbnN0YW5jZS50aHJlYWQuY3VycmVudCArPSAxO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2ZsdXNoLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbnZhciBjYWNoZVV0aWxfMSA9IHJlcXVpcmUoXCIuL2NhY2hlVXRpbFwiKTtcbnZhciByZWZfMSA9IHJlcXVpcmUoXCIuL3JlZlwiKTtcbnZhciBjYWNoZV8xID0gcmVxdWlyZShcIi4vY2FjaGVcIik7XG5leHBvcnRzLnBhcnNlID0gZnVuY3Rpb24gKGVudGl0eSwgZmx1c2hBcmdzKSB7XG4gICAgaWYgKHV0aWxfMS5oYXNVaWQoZW50aXR5KSkge1xuICAgICAgICBpZiAoY2FjaGVVdGlsXzEuaXNPbkNhY2hlKGVudGl0eSwgZmx1c2hBcmdzLmluc3RhbmNlKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgX2FkZFRvRmx1c2hNYXAoZW50aXR5LCBmbHVzaEFyZ3MpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKHV0aWxfMS5pc0FycmF5KGVudGl0eSkpIHtcbiAgICAgICAgICAgIF9wYXJzZUFycmF5KGVudGl0eSwgbnVsbCwgW10sIGZsdXNoQXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodXRpbF8xLmlzT2JqZWN0KGVudGl0eSkpIHtcbiAgICAgICAgICAgIF9wYXJzZU9iamVjdChlbnRpdHksIG51bGwsIFtdLCBmbHVzaEFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxufTtcbnZhciBfYWRkVG9GbHVzaE1hcCA9IGZ1bmN0aW9uIChlbnRpdHksIGZsdXNoQXJncykge1xuICAgIGNhY2hlVXRpbF8xLmVuc3VyZU9uRmx1c2hNYXAoZW50aXR5LCBmbHVzaEFyZ3MpO1xuICAgIF9wYXJzZUVudGl0eShlbnRpdHksIGVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSwgW10sIGZsdXNoQXJncyk7XG4gICAgcmVmXzEudXBkYXRlUmVmVG9zKFN0cmluZyhlbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV0pLCBmbHVzaEFyZ3MpO1xufTtcbnZhciBfcGFyc2VFbnRpdHkgPSBmdW5jdGlvbiAoZW50aXR5LCBwYXJlbnRVaWQsIHBhdGgsIGZsdXNoQXJncykge1xuICAgIGlmIChwYXRoID09PSB2b2lkIDApIHsgcGF0aCA9IFtdOyB9XG4gICAgZm9yICh2YXIga2V5IGluIGVudGl0eSkge1xuICAgICAgICBpZiAoZW50aXR5Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIHZhciByZWYgPSBlbnRpdHlba2V5XTtcbiAgICAgICAgICAgIGlmICh1dGlsXzEuaXNBcnJheShyZWYpKSB7XG4gICAgICAgICAgICAgICAgX3BhcnNlQXJyYXkocmVmLCBwYXJlbnRVaWQsIHBhdGguY29uY2F0KFtrZXldKSwgZmx1c2hBcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHV0aWxfMS5pc09iamVjdChyZWYpKSB7XG4gICAgICAgICAgICAgICAgX3BhcnNlT2JqZWN0KHJlZiwgcGFyZW50VWlkLCBwYXRoLmNvbmNhdChba2V5XSksIGZsdXNoQXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBPYmplY3QuZnJlZXplKHJlZik7XG4gICAgICAgIH1cbiAgICB9XG59O1xudmFyIF9wYXJzZUFycmF5ID0gZnVuY3Rpb24gKGFyciwgcGFyZW50VWlkLCBwYXRoLCBmbHVzaEFyZ3MpIHtcbiAgICBpZiAocGF0aCA9PT0gdm9pZCAwKSB7IHBhdGggPSBbXTsgfVxuICAgIGFyci5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xuICAgICAgICBpZiAodXRpbF8xLmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgICAgICAgIF9wYXJzZUFycmF5KGl0ZW0sIHBhcmVudFVpZCwgcGF0aC5jb25jYXQoW2luZGV4XSksIGZsdXNoQXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodXRpbF8xLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICAgICAgICBfcGFyc2VPYmplY3QoaXRlbSwgcGFyZW50VWlkLCBwYXRoLmNvbmNhdChbaW5kZXhdKSwgZmx1c2hBcmdzKTtcbiAgICAgICAgfVxuICAgIH0pO1xufTtcbnZhciBfcGFyc2VPYmplY3QgPSBmdW5jdGlvbiAob2JqLCBwYXJlbnRVaWQsIHBhdGgsIGZsdXNoQXJncykge1xuICAgIGlmICh1dGlsXzEuaGFzVWlkKG9iaikpIHtcbiAgICAgICAgX2NhY2hlVWlkT2JqKG9iaiwgcGFyZW50VWlkLCBwYXRoLCBmbHVzaEFyZ3MpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgX3BhcnNlRW50aXR5KG9iaiwgcGFyZW50VWlkLCBwYXRoLCBmbHVzaEFyZ3MpO1xuICAgIH1cbn07XG52YXIgX2NhY2hlVWlkT2JqID0gZnVuY3Rpb24gKGVudGl0eSwgcGFyZW50VWlkLCBwYXRoLCBmbHVzaEFyZ3MpIHtcbiAgICB2YXIgaXRlbSA9IGNhY2hlVXRpbF8xLmVuc3VyZUl0ZW0oZW50aXR5LCBmbHVzaEFyZ3MpO1xuICAgIGlmIChwYXJlbnRVaWQpXG4gICAgICAgIHJlZl8xLmFzc2lnblJlZlRvUGFyZW50KGl0ZW0sIHBhcmVudFVpZCwgcGF0aCwgZmx1c2hBcmdzKTtcbiAgICBpZiAoY2FjaGVVdGlsXzEuaXNPbkNhY2hlKGVudGl0eSwgZmx1c2hBcmdzLmluc3RhbmNlKVxuICAgICAgICB8fCBjYWNoZVV0aWxfMS5pc09uRmx1c2hNYXAoZW50aXR5LCBmbHVzaEFyZ3MuZmx1c2hNYXApKVxuICAgICAgICByZXR1cm47XG4gICAgZXhwb3J0cy5wYXJzZShlbnRpdHksIGZsdXNoQXJncyk7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcGFyc2UudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBjYWNoZV8xID0gcmVxdWlyZShcIi4vY2FjaGVcIik7XG5leHBvcnRzLnByaW50Q2FjaGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICB2YXIgcmVzdWx0ID0gXCJcIjtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBjdXJyZW50ID0gaW5zdGFuY2UudGhyZWFkLmN1cnJlbnQ7XG4gICAgdmFyIG5vZGVJbmRpY2VzID0gaW5zdGFuY2UudGhyZWFkLm5vZGVzO1xuICAgIG5vZGVJbmRpY2VzLm1hcChmdW5jdGlvbiAoY2FjaGVOb2RlSWQpIHtcbiAgICAgICAgdmFyIGNhY2hlTm9kZSA9IGluc3RhbmNlLnJlcG8uZ2V0KGNhY2hlTm9kZUlkKTtcbiAgICAgICAgdmFyIHN0cmVhbURhdGEgPSBcIlwiO1xuICAgICAgICB2YXIgc3RhdGUgPSBpbmRleCArIFwiOlwiICsgc3RyZWFtRGF0YSArIFwiW1wiICsgc3RyaW5naWZ5TWFwKGNhY2hlTm9kZS5pdGVtcykgKyBcIl1cXG5cXG5cIjtcbiAgICAgICAgaWYgKGluZGV4ID09PSBjdXJyZW50KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IFwiLT4gXCIgKyBzdGF0ZTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgKz0gc3RhdGU7XG4gICAgICAgIGluZGV4Kys7XG4gICAgfSk7XG4gICAgcmVzdWx0ID0gcmVzdWx0LnN1YnN0cmluZygwLCAocmVzdWx0Lmxlbmd0aCAtIDIpKTtcbiAgICBpbmRleCA9IDA7XG4gICAgcmV0dXJuIFwiXFxuLS0tLS0tIE9uZSAtLS0tLS0tXCJcbiAgICAgICAgKyBcIlxcblNUQUNLOlxcblwiICsgcmVzdWx0XG4gICAgICAgICsgXCJcXG5cXG5DT05GSUc6XCIgKyBKU09OLnN0cmluZ2lmeShjYWNoZV8xLmNvbmZpZywgbnVsbCwgMilcbiAgICAgICAgKyBcIlxcblxcblJFUE8gU0laRTpcIiArIGluc3RhbmNlLnJlcG8ubGVuZ3RoXG4gICAgICAgICsgXCJcXG49PT09PT09PT09PT09PT09PT09XFxuXCI7XG59O1xudmFyIHN0cmluZ2lmeU1hcCA9IGZ1bmN0aW9uIChtYXApIHtcbiAgICB2YXIgcmVzdWx0ID0gXCJcIjtcbiAgICBtYXAuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgIHZhciBpdGVtUmVzdWx0ID0gSlNPTi5zdHJpbmdpZnkoaXRlbSwgbnVsbCwgMik7XG4gICAgICAgIHJlc3VsdCArPSBpdGVtUmVzdWx0ICsgXCIsXFxuXCI7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wcmludC50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIENhY2hlUmVwb18xID0gcmVxdWlyZShcIi4vQ2FjaGVSZXBvXCIpO1xudmFyIENhY2hlVGhyZWFkXzEgPSByZXF1aXJlKFwiLi9DYWNoZVRocmVhZFwiKTtcbnZhciBDYWNoZUluc3RhbmNlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDYWNoZUluc3RhbmNlKG5hbWUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5yZXBvID0gbmV3IENhY2hlUmVwb18xLmRlZmF1bHQoKTtcbiAgICAgICAgdGhpcy50aHJlYWQgPSBuZXcgQ2FjaGVUaHJlYWRfMS5kZWZhdWx0KCk7XG4gICAgICAgIHRoaXMubmV4dE5vZGVLZXkgPSAwO1xuICAgICAgICB0aGlzLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMucmVwbyA9IG5ldyBDYWNoZVJlcG9fMS5kZWZhdWx0KCk7XG4gICAgICAgICAgICBfdGhpcy50aHJlYWQgPSBuZXcgQ2FjaGVUaHJlYWRfMS5kZWZhdWx0KCk7XG4gICAgICAgICAgICBfdGhpcy5uZXh0Tm9kZUtleSA9IDA7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYWRkTm9kZSA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMucmVwby5hZGQobm9kZSkpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy50aHJlYWQuYWRkTm9kZShub2RlLmlkKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5uZXh0Tm9kZUtleSsrO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmxlbmd0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy50aHJlYWQubm9kZXMubGVuZ3RoO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMucmVwby5sZW5ndGg7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgfVxuICAgIHJldHVybiBDYWNoZUluc3RhbmNlO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IENhY2hlSW5zdGFuY2U7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DYWNoZUluc3RhbmNlLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQ2FjaGVNYXBfMSA9IHJlcXVpcmUoXCIuL0NhY2hlTWFwXCIpO1xudmFyIENhY2hlUmVwbyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2FjaGVSZXBvKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLml0ZW1zID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmxlbmd0aCA9IDA7XG4gICAgICAgIHRoaXMuZ2V0ID0gZnVuY3Rpb24gKG5vZGVJZCkgeyByZXR1cm4gKF90aGlzLml0ZW1zLmdldChub2RlSWQpKTsgfTtcbiAgICAgICAgdGhpcy5hZGQgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgaWYgKCFfdGhpcy5pdGVtcy5oYXMobm9kZS5pZCkpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5pdGVtcy5zZXQobm9kZS5pZCwgbm9kZSk7XG4gICAgICAgICAgICAgICAgX3RoaXMubGVuZ3RoKys7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZGVsZXRlID0gZnVuY3Rpb24gKG5vZGVJZCkge1xuICAgICAgICAgICAgaWYgKF90aGlzLml0ZW1zLmhhcyhub2RlSWQpKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuaXRlbXMuZGVsZXRlKG5vZGVJZCk7XG4gICAgICAgICAgICAgICAgX3RoaXMubGVuZ3RoLS07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBDYWNoZVJlcG87XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ2FjaGVSZXBvO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2FjaGVSZXBvLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQ2FjaGVUaHJlYWQgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENhY2hlVGhyZWFkKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSAtMTtcbiAgICAgICAgdGhpcy5ub2RlcyA9IFtdO1xuICAgICAgICB0aGlzLmFkZE5vZGUgPSBmdW5jdGlvbiAobm9kZUlkKSB7XG4gICAgICAgICAgICBfdGhpcy5ub2Rlcy5wdXNoKG5vZGVJZCk7XG4gICAgICAgICAgICBfdGhpcy5jdXJyZW50Kys7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBDYWNoZVRocmVhZDtcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDYWNoZVRocmVhZDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NhY2hlVGhyZWFkLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgY2FjaGVfMSA9IHJlcXVpcmUoXCIuL2NhY2hlXCIpO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG52YXIgY2FjaGVVdGlsXzEgPSByZXF1aXJlKFwiLi9jYWNoZVV0aWxcIik7XG5leHBvcnRzLmdldEl0ZW0gPSBmdW5jdGlvbiAoZW50aXR5LCBpbnN0YW5jZSwgbm9kZUlkKSB7XG4gICAgaWYgKCFlbnRpdHkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9uZSBnZXQoKTogcmVxdWlyZXMgYSB1aWQgdG8gcmV0cmlldmUgYW4gaXRlbSBmcm9tIHRoZSBjYWNoZS5cIik7XG4gICAgfVxuICAgIGlmICh1dGlsXzEuaXNBcnJheShlbnRpdHkpKSB7XG4gICAgICAgIHJldHVybiBlbnRpdHkubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0T2JqZWN0KGl0ZW0sIGluc3RhbmNlKTtcbiAgICAgICAgfSkuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbSAhPT0gbnVsbCAmJiBpdGVtICE9PSB1bmRlZmluZWQ7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZ2V0T2JqZWN0KGVudGl0eSwgaW5zdGFuY2UpO1xufTtcbnZhciBnZXRPYmplY3QgPSBmdW5jdGlvbiAodWlkT3JFbnRpdHksIGluc3RhbmNlKSB7XG4gICAgdmFyIHJlYWxVaWQgPSBnZXRBY3R1YWxVaWQodWlkT3JFbnRpdHkpO1xuICAgIGlmICghcmVhbFVpZCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBpdGVtID0gY2FjaGVVdGlsXzEuZ2V0Q2FjaGVkSXRlbShyZWFsVWlkLCBpbnN0YW5jZSk7XG4gICAgcmV0dXJuIGl0ZW0gPyBpdGVtLmVudGl0eSA6IHVuZGVmaW5lZDtcbn07XG5leHBvcnRzLmdldEVkaXRJdGVtID0gZnVuY3Rpb24gKG9iaiwgaW5zdGFuY2UsIG5vZGVJZCkge1xuICAgIGlmICh1dGlsXzEuaXNBcnJheShvYmopKSB7XG4gICAgICAgIHJldHVybiBvYmoubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0RWRpdGFibGVPYmplY3QoaXRlbSwgaW5zdGFuY2UpO1xuICAgICAgICB9KS5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtICE9PSBudWxsICYmIGl0ZW0gIT09IHVuZGVmaW5lZDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBnZXRFZGl0YWJsZU9iamVjdChvYmosIGluc3RhbmNlKTtcbn07XG52YXIgZ2V0RWRpdGFibGVPYmplY3QgPSBmdW5jdGlvbiAodWlkT3JFbnRpdHksIGluc3RhbmNlKSB7XG4gICAgdmFyIHJlYWxVaWQgPSBnZXRBY3R1YWxVaWQodWlkT3JFbnRpdHkpO1xuICAgIHZhciBleGlzdGluZyA9IGV4cG9ydHMuZ2V0SXRlbShyZWFsVWlkLCBpbnN0YW5jZSk7XG4gICAgcmV0dXJuIGV4aXN0aW5nID8gdXRpbF8xLmRlZXBDbG9uZShleGlzdGluZywgdW5kZWZpbmVkLCBmYWxzZSkgOiB1bmRlZmluZWQ7XG59O1xudmFyIGdldEFjdHVhbFVpZCA9IGZ1bmN0aW9uICh1aWRPckVudGl0eSkge1xuICAgIGlmICh0eXBlb2YgdWlkT3JFbnRpdHkgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgcmV0dXJuIHVpZE9yRW50aXR5O1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgdWlkT3JFbnRpdHkgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZyh1aWRPckVudGl0eSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHV0aWxfMS5pc09iamVjdCh1aWRPckVudGl0eSkpIHtcbiAgICAgICAgaWYgKHV0aWxfMS5oYXNVaWQodWlkT3JFbnRpdHkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdWlkT3JFbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV07XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZ2V0LnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbnZhciBjYWNoZV8xID0gcmVxdWlyZShcIi4vY2FjaGVcIik7XG52YXIgZ2V0XzEgPSByZXF1aXJlKFwiLi9nZXRcIik7XG52YXIgQ2FjaGVNYXBfMSA9IHJlcXVpcmUoXCIuL0NhY2hlTWFwXCIpO1xudmFyIG9wYXRoID0gcmVxdWlyZShcIi4vcGF0aFwiKTtcbnZhciBsb2NhdGVfMSA9IHJlcXVpcmUoXCIuL2xvY2F0ZVwiKTtcbnZhciByZWZfMSA9IHJlcXVpcmUoXCIuL3JlZlwiKTtcbnZhciBjYWNoZVV0aWxfMSA9IHJlcXVpcmUoXCIuL2NhY2hlVXRpbFwiKTtcbnZhciBmbHVzaF8xID0gcmVxdWlyZShcIi4vZmx1c2hcIik7XG52YXIgcGFyc2VfMSA9IHJlcXVpcmUoXCIuL3BhcnNlXCIpO1xuZXhwb3J0cy5ldmljdEl0ZW0gPSBmdW5jdGlvbiAob2JqLCBpbnN0YW5jZSkge1xuICAgIHZhciB1aWRBcnJheSA9IGJ1aWxkRXZpY3RVaWRBcnJheShvYmopO1xuICAgIGlmICh1aWRBcnJheS5sZW5ndGggPT0gMCkge1xuICAgICAgICByZXR1cm4gbG9jYXRlXzEuZ2V0Q2FsbFN0YXRzKGZhbHNlLCBpbnN0YW5jZSk7XG4gICAgfVxuICAgIHZhciBjdXJyZW50U3RhdGUgPSBjYWNoZVV0aWxfMS5nZXRDYWNoZUN1cnJlbnRTdGFjayhpbnN0YW5jZSk7XG4gICAgdmFyIGZvdW5kID0gdWlkQXJyYXkuc29tZShmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICByZXR1cm4gY3VycmVudFN0YXRlICYmIGN1cnJlbnRTdGF0ZS5oYXMoU3RyaW5nKGl0ZW0pKTtcbiAgICB9KTtcbiAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgIHJldHVybiBsb2NhdGVfMS5nZXRDYWxsU3RhdHMoZmFsc2UsIGluc3RhbmNlKTtcbiAgICB9XG4gICAgdmFyIHRlbXBTdGF0ZSA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICBjdXJyZW50U3RhdGUuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICB0ZW1wU3RhdGUuc2V0KGtleSwgdmFsdWUpO1xuICAgIH0pO1xuICAgIHZhciBmbHVzaE1hcCA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICB2YXIgZXZpY3RNYXAgPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgdmFyIGZsdXNoQXJncyA9IHtcbiAgICAgICAgZmx1c2hNYXA6IGZsdXNoTWFwLFxuICAgICAgICBldmljdE1hcDogZXZpY3RNYXAsXG4gICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZVxuICAgIH07XG4gICAgdmFyIHBhcmVudHNDaGFuZ2VkID0gW107XG4gICAgdWlkQXJyYXkuZm9yRWFjaChmdW5jdGlvbiAodWlkKSB7XG4gICAgICAgIGNsZWFyVGFyZ2V0UmVmRnJvbXModWlkLCBmbHVzaEFyZ3MpO1xuICAgICAgICBldmljdE1hcC5zZXQodWlkLCBudWxsKTtcbiAgICAgICAgY2xlYXJQYXJlbnRSZWZUb3ModWlkLCB1aWRBcnJheSwgcGFyZW50c0NoYW5nZWQsIGZsdXNoQXJncyk7XG4gICAgfSk7XG4gICAgcHV0UGFyZW50c0NoYW5nZWQocGFyZW50c0NoYW5nZWQsIGZsdXNoTWFwLCBldmljdE1hcCwgaW5zdGFuY2UpO1xuICAgIGZsdXNoTWFwLmZvckVhY2goZnVuY3Rpb24gKGtleSwgaXRlbSkge1xuICAgICAgICB0ZW1wU3RhdGUuc2V0KGtleSwgaXRlbSk7XG4gICAgfSk7XG4gICAgZXZpY3RNYXAuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgIHRlbXBTdGF0ZS5kZWxldGUoa2V5KTtcbiAgICB9KTtcbiAgICBmbHVzaF8xLmZsdXNoKHRlbXBTdGF0ZSwgaW5zdGFuY2UpO1xuICAgIHJldHVybiBsb2NhdGVfMS5nZXRDYWxsU3RhdHModHJ1ZSwgaW5zdGFuY2UpO1xufTtcbnZhciBwdXRQYXJlbnRzQ2hhbmdlZCA9IGZ1bmN0aW9uIChwYXJlbnRzQ2hhbmdlZCwgZmx1c2hNYXAsIGV2aWN0TWFwLCBpbnN0YW5jZSkge1xuICAgIGlmIChwYXJlbnRzQ2hhbmdlZCAmJiBwYXJlbnRzQ2hhbmdlZC5sZW5ndGggPiAwICYmIHV0aWxfMS5jYWNoZVNpemUoaW5zdGFuY2UpID4gMCkge1xuICAgICAgICB2YXIgZmx1c2hBcmdzXzEgPSB7XG4gICAgICAgICAgICBmbHVzaE1hcDogZmx1c2hNYXAsXG4gICAgICAgICAgICBldmljdE1hcDogZXZpY3RNYXAsXG4gICAgICAgICAgICBpbnN0YW5jZTogaW5zdGFuY2VcbiAgICAgICAgfTtcbiAgICAgICAgcGFyc2VfMS5wYXJzZShwYXJlbnRzQ2hhbmdlZCwgZmx1c2hBcmdzXzEpO1xuICAgICAgICBmbHVzaEFyZ3NfMS5mbHVzaE1hcC5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIGl0ZW0pIHtcbiAgICAgICAgICAgIHJlZl8xLnVwZGF0ZVJlZkZyb21zKGl0ZW0sIGZsdXNoQXJnc18xKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbnZhciBjbGVhclRhcmdldFJlZkZyb21zID0gZnVuY3Rpb24gKGVudGl0eVVpZCwgZmx1c2hBcmdzKSB7XG4gICAgdmFyIGl0ZW0gPSBjYWNoZVV0aWxfMS5nZXRDYWNoZWRJdGVtKGVudGl0eVVpZCwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICBpZiAoaXRlbSkge1xuICAgICAgICBpdGVtLm1hcFRvLmZvckVhY2goZnVuY3Rpb24gKHRvVWlkLCBwYXRocykge1xuICAgICAgICAgICAgdmFyIHJlZkl0ZW0gPSBjYWNoZVV0aWxfMS5nZXRJdGVtRmx1c2hPckNhY2hlZCh0b1VpZCwgZmx1c2hBcmdzKTtcbiAgICAgICAgICAgIGlmIChyZWZJdGVtKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJSZWZGcm9tKHJlZkl0ZW0sIGVudGl0eVVpZCk7XG4gICAgICAgICAgICAgICAgaWYgKHJlZkl0ZW0ubWFwRnJvbS5zaXplKCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5VWlkID0gdG9VaWQ7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGFyZ2V0UmVmRnJvbXMoZW50aXR5VWlkLCBmbHVzaEFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZXZpY3RNYXAuc2V0KHRvVWlkLCByZWZJdGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZsdXNoQXJncy5mbHVzaE1hcC5zZXQodG9VaWQsIHJlZkl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcbnZhciBjbGVhclJlZkZyb20gPSBmdW5jdGlvbiAocmVmSXRlbSwgcGFyZW50VWlkKSB7XG4gICAgdmFyIHJlZnNBcnJheSA9IHJlZkl0ZW0ubWFwRnJvbS5nZXQocGFyZW50VWlkKTtcbiAgICBpZiAoIXJlZnNBcnJheSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlZkl0ZW0ubWFwRnJvbSA9IHJlZkl0ZW0ubWFwRnJvbS5jbG9uZSgpO1xuICAgIHJlZkl0ZW0ubWFwRnJvbS5kZWxldGUocGFyZW50VWlkKTtcbn07XG52YXIgY2xlYXJQYXJlbnRSZWZUb3MgPSBmdW5jdGlvbiAoZW50aXR5VWlkLCB1aWRBcnJheSwgcGFyZW50c0NoYW5nZWQsIGZsdXNoQXJncykge1xuICAgIHZhciBpdGVtID0gY2FjaGVVdGlsXzEuZ2V0SXRlbUZsdXNoT3JDYWNoZWQoZW50aXR5VWlkLCBmbHVzaEFyZ3MpO1xuICAgIGlmIChpdGVtKSB7XG4gICAgICAgIGl0ZW0ubWFwRnJvbS5mb3JFYWNoKGZ1bmN0aW9uIChwYXJlbnRVaWQsIHBhdGhzKSB7XG4gICAgICAgICAgICB2YXIgcGFyZW50SXRlbSA9IGNhY2hlVXRpbF8xLmdldEl0ZW1GbHVzaE9yQ2FjaGVkKHBhcmVudFVpZCwgZmx1c2hBcmdzKTtcbiAgICAgICAgICAgIGlmIChwYXJlbnRJdGVtKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN1Y2Nlc3MgPSBjbGVhclJlZlRvKHBhcmVudEl0ZW0sIGVudGl0eVVpZCwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICBpZiAoc3VjY2VzcyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZmx1c2hNYXAuc2V0KHBhcmVudFVpZCwgcGFyZW50SXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1aWRBcnJheS5pbmRleE9mKHBhcmVudFVpZCkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRzQ2hhbmdlZC5wdXNoKHBhcmVudEl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59O1xudmFyIGNsZWFyUmVmVG8gPSBmdW5jdGlvbiAocGFyZW50SXRlbSwgcmVmVWlkLCBpbnN0YW5jZSkge1xuICAgIHZhciBwYXJlbnQgPSBwYXJlbnRJdGVtLmVudGl0eTtcbiAgICBpZiAoT2JqZWN0LmlzRnJvemVuKHBhcmVudCkpIHtcbiAgICAgICAgcGFyZW50ID0gZ2V0XzEuZ2V0RWRpdEl0ZW0ocGFyZW50W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdLCBpbnN0YW5jZSk7XG4gICAgICAgIHBhcmVudEl0ZW0uZW50aXR5ID0gcGFyZW50O1xuICAgIH1cbiAgICB2YXIgcmVmUGF0aHMgPSBwYXJlbnRJdGVtLm1hcFRvLmdldChyZWZVaWQpO1xuICAgIHJlZlBhdGhzLmZvckVhY2goZnVuY3Rpb24gKHBhdGgpIHtcbiAgICAgICAgb3BhdGguZGVsKHBhcmVudCwgcGF0aCk7XG4gICAgfSk7XG4gICAgaWYgKCFPYmplY3QuaXNGcm96ZW4ocGFyZW50KSkge1xuICAgICAgICBPYmplY3QuZnJlZXplKHBhcmVudCk7XG4gICAgfVxuICAgIHBhcmVudEl0ZW0uZW50aXR5ID0gcGFyZW50O1xuICAgIHBhcmVudEl0ZW0ubWFwVG8gPSBwYXJlbnRJdGVtLm1hcFRvLmNsb25lKCk7XG4gICAgcGFyZW50SXRlbS5tYXBUby5kZWxldGUocmVmVWlkKTtcbiAgICByZXR1cm4gdHJ1ZTtcbn07XG52YXIgYnVpbGRFdmljdFVpZEFycmF5ID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHZhciB1aWRBcnJheSA9IFtdO1xuICAgIGlmICh1dGlsXzEuaXNBcnJheShvYmopKSB7XG4gICAgICAgIG9iai5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICBpZiAodXRpbF8xLmhhc1VpZChpdGVtKSkge1xuICAgICAgICAgICAgICAgIHVpZEFycmF5LnB1c2goU3RyaW5nKGl0ZW1bY2FjaGVfMS5jb25maWcudWlkTmFtZV0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgaXRlbSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgICAgICB1aWRBcnJheS5wdXNoKFN0cmluZyhpdGVtKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHZhciB1aWQgPSBvYmo7XG4gICAgICAgIGlmICh1dGlsXzEuaXNPYmplY3Qob2JqKSkge1xuICAgICAgICAgICAgdWlkID0gb2JqW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1aWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHVpZEFycmF5O1xuICAgICAgICB9XG4gICAgICAgIHVpZEFycmF5LnB1c2goU3RyaW5nKHVpZCkpO1xuICAgIH1cbiAgICByZXR1cm4gdWlkQXJyYXk7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZXZpY3QudHMiXSwic291cmNlUm9vdCI6IiJ9