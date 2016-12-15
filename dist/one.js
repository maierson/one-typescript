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
	exports.print = cache_1.print;
	(function () {
	    if (window) {
	        window.One = {
	            getCache: cache_1.getCache, put: cache_1.put, get: cache_1.get, getEdit: cache_1.getEdit, evict: cache_1.evict, reset: cache_1.reset, print: cache_1.print
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMjBlZWNjYTYyN2IzODA4MTQyZjgiLCJ3ZWJwYWNrOi8vLy4vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vY2FjaGUudHMiLCJ3ZWJwYWNrOi8vLy4vY29uZmlnLnRzIiwid2VicGFjazovLy8uL3B1dC50cyIsIndlYnBhY2s6Ly8vLi9DYWNoZU1hcC50cyIsIndlYnBhY2s6Ly8vLi4vfi9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwid2VicGFjazovLy8uL2xvY2F0ZS50cyIsIndlYnBhY2s6Ly8vLi91dGlsLnRzIiwid2VicGFjazovLy8uL0NhY2hlTm9kZS50cyIsIndlYnBhY2s6Ly8vLi9yZWYudHMiLCJ3ZWJwYWNrOi8vLy4vZmx1c2gudHMiLCJ3ZWJwYWNrOi8vLy4vZ2V0LnRzIiwid2VicGFjazovLy8uL3BhdGgudHMiLCJ3ZWJwYWNrOi8vLy4vQ2FjaGVJdGVtLnRzIiwid2VicGFjazovLy8uL3ByaW50LnRzIiwid2VicGFjazovLy8uL0NhY2hlSW5zdGFuY2UudHMiLCJ3ZWJwYWNrOi8vLy4vQ2FjaGVSZXBvLnRzIiwid2VicGFjazovLy8uL0NhY2hlVGhyZWFkLnRzIiwid2VicGFjazovLy8uL2V2aWN0LnRzIl0sIm5hbWVzIjpbImNhY2hlXzEiLCJyZXF1aXJlIiwiZXhwb3J0cyIsImdldENhY2hlIiwicHV0IiwiZ2V0IiwiZ2V0RWRpdCIsImV2aWN0IiwicmVzZXQiLCJwcmludCIsIndpbmRvdyIsIk9uZSIsImNvbmZpZ18xIiwicHV0XzEiLCJwcmludF8xIiwiQ2FjaGVJbnN0YW5jZV8xIiwidXRpbF8xIiwiZ2V0XzEiLCJldmljdF8xIiwiY2FjaGVUZXN0Iiwic2V0VGVzdGluZyIsInRlc3RpbmciLCJpbnN0YW5jZU5hbWUiLCJjb25maWd1cmF0aW9uIiwiZGVmYXVsdENvbmZpZyIsImNvbmZpZyIsImluc3RhbmNlcyIsImNvbmZpZ3VyZSIsImNyZWF0ZUNhY2hlIiwidW5kZWZpbmVkIiwiaXRlbSIsImVudGl0eSIsIm5vZGVJZCIsInVpZE9yRW50aXR5T3JBcnJheSIsIm5hbWUiLCJpbnN0YW5jZSIsImRlZmF1bHQiLCJwdXRJdGVtIiwiZ2V0SXRlbSIsImdldEVkaXRJdGVtIiwiZXZpY3RJdGVtIiwic2l6ZSIsImNhY2hlU2l6ZSIsImxlbmd0aCIsImNhY2hlTGVuZ3RoIiwicHJpbnRDYWNoZSIsInJlc3VsdCIsInJlZlRvIiwidWlkIiwiZ2V0Q2FjaGVkSXRlbSIsIm1hcFRvIiwicmVmRnJvbSIsIm1hcEZyb20iLCJ1aWROYW1lIiwibWF4SGlzdG9yeVN0YXRlcyIsImNvbmYiLCJwIiwiaGFzT3duUHJvcGVydHkiLCJDYWNoZU1hcF8xIiwibG9jYXRlXzEiLCJyZWZfMSIsImZsdXNoXzEiLCJpc0FycmF5IiwiaXNPYmplY3QiLCJldmljdE1hcCIsImZsdXNoTWFwIiwiZmx1c2hBcmdzIiwicGFyZW50VWlkIiwicmVmUGF0aCIsImJ1aWxkRmx1c2hNYXAiLCJ1cGRhdGVQb2ludGVycyIsImNvbW1pdFB1dCIsImdldENhbGxTdGF0cyIsInByZUZsdXNoIiwib2JqZWN0QXNzaWduIiwiQ2FjaGVNYXAiLCJfdGhpcyIsInBhdGhzIiwia2V5IiwiZGVsZXRlIiwidmFsIiwiaGFzIiwiZm9yRWFjaCIsImNhbGxiYWNrIiwiY2xvbmUiLCJuZXdJbnN0YW5jZSIsInByb3RvdHlwZSIsInNldCIsInZhbHVlIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJzdWNjZXNzIiwibm9kZSIsImN1cnJlbnROb2RlIiwiZ2V0Q3VycmVudE5vZGUiLCJpZCIsImlzTnVtYmVyIiwiVHlwZUVycm9yIiwiY2FjaGVOb2RlIiwiZ2V0UmVwb05vZGUiLCJ0aHJlYWQiLCJjdXJyZW50IiwiYmluYXJ5SW5kZXhPZiIsIm5vZGVzIiwiY3VycmVudE5vZGVJZCIsImNhY2hlTm9kZUlkIiwicmVwbyIsImFycmF5Iiwic2VhcmNoRWxlbWVudCIsIm1pbkluZGV4IiwibWF4SW5kZXgiLCJjdXJyZW50SW5kZXgiLCJjdXJyZW50RWxlbWVudCIsIkNhY2hlTm9kZV8xIiwidG9TdHJpbmciLCJfaGFzT3duUHJvcGVydHkiLCJpc1N0cmluZyIsIm9iaiIsIm1peGVkX3ZhciIsImNhbGwiLCJpc0Z1bmN0aW9uIiwiQXJyYXkiLCJzcGxpY2UiLCJwcm9wZXJ0eUlzRW51bWVyYWJsZSIsIm9ialRvU3RyIiwibyIsImlzRGF0ZSIsImlzRW1wdHkiLCJpIiwiZ2V0TmV3Q2FjaGVOb2RlIiwiQ2FjaGVOb2RlIiwibmV4dE5vZGVLZXkiLCJhZGQiLCJoYXNVaWQiLCJGdW5jdGlvbiIsInRhcmdldCIsIlNUUklQX0NPTU1FTlRTIiwiQVJHVU1FTlRfTkFNRVMiLCJnZXRQYXJhbU5hbWVzIiwiZnVuYyIsImZuU3RyIiwicmVwbGFjZSIsInNsaWNlIiwiaW5kZXhPZiIsIm1hdGNoIiwic3RyaW5naWZ5IiwiUmVnRXhwIiwiYm9keSIsInBhcmFtTmFtZXMiLCJiaW5kIiwiZGVlcENsb25lIiwidWlkUmVmZXJlbmNlIiwiZnJlZXplIiwiaXNGcm96ZW4iLCJjb25zb2xlIiwibG9nIiwicHJvcE5hbWUiLCJkZWVwQ2xvbmVBcnJheSIsImRhdGUiLCJEYXRlIiwiZ2V0VGltZSIsImFyciIsIm1hcCIsIml0ZW1zIiwib3BhdGgiLCJhc3NpZ25SZWZUb1BhcmVudCIsInJlZkl0ZW0iLCJwYXJlbnRJdGVtIiwiZ2V0SXRlbUZsdXNoT3JDYWNoZWQiLCJhc3NpZ25SZWZzIiwicmVmVWlkIiwiYWRkUmVmVG8iLCJhZGRSZWZGcm9tIiwicGF0aCIsInJlZkFycmF5IiwicHVzaCIsImZyb21BcnJheSIsInVwZGF0ZUl0ZW1SZWZUb3MiLCJ1cGRhdGVSZWZGcm9tcyIsImZpcnN0UGF0aCIsInRhcmdldFJlZiIsImRpcnR5IiwiYXJncyIsImVuc3VyZUl0ZW0iLCJ1cGRhdGVSZWZUb3MiLCJlbnRpdHlVaWQiLCJ0b1VpZCIsInVwZGF0ZWRQYXRocyIsInJlZmVyZW5jZSIsInRhcmdldFVpZCIsImZvdW5kIiwicmVtb3ZlUmVmRnJvbV9WYWx1ZSIsImZpbHRlciIsInJlbW92ZVJlZkZyb20iLCJyZWZzQXJyYXkiLCJpbmRleCIsInBhdGhfMSIsIkNhY2hlSXRlbV8xIiwiYnVpbGRFbnRpdHlGbHVzaE1hcCIsImNhY2hlQXJyUmVmcyIsImNhY2hlRW50aXR5UmVmcyIsImlzRGlydHkiLCJlbnN1cmVPbkZsdXNoTWFwIiwiU3RyaW5nIiwicGFyZW50RW50aXR5IiwicHJvcCIsInJlZkVudGl0eSIsImNvbmNhdFByb3AiLCJjYWNoZU9ialJlZnMiLCJhcnJheVBhdGgiLCJhcnJheVVpZCIsIm5leHQiLCJjYWNoZVVpZE9ialJlZnMiLCJpc09uQ2FjaGUiLCJjYWNoZWRJdGVtIiwiaXRlbVVpZCIsImxpdmUiLCJ0ZW1wIiwiY3VycmVudFN0YWNrIiwiZ2V0Q2FjaGVDdXJyZW50U3RhY2siLCJmcmVlemVJdGVtIiwiZmx1c2giLCJnZXRPYmplY3QiLCJ1aWRPckVudGl0eSIsInJlYWxVaWQiLCJnZXRBY3R1YWxVaWQiLCJnZXRFZGl0YWJsZU9iamVjdCIsImV4aXN0aW5nIiwiZXhpc3RpbmdJdGVtIiwiZ2V0S2V5IiwiaW50S2V5IiwicGFyc2VJbnQiLCJkZWwiLCJzcGxpdCIsImN1cnJlbnRQYXRoIiwib2xkVmFsIiwiZGVmYXVsdFZhbHVlIiwicHJvcENoYWluIiwiQ2FjaGVJdGVtIiwibGl2ZUl0ZW0iLCJub2RlSW5kaWNlcyIsInN0cmVhbURhdGEiLCJzdGF0ZSIsInN0cmluZ2lmeU1hcCIsInN1YnN0cmluZyIsIkpTT04iLCJpdGVtUmVzdWx0IiwiQ2FjaGVSZXBvXzEiLCJDYWNoZVRocmVhZF8xIiwiQ2FjaGVJbnN0YW5jZSIsImFkZE5vZGUiLCJDYWNoZVJlcG8iLCJDYWNoZVRocmVhZCIsInVpZEFycmF5IiwiYnVpbGRFdmljdFVpZEFycmF5IiwiY3VycmVudFN0YXRlIiwic29tZSIsInRlbXBTdGF0ZSIsInBhcmVudHNDaGFuZ2VkIiwiY2xlYXJUYXJnZXRSZWZGcm9tcyIsImNsZWFyUGFyZW50UmVmVG9zIiwicHV0UGFyZW50c0NoYW5nZWQiLCJmbHVzaEFyZ3NfMSIsImNsZWFyUmVmRnJvbSIsImNsZWFyUmVmVG8iLCJwYXJlbnQiLCJyZWZQYXRocyIsImNsZWFyTmV4dCIsInJlbW92ZWROb2RlcyIsInRydW5jYXRlVGhyZWFkcyJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7O0FBQ0EsS0FBSUEsVUFBVSxtQkFBQUMsQ0FBUSxDQUFSLENBQWQ7QUFDQUMsU0FBUUMsUUFBUixHQUFtQkgsUUFBUUcsUUFBM0I7QUFDQUQsU0FBUUUsR0FBUixHQUFjSixRQUFRSSxHQUF0QjtBQUNBRixTQUFRRyxHQUFSLEdBQWNMLFFBQVFLLEdBQXRCO0FBQ0FILFNBQVFJLE9BQVIsR0FBa0JOLFFBQVFNLE9BQTFCO0FBQ0FKLFNBQVFLLEtBQVIsR0FBZ0JQLFFBQVFPLEtBQXhCO0FBQ0FMLFNBQVFNLEtBQVIsR0FBZ0JSLFFBQVFRLEtBQXhCO0FBQ0FOLFNBQVFPLEtBQVIsR0FBZ0JULFFBQVFTLEtBQXhCO0FBQ0EsRUFBQyxZQUFZO0FBQ1QsU0FBSUMsTUFBSixFQUFZO0FBQ1JBLGdCQUFPQyxHQUFQLEdBQWE7QUFDVFIsdUJBQVVILFFBQVFHLFFBRFQsRUFDbUJDLEtBQUtKLFFBQVFJLEdBRGhDLEVBQ3FDQyxLQUFLTCxRQUFRSyxHQURsRCxFQUN1REMsU0FBU04sUUFBUU0sT0FEeEUsRUFDaUZDLE9BQU9QLFFBQVFPLEtBRGhHLEVBQ3VHQyxPQUFPUixRQUFRUSxLQUR0SCxFQUM2SEMsT0FBT1QsUUFBUVM7QUFENUksVUFBYjtBQUdIO0FBQ0osRUFORCxJOzs7Ozs7QUNUQTs7QUFDQSxLQUFJRyxXQUFXLG1CQUFBWCxDQUFRLENBQVIsQ0FBZjtBQUNBLEtBQUlZLFFBQVEsbUJBQUFa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YzNCLE1BQWQsQ0FBcUIwQixXQUFyQjtBQUNIO0FBQ0osTUFMRDtBQU1ILEVBUEQsQyIsImZpbGUiOiJvbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAyMGVlY2NhNjI3YjM4MDgxNDJmOCIsIlwidXNlIHN0cmljdFwiO1xudmFyIGNhY2hlXzEgPSByZXF1aXJlKFwiLi9jYWNoZVwiKTtcbmV4cG9ydHMuZ2V0Q2FjaGUgPSBjYWNoZV8xLmdldENhY2hlO1xuZXhwb3J0cy5wdXQgPSBjYWNoZV8xLnB1dDtcbmV4cG9ydHMuZ2V0ID0gY2FjaGVfMS5nZXQ7XG5leHBvcnRzLmdldEVkaXQgPSBjYWNoZV8xLmdldEVkaXQ7XG5leHBvcnRzLmV2aWN0ID0gY2FjaGVfMS5ldmljdDtcbmV4cG9ydHMucmVzZXQgPSBjYWNoZV8xLnJlc2V0O1xuZXhwb3J0cy5wcmludCA9IGNhY2hlXzEucHJpbnQ7XG4oZnVuY3Rpb24gKCkge1xuICAgIGlmICh3aW5kb3cpIHtcbiAgICAgICAgd2luZG93Lk9uZSA9IHtcbiAgICAgICAgICAgIGdldENhY2hlOiBjYWNoZV8xLmdldENhY2hlLCBwdXQ6IGNhY2hlXzEucHV0LCBnZXQ6IGNhY2hlXzEuZ2V0LCBnZXRFZGl0OiBjYWNoZV8xLmdldEVkaXQsIGV2aWN0OiBjYWNoZV8xLmV2aWN0LCByZXNldDogY2FjaGVfMS5yZXNldCwgcHJpbnQ6IGNhY2hlXzEucHJpbnRcbiAgICAgICAgfTtcbiAgICB9XG59KSgpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vaW5kZXgudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBjb25maWdfMSA9IHJlcXVpcmUoXCIuL2NvbmZpZ1wiKTtcbnZhciBwdXRfMSA9IHJlcXVpcmUoXCIuL3B1dFwiKTtcbnZhciBwcmludF8xID0gcmVxdWlyZShcIi4vcHJpbnRcIik7XG52YXIgQ2FjaGVJbnN0YW5jZV8xID0gcmVxdWlyZShcIi4vQ2FjaGVJbnN0YW5jZVwiKTtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xudmFyIGdldF8xID0gcmVxdWlyZShcIi4vZ2V0XCIpO1xudmFyIGV2aWN0XzEgPSByZXF1aXJlKFwiLi9ldmljdFwiKTtcbnZhciBjYWNoZVRlc3QgPSBmYWxzZTtcbmZ1bmN0aW9uIHNldFRlc3RpbmcodGVzdGluZykge1xuICAgIGNhY2hlVGVzdCA9IHRlc3Rpbmc7XG59XG5leHBvcnRzLnNldFRlc3RpbmcgPSBzZXRUZXN0aW5nO1xuZnVuY3Rpb24gZ2V0Q2FjaGUoaW5zdGFuY2VOYW1lLCBjb25maWd1cmF0aW9uKSB7XG4gICAgaWYgKGluc3RhbmNlTmFtZSA9PT0gdm9pZCAwKSB7IGluc3RhbmNlTmFtZSA9IFwib25lXCI7IH1cbiAgICBpZiAoY29uZmlndXJhdGlvbiA9PT0gdm9pZCAwKSB7IGNvbmZpZ3VyYXRpb24gPSBjb25maWdfMS5kZWZhdWx0Q29uZmlnOyB9XG4gICAgaWYgKCFleHBvcnRzLmNvbmZpZyAmJiAhZXhwb3J0cy5pbnN0YW5jZXMpIHtcbiAgICAgICAgZXhwb3J0cy5jb25maWcgPSBjb25maWdfMS5jb25maWd1cmUoY29uZmlndXJhdGlvbik7XG4gICAgfVxuICAgIGlmICghZXhwb3J0cy5pbnN0YW5jZXMpIHtcbiAgICAgICAgZXhwb3J0cy5pbnN0YW5jZXMgPSB7fTtcbiAgICB9XG4gICAgaWYgKCFleHBvcnRzLmluc3RhbmNlc1tpbnN0YW5jZU5hbWVdKSB7XG4gICAgICAgIGV4cG9ydHMuaW5zdGFuY2VzW2luc3RhbmNlTmFtZV0gPSBjcmVhdGVDYWNoZShpbnN0YW5jZU5hbWUpO1xuICAgIH1cbiAgICBpZiAod2luZG93KSB7XG4gICAgICAgIGlmICh3aW5kb3dbaW5zdGFuY2VOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB3aW5kb3dbaW5zdGFuY2VOYW1lXSA9IGV4cG9ydHMuaW5zdGFuY2VzW2luc3RhbmNlTmFtZV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGV4cG9ydHMuaW5zdGFuY2VzW2luc3RhbmNlTmFtZV07XG59XG5leHBvcnRzLmdldENhY2hlID0gZ2V0Q2FjaGU7XG5leHBvcnRzLnB1dCA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgZ2V0Q2FjaGUoKS5wdXQoaXRlbSk7XG59O1xuZXhwb3J0cy5nZXQgPSBmdW5jdGlvbiAoZW50aXR5LCBub2RlSWQpIHtcbiAgICByZXR1cm4gZ2V0Q2FjaGUoKS5nZXQoZW50aXR5LCBub2RlSWQpO1xufTtcbmV4cG9ydHMuZ2V0RWRpdCA9IGZ1bmN0aW9uICh1aWRPckVudGl0eU9yQXJyYXksIG5vZGVJZCkge1xuICAgIHJldHVybiBnZXRDYWNoZSgpLmdldEVkaXQodWlkT3JFbnRpdHlPckFycmF5LCBub2RlSWQpO1xufTtcbmV4cG9ydHMuZXZpY3QgPSBmdW5jdGlvbiAodWlkT3JFbnRpdHlPckFycmF5KSB7XG4gICAgcmV0dXJuIGdldENhY2hlKCkuZXZpY3QodWlkT3JFbnRpdHlPckFycmF5KTtcbn07XG5leHBvcnRzLnByaW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBnZXRDYWNoZSgpLnByaW50KCk7XG59O1xuZXhwb3J0cy5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICBnZXRDYWNoZSgpLnJlc2V0KCk7XG59O1xuZnVuY3Rpb24gY3JlYXRlQ2FjaGUobmFtZSkge1xuICAgIHZhciBpbnN0YW5jZSA9IG5ldyBDYWNoZUluc3RhbmNlXzEuZGVmYXVsdChuYW1lKTtcbiAgICB2YXIgcmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGluc3RhbmNlLnJlc2V0KCk7XG4gICAgfTtcbiAgICB2YXIgcHV0ID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIHB1dF8xLnB1dEl0ZW0oaXRlbSwgaW5zdGFuY2UpO1xuICAgIH07XG4gICAgdmFyIGdldCA9IGZ1bmN0aW9uIChlbnRpdHksIG5vZGVJZCkge1xuICAgICAgICByZXR1cm4gZ2V0XzEuZ2V0SXRlbShlbnRpdHksIGluc3RhbmNlLCBub2RlSWQpO1xuICAgIH07XG4gICAgdmFyIGdldEVkaXQgPSBmdW5jdGlvbiAodWlkT3JFbnRpdHlPckFycmF5LCBub2RlSWQpIHtcbiAgICAgICAgcmV0dXJuIGdldF8xLmdldEVkaXRJdGVtKHVpZE9yRW50aXR5T3JBcnJheSwgaW5zdGFuY2UsIG5vZGVJZCk7XG4gICAgfTtcbiAgICB2YXIgZXZpY3QgPSBmdW5jdGlvbiAodWlkT3JFbnRpdHlPckFycmF5KSB7XG4gICAgICAgIHJldHVybiBldmljdF8xLmV2aWN0SXRlbSh1aWRPckVudGl0eU9yQXJyYXksIGluc3RhbmNlKTtcbiAgICB9O1xuICAgIHZhciBzaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdXRpbF8xLmNhY2hlU2l6ZShpbnN0YW5jZSk7XG4gICAgfTtcbiAgICB2YXIgbGVuZ3RoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdXRpbF8xLmNhY2hlTGVuZ3RoKGluc3RhbmNlKTtcbiAgICB9O1xuICAgIHZhciBwcmludCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHByaW50XzEucHJpbnRDYWNoZShpbnN0YW5jZSk7XG4gICAgfTtcbiAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICBwdXQ6IHB1dCxcbiAgICAgICAgZ2V0OiBnZXQsXG4gICAgICAgIGdldEVkaXQ6IGdldEVkaXQsXG4gICAgICAgIGV2aWN0OiBldmljdCxcbiAgICAgICAgcmVzZXQ6IHJlc2V0LFxuICAgICAgICBzaXplOiBzaXplLFxuICAgICAgICBsZW5ndGg6IGxlbmd0aCxcbiAgICAgICAgcHJpbnQ6IHByaW50LFxuICAgIH07XG4gICAgaWYgKGNhY2hlVGVzdCA9PT0gdHJ1ZSkge1xuICAgICAgICByZXN1bHQucmVmVG8gPSBmdW5jdGlvbiAodWlkKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGdldF8xLmdldENhY2hlZEl0ZW0odWlkLCBpbnN0YW5jZSk7XG4gICAgICAgICAgICByZXR1cm4gaXRlbS5tYXBUbztcbiAgICAgICAgfTtcbiAgICAgICAgcmVzdWx0LnJlZkZyb20gPSBmdW5jdGlvbiAodWlkKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGdldF8xLmdldENhY2hlZEl0ZW0odWlkLCBpbnN0YW5jZSk7XG4gICAgICAgICAgICByZXR1cm4gaXRlbS5tYXBGcm9tO1xuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vY2FjaGUudHMiLCJcInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMuZGVmYXVsdENvbmZpZyA9IHtcbiAgICB1aWROYW1lOiBcInVpZFwiLFxuICAgIG1heEhpc3RvcnlTdGF0ZXM6IDEwMDBcbn07XG5mdW5jdGlvbiBjb25maWd1cmUoY29uZikge1xuICAgIGZvciAodmFyIHAgaW4gZXhwb3J0cy5kZWZhdWx0Q29uZmlnKSB7XG4gICAgICAgIGlmIChleHBvcnRzLmRlZmF1bHRDb25maWcuaGFzT3duUHJvcGVydHkocCkgJiYgY29uZi5oYXNPd25Qcm9wZXJ0eShwKSkge1xuICAgICAgICAgICAgZXhwb3J0cy5kZWZhdWx0Q29uZmlnW3BdID0gY29uZltwXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZXhwb3J0cy5kZWZhdWx0Q29uZmlnO1xufVxuZXhwb3J0cy5jb25maWd1cmUgPSBjb25maWd1cmU7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9jb25maWcudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBDYWNoZU1hcF8xID0gcmVxdWlyZShcIi4vQ2FjaGVNYXBcIik7XG52YXIgbG9jYXRlXzEgPSByZXF1aXJlKFwiLi9sb2NhdGVcIik7XG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbnZhciByZWZfMSA9IHJlcXVpcmUoXCIuL3JlZlwiKTtcbnZhciBmbHVzaF8xID0gcmVxdWlyZShcIi4vZmx1c2hcIik7XG5leHBvcnRzLnB1dEl0ZW0gPSBmdW5jdGlvbiAoZW50aXR5LCBpbnN0YW5jZSkge1xuICAgIGlmICgodXRpbF8xLmlzQXJyYXkoZW50aXR5KSB8fCB1dGlsXzEuaXNPYmplY3QoZW50aXR5KSkpIHtcbiAgICAgICAgdmFyIGV2aWN0TWFwID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgICAgICB2YXIgZmx1c2hNYXAgPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgICAgIGZsdXNoTWFwWydfX1VQREFURURfXyddID0gZmFsc2U7XG4gICAgICAgIHZhciBmbHVzaEFyZ3MgPSB7XG4gICAgICAgICAgICBlbnRpdHk6IGVudGl0eSxcbiAgICAgICAgICAgIGZsdXNoTWFwOiBmbHVzaE1hcCxcbiAgICAgICAgICAgIGV2aWN0TWFwOiBldmljdE1hcCxcbiAgICAgICAgICAgIHBhcmVudFVpZDogbnVsbCxcbiAgICAgICAgICAgIHJlZlBhdGg6IFwiXCIsXG4gICAgICAgICAgICBpbnN0YW5jZTogaW5zdGFuY2VcbiAgICAgICAgfTtcbiAgICAgICAgZmx1c2hfMS5idWlsZEZsdXNoTWFwKGZsdXNoQXJncyk7XG4gICAgICAgIHJlZl8xLnVwZGF0ZVBvaW50ZXJzKGZsdXNoQXJncyk7XG4gICAgICAgIGlmIChmbHVzaEFyZ3MuZmx1c2hNYXAuc2l6ZSgpID4gMCAmJiBmbHVzaE1hcFsnX19VUERBVEVEX18nXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbW1pdFB1dChmbHVzaEFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBsb2NhdGVfMS5nZXRDYWxsU3RhdHMoZmFsc2UsIGluc3RhbmNlKTtcbn07XG52YXIgY29tbWl0UHV0ID0gZnVuY3Rpb24gKGZsdXNoQXJncykge1xuICAgIGZsdXNoXzEucHJlRmx1c2goZmx1c2hBcmdzKTtcbiAgICByZXR1cm4gbG9jYXRlXzEuZ2V0Q2FsbFN0YXRzKHRydWUsIGZsdXNoQXJncy5pbnN0YW5jZSk7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcHV0LnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgb2JqZWN0QXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xudmFyIENhY2hlTWFwID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDYWNoZU1hcCgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5wYXRocyA9IHt9O1xuICAgICAgICB0aGlzLmxlbmd0aCA9IDA7XG4gICAgICAgIHRoaXMuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLnBhdGhzW2tleV07XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZGVsZXRlID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBfdGhpcy5wYXRoc1trZXldICE9PSBcInVuZGVmaW5lZFwiICYmIF90aGlzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsID0gX3RoaXMucGF0aHNba2V5XTtcbiAgICAgICAgICAgICAgICBkZWxldGUgX3RoaXMucGF0aHNba2V5XTtcbiAgICAgICAgICAgICAgICBfdGhpcy5sZW5ndGgtLTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmhhcyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgX3RoaXMucGF0aHNba2V5XSAhPT0gJ3VuZGVmaW5lZCc7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZm9yRWFjaCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIF90aGlzLnBhdGhzKSB7XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLnBhdGhzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soa2V5LCBfdGhpcy5wYXRoc1trZXldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY2xvbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbmV3SW5zdGFuY2UgPSBvYmplY3RBc3NpZ24oe30sIF90aGlzLnBhdGhzKTtcbiAgICAgICAgICAgIHZhciBjbG9uZSA9IG5ldyBDYWNoZU1hcCgpO1xuICAgICAgICAgICAgY2xvbmUucGF0aHMgPSBuZXdJbnN0YW5jZTtcbiAgICAgICAgICAgIGNsb25lLmxlbmd0aCA9IF90aGlzLmxlbmd0aDtcbiAgICAgICAgICAgIHJldHVybiBjbG9uZTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgQ2FjaGVNYXAucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5wYXRoc1trZXldID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLmxlbmd0aCsrO1xuICAgICAgICAgICAgdGhpcy5wYXRoc1trZXldID0gdmFsdWU7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhdGhzW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgQ2FjaGVNYXAucHJvdG90eXBlLnNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxlbmd0aDtcbiAgICB9O1xuICAgIHJldHVybiBDYWNoZU1hcDtcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDYWNoZU1hcDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NhY2hlTWFwLnRzIiwiJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi4vfi9vYmplY3QtYXNzaWduL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlwidXNlIHN0cmljdFwiO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG5leHBvcnRzLmdldENhbGxTdGF0cyA9IGZ1bmN0aW9uIChzdWNjZXNzLCBpbnN0YW5jZSkge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICByZXN1bHQuc3VjY2VzcyA9IHN1Y2Nlc3M7XG4gICAgcmVzdWx0Lm5vZGVJZCA9IGV4cG9ydHMubm9kZShpbnN0YW5jZSk7XG4gICAgcmVzdWx0Lmxlbmd0aCA9IGxlbmd0aChpbnN0YW5jZSk7XG4gICAgcmVzdWx0Lm5hbWUgPSBpbnN0YW5jZS5uYW1lO1xuICAgIHJldHVybiByZXN1bHQ7XG59O1xuZXhwb3J0cy5ub2RlID0gZnVuY3Rpb24gKGluc3RhbmNlLCBub2RlSWQpIHtcbiAgICBpZiAodHlwZW9mIG5vZGVJZCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICB2YXIgY3VycmVudE5vZGUgPSBnZXRDdXJyZW50Tm9kZShpbnN0YW5jZSk7XG4gICAgICAgIHJldHVybiBjdXJyZW50Tm9kZSA/IGN1cnJlbnROb2RlLmlkIDogLTE7XG4gICAgfVxuICAgIGlmICghdXRpbF8xLmlzTnVtYmVyKG5vZGVJZCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlRoZSBub2RlIGlkIG11c3QgYmUgYSBudW1iZXIuXCIpO1xuICAgIH1cbiAgICB2YXIgY2FjaGVOb2RlID0gZ2V0UmVwb05vZGUobm9kZUlkLCBpbnN0YW5jZSk7XG4gICAgaWYgKCFjYWNoZU5vZGUpIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMuZ2V0Q2FsbFN0YXRzKGZhbHNlLCBpbnN0YW5jZSk7XG4gICAgfVxuICAgIGluc3RhbmNlLnRocmVhZC5jdXJyZW50ID0gYmluYXJ5SW5kZXhPZihpbnN0YW5jZS50aHJlYWQubm9kZXMsIG5vZGVJZCk7XG4gICAgcmV0dXJuIGV4cG9ydHMuZ2V0Q2FsbFN0YXRzKHRydWUsIGluc3RhbmNlKTtcbn07XG5mdW5jdGlvbiBnZXRDdXJyZW50Tm9kZShpbnN0YW5jZSkge1xuICAgIHZhciBjdXJyZW50Tm9kZUlkID0gaW5zdGFuY2UudGhyZWFkLm5vZGVzW2luc3RhbmNlLnRocmVhZC5jdXJyZW50XTtcbiAgICByZXR1cm4gY3VycmVudE5vZGVJZCA+PSAwID8gZ2V0UmVwb05vZGUoY3VycmVudE5vZGVJZCwgaW5zdGFuY2UpIDogdW5kZWZpbmVkO1xufVxuZXhwb3J0cy5nZXRDdXJyZW50Tm9kZSA9IGdldEN1cnJlbnROb2RlO1xuZnVuY3Rpb24gZ2V0UmVwb05vZGUoY2FjaGVOb2RlSWQsIGluc3RhbmNlKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLnJlcG8uZ2V0KGNhY2hlTm9kZUlkKTtcbn1cbmV4cG9ydHMuZ2V0UmVwb05vZGUgPSBnZXRSZXBvTm9kZTtcbnZhciBsZW5ndGggPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gaW5zdGFuY2UudGhyZWFkLm5vZGVzLmxlbmd0aDtcbn07XG5mdW5jdGlvbiBiaW5hcnlJbmRleE9mKGFycmF5LCBzZWFyY2hFbGVtZW50KSB7XG4gICAgdmFyIG1pbkluZGV4ID0gMDtcbiAgICB2YXIgbWF4SW5kZXggPSBhcnJheS5sZW5ndGggLSAxO1xuICAgIHZhciBjdXJyZW50SW5kZXg7XG4gICAgdmFyIGN1cnJlbnRFbGVtZW50O1xuICAgIHdoaWxlIChtaW5JbmRleCA8PSBtYXhJbmRleCkge1xuICAgICAgICBjdXJyZW50SW5kZXggPSAobWluSW5kZXggKyBtYXhJbmRleCkgLyAyIHwgMDtcbiAgICAgICAgY3VycmVudEVsZW1lbnQgPSBhcnJheVtjdXJyZW50SW5kZXhdO1xuICAgICAgICBpZiAoY3VycmVudEVsZW1lbnQgPCBzZWFyY2hFbGVtZW50KSB7XG4gICAgICAgICAgICBtaW5JbmRleCA9IGN1cnJlbnRJbmRleCArIDE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY3VycmVudEVsZW1lbnQgPiBzZWFyY2hFbGVtZW50KSB7XG4gICAgICAgICAgICBtYXhJbmRleCA9IGN1cnJlbnRJbmRleCAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gY3VycmVudEluZGV4O1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbG9jYXRlLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgY2FjaGVfMSA9IHJlcXVpcmUoXCIuL2NhY2hlXCIpO1xudmFyIENhY2hlTm9kZV8xID0gcmVxdWlyZShcIi4vQ2FjaGVOb2RlXCIpO1xudmFyIGxvY2F0ZV8xID0gcmVxdWlyZShcIi4vbG9jYXRlXCIpO1xudmFyIG9iamVjdEFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG52YXIgX2hhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbmZ1bmN0aW9uIGlzTnVtYmVyKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgfHwgdG9TdHJpbmcodmFsdWUpID09PSBcIltvYmplY3QgTnVtYmVyXVwiO1xufVxuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xuZnVuY3Rpb24gaXNTdHJpbmcob2JqKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdzdHJpbmcnIHx8IHRvU3RyaW5nKG9iaikgPT09IFwiW29iamVjdCBTdHJpbmddXCI7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5mdW5jdGlvbiBpc09iamVjdChtaXhlZF92YXIpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG1peGVkX3ZhcikgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gbWl4ZWRfdmFyICE9PSBudWxsICYmIHR5cGVvZiBtaXhlZF92YXIgPT09ICdvYmplY3QnO1xufVxuZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuZnVuY3Rpb24gaXNGdW5jdGlvbihpdGVtKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBpdGVtID09PSAnZnVuY3Rpb24nO1xufVxuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcbmZ1bmN0aW9uIGlzQXJyYXkodmFsdWUpIHtcbiAgICBpZiAoIXZhbHVlIHx8IHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpIHx8ICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnXG4gICAgICAgICYmIHR5cGVvZiB2YWx1ZS5sZW5ndGggPT09ICdudW1iZXInXG4gICAgICAgICYmIHR5cGVvZiB2YWx1ZS5zcGxpY2UgPT09ICdmdW5jdGlvbidcbiAgICAgICAgJiYgISh2YWx1ZS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgnbGVuZ3RoJykpKTtcbn1cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5mdW5jdGlvbiBvYmpUb1N0cihvKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKTtcbn1cbmZ1bmN0aW9uIGlzRGF0ZSh2YWx1ZSkge1xuICAgIHJldHVybiBpc09iamVjdCh2YWx1ZSkgJiYgb2JqVG9TdHIodmFsdWUpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcbmZ1bmN0aW9uIGlzRW1wdHkodmFsdWUpIHtcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBlbHNlIGlmICghaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIGZvciAodmFyIGkgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChfaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgaSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbmV4cG9ydHMuaXNFbXB0eSA9IGlzRW1wdHk7XG5mdW5jdGlvbiBnZXROZXdDYWNoZU5vZGUoaW5zdGFuY2UpIHtcbiAgICB2YXIgbm9kZSA9IG5ldyBDYWNoZU5vZGVfMS5DYWNoZU5vZGUoaW5zdGFuY2UubmV4dE5vZGVLZXkpO1xuICAgIG5vZGUuaWQgPSBpbnN0YW5jZS5uZXh0Tm9kZUtleTtcbiAgICBpbnN0YW5jZS5uZXh0Tm9kZUtleSArPSAxO1xuICAgIGluc3RhbmNlLnJlcG8uYWRkKG5vZGUpO1xuICAgIHJldHVybiBub2RlO1xufVxuZXhwb3J0cy5nZXROZXdDYWNoZU5vZGUgPSBnZXROZXdDYWNoZU5vZGU7XG5mdW5jdGlvbiBoYXNVaWQob2JqKSB7XG4gICAgaWYgKCFvYmopIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIWlzT2JqZWN0KG9iaikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG9ialtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciB1aWQgPSBvYmpbY2FjaGVfMS5jb25maWcudWlkTmFtZV07XG4gICAgcmV0dXJuIHVpZC5sZW5ndGggIT09IDA7XG59XG5leHBvcnRzLmhhc1VpZCA9IGhhc1VpZDtcbjtcbkZ1bmN0aW9uLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICB2YXIgU1RSSVBfQ09NTUVOVFMgPSAvKChcXC9cXC8uKiQpfChcXC9cXCpbXFxzXFxTXSo/XFwqXFwvKSkvbWc7XG4gICAgdmFyIEFSR1VNRU5UX05BTUVTID0gLyhbXlxccyxdKykvZztcbiAgICBmdW5jdGlvbiBnZXRQYXJhbU5hbWVzKGZ1bmMpIHtcbiAgICAgICAgdmFyIGZuU3RyID0gZnVuYy50b1N0cmluZygpLnJlcGxhY2UoU1RSSVBfQ09NTUVOVFMsICcnKTtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGZuU3RyLnNsaWNlKGZuU3RyLmluZGV4T2YoJygnKSArIDEsIGZuU3RyLmluZGV4T2YoJyknKSkubWF0Y2goQVJHVU1FTlRfTkFNRVMpO1xuICAgICAgICBpZiAocmVzdWx0ID09PSBudWxsKVxuICAgICAgICAgICAgcmVzdWx0ID0gW107XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIHZhciBzdHJpbmdpZnkgPSB0aGlzLnRvU3RyaW5nKCk7XG4gICAgc3RyaW5naWZ5ID0gc3RyaW5naWZ5LnJlcGxhY2UobmV3IFJlZ0V4cCgnX3RoaXMnLCAnZycpLCAndGhpcycpO1xuICAgIHZhciBib2R5ID0gc3RyaW5naWZ5Lm1hdGNoKC9mdW5jdGlvbltee10rXFx7KFtcXHNcXFNdKilcXH0kLylbMV07XG4gICAgdmFyIHBhcmFtTmFtZXMgPSBnZXRQYXJhbU5hbWVzKHRoaXMpO1xuICAgIHZhciBmdW5jID0gbmV3IEZ1bmN0aW9uKHBhcmFtTmFtZXMsIGJvZHkpO1xuICAgIHJldHVybiBmdW5jLmJpbmQodGFyZ2V0KTtcbn07XG5mdW5jdGlvbiBkZWVwQ2xvbmUob2JqLCB1aWRSZWZlcmVuY2UsIGZyZWV6ZSkge1xuICAgIGlmIChmcmVlemUgPT09IHZvaWQgMCkgeyBmcmVlemUgPSB0cnVlOyB9XG4gICAgaWYgKCFvYmpcbiAgICAgICAgfHwgKCFpc09iamVjdChvYmopXG4gICAgICAgICAgICAmJiAhaXNBcnJheShvYmopKSkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBpZiAoZnJlZXplID09PSB0cnVlXG4gICAgICAgICYmIHVpZFJlZmVyZW5jZVxuICAgICAgICAmJiAhT2JqZWN0LmlzRnJvemVuKHVpZFJlZmVyZW5jZSkpIHtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZSh1aWRSZWZlcmVuY2UpO1xuICAgIH1cbiAgICBpZiAodWlkUmVmZXJlbmNlXG4gICAgICAgICYmIGhhc1VpZChvYmopXG4gICAgICAgICYmIG9ialtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSA9PT0gdWlkUmVmZXJlbmNlW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdKSB7XG4gICAgICAgIHJldHVybiB1aWRSZWZlcmVuY2U7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKG9iaik7XG4gICAgdmFyIHJlc3VsdCA9IG9iamVjdEFzc2lnbih7fSwgb2JqKTtcbiAgICBmb3IgKHZhciBwcm9wTmFtZSBpbiBvYmopIHtcbiAgICAgICAgdmFyIHZhbHVlID0gb2JqW3Byb3BOYW1lXTtcbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbcHJvcE5hbWVdID0gZGVlcENsb25lQXJyYXkodmFsdWUsIHVpZFJlZmVyZW5jZSwgZnJlZXplKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHZhbHVlLmdldFRpbWUoKSk7XG4gICAgICAgICAgICAgICAgaWYgKGZyZWV6ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZnJlZXplKGRhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXN1bHRbcHJvcE5hbWVdID0gZGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGlmIChoYXNVaWQodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtwcm9wTmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVpZFJlZmVyZW5jZSAmJiBoYXNVaWQodWlkUmVmZXJlbmNlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlICE9PSB1aWRSZWZlcmVuY2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB2YWx1ZS51aWQgPT09IHVpZFJlZmVyZW5jZS51aWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB2YWx1ZSAhPT0gdWlkUmVmZXJlbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W3Byb3BOYW1lXSA9IHVpZFJlZmVyZW5jZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W3Byb3BOYW1lXSA9IGRlZXBDbG9uZSh2YWx1ZSwgdWlkUmVmZXJlbmNlLCBmcmVlemUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W3Byb3BOYW1lXSA9IHZhbHVlLmNsb25lKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocHJvcE5hbWUsIHJlc3VsdFtwcm9wTmFtZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W3Byb3BOYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChmcmVlemUgPT09IHRydWVcbiAgICAgICAgJiYgIU9iamVjdC5pc0Zyb3plbihyZXN1bHQpXG4gICAgICAgICYmIHR5cGVvZiByZXN1bHQgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZShyZXN1bHQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZXhwb3J0cy5kZWVwQ2xvbmUgPSBkZWVwQ2xvbmU7XG5mdW5jdGlvbiBkZWVwQ2xvbmVBcnJheShhcnIsIHVpZFJlZmVyZW5jZSwgZnJlZXplKSB7XG4gICAgcmV0dXJuIGFyci5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgaWYgKGlzQXJyYXkoaXRlbSkpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWVwQ2xvbmVBcnJheShpdGVtLCB1aWRSZWZlcmVuY2UsIGZyZWV6ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaXNPYmplY3QoaXRlbSkpIHtcbiAgICAgICAgICAgIGlmIChoYXNVaWQoaXRlbSkpIHtcbiAgICAgICAgICAgICAgICBpZiAodWlkUmVmZXJlbmNlICYmIChpdGVtW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdID09PSB1aWRSZWZlcmVuY2VbY2FjaGVfMS5jb25maWcudWlkTmFtZV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1aWRSZWZlcmVuY2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZXBDbG9uZShpdGVtLCB1aWRSZWZlcmVuY2UsIGZyZWV6ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuZXhwb3J0cy5jYWNoZVNpemUgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICB2YXIgY2FjaGVOb2RlID0gbG9jYXRlXzEuZ2V0Q3VycmVudE5vZGUoaW5zdGFuY2UpO1xuICAgIHJldHVybiBjYWNoZU5vZGUgPyBjYWNoZU5vZGUuaXRlbXMuc2l6ZSgpIDogMDtcbn07XG5leHBvcnRzLmNhY2hlTGVuZ3RoID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLnRocmVhZC5ub2Rlcy5sZW5ndGg7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vdXRpbC50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIENhY2hlTWFwXzEgPSByZXF1aXJlKFwiLi9DYWNoZU1hcFwiKTtcbnZhciBDYWNoZU5vZGUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENhY2hlTm9kZShub2RlSWQpIHtcbiAgICAgICAgdGhpcy5pdGVtcyA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5pZCA9IG5vZGVJZDtcbiAgICB9XG4gICAgcmV0dXJuIENhY2hlTm9kZTtcbn0oKSk7XG5leHBvcnRzLkNhY2hlTm9kZSA9IENhY2hlTm9kZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NhY2hlTm9kZS50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIGZsdXNoXzEgPSByZXF1aXJlKFwiLi9mbHVzaFwiKTtcbnZhciBjYWNoZV8xID0gcmVxdWlyZShcIi4vY2FjaGVcIik7XG52YXIgb3BhdGggPSByZXF1aXJlKFwiLi9wYXRoXCIpO1xudmFyIGdldF8xID0gcmVxdWlyZShcIi4vZ2V0XCIpO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG5leHBvcnRzLmFzc2lnblJlZlRvUGFyZW50ID0gZnVuY3Rpb24gKHJlZkl0ZW0sIGZsdXNoQXJncykge1xuICAgIGlmIChmbHVzaEFyZ3MucGFyZW50VWlkKSB7XG4gICAgICAgIHZhciBwYXJlbnRJdGVtID0gZmx1c2hfMS5nZXRJdGVtRmx1c2hPckNhY2hlZChmbHVzaEFyZ3MucGFyZW50VWlkLCBmbHVzaEFyZ3MpO1xuICAgICAgICBpZiAocGFyZW50SXRlbSAmJiBmbHVzaEFyZ3MucmVmUGF0aCkge1xuICAgICAgICAgICAgYXNzaWduUmVmcyhwYXJlbnRJdGVtLCByZWZJdGVtLCBmbHVzaEFyZ3MucmVmUGF0aCk7XG4gICAgICAgIH1cbiAgICB9XG59O1xudmFyIGFzc2lnblJlZnMgPSBmdW5jdGlvbiAocGFyZW50SXRlbSwgcmVmSXRlbSwgcmVmUGF0aCkge1xuICAgIHZhciBwYXJlbnRVaWQgPSBwYXJlbnRJdGVtLmVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXTtcbiAgICB2YXIgcmVmVWlkID0gcmVmSXRlbS5lbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV07XG4gICAgYWRkUmVmVG8ocGFyZW50SXRlbSwgcmVmVWlkLCByZWZQYXRoKTtcbiAgICBhZGRSZWZGcm9tKHJlZkl0ZW0sIHBhcmVudFVpZCwgcmVmUGF0aCk7XG59O1xudmFyIGFkZFJlZlRvID0gZnVuY3Rpb24gKHBhcmVudEl0ZW0sIHJlZlVpZCwgcGF0aCkge1xuICAgIGlmIChwYXJlbnRJdGVtLm1hcFRvLmhhcyhyZWZVaWQpID09PSBmYWxzZSkge1xuICAgICAgICBwYXJlbnRJdGVtLm1hcFRvLnNldChyZWZVaWQsIFtdKTtcbiAgICB9XG4gICAgdmFyIHJlZkFycmF5ID0gcGFyZW50SXRlbS5tYXBUby5nZXQocmVmVWlkKTtcbiAgICBpZiAocmVmQXJyYXkuaW5kZXhPZihwYXRoKSA8IDApIHtcbiAgICAgICAgcmVmQXJyYXkucHVzaChwYXRoKTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcmVudEl0ZW07XG59O1xudmFyIGFkZFJlZkZyb20gPSBmdW5jdGlvbiAocmVmSXRlbSwgcGFyZW50VWlkLCBwYXRoKSB7XG4gICAgaWYgKHJlZkl0ZW0ubWFwRnJvbS5oYXMocGFyZW50VWlkKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmVmSXRlbS5tYXBGcm9tLnNldChwYXJlbnRVaWQsIFtdKTtcbiAgICB9XG4gICAgdmFyIGZyb21BcnJheSA9IHJlZkl0ZW0ubWFwRnJvbS5nZXQocGFyZW50VWlkKTtcbiAgICBpZiAoZnJvbUFycmF5LmluZGV4T2YocGF0aCkgPCAwKSB7XG4gICAgICAgIGZyb21BcnJheS5wdXNoKHBhdGgpO1xuICAgIH1cbiAgICByZXR1cm4gcmVmSXRlbTtcbn07XG5leHBvcnRzLnVwZGF0ZVBvaW50ZXJzID0gZnVuY3Rpb24gKGZsdXNoQXJncykge1xuICAgIGZsdXNoQXJncy5mbHVzaE1hcC5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIGl0ZW0pIHtcbiAgICAgICAgdXBkYXRlSXRlbVJlZlRvcyhpdGVtLCBmbHVzaEFyZ3MpO1xuICAgICAgICBleHBvcnRzLnVwZGF0ZVJlZkZyb21zKGl0ZW0sIGZsdXNoQXJncyk7XG4gICAgfSk7XG59O1xuZXhwb3J0cy51cGRhdGVSZWZGcm9tcyA9IGZ1bmN0aW9uIChpdGVtLCBmbHVzaEFyZ3MpIHtcbiAgICBpdGVtLm1hcEZyb20uZm9yRWFjaChmdW5jdGlvbiAocGFyZW50VWlkLCBwYXRocykge1xuICAgICAgICB2YXIgcGFyZW50SXRlbSA9IGZsdXNoQXJncy5mbHVzaE1hcC5nZXQocGFyZW50VWlkKTtcbiAgICAgICAgaWYgKCFwYXJlbnRJdGVtKSB7XG4gICAgICAgICAgICBwYXJlbnRJdGVtID0gZ2V0XzEuZ2V0Q2FjaGVkSXRlbShwYXJlbnRVaWQsIGZsdXNoQXJncy5pbnN0YW5jZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmVudEl0ZW0gJiYgcGF0aHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdmFyIGZpcnN0UGF0aCA9IHBhdGhzWzBdO1xuICAgICAgICAgICAgdmFyIHRhcmdldFJlZiA9IG9wYXRoLmdldChwYXJlbnRJdGVtLmVudGl0eSwgZmlyc3RQYXRoKTtcbiAgICAgICAgICAgIHZhciBkaXJ0eSA9ICh0YXJnZXRSZWYgJiYgdGFyZ2V0UmVmICE9PSBpdGVtLmVudGl0eSk7XG4gICAgICAgICAgICBpZiAoZGlydHkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IHtcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5OiBwYXJlbnRJdGVtLmVudGl0eSxcbiAgICAgICAgICAgICAgICAgICAgZmx1c2hNYXA6IGZsdXNoQXJncy5mbHVzaE1hcCxcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2U6IGZsdXNoQXJncy5pbnN0YW5jZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcGFyZW50SXRlbSA9IGZsdXNoXzEuZW5zdXJlSXRlbShhcmdzKTtcbiAgICAgICAgICAgICAgICBwYXJlbnRJdGVtLmVudGl0eSA9IHV0aWxfMS5kZWVwQ2xvbmUocGFyZW50SXRlbS5lbnRpdHksIGl0ZW0uZW50aXR5LCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufTtcbmV4cG9ydHMudXBkYXRlUmVmVG9zID0gZnVuY3Rpb24gKGVudGl0eVVpZCwgZmx1c2hBcmdzKSB7XG4gICAgdmFyIGl0ZW0gPSBmbHVzaF8xLmdldEl0ZW1GbHVzaE9yQ2FjaGVkKGVudGl0eVVpZCwgZmx1c2hBcmdzKTtcbiAgICB1cGRhdGVJdGVtUmVmVG9zKGl0ZW0sIGZsdXNoQXJncyk7XG59O1xudmFyIHVwZGF0ZUl0ZW1SZWZUb3MgPSBmdW5jdGlvbiAoaXRlbSwgZmx1c2hBcmdzKSB7XG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgaXRlbS5tYXBUby5mb3JFYWNoKGZ1bmN0aW9uICh0b1VpZCwgcGF0aHMpIHtcbiAgICAgICAgICAgIHZhciB1cGRhdGVkUGF0aHMgPSBwYXRocy5tYXAoZnVuY3Rpb24gKHBhdGgpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVmZXJlbmNlID0gb3BhdGguZ2V0KGl0ZW0uZW50aXR5LCBwYXRoKTtcbiAgICAgICAgICAgICAgICBpZiAocmVmZXJlbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YXJnZXRVaWQgPSByZWZlcmVuY2VbY2FjaGVfMS5jb25maWcudWlkTmFtZV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRVaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmb3VuZCA9IHRhcmdldFVpZCA9PSB0b1VpZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmb3VuZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlbW92ZVJlZkZyb21fVmFsdWUoaXRlbS5lbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV0sIHRvVWlkLCBmbHVzaEFyZ3MpO1xuICAgICAgICAgICAgfSkuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0gIT09IG51bGwgJiYgaXRlbSAhPT0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAodXBkYXRlZFBhdGhzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBpdGVtLm1hcFRvLnNldCh0b1VpZCwgdXBkYXRlZFBhdGhzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGl0ZW0ubWFwVG8uZGVsZXRlKHRvVWlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcbnZhciByZW1vdmVSZWZGcm9tX1ZhbHVlID0gZnVuY3Rpb24gKHBhcmVudFVpZCwgcmVmVWlkLCBmbHVzaEFyZ3MpIHtcbiAgICB2YXIgcmVmSXRlbSA9IGZsdXNoXzEuZ2V0SXRlbUZsdXNoT3JDYWNoZWQocmVmVWlkLCBmbHVzaEFyZ3MpO1xuICAgIGlmIChyZWZJdGVtKSB7XG4gICAgICAgIHJlZkl0ZW0gPSByZWZJdGVtLmNsb25lKCk7XG4gICAgICAgIGlmIChyZWZJdGVtLm1hcEZyb20uaGFzKHBhcmVudFVpZCkpIHtcbiAgICAgICAgICAgIHJlbW92ZVJlZkZyb20ocmVmSXRlbSwgcGFyZW50VWlkLCBmbHVzaEFyZ3MucmVmUGF0aCk7XG4gICAgICAgICAgICBpZiAocmVmSXRlbS5tYXBGcm9tLnNpemUoKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGZsdXNoQXJncy5ldmljdE1hcC5zZXQocmVmVWlkLCByZWZJdGVtKTtcbiAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZmx1c2hNYXAuZGVsZXRlKHJlZlVpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZmx1c2hNYXAuc2V0KHJlZlVpZCwgcmVmSXRlbSk7XG4gICAgICAgICAgICAgICAgZmx1c2hBcmdzLmV2aWN0TWFwLmRlbGV0ZShyZWZVaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcbnZhciByZW1vdmVSZWZGcm9tID0gZnVuY3Rpb24gKGl0ZW0sIHBhcmVudFVpZCwgcGF0aCkge1xuICAgIHZhciByZWZzQXJyYXkgPSBpdGVtLm1hcEZyb20uZ2V0KHBhcmVudFVpZCk7XG4gICAgdmFyIGluZGV4ID0gcmVmc0FycmF5LmluZGV4T2YocGF0aCk7XG4gICAgcmVmc0FycmF5ID0gcmVmc0FycmF5LnNsaWNlKCk7XG4gICAgcmVmc0FycmF5LnNwbGljZShpbmRleCwgMSk7XG4gICAgaXRlbS5tYXBGcm9tLnNldChwYXJlbnRVaWQsIHJlZnNBcnJheSk7XG4gICAgaWYgKHJlZnNBcnJheS5sZW5ndGggPT0gMCkge1xuICAgICAgICBpdGVtLm1hcEZyb20uZGVsZXRlKHBhcmVudFVpZCk7XG4gICAgfVxufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3JlZi50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIGdldF8xID0gcmVxdWlyZShcIi4vZ2V0XCIpO1xudmFyIGNhY2hlXzEgPSByZXF1aXJlKFwiLi9jYWNoZVwiKTtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xudmFyIHBhdGhfMSA9IHJlcXVpcmUoXCIuL3BhdGhcIik7XG52YXIgQ2FjaGVJdGVtXzEgPSByZXF1aXJlKFwiLi9DYWNoZUl0ZW1cIik7XG52YXIgQ2FjaGVNYXBfMSA9IHJlcXVpcmUoXCIuL0NhY2hlTWFwXCIpO1xudmFyIHJlZl8xID0gcmVxdWlyZShcIi4vcmVmXCIpO1xuZXhwb3J0cy5idWlsZEZsdXNoTWFwID0gZnVuY3Rpb24gKGZsdXNoQXJncykge1xuICAgIGlmICh1dGlsXzEuaGFzVWlkKGZsdXNoQXJncy5lbnRpdHkpKSB7XG4gICAgICAgIGJ1aWxkRW50aXR5Rmx1c2hNYXAoZmx1c2hBcmdzKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmICh1dGlsXzEuaXNBcnJheShmbHVzaEFyZ3MuZW50aXR5KSkge1xuICAgICAgICAgICAgY2FjaGVBcnJSZWZzKGZsdXNoQXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjYWNoZUVudGl0eVJlZnMoZmx1c2hBcmdzKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG52YXIgYnVpbGRFbnRpdHlGbHVzaE1hcCA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICBmbHVzaEFyZ3MucmVmUGF0aCA9IFwiXCI7XG4gICAgaWYgKGlzRGlydHkoZmx1c2hBcmdzKSA9PT0gdHJ1ZSkge1xuICAgICAgICBlbnN1cmVPbkZsdXNoTWFwKGZsdXNoQXJncyk7XG4gICAgICAgIGNhY2hlRW50aXR5UmVmcyhmbHVzaEFyZ3MpO1xuICAgICAgICByZWZfMS51cGRhdGVSZWZUb3MoU3RyaW5nKGZsdXNoQXJncy5lbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV0pLCBmbHVzaEFyZ3MpO1xuICAgIH1cbn07XG52YXIgZW5zdXJlT25GbHVzaE1hcCA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICB2YXIgZW50aXR5VWlkID0gU3RyaW5nKGZsdXNoQXJncy5lbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV0pO1xuICAgIGlmIChmbHVzaEFyZ3MuZmx1c2hNYXAuaGFzKGVudGl0eVVpZCkgPT09IGZhbHNlKSB7XG4gICAgICAgIGV4cG9ydHMuZW5zdXJlSXRlbShmbHVzaEFyZ3MpO1xuICAgICAgICBmbHVzaEFyZ3MucGFyZW50VWlkID0gU3RyaW5nKGVudGl0eVVpZCk7XG4gICAgfVxufTtcbnZhciBjYWNoZUVudGl0eVJlZnMgPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgdmFyIHBhcmVudEVudGl0eSA9IGZsdXNoQXJncy5lbnRpdHk7XG4gICAgZm9yICh2YXIgcHJvcCBpbiBwYXJlbnRFbnRpdHkpIHtcbiAgICAgICAgaWYgKHBhcmVudEVudGl0eS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgdmFyIHJlZkVudGl0eSA9IHBhcmVudEVudGl0eVtwcm9wXTtcbiAgICAgICAgICAgIGlmICh1dGlsXzEuaXNPYmplY3QocmVmRW50aXR5KSB8fCB1dGlsXzEuaXNBcnJheShyZWZFbnRpdHkpKSB7XG4gICAgICAgICAgICAgICAgZmx1c2hBcmdzLmVudGl0eSA9IHJlZkVudGl0eTtcbiAgICAgICAgICAgICAgICBpZiAocGFyZW50RW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgIGZsdXNoQXJncy5wYXJlbnRVaWQgPSBwYXJlbnRFbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChmbHVzaEFyZ3MucGFyZW50VWlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZsdXNoQXJncy5yZWZQYXRoID0gcGF0aF8xLmNvbmNhdFByb3AoZmx1c2hBcmdzLnJlZlBhdGgsIHByb3ApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWZsdXNoQXJncy5yZWZQYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgIGZsdXNoQXJncy5yZWZQYXRoID0gcHJvcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodXRpbF8xLmlzQXJyYXkocmVmRW50aXR5KSkge1xuICAgICAgICAgICAgICAgIGNhY2hlQXJyUmVmcyhmbHVzaEFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodXRpbF8xLmlzT2JqZWN0KHJlZkVudGl0eSkpIHtcbiAgICAgICAgICAgICAgICBjYWNoZU9ialJlZnMoZmx1c2hBcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIE9iamVjdC5mcmVlemUocmVmRW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cbn07XG52YXIgY2FjaGVBcnJSZWZzID0gZnVuY3Rpb24gKGZsdXNoQXJncykge1xuICAgIHZhciBlbnRpdHkgPSBmbHVzaEFyZ3MuZW50aXR5O1xuICAgIHZhciBhcnJheVBhdGggPSBmbHVzaEFyZ3MucmVmUGF0aDtcbiAgICB2YXIgYXJyYXlVaWQ7XG4gICAgaWYgKCFhcnJheVVpZCkge1xuICAgICAgICBhcnJheVVpZCA9IGZsdXNoQXJncy5wYXJlbnRVaWQ7XG4gICAgfVxuICAgIGVudGl0eS5mb3JFYWNoKGZ1bmN0aW9uIChuZXh0LCBpbmRleCkge1xuICAgICAgICBmbHVzaEFyZ3MuZW50aXR5ID0gbmV4dDtcbiAgICAgICAgZmx1c2hBcmdzLnBhcmVudFVpZCA9IGFycmF5VWlkO1xuICAgICAgICBpZiAoZmx1c2hBcmdzLnJlZlBhdGggfHwgYXJyYXlQYXRoKSB7XG4gICAgICAgICAgICBmbHVzaEFyZ3MucmVmUGF0aCA9IGFycmF5UGF0aCArIFwiLlwiICsgaW5kZXg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHV0aWxfMS5pc0FycmF5KG5leHQpKSB7XG4gICAgICAgICAgICBjYWNoZUFyclJlZnMoZmx1c2hBcmdzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh1dGlsXzEuaXNPYmplY3QobmV4dCkpIHtcbiAgICAgICAgICAgIGNhY2hlT2JqUmVmcyhmbHVzaEFyZ3MpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgT2JqZWN0LmZyZWV6ZShlbnRpdHkpO1xufTtcbnZhciBjYWNoZU9ialJlZnMgPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgaWYgKHV0aWxfMS5oYXNVaWQoZmx1c2hBcmdzLmVudGl0eSkpIHtcbiAgICAgICAgY2FjaGVVaWRPYmpSZWZzKGZsdXNoQXJncyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjYWNoZUVudGl0eVJlZnMoZmx1c2hBcmdzKTtcbiAgICB9XG59O1xudmFyIGNhY2hlVWlkT2JqUmVmcyA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICB2YXIgcmVmSXRlbSA9IGV4cG9ydHMuZW5zdXJlSXRlbShmbHVzaEFyZ3MpO1xuICAgIHJlZl8xLmFzc2lnblJlZlRvUGFyZW50KHJlZkl0ZW0sIGZsdXNoQXJncyk7XG4gICAgaWYgKGdldF8xLmlzT25DYWNoZShmbHVzaEFyZ3MpID09PSB0cnVlKVxuICAgICAgICByZXR1cm47XG4gICAgZXhwb3J0cy5idWlsZEZsdXNoTWFwKGZsdXNoQXJncyk7XG59O1xudmFyIGlzRGlydHkgPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgdmFyIGNhY2hlZEl0ZW0gPSBnZXRfMS5nZXRDYWNoZWRJdGVtKGZsdXNoQXJncy5lbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV0sIGZsdXNoQXJncy5pbnN0YW5jZSk7XG4gICAgcmV0dXJuICFjYWNoZWRJdGVtIHx8IGNhY2hlZEl0ZW0uZW50aXR5ICE9PSBmbHVzaEFyZ3MuZW50aXR5O1xufTtcbmV4cG9ydHMuZ2V0SXRlbUZsdXNoT3JDYWNoZWQgPSBmdW5jdGlvbiAodWlkLCBmbHVzaEFyZ3MpIHtcbiAgICBpZiAodWlkKSB7XG4gICAgICAgIHVpZCA9IFN0cmluZyh1aWQpO1xuICAgICAgICB2YXIgaXRlbSA9IGZsdXNoQXJncy5mbHVzaE1hcC5nZXQodWlkKTtcbiAgICAgICAgaWYgKCFpdGVtKSB7XG4gICAgICAgICAgICBpdGVtID0gZ2V0XzEuZ2V0Q2FjaGVkSXRlbSh1aWQsIGZsdXNoQXJncy5pbnN0YW5jZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0gJiYgT2JqZWN0LmlzRnJvemVuKGl0ZW0pKSB7XG4gICAgICAgICAgICBpdGVtID0gaXRlbS5jbG9uZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cbn07XG5leHBvcnRzLmVuc3VyZUl0ZW0gPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgdmFyIGl0ZW1VaWQgPSBTdHJpbmcoZmx1c2hBcmdzLmVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSk7XG4gICAgdmFyIGl0ZW0gPSBmbHVzaEFyZ3MuZmx1c2hNYXAuZ2V0KGl0ZW1VaWQpO1xuICAgIGlmIChpdGVtKSB7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cbiAgICB2YXIgbGl2ZSA9IGdldF8xLmdldENhY2hlZEl0ZW0oaXRlbVVpZCwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICBpdGVtID0gbmV3IENhY2hlSXRlbV8xLmRlZmF1bHQoZmx1c2hBcmdzLmVudGl0eSwgbGl2ZSk7XG4gICAgZmx1c2hBcmdzLmZsdXNoTWFwLnNldChpdGVtVWlkLCBpdGVtKTtcbiAgICBmbHVzaEFyZ3MuZmx1c2hNYXBbJ19fVVBEQVRFRF9fJ10gPSB0cnVlO1xuICAgIHJldHVybiBpdGVtO1xufTtcbmV4cG9ydHMucHJlRmx1c2ggPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgdmFyIHRlbXAgPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgdmFyIGN1cnJlbnRTdGFjayA9IGdldF8xLmdldENhY2hlQ3VycmVudFN0YWNrKGZsdXNoQXJncy5pbnN0YW5jZSk7XG4gICAgaWYgKGN1cnJlbnRTdGFjaykge1xuICAgICAgICBjdXJyZW50U3RhY2suZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgICAgICB0ZW1wLnNldChrZXksIGl0ZW0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZmx1c2hBcmdzLmZsdXNoTWFwLmZvckVhY2goZnVuY3Rpb24gKGtleSwgaXRlbSkge1xuICAgICAgICB2YXIgaXRlbVVpZCA9IGl0ZW0uZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgICAgICBmcmVlemVJdGVtKGl0ZW0pO1xuICAgICAgICB0ZW1wLnNldChTdHJpbmcoaXRlbVVpZCksIGl0ZW0pO1xuICAgIH0pO1xuICAgIGlmIChmbHVzaEFyZ3MuZXZpY3RNYXAuc2l6ZSgpID4gMCkge1xuICAgICAgICBmbHVzaEFyZ3MuZXZpY3RNYXAuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgdGVtcC5kZWxldGUoU3RyaW5nKGtleSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZXhwb3J0cy5mbHVzaCh0ZW1wLCBmbHVzaEFyZ3MuaW5zdGFuY2UpO1xufTtcbnZhciBmcmVlemVJdGVtID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICBPYmplY3QuZnJlZXplKGl0ZW0pO1xuICAgIE9iamVjdC5mcmVlemUoaXRlbS5lbnRpdHkpO1xuICAgIE9iamVjdC5mcmVlemUoaXRlbS5tYXBUbyk7XG4gICAgT2JqZWN0LmZyZWV6ZShpdGVtLm1hcEZyb20pO1xufTtcbmV4cG9ydHMuZmx1c2ggPSBmdW5jdGlvbiAodGVtcCwgaW5zdGFuY2UpIHtcbiAgICBpZiAodGVtcCAhPT0gbnVsbCkge1xuICAgICAgICBPYmplY3QuZnJlZXplKHRlbXApO1xuICAgICAgICB2YXIgY2FjaGVOb2RlID0gdXRpbF8xLmdldE5ld0NhY2hlTm9kZShpbnN0YW5jZSk7XG4gICAgICAgIGNhY2hlTm9kZS5pdGVtcyA9IHRlbXA7XG4gICAgICAgIGlmIChpbnN0YW5jZS50aHJlYWQubm9kZXMuaW5kZXhPZihjYWNoZU5vZGUuaWQpIDwgMCkge1xuICAgICAgICAgICAgaW5zdGFuY2UudGhyZWFkLm5vZGVzLnB1c2goY2FjaGVOb2RlLmlkKTtcbiAgICAgICAgICAgIGluc3RhbmNlLnRocmVhZC5jdXJyZW50ICs9IDE7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZmx1c2gudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBjYWNoZV8xID0gcmVxdWlyZShcIi4vY2FjaGVcIik7XG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbmV4cG9ydHMuZ2V0SXRlbSA9IGZ1bmN0aW9uIChlbnRpdHksIGluc3RhbmNlLCBub2RlSWQpIHtcbiAgICBpZiAoIWVudGl0eSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT25lIGdldCgpOiByZXF1aXJlcyBhIHVpZCB0byByZXRyaWV2ZSBhbiBpdGVtIGZyb20gdGhlIGNhY2hlLlwiKTtcbiAgICB9XG4gICAgaWYgKHV0aWxfMS5pc0FycmF5KGVudGl0eSkpIHtcbiAgICAgICAgcmV0dXJuIGVudGl0eS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRPYmplY3QoaXRlbSwgaW5zdGFuY2UpO1xuICAgICAgICB9KS5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtICE9PSBudWxsICYmIGl0ZW0gIT09IHVuZGVmaW5lZDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBnZXRPYmplY3QoZW50aXR5LCBpbnN0YW5jZSk7XG59O1xudmFyIGdldE9iamVjdCA9IGZ1bmN0aW9uICh1aWRPckVudGl0eSwgaW5zdGFuY2UpIHtcbiAgICB2YXIgcmVhbFVpZCA9IGdldEFjdHVhbFVpZCh1aWRPckVudGl0eSk7XG4gICAgaWYgKCFyZWFsVWlkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGl0ZW0gPSBleHBvcnRzLmdldENhY2hlZEl0ZW0ocmVhbFVpZCwgaW5zdGFuY2UpO1xuICAgIHJldHVybiBpdGVtID8gaXRlbS5lbnRpdHkgOiB1bmRlZmluZWQ7XG59O1xuZXhwb3J0cy5nZXRFZGl0SXRlbSA9IGZ1bmN0aW9uIChvYmosIGluc3RhbmNlLCBub2RlSWQpIHtcbiAgICBpZiAodXRpbF8xLmlzQXJyYXkob2JqKSkge1xuICAgICAgICByZXR1cm4gb2JqLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIGdldEVkaXRhYmxlT2JqZWN0KGl0ZW0sIGluc3RhbmNlKTtcbiAgICAgICAgfSkuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbSAhPT0gbnVsbCAmJiBpdGVtICE9PSB1bmRlZmluZWQ7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZ2V0RWRpdGFibGVPYmplY3Qob2JqLCBpbnN0YW5jZSk7XG59O1xudmFyIGdldEVkaXRhYmxlT2JqZWN0ID0gZnVuY3Rpb24gKHVpZE9yRW50aXR5LCBpbnN0YW5jZSkge1xuICAgIHZhciByZWFsVWlkID0gZ2V0QWN0dWFsVWlkKHVpZE9yRW50aXR5KTtcbiAgICB2YXIgZXhpc3RpbmcgPSBleHBvcnRzLmdldEl0ZW0ocmVhbFVpZCwgaW5zdGFuY2UpO1xuICAgIHZhciBjbG9uZSA9IHV0aWxfMS5kZWVwQ2xvbmUoZXhpc3RpbmcsIHVuZGVmaW5lZCwgZmFsc2UpO1xuICAgIGNvbnNvbGUubG9nKGNsb25lKTtcbiAgICByZXR1cm4gZXhpc3RpbmcgPyB1dGlsXzEuZGVlcENsb25lKGV4aXN0aW5nLCB1bmRlZmluZWQsIGZhbHNlKSA6IHVuZGVmaW5lZDtcbn07XG52YXIgZ2V0QWN0dWFsVWlkID0gZnVuY3Rpb24gKHVpZE9yRW50aXR5KSB7XG4gICAgaWYgKHR5cGVvZiB1aWRPckVudGl0eSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICByZXR1cm4gdWlkT3JFbnRpdHk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiB1aWRPckVudGl0eSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICByZXR1cm4gU3RyaW5nKHVpZE9yRW50aXR5KTtcbiAgICB9XG4gICAgZWxzZSBpZiAodXRpbF8xLmlzT2JqZWN0KHVpZE9yRW50aXR5KSkge1xuICAgICAgICBpZiAodXRpbF8xLmhhc1VpZCh1aWRPckVudGl0eSkpIHtcbiAgICAgICAgICAgIHJldHVybiB1aWRPckVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5leHBvcnRzLmlzT25DYWNoZSA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICB2YXIgdWlkID0gZmx1c2hBcmdzLmVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXTtcbiAgICB2YXIgZXhpc3RpbmdJdGVtID0gZXhwb3J0cy5nZXRDYWNoZWRJdGVtKHVpZCwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICByZXR1cm4gZXhpc3RpbmdJdGVtICYmIGV4aXN0aW5nSXRlbS5lbnRpdHkgPT09IGZsdXNoQXJncy5lbnRpdHk7XG59O1xuZXhwb3J0cy5nZXRDYWNoZWRJdGVtID0gZnVuY3Rpb24gKHVpZCwgaW5zdGFuY2UpIHtcbiAgICB2YXIgY3VycmVudE5vZGUgPSBnZXRDdXJyZW50Tm9kZShpbnN0YW5jZSk7XG4gICAgcmV0dXJuIGN1cnJlbnROb2RlID8gY3VycmVudE5vZGUuaXRlbXMuZ2V0KFN0cmluZyh1aWQpKSA6IHVuZGVmaW5lZDtcbn07XG5mdW5jdGlvbiBnZXRDdXJyZW50Tm9kZShpbnN0YW5jZSkge1xuICAgIHZhciBjdXJyZW50Tm9kZUlkID0gaW5zdGFuY2UudGhyZWFkLm5vZGVzW2luc3RhbmNlLnRocmVhZC5jdXJyZW50XTtcbiAgICByZXR1cm4gY3VycmVudE5vZGVJZCA+PSAwID8gZ2V0UmVwb05vZGUoY3VycmVudE5vZGVJZCwgaW5zdGFuY2UucmVwbykgOiB1bmRlZmluZWQ7XG59XG5mdW5jdGlvbiBnZXRSZXBvTm9kZShub2RlSWQsIHJlcG8pIHtcbiAgICByZXR1cm4gcmVwby5nZXQobm9kZUlkKTtcbn1cbmV4cG9ydHMuZ2V0Q2FjaGVDdXJyZW50U3RhY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICB2YXIgY3VycmVudE5vZGUgPSBnZXRDdXJyZW50Tm9kZShpbnN0YW5jZSk7XG4gICAgcmV0dXJuIGN1cnJlbnROb2RlID8gY3VycmVudE5vZGUuaXRlbXMgOiB1bmRlZmluZWQ7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZ2V0LnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbmZ1bmN0aW9uIGdldEtleShrZXkpIHtcbiAgICB2YXIgaW50S2V5ID0gcGFyc2VJbnQoa2V5KTtcbiAgICBpZiAoaW50S2V5LnRvU3RyaW5nKCkgPT09IGtleSkge1xuICAgICAgICByZXR1cm4gaW50S2V5O1xuICAgIH1cbiAgICByZXR1cm4ga2V5O1xufVxuZnVuY3Rpb24gZGVsKG9iaiwgcGF0aCkge1xuICAgIGlmICh1dGlsXzEuaXNOdW1iZXIocGF0aCkpIHtcbiAgICAgICAgcGF0aCA9IFtwYXRoXTtcbiAgICB9XG4gICAgaWYgKHV0aWxfMS5pc0VtcHR5KG9iaikpIHtcbiAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG4gICAgaWYgKHV0aWxfMS5pc0VtcHR5KHBhdGgpKSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICAgIGlmICh1dGlsXzEuaXNTdHJpbmcocGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIGRlbChvYmosIHBhdGguc3BsaXQoJy4nKSk7XG4gICAgfVxuICAgIHZhciBjdXJyZW50UGF0aCA9IGdldEtleShwYXRoWzBdKTtcbiAgICB2YXIgb2xkVmFsID0gb2JqW2N1cnJlbnRQYXRoXTtcbiAgICBpZiAocGF0aC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgaWYgKG9sZFZhbCAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgICBpZiAodXRpbF8xLmlzQXJyYXkob2JqKSkge1xuICAgICAgICAgICAgICAgIG9iai5zcGxpY2UoY3VycmVudFBhdGgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIG9ialtjdXJyZW50UGF0aF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmIChvYmpbY3VycmVudFBhdGhdICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgIHJldHVybiBkZWwob2JqW2N1cnJlbnRQYXRoXSwgcGF0aC5zbGljZSgxKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbn1cbmV4cG9ydHMuZGVsID0gZGVsO1xuZnVuY3Rpb24gZ2V0KG9iaiwgcGF0aCwgZGVmYXVsdFZhbHVlKSB7XG4gICAgaWYgKHV0aWxfMS5pc051bWJlcihwYXRoKSkge1xuICAgICAgICBwYXRoID0gW3BhdGhdO1xuICAgIH1cbiAgICBpZiAodXRpbF8xLmlzRW1wdHkocGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgaWYgKHV0aWxfMS5pc0VtcHR5KG9iaikpIHtcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgICB9XG4gICAgaWYgKHV0aWxfMS5pc1N0cmluZyhwYXRoKSkge1xuICAgICAgICByZXR1cm4gZ2V0KG9iaiwgcGF0aC5zcGxpdCgnLicpLCBkZWZhdWx0VmFsdWUpO1xuICAgIH1cbiAgICB2YXIgY3VycmVudFBhdGggPSBnZXRLZXkocGF0aFswXSk7XG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGlmIChvYmpbY3VycmVudFBhdGhdID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9ialtjdXJyZW50UGF0aF07XG4gICAgfVxuICAgIHJldHVybiBnZXQob2JqW2N1cnJlbnRQYXRoXSwgcGF0aC5zbGljZSgxKSwgZGVmYXVsdFZhbHVlKTtcbn1cbmV4cG9ydHMuZ2V0ID0gZ2V0O1xuZXhwb3J0cy5jb25jYXRQcm9wID0gZnVuY3Rpb24gKHByb3BDaGFpbiwgcHJvcCkge1xuICAgIGlmIChwcm9wQ2hhaW4gPT09IFwiXCIpIHtcbiAgICAgICAgcHJvcENoYWluID0gcHJvcDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHByb3BDaGFpbiA9IHByb3BDaGFpbiArIFwiLlwiICsgcHJvcDtcbiAgICB9XG4gICAgcmV0dXJuIHByb3BDaGFpbjtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wYXRoLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQ2FjaGVNYXBfMSA9IHJlcXVpcmUoXCIuL0NhY2hlTWFwXCIpO1xudmFyIENhY2hlSXRlbSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2FjaGVJdGVtKGVudGl0eSwgbGl2ZUl0ZW0pIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ2FjaGVJdGVtKF90aGlzLmVudGl0eSwgX3RoaXMpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmVudGl0eSA9IGVudGl0eTtcbiAgICAgICAgaWYgKGxpdmVJdGVtKSB7XG4gICAgICAgICAgICB0aGlzLm1hcEZyb20gPSBsaXZlSXRlbS5tYXBGcm9tLmNsb25lKCk7XG4gICAgICAgICAgICB0aGlzLm1hcFRvID0gbGl2ZUl0ZW0ubWFwVG8uY2xvbmUoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubWFwRnJvbSA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMubWFwVG8gPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIENhY2hlSXRlbTtcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDYWNoZUl0ZW07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DYWNoZUl0ZW0udHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBjYWNoZV8xID0gcmVxdWlyZShcIi4vY2FjaGVcIik7XG5leHBvcnRzLnByaW50Q2FjaGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICB2YXIgcmVzdWx0ID0gXCJcIjtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBjdXJyZW50ID0gaW5zdGFuY2UudGhyZWFkLmN1cnJlbnQ7XG4gICAgdmFyIG5vZGVJbmRpY2VzID0gaW5zdGFuY2UudGhyZWFkLm5vZGVzO1xuICAgIG5vZGVJbmRpY2VzLm1hcChmdW5jdGlvbiAoY2FjaGVOb2RlSWQpIHtcbiAgICAgICAgdmFyIGNhY2hlTm9kZSA9IGluc3RhbmNlLnJlcG8uZ2V0KGNhY2hlTm9kZUlkKTtcbiAgICAgICAgdmFyIHN0cmVhbURhdGEgPSBcIlwiO1xuICAgICAgICB2YXIgc3RhdGUgPSBpbmRleCArIFwiOlwiICsgc3RyZWFtRGF0YSArIFwiW1wiICsgc3RyaW5naWZ5TWFwKGNhY2hlTm9kZS5pdGVtcykgKyBcIl1cXG5cXG5cIjtcbiAgICAgICAgaWYgKGluZGV4ID09PSBjdXJyZW50KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IFwiLT4gXCIgKyBzdGF0ZTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgKz0gc3RhdGU7XG4gICAgICAgIGluZGV4Kys7XG4gICAgfSk7XG4gICAgcmVzdWx0ID0gcmVzdWx0LnN1YnN0cmluZygwLCAocmVzdWx0Lmxlbmd0aCAtIDIpKTtcbiAgICBpbmRleCA9IDA7XG4gICAgcmV0dXJuIFwiXFxuLS0tLS0tIE9uZSAtLS0tLS0tXCJcbiAgICAgICAgKyBcIlxcblNUQUNLOlxcblwiICsgcmVzdWx0XG4gICAgICAgICsgXCJcXG5cXG5DT05GSUc6XCIgKyBKU09OLnN0cmluZ2lmeShjYWNoZV8xLmNvbmZpZywgbnVsbCwgMilcbiAgICAgICAgKyBcIlxcblxcblJFUE8gU0laRTpcIiArIGluc3RhbmNlLnJlcG8ubGVuZ3RoXG4gICAgICAgICsgXCJcXG49PT09PT09PT09PT09PT09PT09XFxuXCI7XG59O1xudmFyIHN0cmluZ2lmeU1hcCA9IGZ1bmN0aW9uIChtYXApIHtcbiAgICB2YXIgcmVzdWx0ID0gXCJcIjtcbiAgICBtYXAuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgIHZhciBpdGVtUmVzdWx0ID0gSlNPTi5zdHJpbmdpZnkoaXRlbSwgbnVsbCwgMik7XG4gICAgICAgIHJlc3VsdCArPSBpdGVtUmVzdWx0ICsgXCIsXFxuXCI7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wcmludC50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIENhY2hlUmVwb18xID0gcmVxdWlyZShcIi4vQ2FjaGVSZXBvXCIpO1xudmFyIENhY2hlVGhyZWFkXzEgPSByZXF1aXJlKFwiLi9DYWNoZVRocmVhZFwiKTtcbnZhciBDYWNoZUluc3RhbmNlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDYWNoZUluc3RhbmNlKG5hbWUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5yZXBvID0gbmV3IENhY2hlUmVwb18xLmRlZmF1bHQoKTtcbiAgICAgICAgdGhpcy50aHJlYWQgPSBuZXcgQ2FjaGVUaHJlYWRfMS5kZWZhdWx0KCk7XG4gICAgICAgIHRoaXMubmV4dE5vZGVLZXkgPSAwO1xuICAgICAgICB0aGlzLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMucmVwbyA9IG5ldyBDYWNoZVJlcG9fMS5kZWZhdWx0KCk7XG4gICAgICAgICAgICBfdGhpcy50aHJlYWQgPSBuZXcgQ2FjaGVUaHJlYWRfMS5kZWZhdWx0KCk7XG4gICAgICAgICAgICBfdGhpcy5uZXh0Tm9kZUtleSA9IDA7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYWRkTm9kZSA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMucmVwby5hZGQobm9kZSkpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy50aHJlYWQuYWRkTm9kZShub2RlLmlkKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5uZXh0Tm9kZUtleSsrO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmxlbmd0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy50aHJlYWQubm9kZXMubGVuZ3RoO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMucmVwby5sZW5ndGg7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgfVxuICAgIHJldHVybiBDYWNoZUluc3RhbmNlO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IENhY2hlSW5zdGFuY2U7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DYWNoZUluc3RhbmNlLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQ2FjaGVNYXBfMSA9IHJlcXVpcmUoXCIuL0NhY2hlTWFwXCIpO1xudmFyIENhY2hlUmVwbyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2FjaGVSZXBvKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLml0ZW1zID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmxlbmd0aCA9IDA7XG4gICAgICAgIHRoaXMuZ2V0ID0gZnVuY3Rpb24gKG5vZGVJZCkgeyByZXR1cm4gKF90aGlzLml0ZW1zLmdldChub2RlSWQpKTsgfTtcbiAgICAgICAgdGhpcy5hZGQgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgaWYgKCFfdGhpcy5pdGVtcy5oYXMobm9kZS5pZCkpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5pdGVtcy5zZXQobm9kZS5pZCwgbm9kZSk7XG4gICAgICAgICAgICAgICAgX3RoaXMubGVuZ3RoKys7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZGVsZXRlID0gZnVuY3Rpb24gKG5vZGVJZCkge1xuICAgICAgICAgICAgaWYgKF90aGlzLml0ZW1zLmhhcyhub2RlSWQpKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuaXRlbXMuZGVsZXRlKG5vZGVJZCk7XG4gICAgICAgICAgICAgICAgX3RoaXMubGVuZ3RoLS07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBDYWNoZVJlcG87XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ2FjaGVSZXBvO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2FjaGVSZXBvLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQ2FjaGVUaHJlYWQgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENhY2hlVGhyZWFkKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSAtMTtcbiAgICAgICAgdGhpcy5ub2RlcyA9IFtdO1xuICAgICAgICB0aGlzLmFkZE5vZGUgPSBmdW5jdGlvbiAobm9kZUlkKSB7XG4gICAgICAgICAgICBfdGhpcy5ub2Rlcy5wdXNoKG5vZGVJZCk7XG4gICAgICAgICAgICBfdGhpcy5jdXJyZW50Kys7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBDYWNoZVRocmVhZDtcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDYWNoZVRocmVhZDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NhY2hlVGhyZWFkLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbnZhciBjYWNoZV8xID0gcmVxdWlyZShcIi4vY2FjaGVcIik7XG52YXIgZ2V0XzEgPSByZXF1aXJlKFwiLi9nZXRcIik7XG52YXIgQ2FjaGVNYXBfMSA9IHJlcXVpcmUoXCIuL0NhY2hlTWFwXCIpO1xudmFyIG9wYXRoID0gcmVxdWlyZShcIi4vcGF0aFwiKTtcbnZhciBmbHVzaF8xID0gcmVxdWlyZShcIi4vZmx1c2hcIik7XG52YXIgbG9jYXRlXzEgPSByZXF1aXJlKFwiLi9sb2NhdGVcIik7XG52YXIgcmVmXzEgPSByZXF1aXJlKFwiLi9yZWZcIik7XG5leHBvcnRzLmV2aWN0SXRlbSA9IGZ1bmN0aW9uIChvYmosIGluc3RhbmNlKSB7XG4gICAgdmFyIHVpZEFycmF5ID0gYnVpbGRFdmljdFVpZEFycmF5KG9iaik7XG4gICAgaWYgKHVpZEFycmF5Lmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIHJldHVybiBsb2NhdGVfMS5nZXRDYWxsU3RhdHMoZmFsc2UsIGluc3RhbmNlKTtcbiAgICB9XG4gICAgdmFyIGN1cnJlbnRTdGF0ZSA9IGdldF8xLmdldENhY2hlQ3VycmVudFN0YWNrKGluc3RhbmNlKTtcbiAgICB2YXIgZm91bmQgPSB1aWRBcnJheS5zb21lKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHJldHVybiBjdXJyZW50U3RhdGUgJiYgY3VycmVudFN0YXRlLmhhcyhTdHJpbmcoaXRlbSkpO1xuICAgIH0pO1xuICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgcmV0dXJuIGxvY2F0ZV8xLmdldENhbGxTdGF0cyhmYWxzZSwgaW5zdGFuY2UpO1xuICAgIH1cbiAgICB2YXIgdGVtcFN0YXRlID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgIGN1cnJlbnRTdGF0ZS5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgIHRlbXBTdGF0ZS5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgfSk7XG4gICAgdmFyIGZsdXNoTWFwID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgIHZhciBldmljdE1hcCA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICB2YXIgZmx1c2hBcmdzID0ge1xuICAgICAgICBmbHVzaE1hcDogZmx1c2hNYXAsXG4gICAgICAgIGV2aWN0TWFwOiBldmljdE1hcCxcbiAgICAgICAgaW5zdGFuY2U6IGluc3RhbmNlXG4gICAgfTtcbiAgICB2YXIgcGFyZW50c0NoYW5nZWQgPSBbXTtcbiAgICB1aWRBcnJheS5mb3JFYWNoKGZ1bmN0aW9uICh1aWQpIHtcbiAgICAgICAgZmx1c2hBcmdzLmVudGl0eVVpZCA9IHVpZDtcbiAgICAgICAgY2xlYXJUYXJnZXRSZWZGcm9tcyhmbHVzaEFyZ3MpO1xuICAgICAgICBldmljdE1hcC5zZXQodWlkLCBudWxsKTtcbiAgICAgICAgY2xlYXJQYXJlbnRSZWZUb3ModWlkQXJyYXksIHBhcmVudHNDaGFuZ2VkLCBmbHVzaEFyZ3MpO1xuICAgIH0pO1xuICAgIHB1dFBhcmVudHNDaGFuZ2VkKHBhcmVudHNDaGFuZ2VkLCBmbHVzaE1hcCwgZXZpY3RNYXAsIGluc3RhbmNlKTtcbiAgICBmbHVzaE1hcC5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIGl0ZW0pIHtcbiAgICAgICAgdGVtcFN0YXRlLnNldChrZXksIGl0ZW0pO1xuICAgIH0pO1xuICAgIGV2aWN0TWFwLmZvckVhY2goZnVuY3Rpb24gKGtleSwgaXRlbSkge1xuICAgICAgICB0ZW1wU3RhdGUuZGVsZXRlKGtleSk7XG4gICAgfSk7XG4gICAgZmx1c2hfMS5mbHVzaCh0ZW1wU3RhdGUsIGluc3RhbmNlKTtcbiAgICByZXR1cm4gbG9jYXRlXzEuZ2V0Q2FsbFN0YXRzKHRydWUsIGluc3RhbmNlKTtcbn07XG52YXIgcHV0UGFyZW50c0NoYW5nZWQgPSBmdW5jdGlvbiAocGFyZW50c0NoYW5nZWQsIGZsdXNoTWFwLCBldmljdE1hcCwgaW5zdGFuY2UpIHtcbiAgICBpZiAocGFyZW50c0NoYW5nZWQgJiYgcGFyZW50c0NoYW5nZWQubGVuZ3RoID4gMCAmJiB1dGlsXzEuY2FjaGVTaXplKGluc3RhbmNlKSA+IDApIHtcbiAgICAgICAgdmFyIGZsdXNoQXJnc18xID0ge1xuICAgICAgICAgICAgZmx1c2hNYXA6IGZsdXNoTWFwLFxuICAgICAgICAgICAgZXZpY3RNYXA6IGV2aWN0TWFwLFxuICAgICAgICAgICAgaW5zdGFuY2U6IGluc3RhbmNlXG4gICAgICAgIH07XG4gICAgICAgIGZsdXNoXzEuYnVpbGRGbHVzaE1hcChmbHVzaEFyZ3NfMSk7XG4gICAgICAgIGZsdXNoQXJnc18xLmZsdXNoTWFwLmZvckVhY2goZnVuY3Rpb24gKGtleSwgaXRlbSkge1xuICAgICAgICAgICAgcmVmXzEudXBkYXRlUmVmRnJvbXMoaXRlbSwgZmx1c2hBcmdzXzEpO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xudmFyIGNsZWFyVGFyZ2V0UmVmRnJvbXMgPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgdmFyIGl0ZW0gPSBnZXRfMS5nZXRDYWNoZWRJdGVtKGZsdXNoQXJncy5lbnRpdHlVaWQsIGZsdXNoQXJncy5pbnN0YW5jZSk7XG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgaXRlbS5tYXBUby5mb3JFYWNoKGZ1bmN0aW9uICh0b1VpZCwgcGF0aHMpIHtcbiAgICAgICAgICAgIHZhciByZWZJdGVtID0gZmx1c2hfMS5nZXRJdGVtRmx1c2hPckNhY2hlZCh0b1VpZCwgZmx1c2hBcmdzKTtcbiAgICAgICAgICAgIGlmIChyZWZJdGVtKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJSZWZGcm9tKHJlZkl0ZW0sIGZsdXNoQXJncy5lbnRpdHlVaWQpO1xuICAgICAgICAgICAgICAgIGlmIChyZWZJdGVtLm1hcEZyb20uc2l6ZSgpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGZsdXNoQXJncy5lbnRpdHlVaWQgPSB0b1VpZDtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUYXJnZXRSZWZGcm9tcyhmbHVzaEFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZXZpY3RNYXAuc2V0KHRvVWlkLCByZWZJdGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZsdXNoQXJncy5mbHVzaE1hcC5zZXQodG9VaWQsIHJlZkl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcbnZhciBjbGVhclJlZkZyb20gPSBmdW5jdGlvbiAocmVmSXRlbSwgcGFyZW50VWlkKSB7XG4gICAgdmFyIHJlZnNBcnJheSA9IHJlZkl0ZW0ubWFwRnJvbS5nZXQocGFyZW50VWlkKTtcbiAgICBpZiAoIXJlZnNBcnJheSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlZkl0ZW0ubWFwRnJvbSA9IHJlZkl0ZW0ubWFwRnJvbS5jbG9uZSgpO1xuICAgIHJlZkl0ZW0ubWFwRnJvbS5kZWxldGUocGFyZW50VWlkKTtcbn07XG52YXIgY2xlYXJQYXJlbnRSZWZUb3MgPSBmdW5jdGlvbiAodWlkQXJyYXksIHBhcmVudHNDaGFuZ2VkLCBmbHVzaEFyZ3MpIHtcbiAgICB2YXIgaXRlbSA9IGZsdXNoXzEuZ2V0SXRlbUZsdXNoT3JDYWNoZWQoZmx1c2hBcmdzLmVudGl0eVVpZCwgZmx1c2hBcmdzKTtcbiAgICBpZiAoaXRlbSkge1xuICAgICAgICBpdGVtLm1hcEZyb20uZm9yRWFjaChmdW5jdGlvbiAocGFyZW50VWlkLCBwYXRocykge1xuICAgICAgICAgICAgdmFyIHBhcmVudEl0ZW0gPSBmbHVzaF8xLmdldEl0ZW1GbHVzaE9yQ2FjaGVkKHBhcmVudFVpZCwgZmx1c2hBcmdzKTtcbiAgICAgICAgICAgIGlmIChwYXJlbnRJdGVtKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN1Y2Nlc3MgPSBjbGVhclJlZlRvKHBhcmVudEl0ZW0sIGZsdXNoQXJncy5lbnRpdHlVaWQsIGZsdXNoQXJncy5pbnN0YW5jZSk7XG4gICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmx1c2hBcmdzLmZsdXNoTWFwLnNldChwYXJlbnRVaWQsIHBhcmVudEl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAodWlkQXJyYXkuaW5kZXhPZihwYXJlbnRVaWQpIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50c0NoYW5nZWQucHVzaChwYXJlbnRJdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcbnZhciBjbGVhclJlZlRvID0gZnVuY3Rpb24gKHBhcmVudEl0ZW0sIHJlZlVpZCwgaW5zdGFuY2UpIHtcbiAgICB2YXIgcGFyZW50ID0gcGFyZW50SXRlbS5lbnRpdHk7XG4gICAgaWYgKE9iamVjdC5pc0Zyb3plbihwYXJlbnQpKSB7XG4gICAgICAgIHBhcmVudCA9IGdldF8xLmdldEVkaXRJdGVtKHBhcmVudFtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSwgaW5zdGFuY2UpO1xuICAgICAgICBwYXJlbnRJdGVtLmVudGl0eSA9IHBhcmVudDtcbiAgICB9XG4gICAgdmFyIHJlZlBhdGhzID0gcGFyZW50SXRlbS5tYXBUby5nZXQocmVmVWlkKTtcbiAgICByZWZQYXRocy5mb3JFYWNoKGZ1bmN0aW9uIChwYXRoKSB7XG4gICAgICAgIG9wYXRoLmRlbChwYXJlbnQsIHBhdGgpO1xuICAgIH0pO1xuICAgIGlmICghT2JqZWN0LmlzRnJvemVuKHBhcmVudCkpIHtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZShwYXJlbnQpO1xuICAgIH1cbiAgICBwYXJlbnRJdGVtLmVudGl0eSA9IHBhcmVudDtcbiAgICBwYXJlbnRJdGVtLm1hcFRvID0gcGFyZW50SXRlbS5tYXBUby5jbG9uZSgpO1xuICAgIHBhcmVudEl0ZW0ubWFwVG8uZGVsZXRlKHJlZlVpZCk7XG4gICAgcmV0dXJuIHRydWU7XG59O1xudmFyIGJ1aWxkRXZpY3RVaWRBcnJheSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICB2YXIgdWlkQXJyYXkgPSBbXTtcbiAgICBpZiAodXRpbF8xLmlzQXJyYXkob2JqKSkge1xuICAgICAgICBvYmouZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgaWYgKHV0aWxfMS5oYXNVaWQoaXRlbSkpIHtcbiAgICAgICAgICAgICAgICB1aWRBcnJheS5wdXNoKFN0cmluZyhpdGVtW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGl0ZW0gPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGl0ZW0gPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdWlkQXJyYXkucHVzaChTdHJpbmcoaXRlbSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YXIgdWlkID0gb2JqO1xuICAgICAgICBpZiAodXRpbF8xLmlzT2JqZWN0KG9iaikpIHtcbiAgICAgICAgICAgIHVpZCA9IG9ialtjYWNoZV8xLmNvbmZpZy51aWROYW1lXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodWlkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB1aWRBcnJheTtcbiAgICAgICAgfVxuICAgICAgICB1aWRBcnJheS5wdXNoKFN0cmluZyh1aWQpKTtcbiAgICB9XG4gICAgcmV0dXJuIHVpZEFycmF5O1xufTtcbmV4cG9ydHMuY2xlYXJOZXh0ID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgdmFyIHRocmVhZCA9IGluc3RhbmNlLnRocmVhZDtcbiAgICBpZiAodGhyZWFkLmN1cnJlbnQgPCB0aHJlYWQubm9kZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICB2YXIgcmVtb3ZlZE5vZGVzID0gdGhyZWFkLm5vZGVzLnNsaWNlKHRocmVhZC5jdXJyZW50ICsgMSwgdGhyZWFkLm5vZGVzLmxlbmd0aCk7XG4gICAgICAgIHRocmVhZC5ub2RlcyA9IHRocmVhZC5ub2Rlcy5zbGljZSgwLCB0aHJlYWQuY3VycmVudCArIDEpO1xuICAgICAgICB0aHJlYWQuY3VycmVudCA9IHRocmVhZC5ub2Rlcy5sZW5ndGggLSAxO1xuICAgICAgICB0cnVuY2F0ZVRocmVhZHMocmVtb3ZlZE5vZGVzLCBpbnN0YW5jZSk7XG4gICAgfVxufTtcbnZhciB0cnVuY2F0ZVRocmVhZHMgPSBmdW5jdGlvbiAocmVtb3ZlZE5vZGVzLCBpbnN0YW5jZSkge1xuICAgIHJlbW92ZWROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChjYWNoZU5vZGVJZCkge1xuICAgICAgICB2YXIgY2FjaGVOb2RlID0gaW5zdGFuY2UucmVwby5nZXQoY2FjaGVOb2RlSWQpO1xuICAgICAgICBpZiAoY2FjaGVOb2RlKSB7XG4gICAgICAgICAgICBpbnN0YW5jZS5yZXBvLmRlbGV0ZShjYWNoZU5vZGVJZCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9ldmljdC50cyJdLCJzb3VyY2VSb290IjoiIn0=