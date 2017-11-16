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
	
	Object.defineProperty(exports, "__esModule", { value: true });
	var cache_1 = __webpack_require__(1);
	exports.evict = cache_1.evict;
	exports.get = cache_1.get;
	exports.getCache = cache_1.getCache;
	exports.getEdit = cache_1.getEdit;
	exports.print = cache_1.print;
	exports.put = cache_1.put;
	exports.reset = cache_1.reset;
	exports.uuid = cache_1.uuid;
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
	
	Object.defineProperty(exports, "__esModule", { value: true });
	var CacheInstance_1 = __webpack_require__(2);
	var util_1 = __webpack_require__(6);
	var config_1 = __webpack_require__(9);
	var get_1 = __webpack_require__(10);
	var evict_1 = __webpack_require__(13);
	var cacheUtil_1 = __webpack_require__(11);
	var print_1 = __webpack_require__(18);
	var put_1 = __webpack_require__(19);
	exports.instances = {};
	var cacheTest = false;
	function setTesting(testing) {
	    cacheTest = testing;
	}
	exports.setTesting = setTesting;
	function getCache(instanceName, configuration) {
	    if (instanceName === void 0) {
	        instanceName = 'one';
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
	        return instance.reset();
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
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	var CacheRepo_1 = __webpack_require__(3);
	var CacheThread_1 = __webpack_require__(5);
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
	exports.default = CacheInstance;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
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
	exports.default = CacheRepo;

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
	Object.defineProperty(exports, "__esModule", { value: true });
	var CacheMap = function () {
	    function CacheMap() {
	        var _this = this;
	        this.paths = {};
	        this.length = 0;
	        this.get = function (key) {
	            return _this.paths[key];
	        };
	        this.delete = function (key) {
	            if (typeof _this.paths[key] !== 'undefined' && _this.length > 0) {
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
	exports.default = CacheMap;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
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
	exports.default = CacheThread;

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
	Object.defineProperty(exports, "__esModule", { value: true });
	var CacheNode_1 = __webpack_require__(7);
	var cache_1 = __webpack_require__(1);
	var locate_1 = __webpack_require__(8);
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
	function isObject(mixedVar) {
	    if (Object.prototype.toString.call(mixedVar) === '[object Array]') {
	        return false;
	    }
	    return mixedVar !== null && typeof mixedVar === 'object';
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
	Function.prototype.clone = function (target) {
	    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
	    var ARGUMENT_NAMES = /([^\s,]+)/g;
	    function getParamNames(func) {
	        var fnStr = func.toString().replace(STRIP_COMMENTS, '');
	        var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
	        if (result === null) {
	            result = [];
	        }
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
	
	Object.defineProperty(exports, "__esModule", { value: true });
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
	
	Object.defineProperty(exports, "__esModule", { value: true });
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
	    if (typeof nodeId === 'undefined') {
	        var currentNode = getCurrentNode(instance);
	        return currentNode ? currentNode.id : -1;
	    }
	    if (!util_1.isNumber(nodeId)) {
	        throw new TypeError('The node id must be a number.');
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
/* 9 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.defaultConfig = {
	    uidName: 'uid',
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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	var util_1 = __webpack_require__(6);
	var cache_1 = __webpack_require__(1);
	var cacheUtil_1 = __webpack_require__(11);
	var getActualUid = function (uidOrEntity) {
	    if (typeof uidOrEntity === 'string') {
	        return uidOrEntity;
	    } else if (typeof uidOrEntity === 'number') {
	        return String(uidOrEntity);
	    } else if (util_1.isObject(uidOrEntity)) {
	        if (util_1.hasUid(uidOrEntity)) {
	            return uidOrEntity[cache_1.config.uidName];
	        }
	    }
	};
	var getObject = function (uidOrEntity, instance) {
	    var realUid = getActualUid(uidOrEntity);
	    if (!realUid) {
	        return;
	    }
	    var item = cacheUtil_1.getCachedItem(realUid, instance);
	    return item ? item.entity : undefined;
	};
	exports.getItem = function (entity, instance, nodeId) {
	    if (!entity) {
	        throw new TypeError('One get(): requires a uid to retrieve an item from the cache.');
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
	var getEditableObject = function (uidOrEntity, instance) {
	    var realUid = getActualUid(uidOrEntity);
	    var existing = exports.getItem(realUid, instance);
	    return existing ? util_1.deepClone(existing, undefined, false) : undefined;
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

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	var CacheItem_1 = __webpack_require__(12);
	var cache_1 = __webpack_require__(1);
	exports.getCachedItem = function (uid, instance) {
	    var currentNode = getCurrentNode(instance);
	    return currentNode ? currentNode.items.get(String(uid)) : undefined;
	};
	exports.isOnCache = function (entity, instance) {
	    var cachedItem = exports.getCachedItem(entity[cache_1.config.uidName], instance);
	    return cachedItem && cachedItem.entity === entity;
	};
	exports.isOnFlushMap = function (entity, flushMap) {
	    return !!flushMap.get(entity[cache_1.config.uid]);
	};
	exports.getItemFlushOrCached = function (uid, flushArgs) {
	    if (uid) {
	        var uuid = String(uid);
	        var item = flushArgs.flushMap.get(uuid);
	        if (!item) {
	            item = exports.getCachedItem(uuid, flushArgs.instance);
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
	exports.ensureOnFlushMap = function (entity, flushArgs) {
	    var entityUid = String(entity[cache_1.config.uidName]);
	    if (!flushArgs.flushMap.has(entityUid)) {
	        exports.ensureItem(entity, flushArgs);
	    }
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
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
	exports.default = CacheItem;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	var opath = __webpack_require__(14);
	var util_1 = __webpack_require__(6);
	var cacheUtil_1 = __webpack_require__(11);
	var ref_1 = __webpack_require__(15);
	var CacheMap_1 = __webpack_require__(4);
	var cache_1 = __webpack_require__(1);
	var flush_1 = __webpack_require__(16);
	var locate_1 = __webpack_require__(8);
	var get_1 = __webpack_require__(10);
	var parse_1 = __webpack_require__(17);
	var buildEvictUidArray = function (obj) {
	    var uidArray = [];
	    if (util_1.isArray(obj)) {
	        obj.forEach(function (item) {
	            if (util_1.hasUid(item)) {
	                uidArray.push(String(item[cache_1.config.uidName]));
	            } else {
	                if (typeof item === 'string' || typeof item === 'number') {
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
	var clearRefFrom = function (refItem, parentUid) {
	    var refsArray = refItem.mapFrom.get(parentUid);
	    if (!refsArray) {
	        return;
	    }
	    refItem.mapFrom = refItem.mapFrom.clone();
	    refItem.mapFrom.delete(parentUid);
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
	var clearTargetRefFroms = function (entityUid, flushArgs) {
	    var item = cacheUtil_1.getCachedItem(entityUid, flushArgs.instance);
	    if (item) {
	        item.mapTo.forEach(function (toUid, paths) {
	            var refItem = cacheUtil_1.getItemFlushOrCached(toUid, flushArgs);
	            if (refItem) {
	                clearRefFrom(refItem, entityUid);
	                if (refItem.mapFrom.size() === 0) {
	                    clearTargetRefFroms(toUid, flushArgs);
	                    flushArgs.evictMap.set(toUid, refItem);
	                } else {
	                    flushArgs.flushMap.set(toUid, refItem);
	                }
	            }
	        });
	    }
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

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	var opath = __webpack_require__(14);
	var cacheUtil_1 = __webpack_require__(11);
	var cache_1 = __webpack_require__(1);
	var util_1 = __webpack_require__(6);
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
	var assignRefs = function (parentItem, refItem, path) {
	    var parentUid = parentItem.entity[cache_1.config.uidName];
	    var refUid = refItem.entity[cache_1.config.uidName];
	    var refPath = path.join('.');
	    addRefTo(parentItem, refUid, refPath);
	    addRefFrom(refItem, parentUid, refPath);
	};
	exports.assignRefToParent = function (refItem, parentUid, path, flushArgs) {
	    if (parentUid) {
	        var parentItem = cacheUtil_1.getItemFlushOrCached(parentUid, flushArgs);
	        if (parentItem && path.length > 0) {
	            assignRefs(parentItem, refItem, path);
	        }
	    }
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
	                    exports.updateRefFroms(parentItem, flushArgs);
	                }
	            }
	        });
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
	var removeRefFromValue = function (parentUid, refUid, flushArgs, path) {
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
	var updateItemRefTos = function (item, flushArgs) {
	    if (!item || !item.mapTo) {
	        return;
	    }
	    item.mapTo.forEach(function (toUid, paths) {
	        var updatedPaths = paths.filter(function (path) {
	            var reference = opath.get(item.entity, path);
	            var hasRef = reference && String(reference[cache_1.config.uidName]) === String(toUid);
	            if (!hasRef) {
	                removeRefFromValue(item.entity[cache_1.config.uidName], toUid, flushArgs, path);
	            }
	            return hasRef;
	        });
	        if (updatedPaths.length > 0) {
	            item.mapTo.set(toUid, updatedPaths);
	        } else {
	            item.mapTo.delete(toUid);
	        }
	    });
	};
	exports.updatePointers = function (flushArgs) {
	    flushArgs.flushMap.forEach(function (key, item) {
	        updateItemRefTos(item, flushArgs);
	        exports.updateRefFroms(item, flushArgs);
	    });
	};
	exports.updateRefTos = function (entityUid, flushArgs) {
	    var item = cacheUtil_1.getItemFlushOrCached(entityUid, flushArgs);
	    updateItemRefTos(item, flushArgs);
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	var CacheMap_1 = __webpack_require__(4);
	var cache_1 = __webpack_require__(1);
	var cacheUtil_1 = __webpack_require__(11);
	var util_1 = __webpack_require__(6);
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
	        freezeItem(item);
	        temp.set(String(itemUid), item);
	    });
	    if (flushArgs.evictMap.size() > 0) {
	        flushArgs.evictMap.forEach(function (key, value) {
	            temp.delete(String(key));
	        });
	    }
	    exports.flush(temp, instance);
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	var ref_1 = __webpack_require__(15);
	var cacheUtil_1 = __webpack_require__(11);
	var util_1 = __webpack_require__(6);
	var cache_1 = __webpack_require__(1);
	exports.parse = function (entity, flushArgs) {
	    if (util_1.hasUid(entity)) {
	        if (cacheUtil_1.isOnCache(entity, flushArgs.instance)) return;
	        _addToFlushMap(entity, flushArgs);
	    } else {
	        if (util_1.isArray(entity)) {
	            parseArray(entity, null, [], flushArgs);
	        } else if (util_1.isObject(entity)) {
	            parseObject(entity, null, [], flushArgs);
	        }
	    }
	};
	var _addToFlushMap = function (entity, flushArgs) {
	    cacheUtil_1.ensureOnFlushMap(entity, flushArgs);
	    parseEntity(entity, entity[cache_1.config.uidName], [], flushArgs);
	    ref_1.updateRefTos(String(entity[cache_1.config.uidName]), flushArgs);
	};
	var cacheUidObj = function (entity, parentUid, path, flushArgs) {
	    var item = cacheUtil_1.ensureItem(entity, flushArgs);
	    if (parentUid) {
	        ref_1.assignRefToParent(item, parentUid, path, flushArgs);
	    }
	    if (cacheUtil_1.isOnCache(entity, flushArgs.instance) || cacheUtil_1.isOnFlushMap(entity, flushArgs.flushMap)) return;
	    exports.parse(entity, flushArgs);
	};
	var parseObject = function (obj, parentUid, path, flushArgs) {
	    if (util_1.hasUid(obj)) {
	        cacheUidObj(obj, parentUid, path, flushArgs);
	    } else {
	        parseEntity(obj, parentUid, path, flushArgs);
	    }
	};
	var parseArray = function (arr, parentUid, path, flushArgs) {
	    if (path === void 0) {
	        path = [];
	    }
	    arr.forEach(function (item, index) {
	        if (util_1.isArray(item)) {
	            parseArray(item, parentUid, path.concat([index]), flushArgs);
	        } else if (util_1.isObject(item)) {
	            parseObject(item, parentUid, path.concat([index]), flushArgs);
	        }
	    });
	};
	var parseEntity = function (entity, parentUid, path, flushArgs) {
	    if (path === void 0) {
	        path = [];
	    }
	    for (var key in entity) {
	        if (entity.hasOwnProperty(key)) {
	            var ref = entity[key];
	            if (util_1.isArray(ref)) {
	                parseArray(ref, parentUid, path.concat([key]), flushArgs);
	            } else if (util_1.isObject(ref)) {
	                parseObject(ref, parentUid, path.concat([key]), flushArgs);
	            }
	            Object.freeze(ref);
	        }
	    }
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	var cache_1 = __webpack_require__(1);
	var stringifyMap = function (map) {
	    var result = '';
	    map.forEach(function (key, item) {
	        var itemResult = JSON.stringify(item, null, 2);
	        result += itemResult + ',\n';
	    });
	    return result;
	};
	exports.printCache = function (instance) {
	    var result = '';
	    var index = 0;
	    var current = instance.thread.current;
	    var nodeIndices = instance.thread.nodes;
	    nodeIndices.map(function (cacheNodeId) {
	        var cacheNode = instance.repo.get(cacheNodeId);
	        var streamData = '';
	        var state = index + ":" + streamData + "[" + stringifyMap(cacheNode.items) + "]\n\n";
	        if (index === current) {
	            state = '-> ' + state;
	        }
	        result += state;
	        index++;
	    });
	    result = result.substring(0, result.length - 2);
	    index = 0;
	    return '\n------ One -------' + '\nSTACK:\n' + result + '\n\nCONFIG:' + JSON.stringify(cache_1.config, null, 2) + '\n\nREPO SIZE:' + instance.repo.length + '\n===================\n';
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	var util_1 = __webpack_require__(6);
	var CacheMap_1 = __webpack_require__(4);
	var locate_1 = __webpack_require__(8);
	var parse_1 = __webpack_require__(17);
	var flush_1 = __webpack_require__(16);
	var ref_1 = __webpack_require__(15);
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

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMjE1NDc3NGJiYWYwMmUyOWVhYzEiLCJ3ZWJwYWNrOi8vLy4vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vY2FjaGUudHMiLCJ3ZWJwYWNrOi8vLy4vQ2FjaGVJbnN0YW5jZS50cyIsIndlYnBhY2s6Ly8vLi9DYWNoZVJlcG8udHMiLCJ3ZWJwYWNrOi8vLy4vQ2FjaGVNYXAudHMiLCJ3ZWJwYWNrOi8vLy4vQ2FjaGVUaHJlYWQudHMiLCJ3ZWJwYWNrOi8vLy4vdXRpbC50cyIsIndlYnBhY2s6Ly8vLi9DYWNoZU5vZGUudHMiLCJ3ZWJwYWNrOi8vLy4vbG9jYXRlLnRzIiwid2VicGFjazovLy8uL2NvbmZpZy50cyIsIndlYnBhY2s6Ly8vLi9nZXQudHMiLCJ3ZWJwYWNrOi8vLy4vY2FjaGVVdGlsLnRzIiwid2VicGFjazovLy8uL0NhY2hlSXRlbS50cyIsIndlYnBhY2s6Ly8vLi9ldmljdC50cyIsIndlYnBhY2s6Ly8vLi9wYXRoLnRzIiwid2VicGFjazovLy8uL3JlZi50cyIsIndlYnBhY2s6Ly8vLi9mbHVzaC50cyIsIndlYnBhY2s6Ly8vLi9wYXJzZS50cyIsIndlYnBhY2s6Ly8vLi9wcmludC50cyIsIndlYnBhY2s6Ly8vLi9wdXQudHMiXSwibmFtZXMiOlsiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJleHBvcnRzIiwidmFsdWUiLCJjYWNoZV8xIiwicmVxdWlyZSIsImV2aWN0IiwiZ2V0IiwiZ2V0Q2FjaGUiLCJnZXRFZGl0IiwicHJpbnQiLCJwdXQiLCJyZXNldCIsInV1aWQiLCJ3aW5kb3ciLCJPbmUiLCJDYWNoZUluc3RhbmNlXzEiLCJ1dGlsXzEiLCJjb25maWdfMSIsImdldF8xIiwiZXZpY3RfMSIsImNhY2hlVXRpbF8xIiwicHJpbnRfMSIsInB1dF8xIiwiaW5zdGFuY2VzIiwiY2FjaGVUZXN0Iiwic2V0VGVzdGluZyIsInRlc3RpbmciLCJpbnN0YW5jZU5hbWUiLCJjb25maWd1cmF0aW9uIiwiZGVmYXVsdENvbmZpZyIsImNvbmZpZyIsImNvbmZpZ3VyZSIsImNyZWF0ZUNhY2hlIiwidW5kZWZpbmVkIiwiaXRlbSIsImVudGl0eSIsIm5vZGVJZCIsInVpZE9yRW50aXR5T3JBcnJheSIsImx1dCIsImkiLCJ0b1N0cmluZyIsImQwIiwiTWF0aCIsInJhbmRvbSIsImQxIiwiZDIiLCJkMyIsIm5hbWUiLCJpbnN0YW5jZSIsImRlZmF1bHQiLCJwdXRJdGVtIiwiZ2V0SXRlbSIsImdldEVkaXRJdGVtIiwiZXZpY3RJdGVtIiwic2l6ZSIsImNhY2hlU2l6ZSIsImxlbmd0aCIsImNhY2hlTGVuZ3RoIiwicHJpbnRDYWNoZSIsInJlc3VsdCIsInJlZlRvIiwidWlkIiwiZ2V0Q2FjaGVkSXRlbSIsIm1hcFRvIiwicmVmRnJvbSIsIm1hcEZyb20iLCJDYWNoZVJlcG9fMSIsIkNhY2hlVGhyZWFkXzEiLCJDYWNoZUluc3RhbmNlIiwiX3RoaXMiLCJyZXBvIiwidGhyZWFkIiwibmV4dE5vZGVLZXkiLCJhZGROb2RlIiwibm9kZSIsImFkZCIsImlkIiwibm9kZXMiLCJDYWNoZU1hcF8xIiwiQ2FjaGVSZXBvIiwiaXRlbXMiLCJoYXMiLCJzZXQiLCJkZWxldGUiLCJfX2Fzc2lnbiIsImFzc2lnbiIsInQiLCJzIiwibiIsImFyZ3VtZW50cyIsInAiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJDYWNoZU1hcCIsInBhdGhzIiwia2V5IiwidmFsIiwiZm9yRWFjaCIsImNhbGxiYWNrIiwiY2xvbmUiLCJDYWNoZVRocmVhZCIsImN1cnJlbnQiLCJwdXNoIiwiQ2FjaGVOb2RlXzEiLCJsb2NhdGVfMSIsIl9oYXNPd25Qcm9wZXJ0eSIsImlzTnVtYmVyIiwiaXNTdHJpbmciLCJvYmoiLCJpc09iamVjdCIsIm1peGVkVmFyIiwiaXNGdW5jdGlvbiIsImlzQXJyYXkiLCJBcnJheSIsInNwbGljZSIsInByb3BlcnR5SXNFbnVtZXJhYmxlIiwib2JqVG9TdHIiLCJvIiwiaXNEYXRlIiwiaXNFbXB0eSIsImdldE5ld0NhY2hlTm9kZSIsIkNhY2hlTm9kZSIsImhhc1VpZCIsInVpZE5hbWUiLCJGdW5jdGlvbiIsInRhcmdldCIsIlNUUklQX0NPTU1FTlRTIiwiQVJHVU1FTlRfTkFNRVMiLCJnZXRQYXJhbU5hbWVzIiwiZnVuYyIsImZuU3RyIiwicmVwbGFjZSIsInNsaWNlIiwiaW5kZXhPZiIsIm1hdGNoIiwic3RyaW5naWZ5IiwiUmVnRXhwIiwiYm9keSIsInRyaW0iLCJwYXJhbU5hbWVzIiwiYmluZCIsImRlZXBDbG9uZSIsInVpZFJlZmVyZW5jZSIsImZyZWV6ZSIsImlzRnJvemVuIiwicHJvcE5hbWUiLCJkZWVwQ2xvbmVBcnJheSIsImRhdGUiLCJEYXRlIiwiZ2V0VGltZSIsImFyciIsIm1hcCIsImNhY2hlTm9kZSIsImdldEN1cnJlbnROb2RlIiwiZ2V0Q2FsbFN0YXRzIiwic3VjY2VzcyIsImN1cnJlbnROb2RlIiwiVHlwZUVycm9yIiwiZ2V0UmVwb05vZGUiLCJiaW5hcnlJbmRleE9mIiwiY3VycmVudE5vZGVJZCIsImNhY2hlTm9kZUlkIiwiYXJyYXkiLCJzZWFyY2hFbGVtZW50IiwibWluSW5kZXgiLCJtYXhJbmRleCIsImN1cnJlbnRJbmRleCIsImN1cnJlbnRFbGVtZW50IiwibWF4SGlzdG9yeVN0YXRlcyIsImNvbmYiLCJnZXRBY3R1YWxVaWQiLCJ1aWRPckVudGl0eSIsIlN0cmluZyIsImdldE9iamVjdCIsInJlYWxVaWQiLCJmaWx0ZXIiLCJnZXRFZGl0YWJsZU9iamVjdCIsImV4aXN0aW5nIiwiQ2FjaGVJdGVtXzEiLCJpc09uQ2FjaGUiLCJjYWNoZWRJdGVtIiwiaXNPbkZsdXNoTWFwIiwiZmx1c2hNYXAiLCJnZXRJdGVtRmx1c2hPckNhY2hlZCIsImZsdXNoQXJncyIsImdldENhY2hlQ3VycmVudFN0YWNrIiwiZW5zdXJlSXRlbSIsIml0ZW1VaWQiLCJsaXZlIiwiZW5zdXJlT25GbHVzaE1hcCIsImVudGl0eVVpZCIsIkNhY2hlSXRlbSIsImxpdmVJdGVtIiwib3BhdGgiLCJyZWZfMSIsImZsdXNoXzEiLCJwYXJzZV8xIiwiYnVpbGRFdmljdFVpZEFycmF5IiwidWlkQXJyYXkiLCJjdXJyZW50U3RhdGUiLCJmb3VuZCIsInNvbWUiLCJ0ZW1wU3RhdGUiLCJldmljdE1hcCIsInBhcmVudHNDaGFuZ2VkIiwiY2xlYXJUYXJnZXRSZWZGcm9tcyIsImNsZWFyUGFyZW50UmVmVG9zIiwicHV0UGFyZW50c0NoYW5nZWQiLCJmbHVzaCIsImZsdXNoQXJnc18xIiwicGFyc2UiLCJ1cGRhdGVSZWZGcm9tcyIsImNsZWFyUmVmRnJvbSIsInJlZkl0ZW0iLCJwYXJlbnRVaWQiLCJyZWZzQXJyYXkiLCJjbGVhclJlZlRvIiwicGFyZW50SXRlbSIsInJlZlVpZCIsInBhcmVudCIsInJlZlBhdGhzIiwicGF0aCIsImRlbCIsInRvVWlkIiwiZ2V0S2V5IiwiaW50S2V5IiwicGFyc2VJbnQiLCJzcGxpdCIsImN1cnJlbnRQYXRoIiwib2xkVmFsIiwiZGVmYXVsdFZhbHVlIiwiYWRkUmVmVG8iLCJyZWZBcnJheSIsImFkZFJlZkZyb20iLCJmcm9tQXJyYXkiLCJhc3NpZ25SZWZzIiwicmVmUGF0aCIsImpvaW4iLCJhc3NpZ25SZWZUb1BhcmVudCIsImZpcnN0UGF0aCIsInRhcmdldFJlZiIsImFyZ3MiLCJyZW1vdmVSZWZGcm9tIiwiaW5kZXgiLCJyZW1vdmVSZWZGcm9tVmFsdWUiLCJ1cGRhdGVJdGVtUmVmVG9zIiwidXBkYXRlZFBhdGhzIiwicmVmZXJlbmNlIiwiaGFzUmVmIiwidXBkYXRlUG9pbnRlcnMiLCJ1cGRhdGVSZWZUb3MiLCJmcmVlemVJdGVtIiwidGVtcCIsInByZUZsdXNoIiwiY3VycmVudFN0YWNrIiwiX2FkZFRvRmx1c2hNYXAiLCJwYXJzZUFycmF5IiwicGFyc2VPYmplY3QiLCJwYXJzZUVudGl0eSIsImNhY2hlVWlkT2JqIiwiY29uY2F0IiwicmVmIiwic3RyaW5naWZ5TWFwIiwiaXRlbVJlc3VsdCIsIkpTT04iLCJub2RlSW5kaWNlcyIsInN0cmVhbURhdGEiLCJzdGF0ZSIs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LENBQVEsQ0FBUixDQUFqQjtBQUNBLEtBQUlxRyxXQUFXLG1CQUFBckcsQ0FBUSxDQUFSLENBQWY7QUFDQSxLQUFJaU0sVUFBVSxtQkFBQWpNLENBQVEsRUFBUixDQUFkO0FBQ0EsS0FBSWdNLFVBQVUsbUJBQUFoTSxDQUFRLEVBQVIsQ0FBZDtBQUNBLEtBQUkrTCxRQUFRLG1CQUFBL0wsQ0FBUSxFQUFSLENBQVo7QUFDQUgsU0FBUWlELE9BQVIsR0FBa0IsVUFBVWYsTUFBVixFQUFrQmEsUUFBbEIsRUFBNEI7QUFDMUMsU0FBS2hDLE9BQU9pRyxPQUFQLENBQWU5RSxNQUFmLEtBQTBCbkIsT0FBTzhGLFFBQVAsQ0FBZ0IzRSxNQUFoQixDQUEvQixFQUF5RDtBQUNyRCxhQUFJeUssV0FBVyxJQUFJOUgsV0FBVzdCLE9BQWYsRUFBZjtBQUNBLGFBQUlzSSxXQUFXLElBQUl6RyxXQUFXN0IsT0FBZixFQUFmO0FBQ0FzSSxrQkFBUyxhQUFULElBQTBCLEtBQTFCO0FBQ0EsYUFBSUUsWUFBWTtBQUNaRix1QkFBVUEsUUFERTtBQUVacUIsdUJBQVVBLFFBRkU7QUFHWjVKLHVCQUFVQTtBQUhFLFVBQWhCO0FBS0FxSixpQkFBUWMsS0FBUixDQUFjaEwsTUFBZCxFQUFzQnNKLFNBQXRCO0FBQ0FVLGVBQU11RCxjQUFOLENBQXFCakUsU0FBckI7QUFDQSxhQUFJQSxVQUFVRixRQUFWLENBQW1CakksSUFBbkIsS0FBNEIsQ0FBaEMsRUFBbUM7QUFDL0I4SSxxQkFBUTBELFFBQVIsQ0FBaUJyRSxTQUFqQixFQUE0QnpJLFFBQTVCO0FBQ0Esb0JBQU95RCxTQUFTa0QsWUFBVCxDQUFzQixJQUF0QixFQUE0QjNHLFFBQTVCLENBQVA7QUFDSDtBQUNKO0FBQ0QsWUFBT3lELFNBQVNrRCxZQUFULENBQXNCLEtBQXRCLEVBQTZCM0csUUFBN0IsQ0FBUDtBQUNILEVBbEJELEMiLCJmaWxlIjoib25lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMjE1NDc3NGJiYWYwMmUyOWVhYzEiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBjYWNoZV8xID0gcmVxdWlyZShcIi4vY2FjaGVcIik7XG5leHBvcnRzLmV2aWN0ID0gY2FjaGVfMS5ldmljdDtcbmV4cG9ydHMuZ2V0ID0gY2FjaGVfMS5nZXQ7XG5leHBvcnRzLmdldENhY2hlID0gY2FjaGVfMS5nZXRDYWNoZTtcbmV4cG9ydHMuZ2V0RWRpdCA9IGNhY2hlXzEuZ2V0RWRpdDtcbmV4cG9ydHMucHJpbnQgPSBjYWNoZV8xLnByaW50O1xuZXhwb3J0cy5wdXQgPSBjYWNoZV8xLnB1dDtcbmV4cG9ydHMucmVzZXQgPSBjYWNoZV8xLnJlc2V0O1xuZXhwb3J0cy51dWlkID0gY2FjaGVfMS51dWlkO1xuKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93ICE9PSBudWxsKSB7XG4gICAgICAgIHdpbmRvdy5PbmUgPSB7XG4gICAgICAgICAgICBnZXRDYWNoZTogY2FjaGVfMS5nZXRDYWNoZSxcbiAgICAgICAgICAgIHB1dDogY2FjaGVfMS5wdXQsXG4gICAgICAgICAgICBnZXQ6IGNhY2hlXzEuZ2V0LFxuICAgICAgICAgICAgZ2V0RWRpdDogY2FjaGVfMS5nZXRFZGl0LFxuICAgICAgICAgICAgZXZpY3Q6IGNhY2hlXzEuZXZpY3QsXG4gICAgICAgICAgICByZXNldDogY2FjaGVfMS5yZXNldCxcbiAgICAgICAgICAgIHV1aWQ6IGNhY2hlXzEudXVpZCxcbiAgICAgICAgICAgIHByaW50OiBjYWNoZV8xLnByaW50LFxuICAgICAgICB9O1xuICAgIH1cbn0pKCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9pbmRleC50cyIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIENhY2hlSW5zdGFuY2VfMSA9IHJlcXVpcmUoXCIuL0NhY2hlSW5zdGFuY2VcIik7XG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbnZhciBjb25maWdfMSA9IHJlcXVpcmUoXCIuL2NvbmZpZ1wiKTtcbnZhciBnZXRfMSA9IHJlcXVpcmUoXCIuL2dldFwiKTtcbnZhciBldmljdF8xID0gcmVxdWlyZShcIi4vZXZpY3RcIik7XG52YXIgY2FjaGVVdGlsXzEgPSByZXF1aXJlKFwiLi9jYWNoZVV0aWxcIik7XG52YXIgcHJpbnRfMSA9IHJlcXVpcmUoXCIuL3ByaW50XCIpO1xudmFyIHB1dF8xID0gcmVxdWlyZShcIi4vcHV0XCIpO1xuZXhwb3J0cy5pbnN0YW5jZXMgPSB7fTtcbnZhciBjYWNoZVRlc3QgPSBmYWxzZTtcbmZ1bmN0aW9uIHNldFRlc3RpbmcodGVzdGluZykge1xuICAgIGNhY2hlVGVzdCA9IHRlc3Rpbmc7XG59XG5leHBvcnRzLnNldFRlc3RpbmcgPSBzZXRUZXN0aW5nO1xuZnVuY3Rpb24gZ2V0Q2FjaGUoaW5zdGFuY2VOYW1lLCBjb25maWd1cmF0aW9uKSB7XG4gICAgaWYgKGluc3RhbmNlTmFtZSA9PT0gdm9pZCAwKSB7IGluc3RhbmNlTmFtZSA9ICdvbmUnOyB9XG4gICAgaWYgKGNvbmZpZ3VyYXRpb24gPT09IHZvaWQgMCkgeyBjb25maWd1cmF0aW9uID0gY29uZmlnXzEuZGVmYXVsdENvbmZpZzsgfVxuICAgIGlmICghZXhwb3J0cy5jb25maWcpIHtcbiAgICAgICAgZXhwb3J0cy5jb25maWcgPSBjb25maWdfMS5jb25maWd1cmUoY29uZmlndXJhdGlvbik7XG4gICAgfVxuICAgIGlmICghZXhwb3J0cy5pbnN0YW5jZXNbaW5zdGFuY2VOYW1lXSkge1xuICAgICAgICBleHBvcnRzLmluc3RhbmNlc1tpbnN0YW5jZU5hbWVdID0gY3JlYXRlQ2FjaGUoaW5zdGFuY2VOYW1lKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgICAgICYmIHdpbmRvdyAhPT0gbnVsbFxuICAgICAgICAmJiB3aW5kb3dbaW5zdGFuY2VOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHdpbmRvd1tpbnN0YW5jZU5hbWVdID0gZXhwb3J0cy5pbnN0YW5jZXNbaW5zdGFuY2VOYW1lXTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cG9ydHMuaW5zdGFuY2VzW2luc3RhbmNlTmFtZV07XG59XG5leHBvcnRzLmdldENhY2hlID0gZ2V0Q2FjaGU7XG5leHBvcnRzLnB1dCA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgZ2V0Q2FjaGUoKS5wdXQoaXRlbSk7XG59O1xuZXhwb3J0cy5nZXQgPSBmdW5jdGlvbiAoZW50aXR5LCBub2RlSWQpIHsgcmV0dXJuIChnZXRDYWNoZSgpLmdldChlbnRpdHksIG5vZGVJZCkpOyB9O1xuZXhwb3J0cy5nZXRFZGl0ID0gZnVuY3Rpb24gKHVpZE9yRW50aXR5T3JBcnJheSwgbm9kZUlkKSB7IHJldHVybiAoZ2V0Q2FjaGUoKS5nZXRFZGl0KHVpZE9yRW50aXR5T3JBcnJheSwgbm9kZUlkKSk7IH07XG5leHBvcnRzLmV2aWN0ID0gZnVuY3Rpb24gKHVpZE9yRW50aXR5T3JBcnJheSkgeyByZXR1cm4gKGdldENhY2hlKCkuZXZpY3QodWlkT3JFbnRpdHlPckFycmF5KSk7IH07XG5leHBvcnRzLnByaW50ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gZ2V0Q2FjaGUoKS5wcmludCgpOyB9O1xuZXhwb3J0cy5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICBnZXRDYWNoZSgpLnJlc2V0KCk7XG59O1xuZXhwb3J0cy51dWlkID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBsdXQgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDI1NjsgaSsrKSB7XG4gICAgICAgIGx1dFtpXSA9IChpIDwgMTYgPyAnMCcgOiAnJykgKyAoaSkudG9TdHJpbmcoMTYpO1xuICAgIH1cbiAgICB2YXIgZDAgPSBNYXRoLnJhbmRvbSgpICogMHgxMDAwMDAwMDAgfCAwO1xuICAgIHZhciBkMSA9IE1hdGgucmFuZG9tKCkgKiAweDEwMDAwMDAwMCB8IDA7XG4gICAgdmFyIGQyID0gTWF0aC5yYW5kb20oKSAqIDB4MTAwMDAwMDAwIHwgMDtcbiAgICB2YXIgZDMgPSBNYXRoLnJhbmRvbSgpICogMHgxMDAwMDAwMDAgfCAwO1xuICAgIHJldHVybiBsdXRbZDAgJiAweEZGXSArIGx1dFtkMCA+PiA4ICYgMHhGRl0gKyBsdXRbZDAgPj4gMTYgJiAweEZGXVxuICAgICAgICArIGx1dFtkMCA+PiAyNCAmIDB4RkZdICsgJy0nICsgbHV0W2QxICYgMHhGRl1cbiAgICAgICAgKyBsdXRbZDEgPj4gOCAmIDB4RkZdICsgJy0nICsgbHV0W2QxID4+IDE2ICYgMHgwZiB8IDB4NDBdXG4gICAgICAgICsgbHV0W2QxID4+IDI0ICYgMHhGRl0gKyAnLScgKyBsdXRbZDIgJiAweDNmIHwgMHg4MF1cbiAgICAgICAgKyBsdXRbZDIgPj4gOCAmIDB4RkZdICsgJy0nICsgbHV0W2QyID4+IDE2ICYgMHhGRl1cbiAgICAgICAgKyBsdXRbZDIgPj4gMjQgJiAweEZGXSArIGx1dFtkMyAmIDB4RkZdICsgbHV0W2QzID4+IDggJiAweEZGXVxuICAgICAgICArIGx1dFtkMyA+PiAxNiAmIDB4RkZdICsgbHV0W2QzID4+IDI0ICYgMHhGRl07XG59O1xuZnVuY3Rpb24gY3JlYXRlQ2FjaGUobmFtZSkge1xuICAgIHZhciBpbnN0YW5jZSA9IG5ldyBDYWNoZUluc3RhbmNlXzEuZGVmYXVsdChuYW1lKTtcbiAgICB2YXIgcmVzZXQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBpbnN0YW5jZS5yZXNldCgpOyB9O1xuICAgIHZhciBwdXQgPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICByZXR1cm4gcHV0XzEucHV0SXRlbShpdGVtLCBpbnN0YW5jZSk7XG4gICAgfTtcbiAgICB2YXIgZ2V0ID0gZnVuY3Rpb24gKGVudGl0eSwgbm9kZUlkKSB7IHJldHVybiAoZ2V0XzEuZ2V0SXRlbShlbnRpdHksIGluc3RhbmNlLCBub2RlSWQpKTsgfTtcbiAgICB2YXIgZ2V0RWRpdCA9IGZ1bmN0aW9uICh1aWRPckVudGl0eU9yQXJyYXksIG5vZGVJZCkgeyByZXR1cm4gKGdldF8xLmdldEVkaXRJdGVtKHVpZE9yRW50aXR5T3JBcnJheSwgaW5zdGFuY2UsIG5vZGVJZCkpOyB9O1xuICAgIHZhciBldmljdCA9IGZ1bmN0aW9uICh1aWRPckVudGl0eU9yQXJyYXkpIHsgcmV0dXJuIChldmljdF8xLmV2aWN0SXRlbSh1aWRPckVudGl0eU9yQXJyYXksIGluc3RhbmNlKSk7IH07XG4gICAgdmFyIHNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB1dGlsXzEuY2FjaGVTaXplKGluc3RhbmNlKTtcbiAgICB9O1xuICAgIHZhciBsZW5ndGggPSBmdW5jdGlvbiAoKSB7IHJldHVybiB1dGlsXzEuY2FjaGVMZW5ndGgoaW5zdGFuY2UpOyB9O1xuICAgIHZhciBwcmludCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHByaW50XzEucHJpbnRDYWNoZShpbnN0YW5jZSk7IH07XG4gICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgcHV0OiBwdXQsXG4gICAgICAgIGdldDogZ2V0LFxuICAgICAgICBnZXRFZGl0OiBnZXRFZGl0LFxuICAgICAgICBldmljdDogZXZpY3QsXG4gICAgICAgIHJlc2V0OiByZXNldCxcbiAgICAgICAgc2l6ZTogc2l6ZSxcbiAgICAgICAgbGVuZ3RoOiBsZW5ndGgsXG4gICAgICAgIHByaW50OiBwcmludCxcbiAgICB9O1xuICAgIGlmIChjYWNoZVRlc3QgPT09IHRydWUpIHtcbiAgICAgICAgcmVzdWx0LnJlZlRvID0gZnVuY3Rpb24gKHVpZCkge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBjYWNoZVV0aWxfMS5nZXRDYWNoZWRJdGVtKHVpZCwgaW5zdGFuY2UpO1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW0ubWFwVG87XG4gICAgICAgIH07XG4gICAgICAgIHJlc3VsdC5yZWZGcm9tID0gZnVuY3Rpb24gKHVpZCkge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBjYWNoZVV0aWxfMS5nZXRDYWNoZWRJdGVtKHVpZCwgaW5zdGFuY2UpO1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW0ubWFwRnJvbTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2NhY2hlLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgQ2FjaGVSZXBvXzEgPSByZXF1aXJlKFwiLi9DYWNoZVJlcG9cIik7XG52YXIgQ2FjaGVUaHJlYWRfMSA9IHJlcXVpcmUoXCIuL0NhY2hlVGhyZWFkXCIpO1xudmFyIENhY2hlSW5zdGFuY2UgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENhY2hlSW5zdGFuY2UobmFtZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLnJlcG8gPSBuZXcgQ2FjaGVSZXBvXzEuZGVmYXVsdCgpO1xuICAgICAgICB0aGlzLnRocmVhZCA9IG5ldyBDYWNoZVRocmVhZF8xLmRlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5uZXh0Tm9kZUtleSA9IDA7XG4gICAgICAgIHRoaXMucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5yZXBvID0gbmV3IENhY2hlUmVwb18xLmRlZmF1bHQoKTtcbiAgICAgICAgICAgIF90aGlzLnRocmVhZCA9IG5ldyBDYWNoZVRocmVhZF8xLmRlZmF1bHQoKTtcbiAgICAgICAgICAgIF90aGlzLm5leHROb2RlS2V5ID0gMDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5hZGROb2RlID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5yZXBvLmFkZChub2RlKSkge1xuICAgICAgICAgICAgICAgIF90aGlzLnRocmVhZC5hZGROb2RlKG5vZGUuaWQpO1xuICAgICAgICAgICAgICAgIF90aGlzLm5leHROb2RlS2V5Kys7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubGVuZ3RoID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXMudGhyZWFkLm5vZGVzLmxlbmd0aDsgfTtcbiAgICAgICAgdGhpcy5zaXplID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXMucmVwby5sZW5ndGg7IH07XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgfVxuICAgIHJldHVybiBDYWNoZUluc3RhbmNlO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IENhY2hlSW5zdGFuY2U7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DYWNoZUluc3RhbmNlLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgQ2FjaGVNYXBfMSA9IHJlcXVpcmUoXCIuL0NhY2hlTWFwXCIpO1xudmFyIENhY2hlUmVwbyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2FjaGVSZXBvKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLml0ZW1zID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmxlbmd0aCA9IDA7XG4gICAgICAgIHRoaXMuZ2V0ID0gZnVuY3Rpb24gKG5vZGVJZCkgeyByZXR1cm4gKF90aGlzLml0ZW1zLmdldChub2RlSWQpKTsgfTtcbiAgICAgICAgdGhpcy5hZGQgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgaWYgKCFfdGhpcy5pdGVtcy5oYXMobm9kZS5pZCkpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5pdGVtcy5zZXQobm9kZS5pZCwgbm9kZSk7XG4gICAgICAgICAgICAgICAgX3RoaXMubGVuZ3RoKys7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZGVsZXRlID0gZnVuY3Rpb24gKG5vZGVJZCkge1xuICAgICAgICAgICAgaWYgKF90aGlzLml0ZW1zLmhhcyhub2RlSWQpKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuaXRlbXMuZGVsZXRlKG5vZGVJZCk7XG4gICAgICAgICAgICAgICAgX3RoaXMubGVuZ3RoLS07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBDYWNoZVJlcG87XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ2FjaGVSZXBvO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2FjaGVSZXBvLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgfVxuICAgIHJldHVybiB0O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBDYWNoZU1hcCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2FjaGVNYXAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMucGF0aHMgPSB7fTtcbiAgICAgICAgdGhpcy5sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5wYXRoc1trZXldO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmRlbGV0ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgX3RoaXMucGF0aHNba2V5XSAhPT0gJ3VuZGVmaW5lZCcgJiYgX3RoaXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciB2YWwgPSBfdGhpcy5wYXRoc1trZXldO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBfdGhpcy5wYXRoc1trZXldO1xuICAgICAgICAgICAgICAgIF90aGlzLmxlbmd0aC0tO1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaGFzID0gZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gdHlwZW9mIF90aGlzLnBhdGhzW2tleV0gIT09ICd1bmRlZmluZWQnOyB9O1xuICAgICAgICB0aGlzLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBfdGhpcy5wYXRocykge1xuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5wYXRocy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGtleSwgX3RoaXMucGF0aHNba2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNsb25lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNsb25lID0gbmV3IENhY2hlTWFwKCk7XG4gICAgICAgICAgICBjbG9uZS5wYXRocyA9IF9fYXNzaWduKHt9LCBfdGhpcy5wYXRocyk7XG4gICAgICAgICAgICBjbG9uZS5sZW5ndGggPSBfdGhpcy5sZW5ndGg7XG4gICAgICAgICAgICByZXR1cm4gY2xvbmU7XG4gICAgICAgIH07XG4gICAgfVxuICAgIENhY2hlTWFwLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMucGF0aHNba2V5XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy5sZW5ndGgrKztcbiAgICAgICAgICAgIHRoaXMucGF0aHNba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYXRoc1trZXldID0gdmFsdWU7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIENhY2hlTWFwLnByb3RvdHlwZS5zaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sZW5ndGg7XG4gICAgfTtcbiAgICByZXR1cm4gQ2FjaGVNYXA7XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ2FjaGVNYXA7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DYWNoZU1hcC50cyIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIENhY2hlVGhyZWFkID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDYWNoZVRocmVhZCgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gLTE7XG4gICAgICAgIHRoaXMubm9kZXMgPSBbXTtcbiAgICAgICAgdGhpcy5hZGROb2RlID0gZnVuY3Rpb24gKG5vZGVJZCkge1xuICAgICAgICAgICAgX3RoaXMubm9kZXMucHVzaChub2RlSWQpO1xuICAgICAgICAgICAgX3RoaXMuY3VycmVudCsrO1xuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gQ2FjaGVUaHJlYWQ7XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ2FjaGVUaHJlYWQ7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DYWNoZVRocmVhZC50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XG4gICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgIH1cbiAgICByZXR1cm4gdDtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgQ2FjaGVOb2RlXzEgPSByZXF1aXJlKFwiLi9DYWNoZU5vZGVcIik7XG52YXIgY2FjaGVfMSA9IHJlcXVpcmUoXCIuL2NhY2hlXCIpO1xudmFyIGxvY2F0ZV8xID0gcmVxdWlyZShcIi4vbG9jYXRlXCIpO1xudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciBfaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuZnVuY3Rpb24gaXNOdW1iZXIodmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyB8fCB0b1N0cmluZyh2YWx1ZSkgPT09IFwiW29iamVjdCBOdW1iZXJdXCI7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5mdW5jdGlvbiBpc1N0cmluZyhvYmopIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ3N0cmluZycgfHwgdG9TdHJpbmcob2JqKSA9PT0gXCJbb2JqZWN0IFN0cmluZ11cIjtcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcbmZ1bmN0aW9uIGlzT2JqZWN0KG1peGVkVmFyKSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChtaXhlZFZhcikgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gbWl4ZWRWYXIgIT09IG51bGwgJiYgdHlwZW9mIG1peGVkVmFyID09PSAnb2JqZWN0Jztcbn1cbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcbmZ1bmN0aW9uIGlzRnVuY3Rpb24oaXRlbSkge1xuICAgIHJldHVybiB0eXBlb2YgaXRlbSA9PT0gJ2Z1bmN0aW9uJztcbn1cbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5mdW5jdGlvbiBpc0FycmF5KHZhbHVlKSB7XG4gICAgaWYgKCF2YWx1ZSB8fCB2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKSB8fCAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0J1xuICAgICAgICAmJiB0eXBlb2YgdmFsdWUubGVuZ3RoID09PSAnbnVtYmVyJ1xuICAgICAgICAmJiB0eXBlb2YgdmFsdWUuc3BsaWNlID09PSAnZnVuY3Rpb24nXG4gICAgICAgICYmICEodmFsdWUucHJvcGVydHlJc0VudW1lcmFibGUoJ2xlbmd0aCcpKSk7XG59XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuZnVuY3Rpb24gb2JqVG9TdHIobykge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59XG5mdW5jdGlvbiBpc0RhdGUodmFsdWUpIHtcbiAgICByZXR1cm4gaXNPYmplY3QodmFsdWUpICYmIG9ialRvU3RyKHZhbHVlKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG5mdW5jdGlvbiBpc0VtcHR5KHZhbHVlKSB7XG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSBpZiAoIWlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICBmb3IgKHZhciBpIGluIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoX2hhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5leHBvcnRzLmlzRW1wdHkgPSBpc0VtcHR5O1xuZnVuY3Rpb24gZ2V0TmV3Q2FjaGVOb2RlKGluc3RhbmNlKSB7XG4gICAgdmFyIG5vZGUgPSBuZXcgQ2FjaGVOb2RlXzEuQ2FjaGVOb2RlKGluc3RhbmNlLm5leHROb2RlS2V5KTtcbiAgICBub2RlLmlkID0gaW5zdGFuY2UubmV4dE5vZGVLZXk7XG4gICAgaW5zdGFuY2UubmV4dE5vZGVLZXkgKz0gMTtcbiAgICBpbnN0YW5jZS5yZXBvLmFkZChub2RlKTtcbiAgICByZXR1cm4gbm9kZTtcbn1cbmV4cG9ydHMuZ2V0TmV3Q2FjaGVOb2RlID0gZ2V0TmV3Q2FjaGVOb2RlO1xuZnVuY3Rpb24gaGFzVWlkKG9iaikge1xuICAgIGlmICghb2JqKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCFpc09iamVjdChvYmopKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBvYmpbY2FjaGVfMS5jb25maWcudWlkTmFtZV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgdWlkID0gb2JqW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgIHJldHVybiB1aWQubGVuZ3RoICE9PSAwO1xufVxuZXhwb3J0cy5oYXNVaWQgPSBoYXNVaWQ7XG5GdW5jdGlvbi5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgdmFyIFNUUklQX0NPTU1FTlRTID0gLygoXFwvXFwvLiokKXwoXFwvXFwqW1xcc1xcU10qP1xcKlxcLykpL21nO1xuICAgIHZhciBBUkdVTUVOVF9OQU1FUyA9IC8oW15cXHMsXSspL2c7XG4gICAgZnVuY3Rpb24gZ2V0UGFyYW1OYW1lcyhmdW5jKSB7XG4gICAgICAgIHZhciBmblN0ciA9IGZ1bmMudG9TdHJpbmcoKS5yZXBsYWNlKFNUUklQX0NPTU1FTlRTLCAnJyk7XG4gICAgICAgIHZhciByZXN1bHQgPSBmblN0ci5zbGljZShmblN0ci5pbmRleE9mKCcoJykgKyAxLCBmblN0ci5pbmRleE9mKCcpJykpLm1hdGNoKEFSR1VNRU5UX05BTUVTKTtcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmVzdWx0ID0gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgdmFyIHN0cmluZ2lmeSA9IHRoaXMudG9TdHJpbmcoKTtcbiAgICBzdHJpbmdpZnkgPSBzdHJpbmdpZnkucmVwbGFjZShuZXcgUmVnRXhwKCdfdGhpcycsICdnJyksICd0aGlzJyk7XG4gICAgdmFyIGJvZHkgPSBzdHJpbmdpZnkubWF0Y2goL2Z1bmN0aW9uW157XStcXHsoW1xcc1xcU10qKVxcfSQvKVsxXTtcbiAgICBib2R5ID0gYm9keS50cmltKCk7XG4gICAgdmFyIHBhcmFtTmFtZXMgPSBnZXRQYXJhbU5hbWVzKHRoaXMpO1xuICAgIHZhciBmdW5jO1xuICAgIGlmIChib2R5LmluZGV4T2YoJ25hdGl2ZSBjb2RlJykgPCAwKSB7XG4gICAgICAgIGZ1bmMgPSBGdW5jdGlvbihwYXJhbU5hbWVzLCBib2R5KTtcbiAgICAgICAgZnVuYyA9IGZ1bmMuYmluZCh0YXJnZXQpO1xuICAgIH1cbiAgICByZXR1cm4gZnVuYztcbn07XG5mdW5jdGlvbiBkZWVwQ2xvbmUob2JqLCB1aWRSZWZlcmVuY2UsIGZyZWV6ZSkge1xuICAgIGlmIChmcmVlemUgPT09IHZvaWQgMCkgeyBmcmVlemUgPSB0cnVlOyB9XG4gICAgaWYgKCFvYmpcbiAgICAgICAgfHwgKCFpc09iamVjdChvYmopXG4gICAgICAgICAgICAmJiAhaXNBcnJheShvYmopKSkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBpZiAoZnJlZXplID09PSB0cnVlXG4gICAgICAgICYmIHVpZFJlZmVyZW5jZVxuICAgICAgICAmJiAhT2JqZWN0LmlzRnJvemVuKHVpZFJlZmVyZW5jZSkpIHtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZSh1aWRSZWZlcmVuY2UpO1xuICAgIH1cbiAgICBpZiAodWlkUmVmZXJlbmNlXG4gICAgICAgICYmIGhhc1VpZChvYmopXG4gICAgICAgICYmIG9ialtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSA9PT0gdWlkUmVmZXJlbmNlW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdKSB7XG4gICAgICAgIHJldHVybiB1aWRSZWZlcmVuY2U7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBfX2Fzc2lnbih7fSwgb2JqKTtcbiAgICBmb3IgKHZhciBwcm9wTmFtZSBpbiBvYmopIHtcbiAgICAgICAgdmFyIHZhbHVlID0gb2JqW3Byb3BOYW1lXTtcbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbcHJvcE5hbWVdID0gZGVlcENsb25lQXJyYXkodmFsdWUsIHVpZFJlZmVyZW5jZSwgZnJlZXplKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHZhbHVlLmdldFRpbWUoKSk7XG4gICAgICAgICAgICAgICAgaWYgKGZyZWV6ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZnJlZXplKGRhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXN1bHRbcHJvcE5hbWVdID0gZGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGlmIChoYXNVaWQodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtwcm9wTmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVpZFJlZmVyZW5jZSAmJiBoYXNVaWQodWlkUmVmZXJlbmNlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlICE9PSB1aWRSZWZlcmVuY2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB2YWx1ZS51aWQgPT09IHVpZFJlZmVyZW5jZS51aWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB2YWx1ZSAhPT0gdWlkUmVmZXJlbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W3Byb3BOYW1lXSA9IHVpZFJlZmVyZW5jZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W3Byb3BOYW1lXSA9IGRlZXBDbG9uZSh2YWx1ZSwgdWlkUmVmZXJlbmNlLCBmcmVlemUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByb3BOYW1lICE9PSAnY29uc3RydWN0b3InKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtwcm9wTmFtZV0gPSB2YWx1ZS5jbG9uZShyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtwcm9wTmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoZnJlZXplID09PSB0cnVlXG4gICAgICAgICYmICFPYmplY3QuaXNGcm96ZW4ocmVzdWx0KVxuICAgICAgICAmJiB0eXBlb2YgcmVzdWx0ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIE9iamVjdC5mcmVlemUocmVzdWx0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmV4cG9ydHMuZGVlcENsb25lID0gZGVlcENsb25lO1xuZnVuY3Rpb24gZGVlcENsb25lQXJyYXkoYXJyLCB1aWRSZWZlcmVuY2UsIGZyZWV6ZSkge1xuICAgIHJldHVybiBhcnIubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIGlmIChpc0FycmF5KGl0ZW0pKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVlcENsb25lQXJyYXkoaXRlbSwgdWlkUmVmZXJlbmNlLCBmcmVlemUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICAgICAgICBpZiAoaGFzVWlkKGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgaWYgKHVpZFJlZmVyZW5jZSAmJiAoaXRlbVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSA9PT0gdWlkUmVmZXJlbmNlW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdWlkUmVmZXJlbmNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWVwQ2xvbmUoaXRlbSwgdWlkUmVmZXJlbmNlLCBmcmVlemUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmV4cG9ydHMuY2FjaGVTaXplID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgdmFyIGNhY2hlTm9kZSA9IGxvY2F0ZV8xLmdldEN1cnJlbnROb2RlKGluc3RhbmNlKTtcbiAgICByZXR1cm4gY2FjaGVOb2RlID8gY2FjaGVOb2RlLml0ZW1zLnNpemUoKSA6IDA7XG59O1xuZXhwb3J0cy5jYWNoZUxlbmd0aCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIHJldHVybiBpbnN0YW5jZS50aHJlYWQubm9kZXMubGVuZ3RoO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3V0aWwudHMiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBDYWNoZU1hcF8xID0gcmVxdWlyZShcIi4vQ2FjaGVNYXBcIik7XG52YXIgQ2FjaGVOb2RlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDYWNoZU5vZGUobm9kZUlkKSB7XG4gICAgICAgIHRoaXMuaXRlbXMgPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuaWQgPSBub2RlSWQ7XG4gICAgfVxuICAgIHJldHVybiBDYWNoZU5vZGU7XG59KCkpO1xuZXhwb3J0cy5DYWNoZU5vZGUgPSBDYWNoZU5vZGU7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DYWNoZU5vZGUudHMiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xuZXhwb3J0cy5nZXRDYWxsU3RhdHMgPSBmdW5jdGlvbiAoc3VjY2VzcywgaW5zdGFuY2UpIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgcmVzdWx0LnN1Y2Nlc3MgPSBzdWNjZXNzO1xuICAgIHJlc3VsdC5ub2RlSWQgPSBleHBvcnRzLm5vZGUoaW5zdGFuY2UpO1xuICAgIHJlc3VsdC5sZW5ndGggPSBsZW5ndGgoaW5zdGFuY2UpO1xuICAgIHJlc3VsdC5uYW1lID0gaW5zdGFuY2UubmFtZTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbmV4cG9ydHMubm9kZSA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgbm9kZUlkKSB7XG4gICAgaWYgKHR5cGVvZiBub2RlSWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHZhciBjdXJyZW50Tm9kZSA9IGdldEN1cnJlbnROb2RlKGluc3RhbmNlKTtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnROb2RlID8gY3VycmVudE5vZGUuaWQgOiAtMTtcbiAgICB9XG4gICAgaWYgKCF1dGlsXzEuaXNOdW1iZXIobm9kZUlkKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgbm9kZSBpZCBtdXN0IGJlIGEgbnVtYmVyLicpO1xuICAgIH1cbiAgICB2YXIgY2FjaGVOb2RlID0gZ2V0UmVwb05vZGUobm9kZUlkLCBpbnN0YW5jZSk7XG4gICAgaWYgKCFjYWNoZU5vZGUpIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMuZ2V0Q2FsbFN0YXRzKGZhbHNlLCBpbnN0YW5jZSk7XG4gICAgfVxuICAgIGluc3RhbmNlLnRocmVhZC5jdXJyZW50ID0gYmluYXJ5SW5kZXhPZihpbnN0YW5jZS50aHJlYWQubm9kZXMsIG5vZGVJZCk7XG4gICAgcmV0dXJuIGV4cG9ydHMuZ2V0Q2FsbFN0YXRzKHRydWUsIGluc3RhbmNlKTtcbn07XG5mdW5jdGlvbiBnZXRDdXJyZW50Tm9kZShpbnN0YW5jZSkge1xuICAgIHZhciBjdXJyZW50Tm9kZUlkID0gaW5zdGFuY2UudGhyZWFkLm5vZGVzW2luc3RhbmNlLnRocmVhZC5jdXJyZW50XTtcbiAgICByZXR1cm4gY3VycmVudE5vZGVJZCA+PSAwID8gZ2V0UmVwb05vZGUoY3VycmVudE5vZGVJZCwgaW5zdGFuY2UpIDogdW5kZWZpbmVkO1xufVxuZXhwb3J0cy5nZXRDdXJyZW50Tm9kZSA9IGdldEN1cnJlbnROb2RlO1xuZnVuY3Rpb24gZ2V0UmVwb05vZGUoY2FjaGVOb2RlSWQsIGluc3RhbmNlKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLnJlcG8uZ2V0KGNhY2hlTm9kZUlkKTtcbn1cbmV4cG9ydHMuZ2V0UmVwb05vZGUgPSBnZXRSZXBvTm9kZTtcbnZhciBsZW5ndGggPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHsgcmV0dXJuIGluc3RhbmNlLnRocmVhZC5ub2Rlcy5sZW5ndGg7IH07XG5mdW5jdGlvbiBiaW5hcnlJbmRleE9mKGFycmF5LCBzZWFyY2hFbGVtZW50KSB7XG4gICAgdmFyIG1pbkluZGV4ID0gMDtcbiAgICB2YXIgbWF4SW5kZXggPSBhcnJheS5sZW5ndGggLSAxO1xuICAgIHZhciBjdXJyZW50SW5kZXg7XG4gICAgdmFyIGN1cnJlbnRFbGVtZW50O1xuICAgIHdoaWxlIChtaW5JbmRleCA8PSBtYXhJbmRleCkge1xuICAgICAgICBjdXJyZW50SW5kZXggPSAobWluSW5kZXggKyBtYXhJbmRleCkgLyAyIHwgMDtcbiAgICAgICAgY3VycmVudEVsZW1lbnQgPSBhcnJheVtjdXJyZW50SW5kZXhdO1xuICAgICAgICBpZiAoY3VycmVudEVsZW1lbnQgPCBzZWFyY2hFbGVtZW50KSB7XG4gICAgICAgICAgICBtaW5JbmRleCA9IGN1cnJlbnRJbmRleCArIDE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY3VycmVudEVsZW1lbnQgPiBzZWFyY2hFbGVtZW50KSB7XG4gICAgICAgICAgICBtYXhJbmRleCA9IGN1cnJlbnRJbmRleCAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gY3VycmVudEluZGV4O1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbG9jYXRlLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHRDb25maWcgPSB7XG4gICAgdWlkTmFtZTogJ3VpZCcsXG4gICAgbWF4SGlzdG9yeVN0YXRlczogMTAwMCxcbn07XG5mdW5jdGlvbiBjb25maWd1cmUoY29uZikge1xuICAgIGZvciAodmFyIHAgaW4gZXhwb3J0cy5kZWZhdWx0Q29uZmlnKSB7XG4gICAgICAgIGlmIChleHBvcnRzLmRlZmF1bHRDb25maWcuaGFzT3duUHJvcGVydHkocCkgJiYgY29uZi5oYXNPd25Qcm9wZXJ0eShwKSkge1xuICAgICAgICAgICAgZXhwb3J0cy5kZWZhdWx0Q29uZmlnW3BdID0gY29uZltwXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZXhwb3J0cy5kZWZhdWx0Q29uZmlnO1xufVxuZXhwb3J0cy5jb25maWd1cmUgPSBjb25maWd1cmU7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9jb25maWcudHMiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xudmFyIGNhY2hlXzEgPSByZXF1aXJlKFwiLi9jYWNoZVwiKTtcbnZhciBjYWNoZVV0aWxfMSA9IHJlcXVpcmUoXCIuL2NhY2hlVXRpbFwiKTtcbnZhciBnZXRBY3R1YWxVaWQgPSBmdW5jdGlvbiAodWlkT3JFbnRpdHkpIHtcbiAgICBpZiAodHlwZW9mIHVpZE9yRW50aXR5ID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gdWlkT3JFbnRpdHk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiB1aWRPckVudGl0eSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZyh1aWRPckVudGl0eSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHV0aWxfMS5pc09iamVjdCh1aWRPckVudGl0eSkpIHtcbiAgICAgICAgaWYgKHV0aWxfMS5oYXNVaWQodWlkT3JFbnRpdHkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdWlkT3JFbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV07XG4gICAgICAgIH1cbiAgICB9XG59O1xudmFyIGdldE9iamVjdCA9IGZ1bmN0aW9uICh1aWRPckVudGl0eSwgaW5zdGFuY2UpIHtcbiAgICB2YXIgcmVhbFVpZCA9IGdldEFjdHVhbFVpZCh1aWRPckVudGl0eSk7XG4gICAgaWYgKCFyZWFsVWlkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGl0ZW0gPSBjYWNoZVV0aWxfMS5nZXRDYWNoZWRJdGVtKHJlYWxVaWQsIGluc3RhbmNlKTtcbiAgICByZXR1cm4gaXRlbSA/IGl0ZW0uZW50aXR5IDogdW5kZWZpbmVkO1xufTtcbmV4cG9ydHMuZ2V0SXRlbSA9IGZ1bmN0aW9uIChlbnRpdHksIGluc3RhbmNlLCBub2RlSWQpIHtcbiAgICBpZiAoIWVudGl0eSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdPbmUgZ2V0KCk6IHJlcXVpcmVzIGEgdWlkIHRvIHJldHJpZXZlIGFuIGl0ZW0gZnJvbSB0aGUgY2FjaGUuJyk7XG4gICAgfVxuICAgIGlmICh1dGlsXzEuaXNBcnJheShlbnRpdHkpKSB7XG4gICAgICAgIHJldHVybiBlbnRpdHlcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGl0ZW0pIHsgcmV0dXJuIGdldE9iamVjdChpdGVtLCBpbnN0YW5jZSk7IH0pXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiAoaXRlbSAhPT0gbnVsbCAmJiBpdGVtICE9PSB1bmRlZmluZWQpOyB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGdldE9iamVjdChlbnRpdHksIGluc3RhbmNlKTtcbn07XG52YXIgZ2V0RWRpdGFibGVPYmplY3QgPSBmdW5jdGlvbiAodWlkT3JFbnRpdHksIGluc3RhbmNlKSB7XG4gICAgdmFyIHJlYWxVaWQgPSBnZXRBY3R1YWxVaWQodWlkT3JFbnRpdHkpO1xuICAgIHZhciBleGlzdGluZyA9IGV4cG9ydHMuZ2V0SXRlbShyZWFsVWlkLCBpbnN0YW5jZSk7XG4gICAgcmV0dXJuIGV4aXN0aW5nID8gdXRpbF8xLmRlZXBDbG9uZShleGlzdGluZywgdW5kZWZpbmVkLCBmYWxzZSkgOiB1bmRlZmluZWQ7XG59O1xuZXhwb3J0cy5nZXRFZGl0SXRlbSA9IGZ1bmN0aW9uIChvYmosIGluc3RhbmNlLCBub2RlSWQpIHtcbiAgICBpZiAodXRpbF8xLmlzQXJyYXkob2JqKSkge1xuICAgICAgICByZXR1cm4gb2JqXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiBnZXRFZGl0YWJsZU9iamVjdChpdGVtLCBpbnN0YW5jZSk7IH0pXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiAoaXRlbSAhPT0gbnVsbCAmJiBpdGVtICE9PSB1bmRlZmluZWQpOyB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGdldEVkaXRhYmxlT2JqZWN0KG9iaiwgaW5zdGFuY2UpO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2dldC50cyIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIENhY2hlSXRlbV8xID0gcmVxdWlyZShcIi4vQ2FjaGVJdGVtXCIpO1xudmFyIGNhY2hlXzEgPSByZXF1aXJlKFwiLi9jYWNoZVwiKTtcbmV4cG9ydHMuZ2V0Q2FjaGVkSXRlbSA9IGZ1bmN0aW9uICh1aWQsIGluc3RhbmNlKSB7XG4gICAgdmFyIGN1cnJlbnROb2RlID0gZ2V0Q3VycmVudE5vZGUoaW5zdGFuY2UpO1xuICAgIHJldHVybiBjdXJyZW50Tm9kZSA/IGN1cnJlbnROb2RlLml0ZW1zLmdldChTdHJpbmcodWlkKSkgOiB1bmRlZmluZWQ7XG59O1xuZXhwb3J0cy5pc09uQ2FjaGUgPSBmdW5jdGlvbiAoZW50aXR5LCBpbnN0YW5jZSkge1xuICAgIHZhciBjYWNoZWRJdGVtID0gZXhwb3J0cy5nZXRDYWNoZWRJdGVtKGVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSwgaW5zdGFuY2UpO1xuICAgIHJldHVybiBjYWNoZWRJdGVtICYmIGNhY2hlZEl0ZW0uZW50aXR5ID09PSBlbnRpdHk7XG59O1xuZXhwb3J0cy5pc09uRmx1c2hNYXAgPSBmdW5jdGlvbiAoZW50aXR5LCBmbHVzaE1hcCkge1xuICAgIHJldHVybiAhIWZsdXNoTWFwLmdldChlbnRpdHlbY2FjaGVfMS5jb25maWcudWlkXSk7XG59O1xuZXhwb3J0cy5nZXRJdGVtRmx1c2hPckNhY2hlZCA9IGZ1bmN0aW9uICh1aWQsIGZsdXNoQXJncykge1xuICAgIGlmICh1aWQpIHtcbiAgICAgICAgdmFyIHV1aWQgPSBTdHJpbmcodWlkKTtcbiAgICAgICAgdmFyIGl0ZW0gPSBmbHVzaEFyZ3MuZmx1c2hNYXAuZ2V0KHV1aWQpO1xuICAgICAgICBpZiAoIWl0ZW0pIHtcbiAgICAgICAgICAgIGl0ZW0gPSBleHBvcnRzLmdldENhY2hlZEl0ZW0odXVpZCwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXRlbSAmJiBPYmplY3QuaXNGcm96ZW4oaXRlbSkpIHtcbiAgICAgICAgICAgIGl0ZW0gPSBpdGVtLmNsb25lKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxufTtcbmZ1bmN0aW9uIGdldEN1cnJlbnROb2RlKGluc3RhbmNlKSB7XG4gICAgdmFyIGN1cnJlbnROb2RlSWQgPSBpbnN0YW5jZS50aHJlYWQubm9kZXNbaW5zdGFuY2UudGhyZWFkLmN1cnJlbnRdO1xuICAgIHJldHVybiBjdXJyZW50Tm9kZUlkID49IDAgPyBnZXRSZXBvTm9kZShjdXJyZW50Tm9kZUlkLCBpbnN0YW5jZS5yZXBvKSA6IHVuZGVmaW5lZDtcbn1cbmZ1bmN0aW9uIGdldFJlcG9Ob2RlKG5vZGVJZCwgcmVwbykge1xuICAgIHJldHVybiByZXBvLmdldChub2RlSWQpO1xufVxuZXhwb3J0cy5nZXRDYWNoZUN1cnJlbnRTdGFjayA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIHZhciBjdXJyZW50Tm9kZSA9IGdldEN1cnJlbnROb2RlKGluc3RhbmNlKTtcbiAgICByZXR1cm4gY3VycmVudE5vZGUgPyBjdXJyZW50Tm9kZS5pdGVtcyA6IHVuZGVmaW5lZDtcbn07XG5leHBvcnRzLmVuc3VyZUl0ZW0gPSBmdW5jdGlvbiAoZW50aXR5LCBmbHVzaEFyZ3MpIHtcbiAgICB2YXIgaXRlbVVpZCA9IFN0cmluZyhlbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV0pO1xuICAgIHZhciBpdGVtID0gZmx1c2hBcmdzLmZsdXNoTWFwLmdldChpdGVtVWlkKTtcbiAgICBpZiAoaXRlbSkge1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICB9XG4gICAgdmFyIGxpdmUgPSBleHBvcnRzLmdldENhY2hlZEl0ZW0oaXRlbVVpZCwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICBpdGVtID0gbmV3IENhY2hlSXRlbV8xLmRlZmF1bHQoZW50aXR5LCBsaXZlKTtcbiAgICBmbHVzaEFyZ3MuZmx1c2hNYXAuc2V0KGl0ZW1VaWQsIGl0ZW0pO1xuICAgIGZsdXNoQXJncy5mbHVzaE1hcFsnX19VUERBVEVEX18nXSA9IHRydWU7XG4gICAgcmV0dXJuIGl0ZW07XG59O1xuZXhwb3J0cy5lbnN1cmVPbkZsdXNoTWFwID0gZnVuY3Rpb24gKGVudGl0eSwgZmx1c2hBcmdzKSB7XG4gICAgdmFyIGVudGl0eVVpZCA9IFN0cmluZyhlbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV0pO1xuICAgIGlmICghZmx1c2hBcmdzLmZsdXNoTWFwLmhhcyhlbnRpdHlVaWQpKSB7XG4gICAgICAgIGV4cG9ydHMuZW5zdXJlSXRlbShlbnRpdHksIGZsdXNoQXJncyk7XG4gICAgfVxufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2NhY2hlVXRpbC50cyIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIENhY2hlTWFwXzEgPSByZXF1aXJlKFwiLi9DYWNoZU1hcFwiKTtcbnZhciBDYWNoZUl0ZW0gPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENhY2hlSXRlbShlbnRpdHksIGxpdmVJdGVtKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuY2xvbmUgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgQ2FjaGVJdGVtKF90aGlzLmVudGl0eSwgX3RoaXMpOyB9O1xuICAgICAgICB0aGlzLmVudGl0eSA9IGVudGl0eTtcbiAgICAgICAgaWYgKGxpdmVJdGVtKSB7XG4gICAgICAgICAgICB0aGlzLm1hcEZyb20gPSBsaXZlSXRlbS5tYXBGcm9tLmNsb25lKCk7XG4gICAgICAgICAgICB0aGlzLm1hcFRvID0gbGl2ZUl0ZW0ubWFwVG8uY2xvbmUoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubWFwRnJvbSA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMubWFwVG8gPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIENhY2hlSXRlbTtcbn0oKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDYWNoZUl0ZW07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DYWNoZUl0ZW0udHMiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBvcGF0aCA9IHJlcXVpcmUoXCIuL3BhdGhcIik7XG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbnZhciBjYWNoZVV0aWxfMSA9IHJlcXVpcmUoXCIuL2NhY2hlVXRpbFwiKTtcbnZhciByZWZfMSA9IHJlcXVpcmUoXCIuL3JlZlwiKTtcbnZhciBDYWNoZU1hcF8xID0gcmVxdWlyZShcIi4vQ2FjaGVNYXBcIik7XG52YXIgY2FjaGVfMSA9IHJlcXVpcmUoXCIuL2NhY2hlXCIpO1xudmFyIGZsdXNoXzEgPSByZXF1aXJlKFwiLi9mbHVzaFwiKTtcbnZhciBsb2NhdGVfMSA9IHJlcXVpcmUoXCIuL2xvY2F0ZVwiKTtcbnZhciBnZXRfMSA9IHJlcXVpcmUoXCIuL2dldFwiKTtcbnZhciBwYXJzZV8xID0gcmVxdWlyZShcIi4vcGFyc2VcIik7XG52YXIgYnVpbGRFdmljdFVpZEFycmF5ID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHZhciB1aWRBcnJheSA9IFtdO1xuICAgIGlmICh1dGlsXzEuaXNBcnJheShvYmopKSB7XG4gICAgICAgIG9iai5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICBpZiAodXRpbF8xLmhhc1VpZChpdGVtKSkge1xuICAgICAgICAgICAgICAgIHVpZEFycmF5LnB1c2goU3RyaW5nKGl0ZW1bY2FjaGVfMS5jb25maWcudWlkTmFtZV0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIGl0ZW0gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgICAgIHVpZEFycmF5LnB1c2goU3RyaW5nKGl0ZW0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdmFyIHVpZCA9IG9iajtcbiAgICAgICAgaWYgKHV0aWxfMS5pc09iamVjdChvYmopKSB7XG4gICAgICAgICAgICB1aWQgPSBvYmpbY2FjaGVfMS5jb25maWcudWlkTmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVpZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdWlkQXJyYXk7XG4gICAgICAgIH1cbiAgICAgICAgdWlkQXJyYXkucHVzaChTdHJpbmcodWlkKSk7XG4gICAgfVxuICAgIHJldHVybiB1aWRBcnJheTtcbn07XG5leHBvcnRzLmV2aWN0SXRlbSA9IGZ1bmN0aW9uIChvYmosIGluc3RhbmNlKSB7XG4gICAgdmFyIHVpZEFycmF5ID0gYnVpbGRFdmljdFVpZEFycmF5KG9iaik7XG4gICAgaWYgKHVpZEFycmF5Lmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIHJldHVybiBsb2NhdGVfMS5nZXRDYWxsU3RhdHMoZmFsc2UsIGluc3RhbmNlKTtcbiAgICB9XG4gICAgdmFyIGN1cnJlbnRTdGF0ZSA9IGNhY2hlVXRpbF8xLmdldENhY2hlQ3VycmVudFN0YWNrKGluc3RhbmNlKTtcbiAgICB2YXIgZm91bmQgPSB1aWRBcnJheS5zb21lKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHJldHVybiBjdXJyZW50U3RhdGUgJiYgY3VycmVudFN0YXRlLmhhcyhTdHJpbmcoaXRlbSkpO1xuICAgIH0pO1xuICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgcmV0dXJuIGxvY2F0ZV8xLmdldENhbGxTdGF0cyhmYWxzZSwgaW5zdGFuY2UpO1xuICAgIH1cbiAgICB2YXIgdGVtcFN0YXRlID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgIGN1cnJlbnRTdGF0ZS5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgIHRlbXBTdGF0ZS5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgfSk7XG4gICAgdmFyIGZsdXNoTWFwID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgIHZhciBldmljdE1hcCA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICB2YXIgZmx1c2hBcmdzID0ge1xuICAgICAgICBmbHVzaE1hcDogZmx1c2hNYXAsXG4gICAgICAgIGV2aWN0TWFwOiBldmljdE1hcCxcbiAgICAgICAgaW5zdGFuY2U6IGluc3RhbmNlXG4gICAgfTtcbiAgICB2YXIgcGFyZW50c0NoYW5nZWQgPSBbXTtcbiAgICB1aWRBcnJheS5mb3JFYWNoKGZ1bmN0aW9uICh1aWQpIHtcbiAgICAgICAgY2xlYXJUYXJnZXRSZWZGcm9tcyh1aWQsIGZsdXNoQXJncyk7XG4gICAgICAgIGV2aWN0TWFwLnNldCh1aWQsIG51bGwpO1xuICAgICAgICBjbGVhclBhcmVudFJlZlRvcyh1aWQsIHVpZEFycmF5LCBwYXJlbnRzQ2hhbmdlZCwgZmx1c2hBcmdzKTtcbiAgICB9KTtcbiAgICBwdXRQYXJlbnRzQ2hhbmdlZChwYXJlbnRzQ2hhbmdlZCwgZmx1c2hNYXAsIGV2aWN0TWFwLCBpbnN0YW5jZSk7XG4gICAgZmx1c2hNYXAuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgIHRlbXBTdGF0ZS5zZXQoa2V5LCBpdGVtKTtcbiAgICB9KTtcbiAgICBldmljdE1hcC5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIGl0ZW0pIHtcbiAgICAgICAgdGVtcFN0YXRlLmRlbGV0ZShrZXkpO1xuICAgIH0pO1xuICAgIGZsdXNoXzEuZmx1c2godGVtcFN0YXRlLCBpbnN0YW5jZSk7XG4gICAgcmV0dXJuIGxvY2F0ZV8xLmdldENhbGxTdGF0cyh0cnVlLCBpbnN0YW5jZSk7XG59O1xudmFyIHB1dFBhcmVudHNDaGFuZ2VkID0gZnVuY3Rpb24gKHBhcmVudHNDaGFuZ2VkLCBmbHVzaE1hcCwgZXZpY3RNYXAsIGluc3RhbmNlKSB7XG4gICAgaWYgKHBhcmVudHNDaGFuZ2VkICYmIHBhcmVudHNDaGFuZ2VkLmxlbmd0aCA+IDAgJiYgdXRpbF8xLmNhY2hlU2l6ZShpbnN0YW5jZSkgPiAwKSB7XG4gICAgICAgIHZhciBmbHVzaEFyZ3NfMSA9IHtcbiAgICAgICAgICAgIGZsdXNoTWFwOiBmbHVzaE1hcCxcbiAgICAgICAgICAgIGV2aWN0TWFwOiBldmljdE1hcCxcbiAgICAgICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZVxuICAgICAgICB9O1xuICAgICAgICBwYXJzZV8xLnBhcnNlKHBhcmVudHNDaGFuZ2VkLCBmbHVzaEFyZ3NfMSk7XG4gICAgICAgIGZsdXNoQXJnc18xLmZsdXNoTWFwLmZvckVhY2goZnVuY3Rpb24gKGtleSwgaXRlbSkge1xuICAgICAgICAgICAgcmVmXzEudXBkYXRlUmVmRnJvbXMoaXRlbSwgZmx1c2hBcmdzXzEpO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xudmFyIGNsZWFyUmVmRnJvbSA9IGZ1bmN0aW9uIChyZWZJdGVtLCBwYXJlbnRVaWQpIHtcbiAgICB2YXIgcmVmc0FycmF5ID0gcmVmSXRlbS5tYXBGcm9tLmdldChwYXJlbnRVaWQpO1xuICAgIGlmICghcmVmc0FycmF5KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmVmSXRlbS5tYXBGcm9tID0gcmVmSXRlbS5tYXBGcm9tLmNsb25lKCk7XG4gICAgcmVmSXRlbS5tYXBGcm9tLmRlbGV0ZShwYXJlbnRVaWQpO1xufTtcbnZhciBjbGVhclJlZlRvID0gZnVuY3Rpb24gKHBhcmVudEl0ZW0sIHJlZlVpZCwgaW5zdGFuY2UpIHtcbiAgICB2YXIgcGFyZW50ID0gcGFyZW50SXRlbS5lbnRpdHk7XG4gICAgaWYgKE9iamVjdC5pc0Zyb3plbihwYXJlbnQpKSB7XG4gICAgICAgIHBhcmVudCA9IGdldF8xLmdldEVkaXRJdGVtKHBhcmVudFtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSwgaW5zdGFuY2UpO1xuICAgICAgICBwYXJlbnRJdGVtLmVudGl0eSA9IHBhcmVudDtcbiAgICB9XG4gICAgdmFyIHJlZlBhdGhzID0gcGFyZW50SXRlbS5tYXBUby5nZXQocmVmVWlkKTtcbiAgICByZWZQYXRocy5mb3JFYWNoKGZ1bmN0aW9uIChwYXRoKSB7XG4gICAgICAgIG9wYXRoLmRlbChwYXJlbnQsIHBhdGgpO1xuICAgIH0pO1xuICAgIGlmICghT2JqZWN0LmlzRnJvemVuKHBhcmVudCkpIHtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZShwYXJlbnQpO1xuICAgIH1cbiAgICBwYXJlbnRJdGVtLmVudGl0eSA9IHBhcmVudDtcbiAgICBwYXJlbnRJdGVtLm1hcFRvID0gcGFyZW50SXRlbS5tYXBUby5jbG9uZSgpO1xuICAgIHBhcmVudEl0ZW0ubWFwVG8uZGVsZXRlKHJlZlVpZCk7XG4gICAgcmV0dXJuIHRydWU7XG59O1xudmFyIGNsZWFyVGFyZ2V0UmVmRnJvbXMgPSBmdW5jdGlvbiAoZW50aXR5VWlkLCBmbHVzaEFyZ3MpIHtcbiAgICB2YXIgaXRlbSA9IGNhY2hlVXRpbF8xLmdldENhY2hlZEl0ZW0oZW50aXR5VWlkLCBmbHVzaEFyZ3MuaW5zdGFuY2UpO1xuICAgIGlmIChpdGVtKSB7XG4gICAgICAgIGl0ZW0ubWFwVG8uZm9yRWFjaChmdW5jdGlvbiAodG9VaWQsIHBhdGhzKSB7XG4gICAgICAgICAgICB2YXIgcmVmSXRlbSA9IGNhY2hlVXRpbF8xLmdldEl0ZW1GbHVzaE9yQ2FjaGVkKHRvVWlkLCBmbHVzaEFyZ3MpO1xuICAgICAgICAgICAgaWYgKHJlZkl0ZW0pIHtcbiAgICAgICAgICAgICAgICBjbGVhclJlZkZyb20ocmVmSXRlbSwgZW50aXR5VWlkKTtcbiAgICAgICAgICAgICAgICBpZiAocmVmSXRlbS5tYXBGcm9tLnNpemUoKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhclRhcmdldFJlZkZyb21zKHRvVWlkLCBmbHVzaEFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZXZpY3RNYXAuc2V0KHRvVWlkLCByZWZJdGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZsdXNoQXJncy5mbHVzaE1hcC5zZXQodG9VaWQsIHJlZkl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcbnZhciBjbGVhclBhcmVudFJlZlRvcyA9IGZ1bmN0aW9uIChlbnRpdHlVaWQsIHVpZEFycmF5LCBwYXJlbnRzQ2hhbmdlZCwgZmx1c2hBcmdzKSB7XG4gICAgdmFyIGl0ZW0gPSBjYWNoZVV0aWxfMS5nZXRJdGVtRmx1c2hPckNhY2hlZChlbnRpdHlVaWQsIGZsdXNoQXJncyk7XG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgaXRlbS5tYXBGcm9tLmZvckVhY2goZnVuY3Rpb24gKHBhcmVudFVpZCwgcGF0aHMpIHtcbiAgICAgICAgICAgIHZhciBwYXJlbnRJdGVtID0gY2FjaGVVdGlsXzEuZ2V0SXRlbUZsdXNoT3JDYWNoZWQocGFyZW50VWlkLCBmbHVzaEFyZ3MpO1xuICAgICAgICAgICAgaWYgKHBhcmVudEl0ZW0pIHtcbiAgICAgICAgICAgICAgICB2YXIgc3VjY2VzcyA9IGNsZWFyUmVmVG8ocGFyZW50SXRlbSwgZW50aXR5VWlkLCBmbHVzaEFyZ3MuaW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgIGlmIChzdWNjZXNzID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGZsdXNoQXJncy5mbHVzaE1hcC5zZXQocGFyZW50VWlkLCBwYXJlbnRJdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVpZEFycmF5LmluZGV4T2YocGFyZW50VWlkKSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudHNDaGFuZ2VkLnB1c2gocGFyZW50SXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9ldmljdC50cyIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG5mdW5jdGlvbiBnZXRLZXkoa2V5KSB7XG4gICAgdmFyIGludEtleSA9IHBhcnNlSW50KGtleSk7XG4gICAgaWYgKGludEtleS50b1N0cmluZygpID09PSBrZXkpIHtcbiAgICAgICAgcmV0dXJuIGludEtleTtcbiAgICB9XG4gICAgcmV0dXJuIGtleTtcbn1cbmZ1bmN0aW9uIGRlbChvYmosIHBhdGgpIHtcbiAgICBpZiAodXRpbF8xLmlzTnVtYmVyKHBhdGgpKSB7XG4gICAgICAgIHBhdGggPSBbcGF0aF07XG4gICAgfVxuICAgIGlmICh1dGlsXzEuaXNFbXB0eShvYmopKSB7XG4gICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfVxuICAgIGlmICh1dGlsXzEuaXNFbXB0eShwYXRoKSkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBpZiAodXRpbF8xLmlzU3RyaW5nKHBhdGgpKSB7XG4gICAgICAgIHJldHVybiBkZWwob2JqLCBwYXRoLnNwbGl0KCcuJykpO1xuICAgIH1cbiAgICB2YXIgY3VycmVudFBhdGggPSBnZXRLZXkocGF0aFswXSk7XG4gICAgdmFyIG9sZFZhbCA9IG9ialtjdXJyZW50UGF0aF07XG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGlmIChvbGRWYWwgIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgaWYgKHV0aWxfMS5pc0FycmF5KG9iaikpIHtcbiAgICAgICAgICAgICAgICBvYmouc3BsaWNlKGN1cnJlbnRQYXRoLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBvYmpbY3VycmVudFBhdGhdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAob2JqW2N1cnJlbnRQYXRoXSAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVsKG9ialtjdXJyZW50UGF0aF0sIHBhdGguc2xpY2UoMSkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG59XG5leHBvcnRzLmRlbCA9IGRlbDtcbmZ1bmN0aW9uIGdldChvYmosIHBhdGgsIGRlZmF1bHRWYWx1ZSkge1xuICAgIGlmICh1dGlsXzEuaXNOdW1iZXIocGF0aCkpIHtcbiAgICAgICAgcGF0aCA9IFtwYXRoXTtcbiAgICB9XG4gICAgaWYgKHV0aWxfMS5pc0VtcHR5KHBhdGgpKSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICAgIGlmICh1dGlsXzEuaXNFbXB0eShvYmopKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgfVxuICAgIGlmICh1dGlsXzEuaXNTdHJpbmcocGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIGdldChvYmosIHBhdGguc3BsaXQoJy4nKSwgZGVmYXVsdFZhbHVlKTtcbiAgICB9XG4gICAgdmFyIGN1cnJlbnRQYXRoID0gZ2V0S2V5KHBhdGhbMF0pO1xuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBpZiAob2JqW2N1cnJlbnRQYXRoXSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmpbY3VycmVudFBhdGhdO1xuICAgIH1cbiAgICByZXR1cm4gZ2V0KG9ialtjdXJyZW50UGF0aF0sIHBhdGguc2xpY2UoMSksIGRlZmF1bHRWYWx1ZSk7XG59XG5leHBvcnRzLmdldCA9IGdldDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3BhdGgudHMiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBvcGF0aCA9IHJlcXVpcmUoXCIuL3BhdGhcIik7XG52YXIgY2FjaGVVdGlsXzEgPSByZXF1aXJlKFwiLi9jYWNoZVV0aWxcIik7XG52YXIgY2FjaGVfMSA9IHJlcXVpcmUoXCIuL2NhY2hlXCIpO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG52YXIgYWRkUmVmVG8gPSBmdW5jdGlvbiAocGFyZW50SXRlbSwgcmVmVWlkLCBwYXRoKSB7XG4gICAgaWYgKHBhcmVudEl0ZW0ubWFwVG8uaGFzKHJlZlVpZCkgPT09IGZhbHNlKSB7XG4gICAgICAgIHBhcmVudEl0ZW0ubWFwVG8uc2V0KHJlZlVpZCwgW10pO1xuICAgIH1cbiAgICB2YXIgcmVmQXJyYXkgPSBwYXJlbnRJdGVtLm1hcFRvLmdldChyZWZVaWQpO1xuICAgIGlmIChyZWZBcnJheS5pbmRleE9mKHBhdGgpIDwgMCkge1xuICAgICAgICByZWZBcnJheS5wdXNoKHBhdGgpO1xuICAgIH1cbiAgICByZXR1cm4gcGFyZW50SXRlbTtcbn07XG52YXIgYWRkUmVmRnJvbSA9IGZ1bmN0aW9uIChyZWZJdGVtLCBwYXJlbnRVaWQsIHBhdGgpIHtcbiAgICBpZiAocmVmSXRlbS5tYXBGcm9tLmhhcyhwYXJlbnRVaWQpID09PSBmYWxzZSkge1xuICAgICAgICByZWZJdGVtLm1hcEZyb20uc2V0KHBhcmVudFVpZCwgW10pO1xuICAgIH1cbiAgICB2YXIgZnJvbUFycmF5ID0gcmVmSXRlbS5tYXBGcm9tLmdldChwYXJlbnRVaWQpO1xuICAgIGlmIChmcm9tQXJyYXkuaW5kZXhPZihwYXRoKSA8IDApIHtcbiAgICAgICAgZnJvbUFycmF5LnB1c2gocGF0aCk7XG4gICAgfVxuICAgIHJldHVybiByZWZJdGVtO1xufTtcbnZhciBhc3NpZ25SZWZzID0gZnVuY3Rpb24gKHBhcmVudEl0ZW0sIHJlZkl0ZW0sIHBhdGgpIHtcbiAgICB2YXIgcGFyZW50VWlkID0gcGFyZW50SXRlbS5lbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV07XG4gICAgdmFyIHJlZlVpZCA9IHJlZkl0ZW0uZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgIHZhciByZWZQYXRoID0gcGF0aC5qb2luKCcuJyk7XG4gICAgYWRkUmVmVG8ocGFyZW50SXRlbSwgcmVmVWlkLCByZWZQYXRoKTtcbiAgICBhZGRSZWZGcm9tKHJlZkl0ZW0sIHBhcmVudFVpZCwgcmVmUGF0aCk7XG59O1xuZXhwb3J0cy5hc3NpZ25SZWZUb1BhcmVudCA9IGZ1bmN0aW9uIChyZWZJdGVtLCBwYXJlbnRVaWQsIHBhdGgsIGZsdXNoQXJncykge1xuICAgIGlmIChwYXJlbnRVaWQpIHtcbiAgICAgICAgdmFyIHBhcmVudEl0ZW0gPSBjYWNoZVV0aWxfMS5nZXRJdGVtRmx1c2hPckNhY2hlZChwYXJlbnRVaWQsIGZsdXNoQXJncyk7XG4gICAgICAgIGlmIChwYXJlbnRJdGVtICYmIHBhdGgubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYXNzaWduUmVmcyhwYXJlbnRJdGVtLCByZWZJdGVtLCBwYXRoKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5leHBvcnRzLnVwZGF0ZVJlZkZyb21zID0gZnVuY3Rpb24gKGl0ZW0sIGZsdXNoQXJncykge1xuICAgIGlmIChpdGVtLm1hcEZyb20ubGVuZ3RoID4gMCkge1xuICAgICAgICBpdGVtLm1hcEZyb20uZm9yRWFjaChmdW5jdGlvbiAocGFyZW50VWlkLCBwYXRocykge1xuICAgICAgICAgICAgdmFyIHBhcmVudEl0ZW0gPSBmbHVzaEFyZ3MuZmx1c2hNYXAuZ2V0KHBhcmVudFVpZCk7XG4gICAgICAgICAgICBpZiAoIXBhcmVudEl0ZW0pIHtcbiAgICAgICAgICAgICAgICBwYXJlbnRJdGVtID0gY2FjaGVVdGlsXzEuZ2V0Q2FjaGVkSXRlbShwYXJlbnRVaWQsIGZsdXNoQXJncy5pbnN0YW5jZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGFyZW50SXRlbSAmJiBwYXRocy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIGZpcnN0UGF0aCA9IHBhdGhzWzBdO1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXRSZWYgPSBvcGF0aC5nZXQocGFyZW50SXRlbS5lbnRpdHksIGZpcnN0UGF0aCk7XG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldFJlZiAmJiB0YXJnZXRSZWYgIT09IGl0ZW0uZW50aXR5KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhcmdzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmx1c2hNYXA6IGZsdXNoQXJncy5mbHVzaE1hcCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3RhbmNlOiBmbHVzaEFyZ3MuaW5zdGFuY2UsXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudEl0ZW0gPSBjYWNoZVV0aWxfMS5lbnN1cmVJdGVtKHBhcmVudEl0ZW0uZW50aXR5LCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50SXRlbS5lbnRpdHkgPSB1dGlsXzEuZGVlcENsb25lKHBhcmVudEl0ZW0uZW50aXR5LCBpdGVtLmVudGl0eSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGV4cG9ydHMudXBkYXRlUmVmRnJvbXMocGFyZW50SXRlbSwgZmx1c2hBcmdzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG52YXIgcmVtb3ZlUmVmRnJvbSA9IGZ1bmN0aW9uIChpdGVtLCBwYXJlbnRVaWQsIHBhdGgpIHtcbiAgICB2YXIgcmVmc0FycmF5ID0gaXRlbS5tYXBGcm9tLmdldChwYXJlbnRVaWQpO1xuICAgIHZhciBpbmRleCA9IHJlZnNBcnJheS5pbmRleE9mKHBhdGgpO1xuICAgIHJlZnNBcnJheSA9IHJlZnNBcnJheS5zbGljZSgpO1xuICAgIHJlZnNBcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIGl0ZW0ubWFwRnJvbS5zZXQocGFyZW50VWlkLCByZWZzQXJyYXkpO1xuICAgIGlmIChyZWZzQXJyYXkubGVuZ3RoID09IDApIHtcbiAgICAgICAgaXRlbS5tYXBGcm9tLmRlbGV0ZShwYXJlbnRVaWQpO1xuICAgIH1cbn07XG52YXIgcmVtb3ZlUmVmRnJvbVZhbHVlID0gZnVuY3Rpb24gKHBhcmVudFVpZCwgcmVmVWlkLCBmbHVzaEFyZ3MsIHBhdGgpIHtcbiAgICB2YXIgcmVmSXRlbSA9IGNhY2hlVXRpbF8xLmdldEl0ZW1GbHVzaE9yQ2FjaGVkKHJlZlVpZCwgZmx1c2hBcmdzKTtcbiAgICBpZiAocmVmSXRlbSkge1xuICAgICAgICByZWZJdGVtID0gcmVmSXRlbS5jbG9uZSgpO1xuICAgICAgICBpZiAocmVmSXRlbS5tYXBGcm9tLmhhcyhwYXJlbnRVaWQpKSB7XG4gICAgICAgICAgICByZW1vdmVSZWZGcm9tKHJlZkl0ZW0sIHBhcmVudFVpZCwgcGF0aCk7XG4gICAgICAgICAgICBpZiAocmVmSXRlbS5tYXBGcm9tLnNpemUoKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGZsdXNoQXJncy5ldmljdE1hcC5zZXQocmVmVWlkLCByZWZJdGVtKTtcbiAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZmx1c2hNYXAuZGVsZXRlKHJlZlVpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZmx1c2hNYXAuc2V0KHJlZlVpZCwgcmVmSXRlbSk7XG4gICAgICAgICAgICAgICAgZmx1c2hBcmdzLmV2aWN0TWFwLmRlbGV0ZShyZWZVaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcbnZhciB1cGRhdGVJdGVtUmVmVG9zID0gZnVuY3Rpb24gKGl0ZW0sIGZsdXNoQXJncykge1xuICAgIGlmICghaXRlbSB8fCAhaXRlbS5tYXBUbykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGl0ZW0ubWFwVG8uZm9yRWFjaChmdW5jdGlvbiAodG9VaWQsIHBhdGhzKSB7XG4gICAgICAgIHZhciB1cGRhdGVkUGF0aHMgPSBwYXRocy5maWx0ZXIoZnVuY3Rpb24gKHBhdGgpIHtcbiAgICAgICAgICAgIHZhciByZWZlcmVuY2UgPSBvcGF0aC5nZXQoaXRlbS5lbnRpdHksIHBhdGgpO1xuICAgICAgICAgICAgdmFyIGhhc1JlZiA9IHJlZmVyZW5jZSAmJiBTdHJpbmcocmVmZXJlbmNlW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdKSA9PT0gU3RyaW5nKHRvVWlkKTtcbiAgICAgICAgICAgIGlmICghaGFzUmVmKSB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlUmVmRnJvbVZhbHVlKGl0ZW0uZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdLCB0b1VpZCwgZmx1c2hBcmdzLCBwYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBoYXNSZWY7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodXBkYXRlZFBhdGhzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGl0ZW0ubWFwVG8uc2V0KHRvVWlkLCB1cGRhdGVkUGF0aHMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaXRlbS5tYXBUby5kZWxldGUodG9VaWQpO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuZXhwb3J0cy51cGRhdGVQb2ludGVycyA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MpIHtcbiAgICBmbHVzaEFyZ3MuZmx1c2hNYXAuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgIHVwZGF0ZUl0ZW1SZWZUb3MoaXRlbSwgZmx1c2hBcmdzKTtcbiAgICAgICAgZXhwb3J0cy51cGRhdGVSZWZGcm9tcyhpdGVtLCBmbHVzaEFyZ3MpO1xuICAgIH0pO1xufTtcbmV4cG9ydHMudXBkYXRlUmVmVG9zID0gZnVuY3Rpb24gKGVudGl0eVVpZCwgZmx1c2hBcmdzKSB7XG4gICAgdmFyIGl0ZW0gPSBjYWNoZVV0aWxfMS5nZXRJdGVtRmx1c2hPckNhY2hlZChlbnRpdHlVaWQsIGZsdXNoQXJncyk7XG4gICAgdXBkYXRlSXRlbVJlZlRvcyhpdGVtLCBmbHVzaEFyZ3MpO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3JlZi50cyIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIENhY2hlTWFwXzEgPSByZXF1aXJlKFwiLi9DYWNoZU1hcFwiKTtcbnZhciBjYWNoZV8xID0gcmVxdWlyZShcIi4vY2FjaGVcIik7XG52YXIgY2FjaGVVdGlsXzEgPSByZXF1aXJlKFwiLi9jYWNoZVV0aWxcIik7XG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbnZhciBmcmVlemVJdGVtID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICBPYmplY3QuZnJlZXplKGl0ZW0pO1xuICAgIE9iamVjdC5mcmVlemUoaXRlbS5lbnRpdHkpO1xuICAgIE9iamVjdC5mcmVlemUoaXRlbS5tYXBUbyk7XG4gICAgT2JqZWN0LmZyZWV6ZShpdGVtLm1hcEZyb20pO1xufTtcbmV4cG9ydHMuZmx1c2ggPSBmdW5jdGlvbiAodGVtcCwgaW5zdGFuY2UpIHtcbiAgICBpZiAodGVtcCAhPT0gbnVsbCkge1xuICAgICAgICBPYmplY3QuZnJlZXplKHRlbXApO1xuICAgICAgICB2YXIgY2FjaGVOb2RlID0gdXRpbF8xLmdldE5ld0NhY2hlTm9kZShpbnN0YW5jZSk7XG4gICAgICAgIGNhY2hlTm9kZS5pdGVtcyA9IHRlbXA7XG4gICAgICAgIGlmIChpbnN0YW5jZS50aHJlYWQubm9kZXMuaW5kZXhPZihjYWNoZU5vZGUuaWQpIDwgMCkge1xuICAgICAgICAgICAgaW5zdGFuY2UudGhyZWFkLm5vZGVzLnB1c2goY2FjaGVOb2RlLmlkKTtcbiAgICAgICAgICAgIGluc3RhbmNlLnRocmVhZC5jdXJyZW50ICs9IDE7XG4gICAgICAgIH1cbiAgICB9XG59O1xuZXhwb3J0cy5wcmVGbHVzaCA9IGZ1bmN0aW9uIChmbHVzaEFyZ3MsIGluc3RhbmNlKSB7XG4gICAgdmFyIHRlbXAgPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgdmFyIGN1cnJlbnRTdGFjayA9IGNhY2hlVXRpbF8xLmdldENhY2hlQ3VycmVudFN0YWNrKGluc3RhbmNlKTtcbiAgICBpZiAoY3VycmVudFN0YWNrKSB7XG4gICAgICAgIGN1cnJlbnRTdGFjay5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIGl0ZW0pIHtcbiAgICAgICAgICAgIHRlbXAuc2V0KGtleSwgaXRlbSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmbHVzaEFyZ3MuZmx1c2hNYXAuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgIHZhciBpdGVtVWlkID0gaXRlbS5lbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV07XG4gICAgICAgIGZyZWV6ZUl0ZW0oaXRlbSk7XG4gICAgICAgIHRlbXAuc2V0KFN0cmluZyhpdGVtVWlkKSwgaXRlbSk7XG4gICAgfSk7XG4gICAgaWYgKGZsdXNoQXJncy5ldmljdE1hcC5zaXplKCkgPiAwKSB7XG4gICAgICAgIGZsdXNoQXJncy5ldmljdE1hcC5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICB0ZW1wLmRlbGV0ZShTdHJpbmcoa2V5KSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBleHBvcnRzLmZsdXNoKHRlbXAsIGluc3RhbmNlKTtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9mbHVzaC50cyIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHJlZl8xID0gcmVxdWlyZShcIi4vcmVmXCIpO1xudmFyIGNhY2hlVXRpbF8xID0gcmVxdWlyZShcIi4vY2FjaGVVdGlsXCIpO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG52YXIgY2FjaGVfMSA9IHJlcXVpcmUoXCIuL2NhY2hlXCIpO1xuZXhwb3J0cy5wYXJzZSA9IGZ1bmN0aW9uIChlbnRpdHksIGZsdXNoQXJncykge1xuICAgIGlmICh1dGlsXzEuaGFzVWlkKGVudGl0eSkpIHtcbiAgICAgICAgaWYgKGNhY2hlVXRpbF8xLmlzT25DYWNoZShlbnRpdHksIGZsdXNoQXJncy5pbnN0YW5jZSkpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIF9hZGRUb0ZsdXNoTWFwKGVudGl0eSwgZmx1c2hBcmdzKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmICh1dGlsXzEuaXNBcnJheShlbnRpdHkpKSB7XG4gICAgICAgICAgICBwYXJzZUFycmF5KGVudGl0eSwgbnVsbCwgW10sIGZsdXNoQXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodXRpbF8xLmlzT2JqZWN0KGVudGl0eSkpIHtcbiAgICAgICAgICAgIHBhcnNlT2JqZWN0KGVudGl0eSwgbnVsbCwgW10sIGZsdXNoQXJncyk7XG4gICAgICAgIH1cbiAgICB9XG59O1xudmFyIF9hZGRUb0ZsdXNoTWFwID0gZnVuY3Rpb24gKGVudGl0eSwgZmx1c2hBcmdzKSB7XG4gICAgY2FjaGVVdGlsXzEuZW5zdXJlT25GbHVzaE1hcChlbnRpdHksIGZsdXNoQXJncyk7XG4gICAgcGFyc2VFbnRpdHkoZW50aXR5LCBlbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV0sIFtdLCBmbHVzaEFyZ3MpO1xuICAgIHJlZl8xLnVwZGF0ZVJlZlRvcyhTdHJpbmcoZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdKSwgZmx1c2hBcmdzKTtcbn07XG52YXIgY2FjaGVVaWRPYmogPSBmdW5jdGlvbiAoZW50aXR5LCBwYXJlbnRVaWQsIHBhdGgsIGZsdXNoQXJncykge1xuICAgIHZhciBpdGVtID0gY2FjaGVVdGlsXzEuZW5zdXJlSXRlbShlbnRpdHksIGZsdXNoQXJncyk7XG4gICAgaWYgKHBhcmVudFVpZCkge1xuICAgICAgICByZWZfMS5hc3NpZ25SZWZUb1BhcmVudChpdGVtLCBwYXJlbnRVaWQsIHBhdGgsIGZsdXNoQXJncyk7XG4gICAgfVxuICAgIGlmIChjYWNoZVV0aWxfMS5pc09uQ2FjaGUoZW50aXR5LCBmbHVzaEFyZ3MuaW5zdGFuY2UpXG4gICAgICAgIHx8IGNhY2hlVXRpbF8xLmlzT25GbHVzaE1hcChlbnRpdHksIGZsdXNoQXJncy5mbHVzaE1hcCkpXG4gICAgICAgIHJldHVybjtcbiAgICBleHBvcnRzLnBhcnNlKGVudGl0eSwgZmx1c2hBcmdzKTtcbn07XG52YXIgcGFyc2VPYmplY3QgPSBmdW5jdGlvbiAob2JqLCBwYXJlbnRVaWQsIHBhdGgsIGZsdXNoQXJncykge1xuICAgIGlmICh1dGlsXzEuaGFzVWlkKG9iaikpIHtcbiAgICAgICAgY2FjaGVVaWRPYmoob2JqLCBwYXJlbnRVaWQsIHBhdGgsIGZsdXNoQXJncyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBwYXJzZUVudGl0eShvYmosIHBhcmVudFVpZCwgcGF0aCwgZmx1c2hBcmdzKTtcbiAgICB9XG59O1xudmFyIHBhcnNlQXJyYXkgPSBmdW5jdGlvbiAoYXJyLCBwYXJlbnRVaWQsIHBhdGgsIGZsdXNoQXJncykge1xuICAgIGlmIChwYXRoID09PSB2b2lkIDApIHsgcGF0aCA9IFtdOyB9XG4gICAgYXJyLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgIGlmICh1dGlsXzEuaXNBcnJheShpdGVtKSkge1xuICAgICAgICAgICAgcGFyc2VBcnJheShpdGVtLCBwYXJlbnRVaWQsIHBhdGguY29uY2F0KFtpbmRleF0pLCBmbHVzaEFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHV0aWxfMS5pc09iamVjdChpdGVtKSkge1xuICAgICAgICAgICAgcGFyc2VPYmplY3QoaXRlbSwgcGFyZW50VWlkLCBwYXRoLmNvbmNhdChbaW5kZXhdKSwgZmx1c2hBcmdzKTtcbiAgICAgICAgfVxuICAgIH0pO1xufTtcbnZhciBwYXJzZUVudGl0eSA9IGZ1bmN0aW9uIChlbnRpdHksIHBhcmVudFVpZCwgcGF0aCwgZmx1c2hBcmdzKSB7XG4gICAgaWYgKHBhdGggPT09IHZvaWQgMCkgeyBwYXRoID0gW107IH1cbiAgICBmb3IgKHZhciBrZXkgaW4gZW50aXR5KSB7XG4gICAgICAgIGlmIChlbnRpdHkuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgdmFyIHJlZiA9IGVudGl0eVtrZXldO1xuICAgICAgICAgICAgaWYgKHV0aWxfMS5pc0FycmF5KHJlZikpIHtcbiAgICAgICAgICAgICAgICBwYXJzZUFycmF5KHJlZiwgcGFyZW50VWlkLCBwYXRoLmNvbmNhdChba2V5XSksIGZsdXNoQXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh1dGlsXzEuaXNPYmplY3QocmVmKSkge1xuICAgICAgICAgICAgICAgIHBhcnNlT2JqZWN0KHJlZiwgcGFyZW50VWlkLCBwYXRoLmNvbmNhdChba2V5XSksIGZsdXNoQXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBPYmplY3QuZnJlZXplKHJlZik7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcGFyc2UudHMiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBjYWNoZV8xID0gcmVxdWlyZShcIi4vY2FjaGVcIik7XG52YXIgc3RyaW5naWZ5TWFwID0gZnVuY3Rpb24gKG1hcCkge1xuICAgIHZhciByZXN1bHQgPSAnJztcbiAgICBtYXAuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgIHZhciBpdGVtUmVzdWx0ID0gSlNPTi5zdHJpbmdpZnkoaXRlbSwgbnVsbCwgMik7XG4gICAgICAgIHJlc3VsdCArPSBpdGVtUmVzdWx0ICsgJyxcXG4nO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG59O1xuZXhwb3J0cy5wcmludENhY2hlID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIGN1cnJlbnQgPSBpbnN0YW5jZS50aHJlYWQuY3VycmVudDtcbiAgICB2YXIgbm9kZUluZGljZXMgPSBpbnN0YW5jZS50aHJlYWQubm9kZXM7XG4gICAgbm9kZUluZGljZXMubWFwKGZ1bmN0aW9uIChjYWNoZU5vZGVJZCkge1xuICAgICAgICB2YXIgY2FjaGVOb2RlID0gaW5zdGFuY2UucmVwby5nZXQoY2FjaGVOb2RlSWQpO1xuICAgICAgICB2YXIgc3RyZWFtRGF0YSA9ICcnO1xuICAgICAgICB2YXIgc3RhdGUgPSBpbmRleCArIFwiOlwiICsgc3RyZWFtRGF0YSArIFwiW1wiICsgc3RyaW5naWZ5TWFwKGNhY2hlTm9kZS5pdGVtcykgKyBcIl1cXG5cXG5cIjtcbiAgICAgICAgaWYgKGluZGV4ID09PSBjdXJyZW50KSB7XG4gICAgICAgICAgICBzdGF0ZSA9ICctPiAnICsgc3RhdGU7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ICs9IHN0YXRlO1xuICAgICAgICBpbmRleCsrO1xuICAgIH0pO1xuICAgIHJlc3VsdCA9IHJlc3VsdC5zdWJzdHJpbmcoMCwgKHJlc3VsdC5sZW5ndGggLSAyKSk7XG4gICAgaW5kZXggPSAwO1xuICAgIHJldHVybiAnXFxuLS0tLS0tIE9uZSAtLS0tLS0tJ1xuICAgICAgICArICdcXG5TVEFDSzpcXG4nICsgcmVzdWx0XG4gICAgICAgICsgJ1xcblxcbkNPTkZJRzonICsgSlNPTi5zdHJpbmdpZnkoY2FjaGVfMS5jb25maWcsIG51bGwsIDIpXG4gICAgICAgICsgJ1xcblxcblJFUE8gU0laRTonICsgaW5zdGFuY2UucmVwby5sZW5ndGhcbiAgICAgICAgKyAnXFxuPT09PT09PT09PT09PT09PT09PVxcbic7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcHJpbnQudHMiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xudmFyIENhY2hlTWFwXzEgPSByZXF1aXJlKFwiLi9DYWNoZU1hcFwiKTtcbnZhciBsb2NhdGVfMSA9IHJlcXVpcmUoXCIuL2xvY2F0ZVwiKTtcbnZhciBwYXJzZV8xID0gcmVxdWlyZShcIi4vcGFyc2VcIik7XG52YXIgZmx1c2hfMSA9IHJlcXVpcmUoXCIuL2ZsdXNoXCIpO1xudmFyIHJlZl8xID0gcmVxdWlyZShcIi4vcmVmXCIpO1xuZXhwb3J0cy5wdXRJdGVtID0gZnVuY3Rpb24gKGVudGl0eSwgaW5zdGFuY2UpIHtcbiAgICBpZiAoKHV0aWxfMS5pc0FycmF5KGVudGl0eSkgfHwgdXRpbF8xLmlzT2JqZWN0KGVudGl0eSkpKSB7XG4gICAgICAgIHZhciBldmljdE1hcCA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICAgICAgdmFyIGZsdXNoTWFwID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgICAgICBmbHVzaE1hcFsnX19VUERBVEVEX18nXSA9IGZhbHNlO1xuICAgICAgICB2YXIgZmx1c2hBcmdzID0ge1xuICAgICAgICAgICAgZmx1c2hNYXA6IGZsdXNoTWFwLFxuICAgICAgICAgICAgZXZpY3RNYXA6IGV2aWN0TWFwLFxuICAgICAgICAgICAgaW5zdGFuY2U6IGluc3RhbmNlLFxuICAgICAgICB9O1xuICAgICAgICBwYXJzZV8xLnBhcnNlKGVudGl0eSwgZmx1c2hBcmdzKTtcbiAgICAgICAgcmVmXzEudXBkYXRlUG9pbnRlcnMoZmx1c2hBcmdzKTtcbiAgICAgICAgaWYgKGZsdXNoQXJncy5mbHVzaE1hcC5zaXplKCkgPiAwKSB7XG4gICAgICAgICAgICBmbHVzaF8xLnByZUZsdXNoKGZsdXNoQXJncywgaW5zdGFuY2UpO1xuICAgICAgICAgICAgcmV0dXJuIGxvY2F0ZV8xLmdldENhbGxTdGF0cyh0cnVlLCBpbnN0YW5jZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGxvY2F0ZV8xLmdldENhbGxTdGF0cyhmYWxzZSwgaW5zdGFuY2UpO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3B1dC50cyJdLCJzb3VyY2VSb290IjoiIn0=