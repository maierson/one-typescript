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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNWI1YWMwMjBlYmNhMGI1NDBlNmEiLCJ3ZWJwYWNrOi8vLy4vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vY2FjaGUudHMiLCJ3ZWJwYWNrOi8vLy4vQ2FjaGVJbnN0YW5jZS50cyIsIndlYnBhY2s6Ly8vLi9DYWNoZVJlcG8udHMiLCJ3ZWJwYWNrOi8vLy4vQ2FjaGVNYXAudHMiLCJ3ZWJwYWNrOi8vLy4vQ2FjaGVUaHJlYWQudHMiLCJ3ZWJwYWNrOi8vLy4vdXRpbC50cyIsIndlYnBhY2s6Ly8vLi9DYWNoZU5vZGUudHMiLCJ3ZWJwYWNrOi8vLy4vbG9jYXRlLnRzIiwid2VicGFjazovLy8uL2NvbmZpZy50cyIsIndlYnBhY2s6Ly8vLi9nZXQudHMiLCJ3ZWJwYWNrOi8vLy4vY2FjaGVVdGlsLnRzIiwid2VicGFjazovLy8uL0NhY2hlSXRlbS50cyIsIndlYnBhY2s6Ly8vLi9ldmljdC50cyIsIndlYnBhY2s6Ly8vLi9wYXRoLnRzIiwid2VicGFjazovLy8uL3JlZi50cyIsIndlYnBhY2s6Ly8vLi9mbHVzaC50cyIsIndlYnBhY2s6Ly8vLi9wYXJzZS50cyIsIndlYnBhY2s6Ly8vLi9wcmludC50cyIsIndlYnBhY2s6Ly8vLi9wdXQudHMiXSwibmFtZXMiOlsiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJleHBvcnRzIiwidmFsdWUiLCJjYWNoZV8xIiwicmVxdWlyZSIsImV2aWN0IiwiZ2V0IiwiZ2V0Q2FjaGUiLCJnZXRFZGl0IiwicHJpbnQiLCJwdXQiLCJyZXNldCIsInV1aWQiLCJ3aW5kb3ciLCJPbmUiLCJDYWNoZUluc3RhbmNlXzEiLCJ1dGlsXzEiLCJjb25maWdfMSIsImdldF8xIiwiZXZpY3RfMSIsImNhY2hlVXRpbF8xIiwicHJpbnRfMSIsInB1dF8xIiwiaW5zdGFuY2VzIiwiY2FjaGVUZXN0Iiwic2V0VGVzdGluZyIsInRlc3RpbmciLCJpbnN0YW5jZU5hbWUiLCJjb25maWd1cmF0aW9uIiwiZGVmYXVsdENvbmZpZyIsImNvbmZpZyIsImNvbmZpZ3VyZSIsImNyZWF0ZUNhY2hlIiwidW5kZWZpbmVkIiwiaXRlbSIsImVudGl0eSIsIm5vZGVJZCIsInVpZE9yRW50aXR5T3JBcnJheSIsImx1dCIsImkiLCJ0b1N0cmluZyIsImQwIiwiTWF0aCIsInJhbmRvbSIsImQxIiwiZDIiLCJkMyIsIm5hbWUiLCJpbnN0YW5jZSIsImRlZmF1bHQiLCJwdXRJdGVtIiwiZ2V0SXRlbSIsImdldEVkaXRJdGVtIiwiZXZpY3RJdGVtIiwic2l6ZSIsImNhY2hlU2l6ZSIsImxlbmd0aCIsImNhY2hlTGVuZ3RoIiwicHJpbnRDYWNoZSIsInJlc3VsdCIsInJlZlRvIiwidWlkIiwiZ2V0Q2FjaGVkSXRlbSIsIm1hcFRvIiwicmVmRnJvbSIsIm1hcEZyb20iLCJDYWNoZVJlcG9fMSIsIkNhY2hlVGhyZWFkXzEiLCJDYWNoZUluc3RhbmNlIiwiX3RoaXMiLCJyZXBvIiwidGhyZWFkIiwibmV4dE5vZGVLZXkiLCJhZGROb2RlIiwibm9kZSIsImFkZCIsImlkIiwibm9kZXMiLCJDYWNoZU1hcF8xIiwiQ2FjaGVSZXBvIiwiaXRlbXMiLCJoYXMiLCJzZXQiLCJkZWxldGUiLCJfX2Fzc2lnbiIsImFzc2lnbiIsInQiLCJzIiwibiIsImFyZ3VtZW50cyIsInAiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJDYWNoZU1hcCIsInBhdGhzIiwia2V5IiwidmFsIiwiZm9yRWFjaCIsImNhbGxiYWNrIiwiY2xvbmUiLCJDYWNoZVRocmVhZCIsImN1cnJlbnQiLCJwdXNoIiwiQ2FjaGVOb2RlXzEiLCJsb2NhdGVfMSIsIl9oYXNPd25Qcm9wZXJ0eSIsImlzTnVtYmVyIiwiaXNTdHJpbmciLCJvYmoiLCJpc09iamVjdCIsIm1peGVkVmFyIiwiaXNGdW5jdGlvbiIsImlzQXJyYXkiLCJBcnJheSIsInNwbGljZSIsInByb3BlcnR5SXNFbnVtZXJhYmxlIiwib2JqVG9TdHIiLCJvIiwiaXNEYXRlIiwiaXNFbXB0eSIsImdldE5ld0NhY2hlTm9kZSIsIkNhY2hlTm9kZSIsImhhc1VpZCIsInVpZE5hbWUiLCJGdW5jdGlvbiIsInRhcmdldCIsIlNUUklQX0NPTU1FTlRTIiwiQVJHVU1FTlRfTkFNRVMiLCJnZXRQYXJhbU5hbWVzIiwiZnVuYyIsImZuU3RyIiwicmVwbGFjZSIsInNsaWNlIiwiaW5kZXhPZiIsIm1hdGNoIiwic3RyaW5naWZ5IiwiUmVnRXhwIiwiYm9keSIsInRyaW0iLCJwYXJhbU5hbWVzIiwiYmluZCIsImRlZXBDbG9uZSIsInVpZFJlZmVyZW5jZSIsImZyZWV6ZSIsImlzRnJvemVuIiwicHJvcE5hbWUiLCJkZWVwQ2xvbmVBcnJheSIsImRhdGUiLCJEYXRlIiwiZ2V0VGltZSIsImFyciIsIm1hcCIsImNhY2hlTm9kZSIsImdldEN1cnJlbnROb2RlIiwiZ2V0Q2FsbFN0YXRzIiwic3VjY2VzcyIsImN1cnJlbnROb2RlIiwiVHlwZUVycm9yIiwiZ2V0UmVwb05vZGUiLCJiaW5hcnlJbmRleE9mIiwiY3VycmVudE5vZGVJZCIsImNhY2hlTm9kZUlkIiwiYXJyYXkiLCJzZWFyY2hFbGVtZW50IiwibWluSW5kZXgiLCJtYXhJbmRleCIsImN1cnJlbnRJbmRleCIsImN1cnJlbnRFbGVtZW50IiwibWF4SGlzdG9yeVN0YXRlcyIsImNvbmYiLCJnZXRBY3R1YWxVaWQiLCJ1aWRPckVudGl0eSIsIlN0cmluZyIsImdldE9iamVjdCIsInJlYWxVaWQiLCJmaWx0ZXIiLCJnZXRFZGl0YWJsZU9iamVjdCIsImV4aXN0aW5nIiwiQ2FjaGVJdGVtXzEiLCJpc09uQ2FjaGUiLCJjYWNoZWRJdGVtIiwiaXNPbkZsdXNoTWFwIiwiZmx1c2hNYXAiLCJnZXRJdGVtRmx1c2hPckNhY2hlZCIsImZsdXNoQXJncyIsImdldENhY2hlQ3VycmVudFN0YWNrIiwiZW5zdXJlSXRlbSIsIml0ZW1VaWQiLCJsaXZlIiwiZW5zdXJlT25GbHVzaE1hcCIsImVudGl0eVVpZCIsIkNhY2hlSXRlbSIsImxpdmVJdGVtIiwib3BhdGgiLCJyZWZfMSIsImZsdXNoXzEiLCJwYXJzZV8xIiwiYnVpbGRFdmljdFVpZEFycmF5IiwidWlkQXJyYXkiLCJjdXJyZW50U3RhdGUiLCJmb3VuZCIsInNvbWUiLCJ0ZW1wU3RhdGUiLCJldmljdE1hcCIsInBhcmVudHNDaGFuZ2VkIiwiY2xlYXJUYXJnZXRSZWZGcm9tcyIsImNsZWFyUGFyZW50UmVmVG9zIiwicHV0UGFyZW50c0NoYW5nZWQiLCJmbHVzaCIsImZsdXNoQXJnc18xIiwicGFyc2UiLCJ1cGRhdGVSZWZGcm9tcyIsImNsZWFyUmVmRnJvbSIsInJlZkl0ZW0iLCJwYXJlbnRVaWQiLCJyZWZzQXJyYXkiLCJjbGVhclJlZlRvIiwicGFyZW50SXRlbSIsInJlZlVpZCIsInBhcmVudCIsInJlZlBhdGhzIiwicGF0aCIsImRlbCIsInRvVWlkIiwiZ2V0S2V5IiwiaW50S2V5IiwicGFyc2VJbnQiLCJzcGxpdCIsImN1cnJlbnRQYXRoIiwib2xkVmFsIiwiZGVmYXVsdFZhbHVlIiwiYWRkUmVmVG8iLCJyZWZBcnJheSIsImFkZFJlZkZyb20iLCJmcm9tQXJyYXkiLCJhc3NpZ25SZWZzIiwicmVmUGF0aCIsImpvaW4iLCJhc3NpZ25SZWZUb1BhcmVudCIsImZpcnN0UGF0aCIsInRhcmdldFJlZiIsImFyZ3MiLCJyZW1vdmVSZWZGcm9tIiwiaW5kZXgiLCJyZW1vdmVSZWZGcm9tVmFsdWUiLCJ1cGRhdGVJdGVtUmVmVG9zIiwidXBkYXRlZFBhdGhzIiwicmVmZXJlbmNlIiwiaGFzUmVmIiwidXBkYXRlUG9pbnRlcnMiLCJ1cGRhdGVSZWZUb3MiLCJmcmVlemVJdGVtIiwidGVtcCIsInByZUZsdXNoIiwiY3VycmVudFN0YWNrIiwiX2FkZFRvRmx1c2hNYXAiLCJwYXJzZUFycmF5IiwicGFyc2VPYmplY3QiLCJwYXJzZUVudGl0eSIsImNhY2hlVWlkT2JqIiwiY29uY2F0IiwicmVmIiwic3RyaW5naWZ5TWFwIiwiaXRlbVJlc3VsdCIsIkpTT04iLCJub2RlSW5kaWNlcyIsInN0cmVhbURhdGEiLCJzdGF0ZSIs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Q0FBUixDQUFmO0FBQ0EsS0FBSWlNLFVBQVUsbUJBQUFqTSxDQUFRLEVBQVIsQ0FBZDtBQUNBLEtBQUlnTSxVQUFVLG1CQUFBaE0sQ0FBUSxFQUFSLENBQWQ7QUFDQSxLQUFJK0wsUUFBUSxtQkFBQS9MLENBQVEsRUFBUixDQUFaO0FBQ0FILFNBQVFpRCxPQUFSLEdBQWtCLFVBQVVmLE1BQVYsRUFBa0JhLFFBQWxCLEVBQTRCO0FBQzFDLFNBQUtoQyxPQUFPaUcsT0FBUCxDQUFlOUUsTUFBZixLQUEwQm5CLE9BQU84RixRQUFQLENBQWdCM0UsTUFBaEIsQ0FBL0IsRUFBeUQ7QUFDckQsYUFBSXlLLFdBQVcsSUFBSTlILFdBQVc3QixPQUFmLEVBQWY7QUFDQSxhQUFJc0ksV0FBVyxJQUFJekcsV0FBVzdCLE9BQWYsRUFBZjtBQUNBc0ksa0JBQVMsYUFBVCxJQUEwQixLQUExQjtBQUNBLGFBQUlFLFlBQVk7QUFDWkYsdUJBQVVBLFFBREU7QUFFWnFCLHVCQUFVQSxRQUZFO0FBR1o1Six1QkFBVUE7QUFIRSxVQUFoQjtBQUtBcUosaUJBQVFjLEtBQVIsQ0FBY2hMLE1BQWQsRUFBc0JzSixTQUF0QjtBQUNBVSxlQUFNdUQsY0FBTixDQUFxQmpFLFNBQXJCO0FBQ0EsYUFBSUEsVUFBVUYsUUFBVixDQUFtQmpJLElBQW5CLEtBQTRCLENBQWhDLEVBQW1DO0FBQy9COEkscUJBQVEwRCxRQUFSLENBQWlCckUsU0FBakIsRUFBNEJ6SSxRQUE1QjtBQUNBLG9CQUFPeUQsU0FBU2tELFlBQVQsQ0FBc0IsSUFBdEIsRUFBNEIzRyxRQUE1QixDQUFQO0FBQ0g7QUFDSjtBQUNELFlBQU95RCxTQUFTa0QsWUFBVCxDQUFzQixLQUF0QixFQUE2QjNHLFFBQTdCLENBQVA7QUFDSCxFQWxCRCxDIiwiZmlsZSI6Im9uZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDViNWFjMDIwZWJjYTBiNTQwZTZhIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgY2FjaGVfMSA9IHJlcXVpcmUoXCIuL2NhY2hlXCIpO1xuZXhwb3J0cy5ldmljdCA9IGNhY2hlXzEuZXZpY3Q7XG5leHBvcnRzLmdldCA9IGNhY2hlXzEuZ2V0O1xuZXhwb3J0cy5nZXRDYWNoZSA9IGNhY2hlXzEuZ2V0Q2FjaGU7XG5leHBvcnRzLmdldEVkaXQgPSBjYWNoZV8xLmdldEVkaXQ7XG5leHBvcnRzLnByaW50ID0gY2FjaGVfMS5wcmludDtcbmV4cG9ydHMucHV0ID0gY2FjaGVfMS5wdXQ7XG5leHBvcnRzLnJlc2V0ID0gY2FjaGVfMS5yZXNldDtcbmV4cG9ydHMudXVpZCA9IGNhY2hlXzEudXVpZDtcbihmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdyAhPT0gbnVsbCkge1xuICAgICAgICB3aW5kb3cuT25lID0ge1xuICAgICAgICAgICAgZ2V0Q2FjaGU6IGNhY2hlXzEuZ2V0Q2FjaGUsXG4gICAgICAgICAgICBwdXQ6IGNhY2hlXzEucHV0LFxuICAgICAgICAgICAgZ2V0OiBjYWNoZV8xLmdldCxcbiAgICAgICAgICAgIGdldEVkaXQ6IGNhY2hlXzEuZ2V0RWRpdCxcbiAgICAgICAgICAgIGV2aWN0OiBjYWNoZV8xLmV2aWN0LFxuICAgICAgICAgICAgcmVzZXQ6IGNhY2hlXzEucmVzZXQsXG4gICAgICAgICAgICB1dWlkOiBjYWNoZV8xLnV1aWQsXG4gICAgICAgICAgICBwcmludDogY2FjaGVfMS5wcmludCxcbiAgICAgICAgfTtcbiAgICB9XG59KSgpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vaW5kZXgudHMiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBDYWNoZUluc3RhbmNlXzEgPSByZXF1aXJlKFwiLi9DYWNoZUluc3RhbmNlXCIpO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG52YXIgY29uZmlnXzEgPSByZXF1aXJlKFwiLi9jb25maWdcIik7XG52YXIgZ2V0XzEgPSByZXF1aXJlKFwiLi9nZXRcIik7XG52YXIgZXZpY3RfMSA9IHJlcXVpcmUoXCIuL2V2aWN0XCIpO1xudmFyIGNhY2hlVXRpbF8xID0gcmVxdWlyZShcIi4vY2FjaGVVdGlsXCIpO1xudmFyIHByaW50XzEgPSByZXF1aXJlKFwiLi9wcmludFwiKTtcbnZhciBwdXRfMSA9IHJlcXVpcmUoXCIuL3B1dFwiKTtcbmV4cG9ydHMuaW5zdGFuY2VzID0ge307XG52YXIgY2FjaGVUZXN0ID0gZmFsc2U7XG5mdW5jdGlvbiBzZXRUZXN0aW5nKHRlc3RpbmcpIHtcbiAgICBjYWNoZVRlc3QgPSB0ZXN0aW5nO1xufVxuZXhwb3J0cy5zZXRUZXN0aW5nID0gc2V0VGVzdGluZztcbmZ1bmN0aW9uIGdldENhY2hlKGluc3RhbmNlTmFtZSwgY29uZmlndXJhdGlvbikge1xuICAgIGlmIChpbnN0YW5jZU5hbWUgPT09IHZvaWQgMCkgeyBpbnN0YW5jZU5hbWUgPSAnb25lJzsgfVxuICAgIGlmIChjb25maWd1cmF0aW9uID09PSB2b2lkIDApIHsgY29uZmlndXJhdGlvbiA9IGNvbmZpZ18xLmRlZmF1bHRDb25maWc7IH1cbiAgICBpZiAoIWV4cG9ydHMuY29uZmlnKSB7XG4gICAgICAgIGV4cG9ydHMuY29uZmlnID0gY29uZmlnXzEuY29uZmlndXJlKGNvbmZpZ3VyYXRpb24pO1xuICAgIH1cbiAgICBpZiAoIWV4cG9ydHMuaW5zdGFuY2VzW2luc3RhbmNlTmFtZV0pIHtcbiAgICAgICAgZXhwb3J0cy5pbnN0YW5jZXNbaW5zdGFuY2VOYW1lXSA9IGNyZWF0ZUNhY2hlKGluc3RhbmNlTmFtZSk7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICAmJiB3aW5kb3cgIT09IG51bGxcbiAgICAgICAgJiYgd2luZG93W2luc3RhbmNlTmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB3aW5kb3dbaW5zdGFuY2VOYW1lXSA9IGV4cG9ydHMuaW5zdGFuY2VzW2luc3RhbmNlTmFtZV07XG4gICAgfVxuICAgIHJldHVybiBleHBvcnRzLmluc3RhbmNlc1tpbnN0YW5jZU5hbWVdO1xufVxuZXhwb3J0cy5nZXRDYWNoZSA9IGdldENhY2hlO1xuZXhwb3J0cy5wdXQgPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgIGdldENhY2hlKCkucHV0KGl0ZW0pO1xufTtcbmV4cG9ydHMuZ2V0ID0gZnVuY3Rpb24gKGVudGl0eSwgbm9kZUlkKSB7IHJldHVybiAoZ2V0Q2FjaGUoKS5nZXQoZW50aXR5LCBub2RlSWQpKTsgfTtcbmV4cG9ydHMuZ2V0RWRpdCA9IGZ1bmN0aW9uICh1aWRPckVudGl0eU9yQXJyYXksIG5vZGVJZCkgeyByZXR1cm4gKGdldENhY2hlKCkuZ2V0RWRpdCh1aWRPckVudGl0eU9yQXJyYXksIG5vZGVJZCkpOyB9O1xuZXhwb3J0cy5ldmljdCA9IGZ1bmN0aW9uICh1aWRPckVudGl0eU9yQXJyYXkpIHsgcmV0dXJuIChnZXRDYWNoZSgpLmV2aWN0KHVpZE9yRW50aXR5T3JBcnJheSkpOyB9O1xuZXhwb3J0cy5wcmludCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGdldENhY2hlKCkucHJpbnQoKTsgfTtcbmV4cG9ydHMucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgZ2V0Q2FjaGUoKS5yZXNldCgpO1xufTtcbmV4cG9ydHMudXVpZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbHV0ID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAyNTY7IGkrKykge1xuICAgICAgICBsdXRbaV0gPSAoaSA8IDE2ID8gJzAnIDogJycpICsgKGkpLnRvU3RyaW5nKDE2KTtcbiAgICB9XG4gICAgdmFyIGQwID0gTWF0aC5yYW5kb20oKSAqIDB4MTAwMDAwMDAwIHwgMDtcbiAgICB2YXIgZDEgPSBNYXRoLnJhbmRvbSgpICogMHgxMDAwMDAwMDAgfCAwO1xuICAgIHZhciBkMiA9IE1hdGgucmFuZG9tKCkgKiAweDEwMDAwMDAwMCB8IDA7XG4gICAgdmFyIGQzID0gTWF0aC5yYW5kb20oKSAqIDB4MTAwMDAwMDAwIHwgMDtcbiAgICByZXR1cm4gbHV0W2QwICYgMHhGRl0gKyBsdXRbZDAgPj4gOCAmIDB4RkZdICsgbHV0W2QwID4+IDE2ICYgMHhGRl1cbiAgICAgICAgKyBsdXRbZDAgPj4gMjQgJiAweEZGXSArICctJyArIGx1dFtkMSAmIDB4RkZdXG4gICAgICAgICsgbHV0W2QxID4+IDggJiAweEZGXSArICctJyArIGx1dFtkMSA+PiAxNiAmIDB4MGYgfCAweDQwXVxuICAgICAgICArIGx1dFtkMSA+PiAyNCAmIDB4RkZdICsgJy0nICsgbHV0W2QyICYgMHgzZiB8IDB4ODBdXG4gICAgICAgICsgbHV0W2QyID4+IDggJiAweEZGXSArICctJyArIGx1dFtkMiA+PiAxNiAmIDB4RkZdXG4gICAgICAgICsgbHV0W2QyID4+IDI0ICYgMHhGRl0gKyBsdXRbZDMgJiAweEZGXSArIGx1dFtkMyA+PiA4ICYgMHhGRl1cbiAgICAgICAgKyBsdXRbZDMgPj4gMTYgJiAweEZGXSArIGx1dFtkMyA+PiAyNCAmIDB4RkZdO1xufTtcbmZ1bmN0aW9uIGNyZWF0ZUNhY2hlKG5hbWUpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSBuZXcgQ2FjaGVJbnN0YW5jZV8xLmRlZmF1bHQobmFtZSk7XG4gICAgdmFyIHJlc2V0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gaW5zdGFuY2UucmVzZXQoKTsgfTtcbiAgICB2YXIgcHV0ID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIHB1dF8xLnB1dEl0ZW0oaXRlbSwgaW5zdGFuY2UpO1xuICAgIH07XG4gICAgdmFyIGdldCA9IGZ1bmN0aW9uIChlbnRpdHksIG5vZGVJZCkgeyByZXR1cm4gKGdldF8xLmdldEl0ZW0oZW50aXR5LCBpbnN0YW5jZSwgbm9kZUlkKSk7IH07XG4gICAgdmFyIGdldEVkaXQgPSBmdW5jdGlvbiAodWlkT3JFbnRpdHlPckFycmF5LCBub2RlSWQpIHsgcmV0dXJuIChnZXRfMS5nZXRFZGl0SXRlbSh1aWRPckVudGl0eU9yQXJyYXksIGluc3RhbmNlLCBub2RlSWQpKTsgfTtcbiAgICB2YXIgZXZpY3QgPSBmdW5jdGlvbiAodWlkT3JFbnRpdHlPckFycmF5KSB7IHJldHVybiAoZXZpY3RfMS5ldmljdEl0ZW0odWlkT3JFbnRpdHlPckFycmF5LCBpbnN0YW5jZSkpOyB9O1xuICAgIHZhciBzaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdXRpbF8xLmNhY2hlU2l6ZShpbnN0YW5jZSk7XG4gICAgfTtcbiAgICB2YXIgbGVuZ3RoID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdXRpbF8xLmNhY2hlTGVuZ3RoKGluc3RhbmNlKTsgfTtcbiAgICB2YXIgcHJpbnQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBwcmludF8xLnByaW50Q2FjaGUoaW5zdGFuY2UpOyB9O1xuICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgIHB1dDogcHV0LFxuICAgICAgICBnZXQ6IGdldCxcbiAgICAgICAgZ2V0RWRpdDogZ2V0RWRpdCxcbiAgICAgICAgZXZpY3Q6IGV2aWN0LFxuICAgICAgICByZXNldDogcmVzZXQsXG4gICAgICAgIHNpemU6IHNpemUsXG4gICAgICAgIGxlbmd0aDogbGVuZ3RoLFxuICAgICAgICBwcmludDogcHJpbnQsXG4gICAgfTtcbiAgICBpZiAoY2FjaGVUZXN0ID09PSB0cnVlKSB7XG4gICAgICAgIHJlc3VsdC5yZWZUbyA9IGZ1bmN0aW9uICh1aWQpIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gY2FjaGVVdGlsXzEuZ2V0Q2FjaGVkSXRlbSh1aWQsIGluc3RhbmNlKTtcbiAgICAgICAgICAgIHJldHVybiBpdGVtLm1hcFRvO1xuICAgICAgICB9O1xuICAgICAgICByZXN1bHQucmVmRnJvbSA9IGZ1bmN0aW9uICh1aWQpIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gY2FjaGVVdGlsXzEuZ2V0Q2FjaGVkSXRlbSh1aWQsIGluc3RhbmNlKTtcbiAgICAgICAgICAgIHJldHVybiBpdGVtLm1hcEZyb207XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9jYWNoZS50cyIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIENhY2hlUmVwb18xID0gcmVxdWlyZShcIi4vQ2FjaGVSZXBvXCIpO1xudmFyIENhY2hlVGhyZWFkXzEgPSByZXF1aXJlKFwiLi9DYWNoZVRocmVhZFwiKTtcbnZhciBDYWNoZUluc3RhbmNlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDYWNoZUluc3RhbmNlKG5hbWUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5yZXBvID0gbmV3IENhY2hlUmVwb18xLmRlZmF1bHQoKTtcbiAgICAgICAgdGhpcy50aHJlYWQgPSBuZXcgQ2FjaGVUaHJlYWRfMS5kZWZhdWx0KCk7XG4gICAgICAgIHRoaXMubmV4dE5vZGVLZXkgPSAwO1xuICAgICAgICB0aGlzLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMucmVwbyA9IG5ldyBDYWNoZVJlcG9fMS5kZWZhdWx0KCk7XG4gICAgICAgICAgICBfdGhpcy50aHJlYWQgPSBuZXcgQ2FjaGVUaHJlYWRfMS5kZWZhdWx0KCk7XG4gICAgICAgICAgICBfdGhpcy5uZXh0Tm9kZUtleSA9IDA7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYWRkTm9kZSA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMucmVwby5hZGQobm9kZSkpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy50aHJlYWQuYWRkTm9kZShub2RlLmlkKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5uZXh0Tm9kZUtleSsrO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmxlbmd0aCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLnRocmVhZC5ub2Rlcy5sZW5ndGg7IH07XG4gICAgICAgIHRoaXMuc2l6ZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLnJlcG8ubGVuZ3RoOyB9O1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIH1cbiAgICByZXR1cm4gQ2FjaGVJbnN0YW5jZTtcbn0oKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDYWNoZUluc3RhbmNlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2FjaGVJbnN0YW5jZS50cyIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIENhY2hlTWFwXzEgPSByZXF1aXJlKFwiLi9DYWNoZU1hcFwiKTtcbnZhciBDYWNoZVJlcG8gPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENhY2hlUmVwbygpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5pdGVtcyA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLmdldCA9IGZ1bmN0aW9uIChub2RlSWQpIHsgcmV0dXJuIChfdGhpcy5pdGVtcy5nZXQobm9kZUlkKSk7IH07XG4gICAgICAgIHRoaXMuYWRkID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIGlmICghX3RoaXMuaXRlbXMuaGFzKG5vZGUuaWQpKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuaXRlbXMuc2V0KG5vZGUuaWQsIG5vZGUpO1xuICAgICAgICAgICAgICAgIF90aGlzLmxlbmd0aCsrO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmRlbGV0ZSA9IGZ1bmN0aW9uIChub2RlSWQpIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5pdGVtcy5oYXMobm9kZUlkKSkge1xuICAgICAgICAgICAgICAgIF90aGlzLml0ZW1zLmRlbGV0ZShub2RlSWQpO1xuICAgICAgICAgICAgICAgIF90aGlzLmxlbmd0aC0tO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gQ2FjaGVSZXBvO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IENhY2hlUmVwbztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NhY2hlUmVwby50cyIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XG4gICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgIH1cbiAgICByZXR1cm4gdDtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgQ2FjaGVNYXAgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENhY2hlTWFwKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLnBhdGhzID0ge307XG4gICAgICAgIHRoaXMubGVuZ3RoID0gMDtcbiAgICAgICAgdGhpcy5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMucGF0aHNba2V5XTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5kZWxldGUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIF90aGlzLnBhdGhzW2tleV0gIT09ICd1bmRlZmluZWQnICYmIF90aGlzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsID0gX3RoaXMucGF0aHNba2V5XTtcbiAgICAgICAgICAgICAgICBkZWxldGUgX3RoaXMucGF0aHNba2V5XTtcbiAgICAgICAgICAgICAgICBfdGhpcy5sZW5ndGgtLTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmhhcyA9IGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIHR5cGVvZiBfdGhpcy5wYXRoc1trZXldICE9PSAndW5kZWZpbmVkJzsgfTtcbiAgICAgICAgdGhpcy5mb3JFYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gX3RoaXMucGF0aHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMucGF0aHMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhrZXksIF90aGlzLnBhdGhzW2tleV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjbG9uZSA9IG5ldyBDYWNoZU1hcCgpO1xuICAgICAgICAgICAgY2xvbmUucGF0aHMgPSBfX2Fzc2lnbih7fSwgX3RoaXMucGF0aHMpO1xuICAgICAgICAgICAgY2xvbmUubGVuZ3RoID0gX3RoaXMubGVuZ3RoO1xuICAgICAgICAgICAgcmV0dXJuIGNsb25lO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBDYWNoZU1hcC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnBhdGhzW2tleV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMubGVuZ3RoKys7XG4gICAgICAgICAgICB0aGlzLnBhdGhzW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGF0aHNba2V5XSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICBDYWNoZU1hcC5wcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGVuZ3RoO1xuICAgIH07XG4gICAgcmV0dXJuIENhY2hlTWFwO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IENhY2hlTWFwO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2FjaGVNYXAudHMiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBDYWNoZVRocmVhZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2FjaGVUaHJlYWQoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuY3VycmVudCA9IC0xO1xuICAgICAgICB0aGlzLm5vZGVzID0gW107XG4gICAgICAgIHRoaXMuYWRkTm9kZSA9IGZ1bmN0aW9uIChub2RlSWQpIHtcbiAgICAgICAgICAgIF90aGlzLm5vZGVzLnB1c2gobm9kZUlkKTtcbiAgICAgICAgICAgIF90aGlzLmN1cnJlbnQrKztcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIENhY2hlVGhyZWFkO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IENhY2hlVGhyZWFkO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2FjaGVUaHJlYWQudHMiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICB9XG4gICAgcmV0dXJuIHQ7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIENhY2hlTm9kZV8xID0gcmVxdWlyZShcIi4vQ2FjaGVOb2RlXCIpO1xudmFyIGNhY2hlXzEgPSByZXF1aXJlKFwiLi9jYWNoZVwiKTtcbnZhciBsb2NhdGVfMSA9IHJlcXVpcmUoXCIuL2xvY2F0ZVwiKTtcbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG52YXIgX2hhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbmZ1bmN0aW9uIGlzTnVtYmVyKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgfHwgdG9TdHJpbmcodmFsdWUpID09PSBcIltvYmplY3QgTnVtYmVyXVwiO1xufVxuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xuZnVuY3Rpb24gaXNTdHJpbmcob2JqKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdzdHJpbmcnIHx8IHRvU3RyaW5nKG9iaikgPT09IFwiW29iamVjdCBTdHJpbmddXCI7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5mdW5jdGlvbiBpc09iamVjdChtaXhlZFZhcikge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobWl4ZWRWYXIpID09PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIG1peGVkVmFyICE9PSBudWxsICYmIHR5cGVvZiBtaXhlZFZhciA9PT0gJ29iamVjdCc7XG59XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGl0ZW0pIHtcbiAgICByZXR1cm4gdHlwZW9mIGl0ZW0gPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuZnVuY3Rpb24gaXNBcnJheSh2YWx1ZSkge1xuICAgIGlmICghdmFsdWUgfHwgdmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWx1ZSkgfHwgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCdcbiAgICAgICAgJiYgdHlwZW9mIHZhbHVlLmxlbmd0aCA9PT0gJ251bWJlcidcbiAgICAgICAgJiYgdHlwZW9mIHZhbHVlLnNwbGljZSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICAmJiAhKHZhbHVlLnByb3BlcnR5SXNFbnVtZXJhYmxlKCdsZW5ndGgnKSkpO1xufVxuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcbmZ1bmN0aW9uIG9ialRvU3RyKG8pIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pO1xufVxuZnVuY3Rpb24gaXNEYXRlKHZhbHVlKSB7XG4gICAgcmV0dXJuIGlzT2JqZWN0KHZhbHVlKSAmJiBvYmpUb1N0cih2YWx1ZSkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xuZnVuY3Rpb24gaXNFbXB0eSh2YWx1ZSkge1xuICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChpc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2UgaWYgKCFpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKF9oYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuZXhwb3J0cy5pc0VtcHR5ID0gaXNFbXB0eTtcbmZ1bmN0aW9uIGdldE5ld0NhY2hlTm9kZShpbnN0YW5jZSkge1xuICAgIHZhciBub2RlID0gbmV3IENhY2hlTm9kZV8xLkNhY2hlTm9kZShpbnN0YW5jZS5uZXh0Tm9kZUtleSk7XG4gICAgbm9kZS5pZCA9IGluc3RhbmNlLm5leHROb2RlS2V5O1xuICAgIGluc3RhbmNlLm5leHROb2RlS2V5ICs9IDE7XG4gICAgaW5zdGFuY2UucmVwby5hZGQobm9kZSk7XG4gICAgcmV0dXJuIG5vZGU7XG59XG5leHBvcnRzLmdldE5ld0NhY2hlTm9kZSA9IGdldE5ld0NhY2hlTm9kZTtcbmZ1bmN0aW9uIGhhc1VpZChvYmopIHtcbiAgICBpZiAoIW9iaikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICghaXNPYmplY3Qob2JqKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb2JqW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIHVpZCA9IG9ialtjYWNoZV8xLmNvbmZpZy51aWROYW1lXTtcbiAgICByZXR1cm4gdWlkLmxlbmd0aCAhPT0gMDtcbn1cbmV4cG9ydHMuaGFzVWlkID0gaGFzVWlkO1xuRnVuY3Rpb24ucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIHZhciBTVFJJUF9DT01NRU5UUyA9IC8oKFxcL1xcLy4qJCl8KFxcL1xcKltcXHNcXFNdKj9cXCpcXC8pKS9tZztcbiAgICB2YXIgQVJHVU1FTlRfTkFNRVMgPSAvKFteXFxzLF0rKS9nO1xuICAgIGZ1bmN0aW9uIGdldFBhcmFtTmFtZXMoZnVuYykge1xuICAgICAgICB2YXIgZm5TdHIgPSBmdW5jLnRvU3RyaW5nKCkucmVwbGFjZShTVFJJUF9DT01NRU5UUywgJycpO1xuICAgICAgICB2YXIgcmVzdWx0ID0gZm5TdHIuc2xpY2UoZm5TdHIuaW5kZXhPZignKCcpICsgMSwgZm5TdHIuaW5kZXhPZignKScpKS5tYXRjaChBUkdVTUVOVF9OQU1FUyk7XG4gICAgICAgIGlmIChyZXN1bHQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIHZhciBzdHJpbmdpZnkgPSB0aGlzLnRvU3RyaW5nKCk7XG4gICAgc3RyaW5naWZ5ID0gc3RyaW5naWZ5LnJlcGxhY2UobmV3IFJlZ0V4cCgnX3RoaXMnLCAnZycpLCAndGhpcycpO1xuICAgIHZhciBib2R5ID0gc3RyaW5naWZ5Lm1hdGNoKC9mdW5jdGlvbltee10rXFx7KFtcXHNcXFNdKilcXH0kLylbMV07XG4gICAgYm9keSA9IGJvZHkudHJpbSgpO1xuICAgIHZhciBwYXJhbU5hbWVzID0gZ2V0UGFyYW1OYW1lcyh0aGlzKTtcbiAgICB2YXIgZnVuYztcbiAgICBpZiAoYm9keS5pbmRleE9mKCduYXRpdmUgY29kZScpIDwgMCkge1xuICAgICAgICBmdW5jID0gRnVuY3Rpb24ocGFyYW1OYW1lcywgYm9keSk7XG4gICAgICAgIGZ1bmMgPSBmdW5jLmJpbmQodGFyZ2V0KTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmM7XG59O1xuZnVuY3Rpb24gZGVlcENsb25lKG9iaiwgdWlkUmVmZXJlbmNlLCBmcmVlemUpIHtcbiAgICBpZiAoZnJlZXplID09PSB2b2lkIDApIHsgZnJlZXplID0gdHJ1ZTsgfVxuICAgIGlmICghb2JqXG4gICAgICAgIHx8ICghaXNPYmplY3Qob2JqKVxuICAgICAgICAgICAgJiYgIWlzQXJyYXkob2JqKSkpIHtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgaWYgKGZyZWV6ZSA9PT0gdHJ1ZVxuICAgICAgICAmJiB1aWRSZWZlcmVuY2VcbiAgICAgICAgJiYgIU9iamVjdC5pc0Zyb3plbih1aWRSZWZlcmVuY2UpKSB7XG4gICAgICAgIE9iamVjdC5mcmVlemUodWlkUmVmZXJlbmNlKTtcbiAgICB9XG4gICAgaWYgKHVpZFJlZmVyZW5jZVxuICAgICAgICAmJiBoYXNVaWQob2JqKVxuICAgICAgICAmJiBvYmpbY2FjaGVfMS5jb25maWcudWlkTmFtZV0gPT09IHVpZFJlZmVyZW5jZVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSkge1xuICAgICAgICByZXR1cm4gdWlkUmVmZXJlbmNlO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gX19hc3NpZ24oe30sIG9iaik7XG4gICAgZm9yICh2YXIgcHJvcE5hbWUgaW4gb2JqKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IG9ialtwcm9wTmFtZV07XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W3Byb3BOYW1lXSA9IGRlZXBDbG9uZUFycmF5KHZhbHVlLCB1aWRSZWZlcmVuY2UsIGZyZWV6ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh2YWx1ZS5nZXRUaW1lKCkpO1xuICAgICAgICAgICAgICAgIGlmIChmcmVlemUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmZyZWV6ZShkYXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzdWx0W3Byb3BOYW1lXSA9IGRhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoaGFzVWlkKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRbcHJvcE5hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1aWRSZWZlcmVuY2UgJiYgaGFzVWlkKHVpZFJlZmVyZW5jZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gdWlkUmVmZXJlbmNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdmFsdWUudWlkID09PSB1aWRSZWZlcmVuY2UudWlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdmFsdWUgIT09IHVpZFJlZmVyZW5jZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtwcm9wTmFtZV0gPSB1aWRSZWZlcmVuY2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtwcm9wTmFtZV0gPSBkZWVwQ2xvbmUodmFsdWUsIHVpZFJlZmVyZW5jZSwgZnJlZXplKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wTmFtZSAhPT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRbcHJvcE5hbWVdID0gdmFsdWUuY2xvbmUocmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbcHJvcE5hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZyZWV6ZSA9PT0gdHJ1ZVxuICAgICAgICAmJiAhT2JqZWN0LmlzRnJvemVuKHJlc3VsdClcbiAgICAgICAgJiYgdHlwZW9mIHJlc3VsdCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBPYmplY3QuZnJlZXplKHJlc3VsdCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5leHBvcnRzLmRlZXBDbG9uZSA9IGRlZXBDbG9uZTtcbmZ1bmN0aW9uIGRlZXBDbG9uZUFycmF5KGFyciwgdWlkUmVmZXJlbmNlLCBmcmVlemUpIHtcbiAgICByZXR1cm4gYXJyLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICBpZiAoaXNBcnJheShpdGVtKSkge1xuICAgICAgICAgICAgcmV0dXJuIGRlZXBDbG9uZUFycmF5KGl0ZW0sIHVpZFJlZmVyZW5jZSwgZnJlZXplKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpc09iamVjdChpdGVtKSkge1xuICAgICAgICAgICAgaWYgKGhhc1VpZChpdGVtKSkge1xuICAgICAgICAgICAgICAgIGlmICh1aWRSZWZlcmVuY2UgJiYgKGl0ZW1bY2FjaGVfMS5jb25maWcudWlkTmFtZV0gPT09IHVpZFJlZmVyZW5jZVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVpZFJlZmVyZW5jZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVlcENsb25lKGl0ZW0sIHVpZFJlZmVyZW5jZSwgZnJlZXplKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5leHBvcnRzLmNhY2hlU2l6ZSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIHZhciBjYWNoZU5vZGUgPSBsb2NhdGVfMS5nZXRDdXJyZW50Tm9kZShpbnN0YW5jZSk7XG4gICAgcmV0dXJuIGNhY2hlTm9kZSA/IGNhY2hlTm9kZS5pdGVtcy5zaXplKCkgOiAwO1xufTtcbmV4cG9ydHMuY2FjaGVMZW5ndGggPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gaW5zdGFuY2UudGhyZWFkLm5vZGVzLmxlbmd0aDtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi91dGlsLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgQ2FjaGVNYXBfMSA9IHJlcXVpcmUoXCIuL0NhY2hlTWFwXCIpO1xudmFyIENhY2hlTm9kZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2FjaGVOb2RlKG5vZGVJZCkge1xuICAgICAgICB0aGlzLml0ZW1zID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmlkID0gbm9kZUlkO1xuICAgIH1cbiAgICByZXR1cm4gQ2FjaGVOb2RlO1xufSgpKTtcbmV4cG9ydHMuQ2FjaGVOb2RlID0gQ2FjaGVOb2RlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2FjaGVOb2RlLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbmV4cG9ydHMuZ2V0Q2FsbFN0YXRzID0gZnVuY3Rpb24gKHN1Y2Nlc3MsIGluc3RhbmNlKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHJlc3VsdC5zdWNjZXNzID0gc3VjY2VzcztcbiAgICByZXN1bHQubm9kZUlkID0gZXhwb3J0cy5ub2RlKGluc3RhbmNlKTtcbiAgICByZXN1bHQubGVuZ3RoID0gbGVuZ3RoKGluc3RhbmNlKTtcbiAgICByZXN1bHQubmFtZSA9IGluc3RhbmNlLm5hbWU7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5leHBvcnRzLm5vZGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIG5vZGVJZCkge1xuICAgIGlmICh0eXBlb2Ygbm9kZUlkID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB2YXIgY3VycmVudE5vZGUgPSBnZXRDdXJyZW50Tm9kZShpbnN0YW5jZSk7XG4gICAgICAgIHJldHVybiBjdXJyZW50Tm9kZSA/IGN1cnJlbnROb2RlLmlkIDogLTE7XG4gICAgfVxuICAgIGlmICghdXRpbF8xLmlzTnVtYmVyKG5vZGVJZCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIG5vZGUgaWQgbXVzdCBiZSBhIG51bWJlci4nKTtcbiAgICB9XG4gICAgdmFyIGNhY2hlTm9kZSA9IGdldFJlcG9Ob2RlKG5vZGVJZCwgaW5zdGFuY2UpO1xuICAgIGlmICghY2FjaGVOb2RlKSB7XG4gICAgICAgIHJldHVybiBleHBvcnRzLmdldENhbGxTdGF0cyhmYWxzZSwgaW5zdGFuY2UpO1xuICAgIH1cbiAgICBpbnN0YW5jZS50aHJlYWQuY3VycmVudCA9IGJpbmFyeUluZGV4T2YoaW5zdGFuY2UudGhyZWFkLm5vZGVzLCBub2RlSWQpO1xuICAgIHJldHVybiBleHBvcnRzLmdldENhbGxTdGF0cyh0cnVlLCBpbnN0YW5jZSk7XG59O1xuZnVuY3Rpb24gZ2V0Q3VycmVudE5vZGUoaW5zdGFuY2UpIHtcbiAgICB2YXIgY3VycmVudE5vZGVJZCA9IGluc3RhbmNlLnRocmVhZC5ub2Rlc1tpbnN0YW5jZS50aHJlYWQuY3VycmVudF07XG4gICAgcmV0dXJuIGN1cnJlbnROb2RlSWQgPj0gMCA/IGdldFJlcG9Ob2RlKGN1cnJlbnROb2RlSWQsIGluc3RhbmNlKSA6IHVuZGVmaW5lZDtcbn1cbmV4cG9ydHMuZ2V0Q3VycmVudE5vZGUgPSBnZXRDdXJyZW50Tm9kZTtcbmZ1bmN0aW9uIGdldFJlcG9Ob2RlKGNhY2hlTm9kZUlkLCBpbnN0YW5jZSkge1xuICAgIHJldHVybiBpbnN0YW5jZS5yZXBvLmdldChjYWNoZU5vZGVJZCk7XG59XG5leHBvcnRzLmdldFJlcG9Ob2RlID0gZ2V0UmVwb05vZGU7XG52YXIgbGVuZ3RoID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7IHJldHVybiBpbnN0YW5jZS50aHJlYWQubm9kZXMubGVuZ3RoOyB9O1xuZnVuY3Rpb24gYmluYXJ5SW5kZXhPZihhcnJheSwgc2VhcmNoRWxlbWVudCkge1xuICAgIHZhciBtaW5JbmRleCA9IDA7XG4gICAgdmFyIG1heEluZGV4ID0gYXJyYXkubGVuZ3RoIC0gMTtcbiAgICB2YXIgY3VycmVudEluZGV4O1xuICAgIHZhciBjdXJyZW50RWxlbWVudDtcbiAgICB3aGlsZSAobWluSW5kZXggPD0gbWF4SW5kZXgpIHtcbiAgICAgICAgY3VycmVudEluZGV4ID0gKG1pbkluZGV4ICsgbWF4SW5kZXgpIC8gMiB8IDA7XG4gICAgICAgIGN1cnJlbnRFbGVtZW50ID0gYXJyYXlbY3VycmVudEluZGV4XTtcbiAgICAgICAgaWYgKGN1cnJlbnRFbGVtZW50IDwgc2VhcmNoRWxlbWVudCkge1xuICAgICAgICAgICAgbWluSW5kZXggPSBjdXJyZW50SW5kZXggKyAxO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGN1cnJlbnRFbGVtZW50ID4gc2VhcmNoRWxlbWVudCkge1xuICAgICAgICAgICAgbWF4SW5kZXggPSBjdXJyZW50SW5kZXggLSAxO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRJbmRleDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xvY2F0ZS50cyIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0Q29uZmlnID0ge1xuICAgIHVpZE5hbWU6ICd1aWQnLFxuICAgIG1heEhpc3RvcnlTdGF0ZXM6IDEwMDAsXG59O1xuZnVuY3Rpb24gY29uZmlndXJlKGNvbmYpIHtcbiAgICBmb3IgKHZhciBwIGluIGV4cG9ydHMuZGVmYXVsdENvbmZpZykge1xuICAgICAgICBpZiAoZXhwb3J0cy5kZWZhdWx0Q29uZmlnLmhhc093blByb3BlcnR5KHApICYmIGNvbmYuaGFzT3duUHJvcGVydHkocCkpIHtcbiAgICAgICAgICAgIGV4cG9ydHMuZGVmYXVsdENvbmZpZ1twXSA9IGNvbmZbcF07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGV4cG9ydHMuZGVmYXVsdENvbmZpZztcbn1cbmV4cG9ydHMuY29uZmlndXJlID0gY29uZmlndXJlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vY29uZmlnLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbnZhciBjYWNoZV8xID0gcmVxdWlyZShcIi4vY2FjaGVcIik7XG52YXIgY2FjaGVVdGlsXzEgPSByZXF1aXJlKFwiLi9jYWNoZVV0aWxcIik7XG52YXIgZ2V0QWN0dWFsVWlkID0gZnVuY3Rpb24gKHVpZE9yRW50aXR5KSB7XG4gICAgaWYgKHR5cGVvZiB1aWRPckVudGl0eSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIHVpZE9yRW50aXR5O1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgdWlkT3JFbnRpdHkgPT09ICdudW1iZXInKSB7XG4gICAgICAgIHJldHVybiBTdHJpbmcodWlkT3JFbnRpdHkpO1xuICAgIH1cbiAgICBlbHNlIGlmICh1dGlsXzEuaXNPYmplY3QodWlkT3JFbnRpdHkpKSB7XG4gICAgICAgIGlmICh1dGlsXzEuaGFzVWlkKHVpZE9yRW50aXR5KSkge1xuICAgICAgICAgICAgcmV0dXJuIHVpZE9yRW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgICAgICB9XG4gICAgfVxufTtcbnZhciBnZXRPYmplY3QgPSBmdW5jdGlvbiAodWlkT3JFbnRpdHksIGluc3RhbmNlKSB7XG4gICAgdmFyIHJlYWxVaWQgPSBnZXRBY3R1YWxVaWQodWlkT3JFbnRpdHkpO1xuICAgIGlmICghcmVhbFVpZCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBpdGVtID0gY2FjaGVVdGlsXzEuZ2V0Q2FjaGVkSXRlbShyZWFsVWlkLCBpbnN0YW5jZSk7XG4gICAgcmV0dXJuIGl0ZW0gPyBpdGVtLmVudGl0eSA6IHVuZGVmaW5lZDtcbn07XG5leHBvcnRzLmdldEl0ZW0gPSBmdW5jdGlvbiAoZW50aXR5LCBpbnN0YW5jZSwgbm9kZUlkKSB7XG4gICAgaWYgKCFlbnRpdHkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT25lIGdldCgpOiByZXF1aXJlcyBhIHVpZCB0byByZXRyaWV2ZSBhbiBpdGVtIGZyb20gdGhlIGNhY2hlLicpO1xuICAgIH1cbiAgICBpZiAodXRpbF8xLmlzQXJyYXkoZW50aXR5KSkge1xuICAgICAgICByZXR1cm4gZW50aXR5XG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiBnZXRPYmplY3QoaXRlbSwgaW5zdGFuY2UpOyB9KVxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkgeyByZXR1cm4gKGl0ZW0gIT09IG51bGwgJiYgaXRlbSAhPT0gdW5kZWZpbmVkKTsgfSk7XG4gICAgfVxuICAgIHJldHVybiBnZXRPYmplY3QoZW50aXR5LCBpbnN0YW5jZSk7XG59O1xudmFyIGdldEVkaXRhYmxlT2JqZWN0ID0gZnVuY3Rpb24gKHVpZE9yRW50aXR5LCBpbnN0YW5jZSkge1xuICAgIHZhciByZWFsVWlkID0gZ2V0QWN0dWFsVWlkKHVpZE9yRW50aXR5KTtcbiAgICB2YXIgZXhpc3RpbmcgPSBleHBvcnRzLmdldEl0ZW0ocmVhbFVpZCwgaW5zdGFuY2UpO1xuICAgIHJldHVybiBleGlzdGluZyA/IHV0aWxfMS5kZWVwQ2xvbmUoZXhpc3RpbmcsIHVuZGVmaW5lZCwgZmFsc2UpIDogdW5kZWZpbmVkO1xufTtcbmV4cG9ydHMuZ2V0RWRpdEl0ZW0gPSBmdW5jdGlvbiAob2JqLCBpbnN0YW5jZSwgbm9kZUlkKSB7XG4gICAgaWYgKHV0aWxfMS5pc0FycmF5KG9iaikpIHtcbiAgICAgICAgcmV0dXJuIG9ialxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAoaXRlbSkgeyByZXR1cm4gZ2V0RWRpdGFibGVPYmplY3QoaXRlbSwgaW5zdGFuY2UpOyB9KVxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkgeyByZXR1cm4gKGl0ZW0gIT09IG51bGwgJiYgaXRlbSAhPT0gdW5kZWZpbmVkKTsgfSk7XG4gICAgfVxuICAgIHJldHVybiBnZXRFZGl0YWJsZU9iamVjdChvYmosIGluc3RhbmNlKTtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9nZXQudHMiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBDYWNoZUl0ZW1fMSA9IHJlcXVpcmUoXCIuL0NhY2hlSXRlbVwiKTtcbnZhciBjYWNoZV8xID0gcmVxdWlyZShcIi4vY2FjaGVcIik7XG5leHBvcnRzLmdldENhY2hlZEl0ZW0gPSBmdW5jdGlvbiAodWlkLCBpbnN0YW5jZSkge1xuICAgIHZhciBjdXJyZW50Tm9kZSA9IGdldEN1cnJlbnROb2RlKGluc3RhbmNlKTtcbiAgICByZXR1cm4gY3VycmVudE5vZGUgPyBjdXJyZW50Tm9kZS5pdGVtcy5nZXQoU3RyaW5nKHVpZCkpIDogdW5kZWZpbmVkO1xufTtcbmV4cG9ydHMuaXNPbkNhY2hlID0gZnVuY3Rpb24gKGVudGl0eSwgaW5zdGFuY2UpIHtcbiAgICB2YXIgY2FjaGVkSXRlbSA9IGV4cG9ydHMuZ2V0Q2FjaGVkSXRlbShlbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV0sIGluc3RhbmNlKTtcbiAgICByZXR1cm4gY2FjaGVkSXRlbSAmJiBjYWNoZWRJdGVtLmVudGl0eSA9PT0gZW50aXR5O1xufTtcbmV4cG9ydHMuaXNPbkZsdXNoTWFwID0gZnVuY3Rpb24gKGVudGl0eSwgZmx1c2hNYXApIHtcbiAgICByZXR1cm4gISFmbHVzaE1hcC5nZXQoZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZF0pO1xufTtcbmV4cG9ydHMuZ2V0SXRlbUZsdXNoT3JDYWNoZWQgPSBmdW5jdGlvbiAodWlkLCBmbHVzaEFyZ3MpIHtcbiAgICBpZiAodWlkKSB7XG4gICAgICAgIHZhciB1dWlkID0gU3RyaW5nKHVpZCk7XG4gICAgICAgIHZhciBpdGVtID0gZmx1c2hBcmdzLmZsdXNoTWFwLmdldCh1dWlkKTtcbiAgICAgICAgaWYgKCFpdGVtKSB7XG4gICAgICAgICAgICBpdGVtID0gZXhwb3J0cy5nZXRDYWNoZWRJdGVtKHV1aWQsIGZsdXNoQXJncy5pbnN0YW5jZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0gJiYgT2JqZWN0LmlzRnJvemVuKGl0ZW0pKSB7XG4gICAgICAgICAgICBpdGVtID0gaXRlbS5jbG9uZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cbn07XG5mdW5jdGlvbiBnZXRDdXJyZW50Tm9kZShpbnN0YW5jZSkge1xuICAgIHZhciBjdXJyZW50Tm9kZUlkID0gaW5zdGFuY2UudGhyZWFkLm5vZGVzW2luc3RhbmNlLnRocmVhZC5jdXJyZW50XTtcbiAgICByZXR1cm4gY3VycmVudE5vZGVJZCA+PSAwID8gZ2V0UmVwb05vZGUoY3VycmVudE5vZGVJZCwgaW5zdGFuY2UucmVwbykgOiB1bmRlZmluZWQ7XG59XG5mdW5jdGlvbiBnZXRSZXBvTm9kZShub2RlSWQsIHJlcG8pIHtcbiAgICByZXR1cm4gcmVwby5nZXQobm9kZUlkKTtcbn1cbmV4cG9ydHMuZ2V0Q2FjaGVDdXJyZW50U3RhY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICB2YXIgY3VycmVudE5vZGUgPSBnZXRDdXJyZW50Tm9kZShpbnN0YW5jZSk7XG4gICAgcmV0dXJuIGN1cnJlbnROb2RlID8gY3VycmVudE5vZGUuaXRlbXMgOiB1bmRlZmluZWQ7XG59O1xuZXhwb3J0cy5lbnN1cmVJdGVtID0gZnVuY3Rpb24gKGVudGl0eSwgZmx1c2hBcmdzKSB7XG4gICAgdmFyIGl0ZW1VaWQgPSBTdHJpbmcoZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdKTtcbiAgICB2YXIgaXRlbSA9IGZsdXNoQXJncy5mbHVzaE1hcC5nZXQoaXRlbVVpZCk7XG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxuICAgIHZhciBsaXZlID0gZXhwb3J0cy5nZXRDYWNoZWRJdGVtKGl0ZW1VaWQsIGZsdXNoQXJncy5pbnN0YW5jZSk7XG4gICAgaXRlbSA9IG5ldyBDYWNoZUl0ZW1fMS5kZWZhdWx0KGVudGl0eSwgbGl2ZSk7XG4gICAgZmx1c2hBcmdzLmZsdXNoTWFwLnNldChpdGVtVWlkLCBpdGVtKTtcbiAgICBmbHVzaEFyZ3MuZmx1c2hNYXBbJ19fVVBEQVRFRF9fJ10gPSB0cnVlO1xuICAgIHJldHVybiBpdGVtO1xufTtcbmV4cG9ydHMuZW5zdXJlT25GbHVzaE1hcCA9IGZ1bmN0aW9uIChlbnRpdHksIGZsdXNoQXJncykge1xuICAgIHZhciBlbnRpdHlVaWQgPSBTdHJpbmcoZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdKTtcbiAgICBpZiAoIWZsdXNoQXJncy5mbHVzaE1hcC5oYXMoZW50aXR5VWlkKSkge1xuICAgICAgICBleHBvcnRzLmVuc3VyZUl0ZW0oZW50aXR5LCBmbHVzaEFyZ3MpO1xuICAgIH1cbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9jYWNoZVV0aWwudHMiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBDYWNoZU1hcF8xID0gcmVxdWlyZShcIi4vQ2FjaGVNYXBcIik7XG52YXIgQ2FjaGVJdGVtID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDYWNoZUl0ZW0oZW50aXR5LCBsaXZlSXRlbSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmNsb25lID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IENhY2hlSXRlbShfdGhpcy5lbnRpdHksIF90aGlzKTsgfTtcbiAgICAgICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XG4gICAgICAgIGlmIChsaXZlSXRlbSkge1xuICAgICAgICAgICAgdGhpcy5tYXBGcm9tID0gbGl2ZUl0ZW0ubWFwRnJvbS5jbG9uZSgpO1xuICAgICAgICAgICAgdGhpcy5tYXBUbyA9IGxpdmVJdGVtLm1hcFRvLmNsb25lKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm1hcEZyb20gPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLm1hcFRvID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBDYWNoZUl0ZW07XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ2FjaGVJdGVtO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2FjaGVJdGVtLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgb3BhdGggPSByZXF1aXJlKFwiLi9wYXRoXCIpO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG52YXIgY2FjaGVVdGlsXzEgPSByZXF1aXJlKFwiLi9jYWNoZVV0aWxcIik7XG52YXIgcmVmXzEgPSByZXF1aXJlKFwiLi9yZWZcIik7XG52YXIgQ2FjaGVNYXBfMSA9IHJlcXVpcmUoXCIuL0NhY2hlTWFwXCIpO1xudmFyIGNhY2hlXzEgPSByZXF1aXJlKFwiLi9jYWNoZVwiKTtcbnZhciBmbHVzaF8xID0gcmVxdWlyZShcIi4vZmx1c2hcIik7XG52YXIgbG9jYXRlXzEgPSByZXF1aXJlKFwiLi9sb2NhdGVcIik7XG52YXIgZ2V0XzEgPSByZXF1aXJlKFwiLi9nZXRcIik7XG52YXIgcGFyc2VfMSA9IHJlcXVpcmUoXCIuL3BhcnNlXCIpO1xudmFyIGJ1aWxkRXZpY3RVaWRBcnJheSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICB2YXIgdWlkQXJyYXkgPSBbXTtcbiAgICBpZiAodXRpbF8xLmlzQXJyYXkob2JqKSkge1xuICAgICAgICBvYmouZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgaWYgKHV0aWxfMS5oYXNVaWQoaXRlbSkpIHtcbiAgICAgICAgICAgICAgICB1aWRBcnJheS5wdXNoKFN0cmluZyhpdGVtW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBpdGVtID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgICAgICB1aWRBcnJheS5wdXNoKFN0cmluZyhpdGVtKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHZhciB1aWQgPSBvYmo7XG4gICAgICAgIGlmICh1dGlsXzEuaXNPYmplY3Qob2JqKSkge1xuICAgICAgICAgICAgdWlkID0gb2JqW2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1aWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHVpZEFycmF5O1xuICAgICAgICB9XG4gICAgICAgIHVpZEFycmF5LnB1c2goU3RyaW5nKHVpZCkpO1xuICAgIH1cbiAgICByZXR1cm4gdWlkQXJyYXk7XG59O1xuZXhwb3J0cy5ldmljdEl0ZW0gPSBmdW5jdGlvbiAob2JqLCBpbnN0YW5jZSkge1xuICAgIHZhciB1aWRBcnJheSA9IGJ1aWxkRXZpY3RVaWRBcnJheShvYmopO1xuICAgIGlmICh1aWRBcnJheS5sZW5ndGggPT0gMCkge1xuICAgICAgICByZXR1cm4gbG9jYXRlXzEuZ2V0Q2FsbFN0YXRzKGZhbHNlLCBpbnN0YW5jZSk7XG4gICAgfVxuICAgIHZhciBjdXJyZW50U3RhdGUgPSBjYWNoZVV0aWxfMS5nZXRDYWNoZUN1cnJlbnRTdGFjayhpbnN0YW5jZSk7XG4gICAgdmFyIGZvdW5kID0gdWlkQXJyYXkuc29tZShmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICByZXR1cm4gY3VycmVudFN0YXRlICYmIGN1cnJlbnRTdGF0ZS5oYXMoU3RyaW5nKGl0ZW0pKTtcbiAgICB9KTtcbiAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgIHJldHVybiBsb2NhdGVfMS5nZXRDYWxsU3RhdHMoZmFsc2UsIGluc3RhbmNlKTtcbiAgICB9XG4gICAgdmFyIHRlbXBTdGF0ZSA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICBjdXJyZW50U3RhdGUuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICB0ZW1wU3RhdGUuc2V0KGtleSwgdmFsdWUpO1xuICAgIH0pO1xuICAgIHZhciBmbHVzaE1hcCA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICB2YXIgZXZpY3RNYXAgPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgdmFyIGZsdXNoQXJncyA9IHtcbiAgICAgICAgZmx1c2hNYXA6IGZsdXNoTWFwLFxuICAgICAgICBldmljdE1hcDogZXZpY3RNYXAsXG4gICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZVxuICAgIH07XG4gICAgdmFyIHBhcmVudHNDaGFuZ2VkID0gW107XG4gICAgdWlkQXJyYXkuZm9yRWFjaChmdW5jdGlvbiAodWlkKSB7XG4gICAgICAgIGNsZWFyVGFyZ2V0UmVmRnJvbXModWlkLCBmbHVzaEFyZ3MpO1xuICAgICAgICBldmljdE1hcC5zZXQodWlkLCBudWxsKTtcbiAgICAgICAgY2xlYXJQYXJlbnRSZWZUb3ModWlkLCB1aWRBcnJheSwgcGFyZW50c0NoYW5nZWQsIGZsdXNoQXJncyk7XG4gICAgfSk7XG4gICAgcHV0UGFyZW50c0NoYW5nZWQocGFyZW50c0NoYW5nZWQsIGZsdXNoTWFwLCBldmljdE1hcCwgaW5zdGFuY2UpO1xuICAgIGZsdXNoTWFwLmZvckVhY2goZnVuY3Rpb24gKGtleSwgaXRlbSkge1xuICAgICAgICB0ZW1wU3RhdGUuc2V0KGtleSwgaXRlbSk7XG4gICAgfSk7XG4gICAgZXZpY3RNYXAuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XG4gICAgICAgIHRlbXBTdGF0ZS5kZWxldGUoa2V5KTtcbiAgICB9KTtcbiAgICBmbHVzaF8xLmZsdXNoKHRlbXBTdGF0ZSwgaW5zdGFuY2UpO1xuICAgIHJldHVybiBsb2NhdGVfMS5nZXRDYWxsU3RhdHModHJ1ZSwgaW5zdGFuY2UpO1xufTtcbnZhciBwdXRQYXJlbnRzQ2hhbmdlZCA9IGZ1bmN0aW9uIChwYXJlbnRzQ2hhbmdlZCwgZmx1c2hNYXAsIGV2aWN0TWFwLCBpbnN0YW5jZSkge1xuICAgIGlmIChwYXJlbnRzQ2hhbmdlZCAmJiBwYXJlbnRzQ2hhbmdlZC5sZW5ndGggPiAwICYmIHV0aWxfMS5jYWNoZVNpemUoaW5zdGFuY2UpID4gMCkge1xuICAgICAgICB2YXIgZmx1c2hBcmdzXzEgPSB7XG4gICAgICAgICAgICBmbHVzaE1hcDogZmx1c2hNYXAsXG4gICAgICAgICAgICBldmljdE1hcDogZXZpY3RNYXAsXG4gICAgICAgICAgICBpbnN0YW5jZTogaW5zdGFuY2VcbiAgICAgICAgfTtcbiAgICAgICAgcGFyc2VfMS5wYXJzZShwYXJlbnRzQ2hhbmdlZCwgZmx1c2hBcmdzXzEpO1xuICAgICAgICBmbHVzaEFyZ3NfMS5mbHVzaE1hcC5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIGl0ZW0pIHtcbiAgICAgICAgICAgIHJlZl8xLnVwZGF0ZVJlZkZyb21zKGl0ZW0sIGZsdXNoQXJnc18xKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbnZhciBjbGVhclJlZkZyb20gPSBmdW5jdGlvbiAocmVmSXRlbSwgcGFyZW50VWlkKSB7XG4gICAgdmFyIHJlZnNBcnJheSA9IHJlZkl0ZW0ubWFwRnJvbS5nZXQocGFyZW50VWlkKTtcbiAgICBpZiAoIXJlZnNBcnJheSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlZkl0ZW0ubWFwRnJvbSA9IHJlZkl0ZW0ubWFwRnJvbS5jbG9uZSgpO1xuICAgIHJlZkl0ZW0ubWFwRnJvbS5kZWxldGUocGFyZW50VWlkKTtcbn07XG52YXIgY2xlYXJSZWZUbyA9IGZ1bmN0aW9uIChwYXJlbnRJdGVtLCByZWZVaWQsIGluc3RhbmNlKSB7XG4gICAgdmFyIHBhcmVudCA9IHBhcmVudEl0ZW0uZW50aXR5O1xuICAgIGlmIChPYmplY3QuaXNGcm96ZW4ocGFyZW50KSkge1xuICAgICAgICBwYXJlbnQgPSBnZXRfMS5nZXRFZGl0SXRlbShwYXJlbnRbY2FjaGVfMS5jb25maWcudWlkTmFtZV0sIGluc3RhbmNlKTtcbiAgICAgICAgcGFyZW50SXRlbS5lbnRpdHkgPSBwYXJlbnQ7XG4gICAgfVxuICAgIHZhciByZWZQYXRocyA9IHBhcmVudEl0ZW0ubWFwVG8uZ2V0KHJlZlVpZCk7XG4gICAgcmVmUGF0aHMuZm9yRWFjaChmdW5jdGlvbiAocGF0aCkge1xuICAgICAgICBvcGF0aC5kZWwocGFyZW50LCBwYXRoKTtcbiAgICB9KTtcbiAgICBpZiAoIU9iamVjdC5pc0Zyb3plbihwYXJlbnQpKSB7XG4gICAgICAgIE9iamVjdC5mcmVlemUocGFyZW50KTtcbiAgICB9XG4gICAgcGFyZW50SXRlbS5lbnRpdHkgPSBwYXJlbnQ7XG4gICAgcGFyZW50SXRlbS5tYXBUbyA9IHBhcmVudEl0ZW0ubWFwVG8uY2xvbmUoKTtcbiAgICBwYXJlbnRJdGVtLm1hcFRvLmRlbGV0ZShyZWZVaWQpO1xuICAgIHJldHVybiB0cnVlO1xufTtcbnZhciBjbGVhclRhcmdldFJlZkZyb21zID0gZnVuY3Rpb24gKGVudGl0eVVpZCwgZmx1c2hBcmdzKSB7XG4gICAgdmFyIGl0ZW0gPSBjYWNoZVV0aWxfMS5nZXRDYWNoZWRJdGVtKGVudGl0eVVpZCwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICBpZiAoaXRlbSkge1xuICAgICAgICBpdGVtLm1hcFRvLmZvckVhY2goZnVuY3Rpb24gKHRvVWlkLCBwYXRocykge1xuICAgICAgICAgICAgdmFyIHJlZkl0ZW0gPSBjYWNoZVV0aWxfMS5nZXRJdGVtRmx1c2hPckNhY2hlZCh0b1VpZCwgZmx1c2hBcmdzKTtcbiAgICAgICAgICAgIGlmIChyZWZJdGVtKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJSZWZGcm9tKHJlZkl0ZW0sIGVudGl0eVVpZCk7XG4gICAgICAgICAgICAgICAgaWYgKHJlZkl0ZW0ubWFwRnJvbS5zaXplKCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUYXJnZXRSZWZGcm9tcyh0b1VpZCwgZmx1c2hBcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgZmx1c2hBcmdzLmV2aWN0TWFwLnNldCh0b1VpZCwgcmVmSXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZmx1c2hNYXAuc2V0KHRvVWlkLCByZWZJdGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG52YXIgY2xlYXJQYXJlbnRSZWZUb3MgPSBmdW5jdGlvbiAoZW50aXR5VWlkLCB1aWRBcnJheSwgcGFyZW50c0NoYW5nZWQsIGZsdXNoQXJncykge1xuICAgIHZhciBpdGVtID0gY2FjaGVVdGlsXzEuZ2V0SXRlbUZsdXNoT3JDYWNoZWQoZW50aXR5VWlkLCBmbHVzaEFyZ3MpO1xuICAgIGlmIChpdGVtKSB7XG4gICAgICAgIGl0ZW0ubWFwRnJvbS5mb3JFYWNoKGZ1bmN0aW9uIChwYXJlbnRVaWQsIHBhdGhzKSB7XG4gICAgICAgICAgICB2YXIgcGFyZW50SXRlbSA9IGNhY2hlVXRpbF8xLmdldEl0ZW1GbHVzaE9yQ2FjaGVkKHBhcmVudFVpZCwgZmx1c2hBcmdzKTtcbiAgICAgICAgICAgIGlmIChwYXJlbnRJdGVtKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN1Y2Nlc3MgPSBjbGVhclJlZlRvKHBhcmVudEl0ZW0sIGVudGl0eVVpZCwgZmx1c2hBcmdzLmluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICBpZiAoc3VjY2VzcyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZmx1c2hNYXAuc2V0KHBhcmVudFVpZCwgcGFyZW50SXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1aWRBcnJheS5pbmRleE9mKHBhcmVudFVpZCkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRzQ2hhbmdlZC5wdXNoKHBhcmVudEl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZXZpY3QudHMiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xuZnVuY3Rpb24gZ2V0S2V5KGtleSkge1xuICAgIHZhciBpbnRLZXkgPSBwYXJzZUludChrZXkpO1xuICAgIGlmIChpbnRLZXkudG9TdHJpbmcoKSA9PT0ga2V5KSB7XG4gICAgICAgIHJldHVybiBpbnRLZXk7XG4gICAgfVxuICAgIHJldHVybiBrZXk7XG59XG5mdW5jdGlvbiBkZWwob2JqLCBwYXRoKSB7XG4gICAgaWYgKHV0aWxfMS5pc051bWJlcihwYXRoKSkge1xuICAgICAgICBwYXRoID0gW3BhdGhdO1xuICAgIH1cbiAgICBpZiAodXRpbF8xLmlzRW1wdHkob2JqKSkge1xuICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbiAgICBpZiAodXRpbF8xLmlzRW1wdHkocGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgaWYgKHV0aWxfMS5pc1N0cmluZyhwYXRoKSkge1xuICAgICAgICByZXR1cm4gZGVsKG9iaiwgcGF0aC5zcGxpdCgnLicpKTtcbiAgICB9XG4gICAgdmFyIGN1cnJlbnRQYXRoID0gZ2V0S2V5KHBhdGhbMF0pO1xuICAgIHZhciBvbGRWYWwgPSBvYmpbY3VycmVudFBhdGhdO1xuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBpZiAob2xkVmFsICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgIGlmICh1dGlsXzEuaXNBcnJheShvYmopKSB7XG4gICAgICAgICAgICAgICAgb2JqLnNwbGljZShjdXJyZW50UGF0aCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgb2JqW2N1cnJlbnRQYXRoXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKG9ialtjdXJyZW50UGF0aF0gIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgcmV0dXJuIGRlbChvYmpbY3VycmVudFBhdGhdLCBwYXRoLnNsaWNlKDEpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqO1xufVxuZXhwb3J0cy5kZWwgPSBkZWw7XG5mdW5jdGlvbiBnZXQob2JqLCBwYXRoLCBkZWZhdWx0VmFsdWUpIHtcbiAgICBpZiAodXRpbF8xLmlzTnVtYmVyKHBhdGgpKSB7XG4gICAgICAgIHBhdGggPSBbcGF0aF07XG4gICAgfVxuICAgIGlmICh1dGlsXzEuaXNFbXB0eShwYXRoKSkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBpZiAodXRpbF8xLmlzRW1wdHkob2JqKSkge1xuICAgICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgIH1cbiAgICBpZiAodXRpbF8xLmlzU3RyaW5nKHBhdGgpKSB7XG4gICAgICAgIHJldHVybiBnZXQob2JqLCBwYXRoLnNwbGl0KCcuJyksIGRlZmF1bHRWYWx1ZSk7XG4gICAgfVxuICAgIHZhciBjdXJyZW50UGF0aCA9IGdldEtleShwYXRoWzBdKTtcbiAgICBpZiAocGF0aC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgaWYgKG9ialtjdXJyZW50UGF0aF0gPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2JqW2N1cnJlbnRQYXRoXTtcbiAgICB9XG4gICAgcmV0dXJuIGdldChvYmpbY3VycmVudFBhdGhdLCBwYXRoLnNsaWNlKDEpLCBkZWZhdWx0VmFsdWUpO1xufVxuZXhwb3J0cy5nZXQgPSBnZXQ7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wYXRoLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgb3BhdGggPSByZXF1aXJlKFwiLi9wYXRoXCIpO1xudmFyIGNhY2hlVXRpbF8xID0gcmVxdWlyZShcIi4vY2FjaGVVdGlsXCIpO1xudmFyIGNhY2hlXzEgPSByZXF1aXJlKFwiLi9jYWNoZVwiKTtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xudmFyIGFkZFJlZlRvID0gZnVuY3Rpb24gKHBhcmVudEl0ZW0sIHJlZlVpZCwgcGF0aCkge1xuICAgIGlmIChwYXJlbnRJdGVtLm1hcFRvLmhhcyhyZWZVaWQpID09PSBmYWxzZSkge1xuICAgICAgICBwYXJlbnRJdGVtLm1hcFRvLnNldChyZWZVaWQsIFtdKTtcbiAgICB9XG4gICAgdmFyIHJlZkFycmF5ID0gcGFyZW50SXRlbS5tYXBUby5nZXQocmVmVWlkKTtcbiAgICBpZiAocmVmQXJyYXkuaW5kZXhPZihwYXRoKSA8IDApIHtcbiAgICAgICAgcmVmQXJyYXkucHVzaChwYXRoKTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcmVudEl0ZW07XG59O1xudmFyIGFkZFJlZkZyb20gPSBmdW5jdGlvbiAocmVmSXRlbSwgcGFyZW50VWlkLCBwYXRoKSB7XG4gICAgaWYgKHJlZkl0ZW0ubWFwRnJvbS5oYXMocGFyZW50VWlkKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmVmSXRlbS5tYXBGcm9tLnNldChwYXJlbnRVaWQsIFtdKTtcbiAgICB9XG4gICAgdmFyIGZyb21BcnJheSA9IHJlZkl0ZW0ubWFwRnJvbS5nZXQocGFyZW50VWlkKTtcbiAgICBpZiAoZnJvbUFycmF5LmluZGV4T2YocGF0aCkgPCAwKSB7XG4gICAgICAgIGZyb21BcnJheS5wdXNoKHBhdGgpO1xuICAgIH1cbiAgICByZXR1cm4gcmVmSXRlbTtcbn07XG52YXIgYXNzaWduUmVmcyA9IGZ1bmN0aW9uIChwYXJlbnRJdGVtLCByZWZJdGVtLCBwYXRoKSB7XG4gICAgdmFyIHBhcmVudFVpZCA9IHBhcmVudEl0ZW0uZW50aXR5W2NhY2hlXzEuY29uZmlnLnVpZE5hbWVdO1xuICAgIHZhciByZWZVaWQgPSByZWZJdGVtLmVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXTtcbiAgICB2YXIgcmVmUGF0aCA9IHBhdGguam9pbignLicpO1xuICAgIGFkZFJlZlRvKHBhcmVudEl0ZW0sIHJlZlVpZCwgcmVmUGF0aCk7XG4gICAgYWRkUmVmRnJvbShyZWZJdGVtLCBwYXJlbnRVaWQsIHJlZlBhdGgpO1xufTtcbmV4cG9ydHMuYXNzaWduUmVmVG9QYXJlbnQgPSBmdW5jdGlvbiAocmVmSXRlbSwgcGFyZW50VWlkLCBwYXRoLCBmbHVzaEFyZ3MpIHtcbiAgICBpZiAocGFyZW50VWlkKSB7XG4gICAgICAgIHZhciBwYXJlbnRJdGVtID0gY2FjaGVVdGlsXzEuZ2V0SXRlbUZsdXNoT3JDYWNoZWQocGFyZW50VWlkLCBmbHVzaEFyZ3MpO1xuICAgICAgICBpZiAocGFyZW50SXRlbSAmJiBwYXRoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGFzc2lnblJlZnMocGFyZW50SXRlbSwgcmVmSXRlbSwgcGF0aCk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuZXhwb3J0cy51cGRhdGVSZWZGcm9tcyA9IGZ1bmN0aW9uIChpdGVtLCBmbHVzaEFyZ3MpIHtcbiAgICBpZiAoaXRlbS5tYXBGcm9tLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaXRlbS5tYXBGcm9tLmZvckVhY2goZnVuY3Rpb24gKHBhcmVudFVpZCwgcGF0aHMpIHtcbiAgICAgICAgICAgIHZhciBwYXJlbnRJdGVtID0gZmx1c2hBcmdzLmZsdXNoTWFwLmdldChwYXJlbnRVaWQpO1xuICAgICAgICAgICAgaWYgKCFwYXJlbnRJdGVtKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50SXRlbSA9IGNhY2hlVXRpbF8xLmdldENhY2hlZEl0ZW0ocGFyZW50VWlkLCBmbHVzaEFyZ3MuaW5zdGFuY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBhcmVudEl0ZW0gJiYgcGF0aHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBmaXJzdFBhdGggPSBwYXRoc1swXTtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0UmVmID0gb3BhdGguZ2V0KHBhcmVudEl0ZW0uZW50aXR5LCBmaXJzdFBhdGgpO1xuICAgICAgICAgICAgICAgIGlmICh0YXJnZXRSZWYgJiYgdGFyZ2V0UmVmICE9PSBpdGVtLmVudGl0eSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXJncyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsdXNoTWFwOiBmbHVzaEFyZ3MuZmx1c2hNYXAsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZTogZmx1c2hBcmdzLmluc3RhbmNlLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnRJdGVtID0gY2FjaGVVdGlsXzEuZW5zdXJlSXRlbShwYXJlbnRJdGVtLmVudGl0eSwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudEl0ZW0uZW50aXR5ID0gdXRpbF8xLmRlZXBDbG9uZShwYXJlbnRJdGVtLmVudGl0eSwgaXRlbS5lbnRpdHksIHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcbnZhciByZW1vdmVSZWZGcm9tID0gZnVuY3Rpb24gKGl0ZW0sIHBhcmVudFVpZCwgcGF0aCkge1xuICAgIHZhciByZWZzQXJyYXkgPSBpdGVtLm1hcEZyb20uZ2V0KHBhcmVudFVpZCk7XG4gICAgdmFyIGluZGV4ID0gcmVmc0FycmF5LmluZGV4T2YocGF0aCk7XG4gICAgcmVmc0FycmF5ID0gcmVmc0FycmF5LnNsaWNlKCk7XG4gICAgcmVmc0FycmF5LnNwbGljZShpbmRleCwgMSk7XG4gICAgaXRlbS5tYXBGcm9tLnNldChwYXJlbnRVaWQsIHJlZnNBcnJheSk7XG4gICAgaWYgKHJlZnNBcnJheS5sZW5ndGggPT0gMCkge1xuICAgICAgICBpdGVtLm1hcEZyb20uZGVsZXRlKHBhcmVudFVpZCk7XG4gICAgfVxufTtcbnZhciByZW1vdmVSZWZGcm9tVmFsdWUgPSBmdW5jdGlvbiAocGFyZW50VWlkLCByZWZVaWQsIGZsdXNoQXJncywgcGF0aCkge1xuICAgIHZhciByZWZJdGVtID0gY2FjaGVVdGlsXzEuZ2V0SXRlbUZsdXNoT3JDYWNoZWQocmVmVWlkLCBmbHVzaEFyZ3MpO1xuICAgIGlmIChyZWZJdGVtKSB7XG4gICAgICAgIHJlZkl0ZW0gPSByZWZJdGVtLmNsb25lKCk7XG4gICAgICAgIGlmIChyZWZJdGVtLm1hcEZyb20uaGFzKHBhcmVudFVpZCkpIHtcbiAgICAgICAgICAgIHJlbW92ZVJlZkZyb20ocmVmSXRlbSwgcGFyZW50VWlkLCBwYXRoKTtcbiAgICAgICAgICAgIGlmIChyZWZJdGVtLm1hcEZyb20uc2l6ZSgpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgZmx1c2hBcmdzLmV2aWN0TWFwLnNldChyZWZVaWQsIHJlZkl0ZW0pO1xuICAgICAgICAgICAgICAgIGZsdXNoQXJncy5mbHVzaE1hcC5kZWxldGUocmVmVWlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGZsdXNoQXJncy5mbHVzaE1hcC5zZXQocmVmVWlkLCByZWZJdGVtKTtcbiAgICAgICAgICAgICAgICBmbHVzaEFyZ3MuZXZpY3RNYXAuZGVsZXRlKHJlZlVpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xudmFyIHVwZGF0ZUl0ZW1SZWZUb3MgPSBmdW5jdGlvbiAoaXRlbSwgZmx1c2hBcmdzKSB7XG4gICAgaWYgKCFpdGVtIHx8ICFpdGVtLm1hcFRvKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaXRlbS5tYXBUby5mb3JFYWNoKGZ1bmN0aW9uICh0b1VpZCwgcGF0aHMpIHtcbiAgICAgICAgdmFyIHVwZGF0ZWRQYXRocyA9IHBhdGhzLmZpbHRlcihmdW5jdGlvbiAocGF0aCkge1xuICAgICAgICAgICAgdmFyIHJlZmVyZW5jZSA9IG9wYXRoLmdldChpdGVtLmVudGl0eSwgcGF0aCk7XG4gICAgICAgICAgICB2YXIgaGFzUmVmID0gcmVmZXJlbmNlICYmIFN0cmluZyhyZWZlcmVuY2VbY2FjaGVfMS5jb25maWcudWlkTmFtZV0pID09PSBTdHJpbmcodG9VaWQpO1xuICAgICAgICAgICAgaWYgKCFoYXNSZWYpIHtcbiAgICAgICAgICAgICAgICByZW1vdmVSZWZGcm9tVmFsdWUoaXRlbS5lbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV0sIHRvVWlkLCBmbHVzaEFyZ3MsIHBhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGhhc1JlZjtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh1cGRhdGVkUGF0aHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaXRlbS5tYXBUby5zZXQodG9VaWQsIHVwZGF0ZWRQYXRocyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpdGVtLm1hcFRvLmRlbGV0ZSh0b1VpZCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5leHBvcnRzLnVwZGF0ZVBvaW50ZXJzID0gZnVuY3Rpb24gKGZsdXNoQXJncykge1xuICAgIGZsdXNoQXJncy5mbHVzaE1hcC5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIGl0ZW0pIHtcbiAgICAgICAgdXBkYXRlSXRlbVJlZlRvcyhpdGVtLCBmbHVzaEFyZ3MpO1xuICAgICAgICBleHBvcnRzLnVwZGF0ZVJlZkZyb21zKGl0ZW0sIGZsdXNoQXJncyk7XG4gICAgfSk7XG59O1xuZXhwb3J0cy51cGRhdGVSZWZUb3MgPSBmdW5jdGlvbiAoZW50aXR5VWlkLCBmbHVzaEFyZ3MpIHtcbiAgICB2YXIgaXRlbSA9IGNhY2hlVXRpbF8xLmdldEl0ZW1GbHVzaE9yQ2FjaGVkKGVudGl0eVVpZCwgZmx1c2hBcmdzKTtcbiAgICB1cGRhdGVJdGVtUmVmVG9zKGl0ZW0sIGZsdXNoQXJncyk7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcmVmLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgQ2FjaGVNYXBfMSA9IHJlcXVpcmUoXCIuL0NhY2hlTWFwXCIpO1xudmFyIGNhY2hlXzEgPSByZXF1aXJlKFwiLi9jYWNoZVwiKTtcbnZhciBjYWNoZVV0aWxfMSA9IHJlcXVpcmUoXCIuL2NhY2hlVXRpbFwiKTtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xudmFyIGZyZWV6ZUl0ZW0gPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgIE9iamVjdC5mcmVlemUoaXRlbSk7XG4gICAgT2JqZWN0LmZyZWV6ZShpdGVtLmVudGl0eSk7XG4gICAgT2JqZWN0LmZyZWV6ZShpdGVtLm1hcFRvKTtcbiAgICBPYmplY3QuZnJlZXplKGl0ZW0ubWFwRnJvbSk7XG59O1xuZXhwb3J0cy5mbHVzaCA9IGZ1bmN0aW9uICh0ZW1wLCBpbnN0YW5jZSkge1xuICAgIGlmICh0ZW1wICE9PSBudWxsKSB7XG4gICAgICAgIE9iamVjdC5mcmVlemUodGVtcCk7XG4gICAgICAgIHZhciBjYWNoZU5vZGUgPSB1dGlsXzEuZ2V0TmV3Q2FjaGVOb2RlKGluc3RhbmNlKTtcbiAgICAgICAgY2FjaGVOb2RlLml0ZW1zID0gdGVtcDtcbiAgICAgICAgaWYgKGluc3RhbmNlLnRocmVhZC5ub2Rlcy5pbmRleE9mKGNhY2hlTm9kZS5pZCkgPCAwKSB7XG4gICAgICAgICAgICBpbnN0YW5jZS50aHJlYWQubm9kZXMucHVzaChjYWNoZU5vZGUuaWQpO1xuICAgICAgICAgICAgaW5zdGFuY2UudGhyZWFkLmN1cnJlbnQgKz0gMTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5leHBvcnRzLnByZUZsdXNoID0gZnVuY3Rpb24gKGZsdXNoQXJncywgaW5zdGFuY2UpIHtcbiAgICB2YXIgdGVtcCA9IG5ldyBDYWNoZU1hcF8xLmRlZmF1bHQoKTtcbiAgICB2YXIgY3VycmVudFN0YWNrID0gY2FjaGVVdGlsXzEuZ2V0Q2FjaGVDdXJyZW50U3RhY2soaW5zdGFuY2UpO1xuICAgIGlmIChjdXJyZW50U3RhY2spIHtcbiAgICAgICAgY3VycmVudFN0YWNrLmZvckVhY2goZnVuY3Rpb24gKGtleSwgaXRlbSkge1xuICAgICAgICAgICAgdGVtcC5zZXQoa2V5LCBpdGVtKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZsdXNoQXJncy5mbHVzaE1hcC5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIGl0ZW0pIHtcbiAgICAgICAgdmFyIGl0ZW1VaWQgPSBpdGVtLmVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXTtcbiAgICAgICAgZnJlZXplSXRlbShpdGVtKTtcbiAgICAgICAgdGVtcC5zZXQoU3RyaW5nKGl0ZW1VaWQpLCBpdGVtKTtcbiAgICB9KTtcbiAgICBpZiAoZmx1c2hBcmdzLmV2aWN0TWFwLnNpemUoKSA+IDApIHtcbiAgICAgICAgZmx1c2hBcmdzLmV2aWN0TWFwLmZvckVhY2goZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHRlbXAuZGVsZXRlKFN0cmluZyhrZXkpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGV4cG9ydHMuZmx1c2godGVtcCwgaW5zdGFuY2UpO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2ZsdXNoLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgcmVmXzEgPSByZXF1aXJlKFwiLi9yZWZcIik7XG52YXIgY2FjaGVVdGlsXzEgPSByZXF1aXJlKFwiLi9jYWNoZVV0aWxcIik7XG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbnZhciBjYWNoZV8xID0gcmVxdWlyZShcIi4vY2FjaGVcIik7XG5leHBvcnRzLnBhcnNlID0gZnVuY3Rpb24gKGVudGl0eSwgZmx1c2hBcmdzKSB7XG4gICAgaWYgKHV0aWxfMS5oYXNVaWQoZW50aXR5KSkge1xuICAgICAgICBpZiAoY2FjaGVVdGlsXzEuaXNPbkNhY2hlKGVudGl0eSwgZmx1c2hBcmdzLmluc3RhbmNlKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgX2FkZFRvRmx1c2hNYXAoZW50aXR5LCBmbHVzaEFyZ3MpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKHV0aWxfMS5pc0FycmF5KGVudGl0eSkpIHtcbiAgICAgICAgICAgIHBhcnNlQXJyYXkoZW50aXR5LCBudWxsLCBbXSwgZmx1c2hBcmdzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh1dGlsXzEuaXNPYmplY3QoZW50aXR5KSkge1xuICAgICAgICAgICAgcGFyc2VPYmplY3QoZW50aXR5LCBudWxsLCBbXSwgZmx1c2hBcmdzKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG52YXIgX2FkZFRvRmx1c2hNYXAgPSBmdW5jdGlvbiAoZW50aXR5LCBmbHVzaEFyZ3MpIHtcbiAgICBjYWNoZVV0aWxfMS5lbnN1cmVPbkZsdXNoTWFwKGVudGl0eSwgZmx1c2hBcmdzKTtcbiAgICBwYXJzZUVudGl0eShlbnRpdHksIGVudGl0eVtjYWNoZV8xLmNvbmZpZy51aWROYW1lXSwgW10sIGZsdXNoQXJncyk7XG4gICAgcmVmXzEudXBkYXRlUmVmVG9zKFN0cmluZyhlbnRpdHlbY2FjaGVfMS5jb25maWcudWlkTmFtZV0pLCBmbHVzaEFyZ3MpO1xufTtcbnZhciBjYWNoZVVpZE9iaiA9IGZ1bmN0aW9uIChlbnRpdHksIHBhcmVudFVpZCwgcGF0aCwgZmx1c2hBcmdzKSB7XG4gICAgdmFyIGl0ZW0gPSBjYWNoZVV0aWxfMS5lbnN1cmVJdGVtKGVudGl0eSwgZmx1c2hBcmdzKTtcbiAgICBpZiAocGFyZW50VWlkKSB7XG4gICAgICAgIHJlZl8xLmFzc2lnblJlZlRvUGFyZW50KGl0ZW0sIHBhcmVudFVpZCwgcGF0aCwgZmx1c2hBcmdzKTtcbiAgICB9XG4gICAgaWYgKGNhY2hlVXRpbF8xLmlzT25DYWNoZShlbnRpdHksIGZsdXNoQXJncy5pbnN0YW5jZSlcbiAgICAgICAgfHwgY2FjaGVVdGlsXzEuaXNPbkZsdXNoTWFwKGVudGl0eSwgZmx1c2hBcmdzLmZsdXNoTWFwKSlcbiAgICAgICAgcmV0dXJuO1xuICAgIGV4cG9ydHMucGFyc2UoZW50aXR5LCBmbHVzaEFyZ3MpO1xufTtcbnZhciBwYXJzZU9iamVjdCA9IGZ1bmN0aW9uIChvYmosIHBhcmVudFVpZCwgcGF0aCwgZmx1c2hBcmdzKSB7XG4gICAgaWYgKHV0aWxfMS5oYXNVaWQob2JqKSkge1xuICAgICAgICBjYWNoZVVpZE9iaihvYmosIHBhcmVudFVpZCwgcGF0aCwgZmx1c2hBcmdzKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHBhcnNlRW50aXR5KG9iaiwgcGFyZW50VWlkLCBwYXRoLCBmbHVzaEFyZ3MpO1xuICAgIH1cbn07XG52YXIgcGFyc2VBcnJheSA9IGZ1bmN0aW9uIChhcnIsIHBhcmVudFVpZCwgcGF0aCwgZmx1c2hBcmdzKSB7XG4gICAgaWYgKHBhdGggPT09IHZvaWQgMCkgeyBwYXRoID0gW107IH1cbiAgICBhcnIuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgaWYgKHV0aWxfMS5pc0FycmF5KGl0ZW0pKSB7XG4gICAgICAgICAgICBwYXJzZUFycmF5KGl0ZW0sIHBhcmVudFVpZCwgcGF0aC5jb25jYXQoW2luZGV4XSksIGZsdXNoQXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodXRpbF8xLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICAgICAgICBwYXJzZU9iamVjdChpdGVtLCBwYXJlbnRVaWQsIHBhdGguY29uY2F0KFtpbmRleF0pLCBmbHVzaEFyZ3MpO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xudmFyIHBhcnNlRW50aXR5ID0gZnVuY3Rpb24gKGVudGl0eSwgcGFyZW50VWlkLCBwYXRoLCBmbHVzaEFyZ3MpIHtcbiAgICBpZiAocGF0aCA9PT0gdm9pZCAwKSB7IHBhdGggPSBbXTsgfVxuICAgIGZvciAodmFyIGtleSBpbiBlbnRpdHkpIHtcbiAgICAgICAgaWYgKGVudGl0eS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICB2YXIgcmVmID0gZW50aXR5W2tleV07XG4gICAgICAgICAgICBpZiAodXRpbF8xLmlzQXJyYXkocmVmKSkge1xuICAgICAgICAgICAgICAgIHBhcnNlQXJyYXkocmVmLCBwYXJlbnRVaWQsIHBhdGguY29uY2F0KFtrZXldKSwgZmx1c2hBcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHV0aWxfMS5pc09iamVjdChyZWYpKSB7XG4gICAgICAgICAgICAgICAgcGFyc2VPYmplY3QocmVmLCBwYXJlbnRVaWQsIHBhdGguY29uY2F0KFtrZXldKSwgZmx1c2hBcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIE9iamVjdC5mcmVlemUocmVmKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wYXJzZS50cyIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIGNhY2hlXzEgPSByZXF1aXJlKFwiLi9jYWNoZVwiKTtcbnZhciBzdHJpbmdpZnlNYXAgPSBmdW5jdGlvbiAobWFwKSB7XG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgIG1hcC5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIGl0ZW0pIHtcbiAgICAgICAgdmFyIGl0ZW1SZXN1bHQgPSBKU09OLnN0cmluZ2lmeShpdGVtLCBudWxsLCAyKTtcbiAgICAgICAgcmVzdWx0ICs9IGl0ZW1SZXN1bHQgKyAnLFxcbic7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5leHBvcnRzLnByaW50Q2FjaGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgY3VycmVudCA9IGluc3RhbmNlLnRocmVhZC5jdXJyZW50O1xuICAgIHZhciBub2RlSW5kaWNlcyA9IGluc3RhbmNlLnRocmVhZC5ub2RlcztcbiAgICBub2RlSW5kaWNlcy5tYXAoZnVuY3Rpb24gKGNhY2hlTm9kZUlkKSB7XG4gICAgICAgIHZhciBjYWNoZU5vZGUgPSBpbnN0YW5jZS5yZXBvLmdldChjYWNoZU5vZGVJZCk7XG4gICAgICAgIHZhciBzdHJlYW1EYXRhID0gJyc7XG4gICAgICAgIHZhciBzdGF0ZSA9IGluZGV4ICsgXCI6XCIgKyBzdHJlYW1EYXRhICsgXCJbXCIgKyBzdHJpbmdpZnlNYXAoY2FjaGVOb2RlLml0ZW1zKSArIFwiXVxcblxcblwiO1xuICAgICAgICBpZiAoaW5kZXggPT09IGN1cnJlbnQpIHtcbiAgICAgICAgICAgIHN0YXRlID0gJy0+ICcgKyBzdGF0ZTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgKz0gc3RhdGU7XG4gICAgICAgIGluZGV4Kys7XG4gICAgfSk7XG4gICAgcmVzdWx0ID0gcmVzdWx0LnN1YnN0cmluZygwLCAocmVzdWx0Lmxlbmd0aCAtIDIpKTtcbiAgICBpbmRleCA9IDA7XG4gICAgcmV0dXJuICdcXG4tLS0tLS0gT25lIC0tLS0tLS0nXG4gICAgICAgICsgJ1xcblNUQUNLOlxcbicgKyByZXN1bHRcbiAgICAgICAgKyAnXFxuXFxuQ09ORklHOicgKyBKU09OLnN0cmluZ2lmeShjYWNoZV8xLmNvbmZpZywgbnVsbCwgMilcbiAgICAgICAgKyAnXFxuXFxuUkVQTyBTSVpFOicgKyBpbnN0YW5jZS5yZXBvLmxlbmd0aFxuICAgICAgICArICdcXG49PT09PT09PT09PT09PT09PT09XFxuJztcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wcmludC50cyIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG52YXIgQ2FjaGVNYXBfMSA9IHJlcXVpcmUoXCIuL0NhY2hlTWFwXCIpO1xudmFyIGxvY2F0ZV8xID0gcmVxdWlyZShcIi4vbG9jYXRlXCIpO1xudmFyIHBhcnNlXzEgPSByZXF1aXJlKFwiLi9wYXJzZVwiKTtcbnZhciBmbHVzaF8xID0gcmVxdWlyZShcIi4vZmx1c2hcIik7XG52YXIgcmVmXzEgPSByZXF1aXJlKFwiLi9yZWZcIik7XG5leHBvcnRzLnB1dEl0ZW0gPSBmdW5jdGlvbiAoZW50aXR5LCBpbnN0YW5jZSkge1xuICAgIGlmICgodXRpbF8xLmlzQXJyYXkoZW50aXR5KSB8fCB1dGlsXzEuaXNPYmplY3QoZW50aXR5KSkpIHtcbiAgICAgICAgdmFyIGV2aWN0TWFwID0gbmV3IENhY2hlTWFwXzEuZGVmYXVsdCgpO1xuICAgICAgICB2YXIgZmx1c2hNYXAgPSBuZXcgQ2FjaGVNYXBfMS5kZWZhdWx0KCk7XG4gICAgICAgIGZsdXNoTWFwWydfX1VQREFURURfXyddID0gZmFsc2U7XG4gICAgICAgIHZhciBmbHVzaEFyZ3MgPSB7XG4gICAgICAgICAgICBmbHVzaE1hcDogZmx1c2hNYXAsXG4gICAgICAgICAgICBldmljdE1hcDogZXZpY3RNYXAsXG4gICAgICAgICAgICBpbnN0YW5jZTogaW5zdGFuY2UsXG4gICAgICAgIH07XG4gICAgICAgIHBhcnNlXzEucGFyc2UoZW50aXR5LCBmbHVzaEFyZ3MpO1xuICAgICAgICByZWZfMS51cGRhdGVQb2ludGVycyhmbHVzaEFyZ3MpO1xuICAgICAgICBpZiAoZmx1c2hBcmdzLmZsdXNoTWFwLnNpemUoKSA+IDApIHtcbiAgICAgICAgICAgIGZsdXNoXzEucHJlRmx1c2goZmx1c2hBcmdzLCBpbnN0YW5jZSk7XG4gICAgICAgICAgICByZXR1cm4gbG9jYXRlXzEuZ2V0Q2FsbFN0YXRzKHRydWUsIGluc3RhbmNlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbG9jYXRlXzEuZ2V0Q2FsbFN0YXRzKGZhbHNlLCBpbnN0YW5jZSk7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcHV0LnRzIl0sInNvdXJjZVJvb3QiOiIifQ==