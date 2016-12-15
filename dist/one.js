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
	    if (window) {
	        window.One = { getCache: cache_1.getCache };
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNjZiYTdhNjhiOTg2MDU1YWE1NTUiLCJ3ZWJwYWNrOi8vLy4vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vY2FjaGUudHMiLCJ3ZWJwYWNrOi8vLy4vY29uZmlnLnRzIiwid2VicGFjazovLy8uL3B1dC50cyIsIndlYnBhY2s6Ly8vLi9DYWNoZU1hcC50cyIsIndlYnBhY2s6Ly8vLi4vfi9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwid2VicGFjazovLy8uL2xvY2F0ZS50cyIsIndlYnBhY2s6Ly8vLi91dGlsLnRzIiwid2VicGFjazovLy8uL0NhY2hlTm9kZS50cyIsIndlYnBhY2s6Ly8vLi9yZWYudHMiLCJ3ZWJwYWNrOi8vLy4vZmx1c2gudHMiLCJ3ZWJwYWNrOi8vLy4vZ2V0LnRzIiwid2VicGFjazovLy8uL3BhdGgudHMiLCJ3ZWJwYWNrOi8vLy4vQ2FjaGVJdGVtLnRzIiwid2VicGFjazovLy8uL3ByaW50LnRzIiwid2VicGFjazovLy8uL0NhY2hlSW5zdGFuY2UudHMiLCJ3ZWJwYWNrOi8vLy4vQ2FjaGVSZXBvLnRzIiwid2VicGFjazovLy8uL0NhY2hlVGhyZWFkLnRzIiwid2VicGFjazovLy8uL2V2aWN0LnRzIl0sIm5hbWVzIjpbImNhY2hlXzEiLCJyZXF1aXJlIiwiZXhwb3J0cyIsImdldENhY2hlIiwid2luZG93IiwiT25lIiwiY29uZmlnXzEiLCJwdXRfMSIsInByaW50XzEiLCJDYWNoZUluc3RhbmNlXzEiLCJ1dGlsXzEiLCJnZXRfMSIsImV2aWN0XzEiLCJjYWNoZVRlc3QiLCJzZXRUZXN0aW5nIiwidGVzdGluZyIsImluc3RhbmNlTmFtZSIsImNvbmZpZ3VyYXRpb24iLCJkZWZhdWx0Q29uZmlnIiwiY29uZmlnIiwiaW5zdGFuY2VzIiwiY29uZmlndXJlIiwiY3JlYXRlQ2FjaGUiLCJ1bmRlZmluZWQiLCJuYW1lIiwiaW5zdGFuY2UiLCJkZWZhdWx0IiwicmVzZXQiLCJwdXQiLCJpdGVtIiwicHV0SXRlbSIsImdldCIsImVudGl0eSIsIm5vZGVJZCIsImdldEl0ZW0iLCJnZXRFZGl0IiwidWlkT3JFbnRpdHlPckFycmF5IiwiZ2V0RWRpdEl0ZW0iLCJldmljdCIsImV2aWN0SXRlbSIsInNpemUiLCJjYWNoZVNpemUiLCJsZW5ndGgiLCJjYWNoZUxlbmd0aCIsInByaW50IiwicHJpbnRDYWNoZSIsInJlZkZyb20iLCJ1aWQiLCJnZXRDYWNoZWRJdGVtIiwibWFwRnJvbSIsInJlZlRvIiwibWFwVG8iLCJyZXN1bHQiLCJ1aWROYW1lIiwibWF4SGlzdG9yeVN0YXRlcyIsImNvbmYiLCJwIiwiaGFzT3duUHJvcGVydHkiLCJDYWNoZU1hcF8xIiwibG9jYXRlXzEiLCJyZWZfMSIsImZsdXNoXzEiLCJpc0FycmF5IiwiaXNPYmplY3QiLCJldmljdE1hcCIsImZsdXNoTWFwIiwiZmx1c2hBcmdzIiwicGFyZW50VWlkIiwicmVmUGF0aCIsImJ1aWxkRmx1c2hNYXAiLCJ1cGRhdGVQb2ludGVycyIsImNvbW1pdFB1dCIsImdldENhbGxTdGF0cyIsInByZUZsdXNoIiwib2JqZWN0QXNzaWduIiwiQ2FjaGVNYXAiLCJfdGhpcyIsInBhdGhzIiwia2V5IiwiZGVsZXRlIiwidmFsIiwiaGFzIiwiZm9yRWFjaCIsImNhbGxiYWNrIiwiY2xvbmUiLCJuZXdJbnN0YW5jZSIsInByb3RvdHlwZSIsInNldCIsInZhbHVlIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJzdWNjZXNzIiwibm9kZSIsImN1cnJlbnROb2RlIiwiZ2V0Q3VycmVudE5vZGUiLCJpZCIsImlzTnVtYmVyIiwiVHlwZUVycm9yIiwiY2FjaGVOb2RlIiwiZ2V0UmVwb05vZGUiLCJ0aHJlYWQiLCJjdXJyZW50IiwiYmluYXJ5SW5kZXhPZiIsIm5vZGVzIiwiY3VycmVudE5vZGVJZCIsImNhY2hlTm9kZUlkIiwicmVwbyIsImFycmF5Iiwic2VhcmNoRWxlbWVudCIsIm1pbkluZGV4IiwibWF4SW5kZXgiLCJjdXJyZW50SW5kZXgiLCJjdXJyZW50RWxlbWVudCIsIkNhY2hlTm9kZV8xIiwidG9TdHJpbmciLCJfaGFzT3duUHJvcGVydHkiLCJpc1N0cmluZyIsIm9iaiIsIm1peGVkX3ZhciIsImNhbGwiLCJBcnJheSIsInNwbGljZSIsInByb3BlcnR5SXNFbnVtZXJhYmxlIiwib2JqVG9TdHIiLCJvIiwiaXNEYXRlIiwiaXNFbXB0eSIsImkiLCJnZXROZXdDYWNoZU5vZGUiLCJDYWNoZU5vZGUiLCJuZXh0Tm9kZUtleSIsImFkZCIsImhhc1VpZCIsImRlZXBDbG9uZSIsInVpZFJlZmVyZW5jZSIsImZyZWV6ZSIsImlzRnJvemVuIiwicHJvcE5hbWUiLCJkZWVwQ2xvbmVBcnJheSIsImRhdGUiLCJEYXRlIiwiZ2V0VGltZSIsImFyciIsIm1hcCIsIml0ZW1zIiwib3BhdGgiLCJhc3NpZ25SZWZUb1BhcmVudCIsInJlZkl0ZW0iLCJwYXJlbnRJdGVtIiwiZ2V0SXRlbUZsdXNoT3JDYWNoZWQiLCJhc3NpZ25SZWZzIiwicmVmVWlkIiwiYWRkUmVmVG8iLCJhZGRSZWZGcm9tIiwicGF0aCIsInJlZkFycmF5IiwiaW5kZXhPZiIsInB1c2giLCJmcm9tQXJyYXkiLCJ1cGRhdGVJdGVtUmVmVG9zIiwidXBkYXRlUmVmRnJvbXMiLCJmaXJzdFBhdGgiLCJ0YXJnZXRSZWYiLCJkaXJ0eSIsImFyZ3MiLCJlbnN1cmVJdGVtIiwidXBkYXRlUmVmVG9zIiwiZW50aXR5VWlkIiwidG9VaWQiLCJ1cGRhdGVkUGF0aHMiLCJyZWZlcmVuY2UiLCJ0YXJnZXRVaWQiLCJmb3VuZCIsInJlbW92ZVJlZkZyb21fVmFsdWUiLCJmaWx0ZXIiLCJyZW1vdmVSZWZGcm9tIiwicmVmc0FycmF5IiwiaW5kZXgiLCJzbGljZSIsInBhdGhfMSIsIkNhY2hlSXRlbV8xIiwiYnVpbGRFbnRpdHlGbHVzaE1hcCIsImNhY2hlQXJyUmVmcyIsImNhY2hlRW50aXR5UmVmcyIsImlzRGlydHkiLCJlbnN1cmVPbkZsdXNoTWFwIiwiU3RyaW5nIiwicGFyZW50RW50aXR5IiwicHJvcCIsInJlZkVudGl0eSIsImNvbmNhdFByb3AiLCJjYWNoZU9ialJlZnMiLCJhcnJheVBhdGgiLCJhcnJheVVpZCIsIm5leHQiLCJjYWNoZVVpZE9ialJlZnMiLCJpc09uQ2FjaGUiLCJjYWNoZWRJdGVtIiwiaXRlbVVpZCIsImxpdmUiLCJ0ZW1wIiwiY3VycmVudFN0YWNrIiwiZ2V0Q2FjaGVDdXJyZW50U3RhY2siLCJmcmVlemVJdGVtIiwiZmx1c2giLCJnZXRPYmplY3QiLCJ1aWRPckVudGl0eSIsInJlYWxVaWQiLCJnZXRBY3R1YWxVaWQiLCJnZXRFZGl0YWJsZU9iamVjdCIsImV4aXN0aW5nIiwiZXhpc3RpbmdJdGVtIiwiZ2V0S2V5IiwiaW50S2V5IiwicGFyc2VJbnQiLCJkZWwiLCJzcGxpdCIsImN1cnJlbnRQYXRoIiwib2xkVmFsIiwiZGVmYXVsdFZhbHVlIiwicHJvcENoYWluIiwiQ2FjaGVJdGVtIiwibGl2ZUl0ZW0iLCJub2RlSW5kaWNlcyIsInN0cmVhbURhdGEiLCJzdGF0ZSIsInN0cmluZ2lmeU1hcCIsInN1YnN0cmluZyIsIkpTT04iLCJzdHJpbmdpZnkiLCJpdGVtUmVzdWx0IiwiQ2FjaGVSZXBvXzEiLCJDYWNoZVRocmVhZF8xIiwiQ2FjaGVJbnN0YW5jZSIsImFkZE5vZGUiLCJDYWNoZVJlcG8iLCJDYWNoZVRocmVhZCIsInVpZEFycmF5IiwiYnVpbGRFdmljdFVpZEFycmF5IiwiY3VycmVudFN0YXRlIiwic29tZSIsInRlbXBTdGF0ZSIsInBhcmVudHNDaGFuZ2VkIiwiY2xlYXJUYXJnZXRSZWZGcm9tcyIsImNsZWFyUGFyZW50UmVmVG9zIiwicHV0UGFyZW50c0NoYW5nZWQiLCJmbHVzaEFyZ3NfMSIsImNsZWFyUmVmRnJvbSIsImNsZWFyUmVmVG8iLCJwYXJlbnQiLCJyZWZQYXRocyIsImNsZWFyTmV4dCIsInJlbW92ZWROb2RlcyIsInRydW5jYXRlVGhyZWFkcyJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNB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Q0FBM0MsRUFBOEM7QUFDMUMsYUFBSWtOLGVBQWV4SixPQUFPRyxLQUFQLENBQWEyRSxLQUFiLENBQW1COUUsT0FBT0MsT0FBUCxHQUFpQixDQUFwQyxFQUF1Q0QsT0FBT0csS0FBUCxDQUFhN0QsTUFBcEQsQ0FBbkI7QUFDQTBELGdCQUFPRyxLQUFQLEdBQWVILE9BQU9HLEtBQVAsQ0FBYTJFLEtBQWIsQ0FBbUIsQ0FBbkIsRUFBc0I5RSxPQUFPQyxPQUFQLEdBQWlCLENBQXZDLENBQWY7QUFDQUQsZ0JBQU9DLE9BQVAsR0FBaUJELE9BQU9HLEtBQVAsQ0FBYTdELE1BQWIsR0FBc0IsQ0FBdkM7QUFDQW1OLHlCQUFnQkQsWUFBaEIsRUFBOEJuTyxRQUE5QjtBQUNIO0FBQ0osRUFSRDtBQVNBLEtBQUlvTyxrQkFBa0IsVUFBVUQsWUFBVixFQUF3Qm5PLFFBQXhCLEVBQWtDO0FBQ3BEbU8sa0JBQWExSyxPQUFiLENBQXFCLFVBQVV1QixXQUFWLEVBQXVCO0FBQ3hDLGFBQUlQLFlBQVl6RSxTQUFTaUYsSUFBVCxDQUFjM0UsR0FBZCxDQUFrQjBFLFdBQWxCLENBQWhCO0FBQ0EsYUFBSVAsU0FBSixFQUFlO0FBQ1h6RSxzQkFBU2lGLElBQVQsQ0FBYzNCLE1BQWQsQ0FBcUIwQixXQUFyQjtBQUNIO0FBQ0osTUFMRDtBQU1ILEVBUEQsQyIsImZpbGUiOiJvbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA2NmJhN2E2OGI5ODYwNTVhYTU1NSIsIlwidXNlIHN0cmljdFwiO1xudmFyIGNhY2hlXzEgPSByZXF1aXJlKFwiLi9jYWNoZVwiKTtcbmV4cG9ydHMuZ2V0Q2FjaGUgPSBjYWNoZV8xLmdldENhY2hlO1xuKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAod2luZG93KSB7XG4gICAgICAgIHdpbmRvdy5PbmUgPSB7IGdldENhY2hlOiBjYWNoZV8xLmdldENhY2hlIH07XG4gICAgfVxufSkoKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2luZGV4LnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgY29uZmlnXzEgPSByZXF1aXJlKFwiLi9jb25maWdcIik7XG52YXIgcHV0XzEgPSByZXF1aXJlKFwiLi9wdXRcIik7XG52YXIgcHJpbnRfMSA9IHJlcXVpcmUoXCIuL3ByaW50XCIpO1xudmFyIENhY2hlSW5zdGFuY2VfMSA9IHJlcXVpcmUoXCIuL0NhY2hlSW5zdGFuY2VcIik7XG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbnZhciBnZXRfMSA9IHJlcXVpcmUoXCIuL2dldFwiKTtcbnZhciBldmljdF8xID0gcmVxdWlyZShcIi4vZXZpY3RcIik7XG52YXIgY2FjaGVUZXN0ID0gZmFsc2U7XG5mdW5jdGlvbiBzZXRUZXN0aW5nKHRlc3RpbmcpIHtcbiAgICBjYWNoZVRlc3QgPSB0ZXN0aW5nO1xufVxuZXhwb3J0cy5zZXRUZXN0aW5nID0gc2V0VGVzdGluZztcbmZ1bmN0aW9uIGdldENhY2hlKGluc3RhbmNlTmFtZSwgY29uZmlndXJhdGlvbikge1xuICAgIGlmIChpbnN0YW5jZU5hbWUgPT09IHZvaWQgMCkgeyBpbnN0YW5jZU5hbWUgPSBcIm9uZVwiOyB9XG4gICAgaWYgKGNvbmZpZ3VyYXRpb24gPT09IHZvaWQgMCkgeyBjb25maWd1cmF0aW9uID0gY29uZmlnXzEuZGVmYXVsdENvbmZpZzsgfVxuICAgIGlmICghZXhwb3J0cy5jb25maWcgJiYgIWV4cG9ydHMuaW5zdGFuY2VzKSB7XG4gICAgICAgIGV4cG9ydHMuY29uZmlnID0gY29uZmlnXzEuY29uZmlndXJlKGNvbmZpZ3VyYXRpb24pO1xuICAgIH1cbiAgICBpZiAoIWV4cG9ydHMuaW5zdGFuY2VzKSB7XG4gICAgICAgIGV4cG9ydHMuaW5zdGFuY2VzID0ge307XG4gICAgfVxuICAgIGlmICghZXhwb3J0cy5pbnN0YW5jZXNbaW5zdGFuY2VOYW1lXSkge1xuICAgICAgICBleHBvcnRzLmluc3RhbmNlc1tpbnN0YW5jZU5hbWVdID0gY3JlYXRlQ2FjaGUoaW5zdGFuY2VOYW1lKTtcbiAgICB9XG4gICAgaWYgKHdpbmRvdykge1xuICAgICAgICBpZiAod2luZG93W2luc3RhbmNlTmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgd2luZG93W2luc3RhbmNlTmFtZV0gPSBleHBvcnRzLmluc3RhbmNlc1tpbnN0YW5jZU5hbWVdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBleHBvcnRzLmluc3RhbmNlc1tpbnN0YW5jZU5hbWVdO1xufVxuZXhwb3J0cy5nZXRDYWNoZSA9IGdldENhY2hlO1xuZnVuY3Rpb24gY3JlYXRlQ2FjaGUobmFtZSkge1xuICAgIHZhciBpbnN0YW5jZSA9IG5ldyBDYWNoZUluc3RhbmNlXzEuZGVmYXVsdChuYW1lKTtcbiAgICB2YXIgcmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGluc3RhbmNlLnJlc2V0KCk7XG4gICAgfTtcbiAgICB2YXIgcHV0ID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIHB1dF8xLnB1dEl0ZW0oaXRlbSwgaW5zdGFuY2UpO1xuICAgIH07XG4gICAgdmFyIGdldCA9IGZ1bmN0aW9uIChlbnRpdHksIG5vZGVJZCkge1xuICAgICAgICByZXR1cm4gZ2V0XzEuZ2V0SXRlbShlbnRpdHksIGluc3RhbmNlLCBub2RlSWQpO1xuICAgIH07XG4gICAgdmFyIGdldEVkaXQgPSBmdW5jdGlvbiAodWlkT3JFbnRpdHlPckFycmF5LCBub2RlSWQpIHtcbiAgICAgICAgcmV0dXJuIGdldF8xLmdldEVkaXRJdGVtKHVpZE9yRW50aXR5T3JBcnJheSwgaW5zdGFuY2UsIG5vZGVJZCk7XG4gICAgfTtcbiAgICB2YXIgZXZpY3QgPSBmdW5jdGlvbiAodWlkT3JFbnRpdHlPckFycmF5KSB7XG4gICAgICAgIHJldHVybiBldmljdF8xLmV2aWN0SXRlbSh1aWRPckVudGl0eU9yQXJyYXksIGluc3RhbmNlKTtcbiAgICB9O1xuICAgIHZhciBzaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdXRpbF8xLmNhY2hlU2l6ZShpbnN0YW5jZSk7XG4gICAgfTtcbiAgICB2YXIgbGVuZ3RoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdXRpbF8xLmNhY2hlTGVuZ3RoKGluc3RhbmNlKTtcbiAgICB9O1xuICAgIHZhciBwcmludCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHByaW50XzEucHJpbnRDYWNoZShpbnN0YW5jZSk7XG4gICAgfTtcbiAgICB2YXIgcmVmRnJvbSA9IGZ1bmN0aW9uICh1aWQpIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBnZXRfMS5nZXRDYWNoZWRJdGVtKHVpZCwgaW5zdGFuY2UpO1xuICAgICAgICByZXR1cm4gaXRlbS5tYXBGcm9tO1xuICAgIH07XG4gICAgdmFyIHJlZlRvID0gZnVuY3Rpb24gKHVpZCkge1xuICAgICAgICB2YXIgaXRlbSA9IGdldF8xLmdldENhY2hlZEl0ZW0odWlkLCBpbnN0YW5jZSk7XG4gICAgICAgIHJldHVybiBpdGVtLm1hcFRvO1xuICAgIH07XG4gICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgcHV0OiBwdXQsXG4gICAgICAgIGdldDogZ2V0LFxuICAgICAgICBnZXRFZGl0OiBnZXRFZGl0LFxuICAgICAgICBldmljdDogZXZpY3QsXG4gICAgICAgIHJlc2V0OiByZXNldCxcbiAgICAgICAgc2l6ZTogc2l6ZSxcbiAgICAgICAgbGVuZ3RoOiBsZW5ndGgsXG4gICAgICAgIHByaW50OiBwcmludCxcbiAgICAgICAgcmVmVG86IHJlZlRvLFxuICAgICAgICByZWZGcm9tOiByZWZGcm9tXG4gICAgfTtcbiAgICBpZiAoY2FjaGVUZXN0ID09PSBmYWxzZSkge1xuICAgICAgICBkZWxldGUgcmVzdWx0LnJlZlRvO1xuICAgICAgICBkZWxldGUgcmVzdWx0LnJlZkZyb207XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9jYWNoZS50cyIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5kZWZhdWx0Q29uZmlnID0ge1xuICAgIHVpZE5hbWU6IFwidWlkXCIsXG4gICAgbWF4SGlzdG9yeVN0YXRlczogMTAwMFxufTtcbmZ1bmN0aW9uIGNvbmZpZ3VyZShjb25mKSB7XG4gICAgZm9yICh2YXIgcCBpbiBleHBvcnRzLmRlZmF1bHRDb25maWcpIHtcbiAgICAgICAgaWYgKGV4cG9ydHMuZGVmYXVsdENvbmZpZy5oYXNPd25Qcm9wZXJ0eShwKSAmJiBjb25mLmhhc093blByb3BlcnR5KHApKSB7XG4gICAgICAgICAgICBleHBvcnRzLmRlZmF1bHRDb25maWdbcF0gPSBjb25mW3BdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBleHBvcnRzLmRlZmF1bHRDb25maWc7XG59XG5leHBvcnRzLmNvbmZpZ3VyZSA9IGNvbmZpZ3VyZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2NvbmZpZy50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIENhY2hlTWFwXzEgPSByZXF1aXJlKFwiLi9DYWNoZU1hcFwiKTtcbnZhciBsb2NhdGVfMSA9IHJlcXVpcmUoXCIuL2xvY2F0ZVwiKTtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xudmFyIHJlZl8xID0gcmVxdWlyZShcIi4vcmVmXCIpO1xudmFyIGZsdXNoXzEgPSByZXF1aXJlKFwiLi9mbHVzaFwiKTtcbmV4cG9ydHMucHV0SXRlbSA9IGZ1bmN0aW9uIChlbnRpdHksIGluc3RhbmNlKSB7XG4gICAgaWYgKCh1dGlsXzEuaXNBcnJheShlbnRpdHkpIHx8IHV0aWxfMS5pc09iamVjdChlbnRpdHkpKSkge1xuICAgICAgICB2YXIgZXZpY3RNYXAgPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgICAgIHZhciBmbHVzaE1hcCA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICAgICAgZmx1c2hNYXBbJ19fVVBEQVRFRF9fJ10gPSBmYWxzZTtcbiAgICAgICAgdmFyIGZsdXNoQXJncyA9IHtcbiAgICAgICAgICAgIGVudGl0eTogZW50aXR5LFxuICAgICAgICAgICAgZmx1c2hNYXA6IGZsdXNoTWFwLFxuICAgICAgICAgICAgZXZpY3RNYXA6IGV2aWN0TWFwLFxuICAgICAgICAgICAgcGFyZW50VWlkOiBudWxsLFxuICAgICAgICAgICAgcmVmUGF0aDogXCJcIixcbiAgICAgICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZVxuICAgICAgICB9O1xuICAgICAgICBmbHVzaF8xLmJ1aWxkRmx1c2hNYXAoZmx1c2hBcmdzKTtcbiAgICAgICAgcmVmXzEudXBkYXRlUG9pbnRlcnMoZmx1c2hBcmdzKTtcbiAgICAgICAgaWYgKGZsdXNoQXJncy5mbHVzaE1hcC5zaXplKCkgPiAwICYmIGZsdXNoTWFwWydfX1VQREFURURfXyddID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm4gY29tbWl0UHV0KGZsdXNoQXJncyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGxvY2F0ZV8xLmdldENhbGxTdGF0cyhmYWxzZSwgaW5zdGFuY2UpO1xufTtcbnZhciBjb21taXRQdXQgPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgZmx1c2hfMS5wcmVGbHVzaChmbHVzaEFyZ3MpO1xuICAgIHJldHVybiBsb2NhdGVfMS5nZXRDYWxsU3RhdHModHJ1ZSwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wdXQudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBvYmplY3RBc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG52YXIgQ2FjaGVNYXAgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENhY2hlTWFwKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLnBhdGhzID0ge307XG4gICAgICAgIHRoaXMubGVuZ3RoID0gMDtcbiAgICAgICAgdGhpcy5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMucGF0aHNba2V5XTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5kZWxldGUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIF90aGlzLnBhdGhzW2tleV0gIT09IFwidW5kZWZpbmVkXCIgJiYgX3RoaXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciB2YWwgPSBfdGhpcy5wYXRoc1trZXldO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBfdGhpcy5wYXRoc1trZXldO1xuICAgICAgICAgICAgICAgIF90aGlzLmxlbmd0aC0tO1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaGFzID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBfdGhpcy5wYXRoc1trZXldICE9PSAndW5kZWZpbmVkJztcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5mb3JFYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gX3RoaXMucGF0aHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMucGF0aHMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhrZXksIF90aGlzLnBhdGhzW2tleV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBuZXdJbnN0YW5jZSA9IG9iamVjdEFzc2lnbih7fSwgX3RoaXMucGF0aHMpO1xuICAgICAgICAgICAgdmFyIGNsb25lID0gbmV3IENhY2hlTWFwKCk7XG4gICAgICAgICAgICBjbG9uZS5wYXRocyA9IG5ld0luc3RhbmNlO1xuICAgICAgICAgICAgY2xvbmUubGVuZ3RoID0gX3RoaXMubGVuZ3RoO1xuICAgICAgICAgICAgcmV0dXJuIGNsb25lO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBDYWNoZU1hcC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnBhdGhzW2tleV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMubGVuZ3RoKys7XG4gICAgICAgICAgICB0aGlzLnBhdGhzW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGF0aHNba2V5XSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICBDYWNoZU1hcC5wcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGVuZ3RoO1xuICAgIH07XG4gICAgcmV0dXJuIENhY2hlTWFwO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IENhY2hlTWFwO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2FjaGVNYXAudHMiLCIndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuLi9+L29iamVjdC1hc3NpZ24vaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbmV4cG9ydHMuZ2V0Q2FsbFN0YXRzID0gZnVuY3Rpb24gKHN1Y2Nlc3MsIGluc3RhbmNlKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHJlc3VsdC5zdWNjZXNzID0gc3VjY2VzcztcbiAgICByZXN1bHQubm9kZUlkID0gZXhwb3J0cy5ub2RlKGluc3RhbmNlKTtcbiAgICByZXN1bHQubGVuZ3RoID0gbGVuZ3RoKGluc3RhbmNlKTtcbiAgICByZXN1bHQubmFtZSA9IGluc3RhbmNlLm5hbWU7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5leHBvcnRzLm5vZGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIG5vZGVJZCkge1xuICAgIGlmICh0eXBlb2Ygbm9kZUlkID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHZhciBjdXJyZW50Tm9kZSA9IGdldEN1cnJlbnROb2RlKGluc3RhbmNlKTtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnROb2RlID8gY3VycmVudE5vZGUuaWQgOiAtMTtcbiAgICB9XG4gICAgaWYgKCF1dGlsXzEuaXNOdW1iZXIobm9kZUlkKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVGhlIG5vZGUgaWQgbXVzdCBiZSBhIG51bWJlci5cIik7XG4gICAgfVxuICAgIHZhciBjYWNoZU5vZGUgPSBnZXRSZXBvTm9kZShub2RlSWQsIGluc3RhbmNlKTtcbiAgICBpZiAoIWNhY2hlTm9kZSkge1xuICAgICAgICByZXR1cm4gZXhwb3J0cy5nZXRDYWxsU3RhdHMoZmFsc2UsIGluc3RhbmNlKTtcbiAgICB9XG4gICAgaW5zdGFuY2UudGhyZWFkLmN1cnJlbnQgPSBiaW5hcnlJbmRleE9mKGluc3RhbmNlLnRocmVhZC5ub2Rlcywgbm9kZUlkKTtcbiAgICByZXR1cm4gZXhwb3J0cy5nZXRDYWxsU3RhdHModHJ1ZSwgaW5zdGFuY2UpO1xufTtcbmZ1bmN0aW9uIGdldEN1cnJlbnROb2RlKGluc3RhbmNlKSB7XG4gICAgdmFyIGN1cnJlbnROb2RlSWQgPSBpbnN0YW5jZS50aHJlYWQubm9kZXNbaW5zdGFuY2UudGhyZWFkLmN1cnJlbnRdO1xuICAgIHJldHVybiBjdXJyZW50Tm9kZUlkID49IDAgPyBnZXRSZXBvTm9kZShjdXJyZW50Tm9kZUlkLCBpbnN0YW5jZSkgOiB1bmRlZmluZWQ7XG59XG5leHBvcnRzLmdldEN1cnJlbnROb2RlID0gZ2V0Q3VycmVudE5vZGU7XG5mdW5jdGlvbiBnZXRSZXBvTm9kZShjYWNoZU5vZGVJZCwgaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gaW5zdGFuY2UucmVwby5nZXQoY2FjaGVOb2RlSWQpO1xufVxuZXhwb3J0cy5nZXRSZXBvTm9kZSA9IGdldFJlcG9Ob2RlO1xudmFyIGxlbmd0aCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIHJldHVybiBpbnN0YW5jZS50aHJlYWQubm9kZXMubGVuZ3RoO1xufTtcbmZ1bmN0aW9uIGJpbmFyeUluZGV4T2YoYXJyYXksIHNlYXJjaEVsZW1lbnQpIHtcbiAgICB2YXIgbWluSW5kZXggPSAwO1xuICAgIHZhciBtYXhJbmRleCA9IGFycmF5Lmxlbmd0aCAtIDE7XG4gICAgdmFyIGN1cnJlbnRJbmRleDtcbiAgICB2YXIgY3VycmVudEVsZW1lbnQ7XG4gICAgd2hpbGUgKG1pbkluZGV4IDw9IG1heEluZGV4KSB7XG4gICAgICAgIGN1cnJlbnRJbmRleCA9IChtaW5JbmRleCArIG1heEluZGV4KSAvIDIgfCAwO1xuICAgICAgICBjdXJyZW50RWxlbWVudCA9IGFycmF5W2N1cnJlbnRJbmRleF07XG4gICAgICAgIGlmIChjdXJyZW50RWxlbWVudCA8IHNlYXJjaEVsZW1lbnQpIHtcbiAgICAgICAgICAgIG1pbkluZGV4ID0gY3VycmVudEluZGV4ICsgMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjdXJyZW50RWxlbWVudCA+IHNlYXJjaEVsZW1lbnQpIHtcbiAgICAgICAgICAgIG1heEluZGV4ID0gY3VycmVudEluZGV4IC0gMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50SW5kZXg7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9sb2NhdGUudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBjYWNoZV8xID0gcmVxdWlyZShcIi4vY2FjaGVcIik7XG52YXIgQ2FjaGVOb2RlXzEgPSByZXF1aXJlKFwiLi9DYWNoZU5vZGVcIik7XG52YXIgbG9jYXRlXzEgPSByZXF1aXJlKFwiLi9sb2NhdGVcIik7XG52YXIgb2JqZWN0QXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciBfaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuZnVuY3Rpb24gaXNOdW1iZXIodmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyB8fCB0b1N0cmluZyh2YWx1ZSkgPT09IFwiW29iamVjdCBOdW1iZXJdXCI7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5mdW5jdGlvbiBpc1N0cmluZyhvYmopIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ3N0cmluZycgfHwgdG9TdHJpbmcob2JqKSA9PT0gXCJbb2JqZWN0IFN0cmluZ11cIjtcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcbmZ1bmN0aW9uIGlzT2JqZWN0KG1peGVkX3Zhcikge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobWl4ZWRfdmFyKSA9PT0gJ1tvYmplY3QgQXJyYXldJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBtaXhlZF92YXIgIT09IG51bGwgJiYgdHlwZW9mIG1peGVkX3ZhciA9PT0gJ29iamVjdCc7XG59XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5mdW5jdGlvbiBpc0FycmF5KHZhbHVlKSB7XG4gICAgaWYgKCF2YWx1ZSB8fCB2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKSB8fCAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0J1xuICAgICAgICAmJiB0eXBlb2YgdmFsdWUubGVuZ3RoID09PSAnbnVtYmVyJ1xuICAgICAgICAmJiB0eXBlb2YgdmFsdWUuc3BsaWNlID09PSAnZnVuY3Rpb24nXG4gICAgICAgICYmICEodmFsdWUucHJvcGVydHlJc0VudW1lcmFibGUoJ2xlbmd0aCcpKSk7XG59XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuZnVuY3Rpb24gb2JqVG9TdHIobykge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59XG5mdW5jdGlvbiBpc0RhdGUodmFsdWUpIHtcbiAgICByZXR1cm4gaXNPYmplY3QodmFsdWUpICYmIG9ialRvU3RyKHZhbHVlKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG5mdW5jdGlvbiBpc0VtcHR5KHZhbHVlKSB7XG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSBpZiAoIWlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICBmb3IgKHZhciBpIGluIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoX2hhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5leHBvcnRzLmlzRW1wdHkgPSBpc0VtcHR5O1xuZnVuY3Rpb24gZ2V0TmV3Q2FjaGVOb2RlKGluc3RhbmNlKSB7XG4gICAgdmFyIG5vZGUgPSBuZXcgQ2FjaGVOb2RlXzEuQ2FjaGVOb2RlKGluc3RhbmNlLm5leHROb2RlS2V5KTtcbiAgICBub2RlLmlkID0gaW5zdGFuY2UubmV4dE5vZGVLZXk7XG4gICAgaW5zdGFuY2UubmV4dE5vZGVLZXkgKz0gMTtcbiAgICBpbnN0YW5jZS5yZXBvLmFkZChub2RlKTtcbiAgICByZXR1cm4gbm9kZTtcbn1cbmV4cG9ydHMuZ2V0TmV3Q2FjaGVOb2RlID0gZ2V0TmV3Q2FjaGVOb2RlO1xuZnVuY3Rpb24gaGFzVWlkKG9iaikge1xuICAgIGlmICghb2JqKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCFpc09iamVjdChvYmopKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBvYmpbY2FjaGVfMS5jb25maWcudWlkTmFtZV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgdWlkID0gb2JqW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgIHJldHVybiB1aWQubGVuZ3RoICE9PSAwO1xufVxuZXhwb3J0cy5oYXNVaWQgPSBoYXNVaWQ7XG47XG5mdW5jdGlvbiBkZWVwQ2xvbmUob2JqLCB1aWRSZWZlcmVuY2UsIGZyZWV6ZSkge1xuICAgIGlmIChmcmVlemUgPT09IHZvaWQgMCkgeyBmcmVlemUgPSB0cnVlOyB9XG4gICAgaWYgKCFvYmogfHwgKCFpc09iamVjdChvYmopICYmICFpc0FycmF5KG9iaikpKSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICAgIGlmIChmcmVlemUgPT09IHRydWUgJiYgdWlkUmVmZXJlbmNlICYmICFPYmplY3QuaXNGcm96ZW4odWlkUmVmZXJlbmNlKSkge1xuICAgICAgICBPYmplY3QuZnJlZXplKHVpZFJlZmVyZW5jZSk7XG4gICAgfVxuICAgIGlmICh1aWRSZWZlcmVuY2UgJiYgaGFzVWlkKG9iaikgJiYgb2JqW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdID09PSB1aWRSZWZlcmVuY2VbY2FjaGVfMS5jb25maWcudWlkTmFtZV0pIHtcbiAgICAgICAgcmV0dXJuIHVpZFJlZmVyZW5jZTtcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9IG9iamVjdEFzc2lnbih7fSwgb2JqKTtcbiAgICBmb3IgKHZhciBwcm9wTmFtZSBpbiBvYmopIHtcbiAgICAgICAgdmFyIHZhbHVlID0gb2JqW3Byb3BOYW1lXTtcbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbcHJvcE5hbWVdID0gZGVlcENsb25lQXJyYXkodmFsdWUsIHVpZFJlZmVyZW5jZSwgZnJlZXplKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHZhbHVlLmdldFRpbWUoKSk7XG4gICAgICAgICAgICAgICAgaWYgKGZyZWV6ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZnJlZXplKGRhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXN1bHRbcHJvcE5hbWVdID0gZGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGlmIChoYXNVaWQodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtwcm9wTmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVpZFJlZmVyZW5jZSAmJiBoYXNVaWQodWlkUmVmZXJlbmNlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlICE9PSB1aWRSZWZlcmVuY2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB2YWx1ZS51aWQgPT09IHVpZFJlZmVyZW5jZS51aWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB2YWx1ZSAhPT0gdWlkUmVmZXJlbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W3Byb3BOYW1lXSA9IHVpZFJlZmVyZW5jZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W3Byb3BOYW1lXSA9IGRlZXBDbG9uZSh2YWx1ZSwgdWlkUmVmZXJlbmNlLCBmcmVlemUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtwcm9wTmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoZnJlZXplID09PSB0cnVlICYmICFPYmplY3QuaXNGcm96ZW4ocmVzdWx0KSkge1xuICAgICAgICBPYmplY3QuZnJlZXplKHJlc3VsdCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5leHBvcnRzLmRlZXBDbG9uZSA9IGRlZXBDbG9uZTtcbmZ1bmN0aW9uIGRlZXBDbG9uZUFycmF5KGFyciwgdWlkUmVmZXJlbmNlLCBmcmVlemUpIHtcbiAgICByZXR1cm4gYXJyLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICBpZiAoaXNBcnJheShpdGVtKSkge1xuICAgICAgICAgICAgcmV0dXJuIGRlZXBDbG9uZUFycmF5KGl0ZW0sIHVpZFJlZmVyZW5jZSwgZnJlZXplKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpc09iamVjdChpdGVtKSkge1xuICAgICAgICAgICAgaWYgKGhhc1VpZChpdGVtKSkge1xuICAgICAgICAgICAgICAgIGlmICh1aWRSZWZlcmVuY2UgJiYgKGl0ZW1bY2FjaGVfMS5jb25maWcudWlkTmFtZV0gPT09IHVpZFJlZmVyZW5jZVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVpZFJlZmVyZW5jZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVlcENsb25lKGl0ZW0sIHVpZFJlZmVyZW5jZSwgZnJlZXplKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5leHBvcnRzLmNhY2hlU2l6ZSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIHZhciBjYWNoZU5vZGUgPSBsb2NhdGVfMS5nZXRDdXJyZW50Tm9kZShpbnN0YW5jZSk7XG4gICAgcmV0dXJuIGNhY2hlTm9kZSA/IGNhY2hlTm9kZS5pdGVtcy5zaXplKCkgOiAwO1xufTtcbmV4cG9ydHMuY2FjaGVMZW5ndGggPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gaW5zdGFuY2UudGhyZWFkLm5vZGVzLmxlbmd0aDtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi91dGlsLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQ2FjaGVNYXBfMSA9IHJlcXVpcmUoXCIuL0NhY2hlTWFwXCIpO1xudmFyIENhY2hlTm9kZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2FjaGVOb2RlKG5vZGVJZCkge1xuICAgICAgICB0aGlzLml0ZW1zID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmlkID0gbm9kZUlkO1xuICAgIH1cbiAgICByZXR1cm4gQ2FjaGVOb2RlO1xufSgpKTtcbmV4cG9ydHMuQ2FjaGVOb2RlID0gQ2FjaGVOb2RlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2FjaGVOb2RlLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgZmx1c2hfMSA9IHJlcXVpcmUoXCIuL2ZsdXNoXCIpO1xudmFyIGNhY2hlXzEgPSByZXF1aXJlKFwiLi9jYWNoZVwiKTtcbnZhciBvcGF0aCA9IHJlcXVpcmUoXCIuL3BhdGhcIik7XG52YXIgZ2V0XzEgPSByZXF1aXJlKFwiLi9nZXRcIik7XG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbmV4cG9ydHMuYXNzaWduUmVmVG9QYXJlbnQgPSBmdW5jdGlvbiAocmVmSXRlbSwgZmx1c2hBcmdzKSB7XG4gICAgaWYgKGZsdXNoQXJncy5wYXJlbnRVaWQpIHtcbiAgICAgICAgdmFyIHBhcmVudEl0ZW0gPSBmbHVzaF8xLmdldEl0ZW1GbHVzaE9yQ2FjaGVkKGZsdXNoQXJncy5wYXJlbnRVaWQsIGZsdXNoQXJncyk7XG4gICAgICAgIGlmIChwYXJlbnRJdGVtICYmIGZsdXNoQXJncy5yZWZQYXRoKSB7XG4gICAgICAgICAgICBhc3NpZ25SZWZzKHBhcmVudEl0ZW0sIHJlZkl0ZW0sIGZsdXNoQXJncy5yZWZQYXRoKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG52YXIgYXNzaWduUmVmcyA9IGZ1bmN0aW9uIChwYXJlbnRJdGVtLCByZWZJdGVtLCByZWZQYXRoKSB7XG4gICAgdmFyIHBhcmVudFVpZCA9IHBhcmVudEl0ZW0uZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgIHZhciByZWZVaWQgPSByZWZJdGVtLmVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXTtcbiAgICBhZGRSZWZUbyhwYXJlbnRJdGVtLCByZWZVaWQsIHJlZlBhdGgpO1xuICAgIGFkZFJlZkZyb20ocmVmSXRlbSwgcGFyZW50VWlkLCByZWZQYXRoKTtcbn07XG52YXIgYWRkUmVmVG8gPSBmdW5jdGlvbiAocGFyZW50SXRlbSwgcmVmVWlkLCBwYXRoKSB7XG4gICAgaWYgKHBhcmVudEl0ZW0ubWFwVG8uaGFzKHJlZlVpZCkgPT09IGZhbHNlKSB7XG4gICAgICAgIHBhcmVudEl0ZW0ubWFwVG8uc2V0KHJlZlVpZCwgW10pO1xuICAgIH1cbiAgICB2YXIgcmVmQXJyYXkgPSBwYXJlbnRJdGVtLm1hcFRvLmdldChyZWZVaWQpO1xuICAgIGlmIChyZWZBcnJheS5pbmRleE9mKHBhdGgpIDwgMCkge1xuICAgICAgICByZWZBcnJheS5wdXNoKHBhdGgpO1xuICAgIH1cbiAgICByZXR1cm4gcGFyZW50SXRlbTtcbn07XG52YXIgYWRkUmVmRnJvbSA9IGZ1bmN0aW9uIChyZWZJdGVtLCBwYXJlbnRVaWQsIHBhdGgpIHtcbiAgICBpZiAocmVmSXRlbS5tYXBGcm9tLmhhcyhwYXJlbnRVaWQpID09PSBmYWxzZSkge1xuICAgICAgICByZWZJdGVtLm1hcEZyb20uc2V0KHBhcmVudFVpZCwgW10pO1xuICAgIH1cbiAgICB2YXIgZnJvbUFycmF5ID0gcmVmSXRlbS5tYXBGcm9tLmdldChwYXJlbnRVaWQpO1xuICAgIGlmIChmcm9tQXJyYXkuaW5kZXhPZihwYXRoKSA8IDApIHtcbiAgICAgICAgZnJvbUFycmF5LnB1c2gocGF0aCk7XG4gICAgfVxuICAgIHJldHVybiByZWZJdGVtO1xufTtcbmV4cG9ydHMudXBkYXRlUG9pbnRlcnMgPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgZmx1c2hBcmdzLmZsdXNoTWFwLmZvckVhY2goZnVuY3Rpb24gKGtleSwgaXRlbSkge1xuICAgICAgICB1cGRhdGVJdGVtUmVmVG9zKGl0ZW0sIGZsdXNoQXJncyk7XG4gICAgICAgIGV4cG9ydHMudXBkYXRlUmVmRnJvbXMoaXRlbSwgZmx1c2hBcmdzKTtcbiAgICB9KTtcbn07XG5leHBvcnRzLnVwZGF0ZVJlZkZyb21zID0gZnVuY3Rpb24gKGl0ZW0sIGZsdXNoQXJncykge1xuICAgIGl0ZW0ubWFwRnJvbS5mb3JFYWNoKGZ1bmN0aW9uIChwYXJlbnRVaWQsIHBhdGhzKSB7XG4gICAgICAgIHZhciBwYXJlbnRJdGVtID0gZmx1c2hBcmdzLmZsdXNoTWFwLmdldChwYXJlbnRVaWQpO1xuICAgICAgICBpZiAoIXBhcmVudEl0ZW0pIHtcbiAgICAgICAgICAgIHBhcmVudEl0ZW0gPSBnZXRfMS5nZXRDYWNoZWRJdGVtKHBhcmVudFVpZCwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyZW50SXRlbSAmJiBwYXRocy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgZmlyc3RQYXRoID0gcGF0aHNbMF07XG4gICAgICAgICAgICB2YXIgdGFyZ2V0UmVmID0gb3BhdGguZ2V0KHBhcmVudEl0ZW0uZW50aXR5LCBmaXJzdFBhdGgpO1xuICAgICAgICAgICAgdmFyIGRpcnR5ID0gKHRhcmdldFJlZiAmJiB0YXJnZXRSZWYgIT09IGl0ZW0uZW50aXR5KTtcbiAgICAgICAgICAgIGlmIChkaXJ0eSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHZhciBhcmdzID0ge1xuICAgICAgICAgICAgICAgICAgICBlbnRpdHk6IHBhcmVudEl0ZW0uZW50aXR5LFxuICAgICAgICAgICAgICAgICAgICBmbHVzaE1hcDogZmx1c2hBcmdzLmZsdXNoTWFwLFxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZTogZmx1c2hBcmdzLmluc3RhbmNlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBwYXJlbnRJdGVtID0gZmx1c2hfMS5lbnN1cmVJdGVtKGFyZ3MpO1xuICAgICAgICAgICAgICAgIHBhcmVudEl0ZW0uZW50aXR5ID0gdXRpbF8xLmRlZXBDbG9uZShwYXJlbnRJdGVtLmVudGl0eSwgaXRlbS5lbnRpdHksIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59O1xuZXhwb3J0cy51cGRhdGVSZWZUb3MgPSBmdW5jdGlvbiAoZW50aXR5VWlkLCBmbHVzaEFyZ3MpIHtcbiAgICB2YXIgaXRlbSA9IGZsdXNoXzEuZ2V0SXRlbUZsdXNoT3JDYWNoZWQoZW50aXR5VWlkLCBmbHVzaEFyZ3MpO1xuICAgIHVwZGF0ZUl0ZW1SZWZUb3MoaXRlbSwgZmx1c2hBcmdzKTtcbn07XG52YXIgdXBkYXRlSXRlbVJlZlRvcyA9IGZ1bmN0aW9uIChpdGVtLCBmbHVzaEFyZ3MpIHtcbiAgICBpZiAoaXRlbSkge1xuICAgICAgICBpdGVtLm1hcFRvLmZvckVhY2goZnVuY3Rpb24gKHRvVWlkLCBwYXRocykge1xuICAgICAgICAgICAgdmFyIHVwZGF0ZWRQYXRocyA9IHBhdGhzLm1hcChmdW5jdGlvbiAocGF0aCkge1xuICAgICAgICAgICAgICAgIHZhciByZWZlcmVuY2UgPSBvcGF0aC5nZXQoaXRlbS5lbnRpdHksIHBhdGgpO1xuICAgICAgICAgICAgICAgIGlmIChyZWZlcmVuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhcmdldFVpZCA9IHJlZmVyZW5jZVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldFVpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZvdW5kID0gdGFyZ2V0VWlkID09IHRvVWlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvdW5kID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVtb3ZlUmVmRnJvbV9WYWx1ZShpdGVtLmVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSwgdG9VaWQsIGZsdXNoQXJncyk7XG4gICAgICAgICAgICB9KS5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbSAhPT0gbnVsbCAmJiBpdGVtICE9PSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICh1cGRhdGVkUGF0aHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGl0ZW0ubWFwVG8uc2V0KHRvVWlkLCB1cGRhdGVkUGF0aHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaXRlbS5tYXBUby5kZWxldGUodG9VaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59O1xudmFyIHJlbW92ZVJlZkZyb21fVmFsdWUgPSBmdW5jdGlvbiAocGFyZW50VWlkLCByZWZVaWQsIGZsdXNoQXJncykge1xuICAgIHZhciByZWZJdGVtID0gZmx1c2hfMS5nZXRJdGVtRmx1c2hPckNhY2hlZChyZWZVaWQsIGZsdXNoQXJncyk7XG4gICAgaWYgKHJlZkl0ZW0pIHtcbiAgICAgICAgcmVmSXRlbSA9IHJlZkl0ZW0uY2xvbmUoKTtcbiAgICAgICAgaWYgKHJlZkl0ZW0ubWFwRnJvbS5oYXMocGFyZW50VWlkKSkge1xuICAgICAgICAgICAgcmVtb3ZlUmVmRnJvbShyZWZJdGVtLCBwYXJlbnRVaWQsIGZsdXNoQXJncy5yZWZQYXRoKTtcbiAgICAgICAgICAgIGlmIChyZWZJdGVtLm1hcEZyb20uc2l6ZSgpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgZmx1c2hBcmdzLmV2aWN0TWFwLnNldChyZWZVaWQsIHJlZkl0ZW0pO1xuICAgICAgICAgICAgICAgIGZsdXNoQXJncy5mbHVzaE1hcC5kZWxldGUocmVmVWlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGZsdXNoQXJncy5mbHVzaE1hcC5zZXQocmVmVWlkLCByZWZJdGVtKTtcbiAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZXZpY3RNYXAuZGVsZXRlKHJlZlVpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xudmFyIHJlbW92ZVJlZkZyb20gPSBmdW5jdGlvbiAoaXRlbSwgcGFyZW50VWlkLCBwYXRoKSB7XG4gICAgdmFyIHJlZnNBcnJheSA9IGl0ZW0ubWFwRnJvbS5nZXQocGFyZW50VWlkKTtcbiAgICB2YXIgaW5kZXggPSByZWZzQXJyYXkuaW5kZXhPZihwYXRoKTtcbiAgICByZWZzQXJyYXkgPSByZWZzQXJyYXkuc2xpY2UoKTtcbiAgICByZWZzQXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcbiAgICBpdGVtLm1hcEZyb20uc2V0KHBhcmVudFVpZCwgcmVmc0FycmF5KTtcbiAgICBpZiAocmVmc0FycmF5Lmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIGl0ZW0ubWFwRnJvbS5kZWxldGUocGFyZW50VWlkKTtcbiAgICB9XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcmVmLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgZ2V0XzEgPSByZXF1aXJlKFwiLi9nZXRcIik7XG52YXIgY2FjaGVfMSA9IHJlcXVpcmUoXCIuL2NhY2hlXCIpO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG52YXIgcGF0aF8xID0gcmVxdWlyZShcIi4vcGF0aFwiKTtcbnZhciBDYWNoZUl0ZW1fMSA9IHJlcXVpcmUoXCIuL0NhY2hlSXRlbVwiKTtcbnZhciBDYWNoZU1hcF8xID0gcmVxdWlyZShcIi4vQ2FjaGVNYXBcIik7XG52YXIgcmVmXzEgPSByZXF1aXJlKFwiLi9yZWZcIik7XG5leHBvcnRzLmJ1aWxkRmx1c2hNYXAgPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgaWYgKHV0aWxfMS5oYXNVaWQoZmx1c2hBcmdzLmVudGl0eSkpIHtcbiAgICAgICAgYnVpbGRFbnRpdHlGbHVzaE1hcChmbHVzaEFyZ3MpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKHV0aWxfMS5pc0FycmF5KGZsdXNoQXJncy5lbnRpdHkpKSB7XG4gICAgICAgICAgICBjYWNoZUFyclJlZnMoZmx1c2hBcmdzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlRW50aXR5UmVmcyhmbHVzaEFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxufTtcbnZhciBidWlsZEVudGl0eUZsdXNoTWFwID0gZnVuY3Rpb24gKGZsdXNoQXJncykge1xuICAgIGZsdXNoQXJncy5yZWZQYXRoID0gXCJcIjtcbiAgICBpZiAoaXNEaXJ0eShmbHVzaEFyZ3MpID09PSB0cnVlKSB7XG4gICAgICAgIGVuc3VyZU9uRmx1c2hNYXAoZmx1c2hBcmdzKTtcbiAgICAgICAgY2FjaGVFbnRpdHlSZWZzKGZsdXNoQXJncyk7XG4gICAgICAgIHJlZl8xLnVwZGF0ZVJlZlRvcyhTdHJpbmcoZmx1c2hBcmdzLmVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSksIGZsdXNoQXJncyk7XG4gICAgfVxufTtcbnZhciBlbnN1cmVPbkZsdXNoTWFwID0gZnVuY3Rpb24gKGZsdXNoQXJncykge1xuICAgIHZhciBlbnRpdHlVaWQgPSBTdHJpbmcoZmx1c2hBcmdzLmVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSk7XG4gICAgaWYgKGZsdXNoQXJncy5mbHVzaE1hcC5oYXMoZW50aXR5VWlkKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgZXhwb3J0cy5lbnN1cmVJdGVtKGZsdXNoQXJncyk7XG4gICAgICAgIGZsdXNoQXJncy5wYXJlbnRVaWQgPSBTdHJpbmcoZW50aXR5VWlkKTtcbiAgICB9XG59O1xudmFyIGNhY2hlRW50aXR5UmVmcyA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICB2YXIgcGFyZW50RW50aXR5ID0gZmx1c2hBcmdzLmVudGl0eTtcbiAgICBmb3IgKHZhciBwcm9wIGluIHBhcmVudEVudGl0eSkge1xuICAgICAgICBpZiAocGFyZW50RW50aXR5Lmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgICB2YXIgcmVmRW50aXR5ID0gcGFyZW50RW50aXR5W3Byb3BdO1xuICAgICAgICAgICAgaWYgKHV0aWxfMS5pc09iamVjdChyZWZFbnRpdHkpIHx8IHV0aWxfMS5pc0FycmF5KHJlZkVudGl0eSkpIHtcbiAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZW50aXR5ID0gcmVmRW50aXR5O1xuICAgICAgICAgICAgICAgIGlmIChwYXJlbnRFbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgZmx1c2hBcmdzLnBhcmVudFVpZCA9IHBhcmVudEVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGZsdXNoQXJncy5wYXJlbnRVaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZmx1c2hBcmdzLnJlZlBhdGggPSBwYXRoXzEuY29uY2F0UHJvcChmbHVzaEFyZ3MucmVmUGF0aCwgcHJvcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghZmx1c2hBcmdzLnJlZlBhdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgZmx1c2hBcmdzLnJlZlBhdGggPSBwcm9wO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh1dGlsXzEuaXNBcnJheShyZWZFbnRpdHkpKSB7XG4gICAgICAgICAgICAgICAgY2FjaGVBcnJSZWZzKGZsdXNoQXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh1dGlsXzEuaXNPYmplY3QocmVmRW50aXR5KSkge1xuICAgICAgICAgICAgICAgIGNhY2hlT2JqUmVmcyhmbHVzaEFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgT2JqZWN0LmZyZWV6ZShyZWZFbnRpdHkpO1xuICAgICAgICB9XG4gICAgfVxufTtcbnZhciBjYWNoZUFyclJlZnMgPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgdmFyIGVudGl0eSA9IGZsdXNoQXJncy5lbnRpdHk7XG4gICAgdmFyIGFycmF5UGF0aCA9IGZsdXNoQXJncy5yZWZQYXRoO1xuICAgIHZhciBhcnJheVVpZDtcbiAgICBpZiAoIWFycmF5VWlkKSB7XG4gICAgICAgIGFycmF5VWlkID0gZmx1c2hBcmdzLnBhcmVudFVpZDtcbiAgICB9XG4gICAgZW50aXR5LmZvckVhY2goZnVuY3Rpb24gKG5leHQsIGluZGV4KSB7XG4gICAgICAgIGZsdXNoQXJncy5lbnRpdHkgPSBuZXh0O1xuICAgICAgICBmbHVzaEFyZ3MucGFyZW50VWlkID0gYXJyYXlVaWQ7XG4gICAgICAgIGlmIChmbHVzaEFyZ3MucmVmUGF0aCB8fCBhcnJheVBhdGgpIHtcbiAgICAgICAgICAgIGZsdXNoQXJncy5yZWZQYXRoID0gYXJyYXlQYXRoICsgXCIuXCIgKyBpbmRleDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXRpbF8xLmlzQXJyYXkobmV4dCkpIHtcbiAgICAgICAgICAgIGNhY2hlQXJyUmVmcyhmbHVzaEFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHV0aWxfMS5pc09iamVjdChuZXh0KSkge1xuICAgICAgICAgICAgY2FjaGVPYmpSZWZzKGZsdXNoQXJncyk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBPYmplY3QuZnJlZXplKGVudGl0eSk7XG59O1xudmFyIGNhY2hlT2JqUmVmcyA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICBpZiAodXRpbF8xLmhhc1VpZChmbHVzaEFyZ3MuZW50aXR5KSkge1xuICAgICAgICBjYWNoZVVpZE9ialJlZnMoZmx1c2hBcmdzKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNhY2hlRW50aXR5UmVmcyhmbHVzaEFyZ3MpO1xuICAgIH1cbn07XG52YXIgY2FjaGVVaWRPYmpSZWZzID0gZnVuY3Rpb24gKGZsdXNoQXJncykge1xuICAgIHZhciByZWZJdGVtID0gZXhwb3J0cy5lbnN1cmVJdGVtKGZsdXNoQXJncyk7XG4gICAgcmVmXzEuYXNzaWduUmVmVG9QYXJlbnQocmVmSXRlbSwgZmx1c2hBcmdzKTtcbiAgICBpZiAoZ2V0XzEuaXNPbkNhY2hlKGZsdXNoQXJncykgPT09IHRydWUpXG4gICAgICAgIHJldHVybjtcbiAgICBleHBvcnRzLmJ1aWxkRmx1c2hNYXAoZmx1c2hBcmdzKTtcbn07XG52YXIgaXNEaXJ0eSA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICB2YXIgY2FjaGVkSXRlbSA9IGdldF8xLmdldENhY2hlZEl0ZW0oZmx1c2hBcmdzLmVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICByZXR1cm4gIWNhY2hlZEl0ZW0gfHwgY2FjaGVkSXRlbS5lbnRpdHkgIT09IGZsdXNoQXJncy5lbnRpdHk7XG59O1xuZXhwb3J0cy5nZXRJdGVtRmx1c2hPckNhY2hlZCA9IGZ1bmN0aW9uICh1aWQsIGZsdXNoQXJncykge1xuICAgIGlmICh1aWQpIHtcbiAgICAgICAgdWlkID0gU3RyaW5nKHVpZCk7XG4gICAgICAgIHZhciBpdGVtID0gZmx1c2hBcmdzLmZsdXNoTWFwLmdldCh1aWQpO1xuICAgICAgICBpZiAoIWl0ZW0pIHtcbiAgICAgICAgICAgIGl0ZW0gPSBnZXRfMS5nZXRDYWNoZWRJdGVtKHVpZCwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXRlbSAmJiBPYmplY3QuaXNGcm96ZW4oaXRlbSkpIHtcbiAgICAgICAgICAgIGl0ZW0gPSBpdGVtLmNsb25lKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxufTtcbmV4cG9ydHMuZW5zdXJlSXRlbSA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICB2YXIgaXRlbVVpZCA9IFN0cmluZyhmbHVzaEFyZ3MuZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdKTtcbiAgICB2YXIgaXRlbSA9IGZsdXNoQXJncy5mbHVzaE1hcC5nZXQoaXRlbVVpZCk7XG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxuICAgIHZhciBsaXZlID0gZ2V0XzEuZ2V0Q2FjaGVkSXRlbShpdGVtVWlkLCBmbHVzaEFyZ3MuaW5zdGFuY2UpO1xuICAgIGl0ZW0gPSBuZXcgQ2FjaGVJdGVtXzEuZGVmYXVsdChmbHVzaEFyZ3MuZW50aXR5LCBsaXZlKTtcbiAgICBmbHVzaEFyZ3MuZmx1c2hNYXAuc2V0KGl0ZW1VaWQsIGl0ZW0pO1xuICAgIGZsdXNoQXJncy5mbHVzaE1hcFsnX19VUERBVEVEX18nXSA9IHRydWU7XG4gICAgcmV0dXJuIGl0ZW07XG59O1xuZXhwb3J0cy5wcmVGbHVzaCA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICB2YXIgdGVtcCA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICB2YXIgY3VycmVudFN0YWNrID0gZ2V0XzEuZ2V0Q2FjaGVDdXJyZW50U3RhY2soZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICBpZiAoY3VycmVudFN0YWNrKSB7XG4gICAgICAgIGN1cnJlbnRTdGFjay5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIGl0ZW0pIHtcbiAgICAgICAgICAgIHRlbXAuc2V0KGtleSwgaXRlbSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmbHVzaEFyZ3MuZmx1c2hNYXAuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgIHZhciBpdGVtVWlkID0gaXRlbS5lbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV07XG4gICAgICAgIGZyZWV6ZUl0ZW0oaXRlbSk7XG4gICAgICAgIHRlbXAuc2V0KFN0cmluZyhpdGVtVWlkKSwgaXRlbSk7XG4gICAgfSk7XG4gICAgaWYgKGZsdXNoQXJncy5ldmljdE1hcC5zaXplKCkgPiAwKSB7XG4gICAgICAgIGZsdXNoQXJncy5ldmljdE1hcC5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICB0ZW1wLmRlbGV0ZShTdHJpbmcoa2V5KSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBleHBvcnRzLmZsdXNoKHRlbXAsIGZsdXNoQXJncy5pbnN0YW5jZSk7XG59O1xudmFyIGZyZWV6ZUl0ZW0gPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgIE9iamVjdC5mcmVlemUoaXRlbSk7XG4gICAgT2JqZWN0LmZyZWV6ZShpdGVtLmVudGl0eSk7XG4gICAgT2JqZWN0LmZyZWV6ZShpdGVtLm1hcFRvKTtcbiAgICBPYmplY3QuZnJlZXplKGl0ZW0ubWFwRnJvbSk7XG59O1xuZXhwb3J0cy5mbHVzaCA9IGZ1bmN0aW9uICh0ZW1wLCBpbnN0YW5jZSkge1xuICAgIGlmICh0ZW1wICE9PSBudWxsKSB7XG4gICAgICAgIE9iamVjdC5mcmVlemUodGVtcCk7XG4gICAgICAgIHZhciBjYWNoZU5vZGUgPSB1dGlsXzEuZ2V0TmV3Q2FjaGVOb2RlKGluc3RhbmNlKTtcbiAgICAgICAgY2FjaGVOb2RlLml0ZW1zID0gdGVtcDtcbiAgICAgICAgaWYgKGluc3RhbmNlLnRocmVhZC5ub2Rlcy5pbmRleE9mKGNhY2hlTm9kZS5pZCkgPCAwKSB7XG4gICAgICAgICAgICBpbnN0YW5jZS50aHJlYWQubm9kZXMucHVzaChjYWNoZU5vZGUuaWQpO1xuICAgICAgICAgICAgaW5zdGFuY2UudGhyZWFkLmN1cnJlbnQgKz0gMTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9mbHVzaC50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIGNhY2hlXzEgPSByZXF1aXJlKFwiLi9jYWNoZVwiKTtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xuZXhwb3J0cy5nZXRJdGVtID0gZnVuY3Rpb24gKGVudGl0eSwgaW5zdGFuY2UsIG5vZGVJZCkge1xuICAgIGlmICghZW50aXR5KSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPbmUgZ2V0KCk6IHJlcXVpcmVzIGEgdWlkIHRvIHJldHJpZXZlIGFuIGl0ZW0gZnJvbSB0aGUgY2FjaGUuXCIpO1xuICAgIH1cbiAgICBpZiAodXRpbF8xLmlzQXJyYXkoZW50aXR5KSkge1xuICAgICAgICByZXR1cm4gZW50aXR5Lm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIGdldE9iamVjdChpdGVtLCBpbnN0YW5jZSk7XG4gICAgICAgIH0pLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW0gIT09IG51bGwgJiYgaXRlbSAhPT0gdW5kZWZpbmVkO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGdldE9iamVjdChlbnRpdHksIGluc3RhbmNlKTtcbn07XG52YXIgZ2V0T2JqZWN0ID0gZnVuY3Rpb24gKHVpZE9yRW50aXR5LCBpbnN0YW5jZSkge1xuICAgIHZhciByZWFsVWlkID0gZ2V0QWN0dWFsVWlkKHVpZE9yRW50aXR5KTtcbiAgICBpZiAoIXJlYWxVaWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgaXRlbSA9IGV4cG9ydHMuZ2V0Q2FjaGVkSXRlbShyZWFsVWlkLCBpbnN0YW5jZSk7XG4gICAgcmV0dXJuIGl0ZW0gPyBpdGVtLmVudGl0eSA6IHVuZGVmaW5lZDtcbn07XG5leHBvcnRzLmdldEVkaXRJdGVtID0gZnVuY3Rpb24gKG9iaiwgaW5zdGFuY2UsIG5vZGVJZCkge1xuICAgIGlmICh1dGlsXzEuaXNBcnJheShvYmopKSB7XG4gICAgICAgIHJldHVybiBvYmoubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0RWRpdGFibGVPYmplY3QoaXRlbSwgaW5zdGFuY2UpO1xuICAgICAgICB9KS5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtICE9PSBudWxsICYmIGl0ZW0gIT09IHVuZGVmaW5lZDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBnZXRFZGl0YWJsZU9iamVjdChvYmosIGluc3RhbmNlKTtcbn07XG52YXIgZ2V0RWRpdGFibGVPYmplY3QgPSBmdW5jdGlvbiAodWlkT3JFbnRpdHksIGluc3RhbmNlKSB7XG4gICAgdmFyIHJlYWxVaWQgPSBnZXRBY3R1YWxVaWQodWlkT3JFbnRpdHkpO1xuICAgIHZhciBleGlzdGluZyA9IGV4cG9ydHMuZ2V0SXRlbShyZWFsVWlkLCBpbnN0YW5jZSk7XG4gICAgcmV0dXJuIGV4aXN0aW5nID8gdXRpbF8xLmRlZXBDbG9uZShleGlzdGluZywgdW5kZWZpbmVkLCBmYWxzZSkgOiB1bmRlZmluZWQ7XG59O1xudmFyIGdldEFjdHVhbFVpZCA9IGZ1bmN0aW9uICh1aWRPckVudGl0eSkge1xuICAgIGlmICh0eXBlb2YgdWlkT3JFbnRpdHkgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgcmV0dXJuIHVpZE9yRW50aXR5O1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgdWlkT3JFbnRpdHkgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZyh1aWRPckVudGl0eSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHV0aWxfMS5pc09iamVjdCh1aWRPckVudGl0eSkpIHtcbiAgICAgICAgaWYgKHV0aWxfMS5oYXNVaWQodWlkT3JFbnRpdHkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdWlkT3JFbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV07XG4gICAgICAgIH1cbiAgICB9XG59O1xuZXhwb3J0cy5pc09uQ2FjaGUgPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgdmFyIHVpZCA9IGZsdXNoQXJncy5lbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV07XG4gICAgdmFyIGV4aXN0aW5nSXRlbSA9IGV4cG9ydHMuZ2V0Q2FjaGVkSXRlbSh1aWQsIGZsdXNoQXJncy5pbnN0YW5jZSk7XG4gICAgcmV0dXJuIGV4aXN0aW5nSXRlbSAmJiBleGlzdGluZ0l0ZW0uZW50aXR5ID09PSBmbHVzaEFyZ3MuZW50aXR5O1xufTtcbmV4cG9ydHMuZ2V0Q2FjaGVkSXRlbSA9IGZ1bmN0aW9uICh1aWQsIGluc3RhbmNlKSB7XG4gICAgdmFyIGN1cnJlbnROb2RlID0gZ2V0Q3VycmVudE5vZGUoaW5zdGFuY2UpO1xuICAgIHJldHVybiBjdXJyZW50Tm9kZSA/IGN1cnJlbnROb2RlLml0ZW1zLmdldChTdHJpbmcodWlkKSkgOiB1bmRlZmluZWQ7XG59O1xuZnVuY3Rpb24gZ2V0Q3VycmVudE5vZGUoaW5zdGFuY2UpIHtcbiAgICB2YXIgY3VycmVudE5vZGVJZCA9IGluc3RhbmNlLnRocmVhZC5ub2Rlc1tpbnN0YW5jZS50aHJlYWQuY3VycmVudF07XG4gICAgcmV0dXJuIGN1cnJlbnROb2RlSWQgPj0gMCA/IGdldFJlcG9Ob2RlKGN1cnJlbnROb2RlSWQsIGluc3RhbmNlLnJlcG8pIDogdW5kZWZpbmVkO1xufVxuZnVuY3Rpb24gZ2V0UmVwb05vZGUobm9kZUlkLCByZXBvKSB7XG4gICAgcmV0dXJuIHJlcG8uZ2V0KG5vZGVJZCk7XG59XG5leHBvcnRzLmdldENhY2hlQ3VycmVudFN0YWNrID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgdmFyIGN1cnJlbnROb2RlID0gZ2V0Q3VycmVudE5vZGUoaW5zdGFuY2UpO1xuICAgIHJldHVybiBjdXJyZW50Tm9kZSA/IGN1cnJlbnROb2RlLml0ZW1zIDogdW5kZWZpbmVkO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2dldC50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG5mdW5jdGlvbiBnZXRLZXkoa2V5KSB7XG4gICAgdmFyIGludEtleSA9IHBhcnNlSW50KGtleSk7XG4gICAgaWYgKGludEtleS50b1N0cmluZygpID09PSBrZXkpIHtcbiAgICAgICAgcmV0dXJuIGludEtleTtcbiAgICB9XG4gICAgcmV0dXJuIGtleTtcbn1cbmZ1bmN0aW9uIGRlbChvYmosIHBhdGgpIHtcbiAgICBpZiAodXRpbF8xLmlzTnVtYmVyKHBhdGgpKSB7XG4gICAgICAgIHBhdGggPSBbcGF0aF07XG4gICAgfVxuICAgIGlmICh1dGlsXzEuaXNFbXB0eShvYmopKSB7XG4gICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfVxuICAgIGlmICh1dGlsXzEuaXNFbXB0eShwYXRoKSkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBpZiAodXRpbF8xLmlzU3RyaW5nKHBhdGgpKSB7XG4gICAgICAgIHJldHVybiBkZWwob2JqLCBwYXRoLnNwbGl0KCcuJykpO1xuICAgIH1cbiAgICB2YXIgY3VycmVudFBhdGggPSBnZXRLZXkocGF0aFswXSk7XG4gICAgdmFyIG9sZFZhbCA9IG9ialtjdXJyZW50UGF0aF07XG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGlmIChvbGRWYWwgIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgaWYgKHV0aWxfMS5pc0FycmF5KG9iaikpIHtcbiAgICAgICAgICAgICAgICBvYmouc3BsaWNlKGN1cnJlbnRQYXRoLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBvYmpbY3VycmVudFBhdGhdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAob2JqW2N1cnJlbnRQYXRoXSAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVsKG9ialtjdXJyZW50UGF0aF0sIHBhdGguc2xpY2UoMSkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG59XG5leHBvcnRzLmRlbCA9IGRlbDtcbmZ1bmN0aW9uIGdldChvYmosIHBhdGgsIGRlZmF1bHRWYWx1ZSkge1xuICAgIGlmICh1dGlsXzEuaXNOdW1iZXIocGF0aCkpIHtcbiAgICAgICAgcGF0aCA9IFtwYXRoXTtcbiAgICB9XG4gICAgaWYgKHV0aWxfMS5pc0VtcHR5KHBhdGgpKSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICAgIGlmICh1dGlsXzEuaXNFbXB0eShvYmopKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgfVxuICAgIGlmICh1dGlsXzEuaXNTdHJpbmcocGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIGdldChvYmosIHBhdGguc3BsaXQoJy4nKSwgZGVmYXVsdFZhbHVlKTtcbiAgICB9XG4gICAgdmFyIGN1cnJlbnRQYXRoID0gZ2V0S2V5KHBhdGhbMF0pO1xuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBpZiAob2JqW2N1cnJlbnRQYXRoXSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmpbY3VycmVudFBhdGhdO1xuICAgIH1cbiAgICByZXR1cm4gZ2V0KG9ialtjdXJyZW50UGF0aF0sIHBhdGguc2xpY2UoMSksIGRlZmF1bHRWYWx1ZSk7XG59XG5leHBvcnRzLmdldCA9IGdldDtcbmV4cG9ydHMuY29uY2F0UHJvcCA9IGZ1bmN0aW9uIChwcm9wQ2hhaW4sIHByb3ApIHtcbiAgICBpZiAocHJvcENoYWluID09PSBcIlwiKSB7XG4gICAgICAgIHByb3BDaGFpbiA9IHByb3A7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBwcm9wQ2hhaW4gPSBwcm9wQ2hhaW4gKyBcIi5cIiArIHByb3A7XG4gICAgfVxuICAgIHJldHVybiBwcm9wQ2hhaW47XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcGF0aC50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIENhY2hlTWFwXzEgPSByZXF1aXJlKFwiLi9DYWNoZU1hcFwiKTtcbnZhciBDYWNoZUl0ZW0gPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENhY2hlSXRlbShlbnRpdHksIGxpdmVJdGVtKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuY2xvbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IENhY2hlSXRlbShfdGhpcy5lbnRpdHksIF90aGlzKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XG4gICAgICAgIGlmIChsaXZlSXRlbSkge1xuICAgICAgICAgICAgdGhpcy5tYXBGcm9tID0gbGl2ZUl0ZW0ubWFwRnJvbS5jbG9uZSgpO1xuICAgICAgICAgICAgdGhpcy5tYXBUbyA9IGxpdmVJdGVtLm1hcFRvLmNsb25lKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm1hcEZyb20gPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLm1hcFRvID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBDYWNoZUl0ZW07XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ2FjaGVJdGVtO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2FjaGVJdGVtLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgY2FjaGVfMSA9IHJlcXVpcmUoXCIuL2NhY2hlXCIpO1xuZXhwb3J0cy5wcmludENhY2hlID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgdmFyIHJlc3VsdCA9IFwiXCI7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgY3VycmVudCA9IGluc3RhbmNlLnRocmVhZC5jdXJyZW50O1xuICAgIHZhciBub2RlSW5kaWNlcyA9IGluc3RhbmNlLnRocmVhZC5ub2RlcztcbiAgICBub2RlSW5kaWNlcy5tYXAoZnVuY3Rpb24gKGNhY2hlTm9kZUlkKSB7XG4gICAgICAgIHZhciBjYWNoZU5vZGUgPSBpbnN0YW5jZS5yZXBvLmdldChjYWNoZU5vZGVJZCk7XG4gICAgICAgIHZhciBzdHJlYW1EYXRhID0gXCJcIjtcbiAgICAgICAgdmFyIHN0YXRlID0gaW5kZXggKyBcIjpcIiArIHN0cmVhbURhdGEgKyBcIltcIiArIHN0cmluZ2lmeU1hcChjYWNoZU5vZGUuaXRlbXMpICsgXCJdXFxuXFxuXCI7XG4gICAgICAgIGlmIChpbmRleCA9PT0gY3VycmVudCkge1xuICAgICAgICAgICAgc3RhdGUgPSBcIi0+IFwiICsgc3RhdGU7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ICs9IHN0YXRlO1xuICAgICAgICBpbmRleCsrO1xuICAgIH0pO1xuICAgIHJlc3VsdCA9IHJlc3VsdC5zdWJzdHJpbmcoMCwgKHJlc3VsdC5sZW5ndGggLSAyKSk7XG4gICAgaW5kZXggPSAwO1xuICAgIHJldHVybiBcIlxcbi0tLS0tLSBPbmUgLS0tLS0tLVwiXG4gICAgICAgICsgXCJcXG5TVEFDSzpcXG5cIiArIHJlc3VsdFxuICAgICAgICArIFwiXFxuXFxuQ09ORklHOlwiICsgSlNPTi5zdHJpbmdpZnkoY2FjaGVfMS5jb25maWcsIG51bGwsIDIpXG4gICAgICAgICsgXCJcXG5cXG5SRVBPIFNJWkU6XCIgKyBpbnN0YW5jZS5yZXBvLmxlbmd0aFxuICAgICAgICArIFwiXFxuPT09PT09PT09PT09PT09PT09PVxcblwiO1xufTtcbnZhciBzdHJpbmdpZnlNYXAgPSBmdW5jdGlvbiAobWFwKSB7XG4gICAgdmFyIHJlc3VsdCA9IFwiXCI7XG4gICAgbWFwLmZvckVhY2goZnVuY3Rpb24gKGtleSwgaXRlbSkge1xuICAgICAgICB2YXIgaXRlbVJlc3VsdCA9IEpTT04uc3RyaW5naWZ5KGl0ZW0sIG51bGwsIDIpO1xuICAgICAgICByZXN1bHQgKz0gaXRlbVJlc3VsdCArIFwiLFxcblwiO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcHJpbnQudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBDYWNoZVJlcG9fMSA9IHJlcXVpcmUoXCIuL0NhY2hlUmVwb1wiKTtcbnZhciBDYWNoZVRocmVhZF8xID0gcmVxdWlyZShcIi4vQ2FjaGVUaHJlYWRcIik7XG52YXIgQ2FjaGVJbnN0YW5jZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2FjaGVJbnN0YW5jZShuYW1lKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMucmVwbyA9IG5ldyBDYWNoZVJlcG9fMS5kZWZhdWx0KCk7XG4gICAgICAgIHRoaXMudGhyZWFkID0gbmV3IENhY2hlVGhyZWFkXzEuZGVmYXVsdCgpO1xuICAgICAgICB0aGlzLm5leHROb2RlS2V5ID0gMDtcbiAgICAgICAgdGhpcy5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzLnJlcG8gPSBuZXcgQ2FjaGVSZXBvXzEuZGVmYXVsdCgpO1xuICAgICAgICAgICAgX3RoaXMudGhyZWFkID0gbmV3IENhY2hlVGhyZWFkXzEuZGVmYXVsdCgpO1xuICAgICAgICAgICAgX3RoaXMubmV4dE5vZGVLZXkgPSAwO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmFkZE5vZGUgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgaWYgKF90aGlzLnJlcG8uYWRkKG5vZGUpKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMudGhyZWFkLmFkZE5vZGUobm9kZS5pZCk7XG4gICAgICAgICAgICAgICAgX3RoaXMubmV4dE5vZGVLZXkrKztcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5sZW5ndGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMudGhyZWFkLm5vZGVzLmxlbmd0aDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLnJlcG8ubGVuZ3RoO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIH1cbiAgICByZXR1cm4gQ2FjaGVJbnN0YW5jZTtcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDYWNoZUluc3RhbmNlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2FjaGVJbnN0YW5jZS50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIENhY2hlTWFwXzEgPSByZXF1aXJlKFwiLi9DYWNoZU1hcFwiKTtcbnZhciBDYWNoZVJlcG8gPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENhY2hlUmVwbygpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5pdGVtcyA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLmdldCA9IGZ1bmN0aW9uIChub2RlSWQpIHsgcmV0dXJuIChfdGhpcy5pdGVtcy5nZXQobm9kZUlkKSk7IH07XG4gICAgICAgIHRoaXMuYWRkID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIGlmICghX3RoaXMuaXRlbXMuaGFzKG5vZGUuaWQpKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuaXRlbXMuc2V0KG5vZGUuaWQsIG5vZGUpO1xuICAgICAgICAgICAgICAgIF90aGlzLmxlbmd0aCsrO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmRlbGV0ZSA9IGZ1bmN0aW9uIChub2RlSWQpIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5pdGVtcy5oYXMobm9kZUlkKSkge1xuICAgICAgICAgICAgICAgIF90aGlzLml0ZW1zLmRlbGV0ZShub2RlSWQpO1xuICAgICAgICAgICAgICAgIF90aGlzLmxlbmd0aC0tO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gQ2FjaGVSZXBvO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IENhY2hlUmVwbztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NhY2hlUmVwby50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIENhY2hlVGhyZWFkID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDYWNoZVRocmVhZCgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gLTE7XG4gICAgICAgIHRoaXMubm9kZXMgPSBbXTtcbiAgICAgICAgdGhpcy5hZGROb2RlID0gZnVuY3Rpb24gKG5vZGVJZCkge1xuICAgICAgICAgICAgX3RoaXMubm9kZXMucHVzaChub2RlSWQpO1xuICAgICAgICAgICAgX3RoaXMuY3VycmVudCsrO1xuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gQ2FjaGVUaHJlYWQ7XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ2FjaGVUaHJlYWQ7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DYWNoZVRocmVhZC50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG52YXIgY2FjaGVfMSA9IHJlcXVpcmUoXCIuL2NhY2hlXCIpO1xudmFyIGdldF8xID0gcmVxdWlyZShcIi4vZ2V0XCIpO1xudmFyIENhY2hlTWFwXzEgPSByZXF1aXJlKFwiLi9DYWNoZU1hcFwiKTtcbnZhciBvcGF0aCA9IHJlcXVpcmUoXCIuL3BhdGhcIik7XG52YXIgZmx1c2hfMSA9IHJlcXVpcmUoXCIuL2ZsdXNoXCIpO1xudmFyIGxvY2F0ZV8xID0gcmVxdWlyZShcIi4vbG9jYXRlXCIpO1xudmFyIHJlZl8xID0gcmVxdWlyZShcIi4vcmVmXCIpO1xuZXhwb3J0cy5ldmljdEl0ZW0gPSBmdW5jdGlvbiAob2JqLCBpbnN0YW5jZSkge1xuICAgIHZhciB1aWRBcnJheSA9IGJ1aWxkRXZpY3RVaWRBcnJheShvYmopO1xuICAgIGlmICh1aWRBcnJheS5sZW5ndGggPT0gMCkge1xuICAgICAgICByZXR1cm4gbG9jYXRlXzEuZ2V0Q2FsbFN0YXRzKGZhbHNlLCBpbnN0YW5jZSk7XG4gICAgfVxuICAgIHZhciBjdXJyZW50U3RhdGUgPSBnZXRfMS5nZXRDYWNoZUN1cnJlbnRTdGFjayhpbnN0YW5jZSk7XG4gICAgdmFyIGZvdW5kID0gdWlkQXJyYXkuc29tZShmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICByZXR1cm4gY3VycmVudFN0YXRlICYmIGN1cnJlbnRTdGF0ZS5oYXMoU3RyaW5nKGl0ZW0pKTtcbiAgICB9KTtcbiAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgIHJldHVybiBsb2NhdGVfMS5nZXRDYWxsU3RhdHMoZmFsc2UsIGluc3RhbmNlKTtcbiAgICB9XG4gICAgdmFyIHRlbXBTdGF0ZSA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICBjdXJyZW50U3RhdGUuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICB0ZW1wU3RhdGUuc2V0KGtleSwgdmFsdWUpO1xuICAgIH0pO1xuICAgIHZhciBmbHVzaE1hcCA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICB2YXIgZXZpY3RNYXAgPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgdmFyIGZsdXNoQXJncyA9IHtcbiAgICAgICAgZmx1c2hNYXA6IGZsdXNoTWFwLFxuICAgICAgICBldmljdE1hcDogZXZpY3RNYXAsXG4gICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZVxuICAgIH07XG4gICAgdmFyIHBhcmVudHNDaGFuZ2VkID0gW107XG4gICAgdWlkQXJyYXkuZm9yRWFjaChmdW5jdGlvbiAodWlkKSB7XG4gICAgICAgIGZsdXNoQXJncy5lbnRpdHlVaWQgPSB1aWQ7XG4gICAgICAgIGNsZWFyVGFyZ2V0UmVmRnJvbXMoZmx1c2hBcmdzKTtcbiAgICAgICAgZXZpY3RNYXAuc2V0KHVpZCwgbnVsbCk7XG4gICAgICAgIGNsZWFyUGFyZW50UmVmVG9zKHVpZEFycmF5LCBwYXJlbnRzQ2hhbmdlZCwgZmx1c2hBcmdzKTtcbiAgICB9KTtcbiAgICBwdXRQYXJlbnRzQ2hhbmdlZChwYXJlbnRzQ2hhbmdlZCwgZmx1c2hNYXAsIGV2aWN0TWFwLCBpbnN0YW5jZSk7XG4gICAgZmx1c2hNYXAuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgIHRlbXBTdGF0ZS5zZXQoa2V5LCBpdGVtKTtcbiAgICB9KTtcbiAgICBldmljdE1hcC5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIGl0ZW0pIHtcbiAgICAgICAgdGVtcFN0YXRlLmRlbGV0ZShrZXkpO1xuICAgIH0pO1xuICAgIGZsdXNoXzEuZmx1c2godGVtcFN0YXRlLCBpbnN0YW5jZSk7XG4gICAgcmV0dXJuIGxvY2F0ZV8xLmdldENhbGxTdGF0cyh0cnVlLCBpbnN0YW5jZSk7XG59O1xudmFyIHB1dFBhcmVudHNDaGFuZ2VkID0gZnVuY3Rpb24gKHBhcmVudHNDaGFuZ2VkLCBmbHVzaE1hcCwgZXZpY3RNYXAsIGluc3RhbmNlKSB7XG4gICAgaWYgKHBhcmVudHNDaGFuZ2VkICYmIHBhcmVudHNDaGFuZ2VkLmxlbmd0aCA+IDAgJiYgdXRpbF8xLmNhY2hlU2l6ZShpbnN0YW5jZSkgPiAwKSB7XG4gICAgICAgIHZhciBmbHVzaEFyZ3NfMSA9IHtcbiAgICAgICAgICAgIGZsdXNoTWFwOiBmbHVzaE1hcCxcbiAgICAgICAgICAgIGV2aWN0TWFwOiBldmljdE1hcCxcbiAgICAgICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZVxuICAgICAgICB9O1xuICAgICAgICBmbHVzaF8xLmJ1aWxkRmx1c2hNYXAoZmx1c2hBcmdzXzEpO1xuICAgICAgICBmbHVzaEFyZ3NfMS5mbHVzaE1hcC5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIGl0ZW0pIHtcbiAgICAgICAgICAgIHJlZl8xLnVwZGF0ZVJlZkZyb21zKGl0ZW0sIGZsdXNoQXJnc18xKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbnZhciBjbGVhclRhcmdldFJlZkZyb21zID0gZnVuY3Rpb24gKGZsdXNoQXJncykge1xuICAgIHZhciBpdGVtID0gZ2V0XzEuZ2V0Q2FjaGVkSXRlbShmbHVzaEFyZ3MuZW50aXR5VWlkLCBmbHVzaEFyZ3MuaW5zdGFuY2UpO1xuICAgIGlmIChpdGVtKSB7XG4gICAgICAgIGl0ZW0ubWFwVG8uZm9yRWFjaChmdW5jdGlvbiAodG9VaWQsIHBhdGhzKSB7XG4gICAgICAgICAgICB2YXIgcmVmSXRlbSA9IGZsdXNoXzEuZ2V0SXRlbUZsdXNoT3JDYWNoZWQodG9VaWQsIGZsdXNoQXJncyk7XG4gICAgICAgICAgICBpZiAocmVmSXRlbSkge1xuICAgICAgICAgICAgICAgIGNsZWFyUmVmRnJvbShyZWZJdGVtLCBmbHVzaEFyZ3MuZW50aXR5VWlkKTtcbiAgICAgICAgICAgICAgICBpZiAocmVmSXRlbS5tYXBGcm9tLnNpemUoKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZW50aXR5VWlkID0gdG9VaWQ7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGFyZ2V0UmVmRnJvbXMoZmx1c2hBcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgZmx1c2hBcmdzLmV2aWN0TWFwLnNldCh0b1VpZCwgcmVmSXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZmx1c2hNYXAuc2V0KHRvVWlkLCByZWZJdGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG52YXIgY2xlYXJSZWZGcm9tID0gZnVuY3Rpb24gKHJlZkl0ZW0sIHBhcmVudFVpZCkge1xuICAgIHZhciByZWZzQXJyYXkgPSByZWZJdGVtLm1hcEZyb20uZ2V0KHBhcmVudFVpZCk7XG4gICAgaWYgKCFyZWZzQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZWZJdGVtLm1hcEZyb20gPSByZWZJdGVtLm1hcEZyb20uY2xvbmUoKTtcbiAgICByZWZJdGVtLm1hcEZyb20uZGVsZXRlKHBhcmVudFVpZCk7XG59O1xudmFyIGNsZWFyUGFyZW50UmVmVG9zID0gZnVuY3Rpb24gKHVpZEFycmF5LCBwYXJlbnRzQ2hhbmdlZCwgZmx1c2hBcmdzKSB7XG4gICAgdmFyIGl0ZW0gPSBmbHVzaF8xLmdldEl0ZW1GbHVzaE9yQ2FjaGVkKGZsdXNoQXJncy5lbnRpdHlVaWQsIGZsdXNoQXJncyk7XG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgaXRlbS5tYXBGcm9tLmZvckVhY2goZnVuY3Rpb24gKHBhcmVudFVpZCwgcGF0aHMpIHtcbiAgICAgICAgICAgIHZhciBwYXJlbnRJdGVtID0gZmx1c2hfMS5nZXRJdGVtRmx1c2hPckNhY2hlZChwYXJlbnRVaWQsIGZsdXNoQXJncyk7XG4gICAgICAgICAgICBpZiAocGFyZW50SXRlbSkge1xuICAgICAgICAgICAgICAgIHZhciBzdWNjZXNzID0gY2xlYXJSZWZUbyhwYXJlbnRJdGVtLCBmbHVzaEFyZ3MuZW50aXR5VWlkLCBmbHVzaEFyZ3MuaW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgIGlmIChzdWNjZXNzID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGZsdXNoQXJncy5mbHVzaE1hcC5zZXQocGFyZW50VWlkLCBwYXJlbnRJdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVpZEFycmF5LmluZGV4T2YocGFyZW50VWlkKSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudHNDaGFuZ2VkLnB1c2gocGFyZW50SXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG52YXIgY2xlYXJSZWZUbyA9IGZ1bmN0aW9uIChwYXJlbnRJdGVtLCByZWZVaWQsIGluc3RhbmNlKSB7XG4gICAgdmFyIHBhcmVudCA9IHBhcmVudEl0ZW0uZW50aXR5O1xuICAgIGlmIChPYmplY3QuaXNGcm96ZW4ocGFyZW50KSkge1xuICAgICAgICBwYXJlbnQgPSBnZXRfMS5nZXRFZGl0SXRlbShwYXJlbnRbY2FjaGVfMS5jb25maWcudWlkTmFtZV0sIGluc3RhbmNlKTtcbiAgICAgICAgcGFyZW50SXRlbS5lbnRpdHkgPSBwYXJlbnQ7XG4gICAgfVxuICAgIHZhciByZWZQYXRocyA9IHBhcmVudEl0ZW0ubWFwVG8uZ2V0KHJlZlVpZCk7XG4gICAgcmVmUGF0aHMuZm9yRWFjaChmdW5jdGlvbiAocGF0aCkge1xuICAgICAgICBvcGF0aC5kZWwocGFyZW50LCBwYXRoKTtcbiAgICB9KTtcbiAgICBpZiAoIU9iamVjdC5pc0Zyb3plbihwYXJlbnQpKSB7XG4gICAgICAgIE9iamVjdC5mcmVlemUocGFyZW50KTtcbiAgICB9XG4gICAgcGFyZW50SXRlbS5lbnRpdHkgPSBwYXJlbnQ7XG4gICAgcGFyZW50SXRlbS5tYXBUbyA9IHBhcmVudEl0ZW0ubWFwVG8uY2xvbmUoKTtcbiAgICBwYXJlbnRJdGVtLm1hcFRvLmRlbGV0ZShyZWZVaWQpO1xuICAgIHJldHVybiB0cnVlO1xufTtcbnZhciBidWlsZEV2aWN0VWlkQXJyYXkgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgdmFyIHVpZEFycmF5ID0gW107XG4gICAgaWYgKHV0aWxfMS5pc0FycmF5KG9iaikpIHtcbiAgICAgICAgb2JqLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIGlmICh1dGlsXzEuaGFzVWlkKGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgdWlkQXJyYXkucHVzaChTdHJpbmcoaXRlbVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpdGVtID09PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBpdGVtID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHVpZEFycmF5LnB1c2goU3RyaW5nKGl0ZW0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdmFyIHVpZCA9IG9iajtcbiAgICAgICAgaWYgKHV0aWxfMS5pc09iamVjdChvYmopKSB7XG4gICAgICAgICAgICB1aWQgPSBvYmpbY2FjaGVfMS5jb25maWcudWlkTmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVpZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdWlkQXJyYXk7XG4gICAgICAgIH1cbiAgICAgICAgdWlkQXJyYXkucHVzaChTdHJpbmcodWlkKSk7XG4gICAgfVxuICAgIHJldHVybiB1aWRBcnJheTtcbn07XG5leHBvcnRzLmNsZWFyTmV4dCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIHZhciB0aHJlYWQgPSBpbnN0YW5jZS50aHJlYWQ7XG4gICAgaWYgKHRocmVhZC5jdXJyZW50IDwgdGhyZWFkLm5vZGVzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgdmFyIHJlbW92ZWROb2RlcyA9IHRocmVhZC5ub2Rlcy5zbGljZSh0aHJlYWQuY3VycmVudCArIDEsIHRocmVhZC5ub2Rlcy5sZW5ndGgpO1xuICAgICAgICB0aHJlYWQubm9kZXMgPSB0aHJlYWQubm9kZXMuc2xpY2UoMCwgdGhyZWFkLmN1cnJlbnQgKyAxKTtcbiAgICAgICAgdGhyZWFkLmN1cnJlbnQgPSB0aHJlYWQubm9kZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgdHJ1bmNhdGVUaHJlYWRzKHJlbW92ZWROb2RlcywgaW5zdGFuY2UpO1xuICAgIH1cbn07XG52YXIgdHJ1bmNhdGVUaHJlYWRzID0gZnVuY3Rpb24gKHJlbW92ZWROb2RlcywgaW5zdGFuY2UpIHtcbiAgICByZW1vdmVkTm9kZXMuZm9yRWFjaChmdW5jdGlvbiAoY2FjaGVOb2RlSWQpIHtcbiAgICAgICAgdmFyIGNhY2hlTm9kZSA9IGluc3RhbmNlLnJlcG8uZ2V0KGNhY2hlTm9kZUlkKTtcbiAgICAgICAgaWYgKGNhY2hlTm9kZSkge1xuICAgICAgICAgICAgaW5zdGFuY2UucmVwby5kZWxldGUoY2FjaGVOb2RlSWQpO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZXZpY3QudHMiXSwic291cmNlUm9vdCI6IiJ9