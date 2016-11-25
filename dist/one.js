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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNTE2ZTJhMWM4NjQ4MjkzZWFkMWMiLCJ3ZWJwYWNrOi8vLy4uLy4uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi4vLi4vc3JjL2NhY2hlLnRzIiwid2VicGFjazovLy8uLi8uLi9zcmMvY29uZmlnLnRzIiwid2VicGFjazovLy8uLi8uLi9zcmMvcHV0LnRzIiwid2VicGFjazovLy8uLi8uLi9zcmMvQ2FjaGVNYXAudHMiLCJ3ZWJwYWNrOi8vLy4uL34vb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi4vLi4vc3JjL2xvY2F0ZS50cyIsIndlYnBhY2s6Ly8vLi4vLi4vc3JjL3V0aWwudHMiLCJ3ZWJwYWNrOi8vLy4uLy4uL3NyYy9DYWNoZU5vZGUudHMiLCJ3ZWJwYWNrOi8vLy4uLy4uL3NyYy9yZWYudHMiLCJ3ZWJwYWNrOi8vLy4uLy4uL3NyYy9mbHVzaC50cyIsIndlYnBhY2s6Ly8vLi4vLi4vc3JjL2dldC50cyIsIndlYnBhY2s6Ly8vLi4vLi4vc3JjL3BhdGgudHMiLCJ3ZWJwYWNrOi8vLy4uLy4uL3NyYy9DYWNoZUl0ZW0udHMiLCJ3ZWJwYWNrOi8vLy4uLy4uL3NyYy9wcmludC50cyIsIndlYnBhY2s6Ly8vLi4vLi4vc3JjL0NhY2hlSW5zdGFuY2UudHMiLCJ3ZWJwYWNrOi8vLy4uLy4uL3NyYy9DYWNoZVJlcG8udHMiLCJ3ZWJwYWNrOi8vLy4uLy4uL3NyYy9DYWNoZVRocmVhZC50cyIsIndlYnBhY2s6Ly8vLi4vLi4vc3JjL2V2aWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7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TSxNQUFPLE9BQVEsVUFBSSxHQUFRLE9BQU0sTUFBUztBQUN6RSxnQkFBTSxRQUFTLE9BQU0sTUFBTSxNQUFFLEdBQVEsT0FBUSxVQUFNO0FBQ25ELGdCQUFRLFVBQVMsT0FBTSxNQUFPLFNBQUs7QUFDMUIseUJBQWEsY0FDaEM7QUFDSjtBQUFFO0FBTUYsS0FBcUIsa0JBQUcsVUFBYSxjQUEwQjtBQUMvQyxrQkFBUSxRQUFDLFVBQVc7QUFDNUIsYUFBYSxZQUFXLFNBQUssS0FBSSxJQUFjO0FBQzVDLGFBQVcsV0FBRTtBQUNKLHNCQUFLLEtBQU8sT0FDeEI7QUFDSjtBQUNKO0FBQUUsRyIsImZpbGUiOiJvbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA1MTZlMmExYzg2NDgyOTNlYWQxYyIsIlwidXNlIHN0cmljdFwiO1xudmFyIGNhY2hlXzEgPSByZXF1aXJlKCcuL2NhY2hlJyk7XG5leHBvcnRzLmdldENhY2hlID0gY2FjaGVfMS5nZXRDYWNoZTtcbihmdW5jdGlvbiAoKSB7XG4gICAgY2FjaGVfMS5nZXRDYWNoZSgpO1xufSkoKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWFXNWtaWGd1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sY3lJNld5SXVMaTh1TGk5emNtTXZhVzVrWlhndWRITWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqdEJRVU5CTEhOQ1FVRjVRaXhUUVVGVExFTkJRVU1zUTBGQlFUdEJRVTh2UWl4blFrRkJVVHRCUVV4YUxFTkJRVU03U1VGRFJ5eG5Ra0ZCVVN4RlFVRkZMRU5CUVVNN1FVRkRaaXhEUVVGRExFTkJRVU1zUlVGQlJTeERRVUZETzBGQlNVb2lmUT09XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uLy4uL3NyYy9pbmRleC50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIGNvbmZpZ18xID0gcmVxdWlyZSgnLi9jb25maWcnKTtcbnZhciBwdXRfMSA9IHJlcXVpcmUoJy4vcHV0Jyk7XG52YXIgcHJpbnRfMSA9IHJlcXVpcmUoJy4vcHJpbnQnKTtcbnZhciBDYWNoZUluc3RhbmNlXzEgPSByZXF1aXJlKCcuL0NhY2hlSW5zdGFuY2UnKTtcbnZhciB1dGlsXzEgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciBnZXRfMSA9IHJlcXVpcmUoJy4vZ2V0Jyk7XG52YXIgZXZpY3RfMSA9IHJlcXVpcmUoJy4vZXZpY3QnKTtcbnZhciBjYWNoZVRlc3QgPSBmYWxzZTtcbmZ1bmN0aW9uIHNldFRlc3RpbmcodGVzdGluZykge1xuICAgIGNhY2hlVGVzdCA9IHRlc3Rpbmc7XG59XG5leHBvcnRzLnNldFRlc3RpbmcgPSBzZXRUZXN0aW5nO1xuZnVuY3Rpb24gZ2V0Q2FjaGUoaW5zdGFuY2VOYW1lLCBjb25maWd1cmF0aW9uKSB7XG4gICAgaWYgKGluc3RhbmNlTmFtZSA9PT0gdm9pZCAwKSB7IGluc3RhbmNlTmFtZSA9IFwib25lXCI7IH1cbiAgICBpZiAoY29uZmlndXJhdGlvbiA9PT0gdm9pZCAwKSB7IGNvbmZpZ3VyYXRpb24gPSBjb25maWdfMS5kZWZhdWx0Q29uZmlnOyB9XG4gICAgaWYgKCFleHBvcnRzLmNvbmZpZyAmJiAhZXhwb3J0cy5pbnN0YW5jZXMpIHtcbiAgICAgICAgZXhwb3J0cy5jb25maWcgPSBjb25maWdfMS5jb25maWd1cmUoY29uZmlndXJhdGlvbik7XG4gICAgfVxuICAgIGlmICghZXhwb3J0cy5pbnN0YW5jZXMpIHtcbiAgICAgICAgZXhwb3J0cy5pbnN0YW5jZXMgPSB7fTtcbiAgICB9XG4gICAgaWYgKCFleHBvcnRzLmluc3RhbmNlc1tpbnN0YW5jZU5hbWVdKSB7XG4gICAgICAgIGV4cG9ydHMuaW5zdGFuY2VzW2luc3RhbmNlTmFtZV0gPSBjcmVhdGVDYWNoZShpbnN0YW5jZU5hbWUpO1xuICAgIH1cbiAgICBpZiAod2luZG93KSB7XG4gICAgICAgIGlmICh3aW5kb3dbaW5zdGFuY2VOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB3aW5kb3dbaW5zdGFuY2VOYW1lXSA9IGV4cG9ydHMuaW5zdGFuY2VzW2luc3RhbmNlTmFtZV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGV4cG9ydHMuaW5zdGFuY2VzW2luc3RhbmNlTmFtZV07XG59XG5leHBvcnRzLmdldENhY2hlID0gZ2V0Q2FjaGU7XG5mdW5jdGlvbiBjcmVhdGVDYWNoZShuYW1lKSB7XG4gICAgdmFyIGluc3RhbmNlID0gbmV3IENhY2hlSW5zdGFuY2VfMS5kZWZhdWx0KG5hbWUpO1xuICAgIHZhciByZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaW5zdGFuY2UucmVzZXQoKTtcbiAgICB9O1xuICAgIHZhciBwdXQgPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICByZXR1cm4gcHV0XzEucHV0SXRlbShpdGVtLCBpbnN0YW5jZSk7XG4gICAgfTtcbiAgICB2YXIgZ2V0ID0gZnVuY3Rpb24gKGVudGl0eSwgbm9kZUlkKSB7XG4gICAgICAgIHJldHVybiBnZXRfMS5nZXRJdGVtKGVudGl0eSwgaW5zdGFuY2UsIG5vZGVJZCk7XG4gICAgfTtcbiAgICB2YXIgZ2V0RWRpdCA9IGZ1bmN0aW9uICh1aWRPckVudGl0eU9yQXJyYXksIG5vZGVJZCkge1xuICAgICAgICByZXR1cm4gZ2V0XzEuZ2V0RWRpdEl0ZW0odWlkT3JFbnRpdHlPckFycmF5LCBpbnN0YW5jZSwgbm9kZUlkKTtcbiAgICB9O1xuICAgIHZhciBldmljdCA9IGZ1bmN0aW9uICh1aWRPckVudGl0eU9yQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIGV2aWN0XzEuZXZpY3RJdGVtKHVpZE9yRW50aXR5T3JBcnJheSwgaW5zdGFuY2UpO1xuICAgIH07XG4gICAgdmFyIHNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB1dGlsXzEuY2FjaGVTaXplKGluc3RhbmNlKTtcbiAgICB9O1xuICAgIHZhciBsZW5ndGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB1dGlsXzEuY2FjaGVMZW5ndGgoaW5zdGFuY2UpO1xuICAgIH07XG4gICAgdmFyIHByaW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gcHJpbnRfMS5wcmludENhY2hlKGluc3RhbmNlKTtcbiAgICB9O1xuICAgIHZhciByZWZGcm9tID0gZnVuY3Rpb24gKHVpZCkge1xuICAgICAgICB2YXIgaXRlbSA9IGdldF8xLmdldENhY2hlZEl0ZW0odWlkLCBpbnN0YW5jZSk7XG4gICAgICAgIHJldHVybiBpdGVtLm1hcEZyb207XG4gICAgfTtcbiAgICB2YXIgcmVmVG8gPSBmdW5jdGlvbiAodWlkKSB7XG4gICAgICAgIHZhciBpdGVtID0gZ2V0XzEuZ2V0Q2FjaGVkSXRlbSh1aWQsIGluc3RhbmNlKTtcbiAgICAgICAgcmV0dXJuIGl0ZW0ubWFwVG87XG4gICAgfTtcbiAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICBwdXQ6IHB1dCxcbiAgICAgICAgZ2V0OiBnZXQsXG4gICAgICAgIGdldEVkaXQ6IGdldEVkaXQsXG4gICAgICAgIGV2aWN0OiBldmljdCxcbiAgICAgICAgcmVzZXQ6IHJlc2V0LFxuICAgICAgICBzaXplOiBzaXplLFxuICAgICAgICBsZW5ndGg6IGxlbmd0aCxcbiAgICAgICAgcHJpbnQ6IHByaW50LFxuICAgICAgICByZWZUbzogcmVmVG8sXG4gICAgICAgIHJlZkZyb206IHJlZkZyb21cbiAgICB9O1xuICAgIGlmIChjYWNoZVRlc3QgPT09IGZhbHNlKSB7XG4gICAgICAgIGRlbGV0ZSByZXN1bHQucmVmVG87XG4gICAgICAgIGRlbGV0ZSByZXN1bHQucmVmRnJvbTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaVkyRmphR1V1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sY3lJNld5SXVMaTh1TGk5emNtTXZZMkZqYUdVdWRITWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqdEJRVVZCTEhWQ1FVRjVReXhWUVVGVkxFTkJRVU1zUTBGQlFUdEJRVVZ3UkN4dlFrRkJkMElzVDBGQlR5eERRVUZETEVOQlFVRTdRVUZEYUVNc2MwSkJRVEpDTEZOQlFWTXNRMEZCUXl4RFFVRkJPMEZCUTNKRExEaENRVUV3UWl4cFFrRkJhVUlzUTBGQlF5eERRVUZCTzBGQlJUVkRMSEZDUVVGMVF5eFJRVUZSTEVOQlFVTXNRMEZCUVR0QlFVTm9SQ3h2UWtGQmIwUXNUMEZCVHl4RFFVRkRMRU5CUVVFN1FVRkROVVFzYzBKQlFUQkNMRk5CUVZNc1EwRkJReXhEUVVGQk8wRkJUM0JETEVsQlFVa3NVMEZCVXl4SFFVRlpMRXRCUVVzc1EwRkJRenRCUVVVdlFpeHZRa0ZCTWtJc1QwRkJaMEk3U1VGRGRrTXNVMEZCVXl4SFFVRkhMRTlCUVU4c1EwRkJRenRCUVVONFFpeERRVUZETzBGQlJtVXNhMEpCUVZVc1lVRkZla0lzUTBGQlFUdEJRVTFFTEd0Q1FVRjVRaXhaUVVGdlFpeEZRVUZGTEdGQlFXbERPMGxCUVhaRUxEUkNRVUZ2UWl4SFFVRndRaXh2UWtGQmIwSTdTVUZCUlN3MlFrRkJhVU1zUjBGQmFrTXNjME5CUVdsRE8wbEJRelZGTEVWQlFVVXNRMEZCUXl4RFFVRkRMRU5CUVVNc1kwRkJUU3hKUVVGSkxFTkJRVU1zYVVKQlFWTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRlRUlzWTBGQlRTeEhRVUZITEd0Q1FVRlRMRU5CUVVNc1lVRkJZU3hEUVVGRExFTkJRVU03U1VGRGRFTXNRMEZCUXp0SlFVTkVMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVU1zYVVKQlFWTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRZaXhwUWtGQlV5eEhRVUZITEVWQlFVVXNRMEZCUXp0SlFVTnVRaXhEUVVGRE8wbEJRMFFzUlVGQlJTeERRVUZETEVOQlFVTXNRMEZCUXl4cFFrRkJVeXhEUVVGRExGbEJRVmtzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0UlFVTXpRaXhwUWtGQlV5eERRVUZETEZsQlFWa3NRMEZCUXl4SFFVRkhMRmRCUVZjc1EwRkJReXhaUVVGWkxFTkJRVU1zUTBGQlF6dEpRVU40UkN4RFFVRkRPMGxCUTBRc1JVRkJSU3hEUVVGRExFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTXNRMEZCUXp0UlFVTlVMRVZCUVVVc1EwRkJReXhEUVVGRExFMUJRVTBzUTBGQlF5eFpRVUZaTEVOQlFVTXNTMEZCU3l4VFFVRlRMRU5CUVVNc1EwRkJReXhEUVVGRE8xbEJRM0pETEUxQlFVMHNRMEZCUXl4WlFVRlpMRU5CUVVNc1IwRkJSeXhwUWtGQlV5eERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRPMUZCUTI1RUxFTkJRVU03U1VGRFRDeERRVUZETzBsQlEwUXNUVUZCVFN4RFFVRkRMR2xDUVVGVExFTkJRVU1zV1VGQldTeERRVUZETEVOQlFVTTdRVUZEYmtNc1EwRkJRenRCUVdoQ1pTeG5Ra0ZCVVN4WFFXZENka0lzUTBGQlFUdEJRVGhDUkN4eFFrRkJjVUlzU1VGQldUdEpRVVUzUWl4SlFVRk5MRkZCUVZFc1IwRkJiVUlzU1VGQlNTeDFRa0ZCWVN4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8wbEJTM3BFTEVsQlFVMHNTMEZCU3l4SFFVRkhPMUZCUTFZc1VVRkJVU3hEUVVGRExFdEJRVXNzUlVGQlJTeERRVUZETzBsQlEzSkNMRU5CUVVNc1EwRkJRenRKUVVWR0xFbEJRVTBzUjBGQlJ5eEhRVUZITEZWQlFVTXNTVUZCYjBJN1VVRkROMElzVFVGQlRTeERRVUZETEdGQlFVOHNRMEZCUXl4SlFVRkpMRVZCUVVVc1VVRkJVU3hEUVVGRExFTkJRVU03U1VGRGJrTXNRMEZCUXl4RFFVRkJPMGxCVFVRc1NVRkJUU3hIUVVGSExFZEJRVWNzVlVGQlF5eE5RVUY1UXl4RlFVRkZMRTFCUVdVN1VVRkRia1VzVFVGQlRTeERRVUZETEdGQlFVOHNRMEZCUXl4TlFVRk5MRVZCUVVVc1VVRkJVU3hGUVVGRkxFMUJRVTBzUTBGQlF5eERRVUZETzBsQlF6ZERMRU5CUVVNc1EwRkJRVHRKUVUxRUxFbEJRVTBzVDBGQlR5eEhRVUZITEZWQlFVTXNhMEpCUVhGRUxFVkJRVVVzVFVGQlpUdFJRVU51Uml4TlFVRk5MRU5CUVVNc2FVSkJRVmNzUTBGQlF5eHJRa0ZCYTBJc1JVRkJSU3hSUVVGUkxFVkJRVVVzVFVGQlRTeERRVUZETEVOQlFVTTdTVUZETjBRc1EwRkJReXhEUVVGQk8wbEJSVVFzU1VGQlRTeExRVUZMTEVkQlFVY3NWVUZCUXl4clFrRkJjVVE3VVVGRGFFVXNUVUZCVFN4RFFVRkRMR2xDUVVGVExFTkJRVU1zYTBKQlFXdENMRVZCUVVVc1VVRkJVU3hEUVVGRExFTkJRVU03U1VGRGJrUXNRMEZCUXl4RFFVRkJPMGxCUlVRc1NVRkJUU3hKUVVGSkxFZEJRVWM3VVVGRFZDeE5RVUZOTEVOQlFVTXNaMEpCUVZNc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dEpRVU12UWl4RFFVRkRMRU5CUVVFN1NVRkZSQ3hKUVVGTkxFMUJRVTBzUjBGQlJ6dFJRVU5ZTEUxQlFVMHNRMEZCUXl4clFrRkJWeXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETzBsQlEycERMRU5CUVVNc1EwRkJRVHRKUVVWRUxFbEJRVTBzUzBGQlN5eEhRVUZITzFGQlExWXNUVUZCVFN4RFFVRkRMR3RDUVVGVkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdTVUZEYUVNc1EwRkJReXhEUVVGQk8wbEJSVVFzU1VGQlRTeFBRVUZQTEVkQlFVY3NWVUZCUVN4SFFVRkhPMUZCUTJZc1NVRkJTU3hKUVVGSkxFZEJRVWNzYlVKQlFXRXNRMEZCUXl4SFFVRkhMRVZCUVVVc1VVRkJVU3hEUVVGRExFTkJRVU03VVVGRGVFTXNUVUZCVFN4RFFVRkRMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU03U1VGRGVFSXNRMEZCUXl4RFFVRkRPMGxCUlVZc1NVRkJUU3hMUVVGTExFZEJRVWNzVlVGQlFTeEhRVUZITzFGQlEySXNTVUZCU1N4SlFVRkpMRWRCUVVjc2JVSkJRV0VzUTBGQlF5eEhRVUZITEVWQlFVVXNVVUZCVVN4RFFVRkRMRU5CUVVNN1VVRkRlRU1zVFVGQlRTeERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNN1NVRkRkRUlzUTBGQlF5eERRVUZETzBsQlJVWXNTVUZCU1N4TlFVRk5MRWRCUVVjN1VVRkRWQ3hIUVVGSExFVkJRVVVzUjBGQlJ6dFJRVU5TTEVkQlFVY3NSVUZCUlN4SFFVRkhPMUZCUTFJc1QwRkJUeXhGUVVGRkxFOUJRVTg3VVVGRGFFSXNTMEZCU3l4RlFVRkZMRXRCUVVzN1VVRkRXaXhMUVVGTExFVkJRVVVzUzBGQlN6dFJRVU5hTEVsQlFVa3NSVUZCUlN4SlFVRkpPMUZCUTFZc1RVRkJUU3hGUVVGRkxFMUJRVTA3VVVGRFpDeExRVUZMTEVWQlFVVXNTMEZCU3p0UlFVZGFMRXRCUVVzc1JVRkJSU3hMUVVGTE8xRkJRMW9zVDBGQlR5eEZRVUZGTEU5QlFVODdTMEZEYmtJc1EwRkJRVHRKUVVWRUxFVkJRVVVzUTBGQlF5eERRVUZETEZOQlFWTXNTMEZCU3l4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRE8xRkJRM1JDTEU5QlFVOHNUVUZCVFN4RFFVRkRMRXRCUVVzc1EwRkJRenRSUVVOd1FpeFBRVUZQTEUxQlFVMHNRMEZCUXl4UFFVRlBMRU5CUVVNN1NVRkRNVUlzUTBGQlF6dEpRVVZFTEUxQlFVMHNRMEZCUXl4TlFVRk5MRU5CUVVNN1FVRkRiRUlzUTBGQlF5SjlcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vLi4vc3JjL2NhY2hlLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLmRlZmF1bHRDb25maWcgPSB7XG4gICAgdWlkTmFtZTogXCJ1aWRcIixcbiAgICBtYXhIaXN0b3J5U3RhdGVzOiAxMDAwXG59O1xuZnVuY3Rpb24gY29uZmlndXJlKGNvbmYpIHtcbiAgICBmb3IgKHZhciBwIGluIGV4cG9ydHMuZGVmYXVsdENvbmZpZykge1xuICAgICAgICBpZiAoZXhwb3J0cy5kZWZhdWx0Q29uZmlnLmhhc093blByb3BlcnR5KHApICYmIGNvbmYuaGFzT3duUHJvcGVydHkocCkpIHtcbiAgICAgICAgICAgIGV4cG9ydHMuZGVmYXVsdENvbmZpZ1twXSA9IGNvbmZbcF07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGV4cG9ydHMuZGVmYXVsdENvbmZpZztcbn1cbmV4cG9ydHMuY29uZmlndXJlID0gY29uZmlndXJlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pWTI5dVptbG5MbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE1pT2xzaUxpNHZMaTR2YzNKakwyTnZibVpwWnk1MGN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3haUVVGWkxFTkJRVU03UVVGTFFTeHhRa0ZCWVN4SFFVRkhPMGxCUTNwQ0xFOUJRVThzUlVGQlJTeExRVUZMTzBsQlEyUXNaMEpCUVdkQ0xFVkJRVVVzU1VGQlNUdERRVU42UWl4RFFVRkRPMEZCUzBZc2JVSkJRVEJDTEVsQlFVazdTVUZETVVJc1IwRkJSeXhEUVVGRExFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NjVUpCUVdFc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRE1VSXNSVUZCUlN4RFFVRkRMRU5CUVVNc2NVSkJRV0VzUTBGQlF5eGpRVUZqTEVOQlFVTXNRMEZCUXl4RFFVRkRMRWxCUVVrc1NVRkJTU3hEUVVGRExHTkJRV01zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1dVRkROVVFzY1VKQlFXRXNRMEZCUXl4RFFVRkRMRU5CUVVNc1IwRkJSeXhKUVVGSkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdVVUZETDBJc1EwRkJRenRKUVVOTUxFTkJRVU03U1VGRFJDeE5RVUZOTEVOQlFVTXNjVUpCUVdFc1EwRkJRenRCUVVONlFpeERRVUZETzBGQlVHVXNhVUpCUVZNc1dVRlBlRUlzUTBGQlFTSjlcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vLi4vc3JjL2NvbmZpZy50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIENhY2hlTWFwXzEgPSByZXF1aXJlKCcuL0NhY2hlTWFwJyk7XG52YXIgbG9jYXRlXzEgPSByZXF1aXJlKCcuL2xvY2F0ZScpO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIHJlZl8xID0gcmVxdWlyZSgnLi9yZWYnKTtcbnZhciBmbHVzaF8xID0gcmVxdWlyZSgnLi9mbHVzaCcpO1xuZXhwb3J0cy5wdXRJdGVtID0gZnVuY3Rpb24gKGVudGl0eSwgaW5zdGFuY2UpIHtcbiAgICBpZiAoKHV0aWxfMS5pc0FycmF5KGVudGl0eSkgfHwgdXRpbF8xLmlzT2JqZWN0KGVudGl0eSkpKSB7XG4gICAgICAgIHZhciBldmljdE1hcCA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICAgICAgdmFyIGZsdXNoTWFwID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgICAgICBmbHVzaE1hcFsnX19VUERBVEVEX18nXSA9IGZhbHNlO1xuICAgICAgICB2YXIgZmx1c2hBcmdzID0ge1xuICAgICAgICAgICAgZW50aXR5OiBlbnRpdHksXG4gICAgICAgICAgICBmbHVzaE1hcDogZmx1c2hNYXAsXG4gICAgICAgICAgICBldmljdE1hcDogZXZpY3RNYXAsXG4gICAgICAgICAgICBwYXJlbnRVaWQ6IG51bGwsXG4gICAgICAgICAgICByZWZQYXRoOiBcIlwiLFxuICAgICAgICAgICAgaW5zdGFuY2U6IGluc3RhbmNlXG4gICAgICAgIH07XG4gICAgICAgIGZsdXNoXzEuYnVpbGRGbHVzaE1hcChmbHVzaEFyZ3MpO1xuICAgICAgICByZWZfMS51cGRhdGVQb2ludGVycyhmbHVzaEFyZ3MpO1xuICAgICAgICBpZiAoZmx1c2hBcmdzLmZsdXNoTWFwLnNpemUoKSA+IDAgJiYgZmx1c2hNYXBbJ19fVVBEQVRFRF9fJ10gPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiBjb21taXRQdXQoZmx1c2hBcmdzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbG9jYXRlXzEuZ2V0Q2FsbFN0YXRzKGZhbHNlLCBpbnN0YW5jZSk7XG59O1xudmFyIGNvbW1pdFB1dCA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICBmbHVzaF8xLnByZUZsdXNoKGZsdXNoQXJncyk7XG4gICAgcmV0dXJuIGxvY2F0ZV8xLmdldENhbGxTdGF0cyh0cnVlLCBmbHVzaEFyZ3MuaW5zdGFuY2UpO1xufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWNIVjBMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE1pT2xzaUxpNHZMaTR2YzNKakwzQjFkQzUwY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pTzBGQlJVRXNlVUpCUVhGQ0xGbEJRVmtzUTBGQlF5eERRVUZCTzBGQlIyeERMSFZDUVVFMlFpeFZRVUZWTEVOQlFVTXNRMEZCUVR0QlFVTjRReXh4UWtGQmEwTXNVVUZCVVN4RFFVRkRMRU5CUVVFN1FVRkRNME1zYjBKQlFTdENMRTlCUVU4c1EwRkJReXhEUVVGQk8wRkJRM1pETEhOQ1FVRjNReXhUUVVGVExFTkJRVU1zUTBGQlFUdEJRVkZ5UXl4bFFVRlBMRWRCUVVjc1ZVRkJReXhOUVVGelFpeEZRVUZGTEZGQlFYZENPMGxCUjNCRkxFVkJRVVVzUTBGQlF5eERRVUZETEVOQlFVTXNZMEZCVHl4RFFVRkRMRTFCUVUwc1EwRkJReXhKUVVGSkxHVkJRVkVzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRSUVVWNFF5eEpRVUZOTEZGQlFWRXNSMEZCZDBJc1NVRkJTU3hyUWtGQlVTeEZRVUZoTEVOQlFVTTdVVUZEYUVVc1NVRkJUU3hSUVVGUkxFZEJRWGRDTEVsQlFVa3NhMEpCUVZFc1JVRkJZU3hEUVVGRE8xRkJRMmhGTEZGQlFWRXNRMEZCUXl4aFFVRmhMRU5CUVVNc1IwRkJSeXhMUVVGTExFTkJRVU03VVVGRmFFTXNTVUZCU1N4VFFVRlRMRWRCUVdVN1dVRkRlRUlzVFVGQlRTeEZRVUZGTEUxQlFVMDdXVUZEWkN4UlFVRlJMRVZCUVVVc1VVRkJVVHRaUVVOc1FpeFJRVUZSTEVWQlFVVXNVVUZCVVR0WlFVTnNRaXhUUVVGVExFVkJRVVVzU1VGQlNUdFpRVU5tTEU5QlFVOHNSVUZCUlN4RlFVRkZPMWxCUTFnc1VVRkJVU3hGUVVGRkxGRkJRVkU3VTBGRGNrSXNRMEZCUVR0UlFVVkVMSEZDUVVGaExFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdVVUZGZWtJc2IwSkJRV01zUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXp0UlFVVXhRaXhGUVVGRkxFTkJRVU1zUTBGQlF5eFRRVUZUTEVOQlFVTXNVVUZCVVN4RFFVRkRMRWxCUVVrc1JVRkJSU3hIUVVGSExFTkJRVU1zU1VGQlNTeFJRVUZSTEVOQlFVTXNZVUZCWVN4RFFVRkRMRXRCUVVzc1NVRkJTU3hEUVVGRExFTkJRVU1zUTBGQlF6dFpRVU53UlN4TlFVRk5MRU5CUVVNc1UwRkJVeXhEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzFGQlEyaERMRU5CUVVNN1NVRkRUQ3hEUVVGRE8wbEJRMFFzVFVGQlRTeERRVUZETEhGQ1FVRlpMRU5CUVVNc1MwRkJTeXhGUVVGRkxGRkJRVkVzUTBGQlF5eERRVUZETzBGQlEzcERMRU5CUVVNc1EwRkJRVHRCUVVWRUxFbEJRVTBzVTBGQlV5eEhRVUZITEZWQlFVTXNVMEZCY1VJN1NVRkhjRU1zWjBKQlFWRXNRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRKUVVOd1FpeE5RVUZOTEVOQlFVTXNjVUpCUVZrc1EwRkJReXhKUVVGSkxFVkJRVVVzVTBGQlV5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMEZCUTJ4RUxFTkJRVU1zUTBGQlFTSjlcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vLi4vc3JjL3B1dC50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIG9iamVjdEFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcbnZhciBDYWNoZU1hcCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2FjaGVNYXAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMucGF0aHMgPSB7fTtcbiAgICAgICAgdGhpcy5sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5wYXRoc1trZXldO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmRlbGV0ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgX3RoaXMucGF0aHNba2V5XSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBfdGhpcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhbCA9IF90aGlzLnBhdGhzW2tleV07XG4gICAgICAgICAgICAgICAgZGVsZXRlIF90aGlzLnBhdGhzW2tleV07XG4gICAgICAgICAgICAgICAgX3RoaXMubGVuZ3RoLS07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5oYXMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIF90aGlzLnBhdGhzW2tleV0gIT09ICd1bmRlZmluZWQnO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBfdGhpcy5wYXRocykge1xuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5wYXRocy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGtleSwgX3RoaXMucGF0aHNba2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNsb25lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG5ld0luc3RhbmNlID0gb2JqZWN0QXNzaWduKHt9LCBfdGhpcy5wYXRocyk7XG4gICAgICAgICAgICB2YXIgY2xvbmUgPSBuZXcgQ2FjaGVNYXAoKTtcbiAgICAgICAgICAgIGNsb25lLnBhdGhzID0gbmV3SW5zdGFuY2U7XG4gICAgICAgICAgICBjbG9uZS5sZW5ndGggPSBfdGhpcy5sZW5ndGg7XG4gICAgICAgICAgICByZXR1cm4gY2xvbmU7XG4gICAgICAgIH07XG4gICAgfVxuICAgIENhY2hlTWFwLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMucGF0aHNba2V5XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy5sZW5ndGgrKztcbiAgICAgICAgICAgIHRoaXMucGF0aHNba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYXRoc1trZXldID0gdmFsdWU7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIENhY2hlTWFwLnByb3RvdHlwZS5zaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sZW5ndGg7XG4gICAgfTtcbiAgICByZXR1cm4gQ2FjaGVNYXA7XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ2FjaGVNYXA7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lRMkZqYUdWTllYQXVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjeUk2V3lJdUxpOHVMaTl6Y21NdlEyRmphR1ZOWVhBdWRITWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqdEJRVVZCTEVsQlFVMHNXVUZCV1N4SFFVRkhMRTlCUVU4c1EwRkJReXhsUVVGbExFTkJRVU1zUTBGQlF6dEJRVVU1UXp0SlFVdEpPMUZCVEVvc2FVSkJjMFJETzFGQmNFUkhMRlZCUVVzc1IwRkJSeXhGUVVGRkxFTkJRVU03VVVGRFdDeFhRVUZOTEVkQlFVY3NRMEZCUXl4RFFVRkRPMUZCWlZnc1VVRkJSeXhIUVVGSExGVkJRVU1zUjBGQlJ6dFpRVU5PTEUxQlFVMHNRMEZCUXl4TFFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETzFGQlF6TkNMRU5CUVVNc1EwRkJRVHRSUVVWRUxGZEJRVTBzUjBGQlJ5eFZRVUZETEVkQlFVYzdXVUZEVkN4RlFVRkZMRU5CUVVNc1EwRkJReXhQUVVGUExFdEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRXRCUVVzc1YwRkJWeXhKUVVGSkxFdEJRVWtzUTBGQlF5eE5RVUZOTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRuUWtGRE5VUXNTVUZCU1N4SFFVRkhMRWRCUVVjc1MwRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXp0blFrRkRNVUlzVDBGQlR5eExRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRE8yZENRVU4yUWl4TFFVRkpMRU5CUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU03WjBKQlEyUXNUVUZCVFN4RFFVRkRMRWRCUVVjc1EwRkJRenRaUVVObUxFTkJRVU03VVVGRFRDeERRVUZETEVOQlFVRTdVVUZGUkN4UlFVRkhMRWRCUVVjc1ZVRkJReXhIUVVGSE8xbEJRMDRzVFVGQlRTeERRVUZETEU5QlFVOHNTMEZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zUzBGQlN5eFhRVUZYTEVOQlFVTTdVVUZEYkVRc1EwRkJReXhEUVVGQk8xRkJSVVFzV1VGQlR5eEhRVUZITEZWQlFVTXNVVUZCYTBJN1dVRkRla0lzUjBGQlJ5eERRVUZETEVOQlFVTXNTVUZCU1N4SFFVRkhMRWxCUVVrc1MwRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTTdaMEpCUTNwQ0xFVkJRVVVzUTBGQlF5eERRVUZETEV0QlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1kwRkJZeXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0dlFrRkRha01zVVVGQlVTeERRVUZETEVkQlFVY3NSVUZCUlN4TFFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTTdaMEpCUTI1RExFTkJRVU03V1VGRFRDeERRVUZETzFGQlEwd3NRMEZCUXl4RFFVRkJPMUZCUlVRc1ZVRkJTeXhIUVVGSE8xbEJRMG9zU1VGQlNTeFhRVUZYTEVkQlFVY3NXVUZCV1N4RFFVRkRMRVZCUVVVc1JVRkJSU3hMUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdXVUZETDBNc1NVRkJTU3hMUVVGTExFZEJRV2RDTEVsQlFVa3NVVUZCVVN4RlFVRkxMRU5CUVVNN1dVRkRNME1zUzBGQlN5eERRVUZETEV0QlFVc3NSMEZCUnl4WFFVRlhMRU5CUVVNN1dVRkRNVUlzUzBGQlN5eERRVUZETEUxQlFVMHNSMEZCUnl4TFFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRE8xbEJRek5DTEUxQlFVMHNRMEZCUXl4TFFVRkxMRU5CUVVNN1VVRkRha0lzUTBGQlF5eERRVUZCTzBsQk0wTkVMRU5CUVVNN1NVRkZSQ3h6UWtGQlJ5eEhRVUZJTEZWQlFVa3NSMEZCYjBJc1JVRkJSU3hMUVVGUk8xRkJRemxDTEVWQlFVVXNRMEZCUXl4RFFVRkRMRTlCUVU4c1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNTMEZCU3l4WFFVRlhMRU5CUVVNc1EwRkJReXhEUVVGRE8xbEJRM3BETEVsQlFVa3NRMEZCUXl4TlFVRk5MRVZCUVVVc1EwRkJRenRaUVVOa0xFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRWRCUVVjc1MwRkJTeXhEUVVGRE8xbEJRM2hDTEUxQlFVMHNRMEZCUXl4SlFVRkpMRU5CUVVNN1VVRkRhRUlzUTBGQlF6dFJRVU5FTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExFZEJRVWNzUzBGQlN5eERRVUZETzFGQlEzaENMRTFCUVUwc1EwRkJReXhMUVVGTExFTkJRVU03U1VGRGFrSXNRMEZCUXp0SlFXMURSQ3gxUWtGQlNTeEhRVUZLTzFGQlEwa3NUVUZCVFN4RFFVRkRMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU03U1VGRGRrSXNRMEZCUXp0SlFVTk1MR1ZCUVVNN1FVRkJSQ3hEUVVGRExFRkJkRVJFTEVsQmMwUkRPMEZCZEVSRU96QkNRWE5FUXl4RFFVRkJJbjA9XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uLy4uL3NyYy9DYWNoZU1hcC50cyIsIid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4uL34vb2JqZWN0LWFzc2lnbi9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciB1dGlsXzEgPSByZXF1aXJlKCcuL3V0aWwnKTtcbmV4cG9ydHMuZ2V0Q2FsbFN0YXRzID0gZnVuY3Rpb24gKHN1Y2Nlc3MsIGluc3RhbmNlKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHJlc3VsdC5zdWNjZXNzID0gc3VjY2VzcztcbiAgICByZXN1bHQubm9kZUlkID0gZXhwb3J0cy5ub2RlKGluc3RhbmNlKTtcbiAgICByZXN1bHQubGVuZ3RoID0gbGVuZ3RoKGluc3RhbmNlKTtcbiAgICByZXN1bHQubmFtZSA9IGluc3RhbmNlLm5hbWU7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5leHBvcnRzLm5vZGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIG5vZGVJZCkge1xuICAgIGlmICh0eXBlb2Ygbm9kZUlkID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHZhciBjdXJyZW50Tm9kZSA9IGdldEN1cnJlbnROb2RlKGluc3RhbmNlKTtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnROb2RlID8gY3VycmVudE5vZGUuaWQgOiAtMTtcbiAgICB9XG4gICAgaWYgKCF1dGlsXzEuaXNOdW1iZXIobm9kZUlkKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVGhlIG5vZGUgaWQgbXVzdCBiZSBhIG51bWJlci5cIik7XG4gICAgfVxuICAgIHZhciBjYWNoZU5vZGUgPSBnZXRSZXBvTm9kZShub2RlSWQsIGluc3RhbmNlKTtcbiAgICBpZiAoIWNhY2hlTm9kZSkge1xuICAgICAgICByZXR1cm4gZXhwb3J0cy5nZXRDYWxsU3RhdHMoZmFsc2UsIGluc3RhbmNlKTtcbiAgICB9XG4gICAgaW5zdGFuY2UudGhyZWFkLmN1cnJlbnQgPSBiaW5hcnlJbmRleE9mKGluc3RhbmNlLnRocmVhZC5ub2Rlcywgbm9kZUlkKTtcbiAgICByZXR1cm4gZXhwb3J0cy5nZXRDYWxsU3RhdHModHJ1ZSwgaW5zdGFuY2UpO1xufTtcbmZ1bmN0aW9uIGdldEN1cnJlbnROb2RlKGluc3RhbmNlKSB7XG4gICAgdmFyIGN1cnJlbnROb2RlSWQgPSBpbnN0YW5jZS50aHJlYWQubm9kZXNbaW5zdGFuY2UudGhyZWFkLmN1cnJlbnRdO1xuICAgIHJldHVybiBjdXJyZW50Tm9kZUlkID49IDAgPyBnZXRSZXBvTm9kZShjdXJyZW50Tm9kZUlkLCBpbnN0YW5jZSkgOiB1bmRlZmluZWQ7XG59XG5leHBvcnRzLmdldEN1cnJlbnROb2RlID0gZ2V0Q3VycmVudE5vZGU7XG5mdW5jdGlvbiBnZXRSZXBvTm9kZShjYWNoZU5vZGVJZCwgaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gaW5zdGFuY2UucmVwby5nZXQoY2FjaGVOb2RlSWQpO1xufVxuZXhwb3J0cy5nZXRSZXBvTm9kZSA9IGdldFJlcG9Ob2RlO1xudmFyIGxlbmd0aCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIHJldHVybiBpbnN0YW5jZS50aHJlYWQubm9kZXMubGVuZ3RoO1xufTtcbmZ1bmN0aW9uIGJpbmFyeUluZGV4T2YoYXJyYXksIHNlYXJjaEVsZW1lbnQpIHtcbiAgICB2YXIgbWluSW5kZXggPSAwO1xuICAgIHZhciBtYXhJbmRleCA9IGFycmF5Lmxlbmd0aCAtIDE7XG4gICAgdmFyIGN1cnJlbnRJbmRleDtcbiAgICB2YXIgY3VycmVudEVsZW1lbnQ7XG4gICAgd2hpbGUgKG1pbkluZGV4IDw9IG1heEluZGV4KSB7XG4gICAgICAgIGN1cnJlbnRJbmRleCA9IChtaW5JbmRleCArIG1heEluZGV4KSAvIDIgfCAwO1xuICAgICAgICBjdXJyZW50RWxlbWVudCA9IGFycmF5W2N1cnJlbnRJbmRleF07XG4gICAgICAgIGlmIChjdXJyZW50RWxlbWVudCA8IHNlYXJjaEVsZW1lbnQpIHtcbiAgICAgICAgICAgIG1pbkluZGV4ID0gY3VycmVudEluZGV4ICsgMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjdXJyZW50RWxlbWVudCA+IHNlYXJjaEVsZW1lbnQpIHtcbiAgICAgICAgICAgIG1heEluZGV4ID0gY3VycmVudEluZGV4IC0gMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50SW5kZXg7XG4gICAgICAgIH1cbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2liRzlqWVhSbExtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTGk0dkxpNHZjM0pqTDJ4dlkyRjBaUzUwY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pTzBGQlJVRXNjVUpCUVhORExGRkJRVkVzUTBGQlF5eERRVUZCTzBGQlUyeERMRzlDUVVGWkxFZEJRVWNzVlVGQlF5eFBRVUZuUWl4RlFVRkZMRkZCUVhkQ08wbEJRMjVGTEVsQlFVa3NUVUZCVFN4SFFVRlJMRVZCUVVVc1EwRkJRenRKUVVOeVFpeE5RVUZOTEVOQlFVTXNUMEZCVHl4SFFVRkhMRTlCUVU4c1EwRkJRenRKUVVONlFpeE5RVUZOTEVOQlFVTXNUVUZCVFN4SFFVRkhMRmxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dEpRVU12UWl4TlFVRk5MRU5CUVVNc1RVRkJUU3hIUVVGSExFMUJRVTBzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXp0SlFVTnFReXhOUVVGTkxFTkJRVU1zU1VGQlNTeEhRVUZITEZGQlFWRXNRMEZCUXl4SlFVRkpMRU5CUVVNN1NVRkROVUlzVFVGQlRTeERRVUZETEUxQlFVMHNRMEZCUXp0QlFVTnNRaXhEUVVGRExFTkJRVU03UVVGWFZ5eFpRVUZKTEVkQlFVY3NWVUZCUXl4UlFVRjNRaXhGUVVGRkxFMUJRVTg3U1VGRmJFUXNSVUZCUlN4RFFVRkRMRU5CUVVNc1QwRkJUeXhOUVVGTkxFdEJRVXNzVjBGQlZ5eERRVUZETEVOQlFVTXNRMEZCUXp0UlFVTm9ReXhKUVVGSkxGZEJRVmNzUjBGQlJ5eGpRVUZqTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN1VVRkRNME1zVFVGQlRTeERRVUZETEZkQlFWY3NSMEZCUnl4WFFVRlhMRU5CUVVNc1JVRkJSU3hIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZETzBsQlF6ZERMRU5CUVVNN1NVRkZSQ3hGUVVGRkxFTkJRVU1zUTBGQlF5eERRVUZETEdWQlFWRXNRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRGNFSXNUVUZCVFN4SlFVRkpMRk5CUVZNc1EwRkJReXdyUWtGQkswSXNRMEZCUXl4RFFVRkRPMGxCUTNwRUxFTkJRVU03U1VGRlJDeEpRVUZKTEZOQlFWTXNSMEZCUnl4WFFVRlhMRU5CUVVNc1RVRkJUU3hGUVVGRkxGRkJRVkVzUTBGQlF5eERRVUZETzBsQlF6bERMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTXNRMEZCUXp0UlFVTmlMRTFCUVUwc1EwRkJReXh2UWtGQldTeERRVUZETEV0QlFVc3NSVUZCUlN4UlFVRlJMRU5CUVVNc1EwRkJRenRKUVVONlF5eERRVUZETzBsQlEwUXNVVUZCVVN4RFFVRkRMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzWVVGQllTeERRVUZETEZGQlFWRXNRMEZCUXl4TlFVRk5MRU5CUVVNc1MwRkJTeXhGUVVGRkxFMUJRVTBzUTBGQlF5eERRVUZETzBsQlEzWkZMRTFCUVUwc1EwRkJReXh2UWtGQldTeERRVUZETEVsQlFVa3NSVUZCUlN4UlFVRlJMRU5CUVVNc1EwRkJRenRCUVVONFF5eERRVUZETEVOQlFVTTdRVUZSUml4M1FrRkJLMElzVVVGQmQwSTdTVUZEYmtRc1NVRkJTU3hoUVVGaExFZEJRVWNzVVVGQlVTeERRVUZETEUxQlFVMHNRMEZCUXl4TFFVRkxMRU5CUVVNc1VVRkJVU3hEUVVGRExFMUJRVTBzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0SlFVVnVSU3hOUVVGTkxFTkJRVU1zWVVGQllTeEpRVUZKTEVOQlFVTXNSMEZCUnl4WFFVRlhMRU5CUVVNc1lVRkJZU3hGUVVGRkxGRkJRVkVzUTBGQlF5eEhRVUZITEZOQlFWTXNRMEZCUXp0QlFVTnFSaXhEUVVGRE8wRkJTbVVzYzBKQlFXTXNhVUpCU1RkQ0xFTkJRVUU3UVVGRlJDeHhRa0ZCTkVJc1YwRkJWeXhGUVVGRkxGRkJRWGRDTzBsQlF6ZEVMRTFCUVUwc1EwRkJReXhSUVVGUkxFTkJRVU1zU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4WFFVRlhMRU5CUVVNc1EwRkJRenRCUVVNeFF5eERRVUZETzBGQlJtVXNiVUpCUVZjc1kwRkZNVUlzUTBGQlFUdEJRVTFFTEVsQlFVMHNUVUZCVFN4SFFVRkhMRlZCUVVNc1VVRkJkMEk3U1VGRGNFTXNUVUZCVFN4RFFVRkRMRkZCUVZFc1EwRkJReXhOUVVGTkxFTkJRVU1zUzBGQlN5eERRVUZETEUxQlFVMHNRMEZCUXp0QlFVTjRReXhEUVVGRExFTkJRVU03UVVGWlJpeDFRa0ZCZFVJc1MwRkJhVUlzUlVGQlJTeGhRVUZoTzBsQlEyNUVMRWxCUVVrc1VVRkJVU3hIUVVGSExFTkJRVU1zUTBGQlF6dEpRVU5xUWl4SlFVRkpMRkZCUVZFc1IwRkJSeXhMUVVGTExFTkJRVU1zVFVGQlRTeEhRVUZITEVOQlFVTXNRMEZCUXp0SlFVTm9ReXhKUVVGSkxGbEJRVmtzUTBGQlF6dEpRVU5xUWl4SlFVRkpMR05CUVdNc1EwRkJRenRKUVVWdVFpeFBRVUZQTEZGQlFWRXNTVUZCU1N4UlFVRlJMRVZCUVVVc1EwRkJRenRSUVVNeFFpeFpRVUZaTEVkQlFVY3NRMEZCUXl4UlFVRlJMRWRCUVVjc1VVRkJVU3hEUVVGRExFZEJRVWNzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXp0UlFVTTNReXhqUVVGakxFZEJRVWNzUzBGQlN5eERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRPMUZCUlhKRExFVkJRVVVzUTBGQlF5eERRVUZETEdOQlFXTXNSMEZCUnl4aFFVRmhMRU5CUVVNc1EwRkJReXhEUVVGRE8xbEJRMnBETEZGQlFWRXNSMEZCUnl4WlFVRlpMRWRCUVVjc1EwRkJReXhEUVVGRE8xRkJRMmhETEVOQlFVTTdVVUZEUkN4SlFVRkpMRU5CUVVNc1JVRkJSU3hEUVVGRExFTkJRVU1zWTBGQll5eEhRVUZITEdGQlFXRXNRMEZCUXl4RFFVRkRMRU5CUVVNN1dVRkRkRU1zVVVGQlVTeEhRVUZITEZsQlFWa3NSMEZCUnl4RFFVRkRMRU5CUVVNN1VVRkRhRU1zUTBGQlF6dFJRVU5FTEVsQlFVa3NRMEZCUXl4RFFVRkRPMWxCUTBZc1RVRkJUU3hEUVVGRExGbEJRVmtzUTBGQlF6dFJRVU40UWl4RFFVRkRPMGxCUTB3c1EwRkJRenRCUVVkTUxFTkJRVU1pZlE9PVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi8uLi9zcmMvbG9jYXRlLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgY2FjaGVfMSA9IHJlcXVpcmUoJy4vY2FjaGUnKTtcbnZhciBDYWNoZU5vZGVfMSA9IHJlcXVpcmUoJy4vQ2FjaGVOb2RlJyk7XG52YXIgbG9jYXRlXzEgPSByZXF1aXJlKCcuL2xvY2F0ZScpO1xudmFyIG9iamVjdEFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG52YXIgX2hhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbmZ1bmN0aW9uIGlzTnVtYmVyKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgfHwgdG9TdHJpbmcodmFsdWUpID09PSBcIltvYmplY3QgTnVtYmVyXVwiO1xufVxuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xuZnVuY3Rpb24gaXNTdHJpbmcob2JqKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdzdHJpbmcnIHx8IHRvU3RyaW5nKG9iaikgPT09IFwiW29iamVjdCBTdHJpbmddXCI7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5mdW5jdGlvbiBpc09iamVjdChtaXhlZF92YXIpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG1peGVkX3ZhcikgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gbWl4ZWRfdmFyICE9PSBudWxsICYmIHR5cGVvZiBtaXhlZF92YXIgPT09ICdvYmplY3QnO1xufVxuZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuZnVuY3Rpb24gaXNBcnJheSh2YWx1ZSkge1xuICAgIGlmICghdmFsdWUgfHwgdmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWx1ZSkgfHwgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCdcbiAgICAgICAgJiYgdHlwZW9mIHZhbHVlLmxlbmd0aCA9PT0gJ251bWJlcidcbiAgICAgICAgJiYgdHlwZW9mIHZhbHVlLnNwbGljZSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICAmJiAhKHZhbHVlLnByb3BlcnR5SXNFbnVtZXJhYmxlKCdsZW5ndGgnKSkpO1xufVxuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcbmZ1bmN0aW9uIG9ialRvU3RyKG8pIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pO1xufVxuZnVuY3Rpb24gaXNEYXRlKHZhbHVlKSB7XG4gICAgcmV0dXJuIGlzT2JqZWN0KHZhbHVlKSAmJiBvYmpUb1N0cih2YWx1ZSkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xuZnVuY3Rpb24gaXNFbXB0eSh2YWx1ZSkge1xuICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChpc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2UgaWYgKCFpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKF9oYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuZXhwb3J0cy5pc0VtcHR5ID0gaXNFbXB0eTtcbmZ1bmN0aW9uIGdldE5ld0NhY2hlTm9kZShpbnN0YW5jZSkge1xuICAgIHZhciBub2RlID0gbmV3IENhY2hlTm9kZV8xLkNhY2hlTm9kZShpbnN0YW5jZS5uZXh0Tm9kZUtleSk7XG4gICAgbm9kZS5pZCA9IGluc3RhbmNlLm5leHROb2RlS2V5O1xuICAgIGluc3RhbmNlLm5leHROb2RlS2V5ICs9IDE7XG4gICAgaW5zdGFuY2UucmVwby5hZGQobm9kZSk7XG4gICAgcmV0dXJuIG5vZGU7XG59XG5leHBvcnRzLmdldE5ld0NhY2hlTm9kZSA9IGdldE5ld0NhY2hlTm9kZTtcbmZ1bmN0aW9uIGhhc1VpZChvYmopIHtcbiAgICBpZiAoIW9iaikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICghaXNPYmplY3Qob2JqKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb2JqW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIHVpZCA9IG9ialtjYWNoZV8xLmNvbmZpZy51aWROYW1lXTtcbiAgICByZXR1cm4gdWlkLmxlbmd0aCAhPT0gMDtcbn1cbmV4cG9ydHMuaGFzVWlkID0gaGFzVWlkO1xuO1xuZnVuY3Rpb24gZGVlcENsb25lKG9iaiwgdWlkUmVmZXJlbmNlLCBmcmVlemUpIHtcbiAgICBpZiAoZnJlZXplID09PSB2b2lkIDApIHsgZnJlZXplID0gdHJ1ZTsgfVxuICAgIGlmICghb2JqIHx8ICghaXNPYmplY3Qob2JqKSAmJiAhaXNBcnJheShvYmopKSkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBpZiAoZnJlZXplID09PSB0cnVlICYmIHVpZFJlZmVyZW5jZSAmJiAhT2JqZWN0LmlzRnJvemVuKHVpZFJlZmVyZW5jZSkpIHtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZSh1aWRSZWZlcmVuY2UpO1xuICAgIH1cbiAgICBpZiAodWlkUmVmZXJlbmNlICYmIGhhc1VpZChvYmopICYmIG9ialtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSA9PT0gdWlkUmVmZXJlbmNlW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdKSB7XG4gICAgICAgIHJldHVybiB1aWRSZWZlcmVuY2U7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBvYmplY3RBc3NpZ24oe30sIG9iaik7XG4gICAgZm9yICh2YXIgcHJvcE5hbWUgaW4gb2JqKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IG9ialtwcm9wTmFtZV07XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W3Byb3BOYW1lXSA9IGRlZXBDbG9uZUFycmF5KHZhbHVlLCB1aWRSZWZlcmVuY2UsIGZyZWV6ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh2YWx1ZS5nZXRUaW1lKCkpO1xuICAgICAgICAgICAgICAgIGlmIChmcmVlemUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmZyZWV6ZShkYXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzdWx0W3Byb3BOYW1lXSA9IGRhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoaGFzVWlkKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRbcHJvcE5hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1aWRSZWZlcmVuY2UgJiYgaGFzVWlkKHVpZFJlZmVyZW5jZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gdWlkUmVmZXJlbmNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdmFsdWUudWlkID09PSB1aWRSZWZlcmVuY2UudWlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdmFsdWUgIT09IHVpZFJlZmVyZW5jZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtwcm9wTmFtZV0gPSB1aWRSZWZlcmVuY2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtwcm9wTmFtZV0gPSBkZWVwQ2xvbmUodmFsdWUsIHVpZFJlZmVyZW5jZSwgZnJlZXplKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbcHJvcE5hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZyZWV6ZSA9PT0gdHJ1ZSAmJiAhT2JqZWN0LmlzRnJvemVuKHJlc3VsdCkpIHtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZShyZXN1bHQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZXhwb3J0cy5kZWVwQ2xvbmUgPSBkZWVwQ2xvbmU7XG5mdW5jdGlvbiBkZWVwQ2xvbmVBcnJheShhcnIsIHVpZFJlZmVyZW5jZSwgZnJlZXplKSB7XG4gICAgcmV0dXJuIGFyci5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgaWYgKGlzQXJyYXkoaXRlbSkpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWVwQ2xvbmVBcnJheShpdGVtLCB1aWRSZWZlcmVuY2UsIGZyZWV6ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaXNPYmplY3QoaXRlbSkpIHtcbiAgICAgICAgICAgIGlmIChoYXNVaWQoaXRlbSkpIHtcbiAgICAgICAgICAgICAgICBpZiAodWlkUmVmZXJlbmNlICYmIChpdGVtW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdID09PSB1aWRSZWZlcmVuY2VbY2FjaGVfMS5jb25maWcudWlkTmFtZV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1aWRSZWZlcmVuY2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZXBDbG9uZShpdGVtLCB1aWRSZWZlcmVuY2UsIGZyZWV6ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuZXhwb3J0cy5jYWNoZVNpemUgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICB2YXIgY2FjaGVOb2RlID0gbG9jYXRlXzEuZ2V0Q3VycmVudE5vZGUoaW5zdGFuY2UpO1xuICAgIHJldHVybiBjYWNoZU5vZGUgPyBjYWNoZU5vZGUuaXRlbXMuc2l6ZSgpIDogMDtcbn07XG5leHBvcnRzLmNhY2hlTGVuZ3RoID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLnRocmVhZC5ub2Rlcy5sZW5ndGg7XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZFhScGJDNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5MWRHbHNMblJ6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3UVVGRFFTeHpRa0ZCYTBNc1UwRkJVeXhEUVVGRExFTkJRVUU3UVVGRE5VTXNNRUpCUVhORExHRkJRV0VzUTBGQlF5eERRVUZCTzBGQlEzQkVMSFZDUVVFclFpeFZRVUZWTEVOQlFVTXNRMEZCUVR0QlFVVXhReXhKUVVGTkxGbEJRVmtzUjBGQlJ5eFBRVUZQTEVOQlFVTXNaVUZCWlN4RFFVRkRMRU5CUVVNN1FVRkZPVU1zU1VGQlRTeFJRVUZSTEVkQlFWRXNUVUZCVFN4RFFVRkRMRk5CUVZNc1EwRkJReXhSUVVGUkxFTkJRVU03UVVGRGFFUXNTVUZCU1N4bFFVRmxMRWRCUVVjc1RVRkJUU3hEUVVGRExGTkJRVk1zUTBGQlF5eGpRVUZqTEVOQlFVTTdRVUZGZEVRc2EwSkJRWGxDTEV0QlFVczdTVUZETVVJc1RVRkJUU3hEUVVGRExFOUJRVThzUzBGQlN5eExRVUZMTEZGQlFWRXNTVUZCU1N4UlFVRlJMRU5CUVVNc1MwRkJTeXhEUVVGRExFdEJRVXNzYVVKQlFXbENMRU5CUVVNN1FVRkRPVVVzUTBGQlF6dEJRVVpsTEdkQ1FVRlJMRmRCUlhaQ0xFTkJRVUU3UVVGRlJDeHJRa0ZCZVVJc1IwRkJSenRKUVVONFFpeE5RVUZOTEVOQlFVTXNUMEZCVHl4SFFVRkhMRXRCUVVzc1VVRkJVU3hKUVVGSkxGRkJRVkVzUTBGQlF5eEhRVUZITEVOQlFVTXNTMEZCU3l4cFFrRkJhVUlzUTBGQlF6dEJRVU14UlN4RFFVRkRPMEZCUm1Vc1owSkJRVkVzVjBGRmRrSXNRMEZCUVR0QlFVOUVMR3RDUVVGNVFpeFRRVUZUTzBsQlF6bENMRVZCUVVVc1EwRkJReXhEUVVGRExFMUJRVTBzUTBGQlF5eFRRVUZUTEVOQlFVTXNVVUZCVVN4RFFVRkRMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zUzBGQlN5eG5Ra0ZCWjBJc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRGFrVXNUVUZCVFN4RFFVRkRMRXRCUVVzc1EwRkJRenRKUVVOcVFpeERRVUZETzBsQlNVUXNUVUZCVFN4RFFVRkRMRk5CUVZNc1MwRkJTeXhKUVVGSkxFbEJRVWtzVDBGQlR5eFRRVUZUTEV0QlFVc3NVVUZCVVN4RFFVRkRPMEZCUXk5RUxFTkJRVU03UVVGU1pTeG5Ra0ZCVVN4WFFWRjJRaXhEUVVGQk8wRkJTMFFzYVVKQlFYZENMRXRCUVVzN1NVRkZla0lzUlVGQlJTeERRVUZETEVOQlFVTXNRMEZCUXl4TFFVRkxMRWxCUVVrc1MwRkJTeXhMUVVGTExFbEJRVWtzUTBGQlF5eERRVUZETEVOQlFVTTdVVUZETTBJc1RVRkJUU3hEUVVGRExFdEJRVXNzUTBGQlF6dEpRVU5xUWl4RFFVRkRPMGxCUjBRc1RVRkJUU3hEUVVGRExFdEJRVXNzUTBGQlF5eFBRVUZQTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWxCUVVrc1EwRkRNMElzUzBGQlN5eEpRVUZKTEU5QlFVOHNTMEZCU3l4TFFVRkxMRkZCUVZFN1YwRkRMMElzVDBGQlR5eExRVUZMTEVOQlFVTXNUVUZCVFN4TFFVRkxMRkZCUVZFN1YwRkRhRU1zVDBGQlR5eExRVUZMTEVOQlFVTXNUVUZCVFN4TFFVRkxMRlZCUVZVN1YwRkRiRU1zUTBGQlF5eERRVUZETEV0QlFVc3NRMEZCUXl4dlFrRkJiMElzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXl4RFFVTTNReXhEUVVGRE8wRkJRMDRzUTBGQlF6dEJRV0psTEdWQlFVOHNWVUZoZEVJc1EwRkJRVHRCUVU5RUxHdENRVUZyUWl4RFFVRkRPMGxCUTJZc1RVRkJUU3hEUVVGRExFMUJRVTBzUTBGQlF5eFRRVUZUTEVOQlFVTXNVVUZCVVN4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU0zUXl4RFFVRkRPMEZCVDBRc1owSkJRWFZDTEV0QlFVczdTVUZEZUVJc1RVRkJUU3hEUVVGRExGRkJRVkVzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4UlFVRlJMRU5CUVVNc1MwRkJTeXhEUVVGRExFdEJRVXNzWlVGQlpTeERRVUZETzBGQlEyeEZMRU5CUVVNN1FVRkdaU3hqUVVGTkxGTkJSWEpDTEVOQlFVRTdRVUZGUkN4cFFrRkJkMElzUzBGQlN6dEpRVU42UWl4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTTdVVUZEVkN4TlFVRk5MRU5CUVVNc1NVRkJTU3hEUVVGRE8wbEJRMmhDTEVOQlFVTTdTVUZEUkN4RlFVRkZMRU5CUVVNc1EwRkJReXhQUVVGUExFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NTMEZCU3l4RFFVRkRMRTFCUVUwc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzFGQlEzWkRMRTFCUVUwc1EwRkJReXhKUVVGSkxFTkJRVU03U1VGRGFFSXNRMEZCUXp0SlFVRkRMRWxCUVVrc1EwRkJReXhGUVVGRkxFTkJRVU1zUTBGQlF5eERRVUZETEZGQlFWRXNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRE1VSXNSMEZCUnl4RFFVRkRMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXp0WlFVTnNRaXhGUVVGRkxFTkJRVU1zUTBGQlF5eGxRVUZsTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1JVRkJSU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdaMEpCUTJwRExFMUJRVTBzUTBGQlF5eExRVUZMTEVOQlFVTTdXVUZEYWtJc1EwRkJRenRSUVVOTUxFTkJRVU03VVVGRFJDeE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRPMGxCUTJoQ0xFTkJRVU03U1VGRFJDeE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRPMEZCUTJwQ0xFTkJRVU03UVVGbVpTeGxRVUZQTEZWQlpYUkNMRU5CUVVFN1FVRlBSQ3g1UWtGQlowTXNVVUZCZDBJN1NVRkRjRVFzU1VGQlNTeEpRVUZKTEVkQlFXVXNTVUZCU1N4eFFrRkJVeXhEUVVGRExGRkJRVkVzUTBGQlF5eFhRVUZYTEVOQlFVTXNRMEZCUVR0SlFVTXhSQ3hKUVVGSkxFTkJRVU1zUlVGQlJTeEhRVUZITEZGQlFWRXNRMEZCUXl4WFFVRlhMRU5CUVVNN1NVRkRMMElzVVVGQlVTeERRVUZETEZkQlFWY3NTVUZCU1N4RFFVRkRMRU5CUVVNN1NVRkRNVUlzVVVGQlVTeERRVUZETEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03U1VGRGVFSXNUVUZCVFN4RFFVRkRMRWxCUVVrc1EwRkJRenRCUVVOb1FpeERRVUZETzBGQlRtVXNkVUpCUVdVc2EwSkJUVGxDTEVOQlFVRTdRVUZGUkN4blFrRkJkVUlzUjBGQlJ6dEpRVU4wUWl4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTTdVVUZEVUN4TlFVRk5MRU5CUVVNc1MwRkJTeXhEUVVGRE8wbEJRMnBDTEVOQlFVTTdTVUZEUkN4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVGRExGRkJRVkVzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRha0lzVFVGQlRTeERRVUZETEV0QlFVc3NRMEZCUXp0SlFVTnFRaXhEUVVGRE8wbEJRMFFzUlVGQlJTeERRVUZETEVOQlFVTXNUMEZCVHl4SFFVRkhMRU5CUVVNc1kwRkJUU3hEUVVGRExFOUJRVThzUTBGQlF5eExRVUZMTEZkQlFWY3NRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkROME1zVFVGQlRTeERRVUZETEV0QlFVc3NRMEZCUXp0SlFVTnFRaXhEUVVGRE8wbEJRMFFzU1VGQlNTeEhRVUZITEVkQlFVY3NSMEZCUnl4RFFVRkRMR05CUVUwc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEpRVU01UWl4TlFVRk5MRU5CUVVNc1IwRkJSeXhEUVVGRExFMUJRVTBzUzBGQlN5eERRVUZETEVOQlFVTTdRVUZETlVJc1EwRkJRenRCUVZwbExHTkJRVTBzVTBGWmNrSXNRMEZCUVR0QlFVRkJMRU5CUVVNN1FVRlZSaXh0UWtGQk1FSXNSMEZCUnl4RlFVRkZMRmxCUVdFc1JVRkJSU3hOUVVGaE8wbEJRV0lzYzBKQlFXRXNSMEZCWWl4aFFVRmhPMGxCUTNaRUxFVkJRVVVzUTBGQlF5eERRVUZETEVOQlFVTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1EwRkJReXhSUVVGUkxFTkJRVU1zUjBGQlJ5eERRVUZETEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdVVUZETlVNc1RVRkJUU3hEUVVGRExFZEJRVWNzUTBGQlF6dEpRVU5tTEVOQlFVTTdTVUZGUkN4RlFVRkZMRU5CUVVNc1EwRkJReXhOUVVGTkxFdEJRVXNzU1VGQlNTeEpRVUZKTEZsQlFWa3NTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJReXhSUVVGUkxFTkJRVU1zV1VGQldTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMUZCUTNCRkxFMUJRVTBzUTBGQlF5eE5RVUZOTEVOQlFVTXNXVUZCV1N4RFFVRkRMRU5CUVVNN1NVRkRhRU1zUTBGQlF6dEpRVWRFTEVWQlFVVXNRMEZCUXl4RFFVRkRMRmxCUVZrc1NVRkJTU3hOUVVGTkxFTkJRVU1zUjBGQlJ5eERRVUZETEVsQlFVa3NSMEZCUnl4RFFVRkRMR05CUVUwc1EwRkJReXhQUVVGUExFTkJRVU1zUzBGQlN5eFpRVUZaTEVOQlFVTXNZMEZCVFN4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dFJRVU4wUml4TlFVRk5MRU5CUVVNc1dVRkJXU3hEUVVGRE8wbEJRM2hDTEVOQlFVTTdTVUZIUkN4SlFVRkpMRTFCUVUwc1IwRkJSeXhaUVVGWkxFTkJRVU1zUlVGQlJTeEZRVUZGTEVkQlFVY3NRMEZCUXl4RFFVRkRPMGxCUTI1RExFZEJRVWNzUTBGQlF5eERRVUZETEVsQlFVa3NVVUZCVVN4SlFVRkpMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRmRrSXNTVUZCU1N4TFFVRkxMRWRCUVVjc1IwRkJSeXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETzFGQlF6RkNMRVZCUVVVc1EwRkJReXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTTdXVUZEVWl4RlFVRkZMRU5CUVVNc1EwRkJReXhQUVVGUExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMmRDUVVOcVFpeE5RVUZOTEVOQlFVTXNVVUZCVVN4RFFVRkRMRWRCUVVjc1kwRkJZeXhEUVVGRExFdEJRVXNzUlVGQlJTeFpRVUZaTEVWQlFVVXNUVUZCVFN4RFFVRkRMRU5CUVVNN1dVRkRia1VzUTBGQlF6dFpRVUZETEVsQlFVa3NRMEZCUXl4RlFVRkZMRU5CUVVNc1EwRkJReXhOUVVGTkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMmRDUVVOMlFpeEpRVUZKTEVsQlFVa3NSMEZCUnl4SlFVRkpMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVDBGQlR5eEZRVUZGTEVOQlFVTXNRMEZCUXp0blFrRkRja01zUlVGQlJTeERRVUZETEVOQlFVTXNUVUZCVFN4TFFVRkxMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU03YjBKQlEyeENMRTFCUVUwc1EwRkJReXhOUVVGTkxFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdaMEpCUTNoQ0xFTkJRVU03WjBKQlEwUXNUVUZCVFN4RFFVRkRMRkZCUVZFc1EwRkJReXhIUVVGSExFbEJRVWtzUTBGQlF6dFpRVU0xUWl4RFFVRkRPMWxCUVVNc1NVRkJTU3hEUVVGRExFVkJRVVVzUTBGQlF5eERRVUZETEZGQlFWRXNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03WjBKQlEzcENMRVZCUVVVc1EwRkJReXhEUVVGRExFMUJRVTBzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN2IwSkJRMmhDTEUxQlFVMHNRMEZCUXl4UlFVRlJMRU5CUVVNc1IwRkJSeXhMUVVGTExFTkJRVU03YjBKQlEzcENMRVZCUVVVc1EwRkJReXhEUVVGRExGbEJRVmtzU1VGQlNTeE5RVUZOTEVOQlFVTXNXVUZCV1N4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8zZENRVU4yUXl4RlFVRkZMRU5CUVVNc1EwRkJReXhMUVVGTExFdEJRVXNzV1VGQldUc3JRa0ZEYmtJc1MwRkJTeXhEUVVGRExFZEJRVWNzUzBGQlN5eFpRVUZaTEVOQlFVTXNSMEZCUnpzclFrRkRPVUlzUzBGQlN5eExRVUZMTEZsQlFWa3NRMEZCUXl4RFFVRkRMRU5CUVVNN05FSkJRelZDTEUxQlFVMHNRMEZCUXl4UlFVRlJMRU5CUVVNc1IwRkJSeXhaUVVGWkxFTkJRVU03ZDBKQlEzQkRMRU5CUVVNN2IwSkJRMHdzUTBGQlF6dHZRa0ZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenR2UWtGSFVpeERRVUZETzJkQ1FVTk1MRU5CUVVNN1owSkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdiMEpCUTBvc1RVRkJUU3hEUVVGRExGRkJRVkVzUTBGQlF5eEhRVUZITEZOQlFWTXNRMEZCUXl4TFFVRkxMRVZCUVVVc1dVRkJXU3hGUVVGRkxFMUJRVTBzUTBGQlF5eERRVUZETzJkQ1FVTTVSQ3hEUVVGRE8xbEJRMHdzUTBGQlF6dFpRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMmRDUVVWS0xFMUJRVTBzUTBGQlF5eFJRVUZSTEVOQlFVTXNSMEZCUnl4TFFVRkxMRU5CUVVNN1dVRkROMElzUTBGQlF6dFJRVU5NTEVOQlFVTTdTVUZGVEN4RFFVRkRPMGxCUTBRc1JVRkJSU3hEUVVGRExFTkJRVU1zVFVGQlRTeExRVUZMTEVsQlFVa3NTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJReXhSUVVGUkxFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMUZCUXpsRExFMUJRVTBzUTBGQlF5eE5RVUZOTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1NVRkRNVUlzUTBGQlF6dEpRVU5FTEUxQlFVMHNRMEZCUXl4TlFVRk5MRU5CUVVNN1FVRkRiRUlzUTBGQlF6dEJRWFpFWlN4cFFrRkJVeXhaUVhWRWVFSXNRMEZCUVR0QlFVVkVMSGRDUVVGM1FpeEhRVUZITEVWQlFVVXNXVUZCV1N4RlFVRkZMRTFCUVUwN1NVRkROME1zVFVGQlRTeERRVUZETEVkQlFVY3NRMEZCUXl4SFFVRkhMRU5CUVVNc1ZVRkJRU3hKUVVGSk8xRkJRMllzUlVGQlJTeERRVUZETEVOQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dFpRVU5vUWl4TlFVRk5MRU5CUVVNc1kwRkJZeXhEUVVGRExFbEJRVWtzUlVGQlJTeFpRVUZaTEVWQlFVVXNUVUZCVFN4RFFVRkRMRU5CUVVNN1VVRkRkRVFzUTBGQlF6dFJRVUZETEVsQlFVa3NRMEZCUXl4RlFVRkZMRU5CUVVNc1EwRkJReXhSUVVGUkxFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMWxCUlhoQ0xFVkJRVVVzUTBGQlF5eERRVUZETEUxQlFVMHNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03WjBKQlEyWXNSVUZCUlN4RFFVRkRMRU5CUVVNc1dVRkJXU3hKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEdOQlFVMHNRMEZCUXl4UFFVRlBMRU5CUVVNc1MwRkJTeXhaUVVGWkxFTkJRVU1zWTBGQlRTeERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8yOUNRVU14UlN4TlFVRk5MRU5CUVVNc1dVRkJXU3hEUVVGRE8yZENRVU40UWl4RFFVRkRPMmRDUVVORUxFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTTdXVUZEYUVJc1EwRkJRenRaUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzJkQ1FVTktMRTFCUVUwc1EwRkJReXhUUVVGVExFTkJRVU1zU1VGQlNTeEZRVUZGTEZsQlFWa3NSVUZCUlN4TlFVRk5MRU5CUVVNc1EwRkJRenRaUVVOcVJDeERRVUZETzFGQlEwd3NRMEZCUXp0UlFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8xbEJRMG9zVFVGQlRTeERRVUZETEVsQlFVa3NRMEZCUXp0UlFVTm9RaXhEUVVGRE8wbEJRMHdzUTBGQlF5eERRVUZETEVOQlFVTTdRVUZEVUN4RFFVRkRPMEZCUlZrc2FVSkJRVk1zUjBGQlJ5eFZRVUZETEZGQlFYZENPMGxCUXpsRExFbEJRVWtzVTBGQlV5eEhRVUZITEhWQ1FVRmpMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03U1VGRGVrTXNUVUZCVFN4RFFVRkRMRk5CUVZNc1IwRkJSeXhUUVVGVExFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NSVUZCUlN4SFFVRkhMRU5CUVVNc1EwRkJRenRCUVVOc1JDeERRVUZETEVOQlFVRTdRVUZGV1N4dFFrRkJWeXhIUVVGSExGVkJRVU1zVVVGQmQwSTdTVUZEYUVRc1RVRkJUU3hEUVVGRExGRkJRVkVzUTBGQlF5eE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTFCUVUwc1EwRkJRenRCUVVONFF5eERRVUZETEVOQlFVRWlmUT09XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uLy4uL3NyYy91dGlsLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQ2FjaGVNYXBfMSA9IHJlcXVpcmUoJy4vQ2FjaGVNYXAnKTtcbnZhciBDYWNoZU5vZGUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENhY2hlTm9kZShub2RlSWQpIHtcbiAgICAgICAgdGhpcy5pdGVtcyA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5pZCA9IG5vZGVJZDtcbiAgICB9XG4gICAgcmV0dXJuIENhY2hlTm9kZTtcbn0oKSk7XG5leHBvcnRzLkNhY2hlTm9kZSA9IENhY2hlTm9kZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaVEyRmphR1ZPYjJSbExtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTGk0dkxpNHZjM0pqTDBOaFkyaGxUbTlrWlM1MGN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU8wRkJRVUVzZVVKQlFYRkNMRmxCUVZrc1EwRkJReXhEUVVGQk8wRkJXV3hETzBsQlIwa3NiVUpCUVZrc1RVRkJZenRSUVVReFFpeFZRVUZMTEVkQlFYZENMRWxCUVVrc2EwSkJRVkVzUlVGQllTeERRVUZETzFGQlJXNUVMRWxCUVVrc1EwRkJReXhGUVVGRkxFZEJRVWNzVFVGQlRTeERRVUZETzBsQlEzSkNMRU5CUVVNN1NVRkRUQ3huUWtGQlF6dEJRVUZFTEVOQlFVTXNRVUZPUkN4SlFVMURPMEZCVGxrc2FVSkJRVk1zV1VGTmNrSXNRMEZCUVNKOVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi8uLi9zcmMvQ2FjaGVOb2RlLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgZmx1c2hfMSA9IHJlcXVpcmUoJy4vZmx1c2gnKTtcbnZhciBjYWNoZV8xID0gcmVxdWlyZSgnLi9jYWNoZScpO1xudmFyIG9wYXRoID0gcmVxdWlyZSgnLi9wYXRoJyk7XG52YXIgZ2V0XzEgPSByZXF1aXJlKCcuL2dldCcpO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuZXhwb3J0cy5hc3NpZ25SZWZUb1BhcmVudCA9IGZ1bmN0aW9uIChyZWZJdGVtLCBmbHVzaEFyZ3MpIHtcbiAgICBpZiAoZmx1c2hBcmdzLnBhcmVudFVpZCkge1xuICAgICAgICB2YXIgcGFyZW50SXRlbSA9IGZsdXNoXzEuZ2V0SXRlbUZsdXNoT3JDYWNoZWQoZmx1c2hBcmdzLnBhcmVudFVpZCwgZmx1c2hBcmdzKTtcbiAgICAgICAgaWYgKHBhcmVudEl0ZW0gJiYgZmx1c2hBcmdzLnJlZlBhdGgpIHtcbiAgICAgICAgICAgIGFzc2lnblJlZnMocGFyZW50SXRlbSwgcmVmSXRlbSwgZmx1c2hBcmdzLnJlZlBhdGgpO1xuICAgICAgICB9XG4gICAgfVxufTtcbnZhciBhc3NpZ25SZWZzID0gZnVuY3Rpb24gKHBhcmVudEl0ZW0sIHJlZkl0ZW0sIHJlZlBhdGgpIHtcbiAgICB2YXIgcGFyZW50VWlkID0gcGFyZW50SXRlbS5lbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV07XG4gICAgdmFyIHJlZlVpZCA9IHJlZkl0ZW0uZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgIGFkZFJlZlRvKHBhcmVudEl0ZW0sIHJlZlVpZCwgcmVmUGF0aCk7XG4gICAgYWRkUmVmRnJvbShyZWZJdGVtLCBwYXJlbnRVaWQsIHJlZlBhdGgpO1xufTtcbnZhciBhZGRSZWZUbyA9IGZ1bmN0aW9uIChwYXJlbnRJdGVtLCByZWZVaWQsIHBhdGgpIHtcbiAgICBpZiAocGFyZW50SXRlbS5tYXBUby5oYXMocmVmVWlkKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcGFyZW50SXRlbS5tYXBUby5zZXQocmVmVWlkLCBbXSk7XG4gICAgfVxuICAgIHZhciByZWZBcnJheSA9IHBhcmVudEl0ZW0ubWFwVG8uZ2V0KHJlZlVpZCk7XG4gICAgaWYgKHJlZkFycmF5LmluZGV4T2YocGF0aCkgPCAwKSB7XG4gICAgICAgIHJlZkFycmF5LnB1c2gocGF0aCk7XG4gICAgfVxuICAgIHJldHVybiBwYXJlbnRJdGVtO1xufTtcbnZhciBhZGRSZWZGcm9tID0gZnVuY3Rpb24gKHJlZkl0ZW0sIHBhcmVudFVpZCwgcGF0aCkge1xuICAgIGlmIChyZWZJdGVtLm1hcEZyb20uaGFzKHBhcmVudFVpZCkgPT09IGZhbHNlKSB7XG4gICAgICAgIHJlZkl0ZW0ubWFwRnJvbS5zZXQocGFyZW50VWlkLCBbXSk7XG4gICAgfVxuICAgIHZhciBmcm9tQXJyYXkgPSByZWZJdGVtLm1hcEZyb20uZ2V0KHBhcmVudFVpZCk7XG4gICAgaWYgKGZyb21BcnJheS5pbmRleE9mKHBhdGgpIDwgMCkge1xuICAgICAgICBmcm9tQXJyYXkucHVzaChwYXRoKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlZkl0ZW07XG59O1xuZXhwb3J0cy51cGRhdGVQb2ludGVycyA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICBmbHVzaEFyZ3MuZmx1c2hNYXAuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgIHVwZGF0ZUl0ZW1SZWZUb3MoaXRlbSwgZmx1c2hBcmdzKTtcbiAgICAgICAgZXhwb3J0cy51cGRhdGVSZWZGcm9tcyhpdGVtLCBmbHVzaEFyZ3MpO1xuICAgIH0pO1xufTtcbmV4cG9ydHMudXBkYXRlUmVmRnJvbXMgPSBmdW5jdGlvbiAoaXRlbSwgZmx1c2hBcmdzKSB7XG4gICAgaXRlbS5tYXBGcm9tLmZvckVhY2goZnVuY3Rpb24gKHBhcmVudFVpZCwgcGF0aHMpIHtcbiAgICAgICAgdmFyIHBhcmVudEl0ZW0gPSBmbHVzaEFyZ3MuZmx1c2hNYXAuZ2V0KHBhcmVudFVpZCk7XG4gICAgICAgIGlmICghcGFyZW50SXRlbSkge1xuICAgICAgICAgICAgcGFyZW50SXRlbSA9IGdldF8xLmdldENhY2hlZEl0ZW0ocGFyZW50VWlkLCBmbHVzaEFyZ3MuaW5zdGFuY2UpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJlbnRJdGVtICYmIHBhdGhzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciBmaXJzdFBhdGggPSBwYXRoc1swXTtcbiAgICAgICAgICAgIHZhciB0YXJnZXRSZWYgPSBvcGF0aC5nZXQocGFyZW50SXRlbS5lbnRpdHksIGZpcnN0UGF0aCk7XG4gICAgICAgICAgICB2YXIgZGlydHkgPSAodGFyZ2V0UmVmICYmIHRhcmdldFJlZiAhPT0gaXRlbS5lbnRpdHkpO1xuICAgICAgICAgICAgaWYgKGRpcnR5ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSB7XG4gICAgICAgICAgICAgICAgICAgIGVudGl0eTogcGFyZW50SXRlbS5lbnRpdHksXG4gICAgICAgICAgICAgICAgICAgIGZsdXNoTWFwOiBmbHVzaEFyZ3MuZmx1c2hNYXAsXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlOiBmbHVzaEFyZ3MuaW5zdGFuY2VcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHBhcmVudEl0ZW0gPSBmbHVzaF8xLmVuc3VyZUl0ZW0oYXJncyk7XG4gICAgICAgICAgICAgICAgcGFyZW50SXRlbS5lbnRpdHkgPSB1dGlsXzEuZGVlcENsb25lKHBhcmVudEl0ZW0uZW50aXR5LCBpdGVtLmVudGl0eSwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5leHBvcnRzLnVwZGF0ZVJlZlRvcyA9IGZ1bmN0aW9uIChlbnRpdHlVaWQsIGZsdXNoQXJncykge1xuICAgIHZhciBpdGVtID0gZmx1c2hfMS5nZXRJdGVtRmx1c2hPckNhY2hlZChlbnRpdHlVaWQsIGZsdXNoQXJncyk7XG4gICAgdXBkYXRlSXRlbVJlZlRvcyhpdGVtLCBmbHVzaEFyZ3MpO1xufTtcbnZhciB1cGRhdGVJdGVtUmVmVG9zID0gZnVuY3Rpb24gKGl0ZW0sIGZsdXNoQXJncykge1xuICAgIGlmIChpdGVtKSB7XG4gICAgICAgIGl0ZW0ubWFwVG8uZm9yRWFjaChmdW5jdGlvbiAodG9VaWQsIHBhdGhzKSB7XG4gICAgICAgICAgICB2YXIgdXBkYXRlZFBhdGhzID0gcGF0aHMubWFwKGZ1bmN0aW9uIChwYXRoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlZmVyZW5jZSA9IG9wYXRoLmdldChpdGVtLmVudGl0eSwgcGF0aCk7XG4gICAgICAgICAgICAgICAgaWYgKHJlZmVyZW5jZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0VWlkID0gcmVmZXJlbmNlW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0VWlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZm91bmQgPSB0YXJnZXRVaWQgPT0gdG9VaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZm91bmQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGF0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZW1vdmVSZWZGcm9tX1ZhbHVlKGl0ZW0uZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdLCB0b1VpZCwgZmx1c2hBcmdzKTtcbiAgICAgICAgICAgIH0pLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtICE9PSBudWxsICYmIGl0ZW0gIT09IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHVwZGF0ZWRQYXRocy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgaXRlbS5tYXBUby5zZXQodG9VaWQsIHVwZGF0ZWRQYXRocyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpdGVtLm1hcFRvLmRlbGV0ZSh0b1VpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG52YXIgcmVtb3ZlUmVmRnJvbV9WYWx1ZSA9IGZ1bmN0aW9uIChwYXJlbnRVaWQsIHJlZlVpZCwgZmx1c2hBcmdzKSB7XG4gICAgdmFyIHJlZkl0ZW0gPSBmbHVzaF8xLmdldEl0ZW1GbHVzaE9yQ2FjaGVkKHJlZlVpZCwgZmx1c2hBcmdzKTtcbiAgICBpZiAocmVmSXRlbSkge1xuICAgICAgICByZWZJdGVtID0gcmVmSXRlbS5jbG9uZSgpO1xuICAgICAgICBpZiAocmVmSXRlbS5tYXBGcm9tLmhhcyhwYXJlbnRVaWQpKSB7XG4gICAgICAgICAgICByZW1vdmVSZWZGcm9tKHJlZkl0ZW0sIHBhcmVudFVpZCwgZmx1c2hBcmdzLnJlZlBhdGgpO1xuICAgICAgICAgICAgaWYgKHJlZkl0ZW0ubWFwRnJvbS5zaXplKCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZXZpY3RNYXAuc2V0KHJlZlVpZCwgcmVmSXRlbSk7XG4gICAgICAgICAgICAgICAgZmx1c2hBcmdzLmZsdXNoTWFwLmRlbGV0ZShyZWZVaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZmx1c2hBcmdzLmZsdXNoTWFwLnNldChyZWZVaWQsIHJlZkl0ZW0pO1xuICAgICAgICAgICAgICAgIGZsdXNoQXJncy5ldmljdE1hcC5kZWxldGUocmVmVWlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG52YXIgcmVtb3ZlUmVmRnJvbSA9IGZ1bmN0aW9uIChpdGVtLCBwYXJlbnRVaWQsIHBhdGgpIHtcbiAgICB2YXIgcmVmc0FycmF5ID0gaXRlbS5tYXBGcm9tLmdldChwYXJlbnRVaWQpO1xuICAgIHZhciBpbmRleCA9IHJlZnNBcnJheS5pbmRleE9mKHBhdGgpO1xuICAgIHJlZnNBcnJheSA9IHJlZnNBcnJheS5zbGljZSgpO1xuICAgIHJlZnNBcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIGl0ZW0ubWFwRnJvbS5zZXQocGFyZW50VWlkLCByZWZzQXJyYXkpO1xuICAgIGlmIChyZWZzQXJyYXkubGVuZ3RoID09IDApIHtcbiAgICAgICAgaXRlbS5tYXBGcm9tLmRlbGV0ZShwYXJlbnRVaWQpO1xuICAgIH1cbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2ljbVZtTG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhNaU9sc2lMaTR2TGk0dmMzSmpMM0psWmk1MGN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU8wRkJRVUVzYzBKQlFXbEVMRk5CUVZNc1EwRkJReXhEUVVGQk8wRkJSek5FTEhOQ1FVRjFRaXhUUVVGVExFTkJRVU1zUTBGQlFUdEJRVU5xUXl4SlFVRlpMRXRCUVVzc1YwRkJUU3hSUVVGUkxFTkJRVU1zUTBGQlFUdEJRVU5vUXl4dlFrRkJPRUlzVDBGQlR5eERRVUZETEVOQlFVRTdRVUZEZEVNc2NVSkJRVEJDTEZGQlFWRXNRMEZCUXl4RFFVRkJPMEZCUlhSQ0xIbENRVUZwUWl4SFFVRkhMRlZCUVVNc1QwRkJUeXhGUVVGRkxGTkJRWEZDTzBsQlF6VkVMRVZCUVVVc1EwRkJReXhEUVVGRExGTkJRVk1zUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXl4RFFVRkRPMUZCUTNSQ0xFbEJRVWtzVlVGQlZTeEhRVUZITERSQ1FVRnZRaXhEUVVGRExGTkJRVk1zUTBGQlF5eFRRVUZUTEVWQlFVVXNVMEZCVXl4RFFVRkRMRU5CUVVNN1VVRkRkRVVzUlVGQlJTeERRVUZETEVOQlFVTXNWVUZCVlN4SlFVRkpMRk5CUVZNc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF5eERRVUZETzFsQlEyeERMRlZCUVZVc1EwRkJReXhWUVVGVkxFVkJRVVVzVDBGQlR5eEZRVUZGTEZOQlFWTXNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRSUVVOMlJDeERRVUZETzBsQlEwd3NRMEZCUXp0QlFVTk1MRU5CUVVNc1EwRkJRenRCUVZOR0xFbEJRVTBzVlVGQlZTeEhRVUZITEZWQlFVTXNWVUZCY1VJc1JVRkJSU3hQUVVGclFpeEZRVUZGTEU5QlFXVTdTVUZETVVVc1NVRkJTU3hUUVVGVExFZEJRVWNzVlVGQlZTeERRVUZETEUxQlFVMHNRMEZCUXl4alFVRk5MRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03U1VGRGJFUXNTVUZCU1N4TlFVRk5MRWRCUVVjc1QwRkJUeXhEUVVGRExFMUJRVTBzUTBGQlF5eGpRVUZOTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN1NVRkhOVU1zVVVGQlVTeERRVUZETEZWQlFWVXNSVUZCUlN4TlFVRk5MRVZCUVVVc1QwRkJUeXhEUVVGRExFTkJRVU03U1VGRGRFTXNWVUZCVlN4RFFVRkRMRTlCUVU4c1JVRkJSU3hUUVVGVExFVkJRVVVzVDBGQlR5eERRVUZETEVOQlFVTTdRVUZETlVNc1EwRkJReXhEUVVGRE8wRkJWVVlzU1VGQlRTeFJRVUZSTEVkQlFVY3NWVUZCUXl4VlFVRlZMRVZCUVVVc1RVRkJUU3hGUVVGRkxFbEJRVWs3U1VGRGRFTXNSVUZCUlN4RFFVRkRMRU5CUVVNc1ZVRkJWU3hEUVVGRExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNUVUZCVFN4RFFVRkRMRXRCUVVzc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF6dFJRVU42UXl4VlFVRlZMRU5CUVVNc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eE5RVUZOTEVWQlFVVXNSVUZCUlN4RFFVRkRMRU5CUVVFN1NVRkRjRU1zUTBGQlF6dEpRVU5FTEVsQlFVa3NVVUZCVVN4SFFVRkhMRlZCUVZVc1EwRkJReXhMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMGxCUXpWRExFVkJRVVVzUTBGQlF5eERRVUZETEZGQlFWRXNRMEZCUXl4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0UlFVTTNRaXhSUVVGUkxFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMGxCUTNoQ0xFTkJRVU03U1VGRFJDeE5RVUZOTEVOQlFVTXNWVUZCVlN4RFFVRkRPMEZCUTNSQ0xFTkJRVU1zUTBGQlF6dEJRVk5HTEVsQlFVMHNWVUZCVlN4SFFVRkhMRlZCUVVNc1QwRkJUeXhGUVVGRkxGTkJRVk1zUlVGQlJTeEpRVUZKTzBsQlEzaERMRVZCUVVVc1EwRkJReXhEUVVGRExFOUJRVThzUTBGQlF5eFBRVUZQTEVOQlFVTXNSMEZCUnl4RFFVRkRMRk5CUVZNc1EwRkJReXhMUVVGTExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTTdVVUZETTBNc1QwRkJUeXhEUVVGRExFOUJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNVMEZCVXl4RlFVRkZMRVZCUVVVc1EwRkJReXhEUVVGRE8wbEJRM1pETEVOQlFVTTdTVUZEUkN4SlFVRkpMRk5CUVZNc1IwRkJSeXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVkQlFVY3NRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRKUVVNdlF5eEZRVUZGTEVOQlFVTXNRMEZCUXl4VFFVRlRMRU5CUVVNc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRPVUlzVTBGQlV5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRKUVVONlFpeERRVUZETzBsQlEwUXNUVUZCVFN4RFFVRkRMRTlCUVU4c1EwRkJRenRCUVVOdVFpeERRVUZETEVOQlFVTTdRVUZOVnl4elFrRkJZeXhIUVVGSExGVkJRVU1zVTBGQmNVSTdTVUZGYUVRc1UwRkJVeXhEUVVGRExGRkJRVkVzUTBGQlF5eFBRVUZQTEVOQlFVTXNWVUZCUXl4SFFVRkhMRVZCUVVVc1NVRkJaVHRSUVVVMVF5eG5Ra0ZCWjBJc1EwRkJReXhKUVVGSkxFVkJRVVVzVTBGQlV5eERRVUZETEVOQlFVTTdVVUZEYkVNc2MwSkJRV01zUTBGQlF5eEpRVUZKTEVWQlFVVXNVMEZCVXl4RFFVRkRMRU5CUVVNN1NVRkRjRU1zUTBGQlF5eERRVUZETEVOQlFVRTdRVUZEVGl4RFFVRkRMRU5CUVVFN1FVRkZXU3h6UWtGQll5eEhRVUZITEZWQlFVTXNTVUZCWlN4RlFVRkZMRk5CUVhGQ08wbEJRMnBGTEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExGVkJRVU1zVTBGQlV5eEZRVUZGTEV0QlFVczdVVUZEYkVNc1NVRkJTU3hWUVVGVkxFZEJRVWNzVTBGQlV5eERRVUZETEZGQlFWRXNRMEZCUXl4SFFVRkhMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03VVVGRGJrUXNSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF5eERRVUZETzFsQlEyUXNWVUZCVlN4SFFVRkhMRzFDUVVGaExFTkJRVU1zVTBGQlV5eEZRVUZGTEZOQlFWTXNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRSUVVNNVJDeERRVUZETzFGQlMwUXNSVUZCUlN4RFFVRkRMRU5CUVVNc1ZVRkJWU3hKUVVGSkxFdEJRVXNzUTBGQlF5eE5RVUZOTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRaUVVOcVF5eEpRVUZKTEZOQlFWTXNSMEZCUnl4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03V1VGRGVrSXNTVUZCU1N4VFFVRlRMRWRCUVVjc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eFZRVUZWTEVOQlFVTXNUVUZCVFN4RlFVRkZMRk5CUVZNc1EwRkJReXhEUVVGRE8xbEJSWGhFTEVsQlFVa3NTMEZCU3l4SFFVRkhMRU5CUVVNc1UwRkJVeXhKUVVGSkxGTkJRVk1zUzBGQlN5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1dVRkZja1FzUlVGQlJTeERRVUZETEVOQlFVTXNTMEZCU3l4TFFVRkxMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU03WjBKQlEycENMRWxCUVVrc1NVRkJTU3hIUVVGbE8yOUNRVU51UWl4TlFVRk5MRVZCUVVVc1ZVRkJWU3hEUVVGRExFMUJRVTA3YjBKQlEzcENMRkZCUVZFc1JVRkJSU3hUUVVGVExFTkJRVU1zVVVGQlVUdHZRa0ZETlVJc1VVRkJVU3hGUVVGRkxGTkJRVk1zUTBGQlF5eFJRVUZSTzJsQ1FVTXZRaXhEUVVGQk8yZENRVU5FTEZWQlFWVXNSMEZCUnl4clFrRkJWU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzJkQ1FVMDVRaXhWUVVGVkxFTkJRVU1zVFVGQlRTeEhRVUZITEdkQ1FVRlRMRU5CUVVNc1ZVRkJWU3hEUVVGRExFMUJRVTBzUlVGQlJTeEpRVUZKTEVOQlFVTXNUVUZCVFN4RlFVRkZMRWxCUVVrc1EwRkJReXhEUVVGRE8xbEJRM2hGTEVOQlFVTTdVVUZEVEN4RFFVRkRPMGxCUTB3c1EwRkJReXhEUVVGRExFTkJRVUU3UVVGRFRpeERRVUZETEVOQlFVRTdRVUZUV1N4dlFrRkJXU3hIUVVGSExGVkJRVU1zVTBGQlV5eEZRVUZGTEZOQlFYRkNPMGxCUTNwRUxFbEJRVWtzU1VGQlNTeEhRVUZITERSQ1FVRnZRaXhEUVVGRExGTkJRVk1zUlVGQlJTeFRRVUZUTEVOQlFVTXNRMEZCUXp0SlFVTjBSQ3huUWtGQlowSXNRMEZCUXl4SlFVRkpMRVZCUVVVc1UwRkJVeXhEUVVGRExFTkJRVU03UVVGRGRFTXNRMEZCUXl4RFFVRkRPMEZCUlVZc1NVRkJUU3huUWtGQlowSXNSMEZCUnl4VlFVRkRMRWxCUVdVc1JVRkJSU3hUUVVGeFFqdEpRVVUxUkN4RlFVRkZMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF5eERRVUZETzFGQlNWQXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGUExFTkJRVU1zVlVGQlF5eExRVUZMTEVWQlFVVXNTMEZCU3p0WlFVYzFRaXhKUVVGSkxGbEJRVmtzUjBGQlJ5eExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRlZCUVVFc1NVRkJTVHRuUWtGRE4wSXNTVUZCU1N4VFFVRlRMRWRCUVVjc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RlFVRkZMRWxCUVVrc1EwRkJReXhEUVVGRE8yZENRVU0zUXl4RlFVRkZMRU5CUVVNc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF5eERRVUZETzI5Q1FVTmFMRWxCUVVrc1UwRkJVeXhIUVVGSExGTkJRVk1zUTBGQlF5eGpRVUZOTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN2IwSkJRekZETEVWQlFVVXNRMEZCUXl4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRExFTkJRVU03ZDBKQlJWb3NTVUZCU1N4TFFVRkxMRWRCUVVjc1UwRkJVeXhKUVVGSkxFdEJRVXNzUTBGQlF6dDNRa0ZGTDBJc1JVRkJSU3hEUVVGRExFTkJRVU1zUzBGQlN5eExRVUZMTEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNN05FSkJRMnBDTEUxQlFVMHNRMEZCUXl4SlFVRkpMRU5CUVVNN2QwSkJRMmhDTEVOQlFVTTdiMEpCUTB3c1EwRkJRenRuUWtGRFRDeERRVUZETzJkQ1FVTkVMRzFDUVVGdFFpeERRVUZETEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNc1kwRkJUU3hEUVVGRExFOUJRVThzUTBGQlF5eEZRVUZGTEV0QlFVc3NSVUZCUlN4VFFVRlRMRU5CUVVNc1EwRkJRenRaUVVOMlJTeERRVUZETEVOQlFVTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1ZVRkJRU3hKUVVGSk8yZENRVU5XTEUxQlFVMHNRMEZCUXl4SlFVRkpMRXRCUVVzc1NVRkJTU3hKUVVGSkxFbEJRVWtzUzBGQlN5eFRRVUZUTEVOQlFVTTdXVUZETDBNc1EwRkJReXhEUVVGRExFTkJRVU03V1VGSFNDeEZRVUZGTEVOQlFVTXNRMEZCUXl4WlFVRlpMRU5CUVVNc1RVRkJUU3hIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdaMEpCUXpGQ0xFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRXRCUVVzc1JVRkJSU3haUVVGWkxFTkJRVU1zUTBGQlF6dFpRVU40UXl4RFFVRkRPMWxCUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03WjBKQlEwb3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhOUVVGTkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdXVUZGTjBJc1EwRkJRenRSUVVOTUxFTkJRVU1zUTBGQlF5eERRVUZCTzBsQlEwNHNRMEZCUXp0QlFVTk1MRU5CUVVNc1EwRkJRVHRCUVZsRUxFbEJRVTBzYlVKQlFXMUNMRWRCUVVjc1ZVRkJReXhUUVVGVExFVkJRVVVzVFVGQlRTeEZRVUZGTEZOQlFYRkNPMGxCUldwRkxFbEJRVWtzVDBGQlR5eEhRVUZqTERSQ1FVRnZRaXhEUVVGRExFMUJRVTBzUlVGQlJTeFRRVUZUTEVOQlFVTXNRMEZCUXp0SlFVTnFSU3hGUVVGRkxFTkJRVU1zUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXl4RFFVRkRPMUZCUlZZc1QwRkJUeXhIUVVGSExFOUJRVThzUTBGQlF5eExRVUZMTEVWQlFVVXNRMEZCUXp0UlFVa3hRaXhGUVVGRkxFTkJRVU1zUTBGQlF5eFBRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdXVUZGYWtNc1lVRkJZU3hEUVVGRExFOUJRVThzUlVGQlJTeFRRVUZUTEVWQlFVVXNVMEZCVXl4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRE8xbEJRM0pFTEVWQlFVVXNRMEZCUXl4RFFVRkRMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zU1VGQlNTeEZRVUZGTEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRuUWtGREwwSXNVMEZCVXl4RFFVRkRMRkZCUVZFc1EwRkJReXhIUVVGSExFTkJRVU1zVFVGQlRTeEZRVUZGTEU5QlFVOHNRMEZCUXl4RFFVRkRPMmRDUVVWNFF5eFRRVUZUTEVOQlFVTXNVVUZCVVN4RFFVRkRMRTFCUVUwc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6dFpRVU4wUXl4RFFVRkRPMWxCUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03WjBKQlEwb3NVMEZCVXl4RFFVRkRMRkZCUVZFc1EwRkJReXhIUVVGSExFTkJRVU1zVFVGQlRTeEZRVUZGTEU5QlFVOHNRMEZCUXl4RFFVRkRPMmRDUVVWNFF5eFRRVUZUTEVOQlFVTXNVVUZCVVN4RFFVRkRMRTFCUVUwc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6dFpRVU4wUXl4RFFVRkRPMUZCUTB3c1EwRkJRenRKUVVOTUxFTkJRVU03UVVGRFRDeERRVUZETEVOQlFVTTdRVUZGUml4SlFVRk5MR0ZCUVdFc1IwRkJSeXhWUVVGRExFbEJRVWtzUlVGQlJTeFRRVUZUTEVWQlFVVXNTVUZCU1R0SlFVTjRReXhKUVVGSkxGTkJRVk1zUjBGQlJ5eEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dEpRVVUxUXl4SlFVRkpMRXRCUVVzc1IwRkJSeXhUUVVGVExFTkJRVU1zVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMGxCUjNCRExGTkJRVk1zUjBGQlJ5eFRRVUZUTEVOQlFVTXNTMEZCU3l4RlFVRkZMRU5CUVVNN1NVRkRPVUlzVTBGQlV5eERRVUZETEUxQlFVMHNRMEZCUXl4TFFVRkxMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVU03U1VGRE0wSXNTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhIUVVGSExFTkJRVU1zVTBGQlV5eEZRVUZGTEZOQlFWTXNRMEZCUXl4RFFVRkRPMGxCUTNaRExFVkJRVVVzUTBGQlF5eERRVUZETEZOQlFWTXNRMEZCUXl4TlFVRk5MRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dFJRVU40UWl4SlFVRkpMRU5CUVVNc1QwRkJUeXhEUVVGRExFMUJRVTBzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXp0SlFVbHVReXhEUVVGRE8wRkJRMHdzUTBGQlF5eERRVUZESW4wPVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi8uLi9zcmMvcmVmLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgZ2V0XzEgPSByZXF1aXJlKCcuL2dldCcpO1xudmFyIGNhY2hlXzEgPSByZXF1aXJlKCcuL2NhY2hlJyk7XG52YXIgdXRpbF8xID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgcGF0aF8xID0gcmVxdWlyZSgnLi9wYXRoJyk7XG52YXIgQ2FjaGVJdGVtXzEgPSByZXF1aXJlKCcuL0NhY2hlSXRlbScpO1xudmFyIENhY2hlTWFwXzEgPSByZXF1aXJlKCcuL0NhY2hlTWFwJyk7XG52YXIgcmVmXzEgPSByZXF1aXJlKCcuL3JlZicpO1xuZXhwb3J0cy5idWlsZEZsdXNoTWFwID0gZnVuY3Rpb24gKGZsdXNoQXJncykge1xuICAgIGlmICh1dGlsXzEuaGFzVWlkKGZsdXNoQXJncy5lbnRpdHkpKSB7XG4gICAgICAgIGJ1aWxkRW50aXR5Rmx1c2hNYXAoZmx1c2hBcmdzKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmICh1dGlsXzEuaXNBcnJheShmbHVzaEFyZ3MuZW50aXR5KSkge1xuICAgICAgICAgICAgY2FjaGVBcnJSZWZzKGZsdXNoQXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjYWNoZUVudGl0eVJlZnMoZmx1c2hBcmdzKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG52YXIgYnVpbGRFbnRpdHlGbHVzaE1hcCA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICBmbHVzaEFyZ3MucmVmUGF0aCA9IFwiXCI7XG4gICAgaWYgKGlzRGlydHkoZmx1c2hBcmdzKSA9PT0gdHJ1ZSkge1xuICAgICAgICBlbnN1cmVPbkZsdXNoTWFwKGZsdXNoQXJncyk7XG4gICAgICAgIGNhY2hlRW50aXR5UmVmcyhmbHVzaEFyZ3MpO1xuICAgICAgICByZWZfMS51cGRhdGVSZWZUb3MoU3RyaW5nKGZsdXNoQXJncy5lbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV0pLCBmbHVzaEFyZ3MpO1xuICAgIH1cbn07XG52YXIgZW5zdXJlT25GbHVzaE1hcCA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICB2YXIgZW50aXR5VWlkID0gU3RyaW5nKGZsdXNoQXJncy5lbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV0pO1xuICAgIGlmIChmbHVzaEFyZ3MuZmx1c2hNYXAuaGFzKGVudGl0eVVpZCkgPT09IGZhbHNlKSB7XG4gICAgICAgIGV4cG9ydHMuZW5zdXJlSXRlbShmbHVzaEFyZ3MpO1xuICAgICAgICBmbHVzaEFyZ3MucGFyZW50VWlkID0gU3RyaW5nKGVudGl0eVVpZCk7XG4gICAgfVxufTtcbnZhciBjYWNoZUVudGl0eVJlZnMgPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgdmFyIHBhcmVudEVudGl0eSA9IGZsdXNoQXJncy5lbnRpdHk7XG4gICAgZm9yICh2YXIgcHJvcCBpbiBwYXJlbnRFbnRpdHkpIHtcbiAgICAgICAgaWYgKHBhcmVudEVudGl0eS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgdmFyIHJlZkVudGl0eSA9IHBhcmVudEVudGl0eVtwcm9wXTtcbiAgICAgICAgICAgIGlmICh1dGlsXzEuaXNPYmplY3QocmVmRW50aXR5KSB8fCB1dGlsXzEuaXNBcnJheShyZWZFbnRpdHkpKSB7XG4gICAgICAgICAgICAgICAgZmx1c2hBcmdzLmVudGl0eSA9IHJlZkVudGl0eTtcbiAgICAgICAgICAgICAgICBpZiAocGFyZW50RW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgIGZsdXNoQXJncy5wYXJlbnRVaWQgPSBwYXJlbnRFbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChmbHVzaEFyZ3MucGFyZW50VWlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZsdXNoQXJncy5yZWZQYXRoID0gcGF0aF8xLmNvbmNhdFByb3AoZmx1c2hBcmdzLnJlZlBhdGgsIHByb3ApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWZsdXNoQXJncy5yZWZQYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgIGZsdXNoQXJncy5yZWZQYXRoID0gcHJvcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodXRpbF8xLmlzQXJyYXkocmVmRW50aXR5KSkge1xuICAgICAgICAgICAgICAgIGNhY2hlQXJyUmVmcyhmbHVzaEFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodXRpbF8xLmlzT2JqZWN0KHJlZkVudGl0eSkpIHtcbiAgICAgICAgICAgICAgICBjYWNoZU9ialJlZnMoZmx1c2hBcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIE9iamVjdC5mcmVlemUocmVmRW50aXR5KTtcbiAgICAgICAgfVxuICAgIH1cbn07XG52YXIgY2FjaGVBcnJSZWZzID0gZnVuY3Rpb24gKGZsdXNoQXJncykge1xuICAgIHZhciBlbnRpdHkgPSBmbHVzaEFyZ3MuZW50aXR5O1xuICAgIHZhciBhcnJheVBhdGggPSBmbHVzaEFyZ3MucmVmUGF0aDtcbiAgICB2YXIgYXJyYXlVaWQ7XG4gICAgaWYgKCFhcnJheVVpZCkge1xuICAgICAgICBhcnJheVVpZCA9IGZsdXNoQXJncy5wYXJlbnRVaWQ7XG4gICAgfVxuICAgIGVudGl0eS5mb3JFYWNoKGZ1bmN0aW9uIChuZXh0LCBpbmRleCkge1xuICAgICAgICBmbHVzaEFyZ3MuZW50aXR5ID0gbmV4dDtcbiAgICAgICAgZmx1c2hBcmdzLnBhcmVudFVpZCA9IGFycmF5VWlkO1xuICAgICAgICBpZiAoZmx1c2hBcmdzLnJlZlBhdGggfHwgYXJyYXlQYXRoKSB7XG4gICAgICAgICAgICBmbHVzaEFyZ3MucmVmUGF0aCA9IGFycmF5UGF0aCArIFwiLlwiICsgaW5kZXg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHV0aWxfMS5pc0FycmF5KG5leHQpKSB7XG4gICAgICAgICAgICBjYWNoZUFyclJlZnMoZmx1c2hBcmdzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh1dGlsXzEuaXNPYmplY3QobmV4dCkpIHtcbiAgICAgICAgICAgIGNhY2hlT2JqUmVmcyhmbHVzaEFyZ3MpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgT2JqZWN0LmZyZWV6ZShlbnRpdHkpO1xufTtcbnZhciBjYWNoZU9ialJlZnMgPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgaWYgKHV0aWxfMS5oYXNVaWQoZmx1c2hBcmdzLmVudGl0eSkpIHtcbiAgICAgICAgY2FjaGVVaWRPYmpSZWZzKGZsdXNoQXJncyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjYWNoZUVudGl0eVJlZnMoZmx1c2hBcmdzKTtcbiAgICB9XG59O1xudmFyIGNhY2hlVWlkT2JqUmVmcyA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICB2YXIgcmVmSXRlbSA9IGV4cG9ydHMuZW5zdXJlSXRlbShmbHVzaEFyZ3MpO1xuICAgIHJlZl8xLmFzc2lnblJlZlRvUGFyZW50KHJlZkl0ZW0sIGZsdXNoQXJncyk7XG4gICAgaWYgKGdldF8xLmlzT25DYWNoZShmbHVzaEFyZ3MpID09PSB0cnVlKVxuICAgICAgICByZXR1cm47XG4gICAgZXhwb3J0cy5idWlsZEZsdXNoTWFwKGZsdXNoQXJncyk7XG59O1xudmFyIGlzRGlydHkgPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgdmFyIGNhY2hlZEl0ZW0gPSBnZXRfMS5nZXRDYWNoZWRJdGVtKGZsdXNoQXJncy5lbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV0sIGZsdXNoQXJncy5pbnN0YW5jZSk7XG4gICAgcmV0dXJuICFjYWNoZWRJdGVtIHx8IGNhY2hlZEl0ZW0uZW50aXR5ICE9PSBmbHVzaEFyZ3MuZW50aXR5O1xufTtcbmV4cG9ydHMuZ2V0SXRlbUZsdXNoT3JDYWNoZWQgPSBmdW5jdGlvbiAodWlkLCBmbHVzaEFyZ3MpIHtcbiAgICBpZiAodWlkKSB7XG4gICAgICAgIHVpZCA9IFN0cmluZyh1aWQpO1xuICAgICAgICB2YXIgaXRlbSA9IGZsdXNoQXJncy5mbHVzaE1hcC5nZXQodWlkKTtcbiAgICAgICAgaWYgKCFpdGVtKSB7XG4gICAgICAgICAgICBpdGVtID0gZ2V0XzEuZ2V0Q2FjaGVkSXRlbSh1aWQsIGZsdXNoQXJncy5pbnN0YW5jZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0gJiYgT2JqZWN0LmlzRnJvemVuKGl0ZW0pKSB7XG4gICAgICAgICAgICBpdGVtID0gaXRlbS5jbG9uZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cbn07XG5leHBvcnRzLmVuc3VyZUl0ZW0gPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgdmFyIGl0ZW1VaWQgPSBTdHJpbmcoZmx1c2hBcmdzLmVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSk7XG4gICAgdmFyIGl0ZW0gPSBmbHVzaEFyZ3MuZmx1c2hNYXAuZ2V0KGl0ZW1VaWQpO1xuICAgIGlmIChpdGVtKSB7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cbiAgICB2YXIgbGl2ZSA9IGdldF8xLmdldENhY2hlZEl0ZW0oaXRlbVVpZCwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICBpdGVtID0gbmV3IENhY2hlSXRlbV8xLmRlZmF1bHQoZmx1c2hBcmdzLmVudGl0eSwgbGl2ZSk7XG4gICAgZmx1c2hBcmdzLmZsdXNoTWFwLnNldChpdGVtVWlkLCBpdGVtKTtcbiAgICBmbHVzaEFyZ3MuZmx1c2hNYXBbJ19fVVBEQVRFRF9fJ10gPSB0cnVlO1xuICAgIHJldHVybiBpdGVtO1xufTtcbmV4cG9ydHMucHJlRmx1c2ggPSBmdW5jdGlvbiAoZmx1c2hBcmdzKSB7XG4gICAgdmFyIHRlbXAgPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgdmFyIGN1cnJlbnRTdGFjayA9IGdldF8xLmdldENhY2hlQ3VycmVudFN0YWNrKGZsdXNoQXJncy5pbnN0YW5jZSk7XG4gICAgaWYgKGN1cnJlbnRTdGFjaykge1xuICAgICAgICBjdXJyZW50U3RhY2suZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgICAgICB0ZW1wLnNldChrZXksIGl0ZW0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZmx1c2hBcmdzLmZsdXNoTWFwLmZvckVhY2goZnVuY3Rpb24gKGtleSwgaXRlbSkge1xuICAgICAgICB2YXIgaXRlbVVpZCA9IGl0ZW0uZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgICAgICBmcmVlemVJdGVtKGl0ZW0pO1xuICAgICAgICB0ZW1wLnNldChTdHJpbmcoaXRlbVVpZCksIGl0ZW0pO1xuICAgIH0pO1xuICAgIGlmIChmbHVzaEFyZ3MuZXZpY3RNYXAuc2l6ZSgpID4gMCkge1xuICAgICAgICBmbHVzaEFyZ3MuZXZpY3RNYXAuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgdGVtcC5kZWxldGUoU3RyaW5nKGtleSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZXhwb3J0cy5mbHVzaCh0ZW1wLCBmbHVzaEFyZ3MuaW5zdGFuY2UpO1xufTtcbnZhciBmcmVlemVJdGVtID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICBPYmplY3QuZnJlZXplKGl0ZW0pO1xuICAgIE9iamVjdC5mcmVlemUoaXRlbS5lbnRpdHkpO1xuICAgIE9iamVjdC5mcmVlemUoaXRlbS5tYXBUbyk7XG4gICAgT2JqZWN0LmZyZWV6ZShpdGVtLm1hcEZyb20pO1xufTtcbmV4cG9ydHMuZmx1c2ggPSBmdW5jdGlvbiAodGVtcCwgaW5zdGFuY2UpIHtcbiAgICBpZiAodGVtcCAhPT0gbnVsbCkge1xuICAgICAgICBPYmplY3QuZnJlZXplKHRlbXApO1xuICAgICAgICB2YXIgY2FjaGVOb2RlID0gdXRpbF8xLmdldE5ld0NhY2hlTm9kZShpbnN0YW5jZSk7XG4gICAgICAgIGNhY2hlTm9kZS5pdGVtcyA9IHRlbXA7XG4gICAgICAgIGlmIChpbnN0YW5jZS50aHJlYWQubm9kZXMuaW5kZXhPZihjYWNoZU5vZGUuaWQpIDwgMCkge1xuICAgICAgICAgICAgaW5zdGFuY2UudGhyZWFkLm5vZGVzLnB1c2goY2FjaGVOb2RlLmlkKTtcbiAgICAgICAgICAgIGluc3RhbmNlLnRocmVhZC5jdXJyZW50ICs9IDE7XG4gICAgICAgIH1cbiAgICB9XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pWm14MWMyZ3Vhbk1pTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjeUk2V3lJdUxpOHVMaTl6Y21NdlpteDFjMmd1ZEhNaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWp0QlFVTkJMRzlDUVVFclJDeFBRVUZQTEVOQlFVTXNRMEZCUVR0QlFVVjJSU3h6UWtGQmRVSXNVMEZCVXl4RFFVRkRMRU5CUVVFN1FVRkRha01zY1VKQlFYRkhMRkZCUVZFc1EwRkJReXhEUVVGQk8wRkJRemxITEhGQ1FVRXlRaXhSUVVGUkxFTkJRVU1zUTBGQlFUdEJRVVZ3UXl3d1FrRkJjMElzWVVGQllTeERRVUZETEVOQlFVRTdRVUZGY0VNc2VVSkJRWEZDTEZsQlFWa3NRMEZCUXl4RFFVRkJPMEZCUTJ4RExHOUNRVUZuUkN4UFFVRlBMRU5CUVVNc1EwRkJRVHRCUVZjelF5eHhRa0ZCWVN4SFFVRkhMRlZCUVVNc1UwRkJjVUk3U1VGREwwTXNSVUZCUlN4RFFVRkRMRU5CUVVNc1lVRkJUU3hEUVVGRExGTkJRVk1zUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRNMElzYlVKQlFXMUNMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03U1VGRGJrTXNRMEZCUXp0SlFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8xRkJRMG9zUlVGQlJTeERRVUZETEVOQlFVTXNZMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdXVUZETlVJc1dVRkJXU3hEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzFGQlF6VkNMRU5CUVVNN1VVRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dFpRVU5LTEdWQlFXVXNRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRSUVVNdlFpeERRVUZETzBsQlEwd3NRMEZCUXp0QlFVTk1MRU5CUVVNc1EwRkJRenRCUVVWR0xFbEJRVTBzYlVKQlFXMUNMRWRCUVVjc1ZVRkJReXhUUVVGeFFqdEpRVVU1UXl4VFFVRlRMRU5CUVVNc1QwRkJUeXhIUVVGSExFVkJRVVVzUTBGQlF6dEpRVVYyUWl4RlFVRkZMRU5CUVVNc1EwRkJReXhQUVVGUExFTkJRVU1zVTBGQlV5eERRVUZETEV0QlFVc3NTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJRenRSUVVVNVFpeG5Ra0ZCWjBJc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dFJRVU0xUWl4bFFVRmxMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03VVVGSk0wSXNhMEpCUVZrc1EwRkRVaXhOUVVGTkxFTkJRVU1zVTBGQlV5eERRVUZETEUxQlFVMHNRMEZCUXl4alFVRk5MRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU1zUlVGRGVFTXNVMEZCVXl4RFFVTmFMRU5CUVVNN1NVRkRUaXhEUVVGRE8wRkJRMHdzUTBGQlF5eERRVUZCTzBGQlRVUXNTVUZCVFN4blFrRkJaMElzUjBGQlJ5eFZRVUZETEZOQlFYRkNPMGxCUXpORExFbEJRVWtzVTBGQlV5eEhRVUZITEUxQlFVMHNRMEZCUXl4VFFVRlRMRU5CUVVNc1RVRkJUU3hEUVVGRExHTkJRVTBzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXl4RFFVRkRPMGxCUTNwRUxFVkJRVVVzUTBGQlF5eERRVUZETEZOQlFWTXNRMEZCUXl4UlFVRlJMRU5CUVVNc1IwRkJSeXhEUVVGRExGTkJRVk1zUTBGQlF5eExRVUZMTEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRPVU1zYTBKQlFWVXNRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRSUVVWMFFpeFRRVUZUTEVOQlFVTXNVMEZCVXl4SFFVRkhMRTFCUVUwc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dEpRVU0xUXl4RFFVRkRPMEZCUTB3c1EwRkJReXhEUVVGQk8wRkJVMFFzU1VGQlRTeGxRVUZsTEVkQlFVY3NWVUZCUXl4VFFVRnhRanRKUVVVeFF5eEpRVUZKTEZsQlFWa3NSMEZCUnl4VFFVRlRMRU5CUVVNc1RVRkJUU3hEUVVGRE8wbEJSWEJETEVkQlFVY3NRMEZCUXl4RFFVRkRMRWxCUVVrc1NVRkJTU3hKUVVGSkxGbEJRVmtzUTBGQlF5eERRVUZETEVOQlFVTTdVVUZETlVJc1JVRkJSU3hEUVVGRExFTkJRVU1zV1VGQldTeERRVUZETEdOQlFXTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03V1VGRmNFTXNTVUZCU1N4VFFVRlRMRWRCUVVjc1dVRkJXU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzFsQlJXNURMRVZCUVVVc1EwRkJReXhEUVVGRExHVkJRVkVzUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1N4alFVRlBMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzJkQ1FVTTFReXhUUVVGVExFTkJRVU1zVFVGQlRTeEhRVUZITEZOQlFWTXNRMEZCUXp0blFrRkROMElzUlVGQlJTeERRVUZETEVOQlFVTXNXVUZCV1N4RFFVRkRMR05CUVUwc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdiMEpCUXk5Q0xGTkJRVk1zUTBGQlF5eFRRVUZUTEVkQlFVY3NXVUZCV1N4RFFVRkRMR05CUVUwc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dG5Ra0ZEZGtRc1EwRkJRenRuUWtGRFJDeEZRVUZGTEVOQlFVTXNRMEZCUXl4VFFVRlRMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU1zUTBGQlF6dHZRa0ZEZEVJc1UwRkJVeXhEUVVGRExFOUJRVThzUjBGQlJ5eHBRa0ZCVlN4RFFVRkRMRk5CUVZNc1EwRkJReXhQUVVGUExFVkJRVVVzU1VGQlNTeERRVUZETEVOQlFVTTdaMEpCUXpWRUxFTkJRVU03WjBKQlEwUXNSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJReXhUUVVGVExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTXNRMEZCUXp0dlFrRkRja0lzVTBGQlV5eERRVUZETEU5QlFVOHNSMEZCUnl4SlFVRkpMRU5CUVVNN1owSkJRemRDTEVOQlFVTTdXVUZEVEN4RFFVRkRPMWxCUlVRc1JVRkJSU3hEUVVGRExFTkJRVU1zWTBGQlR5eERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRuUWtGRGNrSXNXVUZCV1N4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRE8xbEJRelZDTEVOQlFVTTdXVUZCUXl4SlFVRkpMRU5CUVVNc1JVRkJSU3hEUVVGRExFTkJRVU1zWlVGQlVTeERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRuUWtGRk4wSXNXVUZCV1N4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRE8xbEJRelZDTEVOQlFVTTdXVUZEUkN4TlFVRk5MRU5CUVVNc1RVRkJUU3hEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzFGQlF6ZENMRU5CUVVNN1NVRkRUQ3hEUVVGRE8wRkJRMHdzUTBGQlF5eERRVUZETzBGQlYwWXNTVUZCVFN4WlFVRlpMRWRCUVVjc1ZVRkJReXhUUVVGeFFqdEpRVU4yUXl4SlFVRkpMRTFCUVUwc1IwRkJSeXhUUVVGVExFTkJRVU1zVFVGQlRTeERRVUZETzBsQlNUbENMRWxCUVVrc1UwRkJVeXhIUVVGSExGTkJRVk1zUTBGQlF5eFBRVUZQTEVOQlFVTTdTVUZEYkVNc1NVRkJTU3hSUVVGUkxFTkJRVU03U1VGRFlpeEZRVUZGTEVOQlFVTXNRMEZCUXl4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRFdpeFJRVUZSTEVkQlFVY3NVMEZCVXl4RFFVRkRMRk5CUVZNc1EwRkJRenRKUVVOdVF5eERRVUZETzBsQlJVRXNUVUZCY1VJc1EwRkJReXhQUVVGUExFTkJRVU1zVlVGQlF5eEpRVUZKTEVWQlFVVXNTMEZCU3p0UlFVVjJReXhUUVVGVExFTkJRVU1zVFVGQlRTeEhRVUZITEVsQlFVa3NRMEZCUXp0UlFVTjRRaXhUUVVGVExFTkJRVU1zVTBGQlV5eEhRVUZITEZGQlFWRXNRMEZCUXp0UlFVVXZRaXhGUVVGRkxFTkJRVU1zUTBGQlF5eFRRVUZUTEVOQlFVTXNUMEZCVHl4SlFVRkpMRk5CUVZNc1EwRkJReXhEUVVGRExFTkJRVU03V1VGRGFrTXNVMEZCVXl4RFFVRkRMRTlCUVU4c1IwRkJSeXhUUVVGVExFZEJRVWNzUjBGQlJ5eEhRVUZITEV0QlFVc3NRMEZCUXp0UlFVTm9SQ3hEUVVGRE8xRkJSVVFzUlVGQlJTeERRVUZETEVOQlFVTXNZMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dFpRVU5vUWl4WlFVRlpMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03VVVGRE5VSXNRMEZCUXp0UlFVRkRMRWxCUVVrc1EwRkJReXhGUVVGRkxFTkJRVU1zUTBGQlF5eGxRVUZSTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8xbEJRM2hDTEZsQlFWa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRSUVVNMVFpeERRVUZETzBsQlEwd3NRMEZCUXl4RFFVRkRMRU5CUVVNN1NVRkZTQ3hOUVVGTkxFTkJRVU1zVFVGQlRTeERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMEZCUXpGQ0xFTkJRVU1zUTBGQlF6dEJRVmRHTEVsQlFVMHNXVUZCV1N4SFFVRkhMRlZCUVVNc1UwRkJjVUk3U1VGRGRrTXNSVUZCUlN4RFFVRkRMRU5CUVVNc1lVRkJUU3hEUVVGRExGTkJRVk1zUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRNMElzWlVGQlpTeERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRPMGxCUXk5Q0xFTkJRVU03U1VGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0UlFVVktMR1ZCUVdVc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dEpRVU12UWl4RFFVRkRPMEZCUTB3c1EwRkJReXhEUVVGRE8wRkJSVVlzU1VGQlRTeGxRVUZsTEVkQlFVY3NWVUZCUXl4VFFVRnhRanRKUVVjeFF5eEpRVUZKTEU5QlFVOHNSMEZCUnl4clFrRkJWU3hEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzBsQlEzQkRMSFZDUVVGcFFpeERRVUZETEU5QlFVOHNSVUZCUlN4VFFVRlRMRU5CUVVNc1EwRkJRenRKUVVkMFF5eEZRVUZGTEVOQlFVTXNRMEZCUXl4bFFVRlRMRU5CUVVNc1UwRkJVeXhEUVVGRExFdEJRVXNzU1VGQlNTeERRVUZETzFGQlFVTXNUVUZCVFN4RFFVRkRPMGxCUnpGRExIRkNRVUZoTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN1FVRkROMElzUTBGQlF5eERRVUZCTzBGQlJVUXNTVUZCVFN4UFFVRlBMRWRCUVVjc1ZVRkJReXhUUVVGeFFqdEpRVU5zUXl4SlFVRkpMRlZCUVZVc1IwRkJSeXh0UWtGQllTeERRVUZETEZOQlFWTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1kwRkJUU3hEUVVGRExFOUJRVThzUTBGQlF5eEZRVUZGTEZOQlFWTXNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRKUVVOeVJpeE5RVUZOTEVOQlFVTXNRMEZCUXl4VlFVRlZMRWxCUVVrc1ZVRkJWU3hEUVVGRExFMUJRVTBzUzBGQlN5eFRRVUZUTEVOQlFVTXNUVUZCVFN4RFFVRkRPMEZCUTJwRkxFTkJRVU1zUTBGQlFUdEJRVXRaTERSQ1FVRnZRaXhIUVVGSExGVkJRVU1zUjBGQlZ5eEZRVUZGTEZOQlFYRkNPMGxCUTI1RkxFVkJRVVVzUTBGQlF5eERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRUaXhIUVVGSExFZEJRVWNzVFVGQlRTeERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRPMUZCUTJ4Q0xFbEJRVWtzU1VGQlNTeEhRVUZITEZOQlFWTXNRMEZCUXl4UlFVRlJMRU5CUVVNc1IwRkJSeXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETzFGQlEzWkRMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTXNRMEZCUXp0WlFVTlNMRWxCUVVrc1IwRkJSeXh0UWtGQllTeERRVUZETEVkQlFVY3NSVUZCUlN4VFFVRlRMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03VVVGRGJFUXNRMEZCUXp0UlFVTkVMRVZCUVVVc1EwRkJReXhEUVVGRExFbEJRVWtzU1VGQlNTeE5RVUZOTEVOQlFVTXNVVUZCVVN4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dFpRVU5vUXl4SlFVRkpMRWRCUVVjc1NVRkJTU3hEUVVGRExFdEJRVXNzUlVGQlJTeERRVUZETzFGQlEzaENMRU5CUVVNN1VVRkRSQ3hOUVVGTkxFTkJRVU1zU1VGQlNTeERRVUZETzBsQlEyaENMRU5CUVVNN1FVRkRUQ3hEUVVGRExFTkJRVU03UVVGVFZ5eHJRa0ZCVlN4SFFVRkhMRlZCUVVNc1UwRkJjVUk3U1VGRE5VTXNTVUZCU1N4UFFVRlBMRWRCUVVjc1RVRkJUU3hEUVVGRExGTkJRVk1zUTBGQlF5eE5RVUZOTEVOQlFVTXNZMEZCVFN4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRExFTkJRVU03U1VGRGRrUXNTVUZCU1N4SlFVRkpMRWRCUVdNc1UwRkJVeXhEUVVGRExGRkJRVkVzUTBGQlF5eEhRVUZITEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN1NVRkRkRVFzUlVGQlJTeERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJRenRSUVVOUUxFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTTdTVUZEYUVJc1EwRkJRenRKUVVkRUxFbEJRVWtzU1VGQlNTeEhRVUZqTEcxQ1FVRmhMRU5CUVVNc1QwRkJUeXhGUVVGRkxGTkJRVk1zUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXp0SlFVTnFSU3hKUVVGSkxFZEJRVWNzU1VGQlNTeHRRa0ZCVXl4RFFVRkRMRk5CUVZNc1EwRkJReXhOUVVGTkxFVkJRVVVzU1VGQlNTeERRVUZETEVOQlFVTTdTVUZGTjBNc1UwRkJVeXhEUVVGRExGRkJRVkVzUTBGQlF5eEhRVUZITEVOQlFVTXNUMEZCVHl4RlFVRkZMRWxCUVVrc1EwRkJReXhEUVVGRE8wbEJRM1JETEZOQlFWTXNRMEZCUXl4UlFVRlJMRU5CUVVNc1lVRkJZU3hEUVVGRExFZEJRVWNzU1VGQlNTeERRVUZETzBsQlEzcERMRTFCUVUwc1EwRkJReXhKUVVGSkxFTkJRVU03UVVGRGFFSXNRMEZCUXl4RFFVRkRPMEZCVlZjc1owSkJRVkVzUjBGQlJ5eFZRVUZETEZOQlFYRkNPMGxCUlRGRExFbEJRVWtzU1VGQlNTeEhRVUZITEVsQlFVa3NhMEpCUVZFc1JVRkJZU3hEUVVGRE8wbEJTWEpETEVsQlFVa3NXVUZCV1N4SFFVRjNRaXd3UWtGQmIwSXNRMEZCUXl4VFFVRlRMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03U1VGRGFrWXNSVUZCUlN4RFFVRkRMRU5CUVVNc1dVRkJXU3hEUVVGRExFTkJRVU1zUTBGQlF6dFJRVU5tTEZsQlFWa3NRMEZCUXl4UFFVRlBMRU5CUVVNc1ZVRkJReXhIUVVGSExFVkJRVVVzU1VGQlpUdFpRVU4wUXl4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExFZEJRVWNzUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXp0UlFVTjRRaXhEUVVGRExFTkJRVU1zUTBGQlF6dEpRVU5RTEVOQlFVTTdTVUZGUkN4VFFVRlRMRU5CUVVNc1VVRkJVU3hEUVVGRExFOUJRVThzUTBGQlF5eFZRVUZETEVkQlFVY3NSVUZCUlN4SlFVRmxPMUZCUlRWRExFbEJRVWtzVDBGQlR5eEhRVUZITEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNc1kwRkJUU3hEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzFGQlF6RkRMRlZCUVZVc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dFJRVU5xUWl4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExFMUJRVTBzUTBGQlF5eFBRVUZQTEVOQlFVTXNSVUZCUlN4SlFVRkpMRU5CUVVNc1EwRkJRenRKUVVOd1F5eERRVUZETEVOQlFVTXNRMEZCUXp0SlFVVklMRVZCUVVVc1EwRkJReXhEUVVGRExGTkJRVk1zUTBGQlF5eFJRVUZSTEVOQlFVTXNTVUZCU1N4RlFVRkZMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dFJRVU5vUXl4VFFVRlRMRU5CUVVNc1VVRkJVU3hEUVVGRExFOUJRVThzUTBGQlF5eFZRVUZETEVkQlFVY3NSVUZCUlN4TFFVRkxPMWxCUTJ4RExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRE4wSXNRMEZCUXl4RFFVRkRMRU5CUVVNN1NVRkRVQ3hEUVVGRE8wbEJSVVFzWVVGQlN5eERRVUZETEVsQlFVa3NSVUZCUlN4VFFVRlRMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03UVVGRGNFTXNRMEZCUXl4RFFVRkRPMEZCUlVZc1NVRkJUU3hWUVVGVkxFZEJRVWNzVlVGQlF5eEpRVUZsTzBsQlF5OUNMRTFCUVUwc1EwRkJReXhOUVVGTkxFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdTVUZEY0VJc1RVRkJUU3hEUVVGRExFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1NVRkRNMElzVFVGQlRTeERRVUZETEUxQlFVMHNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU03U1VGRE1VSXNUVUZCVFN4RFFVRkRMRTFCUVUwc1EwRkJReXhKUVVGSkxFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdRVUZEYUVNc1EwRkJReXhEUVVGRE8wRkJVMWNzWVVGQlN5eEhRVUZITEZWQlFVTXNTVUZCZVVJc1JVRkJSU3hSUVVGM1FqdEpRVU55UlN4RlFVRkZMRU5CUVVNc1EwRkJReXhKUVVGSkxFdEJRVXNzU1VGQlNTeERRVUZETEVOQlFVTXNRMEZCUXp0UlFVTm9RaXhOUVVGTkxFTkJRVU1zVFVGQlRTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMUZCUTNCQ0xFbEJRVWtzVTBGQlV5eEhRVUZITEhOQ1FVRmxMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03VVVGRE1VTXNVMEZCVXl4RFFVRkRMRXRCUVVzc1IwRkJSeXhKUVVGSkxFTkJRVU03VVVGRmRrSXNSVUZCUlN4RFFVRkRMRU5CUVVNc1VVRkJVU3hEUVVGRExFMUJRVTBzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkJReXhGUVVGRkxFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMWxCUTJ4RUxGRkJRVkVzUTBGQlF5eE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zUlVGQlJTeERRVUZETEVOQlFVTTdXVUZEZWtNc1VVRkJVU3hEUVVGRExFMUJRVTBzUTBGQlF5eFBRVUZQTEVsQlFVa3NRMEZCUXl4RFFVRkRPMUZCUTJwRExFTkJRVU03U1VGRFRDeERRVUZETzBGQlEwd3NRMEZCUXl4RFFVRkRJbjA9XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uLy4uL3NyYy9mbHVzaC50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIGNhY2hlXzEgPSByZXF1aXJlKCcuL2NhY2hlJyk7XG52YXIgdXRpbF8xID0gcmVxdWlyZSgnLi91dGlsJyk7XG5leHBvcnRzLmdldEl0ZW0gPSBmdW5jdGlvbiAoZW50aXR5LCBpbnN0YW5jZSwgbm9kZUlkKSB7XG4gICAgaWYgKCFlbnRpdHkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9uZSBnZXQoKTogcmVxdWlyZXMgYSB1aWQgdG8gcmV0cmlldmUgYW4gaXRlbSBmcm9tIHRoZSBjYWNoZS5cIik7XG4gICAgfVxuICAgIGlmICh1dGlsXzEuaXNBcnJheShlbnRpdHkpKSB7XG4gICAgICAgIHJldHVybiBlbnRpdHkubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0T2JqZWN0KGl0ZW0sIGluc3RhbmNlKTtcbiAgICAgICAgfSkuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbSAhPT0gbnVsbCAmJiBpdGVtICE9PSB1bmRlZmluZWQ7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZ2V0T2JqZWN0KGVudGl0eSwgaW5zdGFuY2UpO1xufTtcbnZhciBnZXRPYmplY3QgPSBmdW5jdGlvbiAodWlkT3JFbnRpdHksIGluc3RhbmNlKSB7XG4gICAgdmFyIHJlYWxVaWQgPSBnZXRBY3R1YWxVaWQodWlkT3JFbnRpdHkpO1xuICAgIGlmICghcmVhbFVpZCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBpdGVtID0gZXhwb3J0cy5nZXRDYWNoZWRJdGVtKHJlYWxVaWQsIGluc3RhbmNlKTtcbiAgICByZXR1cm4gaXRlbSA/IGl0ZW0uZW50aXR5IDogdW5kZWZpbmVkO1xufTtcbmV4cG9ydHMuZ2V0RWRpdEl0ZW0gPSBmdW5jdGlvbiAob2JqLCBpbnN0YW5jZSwgbm9kZUlkKSB7XG4gICAgaWYgKHV0aWxfMS5pc0FycmF5KG9iaikpIHtcbiAgICAgICAgcmV0dXJuIG9iai5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRFZGl0YWJsZU9iamVjdChpdGVtLCBpbnN0YW5jZSk7XG4gICAgICAgIH0pLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW0gIT09IG51bGwgJiYgaXRlbSAhPT0gdW5kZWZpbmVkO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGdldEVkaXRhYmxlT2JqZWN0KG9iaiwgaW5zdGFuY2UpO1xufTtcbnZhciBnZXRFZGl0YWJsZU9iamVjdCA9IGZ1bmN0aW9uICh1aWRPckVudGl0eSwgaW5zdGFuY2UpIHtcbiAgICB2YXIgcmVhbFVpZCA9IGdldEFjdHVhbFVpZCh1aWRPckVudGl0eSk7XG4gICAgdmFyIGV4aXN0aW5nID0gZXhwb3J0cy5nZXRJdGVtKHJlYWxVaWQsIGluc3RhbmNlKTtcbiAgICByZXR1cm4gZXhpc3RpbmcgPyB1dGlsXzEuZGVlcENsb25lKGV4aXN0aW5nLCB1bmRlZmluZWQsIGZhbHNlKSA6IHVuZGVmaW5lZDtcbn07XG52YXIgZ2V0QWN0dWFsVWlkID0gZnVuY3Rpb24gKHVpZE9yRW50aXR5KSB7XG4gICAgaWYgKHR5cGVvZiB1aWRPckVudGl0eSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICByZXR1cm4gdWlkT3JFbnRpdHk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiB1aWRPckVudGl0eSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICByZXR1cm4gU3RyaW5nKHVpZE9yRW50aXR5KTtcbiAgICB9XG4gICAgZWxzZSBpZiAodXRpbF8xLmlzT2JqZWN0KHVpZE9yRW50aXR5KSkge1xuICAgICAgICBpZiAodXRpbF8xLmhhc1VpZCh1aWRPckVudGl0eSkpIHtcbiAgICAgICAgICAgIHJldHVybiB1aWRPckVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5leHBvcnRzLmlzT25DYWNoZSA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICB2YXIgdWlkID0gZmx1c2hBcmdzLmVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXTtcbiAgICB2YXIgZXhpc3RpbmdJdGVtID0gZXhwb3J0cy5nZXRDYWNoZWRJdGVtKHVpZCwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICByZXR1cm4gZXhpc3RpbmdJdGVtICYmIGV4aXN0aW5nSXRlbS5lbnRpdHkgPT09IGZsdXNoQXJncy5lbnRpdHk7XG59O1xuZXhwb3J0cy5nZXRDYWNoZWRJdGVtID0gZnVuY3Rpb24gKHVpZCwgaW5zdGFuY2UpIHtcbiAgICB2YXIgY3VycmVudE5vZGUgPSBnZXRDdXJyZW50Tm9kZShpbnN0YW5jZSk7XG4gICAgcmV0dXJuIGN1cnJlbnROb2RlID8gY3VycmVudE5vZGUuaXRlbXMuZ2V0KFN0cmluZyh1aWQpKSA6IHVuZGVmaW5lZDtcbn07XG5mdW5jdGlvbiBnZXRDdXJyZW50Tm9kZShpbnN0YW5jZSkge1xuICAgIHZhciBjdXJyZW50Tm9kZUlkID0gaW5zdGFuY2UudGhyZWFkLm5vZGVzW2luc3RhbmNlLnRocmVhZC5jdXJyZW50XTtcbiAgICByZXR1cm4gY3VycmVudE5vZGVJZCA+PSAwID8gZ2V0UmVwb05vZGUoY3VycmVudE5vZGVJZCwgaW5zdGFuY2UucmVwbykgOiB1bmRlZmluZWQ7XG59XG5mdW5jdGlvbiBnZXRSZXBvTm9kZShub2RlSWQsIHJlcG8pIHtcbiAgICByZXR1cm4gcmVwby5nZXQobm9kZUlkKTtcbn1cbmV4cG9ydHMuZ2V0Q2FjaGVDdXJyZW50U3RhY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICB2YXIgY3VycmVudE5vZGUgPSBnZXRDdXJyZW50Tm9kZShpbnN0YW5jZSk7XG4gICAgcmV0dXJuIGN1cnJlbnROb2RlID8gY3VycmVudE5vZGUuaXRlbXMgOiB1bmRlZmluZWQ7XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pWjJWMExtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTGk0dkxpNHZjM0pqTDJkbGRDNTBjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPMEZCUVVFc2MwSkJRWFZDTEZOQlFWTXNRMEZCUXl4RFFVRkJPMEZCU1dwRExIRkNRVUZ4UkN4UlFVRlJMRU5CUVVNc1EwRkJRVHRCUVdOcVJDeGxRVUZQTEVkQlFVY3NWVUZCUXl4TlFVRjVReXhGUVVGRkxGRkJRWGRDTEVWQlFVVXNUVUZCWlR0SlFVTjRSeXhGUVVGRkxFTkJRVU1zUTBGQlF5eERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRWaXhOUVVGTkxFbEJRVWtzVTBGQlV5eERRVUZETEN0RVFVRXJSQ3hEUVVGRExFTkJRVU03U1VGRGVrWXNRMEZCUXp0SlFVTkVMRVZCUVVVc1EwRkJReXhEUVVGRExHTkJRVThzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRiRUlzVFVGQlRTeERRVUZGTEUxQlFYRkNMRU5CUVVNc1IwRkJSeXhEUVVGRExGVkJRVUVzU1VGQlNUdFpRVU5zUXl4TlFVRk5MRU5CUVVNc1UwRkJVeXhEUVVGRExFbEJRVWtzUlVGQlJTeFJRVUZSTEVOQlFVTXNRMEZCUXp0UlFVTnlReXhEUVVGRExFTkJRVU1zUTBGQlF5eE5RVUZOTEVOQlFVTXNWVUZCUVN4SlFVRkpPMWxCUTFZc1RVRkJUU3hEUVVGRExFbEJRVWtzUzBGQlN5eEpRVUZKTEVsQlFVa3NTVUZCU1N4TFFVRkxMRk5CUVZNc1EwRkJRenRSUVVNdlF5eERRVUZETEVOQlFVTXNRMEZCUVR0SlFVTk9MRU5CUVVNN1NVRkRSQ3hOUVVGTkxFTkJRVU1zVTBGQlV5eERRVUZETEUxQlFVMHNSVUZCUlN4UlFVRlJMRU5CUVVNc1EwRkJRenRCUVVOMlF5eERRVUZETEVOQlFVTTdRVUZSUml4SlFVRk5MRk5CUVZNc1IwRkJSeXhWUVVGRExGZEJRV2xETEVWQlFVVXNVVUZCZDBJN1NVRkRNVVVzU1VGQlNTeFBRVUZQTEVkQlFVY3NXVUZCV1N4RFFVRkRMRmRCUVZjc1EwRkJReXhEUVVGRE8wbEJRM2hETEVWQlFVVXNRMEZCUXl4RFFVRkRMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU1zUTBGQlF6dFJRVU5ZTEUxQlFVMHNRMEZCUXp0SlFVTllMRU5CUVVNN1NVRkRSQ3hKUVVGSkxFbEJRVWtzUjBGQll5eHhRa0ZCWVN4RFFVRkRMRTlCUVU4c1JVRkJSU3hSUVVGUkxFTkJRVU1zUTBGQlF6dEpRVU4yUkN4TlFVRk5MRU5CUVVNc1NVRkJTU3hIUVVGSExFbEJRVWtzUTBGQlF5eE5RVUZOTEVkQlFVY3NVMEZCVXl4RFFVRkRPMEZCUXpGRExFTkJRVU1zUTBGQlF6dEJRVXRYTEcxQ1FVRlhMRWRCUVVjc1ZVRkJReXhIUVVGelF5eEZRVUZGTEZGQlFYZENMRVZCUVVVc1RVRkJaVHRKUVVONlJ5eEZRVUZGTEVOQlFVTXNRMEZCUXl4alFVRlBMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzFGQlEyWXNUVUZCVFN4RFFVRkZMRWRCUVd0Q0xFTkJRVU1zUjBGQlJ5eERRVUZETEZWQlFVRXNTVUZCU1R0WlFVTXZRaXhOUVVGTkxFTkJRVU1zYVVKQlFXbENMRU5CUVVNc1NVRkJTU3hGUVVGRkxGRkJRVkVzUTBGQlF5eERRVUZETzFGQlF6ZERMRU5CUVVNc1EwRkJReXhEUVVGRExFMUJRVTBzUTBGQlF5eFZRVUZCTEVsQlFVazdXVUZEVml4TlFVRk5MRU5CUVVNc1NVRkJTU3hMUVVGTExFbEJRVWtzU1VGQlNTeEpRVUZKTEV0QlFVc3NVMEZCVXl4RFFVRkRPMUZCUXk5RExFTkJRVU1zUTBGQlF5eERRVUZCTzBsQlEwNHNRMEZCUXp0SlFVTkVMRTFCUVUwc1EwRkJReXhwUWtGQmFVSXNRMEZCUXl4SFFVRkhMRVZCUVVVc1VVRkJVU3hEUVVGRExFTkJRVU03UVVGRE5VTXNRMEZCUXl4RFFVRkJPMEZCVTBRc1NVRkJUU3hwUWtGQmFVSXNSMEZCUnl4VlFVRkRMRmRCUVZjc1JVRkJSU3hSUVVGM1FqdEpRVU0xUkN4SlFVRkpMRTlCUVU4c1IwRkJSeXhaUVVGWkxFTkJRVU1zVjBGQlZ5eERRVUZETEVOQlFVTTdTVUZEZUVNc1NVRkJTU3hSUVVGUkxFZEJRVWNzWlVGQlR5eERRVUZETEU5QlFVOHNSVUZCUlN4UlFVRlJMRU5CUVVNc1EwRkJRenRKUVVNeFF5eE5RVUZOTEVOQlFVTXNVVUZCVVN4SFFVRkhMR2RDUVVGVExFTkJRVU1zVVVGQlVTeEZRVUZGTEZOQlFWTXNSVUZCUlN4TFFVRkxMRU5CUVVNc1IwRkJSeXhUUVVGVExFTkJRVU03UVVGRGVFVXNRMEZCUXl4RFFVRkRPMEZCVDBZc1NVRkJUU3haUVVGWkxFZEJRVWNzVlVGQlFTeFhRVUZYTzBsQlF6VkNMRVZCUVVVc1EwRkJReXhEUVVGRExFOUJRVThzVjBGQlZ5eExRVUZMTEZGQlFWRXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRiRU1zVFVGQlRTeERRVUZETEZkQlFWY3NRMEZCUXp0SlFVTjJRaXhEUVVGRE8wbEJRVU1zU1VGQlNTeERRVUZETEVWQlFVVXNRMEZCUXl4RFFVRkRMRTlCUVU4c1YwRkJWeXhMUVVGTExGRkJRVkVzUTBGQlF5eERRVUZETEVOQlFVTTdVVUZEZWtNc1RVRkJUU3hEUVVGRExFMUJRVTBzUTBGQlF5eFhRVUZYTEVOQlFVTXNRMEZCUXp0SlFVTXZRaXhEUVVGRE8wbEJRMFFzU1VGQlNTeERRVUZETEVWQlFVVXNRMEZCUXl4RFFVRkRMR1ZCUVZFc1EwRkJReXhYUVVGWExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdVVUZETjBJc1JVRkJSU3hEUVVGRExFTkJRVU1zWVVGQlRTeERRVUZETEZkQlFWY3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRaUVVOMFFpeE5RVUZOTEVOQlFVTXNWMEZCVnl4RFFVRkRMR05CUVUwc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dFJRVU4yUXl4RFFVRkRPMGxCUTB3c1EwRkJRenRCUVVOTUxFTkJRVU1zUTBGQlF6dEJRVkZYTEdsQ1FVRlRMRWRCUVVjc1ZVRkJReXhUUVVGeFFqdEpRVVV6UXl4SlFVRkpMRWRCUVVjc1IwRkJSeXhUUVVGVExFTkJRVU1zVFVGQlRTeERRVUZETEdOQlFVMHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRKUVVNelF5eEpRVUZKTEZsQlFWa3NSMEZCWXl4eFFrRkJZU3hEUVVGRExFZEJRVWNzUlVGQlJTeFRRVUZUTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN1NVRkRja1VzVFVGQlRTeERRVUZETEZsQlFWa3NTVUZCU1N4WlFVRlpMRU5CUVVNc1RVRkJUU3hMUVVGTExGTkJRVk1zUTBGQlF5eE5RVUZOTEVOQlFVTTdRVUZEY0VVc1EwRkJReXhEUVVGRE8wRkJVMWNzY1VKQlFXRXNSMEZCUnl4VlFVRkRMRWRCUVZjc1JVRkJSU3hSUVVGM1FqdEpRVU12UkN4SlFVRkpMRmRCUVZjc1IwRkJaU3hqUVVGakxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdTVUZEZGtRc1RVRkJUU3hEUVVGRExGZEJRVmNzUjBGQlJ5eFhRVUZYTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhOUVVGTkxFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTXNSMEZCUnl4VFFVRlRMRU5CUVVNN1FVRkRlRVVzUTBGQlF5eERRVUZETzBGQlVVWXNkMEpCUVhkQ0xGRkJRWGRDTzBsQlF6VkRMRWxCUVVrc1lVRkJZU3hIUVVGWExGRkJRVkVzUTBGQlF5eE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRMRkZCUVZFc1EwRkJReXhOUVVGTkxFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdTVUZGTTBVc1RVRkJUU3hEUVVGRExHRkJRV0VzU1VGQlNTeERRVUZETEVkQlFVY3NWMEZCVnl4RFFVRkRMR0ZCUVdFc1JVRkJSU3hSUVVGUkxFTkJRVU1zU1VGQlNTeERRVUZETEVkQlFVY3NVMEZCVXl4RFFVRkRPMEZCUTNSR0xFTkJRVU03UVVGTFJDeHhRa0ZCY1VJc1RVRkJZeXhGUVVGRkxFbEJRV2RDTzBsQlEycEVMRTFCUVUwc1EwRkJReXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMEZCUXpWQ0xFTkJRVU03UVVGTldTdzBRa0ZCYjBJc1IwRkJSeXhWUVVGRExGRkJRWGRDTzBsQlEzcEVMRWxCUVVrc1YwRkJWeXhIUVVGSExHTkJRV01zUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXp0SlFVTXpReXhOUVVGTkxFTkJRVU1zVjBGQlZ5eEhRVUZITEZkQlFWY3NRMEZCUXl4TFFVRkxMRWRCUVVjc1UwRkJVeXhEUVVGRE8wRkJRM1pFTEVOQlFVTXNRMEZCUXlKOVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi8uLi9zcmMvZ2V0LnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgdXRpbF8xID0gcmVxdWlyZSgnLi91dGlsJyk7XG5mdW5jdGlvbiBnZXRLZXkoa2V5KSB7XG4gICAgdmFyIGludEtleSA9IHBhcnNlSW50KGtleSk7XG4gICAgaWYgKGludEtleS50b1N0cmluZygpID09PSBrZXkpIHtcbiAgICAgICAgcmV0dXJuIGludEtleTtcbiAgICB9XG4gICAgcmV0dXJuIGtleTtcbn1cbmZ1bmN0aW9uIGRlbChvYmosIHBhdGgpIHtcbiAgICBpZiAodXRpbF8xLmlzTnVtYmVyKHBhdGgpKSB7XG4gICAgICAgIHBhdGggPSBbcGF0aF07XG4gICAgfVxuICAgIGlmICh1dGlsXzEuaXNFbXB0eShvYmopKSB7XG4gICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfVxuICAgIGlmICh1dGlsXzEuaXNFbXB0eShwYXRoKSkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBpZiAodXRpbF8xLmlzU3RyaW5nKHBhdGgpKSB7XG4gICAgICAgIHJldHVybiBkZWwob2JqLCBwYXRoLnNwbGl0KCcuJykpO1xuICAgIH1cbiAgICB2YXIgY3VycmVudFBhdGggPSBnZXRLZXkocGF0aFswXSk7XG4gICAgdmFyIG9sZFZhbCA9IG9ialtjdXJyZW50UGF0aF07XG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGlmIChvbGRWYWwgIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgaWYgKHV0aWxfMS5pc0FycmF5KG9iaikpIHtcbiAgICAgICAgICAgICAgICBvYmouc3BsaWNlKGN1cnJlbnRQYXRoLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBvYmpbY3VycmVudFBhdGhdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAob2JqW2N1cnJlbnRQYXRoXSAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVsKG9ialtjdXJyZW50UGF0aF0sIHBhdGguc2xpY2UoMSkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG59XG5leHBvcnRzLmRlbCA9IGRlbDtcbmZ1bmN0aW9uIGdldChvYmosIHBhdGgsIGRlZmF1bHRWYWx1ZSkge1xuICAgIGlmICh1dGlsXzEuaXNOdW1iZXIocGF0aCkpIHtcbiAgICAgICAgcGF0aCA9IFtwYXRoXTtcbiAgICB9XG4gICAgaWYgKHV0aWxfMS5pc0VtcHR5KHBhdGgpKSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICAgIGlmICh1dGlsXzEuaXNFbXB0eShvYmopKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgfVxuICAgIGlmICh1dGlsXzEuaXNTdHJpbmcocGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIGdldChvYmosIHBhdGguc3BsaXQoJy4nKSwgZGVmYXVsdFZhbHVlKTtcbiAgICB9XG4gICAgdmFyIGN1cnJlbnRQYXRoID0gZ2V0S2V5KHBhdGhbMF0pO1xuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBpZiAob2JqW2N1cnJlbnRQYXRoXSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmpbY3VycmVudFBhdGhdO1xuICAgIH1cbiAgICByZXR1cm4gZ2V0KG9ialtjdXJyZW50UGF0aF0sIHBhdGguc2xpY2UoMSksIGRlZmF1bHRWYWx1ZSk7XG59XG5leHBvcnRzLmdldCA9IGdldDtcbmV4cG9ydHMuY29uY2F0UHJvcCA9IGZ1bmN0aW9uIChwcm9wQ2hhaW4sIHByb3ApIHtcbiAgICBpZiAocHJvcENoYWluID09PSBcIlwiKSB7XG4gICAgICAgIHByb3BDaGFpbiA9IHByb3A7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBwcm9wQ2hhaW4gPSBwcm9wQ2hhaW4gKyBcIi5cIiArIHByb3A7XG4gICAgfVxuICAgIHJldHVybiBwcm9wQ2hhaW47XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pY0dGMGFDNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5d1lYUm9MblJ6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVV0QkxGbEJRVmtzUTBGQlF6dEJRVVZpTEhGQ1FVRXJSQ3hSUVVGUkxFTkJRVU1zUTBGQlFUdEJRVVY0UlN4blFrRkJaMElzUjBGQlJ6dEpRVU5tTEVsQlFVa3NUVUZCVFN4SFFVRkhMRkZCUVZFc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF6dEpRVU16UWl4RlFVRkZMRU5CUVVNc1EwRkJReXhOUVVGTkxFTkJRVU1zVVVGQlVTeEZRVUZGTEV0QlFVc3NSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJRenRSUVVNMVFpeE5RVUZOTEVOQlFVTXNUVUZCVFN4RFFVRkRPMGxCUTJ4Q0xFTkJRVU03U1VGRFJDeE5RVUZOTEVOQlFVTXNSMEZCUnl4RFFVRkRPMEZCUTJZc1EwRkJRenRCUVVWRUxHRkJRVzlDTEVkQlFWRXNSVUZCUlN4SlFVRkxPMGxCUXk5Q0xFVkJRVVVzUTBGQlF5eERRVUZETEdWQlFWRXNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRGFrSXNTVUZCU1N4SFFVRkhMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03U1VGRGJFSXNRMEZCUXp0SlFVVkVMRVZCUVVVc1EwRkJReXhEUVVGRExHTkJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRaaXhOUVVGTkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdTVUZEYkVJc1EwRkJRenRKUVVWRUxFVkJRVVVzUTBGQlF5eERRVUZETEdOQlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRGFFSXNUVUZCVFN4RFFVRkRMRWRCUVVjc1EwRkJRenRKUVVObUxFTkJRVU03U1VGRFJDeEZRVUZGTEVOQlFVTXNRMEZCUXl4bFFVRlJMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzFGQlEycENMRTFCUVUwc1EwRkJReXhIUVVGSExFTkJRVU1zUjBGQlJ5eEZRVUZGTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF6dEpRVU55UXl4RFFVRkRPMGxCUlVRc1NVRkJTU3hYUVVGWExFZEJRVWNzVFVGQlRTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wbEJRMnhETEVsQlFVa3NUVUZCVFN4SFFVRkhMRWRCUVVjc1EwRkJReXhYUVVGWExFTkJRVU1zUTBGQlF6dEpRVVU1UWl4RlFVRkZMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU1zVFVGQlRTeExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRjRUlzUlVGQlJTeERRVUZETEVOQlFVTXNUVUZCVFN4TFFVRkxMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dFpRVU53UWl4RlFVRkZMRU5CUVVNc1EwRkJReXhqUVVGUExFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMmRDUVVObUxFZEJRVWNzUTBGQlF5eE5RVUZOTEVOQlFVTXNWMEZCVnl4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVGRE8xbEJReTlDTEVOQlFVTTdXVUZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRuUWtGRFNpeFBRVUZQTEVkQlFVY3NRMEZCUXl4WFFVRlhMRU5CUVVNc1EwRkJRenRaUVVNMVFpeERRVUZETzFGQlEwd3NRMEZCUXp0SlFVTk1MRU5CUVVNN1NVRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dFJRVU5LTEVWQlFVVXNRMEZCUXl4RFFVRkRMRWRCUVVjc1EwRkJReXhYUVVGWExFTkJRVU1zUzBGQlN5eExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1dVRkRPVUlzVFVGQlRTeERRVUZETEVkQlFVY3NRMEZCUXl4SFFVRkhMRU5CUVVNc1YwRkJWeXhEUVVGRExFVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8xRkJRMmhFTEVOQlFVTTdTVUZEVEN4RFFVRkRPMGxCUlVRc1RVRkJUU3hEUVVGRExFZEJRVWNzUTBGQlF6dEJRVU5tTEVOQlFVTTdRVUZzUTJVc1YwRkJSeXhOUVd0RGJFSXNRMEZCUVR0QlFVVkVMR0ZCUVc5Q0xFZEJRVkVzUlVGQlJTeEpRVUZUTEVWQlFVVXNXVUZCYTBJN1NVRkRka1FzUlVGQlJTeERRVUZETEVOQlFVTXNaVUZCVVN4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dFJRVU5xUWl4SlFVRkpMRWRCUVVjc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dEpRVU5zUWl4RFFVRkRPMGxCUTBRc1JVRkJSU3hEUVVGRExFTkJRVU1zWTBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRSUVVOb1FpeE5RVUZOTEVOQlFVTXNSMEZCUnl4RFFVRkRPMGxCUTJZc1EwRkJRenRKUVVORUxFVkJRVVVzUTBGQlF5eERRVUZETEdOQlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRFppeE5RVUZOTEVOQlFVTXNXVUZCV1N4RFFVRkRPMGxCUTNoQ0xFTkJRVU03U1VGRFJDeEZRVUZGTEVOQlFVTXNRMEZCUXl4bFFVRlJMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzFGQlEycENMRTFCUVUwc1EwRkJReXhIUVVGSExFTkJRVU1zUjBGQlJ5eEZRVUZGTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExFVkJRVVVzV1VGQldTeERRVUZETEVOQlFVTTdTVUZEYmtRc1EwRkJRenRKUVVWRUxFbEJRVWtzVjBGQlZ5eEhRVUZITEUxQlFVMHNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dEpRVVZzUXl4RlFVRkZMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU1zVFVGQlRTeExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRjRUlzUlVGQlJTeERRVUZETEVOQlFVTXNSMEZCUnl4RFFVRkRMRmRCUVZjc1EwRkJReXhMUVVGTExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0WlFVTTVRaXhOUVVGTkxFTkJRVU1zV1VGQldTeERRVUZETzFGQlEzaENMRU5CUVVNN1VVRkRSQ3hOUVVGTkxFTkJRVU1zUjBGQlJ5eERRVUZETEZkQlFWY3NRMEZCUXl4RFFVRkRPMGxCUXpWQ0xFTkJRVU03U1VGRlJDeE5RVUZOTEVOQlFVTXNSMEZCUnl4RFFVRkRMRWRCUVVjc1EwRkJReXhYUVVGWExFTkJRVU1zUlVGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJReXhGUVVGRkxGbEJRVmtzUTBGQlF5eERRVUZETzBGQlF6bEVMRU5CUVVNN1FVRjRRbVVzVjBGQlJ5eE5RWGRDYkVJc1EwRkJRVHRCUVU5WkxHdENRVUZWTEVkQlFVY3NWVUZCUXl4VFFVRlRMRVZCUVVVc1NVRkJTVHRKUVVOMFF5eEZRVUZGTEVOQlFVTXNRMEZCUXl4VFFVRlRMRXRCUVVzc1JVRkJSU3hEUVVGRExFTkJRVU1zUTBGQlF6dFJRVU51UWl4VFFVRlRMRWRCUVVjc1NVRkJTU3hEUVVGRE8wbEJRM0pDTEVOQlFVTTdTVUZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRSUVVOS0xGTkJRVk1zUjBGQlJ5eFRRVUZUTEVkQlFVY3NSMEZCUnl4SFFVRkhMRWxCUVVrc1EwRkJRenRKUVVOMlF5eERRVUZETzBsQlEwUXNUVUZCVFN4RFFVRkRMRk5CUVZNc1EwRkJRenRCUVVOeVFpeERRVUZETEVOQlFVTWlmUT09XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uLy4uL3NyYy9wYXRoLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQ2FjaGVNYXBfMSA9IHJlcXVpcmUoJy4vQ2FjaGVNYXAnKTtcbnZhciBDYWNoZUl0ZW0gPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENhY2hlSXRlbShlbnRpdHksIGxpdmVJdGVtKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuY2xvbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IENhY2hlSXRlbShfdGhpcy5lbnRpdHksIF90aGlzKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XG4gICAgICAgIGlmIChsaXZlSXRlbSkge1xuICAgICAgICAgICAgdGhpcy5tYXBGcm9tID0gbGl2ZUl0ZW0ubWFwRnJvbS5jbG9uZSgpO1xuICAgICAgICAgICAgdGhpcy5tYXBUbyA9IGxpdmVJdGVtLm1hcFRvLmNsb25lKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm1hcEZyb20gPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLm1hcFRvID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBDYWNoZUl0ZW07XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ2FjaGVJdGVtO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pUTJGamFHVkpkR1Z0TG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhNaU9sc2lMaTR2TGk0dmMzSmpMME5oWTJobFNYUmxiUzUwY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pTzBGQlFVRXNlVUpCUVhGQ0xGbEJRVmtzUTBGQlF5eERRVUZCTzBGQlVXeERPMGxCUzBrc2JVSkJRVmtzVFVGQlZTeEZRVUZGTEZGQlFXOUNPMUZCVEdoRUxHbENRWEZDUXp0UlFVaEhMRlZCUVVzc1IwRkJSenRaUVVOS0xFMUJRVTBzUTBGQlF5eEpRVUZKTEZOQlFWTXNRMEZCUXl4TFFVRkpMRU5CUVVNc1RVRkJUU3hGUVVGRkxFdEJRVWtzUTBGQlF5eERRVUZETzFGQlF6VkRMRU5CUVVNc1EwRkJRVHRSUVdSSExFbEJRVWtzUTBGQlF5eE5RVUZOTEVkQlFVY3NUVUZCVFN4RFFVRkRPMUZCUlhKQ0xFVkJRVVVzUTBGQlF5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRMRU5CUVVNN1dVRkZXQ3hKUVVGSkxFTkJRVU1zVDBGQlR5eEhRVUZITEZGQlFWRXNRMEZCUXl4UFFVRlBMRU5CUVVNc1MwRkJTeXhGUVVGRkxFTkJRVU03V1VGRGVFTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1IwRkJSeXhSUVVGUkxFTkJRVU1zUzBGQlN5eERRVUZETEV0QlFVc3NSVUZCUlN4RFFVRkRPMUZCUTNoRExFTkJRVU03VVVGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0WlFVTktMRWxCUVVrc1EwRkJReXhQUVVGUExFZEJRVWNzU1VGQlNTeHJRa0ZCVVN4RlFVRnBRaXhEUVVGRE8xbEJRemRETEVsQlFVa3NRMEZCUXl4TFFVRkxMRWRCUVVjc1NVRkJTU3hyUWtGQlVTeEZRVUZwUWl4RFFVRkRPMUZCUXk5RExFTkJRVU03U1VGRFRDeERRVUZETzBsQlMwd3NaMEpCUVVNN1FVRkJSQ3hEUVVGRExFRkJja0pFTEVsQmNVSkRPMEZCY2tKRU96SkNRWEZDUXl4RFFVRkJJbjA9XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uLy4uL3NyYy9DYWNoZUl0ZW0udHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBjYWNoZV8xID0gcmVxdWlyZSgnLi9jYWNoZScpO1xuZXhwb3J0cy5wcmludENhY2hlID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgdmFyIHJlc3VsdCA9IFwiXCI7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgY3VycmVudCA9IGluc3RhbmNlLnRocmVhZC5jdXJyZW50O1xuICAgIHZhciBub2RlSW5kaWNlcyA9IGluc3RhbmNlLnRocmVhZC5ub2RlcztcbiAgICBub2RlSW5kaWNlcy5tYXAoZnVuY3Rpb24gKGNhY2hlTm9kZUlkKSB7XG4gICAgICAgIHZhciBjYWNoZU5vZGUgPSBpbnN0YW5jZS5yZXBvLmdldChjYWNoZU5vZGVJZCk7XG4gICAgICAgIHZhciBzdHJlYW1EYXRhID0gXCJcIjtcbiAgICAgICAgdmFyIHN0YXRlID0gaW5kZXggKyBcIjpcIiArIHN0cmVhbURhdGEgKyBcIltcIiArIHN0cmluZ2lmeU1hcChjYWNoZU5vZGUuaXRlbXMpICsgXCJdXFxuXFxuXCI7XG4gICAgICAgIGlmIChpbmRleCA9PT0gY3VycmVudCkge1xuICAgICAgICAgICAgc3RhdGUgPSBcIi0+IFwiICsgc3RhdGU7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ICs9IHN0YXRlO1xuICAgICAgICBpbmRleCsrO1xuICAgIH0pO1xuICAgIHJlc3VsdCA9IHJlc3VsdC5zdWJzdHJpbmcoMCwgKHJlc3VsdC5sZW5ndGggLSAyKSk7XG4gICAgaW5kZXggPSAwO1xuICAgIHJldHVybiBcIlxcbi0tLS0tLSBPbmUgLS0tLS0tLVwiXG4gICAgICAgICsgXCJcXG5TVEFDSzpcXG5cIiArIHJlc3VsdFxuICAgICAgICArIFwiXFxuXFxuQ09ORklHOlwiICsgSlNPTi5zdHJpbmdpZnkoY2FjaGVfMS5jb25maWcsIG51bGwsIDIpXG4gICAgICAgICsgXCJcXG5cXG5SRVBPIFNJWkU6XCIgKyBpbnN0YW5jZS5yZXBvLmxlbmd0aFxuICAgICAgICArIFwiXFxuPT09PT09PT09PT09PT09PT09PVxcblwiO1xufTtcbnZhciBzdHJpbmdpZnlNYXAgPSBmdW5jdGlvbiAobWFwKSB7XG4gICAgdmFyIHJlc3VsdCA9IFwiXCI7XG4gICAgbWFwLmZvckVhY2goZnVuY3Rpb24gKGtleSwgaXRlbSkge1xuICAgICAgICB2YXIgaXRlbVJlc3VsdCA9IEpTT04uc3RyaW5naWZ5KGl0ZW0sIG51bGwsIDIpO1xuICAgICAgICByZXN1bHQgKz0gaXRlbVJlc3VsdCArIFwiLFxcblwiO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pY0hKcGJuUXVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjeUk2V3lJdUxpOHVMaTl6Y21NdmNISnBiblF1ZEhNaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWp0QlFVRkJMSE5DUVVGMVFpeFRRVUZUTEVOQlFVTXNRMEZCUVR0QlFWTndRaXhyUWtGQlZTeEhRVUZITEZWQlFVTXNVVUZCZDBJN1NVRkRMME1zU1VGQlNTeE5RVUZOTEVkQlFVY3NSVUZCUlN4RFFVRkRPMGxCUTJoQ0xFbEJRVWtzUzBGQlN5eEhRVUZITEVOQlFVTXNRMEZCUXp0SlFVTmtMRWxCUVVrc1QwRkJUeXhIUVVGSExGRkJRVkVzUTBGQlF5eE5RVUZOTEVOQlFVTXNUMEZCVHl4RFFVRkRPMGxCUlhSRExFbEJRVWtzVjBGQlZ5eEhRVUZITEZGQlFWRXNRMEZCUXl4TlFVRk5MRU5CUVVNc1MwRkJTeXhEUVVGRE8wbEJRM2hETEZkQlFWY3NRMEZCUXl4SFFVRkhMRU5CUVVNc1ZVRkJRU3hYUVVGWE8xRkJRM1pDTEVsQlFVa3NVMEZCVXl4SFFVRmxMRkZCUVZFc1EwRkJReXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEZkQlFWY3NRMEZCUXl4RFFVRkRPMUZCUlRORUxFbEJRVWtzVlVGQlZTeEhRVUZITEVWQlFVVXNRMEZCUXp0UlFVTndRaXhKUVVGSkxFdEJRVXNzUjBGQlJ5eExRVUZMTEVkQlFVY3NSMEZCUnl4SFFVRkhMRlZCUVZVc1IwRkJSeXhIUVVGSExFZEJRVWNzV1VGQldTeERRVUZETEZOQlFWTXNRMEZCUXl4TFFVRkxMRU5CUVVNc1IwRkJSeXhQUVVGUExFTkJRVU03VVVGRGNrWXNSVUZCUlN4RFFVRkRMRU5CUVVNc1MwRkJTeXhMUVVGTExFOUJRVThzUTBGQlF5eERRVUZETEVOQlFVTTdXVUZEY0VJc1MwRkJTeXhIUVVGSExFdEJRVXNzUjBGQlJ5eExRVUZMTEVOQlFVTTdVVUZETVVJc1EwRkJRenRSUVVORUxFMUJRVTBzU1VGQlNTeExRVUZMTEVOQlFVTTdVVUZEYUVJc1MwRkJTeXhGUVVGRkxFTkJRVU03U1VGRFdpeERRVUZETEVOQlFVTXNRMEZCUXp0SlFVVklMRTFCUVUwc1IwRkJSeXhOUVVGTkxFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTXNSVUZCUlN4RFFVRkRMRTFCUVUwc1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0SlFVVnNSQ3hMUVVGTExFZEJRVWNzUTBGQlF5eERRVUZETzBsQlJWWXNUVUZCVFN4RFFVRkRMSE5DUVVGelFqdFZRVU4yUWl4WlFVRlpMRWRCUVVjc1RVRkJUVHRWUVVOeVFpeGhRVUZoTEVkQlFVY3NTVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhqUVVGTkxFVkJRVVVzU1VGQlNTeEZRVUZGTEVOQlFVTXNRMEZCUXp0VlFVTXZReXhuUWtGQlowSXNSMEZCUnl4UlFVRlJMRU5CUVVNc1NVRkJTU3hEUVVGRExFMUJRVTA3VlVGRGRrTXNlVUpCUVhsQ0xFTkJRVU03UVVGRGNFTXNRMEZCUXl4RFFVRkRPMEZCUlVZc1NVRkJUU3haUVVGWkxFZEJRVWNzVlVGQlF5eEhRVUYzUWp0SlFVTXhReXhKUVVGSkxFMUJRVTBzUjBGQlJ5eEZRVUZGTEVOQlFVTTdTVUZGYUVJc1IwRkJSeXhEUVVGRExFOUJRVThzUTBGQlF5eFZRVUZETEVkQlFVY3NSVUZCUlN4SlFVRmxPMUZCUXpkQ0xFbEJRVWtzVlVGQlZTeEhRVUZITEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1NVRkJTU3hGUVVGRkxFbEJRVWtzUlVGQlJTeERRVUZETEVOQlFVTXNRMEZCUXp0UlFVTXZReXhOUVVGTkxFbEJRVWtzVlVGQlZTeEhRVUZITEV0QlFVc3NRMEZCUXp0SlFVTnFReXhEUVVGRExFTkJRVU1zUTBGQlFUdEpRVVZHTEUxQlFVMHNRMEZCUXl4TlFVRk5MRU5CUVVNN1FVRkRiRUlzUTBGQlF5eERRVUZCSW4wPVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi8uLi9zcmMvcHJpbnQudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBDYWNoZVJlcG9fMSA9IHJlcXVpcmUoJy4vQ2FjaGVSZXBvJyk7XG52YXIgQ2FjaGVUaHJlYWRfMSA9IHJlcXVpcmUoJy4vQ2FjaGVUaHJlYWQnKTtcbnZhciBDYWNoZUluc3RhbmNlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDYWNoZUluc3RhbmNlKG5hbWUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5yZXBvID0gbmV3IENhY2hlUmVwb18xLmRlZmF1bHQoKTtcbiAgICAgICAgdGhpcy50aHJlYWQgPSBuZXcgQ2FjaGVUaHJlYWRfMS5kZWZhdWx0KCk7XG4gICAgICAgIHRoaXMubmV4dE5vZGVLZXkgPSAwO1xuICAgICAgICB0aGlzLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMucmVwbyA9IG5ldyBDYWNoZVJlcG9fMS5kZWZhdWx0KCk7XG4gICAgICAgICAgICBfdGhpcy50aHJlYWQgPSBuZXcgQ2FjaGVUaHJlYWRfMS5kZWZhdWx0KCk7XG4gICAgICAgICAgICBfdGhpcy5uZXh0Tm9kZUtleSA9IDA7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYWRkTm9kZSA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMucmVwby5hZGQobm9kZSkpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy50aHJlYWQuYWRkTm9kZShub2RlLmlkKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5uZXh0Tm9kZUtleSsrO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmxlbmd0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy50aHJlYWQubm9kZXMubGVuZ3RoO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMucmVwby5sZW5ndGg7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgfVxuICAgIHJldHVybiBDYWNoZUluc3RhbmNlO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IENhY2hlSW5zdGFuY2U7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lRMkZqYUdWSmJuTjBZVzVqWlM1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTlEWVdOb1pVbHVjM1JoYm1ObExuUnpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdRVUZEUVN3d1FrRkJjMElzWVVGQllTeERRVUZETEVOQlFVRTdRVUZEY0VNc05FSkJRWGRDTEdWQlFXVXNRMEZCUXl4RFFVRkJPMEZCY1VONFF6dEpRVTFKTEhWQ1FVRlpMRWxCUVZrN1VVRk9OVUlzYVVKQlowTkRPMUZCT1VKSExGTkJRVWtzUjBGQlpTeEpRVUZKTEcxQ1FVRlRMRVZCUVVVc1EwRkJRenRSUVVOdVF5eFhRVUZOTEVkQlFXbENMRWxCUVVrc2NVSkJRVmNzUlVGQlJTeERRVUZETzFGQlEzcERMR2RDUVVGWExFZEJRVmNzUTBGQlF5eERRVUZETzFGQlRYaENMRlZCUVVzc1IwRkJSenRaUVVOS0xFdEJRVWtzUTBGQlF5eEpRVUZKTEVkQlFVY3NTVUZCU1N4dFFrRkJVeXhGUVVGRkxFTkJRVU03V1VGRE5VSXNTMEZCU1N4RFFVRkRMRTFCUVUwc1IwRkJSeXhKUVVGSkxIRkNRVUZYTEVWQlFVVXNRMEZCUXp0WlFVTm9ReXhMUVVGSkxFTkJRVU1zVjBGQlZ5eEhRVUZITEVOQlFVTXNRMEZCUXp0UlFVTjZRaXhEUVVGRExFTkJRVUU3VVVGRlJDeFpRVUZQTEVkQlFVY3NWVUZCUXl4SlFVRm5RanRaUVVOMlFpeEZRVUZGTEVOQlFVTXNRMEZCUXl4TFFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1owSkJRM1JDTEV0QlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eEZRVUZGTEVOQlFVTXNRMEZCUXp0blFrRkROMElzUzBGQlNTeERRVUZETEZkQlFWY3NSVUZCUlN4RFFVRkRPMmRDUVVOdVFpeE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRPMWxCUTJoQ0xFTkJRVU03V1VGRFJDeE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRPMUZCUTJwQ0xFTkJRVU1zUTBGQlFUdFJRVVZFTEZkQlFVMHNSMEZCUnp0WlFVTk1MRTFCUVUwc1EwRkJReXhMUVVGSkxFTkJRVU1zVFVGQlRTeERRVUZETEV0QlFVc3NRMEZCUXl4TlFVRk5MRU5CUVVNN1VVRkRjRU1zUTBGQlF5eERRVUZCTzFGQlJVUXNVMEZCU1N4SFFVRkhPMWxCUTBnc1RVRkJUU3hEUVVGRExFdEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRPMUZCUXpWQ0xFTkJRVU1zUTBGQlFUdFJRWGhDUnl4SlFVRkpMRU5CUVVNc1NVRkJTU3hIUVVGSExFbEJRVWtzUTBGQlF6dEpRVU55UWl4RFFVRkRPMGxCZDBKTUxHOUNRVUZETzBGQlFVUXNRMEZCUXl4QlFXaERSQ3hKUVdkRFF6dEJRV2hEUkRzclFrRm5RME1zUTBGQlFTSjlcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vLi4vc3JjL0NhY2hlSW5zdGFuY2UudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBDYWNoZU1hcF8xID0gcmVxdWlyZSgnLi9DYWNoZU1hcCcpO1xudmFyIENhY2hlUmVwbyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2FjaGVSZXBvKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLml0ZW1zID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmxlbmd0aCA9IDA7XG4gICAgICAgIHRoaXMuZ2V0ID0gZnVuY3Rpb24gKG5vZGVJZCkgeyByZXR1cm4gKF90aGlzLml0ZW1zLmdldChub2RlSWQpKTsgfTtcbiAgICAgICAgdGhpcy5hZGQgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgaWYgKCFfdGhpcy5pdGVtcy5oYXMobm9kZS5pZCkpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5pdGVtcy5zZXQobm9kZS5pZCwgbm9kZSk7XG4gICAgICAgICAgICAgICAgX3RoaXMubGVuZ3RoKys7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZGVsZXRlID0gZnVuY3Rpb24gKG5vZGVJZCkge1xuICAgICAgICAgICAgaWYgKF90aGlzLml0ZW1zLmhhcyhub2RlSWQpKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuaXRlbXMuZGVsZXRlKG5vZGVJZCk7XG4gICAgICAgICAgICAgICAgX3RoaXMubGVuZ3RoLS07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBDYWNoZVJlcG87XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ2FjaGVSZXBvO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pUTJGamFHVlNaWEJ2TG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhNaU9sc2lMaTR2TGk0dmMzSmpMME5oWTJobFVtVndieTUwY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pTzBGQlEwRXNlVUpCUVhGQ0xGbEJRVmtzUTBGQlF5eERRVUZCTzBGQldXeERPMGxCUVVFN1VVRkJRU3hwUWtGeFFrTTdVVUZ3UWtjc1ZVRkJTeXhIUVVGNVFpeEpRVUZKTEd0Q1FVRlJMRVZCUVdNc1EwRkJRenRSUVVONlJDeFhRVUZOTEVkQlFWY3NRMEZCUXl4RFFVRkRPMUZCUlc1Q0xGRkJRVWNzUjBGQlJ5eFZRVUZETEUxQlFVMHNTVUZCYVVJc1QwRkJRU3hEUVVGRExFdEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRTFCUVUwc1EwRkJReXhEUVVGRExFVkJRWGhDTEVOQlFYZENMRU5CUVVNN1VVRkZka1FzVVVGQlJ5eEhRVUZITEZWQlFVTXNTVUZCWjBJN1dVRkRia0lzUlVGQlJTeERRVUZETEVOQlFVTXNRMEZCUXl4TFFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eEpRVUZKTEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8yZENRVU16UWl4TFFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eEpRVUZKTEVOQlFVTXNSVUZCUlN4RlFVRkZMRWxCUVVrc1EwRkJReXhEUVVGRE8yZENRVU01UWl4TFFVRkpMRU5CUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU03WjBKQlEyUXNUVUZCVFN4RFFVRkRMRWxCUVVrc1EwRkJRenRaUVVOb1FpeERRVUZETzFsQlEwUXNUVUZCVFN4RFFVRkRMRXRCUVVzc1EwRkJRenRSUVVOcVFpeERRVUZETEVOQlFVRTdVVUZGUkN4WFFVRk5MRWRCUVVjc1ZVRkJReXhOUVVGak8xbEJRM0JDTEVWQlFVVXNRMEZCUXl4RFFVRkRMRXRCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRuUWtGRGVrSXNTMEZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhOUVVGTkxFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdaMEpCUXpGQ0xFdEJRVWtzUTBGQlF5eE5RVUZOTEVWQlFVVXNRMEZCUXp0WlFVTnNRaXhEUVVGRE8xRkJRMHdzUTBGQlF5eERRVUZCTzBsQlEwd3NRMEZCUXp0SlFVRkVMR2RDUVVGRE8wRkJRVVFzUTBGQlF5eEJRWEpDUkN4SlFYRkNRenRCUVhKQ1JEc3lRa0Z4UWtNc1EwRkJRU0o5XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uLy4uL3NyYy9DYWNoZVJlcG8udHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBDYWNoZVRocmVhZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2FjaGVUaHJlYWQoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuY3VycmVudCA9IC0xO1xuICAgICAgICB0aGlzLm5vZGVzID0gW107XG4gICAgICAgIHRoaXMuYWRkTm9kZSA9IGZ1bmN0aW9uIChub2RlSWQpIHtcbiAgICAgICAgICAgIF90aGlzLm5vZGVzLnB1c2gobm9kZUlkKTtcbiAgICAgICAgICAgIF90aGlzLmN1cnJlbnQrKztcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIENhY2hlVGhyZWFkO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IENhY2hlVGhyZWFkO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pUTJGamFHVlVhSEpsWVdRdWFuTWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUlpd2ljMjkxY21ObGN5STZXeUl1TGk4dUxpOXpjbU12UTJGamFHVlVhSEpsWVdRdWRITWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqdEJRVzlDUVR0SlFVRkJPMUZCUVVFc2FVSkJVVU03VVVGUVJ5eFpRVUZQTEVkQlFWY3NRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRja0lzVlVGQlN5eEhRVUZyUWl4RlFVRkZMRU5CUVVNN1VVRkZNVUlzV1VGQlR5eEhRVUZITEZWQlFVTXNUVUZCWXp0WlFVTnlRaXhMUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJRenRaUVVONFFpeExRVUZKTEVOQlFVTXNUMEZCVHl4RlFVRkZMRU5CUVVNN1VVRkRia0lzUTBGQlF5eERRVUZCTzBsQlEwd3NRMEZCUXp0SlFVRkVMR3RDUVVGRE8wRkJRVVFzUTBGQlF5eEJRVkpFTEVsQlVVTTdRVUZTUkRzMlFrRlJReXhEUVVGQkluMD1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vLi4vc3JjL0NhY2hlVGhyZWFkLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgdXRpbF8xID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgY2FjaGVfMSA9IHJlcXVpcmUoJy4vY2FjaGUnKTtcbnZhciBnZXRfMSA9IHJlcXVpcmUoJy4vZ2V0Jyk7XG52YXIgQ2FjaGVNYXBfMSA9IHJlcXVpcmUoJy4vQ2FjaGVNYXAnKTtcbnZhciBvcGF0aCA9IHJlcXVpcmUoJy4vcGF0aCcpO1xudmFyIGZsdXNoXzEgPSByZXF1aXJlKCcuL2ZsdXNoJyk7XG52YXIgbG9jYXRlXzEgPSByZXF1aXJlKCcuL2xvY2F0ZScpO1xudmFyIHJlZl8xID0gcmVxdWlyZSgnLi9yZWYnKTtcbmV4cG9ydHMuZXZpY3RJdGVtID0gZnVuY3Rpb24gKG9iaiwgaW5zdGFuY2UpIHtcbiAgICB2YXIgdWlkQXJyYXkgPSBidWlsZEV2aWN0VWlkQXJyYXkob2JqKTtcbiAgICBpZiAodWlkQXJyYXkubGVuZ3RoID09IDApIHtcbiAgICAgICAgcmV0dXJuIGxvY2F0ZV8xLmdldENhbGxTdGF0cyhmYWxzZSwgaW5zdGFuY2UpO1xuICAgIH1cbiAgICB2YXIgY3VycmVudFN0YXRlID0gZ2V0XzEuZ2V0Q2FjaGVDdXJyZW50U3RhY2soaW5zdGFuY2UpO1xuICAgIHZhciBmb3VuZCA9IHVpZEFycmF5LnNvbWUoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRTdGF0ZSAmJiBjdXJyZW50U3RhdGUuaGFzKFN0cmluZyhpdGVtKSk7XG4gICAgfSk7XG4gICAgaWYgKCFmb3VuZCkge1xuICAgICAgICByZXR1cm4gbG9jYXRlXzEuZ2V0Q2FsbFN0YXRzKGZhbHNlLCBpbnN0YW5jZSk7XG4gICAgfVxuICAgIHZhciB0ZW1wU3RhdGUgPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgY3VycmVudFN0YXRlLmZvckVhY2goZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgdGVtcFN0YXRlLnNldChrZXksIHZhbHVlKTtcbiAgICB9KTtcbiAgICB2YXIgZmx1c2hNYXAgPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgdmFyIGV2aWN0TWFwID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgIHZhciBmbHVzaEFyZ3MgPSB7XG4gICAgICAgIGZsdXNoTWFwOiBmbHVzaE1hcCxcbiAgICAgICAgZXZpY3RNYXA6IGV2aWN0TWFwLFxuICAgICAgICBpbnN0YW5jZTogaW5zdGFuY2VcbiAgICB9O1xuICAgIHZhciBwYXJlbnRzQ2hhbmdlZCA9IFtdO1xuICAgIHVpZEFycmF5LmZvckVhY2goZnVuY3Rpb24gKHVpZCkge1xuICAgICAgICBmbHVzaEFyZ3MuZW50aXR5VWlkID0gdWlkO1xuICAgICAgICBjbGVhclRhcmdldFJlZkZyb21zKGZsdXNoQXJncyk7XG4gICAgICAgIGV2aWN0TWFwLnNldCh1aWQsIG51bGwpO1xuICAgICAgICBjbGVhclBhcmVudFJlZlRvcyh1aWRBcnJheSwgcGFyZW50c0NoYW5nZWQsIGZsdXNoQXJncyk7XG4gICAgfSk7XG4gICAgcHV0UGFyZW50c0NoYW5nZWQocGFyZW50c0NoYW5nZWQsIGZsdXNoTWFwLCBldmljdE1hcCwgaW5zdGFuY2UpO1xuICAgIGZsdXNoTWFwLmZvckVhY2goZnVuY3Rpb24gKGtleSwgaXRlbSkge1xuICAgICAgICB0ZW1wU3RhdGUuc2V0KGtleSwgaXRlbSk7XG4gICAgfSk7XG4gICAgZXZpY3RNYXAuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgIHRlbXBTdGF0ZS5kZWxldGUoa2V5KTtcbiAgICB9KTtcbiAgICBmbHVzaF8xLmZsdXNoKHRlbXBTdGF0ZSwgaW5zdGFuY2UpO1xuICAgIHJldHVybiBsb2NhdGVfMS5nZXRDYWxsU3RhdHModHJ1ZSwgaW5zdGFuY2UpO1xufTtcbnZhciBwdXRQYXJlbnRzQ2hhbmdlZCA9IGZ1bmN0aW9uIChwYXJlbnRzQ2hhbmdlZCwgZmx1c2hNYXAsIGV2aWN0TWFwLCBpbnN0YW5jZSkge1xuICAgIGlmIChwYXJlbnRzQ2hhbmdlZCAmJiBwYXJlbnRzQ2hhbmdlZC5sZW5ndGggPiAwICYmIHV0aWxfMS5jYWNoZVNpemUoaW5zdGFuY2UpID4gMCkge1xuICAgICAgICB2YXIgZmx1c2hBcmdzXzEgPSB7XG4gICAgICAgICAgICBmbHVzaE1hcDogZmx1c2hNYXAsXG4gICAgICAgICAgICBldmljdE1hcDogZXZpY3RNYXAsXG4gICAgICAgICAgICBpbnN0YW5jZTogaW5zdGFuY2VcbiAgICAgICAgfTtcbiAgICAgICAgZmx1c2hfMS5idWlsZEZsdXNoTWFwKGZsdXNoQXJnc18xKTtcbiAgICAgICAgZmx1c2hBcmdzXzEuZmx1c2hNYXAuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgICAgICByZWZfMS51cGRhdGVSZWZGcm9tcyhpdGVtLCBmbHVzaEFyZ3NfMSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG52YXIgY2xlYXJUYXJnZXRSZWZGcm9tcyA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICB2YXIgaXRlbSA9IGdldF8xLmdldENhY2hlZEl0ZW0oZmx1c2hBcmdzLmVudGl0eVVpZCwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICBpZiAoaXRlbSkge1xuICAgICAgICBpdGVtLm1hcFRvLmZvckVhY2goZnVuY3Rpb24gKHRvVWlkLCBwYXRocykge1xuICAgICAgICAgICAgdmFyIHJlZkl0ZW0gPSBmbHVzaF8xLmdldEl0ZW1GbHVzaE9yQ2FjaGVkKHRvVWlkLCBmbHVzaEFyZ3MpO1xuICAgICAgICAgICAgaWYgKHJlZkl0ZW0pIHtcbiAgICAgICAgICAgICAgICBjbGVhclJlZkZyb20ocmVmSXRlbSwgZmx1c2hBcmdzLmVudGl0eVVpZCk7XG4gICAgICAgICAgICAgICAgaWYgKHJlZkl0ZW0ubWFwRnJvbS5zaXplKCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZmx1c2hBcmdzLmVudGl0eVVpZCA9IHRvVWlkO1xuICAgICAgICAgICAgICAgICAgICBjbGVhclRhcmdldFJlZkZyb21zKGZsdXNoQXJncyk7XG4gICAgICAgICAgICAgICAgICAgIGZsdXNoQXJncy5ldmljdE1hcC5zZXQodG9VaWQsIHJlZkl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZmx1c2hBcmdzLmZsdXNoTWFwLnNldCh0b1VpZCwgcmVmSXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59O1xudmFyIGNsZWFyUmVmRnJvbSA9IGZ1bmN0aW9uIChyZWZJdGVtLCBwYXJlbnRVaWQpIHtcbiAgICB2YXIgcmVmc0FycmF5ID0gcmVmSXRlbS5tYXBGcm9tLmdldChwYXJlbnRVaWQpO1xuICAgIGlmICghcmVmc0FycmF5KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmVmSXRlbS5tYXBGcm9tID0gcmVmSXRlbS5tYXBGcm9tLmNsb25lKCk7XG4gICAgcmVmSXRlbS5tYXBGcm9tLmRlbGV0ZShwYXJlbnRVaWQpO1xufTtcbnZhciBjbGVhclBhcmVudFJlZlRvcyA9IGZ1bmN0aW9uICh1aWRBcnJheSwgcGFyZW50c0NoYW5nZWQsIGZsdXNoQXJncykge1xuICAgIHZhciBpdGVtID0gZmx1c2hfMS5nZXRJdGVtRmx1c2hPckNhY2hlZChmbHVzaEFyZ3MuZW50aXR5VWlkLCBmbHVzaEFyZ3MpO1xuICAgIGlmIChpdGVtKSB7XG4gICAgICAgIGl0ZW0ubWFwRnJvbS5mb3JFYWNoKGZ1bmN0aW9uIChwYXJlbnRVaWQsIHBhdGhzKSB7XG4gICAgICAgICAgICB2YXIgcGFyZW50SXRlbSA9IGZsdXNoXzEuZ2V0SXRlbUZsdXNoT3JDYWNoZWQocGFyZW50VWlkLCBmbHVzaEFyZ3MpO1xuICAgICAgICAgICAgaWYgKHBhcmVudEl0ZW0pIHtcbiAgICAgICAgICAgICAgICB2YXIgc3VjY2VzcyA9IGNsZWFyUmVmVG8ocGFyZW50SXRlbSwgZmx1c2hBcmdzLmVudGl0eVVpZCwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICBpZiAoc3VjY2VzcyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZmx1c2hNYXAuc2V0KHBhcmVudFVpZCwgcGFyZW50SXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1aWRBcnJheS5pbmRleE9mKHBhcmVudFVpZCkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRzQ2hhbmdlZC5wdXNoKHBhcmVudEl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59O1xudmFyIGNsZWFyUmVmVG8gPSBmdW5jdGlvbiAocGFyZW50SXRlbSwgcmVmVWlkLCBpbnN0YW5jZSkge1xuICAgIHZhciBwYXJlbnQgPSBwYXJlbnRJdGVtLmVudGl0eTtcbiAgICBpZiAoT2JqZWN0LmlzRnJvemVuKHBhcmVudCkpIHtcbiAgICAgICAgcGFyZW50ID0gZ2V0XzEuZ2V0RWRpdEl0ZW0ocGFyZW50W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdLCBpbnN0YW5jZSk7XG4gICAgICAgIHBhcmVudEl0ZW0uZW50aXR5ID0gcGFyZW50O1xuICAgIH1cbiAgICB2YXIgcmVmUGF0aHMgPSBwYXJlbnRJdGVtLm1hcFRvLmdldChyZWZVaWQpO1xuICAgIHJlZlBhdGhzLmZvckVhY2goZnVuY3Rpb24gKHBhdGgpIHtcbiAgICAgICAgb3BhdGguZGVsKHBhcmVudCwgcGF0aCk7XG4gICAgfSk7XG4gICAgaWYgKCFPYmplY3QuaXNGcm96ZW4ocGFyZW50KSkge1xuICAgICAgICBPYmplY3QuZnJlZXplKHBhcmVudCk7XG4gICAgfVxuICAgIHBhcmVudEl0ZW0uZW50aXR5ID0gcGFyZW50O1xuICAgIHBhcmVudEl0ZW0ubWFwVG8gPSBwYXJlbnRJdGVtLm1hcFRvLmNsb25lKCk7XG4gICAgcGFyZW50SXRlbS5tYXBUby5kZWxldGUocmVmVWlkKTtcbiAgICByZXR1cm4gdHJ1ZTtcbn07XG52YXIgYnVpbGRFdmljdFVpZEFycmF5ID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHZhciB1aWRBcnJheSA9IFtdO1xuICAgIGlmICh1dGlsXzEuaXNBcnJheShvYmopKSB7XG4gICAgICAgIG9iai5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICBpZiAodXRpbF8xLmhhc1VpZChpdGVtKSkge1xuICAgICAgICAgICAgICAgIHVpZEFycmF5LnB1c2goU3RyaW5nKGl0ZW1bY2FjaGVfMS5jb25maWcudWlkTmFtZV0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgaXRlbSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgICAgICB1aWRBcnJheS5wdXNoKFN0cmluZyhpdGVtKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHZhciB1aWQgPSBvYmo7XG4gICAgICAgIGlmICh1dGlsXzEuaXNPYmplY3Qob2JqKSkge1xuICAgICAgICAgICAgdWlkID0gb2JqW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1aWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHVpZEFycmF5O1xuICAgICAgICB9XG4gICAgICAgIHVpZEFycmF5LnB1c2goU3RyaW5nKHVpZCkpO1xuICAgIH1cbiAgICByZXR1cm4gdWlkQXJyYXk7XG59O1xuZXhwb3J0cy5jbGVhck5leHQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICB2YXIgdGhyZWFkID0gaW5zdGFuY2UudGhyZWFkO1xuICAgIGlmICh0aHJlYWQuY3VycmVudCA8IHRocmVhZC5ub2Rlcy5sZW5ndGggLSAxKSB7XG4gICAgICAgIHZhciByZW1vdmVkTm9kZXMgPSB0aHJlYWQubm9kZXMuc2xpY2UodGhyZWFkLmN1cnJlbnQgKyAxLCB0aHJlYWQubm9kZXMubGVuZ3RoKTtcbiAgICAgICAgdGhyZWFkLm5vZGVzID0gdGhyZWFkLm5vZGVzLnNsaWNlKDAsIHRocmVhZC5jdXJyZW50ICsgMSk7XG4gICAgICAgIHRocmVhZC5jdXJyZW50ID0gdGhyZWFkLm5vZGVzLmxlbmd0aCAtIDE7XG4gICAgICAgIHRydW5jYXRlVGhyZWFkcyhyZW1vdmVkTm9kZXMsIGluc3RhbmNlKTtcbiAgICB9XG59O1xudmFyIHRydW5jYXRlVGhyZWFkcyA9IGZ1bmN0aW9uIChyZW1vdmVkTm9kZXMsIGluc3RhbmNlKSB7XG4gICAgcmVtb3ZlZE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKGNhY2hlTm9kZUlkKSB7XG4gICAgICAgIHZhciBjYWNoZU5vZGUgPSBpbnN0YW5jZS5yZXBvLmdldChjYWNoZU5vZGVJZCk7XG4gICAgICAgIGlmIChjYWNoZU5vZGUpIHtcbiAgICAgICAgICAgIGluc3RhbmNlLnJlcG8uZGVsZXRlKGNhY2hlTm9kZUlkKTtcbiAgICAgICAgfVxuICAgIH0pO1xufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaVpYWnBZM1F1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sY3lJNld5SXVMaTh1TGk5emNtTXZaWFpwWTNRdWRITWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqdEJRVU5CTEhGQ1FVRnhSQ3hSUVVGUkxFTkJRVU1zUTBGQlFUdEJRVU01UkN4elFrRkJkVUlzVTBGQlV5eERRVUZETEVOQlFVRTdRVUZEYWtNc2IwSkJRV2xGTEU5QlFVOHNRMEZCUXl4RFFVRkJPMEZCUTNwRkxIbENRVUZ4UWl4WlFVRlpMRU5CUVVNc1EwRkJRVHRCUVVWc1F5eEpRVUZaTEV0QlFVc3NWMEZCVFN4UlFVRlJMRU5CUVVNc1EwRkJRVHRCUVVOb1F5eHpRa0ZCTWtRc1UwRkJVeXhEUVVGRExFTkJRVUU3UVVGRmNrVXNkVUpCUVRaQ0xGVkJRVlVzUTBGQlF5eERRVUZCTzBGQlEzaERMRzlDUVVFclF5eFBRVUZQTEVOQlFVTXNRMEZCUVR0QlFWTXhReXhwUWtGQlV5eEhRVUZITEZWQlFVTXNSMEZCUnl4RlFVRkZMRkZCUVhkQ08wbEJSVzVFTEVsQlFVa3NVVUZCVVN4SFFVRkhMR3RDUVVGclFpeERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRPMGxCUlhaRExFVkJRVVVzUTBGQlF5eERRVUZETEZGQlFWRXNRMEZCUXl4TlFVRk5MRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dFJRVU4yUWl4TlFVRk5MRU5CUVVNc2NVSkJRVmtzUTBGQlF5eExRVUZMTEVWQlFVVXNVVUZCVVN4RFFVRkRMRU5CUVVNN1NVRkRla01zUTBGQlF6dEpRVU5FTEVsQlFVa3NXVUZCV1N4SFFVRkhMREJDUVVGdlFpeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMGxCUTJ4RUxFbEJRVWtzUzBGQlN5eEhRVUZITEZGQlFWRXNRMEZCUXl4SlFVRkpMRU5CUVVNc1ZVRkJRU3hKUVVGSk8xRkJRekZDTEUxQlFVMHNRMEZCUXl4WlFVRlpMRWxCUVVrc1dVRkJXU3hEUVVGRExFZEJRVWNzUTBGQlF5eE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJRenRKUVVNeFJDeERRVUZETEVOQlFVTXNRMEZCUXp0SlFVVklMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXp0UlFVTlVMRTFCUVUwc1EwRkJReXh4UWtGQldTeERRVUZETEV0QlFVc3NSVUZCUlN4UlFVRlJMRU5CUVVNc1EwRkJRenRKUVVONlF5eERRVUZETzBsQlJVUXNTVUZCU1N4VFFVRlRMRWRCUVVjc1NVRkJTU3hyUWtGQlVTeEZRVUZoTEVOQlFVTTdTVUZETVVNc1dVRkJXU3hEUVVGRExFOUJRVThzUTBGQlF5eFZRVUZETEVkQlFVY3NSVUZCUlN4TFFVRm5RanRSUVVOMlF5eFRRVUZUTEVOQlFVTXNSMEZCUnl4RFFVRkRMRWRCUVVjc1JVRkJSU3hMUVVGTExFTkJRVU1zUTBGQlF6dEpRVU01UWl4RFFVRkRMRU5CUVVNc1EwRkJRenRKUVZGSUxFbEJRVWtzVVVGQlVTeEhRVUZITEVsQlFVa3NhMEpCUVZFc1JVRkJZU3hEUVVGRE8wbEJRM3BETEVsQlFVa3NVVUZCVVN4SFFVRkhMRWxCUVVrc2EwSkJRVkVzUlVGQllTeERRVUZETzBsQlJYcERMRWxCUVVrc1UwRkJVeXhIUVVGbE8xRkJRM2hDTEZGQlFWRXNSVUZCUlN4UlFVRlJPMUZCUTJ4Q0xGRkJRVkVzUlVGQlJTeFJRVUZSTzFGQlEyeENMRkZCUVZFc1JVRkJSU3hSUVVGUk8wdEJRM0pDTEVOQlFVRTdTVUZGUkN4SlFVRkpMR05CUVdNc1IwRkJSeXhGUVVGRkxFTkJRVU03U1VGRmVFSXNVVUZCVVN4RFFVRkRMRTlCUVU4c1EwRkJReXhWUVVGQkxFZEJRVWM3VVVGRGFFSXNVMEZCVXl4RFFVRkRMRk5CUVZNc1IwRkJSeXhIUVVGSExFTkJRVU03VVVGSE1VSXNiVUpCUVcxQ0xFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdVVUZITDBJc1VVRkJVU3hEUVVGRExFZEJRVWNzUTBGQlF5eEhRVUZITEVWQlFVVXNTVUZCU1N4RFFVRkRMRU5CUVVNN1VVRkhlRUlzYVVKQlFXbENMRU5CUVVNc1VVRkJVU3hGUVVGRkxHTkJRV01zUlVGQlJTeFRRVUZUTEVOQlFVTXNRMEZCUXp0SlFVTXpSQ3hEUVVGRExFTkJRVU1zUTBGQlF6dEpRVVZJTEdsQ1FVRnBRaXhEUVVGRExHTkJRV01zUlVGQlJTeFJRVUZSTEVWQlFVVXNVVUZCVVN4RlFVRkZMRkZCUVZFc1EwRkJReXhEUVVGRE8wbEJSMmhGTEZGQlFWRXNRMEZCUXl4UFFVRlBMRU5CUVVNc1ZVRkJReXhIUVVGSExFVkJRVVVzU1VGQlpUdFJRVU5zUXl4VFFVRlRMRU5CUVVNc1IwRkJSeXhEUVVGRExFZEJRVWNzUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXp0SlFVTTNRaXhEUVVGRExFTkJRVU1zUTBGQlF6dEpRVWRJTEZGQlFWRXNRMEZCUXl4UFFVRlBMRU5CUVVNc1ZVRkJReXhIUVVGSExFVkJRVVVzU1VGQlpUdFJRVU5zUXl4VFFVRlRMRU5CUVVNc1RVRkJUU3hEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETzBsQlF6RkNMRU5CUVVNc1EwRkJReXhEUVVGRE8wbEJSVWdzWVVGQlN5eERRVUZETEZOQlFWTXNSVUZCUlN4UlFVRlJMRU5CUVVNc1EwRkJRenRKUVVVelFpeE5RVUZOTEVOQlFVTXNjVUpCUVZrc1EwRkJReXhKUVVGSkxFVkJRVVVzVVVGQlVTeERRVUZETEVOQlFVTTdRVUZEZUVNc1EwRkJReXhEUVVGRE8wRkJSVVlzU1VGQlRTeHBRa0ZCYVVJc1IwRkJSeXhWUVVGRExHTkJRVEJDTEVWQlFVVXNVVUZCTmtJc1JVRkJSU3hSUVVFMlFpeEZRVUZGTEZGQlFYZENPMGxCUTNwSkxFVkJRVVVzUTBGQlF5eERRVUZETEdOQlFXTXNTVUZCU1N4alFVRmpMRU5CUVVNc1RVRkJUU3hIUVVGSExFTkJRVU1zU1VGQlNTeG5Ra0ZCVXl4RFFVRkRMRkZCUVZFc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdVVUZEZWtVc1NVRkJTU3hYUVVGVExFZEJRV1U3V1VGRGVFSXNVVUZCVVN4RlFVRkZMRkZCUVZFN1dVRkRiRUlzVVVGQlVTeEZRVUZGTEZGQlFWRTdXVUZEYkVJc1VVRkJVU3hGUVVGRkxGRkJRVkU3VTBGRGNrSXNRMEZCUVR0UlFVTkVMSEZDUVVGaExFTkJRVU1zVjBGQlV5eERRVUZETEVOQlFVTTdVVUZGZWtJc1YwRkJVeXhEUVVGRExGRkJRVkVzUTBGQlF5eFBRVUZQTEVOQlFVTXNWVUZCUXl4SFFVRkhMRVZCUVVVc1NVRkJaVHRaUVVjMVF5eHZRa0ZCWXl4RFFVRkRMRWxCUVVrc1JVRkJSU3hYUVVGVExFTkJRVU1zUTBGQlF6dFJRVU53UXl4RFFVRkRMRU5CUVVNc1EwRkJRVHRKUVVOT0xFTkJRVU03UVVGRFRDeERRVUZETEVOQlFVTTdRVUZUUml4SlFVRk5MRzFDUVVGdFFpeEhRVUZITEZWQlFVTXNVMEZCY1VJN1NVRkRPVU1zU1VGQlNTeEpRVUZKTEVkQlFXTXNiVUpCUVdFc1EwRkJReXhUUVVGVExFTkJRVU1zVTBGQlV5eEZRVUZGTEZOQlFWTXNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRKUVVNM1JTeEZRVUZGTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRE8xRkJRMUFzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1ZVRkJReXhMUVVGTExFVkJRVVVzUzBGQlN6dFpRVU0xUWl4SlFVRkpMRTlCUVU4c1IwRkJZeXcwUWtGQmIwSXNRMEZCUXl4TFFVRkxMRVZCUVVVc1UwRkJVeXhEUVVGRExFTkJRVU03V1VGRGFFVXNSVUZCUlN4RFFVRkRMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU1zUTBGQlF6dG5Ra0ZEVml4WlFVRlpMRU5CUVVNc1QwRkJUeXhGUVVGRkxGTkJRVk1zUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXp0blFrRkRNME1zUlVGQlJTeERRVUZETEVOQlFVTXNUMEZCVHl4RFFVRkRMRTlCUVU4c1EwRkJReXhKUVVGSkxFVkJRVVVzUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMjlDUVVNdlFpeFRRVUZUTEVOQlFVTXNVMEZCVXl4SFFVRkhMRXRCUVVzc1EwRkJRenR2UWtGRE5VSXNiVUpCUVcxQ0xFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdiMEpCUXk5Q0xGTkJRVk1zUTBGQlF5eFJRVUZSTEVOQlFVTXNSMEZCUnl4RFFVRkRMRXRCUVVzc1JVRkJSU3hQUVVGUExFTkJRVU1zUTBGQlF6dG5Ra0ZETTBNc1EwRkJRenRuUWtGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0dlFrRkRTaXhUUVVGVExFTkJRVU1zVVVGQlVTeERRVUZETEVkQlFVY3NRMEZCUXl4TFFVRkxMRVZCUVVVc1QwRkJUeXhEUVVGRExFTkJRVU03WjBKQlF6TkRMRU5CUVVNN1dVRkRUQ3hEUVVGRE8xRkJRMHdzUTBGQlF5eERRVUZETEVOQlFVRTdTVUZEVGl4RFFVRkRPMEZCUTB3c1EwRkJReXhEUVVGRE8wRkJVVVlzU1VGQlRTeFpRVUZaTEVkQlFVY3NWVUZCUXl4UFFVRnJRaXhGUVVGRkxGTkJRVk03U1VGREwwTXNTVUZCU1N4VFFVRlRMRWRCUVVjc1QwRkJUeXhEUVVGRExFOUJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN1NVRkRMME1zUlVGQlJTeERRVUZETEVOQlFVTXNRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJReXhEUVVGRE8xRkJRMklzVFVGQlRTeERRVUZETzBsQlExZ3NRMEZCUXp0SlFVTkVMRTlCUVU4c1EwRkJReXhQUVVGUExFZEJRVWNzVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4TFFVRkxMRVZCUVVVc1EwRkJRenRKUVVNeFF5eFBRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRMRTFCUVUwc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dEJRVU4wUXl4RFFVRkRMRU5CUVVNN1FVRnZRa1lzU1VGQlRTeHBRa0ZCYVVJc1IwRkJSeXhWUVVGRExGRkJRVkVzUlVGQlJTeGpRVUZqTEVWQlFVVXNVMEZCY1VJN1NVRkRkRVVzU1VGQlNTeEpRVUZKTEVkQlFXTXNORUpCUVc5Q0xFTkJRVU1zVTBGQlV5eERRVUZETEZOQlFWTXNSVUZCUlN4VFFVRlRMRU5CUVVNc1EwRkJRenRKUVVVelJTeEZRVUZGTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRE8xRkJRMUFzU1VGQlNTeERRVUZETEU5QlFVOHNRMEZCUXl4UFFVRlBMRU5CUVVNc1ZVRkJReXhUUVVGVExFVkJRVVVzUzBGQlN6dFpRVU5zUXl4SlFVRkpMRlZCUVZVc1IwRkJSeXcwUWtGQmIwSXNRMEZCUXl4VFFVRlRMRVZCUVVVc1UwRkJVeXhEUVVGRExFTkJRVU03V1VGRE5VUXNSVUZCUlN4RFFVRkRMRU5CUVVNc1ZVRkJWU3hEUVVGRExFTkJRVU1zUTBGQlF6dG5Ra0ZEWWl4SlFVRkpMRTlCUVU4c1IwRkJSeXhWUVVGVkxFTkJRVU1zVlVGQlZTeEZRVUZGTEZOQlFWTXNRMEZCUXl4VFFVRlRMRVZCUVVVc1UwRkJVeXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETzJkQ1FVTTVSU3hGUVVGRkxFTkJRVU1zUTBGQlF5eFBRVUZQTEV0QlFVc3NTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJRenR2UWtGRGJrSXNVMEZCVXl4RFFVRkRMRkZCUVZFc1EwRkJReXhIUVVGSExFTkJRVU1zVTBGQlV5eEZRVUZGTEZWQlFWVXNRMEZCUXl4RFFVRkRPMjlDUVVNNVF5eEZRVUZGTEVOQlFVTXNRMEZCUXl4UlFVRlJMRU5CUVVNc1QwRkJUeXhEUVVGRExGTkJRVk1zUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN2QwSkJRMnhETEdOQlFXTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1ZVRkJWU3hEUVVGRExFTkJRVU03YjBKQlEzQkRMRU5CUVVNN1owSkJRMHdzUTBGQlF6dFpRVU5NTEVOQlFVTTdVVUZEVEN4RFFVRkRMRU5CUVVNc1EwRkJRVHRKUVVOT0xFTkJRVU03UVVGRFRDeERRVUZETEVOQlFVTTdRVUZSUml4SlFVRk5MRlZCUVZVc1IwRkJSeXhWUVVGRExGVkJRWEZDTEVWQlFVVXNUVUZCVFN4RlFVRkZMRkZCUVhkQ08wbEJSWFpGTEVsQlFVa3NUVUZCVFN4SFFVRkhMRlZCUVZVc1EwRkJReXhOUVVGTkxFTkJRVU03U1VGREwwSXNSVUZCUlN4RFFVRkRMRU5CUVVNc1RVRkJUU3hEUVVGRExGRkJRVkVzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRNVUlzVFVGQlRTeEhRVUZITEdsQ1FVRlhMRU5CUVVNc1RVRkJUU3hEUVVGRExHTkJRVTBzUTBGQlF5eFBRVUZQTEVOQlFVTXNSVUZCUlN4UlFVRlJMRU5CUVVNc1EwRkJRenRSUVVOMlJDeFZRVUZWTEVOQlFVTXNUVUZCVFN4SFFVRkhMRTFCUVUwc1EwRkJRenRKUVVNdlFpeERRVUZETzBsQlEwUXNTVUZCU1N4UlFVRlJMRWRCUVVjc1ZVRkJWU3hEUVVGRExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1NVRkROVU1zVVVGQlVTeERRVUZETEU5QlFVOHNRMEZCUXl4VlFVRkJMRWxCUVVrN1VVRkRha0lzUzBGQlN5eERRVUZETEVkQlFVY3NRMEZCUXl4TlFVRk5MRVZCUVVVc1NVRkJTU3hEUVVGRExFTkJRVU03U1VGRE5VSXNRMEZCUXl4RFFVRkRMRU5CUVVNN1NVRkRTQ3hGUVVGRkxFTkJRVU1zUTBGQlF5eERRVUZETEUxQlFVMHNRMEZCUXl4UlFVRlJMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzFGQlF6TkNMRTFCUVUwc1EwRkJReXhOUVVGTkxFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdTVUZETVVJc1EwRkJRenRKUVVORUxGVkJRVlVzUTBGQlF5eE5RVUZOTEVkQlFVY3NUVUZCVFN4RFFVRkRPMGxCUnpOQ0xGVkJRVlVzUTBGQlF5eExRVUZMTEVkQlFVY3NWVUZCVlN4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFVkJRVVVzUTBGQlF6dEpRVU0xUXl4VlFVRlZMRU5CUVVNc1MwRkJTeXhEUVVGRExFMUJRVTBzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0SlFVTm9ReXhOUVVGTkxFTkJRVU1zU1VGQlNTeERRVUZETzBGQlEyaENMRU5CUVVNc1EwRkJRenRCUVU5R0xFbEJRVTBzYTBKQlFXdENMRWRCUVVjc1ZVRkJRU3hIUVVGSE8wbEJRekZDTEVsQlFVa3NVVUZCVVN4SFFVRkhMRVZCUVVVc1EwRkJRenRKUVVOc1FpeEZRVUZGTEVOQlFVTXNRMEZCUXl4alFVRlBMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzFGQlJXWXNSMEZCUnl4RFFVRkRMRTlCUVU4c1EwRkJReXhWUVVGQkxFbEJRVWs3V1VGRFdpeEZRVUZGTEVOQlFVTXNRMEZCUXl4aFFVRk5MRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzJkQ1FVTm1MRkZCUVZFc1EwRkJReXhKUVVGSkxFTkJRVU1zVFVGQlRTeERRVUZETEVsQlFVa3NRMEZCUXl4alFVRk5MRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzFsQlEyaEVMRU5CUVVNN1dVRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dG5Ra0ZEU2l4RlFVRkZMRU5CUVVNc1EwRkJReXhQUVVGUExFbEJRVWtzUzBGQlN5eFJRVUZSTEVsQlFVa3NUMEZCVHl4SlFVRkpMRXRCUVVzc1VVRkJVU3hEUVVGRExFTkJRVU1zUTBGQlF6dHZRa0ZEZGtRc1VVRkJVU3hEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJRVHRuUWtGREwwSXNRMEZCUXp0WlFVVk1MRU5CUVVNN1VVRkRUQ3hEUVVGRExFTkJRVU1zUTBGQlF6dEpRVU5RTEVOQlFVTTdTVUZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRSUVVOS0xFbEJRVWtzUjBGQlJ5eEhRVUZITEVkQlFVY3NRMEZCUXp0UlFVTmtMRVZCUVVVc1EwRkJReXhEUVVGRExHVkJRVkVzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1dVRkRhRUlzUjBGQlJ5eEhRVUZITEVkQlFVY3NRMEZCUXl4alFVRk5MRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03VVVGRE9VSXNRMEZCUXp0UlFVTkVMRVZCUVVVc1EwRkJReXhEUVVGRExFZEJRVWNzUzBGQlN5eFRRVUZUTEVOQlFVTXNRMEZCUXl4RFFVRkRPMWxCUTNCQ0xFMUJRVTBzUTBGQlF5eFJRVUZSTEVOQlFVTTdVVUZEY0VJc1EwRkJRenRSUVVORUxGRkJRVkVzUTBGQlF5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU03U1VGREwwSXNRMEZCUXp0SlFVTkVMRTFCUVUwc1EwRkJReXhSUVVGUkxFTkJRVU03UVVGRGNFSXNRMEZCUXl4RFFVRkRPMEZCVlZjc2FVSkJRVk1zUjBGQlJ5eFZRVUZETEZGQlFYZENPMGxCUlRsRExFbEJRVWtzVFVGQlRTeEhRVUZITEZGQlFWRXNRMEZCUXl4TlFVRk5MRU5CUVVNN1NVRkROMElzUlVGQlJTeERRVUZETEVOQlFVTXNUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhOUVVGTkxFTkJRVU1zUzBGQlN5eERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8xRkJRek5ETEVsQlFVa3NXVUZCV1N4SFFVRkhMRTFCUVUwc1EwRkJReXhMUVVGTExFTkJRVU1zUzBGQlN5eERRVUZETEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1EwRkJReXhGUVVGRkxFMUJRVTBzUTBGQlF5eExRVUZMTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1VVRkRMMFVzVFVGQlRTeERRVUZETEV0QlFVc3NSMEZCUnl4TlFVRk5MRU5CUVVNc1MwRkJTeXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVWQlFVVXNUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF6dFJRVU42UkN4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExFMUJRVTBzUTBGQlF5eExRVUZMTEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1EwRkJRenRSUVVONlF5eGxRVUZsTEVOQlFVTXNXVUZCV1N4RlFVRkZMRkZCUVZFc1EwRkJReXhEUVVGRE8wbEJRelZETEVOQlFVTTdRVUZEVEN4RFFVRkRMRU5CUVVNN1FVRk5SaXhKUVVGTkxHVkJRV1VzUjBGQlJ5eFZRVUZETEZsQlFWa3NSVUZCUlN4UlFVRjNRanRKUVVNelJDeFpRVUZaTEVOQlFVTXNUMEZCVHl4RFFVRkRMRlZCUVVFc1YwRkJWenRSUVVNMVFpeEpRVUZKTEZOQlFWTXNSMEZCUnl4UlFVRlJMRU5CUVVNc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eFhRVUZYTEVOQlFVTXNRMEZCUXp0UlFVTXZReXhGUVVGRkxFTkJRVU1zUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXl4RFFVRkRPMWxCUTFvc1VVRkJVU3hEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNWMEZCVnl4RFFVRkRMRU5CUVVNN1VVRkRkRU1zUTBGQlF6dEpRVU5NTEVOQlFVTXNRMEZCUXl4RFFVRkRPMEZCUTFBc1EwRkJReXhEUVVGREluMD1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vLi4vc3JjL2V2aWN0LnRzIl0sInNvdXJjZVJvb3QiOiIifQ==