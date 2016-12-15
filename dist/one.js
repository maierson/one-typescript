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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNjdjOTY3NGZlNWE5YmU4NmJmNDUiLCJ3ZWJwYWNrOi8vLy4vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vY2FjaGUudHMiLCJ3ZWJwYWNrOi8vLy4vY29uZmlnLnRzIiwid2VicGFjazovLy8uL3B1dC50cyIsIndlYnBhY2s6Ly8vLi9DYWNoZU1hcC50cyIsIndlYnBhY2s6Ly8vLi4vfi9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwid2VicGFjazovLy8uL2xvY2F0ZS50cyIsIndlYnBhY2s6Ly8vLi91dGlsLnRzIiwid2VicGFjazovLy8uL0NhY2hlTm9kZS50cyIsIndlYnBhY2s6Ly8vLi9yZWYudHMiLCJ3ZWJwYWNrOi8vLy4vZmx1c2gudHMiLCJ3ZWJwYWNrOi8vLy4vZ2V0LnRzIiwid2VicGFjazovLy8uL3BhdGgudHMiLCJ3ZWJwYWNrOi8vLy4vQ2FjaGVJdGVtLnRzIiwid2VicGFjazovLy8uL3ByaW50LnRzIiwid2VicGFjazovLy8uL0NhY2hlSW5zdGFuY2UudHMiLCJ3ZWJwYWNrOi8vLy4vQ2FjaGVSZXBvLnRzIiwid2VicGFjazovLy8uL0NhY2hlVGhyZWFkLnRzIiwid2VicGFjazovLy8uL2V2aWN0LnRzIl0sIm5hbWVzIjpbImNhY2hlXzEiLCJyZXF1aXJlIiwiZXhwb3J0cyIsImdldENhY2hlIiwicHV0IiwiZ2V0IiwiZ2V0RWRpdCIsImV2aWN0IiwicmVzZXQiLCJ1dWlkIiwicHJpbnQiLCJ3aW5kb3ciLCJPbmUiLCJjb25maWdfMSIsInB1dF8xIiwicHJpbnRfMSIsIkNhY2hlSW5zdGFuY2VfMSIsInV0aWxfMSIsImdldF8xIiwiZXZpY3RfMSIsImNhY2hlVGVzdCIsInNldFRlc3RpbmciLCJ0ZXN0aW5nIiwiaW5zdGFuY2VOYW1lIiwiY29uZmlndXJhdGlvbiIsImRlZmF1bHRDb25maWciLCJjb25maWciLCJpbnN0YW5jZXMiLCJjb25maWd1cmUiLCJjcmVhdGVDYWNoZSIsInVuZGVmaW5lZCIsIml0ZW0iLCJlbnRpdHkiLCJub2RlSWQiLCJ1aWRPckVudGl0eU9yQXJyYXkiLCJsdXQiLCJpIiwidG9TdHJpbmciLCJkMCIsIk1hdGgiLCJyYW5kb20iLCJkMSIsImQyIiwiZDMiLCJuYW1lIiwiaW5zdGFuY2UiLCJkZWZhdWx0IiwicHV0SXRlbSIsImdldEl0ZW0iLCJnZXRFZGl0SXRlbSIsImV2aWN0SXRlbSIsInNpemUiLCJjYWNoZVNpemUiLCJsZW5ndGgiLCJjYWNoZUxlbmd0aCIsInByaW50Q2FjaGUiLCJyZXN1bHQiLCJyZWZUbyIsInVpZCIsImdldENhY2hlZEl0ZW0iLCJtYXBUbyIsInJlZkZyb20iLCJtYXBGcm9tIiwidWlkTmFtZSIsIm1heEhpc3RvcnlTdGF0ZXMiLCJjb25mIiwicCIsImhhc093blByb3BlcnR5IiwiQ2FjaGVNYXBfMSIsImxvY2F0ZV8xIiwicmVmXzEiLCJmbHVzaF8xIiwiaXNBcnJheSIsImlzT2JqZWN0IiwiZXZpY3RNYXAiLCJmbHVzaE1hcCIsImZsdXNoQXJncyIsInBhcmVudFVpZCIsInJlZlBhdGgiLCJidWlsZEZsdXNoTWFwIiwidXBkYXRlUG9pbnRlcnMiLCJjb21taXRQdXQiLCJnZXRDYWxsU3RhdHMiLCJwcmVGbHVzaCIsIm9iamVjdEFzc2lnbiIsIkNhY2hlTWFwIiwiX3RoaXMiLCJwYXRocyIsImtleSIsImRlbGV0ZSIsInZhbCIsImhhcyIsImZvckVhY2giLCJjYWxsYmFjayIsImNsb25lIiwibmV3SW5zdGFuY2UiLCJwcm90b3R5cGUiLCJzZXQiLCJ2YWx1ZSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5Iiwic3VjY2VzcyIsIm5vZGUiLCJjdXJyZW50Tm9kZSIsImdldEN1cnJlbnROb2RlIiwiaWQiLCJpc051bWJlciIsIlR5cGVFcnJvciIsImNhY2hlTm9kZSIsImdldFJlcG9Ob2RlIiwidGhyZWFkIiwiY3VycmVudCIsImJpbmFyeUluZGV4T2YiLCJub2RlcyIsImN1cnJlbnROb2RlSWQiLCJjYWNoZU5vZGVJZCIsInJlcG8iLCJhcnJheSIsInNlYXJjaEVsZW1lbnQiLCJtaW5JbmRleCIsIm1heEluZGV4IiwiY3VycmVudEluZGV4IiwiY3VycmVudEVsZW1lbnQiLCJDYWNoZU5vZGVfMSIsIl9oYXNPd25Qcm9wZXJ0eSIsImlzU3RyaW5nIiwib2JqIiwibWl4ZWRfdmFyIiwiY2FsbCIsImlzRnVuY3Rpb24iLCJBcnJheSIsInNwbGljZSIsInByb3BlcnR5SXNFbnVtZXJhYmxlIiwib2JqVG9TdHIiLCJvIiwiaXNEYXRlIiwiaXNFbXB0eSIsImdldE5ld0NhY2hlTm9kZSIsIkNhY2hlTm9kZSIsIm5leHROb2RlS2V5IiwiYWRkIiwiaGFzVWlkIiwiRnVuY3Rpb24iLCJ0YXJnZXQiLCJTVFJJUF9DT01NRU5UUyIsIkFSR1VNRU5UX05BTUVTIiwiZ2V0UGFyYW1OYW1lcyIsImZ1bmMiLCJmblN0ciIsInJlcGxhY2UiLCJzbGljZSIsImluZGV4T2YiLCJtYXRjaCIsInN0cmluZ2lmeSIsIlJlZ0V4cCIsImJvZHkiLCJwYXJhbU5hbWVzIiwiYmluZCIsImRlZXBDbG9uZSIsInVpZFJlZmVyZW5jZSIsImZyZWV6ZSIsImlzRnJvemVuIiwicHJvcE5hbWUiLCJkZWVwQ2xvbmVBcnJheSIsImRhdGUiLCJEYXRlIiwiZ2V0VGltZSIsImFyciIsIm1hcCIsIml0ZW1zIiwib3BhdGgiLCJhc3NpZ25SZWZUb1BhcmVudCIsInJlZkl0ZW0iLCJwYXJlbnRJdGVtIiwiZ2V0SXRlbUZsdXNoT3JDYWNoZWQiLCJhc3NpZ25SZWZzIiwicmVmVWlkIiwiYWRkUmVmVG8iLCJhZGRSZWZGcm9tIiwicGF0aCIsInJlZkFycmF5IiwicHVzaCIsImZyb21BcnJheSIsInVwZGF0ZUl0ZW1SZWZUb3MiLCJ1cGRhdGVSZWZGcm9tcyIsImZpcnN0UGF0aCIsInRhcmdldFJlZiIsImRpcnR5IiwiYXJncyIsImVuc3VyZUl0ZW0iLCJ1cGRhdGVSZWZUb3MiLCJlbnRpdHlVaWQiLCJ0b1VpZCIsInVwZGF0ZWRQYXRocyIsInJlZmVyZW5jZSIsInRhcmdldFVpZCIsImZvdW5kIiwicmVtb3ZlUmVmRnJvbV9WYWx1ZSIsImZpbHRlciIsInJlbW92ZVJlZkZyb20iLCJyZWZzQXJyYXkiLCJpbmRleCIsInBhdGhfMSIsIkNhY2hlSXRlbV8xIiwiYnVpbGRFbnRpdHlGbHVzaE1hcCIsImNhY2hlQXJyUmVmcyIsImNhY2hlRW50aXR5UmVmcyIsImlzRGlydHkiLCJlbnN1cmVPbkZsdXNoTWFwIiwiU3RyaW5nIiwicGFyZW50RW50aXR5IiwicHJvcCIsInJlZkVudGl0eSIsImNvbmNhdFByb3AiLCJjYWNoZU9ialJlZnMiLCJhcnJheVBhdGgiLCJhcnJheVVpZCIsIm5leHQiLCJjYWNoZVVpZE9ialJlZnMiLCJpc09uQ2FjaGUiLCJjYWNoZWRJdGVtIiwiaXRlbVVpZCIsImxpdmUiLCJ0ZW1wIiwiY3VycmVudFN0YWNrIiwiZ2V0Q2FjaGVDdXJyZW50U3RhY2siLCJmcmVlemVJdGVtIiwiZmx1c2giLCJnZXRPYmplY3QiLCJ1aWRPckVudGl0eSIsInJlYWxVaWQiLCJnZXRBY3R1YWxVaWQiLCJjb25zb2xlIiwibG9nIiwiZ2V0RWRpdGFibGVPYmplY3QiLCJleGlzdGluZyIsImV4aXN0aW5nSXRlbSIsImdldEtleSIsImludEtleSIsInBhcnNlSW50IiwiZGVsIiwic3BsaXQiLCJjdXJyZW50UGF0aCIsIm9sZFZhbCIsImRlZmF1bHRWYWx1ZSIsInByb3BDaGFpbiIsIkNhY2hlSXRlbSIsImxpdmVJdGVtIiwibm9kZUluZGljZXMiLCJzdHJlYW1EYXRhIiwic3RhdGUiLCJzdHJpbmdpZnlNYXAiLCJzdWJzdHJpbmciLCJKU09OIiwiaXRlbVJlc3VsdCIsIkNhY2hlUmVwb18xIiwiQ2FjaGVUaHJlYWRfMSIsIkNhY2hlSW5zdGFuY2UiLCJhZGROb2RlIiwiQ2FjaGVSZXBvIiwiQ2FjaGVUaHJlYWQiLCJ1aWRBcnJheSIsImJ1aWxkRXZpY3RVaWRBcnJheSIsImN1cnJlbnRTdGF0ZSIsInNvbWUiLCJ0ZW1wU3RhdGUiLCJwYXJlbnRzQ2hhbmdlZCIsImNsZWFyVGFyZ2V0UmVmRnJvbXMiLCJjbGVhclBhcmVudFJlZlRvcyIsInB1dFBhcmVudHNDaGFuZ2VkIiwiZmx1c2hBcmdzXzEiLCJjbGVhclJlZkZyb20iLCJjbGVhclJlZlRvIiwicGFyZW50IiwicmVmUGF0aHMiLCJjbGVhck5leHQiLCJyZW1vdmVkTm9kZXMiLCJ0cnVuY2F0ZVRocmVhZHMiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBOztBQUNBLEtBQUlBLFVBQVUsbUJBQUFDLENBQVEsQ0FBUixDQUFkO0FBQ0FDLFNBQVFDLFFBQVIsR0FBbUJILFFBQVFHLFFBQTNCO0FBQ0FELFNBQVFFLEdBQVIsR0FBY0osUUFBUUksR0FBdEI7QUFDQUYsU0FBUUcsR0FBUixHQUFjTCxRQUFRSyxHQUF0QjtBQUNBSCxTQUFRSSxPQUFSLEdBQWtCTixRQUFRTSxPQUExQjtBQUNBSixTQUFRSyxLQUFSLEdBQWdCUCxRQUFRTyxLQUF4QjtBQUNBTCxTQUFRTSxLQUFSLEdBQWdCUixRQUFRUSxLQUF4QjtBQUNBTixTQUFRTyxJQUFSLEdBQWVULFFBQVFTLElBQXZCO0FBQ0FQLFNBQVFRLEtBQVIsR0FBZ0JWLFFBQVFVLEtBQXhCO0FBQ0EsRUFBQyxZQUFZO0FBQ1QsU0FBSUMsTUFBSixFQUFZO0FBQ1JBLGdCQUFPQyxHQUFQLEdBQWE7QUFDVFQsdUJBQVVILFFBQVFHLFFBRFQ7QUFFVEMsa0JBQUtKLFFBQVFJLEdBRko7QUFHVEMsa0JBQUtMLFFBQVFLLEdBSEo7QUFJVEMsc0JBQVNOLFFBQVFNLE9BSlI7QUFLVEMsb0JBQU9QLFFBQVFPLEtBTE47QUFNVEMsb0JBQU9SLFFBQVFRLEtBTk47QUFPVEMsbUJBQU1ULFFBQVFTLElBUEw7QUFRVEMsb0JBQU9WLFFB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LEVBQXdCdk8sUUFBeEIsRUFBa0M7QUFDcER1TyxrQkFBYXhMLE9BQWIsQ0FBcUIsVUFBVXVCLFdBQVYsRUFBdUI7QUFDeEMsYUFBSVAsWUFBWS9ELFNBQVN1RSxJQUFULENBQWMvRyxHQUFkLENBQWtCOEcsV0FBbEIsQ0FBaEI7QUFDQSxhQUFJUCxTQUFKLEVBQWU7QUFDWC9ELHNCQUFTdUUsSUFBVCxDQUFjM0IsTUFBZCxDQUFxQjBCLFdBQXJCO0FBQ0g7QUFDSixNQUxEO0FBTUgsRUFQRCxDIiwiZmlsZSI6Im9uZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDY3Yzk2NzRmZTVhOWJlODZiZjQ1IiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgY2FjaGVfMSA9IHJlcXVpcmUoXCIuL2NhY2hlXCIpO1xuZXhwb3J0cy5nZXRDYWNoZSA9IGNhY2hlXzEuZ2V0Q2FjaGU7XG5leHBvcnRzLnB1dCA9IGNhY2hlXzEucHV0O1xuZXhwb3J0cy5nZXQgPSBjYWNoZV8xLmdldDtcbmV4cG9ydHMuZ2V0RWRpdCA9IGNhY2hlXzEuZ2V0RWRpdDtcbmV4cG9ydHMuZXZpY3QgPSBjYWNoZV8xLmV2aWN0O1xuZXhwb3J0cy5yZXNldCA9IGNhY2hlXzEucmVzZXQ7XG5leHBvcnRzLnV1aWQgPSBjYWNoZV8xLnV1aWQ7XG5leHBvcnRzLnByaW50ID0gY2FjaGVfMS5wcmludDtcbihmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHdpbmRvdykge1xuICAgICAgICB3aW5kb3cuT25lID0ge1xuICAgICAgICAgICAgZ2V0Q2FjaGU6IGNhY2hlXzEuZ2V0Q2FjaGUsXG4gICAgICAgICAgICBwdXQ6IGNhY2hlXzEucHV0LFxuICAgICAgICAgICAgZ2V0OiBjYWNoZV8xLmdldCxcbiAgICAgICAgICAgIGdldEVkaXQ6IGNhY2hlXzEuZ2V0RWRpdCxcbiAgICAgICAgICAgIGV2aWN0OiBjYWNoZV8xLmV2aWN0LFxuICAgICAgICAgICAgcmVzZXQ6IGNhY2hlXzEucmVzZXQsXG4gICAgICAgICAgICB1dWlkOiBjYWNoZV8xLnV1aWQsXG4gICAgICAgICAgICBwcmludDogY2FjaGVfMS5wcmludFxuICAgICAgICB9O1xuICAgIH1cbn0pKCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9pbmRleC50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIGNvbmZpZ18xID0gcmVxdWlyZShcIi4vY29uZmlnXCIpO1xudmFyIHB1dF8xID0gcmVxdWlyZShcIi4vcHV0XCIpO1xudmFyIHByaW50XzEgPSByZXF1aXJlKFwiLi9wcmludFwiKTtcbnZhciBDYWNoZUluc3RhbmNlXzEgPSByZXF1aXJlKFwiLi9DYWNoZUluc3RhbmNlXCIpO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG52YXIgZ2V0XzEgPSByZXF1aXJlKFwiLi9nZXRcIik7XG52YXIgZXZpY3RfMSA9IHJlcXVpcmUoXCIuL2V2aWN0XCIpO1xudmFyIGNhY2hlVGVzdCA9IGZhbHNlO1xuZnVuY3Rpb24gc2V0VGVzdGluZyh0ZXN0aW5nKSB7XG4gICAgY2FjaGVUZXN0ID0gdGVzdGluZztcbn1cbmV4cG9ydHMuc2V0VGVzdGluZyA9IHNldFRlc3Rpbmc7XG5mdW5jdGlvbiBnZXRDYWNoZShpbnN0YW5jZU5hbWUsIGNvbmZpZ3VyYXRpb24pIHtcbiAgICBpZiAoaW5zdGFuY2VOYW1lID09PSB2b2lkIDApIHsgaW5zdGFuY2VOYW1lID0gXCJvbmVcIjsgfVxuICAgIGlmIChjb25maWd1cmF0aW9uID09PSB2b2lkIDApIHsgY29uZmlndXJhdGlvbiA9IGNvbmZpZ18xLmRlZmF1bHRDb25maWc7IH1cbiAgICBpZiAoIWV4cG9ydHMuY29uZmlnICYmICFleHBvcnRzLmluc3RhbmNlcykge1xuICAgICAgICBleHBvcnRzLmNvbmZpZyA9IGNvbmZpZ18xLmNvbmZpZ3VyZShjb25maWd1cmF0aW9uKTtcbiAgICB9XG4gICAgaWYgKCFleHBvcnRzLmluc3RhbmNlcykge1xuICAgICAgICBleHBvcnRzLmluc3RhbmNlcyA9IHt9O1xuICAgIH1cbiAgICBpZiAoIWV4cG9ydHMuaW5zdGFuY2VzW2luc3RhbmNlTmFtZV0pIHtcbiAgICAgICAgZXhwb3J0cy5pbnN0YW5jZXNbaW5zdGFuY2VOYW1lXSA9IGNyZWF0ZUNhY2hlKGluc3RhbmNlTmFtZSk7XG4gICAgfVxuICAgIGlmICh3aW5kb3cpIHtcbiAgICAgICAgaWYgKHdpbmRvd1tpbnN0YW5jZU5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHdpbmRvd1tpbnN0YW5jZU5hbWVdID0gZXhwb3J0cy5pbnN0YW5jZXNbaW5zdGFuY2VOYW1lXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZXhwb3J0cy5pbnN0YW5jZXNbaW5zdGFuY2VOYW1lXTtcbn1cbmV4cG9ydHMuZ2V0Q2FjaGUgPSBnZXRDYWNoZTtcbmV4cG9ydHMucHV0ID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICBnZXRDYWNoZSgpLnB1dChpdGVtKTtcbn07XG5leHBvcnRzLmdldCA9IGZ1bmN0aW9uIChlbnRpdHksIG5vZGVJZCkge1xuICAgIHJldHVybiBnZXRDYWNoZSgpLmdldChlbnRpdHksIG5vZGVJZCk7XG59O1xuZXhwb3J0cy5nZXRFZGl0ID0gZnVuY3Rpb24gKHVpZE9yRW50aXR5T3JBcnJheSwgbm9kZUlkKSB7XG4gICAgcmV0dXJuIGdldENhY2hlKCkuZ2V0RWRpdCh1aWRPckVudGl0eU9yQXJyYXksIG5vZGVJZCk7XG59O1xuZXhwb3J0cy5ldmljdCA9IGZ1bmN0aW9uICh1aWRPckVudGl0eU9yQXJyYXkpIHtcbiAgICByZXR1cm4gZ2V0Q2FjaGUoKS5ldmljdCh1aWRPckVudGl0eU9yQXJyYXkpO1xufTtcbmV4cG9ydHMucHJpbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGdldENhY2hlKCkucHJpbnQoKTtcbn07XG5leHBvcnRzLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIGdldENhY2hlKCkucmVzZXQoKTtcbn07XG5leHBvcnRzLnV1aWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGx1dCA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMjU2OyBpKyspIHtcbiAgICAgICAgbHV0W2ldID0gKGkgPCAxNiA/ICcwJyA6ICcnKSArIChpKS50b1N0cmluZygxNik7XG4gICAgfVxuICAgIHZhciBkMCA9IE1hdGgucmFuZG9tKCkgKiAweDEwMDAwMDAwMCB8IDA7XG4gICAgdmFyIGQxID0gTWF0aC5yYW5kb20oKSAqIDB4MTAwMDAwMDAwIHwgMDtcbiAgICB2YXIgZDIgPSBNYXRoLnJhbmRvbSgpICogMHgxMDAwMDAwMDAgfCAwO1xuICAgIHZhciBkMyA9IE1hdGgucmFuZG9tKCkgKiAweDEwMDAwMDAwMCB8IDA7XG4gICAgcmV0dXJuIGx1dFtkMCAmIDB4RkZdICsgbHV0W2QwID4+IDggJiAweEZGXSArIGx1dFtkMCA+PiAxNiAmIDB4RkZdXG4gICAgICAgICsgbHV0W2QwID4+IDI0ICYgMHhGRl0gKyAnLScgKyBsdXRbZDEgJiAweEZGXVxuICAgICAgICArIGx1dFtkMSA+PiA4ICYgMHhGRl0gKyAnLScgKyBsdXRbZDEgPj4gMTYgJiAweDBmIHwgMHg0MF1cbiAgICAgICAgKyBsdXRbZDEgPj4gMjQgJiAweEZGXSArICctJyArIGx1dFtkMiAmIDB4M2YgfCAweDgwXVxuICAgICAgICArIGx1dFtkMiA+PiA4ICYgMHhGRl0gKyAnLScgKyBsdXRbZDIgPj4gMTYgJiAweEZGXVxuICAgICAgICArIGx1dFtkMiA+PiAyNCAmIDB4RkZdICsgbHV0W2QzICYgMHhGRl0gKyBsdXRbZDMgPj4gOCAmIDB4RkZdXG4gICAgICAgICsgbHV0W2QzID4+IDE2ICYgMHhGRl0gKyBsdXRbZDMgPj4gMjQgJiAweEZGXTtcbn07XG5mdW5jdGlvbiBjcmVhdGVDYWNoZShuYW1lKSB7XG4gICAgdmFyIGluc3RhbmNlID0gbmV3IENhY2hlSW5zdGFuY2VfMS5kZWZhdWx0KG5hbWUpO1xuICAgIHZhciByZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaW5zdGFuY2UucmVzZXQoKTtcbiAgICB9O1xuICAgIHZhciBwdXQgPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICByZXR1cm4gcHV0XzEucHV0SXRlbShpdGVtLCBpbnN0YW5jZSk7XG4gICAgfTtcbiAgICB2YXIgZ2V0ID0gZnVuY3Rpb24gKGVudGl0eSwgbm9kZUlkKSB7XG4gICAgICAgIHJldHVybiBnZXRfMS5nZXRJdGVtKGVudGl0eSwgaW5zdGFuY2UsIG5vZGVJZCk7XG4gICAgfTtcbiAgICB2YXIgZ2V0RWRpdCA9IGZ1bmN0aW9uICh1aWRPckVudGl0eU9yQXJyYXksIG5vZGVJZCkge1xuICAgICAgICByZXR1cm4gZ2V0XzEuZ2V0RWRpdEl0ZW0odWlkT3JFbnRpdHlPckFycmF5LCBpbnN0YW5jZSwgbm9kZUlkKTtcbiAgICB9O1xuICAgIHZhciBldmljdCA9IGZ1bmN0aW9uICh1aWRPckVudGl0eU9yQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIGV2aWN0XzEuZXZpY3RJdGVtKHVpZE9yRW50aXR5T3JBcnJheSwgaW5zdGFuY2UpO1xuICAgIH07XG4gICAgdmFyIHNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB1dGlsXzEuY2FjaGVTaXplKGluc3RhbmNlKTtcbiAgICB9O1xuICAgIHZhciBsZW5ndGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB1dGlsXzEuY2FjaGVMZW5ndGgoaW5zdGFuY2UpO1xuICAgIH07XG4gICAgdmFyIHByaW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gcHJpbnRfMS5wcmludENhY2hlKGluc3RhbmNlKTtcbiAgICB9O1xuICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgIHB1dDogcHV0LFxuICAgICAgICBnZXQ6IGdldCxcbiAgICAgICAgZ2V0RWRpdDogZ2V0RWRpdCxcbiAgICAgICAgZXZpY3Q6IGV2aWN0LFxuICAgICAgICByZXNldDogcmVzZXQsXG4gICAgICAgIHNpemU6IHNpemUsXG4gICAgICAgIGxlbmd0aDogbGVuZ3RoLFxuICAgICAgICBwcmludDogcHJpbnQsXG4gICAgfTtcbiAgICBpZiAoY2FjaGVUZXN0ID09PSB0cnVlKSB7XG4gICAgICAgIHJlc3VsdC5yZWZUbyA9IGZ1bmN0aW9uICh1aWQpIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gZ2V0XzEuZ2V0Q2FjaGVkSXRlbSh1aWQsIGluc3RhbmNlKTtcbiAgICAgICAgICAgIHJldHVybiBpdGVtLm1hcFRvO1xuICAgICAgICB9O1xuICAgICAgICByZXN1bHQucmVmRnJvbSA9IGZ1bmN0aW9uICh1aWQpIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gZ2V0XzEuZ2V0Q2FjaGVkSXRlbSh1aWQsIGluc3RhbmNlKTtcbiAgICAgICAgICAgIHJldHVybiBpdGVtLm1hcEZyb207XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9jYWNoZS50cyIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5kZWZhdWx0Q29uZmlnID0ge1xuICAgIHVpZE5hbWU6IFwidWlkXCIsXG4gICAgbWF4SGlzdG9yeVN0YXRlczogMTAwMFxufTtcbmZ1bmN0aW9uIGNvbmZpZ3VyZShjb25mKSB7XG4gICAgZm9yICh2YXIgcCBpbiBleHBvcnRzLmRlZmF1bHRDb25maWcpIHtcbiAgICAgICAgaWYgKGV4cG9ydHMuZGVmYXVsdENvbmZpZy5oYXNPd25Qcm9wZXJ0eShwKSAmJiBjb25mLmhhc093blByb3BlcnR5KHApKSB7XG4gICAgICAgICAgICBleHBvcnRzLmRlZmF1bHRDb25maWdbcF0gPSBjb25mW3BdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBleHBvcnRzLmRlZmF1bHRDb25maWc7XG59XG5leHBvcnRzLmNvbmZpZ3VyZSA9IGNvbmZpZ3VyZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2NvbmZpZy50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIENhY2hlTWFwXzEgPSByZXF1aXJlKFwiLi9DYWNoZU1hcFwiKTtcbnZhciBsb2NhdGVfMSA9IHJlcXVpcmUoXCIuL2xvY2F0ZVwiKTtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xudmFyIHJlZl8xID0gcmVxdWlyZShcIi4vcmVmXCIpO1xudmFyIGZsdXNoXzEgPSByZXF1aXJlKFwiLi9mbHVzaFwiKTtcbmV4cG9ydHMucHV0SXRlbSA9IGZ1bmN0aW9uIChlbnRpdHksIGluc3RhbmNlKSB7XG4gICAgaWYgKCh1dGlsXzEuaXNBcnJheShlbnRpdHkpIHx8IHV0aWxfMS5pc09iamVjdChlbnRpdHkpKSkge1xuICAgICAgICB2YXIgZXZpY3RNYXAgPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgICAgIHZhciBmbHVzaE1hcCA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICAgICAgZmx1c2hNYXBbJ19fVVBEQVRFRF9fJ10gPSBmYWxzZTtcbiAgICAgICAgdmFyIGZsdXNoQXJncyA9IHtcbiAgICAgICAgICAgIGVudGl0eTogZW50aXR5LFxuICAgICAgICAgICAgZmx1c2hNYXA6IGZsdXNoTWFwLFxuICAgICAgICAgICAgZXZpY3RNYXA6IGV2aWN0TWFwLFxuICAgICAgICAgICAgcGFyZW50VWlkOiBudWxsLFxuICAgICAgICAgICAgcmVmUGF0aDogXCJcIixcbiAgICAgICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZVxuICAgICAgICB9O1xuICAgICAgICBmbHVzaF8xLmJ1aWxkRmx1c2hNYXAoZmx1c2hBcmdzKTtcbiAgICAgICAgcmVmXzEudXBkYXRlUG9pbnRlcnMoZmx1c2hBcmdzKTtcbiAgICAgICAgaWYgKGZsdXNoQXJncy5mbHVzaE1hcC5zaXplKCkgPiAwICYmIGZsdXNoTWFwWydfX1VQREFURURfXyddID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm4gY29tbWl0UHV0KGZsdXNoQXJncyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGxvY2F0ZV8xLmdldENhbGxTdGF0cyhmYWxzZSwgaW5zdGFuY2UpO1xufTtcbnZhciBjb21taXRQdXQgPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgZmx1c2hfMS5wcmVGbHVzaChmbHVzaEFyZ3MpO1xuICAgIHJldHVybiBsb2NhdGVfMS5nZXRDYWxsU3RhdHModHJ1ZSwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wdXQudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBvYmplY3RBc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG52YXIgQ2FjaGVNYXAgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENhY2hlTWFwKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLnBhdGhzID0ge307XG4gICAgICAgIHRoaXMubGVuZ3RoID0gMDtcbiAgICAgICAgdGhpcy5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMucGF0aHNba2V5XTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5kZWxldGUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIF90aGlzLnBhdGhzW2tleV0gIT09IFwidW5kZWZpbmVkXCIgJiYgX3RoaXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciB2YWwgPSBfdGhpcy5wYXRoc1trZXldO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBfdGhpcy5wYXRoc1trZXldO1xuICAgICAgICAgICAgICAgIF90aGlzLmxlbmd0aC0tO1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaGFzID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBfdGhpcy5wYXRoc1trZXldICE9PSAndW5kZWZpbmVkJztcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5mb3JFYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gX3RoaXMucGF0aHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMucGF0aHMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhrZXksIF90aGlzLnBhdGhzW2tleV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBuZXdJbnN0YW5jZSA9IG9iamVjdEFzc2lnbih7fSwgX3RoaXMucGF0aHMpO1xuICAgICAgICAgICAgdmFyIGNsb25lID0gbmV3IENhY2hlTWFwKCk7XG4gICAgICAgICAgICBjbG9uZS5wYXRocyA9IG5ld0luc3RhbmNlO1xuICAgICAgICAgICAgY2xvbmUubGVuZ3RoID0gX3RoaXMubGVuZ3RoO1xuICAgICAgICAgICAgcmV0dXJuIGNsb25lO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBDYWNoZU1hcC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnBhdGhzW2tleV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMubGVuZ3RoKys7XG4gICAgICAgICAgICB0aGlzLnBhdGhzW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGF0aHNba2V5XSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICBDYWNoZU1hcC5wcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGVuZ3RoO1xuICAgIH07XG4gICAgcmV0dXJuIENhY2hlTWFwO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IENhY2hlTWFwO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2FjaGVNYXAudHMiLCIndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuLi9+L29iamVjdC1hc3NpZ24vaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbmV4cG9ydHMuZ2V0Q2FsbFN0YXRzID0gZnVuY3Rpb24gKHN1Y2Nlc3MsIGluc3RhbmNlKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHJlc3VsdC5zdWNjZXNzID0gc3VjY2VzcztcbiAgICByZXN1bHQubm9kZUlkID0gZXhwb3J0cy5ub2RlKGluc3RhbmNlKTtcbiAgICByZXN1bHQubGVuZ3RoID0gbGVuZ3RoKGluc3RhbmNlKTtcbiAgICByZXN1bHQubmFtZSA9IGluc3RhbmNlLm5hbWU7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5leHBvcnRzLm5vZGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIG5vZGVJZCkge1xuICAgIGlmICh0eXBlb2Ygbm9kZUlkID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHZhciBjdXJyZW50Tm9kZSA9IGdldEN1cnJlbnROb2RlKGluc3RhbmNlKTtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnROb2RlID8gY3VycmVudE5vZGUuaWQgOiAtMTtcbiAgICB9XG4gICAgaWYgKCF1dGlsXzEuaXNOdW1iZXIobm9kZUlkKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVGhlIG5vZGUgaWQgbXVzdCBiZSBhIG51bWJlci5cIik7XG4gICAgfVxuICAgIHZhciBjYWNoZU5vZGUgPSBnZXRSZXBvTm9kZShub2RlSWQsIGluc3RhbmNlKTtcbiAgICBpZiAoIWNhY2hlTm9kZSkge1xuICAgICAgICByZXR1cm4gZXhwb3J0cy5nZXRDYWxsU3RhdHMoZmFsc2UsIGluc3RhbmNlKTtcbiAgICB9XG4gICAgaW5zdGFuY2UudGhyZWFkLmN1cnJlbnQgPSBiaW5hcnlJbmRleE9mKGluc3RhbmNlLnRocmVhZC5ub2Rlcywgbm9kZUlkKTtcbiAgICByZXR1cm4gZXhwb3J0cy5nZXRDYWxsU3RhdHModHJ1ZSwgaW5zdGFuY2UpO1xufTtcbmZ1bmN0aW9uIGdldEN1cnJlbnROb2RlKGluc3RhbmNlKSB7XG4gICAgdmFyIGN1cnJlbnROb2RlSWQgPSBpbnN0YW5jZS50aHJlYWQubm9kZXNbaW5zdGFuY2UudGhyZWFkLmN1cnJlbnRdO1xuICAgIHJldHVybiBjdXJyZW50Tm9kZUlkID49IDAgPyBnZXRSZXBvTm9kZShjdXJyZW50Tm9kZUlkLCBpbnN0YW5jZSkgOiB1bmRlZmluZWQ7XG59XG5leHBvcnRzLmdldEN1cnJlbnROb2RlID0gZ2V0Q3VycmVudE5vZGU7XG5mdW5jdGlvbiBnZXRSZXBvTm9kZShjYWNoZU5vZGVJZCwgaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gaW5zdGFuY2UucmVwby5nZXQoY2FjaGVOb2RlSWQpO1xufVxuZXhwb3J0cy5nZXRSZXBvTm9kZSA9IGdldFJlcG9Ob2RlO1xudmFyIGxlbmd0aCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIHJldHVybiBpbnN0YW5jZS50aHJlYWQubm9kZXMubGVuZ3RoO1xufTtcbmZ1bmN0aW9uIGJpbmFyeUluZGV4T2YoYXJyYXksIHNlYXJjaEVsZW1lbnQpIHtcbiAgICB2YXIgbWluSW5kZXggPSAwO1xuICAgIHZhciBtYXhJbmRleCA9IGFycmF5Lmxlbmd0aCAtIDE7XG4gICAgdmFyIGN1cnJlbnRJbmRleDtcbiAgICB2YXIgY3VycmVudEVsZW1lbnQ7XG4gICAgd2hpbGUgKG1pbkluZGV4IDw9IG1heEluZGV4KSB7XG4gICAgICAgIGN1cnJlbnRJbmRleCA9IChtaW5JbmRleCArIG1heEluZGV4KSAvIDIgfCAwO1xuICAgICAgICBjdXJyZW50RWxlbWVudCA9IGFycmF5W2N1cnJlbnRJbmRleF07XG4gICAgICAgIGlmIChjdXJyZW50RWxlbWVudCA8IHNlYXJjaEVsZW1lbnQpIHtcbiAgICAgICAgICAgIG1pbkluZGV4ID0gY3VycmVudEluZGV4ICsgMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjdXJyZW50RWxlbWVudCA+IHNlYXJjaEVsZW1lbnQpIHtcbiAgICAgICAgICAgIG1heEluZGV4ID0gY3VycmVudEluZGV4IC0gMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50SW5kZXg7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9sb2NhdGUudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBjYWNoZV8xID0gcmVxdWlyZShcIi4vY2FjaGVcIik7XG52YXIgQ2FjaGVOb2RlXzEgPSByZXF1aXJlKFwiLi9DYWNoZU5vZGVcIik7XG52YXIgbG9jYXRlXzEgPSByZXF1aXJlKFwiLi9sb2NhdGVcIik7XG52YXIgb2JqZWN0QXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciBfaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuZnVuY3Rpb24gaXNOdW1iZXIodmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyB8fCB0b1N0cmluZyh2YWx1ZSkgPT09IFwiW29iamVjdCBOdW1iZXJdXCI7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5mdW5jdGlvbiBpc1N0cmluZyhvYmopIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ3N0cmluZycgfHwgdG9TdHJpbmcob2JqKSA9PT0gXCJbb2JqZWN0IFN0cmluZ11cIjtcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcbmZ1bmN0aW9uIGlzT2JqZWN0KG1peGVkX3Zhcikge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobWl4ZWRfdmFyKSA9PT0gJ1tvYmplY3QgQXJyYXldJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBtaXhlZF92YXIgIT09IG51bGwgJiYgdHlwZW9mIG1peGVkX3ZhciA9PT0gJ29iamVjdCc7XG59XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGl0ZW0pIHtcbiAgICByZXR1cm4gdHlwZW9mIGl0ZW0gPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuZnVuY3Rpb24gaXNBcnJheSh2YWx1ZSkge1xuICAgIGlmICghdmFsdWUgfHwgdmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWx1ZSkgfHwgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCdcbiAgICAgICAgJiYgdHlwZW9mIHZhbHVlLmxlbmd0aCA9PT0gJ251bWJlcidcbiAgICAgICAgJiYgdHlwZW9mIHZhbHVlLnNwbGljZSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICAmJiAhKHZhbHVlLnByb3BlcnR5SXNFbnVtZXJhYmxlKCdsZW5ndGgnKSkpO1xufVxuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcbmZ1bmN0aW9uIG9ialRvU3RyKG8pIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pO1xufVxuZnVuY3Rpb24gaXNEYXRlKHZhbHVlKSB7XG4gICAgcmV0dXJuIGlzT2JqZWN0KHZhbHVlKSAmJiBvYmpUb1N0cih2YWx1ZSkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xuZnVuY3Rpb24gaXNFbXB0eSh2YWx1ZSkge1xuICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChpc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2UgaWYgKCFpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKF9oYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuZXhwb3J0cy5pc0VtcHR5ID0gaXNFbXB0eTtcbmZ1bmN0aW9uIGdldE5ld0NhY2hlTm9kZShpbnN0YW5jZSkge1xuICAgIHZhciBub2RlID0gbmV3IENhY2hlTm9kZV8xLkNhY2hlTm9kZShpbnN0YW5jZS5uZXh0Tm9kZUtleSk7XG4gICAgbm9kZS5pZCA9IGluc3RhbmNlLm5leHROb2RlS2V5O1xuICAgIGluc3RhbmNlLm5leHROb2RlS2V5ICs9IDE7XG4gICAgaW5zdGFuY2UucmVwby5hZGQobm9kZSk7XG4gICAgcmV0dXJuIG5vZGU7XG59XG5leHBvcnRzLmdldE5ld0NhY2hlTm9kZSA9IGdldE5ld0NhY2hlTm9kZTtcbmZ1bmN0aW9uIGhhc1VpZChvYmopIHtcbiAgICBpZiAoIW9iaikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICghaXNPYmplY3Qob2JqKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb2JqW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIHVpZCA9IG9ialtjYWNoZV8xLmNvbmZpZy51aWROYW1lXTtcbiAgICByZXR1cm4gdWlkLmxlbmd0aCAhPT0gMDtcbn1cbmV4cG9ydHMuaGFzVWlkID0gaGFzVWlkO1xuO1xuRnVuY3Rpb24ucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIHZhciBTVFJJUF9DT01NRU5UUyA9IC8oKFxcL1xcLy4qJCl8KFxcL1xcKltcXHNcXFNdKj9cXCpcXC8pKS9tZztcbiAgICB2YXIgQVJHVU1FTlRfTkFNRVMgPSAvKFteXFxzLF0rKS9nO1xuICAgIGZ1bmN0aW9uIGdldFBhcmFtTmFtZXMoZnVuYykge1xuICAgICAgICB2YXIgZm5TdHIgPSBmdW5jLnRvU3RyaW5nKCkucmVwbGFjZShTVFJJUF9DT01NRU5UUywgJycpO1xuICAgICAgICB2YXIgcmVzdWx0ID0gZm5TdHIuc2xpY2UoZm5TdHIuaW5kZXhPZignKCcpICsgMSwgZm5TdHIuaW5kZXhPZignKScpKS5tYXRjaChBUkdVTUVOVF9OQU1FUyk7XG4gICAgICAgIGlmIChyZXN1bHQgPT09IG51bGwpXG4gICAgICAgICAgICByZXN1bHQgPSBbXTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgdmFyIHN0cmluZ2lmeSA9IHRoaXMudG9TdHJpbmcoKTtcbiAgICBzdHJpbmdpZnkgPSBzdHJpbmdpZnkucmVwbGFjZShuZXcgUmVnRXhwKCdfdGhpcycsICdnJyksICd0aGlzJyk7XG4gICAgdmFyIGJvZHkgPSBzdHJpbmdpZnkubWF0Y2goL2Z1bmN0aW9uW157XStcXHsoW1xcc1xcU10qKVxcfSQvKVsxXTtcbiAgICB2YXIgcGFyYW1OYW1lcyA9IGdldFBhcmFtTmFtZXModGhpcyk7XG4gICAgdmFyIGZ1bmMgPSBuZXcgRnVuY3Rpb24ocGFyYW1OYW1lcywgYm9keSk7XG4gICAgcmV0dXJuIGZ1bmMuYmluZCh0YXJnZXQpO1xufTtcbmZ1bmN0aW9uIGRlZXBDbG9uZShvYmosIHVpZFJlZmVyZW5jZSwgZnJlZXplKSB7XG4gICAgaWYgKGZyZWV6ZSA9PT0gdm9pZCAwKSB7IGZyZWV6ZSA9IHRydWU7IH1cbiAgICBpZiAoIW9ialxuICAgICAgICB8fCAoIWlzT2JqZWN0KG9iailcbiAgICAgICAgICAgICYmICFpc0FycmF5KG9iaikpKSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICAgIGlmIChmcmVlemUgPT09IHRydWVcbiAgICAgICAgJiYgdWlkUmVmZXJlbmNlXG4gICAgICAgICYmICFPYmplY3QuaXNGcm96ZW4odWlkUmVmZXJlbmNlKSkge1xuICAgICAgICBPYmplY3QuZnJlZXplKHVpZFJlZmVyZW5jZSk7XG4gICAgfVxuICAgIGlmICh1aWRSZWZlcmVuY2VcbiAgICAgICAgJiYgaGFzVWlkKG9iailcbiAgICAgICAgJiYgb2JqW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdID09PSB1aWRSZWZlcmVuY2VbY2FjaGVfMS5jb25maWcudWlkTmFtZV0pIHtcbiAgICAgICAgcmV0dXJuIHVpZFJlZmVyZW5jZTtcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9IG9iamVjdEFzc2lnbih7fSwgb2JqKTtcbiAgICBmb3IgKHZhciBwcm9wTmFtZSBpbiBvYmopIHtcbiAgICAgICAgdmFyIHZhbHVlID0gb2JqW3Byb3BOYW1lXTtcbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbcHJvcE5hbWVdID0gZGVlcENsb25lQXJyYXkodmFsdWUsIHVpZFJlZmVyZW5jZSwgZnJlZXplKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHZhbHVlLmdldFRpbWUoKSk7XG4gICAgICAgICAgICAgICAgaWYgKGZyZWV6ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZnJlZXplKGRhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXN1bHRbcHJvcE5hbWVdID0gZGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGlmIChoYXNVaWQodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtwcm9wTmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVpZFJlZmVyZW5jZSAmJiBoYXNVaWQodWlkUmVmZXJlbmNlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlICE9PSB1aWRSZWZlcmVuY2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB2YWx1ZS51aWQgPT09IHVpZFJlZmVyZW5jZS51aWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB2YWx1ZSAhPT0gdWlkUmVmZXJlbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W3Byb3BOYW1lXSA9IHVpZFJlZmVyZW5jZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W3Byb3BOYW1lXSA9IGRlZXBDbG9uZSh2YWx1ZSwgdWlkUmVmZXJlbmNlLCBmcmVlemUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByb3BOYW1lICE9PSAnY29uc3RydWN0b3InKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtwcm9wTmFtZV0gPSB2YWx1ZS5jbG9uZShyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtwcm9wTmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoZnJlZXplID09PSB0cnVlXG4gICAgICAgICYmICFPYmplY3QuaXNGcm96ZW4ocmVzdWx0KVxuICAgICAgICAmJiB0eXBlb2YgcmVzdWx0ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIE9iamVjdC5mcmVlemUocmVzdWx0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmV4cG9ydHMuZGVlcENsb25lID0gZGVlcENsb25lO1xuZnVuY3Rpb24gZGVlcENsb25lQXJyYXkoYXJyLCB1aWRSZWZlcmVuY2UsIGZyZWV6ZSkge1xuICAgIHJldHVybiBhcnIubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIGlmIChpc0FycmF5KGl0ZW0pKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVlcENsb25lQXJyYXkoaXRlbSwgdWlkUmVmZXJlbmNlLCBmcmVlemUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICAgICAgICBpZiAoaGFzVWlkKGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgaWYgKHVpZFJlZmVyZW5jZSAmJiAoaXRlbVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSA9PT0gdWlkUmVmZXJlbmNlW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdWlkUmVmZXJlbmNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWVwQ2xvbmUoaXRlbSwgdWlkUmVmZXJlbmNlLCBmcmVlemUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmV4cG9ydHMuY2FjaGVTaXplID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgdmFyIGNhY2hlTm9kZSA9IGxvY2F0ZV8xLmdldEN1cnJlbnROb2RlKGluc3RhbmNlKTtcbiAgICByZXR1cm4gY2FjaGVOb2RlID8gY2FjaGVOb2RlLml0ZW1zLnNpemUoKSA6IDA7XG59O1xuZXhwb3J0cy5jYWNoZUxlbmd0aCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIHJldHVybiBpbnN0YW5jZS50aHJlYWQubm9kZXMubGVuZ3RoO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3V0aWwudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBDYWNoZU1hcF8xID0gcmVxdWlyZShcIi4vQ2FjaGVNYXBcIik7XG52YXIgQ2FjaGVOb2RlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDYWNoZU5vZGUobm9kZUlkKSB7XG4gICAgICAgIHRoaXMuaXRlbXMgPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuaWQgPSBub2RlSWQ7XG4gICAgfVxuICAgIHJldHVybiBDYWNoZU5vZGU7XG59KCkpO1xuZXhwb3J0cy5DYWNoZU5vZGUgPSBDYWNoZU5vZGU7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DYWNoZU5vZGUudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBmbHVzaF8xID0gcmVxdWlyZShcIi4vZmx1c2hcIik7XG52YXIgY2FjaGVfMSA9IHJlcXVpcmUoXCIuL2NhY2hlXCIpO1xudmFyIG9wYXRoID0gcmVxdWlyZShcIi4vcGF0aFwiKTtcbnZhciBnZXRfMSA9IHJlcXVpcmUoXCIuL2dldFwiKTtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xuZXhwb3J0cy5hc3NpZ25SZWZUb1BhcmVudCA9IGZ1bmN0aW9uIChyZWZJdGVtLCBmbHVzaEFyZ3MpIHtcbiAgICBpZiAoZmx1c2hBcmdzLnBhcmVudFVpZCkge1xuICAgICAgICB2YXIgcGFyZW50SXRlbSA9IGZsdXNoXzEuZ2V0SXRlbUZsdXNoT3JDYWNoZWQoZmx1c2hBcmdzLnBhcmVudFVpZCwgZmx1c2hBcmdzKTtcbiAgICAgICAgaWYgKHBhcmVudEl0ZW0gJiYgZmx1c2hBcmdzLnJlZlBhdGgpIHtcbiAgICAgICAgICAgIGFzc2lnblJlZnMocGFyZW50SXRlbSwgcmVmSXRlbSwgZmx1c2hBcmdzLnJlZlBhdGgpO1xuICAgICAgICB9XG4gICAgfVxufTtcbnZhciBhc3NpZ25SZWZzID0gZnVuY3Rpb24gKHBhcmVudEl0ZW0sIHJlZkl0ZW0sIHJlZlBhdGgpIHtcbiAgICB2YXIgcGFyZW50VWlkID0gcGFyZW50SXRlbS5lbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV07XG4gICAgdmFyIHJlZlVpZCA9IHJlZkl0ZW0uZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgIGFkZFJlZlRvKHBhcmVudEl0ZW0sIHJlZlVpZCwgcmVmUGF0aCk7XG4gICAgYWRkUmVmRnJvbShyZWZJdGVtLCBwYXJlbnRVaWQsIHJlZlBhdGgpO1xufTtcbnZhciBhZGRSZWZUbyA9IGZ1bmN0aW9uIChwYXJlbnRJdGVtLCByZWZVaWQsIHBhdGgpIHtcbiAgICBpZiAocGFyZW50SXRlbS5tYXBUby5oYXMocmVmVWlkKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcGFyZW50SXRlbS5tYXBUby5zZXQocmVmVWlkLCBbXSk7XG4gICAgfVxuICAgIHZhciByZWZBcnJheSA9IHBhcmVudEl0ZW0ubWFwVG8uZ2V0KHJlZlVpZCk7XG4gICAgaWYgKHJlZkFycmF5LmluZGV4T2YocGF0aCkgPCAwKSB7XG4gICAgICAgIHJlZkFycmF5LnB1c2gocGF0aCk7XG4gICAgfVxuICAgIHJldHVybiBwYXJlbnRJdGVtO1xufTtcbnZhciBhZGRSZWZGcm9tID0gZnVuY3Rpb24gKHJlZkl0ZW0sIHBhcmVudFVpZCwgcGF0aCkge1xuICAgIGlmIChyZWZJdGVtLm1hcEZyb20uaGFzKHBhcmVudFVpZCkgPT09IGZhbHNlKSB7XG4gICAgICAgIHJlZkl0ZW0ubWFwRnJvbS5zZXQocGFyZW50VWlkLCBbXSk7XG4gICAgfVxuICAgIHZhciBmcm9tQXJyYXkgPSByZWZJdGVtLm1hcEZyb20uZ2V0KHBhcmVudFVpZCk7XG4gICAgaWYgKGZyb21BcnJheS5pbmRleE9mKHBhdGgpIDwgMCkge1xuICAgICAgICBmcm9tQXJyYXkucHVzaChwYXRoKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlZkl0ZW07XG59O1xuZXhwb3J0cy51cGRhdGVQb2ludGVycyA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICBmbHVzaEFyZ3MuZmx1c2hNYXAuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgIHVwZGF0ZUl0ZW1SZWZUb3MoaXRlbSwgZmx1c2hBcmdzKTtcbiAgICAgICAgZXhwb3J0cy51cGRhdGVSZWZGcm9tcyhpdGVtLCBmbHVzaEFyZ3MpO1xuICAgIH0pO1xufTtcbmV4cG9ydHMudXBkYXRlUmVmRnJvbXMgPSBmdW5jdGlvbiAoaXRlbSwgZmx1c2hBcmdzKSB7XG4gICAgaXRlbS5tYXBGcm9tLmZvckVhY2goZnVuY3Rpb24gKHBhcmVudFVpZCwgcGF0aHMpIHtcbiAgICAgICAgdmFyIHBhcmVudEl0ZW0gPSBmbHVzaEFyZ3MuZmx1c2hNYXAuZ2V0KHBhcmVudFVpZCk7XG4gICAgICAgIGlmICghcGFyZW50SXRlbSkge1xuICAgICAgICAgICAgcGFyZW50SXRlbSA9IGdldF8xLmdldENhY2hlZEl0ZW0ocGFyZW50VWlkLCBmbHVzaEFyZ3MuaW5zdGFuY2UpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJlbnRJdGVtICYmIHBhdGhzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciBmaXJzdFBhdGggPSBwYXRoc1swXTtcbiAgICAgICAgICAgIHZhciB0YXJnZXRSZWYgPSBvcGF0aC5nZXQocGFyZW50SXRlbS5lbnRpdHksIGZpcnN0UGF0aCk7XG4gICAgICAgICAgICB2YXIgZGlydHkgPSAodGFyZ2V0UmVmICYmIHRhcmdldFJlZiAhPT0gaXRlbS5lbnRpdHkpO1xuICAgICAgICAgICAgaWYgKGRpcnR5ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSB7XG4gICAgICAgICAgICAgICAgICAgIGVudGl0eTogcGFyZW50SXRlbS5lbnRpdHksXG4gICAgICAgICAgICAgICAgICAgIGZsdXNoTWFwOiBmbHVzaEFyZ3MuZmx1c2hNYXAsXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlOiBmbHVzaEFyZ3MuaW5zdGFuY2VcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHBhcmVudEl0ZW0gPSBmbHVzaF8xLmVuc3VyZUl0ZW0oYXJncyk7XG4gICAgICAgICAgICAgICAgcGFyZW50SXRlbS5lbnRpdHkgPSB1dGlsXzEuZGVlcENsb25lKHBhcmVudEl0ZW0uZW50aXR5LCBpdGVtLmVudGl0eSwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5leHBvcnRzLnVwZGF0ZVJlZlRvcyA9IGZ1bmN0aW9uIChlbnRpdHlVaWQsIGZsdXNoQXJncykge1xuICAgIHZhciBpdGVtID0gZmx1c2hfMS5nZXRJdGVtRmx1c2hPckNhY2hlZChlbnRpdHlVaWQsIGZsdXNoQXJncyk7XG4gICAgdXBkYXRlSXRlbVJlZlRvcyhpdGVtLCBmbHVzaEFyZ3MpO1xufTtcbnZhciB1cGRhdGVJdGVtUmVmVG9zID0gZnVuY3Rpb24gKGl0ZW0sIGZsdXNoQXJncykge1xuICAgIGlmIChpdGVtKSB7XG4gICAgICAgIGl0ZW0ubWFwVG8uZm9yRWFjaChmdW5jdGlvbiAodG9VaWQsIHBhdGhzKSB7XG4gICAgICAgICAgICB2YXIgdXBkYXRlZFBhdGhzID0gcGF0aHMubWFwKGZ1bmN0aW9uIChwYXRoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlZmVyZW5jZSA9IG9wYXRoLmdldChpdGVtLmVudGl0eSwgcGF0aCk7XG4gICAgICAgICAgICAgICAgaWYgKHJlZmVyZW5jZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0VWlkID0gcmVmZXJlbmNlW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0VWlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZm91bmQgPSB0YXJnZXRVaWQgPT0gdG9VaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZm91bmQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGF0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZW1vdmVSZWZGcm9tX1ZhbHVlKGl0ZW0uZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdLCB0b1VpZCwgZmx1c2hBcmdzKTtcbiAgICAgICAgICAgIH0pLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtICE9PSBudWxsICYmIGl0ZW0gIT09IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHVwZGF0ZWRQYXRocy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgaXRlbS5tYXBUby5zZXQodG9VaWQsIHVwZGF0ZWRQYXRocyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpdGVtLm1hcFRvLmRlbGV0ZSh0b1VpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG52YXIgcmVtb3ZlUmVmRnJvbV9WYWx1ZSA9IGZ1bmN0aW9uIChwYXJlbnRVaWQsIHJlZlVpZCwgZmx1c2hBcmdzKSB7XG4gICAgdmFyIHJlZkl0ZW0gPSBmbHVzaF8xLmdldEl0ZW1GbHVzaE9yQ2FjaGVkKHJlZlVpZCwgZmx1c2hBcmdzKTtcbiAgICBpZiAocmVmSXRlbSkge1xuICAgICAgICByZWZJdGVtID0gcmVmSXRlbS5jbG9uZSgpO1xuICAgICAgICBpZiAocmVmSXRlbS5tYXBGcm9tLmhhcyhwYXJlbnRVaWQpKSB7XG4gICAgICAgICAgICByZW1vdmVSZWZGcm9tKHJlZkl0ZW0sIHBhcmVudFVpZCwgZmx1c2hBcmdzLnJlZlBhdGgpO1xuICAgICAgICAgICAgaWYgKHJlZkl0ZW0ubWFwRnJvbS5zaXplKCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZXZpY3RNYXAuc2V0KHJlZlVpZCwgcmVmSXRlbSk7XG4gICAgICAgICAgICAgICAgZmx1c2hBcmdzLmZsdXNoTWFwLmRlbGV0ZShyZWZVaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZmx1c2hBcmdzLmZsdXNoTWFwLnNldChyZWZVaWQsIHJlZkl0ZW0pO1xuICAgICAgICAgICAgICAgIGZsdXNoQXJncy5ldmljdE1hcC5kZWxldGUocmVmVWlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG52YXIgcmVtb3ZlUmVmRnJvbSA9IGZ1bmN0aW9uIChpdGVtLCBwYXJlbnRVaWQsIHBhdGgpIHtcbiAgICB2YXIgcmVmc0FycmF5ID0gaXRlbS5tYXBGcm9tLmdldChwYXJlbnRVaWQpO1xuICAgIHZhciBpbmRleCA9IHJlZnNBcnJheS5pbmRleE9mKHBhdGgpO1xuICAgIHJlZnNBcnJheSA9IHJlZnNBcnJheS5zbGljZSgpO1xuICAgIHJlZnNBcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIGl0ZW0ubWFwRnJvbS5zZXQocGFyZW50VWlkLCByZWZzQXJyYXkpO1xuICAgIGlmIChyZWZzQXJyYXkubGVuZ3RoID09IDApIHtcbiAgICAgICAgaXRlbS5tYXBGcm9tLmRlbGV0ZShwYXJlbnRVaWQpO1xuICAgIH1cbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9yZWYudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBnZXRfMSA9IHJlcXVpcmUoXCIuL2dldFwiKTtcbnZhciBjYWNoZV8xID0gcmVxdWlyZShcIi4vY2FjaGVcIik7XG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbnZhciBwYXRoXzEgPSByZXF1aXJlKFwiLi9wYXRoXCIpO1xudmFyIENhY2hlSXRlbV8xID0gcmVxdWlyZShcIi4vQ2FjaGVJdGVtXCIpO1xudmFyIENhY2hlTWFwXzEgPSByZXF1aXJlKFwiLi9DYWNoZU1hcFwiKTtcbnZhciByZWZfMSA9IHJlcXVpcmUoXCIuL3JlZlwiKTtcbmV4cG9ydHMuYnVpbGRGbHVzaE1hcCA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICBpZiAodXRpbF8xLmhhc1VpZChmbHVzaEFyZ3MuZW50aXR5KSkge1xuICAgICAgICBidWlsZEVudGl0eUZsdXNoTWFwKGZsdXNoQXJncyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAodXRpbF8xLmlzQXJyYXkoZmx1c2hBcmdzLmVudGl0eSkpIHtcbiAgICAgICAgICAgIGNhY2hlQXJyUmVmcyhmbHVzaEFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVFbnRpdHlSZWZzKGZsdXNoQXJncyk7XG4gICAgICAgIH1cbiAgICB9XG59O1xudmFyIGJ1aWxkRW50aXR5Rmx1c2hNYXAgPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgZmx1c2hBcmdzLnJlZlBhdGggPSBcIlwiO1xuICAgIGlmIChpc0RpcnR5KGZsdXNoQXJncykgPT09IHRydWUpIHtcbiAgICAgICAgZW5zdXJlT25GbHVzaE1hcChmbHVzaEFyZ3MpO1xuICAgICAgICBjYWNoZUVudGl0eVJlZnMoZmx1c2hBcmdzKTtcbiAgICAgICAgcmVmXzEudXBkYXRlUmVmVG9zKFN0cmluZyhmbHVzaEFyZ3MuZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdKSwgZmx1c2hBcmdzKTtcbiAgICB9XG59O1xudmFyIGVuc3VyZU9uRmx1c2hNYXAgPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgdmFyIGVudGl0eVVpZCA9IFN0cmluZyhmbHVzaEFyZ3MuZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdKTtcbiAgICBpZiAoZmx1c2hBcmdzLmZsdXNoTWFwLmhhcyhlbnRpdHlVaWQpID09PSBmYWxzZSkge1xuICAgICAgICBleHBvcnRzLmVuc3VyZUl0ZW0oZmx1c2hBcmdzKTtcbiAgICAgICAgZmx1c2hBcmdzLnBhcmVudFVpZCA9IFN0cmluZyhlbnRpdHlVaWQpO1xuICAgIH1cbn07XG52YXIgY2FjaGVFbnRpdHlSZWZzID0gZnVuY3Rpb24gKGZsdXNoQXJncykge1xuICAgIHZhciBwYXJlbnRFbnRpdHkgPSBmbHVzaEFyZ3MuZW50aXR5O1xuICAgIGZvciAodmFyIHByb3AgaW4gcGFyZW50RW50aXR5KSB7XG4gICAgICAgIGlmIChwYXJlbnRFbnRpdHkuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgIHZhciByZWZFbnRpdHkgPSBwYXJlbnRFbnRpdHlbcHJvcF07XG4gICAgICAgICAgICBpZiAodXRpbF8xLmlzT2JqZWN0KHJlZkVudGl0eSkgfHwgdXRpbF8xLmlzQXJyYXkocmVmRW50aXR5KSkge1xuICAgICAgICAgICAgICAgIGZsdXNoQXJncy5lbnRpdHkgPSByZWZFbnRpdHk7XG4gICAgICAgICAgICAgICAgaWYgKHBhcmVudEVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICBmbHVzaEFyZ3MucGFyZW50VWlkID0gcGFyZW50RW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZmx1c2hBcmdzLnBhcmVudFVpZCkge1xuICAgICAgICAgICAgICAgICAgICBmbHVzaEFyZ3MucmVmUGF0aCA9IHBhdGhfMS5jb25jYXRQcm9wKGZsdXNoQXJncy5yZWZQYXRoLCBwcm9wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFmbHVzaEFyZ3MucmVmUGF0aCkge1xuICAgICAgICAgICAgICAgICAgICBmbHVzaEFyZ3MucmVmUGF0aCA9IHByb3A7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHV0aWxfMS5pc0FycmF5KHJlZkVudGl0eSkpIHtcbiAgICAgICAgICAgICAgICBjYWNoZUFyclJlZnMoZmx1c2hBcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHV0aWxfMS5pc09iamVjdChyZWZFbnRpdHkpKSB7XG4gICAgICAgICAgICAgICAgY2FjaGVPYmpSZWZzKGZsdXNoQXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBPYmplY3QuZnJlZXplKHJlZkVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xudmFyIGNhY2hlQXJyUmVmcyA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICB2YXIgZW50aXR5ID0gZmx1c2hBcmdzLmVudGl0eTtcbiAgICB2YXIgYXJyYXlQYXRoID0gZmx1c2hBcmdzLnJlZlBhdGg7XG4gICAgdmFyIGFycmF5VWlkO1xuICAgIGlmICghYXJyYXlVaWQpIHtcbiAgICAgICAgYXJyYXlVaWQgPSBmbHVzaEFyZ3MucGFyZW50VWlkO1xuICAgIH1cbiAgICBlbnRpdHkuZm9yRWFjaChmdW5jdGlvbiAobmV4dCwgaW5kZXgpIHtcbiAgICAgICAgZmx1c2hBcmdzLmVudGl0eSA9IG5leHQ7XG4gICAgICAgIGZsdXNoQXJncy5wYXJlbnRVaWQgPSBhcnJheVVpZDtcbiAgICAgICAgaWYgKGZsdXNoQXJncy5yZWZQYXRoIHx8IGFycmF5UGF0aCkge1xuICAgICAgICAgICAgZmx1c2hBcmdzLnJlZlBhdGggPSBhcnJheVBhdGggKyBcIi5cIiArIGluZGV4O1xuICAgICAgICB9XG4gICAgICAgIGlmICh1dGlsXzEuaXNBcnJheShuZXh0KSkge1xuICAgICAgICAgICAgY2FjaGVBcnJSZWZzKGZsdXNoQXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodXRpbF8xLmlzT2JqZWN0KG5leHQpKSB7XG4gICAgICAgICAgICBjYWNoZU9ialJlZnMoZmx1c2hBcmdzKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIE9iamVjdC5mcmVlemUoZW50aXR5KTtcbn07XG52YXIgY2FjaGVPYmpSZWZzID0gZnVuY3Rpb24gKGZsdXNoQXJncykge1xuICAgIGlmICh1dGlsXzEuaGFzVWlkKGZsdXNoQXJncy5lbnRpdHkpKSB7XG4gICAgICAgIGNhY2hlVWlkT2JqUmVmcyhmbHVzaEFyZ3MpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY2FjaGVFbnRpdHlSZWZzKGZsdXNoQXJncyk7XG4gICAgfVxufTtcbnZhciBjYWNoZVVpZE9ialJlZnMgPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgdmFyIHJlZkl0ZW0gPSBleHBvcnRzLmVuc3VyZUl0ZW0oZmx1c2hBcmdzKTtcbiAgICByZWZfMS5hc3NpZ25SZWZUb1BhcmVudChyZWZJdGVtLCBmbHVzaEFyZ3MpO1xuICAgIGlmIChnZXRfMS5pc09uQ2FjaGUoZmx1c2hBcmdzKSA9PT0gdHJ1ZSlcbiAgICAgICAgcmV0dXJuO1xuICAgIGV4cG9ydHMuYnVpbGRGbHVzaE1hcChmbHVzaEFyZ3MpO1xufTtcbnZhciBpc0RpcnR5ID0gZnVuY3Rpb24gKGZsdXNoQXJncykge1xuICAgIHZhciBjYWNoZWRJdGVtID0gZ2V0XzEuZ2V0Q2FjaGVkSXRlbShmbHVzaEFyZ3MuZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdLCBmbHVzaEFyZ3MuaW5zdGFuY2UpO1xuICAgIHJldHVybiAhY2FjaGVkSXRlbSB8fCBjYWNoZWRJdGVtLmVudGl0eSAhPT0gZmx1c2hBcmdzLmVudGl0eTtcbn07XG5leHBvcnRzLmdldEl0ZW1GbHVzaE9yQ2FjaGVkID0gZnVuY3Rpb24gKHVpZCwgZmx1c2hBcmdzKSB7XG4gICAgaWYgKHVpZCkge1xuICAgICAgICB1aWQgPSBTdHJpbmcodWlkKTtcbiAgICAgICAgdmFyIGl0ZW0gPSBmbHVzaEFyZ3MuZmx1c2hNYXAuZ2V0KHVpZCk7XG4gICAgICAgIGlmICghaXRlbSkge1xuICAgICAgICAgICAgaXRlbSA9IGdldF8xLmdldENhY2hlZEl0ZW0odWlkLCBmbHVzaEFyZ3MuaW5zdGFuY2UpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpdGVtICYmIE9iamVjdC5pc0Zyb3plbihpdGVtKSkge1xuICAgICAgICAgICAgaXRlbSA9IGl0ZW0uY2xvbmUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICB9XG59O1xuZXhwb3J0cy5lbnN1cmVJdGVtID0gZnVuY3Rpb24gKGZsdXNoQXJncykge1xuICAgIHZhciBpdGVtVWlkID0gU3RyaW5nKGZsdXNoQXJncy5lbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV0pO1xuICAgIHZhciBpdGVtID0gZmx1c2hBcmdzLmZsdXNoTWFwLmdldChpdGVtVWlkKTtcbiAgICBpZiAoaXRlbSkge1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICB9XG4gICAgdmFyIGxpdmUgPSBnZXRfMS5nZXRDYWNoZWRJdGVtKGl0ZW1VaWQsIGZsdXNoQXJncy5pbnN0YW5jZSk7XG4gICAgaXRlbSA9IG5ldyBDYWNoZUl0ZW1fMS5kZWZhdWx0KGZsdXNoQXJncy5lbnRpdHksIGxpdmUpO1xuICAgIGZsdXNoQXJncy5mbHVzaE1hcC5zZXQoaXRlbVVpZCwgaXRlbSk7XG4gICAgZmx1c2hBcmdzLmZsdXNoTWFwWydfX1VQREFURURfXyddID0gdHJ1ZTtcbiAgICByZXR1cm4gaXRlbTtcbn07XG5leHBvcnRzLnByZUZsdXNoID0gZnVuY3Rpb24gKGZsdXNoQXJncykge1xuICAgIHZhciB0ZW1wID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgIHZhciBjdXJyZW50U3RhY2sgPSBnZXRfMS5nZXRDYWNoZUN1cnJlbnRTdGFjayhmbHVzaEFyZ3MuaW5zdGFuY2UpO1xuICAgIGlmIChjdXJyZW50U3RhY2spIHtcbiAgICAgICAgY3VycmVudFN0YWNrLmZvckVhY2goZnVuY3Rpb24gKGtleSwgaXRlbSkge1xuICAgICAgICAgICAgdGVtcC5zZXQoa2V5LCBpdGVtKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZsdXNoQXJncy5mbHVzaE1hcC5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIGl0ZW0pIHtcbiAgICAgICAgdmFyIGl0ZW1VaWQgPSBpdGVtLmVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXTtcbiAgICAgICAgZnJlZXplSXRlbShpdGVtKTtcbiAgICAgICAgdGVtcC5zZXQoU3RyaW5nKGl0ZW1VaWQpLCBpdGVtKTtcbiAgICB9KTtcbiAgICBpZiAoZmx1c2hBcmdzLmV2aWN0TWFwLnNpemUoKSA+IDApIHtcbiAgICAgICAgZmx1c2hBcmdzLmV2aWN0TWFwLmZvckVhY2goZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHRlbXAuZGVsZXRlKFN0cmluZyhrZXkpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGV4cG9ydHMuZmx1c2godGVtcCwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbn07XG52YXIgZnJlZXplSXRlbSA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgT2JqZWN0LmZyZWV6ZShpdGVtKTtcbiAgICBPYmplY3QuZnJlZXplKGl0ZW0uZW50aXR5KTtcbiAgICBPYmplY3QuZnJlZXplKGl0ZW0ubWFwVG8pO1xuICAgIE9iamVjdC5mcmVlemUoaXRlbS5tYXBGcm9tKTtcbn07XG5leHBvcnRzLmZsdXNoID0gZnVuY3Rpb24gKHRlbXAsIGluc3RhbmNlKSB7XG4gICAgaWYgKHRlbXAgIT09IG51bGwpIHtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZSh0ZW1wKTtcbiAgICAgICAgdmFyIGNhY2hlTm9kZSA9IHV0aWxfMS5nZXROZXdDYWNoZU5vZGUoaW5zdGFuY2UpO1xuICAgICAgICBjYWNoZU5vZGUuaXRlbXMgPSB0ZW1wO1xuICAgICAgICBpZiAoaW5zdGFuY2UudGhyZWFkLm5vZGVzLmluZGV4T2YoY2FjaGVOb2RlLmlkKSA8IDApIHtcbiAgICAgICAgICAgIGluc3RhbmNlLnRocmVhZC5ub2Rlcy5wdXNoKGNhY2hlTm9kZS5pZCk7XG4gICAgICAgICAgICBpbnN0YW5jZS50aHJlYWQuY3VycmVudCArPSAxO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2ZsdXNoLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgY2FjaGVfMSA9IHJlcXVpcmUoXCIuL2NhY2hlXCIpO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG5leHBvcnRzLmdldEl0ZW0gPSBmdW5jdGlvbiAoZW50aXR5LCBpbnN0YW5jZSwgbm9kZUlkKSB7XG4gICAgaWYgKCFlbnRpdHkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9uZSBnZXQoKTogcmVxdWlyZXMgYSB1aWQgdG8gcmV0cmlldmUgYW4gaXRlbSBmcm9tIHRoZSBjYWNoZS5cIik7XG4gICAgfVxuICAgIGlmICh1dGlsXzEuaXNBcnJheShlbnRpdHkpKSB7XG4gICAgICAgIHJldHVybiBlbnRpdHkubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0T2JqZWN0KGl0ZW0sIGluc3RhbmNlKTtcbiAgICAgICAgfSkuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbSAhPT0gbnVsbCAmJiBpdGVtICE9PSB1bmRlZmluZWQ7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZ2V0T2JqZWN0KGVudGl0eSwgaW5zdGFuY2UpO1xufTtcbnZhciBnZXRPYmplY3QgPSBmdW5jdGlvbiAodWlkT3JFbnRpdHksIGluc3RhbmNlKSB7XG4gICAgdmFyIHJlYWxVaWQgPSBnZXRBY3R1YWxVaWQodWlkT3JFbnRpdHkpO1xuICAgIGlmICghcmVhbFVpZCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBpdGVtID0gZXhwb3J0cy5nZXRDYWNoZWRJdGVtKHJlYWxVaWQsIGluc3RhbmNlKTtcbiAgICByZXR1cm4gaXRlbSA/IGl0ZW0uZW50aXR5IDogdW5kZWZpbmVkO1xufTtcbmV4cG9ydHMuZ2V0RWRpdEl0ZW0gPSBmdW5jdGlvbiAob2JqLCBpbnN0YW5jZSwgbm9kZUlkKSB7XG4gICAgY29uc29sZS5sb2coXCJHRVQgRURJVCBJVEVNXCIpO1xuICAgIGlmICh1dGlsXzEuaXNBcnJheShvYmopKSB7XG4gICAgICAgIHJldHVybiBvYmoubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0RWRpdGFibGVPYmplY3QoaXRlbSwgaW5zdGFuY2UpO1xuICAgICAgICB9KS5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtICE9PSBudWxsICYmIGl0ZW0gIT09IHVuZGVmaW5lZDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBnZXRFZGl0YWJsZU9iamVjdChvYmosIGluc3RhbmNlKTtcbn07XG52YXIgZ2V0RWRpdGFibGVPYmplY3QgPSBmdW5jdGlvbiAodWlkT3JFbnRpdHksIGluc3RhbmNlKSB7XG4gICAgdmFyIHJlYWxVaWQgPSBnZXRBY3R1YWxVaWQodWlkT3JFbnRpdHkpO1xuICAgIHZhciBleGlzdGluZyA9IGV4cG9ydHMuZ2V0SXRlbShyZWFsVWlkLCBpbnN0YW5jZSk7XG4gICAgcmV0dXJuIGV4aXN0aW5nID8gdXRpbF8xLmRlZXBDbG9uZShleGlzdGluZywgdW5kZWZpbmVkLCBmYWxzZSkgOiB1bmRlZmluZWQ7XG59O1xudmFyIGdldEFjdHVhbFVpZCA9IGZ1bmN0aW9uICh1aWRPckVudGl0eSkge1xuICAgIGlmICh0eXBlb2YgdWlkT3JFbnRpdHkgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgcmV0dXJuIHVpZE9yRW50aXR5O1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgdWlkT3JFbnRpdHkgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZyh1aWRPckVudGl0eSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHV0aWxfMS5pc09iamVjdCh1aWRPckVudGl0eSkpIHtcbiAgICAgICAgaWYgKHV0aWxfMS5oYXNVaWQodWlkT3JFbnRpdHkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdWlkT3JFbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV07XG4gICAgICAgIH1cbiAgICB9XG59O1xuZXhwb3J0cy5pc09uQ2FjaGUgPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgdmFyIHVpZCA9IGZsdXNoQXJncy5lbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV07XG4gICAgdmFyIGV4aXN0aW5nSXRlbSA9IGV4cG9ydHMuZ2V0Q2FjaGVkSXRlbSh1aWQsIGZsdXNoQXJncy5pbnN0YW5jZSk7XG4gICAgcmV0dXJuIGV4aXN0aW5nSXRlbSAmJiBleGlzdGluZ0l0ZW0uZW50aXR5ID09PSBmbHVzaEFyZ3MuZW50aXR5O1xufTtcbmV4cG9ydHMuZ2V0Q2FjaGVkSXRlbSA9IGZ1bmN0aW9uICh1aWQsIGluc3RhbmNlKSB7XG4gICAgdmFyIGN1cnJlbnROb2RlID0gZ2V0Q3VycmVudE5vZGUoaW5zdGFuY2UpO1xuICAgIHJldHVybiBjdXJyZW50Tm9kZSA/IGN1cnJlbnROb2RlLml0ZW1zLmdldChTdHJpbmcodWlkKSkgOiB1bmRlZmluZWQ7XG59O1xuZnVuY3Rpb24gZ2V0Q3VycmVudE5vZGUoaW5zdGFuY2UpIHtcbiAgICB2YXIgY3VycmVudE5vZGVJZCA9IGluc3RhbmNlLnRocmVhZC5ub2Rlc1tpbnN0YW5jZS50aHJlYWQuY3VycmVudF07XG4gICAgcmV0dXJuIGN1cnJlbnROb2RlSWQgPj0gMCA/IGdldFJlcG9Ob2RlKGN1cnJlbnROb2RlSWQsIGluc3RhbmNlLnJlcG8pIDogdW5kZWZpbmVkO1xufVxuZnVuY3Rpb24gZ2V0UmVwb05vZGUobm9kZUlkLCByZXBvKSB7XG4gICAgcmV0dXJuIHJlcG8uZ2V0KG5vZGVJZCk7XG59XG5leHBvcnRzLmdldENhY2hlQ3VycmVudFN0YWNrID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgdmFyIGN1cnJlbnROb2RlID0gZ2V0Q3VycmVudE5vZGUoaW5zdGFuY2UpO1xuICAgIHJldHVybiBjdXJyZW50Tm9kZSA/IGN1cnJlbnROb2RlLml0ZW1zIDogdW5kZWZpbmVkO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2dldC50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG5mdW5jdGlvbiBnZXRLZXkoa2V5KSB7XG4gICAgdmFyIGludEtleSA9IHBhcnNlSW50KGtleSk7XG4gICAgaWYgKGludEtleS50b1N0cmluZygpID09PSBrZXkpIHtcbiAgICAgICAgcmV0dXJuIGludEtleTtcbiAgICB9XG4gICAgcmV0dXJuIGtleTtcbn1cbmZ1bmN0aW9uIGRlbChvYmosIHBhdGgpIHtcbiAgICBpZiAodXRpbF8xLmlzTnVtYmVyKHBhdGgpKSB7XG4gICAgICAgIHBhdGggPSBbcGF0aF07XG4gICAgfVxuICAgIGlmICh1dGlsXzEuaXNFbXB0eShvYmopKSB7XG4gICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfVxuICAgIGlmICh1dGlsXzEuaXNFbXB0eShwYXRoKSkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBpZiAodXRpbF8xLmlzU3RyaW5nKHBhdGgpKSB7XG4gICAgICAgIHJldHVybiBkZWwob2JqLCBwYXRoLnNwbGl0KCcuJykpO1xuICAgIH1cbiAgICB2YXIgY3VycmVudFBhdGggPSBnZXRLZXkocGF0aFswXSk7XG4gICAgdmFyIG9sZFZhbCA9IG9ialtjdXJyZW50UGF0aF07XG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGlmIChvbGRWYWwgIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgaWYgKHV0aWxfMS5pc0FycmF5KG9iaikpIHtcbiAgICAgICAgICAgICAgICBvYmouc3BsaWNlKGN1cnJlbnRQYXRoLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBvYmpbY3VycmVudFBhdGhdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAob2JqW2N1cnJlbnRQYXRoXSAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVsKG9ialtjdXJyZW50UGF0aF0sIHBhdGguc2xpY2UoMSkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG59XG5leHBvcnRzLmRlbCA9IGRlbDtcbmZ1bmN0aW9uIGdldChvYmosIHBhdGgsIGRlZmF1bHRWYWx1ZSkge1xuICAgIGlmICh1dGlsXzEuaXNOdW1iZXIocGF0aCkpIHtcbiAgICAgICAgcGF0aCA9IFtwYXRoXTtcbiAgICB9XG4gICAgaWYgKHV0aWxfMS5pc0VtcHR5KHBhdGgpKSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICAgIGlmICh1dGlsXzEuaXNFbXB0eShvYmopKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgfVxuICAgIGlmICh1dGlsXzEuaXNTdHJpbmcocGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIGdldChvYmosIHBhdGguc3BsaXQoJy4nKSwgZGVmYXVsdFZhbHVlKTtcbiAgICB9XG4gICAgdmFyIGN1cnJlbnRQYXRoID0gZ2V0S2V5KHBhdGhbMF0pO1xuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBpZiAob2JqW2N1cnJlbnRQYXRoXSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmpbY3VycmVudFBhdGhdO1xuICAgIH1cbiAgICByZXR1cm4gZ2V0KG9ialtjdXJyZW50UGF0aF0sIHBhdGguc2xpY2UoMSksIGRlZmF1bHRWYWx1ZSk7XG59XG5leHBvcnRzLmdldCA9IGdldDtcbmV4cG9ydHMuY29uY2F0UHJvcCA9IGZ1bmN0aW9uIChwcm9wQ2hhaW4sIHByb3ApIHtcbiAgICBpZiAocHJvcENoYWluID09PSBcIlwiKSB7XG4gICAgICAgIHByb3BDaGFpbiA9IHByb3A7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBwcm9wQ2hhaW4gPSBwcm9wQ2hhaW4gKyBcIi5cIiArIHByb3A7XG4gICAgfVxuICAgIHJldHVybiBwcm9wQ2hhaW47XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcGF0aC50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIENhY2hlTWFwXzEgPSByZXF1aXJlKFwiLi9DYWNoZU1hcFwiKTtcbnZhciBDYWNoZUl0ZW0gPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENhY2hlSXRlbShlbnRpdHksIGxpdmVJdGVtKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuY2xvbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IENhY2hlSXRlbShfdGhpcy5lbnRpdHksIF90aGlzKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XG4gICAgICAgIGlmIChsaXZlSXRlbSkge1xuICAgICAgICAgICAgdGhpcy5tYXBGcm9tID0gbGl2ZUl0ZW0ubWFwRnJvbS5jbG9uZSgpO1xuICAgICAgICAgICAgdGhpcy5tYXBUbyA9IGxpdmVJdGVtLm1hcFRvLmNsb25lKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm1hcEZyb20gPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLm1hcFRvID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBDYWNoZUl0ZW07XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ2FjaGVJdGVtO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2FjaGVJdGVtLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgY2FjaGVfMSA9IHJlcXVpcmUoXCIuL2NhY2hlXCIpO1xuZXhwb3J0cy5wcmludENhY2hlID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgdmFyIHJlc3VsdCA9IFwiXCI7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgY3VycmVudCA9IGluc3RhbmNlLnRocmVhZC5jdXJyZW50O1xuICAgIHZhciBub2RlSW5kaWNlcyA9IGluc3RhbmNlLnRocmVhZC5ub2RlcztcbiAgICBub2RlSW5kaWNlcy5tYXAoZnVuY3Rpb24gKGNhY2hlTm9kZUlkKSB7XG4gICAgICAgIHZhciBjYWNoZU5vZGUgPSBpbnN0YW5jZS5yZXBvLmdldChjYWNoZU5vZGVJZCk7XG4gICAgICAgIHZhciBzdHJlYW1EYXRhID0gXCJcIjtcbiAgICAgICAgdmFyIHN0YXRlID0gaW5kZXggKyBcIjpcIiArIHN0cmVhbURhdGEgKyBcIltcIiArIHN0cmluZ2lmeU1hcChjYWNoZU5vZGUuaXRlbXMpICsgXCJdXFxuXFxuXCI7XG4gICAgICAgIGlmIChpbmRleCA9PT0gY3VycmVudCkge1xuICAgICAgICAgICAgc3RhdGUgPSBcIi0+IFwiICsgc3RhdGU7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ICs9IHN0YXRlO1xuICAgICAgICBpbmRleCsrO1xuICAgIH0pO1xuICAgIHJlc3VsdCA9IHJlc3VsdC5zdWJzdHJpbmcoMCwgKHJlc3VsdC5sZW5ndGggLSAyKSk7XG4gICAgaW5kZXggPSAwO1xuICAgIHJldHVybiBcIlxcbi0tLS0tLSBPbmUgLS0tLS0tLVwiXG4gICAgICAgICsgXCJcXG5TVEFDSzpcXG5cIiArIHJlc3VsdFxuICAgICAgICArIFwiXFxuXFxuQ09ORklHOlwiICsgSlNPTi5zdHJpbmdpZnkoY2FjaGVfMS5jb25maWcsIG51bGwsIDIpXG4gICAgICAgICsgXCJcXG5cXG5SRVBPIFNJWkU6XCIgKyBpbnN0YW5jZS5yZXBvLmxlbmd0aFxuICAgICAgICArIFwiXFxuPT09PT09PT09PT09PT09PT09PVxcblwiO1xufTtcbnZhciBzdHJpbmdpZnlNYXAgPSBmdW5jdGlvbiAobWFwKSB7XG4gICAgdmFyIHJlc3VsdCA9IFwiXCI7XG4gICAgbWFwLmZvckVhY2goZnVuY3Rpb24gKGtleSwgaXRlbSkge1xuICAgICAgICB2YXIgaXRlbVJlc3VsdCA9IEpTT04uc3RyaW5naWZ5KGl0ZW0sIG51bGwsIDIpO1xuICAgICAgICByZXN1bHQgKz0gaXRlbVJlc3VsdCArIFwiLFxcblwiO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcHJpbnQudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBDYWNoZVJlcG9fMSA9IHJlcXVpcmUoXCIuL0NhY2hlUmVwb1wiKTtcbnZhciBDYWNoZVRocmVhZF8xID0gcmVxdWlyZShcIi4vQ2FjaGVUaHJlYWRcIik7XG52YXIgQ2FjaGVJbnN0YW5jZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2FjaGVJbnN0YW5jZShuYW1lKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMucmVwbyA9IG5ldyBDYWNoZVJlcG9fMS5kZWZhdWx0KCk7XG4gICAgICAgIHRoaXMudGhyZWFkID0gbmV3IENhY2hlVGhyZWFkXzEuZGVmYXVsdCgpO1xuICAgICAgICB0aGlzLm5leHROb2RlS2V5ID0gMDtcbiAgICAgICAgdGhpcy5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzLnJlcG8gPSBuZXcgQ2FjaGVSZXBvXzEuZGVmYXVsdCgpO1xuICAgICAgICAgICAgX3RoaXMudGhyZWFkID0gbmV3IENhY2hlVGhyZWFkXzEuZGVmYXVsdCgpO1xuICAgICAgICAgICAgX3RoaXMubmV4dE5vZGVLZXkgPSAwO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmFkZE5vZGUgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgaWYgKF90aGlzLnJlcG8uYWRkKG5vZGUpKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMudGhyZWFkLmFkZE5vZGUobm9kZS5pZCk7XG4gICAgICAgICAgICAgICAgX3RoaXMubmV4dE5vZGVLZXkrKztcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5sZW5ndGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMudGhyZWFkLm5vZGVzLmxlbmd0aDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLnJlcG8ubGVuZ3RoO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIH1cbiAgICByZXR1cm4gQ2FjaGVJbnN0YW5jZTtcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDYWNoZUluc3RhbmNlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2FjaGVJbnN0YW5jZS50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIENhY2hlTWFwXzEgPSByZXF1aXJlKFwiLi9DYWNoZU1hcFwiKTtcbnZhciBDYWNoZVJlcG8gPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENhY2hlUmVwbygpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5pdGVtcyA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLmdldCA9IGZ1bmN0aW9uIChub2RlSWQpIHsgcmV0dXJuIChfdGhpcy5pdGVtcy5nZXQobm9kZUlkKSk7IH07XG4gICAgICAgIHRoaXMuYWRkID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIGlmICghX3RoaXMuaXRlbXMuaGFzKG5vZGUuaWQpKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuaXRlbXMuc2V0KG5vZGUuaWQsIG5vZGUpO1xuICAgICAgICAgICAgICAgIF90aGlzLmxlbmd0aCsrO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmRlbGV0ZSA9IGZ1bmN0aW9uIChub2RlSWQpIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5pdGVtcy5oYXMobm9kZUlkKSkge1xuICAgICAgICAgICAgICAgIF90aGlzLml0ZW1zLmRlbGV0ZShub2RlSWQpO1xuICAgICAgICAgICAgICAgIF90aGlzLmxlbmd0aC0tO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gQ2FjaGVSZXBvO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IENhY2hlUmVwbztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NhY2hlUmVwby50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIENhY2hlVGhyZWFkID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDYWNoZVRocmVhZCgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gLTE7XG4gICAgICAgIHRoaXMubm9kZXMgPSBbXTtcbiAgICAgICAgdGhpcy5hZGROb2RlID0gZnVuY3Rpb24gKG5vZGVJZCkge1xuICAgICAgICAgICAgX3RoaXMubm9kZXMucHVzaChub2RlSWQpO1xuICAgICAgICAgICAgX3RoaXMuY3VycmVudCsrO1xuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gQ2FjaGVUaHJlYWQ7XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ2FjaGVUaHJlYWQ7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DYWNoZVRocmVhZC50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG52YXIgY2FjaGVfMSA9IHJlcXVpcmUoXCIuL2NhY2hlXCIpO1xudmFyIGdldF8xID0gcmVxdWlyZShcIi4vZ2V0XCIpO1xudmFyIENhY2hlTWFwXzEgPSByZXF1aXJlKFwiLi9DYWNoZU1hcFwiKTtcbnZhciBvcGF0aCA9IHJlcXVpcmUoXCIuL3BhdGhcIik7XG52YXIgZmx1c2hfMSA9IHJlcXVpcmUoXCIuL2ZsdXNoXCIpO1xudmFyIGxvY2F0ZV8xID0gcmVxdWlyZShcIi4vbG9jYXRlXCIpO1xudmFyIHJlZl8xID0gcmVxdWlyZShcIi4vcmVmXCIpO1xuZXhwb3J0cy5ldmljdEl0ZW0gPSBmdW5jdGlvbiAob2JqLCBpbnN0YW5jZSkge1xuICAgIHZhciB1aWRBcnJheSA9IGJ1aWxkRXZpY3RVaWRBcnJheShvYmopO1xuICAgIGlmICh1aWRBcnJheS5sZW5ndGggPT0gMCkge1xuICAgICAgICByZXR1cm4gbG9jYXRlXzEuZ2V0Q2FsbFN0YXRzKGZhbHNlLCBpbnN0YW5jZSk7XG4gICAgfVxuICAgIHZhciBjdXJyZW50U3RhdGUgPSBnZXRfMS5nZXRDYWNoZUN1cnJlbnRTdGFjayhpbnN0YW5jZSk7XG4gICAgdmFyIGZvdW5kID0gdWlkQXJyYXkuc29tZShmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICByZXR1cm4gY3VycmVudFN0YXRlICYmIGN1cnJlbnRTdGF0ZS5oYXMoU3RyaW5nKGl0ZW0pKTtcbiAgICB9KTtcbiAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgIHJldHVybiBsb2NhdGVfMS5nZXRDYWxsU3RhdHMoZmFsc2UsIGluc3RhbmNlKTtcbiAgICB9XG4gICAgdmFyIHRlbXBTdGF0ZSA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICBjdXJyZW50U3RhdGUuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICB0ZW1wU3RhdGUuc2V0KGtleSwgdmFsdWUpO1xuICAgIH0pO1xuICAgIHZhciBmbHVzaE1hcCA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICB2YXIgZXZpY3RNYXAgPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgdmFyIGZsdXNoQXJncyA9IHtcbiAgICAgICAgZmx1c2hNYXA6IGZsdXNoTWFwLFxuICAgICAgICBldmljdE1hcDogZXZpY3RNYXAsXG4gICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZVxuICAgIH07XG4gICAgdmFyIHBhcmVudHNDaGFuZ2VkID0gW107XG4gICAgdWlkQXJyYXkuZm9yRWFjaChmdW5jdGlvbiAodWlkKSB7XG4gICAgICAgIGZsdXNoQXJncy5lbnRpdHlVaWQgPSB1aWQ7XG4gICAgICAgIGNsZWFyVGFyZ2V0UmVmRnJvbXMoZmx1c2hBcmdzKTtcbiAgICAgICAgZXZpY3RNYXAuc2V0KHVpZCwgbnVsbCk7XG4gICAgICAgIGNsZWFyUGFyZW50UmVmVG9zKHVpZEFycmF5LCBwYXJlbnRzQ2hhbmdlZCwgZmx1c2hBcmdzKTtcbiAgICB9KTtcbiAgICBwdXRQYXJlbnRzQ2hhbmdlZChwYXJlbnRzQ2hhbmdlZCwgZmx1c2hNYXAsIGV2aWN0TWFwLCBpbnN0YW5jZSk7XG4gICAgZmx1c2hNYXAuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgIHRlbXBTdGF0ZS5zZXQoa2V5LCBpdGVtKTtcbiAgICB9KTtcbiAgICBldmljdE1hcC5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIGl0ZW0pIHtcbiAgICAgICAgdGVtcFN0YXRlLmRlbGV0ZShrZXkpO1xuICAgIH0pO1xuICAgIGZsdXNoXzEuZmx1c2godGVtcFN0YXRlLCBpbnN0YW5jZSk7XG4gICAgcmV0dXJuIGxvY2F0ZV8xLmdldENhbGxTdGF0cyh0cnVlLCBpbnN0YW5jZSk7XG59O1xudmFyIHB1dFBhcmVudHNDaGFuZ2VkID0gZnVuY3Rpb24gKHBhcmVudHNDaGFuZ2VkLCBmbHVzaE1hcCwgZXZpY3RNYXAsIGluc3RhbmNlKSB7XG4gICAgaWYgKHBhcmVudHNDaGFuZ2VkICYmIHBhcmVudHNDaGFuZ2VkLmxlbmd0aCA+IDAgJiYgdXRpbF8xLmNhY2hlU2l6ZShpbnN0YW5jZSkgPiAwKSB7XG4gICAgICAgIHZhciBmbHVzaEFyZ3NfMSA9IHtcbiAgICAgICAgICAgIGZsdXNoTWFwOiBmbHVzaE1hcCxcbiAgICAgICAgICAgIGV2aWN0TWFwOiBldmljdE1hcCxcbiAgICAgICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZVxuICAgICAgICB9O1xuICAgICAgICBmbHVzaF8xLmJ1aWxkRmx1c2hNYXAoZmx1c2hBcmdzXzEpO1xuICAgICAgICBmbHVzaEFyZ3NfMS5mbHVzaE1hcC5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIGl0ZW0pIHtcbiAgICAgICAgICAgIHJlZl8xLnVwZGF0ZVJlZkZyb21zKGl0ZW0sIGZsdXNoQXJnc18xKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbnZhciBjbGVhclRhcmdldFJlZkZyb21zID0gZnVuY3Rpb24gKGZsdXNoQXJncykge1xuICAgIHZhciBpdGVtID0gZ2V0XzEuZ2V0Q2FjaGVkSXRlbShmbHVzaEFyZ3MuZW50aXR5VWlkLCBmbHVzaEFyZ3MuaW5zdGFuY2UpO1xuICAgIGlmIChpdGVtKSB7XG4gICAgICAgIGl0ZW0ubWFwVG8uZm9yRWFjaChmdW5jdGlvbiAodG9VaWQsIHBhdGhzKSB7XG4gICAgICAgICAgICB2YXIgcmVmSXRlbSA9IGZsdXNoXzEuZ2V0SXRlbUZsdXNoT3JDYWNoZWQodG9VaWQsIGZsdXNoQXJncyk7XG4gICAgICAgICAgICBpZiAocmVmSXRlbSkge1xuICAgICAgICAgICAgICAgIGNsZWFyUmVmRnJvbShyZWZJdGVtLCBmbHVzaEFyZ3MuZW50aXR5VWlkKTtcbiAgICAgICAgICAgICAgICBpZiAocmVmSXRlbS5tYXBGcm9tLnNpemUoKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZW50aXR5VWlkID0gdG9VaWQ7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGFyZ2V0UmVmRnJvbXMoZmx1c2hBcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgZmx1c2hBcmdzLmV2aWN0TWFwLnNldCh0b1VpZCwgcmVmSXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZmx1c2hNYXAuc2V0KHRvVWlkLCByZWZJdGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG52YXIgY2xlYXJSZWZGcm9tID0gZnVuY3Rpb24gKHJlZkl0ZW0sIHBhcmVudFVpZCkge1xuICAgIHZhciByZWZzQXJyYXkgPSByZWZJdGVtLm1hcEZyb20uZ2V0KHBhcmVudFVpZCk7XG4gICAgaWYgKCFyZWZzQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZWZJdGVtLm1hcEZyb20gPSByZWZJdGVtLm1hcEZyb20uY2xvbmUoKTtcbiAgICByZWZJdGVtLm1hcEZyb20uZGVsZXRlKHBhcmVudFVpZCk7XG59O1xudmFyIGNsZWFyUGFyZW50UmVmVG9zID0gZnVuY3Rpb24gKHVpZEFycmF5LCBwYXJlbnRzQ2hhbmdlZCwgZmx1c2hBcmdzKSB7XG4gICAgdmFyIGl0ZW0gPSBmbHVzaF8xLmdldEl0ZW1GbHVzaE9yQ2FjaGVkKGZsdXNoQXJncy5lbnRpdHlVaWQsIGZsdXNoQXJncyk7XG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgaXRlbS5tYXBGcm9tLmZvckVhY2goZnVuY3Rpb24gKHBhcmVudFVpZCwgcGF0aHMpIHtcbiAgICAgICAgICAgIHZhciBwYXJlbnRJdGVtID0gZmx1c2hfMS5nZXRJdGVtRmx1c2hPckNhY2hlZChwYXJlbnRVaWQsIGZsdXNoQXJncyk7XG4gICAgICAgICAgICBpZiAocGFyZW50SXRlbSkge1xuICAgICAgICAgICAgICAgIHZhciBzdWNjZXNzID0gY2xlYXJSZWZUbyhwYXJlbnRJdGVtLCBmbHVzaEFyZ3MuZW50aXR5VWlkLCBmbHVzaEFyZ3MuaW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgIGlmIChzdWNjZXNzID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGZsdXNoQXJncy5mbHVzaE1hcC5zZXQocGFyZW50VWlkLCBwYXJlbnRJdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVpZEFycmF5LmluZGV4T2YocGFyZW50VWlkKSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudHNDaGFuZ2VkLnB1c2gocGFyZW50SXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG52YXIgY2xlYXJSZWZUbyA9IGZ1bmN0aW9uIChwYXJlbnRJdGVtLCByZWZVaWQsIGluc3RhbmNlKSB7XG4gICAgdmFyIHBhcmVudCA9IHBhcmVudEl0ZW0uZW50aXR5O1xuICAgIGlmIChPYmplY3QuaXNGcm96ZW4ocGFyZW50KSkge1xuICAgICAgICBwYXJlbnQgPSBnZXRfMS5nZXRFZGl0SXRlbShwYXJlbnRbY2FjaGVfMS5jb25maWcudWlkTmFtZV0sIGluc3RhbmNlKTtcbiAgICAgICAgcGFyZW50SXRlbS5lbnRpdHkgPSBwYXJlbnQ7XG4gICAgfVxuICAgIHZhciByZWZQYXRocyA9IHBhcmVudEl0ZW0ubWFwVG8uZ2V0KHJlZlVpZCk7XG4gICAgcmVmUGF0aHMuZm9yRWFjaChmdW5jdGlvbiAocGF0aCkge1xuICAgICAgICBvcGF0aC5kZWwocGFyZW50LCBwYXRoKTtcbiAgICB9KTtcbiAgICBpZiAoIU9iamVjdC5pc0Zyb3plbihwYXJlbnQpKSB7XG4gICAgICAgIE9iamVjdC5mcmVlemUocGFyZW50KTtcbiAgICB9XG4gICAgcGFyZW50SXRlbS5lbnRpdHkgPSBwYXJlbnQ7XG4gICAgcGFyZW50SXRlbS5tYXBUbyA9IHBhcmVudEl0ZW0ubWFwVG8uY2xvbmUoKTtcbiAgICBwYXJlbnRJdGVtLm1hcFRvLmRlbGV0ZShyZWZVaWQpO1xuICAgIHJldHVybiB0cnVlO1xufTtcbnZhciBidWlsZEV2aWN0VWlkQXJyYXkgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgdmFyIHVpZEFycmF5ID0gW107XG4gICAgaWYgKHV0aWxfMS5pc0FycmF5KG9iaikpIHtcbiAgICAgICAgb2JqLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIGlmICh1dGlsXzEuaGFzVWlkKGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgdWlkQXJyYXkucHVzaChTdHJpbmcoaXRlbVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpdGVtID09PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBpdGVtID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHVpZEFycmF5LnB1c2goU3RyaW5nKGl0ZW0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdmFyIHVpZCA9IG9iajtcbiAgICAgICAgaWYgKHV0aWxfMS5pc09iamVjdChvYmopKSB7XG4gICAgICAgICAgICB1aWQgPSBvYmpbY2FjaGVfMS5jb25maWcudWlkTmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVpZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdWlkQXJyYXk7XG4gICAgICAgIH1cbiAgICAgICAgdWlkQXJyYXkucHVzaChTdHJpbmcodWlkKSk7XG4gICAgfVxuICAgIHJldHVybiB1aWRBcnJheTtcbn07XG5leHBvcnRzLmNsZWFyTmV4dCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIHZhciB0aHJlYWQgPSBpbnN0YW5jZS50aHJlYWQ7XG4gICAgaWYgKHRocmVhZC5jdXJyZW50IDwgdGhyZWFkLm5vZGVzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgdmFyIHJlbW92ZWROb2RlcyA9IHRocmVhZC5ub2Rlcy5zbGljZSh0aHJlYWQuY3VycmVudCArIDEsIHRocmVhZC5ub2Rlcy5sZW5ndGgpO1xuICAgICAgICB0aHJlYWQubm9kZXMgPSB0aHJlYWQubm9kZXMuc2xpY2UoMCwgdGhyZWFkLmN1cnJlbnQgKyAxKTtcbiAgICAgICAgdGhyZWFkLmN1cnJlbnQgPSB0aHJlYWQubm9kZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgdHJ1bmNhdGVUaHJlYWRzKHJlbW92ZWROb2RlcywgaW5zdGFuY2UpO1xuICAgIH1cbn07XG52YXIgdHJ1bmNhdGVUaHJlYWRzID0gZnVuY3Rpb24gKHJlbW92ZWROb2RlcywgaW5zdGFuY2UpIHtcbiAgICByZW1vdmVkTm9kZXMuZm9yRWFjaChmdW5jdGlvbiAoY2FjaGVOb2RlSWQpIHtcbiAgICAgICAgdmFyIGNhY2hlTm9kZSA9IGluc3RhbmNlLnJlcG8uZ2V0KGNhY2hlTm9kZUlkKTtcbiAgICAgICAgaWYgKGNhY2hlTm9kZSkge1xuICAgICAgICAgICAgaW5zdGFuY2UucmVwby5kZWxldGUoY2FjaGVOb2RlSWQpO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZXZpY3QudHMiXSwic291cmNlUm9vdCI6IiJ9