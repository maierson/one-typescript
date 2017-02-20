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
	    if (window) {
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
	var util_1 = __webpack_require__(7);
	var get_1 = __webpack_require__(11);
	var evict_1 = __webpack_require__(18);
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
	    if (window) {
	        if (window[instanceName] === undefined) {
	            window[instanceName] = exports.instances[instanceName];
	        }
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
	            var item = get_1.getCachedItem(uid, instance);
	            return item.mapTo;
	        };
	        result.refFrom = function (uid) {
	            var item = get_1.getCachedItem(uid, instance);
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
	var locate_1 = __webpack_require__(6);
	var util_1 = __webpack_require__(7);
	var ref_1 = __webpack_require__(9);
	var flush_1 = __webpack_require__(10);
	exports.putItem = function (entity, instance) {
	    if (util_1.isArray(entity) || util_1.isObject(entity)) {
	        var evictMap = new CacheMap_1.default();
	        var flushMap = new CacheMap_1.default();
	        flushMap['__UPDATED__'] = false;
	        var flushArgs = {
	            entity: entity,
	            flushMap: flushMap,
	            evictMap: evictMap,
	            parentUid: null,
	            refPath: "",
	            instance: instance
	        };
	        flush_1.buildFlushMap(flushArgs);
	        ref_1.updatePointers(flushArgs);
	        if (flushArgs.flushMap.size() > 0 && flushMap['__UPDATED__'] === true) {
	            return commitPut(flushArgs);
	        }
	    }
	    return locate_1.getCallStats(false, instance);
	};
	var commitPut = function (flushArgs) {
	    flush_1.preFlush(flushArgs);
	    return locate_1.getCallStats(true, flushArgs.instance);
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var objectAssign = __webpack_require__(5);
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
	            var newInstance = objectAssign({}, _this.paths);
	            var clone = new CacheMap();
	            clone.paths = newInstance;
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var util_1 = __webpack_require__(7);
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var cache_1 = __webpack_require__(1);
	var CacheNode_1 = __webpack_require__(8);
	var locate_1 = __webpack_require__(6);
	var objectAssign = __webpack_require__(5);
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
/* 8 */
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var flush_1 = __webpack_require__(10);
	var cache_1 = __webpack_require__(1);
	var opath = __webpack_require__(12);
	var get_1 = __webpack_require__(11);
	var util_1 = __webpack_require__(7);
	exports.assignRefToParent = function (refItem, flushArgs) {
	    if (flushArgs.parentUid) {
	        var parentItem = flush_1.getItemFlushOrCached(flushArgs.parentUid, flushArgs);
	        if (parentItem && flushArgs.refPath) {
	            assignRefs(parentItem, refItem, flushArgs.refPath);
	        }
	    }
	};
	var assignRefs = function (parentItem, refItem, refPath) {
	    var parentUid = parentItem.entity[cache_1.config.uidName];
	    var refUid = refItem.entity[cache_1.config.uidName];
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
	    item.mapFrom.forEach(function (parentUid, paths) {
	        var parentItem = flushArgs.flushMap.get(parentUid);
	        if (!parentItem) {
	            parentItem = get_1.getCachedItem(parentUid, flushArgs.instance);
	        }
	        if (parentItem && paths.length > 0) {
	            var firstPath = paths[0];
	            var targetRef = opath.get(parentItem.entity, firstPath);
	            var dirty = targetRef && targetRef !== item.entity;
	            if (dirty === true) {
	                var args = {
	                    entity: parentItem.entity,
	                    flushMap: flushArgs.flushMap,
	                    instance: flushArgs.instance
	                };
	                parentItem = flush_1.ensureItem(args);
	                parentItem.entity = util_1.deepClone(parentItem.entity, item.entity, true);
	            }
	        }
	    });
	};
	exports.updateRefTos = function (entityUid, flushArgs) {
	    var item = flush_1.getItemFlushOrCached(entityUid, flushArgs);
	    updateItemRefTos(item, flushArgs);
	};
	var updateItemRefTos = function (item, flushArgs) {
	    if (item) {
	        item.mapTo.forEach(function (toUid, paths) {
	            var updatedPaths = paths.map(function (path) {
	                var reference = opath.get(item.entity, path);
	                if (reference) {
	                    var targetUid = reference[cache_1.config.uidName];
	                    if (targetUid) {
	                        var found = targetUid == toUid;
	                        if (found === true) {
	                            return path;
	                        }
	                    }
	                }
	                removeRefFrom_Value(item.entity[cache_1.config.uidName], toUid, flushArgs);
	            }).filter(function (item) {
	                return item !== null && item !== undefined;
	            });
	            if (updatedPaths.length > 0) {
	                item.mapTo.set(toUid, updatedPaths);
	            } else {
	                item.mapTo.delete(toUid);
	            }
	        });
	    }
	};
	var removeRefFrom_Value = function (parentUid, refUid, flushArgs) {
	    var refItem = flush_1.getItemFlushOrCached(refUid, flushArgs);
	    if (refItem) {
	        refItem = refItem.clone();
	        if (refItem.mapFrom.has(parentUid)) {
	            removeRefFrom(refItem, parentUid, flushArgs.refPath);
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
	
	var get_1 = __webpack_require__(11);
	var cache_1 = __webpack_require__(1);
	var util_1 = __webpack_require__(7);
	var path_1 = __webpack_require__(12);
	var CacheItem_1 = __webpack_require__(13);
	var CacheMap_1 = __webpack_require__(4);
	var ref_1 = __webpack_require__(9);
	exports.buildFlushMap = function (flushArgs) {
	    if (util_1.hasUid(flushArgs.entity)) {
	        buildEntityFlushMap(flushArgs);
	    } else {
	        if (util_1.isArray(flushArgs.entity)) {
	            cacheArrRefs(flushArgs);
	        } else {
	            cacheEntityRefs(flushArgs);
	        }
	    }
	};
	var buildEntityFlushMap = function (flushArgs) {
	    flushArgs.refPath = "";
	    if (isDirty(flushArgs) === true) {
	        ensureOnFlushMap(flushArgs);
	        cacheEntityRefs(flushArgs);
	        ref_1.updateRefTos(String(flushArgs.entity[cache_1.config.uidName]), flushArgs);
	    }
	};
	var ensureOnFlushMap = function (flushArgs) {
	    var entityUid = String(flushArgs.entity[cache_1.config.uidName]);
	    if (flushArgs.flushMap.has(entityUid) === false) {
	        exports.ensureItem(flushArgs);
	        flushArgs.parentUid = String(entityUid);
	    }
	};
	var cacheEntityRefs = function (flushArgs) {
	    var parentEntity = flushArgs.entity;
	    for (var prop in parentEntity) {
	        if (parentEntity.hasOwnProperty(prop)) {
	            var refEntity = parentEntity[prop];
	            if (util_1.isObject(refEntity) || util_1.isArray(refEntity) && refEntity.length > 0) {
	                flushArgs.entity = refEntity;
	                if (parentEntity[cache_1.config.uidName]) {
	                    flushArgs.parentUid = parentEntity[cache_1.config.uidName];
	                }
	                if (flushArgs.parentUid) {
	                    flushArgs.refPath = path_1.concatProp(flushArgs.refPath, prop);
	                }
	                if (!flushArgs.refPath) {
	                    flushArgs.refPath = prop;
	                }
	            }
	            if (util_1.isArray(refEntity) && refEntity.length > 0) {
	                cacheArrRefs(flushArgs);
	            } else if (util_1.isObject(refEntity)) {
	                cacheObjRefs(flushArgs);
	            }
	            Object.freeze(refEntity);
	        }
	    }
	};
	var cacheArrRefs = function (flushArgs) {
	    var entity = flushArgs.entity;
	    var arrayPath = flushArgs.refPath;
	    var arrayUid;
	    if (!arrayUid) {
	        arrayUid = flushArgs.parentUid;
	    }
	    entity.forEach(function (next, index) {
	        flushArgs.entity = next;
	        flushArgs.parentUid = arrayUid;
	        if (flushArgs.refPath || arrayPath) {
	            flushArgs.refPath = arrayPath + "." + index;
	        }
	        if (util_1.isArray(next)) {
	            cacheArrRefs(flushArgs);
	        } else if (util_1.isObject(next)) {
	            cacheObjRefs(flushArgs);
	        }
	    });
	    Object.freeze(entity);
	};
	var cacheObjRefs = function (flushArgs) {
	    if (util_1.hasUid(flushArgs.entity)) {
	        cacheUidObjRefs(flushArgs);
	    } else {
	        cacheEntityRefs(flushArgs);
	    }
	};
	var cacheUidObjRefs = function (flushArgs) {
	    var refItem = exports.ensureItem(flushArgs);
	    ref_1.assignRefToParent(refItem, flushArgs);
	    if (get_1.isOnCache(flushArgs) === true) return;
	    exports.buildFlushMap(flushArgs);
	};
	var isDirty = function (flushArgs) {
	    var cachedItem = get_1.getCachedItem(flushArgs.entity[cache_1.config.uidName], flushArgs.instance);
	    return !cachedItem || cachedItem.entity !== flushArgs.entity;
	};
	exports.getItemFlushOrCached = function (uid, flushArgs) {
	    if (uid) {
	        uid = String(uid);
	        var item = flushArgs.flushMap.get(uid);
	        if (!item) {
	            item = get_1.getCachedItem(uid, flushArgs.instance);
	        }
	        if (item && Object.isFrozen(item)) {
	            item = item.clone();
	        }
	        return item;
	    }
	};
	exports.ensureItem = function (flushArgs) {
	    var itemUid = String(flushArgs.entity[cache_1.config.uidName]);
	    var item = flushArgs.flushMap.get(itemUid);
	    if (item) {
	        return item;
	    }
	    var live = get_1.getCachedItem(itemUid, flushArgs.instance);
	    item = new CacheItem_1.default(flushArgs.entity, live);
	    flushArgs.flushMap.set(itemUid, item);
	    flushArgs.flushMap['__UPDATED__'] = true;
	    return item;
	};
	exports.preFlush = function (flushArgs) {
	    var temp = new CacheMap_1.default();
	    var currentStack = get_1.getCacheCurrentStack(flushArgs.instance);
	    if (currentStack) {
	        currentStack.forEach(function (key, item) {
	            temp.set(key, item);
	        });
	    }
	    flushArgs.flushMap.forEach(function (key, item) {
	        var itemUid = item.entity[cache_1.config.uidName];
	        freezeItem(item);
	        temp.set(String(itemUid), item);
	    });
	    if (flushArgs.evictMap.size() > 0) {
	        flushArgs.evictMap.forEach(function (key, value) {
	            temp.delete(String(key));
	        });
	    }
	    exports.flush(temp, flushArgs.instance);
	};
	var freezeItem = function (item) {
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var cache_1 = __webpack_require__(1);
	var util_1 = __webpack_require__(7);
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
	    var item = exports.getCachedItem(realUid, instance);
	    return item ? item.entity : undefined;
	};
	exports.getEditItem = function (obj, instance, nodeId) {
	    console.log("GET EDIT ITEM");
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
	exports.isOnCache = function (flushArgs) {
	    var uid = flushArgs.entity[cache_1.config.uidName];
	    var existingItem = exports.getCachedItem(uid, flushArgs.instance);
	    return existingItem && existingItem.entity === flushArgs.entity;
	};
	exports.getCachedItem = function (uid, instance) {
	    var currentNode = getCurrentNode(instance);
	    return currentNode ? currentNode.items.get(String(uid)) : undefined;
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

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var util_1 = __webpack_require__(7);
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
	exports.concatProp = function (propChain, prop) {
	    if (propChain === "") {
	        propChain = prop;
	    } else {
	        propChain = propChain + "." + prop;
	    }
	    return propChain;
	};

/***/ },
/* 13 */
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
	
	var util_1 = __webpack_require__(7);
	var cache_1 = __webpack_require__(1);
	var get_1 = __webpack_require__(11);
	var CacheMap_1 = __webpack_require__(4);
	var opath = __webpack_require__(12);
	var flush_1 = __webpack_require__(10);
	var locate_1 = __webpack_require__(6);
	var ref_1 = __webpack_require__(9);
	exports.evictItem = function (obj, instance) {
	    var uidArray = buildEvictUidArray(obj);
	    if (uidArray.length == 0) {
	        return locate_1.getCallStats(false, instance);
	    }
	    var currentState = get_1.getCacheCurrentStack(instance);
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
	        flushArgs.entityUid = uid;
	        clearTargetRefFroms(flushArgs);
	        evictMap.set(uid, null);
	        clearParentRefTos(uidArray, parentsChanged, flushArgs);
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
	        flush_1.buildFlushMap(flushArgs_1);
	        flushArgs_1.flushMap.forEach(function (key, item) {
	            ref_1.updateRefFroms(item, flushArgs_1);
	        });
	    }
	};
	var clearTargetRefFroms = function (flushArgs) {
	    var item = get_1.getCachedItem(flushArgs.entityUid, flushArgs.instance);
	    if (item) {
	        item.mapTo.forEach(function (toUid, paths) {
	            var refItem = flush_1.getItemFlushOrCached(toUid, flushArgs);
	            if (refItem) {
	                clearRefFrom(refItem, flushArgs.entityUid);
	                if (refItem.mapFrom.size() === 0) {
	                    flushArgs.entityUid = toUid;
	                    clearTargetRefFroms(flushArgs);
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
	var clearParentRefTos = function (uidArray, parentsChanged, flushArgs) {
	    var item = flush_1.getItemFlushOrCached(flushArgs.entityUid, flushArgs);
	    if (item) {
	        item.mapFrom.forEach(function (parentUid, paths) {
	            var parentItem = flush_1.getItemFlushOrCached(parentUid, flushArgs);
	            if (parentItem) {
	                var success = clearRefTo(parentItem, flushArgs.entityUid, flushArgs.instance);
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
	exports.clearNext = function (instance) {
	    var thread = instance.thread;
	    if (thread.current < thread.nodes.length - 1) {
	        var removedNodes = thread.nodes.slice(thread.current + 1, thread.nodes.length);
	        thread.nodes = thread.nodes.slice(0, thread.current + 1);
	        thread.current = thread.nodes.length - 1;
	        truncateThreads(removedNodes, instance);
	    }
	};
	var truncateThreads = function (removedNodes, instance) {
	    removedNodes.forEach(function (cacheNodeId) {
	        var cacheNode = instance.repo.get(cacheNodeId);
	        if (cacheNode) {
	            instance.repo.delete(cacheNodeId);
	        }
	    });
	};

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMjI3ZTE4MWE5M2Y4ZjAzZjQ2ZTAiLCJ3ZWJwYWNrOi8vLy4vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vY2FjaGUudHMiLCJ3ZWJwYWNrOi8vLy4vY29uZmlnLnRzIiwid2VicGFjazovLy8uL3B1dC50cyIsIndlYnBhY2s6Ly8vLi9DYWNoZU1hcC50cyIsIndlYnBhY2s6Ly8vLi4vfi9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwid2VicGFjazovLy8uL2xvY2F0ZS50cyIsIndlYnBhY2s6Ly8vLi91dGlsLnRzIiwid2VicGFjazovLy8uL0NhY2hlTm9kZS50cyIsIndlYnBhY2s6Ly8vLi9yZWYudHMiLCJ3ZWJwYWNrOi8vLy4vZmx1c2gudHMiLCJ3ZWJwYWNrOi8vLy4vZ2V0LnRzIiwid2VicGFjazovLy8uL3BhdGgudHMiLCJ3ZWJwYWNrOi8vLy4vQ2FjaGVJdGVtLnRzIiwid2VicGFjazovLy8uL3ByaW50LnRzIiwid2VicGFjazovLy8uL0NhY2hlSW5zdGFuY2UudHMiLCJ3ZWJwYWNrOi8vLy4vQ2FjaGVSZXBvLnRzIiwid2VicGFjazovLy8uL0NhY2hlVGhyZWFkLnRzIiwid2VicGFjazovLy8uL2V2aWN0LnRzIl0sIm5hbWVzIjpbImNhY2hlXzEiLCJyZXF1aXJlIiwiZXhwb3J0cyIsImdldENhY2hlIiwicHV0IiwiZ2V0IiwiZ2V0RWRpdCIsImV2aWN0IiwicmVzZXQiLCJ1dWlkIiwicHJpbnQiLCJ3aW5kb3ciLCJPbmUiLCJjb25maWdfMSIsInB1dF8xIiwicHJpbnRfMSIsIkNhY2hlSW5zdGFuY2VfMSIsInV0aWxfMSIsImdldF8xIiwiZXZpY3RfMSIsImluc3RhbmNlcyIsImNhY2hlVGVzdCIsInNldFRlc3RpbmciLCJ0ZXN0aW5nIiwiaW5zdGFuY2VOYW1lIiwiY29uZmlndXJhdGlvbiIsImRlZmF1bHRDb25maWciLCJjb25maWciLCJjb25maWd1cmUiLCJjcmVhdGVDYWNoZSIsInVuZGVmaW5lZCIsIml0ZW0iLCJlbnRpdHkiLCJub2RlSWQiLCJ1aWRPckVudGl0eU9yQXJyYXkiLCJsdXQiLCJpIiwidG9TdHJpbmciLCJkMCIsIk1hdGgiLCJyYW5kb20iLCJkMSIsImQyIiwiZDMiLCJuYW1lIiwiaW5zdGFuY2UiLCJkZWZhdWx0IiwicHV0SXRlbSIsImdldEl0ZW0iLCJnZXRFZGl0SXRlbSIsImV2aWN0SXRlbSIsInNpemUiLCJjYWNoZVNpemUiLCJsZW5ndGgiLCJjYWNoZUxlbmd0aCIsInByaW50Q2FjaGUiLCJyZXN1bHQiLCJyZWZUbyIsInVpZCIsImdldENhY2hlZEl0ZW0iLCJtYXBUbyIsInJlZkZyb20iLCJtYXBGcm9tIiwidWlkTmFtZSIsIm1heEhpc3RvcnlTdGF0ZXMiLCJjb25mIiwicCIsImhhc093blByb3BlcnR5IiwiQ2FjaGVNYXBfMSIsImxvY2F0ZV8xIiwicmVmXzEiLCJmbHVzaF8xIiwiaXNBcnJheSIsImlzT2JqZWN0IiwiZXZpY3RNYXAiLCJmbHVzaE1hcCIsImZsdXNoQXJncyIsInBhcmVudFVpZCIsInJlZlBhdGgiLCJidWlsZEZsdXNoTWFwIiwidXBkYXRlUG9pbnRlcnMiLCJjb21taXRQdXQiLCJnZXRDYWxsU3RhdHMiLCJwcmVGbHVzaCIsIm9iamVjdEFzc2lnbiIsIkNhY2hlTWFwIiwiX3RoaXMiLCJwYXRocyIsImtleSIsImRlbGV0ZSIsInZhbCIsImhhcyIsImZvckVhY2giLCJjYWxsYmFjayIsImNsb25lIiwibmV3SW5zdGFuY2UiLCJwcm90b3R5cGUiLCJzZXQiLCJ2YWx1ZSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5Iiwic3VjY2VzcyIsIm5vZGUiLCJjdXJyZW50Tm9kZSIsImdldEN1cnJlbnROb2RlIiwiaWQiLCJpc051bWJlciIsIlR5cGVFcnJvciIsImNhY2hlTm9kZSIsImdldFJlcG9Ob2RlIiwidGhyZWFkIiwiY3VycmVudCIsImJpbmFyeUluZGV4T2YiLCJub2RlcyIsImN1cnJlbnROb2RlSWQiLCJjYWNoZU5vZGVJZCIsInJlcG8iLCJhcnJheSIsInNlYXJjaEVsZW1lbnQiLCJtaW5JbmRleCIsIm1heEluZGV4IiwiY3VycmVudEluZGV4IiwiY3VycmVudEVsZW1lbnQiLCJDYWNoZU5vZGVfMSIsIl9oYXNPd25Qcm9wZXJ0eSIsImlzU3RyaW5nIiwib2JqIiwibWl4ZWRfdmFyIiwiY2FsbCIsImlzRnVuY3Rpb24iLCJBcnJheSIsInNwbGljZSIsInByb3BlcnR5SXNFbnVtZXJhYmxlIiwib2JqVG9TdHIiLCJvIiwiaXNEYXRlIiwiaXNFbXB0eSIsImdldE5ld0NhY2hlTm9kZSIsIkNhY2hlTm9kZSIsIm5leHROb2RlS2V5IiwiYWRkIiwiaGFzVWlkIiwiRnVuY3Rpb24iLCJ0YXJnZXQiLCJTVFJJUF9DT01NRU5UUyIsIkFSR1VNRU5UX05BTUVTIiwiZ2V0UGFyYW1OYW1lcyIsImZ1bmMiLCJmblN0ciIsInJlcGxhY2UiLCJzbGljZSIsImluZGV4T2YiLCJtYXRjaCIsInN0cmluZ2lmeSIsIlJlZ0V4cCIsImJvZHkiLCJ0cmltIiwicGFyYW1OYW1lcyIsImJpbmQiLCJkZWVwQ2xvbmUiLCJ1aWRSZWZlcmVuY2UiLCJmcmVlemUiLCJpc0Zyb3plbiIsInByb3BOYW1lIiwiZGVlcENsb25lQXJyYXkiLCJkYXRlIiwiRGF0ZSIsImdldFRpbWUiLCJhcnIiLCJtYXAiLCJpdGVtcyIsIm9wYXRoIiwiYXNzaWduUmVmVG9QYXJlbnQiLCJyZWZJdGVtIiwicGFyZW50SXRlbSIsImdldEl0ZW1GbHVzaE9yQ2FjaGVkIiwiYXNzaWduUmVmcyIsInJlZlVpZCIsImFkZFJlZlRvIiwiYWRkUmVmRnJvbSIsInBhdGgiLCJyZWZBcnJheSIsInB1c2giLCJmcm9tQXJyYXkiLCJ1cGRhdGVJdGVtUmVmVG9zIiwidXBkYXRlUmVmRnJvbXMiLCJmaXJzdFBhdGgiLCJ0YXJnZXRSZWYiLCJkaXJ0eSIsImFyZ3MiLCJlbnN1cmVJdGVtIiwidXBkYXRlUmVmVG9zIiwiZW50aXR5VWlkIiwidG9VaWQiLCJ1cGRhdGVkUGF0aHMiLCJyZWZlcmVuY2UiLCJ0YXJnZXRVaWQiLCJmb3VuZCIsInJlbW92ZVJlZkZyb21fVmFsdWUiLCJmaWx0ZXIiLCJyZW1vdmVSZWZGcm9tIiwicmVmc0FycmF5IiwiaW5kZXgiLCJwYXRoXzEiLCJDYWNoZUl0ZW1fMSIsImJ1aWxkRW50aXR5Rmx1c2hNYXAiLCJjYWNoZUFyclJlZnMiLCJjYWNoZUVudGl0eVJlZnMiLCJpc0RpcnR5IiwiZW5zdXJlT25GbHVzaE1hcCIsIlN0cmluZyIsInBhcmVudEVudGl0eSIsInByb3AiLCJyZWZFbnRpdHkiLCJjb25jYXRQcm9wIiwiY2FjaGVPYmpSZWZzIiwiYXJyYXlQYXRoIiwiYXJyYXlVaWQiLCJuZXh0IiwiY2FjaGVVaWRPYmpSZWZzIiwiaXNPbkNhY2hlIiwiY2FjaGVkSXRlbSIsIml0ZW1VaWQiLCJsaXZlIiwidGVtcCIsImN1cnJlbnRTdGFjayIsImdldENhY2hlQ3VycmVudFN0YWNrIiwiZnJlZXplSXRlbSIsImZsdXNoIiwiZ2V0T2JqZWN0IiwidWlkT3JFbnRpdHkiLCJyZWFsVWlkIiwiZ2V0QWN0dWFsVWlkIiwiY29uc29sZSIsImxvZyIsImdldEVkaXRhYmxlT2JqZWN0IiwiZXhpc3RpbmciLCJleGlzdGluZ0l0ZW0iLCJnZXRLZXkiLCJpbnRLZXkiLCJwYXJzZUludCIsImRlbCIsInNwbGl0IiwiY3VycmVudFBhdGgiLCJvbGRWYWwiLCJkZWZhdWx0VmFsdWUiLCJwcm9wQ2hhaW4iLCJDYWNoZUl0ZW0iLCJsaXZlSXRlbSIsIm5vZGVJbmRpY2VzIiwic3RyZWFtRGF0YSIsInN0YXRlIiwic3RyaW5naWZ5TWFwIiwic3Vic3RyaW5nIiwiSlNPTiIsIml0ZW1SZXN1bHQiLCJDYWNoZVJlcG9fMSIsIkNhY2hlVGhyZWFkXzEiLCJDYWNoZUluc3RhbmNlIiwiYWRkTm9kZSIsIkNhY2hlUmVwbyIsIkNhY2hlVGhyZWFkIiwidWlkQXJyYXkiLCJidWlsZEV2aWN0VWlkQXJyYXkiLCJjdXJyZW50U3RhdGUiLCJzb21lIiwidGVtcFN0YXRlIiwicGFyZW50c0NoYW5nZWQiLCJjbGVhclRhcmdldFJlZkZyb21zIiwiY2xlYXJQYXJlbnRSZWZUb3MiLCJwdXRQYXJlbnRzQ2hhbmdlZCIsImZsdXNoQXJnc18xIiwiY2xlYXJSZWZGcm9tIiwiY2xlYXJSZWZUbyIsInBhcmVudCIsInJlZlBhdGhzIiwiY2xlYXJOZXh0IiwicmVtb3ZlZE5vZGVzIiwidHJ1bmNhdGVUaHJlYWRzIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQTs7QUFDQSxLQUFJQSxVQUFVLG1CQUFBQyxDQUFRLENBQVIsQ0FBZDtBQUNBQyxTQUFRQyxRQUFSLEdBQW1CSCxRQUFRRyxRQUEzQjtBQUNBRCxTQUFRRSxHQUFSLEdBQWNKLFFBQVFJLEdBQXRCO0FBQ0FGLFNBQVFHLEdBQVIsR0FBY0wsUUFBUUssR0FBdEI7QUFDQUgsU0FBUUksT0FBUixHQUFrQk4sUUFBUU0sT0FBMUI7QUFDQUosU0FBUUssS0FBUixHQUFnQlAsUUFBUU8sS0FBeEI7QUFDQUwsU0FBUU0sS0FBUixHQUFnQlIsUUFBUVEsS0FBeEI7QUFDQU4sU0FBUU8sSUFBUixHQUFlVCxRQUFRUyxJQUF2QjtBQUNBUCxTQUFRUSxLQUFSLEdBQWdCVixRQUFRVSxLQUF4QjtBQUNBLEVBQUMsWUFBWTtBQUNULFNBQUlDLE1BQUosRUFBWTtBQUNSQSxnQkFBT0MsR0FBUCxHQUFhO0FBQ1RULHVCQUFVSCxRQUFRRyxRQURUO0FBRVRDLGtCQUFLSixRQUFRSSxHQUZKO0FBR1RDLGtCQUFLTCxRQUFRSyxHQUhKO0FBSVRDLHNCQUFTTixRQUFRTSxPQUpSO0FBS1RDLG9CQUFPUCxRQUFRTyxLQUxOO0FBTVRDLG9CQUFPUixRQUFRUSxLQU5OO0FBT1RDLG1CQUFNVCxRQUFRUyxJQVBMO0FBUVRDLG9C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YixHQUFzQixDQUF2QztBQUNBaU8seUJBQWdCRCxZQUFoQixFQUE4QnhPLFFBQTlCO0FBQ0g7QUFDSixFQVJEO0FBU0EsS0FBSXlPLGtCQUFrQixVQUFVRCxZQUFWLEVBQXdCeE8sUUFBeEIsRUFBa0M7QUFDcER3TyxrQkFBYXpMLE9BQWIsQ0FBcUIsVUFBVXVCLFdBQVYsRUFBdUI7QUFDeEMsYUFBSVAsWUFBWS9ELFNBQVN1RSxJQUFULENBQWMvRyxHQUFkLENBQWtCOEcsV0FBbEIsQ0FBaEI7QUFDQSxhQUFJUCxTQUFKLEVBQWU7QUFDWC9ELHNCQUFTdUUsSUFBVCxDQUFjM0IsTUFBZCxDQUFxQjBCLFdBQXJCO0FBQ0g7QUFDSixNQUxEO0FBTUgsRUFQRCxDIiwiZmlsZSI6Im9uZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDIyN2UxODFhOTNmOGYwM2Y0NmUwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgY2FjaGVfMSA9IHJlcXVpcmUoXCIuL2NhY2hlXCIpO1xuZXhwb3J0cy5nZXRDYWNoZSA9IGNhY2hlXzEuZ2V0Q2FjaGU7XG5leHBvcnRzLnB1dCA9IGNhY2hlXzEucHV0O1xuZXhwb3J0cy5nZXQgPSBjYWNoZV8xLmdldDtcbmV4cG9ydHMuZ2V0RWRpdCA9IGNhY2hlXzEuZ2V0RWRpdDtcbmV4cG9ydHMuZXZpY3QgPSBjYWNoZV8xLmV2aWN0O1xuZXhwb3J0cy5yZXNldCA9IGNhY2hlXzEucmVzZXQ7XG5leHBvcnRzLnV1aWQgPSBjYWNoZV8xLnV1aWQ7XG5leHBvcnRzLnByaW50ID0gY2FjaGVfMS5wcmludDtcbihmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHdpbmRvdykge1xuICAgICAgICB3aW5kb3cuT25lID0ge1xuICAgICAgICAgICAgZ2V0Q2FjaGU6IGNhY2hlXzEuZ2V0Q2FjaGUsXG4gICAgICAgICAgICBwdXQ6IGNhY2hlXzEucHV0LFxuICAgICAgICAgICAgZ2V0OiBjYWNoZV8xLmdldCxcbiAgICAgICAgICAgIGdldEVkaXQ6IGNhY2hlXzEuZ2V0RWRpdCxcbiAgICAgICAgICAgIGV2aWN0OiBjYWNoZV8xLmV2aWN0LFxuICAgICAgICAgICAgcmVzZXQ6IGNhY2hlXzEucmVzZXQsXG4gICAgICAgICAgICB1dWlkOiBjYWNoZV8xLnV1aWQsXG4gICAgICAgICAgICBwcmludDogY2FjaGVfMS5wcmludFxuICAgICAgICB9O1xuICAgIH1cbn0pKCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9pbmRleC50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIGNvbmZpZ18xID0gcmVxdWlyZShcIi4vY29uZmlnXCIpO1xudmFyIHB1dF8xID0gcmVxdWlyZShcIi4vcHV0XCIpO1xudmFyIHByaW50XzEgPSByZXF1aXJlKFwiLi9wcmludFwiKTtcbnZhciBDYWNoZUluc3RhbmNlXzEgPSByZXF1aXJlKFwiLi9DYWNoZUluc3RhbmNlXCIpO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG52YXIgZ2V0XzEgPSByZXF1aXJlKFwiLi9nZXRcIik7XG52YXIgZXZpY3RfMSA9IHJlcXVpcmUoXCIuL2V2aWN0XCIpO1xuZXhwb3J0cy5pbnN0YW5jZXMgPSB7fTtcbnZhciBjYWNoZVRlc3QgPSBmYWxzZTtcbmZ1bmN0aW9uIHNldFRlc3RpbmcodGVzdGluZykge1xuICAgIGNhY2hlVGVzdCA9IHRlc3Rpbmc7XG59XG5leHBvcnRzLnNldFRlc3RpbmcgPSBzZXRUZXN0aW5nO1xuZnVuY3Rpb24gZ2V0Q2FjaGUoaW5zdGFuY2VOYW1lLCBjb25maWd1cmF0aW9uKSB7XG4gICAgaWYgKGluc3RhbmNlTmFtZSA9PT0gdm9pZCAwKSB7IGluc3RhbmNlTmFtZSA9IFwib25lXCI7IH1cbiAgICBpZiAoY29uZmlndXJhdGlvbiA9PT0gdm9pZCAwKSB7IGNvbmZpZ3VyYXRpb24gPSBjb25maWdfMS5kZWZhdWx0Q29uZmlnOyB9XG4gICAgaWYgKCFleHBvcnRzLmNvbmZpZykge1xuICAgICAgICBleHBvcnRzLmNvbmZpZyA9IGNvbmZpZ18xLmNvbmZpZ3VyZShjb25maWd1cmF0aW9uKTtcbiAgICB9XG4gICAgaWYgKCFleHBvcnRzLmluc3RhbmNlc1tpbnN0YW5jZU5hbWVdKSB7XG4gICAgICAgIGV4cG9ydHMuaW5zdGFuY2VzW2luc3RhbmNlTmFtZV0gPSBjcmVhdGVDYWNoZShpbnN0YW5jZU5hbWUpO1xuICAgIH1cbiAgICBpZiAod2luZG93KSB7XG4gICAgICAgIGlmICh3aW5kb3dbaW5zdGFuY2VOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB3aW5kb3dbaW5zdGFuY2VOYW1lXSA9IGV4cG9ydHMuaW5zdGFuY2VzW2luc3RhbmNlTmFtZV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGV4cG9ydHMuaW5zdGFuY2VzW2luc3RhbmNlTmFtZV07XG59XG5leHBvcnRzLmdldENhY2hlID0gZ2V0Q2FjaGU7XG5leHBvcnRzLnB1dCA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgZ2V0Q2FjaGUoKS5wdXQoaXRlbSk7XG59O1xuZXhwb3J0cy5nZXQgPSBmdW5jdGlvbiAoZW50aXR5LCBub2RlSWQpIHtcbiAgICByZXR1cm4gZ2V0Q2FjaGUoKS5nZXQoZW50aXR5LCBub2RlSWQpO1xufTtcbmV4cG9ydHMuZ2V0RWRpdCA9IGZ1bmN0aW9uICh1aWRPckVudGl0eU9yQXJyYXksIG5vZGVJZCkge1xuICAgIHJldHVybiBnZXRDYWNoZSgpLmdldEVkaXQodWlkT3JFbnRpdHlPckFycmF5LCBub2RlSWQpO1xufTtcbmV4cG9ydHMuZXZpY3QgPSBmdW5jdGlvbiAodWlkT3JFbnRpdHlPckFycmF5KSB7XG4gICAgcmV0dXJuIGdldENhY2hlKCkuZXZpY3QodWlkT3JFbnRpdHlPckFycmF5KTtcbn07XG5leHBvcnRzLnByaW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBnZXRDYWNoZSgpLnByaW50KCk7XG59O1xuZXhwb3J0cy5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICBnZXRDYWNoZSgpLnJlc2V0KCk7XG59O1xuZXhwb3J0cy51dWlkID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBsdXQgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDI1NjsgaSsrKSB7XG4gICAgICAgIGx1dFtpXSA9IChpIDwgMTYgPyAnMCcgOiAnJykgKyAoaSkudG9TdHJpbmcoMTYpO1xuICAgIH1cbiAgICB2YXIgZDAgPSBNYXRoLnJhbmRvbSgpICogMHgxMDAwMDAwMDAgfCAwO1xuICAgIHZhciBkMSA9IE1hdGgucmFuZG9tKCkgKiAweDEwMDAwMDAwMCB8IDA7XG4gICAgdmFyIGQyID0gTWF0aC5yYW5kb20oKSAqIDB4MTAwMDAwMDAwIHwgMDtcbiAgICB2YXIgZDMgPSBNYXRoLnJhbmRvbSgpICogMHgxMDAwMDAwMDAgfCAwO1xuICAgIHJldHVybiBsdXRbZDAgJiAweEZGXSArIGx1dFtkMCA+PiA4ICYgMHhGRl0gKyBsdXRbZDAgPj4gMTYgJiAweEZGXVxuICAgICAgICArIGx1dFtkMCA+PiAyNCAmIDB4RkZdICsgJy0nICsgbHV0W2QxICYgMHhGRl1cbiAgICAgICAgKyBsdXRbZDEgPj4gOCAmIDB4RkZdICsgJy0nICsgbHV0W2QxID4+IDE2ICYgMHgwZiB8IDB4NDBdXG4gICAgICAgICsgbHV0W2QxID4+IDI0ICYgMHhGRl0gKyAnLScgKyBsdXRbZDIgJiAweDNmIHwgMHg4MF1cbiAgICAgICAgKyBsdXRbZDIgPj4gOCAmIDB4RkZdICsgJy0nICsgbHV0W2QyID4+IDE2ICYgMHhGRl1cbiAgICAgICAgKyBsdXRbZDIgPj4gMjQgJiAweEZGXSArIGx1dFtkMyAmIDB4RkZdICsgbHV0W2QzID4+IDggJiAweEZGXVxuICAgICAgICArIGx1dFtkMyA+PiAxNiAmIDB4RkZdICsgbHV0W2QzID4+IDI0ICYgMHhGRl07XG59O1xuZnVuY3Rpb24gY3JlYXRlQ2FjaGUobmFtZSkge1xuICAgIHZhciBpbnN0YW5jZSA9IG5ldyBDYWNoZUluc3RhbmNlXzEuZGVmYXVsdChuYW1lKTtcbiAgICB2YXIgcmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGluc3RhbmNlLnJlc2V0KCk7XG4gICAgfTtcbiAgICB2YXIgcHV0ID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIHB1dF8xLnB1dEl0ZW0oaXRlbSwgaW5zdGFuY2UpO1xuICAgIH07XG4gICAgdmFyIGdldCA9IGZ1bmN0aW9uIChlbnRpdHksIG5vZGVJZCkge1xuICAgICAgICByZXR1cm4gZ2V0XzEuZ2V0SXRlbShlbnRpdHksIGluc3RhbmNlLCBub2RlSWQpO1xuICAgIH07XG4gICAgdmFyIGdldEVkaXQgPSBmdW5jdGlvbiAodWlkT3JFbnRpdHlPckFycmF5LCBub2RlSWQpIHtcbiAgICAgICAgcmV0dXJuIGdldF8xLmdldEVkaXRJdGVtKHVpZE9yRW50aXR5T3JBcnJheSwgaW5zdGFuY2UsIG5vZGVJZCk7XG4gICAgfTtcbiAgICB2YXIgZXZpY3QgPSBmdW5jdGlvbiAodWlkT3JFbnRpdHlPckFycmF5KSB7XG4gICAgICAgIHJldHVybiBldmljdF8xLmV2aWN0SXRlbSh1aWRPckVudGl0eU9yQXJyYXksIGluc3RhbmNlKTtcbiAgICB9O1xuICAgIHZhciBzaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdXRpbF8xLmNhY2hlU2l6ZShpbnN0YW5jZSk7XG4gICAgfTtcbiAgICB2YXIgbGVuZ3RoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdXRpbF8xLmNhY2hlTGVuZ3RoKGluc3RhbmNlKTtcbiAgICB9O1xuICAgIHZhciBwcmludCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHByaW50XzEucHJpbnRDYWNoZShpbnN0YW5jZSk7XG4gICAgfTtcbiAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICBwdXQ6IHB1dCxcbiAgICAgICAgZ2V0OiBnZXQsXG4gICAgICAgIGdldEVkaXQ6IGdldEVkaXQsXG4gICAgICAgIGV2aWN0OiBldmljdCxcbiAgICAgICAgcmVzZXQ6IHJlc2V0LFxuICAgICAgICBzaXplOiBzaXplLFxuICAgICAgICBsZW5ndGg6IGxlbmd0aCxcbiAgICAgICAgcHJpbnQ6IHByaW50LFxuICAgIH07XG4gICAgaWYgKGNhY2hlVGVzdCA9PT0gdHJ1ZSkge1xuICAgICAgICByZXN1bHQucmVmVG8gPSBmdW5jdGlvbiAodWlkKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGdldF8xLmdldENhY2hlZEl0ZW0odWlkLCBpbnN0YW5jZSk7XG4gICAgICAgICAgICByZXR1cm4gaXRlbS5tYXBUbztcbiAgICAgICAgfTtcbiAgICAgICAgcmVzdWx0LnJlZkZyb20gPSBmdW5jdGlvbiAodWlkKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGdldF8xLmdldENhY2hlZEl0ZW0odWlkLCBpbnN0YW5jZSk7XG4gICAgICAgICAgICByZXR1cm4gaXRlbS5tYXBGcm9tO1xuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vY2FjaGUudHMiLCJcInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMuZGVmYXVsdENvbmZpZyA9IHtcbiAgICB1aWROYW1lOiBcInVpZFwiLFxuICAgIG1heEhpc3RvcnlTdGF0ZXM6IDEwMDBcbn07XG5mdW5jdGlvbiBjb25maWd1cmUoY29uZikge1xuICAgIGZvciAodmFyIHAgaW4gZXhwb3J0cy5kZWZhdWx0Q29uZmlnKSB7XG4gICAgICAgIGlmIChleHBvcnRzLmRlZmF1bHRDb25maWcuaGFzT3duUHJvcGVydHkocCkgJiYgY29uZi5oYXNPd25Qcm9wZXJ0eShwKSkge1xuICAgICAgICAgICAgZXhwb3J0cy5kZWZhdWx0Q29uZmlnW3BdID0gY29uZltwXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZXhwb3J0cy5kZWZhdWx0Q29uZmlnO1xufVxuZXhwb3J0cy5jb25maWd1cmUgPSBjb25maWd1cmU7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9jb25maWcudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBDYWNoZU1hcF8xID0gcmVxdWlyZShcIi4vQ2FjaGVNYXBcIik7XG52YXIgbG9jYXRlXzEgPSByZXF1aXJlKFwiLi9sb2NhdGVcIik7XG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbnZhciByZWZfMSA9IHJlcXVpcmUoXCIuL3JlZlwiKTtcbnZhciBmbHVzaF8xID0gcmVxdWlyZShcIi4vZmx1c2hcIik7XG5leHBvcnRzLnB1dEl0ZW0gPSBmdW5jdGlvbiAoZW50aXR5LCBpbnN0YW5jZSkge1xuICAgIGlmICgodXRpbF8xLmlzQXJyYXkoZW50aXR5KSB8fCB1dGlsXzEuaXNPYmplY3QoZW50aXR5KSkpIHtcbiAgICAgICAgdmFyIGV2aWN0TWFwID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgICAgICB2YXIgZmx1c2hNYXAgPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgICAgIGZsdXNoTWFwWydfX1VQREFURURfXyddID0gZmFsc2U7XG4gICAgICAgIHZhciBmbHVzaEFyZ3MgPSB7XG4gICAgICAgICAgICBlbnRpdHk6IGVudGl0eSxcbiAgICAgICAgICAgIGZsdXNoTWFwOiBmbHVzaE1hcCxcbiAgICAgICAgICAgIGV2aWN0TWFwOiBldmljdE1hcCxcbiAgICAgICAgICAgIHBhcmVudFVpZDogbnVsbCxcbiAgICAgICAgICAgIHJlZlBhdGg6IFwiXCIsXG4gICAgICAgICAgICBpbnN0YW5jZTogaW5zdGFuY2VcbiAgICAgICAgfTtcbiAgICAgICAgZmx1c2hfMS5idWlsZEZsdXNoTWFwKGZsdXNoQXJncyk7XG4gICAgICAgIHJlZl8xLnVwZGF0ZVBvaW50ZXJzKGZsdXNoQXJncyk7XG4gICAgICAgIGlmIChmbHVzaEFyZ3MuZmx1c2hNYXAuc2l6ZSgpID4gMCAmJiBmbHVzaE1hcFsnX19VUERBVEVEX18nXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbW1pdFB1dChmbHVzaEFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBsb2NhdGVfMS5nZXRDYWxsU3RhdHMoZmFsc2UsIGluc3RhbmNlKTtcbn07XG52YXIgY29tbWl0UHV0ID0gZnVuY3Rpb24gKGZsdXNoQXJncykge1xuICAgIGZsdXNoXzEucHJlRmx1c2goZmx1c2hBcmdzKTtcbiAgICByZXR1cm4gbG9jYXRlXzEuZ2V0Q2FsbFN0YXRzKHRydWUsIGZsdXNoQXJncy5pbnN0YW5jZSk7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcHV0LnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgb2JqZWN0QXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xudmFyIENhY2hlTWFwID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDYWNoZU1hcCgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5wYXRocyA9IHt9O1xuICAgICAgICB0aGlzLmxlbmd0aCA9IDA7XG4gICAgICAgIHRoaXMuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLnBhdGhzW2tleV07XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZGVsZXRlID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBfdGhpcy5wYXRoc1trZXldICE9PSBcInVuZGVmaW5lZFwiICYmIF90aGlzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsID0gX3RoaXMucGF0aHNba2V5XTtcbiAgICAgICAgICAgICAgICBkZWxldGUgX3RoaXMucGF0aHNba2V5XTtcbiAgICAgICAgICAgICAgICBfdGhpcy5sZW5ndGgtLTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmhhcyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgX3RoaXMucGF0aHNba2V5XSAhPT0gJ3VuZGVmaW5lZCc7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZm9yRWFjaCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIF90aGlzLnBhdGhzKSB7XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLnBhdGhzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soa2V5LCBfdGhpcy5wYXRoc1trZXldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY2xvbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbmV3SW5zdGFuY2UgPSBvYmplY3RBc3NpZ24oe30sIF90aGlzLnBhdGhzKTtcbiAgICAgICAgICAgIHZhciBjbG9uZSA9IG5ldyBDYWNoZU1hcCgpO1xuICAgICAgICAgICAgY2xvbmUucGF0aHMgPSBuZXdJbnN0YW5jZTtcbiAgICAgICAgICAgIGNsb25lLmxlbmd0aCA9IF90aGlzLmxlbmd0aDtcbiAgICAgICAgICAgIHJldHVybiBjbG9uZTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgQ2FjaGVNYXAucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5wYXRoc1trZXldID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLmxlbmd0aCsrO1xuICAgICAgICAgICAgdGhpcy5wYXRoc1trZXldID0gdmFsdWU7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhdGhzW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgQ2FjaGVNYXAucHJvdG90eXBlLnNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxlbmd0aDtcbiAgICB9O1xuICAgIHJldHVybiBDYWNoZU1hcDtcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDYWNoZU1hcDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NhY2hlTWFwLnRzIiwiJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi4vfi9vYmplY3QtYXNzaWduL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlwidXNlIHN0cmljdFwiO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG5leHBvcnRzLmdldENhbGxTdGF0cyA9IGZ1bmN0aW9uIChzdWNjZXNzLCBpbnN0YW5jZSkge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICByZXN1bHQuc3VjY2VzcyA9IHN1Y2Nlc3M7XG4gICAgcmVzdWx0Lm5vZGVJZCA9IGV4cG9ydHMubm9kZShpbnN0YW5jZSk7XG4gICAgcmVzdWx0Lmxlbmd0aCA9IGxlbmd0aChpbnN0YW5jZSk7XG4gICAgcmVzdWx0Lm5hbWUgPSBpbnN0YW5jZS5uYW1lO1xuICAgIHJldHVybiByZXN1bHQ7XG59O1xuZXhwb3J0cy5ub2RlID0gZnVuY3Rpb24gKGluc3RhbmNlLCBub2RlSWQpIHtcbiAgICBpZiAodHlwZW9mIG5vZGVJZCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICB2YXIgY3VycmVudE5vZGUgPSBnZXRDdXJyZW50Tm9kZShpbnN0YW5jZSk7XG4gICAgICAgIHJldHVybiBjdXJyZW50Tm9kZSA/IGN1cnJlbnROb2RlLmlkIDogLTE7XG4gICAgfVxuICAgIGlmICghdXRpbF8xLmlzTnVtYmVyKG5vZGVJZCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlRoZSBub2RlIGlkIG11c3QgYmUgYSBudW1iZXIuXCIpO1xuICAgIH1cbiAgICB2YXIgY2FjaGVOb2RlID0gZ2V0UmVwb05vZGUobm9kZUlkLCBpbnN0YW5jZSk7XG4gICAgaWYgKCFjYWNoZU5vZGUpIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMuZ2V0Q2FsbFN0YXRzKGZhbHNlLCBpbnN0YW5jZSk7XG4gICAgfVxuICAgIGluc3RhbmNlLnRocmVhZC5jdXJyZW50ID0gYmluYXJ5SW5kZXhPZihpbnN0YW5jZS50aHJlYWQubm9kZXMsIG5vZGVJZCk7XG4gICAgcmV0dXJuIGV4cG9ydHMuZ2V0Q2FsbFN0YXRzKHRydWUsIGluc3RhbmNlKTtcbn07XG5mdW5jdGlvbiBnZXRDdXJyZW50Tm9kZShpbnN0YW5jZSkge1xuICAgIHZhciBjdXJyZW50Tm9kZUlkID0gaW5zdGFuY2UudGhyZWFkLm5vZGVzW2luc3RhbmNlLnRocmVhZC5jdXJyZW50XTtcbiAgICByZXR1cm4gY3VycmVudE5vZGVJZCA+PSAwID8gZ2V0UmVwb05vZGUoY3VycmVudE5vZGVJZCwgaW5zdGFuY2UpIDogdW5kZWZpbmVkO1xufVxuZXhwb3J0cy5nZXRDdXJyZW50Tm9kZSA9IGdldEN1cnJlbnROb2RlO1xuZnVuY3Rpb24gZ2V0UmVwb05vZGUoY2FjaGVOb2RlSWQsIGluc3RhbmNlKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLnJlcG8uZ2V0KGNhY2hlTm9kZUlkKTtcbn1cbmV4cG9ydHMuZ2V0UmVwb05vZGUgPSBnZXRSZXBvTm9kZTtcbnZhciBsZW5ndGggPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gaW5zdGFuY2UudGhyZWFkLm5vZGVzLmxlbmd0aDtcbn07XG5mdW5jdGlvbiBiaW5hcnlJbmRleE9mKGFycmF5LCBzZWFyY2hFbGVtZW50KSB7XG4gICAgdmFyIG1pbkluZGV4ID0gMDtcbiAgICB2YXIgbWF4SW5kZXggPSBhcnJheS5sZW5ndGggLSAxO1xuICAgIHZhciBjdXJyZW50SW5kZXg7XG4gICAgdmFyIGN1cnJlbnRFbGVtZW50O1xuICAgIHdoaWxlIChtaW5JbmRleCA8PSBtYXhJbmRleCkge1xuICAgICAgICBjdXJyZW50SW5kZXggPSAobWluSW5kZXggKyBtYXhJbmRleCkgLyAyIHwgMDtcbiAgICAgICAgY3VycmVudEVsZW1lbnQgPSBhcnJheVtjdXJyZW50SW5kZXhdO1xuICAgICAgICBpZiAoY3VycmVudEVsZW1lbnQgPCBzZWFyY2hFbGVtZW50KSB7XG4gICAgICAgICAgICBtaW5JbmRleCA9IGN1cnJlbnRJbmRleCArIDE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY3VycmVudEVsZW1lbnQgPiBzZWFyY2hFbGVtZW50KSB7XG4gICAgICAgICAgICBtYXhJbmRleCA9IGN1cnJlbnRJbmRleCAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gY3VycmVudEluZGV4O1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbG9jYXRlLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgY2FjaGVfMSA9IHJlcXVpcmUoXCIuL2NhY2hlXCIpO1xudmFyIENhY2hlTm9kZV8xID0gcmVxdWlyZShcIi4vQ2FjaGVOb2RlXCIpO1xudmFyIGxvY2F0ZV8xID0gcmVxdWlyZShcIi4vbG9jYXRlXCIpO1xudmFyIG9iamVjdEFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG52YXIgX2hhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbmZ1bmN0aW9uIGlzTnVtYmVyKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgfHwgdG9TdHJpbmcodmFsdWUpID09PSBcIltvYmplY3QgTnVtYmVyXVwiO1xufVxuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xuZnVuY3Rpb24gaXNTdHJpbmcob2JqKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdzdHJpbmcnIHx8IHRvU3RyaW5nKG9iaikgPT09IFwiW29iamVjdCBTdHJpbmddXCI7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5mdW5jdGlvbiBpc09iamVjdChtaXhlZF92YXIpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG1peGVkX3ZhcikgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gbWl4ZWRfdmFyICE9PSBudWxsICYmIHR5cGVvZiBtaXhlZF92YXIgPT09ICdvYmplY3QnO1xufVxuZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuZnVuY3Rpb24gaXNGdW5jdGlvbihpdGVtKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBpdGVtID09PSAnZnVuY3Rpb24nO1xufVxuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcbmZ1bmN0aW9uIGlzQXJyYXkodmFsdWUpIHtcbiAgICBpZiAoIXZhbHVlIHx8IHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpIHx8ICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnXG4gICAgICAgICYmIHR5cGVvZiB2YWx1ZS5sZW5ndGggPT09ICdudW1iZXInXG4gICAgICAgICYmIHR5cGVvZiB2YWx1ZS5zcGxpY2UgPT09ICdmdW5jdGlvbidcbiAgICAgICAgJiYgISh2YWx1ZS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgnbGVuZ3RoJykpKTtcbn1cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5mdW5jdGlvbiBvYmpUb1N0cihvKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKTtcbn1cbmZ1bmN0aW9uIGlzRGF0ZSh2YWx1ZSkge1xuICAgIHJldHVybiBpc09iamVjdCh2YWx1ZSkgJiYgb2JqVG9TdHIodmFsdWUpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcbmZ1bmN0aW9uIGlzRW1wdHkodmFsdWUpIHtcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBlbHNlIGlmICghaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIGZvciAodmFyIGkgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChfaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgaSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbmV4cG9ydHMuaXNFbXB0eSA9IGlzRW1wdHk7XG5mdW5jdGlvbiBnZXROZXdDYWNoZU5vZGUoaW5zdGFuY2UpIHtcbiAgICB2YXIgbm9kZSA9IG5ldyBDYWNoZU5vZGVfMS5DYWNoZU5vZGUoaW5zdGFuY2UubmV4dE5vZGVLZXkpO1xuICAgIG5vZGUuaWQgPSBpbnN0YW5jZS5uZXh0Tm9kZUtleTtcbiAgICBpbnN0YW5jZS5uZXh0Tm9kZUtleSArPSAxO1xuICAgIGluc3RhbmNlLnJlcG8uYWRkKG5vZGUpO1xuICAgIHJldHVybiBub2RlO1xufVxuZXhwb3J0cy5nZXROZXdDYWNoZU5vZGUgPSBnZXROZXdDYWNoZU5vZGU7XG5mdW5jdGlvbiBoYXNVaWQob2JqKSB7XG4gICAgaWYgKCFvYmopIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIWlzT2JqZWN0KG9iaikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG9ialtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciB1aWQgPSBvYmpbY2FjaGVfMS5jb25maWcudWlkTmFtZV07XG4gICAgcmV0dXJuIHVpZC5sZW5ndGggIT09IDA7XG59XG5leHBvcnRzLmhhc1VpZCA9IGhhc1VpZDtcbjtcbkZ1bmN0aW9uLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICB2YXIgU1RSSVBfQ09NTUVOVFMgPSAvKChcXC9cXC8uKiQpfChcXC9cXCpbXFxzXFxTXSo/XFwqXFwvKSkvbWc7XG4gICAgdmFyIEFSR1VNRU5UX05BTUVTID0gLyhbXlxccyxdKykvZztcbiAgICBmdW5jdGlvbiBnZXRQYXJhbU5hbWVzKGZ1bmMpIHtcbiAgICAgICAgdmFyIGZuU3RyID0gZnVuYy50b1N0cmluZygpLnJlcGxhY2UoU1RSSVBfQ09NTUVOVFMsICcnKTtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGZuU3RyLnNsaWNlKGZuU3RyLmluZGV4T2YoJygnKSArIDEsIGZuU3RyLmluZGV4T2YoJyknKSkubWF0Y2goQVJHVU1FTlRfTkFNRVMpO1xuICAgICAgICBpZiAocmVzdWx0ID09PSBudWxsKVxuICAgICAgICAgICAgcmVzdWx0ID0gW107XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIHZhciBzdHJpbmdpZnkgPSB0aGlzLnRvU3RyaW5nKCk7XG4gICAgc3RyaW5naWZ5ID0gc3RyaW5naWZ5LnJlcGxhY2UobmV3IFJlZ0V4cCgnX3RoaXMnLCAnZycpLCAndGhpcycpO1xuICAgIHZhciBib2R5ID0gc3RyaW5naWZ5Lm1hdGNoKC9mdW5jdGlvbltee10rXFx7KFtcXHNcXFNdKilcXH0kLylbMV07XG4gICAgYm9keSA9IGJvZHkudHJpbSgpO1xuICAgIHZhciBwYXJhbU5hbWVzID0gZ2V0UGFyYW1OYW1lcyh0aGlzKTtcbiAgICB2YXIgZnVuYztcbiAgICBpZiAoYm9keS5pbmRleE9mKCduYXRpdmUgY29kZScpIDwgMCkge1xuICAgICAgICBmdW5jID0gRnVuY3Rpb24ocGFyYW1OYW1lcywgYm9keSk7XG4gICAgICAgIGZ1bmMgPSBmdW5jLmJpbmQodGFyZ2V0KTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmM7XG59O1xuZnVuY3Rpb24gZGVlcENsb25lKG9iaiwgdWlkUmVmZXJlbmNlLCBmcmVlemUpIHtcbiAgICBpZiAoZnJlZXplID09PSB2b2lkIDApIHsgZnJlZXplID0gdHJ1ZTsgfVxuICAgIGlmICghb2JqXG4gICAgICAgIHx8ICghaXNPYmplY3Qob2JqKVxuICAgICAgICAgICAgJiYgIWlzQXJyYXkob2JqKSkpIHtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgaWYgKGZyZWV6ZSA9PT0gdHJ1ZVxuICAgICAgICAmJiB1aWRSZWZlcmVuY2VcbiAgICAgICAgJiYgIU9iamVjdC5pc0Zyb3plbih1aWRSZWZlcmVuY2UpKSB7XG4gICAgICAgIE9iamVjdC5mcmVlemUodWlkUmVmZXJlbmNlKTtcbiAgICB9XG4gICAgaWYgKHVpZFJlZmVyZW5jZVxuICAgICAgICAmJiBoYXNVaWQob2JqKVxuICAgICAgICAmJiBvYmpbY2FjaGVfMS5jb25maWcudWlkTmFtZV0gPT09IHVpZFJlZmVyZW5jZVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSkge1xuICAgICAgICByZXR1cm4gdWlkUmVmZXJlbmNlO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gb2JqZWN0QXNzaWduKHt9LCBvYmopO1xuICAgIGZvciAodmFyIHByb3BOYW1lIGluIG9iaikge1xuICAgICAgICB2YXIgdmFsdWUgPSBvYmpbcHJvcE5hbWVdO1xuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtwcm9wTmFtZV0gPSBkZWVwQ2xvbmVBcnJheSh2YWx1ZSwgdWlkUmVmZXJlbmNlLCBmcmVlemUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUodmFsdWUuZ2V0VGltZSgpKTtcbiAgICAgICAgICAgICAgICBpZiAoZnJlZXplID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5mcmVlemUoZGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc3VsdFtwcm9wTmFtZV0gPSBkYXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGhhc1VpZCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W3Byb3BOYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAodWlkUmVmZXJlbmNlICYmIGhhc1VpZCh1aWRSZWZlcmVuY2UpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgIT09IHVpZFJlZmVyZW5jZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHZhbHVlLnVpZCA9PT0gdWlkUmVmZXJlbmNlLnVpZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHZhbHVlICE9PSB1aWRSZWZlcmVuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbcHJvcE5hbWVdID0gdWlkUmVmZXJlbmNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRbcHJvcE5hbWVdID0gZGVlcENsb25lKHZhbHVlLCB1aWRSZWZlcmVuY2UsIGZyZWV6ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvcE5hbWUgIT09ICdjb25zdHJ1Y3RvcicpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W3Byb3BOYW1lXSA9IHZhbHVlLmNsb25lKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W3Byb3BOYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChmcmVlemUgPT09IHRydWVcbiAgICAgICAgJiYgIU9iamVjdC5pc0Zyb3plbihyZXN1bHQpXG4gICAgICAgICYmIHR5cGVvZiByZXN1bHQgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZShyZXN1bHQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZXhwb3J0cy5kZWVwQ2xvbmUgPSBkZWVwQ2xvbmU7XG5mdW5jdGlvbiBkZWVwQ2xvbmVBcnJheShhcnIsIHVpZFJlZmVyZW5jZSwgZnJlZXplKSB7XG4gICAgcmV0dXJuIGFyci5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgaWYgKGlzQXJyYXkoaXRlbSkpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWVwQ2xvbmVBcnJheShpdGVtLCB1aWRSZWZlcmVuY2UsIGZyZWV6ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaXNPYmplY3QoaXRlbSkpIHtcbiAgICAgICAgICAgIGlmIChoYXNVaWQoaXRlbSkpIHtcbiAgICAgICAgICAgICAgICBpZiAodWlkUmVmZXJlbmNlICYmIChpdGVtW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdID09PSB1aWRSZWZlcmVuY2VbY2FjaGVfMS5jb25maWcudWlkTmFtZV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1aWRSZWZlcmVuY2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZXBDbG9uZShpdGVtLCB1aWRSZWZlcmVuY2UsIGZyZWV6ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuZXhwb3J0cy5jYWNoZVNpemUgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICB2YXIgY2FjaGVOb2RlID0gbG9jYXRlXzEuZ2V0Q3VycmVudE5vZGUoaW5zdGFuY2UpO1xuICAgIHJldHVybiBjYWNoZU5vZGUgPyBjYWNoZU5vZGUuaXRlbXMuc2l6ZSgpIDogMDtcbn07XG5leHBvcnRzLmNhY2hlTGVuZ3RoID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLnRocmVhZC5ub2Rlcy5sZW5ndGg7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vdXRpbC50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIENhY2hlTWFwXzEgPSByZXF1aXJlKFwiLi9DYWNoZU1hcFwiKTtcbnZhciBDYWNoZU5vZGUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENhY2hlTm9kZShub2RlSWQpIHtcbiAgICAgICAgdGhpcy5pdGVtcyA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5pZCA9IG5vZGVJZDtcbiAgICB9XG4gICAgcmV0dXJuIENhY2hlTm9kZTtcbn0oKSk7XG5leHBvcnRzLkNhY2hlTm9kZSA9IENhY2hlTm9kZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NhY2hlTm9kZS50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIGZsdXNoXzEgPSByZXF1aXJlKFwiLi9mbHVzaFwiKTtcbnZhciBjYWNoZV8xID0gcmVxdWlyZShcIi4vY2FjaGVcIik7XG52YXIgb3BhdGggPSByZXF1aXJlKFwiLi9wYXRoXCIpO1xudmFyIGdldF8xID0gcmVxdWlyZShcIi4vZ2V0XCIpO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG5leHBvcnRzLmFzc2lnblJlZlRvUGFyZW50ID0gZnVuY3Rpb24gKHJlZkl0ZW0sIGZsdXNoQXJncykge1xuICAgIGlmIChmbHVzaEFyZ3MucGFyZW50VWlkKSB7XG4gICAgICAgIHZhciBwYXJlbnRJdGVtID0gZmx1c2hfMS5nZXRJdGVtRmx1c2hPckNhY2hlZChmbHVzaEFyZ3MucGFyZW50VWlkLCBmbHVzaEFyZ3MpO1xuICAgICAgICBpZiAocGFyZW50SXRlbSAmJiBmbHVzaEFyZ3MucmVmUGF0aCkge1xuICAgICAgICAgICAgYXNzaWduUmVmcyhwYXJlbnRJdGVtLCByZWZJdGVtLCBmbHVzaEFyZ3MucmVmUGF0aCk7XG4gICAgICAgIH1cbiAgICB9XG59O1xudmFyIGFzc2lnblJlZnMgPSBmdW5jdGlvbiAocGFyZW50SXRlbSwgcmVmSXRlbSwgcmVmUGF0aCkge1xuICAgIHZhciBwYXJlbnRVaWQgPSBwYXJlbnRJdGVtLmVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXTtcbiAgICB2YXIgcmVmVWlkID0gcmVmSXRlbS5lbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV07XG4gICAgYWRkUmVmVG8ocGFyZW50SXRlbSwgcmVmVWlkLCByZWZQYXRoKTtcbiAgICBhZGRSZWZGcm9tKHJlZkl0ZW0sIHBhcmVudFVpZCwgcmVmUGF0aCk7XG59O1xudmFyIGFkZFJlZlRvID0gZnVuY3Rpb24gKHBhcmVudEl0ZW0sIHJlZlVpZCwgcGF0aCkge1xuICAgIGlmIChwYXJlbnRJdGVtLm1hcFRvLmhhcyhyZWZVaWQpID09PSBmYWxzZSkge1xuICAgICAgICBwYXJlbnRJdGVtLm1hcFRvLnNldChyZWZVaWQsIFtdKTtcbiAgICB9XG4gICAgdmFyIHJlZkFycmF5ID0gcGFyZW50SXRlbS5tYXBUby5nZXQocmVmVWlkKTtcbiAgICBpZiAocmVmQXJyYXkuaW5kZXhPZihwYXRoKSA8IDApIHtcbiAgICAgICAgcmVmQXJyYXkucHVzaChwYXRoKTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcmVudEl0ZW07XG59O1xudmFyIGFkZFJlZkZyb20gPSBmdW5jdGlvbiAocmVmSXRlbSwgcGFyZW50VWlkLCBwYXRoKSB7XG4gICAgaWYgKHJlZkl0ZW0ubWFwRnJvbS5oYXMocGFyZW50VWlkKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmVmSXRlbS5tYXBGcm9tLnNldChwYXJlbnRVaWQsIFtdKTtcbiAgICB9XG4gICAgdmFyIGZyb21BcnJheSA9IHJlZkl0ZW0ubWFwRnJvbS5nZXQocGFyZW50VWlkKTtcbiAgICBpZiAoZnJvbUFycmF5LmluZGV4T2YocGF0aCkgPCAwKSB7XG4gICAgICAgIGZyb21BcnJheS5wdXNoKHBhdGgpO1xuICAgIH1cbiAgICByZXR1cm4gcmVmSXRlbTtcbn07XG5leHBvcnRzLnVwZGF0ZVBvaW50ZXJzID0gZnVuY3Rpb24gKGZsdXNoQXJncykge1xuICAgIGZsdXNoQXJncy5mbHVzaE1hcC5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIGl0ZW0pIHtcbiAgICAgICAgdXBkYXRlSXRlbVJlZlRvcyhpdGVtLCBmbHVzaEFyZ3MpO1xuICAgICAgICBleHBvcnRzLnVwZGF0ZVJlZkZyb21zKGl0ZW0sIGZsdXNoQXJncyk7XG4gICAgfSk7XG59O1xuZXhwb3J0cy51cGRhdGVSZWZGcm9tcyA9IGZ1bmN0aW9uIChpdGVtLCBmbHVzaEFyZ3MpIHtcbiAgICBpdGVtLm1hcEZyb20uZm9yRWFjaChmdW5jdGlvbiAocGFyZW50VWlkLCBwYXRocykge1xuICAgICAgICB2YXIgcGFyZW50SXRlbSA9IGZsdXNoQXJncy5mbHVzaE1hcC5nZXQocGFyZW50VWlkKTtcbiAgICAgICAgaWYgKCFwYXJlbnRJdGVtKSB7XG4gICAgICAgICAgICBwYXJlbnRJdGVtID0gZ2V0XzEuZ2V0Q2FjaGVkSXRlbShwYXJlbnRVaWQsIGZsdXNoQXJncy5pbnN0YW5jZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmVudEl0ZW0gJiYgcGF0aHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdmFyIGZpcnN0UGF0aCA9IHBhdGhzWzBdO1xuICAgICAgICAgICAgdmFyIHRhcmdldFJlZiA9IG9wYXRoLmdldChwYXJlbnRJdGVtLmVudGl0eSwgZmlyc3RQYXRoKTtcbiAgICAgICAgICAgIHZhciBkaXJ0eSA9ICh0YXJnZXRSZWYgJiYgdGFyZ2V0UmVmICE9PSBpdGVtLmVudGl0eSk7XG4gICAgICAgICAgICBpZiAoZGlydHkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IHtcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5OiBwYXJlbnRJdGVtLmVudGl0eSxcbiAgICAgICAgICAgICAgICAgICAgZmx1c2hNYXA6IGZsdXNoQXJncy5mbHVzaE1hcCxcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2U6IGZsdXNoQXJncy5pbnN0YW5jZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcGFyZW50SXRlbSA9IGZsdXNoXzEuZW5zdXJlSXRlbShhcmdzKTtcbiAgICAgICAgICAgICAgICBwYXJlbnRJdGVtLmVudGl0eSA9IHV0aWxfMS5kZWVwQ2xvbmUocGFyZW50SXRlbS5lbnRpdHksIGl0ZW0uZW50aXR5LCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufTtcbmV4cG9ydHMudXBkYXRlUmVmVG9zID0gZnVuY3Rpb24gKGVudGl0eVVpZCwgZmx1c2hBcmdzKSB7XG4gICAgdmFyIGl0ZW0gPSBmbHVzaF8xLmdldEl0ZW1GbHVzaE9yQ2FjaGVkKGVudGl0eVVpZCwgZmx1c2hBcmdzKTtcbiAgICB1cGRhdGVJdGVtUmVmVG9zKGl0ZW0sIGZsdXNoQXJncyk7XG59O1xudmFyIHVwZGF0ZUl0ZW1SZWZUb3MgPSBmdW5jdGlvbiAoaXRlbSwgZmx1c2hBcmdzKSB7XG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgaXRlbS5tYXBUby5mb3JFYWNoKGZ1bmN0aW9uICh0b1VpZCwgcGF0aHMpIHtcbiAgICAgICAgICAgIHZhciB1cGRhdGVkUGF0aHMgPSBwYXRocy5tYXAoZnVuY3Rpb24gKHBhdGgpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVmZXJlbmNlID0gb3BhdGguZ2V0KGl0ZW0uZW50aXR5LCBwYXRoKTtcbiAgICAgICAgICAgICAgICBpZiAocmVmZXJlbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YXJnZXRVaWQgPSByZWZlcmVuY2VbY2FjaGVfMS5jb25maWcudWlkTmFtZV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRVaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmb3VuZCA9IHRhcmdldFVpZCA9PSB0b1VpZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmb3VuZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlbW92ZVJlZkZyb21fVmFsdWUoaXRlbS5lbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV0sIHRvVWlkLCBmbHVzaEFyZ3MpO1xuICAgICAgICAgICAgfSkuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0gIT09IG51bGwgJiYgaXRlbSAhPT0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAodXBkYXRlZFBhdGhzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBpdGVtLm1hcFRvLnNldCh0b1VpZCwgdXBkYXRlZFBhdGhzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGl0ZW0ubWFwVG8uZGVsZXRlKHRvVWlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcbnZhciByZW1vdmVSZWZGcm9tX1ZhbHVlID0gZnVuY3Rpb24gKHBhcmVudFVpZCwgcmVmVWlkLCBmbHVzaEFyZ3MpIHtcbiAgICB2YXIgcmVmSXRlbSA9IGZsdXNoXzEuZ2V0SXRlbUZsdXNoT3JDYWNoZWQocmVmVWlkLCBmbHVzaEFyZ3MpO1xuICAgIGlmIChyZWZJdGVtKSB7XG4gICAgICAgIHJlZkl0ZW0gPSByZWZJdGVtLmNsb25lKCk7XG4gICAgICAgIGlmIChyZWZJdGVtLm1hcEZyb20uaGFzKHBhcmVudFVpZCkpIHtcbiAgICAgICAgICAgIHJlbW92ZVJlZkZyb20ocmVmSXRlbSwgcGFyZW50VWlkLCBmbHVzaEFyZ3MucmVmUGF0aCk7XG4gICAgICAgICAgICBpZiAocmVmSXRlbS5tYXBGcm9tLnNpemUoKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGZsdXNoQXJncy5ldmljdE1hcC5zZXQocmVmVWlkLCByZWZJdGVtKTtcbiAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZmx1c2hNYXAuZGVsZXRlKHJlZlVpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZmx1c2hNYXAuc2V0KHJlZlVpZCwgcmVmSXRlbSk7XG4gICAgICAgICAgICAgICAgZmx1c2hBcmdzLmV2aWN0TWFwLmRlbGV0ZShyZWZVaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcbnZhciByZW1vdmVSZWZGcm9tID0gZnVuY3Rpb24gKGl0ZW0sIHBhcmVudFVpZCwgcGF0aCkge1xuICAgIHZhciByZWZzQXJyYXkgPSBpdGVtLm1hcEZyb20uZ2V0KHBhcmVudFVpZCk7XG4gICAgdmFyIGluZGV4ID0gcmVmc0FycmF5LmluZGV4T2YocGF0aCk7XG4gICAgcmVmc0FycmF5ID0gcmVmc0FycmF5LnNsaWNlKCk7XG4gICAgcmVmc0FycmF5LnNwbGljZShpbmRleCwgMSk7XG4gICAgaXRlbS5tYXBGcm9tLnNldChwYXJlbnRVaWQsIHJlZnNBcnJheSk7XG4gICAgaWYgKHJlZnNBcnJheS5sZW5ndGggPT0gMCkge1xuICAgICAgICBpdGVtLm1hcEZyb20uZGVsZXRlKHBhcmVudFVpZCk7XG4gICAgfVxufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3JlZi50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIGdldF8xID0gcmVxdWlyZShcIi4vZ2V0XCIpO1xudmFyIGNhY2hlXzEgPSByZXF1aXJlKFwiLi9jYWNoZVwiKTtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xudmFyIHBhdGhfMSA9IHJlcXVpcmUoXCIuL3BhdGhcIik7XG52YXIgQ2FjaGVJdGVtXzEgPSByZXF1aXJlKFwiLi9DYWNoZUl0ZW1cIik7XG52YXIgQ2FjaGVNYXBfMSA9IHJlcXVpcmUoXCIuL0NhY2hlTWFwXCIpO1xudmFyIHJlZl8xID0gcmVxdWlyZShcIi4vcmVmXCIpO1xuZXhwb3J0cy5idWlsZEZsdXNoTWFwID0gZnVuY3Rpb24gKGZsdXNoQXJncykge1xuICAgIGlmICh1dGlsXzEuaGFzVWlkKGZsdXNoQXJncy5lbnRpdHkpKSB7XG4gICAgICAgIGJ1aWxkRW50aXR5Rmx1c2hNYXAoZmx1c2hBcmdzKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmICh1dGlsXzEuaXNBcnJheShmbHVzaEFyZ3MuZW50aXR5KSkge1xuICAgICAgICAgICAgY2FjaGVBcnJSZWZzKGZsdXNoQXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjYWNoZUVudGl0eVJlZnMoZmx1c2hBcmdzKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG52YXIgYnVpbGRFbnRpdHlGbHVzaE1hcCA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICBmbHVzaEFyZ3MucmVmUGF0aCA9IFwiXCI7XG4gICAgaWYgKGlzRGlydHkoZmx1c2hBcmdzKSA9PT0gdHJ1ZSkge1xuICAgICAgICBlbnN1cmVPbkZsdXNoTWFwKGZsdXNoQXJncyk7XG4gICAgICAgIGNhY2hlRW50aXR5UmVmcyhmbHVzaEFyZ3MpO1xuICAgICAgICByZWZfMS51cGRhdGVSZWZUb3MoU3RyaW5nKGZsdXNoQXJncy5lbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV0pLCBmbHVzaEFyZ3MpO1xuICAgIH1cbn07XG52YXIgZW5zdXJlT25GbHVzaE1hcCA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICB2YXIgZW50aXR5VWlkID0gU3RyaW5nKGZsdXNoQXJncy5lbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV0pO1xuICAgIGlmIChmbHVzaEFyZ3MuZmx1c2hNYXAuaGFzKGVudGl0eVVpZCkgPT09IGZhbHNlKSB7XG4gICAgICAgIGV4cG9ydHMuZW5zdXJlSXRlbShmbHVzaEFyZ3MpO1xuICAgICAgICBmbHVzaEFyZ3MucGFyZW50VWlkID0gU3RyaW5nKGVudGl0eVVpZCk7XG4gICAgfVxufTtcbnZhciBjYWNoZUVudGl0eVJlZnMgPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgdmFyIHBhcmVudEVudGl0eSA9IGZsdXNoQXJncy5lbnRpdHk7XG4gICAgZm9yICh2YXIgcHJvcCBpbiBwYXJlbnRFbnRpdHkpIHtcbiAgICAgICAgaWYgKHBhcmVudEVudGl0eS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgdmFyIHJlZkVudGl0eSA9IHBhcmVudEVudGl0eVtwcm9wXTtcbiAgICAgICAgICAgIGlmICh1dGlsXzEuaXNPYmplY3QocmVmRW50aXR5KSB8fCAodXRpbF8xLmlzQXJyYXkocmVmRW50aXR5KSAmJiByZWZFbnRpdHkubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZW50aXR5ID0gcmVmRW50aXR5O1xuICAgICAgICAgICAgICAgIGlmIChwYXJlbnRFbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgZmx1c2hBcmdzLnBhcmVudFVpZCA9IHBhcmVudEVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGZsdXNoQXJncy5wYXJlbnRVaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZmx1c2hBcmdzLnJlZlBhdGggPSBwYXRoXzEuY29uY2F0UHJvcChmbHVzaEFyZ3MucmVmUGF0aCwgcHJvcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghZmx1c2hBcmdzLnJlZlBhdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgZmx1c2hBcmdzLnJlZlBhdGggPSBwcm9wO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh1dGlsXzEuaXNBcnJheShyZWZFbnRpdHkpICYmIHJlZkVudGl0eS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY2FjaGVBcnJSZWZzKGZsdXNoQXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh1dGlsXzEuaXNPYmplY3QocmVmRW50aXR5KSkge1xuICAgICAgICAgICAgICAgIGNhY2hlT2JqUmVmcyhmbHVzaEFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgT2JqZWN0LmZyZWV6ZShyZWZFbnRpdHkpO1xuICAgICAgICB9XG4gICAgfVxufTtcbnZhciBjYWNoZUFyclJlZnMgPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgdmFyIGVudGl0eSA9IGZsdXNoQXJncy5lbnRpdHk7XG4gICAgdmFyIGFycmF5UGF0aCA9IGZsdXNoQXJncy5yZWZQYXRoO1xuICAgIHZhciBhcnJheVVpZDtcbiAgICBpZiAoIWFycmF5VWlkKSB7XG4gICAgICAgIGFycmF5VWlkID0gZmx1c2hBcmdzLnBhcmVudFVpZDtcbiAgICB9XG4gICAgZW50aXR5LmZvckVhY2goZnVuY3Rpb24gKG5leHQsIGluZGV4KSB7XG4gICAgICAgIGZsdXNoQXJncy5lbnRpdHkgPSBuZXh0O1xuICAgICAgICBmbHVzaEFyZ3MucGFyZW50VWlkID0gYXJyYXlVaWQ7XG4gICAgICAgIGlmIChmbHVzaEFyZ3MucmVmUGF0aCB8fCBhcnJheVBhdGgpIHtcbiAgICAgICAgICAgIGZsdXNoQXJncy5yZWZQYXRoID0gYXJyYXlQYXRoICsgXCIuXCIgKyBpbmRleDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXRpbF8xLmlzQXJyYXkobmV4dCkpIHtcbiAgICAgICAgICAgIGNhY2hlQXJyUmVmcyhmbHVzaEFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHV0aWxfMS5pc09iamVjdChuZXh0KSkge1xuICAgICAgICAgICAgY2FjaGVPYmpSZWZzKGZsdXNoQXJncyk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBPYmplY3QuZnJlZXplKGVudGl0eSk7XG59O1xudmFyIGNhY2hlT2JqUmVmcyA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICBpZiAodXRpbF8xLmhhc1VpZChmbHVzaEFyZ3MuZW50aXR5KSkge1xuICAgICAgICBjYWNoZVVpZE9ialJlZnMoZmx1c2hBcmdzKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNhY2hlRW50aXR5UmVmcyhmbHVzaEFyZ3MpO1xuICAgIH1cbn07XG52YXIgY2FjaGVVaWRPYmpSZWZzID0gZnVuY3Rpb24gKGZsdXNoQXJncykge1xuICAgIHZhciByZWZJdGVtID0gZXhwb3J0cy5lbnN1cmVJdGVtKGZsdXNoQXJncyk7XG4gICAgcmVmXzEuYXNzaWduUmVmVG9QYXJlbnQocmVmSXRlbSwgZmx1c2hBcmdzKTtcbiAgICBpZiAoZ2V0XzEuaXNPbkNhY2hlKGZsdXNoQXJncykgPT09IHRydWUpXG4gICAgICAgIHJldHVybjtcbiAgICBleHBvcnRzLmJ1aWxkRmx1c2hNYXAoZmx1c2hBcmdzKTtcbn07XG52YXIgaXNEaXJ0eSA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICB2YXIgY2FjaGVkSXRlbSA9IGdldF8xLmdldENhY2hlZEl0ZW0oZmx1c2hBcmdzLmVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICByZXR1cm4gIWNhY2hlZEl0ZW0gfHwgY2FjaGVkSXRlbS5lbnRpdHkgIT09IGZsdXNoQXJncy5lbnRpdHk7XG59O1xuZXhwb3J0cy5nZXRJdGVtRmx1c2hPckNhY2hlZCA9IGZ1bmN0aW9uICh1aWQsIGZsdXNoQXJncykge1xuICAgIGlmICh1aWQpIHtcbiAgICAgICAgdWlkID0gU3RyaW5nKHVpZCk7XG4gICAgICAgIHZhciBpdGVtID0gZmx1c2hBcmdzLmZsdXNoTWFwLmdldCh1aWQpO1xuICAgICAgICBpZiAoIWl0ZW0pIHtcbiAgICAgICAgICAgIGl0ZW0gPSBnZXRfMS5nZXRDYWNoZWRJdGVtKHVpZCwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXRlbSAmJiBPYmplY3QuaXNGcm96ZW4oaXRlbSkpIHtcbiAgICAgICAgICAgIGl0ZW0gPSBpdGVtLmNsb25lKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxufTtcbmV4cG9ydHMuZW5zdXJlSXRlbSA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICB2YXIgaXRlbVVpZCA9IFN0cmluZyhmbHVzaEFyZ3MuZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdKTtcbiAgICB2YXIgaXRlbSA9IGZsdXNoQXJncy5mbHVzaE1hcC5nZXQoaXRlbVVpZCk7XG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxuICAgIHZhciBsaXZlID0gZ2V0XzEuZ2V0Q2FjaGVkSXRlbShpdGVtVWlkLCBmbHVzaEFyZ3MuaW5zdGFuY2UpO1xuICAgIGl0ZW0gPSBuZXcgQ2FjaGVJdGVtXzEuZGVmYXVsdChmbHVzaEFyZ3MuZW50aXR5LCBsaXZlKTtcbiAgICBmbHVzaEFyZ3MuZmx1c2hNYXAuc2V0KGl0ZW1VaWQsIGl0ZW0pO1xuICAgIGZsdXNoQXJncy5mbHVzaE1hcFsnX19VUERBVEVEX18nXSA9IHRydWU7XG4gICAgcmV0dXJuIGl0ZW07XG59O1xuZXhwb3J0cy5wcmVGbHVzaCA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICB2YXIgdGVtcCA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICB2YXIgY3VycmVudFN0YWNrID0gZ2V0XzEuZ2V0Q2FjaGVDdXJyZW50U3RhY2soZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICBpZiAoY3VycmVudFN0YWNrKSB7XG4gICAgICAgIGN1cnJlbnRTdGFjay5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIGl0ZW0pIHtcbiAgICAgICAgICAgIHRlbXAuc2V0KGtleSwgaXRlbSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmbHVzaEFyZ3MuZmx1c2hNYXAuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgIHZhciBpdGVtVWlkID0gaXRlbS5lbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV07XG4gICAgICAgIGZyZWV6ZUl0ZW0oaXRlbSk7XG4gICAgICAgIHRlbXAuc2V0KFN0cmluZyhpdGVtVWlkKSwgaXRlbSk7XG4gICAgfSk7XG4gICAgaWYgKGZsdXNoQXJncy5ldmljdE1hcC5zaXplKCkgPiAwKSB7XG4gICAgICAgIGZsdXNoQXJncy5ldmljdE1hcC5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICB0ZW1wLmRlbGV0ZShTdHJpbmcoa2V5KSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBleHBvcnRzLmZsdXNoKHRlbXAsIGZsdXNoQXJncy5pbnN0YW5jZSk7XG59O1xudmFyIGZyZWV6ZUl0ZW0gPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgIE9iamVjdC5mcmVlemUoaXRlbSk7XG4gICAgT2JqZWN0LmZyZWV6ZShpdGVtLmVudGl0eSk7XG4gICAgT2JqZWN0LmZyZWV6ZShpdGVtLm1hcFRvKTtcbiAgICBPYmplY3QuZnJlZXplKGl0ZW0ubWFwRnJvbSk7XG59O1xuZXhwb3J0cy5mbHVzaCA9IGZ1bmN0aW9uICh0ZW1wLCBpbnN0YW5jZSkge1xuICAgIGlmICh0ZW1wICE9PSBudWxsKSB7XG4gICAgICAgIE9iamVjdC5mcmVlemUodGVtcCk7XG4gICAgICAgIHZhciBjYWNoZU5vZGUgPSB1dGlsXzEuZ2V0TmV3Q2FjaGVOb2RlKGluc3RhbmNlKTtcbiAgICAgICAgY2FjaGVOb2RlLml0ZW1zID0gdGVtcDtcbiAgICAgICAgaWYgKGluc3RhbmNlLnRocmVhZC5ub2Rlcy5pbmRleE9mKGNhY2hlTm9kZS5pZCkgPCAwKSB7XG4gICAgICAgICAgICBpbnN0YW5jZS50aHJlYWQubm9kZXMucHVzaChjYWNoZU5vZGUuaWQpO1xuICAgICAgICAgICAgaW5zdGFuY2UudGhyZWFkLmN1cnJlbnQgKz0gMTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9mbHVzaC50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIGNhY2hlXzEgPSByZXF1aXJlKFwiLi9jYWNoZVwiKTtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xuZXhwb3J0cy5nZXRJdGVtID0gZnVuY3Rpb24gKGVudGl0eSwgaW5zdGFuY2UsIG5vZGVJZCkge1xuICAgIGlmICghZW50aXR5KSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPbmUgZ2V0KCk6IHJlcXVpcmVzIGEgdWlkIHRvIHJldHJpZXZlIGFuIGl0ZW0gZnJvbSB0aGUgY2FjaGUuXCIpO1xuICAgIH1cbiAgICBpZiAodXRpbF8xLmlzQXJyYXkoZW50aXR5KSkge1xuICAgICAgICByZXR1cm4gZW50aXR5Lm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIGdldE9iamVjdChpdGVtLCBpbnN0YW5jZSk7XG4gICAgICAgIH0pLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW0gIT09IG51bGwgJiYgaXRlbSAhPT0gdW5kZWZpbmVkO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGdldE9iamVjdChlbnRpdHksIGluc3RhbmNlKTtcbn07XG52YXIgZ2V0T2JqZWN0ID0gZnVuY3Rpb24gKHVpZE9yRW50aXR5LCBpbnN0YW5jZSkge1xuICAgIHZhciByZWFsVWlkID0gZ2V0QWN0dWFsVWlkKHVpZE9yRW50aXR5KTtcbiAgICBpZiAoIXJlYWxVaWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgaXRlbSA9IGV4cG9ydHMuZ2V0Q2FjaGVkSXRlbShyZWFsVWlkLCBpbnN0YW5jZSk7XG4gICAgcmV0dXJuIGl0ZW0gPyBpdGVtLmVudGl0eSA6IHVuZGVmaW5lZDtcbn07XG5leHBvcnRzLmdldEVkaXRJdGVtID0gZnVuY3Rpb24gKG9iaiwgaW5zdGFuY2UsIG5vZGVJZCkge1xuICAgIGNvbnNvbGUubG9nKFwiR0VUIEVESVQgSVRFTVwiKTtcbiAgICBpZiAodXRpbF8xLmlzQXJyYXkob2JqKSkge1xuICAgICAgICByZXR1cm4gb2JqLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIGdldEVkaXRhYmxlT2JqZWN0KGl0ZW0sIGluc3RhbmNlKTtcbiAgICAgICAgfSkuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbSAhPT0gbnVsbCAmJiBpdGVtICE9PSB1bmRlZmluZWQ7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZ2V0RWRpdGFibGVPYmplY3Qob2JqLCBpbnN0YW5jZSk7XG59O1xudmFyIGdldEVkaXRhYmxlT2JqZWN0ID0gZnVuY3Rpb24gKHVpZE9yRW50aXR5LCBpbnN0YW5jZSkge1xuICAgIHZhciByZWFsVWlkID0gZ2V0QWN0dWFsVWlkKHVpZE9yRW50aXR5KTtcbiAgICB2YXIgZXhpc3RpbmcgPSBleHBvcnRzLmdldEl0ZW0ocmVhbFVpZCwgaW5zdGFuY2UpO1xuICAgIHJldHVybiBleGlzdGluZyA/IHV0aWxfMS5kZWVwQ2xvbmUoZXhpc3RpbmcsIHVuZGVmaW5lZCwgZmFsc2UpIDogdW5kZWZpbmVkO1xufTtcbnZhciBnZXRBY3R1YWxVaWQgPSBmdW5jdGlvbiAodWlkT3JFbnRpdHkpIHtcbiAgICBpZiAodHlwZW9mIHVpZE9yRW50aXR5ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHJldHVybiB1aWRPckVudGl0eTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIHVpZE9yRW50aXR5ID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgIHJldHVybiBTdHJpbmcodWlkT3JFbnRpdHkpO1xuICAgIH1cbiAgICBlbHNlIGlmICh1dGlsXzEuaXNPYmplY3QodWlkT3JFbnRpdHkpKSB7XG4gICAgICAgIGlmICh1dGlsXzEuaGFzVWlkKHVpZE9yRW50aXR5KSkge1xuICAgICAgICAgICAgcmV0dXJuIHVpZE9yRW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgICAgICB9XG4gICAgfVxufTtcbmV4cG9ydHMuaXNPbkNhY2hlID0gZnVuY3Rpb24gKGZsdXNoQXJncykge1xuICAgIHZhciB1aWQgPSBmbHVzaEFyZ3MuZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgIHZhciBleGlzdGluZ0l0ZW0gPSBleHBvcnRzLmdldENhY2hlZEl0ZW0odWlkLCBmbHVzaEFyZ3MuaW5zdGFuY2UpO1xuICAgIHJldHVybiBleGlzdGluZ0l0ZW0gJiYgZXhpc3RpbmdJdGVtLmVudGl0eSA9PT0gZmx1c2hBcmdzLmVudGl0eTtcbn07XG5leHBvcnRzLmdldENhY2hlZEl0ZW0gPSBmdW5jdGlvbiAodWlkLCBpbnN0YW5jZSkge1xuICAgIHZhciBjdXJyZW50Tm9kZSA9IGdldEN1cnJlbnROb2RlKGluc3RhbmNlKTtcbiAgICByZXR1cm4gY3VycmVudE5vZGUgPyBjdXJyZW50Tm9kZS5pdGVtcy5nZXQoU3RyaW5nKHVpZCkpIDogdW5kZWZpbmVkO1xufTtcbmZ1bmN0aW9uIGdldEN1cnJlbnROb2RlKGluc3RhbmNlKSB7XG4gICAgdmFyIGN1cnJlbnROb2RlSWQgPSBpbnN0YW5jZS50aHJlYWQubm9kZXNbaW5zdGFuY2UudGhyZWFkLmN1cnJlbnRdO1xuICAgIHJldHVybiBjdXJyZW50Tm9kZUlkID49IDAgPyBnZXRSZXBvTm9kZShjdXJyZW50Tm9kZUlkLCBpbnN0YW5jZS5yZXBvKSA6IHVuZGVmaW5lZDtcbn1cbmZ1bmN0aW9uIGdldFJlcG9Ob2RlKG5vZGVJZCwgcmVwbykge1xuICAgIHJldHVybiByZXBvLmdldChub2RlSWQpO1xufVxuZXhwb3J0cy5nZXRDYWNoZUN1cnJlbnRTdGFjayA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIHZhciBjdXJyZW50Tm9kZSA9IGdldEN1cnJlbnROb2RlKGluc3RhbmNlKTtcbiAgICByZXR1cm4gY3VycmVudE5vZGUgPyBjdXJyZW50Tm9kZS5pdGVtcyA6IHVuZGVmaW5lZDtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9nZXQudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xuZnVuY3Rpb24gZ2V0S2V5KGtleSkge1xuICAgIHZhciBpbnRLZXkgPSBwYXJzZUludChrZXkpO1xuICAgIGlmIChpbnRLZXkudG9TdHJpbmcoKSA9PT0ga2V5KSB7XG4gICAgICAgIHJldHVybiBpbnRLZXk7XG4gICAgfVxuICAgIHJldHVybiBrZXk7XG59XG5mdW5jdGlvbiBkZWwob2JqLCBwYXRoKSB7XG4gICAgaWYgKHV0aWxfMS5pc051bWJlcihwYXRoKSkge1xuICAgICAgICBwYXRoID0gW3BhdGhdO1xuICAgIH1cbiAgICBpZiAodXRpbF8xLmlzRW1wdHkob2JqKSkge1xuICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbiAgICBpZiAodXRpbF8xLmlzRW1wdHkocGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgaWYgKHV0aWxfMS5pc1N0cmluZyhwYXRoKSkge1xuICAgICAgICByZXR1cm4gZGVsKG9iaiwgcGF0aC5zcGxpdCgnLicpKTtcbiAgICB9XG4gICAgdmFyIGN1cnJlbnRQYXRoID0gZ2V0S2V5KHBhdGhbMF0pO1xuICAgIHZhciBvbGRWYWwgPSBvYmpbY3VycmVudFBhdGhdO1xuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBpZiAob2xkVmFsICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgIGlmICh1dGlsXzEuaXNBcnJheShvYmopKSB7XG4gICAgICAgICAgICAgICAgb2JqLnNwbGljZShjdXJyZW50UGF0aCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgb2JqW2N1cnJlbnRQYXRoXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKG9ialtjdXJyZW50UGF0aF0gIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgcmV0dXJuIGRlbChvYmpbY3VycmVudFBhdGhdLCBwYXRoLnNsaWNlKDEpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqO1xufVxuZXhwb3J0cy5kZWwgPSBkZWw7XG5mdW5jdGlvbiBnZXQob2JqLCBwYXRoLCBkZWZhdWx0VmFsdWUpIHtcbiAgICBpZiAodXRpbF8xLmlzTnVtYmVyKHBhdGgpKSB7XG4gICAgICAgIHBhdGggPSBbcGF0aF07XG4gICAgfVxuICAgIGlmICh1dGlsXzEuaXNFbXB0eShwYXRoKSkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBpZiAodXRpbF8xLmlzRW1wdHkob2JqKSkge1xuICAgICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgIH1cbiAgICBpZiAodXRpbF8xLmlzU3RyaW5nKHBhdGgpKSB7XG4gICAgICAgIHJldHVybiBnZXQob2JqLCBwYXRoLnNwbGl0KCcuJyksIGRlZmF1bHRWYWx1ZSk7XG4gICAgfVxuICAgIHZhciBjdXJyZW50UGF0aCA9IGdldEtleShwYXRoWzBdKTtcbiAgICBpZiAocGF0aC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgaWYgKG9ialtjdXJyZW50UGF0aF0gPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2JqW2N1cnJlbnRQYXRoXTtcbiAgICB9XG4gICAgcmV0dXJuIGdldChvYmpbY3VycmVudFBhdGhdLCBwYXRoLnNsaWNlKDEpLCBkZWZhdWx0VmFsdWUpO1xufVxuZXhwb3J0cy5nZXQgPSBnZXQ7XG5leHBvcnRzLmNvbmNhdFByb3AgPSBmdW5jdGlvbiAocHJvcENoYWluLCBwcm9wKSB7XG4gICAgaWYgKHByb3BDaGFpbiA9PT0gXCJcIikge1xuICAgICAgICBwcm9wQ2hhaW4gPSBwcm9wO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcHJvcENoYWluID0gcHJvcENoYWluICsgXCIuXCIgKyBwcm9wO1xuICAgIH1cbiAgICByZXR1cm4gcHJvcENoYWluO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3BhdGgudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBDYWNoZU1hcF8xID0gcmVxdWlyZShcIi4vQ2FjaGVNYXBcIik7XG52YXIgQ2FjaGVJdGVtID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDYWNoZUl0ZW0oZW50aXR5LCBsaXZlSXRlbSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmNsb25lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBDYWNoZUl0ZW0oX3RoaXMuZW50aXR5LCBfdGhpcyk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZW50aXR5ID0gZW50aXR5O1xuICAgICAgICBpZiAobGl2ZUl0ZW0pIHtcbiAgICAgICAgICAgIHRoaXMubWFwRnJvbSA9IGxpdmVJdGVtLm1hcEZyb20uY2xvbmUoKTtcbiAgICAgICAgICAgIHRoaXMubWFwVG8gPSBsaXZlSXRlbS5tYXBUby5jbG9uZSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tYXBGcm9tID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5tYXBUbyA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gQ2FjaGVJdGVtO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IENhY2hlSXRlbTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NhY2hlSXRlbS50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIGNhY2hlXzEgPSByZXF1aXJlKFwiLi9jYWNoZVwiKTtcbmV4cG9ydHMucHJpbnRDYWNoZSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIHZhciByZXN1bHQgPSBcIlwiO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIGN1cnJlbnQgPSBpbnN0YW5jZS50aHJlYWQuY3VycmVudDtcbiAgICB2YXIgbm9kZUluZGljZXMgPSBpbnN0YW5jZS50aHJlYWQubm9kZXM7XG4gICAgbm9kZUluZGljZXMubWFwKGZ1bmN0aW9uIChjYWNoZU5vZGVJZCkge1xuICAgICAgICB2YXIgY2FjaGVOb2RlID0gaW5zdGFuY2UucmVwby5nZXQoY2FjaGVOb2RlSWQpO1xuICAgICAgICB2YXIgc3RyZWFtRGF0YSA9IFwiXCI7XG4gICAgICAgIHZhciBzdGF0ZSA9IGluZGV4ICsgXCI6XCIgKyBzdHJlYW1EYXRhICsgXCJbXCIgKyBzdHJpbmdpZnlNYXAoY2FjaGVOb2RlLml0ZW1zKSArIFwiXVxcblxcblwiO1xuICAgICAgICBpZiAoaW5kZXggPT09IGN1cnJlbnQpIHtcbiAgICAgICAgICAgIHN0YXRlID0gXCItPiBcIiArIHN0YXRlO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCArPSBzdGF0ZTtcbiAgICAgICAgaW5kZXgrKztcbiAgICB9KTtcbiAgICByZXN1bHQgPSByZXN1bHQuc3Vic3RyaW5nKDAsIChyZXN1bHQubGVuZ3RoIC0gMikpO1xuICAgIGluZGV4ID0gMDtcbiAgICByZXR1cm4gXCJcXG4tLS0tLS0gT25lIC0tLS0tLS1cIlxuICAgICAgICArIFwiXFxuU1RBQ0s6XFxuXCIgKyByZXN1bHRcbiAgICAgICAgKyBcIlxcblxcbkNPTkZJRzpcIiArIEpTT04uc3RyaW5naWZ5KGNhY2hlXzEuY29uZmlnLCBudWxsLCAyKVxuICAgICAgICArIFwiXFxuXFxuUkVQTyBTSVpFOlwiICsgaW5zdGFuY2UucmVwby5sZW5ndGhcbiAgICAgICAgKyBcIlxcbj09PT09PT09PT09PT09PT09PT1cXG5cIjtcbn07XG52YXIgc3RyaW5naWZ5TWFwID0gZnVuY3Rpb24gKG1hcCkge1xuICAgIHZhciByZXN1bHQgPSBcIlwiO1xuICAgIG1hcC5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIGl0ZW0pIHtcbiAgICAgICAgdmFyIGl0ZW1SZXN1bHQgPSBKU09OLnN0cmluZ2lmeShpdGVtLCBudWxsLCAyKTtcbiAgICAgICAgcmVzdWx0ICs9IGl0ZW1SZXN1bHQgKyBcIixcXG5cIjtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3ByaW50LnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQ2FjaGVSZXBvXzEgPSByZXF1aXJlKFwiLi9DYWNoZVJlcG9cIik7XG52YXIgQ2FjaGVUaHJlYWRfMSA9IHJlcXVpcmUoXCIuL0NhY2hlVGhyZWFkXCIpO1xudmFyIENhY2hlSW5zdGFuY2UgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENhY2hlSW5zdGFuY2UobmFtZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLnJlcG8gPSBuZXcgQ2FjaGVSZXBvXzEuZGVmYXVsdCgpO1xuICAgICAgICB0aGlzLnRocmVhZCA9IG5ldyBDYWNoZVRocmVhZF8xLmRlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5uZXh0Tm9kZUtleSA9IDA7XG4gICAgICAgIHRoaXMucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5yZXBvID0gbmV3IENhY2hlUmVwb18xLmRlZmF1bHQoKTtcbiAgICAgICAgICAgIF90aGlzLnRocmVhZCA9IG5ldyBDYWNoZVRocmVhZF8xLmRlZmF1bHQoKTtcbiAgICAgICAgICAgIF90aGlzLm5leHROb2RlS2V5ID0gMDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5hZGROb2RlID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5yZXBvLmFkZChub2RlKSkge1xuICAgICAgICAgICAgICAgIF90aGlzLnRocmVhZC5hZGROb2RlKG5vZGUuaWQpO1xuICAgICAgICAgICAgICAgIF90aGlzLm5leHROb2RlS2V5Kys7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubGVuZ3RoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLnRocmVhZC5ub2Rlcy5sZW5ndGg7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5yZXBvLmxlbmd0aDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB9XG4gICAgcmV0dXJuIENhY2hlSW5zdGFuY2U7XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ2FjaGVJbnN0YW5jZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NhY2hlSW5zdGFuY2UudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBDYWNoZU1hcF8xID0gcmVxdWlyZShcIi4vQ2FjaGVNYXBcIik7XG52YXIgQ2FjaGVSZXBvID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDYWNoZVJlcG8oKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuaXRlbXMgPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgICAgIHRoaXMubGVuZ3RoID0gMDtcbiAgICAgICAgdGhpcy5nZXQgPSBmdW5jdGlvbiAobm9kZUlkKSB7IHJldHVybiAoX3RoaXMuaXRlbXMuZ2V0KG5vZGVJZCkpOyB9O1xuICAgICAgICB0aGlzLmFkZCA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICBpZiAoIV90aGlzLml0ZW1zLmhhcyhub2RlLmlkKSkge1xuICAgICAgICAgICAgICAgIF90aGlzLml0ZW1zLnNldChub2RlLmlkLCBub2RlKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5sZW5ndGgrKztcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5kZWxldGUgPSBmdW5jdGlvbiAobm9kZUlkKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMuaXRlbXMuaGFzKG5vZGVJZCkpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5pdGVtcy5kZWxldGUobm9kZUlkKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5sZW5ndGgtLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIENhY2hlUmVwbztcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDYWNoZVJlcG87XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DYWNoZVJlcG8udHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBDYWNoZVRocmVhZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2FjaGVUaHJlYWQoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuY3VycmVudCA9IC0xO1xuICAgICAgICB0aGlzLm5vZGVzID0gW107XG4gICAgICAgIHRoaXMuYWRkTm9kZSA9IGZ1bmN0aW9uIChub2RlSWQpIHtcbiAgICAgICAgICAgIF90aGlzLm5vZGVzLnB1c2gobm9kZUlkKTtcbiAgICAgICAgICAgIF90aGlzLmN1cnJlbnQrKztcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIENhY2hlVGhyZWFkO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IENhY2hlVGhyZWFkO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2FjaGVUaHJlYWQudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xudmFyIGNhY2hlXzEgPSByZXF1aXJlKFwiLi9jYWNoZVwiKTtcbnZhciBnZXRfMSA9IHJlcXVpcmUoXCIuL2dldFwiKTtcbnZhciBDYWNoZU1hcF8xID0gcmVxdWlyZShcIi4vQ2FjaGVNYXBcIik7XG52YXIgb3BhdGggPSByZXF1aXJlKFwiLi9wYXRoXCIpO1xudmFyIGZsdXNoXzEgPSByZXF1aXJlKFwiLi9mbHVzaFwiKTtcbnZhciBsb2NhdGVfMSA9IHJlcXVpcmUoXCIuL2xvY2F0ZVwiKTtcbnZhciByZWZfMSA9IHJlcXVpcmUoXCIuL3JlZlwiKTtcbmV4cG9ydHMuZXZpY3RJdGVtID0gZnVuY3Rpb24gKG9iaiwgaW5zdGFuY2UpIHtcbiAgICB2YXIgdWlkQXJyYXkgPSBidWlsZEV2aWN0VWlkQXJyYXkob2JqKTtcbiAgICBpZiAodWlkQXJyYXkubGVuZ3RoID09IDApIHtcbiAgICAgICAgcmV0dXJuIGxvY2F0ZV8xLmdldENhbGxTdGF0cyhmYWxzZSwgaW5zdGFuY2UpO1xuICAgIH1cbiAgICB2YXIgY3VycmVudFN0YXRlID0gZ2V0XzEuZ2V0Q2FjaGVDdXJyZW50U3RhY2soaW5zdGFuY2UpO1xuICAgIHZhciBmb3VuZCA9IHVpZEFycmF5LnNvbWUoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRTdGF0ZSAmJiBjdXJyZW50U3RhdGUuaGFzKFN0cmluZyhpdGVtKSk7XG4gICAgfSk7XG4gICAgaWYgKCFmb3VuZCkge1xuICAgICAgICByZXR1cm4gbG9jYXRlXzEuZ2V0Q2FsbFN0YXRzKGZhbHNlLCBpbnN0YW5jZSk7XG4gICAgfVxuICAgIHZhciB0ZW1wU3RhdGUgPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgY3VycmVudFN0YXRlLmZvckVhY2goZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgdGVtcFN0YXRlLnNldChrZXksIHZhbHVlKTtcbiAgICB9KTtcbiAgICB2YXIgZmx1c2hNYXAgPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgdmFyIGV2aWN0TWFwID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgIHZhciBmbHVzaEFyZ3MgPSB7XG4gICAgICAgIGZsdXNoTWFwOiBmbHVzaE1hcCxcbiAgICAgICAgZXZpY3RNYXA6IGV2aWN0TWFwLFxuICAgICAgICBpbnN0YW5jZTogaW5zdGFuY2VcbiAgICB9O1xuICAgIHZhciBwYXJlbnRzQ2hhbmdlZCA9IFtdO1xuICAgIHVpZEFycmF5LmZvckVhY2goZnVuY3Rpb24gKHVpZCkge1xuICAgICAgICBmbHVzaEFyZ3MuZW50aXR5VWlkID0gdWlkO1xuICAgICAgICBjbGVhclRhcmdldFJlZkZyb21zKGZsdXNoQXJncyk7XG4gICAgICAgIGV2aWN0TWFwLnNldCh1aWQsIG51bGwpO1xuICAgICAgICBjbGVhclBhcmVudFJlZlRvcyh1aWRBcnJheSwgcGFyZW50c0NoYW5nZWQsIGZsdXNoQXJncyk7XG4gICAgfSk7XG4gICAgcHV0UGFyZW50c0NoYW5nZWQocGFyZW50c0NoYW5nZWQsIGZsdXNoTWFwLCBldmljdE1hcCwgaW5zdGFuY2UpO1xuICAgIGZsdXNoTWFwLmZvckVhY2goZnVuY3Rpb24gKGtleSwgaXRlbSkge1xuICAgICAgICB0ZW1wU3RhdGUuc2V0KGtleSwgaXRlbSk7XG4gICAgfSk7XG4gICAgZXZpY3RNYXAuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgIHRlbXBTdGF0ZS5kZWxldGUoa2V5KTtcbiAgICB9KTtcbiAgICBmbHVzaF8xLmZsdXNoKHRlbXBTdGF0ZSwgaW5zdGFuY2UpO1xuICAgIHJldHVybiBsb2NhdGVfMS5nZXRDYWxsU3RhdHModHJ1ZSwgaW5zdGFuY2UpO1xufTtcbnZhciBwdXRQYXJlbnRzQ2hhbmdlZCA9IGZ1bmN0aW9uIChwYXJlbnRzQ2hhbmdlZCwgZmx1c2hNYXAsIGV2aWN0TWFwLCBpbnN0YW5jZSkge1xuICAgIGlmIChwYXJlbnRzQ2hhbmdlZCAmJiBwYXJlbnRzQ2hhbmdlZC5sZW5ndGggPiAwICYmIHV0aWxfMS5jYWNoZVNpemUoaW5zdGFuY2UpID4gMCkge1xuICAgICAgICB2YXIgZmx1c2hBcmdzXzEgPSB7XG4gICAgICAgICAgICBmbHVzaE1hcDogZmx1c2hNYXAsXG4gICAgICAgICAgICBldmljdE1hcDogZXZpY3RNYXAsXG4gICAgICAgICAgICBpbnN0YW5jZTogaW5zdGFuY2VcbiAgICAgICAgfTtcbiAgICAgICAgZmx1c2hfMS5idWlsZEZsdXNoTWFwKGZsdXNoQXJnc18xKTtcbiAgICAgICAgZmx1c2hBcmdzXzEuZmx1c2hNYXAuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgICAgICByZWZfMS51cGRhdGVSZWZGcm9tcyhpdGVtLCBmbHVzaEFyZ3NfMSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG52YXIgY2xlYXJUYXJnZXRSZWZGcm9tcyA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICB2YXIgaXRlbSA9IGdldF8xLmdldENhY2hlZEl0ZW0oZmx1c2hBcmdzLmVudGl0eVVpZCwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICBpZiAoaXRlbSkge1xuICAgICAgICBpdGVtLm1hcFRvLmZvckVhY2goZnVuY3Rpb24gKHRvVWlkLCBwYXRocykge1xuICAgICAgICAgICAgdmFyIHJlZkl0ZW0gPSBmbHVzaF8xLmdldEl0ZW1GbHVzaE9yQ2FjaGVkKHRvVWlkLCBmbHVzaEFyZ3MpO1xuICAgICAgICAgICAgaWYgKHJlZkl0ZW0pIHtcbiAgICAgICAgICAgICAgICBjbGVhclJlZkZyb20ocmVmSXRlbSwgZmx1c2hBcmdzLmVudGl0eVVpZCk7XG4gICAgICAgICAgICAgICAgaWYgKHJlZkl0ZW0ubWFwRnJvbS5zaXplKCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZmx1c2hBcmdzLmVudGl0eVVpZCA9IHRvVWlkO1xuICAgICAgICAgICAgICAgICAgICBjbGVhclRhcmdldFJlZkZyb21zKGZsdXNoQXJncyk7XG4gICAgICAgICAgICAgICAgICAgIGZsdXNoQXJncy5ldmljdE1hcC5zZXQodG9VaWQsIHJlZkl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZmx1c2hBcmdzLmZsdXNoTWFwLnNldCh0b1VpZCwgcmVmSXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59O1xudmFyIGNsZWFyUmVmRnJvbSA9IGZ1bmN0aW9uIChyZWZJdGVtLCBwYXJlbnRVaWQpIHtcbiAgICB2YXIgcmVmc0FycmF5ID0gcmVmSXRlbS5tYXBGcm9tLmdldChwYXJlbnRVaWQpO1xuICAgIGlmICghcmVmc0FycmF5KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmVmSXRlbS5tYXBGcm9tID0gcmVmSXRlbS5tYXBGcm9tLmNsb25lKCk7XG4gICAgcmVmSXRlbS5tYXBGcm9tLmRlbGV0ZShwYXJlbnRVaWQpO1xufTtcbnZhciBjbGVhclBhcmVudFJlZlRvcyA9IGZ1bmN0aW9uICh1aWRBcnJheSwgcGFyZW50c0NoYW5nZWQsIGZsdXNoQXJncykge1xuICAgIHZhciBpdGVtID0gZmx1c2hfMS5nZXRJdGVtRmx1c2hPckNhY2hlZChmbHVzaEFyZ3MuZW50aXR5VWlkLCBmbHVzaEFyZ3MpO1xuICAgIGlmIChpdGVtKSB7XG4gICAgICAgIGl0ZW0ubWFwRnJvbS5mb3JFYWNoKGZ1bmN0aW9uIChwYXJlbnRVaWQsIHBhdGhzKSB7XG4gICAgICAgICAgICB2YXIgcGFyZW50SXRlbSA9IGZsdXNoXzEuZ2V0SXRlbUZsdXNoT3JDYWNoZWQocGFyZW50VWlkLCBmbHVzaEFyZ3MpO1xuICAgICAgICAgICAgaWYgKHBhcmVudEl0ZW0pIHtcbiAgICAgICAgICAgICAgICB2YXIgc3VjY2VzcyA9IGNsZWFyUmVmVG8ocGFyZW50SXRlbSwgZmx1c2hBcmdzLmVudGl0eVVpZCwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICBpZiAoc3VjY2VzcyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZmx1c2hNYXAuc2V0KHBhcmVudFVpZCwgcGFyZW50SXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1aWRBcnJheS5pbmRleE9mKHBhcmVudFVpZCkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRzQ2hhbmdlZC5wdXNoKHBhcmVudEl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59O1xudmFyIGNsZWFyUmVmVG8gPSBmdW5jdGlvbiAocGFyZW50SXRlbSwgcmVmVWlkLCBpbnN0YW5jZSkge1xuICAgIHZhciBwYXJlbnQgPSBwYXJlbnRJdGVtLmVudGl0eTtcbiAgICBpZiAoT2JqZWN0LmlzRnJvemVuKHBhcmVudCkpIHtcbiAgICAgICAgcGFyZW50ID0gZ2V0XzEuZ2V0RWRpdEl0ZW0ocGFyZW50W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdLCBpbnN0YW5jZSk7XG4gICAgICAgIHBhcmVudEl0ZW0uZW50aXR5ID0gcGFyZW50O1xuICAgIH1cbiAgICB2YXIgcmVmUGF0aHMgPSBwYXJlbnRJdGVtLm1hcFRvLmdldChyZWZVaWQpO1xuICAgIHJlZlBhdGhzLmZvckVhY2goZnVuY3Rpb24gKHBhdGgpIHtcbiAgICAgICAgb3BhdGguZGVsKHBhcmVudCwgcGF0aCk7XG4gICAgfSk7XG4gICAgaWYgKCFPYmplY3QuaXNGcm96ZW4ocGFyZW50KSkge1xuICAgICAgICBPYmplY3QuZnJlZXplKHBhcmVudCk7XG4gICAgfVxuICAgIHBhcmVudEl0ZW0uZW50aXR5ID0gcGFyZW50O1xuICAgIHBhcmVudEl0ZW0ubWFwVG8gPSBwYXJlbnRJdGVtLm1hcFRvLmNsb25lKCk7XG4gICAgcGFyZW50SXRlbS5tYXBUby5kZWxldGUocmVmVWlkKTtcbiAgICByZXR1cm4gdHJ1ZTtcbn07XG52YXIgYnVpbGRFdmljdFVpZEFycmF5ID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHZhciB1aWRBcnJheSA9IFtdO1xuICAgIGlmICh1dGlsXzEuaXNBcnJheShvYmopKSB7XG4gICAgICAgIG9iai5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICBpZiAodXRpbF8xLmhhc1VpZChpdGVtKSkge1xuICAgICAgICAgICAgICAgIHVpZEFycmF5LnB1c2goU3RyaW5nKGl0ZW1bY2FjaGVfMS5jb25maWcudWlkTmFtZV0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgaXRlbSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgICAgICB1aWRBcnJheS5wdXNoKFN0cmluZyhpdGVtKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHZhciB1aWQgPSBvYmo7XG4gICAgICAgIGlmICh1dGlsXzEuaXNPYmplY3Qob2JqKSkge1xuICAgICAgICAgICAgdWlkID0gb2JqW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1aWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHVpZEFycmF5O1xuICAgICAgICB9XG4gICAgICAgIHVpZEFycmF5LnB1c2goU3RyaW5nKHVpZCkpO1xuICAgIH1cbiAgICByZXR1cm4gdWlkQXJyYXk7XG59O1xuZXhwb3J0cy5jbGVhck5leHQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICB2YXIgdGhyZWFkID0gaW5zdGFuY2UudGhyZWFkO1xuICAgIGlmICh0aHJlYWQuY3VycmVudCA8IHRocmVhZC5ub2Rlcy5sZW5ndGggLSAxKSB7XG4gICAgICAgIHZhciByZW1vdmVkTm9kZXMgPSB0aHJlYWQubm9kZXMuc2xpY2UodGhyZWFkLmN1cnJlbnQgKyAxLCB0aHJlYWQubm9kZXMubGVuZ3RoKTtcbiAgICAgICAgdGhyZWFkLm5vZGVzID0gdGhyZWFkLm5vZGVzLnNsaWNlKDAsIHRocmVhZC5jdXJyZW50ICsgMSk7XG4gICAgICAgIHRocmVhZC5jdXJyZW50ID0gdGhyZWFkLm5vZGVzLmxlbmd0aCAtIDE7XG4gICAgICAgIHRydW5jYXRlVGhyZWFkcyhyZW1vdmVkTm9kZXMsIGluc3RhbmNlKTtcbiAgICB9XG59O1xudmFyIHRydW5jYXRlVGhyZWFkcyA9IGZ1bmN0aW9uIChyZW1vdmVkTm9kZXMsIGluc3RhbmNlKSB7XG4gICAgcmVtb3ZlZE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKGNhY2hlTm9kZUlkKSB7XG4gICAgICAgIHZhciBjYWNoZU5vZGUgPSBpbnN0YW5jZS5yZXBvLmdldChjYWNoZU5vZGVJZCk7XG4gICAgICAgIGlmIChjYWNoZU5vZGUpIHtcbiAgICAgICAgICAgIGluc3RhbmNlLnJlcG8uZGVsZXRlKGNhY2hlTm9kZUlkKTtcbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2V2aWN0LnRzIl0sInNvdXJjZVJvb3QiOiIifQ==