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
	(function () {
	    cache_1.getCache();
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
	    var refFrom = function (uid) {
	        var item = get_1.getCachedItem(uid, instance);
	        return item.mapFrom;
	    };
	    var refTo = function (uid) {
	        var item = get_1.getCachedItem(uid, instance);
	        return item.mapTo;
	    };
	    var result = {
	        put: put,
	        get: get,
	        getEdit: getEdit,
	        evict: evict,
	        reset: reset,
	        size: size,
	        length: length,
	        print: print,
	        refTo: refTo,
	        refFrom: refFrom
	    };
	    if (cacheTest === false) {
	        delete result.refTo;
	        delete result.refFrom;
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
	            } else {
	                console.log(value);
	                result[propName] = value;
	            }
	        }
	    }
	    if (freeze === true && !Object.isFrozen(result)) {
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
	    console.log("UPDATE REF FROMS", item);
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
	    console.log("UPDATE REF TOS", item);
	    if (item) {
	        item.mapTo.forEach(function (toUid, paths) {
	            console.log("ITERATING", toUid);
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
	    var exists = get_1.isOnCache(flushArgs);
	    if (exists === true) {
	        return;
	    }
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
	    console.log("CONCAT PROP", propChain, prop);
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
	    console.log(uidArray);
	    uidArray.forEach(function (uid) {
	        flushArgs.entityUid = uid;
	        clearTargetRefFroms(flushArgs);
	        evictMap.set(uid, null);
	        clearParentRefTos(uidArray, parentsChanged, flushArgs);
	    });
	    putParentsChanged(parentsChanged, flushMap, evictMap, instance);
	    console.log(parentsChanged);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZTYyMTJiOGM5Y2VkYTk3ODc1MmMiLCJ3ZWJwYWNrOi8vLy4uLy4uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi4vLi4vc3JjL2NhY2hlLnRzIiwid2VicGFjazovLy8uLi8uLi9zcmMvY29uZmlnLnRzIiwid2VicGFjazovLy8uLi8uLi9zcmMvcHV0LnRzIiwid2VicGFjazovLy8uLi8uLi9zcmMvQ2FjaGVNYXAudHMiLCJ3ZWJwYWNrOi8vLy4uL34vb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi4vLi4vc3JjL2xvY2F0ZS50cyIsIndlYnBhY2s6Ly8vLi4vLi4vc3JjL3V0aWwudHMiLCJ3ZWJwYWNrOi8vLy4uLy4uL3NyYy9DYWNoZU5vZGUudHMiLCJ3ZWJwYWNrOi8vLy4uLy4uL3NyYy9yZWYudHMiLCJ3ZWJwYWNrOi8vLy4uLy4uL3NyYy9mbHVzaC50cyIsIndlYnBhY2s6Ly8vLi4vLi4vc3JjL2dldC50cyIsIndlYnBhY2s6Ly8vLi4vLi4vc3JjL3BhdGgudHMiLCJ3ZWJwYWNrOi8vLy4uLy4uL3NyYy9DYWNoZUl0ZW0udHMiLCJ3ZWJwYWNrOi8vLy4uLy4uL3NyYy9wcmludC50cyIsIndlYnBhY2s6Ly8vLi4vLi4vc3JjL0NhY2hlSW5zdGFuY2UudHMiLCJ3ZWJwYWNrOi8vLy4uLy4uL3NyYy9DYWNoZVJlcG8udHMiLCJ3ZWJwYWNrOi8vLy4uLy4uL3NyYy9DYWNoZVRocmVhZC50cyIsIndlYnBhY2s6Ly8vLi4vLi4vc3JjL2V2aWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7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RTtBQUNkLG9CQUNWO0FBQUM7QUFDTyxrQkFBSyxLQUFPLE9BQ3hCO0FBQUM7QUFDSyxZQUNWO0FBQUU7QUFVVyxTQUFTLFlBQUcsVUFBeUI7QUFFOUMsU0FBVSxTQUFXLFNBQVE7QUFDMUIsU0FBTyxPQUFRLFVBQVMsT0FBTSxNQUFPLFNBQUssR0FBRTtBQUMzQyxhQUFnQixlQUFTLE9BQU0sTUFBTSxNQUFPLE9BQVEsVUFBSSxHQUFRLE9BQU0sTUFBUztBQUN6RSxnQkFBTSxRQUFTLE9BQU0sTUFBTSxNQUFFLEdBQVEsT0FBUSxVQUFNO0FBQ25ELGdCQUFRLFVBQVMsT0FBTSxNQUFPLFNBQUs7QUFDMUIseUJBQWEsY0FDaEM7QUFDSjtBQUFFO0FBTUYsS0FBcUIsa0JBQUcsVUFBYSxjQUEwQjtBQUMvQyxrQkFBUSxRQUFDLFVBQVc7QUFDNUIsYUFBYSxZQUFXLFNBQUssS0FBSSxJQUFjO0FBQzVDLGFBQVcsV0FBRTtBQUNKLHNCQUFLLEtBQU8sT0FDeEI7QUFDSjtBQUNKO0FBQUUsRyIsImZpbGUiOiJvbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBlNjIxMmI4YzljZWRhOTc4NzUyYyIsIlwidXNlIHN0cmljdFwiO1xudmFyIGNhY2hlXzEgPSByZXF1aXJlKCcuL2NhY2hlJyk7XG5leHBvcnRzLmdldENhY2hlID0gY2FjaGVfMS5nZXRDYWNoZTtcbihmdW5jdGlvbiAoKSB7XG4gICAgY2FjaGVfMS5nZXRDYWNoZSgpO1xufSkoKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWFXNWtaWGd1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sY3lJNld5SXVMaTh1TGk5emNtTXZhVzVrWlhndWRITWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqdEJRVU5CTEhOQ1FVRjVRaXhUUVVGVExFTkJRVU1zUTBGQlFUdEJRVTh2UWl4blFrRkJVVHRCUVV4YUxFTkJRVU03U1VGRFJ5eG5Ra0ZCVVN4RlFVRkZMRU5CUVVNN1FVRkRaaXhEUVVGRExFTkJRVU1zUlVGQlJTeERRVUZETzBGQlNVb2lmUT09XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uLy4uL3NyYy9pbmRleC50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIGNvbmZpZ18xID0gcmVxdWlyZSgnLi9jb25maWcnKTtcbnZhciBwdXRfMSA9IHJlcXVpcmUoJy4vcHV0Jyk7XG52YXIgcHJpbnRfMSA9IHJlcXVpcmUoJy4vcHJpbnQnKTtcbnZhciBDYWNoZUluc3RhbmNlXzEgPSByZXF1aXJlKCcuL0NhY2hlSW5zdGFuY2UnKTtcbnZhciB1dGlsXzEgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciBnZXRfMSA9IHJlcXVpcmUoJy4vZ2V0Jyk7XG52YXIgZXZpY3RfMSA9IHJlcXVpcmUoJy4vZXZpY3QnKTtcbnZhciBjYWNoZVRlc3QgPSBmYWxzZTtcbmZ1bmN0aW9uIHNldFRlc3RpbmcodGVzdGluZykge1xuICAgIGNhY2hlVGVzdCA9IHRlc3Rpbmc7XG59XG5leHBvcnRzLnNldFRlc3RpbmcgPSBzZXRUZXN0aW5nO1xuZnVuY3Rpb24gZ2V0Q2FjaGUoaW5zdGFuY2VOYW1lLCBjb25maWd1cmF0aW9uKSB7XG4gICAgaWYgKGluc3RhbmNlTmFtZSA9PT0gdm9pZCAwKSB7IGluc3RhbmNlTmFtZSA9IFwib25lXCI7IH1cbiAgICBpZiAoY29uZmlndXJhdGlvbiA9PT0gdm9pZCAwKSB7IGNvbmZpZ3VyYXRpb24gPSBjb25maWdfMS5kZWZhdWx0Q29uZmlnOyB9XG4gICAgaWYgKCFleHBvcnRzLmNvbmZpZyAmJiAhZXhwb3J0cy5pbnN0YW5jZXMpIHtcbiAgICAgICAgZXhwb3J0cy5jb25maWcgPSBjb25maWdfMS5jb25maWd1cmUoY29uZmlndXJhdGlvbik7XG4gICAgfVxuICAgIGlmICghZXhwb3J0cy5pbnN0YW5jZXMpIHtcbiAgICAgICAgZXhwb3J0cy5pbnN0YW5jZXMgPSB7fTtcbiAgICB9XG4gICAgaWYgKCFleHBvcnRzLmluc3RhbmNlc1tpbnN0YW5jZU5hbWVdKSB7XG4gICAgICAgIGV4cG9ydHMuaW5zdGFuY2VzW2luc3RhbmNlTmFtZV0gPSBjcmVhdGVDYWNoZShpbnN0YW5jZU5hbWUpO1xuICAgIH1cbiAgICBpZiAod2luZG93KSB7XG4gICAgICAgIGlmICh3aW5kb3dbaW5zdGFuY2VOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB3aW5kb3dbaW5zdGFuY2VOYW1lXSA9IGV4cG9ydHMuaW5zdGFuY2VzW2luc3RhbmNlTmFtZV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGV4cG9ydHMuaW5zdGFuY2VzW2luc3RhbmNlTmFtZV07XG59XG5leHBvcnRzLmdldENhY2hlID0gZ2V0Q2FjaGU7XG5mdW5jdGlvbiBjcmVhdGVDYWNoZShuYW1lKSB7XG4gICAgdmFyIGluc3RhbmNlID0gbmV3IENhY2hlSW5zdGFuY2VfMS5kZWZhdWx0KG5hbWUpO1xuICAgIHZhciByZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaW5zdGFuY2UucmVzZXQoKTtcbiAgICB9O1xuICAgIHZhciBwdXQgPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICByZXR1cm4gcHV0XzEucHV0SXRlbShpdGVtLCBpbnN0YW5jZSk7XG4gICAgfTtcbiAgICB2YXIgZ2V0ID0gZnVuY3Rpb24gKGVudGl0eSwgbm9kZUlkKSB7XG4gICAgICAgIHJldHVybiBnZXRfMS5nZXRJdGVtKGVudGl0eSwgaW5zdGFuY2UsIG5vZGVJZCk7XG4gICAgfTtcbiAgICB2YXIgZ2V0RWRpdCA9IGZ1bmN0aW9uICh1aWRPckVudGl0eU9yQXJyYXksIG5vZGVJZCkge1xuICAgICAgICByZXR1cm4gZ2V0XzEuZ2V0RWRpdEl0ZW0odWlkT3JFbnRpdHlPckFycmF5LCBpbnN0YW5jZSwgbm9kZUlkKTtcbiAgICB9O1xuICAgIHZhciBldmljdCA9IGZ1bmN0aW9uICh1aWRPckVudGl0eU9yQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIGV2aWN0XzEuZXZpY3RJdGVtKHVpZE9yRW50aXR5T3JBcnJheSwgaW5zdGFuY2UpO1xuICAgIH07XG4gICAgdmFyIHNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB1dGlsXzEuY2FjaGVTaXplKGluc3RhbmNlKTtcbiAgICB9O1xuICAgIHZhciBsZW5ndGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB1dGlsXzEuY2FjaGVMZW5ndGgoaW5zdGFuY2UpO1xuICAgIH07XG4gICAgdmFyIHByaW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gcHJpbnRfMS5wcmludENhY2hlKGluc3RhbmNlKTtcbiAgICB9O1xuICAgIHZhciByZWZGcm9tID0gZnVuY3Rpb24gKHVpZCkge1xuICAgICAgICB2YXIgaXRlbSA9IGdldF8xLmdldENhY2hlZEl0ZW0odWlkLCBpbnN0YW5jZSk7XG4gICAgICAgIHJldHVybiBpdGVtLm1hcEZyb207XG4gICAgfTtcbiAgICB2YXIgcmVmVG8gPSBmdW5jdGlvbiAodWlkKSB7XG4gICAgICAgIHZhciBpdGVtID0gZ2V0XzEuZ2V0Q2FjaGVkSXRlbSh1aWQsIGluc3RhbmNlKTtcbiAgICAgICAgcmV0dXJuIGl0ZW0ubWFwVG87XG4gICAgfTtcbiAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICBwdXQ6IHB1dCxcbiAgICAgICAgZ2V0OiBnZXQsXG4gICAgICAgIGdldEVkaXQ6IGdldEVkaXQsXG4gICAgICAgIGV2aWN0OiBldmljdCxcbiAgICAgICAgcmVzZXQ6IHJlc2V0LFxuICAgICAgICBzaXplOiBzaXplLFxuICAgICAgICBsZW5ndGg6IGxlbmd0aCxcbiAgICAgICAgcHJpbnQ6IHByaW50LFxuICAgICAgICByZWZUbzogcmVmVG8sXG4gICAgICAgIHJlZkZyb206IHJlZkZyb21cbiAgICB9O1xuICAgIGlmIChjYWNoZVRlc3QgPT09IGZhbHNlKSB7XG4gICAgICAgIGRlbGV0ZSByZXN1bHQucmVmVG87XG4gICAgICAgIGRlbGV0ZSByZXN1bHQucmVmRnJvbTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaVkyRmphR1V1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sY3lJNld5SXVMaTh1TGk5emNtTXZZMkZqYUdVdWRITWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqdEJRVVZCTEhWQ1FVRjVReXhWUVVGVkxFTkJRVU1zUTBGQlFUdEJRVVZ3UkN4dlFrRkJkMElzVDBGQlR5eERRVUZETEVOQlFVRTdRVUZEYUVNc2MwSkJRVEpDTEZOQlFWTXNRMEZCUXl4RFFVRkJPMEZCUTNKRExEaENRVUV3UWl4cFFrRkJhVUlzUTBGQlF5eERRVUZCTzBGQlJUVkRMSEZDUVVGMVF5eFJRVUZSTEVOQlFVTXNRMEZCUVR0QlFVTm9SQ3h2UWtGQmIwUXNUMEZCVHl4RFFVRkRMRU5CUVVFN1FVRkROVVFzYzBKQlFUQkNMRk5CUVZNc1EwRkJReXhEUVVGQk8wRkJUM0JETEVsQlFVa3NVMEZCVXl4SFFVRlpMRXRCUVVzc1EwRkJRenRCUVVVdlFpeHZRa0ZCTWtJc1QwRkJaMEk3U1VGRGRrTXNVMEZCVXl4SFFVRkhMRTlCUVU4c1EwRkJRenRCUVVONFFpeERRVUZETzBGQlJtVXNhMEpCUVZVc1lVRkZla0lzUTBGQlFUdEJRVTFFTEd0Q1FVRjVRaXhaUVVGdlFpeEZRVUZGTEdGQlFXbERPMGxCUVhaRUxEUkNRVUZ2UWl4SFFVRndRaXh2UWtGQmIwSTdTVUZCUlN3MlFrRkJhVU1zUjBGQmFrTXNjME5CUVdsRE8wbEJRelZGTEVWQlFVVXNRMEZCUXl4RFFVRkRMRU5CUVVNc1kwRkJUU3hKUVVGSkxFTkJRVU1zYVVKQlFWTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRlRUlzWTBGQlRTeEhRVUZITEd0Q1FVRlRMRU5CUVVNc1lVRkJZU3hEUVVGRExFTkJRVU03U1VGRGRFTXNRMEZCUXp0SlFVTkVMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVU1zYVVKQlFWTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRZaXhwUWtGQlV5eEhRVUZITEVWQlFVVXNRMEZCUXp0SlFVTnVRaXhEUVVGRE8wbEJRMFFzUlVGQlJTeERRVUZETEVOQlFVTXNRMEZCUXl4cFFrRkJVeXhEUVVGRExGbEJRVmtzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0UlFVTXpRaXhwUWtGQlV5eERRVUZETEZsQlFWa3NRMEZCUXl4SFFVRkhMRmRCUVZjc1EwRkJReXhaUVVGWkxFTkJRVU1zUTBGQlF6dEpRVU40UkN4RFFVRkRPMGxCUTBRc1JVRkJSU3hEUVVGRExFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTXNRMEZCUXp0UlFVTlVMRVZCUVVVc1EwRkJReXhEUVVGRExFMUJRVTBzUTBGQlF5eFpRVUZaTEVOQlFVTXNTMEZCU3l4VFFVRlRMRU5CUVVNc1EwRkJReXhEUVVGRE8xbEJRM0pETEUxQlFVMHNRMEZCUXl4WlFVRlpMRU5CUVVNc1IwRkJSeXhwUWtGQlV5eERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRPMUZCUTI1RUxFTkJRVU03U1VGRFRDeERRVUZETzBsQlEwUXNUVUZCVFN4RFFVRkRMR2xDUVVGVExFTkJRVU1zV1VGQldTeERRVUZETEVOQlFVTTdRVUZEYmtNc1EwRkJRenRCUVdoQ1pTeG5Ra0ZCVVN4WFFXZENka0lzUTBGQlFUdEJRVGhDUkN4eFFrRkJjVUlzU1VGQldUdEpRVVUzUWl4SlFVRk5MRkZCUVZFc1IwRkJiVUlzU1VGQlNTeDFRa0ZCWVN4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8wbEJTM3BFTEVsQlFVMHNTMEZCU3l4SFFVRkhPMUZCUTFZc1VVRkJVU3hEUVVGRExFdEJRVXNzUlVGQlJTeERRVUZETzBsQlEzSkNMRU5CUVVNc1EwRkJRenRKUVVWR0xFbEJRVTBzUjBGQlJ5eEhRVUZITEZWQlFVTXNTVUZCYjBJN1VVRkROMElzVFVGQlRTeERRVUZETEdGQlFVOHNRMEZCUXl4SlFVRkpMRVZCUVVVc1VVRkJVU3hEUVVGRExFTkJRVU03U1VGRGJrTXNRMEZCUXl4RFFVRkJPMGxCVFVRc1NVRkJUU3hIUVVGSExFZEJRVWNzVlVGQlF5eE5RVUY1UXl4RlFVRkZMRTFCUVdVN1VVRkRia1VzVFVGQlRTeERRVUZETEdGQlFVOHNRMEZCUXl4TlFVRk5MRVZCUVVVc1VVRkJVU3hGUVVGRkxFMUJRVTBzUTBGQlF5eERRVUZETzBsQlF6ZERMRU5CUVVNc1EwRkJRVHRKUVUxRUxFbEJRVTBzVDBGQlR5eEhRVUZITEZWQlFVTXNhMEpCUVhGRUxFVkJRVVVzVFVGQlpUdFJRVU51Uml4TlFVRk5MRU5CUVVNc2FVSkJRVmNzUTBGQlF5eHJRa0ZCYTBJc1JVRkJSU3hSUVVGUkxFVkJRVVVzVFVGQlRTeERRVUZETEVOQlFVTTdTVUZETjBRc1EwRkJReXhEUVVGQk8wbEJSVVFzU1VGQlRTeExRVUZMTEVkQlFVY3NWVUZCUXl4clFrRkJjVVE3VVVGRGFFVXNUVUZCVFN4RFFVRkRMR2xDUVVGVExFTkJRVU1zYTBKQlFXdENMRVZCUVVVc1VVRkJVU3hEUVVGRExFTkJRVU03U1VGRGJrUXNRMEZCUXl4RFFVRkJPMGxCUlVRc1NVRkJUU3hKUVVGSkxFZEJRVWM3VVVGRFZDeE5RVUZOTEVOQlFVTXNaMEpCUVZNc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dEpRVU12UWl4RFFVRkRMRU5CUVVFN1NVRkZSQ3hKUVVGTkxFMUJRVTBzUjBGQlJ6dFJRVU5ZTEUxQlFVMHNRMEZCUXl4clFrRkJWeXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETzBsQlEycERMRU5CUVVNc1EwRkJRVHRKUVVWRUxFbEJRVTBzUzBGQlN5eEhRVUZITzFGQlExWXNUVUZCVFN4RFFVRkRMR3RDUVVGVkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdTVUZEYUVNc1EwRkJReXhEUVVGQk8wbEJSVVFzU1VGQlRTeFBRVUZQTEVkQlFVY3NWVUZCUVN4SFFVRkhPMUZCUTJZc1NVRkJTU3hKUVVGSkxFZEJRVWNzYlVKQlFXRXNRMEZCUXl4SFFVRkhMRVZCUVVVc1VVRkJVU3hEUVVGRExFTkJRVU03VVVGRGVFTXNUVUZCVFN4RFFVRkRMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU03U1VGRGVFSXNRMEZCUXl4RFFVRkRPMGxCUlVZc1NVRkJUU3hMUVVGTExFZEJRVWNzVlVGQlFTeEhRVUZITzFGQlEySXNTVUZCU1N4SlFVRkpMRWRCUVVjc2JVSkJRV0VzUTBGQlF5eEhRVUZITEVWQlFVVXNVVUZCVVN4RFFVRkRMRU5CUVVNN1VVRkRlRU1zVFVGQlRTeERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNN1NVRkRkRUlzUTBGQlF5eERRVUZETzBsQlJVWXNTVUZCU1N4TlFVRk5MRWRCUVVjN1VVRkRWQ3hIUVVGSExFVkJRVVVzUjBGQlJ6dFJRVU5TTEVkQlFVY3NSVUZCUlN4SFFVRkhPMUZCUTFJc1QwRkJUeXhGUVVGRkxFOUJRVTg3VVVGRGFFSXNTMEZCU3l4RlFVRkZMRXRCUVVzN1VVRkRXaXhMUVVGTExFVkJRVVVzUzBGQlN6dFJRVU5hTEVsQlFVa3NSVUZCUlN4SlFVRkpPMUZCUTFZc1RVRkJUU3hGUVVGRkxFMUJRVTA3VVVGRFpDeExRVUZMTEVWQlFVVXNTMEZCU3p0UlFVZGFMRXRCUVVzc1JVRkJSU3hMUVVGTE8xRkJRMW9zVDBGQlR5eEZRVUZGTEU5QlFVODdTMEZEYmtJc1EwRkJRVHRKUVVWRUxFVkJRVVVzUTBGQlF5eERRVUZETEZOQlFWTXNTMEZCU3l4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRE8xRkJRM1JDTEU5QlFVOHNUVUZCVFN4RFFVRkRMRXRCUVVzc1EwRkJRenRSUVVOd1FpeFBRVUZQTEUxQlFVMHNRMEZCUXl4UFFVRlBMRU5CUVVNN1NVRkRNVUlzUTBGQlF6dEpRVVZFTEUxQlFVMHNRMEZCUXl4TlFVRk5MRU5CUVVNN1FVRkRiRUlzUTBGQlF5SjlcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vLi4vc3JjL2NhY2hlLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLmRlZmF1bHRDb25maWcgPSB7XG4gICAgdWlkTmFtZTogXCJ1aWRcIixcbiAgICBtYXhIaXN0b3J5U3RhdGVzOiAxMDAwXG59O1xuZnVuY3Rpb24gY29uZmlndXJlKGNvbmYpIHtcbiAgICBmb3IgKHZhciBwIGluIGV4cG9ydHMuZGVmYXVsdENvbmZpZykge1xuICAgICAgICBpZiAoZXhwb3J0cy5kZWZhdWx0Q29uZmlnLmhhc093blByb3BlcnR5KHApICYmIGNvbmYuaGFzT3duUHJvcGVydHkocCkpIHtcbiAgICAgICAgICAgIGV4cG9ydHMuZGVmYXVsdENvbmZpZ1twXSA9IGNvbmZbcF07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGV4cG9ydHMuZGVmYXVsdENvbmZpZztcbn1cbmV4cG9ydHMuY29uZmlndXJlID0gY29uZmlndXJlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pWTI5dVptbG5MbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE1pT2xzaUxpNHZMaTR2YzNKakwyTnZibVpwWnk1MGN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3haUVVGWkxFTkJRVU03UVVGTFFTeHhRa0ZCWVN4SFFVRkhPMGxCUTNwQ0xFOUJRVThzUlVGQlJTeExRVUZMTzBsQlEyUXNaMEpCUVdkQ0xFVkJRVVVzU1VGQlNUdERRVU42UWl4RFFVRkRPMEZCUzBZc2JVSkJRVEJDTEVsQlFVazdTVUZETVVJc1IwRkJSeXhEUVVGRExFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NjVUpCUVdFc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRE1VSXNSVUZCUlN4RFFVRkRMRU5CUVVNc2NVSkJRV0VzUTBGQlF5eGpRVUZqTEVOQlFVTXNRMEZCUXl4RFFVRkRMRWxCUVVrc1NVRkJTU3hEUVVGRExHTkJRV01zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1dVRkROVVFzY1VKQlFXRXNRMEZCUXl4RFFVRkRMRU5CUVVNc1IwRkJSeXhKUVVGSkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdVVUZETDBJc1EwRkJRenRKUVVOTUxFTkJRVU03U1VGRFJDeE5RVUZOTEVOQlFVTXNjVUpCUVdFc1EwRkJRenRCUVVONlFpeERRVUZETzBGQlVHVXNhVUpCUVZNc1dVRlBlRUlzUTBGQlFTSjlcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vLi4vc3JjL2NvbmZpZy50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIENhY2hlTWFwXzEgPSByZXF1aXJlKCcuL0NhY2hlTWFwJyk7XG52YXIgbG9jYXRlXzEgPSByZXF1aXJlKCcuL2xvY2F0ZScpO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIHJlZl8xID0gcmVxdWlyZSgnLi9yZWYnKTtcbnZhciBmbHVzaF8xID0gcmVxdWlyZSgnLi9mbHVzaCcpO1xuZXhwb3J0cy5wdXRJdGVtID0gZnVuY3Rpb24gKGVudGl0eSwgaW5zdGFuY2UpIHtcbiAgICBpZiAoKHV0aWxfMS5pc0FycmF5KGVudGl0eSkgfHwgdXRpbF8xLmlzT2JqZWN0KGVudGl0eSkpKSB7XG4gICAgICAgIHZhciBldmljdE1hcCA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICAgICAgdmFyIGZsdXNoTWFwID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgICAgICBmbHVzaE1hcFsnX19VUERBVEVEX18nXSA9IGZhbHNlO1xuICAgICAgICB2YXIgZmx1c2hBcmdzID0ge1xuICAgICAgICAgICAgZW50aXR5OiBlbnRpdHksXG4gICAgICAgICAgICBmbHVzaE1hcDogZmx1c2hNYXAsXG4gICAgICAgICAgICBldmljdE1hcDogZXZpY3RNYXAsXG4gICAgICAgICAgICBwYXJlbnRVaWQ6IG51bGwsXG4gICAgICAgICAgICByZWZQYXRoOiBcIlwiLFxuICAgICAgICAgICAgaW5zdGFuY2U6IGluc3RhbmNlXG4gICAgICAgIH07XG4gICAgICAgIGZsdXNoXzEuYnVpbGRGbHVzaE1hcChmbHVzaEFyZ3MpO1xuICAgICAgICByZWZfMS51cGRhdGVQb2ludGVycyhmbHVzaEFyZ3MpO1xuICAgICAgICBpZiAoZmx1c2hBcmdzLmZsdXNoTWFwLnNpemUoKSA+IDAgJiYgZmx1c2hNYXBbJ19fVVBEQVRFRF9fJ10gPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiBjb21taXRQdXQoZmx1c2hBcmdzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbG9jYXRlXzEuZ2V0Q2FsbFN0YXRzKGZhbHNlLCBpbnN0YW5jZSk7XG59O1xudmFyIGNvbW1pdFB1dCA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICBmbHVzaF8xLnByZUZsdXNoKGZsdXNoQXJncyk7XG4gICAgcmV0dXJuIGxvY2F0ZV8xLmdldENhbGxTdGF0cyh0cnVlLCBmbHVzaEFyZ3MuaW5zdGFuY2UpO1xufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWNIVjBMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE1pT2xzaUxpNHZMaTR2YzNKakwzQjFkQzUwY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pTzBGQlJVRXNlVUpCUVhGQ0xGbEJRVmtzUTBGQlF5eERRVUZCTzBGQlIyeERMSFZDUVVFMlFpeFZRVUZWTEVOQlFVTXNRMEZCUVR0QlFVTjRReXh4UWtGQmEwTXNVVUZCVVN4RFFVRkRMRU5CUVVFN1FVRkRNME1zYjBKQlFTdENMRTlCUVU4c1EwRkJReXhEUVVGQk8wRkJRM1pETEhOQ1FVRjNReXhUUVVGVExFTkJRVU1zUTBGQlFUdEJRVkZ5UXl4bFFVRlBMRWRCUVVjc1ZVRkJReXhOUVVGelFpeEZRVUZGTEZGQlFYZENPMGxCUjNCRkxFVkJRVVVzUTBGQlF5eERRVUZETEVOQlFVTXNZMEZCVHl4RFFVRkRMRTFCUVUwc1EwRkJReXhKUVVGSkxHVkJRVkVzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRSUVVWNFF5eEpRVUZOTEZGQlFWRXNSMEZCZDBJc1NVRkJTU3hyUWtGQlVTeEZRVUZoTEVOQlFVTTdVVUZEYUVVc1NVRkJUU3hSUVVGUkxFZEJRWGRDTEVsQlFVa3NhMEpCUVZFc1JVRkJZU3hEUVVGRE8xRkJRMmhGTEZGQlFWRXNRMEZCUXl4aFFVRmhMRU5CUVVNc1IwRkJSeXhMUVVGTExFTkJRVU03VVVGRmFFTXNTVUZCU1N4VFFVRlRMRWRCUVdVN1dVRkRlRUlzVFVGQlRTeEZRVUZGTEUxQlFVMDdXVUZEWkN4UlFVRlJMRVZCUVVVc1VVRkJVVHRaUVVOc1FpeFJRVUZSTEVWQlFVVXNVVUZCVVR0WlFVTnNRaXhUUVVGVExFVkJRVVVzU1VGQlNUdFpRVU5tTEU5QlFVOHNSVUZCUlN4RlFVRkZPMWxCUTFnc1VVRkJVU3hGUVVGRkxGRkJRVkU3VTBGRGNrSXNRMEZCUVR0UlFVVkVMSEZDUVVGaExFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdVVUZGZWtJc2IwSkJRV01zUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXp0UlFVVXhRaXhGUVVGRkxFTkJRVU1zUTBGQlF5eFRRVUZUTEVOQlFVTXNVVUZCVVN4RFFVRkRMRWxCUVVrc1JVRkJSU3hIUVVGSExFTkJRVU1zU1VGQlNTeFJRVUZSTEVOQlFVTXNZVUZCWVN4RFFVRkRMRXRCUVVzc1NVRkJTU3hEUVVGRExFTkJRVU1zUTBGQlF6dFpRVU53UlN4TlFVRk5MRU5CUVVNc1UwRkJVeXhEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzFGQlEyaERMRU5CUVVNN1NVRkRUQ3hEUVVGRE8wbEJRMFFzVFVGQlRTeERRVUZETEhGQ1FVRlpMRU5CUVVNc1MwRkJTeXhGUVVGRkxGRkJRVkVzUTBGQlF5eERRVUZETzBGQlEzcERMRU5CUVVNc1EwRkJRVHRCUVVWRUxFbEJRVTBzVTBGQlV5eEhRVUZITEZWQlFVTXNVMEZCY1VJN1NVRkhjRU1zWjBKQlFWRXNRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRKUVVOd1FpeE5RVUZOTEVOQlFVTXNjVUpCUVZrc1EwRkJReXhKUVVGSkxFVkJRVVVzVTBGQlV5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMEZCUTJ4RUxFTkJRVU1zUTBGQlFTSjlcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vLi4vc3JjL3B1dC50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIG9iamVjdEFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcbnZhciBDYWNoZU1hcCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2FjaGVNYXAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMucGF0aHMgPSB7fTtcbiAgICAgICAgdGhpcy5sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5wYXRoc1trZXldO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmRlbGV0ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgX3RoaXMucGF0aHNba2V5XSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBfdGhpcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhbCA9IF90aGlzLnBhdGhzW2tleV07XG4gICAgICAgICAgICAgICAgZGVsZXRlIF90aGlzLnBhdGhzW2tleV07XG4gICAgICAgICAgICAgICAgX3RoaXMubGVuZ3RoLS07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5oYXMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIF90aGlzLnBhdGhzW2tleV0gIT09ICd1bmRlZmluZWQnO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBfdGhpcy5wYXRocykge1xuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5wYXRocy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGtleSwgX3RoaXMucGF0aHNba2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNsb25lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG5ld0luc3RhbmNlID0gb2JqZWN0QXNzaWduKHt9LCBfdGhpcy5wYXRocyk7XG4gICAgICAgICAgICB2YXIgY2xvbmUgPSBuZXcgQ2FjaGVNYXAoKTtcbiAgICAgICAgICAgIGNsb25lLnBhdGhzID0gbmV3SW5zdGFuY2U7XG4gICAgICAgICAgICBjbG9uZS5sZW5ndGggPSBfdGhpcy5sZW5ndGg7XG4gICAgICAgICAgICByZXR1cm4gY2xvbmU7XG4gICAgICAgIH07XG4gICAgfVxuICAgIENhY2hlTWFwLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMucGF0aHNba2V5XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy5sZW5ndGgrKztcbiAgICAgICAgICAgIHRoaXMucGF0aHNba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYXRoc1trZXldID0gdmFsdWU7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIENhY2hlTWFwLnByb3RvdHlwZS5zaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sZW5ndGg7XG4gICAgfTtcbiAgICByZXR1cm4gQ2FjaGVNYXA7XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ2FjaGVNYXA7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lRMkZqYUdWTllYQXVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjeUk2V3lJdUxpOHVMaTl6Y21NdlEyRmphR1ZOWVhBdWRITWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqdEJRVVZCTEVsQlFVMHNXVUZCV1N4SFFVRkhMRTlCUVU4c1EwRkJReXhsUVVGbExFTkJRVU1zUTBGQlF6dEJRVVU1UXp0SlFVdEpPMUZCVEVvc2FVSkJjMFJETzFGQmNFUkhMRlZCUVVzc1IwRkJSeXhGUVVGRkxFTkJRVU03VVVGRFdDeFhRVUZOTEVkQlFVY3NRMEZCUXl4RFFVRkRPMUZCWlZnc1VVRkJSeXhIUVVGSExGVkJRVU1zUjBGQlJ6dFpRVU5PTEUxQlFVMHNRMEZCUXl4TFFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETzFGQlF6TkNMRU5CUVVNc1EwRkJRVHRSUVVWRUxGZEJRVTBzUjBGQlJ5eFZRVUZETEVkQlFVYzdXVUZEVkN4RlFVRkZMRU5CUVVNc1EwRkJReXhQUVVGUExFdEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRXRCUVVzc1YwRkJWeXhKUVVGSkxFdEJRVWtzUTBGQlF5eE5RVUZOTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRuUWtGRE5VUXNTVUZCU1N4SFFVRkhMRWRCUVVjc1MwRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXp0blFrRkRNVUlzVDBGQlR5eExRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRE8yZENRVU4yUWl4TFFVRkpMRU5CUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU03WjBKQlEyUXNUVUZCVFN4RFFVRkRMRWRCUVVjc1EwRkJRenRaUVVObUxFTkJRVU03VVVGRFRDeERRVUZETEVOQlFVRTdVVUZGUkN4UlFVRkhMRWRCUVVjc1ZVRkJReXhIUVVGSE8xbEJRMDRzVFVGQlRTeERRVUZETEU5QlFVOHNTMEZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zUzBGQlN5eFhRVUZYTEVOQlFVTTdVVUZEYkVRc1EwRkJReXhEUVVGQk8xRkJSVVFzV1VGQlR5eEhRVUZITEZWQlFVTXNVVUZCYTBJN1dVRkRla0lzUjBGQlJ5eERRVUZETEVOQlFVTXNTVUZCU1N4SFFVRkhMRWxCUVVrc1MwRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTTdaMEpCUTNwQ0xFVkJRVVVzUTBGQlF5eERRVUZETEV0QlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1kwRkJZeXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0dlFrRkRha01zVVVGQlVTeERRVUZETEVkQlFVY3NSVUZCUlN4TFFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTTdaMEpCUTI1RExFTkJRVU03V1VGRFRDeERRVUZETzFGQlEwd3NRMEZCUXl4RFFVRkJPMUZCUlVRc1ZVRkJTeXhIUVVGSE8xbEJRMG9zU1VGQlNTeFhRVUZYTEVkQlFVY3NXVUZCV1N4RFFVRkRMRVZCUVVVc1JVRkJSU3hMUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdXVUZETDBNc1NVRkJTU3hMUVVGTExFZEJRV2RDTEVsQlFVa3NVVUZCVVN4RlFVRkxMRU5CUVVNN1dVRkRNME1zUzBGQlN5eERRVUZETEV0QlFVc3NSMEZCUnl4WFFVRlhMRU5CUVVNN1dVRkRNVUlzUzBGQlN5eERRVUZETEUxQlFVMHNSMEZCUnl4TFFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRE8xbEJRek5DTEUxQlFVMHNRMEZCUXl4TFFVRkxMRU5CUVVNN1VVRkRha0lzUTBGQlF5eERRVUZCTzBsQk0wTkVMRU5CUVVNN1NVRkZSQ3h6UWtGQlJ5eEhRVUZJTEZWQlFVa3NSMEZCYjBJc1JVRkJSU3hMUVVGUk8xRkJRemxDTEVWQlFVVXNRMEZCUXl4RFFVRkRMRTlCUVU4c1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNTMEZCU3l4WFFVRlhMRU5CUVVNc1EwRkJReXhEUVVGRE8xbEJRM3BETEVsQlFVa3NRMEZCUXl4TlFVRk5MRVZCUVVVc1EwRkJRenRaUVVOa0xFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRWRCUVVjc1MwRkJTeXhEUVVGRE8xbEJRM2hDTEUxQlFVMHNRMEZCUXl4SlFVRkpMRU5CUVVNN1VVRkRhRUlzUTBGQlF6dFJRVU5FTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExFZEJRVWNzUzBGQlN5eERRVUZETzFGQlEzaENMRTFCUVUwc1EwRkJReXhMUVVGTExFTkJRVU03U1VGRGFrSXNRMEZCUXp0SlFXMURSQ3gxUWtGQlNTeEhRVUZLTzFGQlEwa3NUVUZCVFN4RFFVRkRMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU03U1VGRGRrSXNRMEZCUXp0SlFVTk1MR1ZCUVVNN1FVRkJSQ3hEUVVGRExFRkJkRVJFTEVsQmMwUkRPMEZCZEVSRU96QkNRWE5FUXl4RFFVRkJJbjA9XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uLy4uL3NyYy9DYWNoZU1hcC50cyIsIid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4uL34vb2JqZWN0LWFzc2lnbi9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciB1dGlsXzEgPSByZXF1aXJlKCcuL3V0aWwnKTtcbmV4cG9ydHMuZ2V0Q2FsbFN0YXRzID0gZnVuY3Rpb24gKHN1Y2Nlc3MsIGluc3RhbmNlKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHJlc3VsdC5zdWNjZXNzID0gc3VjY2VzcztcbiAgICByZXN1bHQubm9kZUlkID0gZXhwb3J0cy5ub2RlKGluc3RhbmNlKTtcbiAgICByZXN1bHQubGVuZ3RoID0gbGVuZ3RoKGluc3RhbmNlKTtcbiAgICByZXN1bHQubmFtZSA9IGluc3RhbmNlLm5hbWU7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5leHBvcnRzLm5vZGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIG5vZGVJZCkge1xuICAgIGlmICh0eXBlb2Ygbm9kZUlkID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHZhciBjdXJyZW50Tm9kZSA9IGdldEN1cnJlbnROb2RlKGluc3RhbmNlKTtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnROb2RlID8gY3VycmVudE5vZGUuaWQgOiAtMTtcbiAgICB9XG4gICAgaWYgKCF1dGlsXzEuaXNOdW1iZXIobm9kZUlkKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVGhlIG5vZGUgaWQgbXVzdCBiZSBhIG51bWJlci5cIik7XG4gICAgfVxuICAgIHZhciBjYWNoZU5vZGUgPSBnZXRSZXBvTm9kZShub2RlSWQsIGluc3RhbmNlKTtcbiAgICBpZiAoIWNhY2hlTm9kZSkge1xuICAgICAgICByZXR1cm4gZXhwb3J0cy5nZXRDYWxsU3RhdHMoZmFsc2UsIGluc3RhbmNlKTtcbiAgICB9XG4gICAgaW5zdGFuY2UudGhyZWFkLmN1cnJlbnQgPSBiaW5hcnlJbmRleE9mKGluc3RhbmNlLnRocmVhZC5ub2Rlcywgbm9kZUlkKTtcbiAgICByZXR1cm4gZXhwb3J0cy5nZXRDYWxsU3RhdHModHJ1ZSwgaW5zdGFuY2UpO1xufTtcbmZ1bmN0aW9uIGdldEN1cnJlbnROb2RlKGluc3RhbmNlKSB7XG4gICAgdmFyIGN1cnJlbnROb2RlSWQgPSBpbnN0YW5jZS50aHJlYWQubm9kZXNbaW5zdGFuY2UudGhyZWFkLmN1cnJlbnRdO1xuICAgIHJldHVybiBjdXJyZW50Tm9kZUlkID49IDAgPyBnZXRSZXBvTm9kZShjdXJyZW50Tm9kZUlkLCBpbnN0YW5jZSkgOiB1bmRlZmluZWQ7XG59XG5leHBvcnRzLmdldEN1cnJlbnROb2RlID0gZ2V0Q3VycmVudE5vZGU7XG5mdW5jdGlvbiBnZXRSZXBvTm9kZShjYWNoZU5vZGVJZCwgaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gaW5zdGFuY2UucmVwby5nZXQoY2FjaGVOb2RlSWQpO1xufVxuZXhwb3J0cy5nZXRSZXBvTm9kZSA9IGdldFJlcG9Ob2RlO1xudmFyIGxlbmd0aCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIHJldHVybiBpbnN0YW5jZS50aHJlYWQubm9kZXMubGVuZ3RoO1xufTtcbmZ1bmN0aW9uIGJpbmFyeUluZGV4T2YoYXJyYXksIHNlYXJjaEVsZW1lbnQpIHtcbiAgICB2YXIgbWluSW5kZXggPSAwO1xuICAgIHZhciBtYXhJbmRleCA9IGFycmF5Lmxlbmd0aCAtIDE7XG4gICAgdmFyIGN1cnJlbnRJbmRleDtcbiAgICB2YXIgY3VycmVudEVsZW1lbnQ7XG4gICAgd2hpbGUgKG1pbkluZGV4IDw9IG1heEluZGV4KSB7XG4gICAgICAgIGN1cnJlbnRJbmRleCA9IChtaW5JbmRleCArIG1heEluZGV4KSAvIDIgfCAwO1xuICAgICAgICBjdXJyZW50RWxlbWVudCA9IGFycmF5W2N1cnJlbnRJbmRleF07XG4gICAgICAgIGlmIChjdXJyZW50RWxlbWVudCA8IHNlYXJjaEVsZW1lbnQpIHtcbiAgICAgICAgICAgIG1pbkluZGV4ID0gY3VycmVudEluZGV4ICsgMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjdXJyZW50RWxlbWVudCA+IHNlYXJjaEVsZW1lbnQpIHtcbiAgICAgICAgICAgIG1heEluZGV4ID0gY3VycmVudEluZGV4IC0gMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50SW5kZXg7XG4gICAgICAgIH1cbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2liRzlqWVhSbExtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTGk0dkxpNHZjM0pqTDJ4dlkyRjBaUzUwY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pTzBGQlJVRXNjVUpCUVhORExGRkJRVkVzUTBGQlF5eERRVUZCTzBGQlUyeERMRzlDUVVGWkxFZEJRVWNzVlVGQlF5eFBRVUZuUWl4RlFVRkZMRkZCUVhkQ08wbEJRMjVGTEVsQlFVa3NUVUZCVFN4SFFVRlJMRVZCUVVVc1EwRkJRenRKUVVOeVFpeE5RVUZOTEVOQlFVTXNUMEZCVHl4SFFVRkhMRTlCUVU4c1EwRkJRenRKUVVONlFpeE5RVUZOTEVOQlFVTXNUVUZCVFN4SFFVRkhMRmxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dEpRVU12UWl4TlFVRk5MRU5CUVVNc1RVRkJUU3hIUVVGSExFMUJRVTBzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXp0SlFVTnFReXhOUVVGTkxFTkJRVU1zU1VGQlNTeEhRVUZITEZGQlFWRXNRMEZCUXl4SlFVRkpMRU5CUVVNN1NVRkROVUlzVFVGQlRTeERRVUZETEUxQlFVMHNRMEZCUXp0QlFVTnNRaXhEUVVGRExFTkJRVU03UVVGWFZ5eFpRVUZKTEVkQlFVY3NWVUZCUXl4UlFVRjNRaXhGUVVGRkxFMUJRVTg3U1VGRmJFUXNSVUZCUlN4RFFVRkRMRU5CUVVNc1QwRkJUeXhOUVVGTkxFdEJRVXNzVjBGQlZ5eERRVUZETEVOQlFVTXNRMEZCUXp0UlFVTm9ReXhKUVVGSkxGZEJRVmNzUjBGQlJ5eGpRVUZqTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN1VVRkRNME1zVFVGQlRTeERRVUZETEZkQlFWY3NSMEZCUnl4WFFVRlhMRU5CUVVNc1JVRkJSU3hIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZETzBsQlF6ZERMRU5CUVVNN1NVRkZSQ3hGUVVGRkxFTkJRVU1zUTBGQlF5eERRVUZETEdWQlFWRXNRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRGNFSXNUVUZCVFN4SlFVRkpMRk5CUVZNc1EwRkJReXdyUWtGQkswSXNRMEZCUXl4RFFVRkRPMGxCUTNwRUxFTkJRVU03U1VGRlJDeEpRVUZKTEZOQlFWTXNSMEZCUnl4WFFVRlhMRU5CUVVNc1RVRkJUU3hGUVVGRkxGRkJRVkVzUTBGQlF5eERRVUZETzBsQlF6bERMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTXNRMEZCUXp0UlFVTmlMRTFCUVUwc1EwRkJReXh2UWtGQldTeERRVUZETEV0QlFVc3NSVUZCUlN4UlFVRlJMRU5CUVVNc1EwRkJRenRKUVVONlF5eERRVUZETzBsQlEwUXNVVUZCVVN4RFFVRkRMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzWVVGQllTeERRVUZETEZGQlFWRXNRMEZCUXl4TlFVRk5MRU5CUVVNc1MwRkJTeXhGUVVGRkxFMUJRVTBzUTBGQlF5eERRVUZETzBsQlEzWkZMRTFCUVUwc1EwRkJReXh2UWtGQldTeERRVUZETEVsQlFVa3NSVUZCUlN4UlFVRlJMRU5CUVVNc1EwRkJRenRCUVVONFF5eERRVUZETEVOQlFVTTdRVUZSUml4M1FrRkJLMElzVVVGQmQwSTdTVUZEYmtRc1NVRkJTU3hoUVVGaExFZEJRVWNzVVVGQlVTeERRVUZETEUxQlFVMHNRMEZCUXl4TFFVRkxMRU5CUVVNc1VVRkJVU3hEUVVGRExFMUJRVTBzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0SlFVVnVSU3hOUVVGTkxFTkJRVU1zWVVGQllTeEpRVUZKTEVOQlFVTXNSMEZCUnl4WFFVRlhMRU5CUVVNc1lVRkJZU3hGUVVGRkxGRkJRVkVzUTBGQlF5eEhRVUZITEZOQlFWTXNRMEZCUXp0QlFVTnFSaXhEUVVGRE8wRkJTbVVzYzBKQlFXTXNhVUpCU1RkQ0xFTkJRVUU3UVVGRlJDeHhRa0ZCTkVJc1YwRkJWeXhGUVVGRkxGRkJRWGRDTzBsQlF6ZEVMRTFCUVUwc1EwRkJReXhSUVVGUkxFTkJRVU1zU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4WFFVRlhMRU5CUVVNc1EwRkJRenRCUVVNeFF5eERRVUZETzBGQlJtVXNiVUpCUVZjc1kwRkZNVUlzUTBGQlFUdEJRVTFFTEVsQlFVMHNUVUZCVFN4SFFVRkhMRlZCUVVNc1VVRkJkMEk3U1VGRGNFTXNUVUZCVFN4RFFVRkRMRkZCUVZFc1EwRkJReXhOUVVGTkxFTkJRVU1zUzBGQlN5eERRVUZETEUxQlFVMHNRMEZCUXp0QlFVTjRReXhEUVVGRExFTkJRVU03UVVGWlJpeDFRa0ZCZFVJc1MwRkJhVUlzUlVGQlJTeGhRVUZoTzBsQlEyNUVMRWxCUVVrc1VVRkJVU3hIUVVGSExFTkJRVU1zUTBGQlF6dEpRVU5xUWl4SlFVRkpMRkZCUVZFc1IwRkJSeXhMUVVGTExFTkJRVU1zVFVGQlRTeEhRVUZITEVOQlFVTXNRMEZCUXp0SlFVTm9ReXhKUVVGSkxGbEJRVmtzUTBGQlF6dEpRVU5xUWl4SlFVRkpMR05CUVdNc1EwRkJRenRKUVVWdVFpeFBRVUZQTEZGQlFWRXNTVUZCU1N4UlFVRlJMRVZCUVVVc1EwRkJRenRSUVVNeFFpeFpRVUZaTEVkQlFVY3NRMEZCUXl4UlFVRlJMRWRCUVVjc1VVRkJVU3hEUVVGRExFZEJRVWNzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXp0UlFVTTNReXhqUVVGakxFZEJRVWNzUzBGQlN5eERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRPMUZCUlhKRExFVkJRVVVzUTBGQlF5eERRVUZETEdOQlFXTXNSMEZCUnl4aFFVRmhMRU5CUVVNc1EwRkJReXhEUVVGRE8xbEJRMnBETEZGQlFWRXNSMEZCUnl4WlFVRlpMRWRCUVVjc1EwRkJReXhEUVVGRE8xRkJRMmhETEVOQlFVTTdVVUZEUkN4SlFVRkpMRU5CUVVNc1JVRkJSU3hEUVVGRExFTkJRVU1zWTBGQll5eEhRVUZITEdGQlFXRXNRMEZCUXl4RFFVRkRMRU5CUVVNN1dVRkRkRU1zVVVGQlVTeEhRVUZITEZsQlFWa3NSMEZCUnl4RFFVRkRMRU5CUVVNN1VVRkRhRU1zUTBGQlF6dFJRVU5FTEVsQlFVa3NRMEZCUXl4RFFVRkRPMWxCUTBZc1RVRkJUU3hEUVVGRExGbEJRVmtzUTBGQlF6dFJRVU40UWl4RFFVRkRPMGxCUTB3c1EwRkJRenRCUVVkTUxFTkJRVU1pZlE9PVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi8uLi9zcmMvbG9jYXRlLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgY2FjaGVfMSA9IHJlcXVpcmUoJy4vY2FjaGUnKTtcbnZhciBDYWNoZU5vZGVfMSA9IHJlcXVpcmUoJy4vQ2FjaGVOb2RlJyk7XG52YXIgbG9jYXRlXzEgPSByZXF1aXJlKCcuL2xvY2F0ZScpO1xudmFyIG9iamVjdEFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG52YXIgX2hhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbmZ1bmN0aW9uIGlzTnVtYmVyKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgfHwgdG9TdHJpbmcodmFsdWUpID09PSBcIltvYmplY3QgTnVtYmVyXVwiO1xufVxuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xuZnVuY3Rpb24gaXNTdHJpbmcob2JqKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdzdHJpbmcnIHx8IHRvU3RyaW5nKG9iaikgPT09IFwiW29iamVjdCBTdHJpbmddXCI7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5mdW5jdGlvbiBpc09iamVjdChtaXhlZF92YXIpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG1peGVkX3ZhcikgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gbWl4ZWRfdmFyICE9PSBudWxsICYmIHR5cGVvZiBtaXhlZF92YXIgPT09ICdvYmplY3QnO1xufVxuZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuZnVuY3Rpb24gaXNBcnJheSh2YWx1ZSkge1xuICAgIGlmICghdmFsdWUgfHwgdmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWx1ZSkgfHwgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCdcbiAgICAgICAgJiYgdHlwZW9mIHZhbHVlLmxlbmd0aCA9PT0gJ251bWJlcidcbiAgICAgICAgJiYgdHlwZW9mIHZhbHVlLnNwbGljZSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICAmJiAhKHZhbHVlLnByb3BlcnR5SXNFbnVtZXJhYmxlKCdsZW5ndGgnKSkpO1xufVxuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcbmZ1bmN0aW9uIG9ialRvU3RyKG8pIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pO1xufVxuZnVuY3Rpb24gaXNEYXRlKHZhbHVlKSB7XG4gICAgcmV0dXJuIGlzT2JqZWN0KHZhbHVlKSAmJiBvYmpUb1N0cih2YWx1ZSkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xuZnVuY3Rpb24gaXNFbXB0eSh2YWx1ZSkge1xuICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChpc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2UgaWYgKCFpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKF9oYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuZXhwb3J0cy5pc0VtcHR5ID0gaXNFbXB0eTtcbmZ1bmN0aW9uIGdldE5ld0NhY2hlTm9kZShpbnN0YW5jZSkge1xuICAgIHZhciBub2RlID0gbmV3IENhY2hlTm9kZV8xLkNhY2hlTm9kZShpbnN0YW5jZS5uZXh0Tm9kZUtleSk7XG4gICAgbm9kZS5pZCA9IGluc3RhbmNlLm5leHROb2RlS2V5O1xuICAgIGluc3RhbmNlLm5leHROb2RlS2V5ICs9IDE7XG4gICAgaW5zdGFuY2UucmVwby5hZGQobm9kZSk7XG4gICAgcmV0dXJuIG5vZGU7XG59XG5leHBvcnRzLmdldE5ld0NhY2hlTm9kZSA9IGdldE5ld0NhY2hlTm9kZTtcbmZ1bmN0aW9uIGhhc1VpZChvYmopIHtcbiAgICBpZiAoIW9iaikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICghaXNPYmplY3Qob2JqKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb2JqW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIHVpZCA9IG9ialtjYWNoZV8xLmNvbmZpZy51aWROYW1lXTtcbiAgICByZXR1cm4gdWlkLmxlbmd0aCAhPT0gMDtcbn1cbmV4cG9ydHMuaGFzVWlkID0gaGFzVWlkO1xuO1xuZnVuY3Rpb24gZGVlcENsb25lKG9iaiwgdWlkUmVmZXJlbmNlLCBmcmVlemUpIHtcbiAgICBpZiAoZnJlZXplID09PSB2b2lkIDApIHsgZnJlZXplID0gdHJ1ZTsgfVxuICAgIGlmICghb2JqIHx8ICghaXNPYmplY3Qob2JqKSAmJiAhaXNBcnJheShvYmopKSkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBpZiAoZnJlZXplID09PSB0cnVlICYmIHVpZFJlZmVyZW5jZSAmJiAhT2JqZWN0LmlzRnJvemVuKHVpZFJlZmVyZW5jZSkpIHtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZSh1aWRSZWZlcmVuY2UpO1xuICAgIH1cbiAgICBpZiAodWlkUmVmZXJlbmNlICYmIGhhc1VpZChvYmopICYmIG9ialtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSA9PT0gdWlkUmVmZXJlbmNlW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdKSB7XG4gICAgICAgIHJldHVybiB1aWRSZWZlcmVuY2U7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBvYmplY3RBc3NpZ24oe30sIG9iaik7XG4gICAgZm9yICh2YXIgcHJvcE5hbWUgaW4gb2JqKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IG9ialtwcm9wTmFtZV07XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W3Byb3BOYW1lXSA9IGRlZXBDbG9uZUFycmF5KHZhbHVlLCB1aWRSZWZlcmVuY2UsIGZyZWV6ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh2YWx1ZS5nZXRUaW1lKCkpO1xuICAgICAgICAgICAgICAgIGlmIChmcmVlemUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmZyZWV6ZShkYXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzdWx0W3Byb3BOYW1lXSA9IGRhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoaGFzVWlkKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRbcHJvcE5hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1aWRSZWZlcmVuY2UgJiYgaGFzVWlkKHVpZFJlZmVyZW5jZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gdWlkUmVmZXJlbmNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdmFsdWUudWlkID09PSB1aWRSZWZlcmVuY2UudWlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdmFsdWUgIT09IHVpZFJlZmVyZW5jZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtwcm9wTmFtZV0gPSB1aWRSZWZlcmVuY2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtwcm9wTmFtZV0gPSBkZWVwQ2xvbmUodmFsdWUsIHVpZFJlZmVyZW5jZSwgZnJlZXplKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmVzdWx0W3Byb3BOYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChmcmVlemUgPT09IHRydWUgJiYgIU9iamVjdC5pc0Zyb3plbihyZXN1bHQpKSB7XG4gICAgICAgIE9iamVjdC5mcmVlemUocmVzdWx0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmV4cG9ydHMuZGVlcENsb25lID0gZGVlcENsb25lO1xuZnVuY3Rpb24gZGVlcENsb25lQXJyYXkoYXJyLCB1aWRSZWZlcmVuY2UsIGZyZWV6ZSkge1xuICAgIHJldHVybiBhcnIubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIGlmIChpc0FycmF5KGl0ZW0pKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVlcENsb25lQXJyYXkoaXRlbSwgdWlkUmVmZXJlbmNlLCBmcmVlemUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICAgICAgICBpZiAoaGFzVWlkKGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgaWYgKHVpZFJlZmVyZW5jZSAmJiAoaXRlbVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSA9PT0gdWlkUmVmZXJlbmNlW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdWlkUmVmZXJlbmNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWVwQ2xvbmUoaXRlbSwgdWlkUmVmZXJlbmNlLCBmcmVlemUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmV4cG9ydHMuY2FjaGVTaXplID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgdmFyIGNhY2hlTm9kZSA9IGxvY2F0ZV8xLmdldEN1cnJlbnROb2RlKGluc3RhbmNlKTtcbiAgICByZXR1cm4gY2FjaGVOb2RlID8gY2FjaGVOb2RlLml0ZW1zLnNpemUoKSA6IDA7XG59O1xuZXhwb3J0cy5jYWNoZUxlbmd0aCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIHJldHVybiBpbnN0YW5jZS50aHJlYWQubm9kZXMubGVuZ3RoO1xufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRYUnBiQzVxY3lJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OTFkR2xzTG5SeklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN1FVRkRRU3h6UWtGQmEwTXNVMEZCVXl4RFFVRkRMRU5CUVVFN1FVRkROVU1zTUVKQlFYTkRMR0ZCUVdFc1EwRkJReXhEUVVGQk8wRkJRM0JFTEhWQ1FVRXJRaXhWUVVGVkxFTkJRVU1zUTBGQlFUdEJRVVV4UXl4SlFVRk5MRmxCUVZrc1IwRkJSeXhQUVVGUExFTkJRVU1zWlVGQlpTeERRVUZETEVOQlFVTTdRVUZGT1VNc1NVRkJUU3hSUVVGUkxFZEJRVkVzVFVGQlRTeERRVUZETEZOQlFWTXNRMEZCUXl4UlFVRlJMRU5CUVVNN1FVRkRhRVFzU1VGQlNTeGxRVUZsTEVkQlFVY3NUVUZCVFN4RFFVRkRMRk5CUVZNc1EwRkJReXhqUVVGakxFTkJRVU03UVVGRmRFUXNhMEpCUVhsQ0xFdEJRVXM3U1VGRE1VSXNUVUZCVFN4RFFVRkRMRTlCUVU4c1MwRkJTeXhMUVVGTExGRkJRVkVzU1VGQlNTeFJRVUZSTEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzc2FVSkJRV2xDTEVOQlFVTTdRVUZET1VVc1EwRkJRenRCUVVabExHZENRVUZSTEZkQlJYWkNMRU5CUVVFN1FVRkZSQ3hyUWtGQmVVSXNSMEZCUnp0SlFVTjRRaXhOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEV0QlFVc3NVVUZCVVN4SlFVRkpMRkZCUVZFc1EwRkJReXhIUVVGSExFTkJRVU1zUzBGQlN5eHBRa0ZCYVVJc1EwRkJRenRCUVVNeFJTeERRVUZETzBGQlJtVXNaMEpCUVZFc1YwRkZka0lzUTBGQlFUdEJRVTlFTEd0Q1FVRjVRaXhUUVVGVE8wbEJRemxDTEVWQlFVVXNRMEZCUXl4RFFVRkRMRTFCUVUwc1EwRkJReXhUUVVGVExFTkJRVU1zVVVGQlVTeERRVUZETEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1MwRkJTeXhuUWtGQlowSXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRha1VzVFVGQlRTeERRVUZETEV0QlFVc3NRMEZCUXp0SlFVTnFRaXhEUVVGRE8wbEJTVVFzVFVGQlRTeERRVUZETEZOQlFWTXNTMEZCU3l4SlFVRkpMRWxCUVVrc1QwRkJUeXhUUVVGVExFdEJRVXNzVVVGQlVTeERRVUZETzBGQlF5OUVMRU5CUVVNN1FVRlNaU3huUWtGQlVTeFhRVkYyUWl4RFFVRkJPMEZCUzBRc2FVSkJRWGRDTEV0QlFVczdTVUZGZWtJc1JVRkJSU3hEUVVGRExFTkJRVU1zUTBGQlF5eExRVUZMTEVsQlFVa3NTMEZCU3l4TFFVRkxMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRE0wSXNUVUZCVFN4RFFVRkRMRXRCUVVzc1EwRkJRenRKUVVOcVFpeERRVUZETzBsQlIwUXNUVUZCVFN4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGUExFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NRMEZETTBJc1MwRkJTeXhKUVVGSkxFOUJRVThzUzBGQlN5eExRVUZMTEZGQlFWRTdWMEZETDBJc1QwRkJUeXhMUVVGTExFTkJRVU1zVFVGQlRTeExRVUZMTEZGQlFWRTdWMEZEYUVNc1QwRkJUeXhMUVVGTExFTkJRVU1zVFVGQlRTeExRVUZMTEZWQlFWVTdWMEZEYkVNc1EwRkJReXhEUVVGRExFdEJRVXNzUTBGQlF5eHZRa0ZCYjBJc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF5eERRVU0zUXl4RFFVRkRPMEZCUTA0c1EwRkJRenRCUVdKbExHVkJRVThzVlVGaGRFSXNRMEZCUVR0QlFVOUVMR3RDUVVGclFpeERRVUZETzBsQlEyWXNUVUZCVFN4RFFVRkRMRTFCUVUwc1EwRkJReXhUUVVGVExFTkJRVU1zVVVGQlVTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRCUVVNM1F5eERRVUZETzBGQlQwUXNaMEpCUVhWQ0xFdEJRVXM3U1VGRGVFSXNUVUZCVFN4RFFVRkRMRkZCUVZFc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeFJRVUZSTEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzc1pVRkJaU3hEUVVGRE8wRkJRMnhGTEVOQlFVTTdRVUZHWlN4alFVRk5MRk5CUlhKQ0xFTkJRVUU3UVVGRlJDeHBRa0ZCZDBJc1MwRkJTenRKUVVONlFpeEZRVUZGTEVOQlFVTXNRMEZCUXl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRFZDeE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRPMGxCUTJoQ0xFTkJRVU03U1VGRFJDeEZRVUZGTEVOQlFVTXNRMEZCUXl4UFFVRlBMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUzBGQlN5eERRVUZETEUxQlFVMHNTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8xRkJRM1pETEUxQlFVMHNRMEZCUXl4SlFVRkpMRU5CUVVNN1NVRkRhRUlzUTBGQlF6dEpRVUZETEVsQlFVa3NRMEZCUXl4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVGRExGRkJRVkVzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRNVUlzUjBGQlJ5eERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF6dFpRVU5zUWl4RlFVRkZMRU5CUVVNc1EwRkJReXhsUVVGbExFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03WjBKQlEycERMRTFCUVUwc1EwRkJReXhMUVVGTExFTkJRVU03V1VGRGFrSXNRMEZCUXp0UlFVTk1MRU5CUVVNN1VVRkRSQ3hOUVVGTkxFTkJRVU1zU1VGQlNTeERRVUZETzBsQlEyaENMRU5CUVVNN1NVRkRSQ3hOUVVGTkxFTkJRVU1zUzBGQlN5eERRVUZETzBGQlEycENMRU5CUVVNN1FVRm1aU3hsUVVGUExGVkJaWFJDTEVOQlFVRTdRVUZQUkN4NVFrRkJaME1zVVVGQmQwSTdTVUZEY0VRc1NVRkJTU3hKUVVGSkxFZEJRV1VzU1VGQlNTeHhRa0ZCVXl4RFFVRkRMRkZCUVZFc1EwRkJReXhYUVVGWExFTkJRVU1zUTBGQlFUdEpRVU14UkN4SlFVRkpMRU5CUVVNc1JVRkJSU3hIUVVGSExGRkJRVkVzUTBGQlF5eFhRVUZYTEVOQlFVTTdTVUZETDBJc1VVRkJVU3hEUVVGRExGZEJRVmNzU1VGQlNTeERRVUZETEVOQlFVTTdTVUZETVVJc1VVRkJVU3hEUVVGRExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1NVRkRlRUlzVFVGQlRTeERRVUZETEVsQlFVa3NRMEZCUXp0QlFVTm9RaXhEUVVGRE8wRkJUbVVzZFVKQlFXVXNhMEpCVFRsQ0xFTkJRVUU3UVVGRlJDeG5Ra0ZCZFVJc1IwRkJSenRKUVVOMFFpeEZRVUZGTEVOQlFVTXNRMEZCUXl4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRFVDeE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRPMGxCUTJwQ0xFTkJRVU03U1VGRFJDeEZRVUZGTEVOQlFVTXNRMEZCUXl4RFFVRkRMRkZCUVZFc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdVVUZEYWtJc1RVRkJUU3hEUVVGRExFdEJRVXNzUTBGQlF6dEpRVU5xUWl4RFFVRkRPMGxCUTBRc1JVRkJSU3hEUVVGRExFTkJRVU1zVDBGQlR5eEhRVUZITEVOQlFVTXNZMEZCVFN4RFFVRkRMRTlCUVU4c1EwRkJReXhMUVVGTExGZEJRVmNzUTBGQlF5eERRVUZETEVOQlFVTTdVVUZETjBNc1RVRkJUU3hEUVVGRExFdEJRVXNzUTBGQlF6dEpRVU5xUWl4RFFVRkRPMGxCUTBRc1NVRkJTU3hIUVVGSExFZEJRVWNzUjBGQlJ5eERRVUZETEdOQlFVMHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRKUVVNNVFpeE5RVUZOTEVOQlFVTXNSMEZCUnl4RFFVRkRMRTFCUVUwc1MwRkJTeXhEUVVGRExFTkJRVU03UVVGRE5VSXNRMEZCUXp0QlFWcGxMR05CUVUwc1UwRlpja0lzUTBGQlFUdEJRVUZCTEVOQlFVTTdRVUZWUml4dFFrRkJNRUlzUjBGQlJ5eEZRVUZGTEZsQlFXRXNSVUZCUlN4TlFVRmhPMGxCUVdJc2MwSkJRV0VzUjBGQllpeGhRVUZoTzBsQlEzWkVMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVU1zUjBGQlJ5eEpRVUZKTEVOQlFVTXNRMEZCUXl4UlFVRlJMRU5CUVVNc1IwRkJSeXhEUVVGRExFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRE5VTXNUVUZCVFN4RFFVRkRMRWRCUVVjc1EwRkJRenRKUVVObUxFTkJRVU03U1VGRlJDeEZRVUZGTEVOQlFVTXNRMEZCUXl4TlFVRk5MRXRCUVVzc1NVRkJTU3hKUVVGSkxGbEJRVmtzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4UlFVRlJMRU5CUVVNc1dVRkJXU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzFGQlEzQkZMRTFCUVUwc1EwRkJReXhOUVVGTkxFTkJRVU1zV1VGQldTeERRVUZETEVOQlFVTTdTVUZEYUVNc1EwRkJRenRKUVVkRUxFVkJRVVVzUTBGQlF5eERRVUZETEZsQlFWa3NTVUZCU1N4TlFVRk5MRU5CUVVNc1IwRkJSeXhEUVVGRExFbEJRVWtzUjBGQlJ5eERRVUZETEdOQlFVMHNRMEZCUXl4UFFVRlBMRU5CUVVNc1MwRkJTeXhaUVVGWkxFTkJRVU1zWTBGQlRTeERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRSUVVOMFJpeE5RVUZOTEVOQlFVTXNXVUZCV1N4RFFVRkRPMGxCUTNoQ0xFTkJRVU03U1VGSFJDeEpRVUZKTEUxQlFVMHNSMEZCUnl4WlFVRlpMRU5CUVVNc1JVRkJSU3hGUVVGRkxFZEJRVWNzUTBGQlF5eERRVUZETzBsQlEyNURMRWRCUVVjc1EwRkJReXhEUVVGRExFbEJRVWtzVVVGQlVTeEpRVUZKTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkZia0lzU1VGQlNTeExRVUZMTEVkQlFVY3NSMEZCUnl4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRE8xRkJRekZDTEVWQlFVVXNRMEZCUXl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU03V1VGRFZDeEZRVUZGTEVOQlFVTXNRMEZCUXl4UFFVRlBMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzJkQ1FVTm9RaXhOUVVGTkxFTkJRVU1zVVVGQlVTeERRVUZETEVkQlFVY3NZMEZCWXl4RFFVRkRMRXRCUVVzc1JVRkJSU3haUVVGWkxFVkJRVVVzVFVGQlRTeERRVUZETEVOQlFVTTdXVUZEYmtVc1EwRkJRenRaUVVGRExFbEJRVWtzUTBGQlF5eEZRVUZGTEVOQlFVTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzJkQ1FVTjJRaXhKUVVGSkxFbEJRVWtzUjBGQlJ5eEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1QwRkJUeXhGUVVGRkxFTkJRVU1zUTBGQlF6dG5Ra0ZEY2tNc1JVRkJSU3hEUVVGRExFTkJRVU1zVFVGQlRTeExRVUZMTEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNN2IwSkJRMnhDTEUxQlFVMHNRMEZCUXl4TlFVRk5MRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03WjBKQlEzaENMRU5CUVVNN1owSkJRMFFzVFVGQlRTeERRVUZETEZGQlFWRXNRMEZCUXl4SFFVRkhMRWxCUVVrc1EwRkJRenRaUVVNMVFpeERRVUZETzFsQlFVTXNTVUZCU1N4RFFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRExGRkJRVkVzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1owSkJRM3BDTEVWQlFVVXNRMEZCUXl4RFFVRkRMRTFCUVUwc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdiMEpCUTJoQ0xFMUJRVTBzUTBGQlF5eFJRVUZSTEVOQlFVTXNSMEZCUnl4TFFVRkxMRU5CUVVNN2IwSkJRM3BDTEVWQlFVVXNRMEZCUXl4RFFVRkRMRmxCUVZrc1NVRkJTU3hOUVVGTkxFTkJRVU1zV1VGQldTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPM2RDUVVOMlF5eEZRVUZGTEVOQlFVTXNRMEZCUXl4TFFVRkxMRXRCUVVzc1dVRkJXVHNyUWtGRGJrSXNTMEZCU3l4RFFVRkRMRWRCUVVjc1MwRkJTeXhaUVVGWkxFTkJRVU1zUjBGQlJ6c3JRa0ZET1VJc1MwRkJTeXhMUVVGTExGbEJRVmtzUTBGQlF5eERRVUZETEVOQlFVTTdORUpCUXpWQ0xFMUJRVTBzUTBGQlF5eFJRVUZSTEVOQlFVTXNSMEZCUnl4WlFVRlpMRU5CUVVNN2QwSkJRM0JETEVOQlFVTTdiMEpCUTB3c1EwRkJRenR2UWtGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0dlFrRkhVaXhEUVVGRE8yZENRVU5NTEVOQlFVTTdaMEpCUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03YjBKQlEwb3NUVUZCVFN4RFFVRkRMRkZCUVZFc1EwRkJReXhIUVVGSExGTkJRVk1zUTBGQlF5eExRVUZMTEVWQlFVVXNXVUZCV1N4RlFVRkZMRTFCUVUwc1EwRkJReXhEUVVGRE8yZENRVU01UkN4RFFVRkRPMWxCUTA0c1EwRkJRenRaUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzJkQ1FVVklMRTlCUVU4c1EwRkJReXhIUVVGSExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVRTdaMEpCUTJ4Q0xFMUJRVTBzUTBGQlF5eFJRVUZSTEVOQlFVTXNSMEZCUnl4TFFVRkxMRU5CUVVNN1dVRkROMElzUTBGQlF6dFJRVU5NTEVOQlFVTTdTVUZGVkN4RFFVRkRPMGxCUTBRc1JVRkJSU3hEUVVGRExFTkJRVU1zVFVGQlRTeExRVUZMTEVsQlFVa3NTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJReXhSUVVGUkxFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMUZCUXpsRExFMUJRVTBzUTBGQlF5eE5RVUZOTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1NVRkRNVUlzUTBGQlF6dEpRVU5FTEUxQlFVMHNRMEZCUXl4TlFVRk5MRU5CUVVNN1FVRkRiRUlzUTBGQlF6dEJRWGhFWlN4cFFrRkJVeXhaUVhkRWVFSXNRMEZCUVR0QlFVVkVMSGRDUVVGM1FpeEhRVUZITEVWQlFVVXNXVUZCV1N4RlFVRkZMRTFCUVUwN1NVRkROME1zVFVGQlRTeERRVUZETEVkQlFVY3NRMEZCUXl4SFFVRkhMRU5CUVVNc1ZVRkJRU3hKUVVGSk8xRkJRMllzUlVGQlJTeERRVUZETEVOQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dFpRVU5vUWl4TlFVRk5MRU5CUVVNc1kwRkJZeXhEUVVGRExFbEJRVWtzUlVGQlJTeFpRVUZaTEVWQlFVVXNUVUZCVFN4RFFVRkRMRU5CUVVNN1VVRkRkRVFzUTBGQlF6dFJRVUZETEVsQlFVa3NRMEZCUXl4RlFVRkZMRU5CUVVNc1EwRkJReXhSUVVGUkxFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMWxCUlhoQ0xFVkJRVVVzUTBGQlF5eERRVUZETEUxQlFVMHNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03WjBKQlEyWXNSVUZCUlN4RFFVRkRMRU5CUVVNc1dVRkJXU3hKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEdOQlFVMHNRMEZCUXl4UFFVRlBMRU5CUVVNc1MwRkJTeXhaUVVGWkxFTkJRVU1zWTBGQlRTeERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8yOUNRVU14UlN4TlFVRk5MRU5CUVVNc1dVRkJXU3hEUVVGRE8yZENRVU40UWl4RFFVRkRPMmRDUVVORUxFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTTdXVUZEYUVJc1EwRkJRenRaUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzJkQ1FVTktMRTFCUVUwc1EwRkJReXhUUVVGVExFTkJRVU1zU1VGQlNTeEZRVUZGTEZsQlFWa3NSVUZCUlN4TlFVRk5MRU5CUVVNc1EwRkJRenRaUVVOcVJDeERRVUZETzFGQlEwd3NRMEZCUXp0UlFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8xbEJRMG9zVFVGQlRTeERRVUZETEVsQlFVa3NRMEZCUXp0UlFVTm9RaXhEUVVGRE8wbEJRMHdzUTBGQlF5eERRVUZETEVOQlFVTTdRVUZEVUN4RFFVRkRPMEZCUlZrc2FVSkJRVk1zUjBGQlJ5eFZRVUZETEZGQlFYZENPMGxCUXpsRExFbEJRVWtzVTBGQlV5eEhRVUZITEhWQ1FVRmpMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03U1VGRGVrTXNUVUZCVFN4RFFVRkRMRk5CUVZNc1IwRkJSeXhUUVVGVExFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NSVUZCUlN4SFFVRkhMRU5CUVVNc1EwRkJRenRCUVVOc1JDeERRVUZETEVOQlFVRTdRVUZGV1N4dFFrRkJWeXhIUVVGSExGVkJRVU1zVVVGQmQwSTdTVUZEYUVRc1RVRkJUU3hEUVVGRExGRkJRVkVzUTBGQlF5eE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTFCUVUwc1EwRkJRenRCUVVONFF5eERRVUZETEVOQlFVRWlmUT09XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uLy4uL3NyYy91dGlsLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQ2FjaGVNYXBfMSA9IHJlcXVpcmUoJy4vQ2FjaGVNYXAnKTtcbnZhciBDYWNoZU5vZGUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENhY2hlTm9kZShub2RlSWQpIHtcbiAgICAgICAgdGhpcy5pdGVtcyA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5pZCA9IG5vZGVJZDtcbiAgICB9XG4gICAgcmV0dXJuIENhY2hlTm9kZTtcbn0oKSk7XG5leHBvcnRzLkNhY2hlTm9kZSA9IENhY2hlTm9kZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaVEyRmphR1ZPYjJSbExtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTGk0dkxpNHZjM0pqTDBOaFkyaGxUbTlrWlM1MGN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU8wRkJRVUVzZVVKQlFYRkNMRmxCUVZrc1EwRkJReXhEUVVGQk8wRkJXV3hETzBsQlIwa3NiVUpCUVZrc1RVRkJZenRSUVVReFFpeFZRVUZMTEVkQlFYZENMRWxCUVVrc2EwSkJRVkVzUlVGQllTeERRVUZETzFGQlJXNUVMRWxCUVVrc1EwRkJReXhGUVVGRkxFZEJRVWNzVFVGQlRTeERRVUZETzBsQlEzSkNMRU5CUVVNN1NVRkRUQ3huUWtGQlF6dEJRVUZFTEVOQlFVTXNRVUZPUkN4SlFVMURPMEZCVGxrc2FVSkJRVk1zV1VGTmNrSXNRMEZCUVNKOVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi8uLi9zcmMvQ2FjaGVOb2RlLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgZmx1c2hfMSA9IHJlcXVpcmUoJy4vZmx1c2gnKTtcbnZhciBjYWNoZV8xID0gcmVxdWlyZSgnLi9jYWNoZScpO1xudmFyIG9wYXRoID0gcmVxdWlyZSgnLi9wYXRoJyk7XG52YXIgZ2V0XzEgPSByZXF1aXJlKCcuL2dldCcpO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuZXhwb3J0cy5hc3NpZ25SZWZUb1BhcmVudCA9IGZ1bmN0aW9uIChyZWZJdGVtLCBmbHVzaEFyZ3MpIHtcbiAgICBpZiAoZmx1c2hBcmdzLnBhcmVudFVpZCkge1xuICAgICAgICB2YXIgcGFyZW50SXRlbSA9IGZsdXNoXzEuZ2V0SXRlbUZsdXNoT3JDYWNoZWQoZmx1c2hBcmdzLnBhcmVudFVpZCwgZmx1c2hBcmdzKTtcbiAgICAgICAgaWYgKHBhcmVudEl0ZW0gJiYgZmx1c2hBcmdzLnJlZlBhdGgpIHtcbiAgICAgICAgICAgIGFzc2lnblJlZnMocGFyZW50SXRlbSwgcmVmSXRlbSwgZmx1c2hBcmdzLnJlZlBhdGgpO1xuICAgICAgICB9XG4gICAgfVxufTtcbnZhciBhc3NpZ25SZWZzID0gZnVuY3Rpb24gKHBhcmVudEl0ZW0sIHJlZkl0ZW0sIHJlZlBhdGgpIHtcbiAgICB2YXIgcGFyZW50VWlkID0gcGFyZW50SXRlbS5lbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV07XG4gICAgdmFyIHJlZlVpZCA9IHJlZkl0ZW0uZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgIGFkZFJlZlRvKHBhcmVudEl0ZW0sIHJlZlVpZCwgcmVmUGF0aCk7XG4gICAgYWRkUmVmRnJvbShyZWZJdGVtLCBwYXJlbnRVaWQsIHJlZlBhdGgpO1xufTtcbnZhciBhZGRSZWZUbyA9IGZ1bmN0aW9uIChwYXJlbnRJdGVtLCByZWZVaWQsIHBhdGgpIHtcbiAgICBpZiAocGFyZW50SXRlbS5tYXBUby5oYXMocmVmVWlkKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcGFyZW50SXRlbS5tYXBUby5zZXQocmVmVWlkLCBbXSk7XG4gICAgfVxuICAgIHZhciByZWZBcnJheSA9IHBhcmVudEl0ZW0ubWFwVG8uZ2V0KHJlZlVpZCk7XG4gICAgaWYgKHJlZkFycmF5LmluZGV4T2YocGF0aCkgPCAwKSB7XG4gICAgICAgIHJlZkFycmF5LnB1c2gocGF0aCk7XG4gICAgfVxuICAgIHJldHVybiBwYXJlbnRJdGVtO1xufTtcbnZhciBhZGRSZWZGcm9tID0gZnVuY3Rpb24gKHJlZkl0ZW0sIHBhcmVudFVpZCwgcGF0aCkge1xuICAgIGlmIChyZWZJdGVtLm1hcEZyb20uaGFzKHBhcmVudFVpZCkgPT09IGZhbHNlKSB7XG4gICAgICAgIHJlZkl0ZW0ubWFwRnJvbS5zZXQocGFyZW50VWlkLCBbXSk7XG4gICAgfVxuICAgIHZhciBmcm9tQXJyYXkgPSByZWZJdGVtLm1hcEZyb20uZ2V0KHBhcmVudFVpZCk7XG4gICAgaWYgKGZyb21BcnJheS5pbmRleE9mKHBhdGgpIDwgMCkge1xuICAgICAgICBmcm9tQXJyYXkucHVzaChwYXRoKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlZkl0ZW07XG59O1xuZXhwb3J0cy51cGRhdGVQb2ludGVycyA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICBmbHVzaEFyZ3MuZmx1c2hNYXAuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgIHVwZGF0ZUl0ZW1SZWZUb3MoaXRlbSwgZmx1c2hBcmdzKTtcbiAgICAgICAgZXhwb3J0cy51cGRhdGVSZWZGcm9tcyhpdGVtLCBmbHVzaEFyZ3MpO1xuICAgIH0pO1xufTtcbmV4cG9ydHMudXBkYXRlUmVmRnJvbXMgPSBmdW5jdGlvbiAoaXRlbSwgZmx1c2hBcmdzKSB7XG4gICAgY29uc29sZS5sb2coXCJVUERBVEUgUkVGIEZST01TXCIsIGl0ZW0pO1xuICAgIGl0ZW0ubWFwRnJvbS5mb3JFYWNoKGZ1bmN0aW9uIChwYXJlbnRVaWQsIHBhdGhzKSB7XG4gICAgICAgIHZhciBwYXJlbnRJdGVtID0gZmx1c2hBcmdzLmZsdXNoTWFwLmdldChwYXJlbnRVaWQpO1xuICAgICAgICBpZiAoIXBhcmVudEl0ZW0pIHtcbiAgICAgICAgICAgIHBhcmVudEl0ZW0gPSBnZXRfMS5nZXRDYWNoZWRJdGVtKHBhcmVudFVpZCwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyZW50SXRlbSAmJiBwYXRocy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgZmlyc3RQYXRoID0gcGF0aHNbMF07XG4gICAgICAgICAgICB2YXIgdGFyZ2V0UmVmID0gb3BhdGguZ2V0KHBhcmVudEl0ZW0uZW50aXR5LCBmaXJzdFBhdGgpO1xuICAgICAgICAgICAgdmFyIGRpcnR5ID0gKHRhcmdldFJlZiAmJiB0YXJnZXRSZWYgIT09IGl0ZW0uZW50aXR5KTtcbiAgICAgICAgICAgIGlmIChkaXJ0eSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHZhciBhcmdzID0ge1xuICAgICAgICAgICAgICAgICAgICBlbnRpdHk6IHBhcmVudEl0ZW0uZW50aXR5LFxuICAgICAgICAgICAgICAgICAgICBmbHVzaE1hcDogZmx1c2hBcmdzLmZsdXNoTWFwLFxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZTogZmx1c2hBcmdzLmluc3RhbmNlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBwYXJlbnRJdGVtID0gZmx1c2hfMS5lbnN1cmVJdGVtKGFyZ3MpO1xuICAgICAgICAgICAgICAgIHBhcmVudEl0ZW0uZW50aXR5ID0gdXRpbF8xLmRlZXBDbG9uZShwYXJlbnRJdGVtLmVudGl0eSwgaXRlbS5lbnRpdHksIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59O1xuZXhwb3J0cy51cGRhdGVSZWZUb3MgPSBmdW5jdGlvbiAoZW50aXR5VWlkLCBmbHVzaEFyZ3MpIHtcbiAgICB2YXIgaXRlbSA9IGZsdXNoXzEuZ2V0SXRlbUZsdXNoT3JDYWNoZWQoZW50aXR5VWlkLCBmbHVzaEFyZ3MpO1xuICAgIHVwZGF0ZUl0ZW1SZWZUb3MoaXRlbSwgZmx1c2hBcmdzKTtcbn07XG52YXIgdXBkYXRlSXRlbVJlZlRvcyA9IGZ1bmN0aW9uIChpdGVtLCBmbHVzaEFyZ3MpIHtcbiAgICBjb25zb2xlLmxvZyhcIlVQREFURSBSRUYgVE9TXCIsIGl0ZW0pO1xuICAgIGlmIChpdGVtKSB7XG4gICAgICAgIGl0ZW0ubWFwVG8uZm9yRWFjaChmdW5jdGlvbiAodG9VaWQsIHBhdGhzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIklURVJBVElOR1wiLCB0b1VpZCk7XG4gICAgICAgICAgICB2YXIgdXBkYXRlZFBhdGhzID0gcGF0aHMubWFwKGZ1bmN0aW9uIChwYXRoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlZmVyZW5jZSA9IG9wYXRoLmdldChpdGVtLmVudGl0eSwgcGF0aCk7XG4gICAgICAgICAgICAgICAgaWYgKHJlZmVyZW5jZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0VWlkID0gcmVmZXJlbmNlW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0VWlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZm91bmQgPSB0YXJnZXRVaWQgPT0gdG9VaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZm91bmQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGF0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZW1vdmVSZWZGcm9tX1ZhbHVlKGl0ZW0uZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdLCB0b1VpZCwgZmx1c2hBcmdzKTtcbiAgICAgICAgICAgIH0pLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtICE9PSBudWxsICYmIGl0ZW0gIT09IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHVwZGF0ZWRQYXRocy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgaXRlbS5tYXBUby5zZXQodG9VaWQsIHVwZGF0ZWRQYXRocyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpdGVtLm1hcFRvLmRlbGV0ZSh0b1VpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG52YXIgcmVtb3ZlUmVmRnJvbV9WYWx1ZSA9IGZ1bmN0aW9uIChwYXJlbnRVaWQsIHJlZlVpZCwgZmx1c2hBcmdzKSB7XG4gICAgdmFyIHJlZkl0ZW0gPSBmbHVzaF8xLmdldEl0ZW1GbHVzaE9yQ2FjaGVkKHJlZlVpZCwgZmx1c2hBcmdzKTtcbiAgICBpZiAocmVmSXRlbSkge1xuICAgICAgICByZWZJdGVtID0gcmVmSXRlbS5jbG9uZSgpO1xuICAgICAgICBpZiAocmVmSXRlbS5tYXBGcm9tLmhhcyhwYXJlbnRVaWQpKSB7XG4gICAgICAgICAgICByZW1vdmVSZWZGcm9tKHJlZkl0ZW0sIHBhcmVudFVpZCwgZmx1c2hBcmdzLnJlZlBhdGgpO1xuICAgICAgICAgICAgaWYgKHJlZkl0ZW0ubWFwRnJvbS5zaXplKCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZXZpY3RNYXAuc2V0KHJlZlVpZCwgcmVmSXRlbSk7XG4gICAgICAgICAgICAgICAgZmx1c2hBcmdzLmZsdXNoTWFwLmRlbGV0ZShyZWZVaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZmx1c2hBcmdzLmZsdXNoTWFwLnNldChyZWZVaWQsIHJlZkl0ZW0pO1xuICAgICAgICAgICAgICAgIGZsdXNoQXJncy5ldmljdE1hcC5kZWxldGUocmVmVWlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG52YXIgcmVtb3ZlUmVmRnJvbSA9IGZ1bmN0aW9uIChpdGVtLCBwYXJlbnRVaWQsIHBhdGgpIHtcbiAgICB2YXIgcmVmc0FycmF5ID0gaXRlbS5tYXBGcm9tLmdldChwYXJlbnRVaWQpO1xuICAgIHZhciBpbmRleCA9IHJlZnNBcnJheS5pbmRleE9mKHBhdGgpO1xuICAgIHJlZnNBcnJheSA9IHJlZnNBcnJheS5zbGljZSgpO1xuICAgIHJlZnNBcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIGl0ZW0ubWFwRnJvbS5zZXQocGFyZW50VWlkLCByZWZzQXJyYXkpO1xuICAgIGlmIChyZWZzQXJyYXkubGVuZ3RoID09IDApIHtcbiAgICAgICAgaXRlbS5tYXBGcm9tLmRlbGV0ZShwYXJlbnRVaWQpO1xuICAgIH1cbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2ljbVZtTG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhNaU9sc2lMaTR2TGk0dmMzSmpMM0psWmk1MGN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU8wRkJRVUVzYzBKQlFXbEVMRk5CUVZNc1EwRkJReXhEUVVGQk8wRkJSek5FTEhOQ1FVRjFRaXhUUVVGVExFTkJRVU1zUTBGQlFUdEJRVU5xUXl4SlFVRlpMRXRCUVVzc1YwRkJUU3hSUVVGUkxFTkJRVU1zUTBGQlFUdEJRVU5vUXl4dlFrRkJPRUlzVDBGQlR5eERRVUZETEVOQlFVRTdRVUZEZEVNc2NVSkJRVEJDTEZGQlFWRXNRMEZCUXl4RFFVRkJPMEZCUlhSQ0xIbENRVUZwUWl4SFFVRkhMRlZCUVVNc1QwRkJUeXhGUVVGRkxGTkJRWEZDTzBsQlF6VkVMRVZCUVVVc1EwRkJReXhEUVVGRExGTkJRVk1zUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXl4RFFVRkRPMUZCUTNSQ0xFbEJRVWtzVlVGQlZTeEhRVUZITERSQ1FVRnZRaXhEUVVGRExGTkJRVk1zUTBGQlF5eFRRVUZUTEVWQlFVVXNVMEZCVXl4RFFVRkRMRU5CUVVNN1VVRkRkRVVzUlVGQlJTeERRVUZETEVOQlFVTXNWVUZCVlN4SlFVRkpMRk5CUVZNc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF5eERRVUZETzFsQlEyeERMRlZCUVZVc1EwRkJReXhWUVVGVkxFVkJRVVVzVDBGQlR5eEZRVUZGTEZOQlFWTXNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRSUVVOMlJDeERRVUZETzBsQlEwd3NRMEZCUXp0QlFVTk1MRU5CUVVNc1EwRkJRenRCUVZOR0xFbEJRVTBzVlVGQlZTeEhRVUZITEZWQlFVTXNWVUZCY1VJc1JVRkJSU3hQUVVGclFpeEZRVUZGTEU5QlFXVTdTVUZETVVVc1NVRkJTU3hUUVVGVExFZEJRVWNzVlVGQlZTeERRVUZETEUxQlFVMHNRMEZCUXl4alFVRk5MRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03U1VGRGJFUXNTVUZCU1N4TlFVRk5MRWRCUVVjc1QwRkJUeXhEUVVGRExFMUJRVTBzUTBGQlF5eGpRVUZOTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN1NVRkhOVU1zVVVGQlVTeERRVUZETEZWQlFWVXNSVUZCUlN4TlFVRk5MRVZCUVVVc1QwRkJUeXhEUVVGRExFTkJRVU03U1VGRGRFTXNWVUZCVlN4RFFVRkRMRTlCUVU4c1JVRkJSU3hUUVVGVExFVkJRVVVzVDBGQlR5eERRVUZETEVOQlFVTTdRVUZETlVNc1EwRkJReXhEUVVGRE8wRkJWVVlzU1VGQlRTeFJRVUZSTEVkQlFVY3NWVUZCUXl4VlFVRlZMRVZCUVVVc1RVRkJUU3hGUVVGRkxFbEJRVWs3U1VGRGRFTXNSVUZCUlN4RFFVRkRMRU5CUVVNc1ZVRkJWU3hEUVVGRExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNUVUZCVFN4RFFVRkRMRXRCUVVzc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF6dFJRVU42UXl4VlFVRlZMRU5CUVVNc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eE5RVUZOTEVWQlFVVXNSVUZCUlN4RFFVRkRMRU5CUVVFN1NVRkRjRU1zUTBGQlF6dEpRVU5FTEVsQlFVa3NVVUZCVVN4SFFVRkhMRlZCUVZVc1EwRkJReXhMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMGxCUXpWRExFVkJRVVVzUTBGQlF5eERRVUZETEZGQlFWRXNRMEZCUXl4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0UlFVTTNRaXhSUVVGUkxFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMGxCUTNoQ0xFTkJRVU03U1VGRFJDeE5RVUZOTEVOQlFVTXNWVUZCVlN4RFFVRkRPMEZCUTNSQ0xFTkJRVU1zUTBGQlF6dEJRVk5HTEVsQlFVMHNWVUZCVlN4SFFVRkhMRlZCUVVNc1QwRkJUeXhGUVVGRkxGTkJRVk1zUlVGQlJTeEpRVUZKTzBsQlEzaERMRVZCUVVVc1EwRkJReXhEUVVGRExFOUJRVThzUTBGQlF5eFBRVUZQTEVOQlFVTXNSMEZCUnl4RFFVRkRMRk5CUVZNc1EwRkJReXhMUVVGTExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTTdVVUZETTBNc1QwRkJUeXhEUVVGRExFOUJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNVMEZCVXl4RlFVRkZMRVZCUVVVc1EwRkJReXhEUVVGRE8wbEJRM1pETEVOQlFVTTdTVUZEUkN4SlFVRkpMRk5CUVZNc1IwRkJSeXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVkQlFVY3NRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRKUVVNdlF5eEZRVUZGTEVOQlFVTXNRMEZCUXl4VFFVRlRMRU5CUVVNc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRPVUlzVTBGQlV5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRKUVVONlFpeERRVUZETzBsQlEwUXNUVUZCVFN4RFFVRkRMRTlCUVU4c1EwRkJRenRCUVVOdVFpeERRVUZETEVOQlFVTTdRVUZOVnl4elFrRkJZeXhIUVVGSExGVkJRVU1zVTBGQmNVSTdTVUZGYUVRc1UwRkJVeXhEUVVGRExGRkJRVkVzUTBGQlF5eFBRVUZQTEVOQlFVTXNWVUZCUXl4SFFVRkhMRVZCUVVVc1NVRkJaVHRSUVVVMVF5eG5Ra0ZCWjBJc1EwRkJReXhKUVVGSkxFVkJRVVVzVTBGQlV5eERRVUZETEVOQlFVTTdVVUZEYkVNc2MwSkJRV01zUTBGQlF5eEpRVUZKTEVWQlFVVXNVMEZCVXl4RFFVRkRMRU5CUVVNN1NVRkRjRU1zUTBGQlF5eERRVUZETEVOQlFVRTdRVUZEVGl4RFFVRkRMRU5CUVVFN1FVRkZXU3h6UWtGQll5eEhRVUZITEZWQlFVTXNTVUZCWlN4RlFVRkZMRk5CUVhGQ08wbEJRMnBGTEU5QlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNc2EwSkJRV3RDTEVWQlFVVXNTVUZCU1N4RFFVRkRMRU5CUVVFN1NVRkRja01zU1VGQlNTeERRVUZETEU5QlFVOHNRMEZCUXl4UFFVRlBMRU5CUVVNc1ZVRkJReXhUUVVGVExFVkJRVVVzUzBGQlN6dFJRVU5zUXl4SlFVRkpMRlZCUVZVc1IwRkJSeXhUUVVGVExFTkJRVU1zVVVGQlVTeERRVUZETEVkQlFVY3NRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRSUVVOdVJDeEZRVUZGTEVOQlFVTXNRMEZCUXl4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRExFTkJRVU03V1VGRFpDeFZRVUZWTEVkQlFVY3NiVUpCUVdFc1EwRkJReXhUUVVGVExFVkJRVVVzVTBGQlV5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMUZCUXpsRUxFTkJRVU03VVVGTFJDeEZRVUZGTEVOQlFVTXNRMEZCUXl4VlFVRlZMRWxCUVVrc1MwRkJTeXhEUVVGRExFMUJRVTBzUjBGQlJ5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMWxCUTJwRExFbEJRVWtzVTBGQlV5eEhRVUZITEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRaUVVONlFpeEpRVUZKTEZOQlFWTXNSMEZCUnl4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExGVkJRVlVzUTBGQlF5eE5RVUZOTEVWQlFVVXNVMEZCVXl4RFFVRkRMRU5CUVVNN1dVRkZlRVFzU1VGQlNTeExRVUZMTEVkQlFVY3NRMEZCUXl4VFFVRlRMRWxCUVVrc1UwRkJVeXhMUVVGTExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0WlFVVnlSQ3hGUVVGRkxFTkJRVU1zUTBGQlF5eExRVUZMTEV0QlFVc3NTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJRenRuUWtGRGFrSXNTVUZCU1N4SlFVRkpMRWRCUVdVN2IwSkJRMjVDTEUxQlFVMHNSVUZCUlN4VlFVRlZMRU5CUVVNc1RVRkJUVHR2UWtGRGVrSXNVVUZCVVN4RlFVRkZMRk5CUVZNc1EwRkJReXhSUVVGUk8yOUNRVU0xUWl4UlFVRlJMRVZCUVVVc1UwRkJVeXhEUVVGRExGRkJRVkU3YVVKQlF5OUNMRU5CUVVFN1owSkJRMFFzVlVGQlZTeEhRVUZITEd0Q1FVRlZMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03WjBKQlRUbENMRlZCUVZVc1EwRkJReXhOUVVGTkxFZEJRVWNzWjBKQlFWTXNRMEZCUXl4VlFVRlZMRU5CUVVNc1RVRkJUU3hGUVVGRkxFbEJRVWtzUTBGQlF5eE5RVUZOTEVWQlFVVXNTVUZCU1N4RFFVRkRMRU5CUVVNN1dVRkRlRVVzUTBGQlF6dFJRVU5NTEVOQlFVTTdTVUZEVEN4RFFVRkRMRU5CUVVNc1EwRkJRVHRCUVVOT0xFTkJRVU1zUTBGQlFUdEJRVk5aTEc5Q1FVRlpMRWRCUVVjc1ZVRkJReXhUUVVGVExFVkJRVVVzVTBGQmNVSTdTVUZEZWtRc1NVRkJTU3hKUVVGSkxFZEJRVWNzTkVKQlFXOUNMRU5CUVVNc1UwRkJVeXhGUVVGRkxGTkJRVk1zUTBGQlF5eERRVUZETzBsQlEzUkVMR2RDUVVGblFpeERRVUZETEVsQlFVa3NSVUZCUlN4VFFVRlRMRU5CUVVNc1EwRkJRenRCUVVOMFF5eERRVUZETEVOQlFVTTdRVUZGUml4SlFVRk5MR2RDUVVGblFpeEhRVUZITEZWQlFVTXNTVUZCWlN4RlFVRkZMRk5CUVhGQ08wbEJRelZFTEU5QlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNc1owSkJRV2RDTEVWQlFVVXNTVUZCU1N4RFFVRkRMRU5CUVVFN1NVRkRia01zUlVGQlJTeERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJRenRSUVVsUUxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4RFFVRkRMRlZCUVVNc1MwRkJTeXhGUVVGRkxFdEJRVXM3V1VGRE5VSXNUMEZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXhYUVVGWExFVkJRVVVzUzBGQlN5eERRVUZETEVOQlFVTTdXVUZIYUVNc1NVRkJTU3haUVVGWkxFZEJRVWNzUzBGQlN5eERRVUZETEVkQlFVY3NRMEZCUXl4VlFVRkJMRWxCUVVrN1owSkJRemRDTEVsQlFVa3NVMEZCVXl4SFFVRkhMRXRCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zU1VGQlNTeERRVUZETEUxQlFVMHNSVUZCUlN4SlFVRkpMRU5CUVVNc1EwRkJRenRuUWtGRE4wTXNSVUZCUlN4RFFVRkRMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU1zUTBGQlF6dHZRa0ZEV2l4SlFVRkpMRk5CUVZNc1IwRkJSeXhUUVVGVExFTkJRVU1zWTBGQlRTeERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPMjlDUVVNeFF5eEZRVUZGTEVOQlFVTXNRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJReXhEUVVGRE8zZENRVVZhTEVsQlFVa3NTMEZCU3l4SFFVRkhMRk5CUVZNc1NVRkJTU3hMUVVGTExFTkJRVU03ZDBKQlJTOUNMRVZCUVVVc1EwRkJReXhEUVVGRExFdEJRVXNzUzBGQlN5eEpRVUZKTEVOQlFVTXNRMEZCUXl4RFFVRkRPelJDUVVOcVFpeE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRPM2RDUVVOb1FpeERRVUZETzI5Q1FVTk1MRU5CUVVNN1owSkJRMHdzUTBGQlF6dG5Ra0ZEUkN4dFFrRkJiVUlzUTBGQlF5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMR05CUVUwc1EwRkJReXhQUVVGUExFTkJRVU1zUlVGQlJTeExRVUZMTEVWQlFVVXNVMEZCVXl4RFFVRkRMRU5CUVVNN1dVRkRka1VzUTBGQlF5eERRVUZETEVOQlFVTXNUVUZCVFN4RFFVRkRMRlZCUVVFc1NVRkJTVHRuUWtGRFZpeE5RVUZOTEVOQlFVTXNTVUZCU1N4TFFVRkxMRWxCUVVrc1NVRkJTU3hKUVVGSkxFdEJRVXNzVTBGQlV5eERRVUZETzFsQlF5OURMRU5CUVVNc1EwRkJReXhEUVVGRE8xbEJSMGdzUlVGQlJTeERRVUZETEVOQlFVTXNXVUZCV1N4RFFVRkRMRTFCUVUwc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzJkQ1FVTXhRaXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVkQlFVY3NRMEZCUXl4TFFVRkxMRVZCUVVVc1dVRkJXU3hEUVVGRExFTkJRVU03V1VGRGVFTXNRMEZCUXp0WlFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8yZENRVU5LTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1RVRkJUU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETzFsQlJUZENMRU5CUVVNN1VVRkRUQ3hEUVVGRExFTkJRVU1zUTBGQlFUdEpRVU5PTEVOQlFVTTdRVUZEVEN4RFFVRkRMRU5CUVVFN1FVRlpSQ3hKUVVGTkxHMUNRVUZ0UWl4SFFVRkhMRlZCUVVNc1UwRkJVeXhGUVVGRkxFMUJRVTBzUlVGQlJTeFRRVUZ4UWp0SlFVVnFSU3hKUVVGSkxFOUJRVThzUjBGQll5dzBRa0ZCYjBJc1EwRkJReXhOUVVGTkxFVkJRVVVzVTBGQlV5eERRVUZETEVOQlFVTTdTVUZEYWtVc1JVRkJSU3hEUVVGRExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTXNRMEZCUXp0UlFVVldMRTlCUVU4c1IwRkJSeXhQUVVGUExFTkJRVU1zUzBGQlN5eEZRVUZGTEVOQlFVTTdVVUZKTVVJc1JVRkJSU3hEUVVGRExFTkJRVU1zVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzFsQlJXcERMR0ZCUVdFc1EwRkJReXhQUVVGUExFVkJRVVVzVTBGQlV5eEZRVUZGTEZOQlFWTXNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRaUVVOeVJDeEZRVUZGTEVOQlFVTXNRMEZCUXl4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFbEJRVWtzUlVGQlJTeExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1owSkJReTlDTEZOQlFWTXNRMEZCUXl4UlFVRlJMRU5CUVVNc1IwRkJSeXhEUVVGRExFMUJRVTBzUlVGQlJTeFBRVUZQTEVOQlFVTXNRMEZCUXp0blFrRkZlRU1zVTBGQlV5eERRVUZETEZGQlFWRXNRMEZCUXl4TlFVRk5MRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU03V1VGRGRFTXNRMEZCUXp0WlFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8yZENRVU5LTEZOQlFWTXNRMEZCUXl4UlFVRlJMRU5CUVVNc1IwRkJSeXhEUVVGRExFMUJRVTBzUlVGQlJTeFBRVUZQTEVOQlFVTXNRMEZCUXp0blFrRkZlRU1zVTBGQlV5eERRVUZETEZGQlFWRXNRMEZCUXl4TlFVRk5MRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU03V1VGRGRFTXNRMEZCUXp0UlFVTk1MRU5CUVVNN1NVRkRUQ3hEUVVGRE8wRkJRMHdzUTBGQlF5eERRVUZETzBGQlJVWXNTVUZCVFN4aFFVRmhMRWRCUVVjc1ZVRkJReXhKUVVGSkxFVkJRVVVzVTBGQlV5eEZRVUZGTEVsQlFVazdTVUZEZUVNc1NVRkJTU3hUUVVGVExFZEJRVWNzU1VGQlNTeERRVUZETEU5QlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03U1VGRk5VTXNTVUZCU1N4TFFVRkxMRWRCUVVjc1UwRkJVeXhEUVVGRExFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0SlFVZHdReXhUUVVGVExFZEJRVWNzVTBGQlV5eERRVUZETEV0QlFVc3NSVUZCUlN4RFFVRkRPMGxCUXpsQ0xGTkJRVk1zUTBGQlF5eE5RVUZOTEVOQlFVTXNTMEZCU3l4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVGRE8wbEJRek5DTEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNc1IwRkJSeXhEUVVGRExGTkJRVk1zUlVGQlJTeFRRVUZUTEVOQlFVTXNRMEZCUXp0SlFVTjJReXhGUVVGRkxFTkJRVU1zUTBGQlF5eFRRVUZUTEVOQlFVTXNUVUZCVFN4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRGVFSXNTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhOUVVGTkxFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdTVUZKYmtNc1EwRkJRenRCUVVOTUxFTkJRVU1zUTBGQlF5SjlcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vLi4vc3JjL3JlZi50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIGdldF8xID0gcmVxdWlyZSgnLi9nZXQnKTtcbnZhciBjYWNoZV8xID0gcmVxdWlyZSgnLi9jYWNoZScpO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIHBhdGhfMSA9IHJlcXVpcmUoJy4vcGF0aCcpO1xudmFyIENhY2hlSXRlbV8xID0gcmVxdWlyZSgnLi9DYWNoZUl0ZW0nKTtcbnZhciBDYWNoZU1hcF8xID0gcmVxdWlyZSgnLi9DYWNoZU1hcCcpO1xudmFyIHJlZl8xID0gcmVxdWlyZSgnLi9yZWYnKTtcbmV4cG9ydHMuYnVpbGRGbHVzaE1hcCA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICBpZiAodXRpbF8xLmhhc1VpZChmbHVzaEFyZ3MuZW50aXR5KSkge1xuICAgICAgICBidWlsZEVudGl0eUZsdXNoTWFwKGZsdXNoQXJncyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAodXRpbF8xLmlzQXJyYXkoZmx1c2hBcmdzLmVudGl0eSkpIHtcbiAgICAgICAgICAgIGNhY2hlQXJyUmVmcyhmbHVzaEFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVFbnRpdHlSZWZzKGZsdXNoQXJncyk7XG4gICAgICAgIH1cbiAgICB9XG59O1xudmFyIGJ1aWxkRW50aXR5Rmx1c2hNYXAgPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgZmx1c2hBcmdzLnJlZlBhdGggPSBcIlwiO1xuICAgIGlmIChpc0RpcnR5KGZsdXNoQXJncykgPT09IHRydWUpIHtcbiAgICAgICAgZW5zdXJlT25GbHVzaE1hcChmbHVzaEFyZ3MpO1xuICAgICAgICBjYWNoZUVudGl0eVJlZnMoZmx1c2hBcmdzKTtcbiAgICAgICAgcmVmXzEudXBkYXRlUmVmVG9zKFN0cmluZyhmbHVzaEFyZ3MuZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdKSwgZmx1c2hBcmdzKTtcbiAgICB9XG59O1xudmFyIGVuc3VyZU9uRmx1c2hNYXAgPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgdmFyIGVudGl0eVVpZCA9IFN0cmluZyhmbHVzaEFyZ3MuZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdKTtcbiAgICBpZiAoZmx1c2hBcmdzLmZsdXNoTWFwLmhhcyhlbnRpdHlVaWQpID09PSBmYWxzZSkge1xuICAgICAgICBleHBvcnRzLmVuc3VyZUl0ZW0oZmx1c2hBcmdzKTtcbiAgICAgICAgZmx1c2hBcmdzLnBhcmVudFVpZCA9IFN0cmluZyhlbnRpdHlVaWQpO1xuICAgIH1cbn07XG52YXIgY2FjaGVFbnRpdHlSZWZzID0gZnVuY3Rpb24gKGZsdXNoQXJncykge1xuICAgIHZhciBwYXJlbnRFbnRpdHkgPSBmbHVzaEFyZ3MuZW50aXR5O1xuICAgIGZvciAodmFyIHByb3AgaW4gcGFyZW50RW50aXR5KSB7XG4gICAgICAgIGlmIChwYXJlbnRFbnRpdHkuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgIHZhciByZWZFbnRpdHkgPSBwYXJlbnRFbnRpdHlbcHJvcF07XG4gICAgICAgICAgICBpZiAodXRpbF8xLmlzT2JqZWN0KHJlZkVudGl0eSkgfHwgdXRpbF8xLmlzQXJyYXkocmVmRW50aXR5KSkge1xuICAgICAgICAgICAgICAgIGZsdXNoQXJncy5lbnRpdHkgPSByZWZFbnRpdHk7XG4gICAgICAgICAgICAgICAgaWYgKHBhcmVudEVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICBmbHVzaEFyZ3MucGFyZW50VWlkID0gcGFyZW50RW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZmx1c2hBcmdzLnBhcmVudFVpZCkge1xuICAgICAgICAgICAgICAgICAgICBmbHVzaEFyZ3MucmVmUGF0aCA9IHBhdGhfMS5jb25jYXRQcm9wKGZsdXNoQXJncy5yZWZQYXRoLCBwcm9wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFmbHVzaEFyZ3MucmVmUGF0aCkge1xuICAgICAgICAgICAgICAgICAgICBmbHVzaEFyZ3MucmVmUGF0aCA9IHByb3A7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHV0aWxfMS5pc0FycmF5KHJlZkVudGl0eSkpIHtcbiAgICAgICAgICAgICAgICBjYWNoZUFyclJlZnMoZmx1c2hBcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHV0aWxfMS5pc09iamVjdChyZWZFbnRpdHkpKSB7XG4gICAgICAgICAgICAgICAgY2FjaGVPYmpSZWZzKGZsdXNoQXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBPYmplY3QuZnJlZXplKHJlZkVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xudmFyIGNhY2hlQXJyUmVmcyA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICB2YXIgZW50aXR5ID0gZmx1c2hBcmdzLmVudGl0eTtcbiAgICB2YXIgYXJyYXlQYXRoID0gZmx1c2hBcmdzLnJlZlBhdGg7XG4gICAgdmFyIGFycmF5VWlkO1xuICAgIGlmICghYXJyYXlVaWQpIHtcbiAgICAgICAgYXJyYXlVaWQgPSBmbHVzaEFyZ3MucGFyZW50VWlkO1xuICAgIH1cbiAgICBlbnRpdHkuZm9yRWFjaChmdW5jdGlvbiAobmV4dCwgaW5kZXgpIHtcbiAgICAgICAgZmx1c2hBcmdzLmVudGl0eSA9IG5leHQ7XG4gICAgICAgIGZsdXNoQXJncy5wYXJlbnRVaWQgPSBhcnJheVVpZDtcbiAgICAgICAgaWYgKGZsdXNoQXJncy5yZWZQYXRoIHx8IGFycmF5UGF0aCkge1xuICAgICAgICAgICAgZmx1c2hBcmdzLnJlZlBhdGggPSBhcnJheVBhdGggKyBcIi5cIiArIGluZGV4O1xuICAgICAgICB9XG4gICAgICAgIGlmICh1dGlsXzEuaXNBcnJheShuZXh0KSkge1xuICAgICAgICAgICAgY2FjaGVBcnJSZWZzKGZsdXNoQXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodXRpbF8xLmlzT2JqZWN0KG5leHQpKSB7XG4gICAgICAgICAgICBjYWNoZU9ialJlZnMoZmx1c2hBcmdzKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIE9iamVjdC5mcmVlemUoZW50aXR5KTtcbn07XG52YXIgY2FjaGVPYmpSZWZzID0gZnVuY3Rpb24gKGZsdXNoQXJncykge1xuICAgIGlmICh1dGlsXzEuaGFzVWlkKGZsdXNoQXJncy5lbnRpdHkpKSB7XG4gICAgICAgIGNhY2hlVWlkT2JqUmVmcyhmbHVzaEFyZ3MpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY2FjaGVFbnRpdHlSZWZzKGZsdXNoQXJncyk7XG4gICAgfVxufTtcbnZhciBjYWNoZVVpZE9ialJlZnMgPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgdmFyIHJlZkl0ZW0gPSBleHBvcnRzLmVuc3VyZUl0ZW0oZmx1c2hBcmdzKTtcbiAgICByZWZfMS5hc3NpZ25SZWZUb1BhcmVudChyZWZJdGVtLCBmbHVzaEFyZ3MpO1xuICAgIHZhciBleGlzdHMgPSBnZXRfMS5pc09uQ2FjaGUoZmx1c2hBcmdzKTtcbiAgICBpZiAoZXhpc3RzID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZXhwb3J0cy5idWlsZEZsdXNoTWFwKGZsdXNoQXJncyk7XG59O1xudmFyIGlzRGlydHkgPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgdmFyIGNhY2hlZEl0ZW0gPSBnZXRfMS5nZXRDYWNoZWRJdGVtKGZsdXNoQXJncy5lbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV0sIGZsdXNoQXJncy5pbnN0YW5jZSk7XG4gICAgcmV0dXJuICFjYWNoZWRJdGVtIHx8IGNhY2hlZEl0ZW0uZW50aXR5ICE9PSBmbHVzaEFyZ3MuZW50aXR5O1xufTtcbmV4cG9ydHMuZ2V0SXRlbUZsdXNoT3JDYWNoZWQgPSBmdW5jdGlvbiAodWlkLCBmbHVzaEFyZ3MpIHtcbiAgICBpZiAodWlkKSB7XG4gICAgICAgIHVpZCA9IFN0cmluZyh1aWQpO1xuICAgICAgICB2YXIgaXRlbSA9IGZsdXNoQXJncy5mbHVzaE1hcC5nZXQodWlkKTtcbiAgICAgICAgaWYgKCFpdGVtKSB7XG4gICAgICAgICAgICBpdGVtID0gZ2V0XzEuZ2V0Q2FjaGVkSXRlbSh1aWQsIGZsdXNoQXJncy5pbnN0YW5jZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0gJiYgT2JqZWN0LmlzRnJvemVuKGl0ZW0pKSB7XG4gICAgICAgICAgICBpdGVtID0gaXRlbS5jbG9uZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cbn07XG5leHBvcnRzLmVuc3VyZUl0ZW0gPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgdmFyIGl0ZW1VaWQgPSBTdHJpbmcoZmx1c2hBcmdzLmVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSk7XG4gICAgdmFyIGl0ZW0gPSBmbHVzaEFyZ3MuZmx1c2hNYXAuZ2V0KGl0ZW1VaWQpO1xuICAgIGlmIChpdGVtKSB7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cbiAgICB2YXIgbGl2ZSA9IGdldF8xLmdldENhY2hlZEl0ZW0oaXRlbVVpZCwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICBpdGVtID0gbmV3IENhY2hlSXRlbV8xLmRlZmF1bHQoZmx1c2hBcmdzLmVudGl0eSwgbGl2ZSk7XG4gICAgZmx1c2hBcmdzLmZsdXNoTWFwLnNldChpdGVtVWlkLCBpdGVtKTtcbiAgICBmbHVzaEFyZ3MuZmx1c2hNYXBbJ19fVVBEQVRFRF9fJ10gPSB0cnVlO1xuICAgIHJldHVybiBpdGVtO1xufTtcbmV4cG9ydHMucHJlRmx1c2ggPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgdmFyIHRlbXAgPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgdmFyIGN1cnJlbnRTdGFjayA9IGdldF8xLmdldENhY2hlQ3VycmVudFN0YWNrKGZsdXNoQXJncy5pbnN0YW5jZSk7XG4gICAgaWYgKGN1cnJlbnRTdGFjaykge1xuICAgICAgICBjdXJyZW50U3RhY2suZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgICAgICB0ZW1wLnNldChrZXksIGl0ZW0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZmx1c2hBcmdzLmZsdXNoTWFwLmZvckVhY2goZnVuY3Rpb24gKGtleSwgaXRlbSkge1xuICAgICAgICB2YXIgaXRlbVVpZCA9IGl0ZW0uZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgICAgICBmcmVlemVJdGVtKGl0ZW0pO1xuICAgICAgICB0ZW1wLnNldChTdHJpbmcoaXRlbVVpZCksIGl0ZW0pO1xuICAgIH0pO1xuICAgIGlmIChmbHVzaEFyZ3MuZXZpY3RNYXAuc2l6ZSgpID4gMCkge1xuICAgICAgICBmbHVzaEFyZ3MuZXZpY3RNYXAuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgdGVtcC5kZWxldGUoU3RyaW5nKGtleSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZXhwb3J0cy5mbHVzaCh0ZW1wLCBmbHVzaEFyZ3MuaW5zdGFuY2UpO1xufTtcbnZhciBmcmVlemVJdGVtID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICBPYmplY3QuZnJlZXplKGl0ZW0pO1xuICAgIE9iamVjdC5mcmVlemUoaXRlbS5lbnRpdHkpO1xuICAgIE9iamVjdC5mcmVlemUoaXRlbS5tYXBUbyk7XG4gICAgT2JqZWN0LmZyZWV6ZShpdGVtLm1hcEZyb20pO1xufTtcbmV4cG9ydHMuZmx1c2ggPSBmdW5jdGlvbiAodGVtcCwgaW5zdGFuY2UpIHtcbiAgICBpZiAodGVtcCAhPT0gbnVsbCkge1xuICAgICAgICBPYmplY3QuZnJlZXplKHRlbXApO1xuICAgICAgICB2YXIgY2FjaGVOb2RlID0gdXRpbF8xLmdldE5ld0NhY2hlTm9kZShpbnN0YW5jZSk7XG4gICAgICAgIGNhY2hlTm9kZS5pdGVtcyA9IHRlbXA7XG4gICAgICAgIGlmIChpbnN0YW5jZS50aHJlYWQubm9kZXMuaW5kZXhPZihjYWNoZU5vZGUuaWQpIDwgMCkge1xuICAgICAgICAgICAgaW5zdGFuY2UudGhyZWFkLm5vZGVzLnB1c2goY2FjaGVOb2RlLmlkKTtcbiAgICAgICAgICAgIGluc3RhbmNlLnRocmVhZC5jdXJyZW50ICs9IDE7XG4gICAgICAgIH1cbiAgICB9XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pWm14MWMyZ3Vhbk1pTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjeUk2V3lJdUxpOHVMaTl6Y21NdlpteDFjMmd1ZEhNaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWp0QlFVTkJMRzlDUVVFclJDeFBRVUZQTEVOQlFVTXNRMEZCUVR0QlFVVjJSU3h6UWtGQmRVSXNVMEZCVXl4RFFVRkRMRU5CUVVFN1FVRkRha01zY1VKQlFYRkhMRkZCUVZFc1EwRkJReXhEUVVGQk8wRkJRemxITEhGQ1FVRXlRaXhSUVVGUkxFTkJRVU1zUTBGQlFUdEJRVVZ3UXl3d1FrRkJjMElzWVVGQllTeERRVUZETEVOQlFVRTdRVUZGY0VNc2VVSkJRWEZDTEZsQlFWa3NRMEZCUXl4RFFVRkJPMEZCUTJ4RExHOUNRVUZuUkN4UFFVRlBMRU5CUVVNc1EwRkJRVHRCUVZjelF5eHhRa0ZCWVN4SFFVRkhMRlZCUVVNc1UwRkJjVUk3U1VGUEwwTXNSVUZCUlN4RFFVRkRMRU5CUVVNc1lVRkJUU3hEUVVGRExGTkJRVk1zUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRNMElzYlVKQlFXMUNMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03U1VGRGJrTXNRMEZCUXp0SlFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8xRkJRMG9zUlVGQlJTeERRVUZETEVOQlFVTXNZMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdXVUZETlVJc1dVRkJXU3hEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzFGQlF6VkNMRU5CUVVNN1VVRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dFpRVU5LTEdWQlFXVXNRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRSUVVNdlFpeERRVUZETzBsQlEwd3NRMEZCUXp0QlFVTk1MRU5CUVVNc1EwRkJRenRCUVVWR0xFbEJRVTBzYlVKQlFXMUNMRWRCUVVjc1ZVRkJReXhUUVVGeFFqdEpRVVU1UXl4VFFVRlRMRU5CUVVNc1QwRkJUeXhIUVVGSExFVkJRVVVzUTBGQlF6dEpRVVYyUWl4RlFVRkZMRU5CUVVNc1EwRkJReXhQUVVGUExFTkJRVU1zVTBGQlV5eERRVUZETEV0QlFVc3NTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJRenRSUVVVNVFpeG5Ra0ZCWjBJc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dFJRVU0xUWl4bFFVRmxMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03VVVGSk0wSXNhMEpCUVZrc1EwRkRVaXhOUVVGTkxFTkJRVU1zVTBGQlV5eERRVUZETEUxQlFVMHNRMEZCUXl4alFVRk5MRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU1zUlVGRGVFTXNVMEZCVXl4RFFVTmFMRU5CUVVNN1NVRkRUaXhEUVVGRE8wRkJRMHdzUTBGQlF5eERRVUZCTzBGQlRVUXNTVUZCVFN4blFrRkJaMElzUjBGQlJ5eFZRVUZETEZOQlFYRkNPMGxCUXpORExFbEJRVWtzVTBGQlV5eEhRVUZITEUxQlFVMHNRMEZCUXl4VFFVRlRMRU5CUVVNc1RVRkJUU3hEUVVGRExHTkJRVTBzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXl4RFFVRkRPMGxCUTNwRUxFVkJRVVVzUTBGQlF5eERRVUZETEZOQlFWTXNRMEZCUXl4UlFVRlJMRU5CUVVNc1IwRkJSeXhEUVVGRExGTkJRVk1zUTBGQlF5eExRVUZMTEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRPVU1zYTBKQlFWVXNRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRSUVVWMFFpeFRRVUZUTEVOQlFVTXNVMEZCVXl4SFFVRkhMRTFCUVUwc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dEpRVU0xUXl4RFFVRkRPMEZCUTB3c1EwRkJReXhEUVVGQk8wRkJVMFFzU1VGQlRTeGxRVUZsTEVkQlFVY3NWVUZCUXl4VFFVRnhRanRKUVVreFF5eEpRVUZKTEZsQlFWa3NSMEZCUnl4VFFVRlRMRU5CUVVNc1RVRkJUU3hEUVVGRE8wbEJSWEJETEVkQlFVY3NRMEZCUXl4RFFVRkRMRWxCUVVrc1NVRkJTU3hKUVVGSkxGbEJRVmtzUTBGQlF5eERRVUZETEVOQlFVTTdVVUZGTlVJc1JVRkJSU3hEUVVGRExFTkJRVU1zV1VGQldTeERRVUZETEdOQlFXTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03V1VGRmNFTXNTVUZCU1N4VFFVRlRMRWRCUVVjc1dVRkJXU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzFsQlJXNURMRVZCUVVVc1EwRkJReXhEUVVGRExHVkJRVkVzUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1N4alFVRlBMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzJkQ1FVTTFReXhUUVVGVExFTkJRVU1zVFVGQlRTeEhRVUZITEZOQlFWTXNRMEZCUXp0blFrRkROMElzUlVGQlJTeERRVUZETEVOQlFVTXNXVUZCV1N4RFFVRkRMR05CUVUwc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdiMEpCUXk5Q0xGTkJRVk1zUTBGQlF5eFRRVUZUTEVkQlFVY3NXVUZCV1N4RFFVRkRMR05CUVUwc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dG5Ra0ZEZGtRc1EwRkJRenRuUWtGRFJDeEZRVUZGTEVOQlFVTXNRMEZCUXl4VFFVRlRMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU1zUTBGQlF6dHZRa0ZEZEVJc1UwRkJVeXhEUVVGRExFOUJRVThzUjBGQlJ5eHBRa0ZCVlN4RFFVRkRMRk5CUVZNc1EwRkJReXhQUVVGUExFVkJRVVVzU1VGQlNTeERRVUZETEVOQlFVTTdaMEpCUXpWRUxFTkJRVU03WjBKQlEwUXNSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJReXhUUVVGVExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTXNRMEZCUXp0dlFrRkRja0lzVTBGQlV5eERRVUZETEU5QlFVOHNSMEZCUnl4SlFVRkpMRU5CUVVNN1owSkJRemRDTEVOQlFVTTdXVUZEVEN4RFFVRkRPMWxCVDBRc1JVRkJSU3hEUVVGRExFTkJRVU1zWTBGQlR5eERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRuUWtGRGNrSXNXVUZCV1N4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRE8xbEJRelZDTEVOQlFVTTdXVUZCUXl4SlFVRkpMRU5CUVVNc1JVRkJSU3hEUVVGRExFTkJRVU1zWlVGQlVTeERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRuUWtGRk4wSXNXVUZCV1N4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRE8xbEJRelZDTEVOQlFVTTdXVUZEUkN4TlFVRk5MRU5CUVVNc1RVRkJUU3hEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzFGQlF6ZENMRU5CUVVNN1NVRkRUQ3hEUVVGRE8wRkJRMHdzUTBGQlF5eERRVUZETzBGQlYwWXNTVUZCVFN4WlFVRlpMRWRCUVVjc1ZVRkJReXhUUVVGeFFqdEpRVU4yUXl4SlFVRkpMRTFCUVUwc1IwRkJSeXhUUVVGVExFTkJRVU1zVFVGQlRTeERRVUZETzBsQlRUbENMRWxCUVVrc1UwRkJVeXhIUVVGSExGTkJRVk1zUTBGQlF5eFBRVUZQTEVOQlFVTTdTVUZEYkVNc1NVRkJTU3hSUVVGUkxFTkJRVU03U1VGRFlpeEZRVUZGTEVOQlFVTXNRMEZCUXl4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRFdpeFJRVUZSTEVkQlFVY3NVMEZCVXl4RFFVRkRMRk5CUVZNc1EwRkJRenRKUVVOdVF5eERRVUZETzBsQlJVRXNUVUZCY1VJc1EwRkJReXhQUVVGUExFTkJRVU1zVlVGQlF5eEpRVUZKTEVWQlFVVXNTMEZCU3p0UlFVMTJReXhUUVVGVExFTkJRVU1zVFVGQlRTeEhRVUZITEVsQlFVa3NRMEZCUXp0UlFVTjRRaXhUUVVGVExFTkJRVU1zVTBGQlV5eEhRVUZITEZGQlFWRXNRMEZCUXp0UlFVVXZRaXhGUVVGRkxFTkJRVU1zUTBGQlF5eFRRVUZUTEVOQlFVTXNUMEZCVHl4SlFVRkpMRk5CUVZNc1EwRkJReXhEUVVGRExFTkJRVU03V1VGRGFrTXNVMEZCVXl4RFFVRkRMRTlCUVU4c1IwRkJSeXhUUVVGVExFZEJRVWNzUjBGQlJ5eEhRVUZITEV0QlFVc3NRMEZCUXp0UlFVTm9SQ3hEUVVGRE8xRkJXVVFzUlVGQlJTeERRVUZETEVOQlFVTXNZMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dFpRVU5vUWl4WlFVRlpMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03VVVGRE5VSXNRMEZCUXp0UlFVRkRMRWxCUVVrc1EwRkJReXhGUVVGRkxFTkJRVU1zUTBGQlF5eGxRVUZSTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8xbEJRM2hDTEZsQlFWa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRSUVVNMVFpeERRVUZETzBsQlEwd3NRMEZCUXl4RFFVRkRMRU5CUVVNN1NVRkhTQ3hOUVVGTkxFTkJRVU1zVFVGQlRTeERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMEZCUXpGQ0xFTkJRVU1zUTBGQlF6dEJRVmRHTEVsQlFVMHNXVUZCV1N4SFFVRkhMRlZCUVVNc1UwRkJjVUk3U1VGRGRrTXNSVUZCUlN4RFFVRkRMRU5CUVVNc1lVRkJUU3hEUVVGRExGTkJRVk1zUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRNMElzWlVGQlpTeERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRPMGxCUXk5Q0xFTkJRVU03U1VGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0UlFVVktMR1ZCUVdVc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dEpRVU12UWl4RFFVRkRPMEZCUTB3c1EwRkJReXhEUVVGRE8wRkJSVVlzU1VGQlRTeGxRVUZsTEVkQlFVY3NWVUZCUXl4VFFVRnhRanRKUVVreFF5eEpRVUZKTEU5QlFVOHNSMEZCUnl4clFrRkJWU3hEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzBsQlEzQkRMSFZDUVVGcFFpeERRVUZETEU5QlFVOHNSVUZCUlN4VFFVRlRMRU5CUVVNc1EwRkJRenRKUVVWMFF5eEpRVUZKTEUxQlFVMHNSMEZCUnl4bFFVRlRMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03U1VGRmJFTXNSVUZCUlN4RFFVRkRMRU5CUVVNc1RVRkJUU3hMUVVGTExFbEJRVWtzUTBGQlF5eERRVUZETEVOQlFVTTdVVUZGYkVJc1RVRkJUU3hEUVVGRE8wbEJRMWdzUTBGQlF6dEpRVk5FTEhGQ1FVRmhMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03UVVGRE4wSXNRMEZCUXl4RFFVRkJPMEZCUlVRc1NVRkJUU3hQUVVGUExFZEJRVWNzVlVGQlF5eFRRVUZ4UWp0SlFVTnNReXhKUVVGSkxGVkJRVlVzUjBGQlJ5eHRRa0ZCWVN4RFFVRkRMRk5CUVZNc1EwRkJReXhOUVVGTkxFTkJRVU1zWTBGQlRTeERRVUZETEU5QlFVOHNRMEZCUXl4RlFVRkZMRk5CUVZNc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dEpRVU55Uml4TlFVRk5MRU5CUVVNc1EwRkJReXhWUVVGVkxFbEJRVWtzVlVGQlZTeERRVUZETEUxQlFVMHNTMEZCU3l4VFFVRlRMRU5CUVVNc1RVRkJUU3hEUVVGRE8wRkJRMnBGTEVOQlFVTXNRMEZCUVR0QlFVdFpMRFJDUVVGdlFpeEhRVUZITEZWQlFVTXNSMEZCVnl4RlFVRkZMRk5CUVhGQ08wbEJRMjVGTEVWQlFVVXNRMEZCUXl4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRFRpeEhRVUZITEVkQlFVY3NUVUZCVFN4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRE8xRkJRMnhDTEVsQlFVa3NTVUZCU1N4SFFVRkhMRk5CUVZNc1EwRkJReXhSUVVGUkxFTkJRVU1zUjBGQlJ5eERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRPMUZCUTNaRExFVkJRVVVzUTBGQlF5eERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJRenRaUVVOU0xFbEJRVWtzUjBGQlJ5eHRRa0ZCWVN4RFFVRkRMRWRCUVVjc1JVRkJSU3hUUVVGVExFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdVVUZEYkVRc1EwRkJRenRSUVVORUxFVkJRVVVzUTBGQlF5eERRVUZETEVsQlFVa3NTVUZCU1N4TlFVRk5MRU5CUVVNc1VVRkJVU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0WlFVTm9ReXhKUVVGSkxFZEJRVWNzU1VGQlNTeERRVUZETEV0QlFVc3NSVUZCUlN4RFFVRkRPMUZCUTNoQ0xFTkJRVU03VVVGRFJDeE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRPMGxCUTJoQ0xFTkJRVU03UVVGRFRDeERRVUZETEVOQlFVTTdRVUZUVnl4clFrRkJWU3hIUVVGSExGVkJRVU1zVTBGQmNVSTdTVUZETlVNc1NVRkJTU3hQUVVGUExFZEJRVWNzVFVGQlRTeERRVUZETEZOQlFWTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1kwRkJUU3hEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETEVOQlFVTTdTVUZEZGtRc1NVRkJTU3hKUVVGSkxFZEJRV01zVTBGQlV5eERRVUZETEZGQlFWRXNRMEZCUXl4SFFVRkhMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03U1VGRGRFUXNSVUZCUlN4RFFVRkRMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU1zUTBGQlF6dFJRVU5RTEUxQlFVMHNRMEZCUXl4SlFVRkpMRU5CUVVNN1NVRkRhRUlzUTBGQlF6dEpRVWRFTEVsQlFVa3NTVUZCU1N4SFFVRmpMRzFDUVVGaExFTkJRVU1zVDBGQlR5eEZRVUZGTEZOQlFWTXNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRKUVVOcVJTeEpRVUZKTEVkQlFVY3NTVUZCU1N4dFFrRkJVeXhEUVVGRExGTkJRVk1zUTBGQlF5eE5RVUZOTEVWQlFVVXNTVUZCU1N4RFFVRkRMRU5CUVVNN1NVRkZOME1zVTBGQlV5eERRVUZETEZGQlFWRXNRMEZCUXl4SFFVRkhMRU5CUVVNc1QwRkJUeXhGUVVGRkxFbEJRVWtzUTBGQlF5eERRVUZETzBsQlEzUkRMRk5CUVZNc1EwRkJReXhSUVVGUkxFTkJRVU1zWVVGQllTeERRVUZETEVkQlFVY3NTVUZCU1N4RFFVRkRPMGxCUTNwRExFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTTdRVUZEYUVJc1EwRkJReXhEUVVGRE8wRkJWVmNzWjBKQlFWRXNSMEZCUnl4VlFVRkRMRk5CUVhGQ08wbEJSVEZETEVsQlFVa3NTVUZCU1N4SFFVRkhMRWxCUVVrc2EwSkJRVkVzUlVGQllTeERRVUZETzBsQlNYSkRMRWxCUVVrc1dVRkJXU3hIUVVGM1Fpd3dRa0ZCYjBJc1EwRkJReXhUUVVGVExFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdTVUZEYWtZc1JVRkJSU3hEUVVGRExFTkJRVU1zV1VGQldTeERRVUZETEVOQlFVTXNRMEZCUXp0UlFVTm1MRmxCUVZrc1EwRkJReXhQUVVGUExFTkJRVU1zVlVGQlF5eEhRVUZITEVWQlFVVXNTVUZCWlR0WlFVTjBReXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVkQlFVY3NSVUZCUlN4SlFVRkpMRU5CUVVNc1EwRkJRenRSUVVONFFpeERRVUZETEVOQlFVTXNRMEZCUXp0SlFVTlFMRU5CUVVNN1NVRkZSQ3hUUVVGVExFTkJRVU1zVVVGQlVTeERRVUZETEU5QlFVOHNRMEZCUXl4VlFVRkRMRWRCUVVjc1JVRkJSU3hKUVVGbE8xRkJSVFZETEVsQlFVa3NUMEZCVHl4SFFVRkhMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zWTBGQlRTeERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPMUZCUXpGRExGVkJRVlVzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0UlFVTnFRaXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEUxQlFVMHNRMEZCUXl4UFFVRlBMRU5CUVVNc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF6dEpRVU53UXl4RFFVRkRMRU5CUVVNc1EwRkJRenRKUVVWSUxFVkJRVVVzUTBGQlF5eERRVUZETEZOQlFWTXNRMEZCUXl4UlFVRlJMRU5CUVVNc1NVRkJTU3hGUVVGRkxFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0UlFVTm9ReXhUUVVGVExFTkJRVU1zVVVGQlVTeERRVUZETEU5QlFVOHNRMEZCUXl4VlFVRkRMRWRCUVVjc1JVRkJSU3hMUVVGTE8xbEJRMnhETEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNc1RVRkJUU3hEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTTdVVUZETjBJc1EwRkJReXhEUVVGRExFTkJRVU03U1VGRFVDeERRVUZETzBsQlJVUXNZVUZCU3l4RFFVRkRMRWxCUVVrc1JVRkJSU3hUUVVGVExFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdRVUZEY0VNc1EwRkJReXhEUVVGRE8wRkJSVVlzU1VGQlRTeFZRVUZWTEVkQlFVY3NWVUZCUXl4SlFVRmxPMGxCUXk5Q0xFMUJRVTBzUTBGQlF5eE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1NVRkRjRUlzVFVGQlRTeERRVUZETEUxQlFVMHNRMEZCUXl4SlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU03U1VGRE0wSXNUVUZCVFN4RFFVRkRMRTFCUVUwc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdTVUZETVVJc1RVRkJUU3hEUVVGRExFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN1FVRkRhRU1zUTBGQlF5eERRVUZETzBGQlUxY3NZVUZCU3l4SFFVRkhMRlZCUVVNc1NVRkJlVUlzUlVGQlJTeFJRVUYzUWp0SlFVTnlSU3hGUVVGRkxFTkJRVU1zUTBGQlF5eEpRVUZKTEV0QlFVc3NTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJRenRSUVVOb1FpeE5RVUZOTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8xRkJRM0JDTEVsQlFVa3NVMEZCVXl4SFFVRkhMSE5DUVVGbExFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdVVUZETVVNc1UwRkJVeXhEUVVGRExFdEJRVXNzUjBGQlJ5eEpRVUZKTEVOQlFVTTdVVUZGZGtJc1JVRkJSU3hEUVVGRExFTkJRVU1zVVVGQlVTeERRVUZETEUxQlFVMHNRMEZCUXl4TFFVRkxMRU5CUVVNc1QwRkJUeXhEUVVGRExGTkJRVk1zUTBGQlF5eEZRVUZGTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8xbEJRMnhFTEZGQlFWRXNRMEZCUXl4TlFVRk5MRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNN1dVRkRla01zVVVGQlVTeERRVUZETEUxQlFVMHNRMEZCUXl4UFFVRlBMRWxCUVVrc1EwRkJReXhEUVVGRE8xRkJRMnBETEVOQlFVTTdTVUZEVEN4RFFVRkRPMEZCUTB3c1EwRkJReXhEUVVGREluMD1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vLi4vc3JjL2ZsdXNoLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgY2FjaGVfMSA9IHJlcXVpcmUoJy4vY2FjaGUnKTtcbnZhciB1dGlsXzEgPSByZXF1aXJlKCcuL3V0aWwnKTtcbmV4cG9ydHMuZ2V0SXRlbSA9IGZ1bmN0aW9uIChlbnRpdHksIGluc3RhbmNlLCBub2RlSWQpIHtcbiAgICBpZiAoIWVudGl0eSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT25lIGdldCgpOiByZXF1aXJlcyBhIHVpZCB0byByZXRyaWV2ZSBhbiBpdGVtIGZyb20gdGhlIGNhY2hlLlwiKTtcbiAgICB9XG4gICAgaWYgKHV0aWxfMS5pc0FycmF5KGVudGl0eSkpIHtcbiAgICAgICAgcmV0dXJuIGVudGl0eS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRPYmplY3QoaXRlbSwgaW5zdGFuY2UpO1xuICAgICAgICB9KS5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtICE9PSBudWxsICYmIGl0ZW0gIT09IHVuZGVmaW5lZDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBnZXRPYmplY3QoZW50aXR5LCBpbnN0YW5jZSk7XG59O1xudmFyIGdldE9iamVjdCA9IGZ1bmN0aW9uICh1aWRPckVudGl0eSwgaW5zdGFuY2UpIHtcbiAgICB2YXIgcmVhbFVpZCA9IGdldEFjdHVhbFVpZCh1aWRPckVudGl0eSk7XG4gICAgaWYgKCFyZWFsVWlkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGl0ZW0gPSBleHBvcnRzLmdldENhY2hlZEl0ZW0ocmVhbFVpZCwgaW5zdGFuY2UpO1xuICAgIHJldHVybiBpdGVtID8gaXRlbS5lbnRpdHkgOiB1bmRlZmluZWQ7XG59O1xuZXhwb3J0cy5nZXRFZGl0SXRlbSA9IGZ1bmN0aW9uIChvYmosIGluc3RhbmNlLCBub2RlSWQpIHtcbiAgICBpZiAodXRpbF8xLmlzQXJyYXkob2JqKSkge1xuICAgICAgICByZXR1cm4gb2JqLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIGdldEVkaXRhYmxlT2JqZWN0KGl0ZW0sIGluc3RhbmNlKTtcbiAgICAgICAgfSkuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbSAhPT0gbnVsbCAmJiBpdGVtICE9PSB1bmRlZmluZWQ7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZ2V0RWRpdGFibGVPYmplY3Qob2JqLCBpbnN0YW5jZSk7XG59O1xudmFyIGdldEVkaXRhYmxlT2JqZWN0ID0gZnVuY3Rpb24gKHVpZE9yRW50aXR5LCBpbnN0YW5jZSkge1xuICAgIHZhciByZWFsVWlkID0gZ2V0QWN0dWFsVWlkKHVpZE9yRW50aXR5KTtcbiAgICB2YXIgZXhpc3RpbmcgPSBleHBvcnRzLmdldEl0ZW0ocmVhbFVpZCwgaW5zdGFuY2UpO1xuICAgIHJldHVybiBleGlzdGluZyA/IHV0aWxfMS5kZWVwQ2xvbmUoZXhpc3RpbmcsIHVuZGVmaW5lZCwgZmFsc2UpIDogdW5kZWZpbmVkO1xufTtcbnZhciBnZXRBY3R1YWxVaWQgPSBmdW5jdGlvbiAodWlkT3JFbnRpdHkpIHtcbiAgICBpZiAodHlwZW9mIHVpZE9yRW50aXR5ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHJldHVybiB1aWRPckVudGl0eTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIHVpZE9yRW50aXR5ID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgIHJldHVybiBTdHJpbmcodWlkT3JFbnRpdHkpO1xuICAgIH1cbiAgICBlbHNlIGlmICh1dGlsXzEuaXNPYmplY3QodWlkT3JFbnRpdHkpKSB7XG4gICAgICAgIGlmICh1dGlsXzEuaGFzVWlkKHVpZE9yRW50aXR5KSkge1xuICAgICAgICAgICAgcmV0dXJuIHVpZE9yRW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgICAgICB9XG4gICAgfVxufTtcbmV4cG9ydHMuaXNPbkNhY2hlID0gZnVuY3Rpb24gKGZsdXNoQXJncykge1xuICAgIHZhciB1aWQgPSBmbHVzaEFyZ3MuZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgIHZhciBleGlzdGluZ0l0ZW0gPSBleHBvcnRzLmdldENhY2hlZEl0ZW0odWlkLCBmbHVzaEFyZ3MuaW5zdGFuY2UpO1xuICAgIHJldHVybiBleGlzdGluZ0l0ZW0gJiYgZXhpc3RpbmdJdGVtLmVudGl0eSA9PT0gZmx1c2hBcmdzLmVudGl0eTtcbn07XG5leHBvcnRzLmdldENhY2hlZEl0ZW0gPSBmdW5jdGlvbiAodWlkLCBpbnN0YW5jZSkge1xuICAgIHZhciBjdXJyZW50Tm9kZSA9IGdldEN1cnJlbnROb2RlKGluc3RhbmNlKTtcbiAgICByZXR1cm4gY3VycmVudE5vZGUgPyBjdXJyZW50Tm9kZS5pdGVtcy5nZXQoU3RyaW5nKHVpZCkpIDogdW5kZWZpbmVkO1xufTtcbmZ1bmN0aW9uIGdldEN1cnJlbnROb2RlKGluc3RhbmNlKSB7XG4gICAgdmFyIGN1cnJlbnROb2RlSWQgPSBpbnN0YW5jZS50aHJlYWQubm9kZXNbaW5zdGFuY2UudGhyZWFkLmN1cnJlbnRdO1xuICAgIHJldHVybiBjdXJyZW50Tm9kZUlkID49IDAgPyBnZXRSZXBvTm9kZShjdXJyZW50Tm9kZUlkLCBpbnN0YW5jZS5yZXBvKSA6IHVuZGVmaW5lZDtcbn1cbmZ1bmN0aW9uIGdldFJlcG9Ob2RlKG5vZGVJZCwgcmVwbykge1xuICAgIHJldHVybiByZXBvLmdldChub2RlSWQpO1xufVxuZXhwb3J0cy5nZXRDYWNoZUN1cnJlbnRTdGFjayA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIHZhciBjdXJyZW50Tm9kZSA9IGdldEN1cnJlbnROb2RlKGluc3RhbmNlKTtcbiAgICByZXR1cm4gY3VycmVudE5vZGUgPyBjdXJyZW50Tm9kZS5pdGVtcyA6IHVuZGVmaW5lZDtcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2laMlYwTG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhNaU9sc2lMaTR2TGk0dmMzSmpMMmRsZEM1MGN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU8wRkJRVUVzYzBKQlFYVkNMRk5CUVZNc1EwRkJReXhEUVVGQk8wRkJTV3BETEhGQ1FVRnhSQ3hSUVVGUkxFTkJRVU1zUTBGQlFUdEJRV05xUkN4bFFVRlBMRWRCUVVjc1ZVRkJReXhOUVVGNVF5eEZRVUZGTEZGQlFYZENMRVZCUVVVc1RVRkJaVHRKUVVONFJ5eEZRVUZGTEVOQlFVTXNRMEZCUXl4RFFVRkRMRTFCUVUwc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRFZpeE5RVUZOTEVsQlFVa3NVMEZCVXl4RFFVRkRMQ3RFUVVFclJDeERRVUZETEVOQlFVTTdTVUZEZWtZc1EwRkJRenRKUVVORUxFVkJRVVVzUTBGQlF5eERRVUZETEdOQlFVOHNRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRGJFSXNUVUZCVFN4RFFVRkZMRTFCUVhGQ0xFTkJRVU1zUjBGQlJ5eERRVUZETEZWQlFVRXNTVUZCU1R0WlFVTnNReXhOUVVGTkxFTkJRVU1zVTBGQlV5eERRVUZETEVsQlFVa3NSVUZCUlN4UlFVRlJMRU5CUVVNc1EwRkJRenRSUVVOeVF5eERRVUZETEVOQlFVTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1ZVRkJRU3hKUVVGSk8xbEJRMVlzVFVGQlRTeERRVUZETEVsQlFVa3NTMEZCU3l4SlFVRkpMRWxCUVVrc1NVRkJTU3hMUVVGTExGTkJRVk1zUTBGQlF6dFJRVU12UXl4RFFVRkRMRU5CUVVNc1EwRkJRVHRKUVVOT0xFTkJRVU03U1VGRFJDeE5RVUZOTEVOQlFVTXNVMEZCVXl4RFFVRkRMRTFCUVUwc1JVRkJSU3hSUVVGUkxFTkJRVU1zUTBGQlF6dEJRVU4yUXl4RFFVRkRMRU5CUVVNN1FVRlJSaXhKUVVGTkxGTkJRVk1zUjBGQlJ5eFZRVUZETEZkQlFXbERMRVZCUVVVc1VVRkJkMEk3U1VGRE1VVXNTVUZCU1N4UFFVRlBMRWRCUVVjc1dVRkJXU3hEUVVGRExGZEJRVmNzUTBGQlF5eERRVUZETzBsQlEzaERMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTXNRMEZCUXp0UlFVTllMRTFCUVUwc1EwRkJRenRKUVVOWUxFTkJRVU03U1VGRFJDeEpRVUZKTEVsQlFVa3NSMEZCWXl4eFFrRkJZU3hEUVVGRExFOUJRVThzUlVGQlJTeFJRVUZSTEVOQlFVTXNRMEZCUXp0SlFVTjJSQ3hOUVVGTkxFTkJRVU1zU1VGQlNTeEhRVUZITEVsQlFVa3NRMEZCUXl4TlFVRk5MRWRCUVVjc1UwRkJVeXhEUVVGRE8wRkJRekZETEVOQlFVTXNRMEZCUXp0QlFVdFhMRzFDUVVGWExFZEJRVWNzVlVGQlF5eEhRVUZ6UXl4RlFVRkZMRkZCUVhkQ0xFVkJRVVVzVFVGQlpUdEpRVU42Unl4RlFVRkZMRU5CUVVNc1EwRkJReXhqUVVGUExFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMUZCUTJZc1RVRkJUU3hEUVVGRkxFZEJRV3RDTEVOQlFVTXNSMEZCUnl4RFFVRkRMRlZCUVVFc1NVRkJTVHRaUVVNdlFpeE5RVUZOTEVOQlFVTXNhVUpCUVdsQ0xFTkJRVU1zU1VGQlNTeEZRVUZGTEZGQlFWRXNRMEZCUXl4RFFVRkRPMUZCUXpkRExFTkJRVU1zUTBGQlF5eERRVUZETEUxQlFVMHNRMEZCUXl4VlFVRkJMRWxCUVVrN1dVRkRWaXhOUVVGTkxFTkJRVU1zU1VGQlNTeExRVUZMTEVsQlFVa3NTVUZCU1N4SlFVRkpMRXRCUVVzc1UwRkJVeXhEUVVGRE8xRkJReTlETEVOQlFVTXNRMEZCUXl4RFFVRkJPMGxCUTA0c1EwRkJRenRKUVVORUxFMUJRVTBzUTBGQlF5eHBRa0ZCYVVJc1EwRkJReXhIUVVGSExFVkJRVVVzVVVGQlVTeERRVUZETEVOQlFVTTdRVUZETlVNc1EwRkJReXhEUVVGQk8wRkJVMFFzU1VGQlRTeHBRa0ZCYVVJc1IwRkJSeXhWUVVGRExGZEJRVmNzUlVGQlJTeFJRVUYzUWp0SlFVTTFSQ3hKUVVGSkxFOUJRVThzUjBGQlJ5eFpRVUZaTEVOQlFVTXNWMEZCVnl4RFFVRkRMRU5CUVVNN1NVRkRlRU1zU1VGQlNTeFJRVUZSTEVkQlFVY3NaVUZCVHl4RFFVRkRMRTlCUVU4c1JVRkJSU3hSUVVGUkxFTkJRVU1zUTBGQlF6dEpRVU14UXl4TlFVRk5MRU5CUVVNc1VVRkJVU3hIUVVGSExHZENRVUZUTEVOQlFVTXNVVUZCVVN4RlFVRkZMRk5CUVZNc1JVRkJSU3hMUVVGTExFTkJRVU1zUjBGQlJ5eFRRVUZUTEVOQlFVTTdRVUZEZUVVc1EwRkJReXhEUVVGRE8wRkJUMFlzU1VGQlRTeFpRVUZaTEVkQlFVY3NWVUZCUVN4WFFVRlhPMGxCUXpWQ0xFVkJRVVVzUTBGQlF5eERRVUZETEU5QlFVOHNWMEZCVnl4TFFVRkxMRkZCUVZFc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRGJFTXNUVUZCVFN4RFFVRkRMRmRCUVZjc1EwRkJRenRKUVVOMlFpeERRVUZETzBsQlFVTXNTVUZCU1N4RFFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRExFOUJRVThzVjBGQlZ5eExRVUZMTEZGQlFWRXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRla01zVFVGQlRTeERRVUZETEUxQlFVMHNRMEZCUXl4WFFVRlhMRU5CUVVNc1EwRkJRenRKUVVNdlFpeERRVUZETzBsQlEwUXNTVUZCU1N4RFFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRExHVkJRVkVzUTBGQlF5eFhRVUZYTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkROMElzUlVGQlJTeERRVUZETEVOQlFVTXNZVUZCVFN4RFFVRkRMRmRCUVZjc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dFpRVU4wUWl4TlFVRk5MRU5CUVVNc1YwRkJWeXhEUVVGRExHTkJRVTBzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0UlFVTjJReXhEUVVGRE8wbEJRMHdzUTBGQlF6dEJRVU5NTEVOQlFVTXNRMEZCUXp0QlFWRlhMR2xDUVVGVExFZEJRVWNzVlVGQlF5eFRRVUZ4UWp0SlFVVXpReXhKUVVGSkxFZEJRVWNzUjBGQlJ5eFRRVUZUTEVOQlFVTXNUVUZCVFN4RFFVRkRMR05CUVUwc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEpRVU16UXl4SlFVRkpMRmxCUVZrc1IwRkJZeXh4UWtGQllTeERRVUZETEVkQlFVY3NSVUZCUlN4VFFVRlRMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03U1VGRGNrVXNUVUZCVFN4RFFVRkRMRmxCUVZrc1NVRkJTU3haUVVGWkxFTkJRVU1zVFVGQlRTeExRVUZMTEZOQlFWTXNRMEZCUXl4TlFVRk5MRU5CUVVNN1FVRkRjRVVzUTBGQlF5eERRVUZETzBGQlUxY3NjVUpCUVdFc1IwRkJSeXhWUVVGRExFZEJRVmNzUlVGQlJTeFJRVUYzUWp0SlFVTXZSQ3hKUVVGSkxGZEJRVmNzUjBGQlpTeGpRVUZqTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN1NVRkRka1FzVFVGQlRTeERRVUZETEZkQlFWY3NSMEZCUnl4WFFVRlhMRU5CUVVNc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eE5RVUZOTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNc1IwRkJSeXhUUVVGVExFTkJRVU03UVVGRGVFVXNRMEZCUXl4RFFVRkRPMEZCVVVZc2QwSkJRWGRDTEZGQlFYZENPMGxCUXpWRExFbEJRVWtzWVVGQllTeEhRVUZYTEZGQlFWRXNRMEZCUXl4TlFVRk5MRU5CUVVNc1MwRkJTeXhEUVVGRExGRkJRVkVzUTBGQlF5eE5RVUZOTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN1NVRkZNMFVzVFVGQlRTeERRVUZETEdGQlFXRXNTVUZCU1N4RFFVRkRMRWRCUVVjc1YwRkJWeXhEUVVGRExHRkJRV0VzUlVGQlJTeFJRVUZSTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWRCUVVjc1UwRkJVeXhEUVVGRE8wRkJRM1JHTEVOQlFVTTdRVUZMUkN4eFFrRkJjVUlzVFVGQll5eEZRVUZGTEVsQlFXZENPMGxCUTJwRUxFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRTFCUVUwc1EwRkJReXhEUVVGRE8wRkJRelZDTEVOQlFVTTdRVUZOV1N3MFFrRkJiMElzUjBGQlJ5eFZRVUZETEZGQlFYZENPMGxCUTNwRUxFbEJRVWtzVjBGQlZ5eEhRVUZITEdOQlFXTXNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRKUVVNelF5eE5RVUZOTEVOQlFVTXNWMEZCVnl4SFFVRkhMRmRCUVZjc1EwRkJReXhMUVVGTExFZEJRVWNzVTBGQlV5eERRVUZETzBGQlEzWkVMRU5CUVVNc1EwRkJReUo5XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uLy4uL3NyYy9nZXQudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciB1dGlsXzEgPSByZXF1aXJlKCcuL3V0aWwnKTtcbmZ1bmN0aW9uIGdldEtleShrZXkpIHtcbiAgICB2YXIgaW50S2V5ID0gcGFyc2VJbnQoa2V5KTtcbiAgICBpZiAoaW50S2V5LnRvU3RyaW5nKCkgPT09IGtleSkge1xuICAgICAgICByZXR1cm4gaW50S2V5O1xuICAgIH1cbiAgICByZXR1cm4ga2V5O1xufVxuZnVuY3Rpb24gZGVsKG9iaiwgcGF0aCkge1xuICAgIGlmICh1dGlsXzEuaXNOdW1iZXIocGF0aCkpIHtcbiAgICAgICAgcGF0aCA9IFtwYXRoXTtcbiAgICB9XG4gICAgaWYgKHV0aWxfMS5pc0VtcHR5KG9iaikpIHtcbiAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG4gICAgaWYgKHV0aWxfMS5pc0VtcHR5KHBhdGgpKSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICAgIGlmICh1dGlsXzEuaXNTdHJpbmcocGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIGRlbChvYmosIHBhdGguc3BsaXQoJy4nKSk7XG4gICAgfVxuICAgIHZhciBjdXJyZW50UGF0aCA9IGdldEtleShwYXRoWzBdKTtcbiAgICB2YXIgb2xkVmFsID0gb2JqW2N1cnJlbnRQYXRoXTtcbiAgICBpZiAocGF0aC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgaWYgKG9sZFZhbCAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgICBpZiAodXRpbF8xLmlzQXJyYXkob2JqKSkge1xuICAgICAgICAgICAgICAgIG9iai5zcGxpY2UoY3VycmVudFBhdGgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIG9ialtjdXJyZW50UGF0aF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmIChvYmpbY3VycmVudFBhdGhdICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgIHJldHVybiBkZWwob2JqW2N1cnJlbnRQYXRoXSwgcGF0aC5zbGljZSgxKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbn1cbmV4cG9ydHMuZGVsID0gZGVsO1xuZnVuY3Rpb24gZ2V0KG9iaiwgcGF0aCwgZGVmYXVsdFZhbHVlKSB7XG4gICAgaWYgKHV0aWxfMS5pc051bWJlcihwYXRoKSkge1xuICAgICAgICBwYXRoID0gW3BhdGhdO1xuICAgIH1cbiAgICBpZiAodXRpbF8xLmlzRW1wdHkocGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgaWYgKHV0aWxfMS5pc0VtcHR5KG9iaikpIHtcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgICB9XG4gICAgaWYgKHV0aWxfMS5pc1N0cmluZyhwYXRoKSkge1xuICAgICAgICByZXR1cm4gZ2V0KG9iaiwgcGF0aC5zcGxpdCgnLicpLCBkZWZhdWx0VmFsdWUpO1xuICAgIH1cbiAgICB2YXIgY3VycmVudFBhdGggPSBnZXRLZXkocGF0aFswXSk7XG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGlmIChvYmpbY3VycmVudFBhdGhdID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9ialtjdXJyZW50UGF0aF07XG4gICAgfVxuICAgIHJldHVybiBnZXQob2JqW2N1cnJlbnRQYXRoXSwgcGF0aC5zbGljZSgxKSwgZGVmYXVsdFZhbHVlKTtcbn1cbmV4cG9ydHMuZ2V0ID0gZ2V0O1xuZXhwb3J0cy5jb25jYXRQcm9wID0gZnVuY3Rpb24gKHByb3BDaGFpbiwgcHJvcCkge1xuICAgIGNvbnNvbGUubG9nKFwiQ09OQ0FUIFBST1BcIiwgcHJvcENoYWluLCBwcm9wKTtcbiAgICBpZiAocHJvcENoYWluID09PSBcIlwiKSB7XG4gICAgICAgIHByb3BDaGFpbiA9IHByb3A7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBwcm9wQ2hhaW4gPSBwcm9wQ2hhaW4gKyBcIi5cIiArIHByb3A7XG4gICAgfVxuICAgIHJldHVybiBwcm9wQ2hhaW47XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pY0dGMGFDNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5d1lYUm9MblJ6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVV0QkxGbEJRVmtzUTBGQlF6dEJRVVZpTEhGQ1FVRXJSQ3hSUVVGUkxFTkJRVU1zUTBGQlFUdEJRVVY0UlN4blFrRkJaMElzUjBGQlJ6dEpRVU5tTEVsQlFVa3NUVUZCVFN4SFFVRkhMRkZCUVZFc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF6dEpRVU16UWl4RlFVRkZMRU5CUVVNc1EwRkJReXhOUVVGTkxFTkJRVU1zVVVGQlVTeEZRVUZGTEV0QlFVc3NSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJRenRSUVVNMVFpeE5RVUZOTEVOQlFVTXNUVUZCVFN4RFFVRkRPMGxCUTJ4Q0xFTkJRVU03U1VGRFJDeE5RVUZOTEVOQlFVTXNSMEZCUnl4RFFVRkRPMEZCUTJZc1EwRkJRenRCUVVWRUxHRkJRVzlDTEVkQlFVY3NSVUZCUlN4SlFVRkpPMGxCUTNwQ0xFVkJRVVVzUTBGQlF5eERRVUZETEdWQlFWRXNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRGFrSXNTVUZCU1N4SFFVRkhMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03U1VGRGJFSXNRMEZCUXp0SlFVVkVMRVZCUVVVc1EwRkJReXhEUVVGRExHTkJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRaaXhOUVVGTkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdTVUZEYkVJc1EwRkJRenRKUVVWRUxFVkJRVVVzUTBGQlF5eERRVUZETEdOQlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRGFFSXNUVUZCVFN4RFFVRkRMRWRCUVVjc1EwRkJRenRKUVVObUxFTkJRVU03U1VGRFJDeEZRVUZGTEVOQlFVTXNRMEZCUXl4bFFVRlJMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzFGQlEycENMRTFCUVUwc1EwRkJReXhIUVVGSExFTkJRVU1zUjBGQlJ5eEZRVUZGTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF6dEpRVU55UXl4RFFVRkRPMGxCUlVRc1NVRkJTU3hYUVVGWExFZEJRVWNzVFVGQlRTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wbEJRMnhETEVsQlFVa3NUVUZCVFN4SFFVRkhMRWRCUVVjc1EwRkJReXhYUVVGWExFTkJRVU1zUTBGQlF6dEpRVVU1UWl4RlFVRkZMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU1zVFVGQlRTeExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRjRUlzUlVGQlJTeERRVUZETEVOQlFVTXNUVUZCVFN4TFFVRkxMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dFpRVU53UWl4RlFVRkZMRU5CUVVNc1EwRkJReXhqUVVGUExFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMmRDUVVObUxFZEJRVWNzUTBGQlF5eE5RVUZOTEVOQlFVTXNWMEZCVnl4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVGRE8xbEJReTlDTEVOQlFVTTdXVUZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRuUWtGRFNpeFBRVUZQTEVkQlFVY3NRMEZCUXl4WFFVRlhMRU5CUVVNc1EwRkJRenRaUVVNMVFpeERRVUZETzFGQlEwd3NRMEZCUXp0SlFVTk1MRU5CUVVNN1NVRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dFJRVU5LTEVWQlFVVXNRMEZCUXl4RFFVRkRMRWRCUVVjc1EwRkJReXhYUVVGWExFTkJRVU1zUzBGQlN5eExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1dVRkRPVUlzVFVGQlRTeERRVUZETEVkQlFVY3NRMEZCUXl4SFFVRkhMRU5CUVVNc1YwRkJWeXhEUVVGRExFVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8xRkJRMmhFTEVOQlFVTTdTVUZEVEN4RFFVRkRPMGxCUlVRc1RVRkJUU3hEUVVGRExFZEJRVWNzUTBGQlF6dEJRVU5tTEVOQlFVTTdRVUZzUTJVc1YwRkJSeXhOUVd0RGJFSXNRMEZCUVR0QlFVVkVMR0ZCUVc5Q0xFZEJRVkVzUlVGQlJTeEpRVUZUTEVWQlFVVXNXVUZCYTBJN1NVRkRka1FzUlVGQlJTeERRVUZETEVOQlFVTXNaVUZCVVN4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dFJRVU5xUWl4SlFVRkpMRWRCUVVjc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dEpRVU5zUWl4RFFVRkRPMGxCUTBRc1JVRkJSU3hEUVVGRExFTkJRVU1zWTBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRSUVVOb1FpeE5RVUZOTEVOQlFVTXNSMEZCUnl4RFFVRkRPMGxCUTJZc1EwRkJRenRKUVVORUxFVkJRVVVzUTBGQlF5eERRVUZETEdOQlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRFppeE5RVUZOTEVOQlFVTXNXVUZCV1N4RFFVRkRPMGxCUTNoQ0xFTkJRVU03U1VGRFJDeEZRVUZGTEVOQlFVTXNRMEZCUXl4bFFVRlJMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzFGQlEycENMRTFCUVUwc1EwRkJReXhIUVVGSExFTkJRVU1zUjBGQlJ5eEZRVUZGTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExFVkJRVVVzV1VGQldTeERRVUZETEVOQlFVTTdTVUZEYmtRc1EwRkJRenRKUVVWRUxFbEJRVWtzVjBGQlZ5eEhRVUZITEUxQlFVMHNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dEpRVVZzUXl4RlFVRkZMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU1zVFVGQlRTeExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRjRUlzUlVGQlJTeERRVUZETEVOQlFVTXNSMEZCUnl4RFFVRkRMRmRCUVZjc1EwRkJReXhMUVVGTExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0WlFVTTVRaXhOUVVGTkxFTkJRVU1zV1VGQldTeERRVUZETzFGQlEzaENMRU5CUVVNN1VVRkRSQ3hOUVVGTkxFTkJRVU1zUjBGQlJ5eERRVUZETEZkQlFWY3NRMEZCUXl4RFFVRkRPMGxCUXpWQ0xFTkJRVU03U1VGRlJDeE5RVUZOTEVOQlFVTXNSMEZCUnl4RFFVRkRMRWRCUVVjc1EwRkJReXhYUVVGWExFTkJRVU1zUlVGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJReXhGUVVGRkxGbEJRVmtzUTBGQlF5eERRVUZETzBGQlF6bEVMRU5CUVVNN1FVRjRRbVVzVjBGQlJ5eE5RWGRDYkVJc1EwRkJRVHRCUVU5WkxHdENRVUZWTEVkQlFVY3NWVUZCUXl4VFFVRlRMRVZCUVVVc1NVRkJTVHRKUVVOMFF5eFBRVUZQTEVOQlFVTXNSMEZCUnl4RFFVRkRMR0ZCUVdFc1JVRkJSU3hUUVVGVExFVkJRVVVzU1VGQlNTeERRVUZETEVOQlFVRTdTVUZETTBNc1JVRkJSU3hEUVVGRExFTkJRVU1zVTBGQlV5eExRVUZMTEVWQlFVVXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRia0lzVTBGQlV5eEhRVUZITEVsQlFVa3NRMEZCUXp0SlFVTnlRaXhEUVVGRE8wbEJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdVVUZEU2l4VFFVRlRMRWRCUVVjc1UwRkJVeXhIUVVGSExFZEJRVWNzUjBGQlJ5eEpRVUZKTEVOQlFVTTdTVUZEZGtNc1EwRkJRenRKUVVORUxFMUJRVTBzUTBGQlF5eFRRVUZUTEVOQlFVTTdRVUZEY2tJc1EwRkJReXhEUVVGREluMD1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vLi4vc3JjL3BhdGgudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBDYWNoZU1hcF8xID0gcmVxdWlyZSgnLi9DYWNoZU1hcCcpO1xudmFyIENhY2hlSXRlbSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2FjaGVJdGVtKGVudGl0eSwgbGl2ZUl0ZW0pIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ2FjaGVJdGVtKF90aGlzLmVudGl0eSwgX3RoaXMpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmVudGl0eSA9IGVudGl0eTtcbiAgICAgICAgaWYgKGxpdmVJdGVtKSB7XG4gICAgICAgICAgICB0aGlzLm1hcEZyb20gPSBsaXZlSXRlbS5tYXBGcm9tLmNsb25lKCk7XG4gICAgICAgICAgICB0aGlzLm1hcFRvID0gbGl2ZUl0ZW0ubWFwVG8uY2xvbmUoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubWFwRnJvbSA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMubWFwVG8gPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIENhY2hlSXRlbTtcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDYWNoZUl0ZW07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lRMkZqYUdWSmRHVnRMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE1pT2xzaUxpNHZMaTR2YzNKakwwTmhZMmhsU1hSbGJTNTBjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPMEZCUVVFc2VVSkJRWEZDTEZsQlFWa3NRMEZCUXl4RFFVRkJPMEZCVVd4RE8wbEJTMGtzYlVKQlFWa3NUVUZCVlN4RlFVRkZMRkZCUVc5Q08xRkJUR2hFTEdsQ1FYRkNRenRSUVVoSExGVkJRVXNzUjBGQlJ6dFpRVU5LTEUxQlFVMHNRMEZCUXl4SlFVRkpMRk5CUVZNc1EwRkJReXhMUVVGSkxFTkJRVU1zVFVGQlRTeEZRVUZGTEV0QlFVa3NRMEZCUXl4RFFVRkRPMUZCUXpWRExFTkJRVU1zUTBGQlFUdFJRV1JITEVsQlFVa3NRMEZCUXl4TlFVRk5MRWRCUVVjc1RVRkJUU3hEUVVGRE8xRkJSWEpDTEVWQlFVVXNRMEZCUXl4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRExFTkJRVU03V1VGRldDeEpRVUZKTEVOQlFVTXNUMEZCVHl4SFFVRkhMRkZCUVZFc1EwRkJReXhQUVVGUExFTkJRVU1zUzBGQlN5eEZRVUZGTEVOQlFVTTdXVUZEZUVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUjBGQlJ5eFJRVUZSTEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzc1JVRkJSU3hEUVVGRE8xRkJRM2hETEVOQlFVTTdVVUZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRaUVVOS0xFbEJRVWtzUTBGQlF5eFBRVUZQTEVkQlFVY3NTVUZCU1N4clFrRkJVU3hGUVVGcFFpeERRVUZETzFsQlF6ZERMRWxCUVVrc1EwRkJReXhMUVVGTExFZEJRVWNzU1VGQlNTeHJRa0ZCVVN4RlFVRnBRaXhEUVVGRE8xRkJReTlETEVOQlFVTTdTVUZEVEN4RFFVRkRPMGxCUzB3c1owSkJRVU03UVVGQlJDeERRVUZETEVGQmNrSkVMRWxCY1VKRE8wRkJja0pFT3pKQ1FYRkNReXhEUVVGQkluMD1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vLi4vc3JjL0NhY2hlSXRlbS50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIGNhY2hlXzEgPSByZXF1aXJlKCcuL2NhY2hlJyk7XG5leHBvcnRzLnByaW50Q2FjaGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICB2YXIgcmVzdWx0ID0gXCJcIjtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBjdXJyZW50ID0gaW5zdGFuY2UudGhyZWFkLmN1cnJlbnQ7XG4gICAgdmFyIG5vZGVJbmRpY2VzID0gaW5zdGFuY2UudGhyZWFkLm5vZGVzO1xuICAgIG5vZGVJbmRpY2VzLm1hcChmdW5jdGlvbiAoY2FjaGVOb2RlSWQpIHtcbiAgICAgICAgdmFyIGNhY2hlTm9kZSA9IGluc3RhbmNlLnJlcG8uZ2V0KGNhY2hlTm9kZUlkKTtcbiAgICAgICAgdmFyIHN0cmVhbURhdGEgPSBcIlwiO1xuICAgICAgICB2YXIgc3RhdGUgPSBpbmRleCArIFwiOlwiICsgc3RyZWFtRGF0YSArIFwiW1wiICsgc3RyaW5naWZ5TWFwKGNhY2hlTm9kZS5pdGVtcykgKyBcIl1cXG5cXG5cIjtcbiAgICAgICAgaWYgKGluZGV4ID09PSBjdXJyZW50KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IFwiLT4gXCIgKyBzdGF0ZTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgKz0gc3RhdGU7XG4gICAgICAgIGluZGV4Kys7XG4gICAgfSk7XG4gICAgcmVzdWx0ID0gcmVzdWx0LnN1YnN0cmluZygwLCAocmVzdWx0Lmxlbmd0aCAtIDIpKTtcbiAgICBpbmRleCA9IDA7XG4gICAgcmV0dXJuIFwiXFxuLS0tLS0tIE9uZSAtLS0tLS0tXCJcbiAgICAgICAgKyBcIlxcblNUQUNLOlxcblwiICsgcmVzdWx0XG4gICAgICAgICsgXCJcXG5cXG5DT05GSUc6XCIgKyBKU09OLnN0cmluZ2lmeShjYWNoZV8xLmNvbmZpZywgbnVsbCwgMilcbiAgICAgICAgKyBcIlxcblxcblJFUE8gU0laRTpcIiArIGluc3RhbmNlLnJlcG8ubGVuZ3RoXG4gICAgICAgICsgXCJcXG49PT09PT09PT09PT09PT09PT09XFxuXCI7XG59O1xudmFyIHN0cmluZ2lmeU1hcCA9IGZ1bmN0aW9uIChtYXApIHtcbiAgICB2YXIgcmVzdWx0ID0gXCJcIjtcbiAgICBtYXAuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgIHZhciBpdGVtUmVzdWx0ID0gSlNPTi5zdHJpbmdpZnkoaXRlbSwgbnVsbCwgMik7XG4gICAgICAgIHJlc3VsdCArPSBpdGVtUmVzdWx0ICsgXCIsXFxuXCI7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2ljSEpwYm5RdWFuTWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUlpd2ljMjkxY21ObGN5STZXeUl1TGk4dUxpOXpjbU12Y0hKcGJuUXVkSE1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanRCUVVGQkxITkNRVUYxUWl4VFFVRlRMRU5CUVVNc1EwRkJRVHRCUVZOd1FpeHJRa0ZCVlN4SFFVRkhMRlZCUVVNc1VVRkJkMEk3U1VGREwwTXNTVUZCU1N4TlFVRk5MRWRCUVVjc1JVRkJSU3hEUVVGRE8wbEJRMmhDTEVsQlFVa3NTMEZCU3l4SFFVRkhMRU5CUVVNc1EwRkJRenRKUVVOa0xFbEJRVWtzVDBGQlR5eEhRVUZITEZGQlFWRXNRMEZCUXl4TlFVRk5MRU5CUVVNc1QwRkJUeXhEUVVGRE8wbEJSWFJETEVsQlFVa3NWMEZCVnl4SFFVRkhMRkZCUVZFc1EwRkJReXhOUVVGTkxFTkJRVU1zUzBGQlN5eERRVUZETzBsQlEzaERMRmRCUVZjc1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlFTeFhRVUZYTzFGQlEzWkNMRWxCUVVrc1UwRkJVeXhIUVVGbExGRkJRVkVzUTBGQlF5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRmRCUVZjc1EwRkJReXhEUVVGRE8xRkJSVE5FTEVsQlFVa3NWVUZCVlN4SFFVRkhMRVZCUVVVc1EwRkJRenRSUVVOd1FpeEpRVUZKTEV0QlFVc3NSMEZCUnl4TFFVRkxMRWRCUVVjc1IwRkJSeXhIUVVGSExGVkJRVlVzUjBGQlJ5eEhRVUZITEVkQlFVY3NXVUZCV1N4RFFVRkRMRk5CUVZNc1EwRkJReXhMUVVGTExFTkJRVU1zUjBGQlJ5eFBRVUZQTEVOQlFVTTdVVUZEY2tZc1JVRkJSU3hEUVVGRExFTkJRVU1zUzBGQlN5eExRVUZMTEU5QlFVOHNRMEZCUXl4RFFVRkRMRU5CUVVNN1dVRkRjRUlzUzBGQlN5eEhRVUZITEV0QlFVc3NSMEZCUnl4TFFVRkxMRU5CUVVNN1VVRkRNVUlzUTBGQlF6dFJRVU5FTEUxQlFVMHNTVUZCU1N4TFFVRkxMRU5CUVVNN1VVRkRhRUlzUzBGQlN5eEZRVUZGTEVOQlFVTTdTVUZEV2l4RFFVRkRMRU5CUVVNc1EwRkJRenRKUVVWSUxFMUJRVTBzUjBGQlJ5eE5RVUZOTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNc1JVRkJSU3hEUVVGRExFMUJRVTBzUTBGQlF5eE5RVUZOTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRKUVVWc1JDeExRVUZMTEVkQlFVY3NRMEZCUXl4RFFVRkRPMGxCUlZZc1RVRkJUU3hEUVVGRExITkNRVUZ6UWp0VlFVTjJRaXhaUVVGWkxFZEJRVWNzVFVGQlRUdFZRVU55UWl4aFFVRmhMRWRCUVVjc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eGpRVUZOTEVWQlFVVXNTVUZCU1N4RlFVRkZMRU5CUVVNc1EwRkJRenRWUVVNdlF5eG5Ra0ZCWjBJc1IwRkJSeXhSUVVGUkxFTkJRVU1zU1VGQlNTeERRVUZETEUxQlFVMDdWVUZEZGtNc2VVSkJRWGxDTEVOQlFVTTdRVUZEY0VNc1EwRkJReXhEUVVGRE8wRkJSVVlzU1VGQlRTeFpRVUZaTEVkQlFVY3NWVUZCUXl4SFFVRjNRanRKUVVNeFF5eEpRVUZKTEUxQlFVMHNSMEZCUnl4RlFVRkZMRU5CUVVNN1NVRkZhRUlzUjBGQlJ5eERRVUZETEU5QlFVOHNRMEZCUXl4VlFVRkRMRWRCUVVjc1JVRkJSU3hKUVVGbE8xRkJRemRDTEVsQlFVa3NWVUZCVlN4SFFVRkhMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zU1VGQlNTeEZRVUZGTEVsQlFVa3NSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJRenRSUVVNdlF5eE5RVUZOTEVsQlFVa3NWVUZCVlN4SFFVRkhMRXRCUVVzc1EwRkJRenRKUVVOcVF5eERRVUZETEVOQlFVTXNRMEZCUVR0SlFVVkdMRTFCUVUwc1EwRkJReXhOUVVGTkxFTkJRVU03UVVGRGJFSXNRMEZCUXl4RFFVRkJJbjA9XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uLy4uL3NyYy9wcmludC50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIENhY2hlUmVwb18xID0gcmVxdWlyZSgnLi9DYWNoZVJlcG8nKTtcbnZhciBDYWNoZVRocmVhZF8xID0gcmVxdWlyZSgnLi9DYWNoZVRocmVhZCcpO1xudmFyIENhY2hlSW5zdGFuY2UgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENhY2hlSW5zdGFuY2UobmFtZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLnJlcG8gPSBuZXcgQ2FjaGVSZXBvXzEuZGVmYXVsdCgpO1xuICAgICAgICB0aGlzLnRocmVhZCA9IG5ldyBDYWNoZVRocmVhZF8xLmRlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5uZXh0Tm9kZUtleSA9IDA7XG4gICAgICAgIHRoaXMucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5yZXBvID0gbmV3IENhY2hlUmVwb18xLmRlZmF1bHQoKTtcbiAgICAgICAgICAgIF90aGlzLnRocmVhZCA9IG5ldyBDYWNoZVRocmVhZF8xLmRlZmF1bHQoKTtcbiAgICAgICAgICAgIF90aGlzLm5leHROb2RlS2V5ID0gMDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5hZGROb2RlID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5yZXBvLmFkZChub2RlKSkge1xuICAgICAgICAgICAgICAgIF90aGlzLnRocmVhZC5hZGROb2RlKG5vZGUuaWQpO1xuICAgICAgICAgICAgICAgIF90aGlzLm5leHROb2RlS2V5Kys7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubGVuZ3RoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLnRocmVhZC5ub2Rlcy5sZW5ndGg7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5yZXBvLmxlbmd0aDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB9XG4gICAgcmV0dXJuIENhY2hlSW5zdGFuY2U7XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ2FjaGVJbnN0YW5jZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaVEyRmphR1ZKYm5OMFlXNWpaUzVxY3lJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OURZV05vWlVsdWMzUmhibU5sTG5SeklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN1FVRkRRU3d3UWtGQmMwSXNZVUZCWVN4RFFVRkRMRU5CUVVFN1FVRkRjRU1zTkVKQlFYZENMR1ZCUVdVc1EwRkJReXhEUVVGQk8wRkJjVU40UXp0SlFVMUpMSFZDUVVGWkxFbEJRVms3VVVGT05VSXNhVUpCWjBORE8xRkJPVUpITEZOQlFVa3NSMEZCWlN4SlFVRkpMRzFDUVVGVExFVkJRVVVzUTBGQlF6dFJRVU51UXl4WFFVRk5MRWRCUVdsQ0xFbEJRVWtzY1VKQlFWY3NSVUZCUlN4RFFVRkRPMUZCUTNwRExHZENRVUZYTEVkQlFWY3NRMEZCUXl4RFFVRkRPMUZCVFhoQ0xGVkJRVXNzUjBGQlJ6dFpRVU5LTEV0QlFVa3NRMEZCUXl4SlFVRkpMRWRCUVVjc1NVRkJTU3h0UWtGQlV5eEZRVUZGTEVOQlFVTTdXVUZETlVJc1MwRkJTU3hEUVVGRExFMUJRVTBzUjBGQlJ5eEpRVUZKTEhGQ1FVRlhMRVZCUVVVc1EwRkJRenRaUVVOb1F5eExRVUZKTEVOQlFVTXNWMEZCVnl4SFFVRkhMRU5CUVVNc1EwRkJRenRSUVVONlFpeERRVUZETEVOQlFVRTdVVUZGUkN4WlFVRlBMRWRCUVVjc1ZVRkJReXhKUVVGblFqdFpRVU4yUWl4RlFVRkZMRU5CUVVNc1EwRkJReXhMUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03WjBKQlEzUkNMRXRCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4RlFVRkZMRU5CUVVNc1EwRkJRenRuUWtGRE4wSXNTMEZCU1N4RFFVRkRMRmRCUVZjc1JVRkJSU3hEUVVGRE8yZENRVU51UWl4TlFVRk5MRU5CUVVNc1NVRkJTU3hEUVVGRE8xbEJRMmhDTEVOQlFVTTdXVUZEUkN4TlFVRk5MRU5CUVVNc1MwRkJTeXhEUVVGRE8xRkJRMnBDTEVOQlFVTXNRMEZCUVR0UlFVVkVMRmRCUVUwc1IwRkJSenRaUVVOTUxFMUJRVTBzUTBGQlF5eExRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRXRCUVVzc1EwRkJReXhOUVVGTkxFTkJRVU03VVVGRGNFTXNRMEZCUXl4RFFVRkJPMUZCUlVRc1UwRkJTU3hIUVVGSE8xbEJRMGdzVFVGQlRTeERRVUZETEV0QlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRE8xRkJRelZDTEVOQlFVTXNRMEZCUVR0UlFYaENSeXhKUVVGSkxFTkJRVU1zU1VGQlNTeEhRVUZITEVsQlFVa3NRMEZCUXp0SlFVTnlRaXhEUVVGRE8wbEJkMEpNTEc5Q1FVRkRPMEZCUVVRc1EwRkJReXhCUVdoRFJDeEpRV2REUXp0QlFXaERSRHNyUWtGblEwTXNRMEZCUVNKOVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi8uLi9zcmMvQ2FjaGVJbnN0YW5jZS50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIENhY2hlTWFwXzEgPSByZXF1aXJlKCcuL0NhY2hlTWFwJyk7XG52YXIgQ2FjaGVSZXBvID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDYWNoZVJlcG8oKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuaXRlbXMgPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgICAgIHRoaXMubGVuZ3RoID0gMDtcbiAgICAgICAgdGhpcy5nZXQgPSBmdW5jdGlvbiAobm9kZUlkKSB7IHJldHVybiAoX3RoaXMuaXRlbXMuZ2V0KG5vZGVJZCkpOyB9O1xuICAgICAgICB0aGlzLmFkZCA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICBpZiAoIV90aGlzLml0ZW1zLmhhcyhub2RlLmlkKSkge1xuICAgICAgICAgICAgICAgIF90aGlzLml0ZW1zLnNldChub2RlLmlkLCBub2RlKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5sZW5ndGgrKztcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5kZWxldGUgPSBmdW5jdGlvbiAobm9kZUlkKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMuaXRlbXMuaGFzKG5vZGVJZCkpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5pdGVtcy5kZWxldGUobm9kZUlkKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5sZW5ndGgtLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIENhY2hlUmVwbztcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDYWNoZVJlcG87XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lRMkZqYUdWU1pYQnZMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE1pT2xzaUxpNHZMaTR2YzNKakwwTmhZMmhsVW1Wd2J5NTBjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPMEZCUTBFc2VVSkJRWEZDTEZsQlFWa3NRMEZCUXl4RFFVRkJPMEZCV1d4RE8wbEJRVUU3VVVGQlFTeHBRa0Z4UWtNN1VVRndRa2NzVlVGQlN5eEhRVUY1UWl4SlFVRkpMR3RDUVVGUkxFVkJRV01zUTBGQlF6dFJRVU42UkN4WFFVRk5MRWRCUVZjc1EwRkJReXhEUVVGRE8xRkJSVzVDTEZGQlFVY3NSMEZCUnl4VlFVRkRMRTFCUVUwc1NVRkJhVUlzVDBGQlFTeERRVUZETEV0QlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZETEVWQlFYaENMRU5CUVhkQ0xFTkJRVU03VVVGRmRrUXNVVUZCUnl4SFFVRkhMRlZCUVVNc1NVRkJaMEk3V1VGRGJrSXNSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJReXhMUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVkQlFVY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1JVRkJSU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzJkQ1FVTXpRaXhMUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVkQlFVY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1JVRkJSU3hGUVVGRkxFbEJRVWtzUTBGQlF5eERRVUZETzJkQ1FVTTVRaXhMUVVGSkxFTkJRVU1zVFVGQlRTeEZRVUZGTEVOQlFVTTdaMEpCUTJRc1RVRkJUU3hEUVVGRExFbEJRVWtzUTBGQlF6dFpRVU5vUWl4RFFVRkRPMWxCUTBRc1RVRkJUU3hEUVVGRExFdEJRVXNzUTBGQlF6dFJRVU5xUWl4RFFVRkRMRU5CUVVFN1VVRkZSQ3hYUVVGTkxFZEJRVWNzVlVGQlF5eE5RVUZqTzFsQlEzQkNMRVZCUVVVc1EwRkJReXhEUVVGRExFdEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRTFCUVUwc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dG5Ra0ZEZWtJc1MwRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eE5RVUZOTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1owSkJRekZDTEV0QlFVa3NRMEZCUXl4TlFVRk5MRVZCUVVVc1EwRkJRenRaUVVOc1FpeERRVUZETzFGQlEwd3NRMEZCUXl4RFFVRkJPMGxCUTB3c1EwRkJRenRKUVVGRUxHZENRVUZETzBGQlFVUXNRMEZCUXl4QlFYSkNSQ3hKUVhGQ1F6dEJRWEpDUkRzeVFrRnhRa01zUTBGQlFTSjlcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vLi4vc3JjL0NhY2hlUmVwby50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIENhY2hlVGhyZWFkID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDYWNoZVRocmVhZCgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gLTE7XG4gICAgICAgIHRoaXMubm9kZXMgPSBbXTtcbiAgICAgICAgdGhpcy5hZGROb2RlID0gZnVuY3Rpb24gKG5vZGVJZCkge1xuICAgICAgICAgICAgX3RoaXMubm9kZXMucHVzaChub2RlSWQpO1xuICAgICAgICAgICAgX3RoaXMuY3VycmVudCsrO1xuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gQ2FjaGVUaHJlYWQ7XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ2FjaGVUaHJlYWQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lRMkZqYUdWVWFISmxZV1F1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sY3lJNld5SXVMaTh1TGk5emNtTXZRMkZqYUdWVWFISmxZV1F1ZEhNaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWp0QlFXOUNRVHRKUVVGQk8xRkJRVUVzYVVKQlVVTTdVVUZRUnl4WlFVRlBMRWRCUVZjc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRGNrSXNWVUZCU3l4SFFVRnJRaXhGUVVGRkxFTkJRVU03VVVGRk1VSXNXVUZCVHl4SFFVRkhMRlZCUVVNc1RVRkJZenRaUVVOeVFpeExRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6dFpRVU40UWl4TFFVRkpMRU5CUVVNc1QwRkJUeXhGUVVGRkxFTkJRVU03VVVGRGJrSXNRMEZCUXl4RFFVRkJPMGxCUTB3c1EwRkJRenRKUVVGRUxHdENRVUZETzBGQlFVUXNRMEZCUXl4QlFWSkVMRWxCVVVNN1FVRlNSRHMyUWtGUlF5eERRVUZCSW4wPVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi8uLi9zcmMvQ2FjaGVUaHJlYWQudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciB1dGlsXzEgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciBjYWNoZV8xID0gcmVxdWlyZSgnLi9jYWNoZScpO1xudmFyIGdldF8xID0gcmVxdWlyZSgnLi9nZXQnKTtcbnZhciBDYWNoZU1hcF8xID0gcmVxdWlyZSgnLi9DYWNoZU1hcCcpO1xudmFyIG9wYXRoID0gcmVxdWlyZSgnLi9wYXRoJyk7XG52YXIgZmx1c2hfMSA9IHJlcXVpcmUoJy4vZmx1c2gnKTtcbnZhciBsb2NhdGVfMSA9IHJlcXVpcmUoJy4vbG9jYXRlJyk7XG52YXIgcmVmXzEgPSByZXF1aXJlKCcuL3JlZicpO1xuZXhwb3J0cy5ldmljdEl0ZW0gPSBmdW5jdGlvbiAob2JqLCBpbnN0YW5jZSkge1xuICAgIHZhciB1aWRBcnJheSA9IGJ1aWxkRXZpY3RVaWRBcnJheShvYmopO1xuICAgIGlmICh1aWRBcnJheS5sZW5ndGggPT0gMCkge1xuICAgICAgICByZXR1cm4gbG9jYXRlXzEuZ2V0Q2FsbFN0YXRzKGZhbHNlLCBpbnN0YW5jZSk7XG4gICAgfVxuICAgIHZhciBjdXJyZW50U3RhdGUgPSBnZXRfMS5nZXRDYWNoZUN1cnJlbnRTdGFjayhpbnN0YW5jZSk7XG4gICAgdmFyIGZvdW5kID0gdWlkQXJyYXkuc29tZShmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICByZXR1cm4gY3VycmVudFN0YXRlICYmIGN1cnJlbnRTdGF0ZS5oYXMoU3RyaW5nKGl0ZW0pKTtcbiAgICB9KTtcbiAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgIHJldHVybiBsb2NhdGVfMS5nZXRDYWxsU3RhdHMoZmFsc2UsIGluc3RhbmNlKTtcbiAgICB9XG4gICAgdmFyIHRlbXBTdGF0ZSA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICBjdXJyZW50U3RhdGUuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICB0ZW1wU3RhdGUuc2V0KGtleSwgdmFsdWUpO1xuICAgIH0pO1xuICAgIHZhciBmbHVzaE1hcCA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICB2YXIgZXZpY3RNYXAgPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgdmFyIGZsdXNoQXJncyA9IHtcbiAgICAgICAgZmx1c2hNYXA6IGZsdXNoTWFwLFxuICAgICAgICBldmljdE1hcDogZXZpY3RNYXAsXG4gICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZVxuICAgIH07XG4gICAgdmFyIHBhcmVudHNDaGFuZ2VkID0gW107XG4gICAgY29uc29sZS5sb2codWlkQXJyYXkpO1xuICAgIHVpZEFycmF5LmZvckVhY2goZnVuY3Rpb24gKHVpZCkge1xuICAgICAgICBmbHVzaEFyZ3MuZW50aXR5VWlkID0gdWlkO1xuICAgICAgICBjbGVhclRhcmdldFJlZkZyb21zKGZsdXNoQXJncyk7XG4gICAgICAgIGV2aWN0TWFwLnNldCh1aWQsIG51bGwpO1xuICAgICAgICBjbGVhclBhcmVudFJlZlRvcyh1aWRBcnJheSwgcGFyZW50c0NoYW5nZWQsIGZsdXNoQXJncyk7XG4gICAgfSk7XG4gICAgcHV0UGFyZW50c0NoYW5nZWQocGFyZW50c0NoYW5nZWQsIGZsdXNoTWFwLCBldmljdE1hcCwgaW5zdGFuY2UpO1xuICAgIGNvbnNvbGUubG9nKHBhcmVudHNDaGFuZ2VkKTtcbiAgICBmbHVzaE1hcC5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIGl0ZW0pIHtcbiAgICAgICAgdGVtcFN0YXRlLnNldChrZXksIGl0ZW0pO1xuICAgIH0pO1xuICAgIGV2aWN0TWFwLmZvckVhY2goZnVuY3Rpb24gKGtleSwgaXRlbSkge1xuICAgICAgICB0ZW1wU3RhdGUuZGVsZXRlKGtleSk7XG4gICAgfSk7XG4gICAgZmx1c2hfMS5mbHVzaCh0ZW1wU3RhdGUsIGluc3RhbmNlKTtcbiAgICByZXR1cm4gbG9jYXRlXzEuZ2V0Q2FsbFN0YXRzKHRydWUsIGluc3RhbmNlKTtcbn07XG52YXIgcHV0UGFyZW50c0NoYW5nZWQgPSBmdW5jdGlvbiAocGFyZW50c0NoYW5nZWQsIGZsdXNoTWFwLCBldmljdE1hcCwgaW5zdGFuY2UpIHtcbiAgICBpZiAocGFyZW50c0NoYW5nZWQgJiYgcGFyZW50c0NoYW5nZWQubGVuZ3RoID4gMCAmJiB1dGlsXzEuY2FjaGVTaXplKGluc3RhbmNlKSA+IDApIHtcbiAgICAgICAgdmFyIGZsdXNoQXJnc18xID0ge1xuICAgICAgICAgICAgZmx1c2hNYXA6IGZsdXNoTWFwLFxuICAgICAgICAgICAgZXZpY3RNYXA6IGV2aWN0TWFwLFxuICAgICAgICAgICAgaW5zdGFuY2U6IGluc3RhbmNlXG4gICAgICAgIH07XG4gICAgICAgIGZsdXNoXzEuYnVpbGRGbHVzaE1hcChmbHVzaEFyZ3NfMSk7XG4gICAgICAgIGZsdXNoQXJnc18xLmZsdXNoTWFwLmZvckVhY2goZnVuY3Rpb24gKGtleSwgaXRlbSkge1xuICAgICAgICAgICAgcmVmXzEudXBkYXRlUmVmRnJvbXMoaXRlbSwgZmx1c2hBcmdzXzEpO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xudmFyIGNsZWFyVGFyZ2V0UmVmRnJvbXMgPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgdmFyIGl0ZW0gPSBnZXRfMS5nZXRDYWNoZWRJdGVtKGZsdXNoQXJncy5lbnRpdHlVaWQsIGZsdXNoQXJncy5pbnN0YW5jZSk7XG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgaXRlbS5tYXBUby5mb3JFYWNoKGZ1bmN0aW9uICh0b1VpZCwgcGF0aHMpIHtcbiAgICAgICAgICAgIHZhciByZWZJdGVtID0gZmx1c2hfMS5nZXRJdGVtRmx1c2hPckNhY2hlZCh0b1VpZCwgZmx1c2hBcmdzKTtcbiAgICAgICAgICAgIGlmIChyZWZJdGVtKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJSZWZGcm9tKHJlZkl0ZW0sIGZsdXNoQXJncy5lbnRpdHlVaWQpO1xuICAgICAgICAgICAgICAgIGlmIChyZWZJdGVtLm1hcEZyb20uc2l6ZSgpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGZsdXNoQXJncy5lbnRpdHlVaWQgPSB0b1VpZDtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUYXJnZXRSZWZGcm9tcyhmbHVzaEFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZXZpY3RNYXAuc2V0KHRvVWlkLCByZWZJdGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZsdXNoQXJncy5mbHVzaE1hcC5zZXQodG9VaWQsIHJlZkl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcbnZhciBjbGVhclJlZkZyb20gPSBmdW5jdGlvbiAocmVmSXRlbSwgcGFyZW50VWlkKSB7XG4gICAgdmFyIHJlZnNBcnJheSA9IHJlZkl0ZW0ubWFwRnJvbS5nZXQocGFyZW50VWlkKTtcbiAgICBpZiAoIXJlZnNBcnJheSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlZkl0ZW0ubWFwRnJvbSA9IHJlZkl0ZW0ubWFwRnJvbS5jbG9uZSgpO1xuICAgIHJlZkl0ZW0ubWFwRnJvbS5kZWxldGUocGFyZW50VWlkKTtcbn07XG52YXIgY2xlYXJQYXJlbnRSZWZUb3MgPSBmdW5jdGlvbiAodWlkQXJyYXksIHBhcmVudHNDaGFuZ2VkLCBmbHVzaEFyZ3MpIHtcbiAgICB2YXIgaXRlbSA9IGZsdXNoXzEuZ2V0SXRlbUZsdXNoT3JDYWNoZWQoZmx1c2hBcmdzLmVudGl0eVVpZCwgZmx1c2hBcmdzKTtcbiAgICBpZiAoaXRlbSkge1xuICAgICAgICBpdGVtLm1hcEZyb20uZm9yRWFjaChmdW5jdGlvbiAocGFyZW50VWlkLCBwYXRocykge1xuICAgICAgICAgICAgdmFyIHBhcmVudEl0ZW0gPSBmbHVzaF8xLmdldEl0ZW1GbHVzaE9yQ2FjaGVkKHBhcmVudFVpZCwgZmx1c2hBcmdzKTtcbiAgICAgICAgICAgIGlmIChwYXJlbnRJdGVtKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN1Y2Nlc3MgPSBjbGVhclJlZlRvKHBhcmVudEl0ZW0sIGZsdXNoQXJncy5lbnRpdHlVaWQsIGZsdXNoQXJncy5pbnN0YW5jZSk7XG4gICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmx1c2hBcmdzLmZsdXNoTWFwLnNldChwYXJlbnRVaWQsIHBhcmVudEl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAodWlkQXJyYXkuaW5kZXhPZihwYXJlbnRVaWQpIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50c0NoYW5nZWQucHVzaChwYXJlbnRJdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcbnZhciBjbGVhclJlZlRvID0gZnVuY3Rpb24gKHBhcmVudEl0ZW0sIHJlZlVpZCwgaW5zdGFuY2UpIHtcbiAgICB2YXIgcGFyZW50ID0gcGFyZW50SXRlbS5lbnRpdHk7XG4gICAgaWYgKE9iamVjdC5pc0Zyb3plbihwYXJlbnQpKSB7XG4gICAgICAgIHBhcmVudCA9IGdldF8xLmdldEVkaXRJdGVtKHBhcmVudFtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSwgaW5zdGFuY2UpO1xuICAgICAgICBwYXJlbnRJdGVtLmVudGl0eSA9IHBhcmVudDtcbiAgICB9XG4gICAgdmFyIHJlZlBhdGhzID0gcGFyZW50SXRlbS5tYXBUby5nZXQocmVmVWlkKTtcbiAgICByZWZQYXRocy5mb3JFYWNoKGZ1bmN0aW9uIChwYXRoKSB7XG4gICAgICAgIG9wYXRoLmRlbChwYXJlbnQsIHBhdGgpO1xuICAgIH0pO1xuICAgIGlmICghT2JqZWN0LmlzRnJvemVuKHBhcmVudCkpIHtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZShwYXJlbnQpO1xuICAgIH1cbiAgICBwYXJlbnRJdGVtLmVudGl0eSA9IHBhcmVudDtcbiAgICBwYXJlbnRJdGVtLm1hcFRvID0gcGFyZW50SXRlbS5tYXBUby5jbG9uZSgpO1xuICAgIHBhcmVudEl0ZW0ubWFwVG8uZGVsZXRlKHJlZlVpZCk7XG4gICAgcmV0dXJuIHRydWU7XG59O1xudmFyIGJ1aWxkRXZpY3RVaWRBcnJheSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICB2YXIgdWlkQXJyYXkgPSBbXTtcbiAgICBpZiAodXRpbF8xLmlzQXJyYXkob2JqKSkge1xuICAgICAgICBvYmouZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgaWYgKHV0aWxfMS5oYXNVaWQoaXRlbSkpIHtcbiAgICAgICAgICAgICAgICB1aWRBcnJheS5wdXNoKFN0cmluZyhpdGVtW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGl0ZW0gPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGl0ZW0gPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdWlkQXJyYXkucHVzaChTdHJpbmcoaXRlbSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YXIgdWlkID0gb2JqO1xuICAgICAgICBpZiAodXRpbF8xLmlzT2JqZWN0KG9iaikpIHtcbiAgICAgICAgICAgIHVpZCA9IG9ialtjYWNoZV8xLmNvbmZpZy51aWROYW1lXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodWlkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB1aWRBcnJheTtcbiAgICAgICAgfVxuICAgICAgICB1aWRBcnJheS5wdXNoKFN0cmluZyh1aWQpKTtcbiAgICB9XG4gICAgcmV0dXJuIHVpZEFycmF5O1xufTtcbmV4cG9ydHMuY2xlYXJOZXh0ID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgdmFyIHRocmVhZCA9IGluc3RhbmNlLnRocmVhZDtcbiAgICBpZiAodGhyZWFkLmN1cnJlbnQgPCB0aHJlYWQubm9kZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICB2YXIgcmVtb3ZlZE5vZGVzID0gdGhyZWFkLm5vZGVzLnNsaWNlKHRocmVhZC5jdXJyZW50ICsgMSwgdGhyZWFkLm5vZGVzLmxlbmd0aCk7XG4gICAgICAgIHRocmVhZC5ub2RlcyA9IHRocmVhZC5ub2Rlcy5zbGljZSgwLCB0aHJlYWQuY3VycmVudCArIDEpO1xuICAgICAgICB0aHJlYWQuY3VycmVudCA9IHRocmVhZC5ub2Rlcy5sZW5ndGggLSAxO1xuICAgICAgICB0cnVuY2F0ZVRocmVhZHMocmVtb3ZlZE5vZGVzLCBpbnN0YW5jZSk7XG4gICAgfVxufTtcbnZhciB0cnVuY2F0ZVRocmVhZHMgPSBmdW5jdGlvbiAocmVtb3ZlZE5vZGVzLCBpbnN0YW5jZSkge1xuICAgIHJlbW92ZWROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChjYWNoZU5vZGVJZCkge1xuICAgICAgICB2YXIgY2FjaGVOb2RlID0gaW5zdGFuY2UucmVwby5nZXQoY2FjaGVOb2RlSWQpO1xuICAgICAgICBpZiAoY2FjaGVOb2RlKSB7XG4gICAgICAgICAgICBpbnN0YW5jZS5yZXBvLmRlbGV0ZShjYWNoZU5vZGVJZCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2laWFpwWTNRdWFuTWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUlpd2ljMjkxY21ObGN5STZXeUl1TGk4dUxpOXpjbU12WlhacFkzUXVkSE1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanRCUVVOQkxIRkNRVUZ4UkN4UlFVRlJMRU5CUVVNc1EwRkJRVHRCUVVNNVJDeHpRa0ZCZFVJc1UwRkJVeXhEUVVGRExFTkJRVUU3UVVGRGFrTXNiMEpCUVdsRkxFOUJRVThzUTBGQlF5eERRVUZCTzBGQlEzcEZMSGxDUVVGeFFpeFpRVUZaTEVOQlFVTXNRMEZCUVR0QlFVVnNReXhKUVVGWkxFdEJRVXNzVjBGQlRTeFJRVUZSTEVOQlFVTXNRMEZCUVR0QlFVTm9ReXh6UWtGQk1rUXNVMEZCVXl4RFFVRkRMRU5CUVVFN1FVRkZja1VzZFVKQlFUWkNMRlZCUVZVc1EwRkJReXhEUVVGQk8wRkJRM2hETEc5Q1FVRXJReXhQUVVGUExFTkJRVU1zUTBGQlFUdEJRVk14UXl4cFFrRkJVeXhIUVVGSExGVkJRVU1zUjBGQlJ5eEZRVUZGTEZGQlFYZENPMGxCUlc1RUxFbEJRVWtzVVVGQlVTeEhRVUZITEd0Q1FVRnJRaXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETzBsQlJYWkRMRVZCUVVVc1EwRkJReXhEUVVGRExGRkJRVkVzUTBGQlF5eE5RVUZOTEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRSUVVOMlFpeE5RVUZOTEVOQlFVTXNjVUpCUVZrc1EwRkJReXhMUVVGTExFVkJRVVVzVVVGQlVTeERRVUZETEVOQlFVTTdTVUZEZWtNc1EwRkJRenRKUVVORUxFbEJRVWtzV1VGQldTeEhRVUZITERCQ1FVRnZRaXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETzBsQlEyeEVMRWxCUVVrc1MwRkJTeXhIUVVGSExGRkJRVkVzUTBGQlF5eEpRVUZKTEVOQlFVTXNWVUZCUVN4SlFVRkpPMUZCUXpGQ0xFMUJRVTBzUTBGQlF5eFpRVUZaTEVsQlFVa3NXVUZCV1N4RFFVRkRMRWRCUVVjc1EwRkJReXhOUVVGTkxFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTXNRMEZCUXp0SlFVTXhSQ3hEUVVGRExFTkJRVU1zUTBGQlF6dEpRVVZJTEVWQlFVVXNRMEZCUXl4RFFVRkRMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF6dFJRVU5VTEUxQlFVMHNRMEZCUXl4eFFrRkJXU3hEUVVGRExFdEJRVXNzUlVGQlJTeFJRVUZSTEVOQlFVTXNRMEZCUXp0SlFVTjZReXhEUVVGRE8wbEJSVVFzU1VGQlNTeFRRVUZUTEVkQlFVY3NTVUZCU1N4clFrRkJVU3hGUVVGaExFTkJRVU03U1VGRE1VTXNXVUZCV1N4RFFVRkRMRTlCUVU4c1EwRkJReXhWUVVGRExFZEJRVWNzUlVGQlJTeExRVUZuUWp0UlFVTjJReXhUUVVGVExFTkJRVU1zUjBGQlJ5eERRVUZETEVkQlFVY3NSVUZCUlN4TFFVRkxMRU5CUVVNc1EwRkJRenRKUVVNNVFpeERRVUZETEVOQlFVTXNRMEZCUXp0SlFWRklMRWxCUVVrc1VVRkJVU3hIUVVGSExFbEJRVWtzYTBKQlFWRXNSVUZCWVN4RFFVRkRPMGxCUTNwRExFbEJRVWtzVVVGQlVTeEhRVUZITEVsQlFVa3NhMEpCUVZFc1JVRkJZU3hEUVVGRE8wbEJSWHBETEVsQlFVa3NVMEZCVXl4SFFVRmxPMUZCUTNoQ0xGRkJRVkVzUlVGQlJTeFJRVUZSTzFGQlEyeENMRkZCUVZFc1JVRkJSU3hSUVVGUk8xRkJRMnhDTEZGQlFWRXNSVUZCUlN4UlFVRlJPMHRCUTNKQ0xFTkJRVUU3U1VGRlJDeEpRVUZKTEdOQlFXTXNSMEZCUnl4RlFVRkZMRU5CUVVNN1NVRkZlRUlzVDBGQlR5eERRVUZETEVkQlFVY3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRVHRKUVVWeVFpeFJRVUZSTEVOQlFVTXNUMEZCVHl4RFFVRkRMRlZCUVVFc1IwRkJSenRSUVVOb1FpeFRRVUZUTEVOQlFVTXNVMEZCVXl4SFFVRkhMRWRCUVVjc1EwRkJRenRSUVVjeFFpeHRRa0ZCYlVJc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dFJRVWN2UWl4UlFVRlJMRU5CUVVNc1IwRkJSeXhEUVVGRExFZEJRVWNzUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXp0UlFVZDRRaXhwUWtGQmFVSXNRMEZCUXl4UlFVRlJMRVZCUVVVc1kwRkJZeXhGUVVGRkxGTkJRVk1zUTBGQlF5eERRVUZETzBsQlF6TkVMRU5CUVVNc1EwRkJReXhEUVVGRE8wbEJSVWdzYVVKQlFXbENMRU5CUVVNc1kwRkJZeXhGUVVGRkxGRkJRVkVzUlVGQlJTeFJRVUZSTEVWQlFVVXNVVUZCVVN4RFFVRkRMRU5CUVVNN1NVRkZhRVVzVDBGQlR5eERRVUZETEVkQlFVY3NRMEZCUXl4alFVRmpMRU5CUVVNc1EwRkJRenRKUVVjMVFpeFJRVUZSTEVOQlFVTXNUMEZCVHl4RFFVRkRMRlZCUVVNc1IwRkJSeXhGUVVGRkxFbEJRV1U3VVVGRGJFTXNVMEZCVXl4RFFVRkRMRWRCUVVjc1EwRkJReXhIUVVGSExFVkJRVVVzU1VGQlNTeERRVUZETEVOQlFVTTdTVUZETjBJc1EwRkJReXhEUVVGRExFTkJRVU03U1VGSFNDeFJRVUZSTEVOQlFVTXNUMEZCVHl4RFFVRkRMRlZCUVVNc1IwRkJSeXhGUVVGRkxFbEJRV1U3VVVGRGJFTXNVMEZCVXl4RFFVRkRMRTFCUVUwc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF6dEpRVU14UWl4RFFVRkRMRU5CUVVNc1EwRkJRenRKUVVWSUxHRkJRVXNzUTBGQlF5eFRRVUZUTEVWQlFVVXNVVUZCVVN4RFFVRkRMRU5CUVVNN1NVRkZNMElzVFVGQlRTeERRVUZETEhGQ1FVRlpMRU5CUVVNc1NVRkJTU3hGUVVGRkxGRkJRVkVzUTBGQlF5eERRVUZETzBGQlEzaERMRU5CUVVNc1EwRkJRenRCUVVWR0xFbEJRVTBzYVVKQlFXbENMRWRCUVVjc1ZVRkJReXhqUVVFd1FpeEZRVUZGTEZGQlFUWkNMRVZCUVVVc1VVRkJOa0lzUlVGQlJTeFJRVUYzUWp0SlFVTjZTU3hGUVVGRkxFTkJRVU1zUTBGQlF5eGpRVUZqTEVsQlFVa3NZMEZCWXl4RFFVRkRMRTFCUVUwc1IwRkJSeXhEUVVGRExFbEJRVWtzWjBKQlFWTXNRMEZCUXl4UlFVRlJMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzFGQlEzcEZMRWxCUVVrc1YwRkJVeXhIUVVGbE8xbEJRM2hDTEZGQlFWRXNSVUZCUlN4UlFVRlJPMWxCUTJ4Q0xGRkJRVkVzUlVGQlJTeFJRVUZSTzFsQlEyeENMRkZCUVZFc1JVRkJSU3hSUVVGUk8xTkJRM0pDTEVOQlFVRTdVVUZEUkN4eFFrRkJZU3hEUVVGRExGZEJRVk1zUTBGQlF5eERRVUZETzFGQlJYcENMRmRCUVZNc1EwRkJReXhSUVVGUkxFTkJRVU1zVDBGQlR5eERRVUZETEZWQlFVTXNSMEZCUnl4RlFVRkZMRWxCUVdVN1dVRkhOVU1zYjBKQlFXTXNRMEZCUXl4SlFVRkpMRVZCUVVVc1YwRkJVeXhEUVVGRExFTkJRVU03VVVGRGNFTXNRMEZCUXl4RFFVRkRMRU5CUVVFN1NVRkRUaXhEUVVGRE8wRkJRMHdzUTBGQlF5eERRVUZETzBGQlUwWXNTVUZCVFN4dFFrRkJiVUlzUjBGQlJ5eFZRVUZETEZOQlFYRkNPMGxCUXpsRExFbEJRVWtzU1VGQlNTeEhRVUZqTEcxQ1FVRmhMRU5CUVVNc1UwRkJVeXhEUVVGRExGTkJRVk1zUlVGQlJTeFRRVUZUTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN1NVRkROMFVzUlVGQlJTeERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJRenRSUVVOUUxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4RFFVRkRMRlZCUVVNc1MwRkJTeXhGUVVGRkxFdEJRVXM3V1VGRE5VSXNTVUZCU1N4UFFVRlBMRWRCUVdNc05FSkJRVzlDTEVOQlFVTXNTMEZCU3l4RlFVRkZMRk5CUVZNc1EwRkJReXhEUVVGRE8xbEJRMmhGTEVWQlFVVXNRMEZCUXl4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRExFTkJRVU03WjBKQlExWXNXVUZCV1N4RFFVRkRMRTlCUVU4c1JVRkJSU3hUUVVGVExFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdaMEpCUXpORExFVkJRVVVzUTBGQlF5eERRVUZETEU5QlFVOHNRMEZCUXl4UFFVRlBMRU5CUVVNc1NVRkJTU3hGUVVGRkxFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0dlFrRkRMMElzVTBGQlV5eERRVUZETEZOQlFWTXNSMEZCUnl4TFFVRkxMRU5CUVVNN2IwSkJRelZDTEcxQ1FVRnRRaXhEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzI5Q1FVTXZRaXhUUVVGVExFTkJRVU1zVVVGQlVTeERRVUZETEVkQlFVY3NRMEZCUXl4TFFVRkxMRVZCUVVVc1QwRkJUeXhEUVVGRExFTkJRVU03WjBKQlF6TkRMRU5CUVVNN1owSkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdiMEpCUTBvc1UwRkJVeXhEUVVGRExGRkJRVkVzUTBGQlF5eEhRVUZITEVOQlFVTXNTMEZCU3l4RlFVRkZMRTlCUVU4c1EwRkJReXhEUVVGRE8yZENRVU16UXl4RFFVRkRPMWxCUTB3c1EwRkJRenRSUVVOTUxFTkJRVU1zUTBGQlF5eERRVUZCTzBsQlEwNHNRMEZCUXp0QlFVTk1MRU5CUVVNc1EwRkJRenRCUVZGR0xFbEJRVTBzV1VGQldTeEhRVUZITEZWQlFVTXNUMEZCYTBJc1JVRkJSU3hUUVVGVE8wbEJReTlETEVsQlFVa3NVMEZCVXl4SFFVRkhMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zUjBGQlJ5eERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRPMGxCUXk5RExFVkJRVVVzUTBGQlF5eERRVUZETEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNc1EwRkJRenRSUVVOaUxFMUJRVTBzUTBGQlF6dEpRVU5ZTEVOQlFVTTdTVUZEUkN4UFFVRlBMRU5CUVVNc1QwRkJUeXhIUVVGSExFOUJRVThzUTBGQlF5eFBRVUZQTEVOQlFVTXNTMEZCU3l4RlFVRkZMRU5CUVVNN1NVRkRNVU1zVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4TlFVRk5MRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03UVVGRGRFTXNRMEZCUXl4RFFVRkRPMEZCYjBKR0xFbEJRVTBzYVVKQlFXbENMRWRCUVVjc1ZVRkJReXhSUVVGUkxFVkJRVVVzWTBGQll5eEZRVUZGTEZOQlFYRkNPMGxCUTNSRkxFbEJRVWtzU1VGQlNTeEhRVUZqTERSQ1FVRnZRaXhEUVVGRExGTkJRVk1zUTBGQlF5eFRRVUZUTEVWQlFVVXNVMEZCVXl4RFFVRkRMRU5CUVVNN1NVRkZNMFVzUlVGQlJTeERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJRenRSUVVOUUxFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRMRlZCUVVNc1UwRkJVeXhGUVVGRkxFdEJRVXM3V1VGRGJFTXNTVUZCU1N4VlFVRlZMRWRCUVVjc05FSkJRVzlDTEVOQlFVTXNVMEZCVXl4RlFVRkZMRk5CUVZNc1EwRkJReXhEUVVGRE8xbEJRelZFTEVWQlFVVXNRMEZCUXl4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRExFTkJRVU03WjBKQlEySXNTVUZCU1N4UFFVRlBMRWRCUVVjc1ZVRkJWU3hEUVVGRExGVkJRVlVzUlVGQlJTeFRRVUZUTEVOQlFVTXNVMEZCVXl4RlFVRkZMRk5CUVZNc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dG5Ra0ZET1VVc1JVRkJSU3hEUVVGRExFTkJRVU1zVDBGQlR5eExRVUZMTEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNN2IwSkJRMjVDTEZOQlFWTXNRMEZCUXl4UlFVRlJMRU5CUVVNc1IwRkJSeXhEUVVGRExGTkJRVk1zUlVGQlJTeFZRVUZWTEVOQlFVTXNRMEZCUXp0dlFrRkRPVU1zUlVGQlJTeERRVUZETEVOQlFVTXNVVUZCVVN4RFFVRkRMRTlCUVU4c1EwRkJReXhUUVVGVExFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPM2RDUVVOc1F5eGpRVUZqTEVOQlFVTXNTVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRE8yOUNRVU53UXl4RFFVRkRPMmRDUVVOTUxFTkJRVU03V1VGRFRDeERRVUZETzFGQlEwd3NRMEZCUXl4RFFVRkRMRU5CUVVFN1NVRkRUaXhEUVVGRE8wRkJRMHdzUTBGQlF5eERRVUZETzBGQlVVWXNTVUZCVFN4VlFVRlZMRWRCUVVjc1ZVRkJReXhWUVVGeFFpeEZRVUZGTEUxQlFVMHNSVUZCUlN4UlFVRjNRanRKUVVWMlJTeEpRVUZKTEUxQlFVMHNSMEZCUnl4VlFVRlZMRU5CUVVNc1RVRkJUU3hEUVVGRE8wbEJReTlDTEVWQlFVVXNRMEZCUXl4RFFVRkRMRTFCUVUwc1EwRkJReXhSUVVGUkxFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMUZCUXpGQ0xFMUJRVTBzUjBGQlJ5eHBRa0ZCVnl4RFFVRkRMRTFCUVUwc1EwRkJReXhqUVVGTkxFTkJRVU1zVDBGQlR5eERRVUZETEVWQlFVVXNVVUZCVVN4RFFVRkRMRU5CUVVNN1VVRkRka1FzVlVGQlZTeERRVUZETEUxQlFVMHNSMEZCUnl4TlFVRk5MRU5CUVVNN1NVRkRMMElzUTBGQlF6dEpRVU5FTEVsQlFVa3NVVUZCVVN4SFFVRkhMRlZCUVZVc1EwRkJReXhMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMGxCUXpWRExGRkJRVkVzUTBGQlF5eFBRVUZQTEVOQlFVTXNWVUZCUVN4SlFVRkpPMUZCUTJwQ0xFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNUVUZCVFN4RlFVRkZMRWxCUVVrc1EwRkJReXhEUVVGRE8wbEJRelZDTEVOQlFVTXNRMEZCUXl4RFFVRkRPMGxCUTBnc1JVRkJSU3hEUVVGRExFTkJRVU1zUTBGQlF5eE5RVUZOTEVOQlFVTXNVVUZCVVN4RFFVRkRMRTFCUVUwc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dFJRVU16UWl4TlFVRk5MRU5CUVVNc1RVRkJUU3hEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZETzBsQlF6RkNMRU5CUVVNN1NVRkRSQ3hWUVVGVkxFTkJRVU1zVFVGQlRTeEhRVUZITEUxQlFVMHNRMEZCUXp0SlFVY3pRaXhWUVVGVkxFTkJRVU1zUzBGQlN5eEhRVUZITEZWQlFWVXNRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTeXhGUVVGRkxFTkJRVU03U1VGRE5VTXNWVUZCVlN4RFFVRkRMRXRCUVVzc1EwRkJReXhOUVVGTkxFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdTVUZEYUVNc1RVRkJUU3hEUVVGRExFbEJRVWtzUTBGQlF6dEJRVU5vUWl4RFFVRkRMRU5CUVVNN1FVRlBSaXhKUVVGTkxHdENRVUZyUWl4SFFVRkhMRlZCUVVFc1IwRkJSenRKUVVNeFFpeEpRVUZKTEZGQlFWRXNSMEZCUnl4RlFVRkZMRU5CUVVNN1NVRkRiRUlzUlVGQlJTeERRVUZETEVOQlFVTXNZMEZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dFJRVVZtTEVkQlFVY3NRMEZCUXl4UFFVRlBMRU5CUVVNc1ZVRkJRU3hKUVVGSk8xbEJRMW9zUlVGQlJTeERRVUZETEVOQlFVTXNZVUZCVFN4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dG5Ra0ZEWml4UlFVRlJMRU5CUVVNc1NVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTXNZMEZCVFN4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dFpRVU5vUkN4RFFVRkRPMWxCUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03WjBKQlEwb3NSVUZCUlN4RFFVRkRMRU5CUVVNc1QwRkJUeXhKUVVGSkxFdEJRVXNzVVVGQlVTeEpRVUZKTEU5QlFVOHNTVUZCU1N4TFFVRkxMRkZCUVZFc1EwRkJReXhEUVVGRExFTkJRVU03YjBKQlEzWkVMRkZCUVZFc1EwRkJReXhKUVVGSkxFTkJRVU1zVFVGQlRTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVFN1owSkJReTlDTEVOQlFVTTdXVUZGVEN4RFFVRkRPMUZCUTB3c1EwRkJReXhEUVVGRExFTkJRVU03U1VGRFVDeERRVUZETzBsQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1VVRkRTaXhKUVVGSkxFZEJRVWNzUjBGQlJ5eEhRVUZITEVOQlFVTTdVVUZEWkN4RlFVRkZMRU5CUVVNc1EwRkJReXhsUVVGUkxFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMWxCUTJoQ0xFZEJRVWNzUjBGQlJ5eEhRVUZITEVOQlFVTXNZMEZCVFN4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRE8xRkJRemxDTEVOQlFVTTdVVUZEUkN4RlFVRkZMRU5CUVVNc1EwRkJReXhIUVVGSExFdEJRVXNzVTBGQlV5eERRVUZETEVOQlFVTXNRMEZCUXp0WlFVTndRaXhOUVVGTkxFTkJRVU1zVVVGQlVTeERRVUZETzFGQlEzQkNMRU5CUVVNN1VVRkRSQ3hSUVVGUkxFTkJRVU1zU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRE8wbEJReTlDTEVOQlFVTTdTVUZEUkN4TlFVRk5MRU5CUVVNc1VVRkJVU3hEUVVGRE8wRkJRM0JDTEVOQlFVTXNRMEZCUXp0QlFWVlhMR2xDUVVGVExFZEJRVWNzVlVGQlF5eFJRVUYzUWp0SlFVVTVReXhKUVVGSkxFMUJRVTBzUjBGQlJ5eFJRVUZSTEVOQlFVTXNUVUZCVFN4RFFVRkRPMGxCUXpkQ0xFVkJRVVVzUTBGQlF5eERRVUZETEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1RVRkJUU3hEUVVGRExFdEJRVXNzUTBGQlF5eE5RVUZOTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRSUVVNelF5eEpRVUZKTEZsQlFWa3NSMEZCUnl4TlFVRk5MRU5CUVVNc1MwRkJTeXhEUVVGRExFdEJRVXNzUTBGQlF5eE5RVUZOTEVOQlFVTXNUMEZCVHl4SFFVRkhMRU5CUVVNc1JVRkJSU3hOUVVGTkxFTkJRVU1zUzBGQlN5eERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMUZCUXk5RkxFMUJRVTBzUTBGQlF5eExRVUZMTEVkQlFVY3NUVUZCVFN4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5eEZRVUZGTEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRGVrUXNUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhOUVVGTkxFTkJRVU1zUzBGQlN5eERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRU5CUVVNN1VVRkRla01zWlVGQlpTeERRVUZETEZsQlFWa3NSVUZCUlN4UlFVRlJMRU5CUVVNc1EwRkJRenRKUVVNMVF5eERRVUZETzBGQlEwd3NRMEZCUXl4RFFVRkRPMEZCVFVZc1NVRkJUU3hsUVVGbExFZEJRVWNzVlVGQlF5eFpRVUZaTEVWQlFVVXNVVUZCZDBJN1NVRkRNMFFzV1VGQldTeERRVUZETEU5QlFVOHNRMEZCUXl4VlFVRkJMRmRCUVZjN1VVRkROVUlzU1VGQlNTeFRRVUZUTEVkQlFVY3NVVUZCVVN4RFFVRkRMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zVjBGQlZ5eERRVUZETEVOQlFVTTdVVUZETDBNc1JVRkJSU3hEUVVGRExFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTXNRMEZCUXp0WlFVTmFMRkZCUVZFc1EwRkJReXhKUVVGSkxFTkJRVU1zVFVGQlRTeERRVUZETEZkQlFWY3NRMEZCUXl4RFFVRkRPMUZCUTNSRExFTkJRVU03U1VGRFRDeERRVUZETEVOQlFVTXNRMEZCUXp0QlFVTlFMRU5CUVVNc1EwRkJReUo5XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uLy4uL3NyYy9ldmljdC50cyJdLCJzb3VyY2VSb290IjoiIn0=