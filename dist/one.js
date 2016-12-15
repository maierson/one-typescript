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
	            getCache: cache_1.getCache, put: cache_1.put, get: cache_1.get, getEdit: cache_1.getEdit, evict: cache_1.evict, reset: cache_1.reset, uuid: cache_1.uuid, print: cache_1.print
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
	    if (!exports.config && !exports.instances) {
	        exports.config = config_1.configure(configuration);
	    }
	    if (!exports.instances) {
	        exports.instances = {};
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
	    var paramNames = getParamNames(this);
	    var func = new Function(paramNames, body);
	    return func.bind(target);
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
	    console.log(obj);
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
	                result[propName] = value.clone(result);
	                console.log(propName, result[propName]);
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
	            if (util_1.isObject(refEntity) || util_1.isArray(refEntity)) {
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
	            if (util_1.isArray(refEntity)) {
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
	    var clone = util_1.deepClone(existing, undefined, false);
	    console.log(clone);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYWEzMTIwNDliOWRjZDA1MDJhNGIiLCJ3ZWJwYWNrOi8vLy4vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vY2FjaGUudHMiLCJ3ZWJwYWNrOi8vLy4vY29uZmlnLnRzIiwid2VicGFjazovLy8uL3B1dC50cyIsIndlYnBhY2s6Ly8vLi9DYWNoZU1hcC50cyIsIndlYnBhY2s6Ly8vLi4vfi9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwid2VicGFjazovLy8uL2xvY2F0ZS50cyIsIndlYnBhY2s6Ly8vLi91dGlsLnRzIiwid2VicGFjazovLy8uL0NhY2hlTm9kZS50cyIsIndlYnBhY2s6Ly8vLi9yZWYudHMiLCJ3ZWJwYWNrOi8vLy4vZmx1c2gudHMiLCJ3ZWJwYWNrOi8vLy4vZ2V0LnRzIiwid2VicGFjazovLy8uL3BhdGgudHMiLCJ3ZWJwYWNrOi8vLy4vQ2FjaGVJdGVtLnRzIiwid2VicGFjazovLy8uL3ByaW50LnRzIiwid2VicGFjazovLy8uL0NhY2hlSW5zdGFuY2UudHMiLCJ3ZWJwYWNrOi8vLy4vQ2FjaGVSZXBvLnRzIiwid2VicGFjazovLy8uL0NhY2hlVGhyZWFkLnRzIiwid2VicGFjazovLy8uL2V2aWN0LnRzIl0sIm5hbWVzIjpbImNhY2hlXzEiLCJyZXF1aXJlIiwiZXhwb3J0cyIsImdldENhY2hlIiwicHV0IiwiZ2V0IiwiZ2V0RWRpdCIsImV2aWN0IiwicmVzZXQiLCJ1dWlkIiwicHJpbnQiLCJ3aW5kb3ciLCJPbmUiLCJjb25maWdfMSIsInB1dF8xIiwicHJpbnRfMSIsIkNhY2hlSW5zdGFuY2VfMSIsInV0aWxfMSIsImdldF8xIiwiZXZpY3RfMSIsImNhY2hlVGVzdCIsInNldFRlc3RpbmciLCJ0ZXN0aW5nIiwiaW5zdGFuY2VOYW1lIiwiY29uZmlndXJhdGlvbiIsImRlZmF1bHRDb25maWciLCJjb25maWciLCJpbnN0YW5jZXMiLCJjb25maWd1cmUiLCJjcmVhdGVDYWNoZSIsInVuZGVmaW5lZCIsIml0ZW0iLCJlbnRpdHkiLCJub2RlSWQiLCJ1aWRPckVudGl0eU9yQXJyYXkiLCJsdXQiLCJpIiwidG9TdHJpbmciLCJkMCIsIk1hdGgiLCJyYW5kb20iLCJkMSIsImQyIiwiZDMiLCJuYW1lIiwiaW5zdGFuY2UiLCJkZWZhdWx0IiwicHV0SXRlbSIsImdldEl0ZW0iLCJnZXRFZGl0SXRlbSIsImV2aWN0SXRlbSIsInNpemUiLCJjYWNoZVNpemUiLCJsZW5ndGgiLCJjYWNoZUxlbmd0aCIsInByaW50Q2FjaGUiLCJyZXN1bHQiLCJyZWZUbyIsInVpZCIsImdldENhY2hlZEl0ZW0iLCJtYXBUbyIsInJlZkZyb20iLCJtYXBGcm9tIiwidWlkTmFtZSIsIm1heEhpc3RvcnlTdGF0ZXMiLCJjb25mIiwicCIsImhhc093blByb3BlcnR5IiwiQ2FjaGVNYXBfMSIsImxvY2F0ZV8xIiwicmVmXzEiLCJmbHVzaF8xIiwiaXNBcnJheSIsImlzT2JqZWN0IiwiZXZpY3RNYXAiLCJmbHVzaE1hcCIsImZsdXNoQXJncyIsInBhcmVudFVpZCIsInJlZlBhdGgiLCJidWlsZEZsdXNoTWFwIiwidXBkYXRlUG9pbnRlcnMiLCJjb21taXRQdXQiLCJnZXRDYWxsU3RhdHMiLCJwcmVGbHVzaCIsIm9iamVjdEFzc2lnbiIsIkNhY2hlTWFwIiwiX3RoaXMiLCJwYXRocyIsImtleSIsImRlbGV0ZSIsInZhbCIsImhhcyIsImZvckVhY2giLCJjYWxsYmFjayIsImNsb25lIiwibmV3SW5zdGFuY2UiLCJwcm90b3R5cGUiLCJzZXQiLCJ2YWx1ZSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5Iiwic3VjY2VzcyIsIm5vZGUiLCJjdXJyZW50Tm9kZSIsImdldEN1cnJlbnROb2RlIiwiaWQiLCJpc051bWJlciIsIlR5cGVFcnJvciIsImNhY2hlTm9kZSIsImdldFJlcG9Ob2RlIiwidGhyZWFkIiwiY3VycmVudCIsImJpbmFyeUluZGV4T2YiLCJub2RlcyIsImN1cnJlbnROb2RlSWQiLCJjYWNoZU5vZGVJZCIsInJlcG8iLCJhcnJheSIsInNlYXJjaEVsZW1lbnQiLCJtaW5JbmRleCIsIm1heEluZGV4IiwiY3VycmVudEluZGV4IiwiY3VycmVudEVsZW1lbnQiLCJDYWNoZU5vZGVfMSIsIl9oYXNPd25Qcm9wZXJ0eSIsImlzU3RyaW5nIiwib2JqIiwibWl4ZWRfdmFyIiwiY2FsbCIsImlzRnVuY3Rpb24iLCJBcnJheSIsInNwbGljZSIsInByb3BlcnR5SXNFbnVtZXJhYmxlIiwib2JqVG9TdHIiLCJvIiwiaXNEYXRlIiwiaXNFbXB0eSIsImdldE5ld0NhY2hlTm9kZSIsIkNhY2hlTm9kZSIsIm5leHROb2RlS2V5IiwiYWRkIiwiaGFzVWlkIiwiRnVuY3Rpb24iLCJ0YXJnZXQiLCJTVFJJUF9DT01NRU5UUyIsIkFSR1VNRU5UX05BTUVTIiwiZ2V0UGFyYW1OYW1lcyIsImZ1bmMiLCJmblN0ciIsInJlcGxhY2UiLCJzbGljZSIsImluZGV4T2YiLCJtYXRjaCIsInN0cmluZ2lmeSIsIlJlZ0V4cCIsImJvZHkiLCJwYXJhbU5hbWVzIiwiYmluZCIsImRlZXBDbG9uZSIsInVpZFJlZmVyZW5jZSIsImZyZWV6ZSIsImlzRnJvemVuIiwiY29uc29sZSIsImxvZyIsInByb3BOYW1lIiwiZGVlcENsb25lQXJyYXkiLCJkYXRlIiwiRGF0ZSIsImdldFRpbWUiLCJhcnIiLCJtYXAiLCJpdGVtcyIsIm9wYXRoIiwiYXNzaWduUmVmVG9QYXJlbnQiLCJyZWZJdGVtIiwicGFyZW50SXRlbSIsImdldEl0ZW1GbHVzaE9yQ2FjaGVkIiwiYXNzaWduUmVmcyIsInJlZlVpZCIsImFkZFJlZlRvIiwiYWRkUmVmRnJvbSIsInBhdGgiLCJyZWZBcnJheSIsInB1c2giLCJmcm9tQXJyYXkiLCJ1cGRhdGVJdGVtUmVmVG9zIiwidXBkYXRlUmVmRnJvbXMiLCJmaXJzdFBhdGgiLCJ0YXJnZXRSZWYiLCJkaXJ0eSIsImFyZ3MiLCJlbnN1cmVJdGVtIiwidXBkYXRlUmVmVG9zIiwiZW50aXR5VWlkIiwidG9VaWQiLCJ1cGRhdGVkUGF0aHMiLCJyZWZlcmVuY2UiLCJ0YXJnZXRVaWQiLCJmb3VuZCIsInJlbW92ZVJlZkZyb21fVmFsdWUiLCJmaWx0ZXIiLCJyZW1vdmVSZWZGcm9tIiwicmVmc0FycmF5IiwiaW5kZXgiLCJwYXRoXzEiLCJDYWNoZUl0ZW1fMSIsImJ1aWxkRW50aXR5Rmx1c2hNYXAiLCJjYWNoZUFyclJlZnMiLCJjYWNoZUVudGl0eVJlZnMiLCJpc0RpcnR5IiwiZW5zdXJlT25GbHVzaE1hcCIsIlN0cmluZyIsInBhcmVudEVudGl0eSIsInByb3AiLCJyZWZFbnRpdHkiLCJjb25jYXRQcm9wIiwiY2FjaGVPYmpSZWZzIiwiYXJyYXlQYXRoIiwiYXJyYXlVaWQiLCJuZXh0IiwiY2FjaGVVaWRPYmpSZWZzIiwiaXNPbkNhY2hlIiwiY2FjaGVkSXRlbSIsIml0ZW1VaWQiLCJsaXZlIiwidGVtcCIsImN1cnJlbnRTdGFjayIsImdldENhY2hlQ3VycmVudFN0YWNrIiwiZnJlZXplSXRlbSIsImZsdXNoIiwiZ2V0T2JqZWN0IiwidWlkT3JFbnRpdHkiLCJyZWFsVWlkIiwiZ2V0QWN0dWFsVWlkIiwiZ2V0RWRpdGFibGVPYmplY3QiLCJleGlzdGluZyIsImV4aXN0aW5nSXRlbSIsImdldEtleSIsImludEtleSIsInBhcnNlSW50IiwiZGVsIiwic3BsaXQiLCJjdXJyZW50UGF0aCIsIm9sZFZhbCIsImRlZmF1bHRWYWx1ZSIsInByb3BDaGFpbiIsIkNhY2hlSXRlbSIsImxpdmVJdGVtIiwibm9kZUluZGljZXMiLCJzdHJlYW1EYXRhIiwic3RhdGUiLCJzdHJpbmdpZnlNYXAiLCJzdWJzdHJpbmciLCJKU09OIiwiaXRlbVJlc3VsdCIsIkNhY2hlUmVwb18xIiwiQ2FjaGVUaHJlYWRfMSIsIkNhY2hlSW5zdGFuY2UiLCJhZGROb2RlIiwiQ2FjaGVSZXBvIiwiQ2FjaGVUaHJlYWQiLCJ1aWRBcnJheSIsImJ1aWxkRXZpY3RVaWRBcnJheSIsImN1cnJlbnRTdGF0ZSIsInNvbWUiLCJ0ZW1wU3RhdGUiLCJwYXJlbnRzQ2hhbmdlZCIsImNsZWFyVGFyZ2V0UmVmRnJvbXMiLCJjbGVhclBhcmVudFJlZlRvcyIsInB1dFBhcmVudHNDaGFuZ2VkIiwiZmx1c2hBcmdzXzEiLCJjbGVhclJlZkZyb20iLCJjbGVhclJlZlRvIiwicGFyZW50IiwicmVmUGF0aHMiLCJjbGVhck5leHQiLCJyZW1vdmVkTm9kZXMiLCJ0cnVuY2F0ZVRocmVhZHMiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBOztBQUNBLEtBQUlBLFVBQVUsbUJBQUFDLENBQVEsQ0FBUixDQUFkO0FBQ0FDLFNBQVFDLFFBQVIsR0FBbUJILFFBQVFHLFFBQTNCO0FBQ0FELFNBQVFFLEdBQVIsR0FBY0osUUFBUUksR0FBdEI7QUFDQUYsU0FBUUcsR0FBUixHQUFjTCxRQUFRSyxHQUF0QjtBQUNBSCxTQUFRSSxPQUFSLEdBQWtCTixRQUFRTSxPQUExQjtBQUNBSixTQUFRSyxLQUFSLEdBQWdCUCxRQUFRTyxLQUF4QjtBQUNBTCxTQUFRTSxLQUFSLEdBQWdCUixRQUFRUSxLQUF4QjtBQUNBTixTQUFRTyxJQUFSLEdBQWVULFFBQVFTLElBQXZCO0FBQ0FQLFNBQVFRLEtBQVIsR0FBZ0JWLFFBQVFVLEtBQXhCO0FBQ0EsRUFBQyxZQUFZO0FBQ1QsU0FBSUMsTUFBSixFQUFZO0FBQ1JBLGdCQUFPQyxHQUFQLEdBQWE7QUFDVFQsdUJBQVVILFFBQVFHLFFBRFQsRUFDbUJDLEtBQUtKLFFBQVFJLEdBRGhDLEVBQ3FDQyxLQUFLTCxRQUFRSyxHQURsRCxFQUN1REMsU0FBU04sUUFBUU0sT0FEeEUsRUFDaUZDLE9BQU9QLFFBQVFPLEtBRGhHLEVBQ3VHQyxPQUFPUixRQUFRUSxLQUR0SCxFQUM2SEMsTUFBTVQsUUFBUVMsSUFEM0ksRUFDaUpDLE9B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QUQsZ0JBQU9DLE9BQVAsR0FBaUJELE9BQU9HLEtBQVAsQ0FBYTVELE1BQWIsR0FBc0IsQ0FBdkM7QUFDQWdPLHlCQUFnQkQsWUFBaEIsRUFBOEJ2TyxRQUE5QjtBQUNIO0FBQ0osRUFSRDtBQVNBLEtBQUl3TyxrQkFBa0IsVUFBVUQsWUFBVixFQUF3QnZPLFFBQXhCLEVBQWtDO0FBQ3BEdU8sa0JBQWF4TCxPQUFiLENBQXFCLFVBQVV1QixXQUFWLEVBQXVCO0FBQ3hDLGFBQUlQLFlBQVkvRCxTQUFTdUUsSUFBVCxDQUFjL0csR0FBZCxDQUFrQjhHLFdBQWxCLENBQWhCO0FBQ0EsYUFBSVAsU0FBSixFQUFlO0FBQ1gvRCxzQkFBU3VFLElBQVQsQ0FBYzNCLE1BQWQsQ0FBcUIwQixXQUFyQjtBQUNIO0FBQ0osTUFMRDtBQU1ILEVBUEQsQyIsImZpbGUiOiJvbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBhYTMxMjA0OWI5ZGNkMDUwMmE0YiIsIlwidXNlIHN0cmljdFwiO1xudmFyIGNhY2hlXzEgPSByZXF1aXJlKFwiLi9jYWNoZVwiKTtcbmV4cG9ydHMuZ2V0Q2FjaGUgPSBjYWNoZV8xLmdldENhY2hlO1xuZXhwb3J0cy5wdXQgPSBjYWNoZV8xLnB1dDtcbmV4cG9ydHMuZ2V0ID0gY2FjaGVfMS5nZXQ7XG5leHBvcnRzLmdldEVkaXQgPSBjYWNoZV8xLmdldEVkaXQ7XG5leHBvcnRzLmV2aWN0ID0gY2FjaGVfMS5ldmljdDtcbmV4cG9ydHMucmVzZXQgPSBjYWNoZV8xLnJlc2V0O1xuZXhwb3J0cy51dWlkID0gY2FjaGVfMS51dWlkO1xuZXhwb3J0cy5wcmludCA9IGNhY2hlXzEucHJpbnQ7XG4oZnVuY3Rpb24gKCkge1xuICAgIGlmICh3aW5kb3cpIHtcbiAgICAgICAgd2luZG93Lk9uZSA9IHtcbiAgICAgICAgICAgIGdldENhY2hlOiBjYWNoZV8xLmdldENhY2hlLCBwdXQ6IGNhY2hlXzEucHV0LCBnZXQ6IGNhY2hlXzEuZ2V0LCBnZXRFZGl0OiBjYWNoZV8xLmdldEVkaXQsIGV2aWN0OiBjYWNoZV8xLmV2aWN0LCByZXNldDogY2FjaGVfMS5yZXNldCwgdXVpZDogY2FjaGVfMS51dWlkLCBwcmludDogY2FjaGVfMS5wcmludFxuICAgICAgICB9O1xuICAgIH1cbn0pKCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9pbmRleC50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIGNvbmZpZ18xID0gcmVxdWlyZShcIi4vY29uZmlnXCIpO1xudmFyIHB1dF8xID0gcmVxdWlyZShcIi4vcHV0XCIpO1xudmFyIHByaW50XzEgPSByZXF1aXJlKFwiLi9wcmludFwiKTtcbnZhciBDYWNoZUluc3RhbmNlXzEgPSByZXF1aXJlKFwiLi9DYWNoZUluc3RhbmNlXCIpO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG52YXIgZ2V0XzEgPSByZXF1aXJlKFwiLi9nZXRcIik7XG52YXIgZXZpY3RfMSA9IHJlcXVpcmUoXCIuL2V2aWN0XCIpO1xudmFyIGNhY2hlVGVzdCA9IGZhbHNlO1xuZnVuY3Rpb24gc2V0VGVzdGluZyh0ZXN0aW5nKSB7XG4gICAgY2FjaGVUZXN0ID0gdGVzdGluZztcbn1cbmV4cG9ydHMuc2V0VGVzdGluZyA9IHNldFRlc3Rpbmc7XG5mdW5jdGlvbiBnZXRDYWNoZShpbnN0YW5jZU5hbWUsIGNvbmZpZ3VyYXRpb24pIHtcbiAgICBpZiAoaW5zdGFuY2VOYW1lID09PSB2b2lkIDApIHsgaW5zdGFuY2VOYW1lID0gXCJvbmVcIjsgfVxuICAgIGlmIChjb25maWd1cmF0aW9uID09PSB2b2lkIDApIHsgY29uZmlndXJhdGlvbiA9IGNvbmZpZ18xLmRlZmF1bHRDb25maWc7IH1cbiAgICBpZiAoIWV4cG9ydHMuY29uZmlnICYmICFleHBvcnRzLmluc3RhbmNlcykge1xuICAgICAgICBleHBvcnRzLmNvbmZpZyA9IGNvbmZpZ18xLmNvbmZpZ3VyZShjb25maWd1cmF0aW9uKTtcbiAgICB9XG4gICAgaWYgKCFleHBvcnRzLmluc3RhbmNlcykge1xuICAgICAgICBleHBvcnRzLmluc3RhbmNlcyA9IHt9O1xuICAgIH1cbiAgICBpZiAoIWV4cG9ydHMuaW5zdGFuY2VzW2luc3RhbmNlTmFtZV0pIHtcbiAgICAgICAgZXhwb3J0cy5pbnN0YW5jZXNbaW5zdGFuY2VOYW1lXSA9IGNyZWF0ZUNhY2hlKGluc3RhbmNlTmFtZSk7XG4gICAgfVxuICAgIGlmICh3aW5kb3cpIHtcbiAgICAgICAgaWYgKHdpbmRvd1tpbnN0YW5jZU5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHdpbmRvd1tpbnN0YW5jZU5hbWVdID0gZXhwb3J0cy5pbnN0YW5jZXNbaW5zdGFuY2VOYW1lXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZXhwb3J0cy5pbnN0YW5jZXNbaW5zdGFuY2VOYW1lXTtcbn1cbmV4cG9ydHMuZ2V0Q2FjaGUgPSBnZXRDYWNoZTtcbmV4cG9ydHMucHV0ID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICBnZXRDYWNoZSgpLnB1dChpdGVtKTtcbn07XG5leHBvcnRzLmdldCA9IGZ1bmN0aW9uIChlbnRpdHksIG5vZGVJZCkge1xuICAgIHJldHVybiBnZXRDYWNoZSgpLmdldChlbnRpdHksIG5vZGVJZCk7XG59O1xuZXhwb3J0cy5nZXRFZGl0ID0gZnVuY3Rpb24gKHVpZE9yRW50aXR5T3JBcnJheSwgbm9kZUlkKSB7XG4gICAgcmV0dXJuIGdldENhY2hlKCkuZ2V0RWRpdCh1aWRPckVudGl0eU9yQXJyYXksIG5vZGVJZCk7XG59O1xuZXhwb3J0cy5ldmljdCA9IGZ1bmN0aW9uICh1aWRPckVudGl0eU9yQXJyYXkpIHtcbiAgICByZXR1cm4gZ2V0Q2FjaGUoKS5ldmljdCh1aWRPckVudGl0eU9yQXJyYXkpO1xufTtcbmV4cG9ydHMucHJpbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGdldENhY2hlKCkucHJpbnQoKTtcbn07XG5leHBvcnRzLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIGdldENhY2hlKCkucmVzZXQoKTtcbn07XG5leHBvcnRzLnV1aWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGx1dCA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMjU2OyBpKyspIHtcbiAgICAgICAgbHV0W2ldID0gKGkgPCAxNiA/ICcwJyA6ICcnKSArIChpKS50b1N0cmluZygxNik7XG4gICAgfVxuICAgIHZhciBkMCA9IE1hdGgucmFuZG9tKCkgKiAweDEwMDAwMDAwMCB8IDA7XG4gICAgdmFyIGQxID0gTWF0aC5yYW5kb20oKSAqIDB4MTAwMDAwMDAwIHwgMDtcbiAgICB2YXIgZDIgPSBNYXRoLnJhbmRvbSgpICogMHgxMDAwMDAwMDAgfCAwO1xuICAgIHZhciBkMyA9IE1hdGgucmFuZG9tKCkgKiAweDEwMDAwMDAwMCB8IDA7XG4gICAgcmV0dXJuIGx1dFtkMCAmIDB4RkZdICsgbHV0W2QwID4+IDggJiAweEZGXSArIGx1dFtkMCA+PiAxNiAmIDB4RkZdXG4gICAgICAgICsgbHV0W2QwID4+IDI0ICYgMHhGRl0gKyAnLScgKyBsdXRbZDEgJiAweEZGXVxuICAgICAgICArIGx1dFtkMSA+PiA4ICYgMHhGRl0gKyAnLScgKyBsdXRbZDEgPj4gMTYgJiAweDBmIHwgMHg0MF1cbiAgICAgICAgKyBsdXRbZDEgPj4gMjQgJiAweEZGXSArICctJyArIGx1dFtkMiAmIDB4M2YgfCAweDgwXVxuICAgICAgICArIGx1dFtkMiA+PiA4ICYgMHhGRl0gKyAnLScgKyBsdXRbZDIgPj4gMTYgJiAweEZGXVxuICAgICAgICArIGx1dFtkMiA+PiAyNCAmIDB4RkZdICsgbHV0W2QzICYgMHhGRl0gKyBsdXRbZDMgPj4gOCAmIDB4RkZdXG4gICAgICAgICsgbHV0W2QzID4+IDE2ICYgMHhGRl0gKyBsdXRbZDMgPj4gMjQgJiAweEZGXTtcbn07XG5mdW5jdGlvbiBjcmVhdGVDYWNoZShuYW1lKSB7XG4gICAgdmFyIGluc3RhbmNlID0gbmV3IENhY2hlSW5zdGFuY2VfMS5kZWZhdWx0KG5hbWUpO1xuICAgIHZhciByZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaW5zdGFuY2UucmVzZXQoKTtcbiAgICB9O1xuICAgIHZhciBwdXQgPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICByZXR1cm4gcHV0XzEucHV0SXRlbShpdGVtLCBpbnN0YW5jZSk7XG4gICAgfTtcbiAgICB2YXIgZ2V0ID0gZnVuY3Rpb24gKGVudGl0eSwgbm9kZUlkKSB7XG4gICAgICAgIHJldHVybiBnZXRfMS5nZXRJdGVtKGVudGl0eSwgaW5zdGFuY2UsIG5vZGVJZCk7XG4gICAgfTtcbiAgICB2YXIgZ2V0RWRpdCA9IGZ1bmN0aW9uICh1aWRPckVudGl0eU9yQXJyYXksIG5vZGVJZCkge1xuICAgICAgICByZXR1cm4gZ2V0XzEuZ2V0RWRpdEl0ZW0odWlkT3JFbnRpdHlPckFycmF5LCBpbnN0YW5jZSwgbm9kZUlkKTtcbiAgICB9O1xuICAgIHZhciBldmljdCA9IGZ1bmN0aW9uICh1aWRPckVudGl0eU9yQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIGV2aWN0XzEuZXZpY3RJdGVtKHVpZE9yRW50aXR5T3JBcnJheSwgaW5zdGFuY2UpO1xuICAgIH07XG4gICAgdmFyIHNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB1dGlsXzEuY2FjaGVTaXplKGluc3RhbmNlKTtcbiAgICB9O1xuICAgIHZhciBsZW5ndGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB1dGlsXzEuY2FjaGVMZW5ndGgoaW5zdGFuY2UpO1xuICAgIH07XG4gICAgdmFyIHByaW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gcHJpbnRfMS5wcmludENhY2hlKGluc3RhbmNlKTtcbiAgICB9O1xuICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgIHB1dDogcHV0LFxuICAgICAgICBnZXQ6IGdldCxcbiAgICAgICAgZ2V0RWRpdDogZ2V0RWRpdCxcbiAgICAgICAgZXZpY3Q6IGV2aWN0LFxuICAgICAgICByZXNldDogcmVzZXQsXG4gICAgICAgIHNpemU6IHNpemUsXG4gICAgICAgIGxlbmd0aDogbGVuZ3RoLFxuICAgICAgICBwcmludDogcHJpbnQsXG4gICAgfTtcbiAgICBpZiAoY2FjaGVUZXN0ID09PSB0cnVlKSB7XG4gICAgICAgIHJlc3VsdC5yZWZUbyA9IGZ1bmN0aW9uICh1aWQpIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gZ2V0XzEuZ2V0Q2FjaGVkSXRlbSh1aWQsIGluc3RhbmNlKTtcbiAgICAgICAgICAgIHJldHVybiBpdGVtLm1hcFRvO1xuICAgICAgICB9O1xuICAgICAgICByZXN1bHQucmVmRnJvbSA9IGZ1bmN0aW9uICh1aWQpIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gZ2V0XzEuZ2V0Q2FjaGVkSXRlbSh1aWQsIGluc3RhbmNlKTtcbiAgICAgICAgICAgIHJldHVybiBpdGVtLm1hcEZyb207XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9jYWNoZS50cyIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5kZWZhdWx0Q29uZmlnID0ge1xuICAgIHVpZE5hbWU6IFwidWlkXCIsXG4gICAgbWF4SGlzdG9yeVN0YXRlczogMTAwMFxufTtcbmZ1bmN0aW9uIGNvbmZpZ3VyZShjb25mKSB7XG4gICAgZm9yICh2YXIgcCBpbiBleHBvcnRzLmRlZmF1bHRDb25maWcpIHtcbiAgICAgICAgaWYgKGV4cG9ydHMuZGVmYXVsdENvbmZpZy5oYXNPd25Qcm9wZXJ0eShwKSAmJiBjb25mLmhhc093blByb3BlcnR5KHApKSB7XG4gICAgICAgICAgICBleHBvcnRzLmRlZmF1bHRDb25maWdbcF0gPSBjb25mW3BdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBleHBvcnRzLmRlZmF1bHRDb25maWc7XG59XG5leHBvcnRzLmNvbmZpZ3VyZSA9IGNvbmZpZ3VyZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2NvbmZpZy50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIENhY2hlTWFwXzEgPSByZXF1aXJlKFwiLi9DYWNoZU1hcFwiKTtcbnZhciBsb2NhdGVfMSA9IHJlcXVpcmUoXCIuL2xvY2F0ZVwiKTtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xudmFyIHJlZl8xID0gcmVxdWlyZShcIi4vcmVmXCIpO1xudmFyIGZsdXNoXzEgPSByZXF1aXJlKFwiLi9mbHVzaFwiKTtcbmV4cG9ydHMucHV0SXRlbSA9IGZ1bmN0aW9uIChlbnRpdHksIGluc3RhbmNlKSB7XG4gICAgaWYgKCh1dGlsXzEuaXNBcnJheShlbnRpdHkpIHx8IHV0aWxfMS5pc09iamVjdChlbnRpdHkpKSkge1xuICAgICAgICB2YXIgZXZpY3RNYXAgPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgICAgIHZhciBmbHVzaE1hcCA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICAgICAgZmx1c2hNYXBbJ19fVVBEQVRFRF9fJ10gPSBmYWxzZTtcbiAgICAgICAgdmFyIGZsdXNoQXJncyA9IHtcbiAgICAgICAgICAgIGVudGl0eTogZW50aXR5LFxuICAgICAgICAgICAgZmx1c2hNYXA6IGZsdXNoTWFwLFxuICAgICAgICAgICAgZXZpY3RNYXA6IGV2aWN0TWFwLFxuICAgICAgICAgICAgcGFyZW50VWlkOiBudWxsLFxuICAgICAgICAgICAgcmVmUGF0aDogXCJcIixcbiAgICAgICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZVxuICAgICAgICB9O1xuICAgICAgICBmbHVzaF8xLmJ1aWxkRmx1c2hNYXAoZmx1c2hBcmdzKTtcbiAgICAgICAgcmVmXzEudXBkYXRlUG9pbnRlcnMoZmx1c2hBcmdzKTtcbiAgICAgICAgaWYgKGZsdXNoQXJncy5mbHVzaE1hcC5zaXplKCkgPiAwICYmIGZsdXNoTWFwWydfX1VQREFURURfXyddID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm4gY29tbWl0UHV0KGZsdXNoQXJncyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGxvY2F0ZV8xLmdldENhbGxTdGF0cyhmYWxzZSwgaW5zdGFuY2UpO1xufTtcbnZhciBjb21taXRQdXQgPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgZmx1c2hfMS5wcmVGbHVzaChmbHVzaEFyZ3MpO1xuICAgIHJldHVybiBsb2NhdGVfMS5nZXRDYWxsU3RhdHModHJ1ZSwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wdXQudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBvYmplY3RBc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG52YXIgQ2FjaGVNYXAgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENhY2hlTWFwKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLnBhdGhzID0ge307XG4gICAgICAgIHRoaXMubGVuZ3RoID0gMDtcbiAgICAgICAgdGhpcy5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMucGF0aHNba2V5XTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5kZWxldGUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIF90aGlzLnBhdGhzW2tleV0gIT09IFwidW5kZWZpbmVkXCIgJiYgX3RoaXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciB2YWwgPSBfdGhpcy5wYXRoc1trZXldO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBfdGhpcy5wYXRoc1trZXldO1xuICAgICAgICAgICAgICAgIF90aGlzLmxlbmd0aC0tO1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaGFzID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBfdGhpcy5wYXRoc1trZXldICE9PSAndW5kZWZpbmVkJztcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5mb3JFYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gX3RoaXMucGF0aHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMucGF0aHMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhrZXksIF90aGlzLnBhdGhzW2tleV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBuZXdJbnN0YW5jZSA9IG9iamVjdEFzc2lnbih7fSwgX3RoaXMucGF0aHMpO1xuICAgICAgICAgICAgdmFyIGNsb25lID0gbmV3IENhY2hlTWFwKCk7XG4gICAgICAgICAgICBjbG9uZS5wYXRocyA9IG5ld0luc3RhbmNlO1xuICAgICAgICAgICAgY2xvbmUubGVuZ3RoID0gX3RoaXMubGVuZ3RoO1xuICAgICAgICAgICAgcmV0dXJuIGNsb25lO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBDYWNoZU1hcC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnBhdGhzW2tleV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMubGVuZ3RoKys7XG4gICAgICAgICAgICB0aGlzLnBhdGhzW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGF0aHNba2V5XSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICBDYWNoZU1hcC5wcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGVuZ3RoO1xuICAgIH07XG4gICAgcmV0dXJuIENhY2hlTWFwO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IENhY2hlTWFwO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2FjaGVNYXAudHMiLCIndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuLi9+L29iamVjdC1hc3NpZ24vaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbmV4cG9ydHMuZ2V0Q2FsbFN0YXRzID0gZnVuY3Rpb24gKHN1Y2Nlc3MsIGluc3RhbmNlKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHJlc3VsdC5zdWNjZXNzID0gc3VjY2VzcztcbiAgICByZXN1bHQubm9kZUlkID0gZXhwb3J0cy5ub2RlKGluc3RhbmNlKTtcbiAgICByZXN1bHQubGVuZ3RoID0gbGVuZ3RoKGluc3RhbmNlKTtcbiAgICByZXN1bHQubmFtZSA9IGluc3RhbmNlLm5hbWU7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5leHBvcnRzLm5vZGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIG5vZGVJZCkge1xuICAgIGlmICh0eXBlb2Ygbm9kZUlkID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHZhciBjdXJyZW50Tm9kZSA9IGdldEN1cnJlbnROb2RlKGluc3RhbmNlKTtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnROb2RlID8gY3VycmVudE5vZGUuaWQgOiAtMTtcbiAgICB9XG4gICAgaWYgKCF1dGlsXzEuaXNOdW1iZXIobm9kZUlkKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVGhlIG5vZGUgaWQgbXVzdCBiZSBhIG51bWJlci5cIik7XG4gICAgfVxuICAgIHZhciBjYWNoZU5vZGUgPSBnZXRSZXBvTm9kZShub2RlSWQsIGluc3RhbmNlKTtcbiAgICBpZiAoIWNhY2hlTm9kZSkge1xuICAgICAgICByZXR1cm4gZXhwb3J0cy5nZXRDYWxsU3RhdHMoZmFsc2UsIGluc3RhbmNlKTtcbiAgICB9XG4gICAgaW5zdGFuY2UudGhyZWFkLmN1cnJlbnQgPSBiaW5hcnlJbmRleE9mKGluc3RhbmNlLnRocmVhZC5ub2Rlcywgbm9kZUlkKTtcbiAgICByZXR1cm4gZXhwb3J0cy5nZXRDYWxsU3RhdHModHJ1ZSwgaW5zdGFuY2UpO1xufTtcbmZ1bmN0aW9uIGdldEN1cnJlbnROb2RlKGluc3RhbmNlKSB7XG4gICAgdmFyIGN1cnJlbnROb2RlSWQgPSBpbnN0YW5jZS50aHJlYWQubm9kZXNbaW5zdGFuY2UudGhyZWFkLmN1cnJlbnRdO1xuICAgIHJldHVybiBjdXJyZW50Tm9kZUlkID49IDAgPyBnZXRSZXBvTm9kZShjdXJyZW50Tm9kZUlkLCBpbnN0YW5jZSkgOiB1bmRlZmluZWQ7XG59XG5leHBvcnRzLmdldEN1cnJlbnROb2RlID0gZ2V0Q3VycmVudE5vZGU7XG5mdW5jdGlvbiBnZXRSZXBvTm9kZShjYWNoZU5vZGVJZCwgaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gaW5zdGFuY2UucmVwby5nZXQoY2FjaGVOb2RlSWQpO1xufVxuZXhwb3J0cy5nZXRSZXBvTm9kZSA9IGdldFJlcG9Ob2RlO1xudmFyIGxlbmd0aCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIHJldHVybiBpbnN0YW5jZS50aHJlYWQubm9kZXMubGVuZ3RoO1xufTtcbmZ1bmN0aW9uIGJpbmFyeUluZGV4T2YoYXJyYXksIHNlYXJjaEVsZW1lbnQpIHtcbiAgICB2YXIgbWluSW5kZXggPSAwO1xuICAgIHZhciBtYXhJbmRleCA9IGFycmF5Lmxlbmd0aCAtIDE7XG4gICAgdmFyIGN1cnJlbnRJbmRleDtcbiAgICB2YXIgY3VycmVudEVsZW1lbnQ7XG4gICAgd2hpbGUgKG1pbkluZGV4IDw9IG1heEluZGV4KSB7XG4gICAgICAgIGN1cnJlbnRJbmRleCA9IChtaW5JbmRleCArIG1heEluZGV4KSAvIDIgfCAwO1xuICAgICAgICBjdXJyZW50RWxlbWVudCA9IGFycmF5W2N1cnJlbnRJbmRleF07XG4gICAgICAgIGlmIChjdXJyZW50RWxlbWVudCA8IHNlYXJjaEVsZW1lbnQpIHtcbiAgICAgICAgICAgIG1pbkluZGV4ID0gY3VycmVudEluZGV4ICsgMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjdXJyZW50RWxlbWVudCA+IHNlYXJjaEVsZW1lbnQpIHtcbiAgICAgICAgICAgIG1heEluZGV4ID0gY3VycmVudEluZGV4IC0gMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50SW5kZXg7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9sb2NhdGUudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBjYWNoZV8xID0gcmVxdWlyZShcIi4vY2FjaGVcIik7XG52YXIgQ2FjaGVOb2RlXzEgPSByZXF1aXJlKFwiLi9DYWNoZU5vZGVcIik7XG52YXIgbG9jYXRlXzEgPSByZXF1aXJlKFwiLi9sb2NhdGVcIik7XG52YXIgb2JqZWN0QXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciBfaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuZnVuY3Rpb24gaXNOdW1iZXIodmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyB8fCB0b1N0cmluZyh2YWx1ZSkgPT09IFwiW29iamVjdCBOdW1iZXJdXCI7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5mdW5jdGlvbiBpc1N0cmluZyhvYmopIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ3N0cmluZycgfHwgdG9TdHJpbmcob2JqKSA9PT0gXCJbb2JqZWN0IFN0cmluZ11cIjtcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcbmZ1bmN0aW9uIGlzT2JqZWN0KG1peGVkX3Zhcikge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobWl4ZWRfdmFyKSA9PT0gJ1tvYmplY3QgQXJyYXldJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBtaXhlZF92YXIgIT09IG51bGwgJiYgdHlwZW9mIG1peGVkX3ZhciA9PT0gJ29iamVjdCc7XG59XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGl0ZW0pIHtcbiAgICByZXR1cm4gdHlwZW9mIGl0ZW0gPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuZnVuY3Rpb24gaXNBcnJheSh2YWx1ZSkge1xuICAgIGlmICghdmFsdWUgfHwgdmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWx1ZSkgfHwgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCdcbiAgICAgICAgJiYgdHlwZW9mIHZhbHVlLmxlbmd0aCA9PT0gJ251bWJlcidcbiAgICAgICAgJiYgdHlwZW9mIHZhbHVlLnNwbGljZSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICAmJiAhKHZhbHVlLnByb3BlcnR5SXNFbnVtZXJhYmxlKCdsZW5ndGgnKSkpO1xufVxuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcbmZ1bmN0aW9uIG9ialRvU3RyKG8pIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pO1xufVxuZnVuY3Rpb24gaXNEYXRlKHZhbHVlKSB7XG4gICAgcmV0dXJuIGlzT2JqZWN0KHZhbHVlKSAmJiBvYmpUb1N0cih2YWx1ZSkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xuZnVuY3Rpb24gaXNFbXB0eSh2YWx1ZSkge1xuICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChpc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2UgaWYgKCFpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKF9oYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuZXhwb3J0cy5pc0VtcHR5ID0gaXNFbXB0eTtcbmZ1bmN0aW9uIGdldE5ld0NhY2hlTm9kZShpbnN0YW5jZSkge1xuICAgIHZhciBub2RlID0gbmV3IENhY2hlTm9kZV8xLkNhY2hlTm9kZShpbnN0YW5jZS5uZXh0Tm9kZUtleSk7XG4gICAgbm9kZS5pZCA9IGluc3RhbmNlLm5leHROb2RlS2V5O1xuICAgIGluc3RhbmNlLm5leHROb2RlS2V5ICs9IDE7XG4gICAgaW5zdGFuY2UucmVwby5hZGQobm9kZSk7XG4gICAgcmV0dXJuIG5vZGU7XG59XG5leHBvcnRzLmdldE5ld0NhY2hlTm9kZSA9IGdldE5ld0NhY2hlTm9kZTtcbmZ1bmN0aW9uIGhhc1VpZChvYmopIHtcbiAgICBpZiAoIW9iaikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICghaXNPYmplY3Qob2JqKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb2JqW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIHVpZCA9IG9ialtjYWNoZV8xLmNvbmZpZy51aWROYW1lXTtcbiAgICByZXR1cm4gdWlkLmxlbmd0aCAhPT0gMDtcbn1cbmV4cG9ydHMuaGFzVWlkID0gaGFzVWlkO1xuO1xuRnVuY3Rpb24ucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIHZhciBTVFJJUF9DT01NRU5UUyA9IC8oKFxcL1xcLy4qJCl8KFxcL1xcKltcXHNcXFNdKj9cXCpcXC8pKS9tZztcbiAgICB2YXIgQVJHVU1FTlRfTkFNRVMgPSAvKFteXFxzLF0rKS9nO1xuICAgIGZ1bmN0aW9uIGdldFBhcmFtTmFtZXMoZnVuYykge1xuICAgICAgICB2YXIgZm5TdHIgPSBmdW5jLnRvU3RyaW5nKCkucmVwbGFjZShTVFJJUF9DT01NRU5UUywgJycpO1xuICAgICAgICB2YXIgcmVzdWx0ID0gZm5TdHIuc2xpY2UoZm5TdHIuaW5kZXhPZignKCcpICsgMSwgZm5TdHIuaW5kZXhPZignKScpKS5tYXRjaChBUkdVTUVOVF9OQU1FUyk7XG4gICAgICAgIGlmIChyZXN1bHQgPT09IG51bGwpXG4gICAgICAgICAgICByZXN1bHQgPSBbXTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgdmFyIHN0cmluZ2lmeSA9IHRoaXMudG9TdHJpbmcoKTtcbiAgICBzdHJpbmdpZnkgPSBzdHJpbmdpZnkucmVwbGFjZShuZXcgUmVnRXhwKCdfdGhpcycsICdnJyksICd0aGlzJyk7XG4gICAgdmFyIGJvZHkgPSBzdHJpbmdpZnkubWF0Y2goL2Z1bmN0aW9uW157XStcXHsoW1xcc1xcU10qKVxcfSQvKVsxXTtcbiAgICB2YXIgcGFyYW1OYW1lcyA9IGdldFBhcmFtTmFtZXModGhpcyk7XG4gICAgdmFyIGZ1bmMgPSBuZXcgRnVuY3Rpb24ocGFyYW1OYW1lcywgYm9keSk7XG4gICAgcmV0dXJuIGZ1bmMuYmluZCh0YXJnZXQpO1xufTtcbmZ1bmN0aW9uIGRlZXBDbG9uZShvYmosIHVpZFJlZmVyZW5jZSwgZnJlZXplKSB7XG4gICAgaWYgKGZyZWV6ZSA9PT0gdm9pZCAwKSB7IGZyZWV6ZSA9IHRydWU7IH1cbiAgICBpZiAoIW9ialxuICAgICAgICB8fCAoIWlzT2JqZWN0KG9iailcbiAgICAgICAgICAgICYmICFpc0FycmF5KG9iaikpKSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICAgIGlmIChmcmVlemUgPT09IHRydWVcbiAgICAgICAgJiYgdWlkUmVmZXJlbmNlXG4gICAgICAgICYmICFPYmplY3QuaXNGcm96ZW4odWlkUmVmZXJlbmNlKSkge1xuICAgICAgICBPYmplY3QuZnJlZXplKHVpZFJlZmVyZW5jZSk7XG4gICAgfVxuICAgIGlmICh1aWRSZWZlcmVuY2VcbiAgICAgICAgJiYgaGFzVWlkKG9iailcbiAgICAgICAgJiYgb2JqW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdID09PSB1aWRSZWZlcmVuY2VbY2FjaGVfMS5jb25maWcudWlkTmFtZV0pIHtcbiAgICAgICAgcmV0dXJuIHVpZFJlZmVyZW5jZTtcbiAgICB9XG4gICAgY29uc29sZS5sb2cob2JqKTtcbiAgICB2YXIgcmVzdWx0ID0gb2JqZWN0QXNzaWduKHt9LCBvYmopO1xuICAgIGZvciAodmFyIHByb3BOYW1lIGluIG9iaikge1xuICAgICAgICB2YXIgdmFsdWUgPSBvYmpbcHJvcE5hbWVdO1xuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtwcm9wTmFtZV0gPSBkZWVwQ2xvbmVBcnJheSh2YWx1ZSwgdWlkUmVmZXJlbmNlLCBmcmVlemUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUodmFsdWUuZ2V0VGltZSgpKTtcbiAgICAgICAgICAgICAgICBpZiAoZnJlZXplID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5mcmVlemUoZGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc3VsdFtwcm9wTmFtZV0gPSBkYXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGhhc1VpZCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W3Byb3BOYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAodWlkUmVmZXJlbmNlICYmIGhhc1VpZCh1aWRSZWZlcmVuY2UpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgIT09IHVpZFJlZmVyZW5jZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHZhbHVlLnVpZCA9PT0gdWlkUmVmZXJlbmNlLnVpZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHZhbHVlICE9PSB1aWRSZWZlcmVuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbcHJvcE5hbWVdID0gdWlkUmVmZXJlbmNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRbcHJvcE5hbWVdID0gZGVlcENsb25lKHZhbHVlLCB1aWRSZWZlcmVuY2UsIGZyZWV6ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbcHJvcE5hbWVdID0gdmFsdWUuY2xvbmUocmVzdWx0KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwcm9wTmFtZSwgcmVzdWx0W3Byb3BOYW1lXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbcHJvcE5hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZyZWV6ZSA9PT0gdHJ1ZVxuICAgICAgICAmJiAhT2JqZWN0LmlzRnJvemVuKHJlc3VsdClcbiAgICAgICAgJiYgdHlwZW9mIHJlc3VsdCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBPYmplY3QuZnJlZXplKHJlc3VsdCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5leHBvcnRzLmRlZXBDbG9uZSA9IGRlZXBDbG9uZTtcbmZ1bmN0aW9uIGRlZXBDbG9uZUFycmF5KGFyciwgdWlkUmVmZXJlbmNlLCBmcmVlemUpIHtcbiAgICByZXR1cm4gYXJyLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICBpZiAoaXNBcnJheShpdGVtKSkge1xuICAgICAgICAgICAgcmV0dXJuIGRlZXBDbG9uZUFycmF5KGl0ZW0sIHVpZFJlZmVyZW5jZSwgZnJlZXplKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpc09iamVjdChpdGVtKSkge1xuICAgICAgICAgICAgaWYgKGhhc1VpZChpdGVtKSkge1xuICAgICAgICAgICAgICAgIGlmICh1aWRSZWZlcmVuY2UgJiYgKGl0ZW1bY2FjaGVfMS5jb25maWcudWlkTmFtZV0gPT09IHVpZFJlZmVyZW5jZVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVpZFJlZmVyZW5jZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVlcENsb25lKGl0ZW0sIHVpZFJlZmVyZW5jZSwgZnJlZXplKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5leHBvcnRzLmNhY2hlU2l6ZSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIHZhciBjYWNoZU5vZGUgPSBsb2NhdGVfMS5nZXRDdXJyZW50Tm9kZShpbnN0YW5jZSk7XG4gICAgcmV0dXJuIGNhY2hlTm9kZSA/IGNhY2hlTm9kZS5pdGVtcy5zaXplKCkgOiAwO1xufTtcbmV4cG9ydHMuY2FjaGVMZW5ndGggPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gaW5zdGFuY2UudGhyZWFkLm5vZGVzLmxlbmd0aDtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi91dGlsLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQ2FjaGVNYXBfMSA9IHJlcXVpcmUoXCIuL0NhY2hlTWFwXCIpO1xudmFyIENhY2hlTm9kZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2FjaGVOb2RlKG5vZGVJZCkge1xuICAgICAgICB0aGlzLml0ZW1zID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmlkID0gbm9kZUlkO1xuICAgIH1cbiAgICByZXR1cm4gQ2FjaGVOb2RlO1xufSgpKTtcbmV4cG9ydHMuQ2FjaGVOb2RlID0gQ2FjaGVOb2RlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2FjaGVOb2RlLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgZmx1c2hfMSA9IHJlcXVpcmUoXCIuL2ZsdXNoXCIpO1xudmFyIGNhY2hlXzEgPSByZXF1aXJlKFwiLi9jYWNoZVwiKTtcbnZhciBvcGF0aCA9IHJlcXVpcmUoXCIuL3BhdGhcIik7XG52YXIgZ2V0XzEgPSByZXF1aXJlKFwiLi9nZXRcIik7XG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbmV4cG9ydHMuYXNzaWduUmVmVG9QYXJlbnQgPSBmdW5jdGlvbiAocmVmSXRlbSwgZmx1c2hBcmdzKSB7XG4gICAgaWYgKGZsdXNoQXJncy5wYXJlbnRVaWQpIHtcbiAgICAgICAgdmFyIHBhcmVudEl0ZW0gPSBmbHVzaF8xLmdldEl0ZW1GbHVzaE9yQ2FjaGVkKGZsdXNoQXJncy5wYXJlbnRVaWQsIGZsdXNoQXJncyk7XG4gICAgICAgIGlmIChwYXJlbnRJdGVtICYmIGZsdXNoQXJncy5yZWZQYXRoKSB7XG4gICAgICAgICAgICBhc3NpZ25SZWZzKHBhcmVudEl0ZW0sIHJlZkl0ZW0sIGZsdXNoQXJncy5yZWZQYXRoKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG52YXIgYXNzaWduUmVmcyA9IGZ1bmN0aW9uIChwYXJlbnRJdGVtLCByZWZJdGVtLCByZWZQYXRoKSB7XG4gICAgdmFyIHBhcmVudFVpZCA9IHBhcmVudEl0ZW0uZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgIHZhciByZWZVaWQgPSByZWZJdGVtLmVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXTtcbiAgICBhZGRSZWZUbyhwYXJlbnRJdGVtLCByZWZVaWQsIHJlZlBhdGgpO1xuICAgIGFkZFJlZkZyb20ocmVmSXRlbSwgcGFyZW50VWlkLCByZWZQYXRoKTtcbn07XG52YXIgYWRkUmVmVG8gPSBmdW5jdGlvbiAocGFyZW50SXRlbSwgcmVmVWlkLCBwYXRoKSB7XG4gICAgaWYgKHBhcmVudEl0ZW0ubWFwVG8uaGFzKHJlZlVpZCkgPT09IGZhbHNlKSB7XG4gICAgICAgIHBhcmVudEl0ZW0ubWFwVG8uc2V0KHJlZlVpZCwgW10pO1xuICAgIH1cbiAgICB2YXIgcmVmQXJyYXkgPSBwYXJlbnRJdGVtLm1hcFRvLmdldChyZWZVaWQpO1xuICAgIGlmIChyZWZBcnJheS5pbmRleE9mKHBhdGgpIDwgMCkge1xuICAgICAgICByZWZBcnJheS5wdXNoKHBhdGgpO1xuICAgIH1cbiAgICByZXR1cm4gcGFyZW50SXRlbTtcbn07XG52YXIgYWRkUmVmRnJvbSA9IGZ1bmN0aW9uIChyZWZJdGVtLCBwYXJlbnRVaWQsIHBhdGgpIHtcbiAgICBpZiAocmVmSXRlbS5tYXBGcm9tLmhhcyhwYXJlbnRVaWQpID09PSBmYWxzZSkge1xuICAgICAgICByZWZJdGVtLm1hcEZyb20uc2V0KHBhcmVudFVpZCwgW10pO1xuICAgIH1cbiAgICB2YXIgZnJvbUFycmF5ID0gcmVmSXRlbS5tYXBGcm9tLmdldChwYXJlbnRVaWQpO1xuICAgIGlmIChmcm9tQXJyYXkuaW5kZXhPZihwYXRoKSA8IDApIHtcbiAgICAgICAgZnJvbUFycmF5LnB1c2gocGF0aCk7XG4gICAgfVxuICAgIHJldHVybiByZWZJdGVtO1xufTtcbmV4cG9ydHMudXBkYXRlUG9pbnRlcnMgPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgZmx1c2hBcmdzLmZsdXNoTWFwLmZvckVhY2goZnVuY3Rpb24gKGtleSwgaXRlbSkge1xuICAgICAgICB1cGRhdGVJdGVtUmVmVG9zKGl0ZW0sIGZsdXNoQXJncyk7XG4gICAgICAgIGV4cG9ydHMudXBkYXRlUmVmRnJvbXMoaXRlbSwgZmx1c2hBcmdzKTtcbiAgICB9KTtcbn07XG5leHBvcnRzLnVwZGF0ZVJlZkZyb21zID0gZnVuY3Rpb24gKGl0ZW0sIGZsdXNoQXJncykge1xuICAgIGl0ZW0ubWFwRnJvbS5mb3JFYWNoKGZ1bmN0aW9uIChwYXJlbnRVaWQsIHBhdGhzKSB7XG4gICAgICAgIHZhciBwYXJlbnRJdGVtID0gZmx1c2hBcmdzLmZsdXNoTWFwLmdldChwYXJlbnRVaWQpO1xuICAgICAgICBpZiAoIXBhcmVudEl0ZW0pIHtcbiAgICAgICAgICAgIHBhcmVudEl0ZW0gPSBnZXRfMS5nZXRDYWNoZWRJdGVtKHBhcmVudFVpZCwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyZW50SXRlbSAmJiBwYXRocy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgZmlyc3RQYXRoID0gcGF0aHNbMF07XG4gICAgICAgICAgICB2YXIgdGFyZ2V0UmVmID0gb3BhdGguZ2V0KHBhcmVudEl0ZW0uZW50aXR5LCBmaXJzdFBhdGgpO1xuICAgICAgICAgICAgdmFyIGRpcnR5ID0gKHRhcmdldFJlZiAmJiB0YXJnZXRSZWYgIT09IGl0ZW0uZW50aXR5KTtcbiAgICAgICAgICAgIGlmIChkaXJ0eSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHZhciBhcmdzID0ge1xuICAgICAgICAgICAgICAgICAgICBlbnRpdHk6IHBhcmVudEl0ZW0uZW50aXR5LFxuICAgICAgICAgICAgICAgICAgICBmbHVzaE1hcDogZmx1c2hBcmdzLmZsdXNoTWFwLFxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZTogZmx1c2hBcmdzLmluc3RhbmNlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBwYXJlbnRJdGVtID0gZmx1c2hfMS5lbnN1cmVJdGVtKGFyZ3MpO1xuICAgICAgICAgICAgICAgIHBhcmVudEl0ZW0uZW50aXR5ID0gdXRpbF8xLmRlZXBDbG9uZShwYXJlbnRJdGVtLmVudGl0eSwgaXRlbS5lbnRpdHksIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59O1xuZXhwb3J0cy51cGRhdGVSZWZUb3MgPSBmdW5jdGlvbiAoZW50aXR5VWlkLCBmbHVzaEFyZ3MpIHtcbiAgICB2YXIgaXRlbSA9IGZsdXNoXzEuZ2V0SXRlbUZsdXNoT3JDYWNoZWQoZW50aXR5VWlkLCBmbHVzaEFyZ3MpO1xuICAgIHVwZGF0ZUl0ZW1SZWZUb3MoaXRlbSwgZmx1c2hBcmdzKTtcbn07XG52YXIgdXBkYXRlSXRlbVJlZlRvcyA9IGZ1bmN0aW9uIChpdGVtLCBmbHVzaEFyZ3MpIHtcbiAgICBpZiAoaXRlbSkge1xuICAgICAgICBpdGVtLm1hcFRvLmZvckVhY2goZnVuY3Rpb24gKHRvVWlkLCBwYXRocykge1xuICAgICAgICAgICAgdmFyIHVwZGF0ZWRQYXRocyA9IHBhdGhzLm1hcChmdW5jdGlvbiAocGF0aCkge1xuICAgICAgICAgICAgICAgIHZhciByZWZlcmVuY2UgPSBvcGF0aC5nZXQoaXRlbS5lbnRpdHksIHBhdGgpO1xuICAgICAgICAgICAgICAgIGlmIChyZWZlcmVuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhcmdldFVpZCA9IHJlZmVyZW5jZVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldFVpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZvdW5kID0gdGFyZ2V0VWlkID09IHRvVWlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvdW5kID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVtb3ZlUmVmRnJvbV9WYWx1ZShpdGVtLmVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSwgdG9VaWQsIGZsdXNoQXJncyk7XG4gICAgICAgICAgICB9KS5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbSAhPT0gbnVsbCAmJiBpdGVtICE9PSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICh1cGRhdGVkUGF0aHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGl0ZW0ubWFwVG8uc2V0KHRvVWlkLCB1cGRhdGVkUGF0aHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaXRlbS5tYXBUby5kZWxldGUodG9VaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59O1xudmFyIHJlbW92ZVJlZkZyb21fVmFsdWUgPSBmdW5jdGlvbiAocGFyZW50VWlkLCByZWZVaWQsIGZsdXNoQXJncykge1xuICAgIHZhciByZWZJdGVtID0gZmx1c2hfMS5nZXRJdGVtRmx1c2hPckNhY2hlZChyZWZVaWQsIGZsdXNoQXJncyk7XG4gICAgaWYgKHJlZkl0ZW0pIHtcbiAgICAgICAgcmVmSXRlbSA9IHJlZkl0ZW0uY2xvbmUoKTtcbiAgICAgICAgaWYgKHJlZkl0ZW0ubWFwRnJvbS5oYXMocGFyZW50VWlkKSkge1xuICAgICAgICAgICAgcmVtb3ZlUmVmRnJvbShyZWZJdGVtLCBwYXJlbnRVaWQsIGZsdXNoQXJncy5yZWZQYXRoKTtcbiAgICAgICAgICAgIGlmIChyZWZJdGVtLm1hcEZyb20uc2l6ZSgpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgZmx1c2hBcmdzLmV2aWN0TWFwLnNldChyZWZVaWQsIHJlZkl0ZW0pO1xuICAgICAgICAgICAgICAgIGZsdXNoQXJncy5mbHVzaE1hcC5kZWxldGUocmVmVWlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGZsdXNoQXJncy5mbHVzaE1hcC5zZXQocmVmVWlkLCByZWZJdGVtKTtcbiAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZXZpY3RNYXAuZGVsZXRlKHJlZlVpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xudmFyIHJlbW92ZVJlZkZyb20gPSBmdW5jdGlvbiAoaXRlbSwgcGFyZW50VWlkLCBwYXRoKSB7XG4gICAgdmFyIHJlZnNBcnJheSA9IGl0ZW0ubWFwRnJvbS5nZXQocGFyZW50VWlkKTtcbiAgICB2YXIgaW5kZXggPSByZWZzQXJyYXkuaW5kZXhPZihwYXRoKTtcbiAgICByZWZzQXJyYXkgPSByZWZzQXJyYXkuc2xpY2UoKTtcbiAgICByZWZzQXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcbiAgICBpdGVtLm1hcEZyb20uc2V0KHBhcmVudFVpZCwgcmVmc0FycmF5KTtcbiAgICBpZiAocmVmc0FycmF5Lmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIGl0ZW0ubWFwRnJvbS5kZWxldGUocGFyZW50VWlkKTtcbiAgICB9XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcmVmLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgZ2V0XzEgPSByZXF1aXJlKFwiLi9nZXRcIik7XG52YXIgY2FjaGVfMSA9IHJlcXVpcmUoXCIuL2NhY2hlXCIpO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG52YXIgcGF0aF8xID0gcmVxdWlyZShcIi4vcGF0aFwiKTtcbnZhciBDYWNoZUl0ZW1fMSA9IHJlcXVpcmUoXCIuL0NhY2hlSXRlbVwiKTtcbnZhciBDYWNoZU1hcF8xID0gcmVxdWlyZShcIi4vQ2FjaGVNYXBcIik7XG52YXIgcmVmXzEgPSByZXF1aXJlKFwiLi9yZWZcIik7XG5leHBvcnRzLmJ1aWxkRmx1c2hNYXAgPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgaWYgKHV0aWxfMS5oYXNVaWQoZmx1c2hBcmdzLmVudGl0eSkpIHtcbiAgICAgICAgYnVpbGRFbnRpdHlGbHVzaE1hcChmbHVzaEFyZ3MpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKHV0aWxfMS5pc0FycmF5KGZsdXNoQXJncy5lbnRpdHkpKSB7XG4gICAgICAgICAgICBjYWNoZUFyclJlZnMoZmx1c2hBcmdzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlRW50aXR5UmVmcyhmbHVzaEFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxufTtcbnZhciBidWlsZEVudGl0eUZsdXNoTWFwID0gZnVuY3Rpb24gKGZsdXNoQXJncykge1xuICAgIGZsdXNoQXJncy5yZWZQYXRoID0gXCJcIjtcbiAgICBpZiAoaXNEaXJ0eShmbHVzaEFyZ3MpID09PSB0cnVlKSB7XG4gICAgICAgIGVuc3VyZU9uRmx1c2hNYXAoZmx1c2hBcmdzKTtcbiAgICAgICAgY2FjaGVFbnRpdHlSZWZzKGZsdXNoQXJncyk7XG4gICAgICAgIHJlZl8xLnVwZGF0ZVJlZlRvcyhTdHJpbmcoZmx1c2hBcmdzLmVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSksIGZsdXNoQXJncyk7XG4gICAgfVxufTtcbnZhciBlbnN1cmVPbkZsdXNoTWFwID0gZnVuY3Rpb24gKGZsdXNoQXJncykge1xuICAgIHZhciBlbnRpdHlVaWQgPSBTdHJpbmcoZmx1c2hBcmdzLmVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSk7XG4gICAgaWYgKGZsdXNoQXJncy5mbHVzaE1hcC5oYXMoZW50aXR5VWlkKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgZXhwb3J0cy5lbnN1cmVJdGVtKGZsdXNoQXJncyk7XG4gICAgICAgIGZsdXNoQXJncy5wYXJlbnRVaWQgPSBTdHJpbmcoZW50aXR5VWlkKTtcbiAgICB9XG59O1xudmFyIGNhY2hlRW50aXR5UmVmcyA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICB2YXIgcGFyZW50RW50aXR5ID0gZmx1c2hBcmdzLmVudGl0eTtcbiAgICBmb3IgKHZhciBwcm9wIGluIHBhcmVudEVudGl0eSkge1xuICAgICAgICBpZiAocGFyZW50RW50aXR5Lmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgICB2YXIgcmVmRW50aXR5ID0gcGFyZW50RW50aXR5W3Byb3BdO1xuICAgICAgICAgICAgaWYgKHV0aWxfMS5pc09iamVjdChyZWZFbnRpdHkpIHx8IHV0aWxfMS5pc0FycmF5KHJlZkVudGl0eSkpIHtcbiAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZW50aXR5ID0gcmVmRW50aXR5O1xuICAgICAgICAgICAgICAgIGlmIChwYXJlbnRFbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgZmx1c2hBcmdzLnBhcmVudFVpZCA9IHBhcmVudEVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGZsdXNoQXJncy5wYXJlbnRVaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZmx1c2hBcmdzLnJlZlBhdGggPSBwYXRoXzEuY29uY2F0UHJvcChmbHVzaEFyZ3MucmVmUGF0aCwgcHJvcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghZmx1c2hBcmdzLnJlZlBhdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgZmx1c2hBcmdzLnJlZlBhdGggPSBwcm9wO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh1dGlsXzEuaXNBcnJheShyZWZFbnRpdHkpKSB7XG4gICAgICAgICAgICAgICAgY2FjaGVBcnJSZWZzKGZsdXNoQXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh1dGlsXzEuaXNPYmplY3QocmVmRW50aXR5KSkge1xuICAgICAgICAgICAgICAgIGNhY2hlT2JqUmVmcyhmbHVzaEFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgT2JqZWN0LmZyZWV6ZShyZWZFbnRpdHkpO1xuICAgICAgICB9XG4gICAgfVxufTtcbnZhciBjYWNoZUFyclJlZnMgPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgdmFyIGVudGl0eSA9IGZsdXNoQXJncy5lbnRpdHk7XG4gICAgdmFyIGFycmF5UGF0aCA9IGZsdXNoQXJncy5yZWZQYXRoO1xuICAgIHZhciBhcnJheVVpZDtcbiAgICBpZiAoIWFycmF5VWlkKSB7XG4gICAgICAgIGFycmF5VWlkID0gZmx1c2hBcmdzLnBhcmVudFVpZDtcbiAgICB9XG4gICAgZW50aXR5LmZvckVhY2goZnVuY3Rpb24gKG5leHQsIGluZGV4KSB7XG4gICAgICAgIGZsdXNoQXJncy5lbnRpdHkgPSBuZXh0O1xuICAgICAgICBmbHVzaEFyZ3MucGFyZW50VWlkID0gYXJyYXlVaWQ7XG4gICAgICAgIGlmIChmbHVzaEFyZ3MucmVmUGF0aCB8fCBhcnJheVBhdGgpIHtcbiAgICAgICAgICAgIGZsdXNoQXJncy5yZWZQYXRoID0gYXJyYXlQYXRoICsgXCIuXCIgKyBpbmRleDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXRpbF8xLmlzQXJyYXkobmV4dCkpIHtcbiAgICAgICAgICAgIGNhY2hlQXJyUmVmcyhmbHVzaEFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHV0aWxfMS5pc09iamVjdChuZXh0KSkge1xuICAgICAgICAgICAgY2FjaGVPYmpSZWZzKGZsdXNoQXJncyk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBPYmplY3QuZnJlZXplKGVudGl0eSk7XG59O1xudmFyIGNhY2hlT2JqUmVmcyA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICBpZiAodXRpbF8xLmhhc1VpZChmbHVzaEFyZ3MuZW50aXR5KSkge1xuICAgICAgICBjYWNoZVVpZE9ialJlZnMoZmx1c2hBcmdzKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNhY2hlRW50aXR5UmVmcyhmbHVzaEFyZ3MpO1xuICAgIH1cbn07XG52YXIgY2FjaGVVaWRPYmpSZWZzID0gZnVuY3Rpb24gKGZsdXNoQXJncykge1xuICAgIHZhciByZWZJdGVtID0gZXhwb3J0cy5lbnN1cmVJdGVtKGZsdXNoQXJncyk7XG4gICAgcmVmXzEuYXNzaWduUmVmVG9QYXJlbnQocmVmSXRlbSwgZmx1c2hBcmdzKTtcbiAgICBpZiAoZ2V0XzEuaXNPbkNhY2hlKGZsdXNoQXJncykgPT09IHRydWUpXG4gICAgICAgIHJldHVybjtcbiAgICBleHBvcnRzLmJ1aWxkRmx1c2hNYXAoZmx1c2hBcmdzKTtcbn07XG52YXIgaXNEaXJ0eSA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICB2YXIgY2FjaGVkSXRlbSA9IGdldF8xLmdldENhY2hlZEl0ZW0oZmx1c2hBcmdzLmVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICByZXR1cm4gIWNhY2hlZEl0ZW0gfHwgY2FjaGVkSXRlbS5lbnRpdHkgIT09IGZsdXNoQXJncy5lbnRpdHk7XG59O1xuZXhwb3J0cy5nZXRJdGVtRmx1c2hPckNhY2hlZCA9IGZ1bmN0aW9uICh1aWQsIGZsdXNoQXJncykge1xuICAgIGlmICh1aWQpIHtcbiAgICAgICAgdWlkID0gU3RyaW5nKHVpZCk7XG4gICAgICAgIHZhciBpdGVtID0gZmx1c2hBcmdzLmZsdXNoTWFwLmdldCh1aWQpO1xuICAgICAgICBpZiAoIWl0ZW0pIHtcbiAgICAgICAgICAgIGl0ZW0gPSBnZXRfMS5nZXRDYWNoZWRJdGVtKHVpZCwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXRlbSAmJiBPYmplY3QuaXNGcm96ZW4oaXRlbSkpIHtcbiAgICAgICAgICAgIGl0ZW0gPSBpdGVtLmNsb25lKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxufTtcbmV4cG9ydHMuZW5zdXJlSXRlbSA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICB2YXIgaXRlbVVpZCA9IFN0cmluZyhmbHVzaEFyZ3MuZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdKTtcbiAgICB2YXIgaXRlbSA9IGZsdXNoQXJncy5mbHVzaE1hcC5nZXQoaXRlbVVpZCk7XG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxuICAgIHZhciBsaXZlID0gZ2V0XzEuZ2V0Q2FjaGVkSXRlbShpdGVtVWlkLCBmbHVzaEFyZ3MuaW5zdGFuY2UpO1xuICAgIGl0ZW0gPSBuZXcgQ2FjaGVJdGVtXzEuZGVmYXVsdChmbHVzaEFyZ3MuZW50aXR5LCBsaXZlKTtcbiAgICBmbHVzaEFyZ3MuZmx1c2hNYXAuc2V0KGl0ZW1VaWQsIGl0ZW0pO1xuICAgIGZsdXNoQXJncy5mbHVzaE1hcFsnX19VUERBVEVEX18nXSA9IHRydWU7XG4gICAgcmV0dXJuIGl0ZW07XG59O1xuZXhwb3J0cy5wcmVGbHVzaCA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICB2YXIgdGVtcCA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICB2YXIgY3VycmVudFN0YWNrID0gZ2V0XzEuZ2V0Q2FjaGVDdXJyZW50U3RhY2soZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICBpZiAoY3VycmVudFN0YWNrKSB7XG4gICAgICAgIGN1cnJlbnRTdGFjay5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIGl0ZW0pIHtcbiAgICAgICAgICAgIHRlbXAuc2V0KGtleSwgaXRlbSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmbHVzaEFyZ3MuZmx1c2hNYXAuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgIHZhciBpdGVtVWlkID0gaXRlbS5lbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV07XG4gICAgICAgIGZyZWV6ZUl0ZW0oaXRlbSk7XG4gICAgICAgIHRlbXAuc2V0KFN0cmluZyhpdGVtVWlkKSwgaXRlbSk7XG4gICAgfSk7XG4gICAgaWYgKGZsdXNoQXJncy5ldmljdE1hcC5zaXplKCkgPiAwKSB7XG4gICAgICAgIGZsdXNoQXJncy5ldmljdE1hcC5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICB0ZW1wLmRlbGV0ZShTdHJpbmcoa2V5KSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBleHBvcnRzLmZsdXNoKHRlbXAsIGZsdXNoQXJncy5pbnN0YW5jZSk7XG59O1xudmFyIGZyZWV6ZUl0ZW0gPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgIE9iamVjdC5mcmVlemUoaXRlbSk7XG4gICAgT2JqZWN0LmZyZWV6ZShpdGVtLmVudGl0eSk7XG4gICAgT2JqZWN0LmZyZWV6ZShpdGVtLm1hcFRvKTtcbiAgICBPYmplY3QuZnJlZXplKGl0ZW0ubWFwRnJvbSk7XG59O1xuZXhwb3J0cy5mbHVzaCA9IGZ1bmN0aW9uICh0ZW1wLCBpbnN0YW5jZSkge1xuICAgIGlmICh0ZW1wICE9PSBudWxsKSB7XG4gICAgICAgIE9iamVjdC5mcmVlemUodGVtcCk7XG4gICAgICAgIHZhciBjYWNoZU5vZGUgPSB1dGlsXzEuZ2V0TmV3Q2FjaGVOb2RlKGluc3RhbmNlKTtcbiAgICAgICAgY2FjaGVOb2RlLml0ZW1zID0gdGVtcDtcbiAgICAgICAgaWYgKGluc3RhbmNlLnRocmVhZC5ub2Rlcy5pbmRleE9mKGNhY2hlTm9kZS5pZCkgPCAwKSB7XG4gICAgICAgICAgICBpbnN0YW5jZS50aHJlYWQubm9kZXMucHVzaChjYWNoZU5vZGUuaWQpO1xuICAgICAgICAgICAgaW5zdGFuY2UudGhyZWFkLmN1cnJlbnQgKz0gMTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9mbHVzaC50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIGNhY2hlXzEgPSByZXF1aXJlKFwiLi9jYWNoZVwiKTtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xuZXhwb3J0cy5nZXRJdGVtID0gZnVuY3Rpb24gKGVudGl0eSwgaW5zdGFuY2UsIG5vZGVJZCkge1xuICAgIGlmICghZW50aXR5KSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPbmUgZ2V0KCk6IHJlcXVpcmVzIGEgdWlkIHRvIHJldHJpZXZlIGFuIGl0ZW0gZnJvbSB0aGUgY2FjaGUuXCIpO1xuICAgIH1cbiAgICBpZiAodXRpbF8xLmlzQXJyYXkoZW50aXR5KSkge1xuICAgICAgICByZXR1cm4gZW50aXR5Lm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIGdldE9iamVjdChpdGVtLCBpbnN0YW5jZSk7XG4gICAgICAgIH0pLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW0gIT09IG51bGwgJiYgaXRlbSAhPT0gdW5kZWZpbmVkO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGdldE9iamVjdChlbnRpdHksIGluc3RhbmNlKTtcbn07XG52YXIgZ2V0T2JqZWN0ID0gZnVuY3Rpb24gKHVpZE9yRW50aXR5LCBpbnN0YW5jZSkge1xuICAgIHZhciByZWFsVWlkID0gZ2V0QWN0dWFsVWlkKHVpZE9yRW50aXR5KTtcbiAgICBpZiAoIXJlYWxVaWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgaXRlbSA9IGV4cG9ydHMuZ2V0Q2FjaGVkSXRlbShyZWFsVWlkLCBpbnN0YW5jZSk7XG4gICAgcmV0dXJuIGl0ZW0gPyBpdGVtLmVudGl0eSA6IHVuZGVmaW5lZDtcbn07XG5leHBvcnRzLmdldEVkaXRJdGVtID0gZnVuY3Rpb24gKG9iaiwgaW5zdGFuY2UsIG5vZGVJZCkge1xuICAgIGlmICh1dGlsXzEuaXNBcnJheShvYmopKSB7XG4gICAgICAgIHJldHVybiBvYmoubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0RWRpdGFibGVPYmplY3QoaXRlbSwgaW5zdGFuY2UpO1xuICAgICAgICB9KS5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtICE9PSBudWxsICYmIGl0ZW0gIT09IHVuZGVmaW5lZDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBnZXRFZGl0YWJsZU9iamVjdChvYmosIGluc3RhbmNlKTtcbn07XG52YXIgZ2V0RWRpdGFibGVPYmplY3QgPSBmdW5jdGlvbiAodWlkT3JFbnRpdHksIGluc3RhbmNlKSB7XG4gICAgdmFyIHJlYWxVaWQgPSBnZXRBY3R1YWxVaWQodWlkT3JFbnRpdHkpO1xuICAgIHZhciBleGlzdGluZyA9IGV4cG9ydHMuZ2V0SXRlbShyZWFsVWlkLCBpbnN0YW5jZSk7XG4gICAgdmFyIGNsb25lID0gdXRpbF8xLmRlZXBDbG9uZShleGlzdGluZywgdW5kZWZpbmVkLCBmYWxzZSk7XG4gICAgY29uc29sZS5sb2coY2xvbmUpO1xuICAgIHJldHVybiBleGlzdGluZyA/IHV0aWxfMS5kZWVwQ2xvbmUoZXhpc3RpbmcsIHVuZGVmaW5lZCwgZmFsc2UpIDogdW5kZWZpbmVkO1xufTtcbnZhciBnZXRBY3R1YWxVaWQgPSBmdW5jdGlvbiAodWlkT3JFbnRpdHkpIHtcbiAgICBpZiAodHlwZW9mIHVpZE9yRW50aXR5ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHJldHVybiB1aWRPckVudGl0eTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIHVpZE9yRW50aXR5ID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgIHJldHVybiBTdHJpbmcodWlkT3JFbnRpdHkpO1xuICAgIH1cbiAgICBlbHNlIGlmICh1dGlsXzEuaXNPYmplY3QodWlkT3JFbnRpdHkpKSB7XG4gICAgICAgIGlmICh1dGlsXzEuaGFzVWlkKHVpZE9yRW50aXR5KSkge1xuICAgICAgICAgICAgcmV0dXJuIHVpZE9yRW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgICAgICB9XG4gICAgfVxufTtcbmV4cG9ydHMuaXNPbkNhY2hlID0gZnVuY3Rpb24gKGZsdXNoQXJncykge1xuICAgIHZhciB1aWQgPSBmbHVzaEFyZ3MuZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgIHZhciBleGlzdGluZ0l0ZW0gPSBleHBvcnRzLmdldENhY2hlZEl0ZW0odWlkLCBmbHVzaEFyZ3MuaW5zdGFuY2UpO1xuICAgIHJldHVybiBleGlzdGluZ0l0ZW0gJiYgZXhpc3RpbmdJdGVtLmVudGl0eSA9PT0gZmx1c2hBcmdzLmVudGl0eTtcbn07XG5leHBvcnRzLmdldENhY2hlZEl0ZW0gPSBmdW5jdGlvbiAodWlkLCBpbnN0YW5jZSkge1xuICAgIHZhciBjdXJyZW50Tm9kZSA9IGdldEN1cnJlbnROb2RlKGluc3RhbmNlKTtcbiAgICByZXR1cm4gY3VycmVudE5vZGUgPyBjdXJyZW50Tm9kZS5pdGVtcy5nZXQoU3RyaW5nKHVpZCkpIDogdW5kZWZpbmVkO1xufTtcbmZ1bmN0aW9uIGdldEN1cnJlbnROb2RlKGluc3RhbmNlKSB7XG4gICAgdmFyIGN1cnJlbnROb2RlSWQgPSBpbnN0YW5jZS50aHJlYWQubm9kZXNbaW5zdGFuY2UudGhyZWFkLmN1cnJlbnRdO1xuICAgIHJldHVybiBjdXJyZW50Tm9kZUlkID49IDAgPyBnZXRSZXBvTm9kZShjdXJyZW50Tm9kZUlkLCBpbnN0YW5jZS5yZXBvKSA6IHVuZGVmaW5lZDtcbn1cbmZ1bmN0aW9uIGdldFJlcG9Ob2RlKG5vZGVJZCwgcmVwbykge1xuICAgIHJldHVybiByZXBvLmdldChub2RlSWQpO1xufVxuZXhwb3J0cy5nZXRDYWNoZUN1cnJlbnRTdGFjayA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIHZhciBjdXJyZW50Tm9kZSA9IGdldEN1cnJlbnROb2RlKGluc3RhbmNlKTtcbiAgICByZXR1cm4gY3VycmVudE5vZGUgPyBjdXJyZW50Tm9kZS5pdGVtcyA6IHVuZGVmaW5lZDtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9nZXQudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xuZnVuY3Rpb24gZ2V0S2V5KGtleSkge1xuICAgIHZhciBpbnRLZXkgPSBwYXJzZUludChrZXkpO1xuICAgIGlmIChpbnRLZXkudG9TdHJpbmcoKSA9PT0ga2V5KSB7XG4gICAgICAgIHJldHVybiBpbnRLZXk7XG4gICAgfVxuICAgIHJldHVybiBrZXk7XG59XG5mdW5jdGlvbiBkZWwob2JqLCBwYXRoKSB7XG4gICAgaWYgKHV0aWxfMS5pc051bWJlcihwYXRoKSkge1xuICAgICAgICBwYXRoID0gW3BhdGhdO1xuICAgIH1cbiAgICBpZiAodXRpbF8xLmlzRW1wdHkob2JqKSkge1xuICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbiAgICBpZiAodXRpbF8xLmlzRW1wdHkocGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgaWYgKHV0aWxfMS5pc1N0cmluZyhwYXRoKSkge1xuICAgICAgICByZXR1cm4gZGVsKG9iaiwgcGF0aC5zcGxpdCgnLicpKTtcbiAgICB9XG4gICAgdmFyIGN1cnJlbnRQYXRoID0gZ2V0S2V5KHBhdGhbMF0pO1xuICAgIHZhciBvbGRWYWwgPSBvYmpbY3VycmVudFBhdGhdO1xuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBpZiAob2xkVmFsICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgIGlmICh1dGlsXzEuaXNBcnJheShvYmopKSB7XG4gICAgICAgICAgICAgICAgb2JqLnNwbGljZShjdXJyZW50UGF0aCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgb2JqW2N1cnJlbnRQYXRoXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKG9ialtjdXJyZW50UGF0aF0gIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgcmV0dXJuIGRlbChvYmpbY3VycmVudFBhdGhdLCBwYXRoLnNsaWNlKDEpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqO1xufVxuZXhwb3J0cy5kZWwgPSBkZWw7XG5mdW5jdGlvbiBnZXQob2JqLCBwYXRoLCBkZWZhdWx0VmFsdWUpIHtcbiAgICBpZiAodXRpbF8xLmlzTnVtYmVyKHBhdGgpKSB7XG4gICAgICAgIHBhdGggPSBbcGF0aF07XG4gICAgfVxuICAgIGlmICh1dGlsXzEuaXNFbXB0eShwYXRoKSkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBpZiAodXRpbF8xLmlzRW1wdHkob2JqKSkge1xuICAgICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgIH1cbiAgICBpZiAodXRpbF8xLmlzU3RyaW5nKHBhdGgpKSB7XG4gICAgICAgIHJldHVybiBnZXQob2JqLCBwYXRoLnNwbGl0KCcuJyksIGRlZmF1bHRWYWx1ZSk7XG4gICAgfVxuICAgIHZhciBjdXJyZW50UGF0aCA9IGdldEtleShwYXRoWzBdKTtcbiAgICBpZiAocGF0aC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgaWYgKG9ialtjdXJyZW50UGF0aF0gPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2JqW2N1cnJlbnRQYXRoXTtcbiAgICB9XG4gICAgcmV0dXJuIGdldChvYmpbY3VycmVudFBhdGhdLCBwYXRoLnNsaWNlKDEpLCBkZWZhdWx0VmFsdWUpO1xufVxuZXhwb3J0cy5nZXQgPSBnZXQ7XG5leHBvcnRzLmNvbmNhdFByb3AgPSBmdW5jdGlvbiAocHJvcENoYWluLCBwcm9wKSB7XG4gICAgaWYgKHByb3BDaGFpbiA9PT0gXCJcIikge1xuICAgICAgICBwcm9wQ2hhaW4gPSBwcm9wO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcHJvcENoYWluID0gcHJvcENoYWluICsgXCIuXCIgKyBwcm9wO1xuICAgIH1cbiAgICByZXR1cm4gcHJvcENoYWluO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3BhdGgudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBDYWNoZU1hcF8xID0gcmVxdWlyZShcIi4vQ2FjaGVNYXBcIik7XG52YXIgQ2FjaGVJdGVtID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDYWNoZUl0ZW0oZW50aXR5LCBsaXZlSXRlbSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmNsb25lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBDYWNoZUl0ZW0oX3RoaXMuZW50aXR5LCBfdGhpcyk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZW50aXR5ID0gZW50aXR5O1xuICAgICAgICBpZiAobGl2ZUl0ZW0pIHtcbiAgICAgICAgICAgIHRoaXMubWFwRnJvbSA9IGxpdmVJdGVtLm1hcEZyb20uY2xvbmUoKTtcbiAgICAgICAgICAgIHRoaXMubWFwVG8gPSBsaXZlSXRlbS5tYXBUby5jbG9uZSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tYXBGcm9tID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5tYXBUbyA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gQ2FjaGVJdGVtO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IENhY2hlSXRlbTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NhY2hlSXRlbS50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIGNhY2hlXzEgPSByZXF1aXJlKFwiLi9jYWNoZVwiKTtcbmV4cG9ydHMucHJpbnRDYWNoZSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIHZhciByZXN1bHQgPSBcIlwiO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIGN1cnJlbnQgPSBpbnN0YW5jZS50aHJlYWQuY3VycmVudDtcbiAgICB2YXIgbm9kZUluZGljZXMgPSBpbnN0YW5jZS50aHJlYWQubm9kZXM7XG4gICAgbm9kZUluZGljZXMubWFwKGZ1bmN0aW9uIChjYWNoZU5vZGVJZCkge1xuICAgICAgICB2YXIgY2FjaGVOb2RlID0gaW5zdGFuY2UucmVwby5nZXQoY2FjaGVOb2RlSWQpO1xuICAgICAgICB2YXIgc3RyZWFtRGF0YSA9IFwiXCI7XG4gICAgICAgIHZhciBzdGF0ZSA9IGluZGV4ICsgXCI6XCIgKyBzdHJlYW1EYXRhICsgXCJbXCIgKyBzdHJpbmdpZnlNYXAoY2FjaGVOb2RlLml0ZW1zKSArIFwiXVxcblxcblwiO1xuICAgICAgICBpZiAoaW5kZXggPT09IGN1cnJlbnQpIHtcbiAgICAgICAgICAgIHN0YXRlID0gXCItPiBcIiArIHN0YXRlO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCArPSBzdGF0ZTtcbiAgICAgICAgaW5kZXgrKztcbiAgICB9KTtcbiAgICByZXN1bHQgPSByZXN1bHQuc3Vic3RyaW5nKDAsIChyZXN1bHQubGVuZ3RoIC0gMikpO1xuICAgIGluZGV4ID0gMDtcbiAgICByZXR1cm4gXCJcXG4tLS0tLS0gT25lIC0tLS0tLS1cIlxuICAgICAgICArIFwiXFxuU1RBQ0s6XFxuXCIgKyByZXN1bHRcbiAgICAgICAgKyBcIlxcblxcbkNPTkZJRzpcIiArIEpTT04uc3RyaW5naWZ5KGNhY2hlXzEuY29uZmlnLCBudWxsLCAyKVxuICAgICAgICArIFwiXFxuXFxuUkVQTyBTSVpFOlwiICsgaW5zdGFuY2UucmVwby5sZW5ndGhcbiAgICAgICAgKyBcIlxcbj09PT09PT09PT09PT09PT09PT1cXG5cIjtcbn07XG52YXIgc3RyaW5naWZ5TWFwID0gZnVuY3Rpb24gKG1hcCkge1xuICAgIHZhciByZXN1bHQgPSBcIlwiO1xuICAgIG1hcC5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIGl0ZW0pIHtcbiAgICAgICAgdmFyIGl0ZW1SZXN1bHQgPSBKU09OLnN0cmluZ2lmeShpdGVtLCBudWxsLCAyKTtcbiAgICAgICAgcmVzdWx0ICs9IGl0ZW1SZXN1bHQgKyBcIixcXG5cIjtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3ByaW50LnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQ2FjaGVSZXBvXzEgPSByZXF1aXJlKFwiLi9DYWNoZVJlcG9cIik7XG52YXIgQ2FjaGVUaHJlYWRfMSA9IHJlcXVpcmUoXCIuL0NhY2hlVGhyZWFkXCIpO1xudmFyIENhY2hlSW5zdGFuY2UgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENhY2hlSW5zdGFuY2UobmFtZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLnJlcG8gPSBuZXcgQ2FjaGVSZXBvXzEuZGVmYXVsdCgpO1xuICAgICAgICB0aGlzLnRocmVhZCA9IG5ldyBDYWNoZVRocmVhZF8xLmRlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5uZXh0Tm9kZUtleSA9IDA7XG4gICAgICAgIHRoaXMucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5yZXBvID0gbmV3IENhY2hlUmVwb18xLmRlZmF1bHQoKTtcbiAgICAgICAgICAgIF90aGlzLnRocmVhZCA9IG5ldyBDYWNoZVRocmVhZF8xLmRlZmF1bHQoKTtcbiAgICAgICAgICAgIF90aGlzLm5leHROb2RlS2V5ID0gMDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5hZGROb2RlID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5yZXBvLmFkZChub2RlKSkge1xuICAgICAgICAgICAgICAgIF90aGlzLnRocmVhZC5hZGROb2RlKG5vZGUuaWQpO1xuICAgICAgICAgICAgICAgIF90aGlzLm5leHROb2RlS2V5Kys7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubGVuZ3RoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLnRocmVhZC5ub2Rlcy5sZW5ndGg7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5yZXBvLmxlbmd0aDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB9XG4gICAgcmV0dXJuIENhY2hlSW5zdGFuY2U7XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ2FjaGVJbnN0YW5jZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NhY2hlSW5zdGFuY2UudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBDYWNoZU1hcF8xID0gcmVxdWlyZShcIi4vQ2FjaGVNYXBcIik7XG52YXIgQ2FjaGVSZXBvID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDYWNoZVJlcG8oKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuaXRlbXMgPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgICAgIHRoaXMubGVuZ3RoID0gMDtcbiAgICAgICAgdGhpcy5nZXQgPSBmdW5jdGlvbiAobm9kZUlkKSB7IHJldHVybiAoX3RoaXMuaXRlbXMuZ2V0KG5vZGVJZCkpOyB9O1xuICAgICAgICB0aGlzLmFkZCA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICBpZiAoIV90aGlzLml0ZW1zLmhhcyhub2RlLmlkKSkge1xuICAgICAgICAgICAgICAgIF90aGlzLml0ZW1zLnNldChub2RlLmlkLCBub2RlKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5sZW5ndGgrKztcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5kZWxldGUgPSBmdW5jdGlvbiAobm9kZUlkKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMuaXRlbXMuaGFzKG5vZGVJZCkpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5pdGVtcy5kZWxldGUobm9kZUlkKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5sZW5ndGgtLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIENhY2hlUmVwbztcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDYWNoZVJlcG87XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DYWNoZVJlcG8udHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBDYWNoZVRocmVhZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2FjaGVUaHJlYWQoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuY3VycmVudCA9IC0xO1xuICAgICAgICB0aGlzLm5vZGVzID0gW107XG4gICAgICAgIHRoaXMuYWRkTm9kZSA9IGZ1bmN0aW9uIChub2RlSWQpIHtcbiAgICAgICAgICAgIF90aGlzLm5vZGVzLnB1c2gobm9kZUlkKTtcbiAgICAgICAgICAgIF90aGlzLmN1cnJlbnQrKztcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIENhY2hlVGhyZWFkO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IENhY2hlVGhyZWFkO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2FjaGVUaHJlYWQudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xudmFyIGNhY2hlXzEgPSByZXF1aXJlKFwiLi9jYWNoZVwiKTtcbnZhciBnZXRfMSA9IHJlcXVpcmUoXCIuL2dldFwiKTtcbnZhciBDYWNoZU1hcF8xID0gcmVxdWlyZShcIi4vQ2FjaGVNYXBcIik7XG52YXIgb3BhdGggPSByZXF1aXJlKFwiLi9wYXRoXCIpO1xudmFyIGZsdXNoXzEgPSByZXF1aXJlKFwiLi9mbHVzaFwiKTtcbnZhciBsb2NhdGVfMSA9IHJlcXVpcmUoXCIuL2xvY2F0ZVwiKTtcbnZhciByZWZfMSA9IHJlcXVpcmUoXCIuL3JlZlwiKTtcbmV4cG9ydHMuZXZpY3RJdGVtID0gZnVuY3Rpb24gKG9iaiwgaW5zdGFuY2UpIHtcbiAgICB2YXIgdWlkQXJyYXkgPSBidWlsZEV2aWN0VWlkQXJyYXkob2JqKTtcbiAgICBpZiAodWlkQXJyYXkubGVuZ3RoID09IDApIHtcbiAgICAgICAgcmV0dXJuIGxvY2F0ZV8xLmdldENhbGxTdGF0cyhmYWxzZSwgaW5zdGFuY2UpO1xuICAgIH1cbiAgICB2YXIgY3VycmVudFN0YXRlID0gZ2V0XzEuZ2V0Q2FjaGVDdXJyZW50U3RhY2soaW5zdGFuY2UpO1xuICAgIHZhciBmb3VuZCA9IHVpZEFycmF5LnNvbWUoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRTdGF0ZSAmJiBjdXJyZW50U3RhdGUuaGFzKFN0cmluZyhpdGVtKSk7XG4gICAgfSk7XG4gICAgaWYgKCFmb3VuZCkge1xuICAgICAgICByZXR1cm4gbG9jYXRlXzEuZ2V0Q2FsbFN0YXRzKGZhbHNlLCBpbnN0YW5jZSk7XG4gICAgfVxuICAgIHZhciB0ZW1wU3RhdGUgPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgY3VycmVudFN0YXRlLmZvckVhY2goZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgdGVtcFN0YXRlLnNldChrZXksIHZhbHVlKTtcbiAgICB9KTtcbiAgICB2YXIgZmx1c2hNYXAgPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgdmFyIGV2aWN0TWFwID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgIHZhciBmbHVzaEFyZ3MgPSB7XG4gICAgICAgIGZsdXNoTWFwOiBmbHVzaE1hcCxcbiAgICAgICAgZXZpY3RNYXA6IGV2aWN0TWFwLFxuICAgICAgICBpbnN0YW5jZTogaW5zdGFuY2VcbiAgICB9O1xuICAgIHZhciBwYXJlbnRzQ2hhbmdlZCA9IFtdO1xuICAgIHVpZEFycmF5LmZvckVhY2goZnVuY3Rpb24gKHVpZCkge1xuICAgICAgICBmbHVzaEFyZ3MuZW50aXR5VWlkID0gdWlkO1xuICAgICAgICBjbGVhclRhcmdldFJlZkZyb21zKGZsdXNoQXJncyk7XG4gICAgICAgIGV2aWN0TWFwLnNldCh1aWQsIG51bGwpO1xuICAgICAgICBjbGVhclBhcmVudFJlZlRvcyh1aWRBcnJheSwgcGFyZW50c0NoYW5nZWQsIGZsdXNoQXJncyk7XG4gICAgfSk7XG4gICAgcHV0UGFyZW50c0NoYW5nZWQocGFyZW50c0NoYW5nZWQsIGZsdXNoTWFwLCBldmljdE1hcCwgaW5zdGFuY2UpO1xuICAgIGZsdXNoTWFwLmZvckVhY2goZnVuY3Rpb24gKGtleSwgaXRlbSkge1xuICAgICAgICB0ZW1wU3RhdGUuc2V0KGtleSwgaXRlbSk7XG4gICAgfSk7XG4gICAgZXZpY3RNYXAuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgIHRlbXBTdGF0ZS5kZWxldGUoa2V5KTtcbiAgICB9KTtcbiAgICBmbHVzaF8xLmZsdXNoKHRlbXBTdGF0ZSwgaW5zdGFuY2UpO1xuICAgIHJldHVybiBsb2NhdGVfMS5nZXRDYWxsU3RhdHModHJ1ZSwgaW5zdGFuY2UpO1xufTtcbnZhciBwdXRQYXJlbnRzQ2hhbmdlZCA9IGZ1bmN0aW9uIChwYXJlbnRzQ2hhbmdlZCwgZmx1c2hNYXAsIGV2aWN0TWFwLCBpbnN0YW5jZSkge1xuICAgIGlmIChwYXJlbnRzQ2hhbmdlZCAmJiBwYXJlbnRzQ2hhbmdlZC5sZW5ndGggPiAwICYmIHV0aWxfMS5jYWNoZVNpemUoaW5zdGFuY2UpID4gMCkge1xuICAgICAgICB2YXIgZmx1c2hBcmdzXzEgPSB7XG4gICAgICAgICAgICBmbHVzaE1hcDogZmx1c2hNYXAsXG4gICAgICAgICAgICBldmljdE1hcDogZXZpY3RNYXAsXG4gICAgICAgICAgICBpbnN0YW5jZTogaW5zdGFuY2VcbiAgICAgICAgfTtcbiAgICAgICAgZmx1c2hfMS5idWlsZEZsdXNoTWFwKGZsdXNoQXJnc18xKTtcbiAgICAgICAgZmx1c2hBcmdzXzEuZmx1c2hNYXAuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgICAgICByZWZfMS51cGRhdGVSZWZGcm9tcyhpdGVtLCBmbHVzaEFyZ3NfMSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG52YXIgY2xlYXJUYXJnZXRSZWZGcm9tcyA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICB2YXIgaXRlbSA9IGdldF8xLmdldENhY2hlZEl0ZW0oZmx1c2hBcmdzLmVudGl0eVVpZCwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICBpZiAoaXRlbSkge1xuICAgICAgICBpdGVtLm1hcFRvLmZvckVhY2goZnVuY3Rpb24gKHRvVWlkLCBwYXRocykge1xuICAgICAgICAgICAgdmFyIHJlZkl0ZW0gPSBmbHVzaF8xLmdldEl0ZW1GbHVzaE9yQ2FjaGVkKHRvVWlkLCBmbHVzaEFyZ3MpO1xuICAgICAgICAgICAgaWYgKHJlZkl0ZW0pIHtcbiAgICAgICAgICAgICAgICBjbGVhclJlZkZyb20ocmVmSXRlbSwgZmx1c2hBcmdzLmVudGl0eVVpZCk7XG4gICAgICAgICAgICAgICAgaWYgKHJlZkl0ZW0ubWFwRnJvbS5zaXplKCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZmx1c2hBcmdzLmVudGl0eVVpZCA9IHRvVWlkO1xuICAgICAgICAgICAgICAgICAgICBjbGVhclRhcmdldFJlZkZyb21zKGZsdXNoQXJncyk7XG4gICAgICAgICAgICAgICAgICAgIGZsdXNoQXJncy5ldmljdE1hcC5zZXQodG9VaWQsIHJlZkl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZmx1c2hBcmdzLmZsdXNoTWFwLnNldCh0b1VpZCwgcmVmSXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59O1xudmFyIGNsZWFyUmVmRnJvbSA9IGZ1bmN0aW9uIChyZWZJdGVtLCBwYXJlbnRVaWQpIHtcbiAgICB2YXIgcmVmc0FycmF5ID0gcmVmSXRlbS5tYXBGcm9tLmdldChwYXJlbnRVaWQpO1xuICAgIGlmICghcmVmc0FycmF5KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmVmSXRlbS5tYXBGcm9tID0gcmVmSXRlbS5tYXBGcm9tLmNsb25lKCk7XG4gICAgcmVmSXRlbS5tYXBGcm9tLmRlbGV0ZShwYXJlbnRVaWQpO1xufTtcbnZhciBjbGVhclBhcmVudFJlZlRvcyA9IGZ1bmN0aW9uICh1aWRBcnJheSwgcGFyZW50c0NoYW5nZWQsIGZsdXNoQXJncykge1xuICAgIHZhciBpdGVtID0gZmx1c2hfMS5nZXRJdGVtRmx1c2hPckNhY2hlZChmbHVzaEFyZ3MuZW50aXR5VWlkLCBmbHVzaEFyZ3MpO1xuICAgIGlmIChpdGVtKSB7XG4gICAgICAgIGl0ZW0ubWFwRnJvbS5mb3JFYWNoKGZ1bmN0aW9uIChwYXJlbnRVaWQsIHBhdGhzKSB7XG4gICAgICAgICAgICB2YXIgcGFyZW50SXRlbSA9IGZsdXNoXzEuZ2V0SXRlbUZsdXNoT3JDYWNoZWQocGFyZW50VWlkLCBmbHVzaEFyZ3MpO1xuICAgICAgICAgICAgaWYgKHBhcmVudEl0ZW0pIHtcbiAgICAgICAgICAgICAgICB2YXIgc3VjY2VzcyA9IGNsZWFyUmVmVG8ocGFyZW50SXRlbSwgZmx1c2hBcmdzLmVudGl0eVVpZCwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICBpZiAoc3VjY2VzcyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZmx1c2hNYXAuc2V0KHBhcmVudFVpZCwgcGFyZW50SXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1aWRBcnJheS5pbmRleE9mKHBhcmVudFVpZCkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRzQ2hhbmdlZC5wdXNoKHBhcmVudEl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59O1xudmFyIGNsZWFyUmVmVG8gPSBmdW5jdGlvbiAocGFyZW50SXRlbSwgcmVmVWlkLCBpbnN0YW5jZSkge1xuICAgIHZhciBwYXJlbnQgPSBwYXJlbnRJdGVtLmVudGl0eTtcbiAgICBpZiAoT2JqZWN0LmlzRnJvemVuKHBhcmVudCkpIHtcbiAgICAgICAgcGFyZW50ID0gZ2V0XzEuZ2V0RWRpdEl0ZW0ocGFyZW50W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdLCBpbnN0YW5jZSk7XG4gICAgICAgIHBhcmVudEl0ZW0uZW50aXR5ID0gcGFyZW50O1xuICAgIH1cbiAgICB2YXIgcmVmUGF0aHMgPSBwYXJlbnRJdGVtLm1hcFRvLmdldChyZWZVaWQpO1xuICAgIHJlZlBhdGhzLmZvckVhY2goZnVuY3Rpb24gKHBhdGgpIHtcbiAgICAgICAgb3BhdGguZGVsKHBhcmVudCwgcGF0aCk7XG4gICAgfSk7XG4gICAgaWYgKCFPYmplY3QuaXNGcm96ZW4ocGFyZW50KSkge1xuICAgICAgICBPYmplY3QuZnJlZXplKHBhcmVudCk7XG4gICAgfVxuICAgIHBhcmVudEl0ZW0uZW50aXR5ID0gcGFyZW50O1xuICAgIHBhcmVudEl0ZW0ubWFwVG8gPSBwYXJlbnRJdGVtLm1hcFRvLmNsb25lKCk7XG4gICAgcGFyZW50SXRlbS5tYXBUby5kZWxldGUocmVmVWlkKTtcbiAgICByZXR1cm4gdHJ1ZTtcbn07XG52YXIgYnVpbGRFdmljdFVpZEFycmF5ID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHZhciB1aWRBcnJheSA9IFtdO1xuICAgIGlmICh1dGlsXzEuaXNBcnJheShvYmopKSB7XG4gICAgICAgIG9iai5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICBpZiAodXRpbF8xLmhhc1VpZChpdGVtKSkge1xuICAgICAgICAgICAgICAgIHVpZEFycmF5LnB1c2goU3RyaW5nKGl0ZW1bY2FjaGVfMS5jb25maWcudWlkTmFtZV0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgaXRlbSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgICAgICB1aWRBcnJheS5wdXNoKFN0cmluZyhpdGVtKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHZhciB1aWQgPSBvYmo7XG4gICAgICAgIGlmICh1dGlsXzEuaXNPYmplY3Qob2JqKSkge1xuICAgICAgICAgICAgdWlkID0gb2JqW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1aWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHVpZEFycmF5O1xuICAgICAgICB9XG4gICAgICAgIHVpZEFycmF5LnB1c2goU3RyaW5nKHVpZCkpO1xuICAgIH1cbiAgICByZXR1cm4gdWlkQXJyYXk7XG59O1xuZXhwb3J0cy5jbGVhck5leHQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICB2YXIgdGhyZWFkID0gaW5zdGFuY2UudGhyZWFkO1xuICAgIGlmICh0aHJlYWQuY3VycmVudCA8IHRocmVhZC5ub2Rlcy5sZW5ndGggLSAxKSB7XG4gICAgICAgIHZhciByZW1vdmVkTm9kZXMgPSB0aHJlYWQubm9kZXMuc2xpY2UodGhyZWFkLmN1cnJlbnQgKyAxLCB0aHJlYWQubm9kZXMubGVuZ3RoKTtcbiAgICAgICAgdGhyZWFkLm5vZGVzID0gdGhyZWFkLm5vZGVzLnNsaWNlKDAsIHRocmVhZC5jdXJyZW50ICsgMSk7XG4gICAgICAgIHRocmVhZC5jdXJyZW50ID0gdGhyZWFkLm5vZGVzLmxlbmd0aCAtIDE7XG4gICAgICAgIHRydW5jYXRlVGhyZWFkcyhyZW1vdmVkTm9kZXMsIGluc3RhbmNlKTtcbiAgICB9XG59O1xudmFyIHRydW5jYXRlVGhyZWFkcyA9IGZ1bmN0aW9uIChyZW1vdmVkTm9kZXMsIGluc3RhbmNlKSB7XG4gICAgcmVtb3ZlZE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKGNhY2hlTm9kZUlkKSB7XG4gICAgICAgIHZhciBjYWNoZU5vZGUgPSBpbnN0YW5jZS5yZXBvLmdldChjYWNoZU5vZGVJZCk7XG4gICAgICAgIGlmIChjYWNoZU5vZGUpIHtcbiAgICAgICAgICAgIGluc3RhbmNlLnJlcG8uZGVsZXRlKGNhY2hlTm9kZUlkKTtcbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2V2aWN0LnRzIl0sInNvdXJjZVJvb3QiOiIifQ==