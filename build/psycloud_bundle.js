(function(exported) {
  if (typeof exports === 'object') {
    module.exports = exported;
  } else if (typeof define === 'function' && define.amd) {
    define(function() {
      return exported;
    });
  } else {
    Psy = exported;
  }
})((function(require, undefined) { var global = this;

require.define('2', function(module, exports, __dirname, __filename, undefined){
;
(function (window) {
    var undefined;
    var arrayPool = [], objectPool = [];
    var idCounter = 0;
    var indicatorObject = {};
    var keyPrefix = +new Date() + '';
    var largeArraySize = 75;
    var maxPoolSize = 40;
    var reEmptyStringLeading = /\b__p \+= '';/g, reEmptyStringMiddle = /\b(__p \+=) '' \+/g, reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
    var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g;
    var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
    var reFlags = /\w*$/;
    var reInterpolate = /<%=([\s\S]+?)%>/g;
    var reThis = (reThis = /\bthis\b/) && reThis.test(runInContext) && reThis;
    var whitespace = ' \t\x0B\f\xa0\ufeff' + '\n\r\u2028\u2029' + '\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000';
    var reLeadingSpacesAndZeros = RegExp('^[' + whitespace + ']*0+(?=.$)');
    var reNoMatch = /($^)/;
    var reUnescapedHtml = /[&<>"']/g;
    var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;
    var contextProps = [
            'Array',
            'Boolean',
            'Date',
            'Function',
            'Math',
            'Number',
            'Object',
            'RegExp',
            'String',
            '_',
            'attachEvent',
            'clearTimeout',
            'isFinite',
            'isNaN',
            'parseInt',
            'setImmediate',
            'setTimeout'
        ];
    var templateCounter = 0;
    var argsClass = '[object Arguments]', arrayClass = '[object Array]', boolClass = '[object Boolean]', dateClass = '[object Date]', errorClass = '[object Error]', funcClass = '[object Function]', numberClass = '[object Number]', objectClass = '[object Object]', regexpClass = '[object RegExp]', stringClass = '[object String]';
    var cloneableClasses = {};
    cloneableClasses[funcClass] = false;
    cloneableClasses[argsClass] = cloneableClasses[arrayClass] = cloneableClasses[boolClass] = cloneableClasses[dateClass] = cloneableClasses[numberClass] = cloneableClasses[objectClass] = cloneableClasses[regexpClass] = cloneableClasses[stringClass] = true;
    var objectTypes = {
            'boolean': false,
            'function': true,
            'object': true,
            'number': false,
            'string': false,
            'undefined': false
        };
    var stringEscapes = {
            '\\': '\\',
            '\'': '\'',
            '\n': 'n',
            '\r': 'r',
            '\t': 't',
            '\u2028': 'u2028',
            '\u2029': 'u2029'
        };
    var freeExports = objectTypes[typeof exports] && exports;
    var freeModule = objectTypes[typeof module] && module && module.exports == freeExports && module;
    var freeGlobal = objectTypes[typeof global] && global;
    if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
        window = freeGlobal;
    }
    function basicIndexOf(array, value, fromIndex) {
        var index = (fromIndex || 0) - 1, length = array.length;
        while (++index < length) {
            if (array[index] === value) {
                return index;
            }
        }
        return -1;
    }
    function cacheIndexOf(cache, value) {
        var type = typeof value;
        cache = cache.cache;
        if (type == 'boolean' || value == null) {
            return cache[value];
        }
        if (type != 'number' && type != 'string') {
            type = 'object';
        }
        var key = type == 'number' ? value : keyPrefix + value;
        cache = cache[type] || (cache[type] = {});
        return type == 'object' ? cache[key] && basicIndexOf(cache[key], value) > -1 ? 0 : -1 : cache[key] ? 0 : -1;
    }
    function cachePush(value) {
        var cache = this.cache, type = typeof value;
        if (type == 'boolean' || value == null) {
            cache[value] = true;
        } else {
            if (type != 'number' && type != 'string') {
                type = 'object';
            }
            var key = type == 'number' ? value : keyPrefix + value, typeCache = cache[type] || (cache[type] = {});
            if (type == 'object') {
                if ((typeCache[key] || (typeCache[key] = [])).push(value) == this.array.length) {
                    cache[type] = false;
                }
            } else {
                typeCache[key] = true;
            }
        }
    }
    function charAtCallback(value) {
        return value.charCodeAt(0);
    }
    function compareAscending(a, b) {
        var ai = a.index, bi = b.index;
        a = a.criteria;
        b = b.criteria;
        if (a !== b) {
            if (a > b || typeof a == 'undefined') {
                return 1;
            }
            if (a < b || typeof b == 'undefined') {
                return -1;
            }
        }
        return ai < bi ? -1 : 1;
    }
    function createCache(array) {
        var index = -1, length = array.length;
        var cache = getObject();
        cache['false'] = cache['null'] = cache['true'] = cache['undefined'] = false;
        var result = getObject();
        result.array = array;
        result.cache = cache;
        result.push = cachePush;
        while (++index < length) {
            result.push(array[index]);
        }
        return cache.object === false ? (releaseObject(result), null) : result;
    }
    function escapeStringChar(match) {
        return '\\' + stringEscapes[match];
    }
    function getArray() {
        return arrayPool.pop() || [];
    }
    function getObject() {
        return objectPool.pop() || {
            'array': null,
            'cache': null,
            'criteria': null,
            'false': false,
            'index': 0,
            'leading': false,
            'maxWait': 0,
            'null': false,
            'number': null,
            'object': null,
            'push': null,
            'string': null,
            'trailing': false,
            'true': false,
            'undefined': false,
            'value': null
        };
    }
    function noop() {
    }
    function releaseArray(array) {
        array.length = 0;
        if (arrayPool.length < maxPoolSize) {
            arrayPool.push(array);
        }
    }
    function releaseObject(object) {
        var cache = object.cache;
        if (cache) {
            releaseObject(cache);
        }
        object.array = object.cache = object.criteria = object.object = object.number = object.string = object.value = null;
        if (objectPool.length < maxPoolSize) {
            objectPool.push(object);
        }
    }
    function slice(array, start, end) {
        start || (start = 0);
        if (typeof end == 'undefined') {
            end = array ? array.length : 0;
        }
        var index = -1, length = end - start || 0, result = Array(length < 0 ? 0 : length);
        while (++index < length) {
            result[index] = array[start + index];
        }
        return result;
    }
    function runInContext(context) {
        context = context ? _.defaults(window.Object(), context, _.pick(window, contextProps)) : window;
        var Array = context.Array, Boolean = context.Boolean, Date = context.Date, Function = context.Function, Math = context.Math, Number = context.Number, Object = context.Object, RegExp = context.RegExp, String = context.String, TypeError = context.TypeError;
        var arrayRef = [];
        var objectProto = Object.prototype, stringProto = String.prototype;
        var oldDash = context._;
        var reNative = RegExp('^' + String(objectProto.valueOf).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/valueOf|for [^\]]+/g, '.+?') + '$');
        var ceil = Math.ceil, clearTimeout = context.clearTimeout, concat = arrayRef.concat, floor = Math.floor, fnToString = Function.prototype.toString, getPrototypeOf = reNative.test(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf, hasOwnProperty = objectProto.hasOwnProperty, push = arrayRef.push, propertyIsEnumerable = objectProto.propertyIsEnumerable, setImmediate = context.setImmediate, setTimeout = context.setTimeout, toString = objectProto.toString;
        var nativeBind = reNative.test(nativeBind = toString.bind) && nativeBind, nativeCreate = reNative.test(nativeCreate = Object.create) && nativeCreate, nativeIsArray = reNative.test(nativeIsArray = Array.isArray) && nativeIsArray, nativeIsFinite = context.isFinite, nativeIsNaN = context.isNaN, nativeKeys = reNative.test(nativeKeys = Object.keys) && nativeKeys, nativeMax = Math.max, nativeMin = Math.min, nativeParseInt = context.parseInt, nativeRandom = Math.random, nativeSlice = arrayRef.slice;
        var isIeOpera = reNative.test(context.attachEvent), isV8 = nativeBind && !/\n|true/.test(nativeBind + isIeOpera);
        var ctorByClass = {};
        ctorByClass[arrayClass] = Array;
        ctorByClass[boolClass] = Boolean;
        ctorByClass[dateClass] = Date;
        ctorByClass[funcClass] = Function;
        ctorByClass[objectClass] = Object;
        ctorByClass[numberClass] = Number;
        ctorByClass[regexpClass] = RegExp;
        ctorByClass[stringClass] = String;
        function lodash(value) {
            return value && typeof value == 'object' && !isArray(value) && hasOwnProperty.call(value, '__wrapped__') ? value : new lodashWrapper(value);
        }
        function lodashWrapper(value) {
            this.__wrapped__ = value;
        }
        lodashWrapper.prototype = lodash.prototype;
        var support = lodash.support = {};
        support.fastBind = nativeBind && !isV8;
        lodash.templateSettings = {
            'escape': /<%-([\s\S]+?)%>/g,
            'evaluate': /<%([\s\S]+?)%>/g,
            'interpolate': reInterpolate,
            'variable': '',
            'imports': { '_': lodash }
        };
        function createBound(func, thisArg, partialArgs, indicator) {
            var isFunc = isFunction(func), isPartial = !partialArgs, key = thisArg;
            if (isPartial) {
                var rightIndicator = indicator;
                partialArgs = thisArg;
            } else if (!isFunc) {
                if (!indicator) {
                    throw new TypeError();
                }
                thisArg = func;
            }
            function bound() {
                var args = arguments, thisBinding = isPartial ? this : thisArg;
                if (!isFunc) {
                    func = thisArg[key];
                }
                if (partialArgs.length) {
                    args = args.length ? (args = nativeSlice.call(args), rightIndicator ? args.concat(partialArgs) : partialArgs.concat(args)) : partialArgs;
                }
                if (this instanceof bound) {
                    thisBinding = createObject(func.prototype);
                    var result = func.apply(thisBinding, args);
                    return isObject(result) ? result : thisBinding;
                }
                return func.apply(thisBinding, args);
            }
            return bound;
        }
        function createObject(prototype) {
            return isObject(prototype) ? nativeCreate(prototype) : {};
        }
        function escapeHtmlChar(match) {
            return htmlEscapes[match];
        }
        function getIndexOf(array, value, fromIndex) {
            var result = (result = lodash.indexOf) === indexOf ? basicIndexOf : result;
            return result;
        }
        function overloadWrapper(func) {
            return function (array, flag, callback, thisArg) {
                if (typeof flag != 'boolean' && flag != null) {
                    thisArg = callback;
                    callback = !(thisArg && thisArg[flag] === array) ? flag : undefined;
                    flag = false;
                }
                if (callback != null) {
                    callback = lodash.createCallback(callback, thisArg);
                }
                return func(array, flag, callback, thisArg);
            };
        }
        function shimIsPlainObject(value) {
            var ctor, result;
            if (!(value && toString.call(value) == objectClass) || (ctor = value.constructor, isFunction(ctor) && !(ctor instanceof ctor))) {
                return false;
            }
            forIn(value, function (value, key) {
                result = key;
            });
            return result === undefined || hasOwnProperty.call(value, result);
        }
        function unescapeHtmlChar(match) {
            return htmlUnescapes[match];
        }
        function isArguments(value) {
            return toString.call(value) == argsClass;
        }
        var isArray = nativeIsArray;
        var shimKeys = function (object) {
            var index, iterable = object, result = [];
            if (!iterable)
                return result;
            if (!objectTypes[typeof object])
                return result;
            for (index in iterable) {
                if (hasOwnProperty.call(iterable, index)) {
                    result.push(index);
                }
            }
            return result;
        };
        var keys = !nativeKeys ? shimKeys : function (object) {
                if (!isObject(object)) {
                    return [];
                }
                return nativeKeys(object);
            };
        var htmlEscapes = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                '\'': '&#39;'
            };
        var htmlUnescapes = invert(htmlEscapes);
        var assign = function (object, source, guard) {
            var index, iterable = object, result = iterable;
            if (!iterable)
                return result;
            var args = arguments, argsIndex = 0, argsLength = typeof guard == 'number' ? 2 : args.length;
            if (argsLength > 3 && typeof args[argsLength - 2] == 'function') {
                var callback = lodash.createCallback(args[--argsLength - 1], args[argsLength--], 2);
            } else if (argsLength > 2 && typeof args[argsLength - 1] == 'function') {
                callback = args[--argsLength];
            }
            while (++argsIndex < argsLength) {
                iterable = args[argsIndex];
                if (iterable && objectTypes[typeof iterable]) {
                    var ownIndex = -1, ownProps = objectTypes[typeof iterable] && keys(iterable), length = ownProps ? ownProps.length : 0;
                    while (++ownIndex < length) {
                        index = ownProps[ownIndex];
                        result[index] = callback ? callback(result[index], iterable[index]) : iterable[index];
                    }
                }
            }
            return result;
        };
        function clone(value, deep, callback, thisArg, stackA, stackB) {
            var result = value;
            if (typeof deep != 'boolean' && deep != null) {
                thisArg = callback;
                callback = deep;
                deep = false;
            }
            if (typeof callback == 'function') {
                callback = typeof thisArg == 'undefined' ? callback : lodash.createCallback(callback, thisArg, 1);
                result = callback(result);
                if (typeof result != 'undefined') {
                    return result;
                }
                result = value;
            }
            var isObj = isObject(result);
            if (isObj) {
                var className = toString.call(result);
                if (!cloneableClasses[className]) {
                    return result;
                }
                var isArr = isArray(result);
            }
            if (!isObj || !deep) {
                return isObj ? isArr ? slice(result) : assign({}, result) : result;
            }
            var ctor = ctorByClass[className];
            switch (className) {
            case boolClass:
            case dateClass:
                return new ctor(+result);
            case numberClass:
            case stringClass:
                return new ctor(result);
            case regexpClass:
                return ctor(result.source, reFlags.exec(result));
            }
            var initedStack = !stackA;
            stackA || (stackA = getArray());
            stackB || (stackB = getArray());
            var length = stackA.length;
            while (length--) {
                if (stackA[length] == value) {
                    return stackB[length];
                }
            }
            result = isArr ? ctor(result.length) : {};
            if (isArr) {
                if (hasOwnProperty.call(value, 'index')) {
                    result.index = value.index;
                }
                if (hasOwnProperty.call(value, 'input')) {
                    result.input = value.input;
                }
            }
            stackA.push(value);
            stackB.push(result);
            (isArr ? forEach : forOwn)(value, function (objValue, key) {
                result[key] = clone(objValue, deep, callback, undefined, stackA, stackB);
            });
            if (initedStack) {
                releaseArray(stackA);
                releaseArray(stackB);
            }
            return result;
        }
        function cloneDeep(value, callback, thisArg) {
            return clone(value, true, callback, thisArg);
        }
        var defaults = function (object, source, guard) {
            var index, iterable = object, result = iterable;
            if (!iterable)
                return result;
            var args = arguments, argsIndex = 0, argsLength = typeof guard == 'number' ? 2 : args.length;
            while (++argsIndex < argsLength) {
                iterable = args[argsIndex];
                if (iterable && objectTypes[typeof iterable]) {
                    var ownIndex = -1, ownProps = objectTypes[typeof iterable] && keys(iterable), length = ownProps ? ownProps.length : 0;
                    while (++ownIndex < length) {
                        index = ownProps[ownIndex];
                        if (typeof result[index] == 'undefined')
                            result[index] = iterable[index];
                    }
                }
            }
            return result;
        };
        function findKey(object, callback, thisArg) {
            var result;
            callback = lodash.createCallback(callback, thisArg);
            forOwn(object, function (value, key, object) {
                if (callback(value, key, object)) {
                    result = key;
                    return false;
                }
            });
            return result;
        }
        var forIn = function (collection, callback, thisArg) {
            var index, iterable = collection, result = iterable;
            if (!iterable)
                return result;
            if (!objectTypes[typeof iterable])
                return result;
            callback = callback && typeof thisArg == 'undefined' ? callback : lodash.createCallback(callback, thisArg);
            for (index in iterable) {
                if (callback(iterable[index], index, collection) === false)
                    return result;
            }
            return result;
        };
        var forOwn = function (collection, callback, thisArg) {
            var index, iterable = collection, result = iterable;
            if (!iterable)
                return result;
            if (!objectTypes[typeof iterable])
                return result;
            callback = callback && typeof thisArg == 'undefined' ? callback : lodash.createCallback(callback, thisArg);
            var ownIndex = -1, ownProps = objectTypes[typeof iterable] && keys(iterable), length = ownProps ? ownProps.length : 0;
            while (++ownIndex < length) {
                index = ownProps[ownIndex];
                if (callback(iterable[index], index, collection) === false)
                    return result;
            }
            return result;
        };
        function functions(object) {
            var result = [];
            forIn(object, function (value, key) {
                if (isFunction(value)) {
                    result.push(key);
                }
            });
            return result.sort();
        }
        function has(object, property) {
            return object ? hasOwnProperty.call(object, property) : false;
        }
        function invert(object) {
            var index = -1, props = keys(object), length = props.length, result = {};
            while (++index < length) {
                var key = props[index];
                result[object[key]] = key;
            }
            return result;
        }
        function isBoolean(value) {
            return value === true || value === false || toString.call(value) == boolClass;
        }
        function isDate(value) {
            return value ? typeof value == 'object' && toString.call(value) == dateClass : false;
        }
        function isElement(value) {
            return value ? value.nodeType === 1 : false;
        }
        function isEmpty(value) {
            var result = true;
            if (!value) {
                return result;
            }
            var className = toString.call(value), length = value.length;
            if (className == arrayClass || className == stringClass || className == argsClass || className == objectClass && typeof length == 'number' && isFunction(value.splice)) {
                return !length;
            }
            forOwn(value, function () {
                return result = false;
            });
            return result;
        }
        function isEqual(a, b, callback, thisArg, stackA, stackB) {
            var whereIndicator = callback === indicatorObject;
            if (typeof callback == 'function' && !whereIndicator) {
                callback = lodash.createCallback(callback, thisArg, 2);
                var result = callback(a, b);
                if (typeof result != 'undefined') {
                    return !!result;
                }
            }
            if (a === b) {
                return a !== 0 || 1 / a == 1 / b;
            }
            var type = typeof a, otherType = typeof b;
            if (a === a && (!a || type != 'function' && type != 'object') && (!b || otherType != 'function' && otherType != 'object')) {
                return false;
            }
            if (a == null || b == null) {
                return a === b;
            }
            var className = toString.call(a), otherClass = toString.call(b);
            if (className == argsClass) {
                className = objectClass;
            }
            if (otherClass == argsClass) {
                otherClass = objectClass;
            }
            if (className != otherClass) {
                return false;
            }
            switch (className) {
            case boolClass:
            case dateClass:
                return +a == +b;
            case numberClass:
                return a != +a ? b != +b : a == 0 ? 1 / a == 1 / b : a == +b;
            case regexpClass:
            case stringClass:
                return a == String(b);
            }
            var isArr = className == arrayClass;
            if (!isArr) {
                if (hasOwnProperty.call(a, '__wrapped__ ') || hasOwnProperty.call(b, '__wrapped__')) {
                    return isEqual(a.__wrapped__ || a, b.__wrapped__ || b, callback, thisArg, stackA, stackB);
                }
                if (className != objectClass) {
                    return false;
                }
                var ctorA = a.constructor, ctorB = b.constructor;
                if (ctorA != ctorB && !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB)) {
                    return false;
                }
            }
            var initedStack = !stackA;
            stackA || (stackA = getArray());
            stackB || (stackB = getArray());
            var length = stackA.length;
            while (length--) {
                if (stackA[length] == a) {
                    return stackB[length] == b;
                }
            }
            var size = 0;
            result = true;
            stackA.push(a);
            stackB.push(b);
            if (isArr) {
                length = a.length;
                size = b.length;
                result = size == a.length;
                if (!result && !whereIndicator) {
                    return result;
                }
                while (size--) {
                    var index = length, value = b[size];
                    if (whereIndicator) {
                        while (index--) {
                            if (result = isEqual(a[index], value, callback, thisArg, stackA, stackB)) {
                                break;
                            }
                        }
                    } else if (!(result = isEqual(a[size], value, callback, thisArg, stackA, stackB))) {
                        break;
                    }
                }
                return result;
            }
            forIn(b, function (value, key, b) {
                if (hasOwnProperty.call(b, key)) {
                    size++;
                    return result = hasOwnProperty.call(a, key) && isEqual(a[key], value, callback, thisArg, stackA, stackB);
                }
            });
            if (result && !whereIndicator) {
                forIn(a, function (value, key, a) {
                    if (hasOwnProperty.call(a, key)) {
                        return result = --size > -1;
                    }
                });
            }
            if (initedStack) {
                releaseArray(stackA);
                releaseArray(stackB);
            }
            return result;
        }
        function isFinite(value) {
            return nativeIsFinite(value) && !nativeIsNaN(parseFloat(value));
        }
        function isFunction(value) {
            return typeof value == 'function';
        }
        function isObject(value) {
            return !!(value && objectTypes[typeof value]);
        }
        function isNaN(value) {
            return isNumber(value) && value != +value;
        }
        function isNull(value) {
            return value === null;
        }
        function isNumber(value) {
            return typeof value == 'number' || toString.call(value) == numberClass;
        }
        var isPlainObject = function (value) {
            if (!(value && toString.call(value) == objectClass)) {
                return false;
            }
            var valueOf = value.valueOf, objProto = typeof valueOf == 'function' && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);
            return objProto ? value == objProto || getPrototypeOf(value) == objProto : shimIsPlainObject(value);
        };
        function isRegExp(value) {
            return value ? typeof value == 'object' && toString.call(value) == regexpClass : false;
        }
        function isString(value) {
            return typeof value == 'string' || toString.call(value) == stringClass;
        }
        function isUndefined(value) {
            return typeof value == 'undefined';
        }
        function merge(object, source, deepIndicator) {
            var args = arguments, index = 0, length = 2;
            if (!isObject(object)) {
                return object;
            }
            if (deepIndicator === indicatorObject) {
                var callback = args[3], stackA = args[4], stackB = args[5];
            } else {
                var initedStack = true;
                stackA = getArray();
                stackB = getArray();
                if (typeof deepIndicator != 'number') {
                    length = args.length;
                }
                if (length > 3 && typeof args[length - 2] == 'function') {
                    callback = lodash.createCallback(args[--length - 1], args[length--], 2);
                } else if (length > 2 && typeof args[length - 1] == 'function') {
                    callback = args[--length];
                }
            }
            while (++index < length) {
                (isArray(args[index]) ? forEach : forOwn)(args[index], function (source, key) {
                    var found, isArr, result = source, value = object[key];
                    if (source && ((isArr = isArray(source)) || isPlainObject(source))) {
                        var stackLength = stackA.length;
                        while (stackLength--) {
                            if (found = stackA[stackLength] == source) {
                                value = stackB[stackLength];
                                break;
                            }
                        }
                        if (!found) {
                            var isShallow;
                            if (callback) {
                                result = callback(value, source);
                                if (isShallow = typeof result != 'undefined') {
                                    value = result;
                                }
                            }
                            if (!isShallow) {
                                value = isArr ? isArray(value) ? value : [] : isPlainObject(value) ? value : {};
                            }
                            stackA.push(source);
                            stackB.push(value);
                            if (!isShallow) {
                                value = merge(value, source, indicatorObject, callback, stackA, stackB);
                            }
                        }
                    } else {
                        if (callback) {
                            result = callback(value, source);
                            if (typeof result == 'undefined') {
                                result = source;
                            }
                        }
                        if (typeof result != 'undefined') {
                            value = result;
                        }
                    }
                    object[key] = value;
                });
            }
            if (initedStack) {
                releaseArray(stackA);
                releaseArray(stackB);
            }
            return object;
        }
        function omit(object, callback, thisArg) {
            var indexOf = getIndexOf(), isFunc = typeof callback == 'function', result = {};
            if (isFunc) {
                callback = lodash.createCallback(callback, thisArg);
            } else {
                var props = concat.apply(arrayRef, nativeSlice.call(arguments, 1));
            }
            forIn(object, function (value, key, object) {
                if (isFunc ? !callback(value, key, object) : indexOf(props, key) < 0) {
                    result[key] = value;
                }
            });
            return result;
        }
        function pairs(object) {
            var index = -1, props = keys(object), length = props.length, result = Array(length);
            while (++index < length) {
                var key = props[index];
                result[index] = [
                    key,
                    object[key]
                ];
            }
            return result;
        }
        function pick(object, callback, thisArg) {
            var result = {};
            if (typeof callback != 'function') {
                var index = -1, props = concat.apply(arrayRef, nativeSlice.call(arguments, 1)), length = isObject(object) ? props.length : 0;
                while (++index < length) {
                    var key = props[index];
                    if (key in object) {
                        result[key] = object[key];
                    }
                }
            } else {
                callback = lodash.createCallback(callback, thisArg);
                forIn(object, function (value, key, object) {
                    if (callback(value, key, object)) {
                        result[key] = value;
                    }
                });
            }
            return result;
        }
        function transform(object, callback, accumulator, thisArg) {
            var isArr = isArray(object);
            callback = lodash.createCallback(callback, thisArg, 4);
            if (accumulator == null) {
                if (isArr) {
                    accumulator = [];
                } else {
                    var ctor = object && object.constructor, proto = ctor && ctor.prototype;
                    accumulator = createObject(proto);
                }
            }
            (isArr ? forEach : forOwn)(object, function (value, index, object) {
                return callback(accumulator, value, index, object);
            });
            return accumulator;
        }
        function values(object) {
            var index = -1, props = keys(object), length = props.length, result = Array(length);
            while (++index < length) {
                result[index] = object[props[index]];
            }
            return result;
        }
        function at(collection) {
            var index = -1, props = concat.apply(arrayRef, nativeSlice.call(arguments, 1)), length = props.length, result = Array(length);
            while (++index < length) {
                result[index] = collection[props[index]];
            }
            return result;
        }
        function contains(collection, target, fromIndex) {
            var index = -1, indexOf = getIndexOf(), length = collection ? collection.length : 0, result = false;
            fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex) || 0;
            if (length && typeof length == 'number') {
                result = (isString(collection) ? collection.indexOf(target, fromIndex) : indexOf(collection, target, fromIndex)) > -1;
            } else {
                forOwn(collection, function (value) {
                    if (++index >= fromIndex) {
                        return !(result = value === target);
                    }
                });
            }
            return result;
        }
        function countBy(collection, callback, thisArg) {
            var result = {};
            callback = lodash.createCallback(callback, thisArg);
            forEach(collection, function (value, key, collection) {
                key = String(callback(value, key, collection));
                hasOwnProperty.call(result, key) ? result[key]++ : result[key] = 1;
            });
            return result;
        }
        function every(collection, callback, thisArg) {
            var result = true;
            callback = lodash.createCallback(callback, thisArg);
            var index = -1, length = collection ? collection.length : 0;
            if (typeof length == 'number') {
                while (++index < length) {
                    if (!(result = !!callback(collection[index], index, collection))) {
                        break;
                    }
                }
            } else {
                forOwn(collection, function (value, index, collection) {
                    return result = !!callback(value, index, collection);
                });
            }
            return result;
        }
        function filter(collection, callback, thisArg) {
            var result = [];
            callback = lodash.createCallback(callback, thisArg);
            var index = -1, length = collection ? collection.length : 0;
            if (typeof length == 'number') {
                while (++index < length) {
                    var value = collection[index];
                    if (callback(value, index, collection)) {
                        result.push(value);
                    }
                }
            } else {
                forOwn(collection, function (value, index, collection) {
                    if (callback(value, index, collection)) {
                        result.push(value);
                    }
                });
            }
            return result;
        }
        function find(collection, callback, thisArg) {
            callback = lodash.createCallback(callback, thisArg);
            var index = -1, length = collection ? collection.length : 0;
            if (typeof length == 'number') {
                while (++index < length) {
                    var value = collection[index];
                    if (callback(value, index, collection)) {
                        return value;
                    }
                }
            } else {
                var result;
                forOwn(collection, function (value, index, collection) {
                    if (callback(value, index, collection)) {
                        result = value;
                        return false;
                    }
                });
                return result;
            }
        }
        function forEach(collection, callback, thisArg) {
            var index = -1, length = collection ? collection.length : 0;
            callback = callback && typeof thisArg == 'undefined' ? callback : lodash.createCallback(callback, thisArg);
            if (typeof length == 'number') {
                while (++index < length) {
                    if (callback(collection[index], index, collection) === false) {
                        break;
                    }
                }
            } else {
                forOwn(collection, callback);
            }
            return collection;
        }
        function groupBy(collection, callback, thisArg) {
            var result = {};
            callback = lodash.createCallback(callback, thisArg);
            forEach(collection, function (value, key, collection) {
                key = String(callback(value, key, collection));
                (hasOwnProperty.call(result, key) ? result[key] : result[key] = []).push(value);
            });
            return result;
        }
        function invoke(collection, methodName) {
            var args = nativeSlice.call(arguments, 2), index = -1, isFunc = typeof methodName == 'function', length = collection ? collection.length : 0, result = Array(typeof length == 'number' ? length : 0);
            forEach(collection, function (value) {
                result[++index] = (isFunc ? methodName : value[methodName]).apply(value, args);
            });
            return result;
        }
        function map(collection, callback, thisArg) {
            var index = -1, length = collection ? collection.length : 0;
            callback = lodash.createCallback(callback, thisArg);
            if (typeof length == 'number') {
                var result = Array(length);
                while (++index < length) {
                    result[index] = callback(collection[index], index, collection);
                }
            } else {
                result = [];
                forOwn(collection, function (value, key, collection) {
                    result[++index] = callback(value, key, collection);
                });
            }
            return result;
        }
        function max(collection, callback, thisArg) {
            var computed = -Infinity, result = computed;
            if (!callback && isArray(collection)) {
                var index = -1, length = collection.length;
                while (++index < length) {
                    var value = collection[index];
                    if (value > result) {
                        result = value;
                    }
                }
            } else {
                callback = !callback && isString(collection) ? charAtCallback : lodash.createCallback(callback, thisArg);
                forEach(collection, function (value, index, collection) {
                    var current = callback(value, index, collection);
                    if (current > computed) {
                        computed = current;
                        result = value;
                    }
                });
            }
            return result;
        }
        function min(collection, callback, thisArg) {
            var computed = Infinity, result = computed;
            if (!callback && isArray(collection)) {
                var index = -1, length = collection.length;
                while (++index < length) {
                    var value = collection[index];
                    if (value < result) {
                        result = value;
                    }
                }
            } else {
                callback = !callback && isString(collection) ? charAtCallback : lodash.createCallback(callback, thisArg);
                forEach(collection, function (value, index, collection) {
                    var current = callback(value, index, collection);
                    if (current < computed) {
                        computed = current;
                        result = value;
                    }
                });
            }
            return result;
        }
        function pluck(collection, property) {
            var index = -1, length = collection ? collection.length : 0;
            if (typeof length == 'number') {
                var result = Array(length);
                while (++index < length) {
                    result[index] = collection[index][property];
                }
            }
            return result || map(collection, property);
        }
        function reduce(collection, callback, accumulator, thisArg) {
            if (!collection)
                return accumulator;
            var noaccum = arguments.length < 3;
            callback = lodash.createCallback(callback, thisArg, 4);
            var index = -1, length = collection.length;
            if (typeof length == 'number') {
                if (noaccum) {
                    accumulator = collection[++index];
                }
                while (++index < length) {
                    accumulator = callback(accumulator, collection[index], index, collection);
                }
            } else {
                forOwn(collection, function (value, index, collection) {
                    accumulator = noaccum ? (noaccum = false, value) : callback(accumulator, value, index, collection);
                });
            }
            return accumulator;
        }
        function reduceRight(collection, callback, accumulator, thisArg) {
            var iterable = collection, length = collection ? collection.length : 0, noaccum = arguments.length < 3;
            if (typeof length != 'number') {
                var props = keys(collection);
                length = props.length;
            }
            callback = lodash.createCallback(callback, thisArg, 4);
            forEach(collection, function (value, index, collection) {
                index = props ? props[--length] : --length;
                accumulator = noaccum ? (noaccum = false, iterable[index]) : callback(accumulator, iterable[index], index, collection);
            });
            return accumulator;
        }
        function reject(collection, callback, thisArg) {
            callback = lodash.createCallback(callback, thisArg);
            return filter(collection, function (value, index, collection) {
                return !callback(value, index, collection);
            });
        }
        function shuffle(collection) {
            var index = -1, length = collection ? collection.length : 0, result = Array(typeof length == 'number' ? length : 0);
            forEach(collection, function (value) {
                var rand = floor(nativeRandom() * (++index + 1));
                result[index] = result[rand];
                result[rand] = value;
            });
            return result;
        }
        function size(collection) {
            var length = collection ? collection.length : 0;
            return typeof length == 'number' ? length : keys(collection).length;
        }
        function some(collection, callback, thisArg) {
            var result;
            callback = lodash.createCallback(callback, thisArg);
            var index = -1, length = collection ? collection.length : 0;
            if (typeof length == 'number') {
                while (++index < length) {
                    if (result = callback(collection[index], index, collection)) {
                        break;
                    }
                }
            } else {
                forOwn(collection, function (value, index, collection) {
                    return !(result = callback(value, index, collection));
                });
            }
            return !!result;
        }
        function sortBy(collection, callback, thisArg) {
            var index = -1, length = collection ? collection.length : 0, result = Array(typeof length == 'number' ? length : 0);
            callback = lodash.createCallback(callback, thisArg);
            forEach(collection, function (value, key, collection) {
                var object = result[++index] = getObject();
                object.criteria = callback(value, key, collection);
                object.index = index;
                object.value = value;
            });
            length = result.length;
            result.sort(compareAscending);
            while (length--) {
                var object = result[length];
                result[length] = object.value;
                releaseObject(object);
            }
            return result;
        }
        function toArray(collection) {
            if (collection && typeof collection.length == 'number') {
                return slice(collection);
            }
            return values(collection);
        }
        var where = filter;
        function compact(array) {
            var index = -1, length = array ? array.length : 0, result = [];
            while (++index < length) {
                var value = array[index];
                if (value) {
                    result.push(value);
                }
            }
            return result;
        }
        function difference(array) {
            var index = -1, indexOf = getIndexOf(), length = array ? array.length : 0, seen = concat.apply(arrayRef, nativeSlice.call(arguments, 1)), result = [];
            var isLarge = length >= largeArraySize && indexOf === basicIndexOf;
            if (isLarge) {
                var cache = createCache(seen);
                if (cache) {
                    indexOf = cacheIndexOf;
                    seen = cache;
                } else {
                    isLarge = false;
                }
            }
            while (++index < length) {
                var value = array[index];
                if (indexOf(seen, value) < 0) {
                    result.push(value);
                }
            }
            if (isLarge) {
                releaseObject(seen);
            }
            return result;
        }
        function findIndex(array, callback, thisArg) {
            var index = -1, length = array ? array.length : 0;
            callback = lodash.createCallback(callback, thisArg);
            while (++index < length) {
                if (callback(array[index], index, array)) {
                    return index;
                }
            }
            return -1;
        }
        function first(array, callback, thisArg) {
            if (array) {
                var n = 0, length = array.length;
                if (typeof callback != 'number' && callback != null) {
                    var index = -1;
                    callback = lodash.createCallback(callback, thisArg);
                    while (++index < length && callback(array[index], index, array)) {
                        n++;
                    }
                } else {
                    n = callback;
                    if (n == null || thisArg) {
                        return array[0];
                    }
                }
                return slice(array, 0, nativeMin(nativeMax(0, n), length));
            }
        }
        var flatten = overloadWrapper(function flatten(array, isShallow, callback) {
                var index = -1, length = array ? array.length : 0, result = [];
                while (++index < length) {
                    var value = array[index];
                    if (callback) {
                        value = callback(value, index, array);
                    }
                    if (isArray(value)) {
                        push.apply(result, isShallow ? value : flatten(value));
                    } else {
                        result.push(value);
                    }
                }
                return result;
            });
        function indexOf(array, value, fromIndex) {
            if (typeof fromIndex == 'number') {
                var length = array ? array.length : 0;
                fromIndex = fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex || 0;
            } else if (fromIndex) {
                var index = sortedIndex(array, value);
                return array[index] === value ? index : -1;
            }
            return array ? basicIndexOf(array, value, fromIndex) : -1;
        }
        function initial(array, callback, thisArg) {
            if (!array) {
                return [];
            }
            var n = 0, length = array.length;
            if (typeof callback != 'number' && callback != null) {
                var index = length;
                callback = lodash.createCallback(callback, thisArg);
                while (index-- && callback(array[index], index, array)) {
                    n++;
                }
            } else {
                n = callback == null || thisArg ? 1 : callback || n;
            }
            return slice(array, 0, nativeMin(nativeMax(0, length - n), length));
        }
        function intersection(array) {
            var args = arguments, argsLength = args.length, argsIndex = -1, caches = getArray(), index = -1, indexOf = getIndexOf(), length = array ? array.length : 0, result = [], seen = getArray();
            while (++argsIndex < argsLength) {
                var value = args[argsIndex];
                caches[argsIndex] = indexOf === basicIndexOf && (value ? value.length : 0) >= largeArraySize && createCache(argsIndex ? args[argsIndex] : seen);
            }
            outer:
                while (++index < length) {
                    var cache = caches[0];
                    value = array[index];
                    if ((cache ? cacheIndexOf(cache, value) : indexOf(seen, value)) < 0) {
                        argsIndex = argsLength;
                        (cache || seen).push(value);
                        while (--argsIndex) {
                            cache = caches[argsIndex];
                            if ((cache ? cacheIndexOf(cache, value) : indexOf(args[argsIndex], value)) < 0) {
                                continue outer;
                            }
                        }
                        result.push(value);
                    }
                }
            while (argsLength--) {
                cache = caches[argsLength];
                if (cache) {
                    releaseObject(cache);
                }
            }
            releaseArray(caches);
            releaseArray(seen);
            return result;
        }
        function last(array, callback, thisArg) {
            if (array) {
                var n = 0, length = array.length;
                if (typeof callback != 'number' && callback != null) {
                    var index = length;
                    callback = lodash.createCallback(callback, thisArg);
                    while (index-- && callback(array[index], index, array)) {
                        n++;
                    }
                } else {
                    n = callback;
                    if (n == null || thisArg) {
                        return array[length - 1];
                    }
                }
                return slice(array, nativeMax(0, length - n));
            }
        }
        function lastIndexOf(array, value, fromIndex) {
            var index = array ? array.length : 0;
            if (typeof fromIndex == 'number') {
                index = (fromIndex < 0 ? nativeMax(0, index + fromIndex) : nativeMin(fromIndex, index - 1)) + 1;
            }
            while (index--) {
                if (array[index] === value) {
                    return index;
                }
            }
            return -1;
        }
        function range(start, end, step) {
            start = +start || 0;
            step = +step || 1;
            if (end == null) {
                end = start;
                start = 0;
            }
            var index = -1, length = nativeMax(0, ceil((end - start) / step)), result = Array(length);
            while (++index < length) {
                result[index] = start;
                start += step;
            }
            return result;
        }
        function rest(array, callback, thisArg) {
            if (typeof callback != 'number' && callback != null) {
                var n = 0, index = -1, length = array ? array.length : 0;
                callback = lodash.createCallback(callback, thisArg);
                while (++index < length && callback(array[index], index, array)) {
                    n++;
                }
            } else {
                n = callback == null || thisArg ? 1 : nativeMax(0, callback);
            }
            return slice(array, n);
        }
        function sortedIndex(array, value, callback, thisArg) {
            var low = 0, high = array ? array.length : low;
            callback = callback ? lodash.createCallback(callback, thisArg, 1) : identity;
            value = callback(value);
            while (low < high) {
                var mid = low + high >>> 1;
                callback(array[mid]) < value ? low = mid + 1 : high = mid;
            }
            return low;
        }
        function union(array) {
            if (!isArray(array)) {
                arguments[0] = array ? nativeSlice.call(array) : arrayRef;
            }
            return uniq(concat.apply(arrayRef, arguments));
        }
        var uniq = overloadWrapper(function (array, isSorted, callback) {
                var index = -1, indexOf = getIndexOf(), length = array ? array.length : 0, result = [];
                var isLarge = !isSorted && length >= largeArraySize && indexOf === basicIndexOf, seen = callback || isLarge ? getArray() : result;
                if (isLarge) {
                    var cache = createCache(seen);
                    if (cache) {
                        indexOf = cacheIndexOf;
                        seen = cache;
                    } else {
                        isLarge = false;
                        seen = callback ? seen : (releaseArray(seen), result);
                    }
                }
                while (++index < length) {
                    var value = array[index], computed = callback ? callback(value, index, array) : value;
                    if (isSorted ? !index || seen[seen.length - 1] !== computed : indexOf(seen, computed) < 0) {
                        if (callback || isLarge) {
                            seen.push(computed);
                        }
                        result.push(value);
                    }
                }
                if (isLarge) {
                    releaseArray(seen.array);
                    releaseObject(seen);
                } else if (callback) {
                    releaseArray(seen);
                }
                return result;
            });
        function unzip(array) {
            var index = -1, length = array ? max(pluck(array, 'length')) : 0, result = Array(length < 0 ? 0 : length);
            while (++index < length) {
                result[index] = pluck(array, index);
            }
            return result;
        }
        function without(array) {
            return difference(array, nativeSlice.call(arguments, 1));
        }
        function zip(array) {
            return array ? unzip(arguments) : [];
        }
        function zipObject(keys, values) {
            var index = -1, length = keys ? keys.length : 0, result = {};
            while (++index < length) {
                var key = keys[index];
                if (values) {
                    result[key] = values[index];
                } else {
                    result[key[0]] = key[1];
                }
            }
            return result;
        }
        function after(n, func) {
            if (n < 1) {
                return func();
            }
            return function () {
                if (--n < 1) {
                    return func.apply(this, arguments);
                }
            };
        }
        function bind(func, thisArg) {
            return support.fastBind || nativeBind && arguments.length > 2 ? nativeBind.call.apply(nativeBind, arguments) : createBound(func, thisArg, nativeSlice.call(arguments, 2));
        }
        function bindAll(object) {
            var funcs = arguments.length > 1 ? concat.apply(arrayRef, nativeSlice.call(arguments, 1)) : functions(object), index = -1, length = funcs.length;
            while (++index < length) {
                var key = funcs[index];
                object[key] = bind(object[key], object);
            }
            return object;
        }
        function bindKey(object, key) {
            return createBound(object, key, nativeSlice.call(arguments, 2), indicatorObject);
        }
        function compose() {
            var funcs = arguments;
            return function () {
                var args = arguments, length = funcs.length;
                while (length--) {
                    args = [funcs[length].apply(this, args)];
                }
                return args[0];
            };
        }
        function createCallback(func, thisArg, argCount) {
            if (func == null) {
                return identity;
            }
            var type = typeof func;
            if (type != 'function') {
                if (type != 'object') {
                    return function (object) {
                        return object[func];
                    };
                }
                var props = keys(func);
                return function (object) {
                    var length = props.length, result = false;
                    while (length--) {
                        if (!(result = isEqual(object[props[length]], func[props[length]], indicatorObject))) {
                            break;
                        }
                    }
                    return result;
                };
            }
            if (typeof thisArg == 'undefined' || reThis && !reThis.test(fnToString.call(func))) {
                return func;
            }
            if (argCount === 1) {
                return function (value) {
                    return func.call(thisArg, value);
                };
            }
            if (argCount === 2) {
                return function (a, b) {
                    return func.call(thisArg, a, b);
                };
            }
            if (argCount === 4) {
                return function (accumulator, value, index, collection) {
                    return func.call(thisArg, accumulator, value, index, collection);
                };
            }
            return function (value, index, collection) {
                return func.call(thisArg, value, index, collection);
            };
        }
        function debounce(func, wait, options) {
            var args, result, thisArg, callCount = 0, lastCalled = 0, maxWait = false, maxTimeoutId = null, timeoutId = null, trailing = true;
            function clear() {
                clearTimeout(maxTimeoutId);
                clearTimeout(timeoutId);
                callCount = 0;
                maxTimeoutId = timeoutId = null;
            }
            function delayed() {
                var isCalled = trailing && (!leading || callCount > 1);
                clear();
                if (isCalled) {
                    if (maxWait !== false) {
                        lastCalled = new Date();
                    }
                    result = func.apply(thisArg, args);
                }
            }
            function maxDelayed() {
                clear();
                if (trailing || maxWait !== wait) {
                    lastCalled = new Date();
                    result = func.apply(thisArg, args);
                }
            }
            wait = nativeMax(0, wait || 0);
            if (options === true) {
                var leading = true;
                trailing = false;
            } else if (isObject(options)) {
                leading = options.leading;
                maxWait = 'maxWait' in options && nativeMax(wait, options.maxWait || 0);
                trailing = 'trailing' in options ? options.trailing : trailing;
            }
            return function () {
                args = arguments;
                thisArg = this;
                callCount++;
                clearTimeout(timeoutId);
                if (maxWait === false) {
                    if (leading && callCount < 2) {
                        result = func.apply(thisArg, args);
                    }
                } else {
                    var now = new Date();
                    if (!maxTimeoutId && !leading) {
                        lastCalled = now;
                    }
                    var remaining = maxWait - (now - lastCalled);
                    if (remaining <= 0) {
                        clearTimeout(maxTimeoutId);
                        maxTimeoutId = null;
                        lastCalled = now;
                        result = func.apply(thisArg, args);
                    } else if (!maxTimeoutId) {
                        maxTimeoutId = setTimeout(maxDelayed, remaining);
                    }
                }
                if (wait !== maxWait) {
                    timeoutId = setTimeout(delayed, wait);
                }
                return result;
            };
        }
        function defer(func) {
            var args = nativeSlice.call(arguments, 1);
            return setTimeout(function () {
                func.apply(undefined, args);
            }, 1);
        }
        if (isV8 && freeModule && typeof setImmediate == 'function') {
            defer = bind(setImmediate, context);
        }
        function delay(func, wait) {
            var args = nativeSlice.call(arguments, 2);
            return setTimeout(function () {
                func.apply(undefined, args);
            }, wait);
        }
        function memoize(func, resolver) {
            function memoized() {
                var cache = memoized.cache, key = keyPrefix + (resolver ? resolver.apply(this, arguments) : arguments[0]);
                return hasOwnProperty.call(cache, key) ? cache[key] : cache[key] = func.apply(this, arguments);
            }
            memoized.cache = {};
            return memoized;
        }
        function once(func) {
            var ran, result;
            return function () {
                if (ran) {
                    return result;
                }
                ran = true;
                result = func.apply(this, arguments);
                func = null;
                return result;
            };
        }
        function partial(func) {
            return createBound(func, nativeSlice.call(arguments, 1));
        }
        function partialRight(func) {
            return createBound(func, nativeSlice.call(arguments, 1), null, indicatorObject);
        }
        function throttle(func, wait, options) {
            var leading = true, trailing = true;
            if (options === false) {
                leading = false;
            } else if (isObject(options)) {
                leading = 'leading' in options ? options.leading : leading;
                trailing = 'trailing' in options ? options.trailing : trailing;
            }
            options = getObject();
            options.leading = leading;
            options.maxWait = wait;
            options.trailing = trailing;
            var result = debounce(func, wait, options);
            releaseObject(options);
            return result;
        }
        function wrap(value, wrapper) {
            return function () {
                var args = [value];
                push.apply(args, arguments);
                return wrapper.apply(this, args);
            };
        }
        function escape(string) {
            return string == null ? '' : String(string).replace(reUnescapedHtml, escapeHtmlChar);
        }
        function identity(value) {
            return value;
        }
        function mixin(object) {
            forEach(functions(object), function (methodName) {
                var func = lodash[methodName] = object[methodName];
                lodash.prototype[methodName] = function () {
                    var value = this.__wrapped__, args = [value];
                    push.apply(args, arguments);
                    var result = func.apply(lodash, args);
                    return value && typeof value == 'object' && value === result ? this : new lodashWrapper(result);
                };
            });
        }
        function noConflict() {
            context._ = oldDash;
            return this;
        }
        var parseInt = nativeParseInt(whitespace + '08') == 8 ? nativeParseInt : function (value, radix) {
                return nativeParseInt(isString(value) ? value.replace(reLeadingSpacesAndZeros, '') : value, radix || 0);
            };
        function random(min, max) {
            if (min == null && max == null) {
                max = 1;
            }
            min = +min || 0;
            if (max == null) {
                max = min;
                min = 0;
            } else {
                max = +max || 0;
            }
            var rand = nativeRandom();
            return min % 1 || max % 1 ? min + nativeMin(rand * (max - min + parseFloat('1e-' + ((rand + '').length - 1))), max) : min + floor(rand * (max - min + 1));
        }
        function result(object, property) {
            var value = object ? object[property] : undefined;
            return isFunction(value) ? object[property]() : value;
        }
        function template(text, data, options) {
            var settings = lodash.templateSettings;
            text || (text = '');
            options = defaults({}, options, settings);
            var imports = defaults({}, options.imports, settings.imports), importsKeys = keys(imports), importsValues = values(imports);
            var isEvaluating, index = 0, interpolate = options.interpolate || reNoMatch, source = '__p += \'';
            var reDelimiters = RegExp((options.escape || reNoMatch).source + '|' + interpolate.source + '|' + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' + (options.evaluate || reNoMatch).source + '|$', 'g');
            text.replace(reDelimiters, function (match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
                interpolateValue || (interpolateValue = esTemplateValue);
                source += text.slice(index, offset).replace(reUnescapedString, escapeStringChar);
                if (escapeValue) {
                    source += '\' +\n__e(' + escapeValue + ') +\n\'';
                }
                if (evaluateValue) {
                    isEvaluating = true;
                    source += '\';\n' + evaluateValue + ';\n__p += \'';
                }
                if (interpolateValue) {
                    source += '\' +\n((__t = (' + interpolateValue + ')) == null ? \'\' : __t) +\n\'';
                }
                index = offset + match.length;
                return match;
            });
            source += '\';\n';
            var variable = options.variable, hasVariable = variable;
            if (!hasVariable) {
                variable = 'obj';
                source = 'with (' + variable + ') {\n' + source + '\n}\n';
            }
            source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source).replace(reEmptyStringMiddle, '$1').replace(reEmptyStringTrailing, '$1;');
            source = 'function(' + variable + ') {\n' + (hasVariable ? '' : variable + ' || (' + variable + ' = {});\n') + 'var __t, __p = \'\', __e = _.escape' + (isEvaluating ? ', __j = Array.prototype.join;\n' + 'function print() { __p += __j.call(arguments, \'\') }\n' : ';\n') + source + 'return __p\n}';
            var sourceURL = '\n/*\n//@ sourceURL=' + (options.sourceURL || '/lodash/template/source[' + templateCounter++ + ']') + '\n*/';
            try {
                var result = Function(importsKeys, 'return ' + source + sourceURL).apply(undefined, importsValues);
            } catch (e) {
                e.source = source;
                throw e;
            }
            if (data) {
                return result(data);
            }
            result.source = source;
            return result;
        }
        function times(n, callback, thisArg) {
            n = (n = +n) > -1 ? n : 0;
            var index = -1, result = Array(n);
            callback = lodash.createCallback(callback, thisArg, 1);
            while (++index < n) {
                result[index] = callback(index);
            }
            return result;
        }
        function unescape(string) {
            return string == null ? '' : String(string).replace(reEscapedHtml, unescapeHtmlChar);
        }
        function uniqueId(prefix) {
            var id = ++idCounter;
            return String(prefix == null ? '' : prefix) + id;
        }
        function tap(value, interceptor) {
            interceptor(value);
            return value;
        }
        function wrapperToString() {
            return String(this.__wrapped__);
        }
        function wrapperValueOf() {
            return this.__wrapped__;
        }
        lodash.after = after;
        lodash.assign = assign;
        lodash.at = at;
        lodash.bind = bind;
        lodash.bindAll = bindAll;
        lodash.bindKey = bindKey;
        lodash.compact = compact;
        lodash.compose = compose;
        lodash.countBy = countBy;
        lodash.createCallback = createCallback;
        lodash.debounce = debounce;
        lodash.defaults = defaults;
        lodash.defer = defer;
        lodash.delay = delay;
        lodash.difference = difference;
        lodash.filter = filter;
        lodash.flatten = flatten;
        lodash.forEach = forEach;
        lodash.forIn = forIn;
        lodash.forOwn = forOwn;
        lodash.functions = functions;
        lodash.groupBy = groupBy;
        lodash.initial = initial;
        lodash.intersection = intersection;
        lodash.invert = invert;
        lodash.invoke = invoke;
        lodash.keys = keys;
        lodash.map = map;
        lodash.max = max;
        lodash.memoize = memoize;
        lodash.merge = merge;
        lodash.min = min;
        lodash.omit = omit;
        lodash.once = once;
        lodash.pairs = pairs;
        lodash.partial = partial;
        lodash.partialRight = partialRight;
        lodash.pick = pick;
        lodash.pluck = pluck;
        lodash.range = range;
        lodash.reject = reject;
        lodash.rest = rest;
        lodash.shuffle = shuffle;
        lodash.sortBy = sortBy;
        lodash.tap = tap;
        lodash.throttle = throttle;
        lodash.times = times;
        lodash.toArray = toArray;
        lodash.transform = transform;
        lodash.union = union;
        lodash.uniq = uniq;
        lodash.unzip = unzip;
        lodash.values = values;
        lodash.where = where;
        lodash.without = without;
        lodash.wrap = wrap;
        lodash.zip = zip;
        lodash.zipObject = zipObject;
        lodash.collect = map;
        lodash.drop = rest;
        lodash.each = forEach;
        lodash.extend = assign;
        lodash.methods = functions;
        lodash.object = zipObject;
        lodash.select = filter;
        lodash.tail = rest;
        lodash.unique = uniq;
        mixin(lodash);
        lodash.chain = lodash;
        lodash.prototype.chain = function () {
            return this;
        };
        lodash.clone = clone;
        lodash.cloneDeep = cloneDeep;
        lodash.contains = contains;
        lodash.escape = escape;
        lodash.every = every;
        lodash.find = find;
        lodash.findIndex = findIndex;
        lodash.findKey = findKey;
        lodash.has = has;
        lodash.identity = identity;
        lodash.indexOf = indexOf;
        lodash.isArguments = isArguments;
        lodash.isArray = isArray;
        lodash.isBoolean = isBoolean;
        lodash.isDate = isDate;
        lodash.isElement = isElement;
        lodash.isEmpty = isEmpty;
        lodash.isEqual = isEqual;
        lodash.isFinite = isFinite;
        lodash.isFunction = isFunction;
        lodash.isNaN = isNaN;
        lodash.isNull = isNull;
        lodash.isNumber = isNumber;
        lodash.isObject = isObject;
        lodash.isPlainObject = isPlainObject;
        lodash.isRegExp = isRegExp;
        lodash.isString = isString;
        lodash.isUndefined = isUndefined;
        lodash.lastIndexOf = lastIndexOf;
        lodash.mixin = mixin;
        lodash.noConflict = noConflict;
        lodash.parseInt = parseInt;
        lodash.random = random;
        lodash.reduce = reduce;
        lodash.reduceRight = reduceRight;
        lodash.result = result;
        lodash.runInContext = runInContext;
        lodash.size = size;
        lodash.some = some;
        lodash.sortedIndex = sortedIndex;
        lodash.template = template;
        lodash.unescape = unescape;
        lodash.uniqueId = uniqueId;
        lodash.all = every;
        lodash.any = some;
        lodash.detect = find;
        lodash.findWhere = find;
        lodash.foldl = reduce;
        lodash.foldr = reduceRight;
        lodash.include = contains;
        lodash.inject = reduce;
        forOwn(lodash, function (func, methodName) {
            if (!lodash.prototype[methodName]) {
                lodash.prototype[methodName] = function () {
                    var args = [this.__wrapped__];
                    push.apply(args, arguments);
                    return func.apply(lodash, args);
                };
            }
        });
        lodash.first = first;
        lodash.last = last;
        lodash.take = first;
        lodash.head = first;
        forOwn(lodash, function (func, methodName) {
            if (!lodash.prototype[methodName]) {
                lodash.prototype[methodName] = function (callback, thisArg) {
                    var result = func(this.__wrapped__, callback, thisArg);
                    return callback == null || thisArg && typeof callback != 'function' ? result : new lodashWrapper(result);
                };
            }
        });
        lodash.VERSION = '1.3.1';
        lodash.prototype.toString = wrapperToString;
        lodash.prototype.value = wrapperValueOf;
        lodash.prototype.valueOf = wrapperValueOf;
        forEach([
            'join',
            'pop',
            'shift'
        ], function (methodName) {
            var func = arrayRef[methodName];
            lodash.prototype[methodName] = function () {
                return func.apply(this.__wrapped__, arguments);
            };
        });
        forEach([
            'push',
            'reverse',
            'sort',
            'unshift'
        ], function (methodName) {
            var func = arrayRef[methodName];
            lodash.prototype[methodName] = function () {
                func.apply(this.__wrapped__, arguments);
                return this;
            };
        });
        forEach([
            'concat',
            'slice',
            'splice'
        ], function (methodName) {
            var func = arrayRef[methodName];
            lodash.prototype[methodName] = function () {
                return new lodashWrapper(func.apply(this.__wrapped__, arguments));
            };
        });
        return lodash;
    }
    var _ = runInContext();
    if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
        window._ = _;
        define(function () {
            return _;
        });
    } else if (freeExports && !freeExports.nodeType) {
        if (freeModule) {
            (freeModule.exports = _)._ = _;
        } else {
            freeExports._ = _;
        }
    } else {
        window._ = _;
    }
}(this));
});
require.define('9', function(module, exports, __dirname, __filename, undefined){
(function (definition) {
    if (typeof bootstrap === 'function') {
        bootstrap('promise', definition);
    } else if (typeof exports === 'object') {
        module.exports = definition();
    } else if (typeof define === 'function' && define.amd) {
        define(definition);
    } else if (typeof ses !== 'undefined') {
        if (!ses.ok()) {
            return;
        } else {
            ses.makeQ = definition;
        }
    } else {
        Q = definition();
    }
}(function () {
    'use strict';
    var hasStacks = false;
    try {
        throw new Error();
    } catch (e) {
        hasStacks = !!e.stack;
    }
    var qStartingLine = captureLine();
    var qFileName;
    var noop = function () {
    };
    var nextTick = function () {
            var head = {
                    task: void 0,
                    next: null
                };
            var tail = head;
            var flushing = false;
            var requestTick = void 0;
            var isNodeJS = false;
            function flush() {
                while (head.next) {
                    head = head.next;
                    var task = head.task;
                    head.task = void 0;
                    var domain = head.domain;
                    if (domain) {
                        head.domain = void 0;
                        domain.enter();
                    }
                    try {
                        task();
                    } catch (e) {
                        if (isNodeJS) {
                            if (domain) {
                                domain.exit();
                            }
                            setTimeout(flush, 0);
                            if (domain) {
                                domain.enter();
                            }
                            throw e;
                        } else {
                            setTimeout(function () {
                                throw e;
                            }, 0);
                        }
                    }
                    if (domain) {
                        domain.exit();
                    }
                }
                flushing = false;
            }
            nextTick = function (task) {
                tail = tail.next = {
                    task: task,
                    domain: isNodeJS && process.domain,
                    next: null
                };
                if (!flushing) {
                    flushing = true;
                    requestTick();
                }
            };
            if (typeof process !== 'undefined' && process.nextTick) {
                isNodeJS = true;
                requestTick = function () {
                    process.nextTick(flush);
                };
            } else if (typeof setImmediate === 'function') {
                if (typeof window !== 'undefined') {
                    requestTick = setImmediate.bind(window, flush);
                } else {
                    requestTick = function () {
                        setImmediate(flush);
                    };
                }
            } else if (typeof MessageChannel !== 'undefined') {
                var channel = new MessageChannel();
                channel.port1.onmessage = function () {
                    requestTick = requestPortTick;
                    channel.port1.onmessage = flush;
                    flush();
                };
                var requestPortTick = function () {
                    channel.port2.postMessage(0);
                };
                requestTick = function () {
                    setTimeout(flush, 0);
                    requestPortTick();
                };
            } else {
                requestTick = function () {
                    setTimeout(flush, 0);
                };
            }
            return nextTick;
        }();
    var call = Function.call;
    function uncurryThis(f) {
        return function () {
            return call.apply(f, arguments);
        };
    }
    var array_slice = uncurryThis(Array.prototype.slice);
    var array_reduce = uncurryThis(Array.prototype.reduce || function (callback, basis) {
            var index = 0, length = this.length;
            if (arguments.length === 1) {
                do {
                    if (index in this) {
                        basis = this[index++];
                        break;
                    }
                    if (++index >= length) {
                        throw new TypeError();
                    }
                } while (1);
            }
            for (; index < length; index++) {
                if (index in this) {
                    basis = callback(basis, this[index], index);
                }
            }
            return basis;
        });
    var array_indexOf = uncurryThis(Array.prototype.indexOf || function (value) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] === value) {
                    return i;
                }
            }
            return -1;
        });
    var array_map = uncurryThis(Array.prototype.map || function (callback, thisp) {
            var self = this;
            var collect = [];
            array_reduce(self, function (undefined, value, index) {
                collect.push(callback.call(thisp, value, index, self));
            }, void 0);
            return collect;
        });
    var object_create = Object.create || function (prototype) {
            function Type() {
            }
            Type.prototype = prototype;
            return new Type();
        };
    var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);
    var object_keys = Object.keys || function (object) {
            var keys = [];
            for (var key in object) {
                if (object_hasOwnProperty(object, key)) {
                    keys.push(key);
                }
            }
            return keys;
        };
    var object_toString = uncurryThis(Object.prototype.toString);
    function isObject(value) {
        return value === Object(value);
    }
    function isStopIteration(exception) {
        return object_toString(exception) === '[object StopIteration]' || exception instanceof QReturnValue;
    }
    var QReturnValue;
    if (typeof ReturnValue !== 'undefined') {
        QReturnValue = ReturnValue;
    } else {
        QReturnValue = function (value) {
            this.value = value;
        };
    }
    var hasES6Generators;
    try {
        new Function('(function* (){ yield 1; })');
        hasES6Generators = true;
    } catch (e) {
        hasES6Generators = false;
    }
    var STACK_JUMP_SEPARATOR = 'From previous event:';
    function makeStackTraceLong(error, promise) {
        if (hasStacks && promise.stack && typeof error === 'object' && error !== null && error.stack && error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1) {
            var stacks = [];
            for (var p = promise; !!p; p = p.source) {
                if (p.stack) {
                    stacks.unshift(p.stack);
                }
            }
            stacks.unshift(error.stack);
            var concatedStacks = stacks.join('\n' + STACK_JUMP_SEPARATOR + '\n');
            error.stack = filterStackString(concatedStacks);
        }
    }
    function filterStackString(stackString) {
        var lines = stackString.split('\n');
        var desiredLines = [];
        for (var i = 0; i < lines.length; ++i) {
            var line = lines[i];
            if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
                desiredLines.push(line);
            }
        }
        return desiredLines.join('\n');
    }
    function isNodeFrame(stackLine) {
        return stackLine.indexOf('(module.js:') !== -1 || stackLine.indexOf('(node.js:') !== -1;
    }
    function getFileNameAndLineNumber(stackLine) {
        var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
        if (attempt1) {
            return [
                attempt1[1],
                Number(attempt1[2])
            ];
        }
        var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
        if (attempt2) {
            return [
                attempt2[1],
                Number(attempt2[2])
            ];
        }
        var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
        if (attempt3) {
            return [
                attempt3[1],
                Number(attempt3[2])
            ];
        }
    }
    function isInternalFrame(stackLine) {
        var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);
        if (!fileNameAndLineNumber) {
            return false;
        }
        var fileName = fileNameAndLineNumber[0];
        var lineNumber = fileNameAndLineNumber[1];
        return fileName === qFileName && lineNumber >= qStartingLine && lineNumber <= qEndingLine;
    }
    function captureLine() {
        if (!hasStacks) {
            return;
        }
        try {
            throw new Error();
        } catch (e) {
            var lines = e.stack.split('\n');
            var firstLine = lines[0].indexOf('@') > 0 ? lines[1] : lines[2];
            var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
            if (!fileNameAndLineNumber) {
                return;
            }
            qFileName = fileNameAndLineNumber[0];
            return fileNameAndLineNumber[1];
        }
    }
    function deprecate(callback, name, alternative) {
        return function () {
            if (typeof console !== 'undefined' && typeof console.warn === 'function') {
                console.warn(name + ' is deprecated, use ' + alternative + ' instead.', new Error('').stack);
            }
            return callback.apply(callback, arguments);
        };
    }
    function Q(value) {
        if (isPromise(value)) {
            return value;
        }
        if (isPromiseAlike(value)) {
            return coerce(value);
        } else {
            return fulfill(value);
        }
    }
    Q.resolve = Q;
    Q.nextTick = nextTick;
    Q.longStackSupport = false;
    Q.defer = defer;
    function defer() {
        var messages = [], progressListeners = [], resolvedPromise;
        var deferred = object_create(defer.prototype);
        var promise = object_create(Promise.prototype);
        promise.promiseDispatch = function (resolve, op, operands) {
            var args = array_slice(arguments);
            if (messages) {
                messages.push(args);
                if (op === 'when' && operands[1]) {
                    progressListeners.push(operands[1]);
                }
            } else {
                nextTick(function () {
                    resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
                });
            }
        };
        promise.valueOf = function () {
            if (messages) {
                return promise;
            }
            var nearerValue = nearer(resolvedPromise);
            if (isPromise(nearerValue)) {
                resolvedPromise = nearerValue;
            }
            return nearerValue;
        };
        promise.inspect = function () {
            if (!resolvedPromise) {
                return { state: 'pending' };
            }
            return resolvedPromise.inspect();
        };
        if (Q.longStackSupport && hasStacks) {
            try {
                throw new Error();
            } catch (e) {
                promise.stack = e.stack.substring(e.stack.indexOf('\n') + 1);
            }
        }
        function become(newPromise) {
            resolvedPromise = newPromise;
            promise.source = newPromise;
            array_reduce(messages, function (undefined, message) {
                nextTick(function () {
                    newPromise.promiseDispatch.apply(newPromise, message);
                });
            }, void 0);
            messages = void 0;
            progressListeners = void 0;
        }
        deferred.promise = promise;
        deferred.resolve = function (value) {
            if (resolvedPromise) {
                return;
            }
            become(Q(value));
        };
        deferred.fulfill = function (value) {
            if (resolvedPromise) {
                return;
            }
            become(fulfill(value));
        };
        deferred.reject = function (reason) {
            if (resolvedPromise) {
                return;
            }
            become(reject(reason));
        };
        deferred.notify = function (progress) {
            if (resolvedPromise) {
                return;
            }
            array_reduce(progressListeners, function (undefined, progressListener) {
                nextTick(function () {
                    progressListener(progress);
                });
            }, void 0);
        };
        return deferred;
    }
    defer.prototype.makeNodeResolver = function () {
        var self = this;
        return function (error, value) {
            if (error) {
                self.reject(error);
            } else if (arguments.length > 2) {
                self.resolve(array_slice(arguments, 1));
            } else {
                self.resolve(value);
            }
        };
    };
    Q.promise = promise;
    function promise(resolver) {
        if (typeof resolver !== 'function') {
            throw new TypeError('resolver must be a function.');
        }
        var deferred = defer();
        try {
            resolver(deferred.resolve, deferred.reject, deferred.notify);
        } catch (reason) {
            deferred.reject(reason);
        }
        return deferred.promise;
    }
    Q.passByCopy = function (object) {
        return object;
    };
    Promise.prototype.passByCopy = function () {
        return this;
    };
    Q.join = function (x, y) {
        return Q(x).join(y);
    };
    Promise.prototype.join = function (that) {
        return Q([
            this,
            that
        ]).spread(function (x, y) {
            if (x === y) {
                return x;
            } else {
                throw new Error('Can\'t join: not the same: ' + x + ' ' + y);
            }
        });
    };
    Q.race = race;
    function race(answerPs) {
        return promise(function (resolve, reject) {
            for (var i = 0, len = answerPs.length; i < len; i++) {
                Q(answerPs[i]).then(resolve, reject);
            }
        });
    }
    Promise.prototype.race = function () {
        return this.then(Q.race);
    };
    Q.makePromise = Promise;
    function Promise(descriptor, fallback, inspect) {
        if (fallback === void 0) {
            fallback = function (op) {
                return reject(new Error('Promise does not support operation: ' + op));
            };
        }
        if (inspect === void 0) {
            inspect = function () {
                return { state: 'unknown' };
            };
        }
        var promise = object_create(Promise.prototype);
        promise.promiseDispatch = function (resolve, op, args) {
            var result;
            try {
                if (descriptor[op]) {
                    result = descriptor[op].apply(promise, args);
                } else {
                    result = fallback.call(promise, op, args);
                }
            } catch (exception) {
                result = reject(exception);
            }
            if (resolve) {
                resolve(result);
            }
        };
        promise.inspect = inspect;
        if (inspect) {
            var inspected = inspect();
            if (inspected.state === 'rejected') {
                promise.exception = inspected.reason;
            }
            promise.valueOf = function () {
                var inspected = inspect();
                if (inspected.state === 'pending' || inspected.state === 'rejected') {
                    return promise;
                }
                return inspected.value;
            };
        }
        return promise;
    }
    Promise.prototype.toString = function () {
        return '[object Promise]';
    };
    Promise.prototype.then = function (fulfilled, rejected, progressed) {
        var self = this;
        var deferred = defer();
        var done = false;
        function _fulfilled(value) {
            try {
                return typeof fulfilled === 'function' ? fulfilled(value) : value;
            } catch (exception) {
                return reject(exception);
            }
        }
        function _rejected(exception) {
            if (typeof rejected === 'function') {
                makeStackTraceLong(exception, self);
                try {
                    return rejected(exception);
                } catch (newException) {
                    return reject(newException);
                }
            }
            return reject(exception);
        }
        function _progressed(value) {
            return typeof progressed === 'function' ? progressed(value) : value;
        }
        nextTick(function () {
            self.promiseDispatch(function (value) {
                if (done) {
                    return;
                }
                done = true;
                deferred.resolve(_fulfilled(value));
            }, 'when', [function (exception) {
                    if (done) {
                        return;
                    }
                    done = true;
                    deferred.resolve(_rejected(exception));
                }]);
        });
        self.promiseDispatch(void 0, 'when', [
            void 0,
            function (value) {
                var newValue;
                var threw = false;
                try {
                    newValue = _progressed(value);
                } catch (e) {
                    threw = true;
                    if (Q.onerror) {
                        Q.onerror(e);
                    } else {
                        throw e;
                    }
                }
                if (!threw) {
                    deferred.notify(newValue);
                }
            }
        ]);
        return deferred.promise;
    };
    Q.when = when;
    function when(value, fulfilled, rejected, progressed) {
        return Q(value).then(fulfilled, rejected, progressed);
    }
    Promise.prototype.thenResolve = function (value) {
        return this.then(function () {
            return value;
        });
    };
    Q.thenResolve = function (promise, value) {
        return Q(promise).thenResolve(value);
    };
    Promise.prototype.thenReject = function (reason) {
        return this.then(function () {
            throw reason;
        });
    };
    Q.thenReject = function (promise, reason) {
        return Q(promise).thenReject(reason);
    };
    Q.nearer = nearer;
    function nearer(value) {
        if (isPromise(value)) {
            var inspected = value.inspect();
            if (inspected.state === 'fulfilled') {
                return inspected.value;
            }
        }
        return value;
    }
    Q.isPromise = isPromise;
    function isPromise(object) {
        return isObject(object) && typeof object.promiseDispatch === 'function' && typeof object.inspect === 'function';
    }
    Q.isPromiseAlike = isPromiseAlike;
    function isPromiseAlike(object) {
        return isObject(object) && typeof object.then === 'function';
    }
    Q.isPending = isPending;
    function isPending(object) {
        return isPromise(object) && object.inspect().state === 'pending';
    }
    Promise.prototype.isPending = function () {
        return this.inspect().state === 'pending';
    };
    Q.isFulfilled = isFulfilled;
    function isFulfilled(object) {
        return !isPromise(object) || object.inspect().state === 'fulfilled';
    }
    Promise.prototype.isFulfilled = function () {
        return this.inspect().state === 'fulfilled';
    };
    Q.isRejected = isRejected;
    function isRejected(object) {
        return isPromise(object) && object.inspect().state === 'rejected';
    }
    Promise.prototype.isRejected = function () {
        return this.inspect().state === 'rejected';
    };
    var unhandledReasons = [];
    var unhandledRejections = [];
    var unhandledReasonsDisplayed = false;
    var trackUnhandledRejections = true;
    function displayUnhandledReasons() {
        if (!unhandledReasonsDisplayed && typeof window !== 'undefined' && window.console) {
            console.warn('[Q] Unhandled rejection reasons (should be empty):', unhandledReasons);
        }
        unhandledReasonsDisplayed = true;
    }
    function logUnhandledReasons() {
        for (var i = 0; i < unhandledReasons.length; i++) {
            var reason = unhandledReasons[i];
            console.warn('Unhandled rejection reason:', reason);
        }
    }
    function resetUnhandledRejections() {
        unhandledReasons.length = 0;
        unhandledRejections.length = 0;
        unhandledReasonsDisplayed = false;
        if (!trackUnhandledRejections) {
            trackUnhandledRejections = true;
            if (typeof process !== 'undefined' && process.on) {
                process.on('exit', logUnhandledReasons);
            }
        }
    }
    function trackRejection(promise, reason) {
        if (!trackUnhandledRejections) {
            return;
        }
        unhandledRejections.push(promise);
        if (reason && typeof reason.stack !== 'undefined') {
            unhandledReasons.push(reason.stack);
        } else {
            unhandledReasons.push('(no stack) ' + reason);
        }
        displayUnhandledReasons();
    }
    function untrackRejection(promise) {
        if (!trackUnhandledRejections) {
            return;
        }
        var at = array_indexOf(unhandledRejections, promise);
        if (at !== -1) {
            unhandledRejections.splice(at, 1);
            unhandledReasons.splice(at, 1);
        }
    }
    Q.resetUnhandledRejections = resetUnhandledRejections;
    Q.getUnhandledReasons = function () {
        return unhandledReasons.slice();
    };
    Q.stopUnhandledRejectionTracking = function () {
        resetUnhandledRejections();
        if (typeof process !== 'undefined' && process.on) {
            process.removeListener('exit', logUnhandledReasons);
        }
        trackUnhandledRejections = false;
    };
    resetUnhandledRejections();
    Q.reject = reject;
    function reject(reason) {
        var rejection = Promise({
                'when': function (rejected) {
                    if (rejected) {
                        untrackRejection(this);
                    }
                    return rejected ? rejected(reason) : this;
                }
            }, function fallback() {
                return this;
            }, function inspect() {
                return {
                    state: 'rejected',
                    reason: reason
                };
            });
        trackRejection(rejection, reason);
        return rejection;
    }
    Q.fulfill = fulfill;
    function fulfill(value) {
        return Promise({
            'when': function () {
                return value;
            },
            'get': function (name) {
                return value[name];
            },
            'set': function (name, rhs) {
                value[name] = rhs;
            },
            'delete': function (name) {
                delete value[name];
            },
            'post': function (name, args) {
                if (name === null || name === void 0) {
                    return value.apply(void 0, args);
                } else {
                    return value[name].apply(value, args);
                }
            },
            'apply': function (thisp, args) {
                return value.apply(thisp, args);
            },
            'keys': function () {
                return object_keys(value);
            }
        }, void 0, function inspect() {
            return {
                state: 'fulfilled',
                value: value
            };
        });
    }
    function coerce(promise) {
        var deferred = defer();
        nextTick(function () {
            try {
                promise.then(deferred.resolve, deferred.reject, deferred.notify);
            } catch (exception) {
                deferred.reject(exception);
            }
        });
        return deferred.promise;
    }
    Q.master = master;
    function master(object) {
        return Promise({
            'isDef': function () {
            }
        }, function fallback(op, args) {
            return dispatch(object, op, args);
        }, function () {
            return Q(object).inspect();
        });
    }
    Q.spread = spread;
    function spread(value, fulfilled, rejected) {
        return Q(value).spread(fulfilled, rejected);
    }
    Promise.prototype.spread = function (fulfilled, rejected) {
        return this.all().then(function (array) {
            return fulfilled.apply(void 0, array);
        }, rejected);
    };
    Q.async = async;
    function async(makeGenerator) {
        return function () {
            function continuer(verb, arg) {
                var result;
                if (hasES6Generators) {
                    try {
                        result = generator[verb](arg);
                    } catch (exception) {
                        return reject(exception);
                    }
                    if (result.done) {
                        return result.value;
                    } else {
                        return when(result.value, callback, errback);
                    }
                } else {
                    try {
                        result = generator[verb](arg);
                    } catch (exception) {
                        if (isStopIteration(exception)) {
                            return exception.value;
                        } else {
                            return reject(exception);
                        }
                    }
                    return when(result, callback, errback);
                }
            }
            var generator = makeGenerator.apply(this, arguments);
            var callback = continuer.bind(continuer, 'next');
            var errback = continuer.bind(continuer, 'throw');
            return callback();
        };
    }
    Q.spawn = spawn;
    function spawn(makeGenerator) {
        Q.done(Q.async(makeGenerator)());
    }
    Q['return'] = _return;
    function _return(value) {
        throw new QReturnValue(value);
    }
    Q.promised = promised;
    function promised(callback) {
        return function () {
            return spread([
                this,
                all(arguments)
            ], function (self, args) {
                return callback.apply(self, args);
            });
        };
    }
    Q.dispatch = dispatch;
    function dispatch(object, op, args) {
        return Q(object).dispatch(op, args);
    }
    Promise.prototype.dispatch = function (op, args) {
        var self = this;
        var deferred = defer();
        nextTick(function () {
            self.promiseDispatch(deferred.resolve, op, args);
        });
        return deferred.promise;
    };
    Q.get = function (object, key) {
        return Q(object).dispatch('get', [key]);
    };
    Promise.prototype.get = function (key) {
        return this.dispatch('get', [key]);
    };
    Q.set = function (object, key, value) {
        return Q(object).dispatch('set', [
            key,
            value
        ]);
    };
    Promise.prototype.set = function (key, value) {
        return this.dispatch('set', [
            key,
            value
        ]);
    };
    Q.del = Q['delete'] = function (object, key) {
        return Q(object).dispatch('delete', [key]);
    };
    Promise.prototype.del = Promise.prototype['delete'] = function (key) {
        return this.dispatch('delete', [key]);
    };
    Q.mapply = Q.post = function (object, name, args) {
        return Q(object).dispatch('post', [
            name,
            args
        ]);
    };
    Promise.prototype.mapply = Promise.prototype.post = function (name, args) {
        return this.dispatch('post', [
            name,
            args
        ]);
    };
    Q.send = Q.mcall = Q.invoke = function (object, name) {
        return Q(object).dispatch('post', [
            name,
            array_slice(arguments, 2)
        ]);
    };
    Promise.prototype.send = Promise.prototype.mcall = Promise.prototype.invoke = function (name) {
        return this.dispatch('post', [
            name,
            array_slice(arguments, 1)
        ]);
    };
    Q.fapply = function (object, args) {
        return Q(object).dispatch('apply', [
            void 0,
            args
        ]);
    };
    Promise.prototype.fapply = function (args) {
        return this.dispatch('apply', [
            void 0,
            args
        ]);
    };
    Q['try'] = Q.fcall = function (object) {
        return Q(object).dispatch('apply', [
            void 0,
            array_slice(arguments, 1)
        ]);
    };
    Promise.prototype.fcall = function () {
        return this.dispatch('apply', [
            void 0,
            array_slice(arguments)
        ]);
    };
    Q.fbind = function (object) {
        var promise = Q(object);
        var args = array_slice(arguments, 1);
        return function fbound() {
            return promise.dispatch('apply', [
                this,
                args.concat(array_slice(arguments))
            ]);
        };
    };
    Promise.prototype.fbind = function () {
        var promise = this;
        var args = array_slice(arguments);
        return function fbound() {
            return promise.dispatch('apply', [
                this,
                args.concat(array_slice(arguments))
            ]);
        };
    };
    Q.keys = function (object) {
        return Q(object).dispatch('keys', []);
    };
    Promise.prototype.keys = function () {
        return this.dispatch('keys', []);
    };
    Q.all = all;
    function all(promises) {
        return when(promises, function (promises) {
            var countDown = 0;
            var deferred = defer();
            array_reduce(promises, function (undefined, promise, index) {
                var snapshot;
                if (isPromise(promise) && (snapshot = promise.inspect()).state === 'fulfilled') {
                    promises[index] = snapshot.value;
                } else {
                    ++countDown;
                    when(promise, function (value) {
                        promises[index] = value;
                        if (--countDown === 0) {
                            deferred.resolve(promises);
                        }
                    }, deferred.reject, function (progress) {
                        deferred.notify({
                            index: index,
                            value: progress
                        });
                    });
                }
            }, void 0);
            if (countDown === 0) {
                deferred.resolve(promises);
            }
            return deferred.promise;
        });
    }
    Promise.prototype.all = function () {
        return all(this);
    };
    Q.allResolved = deprecate(allResolved, 'allResolved', 'allSettled');
    function allResolved(promises) {
        return when(promises, function (promises) {
            promises = array_map(promises, Q);
            return when(all(array_map(promises, function (promise) {
                return when(promise, noop, noop);
            })), function () {
                return promises;
            });
        });
    }
    Promise.prototype.allResolved = function () {
        return allResolved(this);
    };
    Q.allSettled = allSettled;
    function allSettled(promises) {
        return Q(promises).allSettled();
    }
    Promise.prototype.allSettled = function () {
        return this.then(function (promises) {
            return all(array_map(promises, function (promise) {
                promise = Q(promise);
                function regardless() {
                    return promise.inspect();
                }
                return promise.then(regardless, regardless);
            }));
        });
    };
    Q.fail = Q['catch'] = function (object, rejected) {
        return Q(object).then(void 0, rejected);
    };
    Promise.prototype.fail = Promise.prototype['catch'] = function (rejected) {
        return this.then(void 0, rejected);
    };
    Q.progress = progress;
    function progress(object, progressed) {
        return Q(object).then(void 0, void 0, progressed);
    }
    Promise.prototype.progress = function (progressed) {
        return this.then(void 0, void 0, progressed);
    };
    Q.fin = Q['finally'] = function (object, callback) {
        return Q(object)['finally'](callback);
    };
    Promise.prototype.fin = Promise.prototype['finally'] = function (callback) {
        callback = Q(callback);
        return this.then(function (value) {
            return callback.fcall().then(function () {
                return value;
            });
        }, function (reason) {
            return callback.fcall().then(function () {
                throw reason;
            });
        });
    };
    Q.done = function (object, fulfilled, rejected, progress) {
        return Q(object).done(fulfilled, rejected, progress);
    };
    Promise.prototype.done = function (fulfilled, rejected, progress) {
        var onUnhandledError = function (error) {
            nextTick(function () {
                makeStackTraceLong(error, promise);
                if (Q.onerror) {
                    Q.onerror(error);
                } else {
                    throw error;
                }
            });
        };
        var promise = fulfilled || rejected || progress ? this.then(fulfilled, rejected, progress) : this;
        if (typeof process === 'object' && process && process.domain) {
            onUnhandledError = process.domain.bind(onUnhandledError);
        }
        promise.then(void 0, onUnhandledError);
    };
    Q.timeout = function (object, ms, message) {
        return Q(object).timeout(ms, message);
    };
    Promise.prototype.timeout = function (ms, message) {
        var deferred = defer();
        var timeoutId = setTimeout(function () {
                deferred.reject(new Error(message || 'Timed out after ' + ms + ' ms'));
            }, ms);
        this.then(function (value) {
            clearTimeout(timeoutId);
            deferred.resolve(value);
        }, function (exception) {
            clearTimeout(timeoutId);
            deferred.reject(exception);
        }, deferred.notify);
        return deferred.promise;
    };
    Q.delay = function (object, timeout) {
        if (timeout === void 0) {
            timeout = object;
            object = void 0;
        }
        return Q(object).delay(timeout);
    };
    Promise.prototype.delay = function (timeout) {
        return this.then(function (value) {
            var deferred = defer();
            setTimeout(function () {
                deferred.resolve(value);
            }, timeout);
            return deferred.promise;
        });
    };
    Q.nfapply = function (callback, args) {
        return Q(callback).nfapply(args);
    };
    Promise.prototype.nfapply = function (args) {
        var deferred = defer();
        var nodeArgs = array_slice(args);
        nodeArgs.push(deferred.makeNodeResolver());
        this.fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
    Q.nfcall = function (callback) {
        var args = array_slice(arguments, 1);
        return Q(callback).nfapply(args);
    };
    Promise.prototype.nfcall = function () {
        var nodeArgs = array_slice(arguments);
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        this.fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
    Q.nfbind = Q.denodeify = function (callback) {
        var baseArgs = array_slice(arguments, 1);
        return function () {
            var nodeArgs = baseArgs.concat(array_slice(arguments));
            var deferred = defer();
            nodeArgs.push(deferred.makeNodeResolver());
            Q(callback).fapply(nodeArgs).fail(deferred.reject);
            return deferred.promise;
        };
    };
    Promise.prototype.nfbind = Promise.prototype.denodeify = function () {
        var args = array_slice(arguments);
        args.unshift(this);
        return Q.denodeify.apply(void 0, args);
    };
    Q.nbind = function (callback, thisp) {
        var baseArgs = array_slice(arguments, 2);
        return function () {
            var nodeArgs = baseArgs.concat(array_slice(arguments));
            var deferred = defer();
            nodeArgs.push(deferred.makeNodeResolver());
            function bound() {
                return callback.apply(thisp, arguments);
            }
            Q(bound).fapply(nodeArgs).fail(deferred.reject);
            return deferred.promise;
        };
    };
    Promise.prototype.nbind = function () {
        var args = array_slice(arguments, 0);
        args.unshift(this);
        return Q.nbind.apply(void 0, args);
    };
    Q.nmapply = Q.npost = function (object, name, args) {
        return Q(object).npost(name, args);
    };
    Promise.prototype.nmapply = Promise.prototype.npost = function (name, args) {
        var nodeArgs = array_slice(args || []);
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        this.dispatch('post', [
            name,
            nodeArgs
        ]).fail(deferred.reject);
        return deferred.promise;
    };
    Q.nsend = Q.nmcall = Q.ninvoke = function (object, name) {
        var nodeArgs = array_slice(arguments, 2);
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        Q(object).dispatch('post', [
            name,
            nodeArgs
        ]).fail(deferred.reject);
        return deferred.promise;
    };
    Promise.prototype.nsend = Promise.prototype.nmcall = Promise.prototype.ninvoke = function (name) {
        var nodeArgs = array_slice(arguments, 1);
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        this.dispatch('post', [
            name,
            nodeArgs
        ]).fail(deferred.reject);
        return deferred.promise;
    };
    Q.nodeify = nodeify;
    function nodeify(object, nodeback) {
        return Q(object).nodeify(nodeback);
    }
    Promise.prototype.nodeify = function (nodeback) {
        if (nodeback) {
            this.then(function (value) {
                nextTick(function () {
                    nodeback(null, value);
                });
            }, function (error) {
                nextTick(function () {
                    nodeback(error);
                });
            });
        } else {
            return this;
        }
    };
    var qEndingLine = captureLine();
    return Q;
}));
});
require.define('11', function(module, exports, __dirname, __filename, undefined){
(function (name, context, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else if (typeof context.define === 'function' && context.define.amd) {
        define(name, [], factory);
    } else {
        context[name] = factory();
    }
}('buzz', this, function () {
    var buzz = {
            defaults: {
                autoplay: false,
                duration: 5000,
                formats: [],
                loop: false,
                placeholder: '--',
                preload: 'metadata',
                volume: 80,
                document: document
            },
            types: {
                mp3: 'audio/mpeg',
                ogg: 'audio/ogg',
                wav: 'audio/wav',
                aac: 'audio/aac',
                m4a: 'audio/x-m4a'
            },
            sounds: [],
            el: document.createElement('audio'),
            sound: function (src, options) {
                options = options || {};
                var doc = options.document || buzz.defaults.document;
                var pid = 0, events = [], eventsOnce = {}, supported = buzz.isSupported();
                this.load = function () {
                    if (!supported) {
                        return this;
                    }
                    this.sound.load();
                    return this;
                };
                this.play = function () {
                    if (!supported) {
                        return this;
                    }
                    this.sound.play();
                    return this;
                };
                this.togglePlay = function () {
                    if (!supported) {
                        return this;
                    }
                    if (this.sound.paused) {
                        this.sound.play();
                    } else {
                        this.sound.pause();
                    }
                    return this;
                };
                this.pause = function () {
                    if (!supported) {
                        return this;
                    }
                    this.sound.pause();
                    return this;
                };
                this.isPaused = function () {
                    if (!supported) {
                        return null;
                    }
                    return this.sound.paused;
                };
                this.stop = function () {
                    if (!supported) {
                        return this;
                    }
                    this.setTime(0);
                    this.sound.pause();
                    return this;
                };
                this.isEnded = function () {
                    if (!supported) {
                        return null;
                    }
                    return this.sound.ended;
                };
                this.loop = function () {
                    if (!supported) {
                        return this;
                    }
                    this.sound.loop = 'loop';
                    this.bind('ended.buzzloop', function () {
                        this.currentTime = 0;
                        this.play();
                    });
                    return this;
                };
                this.unloop = function () {
                    if (!supported) {
                        return this;
                    }
                    this.sound.removeAttribute('loop');
                    this.unbind('ended.buzzloop');
                    return this;
                };
                this.mute = function () {
                    if (!supported) {
                        return this;
                    }
                    this.sound.muted = true;
                    return this;
                };
                this.unmute = function () {
                    if (!supported) {
                        return this;
                    }
                    this.sound.muted = false;
                    return this;
                };
                this.toggleMute = function () {
                    if (!supported) {
                        return this;
                    }
                    this.sound.muted = !this.sound.muted;
                    return this;
                };
                this.isMuted = function () {
                    if (!supported) {
                        return null;
                    }
                    return this.sound.muted;
                };
                this.setVolume = function (volume) {
                    if (!supported) {
                        return this;
                    }
                    if (volume < 0) {
                        volume = 0;
                    }
                    if (volume > 100) {
                        volume = 100;
                    }
                    this.volume = volume;
                    this.sound.volume = volume / 100;
                    return this;
                };
                this.getVolume = function () {
                    if (!supported) {
                        return this;
                    }
                    return this.volume;
                };
                this.increaseVolume = function (value) {
                    return this.setVolume(this.volume + (value || 1));
                };
                this.decreaseVolume = function (value) {
                    return this.setVolume(this.volume - (value || 1));
                };
                this.setTime = function (time) {
                    if (!supported) {
                        return this;
                    }
                    var set = true;
                    this.whenReady(function () {
                        if (set === true) {
                            set = false;
                            this.sound.currentTime = time;
                        }
                    });
                    return this;
                };
                this.getTime = function () {
                    if (!supported) {
                        return null;
                    }
                    var time = Math.round(this.sound.currentTime * 100) / 100;
                    return isNaN(time) ? buzz.defaults.placeholder : time;
                };
                this.setPercent = function (percent) {
                    if (!supported) {
                        return this;
                    }
                    return this.setTime(buzz.fromPercent(percent, this.sound.duration));
                };
                this.getPercent = function () {
                    if (!supported) {
                        return null;
                    }
                    var percent = Math.round(buzz.toPercent(this.sound.currentTime, this.sound.duration));
                    return isNaN(percent) ? buzz.defaults.placeholder : percent;
                };
                this.setSpeed = function (duration) {
                    if (!supported) {
                        return this;
                    }
                    this.sound.playbackRate = duration;
                    return this;
                };
                this.getSpeed = function () {
                    if (!supported) {
                        return null;
                    }
                    return this.sound.playbackRate;
                };
                this.getDuration = function () {
                    if (!supported) {
                        return null;
                    }
                    var duration = Math.round(this.sound.duration * 100) / 100;
                    return isNaN(duration) ? buzz.defaults.placeholder : duration;
                };
                this.getPlayed = function () {
                    if (!supported) {
                        return null;
                    }
                    return timerangeToArray(this.sound.played);
                };
                this.getBuffered = function () {
                    if (!supported) {
                        return null;
                    }
                    return timerangeToArray(this.sound.buffered);
                };
                this.getSeekable = function () {
                    if (!supported) {
                        return null;
                    }
                    return timerangeToArray(this.sound.seekable);
                };
                this.getErrorCode = function () {
                    if (supported && this.sound.error) {
                        return this.sound.error.code;
                    }
                    return 0;
                };
                this.getErrorMessage = function () {
                    if (!supported) {
                        return null;
                    }
                    switch (this.getErrorCode()) {
                    case 1:
                        return 'MEDIA_ERR_ABORTED';
                    case 2:
                        return 'MEDIA_ERR_NETWORK';
                    case 3:
                        return 'MEDIA_ERR_DECODE';
                    case 4:
                        return 'MEDIA_ERR_SRC_NOT_SUPPORTED';
                    default:
                        return null;
                    }
                };
                this.getStateCode = function () {
                    if (!supported) {
                        return null;
                    }
                    return this.sound.readyState;
                };
                this.getStateMessage = function () {
                    if (!supported) {
                        return null;
                    }
                    switch (this.getStateCode()) {
                    case 0:
                        return 'HAVE_NOTHING';
                    case 1:
                        return 'HAVE_METADATA';
                    case 2:
                        return 'HAVE_CURRENT_DATA';
                    case 3:
                        return 'HAVE_FUTURE_DATA';
                    case 4:
                        return 'HAVE_ENOUGH_DATA';
                    default:
                        return null;
                    }
                };
                this.getNetworkStateCode = function () {
                    if (!supported) {
                        return null;
                    }
                    return this.sound.networkState;
                };
                this.getNetworkStateMessage = function () {
                    if (!supported) {
                        return null;
                    }
                    switch (this.getNetworkStateCode()) {
                    case 0:
                        return 'NETWORK_EMPTY';
                    case 1:
                        return 'NETWORK_IDLE';
                    case 2:
                        return 'NETWORK_LOADING';
                    case 3:
                        return 'NETWORK_NO_SOURCE';
                    default:
                        return null;
                    }
                };
                this.set = function (key, value) {
                    if (!supported) {
                        return this;
                    }
                    this.sound[key] = value;
                    return this;
                };
                this.get = function (key) {
                    if (!supported) {
                        return null;
                    }
                    return key ? this.sound[key] : this.sound;
                };
                this.bind = function (types, func) {
                    if (!supported) {
                        return this;
                    }
                    types = types.split(' ');
                    var self = this, efunc = function (e) {
                            func.call(self, e);
                        };
                    for (var t = 0; t < types.length; t++) {
                        var type = types[t], idx = type;
                        type = idx.split('.')[0];
                        events.push({
                            idx: idx,
                            func: efunc
                        });
                        this.sound.addEventListener(type, efunc, true);
                    }
                    return this;
                };
                this.unbind = function (types) {
                    if (!supported) {
                        return this;
                    }
                    types = types.split(' ');
                    for (var t = 0; t < types.length; t++) {
                        var idx = types[t], type = idx.split('.')[0];
                        for (var i = 0; i < events.length; i++) {
                            var namespace = events[i].idx.split('.');
                            if (events[i].idx == idx || namespace[1] && namespace[1] == idx.replace('.', '')) {
                                this.sound.removeEventListener(type, events[i].func, true);
                                events.splice(i, 1);
                            }
                        }
                    }
                    return this;
                };
                this.bindOnce = function (type, func) {
                    if (!supported) {
                        return this;
                    }
                    var self = this;
                    eventsOnce[pid++] = false;
                    this.bind(type + '.' + pid, function () {
                        if (!eventsOnce[pid]) {
                            eventsOnce[pid] = true;
                            func.call(self);
                        }
                        self.unbind(type + '.' + pid);
                    });
                    return this;
                };
                this.trigger = function (types) {
                    if (!supported) {
                        return this;
                    }
                    types = types.split(' ');
                    for (var t = 0; t < types.length; t++) {
                        var idx = types[t];
                        for (var i = 0; i < events.length; i++) {
                            var eventType = events[i].idx.split('.');
                            if (events[i].idx == idx || eventType[0] && eventType[0] == idx.replace('.', '')) {
                                var evt = doc.createEvent('HTMLEvents');
                                evt.initEvent(eventType[0], false, true);
                                this.sound.dispatchEvent(evt);
                            }
                        }
                    }
                    return this;
                };
                this.fadeTo = function (to, duration, callback) {
                    if (!supported) {
                        return this;
                    }
                    if (duration instanceof Function) {
                        callback = duration;
                        duration = buzz.defaults.duration;
                    } else {
                        duration = duration || buzz.defaults.duration;
                    }
                    var from = this.volume, delay = duration / Math.abs(from - to), self = this;
                    this.play();
                    function doFade() {
                        setTimeout(function () {
                            if (from < to && self.volume < to) {
                                self.setVolume(self.volume += 1);
                                doFade();
                            } else if (from > to && self.volume > to) {
                                self.setVolume(self.volume -= 1);
                                doFade();
                            } else if (callback instanceof Function) {
                                callback.apply(self);
                            }
                        }, delay);
                    }
                    this.whenReady(function () {
                        doFade();
                    });
                    return this;
                };
                this.fadeIn = function (duration, callback) {
                    if (!supported) {
                        return this;
                    }
                    return this.setVolume(0).fadeTo(100, duration, callback);
                };
                this.fadeOut = function (duration, callback) {
                    if (!supported) {
                        return this;
                    }
                    return this.fadeTo(0, duration, callback);
                };
                this.fadeWith = function (sound, duration) {
                    if (!supported) {
                        return this;
                    }
                    this.fadeOut(duration, function () {
                        this.stop();
                    });
                    sound.play().fadeIn(duration);
                    return this;
                };
                this.whenReady = function (func) {
                    if (!supported) {
                        return null;
                    }
                    var self = this;
                    if (this.sound.readyState === 0) {
                        this.bind('canplay.buzzwhenready', function () {
                            func.call(self);
                        });
                    } else {
                        func.call(self);
                    }
                };
                function timerangeToArray(timeRange) {
                    var array = [], length = timeRange.length - 1;
                    for (var i = 0; i <= length; i++) {
                        array.push({
                            start: timeRange.start(i),
                            end: timeRange.end(i)
                        });
                    }
                    return array;
                }
                function getExt(filename) {
                    return filename.split('.').pop();
                }
                function addSource(sound, src) {
                    var source = doc.createElement('source');
                    source.src = src;
                    if (buzz.types[getExt(src)]) {
                        source.type = buzz.types[getExt(src)];
                    }
                    sound.appendChild(source);
                }
                if (supported && src) {
                    for (var i in buzz.defaults) {
                        if (buzz.defaults.hasOwnProperty(i)) {
                            options[i] = options[i] || buzz.defaults[i];
                        }
                    }
                    this.sound = doc.createElement('audio');
                    if (src instanceof Array) {
                        for (var j in src) {
                            if (src.hasOwnProperty(j)) {
                                addSource(this.sound, src[j]);
                            }
                        }
                    } else if (options.formats.length) {
                        for (var k in options.formats) {
                            if (options.formats.hasOwnProperty(k)) {
                                addSource(this.sound, src + '.' + options.formats[k]);
                            }
                        }
                    } else {
                        addSource(this.sound, src);
                    }
                    if (options.loop) {
                        this.loop();
                    }
                    if (options.autoplay) {
                        this.sound.autoplay = 'autoplay';
                    }
                    if (options.preload === true) {
                        this.sound.preload = 'auto';
                    } else if (options.preload === false) {
                        this.sound.preload = 'none';
                    } else {
                        this.sound.preload = options.preload;
                    }
                    this.setVolume(options.volume);
                    buzz.sounds.push(this);
                }
            },
            group: function (sounds) {
                sounds = argsToArray(sounds, arguments);
                this.getSounds = function () {
                    return sounds;
                };
                this.add = function (soundArray) {
                    soundArray = argsToArray(soundArray, arguments);
                    for (var a = 0; a < soundArray.length; a++) {
                        sounds.push(soundArray[a]);
                    }
                };
                this.remove = function (soundArray) {
                    soundArray = argsToArray(soundArray, arguments);
                    for (var a = 0; a < soundArray.length; a++) {
                        for (var i = 0; i < sounds.length; i++) {
                            if (sounds[i] == soundArray[a]) {
                                sounds.splice(i, 1);
                                break;
                            }
                        }
                    }
                };
                this.load = function () {
                    fn('load');
                    return this;
                };
                this.play = function () {
                    fn('play');
                    return this;
                };
                this.togglePlay = function () {
                    fn('togglePlay');
                    return this;
                };
                this.pause = function (time) {
                    fn('pause', time);
                    return this;
                };
                this.stop = function () {
                    fn('stop');
                    return this;
                };
                this.mute = function () {
                    fn('mute');
                    return this;
                };
                this.unmute = function () {
                    fn('unmute');
                    return this;
                };
                this.toggleMute = function () {
                    fn('toggleMute');
                    return this;
                };
                this.setVolume = function (volume) {
                    fn('setVolume', volume);
                    return this;
                };
                this.increaseVolume = function (value) {
                    fn('increaseVolume', value);
                    return this;
                };
                this.decreaseVolume = function (value) {
                    fn('decreaseVolume', value);
                    return this;
                };
                this.loop = function () {
                    fn('loop');
                    return this;
                };
                this.unloop = function () {
                    fn('unloop');
                    return this;
                };
                this.setTime = function (time) {
                    fn('setTime', time);
                    return this;
                };
                this.set = function (key, value) {
                    fn('set', key, value);
                    return this;
                };
                this.bind = function (type, func) {
                    fn('bind', type, func);
                    return this;
                };
                this.unbind = function (type) {
                    fn('unbind', type);
                    return this;
                };
                this.bindOnce = function (type, func) {
                    fn('bindOnce', type, func);
                    return this;
                };
                this.trigger = function (type) {
                    fn('trigger', type);
                    return this;
                };
                this.fade = function (from, to, duration, callback) {
                    fn('fade', from, to, duration, callback);
                    return this;
                };
                this.fadeIn = function (duration, callback) {
                    fn('fadeIn', duration, callback);
                    return this;
                };
                this.fadeOut = function (duration, callback) {
                    fn('fadeOut', duration, callback);
                    return this;
                };
                function fn() {
                    var args = argsToArray(null, arguments), func = args.shift();
                    for (var i = 0; i < sounds.length; i++) {
                        sounds[i][func].apply(sounds[i], args);
                    }
                }
                function argsToArray(array, args) {
                    return array instanceof Array ? array : Array.prototype.slice.call(args);
                }
            },
            all: function () {
                return new buzz.group(buzz.sounds);
            },
            isSupported: function () {
                return !!buzz.el.canPlayType;
            },
            isOGGSupported: function () {
                return !!buzz.el.canPlayType && buzz.el.canPlayType('audio/ogg; codecs="vorbis"');
            },
            isWAVSupported: function () {
                return !!buzz.el.canPlayType && buzz.el.canPlayType('audio/wav; codecs="1"');
            },
            isMP3Supported: function () {
                return !!buzz.el.canPlayType && buzz.el.canPlayType('audio/mpeg;');
            },
            isAACSupported: function () {
                return !!buzz.el.canPlayType && (buzz.el.canPlayType('audio/x-m4a;') || buzz.el.canPlayType('audio/aac;'));
            },
            toTimer: function (time, withHours) {
                var h, m, s;
                h = Math.floor(time / 3600);
                h = isNaN(h) ? '--' : h >= 10 ? h : '0' + h;
                m = withHours ? Math.floor(time / 60 % 60) : Math.floor(time / 60);
                m = isNaN(m) ? '--' : m >= 10 ? m : '0' + m;
                s = Math.floor(time % 60);
                s = isNaN(s) ? '--' : s >= 10 ? s : '0' + s;
                return withHours ? h + ':' + m + ':' + s : m + ':' + s;
            },
            fromTimer: function (time) {
                var splits = time.toString().split(':');
                if (splits && splits.length == 3) {
                    time = parseInt(splits[0], 10) * 3600 + parseInt(splits[1], 10) * 60 + parseInt(splits[2], 10);
                }
                if (splits && splits.length == 2) {
                    time = parseInt(splits[0], 10) * 60 + parseInt(splits[1], 10);
                }
                return time;
            },
            toPercent: function (value, total, decimal) {
                var r = Math.pow(10, decimal || 0);
                return Math.round(value * 100 / total * r) / r;
            },
            fromPercent: function (percent, total, decimal) {
                var r = Math.pow(10, decimal || 0);
                return Math.round(total / 100 * percent * r) / r;
            }
        };
    return buzz;
}));
});
require.define('27', function(module, exports, __dirname, __filename, undefined){
(function () {
    exports.Kinetic = require('28', module);
}.call(this));
});
require.define('28', function(module, exports, __dirname, __filename, undefined){
var Kinetic = {};
(function () {
    Kinetic = {
        version: '4.7.1',
        stages: [],
        idCounter: 0,
        ids: {},
        names: {},
        shapes: {},
        listenClickTap: false,
        inDblClickWindow: false,
        enableTrace: false,
        traceArrMax: 100,
        dblClickWindow: 400,
        pixelRatio: undefined,
        UA: function () {
            var ua = navigator.userAgent.toLowerCase(), match = /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
            return {
                browser: match[1] || '',
                version: match[2] || '0'
            };
        }(),
        Filters: {},
        Node: function (config) {
            this._init(config);
        },
        Shape: function (config) {
            this.__init(config);
        },
        Container: function (config) {
            this.__init(config);
        },
        Stage: function (config) {
            this.___init(config);
        },
        Layer: function (config) {
            this.___init(config);
        },
        Group: function (config) {
            this.___init(config);
        },
        isDragging: function () {
            var dd = Kinetic.DD;
            if (!dd) {
                return false;
            } else {
                return dd.isDragging;
            }
        },
        isDragReady: function () {
            var dd = Kinetic.DD;
            if (!dd) {
                return false;
            } else {
                return !!dd.node;
            }
        },
        _addId: function (node, id) {
            if (id !== undefined) {
                this.ids[id] = node;
            }
        },
        _removeId: function (id) {
            if (id !== undefined) {
                delete this.ids[id];
            }
        },
        _addName: function (node, name) {
            if (name !== undefined) {
                if (this.names[name] === undefined) {
                    this.names[name] = [];
                }
                this.names[name].push(node);
            }
        },
        _removeName: function (name, _id) {
            if (name !== undefined) {
                var nodes = this.names[name];
                if (nodes !== undefined) {
                    for (var n = 0; n < nodes.length; n++) {
                        var no = nodes[n];
                        if (no._id === _id) {
                            nodes.splice(n, 1);
                        }
                    }
                    if (nodes.length === 0) {
                        delete this.names[name];
                    }
                }
            }
        }
    };
}());
(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.returnExports = factory();
    }
}(this, function () {
    return Kinetic;
}));
;
(function () {
    Kinetic.Collection = function () {
        var args = [].slice.call(arguments), length = args.length, i = 0;
        this.length = length;
        for (; i < length; i++) {
            this[i] = args[i];
        }
        return this;
    };
    Kinetic.Collection.prototype = [];
    Kinetic.Collection.prototype.each = function (func) {
        for (var n = 0; n < this.length; n++) {
            func(this[n], n);
        }
    };
    Kinetic.Collection.prototype.toArray = function () {
        var arr = [], len = this.length, n;
        for (n = 0; n < len; n++) {
            arr.push(this[n]);
        }
        return arr;
    };
    Kinetic.Collection.toCollection = function (arr) {
        var collection = new Kinetic.Collection(), len = arr.length, n;
        for (n = 0; n < len; n++) {
            collection.push(arr[n]);
        }
        return collection;
    };
    Kinetic.Collection.mapMethods = function (arr) {
        var leng = arr.length, n;
        for (n = 0; n < leng; n++) {
            (function (i) {
                var method = arr[i];
                Kinetic.Collection.prototype[method] = function () {
                    var len = this.length, i;
                    args = [].slice.call(arguments);
                    for (i = 0; i < len; i++) {
                        this[i][method].apply(this[i], args);
                    }
                };
            }(n));
        }
    };
    Kinetic.Transform = function () {
        this.m = [
            1,
            0,
            0,
            1,
            0,
            0
        ];
    };
    Kinetic.Transform.prototype = {
        translate: function (x, y) {
            this.m[4] += this.m[0] * x + this.m[2] * y;
            this.m[5] += this.m[1] * x + this.m[3] * y;
        },
        scale: function (sx, sy) {
            this.m[0] *= sx;
            this.m[1] *= sx;
            this.m[2] *= sy;
            this.m[3] *= sy;
        },
        rotate: function (rad) {
            var c = Math.cos(rad);
            var s = Math.sin(rad);
            var m11 = this.m[0] * c + this.m[2] * s;
            var m12 = this.m[1] * c + this.m[3] * s;
            var m21 = this.m[0] * -s + this.m[2] * c;
            var m22 = this.m[1] * -s + this.m[3] * c;
            this.m[0] = m11;
            this.m[1] = m12;
            this.m[2] = m21;
            this.m[3] = m22;
        },
        getTranslation: function () {
            return {
                x: this.m[4],
                y: this.m[5]
            };
        },
        skew: function (sx, sy) {
            var m11 = this.m[0] + this.m[2] * sy;
            var m12 = this.m[1] + this.m[3] * sy;
            var m21 = this.m[2] + this.m[0] * sx;
            var m22 = this.m[3] + this.m[1] * sx;
            this.m[0] = m11;
            this.m[1] = m12;
            this.m[2] = m21;
            this.m[3] = m22;
        },
        multiply: function (matrix) {
            var m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
            var m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];
            var m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
            var m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];
            var dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
            var dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];
            this.m[0] = m11;
            this.m[1] = m12;
            this.m[2] = m21;
            this.m[3] = m22;
            this.m[4] = dx;
            this.m[5] = dy;
        },
        invert: function () {
            var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
            var m0 = this.m[3] * d;
            var m1 = -this.m[1] * d;
            var m2 = -this.m[2] * d;
            var m3 = this.m[0] * d;
            var m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
            var m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
            this.m[0] = m0;
            this.m[1] = m1;
            this.m[2] = m2;
            this.m[3] = m3;
            this.m[4] = m4;
            this.m[5] = m5;
        },
        getMatrix: function () {
            return this.m;
        },
        setAbsolutePosition: function (x, y) {
            var m0 = this.m[0], m1 = this.m[1], m2 = this.m[2], m3 = this.m[3], m4 = this.m[4], m5 = this.m[5], yt = (m0 * (y - m5) - m1 * (x - m4)) / (m0 * m3 - m1 * m2), xt = (x - m4 - m2 * yt) / m0;
            this.translate(xt, yt);
        }
    };
    var CANVAS = 'canvas', CONTEXT_2D = '2d', OBJECT_ARRAY = '[object Array]', OBJECT_NUMBER = '[object Number]', OBJECT_STRING = '[object String]', PI_OVER_DEG180 = Math.PI / 180, DEG180_OVER_PI = 180 / Math.PI, HASH = '#', EMPTY_STRING = '', ZERO = '0', KINETIC_WARNING = 'Kinetic warning: ', KINETIC_ERROR = 'Kinetic error: ', RGB_PAREN = 'rgb(', COLORS = {
            aqua: [
                0,
                255,
                255
            ],
            lime: [
                0,
                255,
                0
            ],
            silver: [
                192,
                192,
                192
            ],
            black: [
                0,
                0,
                0
            ],
            maroon: [
                128,
                0,
                0
            ],
            teal: [
                0,
                128,
                128
            ],
            blue: [
                0,
                0,
                255
            ],
            navy: [
                0,
                0,
                128
            ],
            white: [
                255,
                255,
                255
            ],
            fuchsia: [
                255,
                0,
                255
            ],
            olive: [
                128,
                128,
                0
            ],
            yellow: [
                255,
                255,
                0
            ],
            orange: [
                255,
                165,
                0
            ],
            gray: [
                128,
                128,
                128
            ],
            purple: [
                128,
                0,
                128
            ],
            green: [
                0,
                128,
                0
            ],
            red: [
                255,
                0,
                0
            ],
            pink: [
                255,
                192,
                203
            ],
            cyan: [
                0,
                255,
                255
            ],
            transparent: [
                255,
                255,
                255,
                0
            ]
        }, RGB_REGEX = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/;
    Kinetic.Util = {
        _isElement: function (obj) {
            return !!(obj && obj.nodeType == 1);
        },
        _isFunction: function (obj) {
            return !!(obj && obj.constructor && obj.call && obj.apply);
        },
        _isObject: function (obj) {
            return !!obj && obj.constructor == Object;
        },
        _isArray: function (obj) {
            return Object.prototype.toString.call(obj) == OBJECT_ARRAY;
        },
        _isNumber: function (obj) {
            return Object.prototype.toString.call(obj) == OBJECT_NUMBER;
        },
        _isString: function (obj) {
            return Object.prototype.toString.call(obj) == OBJECT_STRING;
        },
        _hasMethods: function (obj) {
            var names = [], key;
            for (key in obj) {
                if (this._isFunction(obj[key])) {
                    names.push(key);
                }
            }
            return names.length > 0;
        },
        _isInDocument: function (el) {
            while (el = el.parentNode) {
                if (el == document) {
                    return true;
                }
            }
            return false;
        },
        _roundArrValues: function (arr) {
            var retArr = [], len = arr.length, _isNumber = Kinetic.Util._isNumber, n, val;
            for (n = 0; n < len; n++) {
                val = arr[n];
                if (_isNumber(val)) {
                    val = Math.round(val * 1000) / 1000;
                }
                retArr.push(val);
            }
            return retArr;
        },
        _getXY: function (arg) {
            if (this._isNumber(arg)) {
                return {
                    x: arg,
                    y: arg
                };
            } else if (this._isArray(arg)) {
                if (arg.length === 1) {
                    var val = arg[0];
                    if (this._isNumber(val)) {
                        return {
                            x: val,
                            y: val
                        };
                    } else if (this._isArray(val)) {
                        return {
                            x: val[0],
                            y: val[1]
                        };
                    } else if (this._isObject(val)) {
                        return val;
                    }
                } else if (arg.length >= 2) {
                    return {
                        x: arg[0],
                        y: arg[1]
                    };
                }
            } else if (this._isObject(arg)) {
                return arg;
            }
            return null;
        },
        _getSize: function (arg) {
            if (this._isNumber(arg)) {
                return {
                    width: arg,
                    height: arg
                };
            } else if (this._isArray(arg)) {
                if (arg.length === 1) {
                    var val = arg[0];
                    if (this._isNumber(val)) {
                        return {
                            width: val,
                            height: val
                        };
                    } else if (this._isArray(val)) {
                        if (val.length >= 4) {
                            return {
                                width: val[2],
                                height: val[3]
                            };
                        } else if (val.length >= 2) {
                            return {
                                width: val[0],
                                height: val[1]
                            };
                        }
                    } else if (this._isObject(val)) {
                        return val;
                    }
                } else if (arg.length >= 4) {
                    return {
                        width: arg[2],
                        height: arg[3]
                    };
                } else if (arg.length >= 2) {
                    return {
                        width: arg[0],
                        height: arg[1]
                    };
                }
            } else if (this._isObject(arg)) {
                return arg;
            }
            return null;
        },
        _getPoints: function (arg) {
            var arr = [], n, len;
            if (arg === undefined) {
                return [];
            }
            len = arg.length;
            if (this._isArray(arg[0])) {
                for (n = 0; n < len; n++) {
                    arr.push({
                        x: arg[n][0],
                        y: arg[n][1]
                    });
                }
                return arr;
            }
            if (this._isObject(arg[0])) {
                return arg;
            } else {
                for (n = 0; n < len; n += 2) {
                    arr.push({
                        x: arg[n],
                        y: arg[n + 1]
                    });
                }
                return arr;
            }
        },
        _getImage: function (arg, callback) {
            var imageObj, canvas, context, dataUrl;
            if (!arg) {
                callback(null);
            } else if (this._isElement(arg)) {
                callback(arg);
            } else if (this._isString(arg)) {
                imageObj = new Image();
                imageObj.onload = function () {
                    callback(imageObj);
                };
                imageObj.src = arg;
            } else if (arg.data) {
                canvas = document.createElement(CANVAS);
                canvas.width = arg.width;
                canvas.height = arg.height;
                _context = canvas.getContext(CONTEXT_2D);
                _context.putImageData(arg, 0, 0);
                dataUrl = canvas.toDataURL();
                imageObj = new Image();
                imageObj.onload = function () {
                    callback(imageObj);
                };
                imageObj.src = dataUrl;
            } else {
                callback(null);
            }
        },
        _rgbToHex: function (r, g, b) {
            return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        },
        _hexToRgb: function (hex) {
            hex = hex.replace(HASH, EMPTY_STRING);
            var bigint = parseInt(hex, 16);
            return {
                r: bigint >> 16 & 255,
                g: bigint >> 8 & 255,
                b: bigint & 255
            };
        },
        getRandomColor: function () {
            var randColor = (Math.random() * 16777215 << 0).toString(16);
            while (randColor.length < 6) {
                randColor = ZERO + randColor;
            }
            return HASH + randColor;
        },
        get: function (val, def) {
            if (val === undefined) {
                return def;
            } else {
                return val;
            }
        },
        getRGB: function (color) {
            var rgb;
            if (color in COLORS) {
                rgb = COLORS[color];
                return {
                    r: rgb[0],
                    g: rgb[1],
                    b: rgb[2]
                };
            } else if (color[0] === HASH) {
                return this._hexToRgb(color.substring(1));
            } else if (color.substr(0, 4) === RGB_PAREN) {
                rgb = RGB_REGEX.exec(color.replace(/ /g, ''));
                return {
                    r: parseInt(rgb[1], 10),
                    g: parseInt(rgb[2], 10),
                    b: parseInt(rgb[3], 10)
                };
            } else {
                return {
                    r: 0,
                    g: 0,
                    b: 0
                };
            }
        },
        _merge: function (o1, o2) {
            var retObj = this._clone(o2);
            for (var key in o1) {
                if (this._isObject(o1[key])) {
                    retObj[key] = this._merge(o1[key], retObj[key]);
                } else {
                    retObj[key] = o1[key];
                }
            }
            return retObj;
        },
        _clone: function (obj) {
            var retObj = {};
            for (var key in obj) {
                if (this._isObject(obj[key])) {
                    retObj[key] = this._clone(obj[key]);
                } else {
                    retObj[key] = obj[key];
                }
            }
            return retObj;
        },
        _degToRad: function (deg) {
            return deg * PI_OVER_DEG180;
        },
        _radToDeg: function (rad) {
            return rad * DEG180_OVER_PI;
        },
        _capitalize: function (str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
        error: function (str) {
            throw new Error(KINETIC_ERROR + str);
        },
        warn: function (str) {
            if (window.console && console.warn) {
                console.warn(KINETIC_WARNING + str);
            }
        },
        extend: function (c1, c2) {
            for (var key in c2.prototype) {
                if (!(key in c1.prototype)) {
                    c1.prototype[key] = c2.prototype[key];
                }
            }
        },
        addMethods: function (constructor, methods) {
            var key;
            for (key in methods) {
                constructor.prototype[key] = methods[key];
            }
        },
        _getControlPoints: function (p0, p1, p2, t) {
            var x0 = p0.x;
            var y0 = p0.y;
            var x1 = p1.x;
            var y1 = p1.y;
            var x2 = p2.x;
            var y2 = p2.y;
            var d01 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
            var d12 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            var fa = t * d01 / (d01 + d12);
            var fb = t * d12 / (d01 + d12);
            var p1x = x1 - fa * (x2 - x0);
            var p1y = y1 - fa * (y2 - y0);
            var p2x = x1 + fb * (x2 - x0);
            var p2y = y1 + fb * (y2 - y0);
            return [
                {
                    x: p1x,
                    y: p1y
                },
                {
                    x: p2x,
                    y: p2y
                }
            ];
        },
        _expandPoints: function (points, tension) {
            var length = points.length, allPoints = [], n, cp;
            for (n = 1; n < length - 1; n++) {
                cp = Kinetic.Util._getControlPoints(points[n - 1], points[n], points[n + 1], tension);
                allPoints.push(cp[0]);
                allPoints.push(points[n]);
                allPoints.push(cp[1]);
            }
            return allPoints;
        },
        _removeLastLetter: function (str) {
            return str.substring(0, str.length - 1);
        }
    };
}());
;
(function () {
    var canvas = document.createElement('canvas'), context = canvas.getContext('2d'), devicePixelRatio = window.devicePixelRatio || 1, backingStoreRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1, _pixelRatio = devicePixelRatio / backingStoreRatio;
    Kinetic.Canvas = function (config) {
        this.init(config);
    };
    Kinetic.Canvas.prototype = {
        init: function (config) {
            config = config || {};
            var pixelRatio = config.pixelRatio || Kinetic.pixelRatio || _pixelRatio;
            this.pixelRatio = pixelRatio;
            this._canvas = document.createElement('canvas');
            this._canvas.style.padding = 0;
            this._canvas.style.margin = 0;
            this._canvas.style.border = 0;
            this._canvas.style.background = 'transparent';
            this._canvas.style.position = 'absolute';
            this._canvas.style.top = 0;
            this._canvas.style.left = 0;
        },
        getContext: function () {
            return this.context;
        },
        getPixelRatio: function () {
            return this.pixelRatio;
        },
        setPixelRatio: function (pixelRatio) {
            this.pixelRatio = pixelRatio;
            this.setSize(this.getWidth(), this.getHeight());
        },
        setWidth: function (width) {
            this.width = this._canvas.width = width * this.pixelRatio;
            this._canvas.style.width = width + 'px';
        },
        setHeight: function (height) {
            this.height = this._canvas.height = height * this.pixelRatio;
            this._canvas.style.height = height + 'px';
        },
        getWidth: function () {
            return this.width;
        },
        getHeight: function () {
            return this.height;
        },
        setSize: function (width, height) {
            this.setWidth(width);
            this.setHeight(height);
        },
        toDataURL: function (mimeType, quality) {
            try {
                return this._canvas.toDataURL(mimeType, quality);
            } catch (e) {
                try {
                    return this._canvas.toDataURL();
                } catch (err) {
                    Kinetic.Util.warn('Unable to get data URL. ' + err.message);
                    return '';
                }
            }
        }
    };
    Kinetic.SceneCanvas = function (config) {
        config = config || {};
        var width = config.width || 0, height = config.height || 0;
        Kinetic.Canvas.call(this, config);
        this.context = new Kinetic.SceneContext(this);
        this.setSize(width, height);
    };
    Kinetic.SceneCanvas.prototype = {
        setWidth: function (width) {
            var pixelRatio = this.pixelRatio, _context = this.getContext()._context;
            Kinetic.Canvas.prototype.setWidth.call(this, width);
            _context.scale(pixelRatio, pixelRatio);
        },
        setHeight: function (height) {
            var pixelRatio = this.pixelRatio, _context = this.getContext()._context;
            Kinetic.Canvas.prototype.setHeight.call(this, height);
            _context.scale(pixelRatio, pixelRatio);
        }
    };
    Kinetic.Util.extend(Kinetic.SceneCanvas, Kinetic.Canvas);
    Kinetic.HitCanvas = function (config) {
        config = config || {};
        var width = config.width || 0, height = config.height || 0;
        Kinetic.Canvas.call(this, config);
        this.context = new Kinetic.HitContext(this);
        this.setSize(width, height);
    };
    Kinetic.Util.extend(Kinetic.HitCanvas, Kinetic.Canvas);
}());
;
(function () {
    var COMMA = ',', OPEN_PAREN = '(', CLOSE_PAREN = ')', OPEN_PAREN_BRACKET = '([', CLOSE_BRACKET_PAREN = '])', SEMICOLON = ';', DOUBLE_PAREN = '()', EMPTY_STRING = '', EQUALS = '=', SET = 'set', CONTEXT_METHODS = [
            'arc',
            'arcTo',
            'beginPath',
            'bezierCurveTo',
            'clearRect',
            'clip',
            'closePath',
            'createLinearGradient',
            'createPattern',
            'createRadialGradient',
            'drawImage',
            'fill',
            'fillText',
            'getImageData',
            'lineTo',
            'moveTo',
            'putImageData',
            'quadraticCurveTo',
            'rect',
            'restore',
            'rotate',
            'save',
            'scale',
            'setLineDash',
            'setTransform',
            'stroke',
            'strokeText',
            'transform',
            'translate'
        ];
    Kinetic.Context = function (canvas) {
        this.init(canvas);
    };
    Kinetic.Context.prototype = {
        init: function (canvas) {
            this.canvas = canvas;
            this._context = canvas._canvas.getContext('2d');
            if (Kinetic.enableTrace) {
                this.traceArr = [];
                this._enableTrace();
            }
        },
        getTrace: function (relaxed) {
            var traceArr = this.traceArr, len = traceArr.length, str = '', n, trace, method, args;
            for (n = 0; n < len; n++) {
                trace = traceArr[n];
                method = trace.method;
                if (method) {
                    args = trace.args;
                    str += method;
                    if (relaxed) {
                        str += DOUBLE_PAREN;
                    } else {
                        if (Kinetic.Util._isArray(args[0])) {
                            str += OPEN_PAREN_BRACKET + args.join(COMMA) + CLOSE_BRACKET_PAREN;
                        } else {
                            str += OPEN_PAREN + args.join(COMMA) + CLOSE_PAREN;
                        }
                    }
                } else {
                    str += trace.property;
                    if (!relaxed) {
                        str += EQUALS + trace.val;
                    }
                }
                str += SEMICOLON;
            }
            return str;
        },
        clearTrace: function () {
            this.traceArr = [];
        },
        _trace: function (str) {
            var traceArr = this.traceArr, len;
            traceArr.push(str);
            len = traceArr.length;
            if (len >= Kinetic.traceArrMax) {
                traceArr.shift();
            }
        },
        reset: function () {
            var pixelRatio = this.getCanvas().getPixelRatio();
            this.setTransform(1 * pixelRatio, 0, 0, 1 * pixelRatio, 0, 0);
        },
        getCanvas: function () {
            return this.canvas;
        },
        clear: function () {
            var args = [].slice.call(arguments), canvas = this.getCanvas(), pos, size;
            if (args.length) {
                pos = Kinetic.Util._getXY(args);
                size = Kinetic.Util._getSize(args);
                this.clearRect(pos.x || 0, pos.y || 0, size.width, size.height);
            } else {
                this.clearRect(0, 0, canvas.getWidth(), canvas.getHeight());
            }
        },
        fillShape: function (shape) {
            if (shape.getFillEnabled()) {
                this._fill(shape);
            }
        },
        strokeShape: function (shape) {
            if (shape.getStrokeEnabled()) {
                this._stroke(shape);
            }
        },
        fillStrokeShape: function (shape) {
            var fillEnabled = shape.getFillEnabled();
            if (fillEnabled) {
                this._fill(shape);
            }
            if (shape.getStrokeEnabled()) {
                this._stroke(shape, shape.hasShadow() && shape.hasFill() && fillEnabled);
            }
        },
        _applyLineCap: function (shape) {
            var lineCap = shape.getLineCap();
            if (lineCap) {
                this.setAttr('lineCap', lineCap);
            }
        },
        _applyOpacity: function (shape) {
            var absOpacity = shape.getAbsoluteOpacity();
            if (absOpacity !== 1) {
                this.setAttr('globalAlpha', absOpacity);
            }
        },
        _applyLineJoin: function (shape) {
            var lineJoin = shape.getLineJoin();
            if (lineJoin) {
                this.setAttr('lineJoin', lineJoin);
            }
        },
        _applyAncestorTransforms: function (shape) {
            var m = shape.getAbsoluteTransform().getMatrix();
            this.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
        },
        _clip: function (container) {
            var clipX = container.getClipX() || 0, clipY = container.getClipY() || 0, clipWidth = container.getClipWidth(), clipHeight = container.getClipHeight();
            this.save();
            this._applyAncestorTransforms(container);
            this.beginPath();
            this.rect(clipX, clipY, clipWidth, clipHeight);
            this.clip();
            this.reset();
            container._drawChildren(this.getCanvas());
            this.restore();
        },
        setAttr: function (attr, val) {
            this._context[attr] = val;
        },
        arc: function () {
            var a = arguments;
            this._context.arc(a[0], a[1], a[2], a[3], a[4], a[5]);
        },
        beginPath: function () {
            this._context.beginPath();
        },
        bezierCurveTo: function () {
            var a = arguments;
            this._context.bezierCurveTo(a[0], a[1], a[2], a[3], a[4], a[5]);
        },
        clearRect: function () {
            var a = arguments;
            this._context.clearRect(a[0], a[1], a[2], a[3]);
        },
        clip: function () {
            this._context.clip();
        },
        closePath: function () {
            this._context.closePath();
        },
        createLinearGradient: function () {
            var a = arguments;
            return this._context.createLinearGradient(a[0], a[1], a[2], a[3]);
        },
        createPattern: function () {
            var a = arguments;
            return this._context.createPattern(a[0], a[1]);
        },
        createRadialGradient: function () {
            var a = arguments;
            return this._context.createRadialGradient(a[0], a[1], a[2], a[3], a[4], a[5]);
        },
        drawImage: function () {
            var a = arguments, _context = this._context;
            if (a.length === 3) {
                _context.drawImage(a[0], a[1], a[2]);
            } else if (a.length === 5) {
                _context.drawImage(a[0], a[1], a[2], a[3], a[4]);
            } else if (a.length === 9) {
                _context.drawImage(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8]);
            }
        },
        fill: function () {
            this._context.fill();
        },
        fillText: function () {
            var a = arguments;
            this._context.fillText(a[0], a[1], a[2]);
        },
        getImageData: function () {
            var a = arguments;
            return this._context.getImageData(a[0], a[1], a[2], a[3]);
        },
        lineTo: function () {
            var a = arguments;
            this._context.lineTo(a[0], a[1]);
        },
        moveTo: function () {
            var a = arguments;
            this._context.moveTo(a[0], a[1]);
        },
        rect: function () {
            var a = arguments;
            this._context.rect(a[0], a[1], a[2], a[3]);
        },
        putImageData: function () {
            var a = arguments;
            this._context.putImageData(a[0], a[1], a[2]);
        },
        quadraticCurveTo: function () {
            var a = arguments;
            this._context.quadraticCurveTo(a[0], a[1], a[2], a[3]);
        },
        restore: function () {
            this._context.restore();
        },
        rotate: function () {
            var a = arguments;
            this._context.rotate(a[0]);
        },
        save: function () {
            this._context.save();
        },
        scale: function () {
            var a = arguments;
            this._context.scale(a[0], a[1]);
        },
        setLineDash: function () {
            var a = arguments, _context = this._context;
            if (this._context.setLineDash) {
                _context.setLineDash(a[0]);
            } else if ('mozDash' in _context) {
                _context.mozDash = a[0];
            } else if ('webkitLineDash' in _context) {
                _context.webkitLineDash = a[0];
            }
        },
        setTransform: function () {
            var a = arguments;
            this._context.setTransform(a[0], a[1], a[2], a[3], a[4], a[5]);
        },
        stroke: function () {
            this._context.stroke();
        },
        strokeText: function () {
            var a = arguments;
            this._context.strokeText(a[0], a[1], a[2]);
        },
        transform: function () {
            var a = arguments;
            this._context.transform(a[0], a[1], a[2], a[3], a[4], a[5]);
        },
        translate: function () {
            var a = arguments;
            this._context.translate(a[0], a[1]);
        },
        _enableTrace: function () {
            var that = this, len = CONTEXT_METHODS.length, _roundArrValues = Kinetic.Util._roundArrValues, origSetter = this.setAttr, n, args;
            for (n = 0; n < len; n++) {
                (function (methodName) {
                    var origMethod = that[methodName], ret;
                    that[methodName] = function () {
                        args = _roundArrValues(Array.prototype.slice.call(arguments, 0));
                        ret = origMethod.apply(that, arguments);
                        that._trace({
                            method: methodName,
                            args: args
                        });
                        return ret;
                    };
                }(CONTEXT_METHODS[n]));
            }
            that.setAttr = function () {
                origSetter.apply(that, arguments);
                that._trace({
                    property: arguments[0],
                    val: arguments[1]
                });
            };
        }
    };
    Kinetic.SceneContext = function (canvas) {
        Kinetic.Context.call(this, canvas);
    };
    Kinetic.SceneContext.prototype = {
        _fillColor: function (shape) {
            var fill = shape.getFill();
            this.setAttr('fillStyle', fill);
            shape._fillFunc(this);
        },
        _fillPattern: function (shape) {
            var fillPatternImage = shape.getFillPatternImage(), fillPatternX = shape.getFillPatternX(), fillPatternY = shape.getFillPatternY(), fillPatternScale = shape.getFillPatternScale(), fillPatternRotation = shape.getFillPatternRotation(), fillPatternOffset = shape.getFillPatternOffset(), fillPatternRepeat = shape.getFillPatternRepeat();
            if (fillPatternX || fillPatternY) {
                this.translate(fillPatternX || 0, fillPatternY || 0);
            }
            if (fillPatternRotation) {
                this.rotate(fillPatternRotation);
            }
            if (fillPatternScale) {
                this.scale(fillPatternScale.x, fillPatternScale.y);
            }
            if (fillPatternOffset) {
                this.translate(-1 * fillPatternOffset.x, -1 * fillPatternOffset.y);
            }
            this.setAttr('fillStyle', this.createPattern(fillPatternImage, fillPatternRepeat || 'repeat'));
            this.fill();
        },
        _fillLinearGradient: function (shape) {
            var start = shape.getFillLinearGradientStartPoint(), end = shape.getFillLinearGradientEndPoint(), colorStops = shape.getFillLinearGradientColorStops(), grd = this.createLinearGradient(start.x, start.y, end.x, end.y);
            if (colorStops) {
                for (var n = 0; n < colorStops.length; n += 2) {
                    grd.addColorStop(colorStops[n], colorStops[n + 1]);
                }
                this.setAttr('fillStyle', grd);
                this.fill();
            }
        },
        _fillRadialGradient: function (shape) {
            var start = shape.getFillRadialGradientStartPoint(), end = shape.getFillRadialGradientEndPoint(), startRadius = shape.getFillRadialGradientStartRadius(), endRadius = shape.getFillRadialGradientEndRadius(), colorStops = shape.getFillRadialGradientColorStops(), grd = this.createRadialGradient(start.x, start.y, startRadius, end.x, end.y, endRadius);
            for (var n = 0; n < colorStops.length; n += 2) {
                grd.addColorStop(colorStops[n], colorStops[n + 1]);
            }
            this.setAttr('fillStyle', grd);
            this.fill();
        },
        _fill: function (shape, skipShadow) {
            var hasColor = shape.getFill(), hasPattern = shape.getFillPatternImage(), hasLinearGradient = shape.getFillLinearGradientColorStops(), hasRadialGradient = shape.getFillRadialGradientColorStops(), fillPriority = shape.getFillPriority();
            if (!skipShadow && shape.hasShadow()) {
                this.save();
                this._applyShadow(shape);
            }
            if (hasColor && fillPriority === 'color') {
                this._fillColor(shape);
            } else if (hasPattern && fillPriority === 'pattern') {
                this._fillPattern(shape);
            } else if (hasLinearGradient && fillPriority === 'linear-gradient') {
                this._fillLinearGradient(shape);
            } else if (hasRadialGradient && fillPriority === 'radial-gradient') {
                this._fillRadialGradient(shape);
            } else if (hasColor) {
                this._fillColor(shape);
            } else if (hasPattern) {
                this._fillPattern(shape);
            } else if (hasLinearGradient) {
                this._fillLinearGradient(shape);
            } else if (hasRadialGradient) {
                this._fillRadialGradient(shape);
            }
            if (!skipShadow && shape.hasShadow()) {
                this.restore();
                this._fill(shape, true);
            }
        },
        _stroke: function (shape, skipShadow) {
            var stroke = shape.getStroke(), strokeWidth = shape.getStrokeWidth(), dashArray = shape.getDashArray(), strokeScaleEnabled = shape.getStrokeScaleEnabled();
            if (stroke || strokeWidth) {
                if (!strokeScaleEnabled) {
                    this.save();
                    this.setTransform(1, 0, 0, 1, 0, 0);
                }
                this._applyLineCap(shape);
                if (dashArray && shape.getDashArrayEnabled()) {
                    this.setLineDash(dashArray);
                }
                if (!skipShadow && shape.hasShadow()) {
                    this._applyShadow(shape);
                }
                this.setAttr('lineWidth', strokeWidth || 2);
                this.setAttr('strokeStyle', stroke || 'black');
                shape._strokeFunc(this);
                if (!skipShadow && shape.hasShadow()) {
                    this._stroke(shape, true);
                }
                if (!strokeScaleEnabled) {
                    this.restore();
                }
            }
        },
        applyShadow: function (shape, drawFunc) {
            this.save();
            this._applyShadow(shape);
            drawFunc();
            this.restore();
            drawFunc();
        },
        _applyShadow: function (shape) {
            var util, absOpacity, color, blur, offset, shadowOpacity;
            if (shape.hasShadow() && shape.getShadowEnabled()) {
                util = Kinetic.Util;
                absOpacity = shape.getAbsoluteOpacity();
                color = util.get(shape.getShadowColor(), 'black');
                blur = util.get(shape.getShadowBlur(), 5);
                shadowOpacity = util.get(shape.getShadowOpacity(), 0);
                offset = util.get(shape.getShadowOffset(), {
                    x: 0,
                    y: 0
                });
                if (shadowOpacity) {
                    this.setAttr('globalAlpha', shadowOpacity * absOpacity);
                }
                this.setAttr('shadowColor', color);
                this.setAttr('shadowBlur', blur);
                this.setAttr('shadowOffsetX', offset.x);
                this.setAttr('shadowOffsetY', offset.y);
            }
        }
    };
    Kinetic.Util.extend(Kinetic.SceneContext, Kinetic.Context);
    Kinetic.HitContext = function (canvas) {
        Kinetic.Context.call(this, canvas);
    };
    Kinetic.HitContext.prototype = {
        _fill: function (shape) {
            this.save();
            this.setAttr('fillStyle', shape.colorKey);
            shape._fillFuncHit(this);
            this.restore();
        },
        _stroke: function (shape) {
            var stroke = shape.getStroke(), strokeWidth = shape.getStrokeWidth();
            if (stroke || strokeWidth) {
                this._applyLineCap(shape);
                this.setAttr('lineWidth', strokeWidth || 2);
                this.setAttr('strokeStyle', shape.colorKey);
                shape._strokeFuncHit(this);
            }
        }
    };
    Kinetic.Util.extend(Kinetic.HitContext, Kinetic.Context);
}());
;
(function () {
    var ABSOLUTE_OPACITY = 'absoluteOpacity', ABSOLUTE_TRANSFORM = 'absoluteTransform', ADD = 'add', B = 'b', BEFORE = 'before', BLACK = 'black', CHANGE = 'Change', CHILDREN = 'children', DEG = 'Deg', DOT = '.', EMPTY_STRING = '', G = 'g', GET = 'get', HASH = '#', ID = 'id', KINETIC = 'kinetic', LISTENING = 'listening', MOUSEENTER = 'mouseenter', MOUSELEAVE = 'mouseleave', NAME = 'name', OFF = 'off', ON = 'on', PRIVATE_GET = '_get', R = 'r', RGB = 'RGB', SET = 'set', SHAPE = 'Shape', SPACE = ' ', STAGE = 'Stage', TRANSFORM = 'transform', UPPER_B = 'B', UPPER_G = 'G', UPPER_HEIGHT = 'Height', UPPER_R = 'R', UPPER_WIDTH = 'Width', UPPER_X = 'X', UPPER_Y = 'Y', VISIBLE = 'visible', X = 'x', Y = 'y';
    Kinetic.Factory = {
        addGetterSetter: function (constructor, attr, def) {
            this.addGetter(constructor, attr, def);
            this.addSetter(constructor, attr);
        },
        addPointGetterSetter: function (constructor, attr, def) {
            this.addPointGetter(constructor, attr, def);
            this.addPointSetter(constructor, attr);
            this.addGetter(constructor, attr + UPPER_X, def);
            this.addGetter(constructor, attr + UPPER_Y, def);
            this.addSetter(constructor, attr + UPPER_X);
            this.addSetter(constructor, attr + UPPER_Y);
        },
        addBoxGetterSetter: function (constructor, attr, def) {
            this.addBoxGetter(constructor, attr, def);
            this.addBoxSetter(constructor, attr);
            this.addGetter(constructor, attr + UPPER_X, def);
            this.addGetter(constructor, attr + UPPER_Y, def);
            this.addGetter(constructor, attr + UPPER_WIDTH, def);
            this.addGetter(constructor, attr + UPPER_HEIGHT, def);
            this.addSetter(constructor, attr + UPPER_X);
            this.addSetter(constructor, attr + UPPER_Y);
            this.addSetter(constructor, attr + UPPER_WIDTH);
            this.addSetter(constructor, attr + UPPER_HEIGHT);
        },
        addPointsGetterSetter: function (constructor, attr) {
            this.addPointsGetter(constructor, attr);
            this.addPointsSetter(constructor, attr);
            this.addPointAdder(constructor, attr);
        },
        addRotationGetterSetter: function (constructor, attr, def) {
            this.addRotationGetter(constructor, attr, def);
            this.addRotationSetter(constructor, attr);
        },
        addColorGetterSetter: function (constructor, attr) {
            this.addGetter(constructor, attr);
            this.addSetter(constructor, attr);
            this.addColorRGBGetter(constructor, attr);
            this.addColorComponentGetter(constructor, attr, R);
            this.addColorComponentGetter(constructor, attr, G);
            this.addColorComponentGetter(constructor, attr, B);
            this.addColorRGBSetter(constructor, attr);
            this.addColorComponentSetter(constructor, attr, R);
            this.addColorComponentSetter(constructor, attr, G);
            this.addColorComponentSetter(constructor, attr, B);
        },
        addColorRGBGetter: function (constructor, attr) {
            var method = GET + Kinetic.Util._capitalize(attr) + RGB;
            constructor.prototype[method] = function () {
                return Kinetic.Util.getRGB(this.attrs[attr]);
            };
        },
        addColorComponentGetter: function (constructor, attr, c) {
            var prefix = GET + Kinetic.Util._capitalize(attr), method = prefix + Kinetic.Util._capitalize(c);
            constructor.prototype[method] = function () {
                return this[prefix + RGB]()[c];
            };
        },
        addPointsGetter: function (constructor, attr) {
            var that = this, method = GET + Kinetic.Util._capitalize(attr);
            constructor.prototype[method] = function () {
                var val = this.attrs[attr];
                return val === undefined ? [] : val;
            };
        },
        addGetter: function (constructor, attr, def) {
            var that = this, method = GET + Kinetic.Util._capitalize(attr);
            constructor.prototype[method] = function () {
                var val = this.attrs[attr];
                return val === undefined ? def : val;
            };
        },
        addPointGetter: function (constructor, attr) {
            var that = this, baseMethod = GET + Kinetic.Util._capitalize(attr);
            constructor.prototype[baseMethod] = function () {
                var that = this;
                return {
                    x: that[baseMethod + UPPER_X](),
                    y: that[baseMethod + UPPER_Y]()
                };
            };
        },
        addBoxGetter: function (constructor, attr) {
            var that = this, baseMethod = GET + Kinetic.Util._capitalize(attr);
            constructor.prototype[baseMethod] = function () {
                var that = this;
                return {
                    x: that[baseMethod + UPPER_X](),
                    y: that[baseMethod + UPPER_Y](),
                    width: that[baseMethod + UPPER_WIDTH](),
                    height: that[baseMethod + UPPER_HEIGHT]()
                };
            };
        },
        addRotationGetter: function (constructor, attr, def) {
            var that = this, method = GET + Kinetic.Util._capitalize(attr);
            constructor.prototype[method] = function () {
                var val = this.attrs[attr];
                if (val === undefined) {
                    val = def;
                }
                return val;
            };
            constructor.prototype[method + DEG] = function () {
                var val = this.attrs[attr];
                if (val === undefined) {
                    val = def;
                }
                return Kinetic.Util._radToDeg(val);
            };
        },
        addColorRGBSetter: function (constructor, attr) {
            var method = SET + Kinetic.Util._capitalize(attr) + RGB;
            constructor.prototype[method] = function (obj) {
                var r = obj && obj.r !== undefined ? obj.r | 0 : this.getAttr(attr + UPPER_R), g = obj && obj.g !== undefined ? obj.g | 0 : this.getAttr(attr + UPPER_G), b = obj && obj.b !== undefined ? obj.b | 0 : this.getAttr(attr + UPPER_B);
                this._setAttr(attr, HASH + Kinetic.Util._rgbToHex(r, g, b));
            };
        },
        addColorComponentSetter: function (constructor, attr, c) {
            var prefix = SET + Kinetic.Util._capitalize(attr), method = prefix + Kinetic.Util._capitalize(c);
            constructor.prototype[method] = function (val) {
                var obj = {};
                obj[c] = val;
                this[prefix + RGB](obj);
            };
        },
        addPointsSetter: function (constructor, attr) {
            var method = SET + Kinetic.Util._capitalize(attr);
            constructor.prototype[method] = function (val) {
                var points = Kinetic.Util._getPoints(val);
                this._setAttr('points', points);
            };
        },
        addSetter: function (constructor, attr) {
            var method = SET + Kinetic.Util._capitalize(attr);
            constructor.prototype[method] = function (val) {
                this._setAttr(attr, val);
            };
        },
        addPointSetter: function (constructor, attr) {
            var that = this, baseMethod = SET + Kinetic.Util._capitalize(attr);
            constructor.prototype[baseMethod] = function () {
                var pos = Kinetic.Util._getXY([].slice.call(arguments)), oldVal = this.attrs[attr], x = 0, y = 0;
                if (pos) {
                    x = pos.x;
                    y = pos.y;
                    this._fireBeforeChangeEvent(attr, oldVal, pos);
                    if (x !== undefined) {
                        this[baseMethod + UPPER_X](x);
                    }
                    if (y !== undefined) {
                        this[baseMethod + UPPER_Y](y);
                    }
                    this._fireChangeEvent(attr, oldVal, pos);
                }
            };
        },
        addBoxSetter: function (constructor, attr) {
            var that = this, baseMethod = SET + Kinetic.Util._capitalize(attr);
            constructor.prototype[baseMethod] = function () {
                var config = [].slice.call(arguments), pos = Kinetic.Util._getXY(config), size = Kinetic.Util._getSize(config), both = Kinetic.Util._merge(pos, size), oldVal = this.attrs[attr], x, y, width, height;
                if (both) {
                    x = both.x;
                    y = both.y;
                    width = both.width;
                    height = both.height;
                    this._fireBeforeChangeEvent(attr, oldVal, both);
                    if (x !== undefined) {
                        this[baseMethod + UPPER_X](x);
                    }
                    if (y !== undefined) {
                        this[baseMethod + UPPER_Y](y);
                    }
                    if (width !== undefined) {
                        this[baseMethod + UPPER_WIDTH](width);
                    }
                    if (height !== undefined) {
                        this[baseMethod + UPPER_HEIGHT](height);
                    }
                    this._fireChangeEvent(attr, oldVal, both);
                }
            };
        },
        addRotationSetter: function (constructor, attr) {
            var that = this, method = SET + Kinetic.Util._capitalize(attr);
            constructor.prototype[method] = function (val) {
                this._setAttr(attr, val);
            };
            constructor.prototype[method + DEG] = function (deg) {
                this._setAttr(attr, Kinetic.Util._degToRad(deg));
            };
        },
        addPointAdder: function (constructor, attr) {
            var that = this, baseMethod = ADD + Kinetic.Util._removeLastLetter(Kinetic.Util._capitalize(attr));
            constructor.prototype[baseMethod] = function () {
                var pos = Kinetic.Util._getXY([].slice.call(arguments)), oldVal = this.attrs[attr];
                if (pos) {
                    this._fireBeforeChangeEvent(attr, oldVal, pos);
                    this.attrs[attr].push(pos);
                    this._fireChangeEvent(attr, oldVal, pos);
                }
            };
        }
    };
}());
;
(function () {
    var ABSOLUTE_OPACITY = 'absoluteOpacity', ABSOLUTE_TRANSFORM = 'absoluteTransform', ADD = 'add', B = 'b', BEFORE = 'before', BLACK = 'black', CHANGE = 'Change', CHILDREN = 'children', DEG = 'Deg', DOT = '.', EMPTY_STRING = '', G = 'g', GET = 'get', HASH = '#', ID = 'id', KINETIC = 'kinetic', LISTENING = 'listening', MOUSEENTER = 'mouseenter', MOUSELEAVE = 'mouseleave', NAME = 'name', OFF = 'off', ON = 'on', PRIVATE_GET = '_get', R = 'r', RGB = 'RGB', SET = 'set', SHAPE = 'Shape', SPACE = ' ', STAGE = 'stage', TRANSFORM = 'transform', UPPER_B = 'B', UPPER_G = 'G', UPPER_HEIGHT = 'Height', UPPER_R = 'R', UPPER_STAGE = 'Stage', UPPER_WIDTH = 'Width', UPPER_X = 'X', UPPER_Y = 'Y', VISIBLE = 'visible', X = 'x', Y = 'y', transformChangeStr = [
            'xChange.kinetic',
            'yChange.kinetic',
            'scaleXChange.kinetic',
            'scaleYChange.kinetic',
            'skewXChange.kinetic',
            'skewYChange.kinetic',
            'rotationChange.kinetic',
            'offsetXChange.kinetic',
            'offsetYChange.kinetic'
        ].join(SPACE);
    Kinetic.Util.addMethods(Kinetic.Node, {
        _init: function (config) {
            var that = this;
            this._id = Kinetic.idCounter++;
            this.eventListeners = {};
            this.attrs = {};
            this.cache = {};
            this.setAttrs(config);
            this.on(transformChangeStr, function () {
                this._clearCache(TRANSFORM);
                that._clearSelfAndChildrenCache(ABSOLUTE_TRANSFORM);
            });
            this.on('visibleChange.kinetic', function () {
                that._clearSelfAndChildrenCache(VISIBLE);
            });
            this.on('listeningChange.kinetic', function () {
                that._clearSelfAndChildrenCache(LISTENING);
            });
            this.on('opacityChange.kinetic', function () {
                that._clearSelfAndChildrenCache(ABSOLUTE_OPACITY);
            });
        },
        clearCache: function () {
            this.cache = {};
        },
        _clearCache: function (attr) {
            delete this.cache[attr];
        },
        _getCache: function (attr, privateGetter) {
            var cache = this.cache[attr];
            if (cache === undefined) {
                this.cache[attr] = privateGetter.call(this);
            }
            return this.cache[attr];
        },
        _clearSelfAndChildrenCache: function (attr) {
            var that = this;
            this._clearCache(attr);
            if (this.children) {
                this.getChildren().each(function (node) {
                    node._clearSelfAndChildrenCache(attr);
                });
            }
        },
        on: function (evtStr, handler) {
            var events = evtStr.split(SPACE), len = events.length, n, event, parts, baseEvent, name;
            for (n = 0; n < len; n++) {
                event = events[n];
                parts = event.split(DOT);
                baseEvent = parts[0];
                name = parts[1] || EMPTY_STRING;
                if (!this.eventListeners[baseEvent]) {
                    this.eventListeners[baseEvent] = [];
                }
                this.eventListeners[baseEvent].push({
                    name: name,
                    handler: handler
                });
            }
            return this;
        },
        off: function (evtStr) {
            var events = evtStr.split(SPACE), len = events.length, n, i, t, event, parts, baseEvent, name;
            for (n = 0; n < len; n++) {
                event = events[n];
                parts = event.split(DOT);
                baseEvent = parts[0];
                name = parts[1];
                if (baseEvent) {
                    if (this.eventListeners[baseEvent]) {
                        this._off(baseEvent, name);
                    }
                } else {
                    for (t in this.eventListeners) {
                        this._off(t, name);
                    }
                }
            }
            return this;
        },
        remove: function () {
            var parent = this.getParent();
            if (parent && parent.children) {
                parent.children.splice(this.index, 1);
                parent._setChildrenIndices();
                delete this.parent;
            }
            this._clearSelfAndChildrenCache(STAGE);
            this._clearSelfAndChildrenCache(ABSOLUTE_TRANSFORM);
            this._clearSelfAndChildrenCache(VISIBLE);
            this._clearSelfAndChildrenCache(LISTENING);
            this._clearSelfAndChildrenCache(ABSOLUTE_OPACITY);
            return this;
        },
        destroy: function () {
            Kinetic._removeId(this.getId());
            Kinetic._removeName(this.getName(), this._id);
            this.remove();
        },
        getAttr: function (attr) {
            var method = GET + Kinetic.Util._capitalize(attr);
            if (Kinetic.Util._isFunction(this[method])) {
                return this[method]();
            } else {
                return this.attrs[attr];
            }
        },
        getAncestors: function () {
            var parent = this.getParent(), ancestors = new Kinetic.Collection();
            while (parent) {
                ancestors.push(parent);
                parent = parent.getParent();
            }
            return ancestors;
        },
        setAttr: function () {
            var args = Array.prototype.slice.call(arguments), attr = args[0], method = SET + Kinetic.Util._capitalize(attr), func = this[method];
            args.shift();
            if (Kinetic.Util._isFunction(func)) {
                func.apply(this, args);
            } else {
                this.attrs[attr] = args[0];
            }
            return this;
        },
        getAttrs: function () {
            return this.attrs || {};
        },
        setAttrs: function (config) {
            var key, method;
            if (config) {
                for (key in config) {
                    if (key === CHILDREN) {
                    } else {
                        method = SET + Kinetic.Util._capitalize(key);
                        if (Kinetic.Util._isFunction(this[method])) {
                            this[method](config[key]);
                        } else {
                            this._setAttr(key, config[key]);
                        }
                    }
                }
            }
            return this;
        },
        isListening: function () {
            return this._getCache(LISTENING, this._isListening);
        },
        _isListening: function () {
            var listening = this.getListening(), parent = this.getParent();
            if (listening && parent && !parent.isListening()) {
                return false;
            }
            return listening;
        },
        isVisible: function () {
            return this._getCache(VISIBLE, this._isVisible);
        },
        _isVisible: function () {
            var visible = this.getVisible(), parent = this.getParent();
            if (visible && parent && !parent.isVisible()) {
                return false;
            }
            return visible;
        },
        show: function () {
            this.setVisible(true);
            return this;
        },
        hide: function () {
            this.setVisible(false);
            return this;
        },
        getZIndex: function () {
            return this.index || 0;
        },
        getAbsoluteZIndex: function () {
            var level = this.getLevel(), that = this, index = 0, nodes, len, n, child;
            function addChildren(children) {
                nodes = [];
                len = children.length;
                for (n = 0; n < len; n++) {
                    child = children[n];
                    index++;
                    if (child.nodeType !== SHAPE) {
                        nodes = nodes.concat(child.getChildren().toArray());
                    }
                    if (child._id === that._id) {
                        n = len;
                    }
                }
                if (nodes.length > 0 && nodes[0].getLevel() <= level) {
                    addChildren(nodes);
                }
            }
            if (that.nodeType !== UPPER_STAGE) {
                addChildren(that.getStage().getChildren());
            }
            return index;
        },
        getLevel: function () {
            var level = 0, parent = this.parent;
            while (parent) {
                level++;
                parent = parent.parent;
            }
            return level;
        },
        setPosition: function () {
            var pos = Kinetic.Util._getXY([].slice.call(arguments));
            this.setX(pos.x);
            this.setY(pos.y);
            return this;
        },
        getPosition: function () {
            return {
                x: this.getX(),
                y: this.getY()
            };
        },
        getAbsolutePosition: function () {
            var absoluteMatrix = this.getAbsoluteTransform().getMatrix(), absoluteTransform = new Kinetic.Transform(), o = this.getOffset();
            absoluteTransform.m = absoluteMatrix.slice();
            absoluteTransform.translate(o.x, o.y);
            return absoluteTransform.getTranslation();
        },
        setAbsolutePosition: function () {
            var pos = Kinetic.Util._getXY([].slice.call(arguments)), trans = this._clearTransform(), it;
            this.attrs.x = trans.x;
            this.attrs.y = trans.y;
            delete trans.x;
            delete trans.y;
            it = this.getAbsoluteTransform();
            it.invert();
            it.translate(pos.x, pos.y);
            pos = {
                x: this.attrs.x + it.getTranslation().x,
                y: this.attrs.y + it.getTranslation().y
            };
            this.setPosition(pos.x, pos.y);
            this._setTransform(trans);
            return this;
        },
        _setTransform: function (trans) {
            var key;
            for (key in trans) {
                this.attrs[key] = trans[key];
            }
            this._clearCache(TRANSFORM);
            this._clearSelfAndChildrenCache(ABSOLUTE_TRANSFORM);
        },
        _clearTransform: function () {
            var trans = {
                    x: this.getX(),
                    y: this.getY(),
                    rotation: this.getRotation(),
                    scaleX: this.getScaleX(),
                    scaleY: this.getScaleY(),
                    offsetX: this.getOffsetX(),
                    offsetY: this.getOffsetY(),
                    skewX: this.getSkewX(),
                    skewY: this.getSkewY()
                };
            this.attrs.x = 0;
            this.attrs.y = 0;
            this.attrs.rotation = 0;
            this.attrs.scaleX = 1;
            this.attrs.scaleY = 1;
            this.attrs.offsetX = 0;
            this.attrs.offsetY = 0;
            this.attrs.skewX = 0;
            this.attrs.skewY = 0;
            this._clearCache(TRANSFORM);
            this._clearSelfAndChildrenCache(ABSOLUTE_TRANSFORM);
            return trans;
        },
        move: function () {
            var pos = Kinetic.Util._getXY([].slice.call(arguments)), x = this.getX(), y = this.getY();
            if (pos.x !== undefined) {
                x += pos.x;
            }
            if (pos.y !== undefined) {
                y += pos.y;
            }
            this.setPosition(x, y);
            return this;
        },
        _eachAncestorReverse: function (func, includeSelf) {
            var family = [], parent = this.getParent(), len, n;
            if (includeSelf) {
                family.unshift(this);
            }
            while (parent) {
                family.unshift(parent);
                parent = parent.parent;
            }
            len = family.length;
            for (n = 0; n < len; n++) {
                func(family[n]);
            }
        },
        rotate: function (theta) {
            this.setRotation(this.getRotation() + theta);
            return this;
        },
        rotateDeg: function (deg) {
            this.setRotation(this.getRotation() + Kinetic.Util._degToRad(deg));
            return this;
        },
        moveToTop: function () {
            var index = this.index;
            this.parent.children.splice(index, 1);
            this.parent.children.push(this);
            this.parent._setChildrenIndices();
            return true;
        },
        moveUp: function () {
            var index = this.index, len = this.parent.getChildren().length;
            if (index < len - 1) {
                this.parent.children.splice(index, 1);
                this.parent.children.splice(index + 1, 0, this);
                this.parent._setChildrenIndices();
                return true;
            }
            return false;
        },
        moveDown: function () {
            var index = this.index;
            if (index > 0) {
                this.parent.children.splice(index, 1);
                this.parent.children.splice(index - 1, 0, this);
                this.parent._setChildrenIndices();
                return true;
            }
            return false;
        },
        moveToBottom: function () {
            var index = this.index;
            if (index > 0) {
                this.parent.children.splice(index, 1);
                this.parent.children.unshift(this);
                this.parent._setChildrenIndices();
                return true;
            }
            return false;
        },
        setZIndex: function (zIndex) {
            var index = this.index;
            this.parent.children.splice(index, 1);
            this.parent.children.splice(zIndex, 0, this);
            this.parent._setChildrenIndices();
            return this;
        },
        getAbsoluteOpacity: function () {
            return this._getCache(ABSOLUTE_OPACITY, this._getAbsoluteOpacity);
        },
        _getAbsoluteOpacity: function () {
            var absOpacity = this.getOpacity();
            if (this.getParent()) {
                absOpacity *= this.getParent().getAbsoluteOpacity();
            }
            return absOpacity;
        },
        moveTo: function (newContainer) {
            Kinetic.Node.prototype.remove.call(this);
            newContainer.add(this);
            return this;
        },
        toObject: function () {
            var type = Kinetic.Util, obj = {}, attrs = this.getAttrs(), key, val;
            obj.attrs = {};
            for (key in attrs) {
                val = attrs[key];
                if (!type._isFunction(val) && !type._isElement(val) && !(type._isObject(val) && type._hasMethods(val))) {
                    obj.attrs[key] = val;
                }
            }
            obj.className = this.getClassName();
            return obj;
        },
        toJSON: function () {
            return JSON.stringify(this.toObject());
        },
        getParent: function () {
            return this.parent;
        },
        getLayer: function () {
            return this.getParent().getLayer();
        },
        getStage: function () {
            return this._getCache(STAGE, this._getStage);
        },
        _getStage: function () {
            var parent = this.getParent();
            if (parent) {
                return parent.getStage();
            } else {
                return undefined;
            }
        },
        fire: function (eventType, evt, bubble) {
            if (bubble) {
                this._fireAndBubble(eventType, evt || {});
            } else {
                this._fire(eventType, evt || {});
            }
            return this;
        },
        getAbsoluteTransform: function () {
            return this._getCache(ABSOLUTE_TRANSFORM, this._getAbsoluteTransform);
        },
        _getAbsoluteTransform: function () {
            var am = new Kinetic.Transform(), m;
            this._eachAncestorReverse(function (node) {
                m = node.getTransform();
                am.multiply(m);
            }, true);
            return am;
        },
        _getTransform: function () {
            var m = new Kinetic.Transform(), x = this.getX(), y = this.getY(), rotation = this.getRotation(), scaleX = this.getScaleX(), scaleY = this.getScaleY(), skewX = this.getSkewX(), skewY = this.getSkewY(), offsetX = this.getOffsetX(), offsetY = this.getOffsetY();
            if (x !== 0 || y !== 0) {
                m.translate(x, y);
            }
            if (rotation !== 0) {
                m.rotate(rotation);
            }
            if (skewX !== 0 || skewY !== 0) {
                m.skew(skewX, skewY);
            }
            if (scaleX !== 1 || scaleY !== 1) {
                m.scale(scaleX, scaleY);
            }
            if (offsetX !== 0 || offsetY !== 0) {
                m.translate(-1 * offsetX, -1 * offsetY);
            }
            return m;
        },
        clone: function (obj) {
            var className = this.getClassName(), node = new Kinetic[className](this.attrs), key, allListeners, len, n, listener;
            for (key in this.eventListeners) {
                allListeners = this.eventListeners[key];
                len = allListeners.length;
                for (n = 0; n < len; n++) {
                    listener = allListeners[n];
                    if (listener.name.indexOf(KINETIC) < 0) {
                        if (!node.eventListeners[key]) {
                            node.eventListeners[key] = [];
                        }
                        node.eventListeners[key].push(listener);
                    }
                }
            }
            node.setAttrs(obj);
            return node;
        },
        toDataURL: function (config) {
            config = config || {};
            var mimeType = config.mimeType || null, quality = config.quality || null, stage = this.getStage(), x = config.x || 0, y = config.y || 0, canvas = new Kinetic.SceneCanvas({
                    width: config.width || stage.getWidth(),
                    height: config.height || stage.getHeight(),
                    pixelRatio: 1
                }), context = canvas.getContext();
            context.save();
            if (x || y) {
                context.translate(-1 * x, -1 * y);
            }
            this.drawScene(canvas);
            context.restore();
            return canvas.toDataURL(mimeType, quality);
        },
        toImage: function (config) {
            Kinetic.Util._getImage(this.toDataURL(config), function (img) {
                config.callback(img);
            });
        },
        setSize: function () {
            var size = Kinetic.Util._getSize(Array.prototype.slice.call(arguments));
            this.setWidth(size.width);
            this.setHeight(size.height);
            return this;
        },
        getSize: function () {
            return {
                width: this.getWidth(),
                height: this.getHeight()
            };
        },
        getWidth: function () {
            return this.attrs.width || 0;
        },
        getHeight: function () {
            return this.attrs.height || 0;
        },
        getClassName: function () {
            return this.className || this.nodeType;
        },
        getType: function () {
            return this.nodeType;
        },
        _get: function (selector) {
            return this.nodeType === selector ? [this] : [];
        },
        _off: function (type, name) {
            var evtListeners = this.eventListeners[type], i, evtName;
            for (i = 0; i < evtListeners.length; i++) {
                evtName = evtListeners[i].name;
                if ((evtName !== 'kinetic' || name === 'kinetic') && (!name || evtName === name)) {
                    evtListeners.splice(i, 1);
                    if (evtListeners.length === 0) {
                        delete this.eventListeners[type];
                        break;
                    }
                    i--;
                }
            }
        },
        _fireBeforeChangeEvent: function (attr, oldVal, newVal) {
            this._fire(BEFORE + Kinetic.Util._capitalize(attr) + CHANGE, {
                oldVal: oldVal,
                newVal: newVal
            });
        },
        _fireChangeEvent: function (attr, oldVal, newVal) {
            this._fire(attr + CHANGE, {
                oldVal: oldVal,
                newVal: newVal
            });
        },
        setId: function (id) {
            var oldId = this.getId();
            Kinetic._removeId(oldId);
            Kinetic._addId(this, id);
            this._setAttr(ID, id);
            return this;
        },
        setName: function (name) {
            var oldName = this.getName();
            Kinetic._removeName(oldName, this._id);
            Kinetic._addName(this, name);
            this._setAttr(NAME, name);
            return this;
        },
        _setAttr: function (key, val) {
            var oldVal;
            if (val !== undefined) {
                oldVal = this.attrs[key];
                this._fireBeforeChangeEvent(key, oldVal, val);
                this.attrs[key] = val;
                this._fireChangeEvent(key, oldVal, val);
            }
        },
        _fireAndBubble: function (eventType, evt, compareShape) {
            var okayToRun = true;
            if (evt && this.nodeType === SHAPE) {
                evt.targetNode = this;
            }
            if (eventType === MOUSEENTER && compareShape && this._id === compareShape._id) {
                okayToRun = false;
            } else if (eventType === MOUSELEAVE && compareShape && this._id === compareShape._id) {
                okayToRun = false;
            }
            if (okayToRun) {
                this._fire(eventType, evt);
                if (evt && !evt.cancelBubble && this.parent) {
                    if (compareShape && compareShape.parent) {
                        this._fireAndBubble.call(this.parent, eventType, evt, compareShape.parent);
                    } else {
                        this._fireAndBubble.call(this.parent, eventType, evt);
                    }
                }
            }
        },
        _fire: function (eventType, evt) {
            var events = this.eventListeners[eventType], len, i;
            if (events) {
                len = events.length;
                for (i = 0; i < len; i++) {
                    events[i].handler.call(this, evt);
                }
            }
        },
        draw: function () {
            this.drawScene();
            this.drawHit();
            return this;
        },
        shouldDrawHit: function () {
            return this.isListening() && this.isVisible() && !Kinetic.isDragging();
        },
        isDraggable: function () {
            return false;
        },
        getTransform: function () {
            return this._getCache(TRANSFORM, this._getTransform);
        }
    });
    Kinetic.Node.create = function (json, container) {
        return this._createNode(JSON.parse(json), container);
    };
    Kinetic.Node._createNode = function (obj, container) {
        var className = Kinetic.Node.prototype.getClassName.call(obj), children = obj.children, no, len, n;
        if (container) {
            obj.attrs.container = container;
        }
        no = new Kinetic[className](obj.attrs);
        if (children) {
            len = children.length;
            for (n = 0; n < len; n++) {
                no.add(this._createNode(children[n]));
            }
        }
        return no;
    };
    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'x', 0);
    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'y', 0);
    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'opacity', 1);
    Kinetic.Factory.addGetter(Kinetic.Node, 'name');
    Kinetic.Factory.addGetter(Kinetic.Node, 'id');
    Kinetic.Factory.addRotationGetterSetter(Kinetic.Node, 'rotation', 0);
    Kinetic.Factory.addPointGetterSetter(Kinetic.Node, 'scale', 1);
    Kinetic.Factory.addPointGetterSetter(Kinetic.Node, 'skew', 0);
    Kinetic.Factory.addPointGetterSetter(Kinetic.Node, 'offset', 0);
    Kinetic.Factory.addSetter(Kinetic.Node, 'width');
    Kinetic.Factory.addSetter(Kinetic.Node, 'height');
    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'listening', true);
    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'visible', true);
    Kinetic.Collection.mapMethods([
        'on',
        'off',
        'remove',
        'destroy',
        'show',
        'hide',
        'move',
        'rotate',
        'moveToTop',
        'moveUp',
        'moveDown',
        'moveToBottom',
        'moveTo',
        'fire',
        'draw'
    ]);
}());
;
(function () {
    var BATCH_DRAW_STOP_TIME_DIFF = 500;
    Kinetic.Animation = function (func, layers) {
        this.func = func;
        this.setLayers(layers);
        this.id = Kinetic.Animation.animIdCounter++;
        this.frame = {
            time: 0,
            timeDiff: 0,
            lastTime: new Date().getTime()
        };
    };
    Kinetic.Animation.prototype = {
        setLayers: function (layers) {
            var lays = [];
            if (!layers) {
                lays = [];
            } else if (layers.length > 0) {
                lays = layers;
            } else {
                lays = [layers];
            }
            this.layers = lays;
        },
        getLayers: function () {
            return this.layers;
        },
        addLayer: function (layer) {
            var layers = this.layers, len, n;
            if (layers) {
                len = layers.length;
                for (n = 0; n < len; n++) {
                    if (layers[n]._id === layer._id) {
                        return false;
                    }
                }
            } else {
                this.layers = [];
            }
            this.layers.push(layer);
            return true;
        },
        isRunning: function () {
            var a = Kinetic.Animation, animations = a.animations;
            for (var n = 0; n < animations.length; n++) {
                if (animations[n].id === this.id) {
                    return true;
                }
            }
            return false;
        },
        start: function () {
            this.stop();
            this.frame.timeDiff = 0;
            this.frame.lastTime = new Date().getTime();
            Kinetic.Animation._addAnimation(this);
        },
        stop: function () {
            Kinetic.Animation._removeAnimation(this);
        },
        _updateFrameObject: function (time) {
            this.frame.timeDiff = time - this.frame.lastTime;
            this.frame.lastTime = time;
            this.frame.time += this.frame.timeDiff;
            this.frame.frameRate = 1000 / this.frame.timeDiff;
        }
    };
    Kinetic.Animation.animations = [];
    Kinetic.Animation.animIdCounter = 0;
    Kinetic.Animation.animRunning = false;
    Kinetic.Animation._addAnimation = function (anim) {
        this.animations.push(anim);
        this._handleAnimation();
    };
    Kinetic.Animation._removeAnimation = function (anim) {
        var id = anim.id, animations = this.animations, len = animations.length;
        for (var n = 0; n < len; n++) {
            if (animations[n].id === id) {
                this.animations.splice(n, 1);
                break;
            }
        }
    };
    Kinetic.Animation._runFrames = function () {
        var layerHash = {}, animations = this.animations, anim, layers, func, n, i, layersLen, layer, key;
        for (n = 0; n < animations.length; n++) {
            anim = animations[n];
            layers = anim.layers;
            func = anim.func;
            anim._updateFrameObject(new Date().getTime());
            layersLen = layers.length;
            for (i = 0; i < layersLen; i++) {
                layer = layers[i];
                if (layer._id !== undefined) {
                    layerHash[layer._id] = layer;
                }
            }
            if (func) {
                func.call(anim, anim.frame);
            }
        }
        for (key in layerHash) {
            layerHash[key].draw();
        }
    };
    Kinetic.Animation._animationLoop = function () {
        var that = this;
        if (this.animations.length > 0) {
            this._runFrames();
            Kinetic.Animation.requestAnimFrame(function () {
                that._animationLoop();
            });
        } else {
            this.animRunning = false;
        }
    };
    Kinetic.Animation._handleAnimation = function () {
        var that = this;
        if (!this.animRunning) {
            this.animRunning = true;
            that._animationLoop();
        }
    };
    RAF = function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || FRAF;
    }();
    function FRAF(callback) {
        window.setTimeout(callback, 1000 / 60);
    }
    Kinetic.Animation.requestAnimFrame = function (callback) {
        var raf = Kinetic.DD && Kinetic.DD.isDragging ? FRAF : RAF;
        raf(callback);
    };
    var moveTo = Kinetic.Node.prototype.moveTo;
    Kinetic.Node.prototype.moveTo = function (container) {
        moveTo.call(this, container);
    };
    Kinetic.Layer.prototype.batchDraw = function () {
        var that = this;
        if (!this.batchAnim) {
            this.batchAnim = new Kinetic.Animation(function () {
                if (that.lastBatchDrawTime && new Date().getTime() - that.lastBatchDrawTime > BATCH_DRAW_STOP_TIME_DIFF) {
                    that.batchAnim.stop();
                }
            }, this);
        }
        this.lastBatchDrawTime = new Date().getTime();
        if (!this.batchAnim.isRunning()) {
            this.draw();
            this.batchAnim.start();
        }
    };
    Kinetic.Stage.prototype.batchDraw = function () {
        this.getChildren().each(function (layer) {
            layer.batchDraw();
        });
    };
}());
;
(function () {
    var blacklist = {
            node: 1,
            duration: 1,
            easing: 1,
            onFinish: 1,
            yoyo: 1
        }, PAUSED = 1, PLAYING = 2, REVERSING = 3, idCounter = 0;
    Kinetic.Tween = function (config) {
        var that = this, node = config.node, nodeId = node._id, duration = config.duration || 1, easing = config.easing || Kinetic.Easings.Linear, yoyo = !!config.yoyo, key, tween, start, tweenId;
        this.node = node;
        this._id = idCounter++;
        this.anim = new Kinetic.Animation(function () {
            that.tween.onEnterFrame();
        }, node.getLayer() || node.getLayers());
        this.tween = new Tween(key, function (i) {
            that._tweenFunc(i);
        }, easing, 0, 1, duration * 1000, yoyo);
        this._addListeners();
        if (!Kinetic.Tween.attrs[nodeId]) {
            Kinetic.Tween.attrs[nodeId] = {};
        }
        if (!Kinetic.Tween.attrs[nodeId][this._id]) {
            Kinetic.Tween.attrs[nodeId][this._id] = {};
        }
        if (!Kinetic.Tween.tweens[nodeId]) {
            Kinetic.Tween.tweens[nodeId] = {};
        }
        for (key in config) {
            if (blacklist[key] === undefined) {
                this._addAttr(key, config[key]);
            }
        }
        this.reset();
        this.onFinish = config.onFinish;
        this.onReset = config.onReset;
    };
    Kinetic.Tween.attrs = {};
    Kinetic.Tween.tweens = {};
    Kinetic.Tween.prototype = {
        _addAttr: function (key, end) {
            var node = this.node, nodeId = node._id, start, diff, tweenId, n, len, startVal, endVal;
            tweenId = Kinetic.Tween.tweens[nodeId][key];
            if (tweenId) {
                delete Kinetic.Tween.attrs[nodeId][tweenId][key];
            }
            start = node.getAttr(key);
            if (Kinetic.Util._isArray(end)) {
                end = Kinetic.Util._getPoints(end);
                diff = [];
                len = end.length;
                for (n = 0; n < len; n++) {
                    startVal = start[n];
                    endVal = end[n];
                    diff.push({
                        x: endVal.x - startVal.x,
                        y: endVal.y - startVal.y
                    });
                }
            } else {
                diff = end - start;
            }
            Kinetic.Tween.attrs[nodeId][this._id][key] = {
                start: start,
                diff: diff
            };
            Kinetic.Tween.tweens[nodeId][key] = this._id;
        },
        _tweenFunc: function (i) {
            var node = this.node, attrs = Kinetic.Tween.attrs[node._id][this._id], key, attr, start, diff, newVal, n, len, startVal, diffVal;
            for (key in attrs) {
                attr = attrs[key];
                start = attr.start;
                diff = attr.diff;
                if (Kinetic.Util._isArray(start)) {
                    newVal = [];
                    len = start.length;
                    for (n = 0; n < len; n++) {
                        startVal = start[n];
                        diffVal = diff[n];
                        newVal.push({
                            x: startVal.x + diffVal.x * i,
                            y: startVal.y + diffVal.y * i
                        });
                    }
                } else {
                    newVal = start + diff * i;
                }
                node.setAttr(key, newVal);
            }
        },
        _addListeners: function () {
            var that = this;
            this.tween.onPlay = function () {
                that.anim.start();
            };
            this.tween.onReverse = function () {
                that.anim.start();
            };
            this.tween.onPause = function () {
                that.anim.stop();
            };
            this.tween.onFinish = function () {
                if (that.onFinish) {
                    that.onFinish();
                }
            };
            this.tween.onReset = function () {
                if (that.onReset) {
                    that.onReset();
                }
            };
        },
        play: function () {
            this.tween.play();
            return this;
        },
        reverse: function () {
            this.tween.reverse();
            return this;
        },
        reset: function () {
            var node = this.node;
            this.tween.reset();
            (node.getLayer() || node.getLayers()).draw();
            return this;
        },
        seek: function (t) {
            var node = this.node;
            this.tween.seek(t * 1000);
            (node.getLayer() || node.getLayers()).draw();
            return this;
        },
        pause: function () {
            this.tween.pause();
            return this;
        },
        finish: function () {
            var node = this.node;
            this.tween.finish();
            (node.getLayer() || node.getLayers()).draw();
            return this;
        },
        destroy: function () {
            var nodeId = this.node._id, thisId = this._id, attrs = Kinetic.Tween.tweens[nodeId], key;
            this.pause();
            for (key in attrs) {
                delete Kinetic.Tween.tweens[nodeId][key];
            }
            delete Kinetic.Tween.attrs[nodeId][thisId];
        }
    };
    var Tween = function (prop, propFunc, func, begin, finish, duration, yoyo) {
        this.prop = prop;
        this.propFunc = propFunc;
        this.begin = begin;
        this._pos = begin;
        this.duration = duration;
        this._change = 0;
        this.prevPos = 0;
        this.yoyo = yoyo;
        this._time = 0;
        this._position = 0;
        this._startTime = 0;
        this._finish = 0;
        this.func = func;
        this._change = finish - this.begin;
        this.pause();
    };
    Tween.prototype = {
        fire: function (str) {
            var handler = this[str];
            if (handler) {
                handler();
            }
        },
        setTime: function (t) {
            if (t > this.duration) {
                if (this.yoyo) {
                    this._time = this.duration;
                    this.reverse();
                } else {
                    this.finish();
                }
            } else if (t < 0) {
                if (this.yoyo) {
                    this._time = 0;
                    this.play();
                } else {
                    this.reset();
                }
            } else {
                this._time = t;
                this.update();
            }
        },
        getTime: function () {
            return this._time;
        },
        setPosition: function (p) {
            this.prevPos = this._pos;
            this.propFunc(p);
            this._pos = p;
        },
        getPosition: function (t) {
            if (t === undefined) {
                t = this._time;
            }
            return this.func(t, this.begin, this._change, this.duration);
        },
        play: function () {
            this.state = PLAYING;
            this._startTime = this.getTimer() - this._time;
            this.onEnterFrame();
            this.fire('onPlay');
        },
        reverse: function () {
            this.state = REVERSING;
            this._time = this.duration - this._time;
            this._startTime = this.getTimer() - this._time;
            this.onEnterFrame();
            this.fire('onReverse');
        },
        seek: function (t) {
            this.pause();
            this._time = t;
            this.update();
            this.fire('onSeek');
        },
        reset: function () {
            this.pause();
            this._time = 0;
            this.update();
            this.fire('onReset');
        },
        finish: function () {
            this.pause();
            this._time = this.duration;
            this.update();
            this.fire('onFinish');
        },
        update: function () {
            this.setPosition(this.getPosition(this._time));
        },
        onEnterFrame: function () {
            var t = this.getTimer() - this._startTime;
            if (this.state === PLAYING) {
                this.setTime(t);
            } else if (this.state === REVERSING) {
                this.setTime(this.duration - t);
            }
        },
        pause: function () {
            this.state = PAUSED;
            this.fire('onPause');
        },
        getTimer: function () {
            return new Date().getTime();
        }
    };
    Kinetic.Easings = {
        'BackEaseIn': function (t, b, c, d, a, p) {
            var s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        'BackEaseOut': function (t, b, c, d, a, p) {
            var s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        'BackEaseInOut': function (t, b, c, d, a, p) {
            var s = 1.70158;
            if ((t /= d / 2) < 1) {
                return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
            }
            return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
        },
        'ElasticEaseIn': function (t, b, c, d, a, p) {
            var s = 0;
            if (t === 0) {
                return b;
            }
            if ((t /= d) == 1) {
                return b + c;
            }
            if (!p) {
                p = d * 0.3;
            }
            if (!a || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        'ElasticEaseOut': function (t, b, c, d, a, p) {
            var s = 0;
            if (t === 0) {
                return b;
            }
            if ((t /= d) == 1) {
                return b + c;
            }
            if (!p) {
                p = d * 0.3;
            }
            if (!a || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
        },
        'ElasticEaseInOut': function (t, b, c, d, a, p) {
            var s = 0;
            if (t === 0) {
                return b;
            }
            if ((t /= d / 2) == 2) {
                return b + c;
            }
            if (!p) {
                p = d * (0.3 * 1.5);
            }
            if (!a || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            if (t < 1) {
                return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            }
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
        },
        'BounceEaseOut': function (t, b, c, d) {
            if ((t /= d) < 1 / 2.75) {
                return c * (7.5625 * t * t) + b;
            } else if (t < 2 / 2.75) {
                return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
            } else if (t < 2.5 / 2.75) {
                return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
            } else {
                return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
            }
        },
        'BounceEaseIn': function (t, b, c, d) {
            return c - Kinetic.Easings.BounceEaseOut(d - t, 0, c, d) + b;
        },
        'BounceEaseInOut': function (t, b, c, d) {
            if (t < d / 2) {
                return Kinetic.Easings.BounceEaseIn(t * 2, 0, c, d) * 0.5 + b;
            } else {
                return Kinetic.Easings.BounceEaseOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
            }
        },
        'EaseIn': function (t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        'EaseOut': function (t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        'EaseInOut': function (t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * t * t + b;
            }
            return -c / 2 * (--t * (t - 2) - 1) + b;
        },
        'StrongEaseIn': function (t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        'StrongEaseOut': function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        'StrongEaseInOut': function (t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * t * t * t * t * t + b;
            }
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        },
        'Linear': function (t, b, c, d) {
            return c * t / d + b;
        }
    };
}());
;
(function () {
    Kinetic.DD = {
        anim: new Kinetic.Animation(),
        isDragging: false,
        offset: {
            x: 0,
            y: 0
        },
        node: null,
        _drag: function (evt) {
            var dd = Kinetic.DD, node = dd.node;
            if (node) {
                node._setDragPosition(evt);
                if (!dd.isDragging) {
                    dd.isDragging = true;
                    node.fire('dragstart', evt, true);
                }
                node.fire('dragmove', evt, true);
            }
        },
        _endDragBefore: function (evt) {
            var dd = Kinetic.DD, node = dd.node, nodeType, layer;
            if (node) {
                nodeType = node.nodeType, layer = node.getLayer();
                dd.anim.stop();
                if (dd.isDragging) {
                    dd.isDragging = false;
                    Kinetic.listenClickTap = false;
                    if (evt) {
                        evt.dragEndNode = node;
                    }
                }
                delete dd.node;
                (layer || node).draw();
            }
        },
        _endDragAfter: function (evt) {
            evt = evt || {};
            var dragEndNode = evt.dragEndNode;
            if (evt && dragEndNode) {
                dragEndNode.fire('dragend', evt, true);
            }
        }
    };
    Kinetic.Node.prototype.startDrag = function () {
        var dd = Kinetic.DD, stage = this.getStage(), layer = this.getLayer(), pos = stage.getPointerPosition(), ap = this.getAbsolutePosition();
        if (pos) {
            if (dd.node) {
                dd.node.stopDrag();
            }
            dd.node = this;
            dd.offset.x = pos.x - ap.x;
            dd.offset.y = pos.y - ap.y;
            dd.anim.setLayers(layer || this.getLayers());
            dd.anim.start();
            this._setDragPosition();
        }
    };
    Kinetic.Node.prototype._setDragPosition = function (evt) {
        var dd = Kinetic.DD, pos = this.getStage().getPointerPosition(), dbf = this.getDragBoundFunc(), newNodePos = {
                x: pos.x - dd.offset.x,
                y: pos.y - dd.offset.y
            };
        if (dbf !== undefined) {
            newNodePos = dbf.call(this, newNodePos, evt);
        }
        this.setAbsolutePosition(newNodePos);
    };
    Kinetic.Node.prototype.stopDrag = function () {
        var dd = Kinetic.DD, evt = {};
        dd._endDragBefore(evt);
        dd._endDragAfter(evt);
    };
    Kinetic.Node.prototype.setDraggable = function (draggable) {
        this._setAttr('draggable', draggable);
        this._dragChange();
    };
    var origDestroy = Kinetic.Node.prototype.destroy;
    Kinetic.Node.prototype.destroy = function () {
        var dd = Kinetic.DD;
        if (dd.node && dd.node._id === this._id) {
            this.stopDrag();
        }
        origDestroy.call(this);
    };
    Kinetic.Node.prototype.isDragging = function () {
        var dd = Kinetic.DD;
        return dd.node && dd.node._id === this._id && dd.isDragging;
    };
    Kinetic.Node.prototype._listenDrag = function () {
        this._dragCleanup();
        var that = this;
        this.on('mousedown.kinetic touchstart.kinetic', function (evt) {
            if (!Kinetic.DD.node) {
                that.startDrag(evt);
            }
        });
    };
    Kinetic.Node.prototype._dragChange = function () {
        if (this.attrs.draggable) {
            this._listenDrag();
        } else {
            this._dragCleanup();
            var stage = this.getStage();
            var dd = Kinetic.DD;
            if (stage && dd.node && dd.node._id === this._id) {
                dd.node.stopDrag();
            }
        }
    };
    Kinetic.Node.prototype._dragCleanup = function () {
        this.off('mousedown.kinetic');
        this.off('touchstart.kinetic');
    };
    Kinetic.Factory.addGetterSetter(Kinetic.Node, 'dragBoundFunc');
    Kinetic.Factory.addGetter(Kinetic.Node, 'draggable', false);
    Kinetic.Node.prototype.isDraggable = Kinetic.Node.prototype.getDraggable;
    var html = document.getElementsByTagName('html')[0];
    html.addEventListener('mouseup', Kinetic.DD._endDragBefore, true);
    html.addEventListener('touchend', Kinetic.DD._endDragBefore, true);
    html.addEventListener('mouseup', Kinetic.DD._endDragAfter, false);
    html.addEventListener('touchend', Kinetic.DD._endDragAfter, false);
}());
;
(function () {
    Kinetic.Util.addMethods(Kinetic.Container, {
        __init: function (config) {
            this.children = new Kinetic.Collection();
            Kinetic.Node.call(this, config);
        },
        getChildren: function () {
            return this.children;
        },
        hasChildren: function () {
            return this.getChildren().length > 0;
        },
        removeChildren: function () {
            var children = this.children, child;
            while (children.length > 0) {
                child = children[0];
                if (child.hasChildren()) {
                    child.removeChildren();
                }
                child.remove();
            }
            return this;
        },
        destroyChildren: function () {
            var children = this.children;
            while (children.length > 0) {
                children[0].destroy();
            }
            return this;
        },
        add: function (child) {
            var children = this.children;
            this._validateAdd(child);
            child.index = children.length;
            child.parent = this;
            children.push(child);
            this._fire('add', { child: child });
            return this;
        },
        destroy: function () {
            if (this.hasChildren()) {
                this.destroyChildren();
            }
            Kinetic.Node.prototype.destroy.call(this);
        },
        find: function (selector) {
            var retArr = [], selectorArr = selector.replace(/ /g, '').split(','), len = selectorArr.length, n, i, sel, arr, node, children, clen;
            for (n = 0; n < len; n++) {
                sel = selectorArr[n];
                if (sel.charAt(0) === '#') {
                    node = this._getNodeById(sel.slice(1));
                    if (node) {
                        retArr.push(node);
                    }
                } else if (sel.charAt(0) === '.') {
                    arr = this._getNodesByName(sel.slice(1));
                    retArr = retArr.concat(arr);
                } else {
                    children = this.getChildren();
                    clen = children.length;
                    for (i = 0; i < clen; i++) {
                        retArr = retArr.concat(children[i]._get(sel));
                    }
                }
            }
            return Kinetic.Collection.toCollection(retArr);
        },
        _getNodeById: function (key) {
            var node = Kinetic.ids[key];
            if (node !== undefined && this.isAncestorOf(node)) {
                return node;
            }
            return null;
        },
        _getNodesByName: function (key) {
            var arr = Kinetic.names[key] || [];
            return this._getDescendants(arr);
        },
        _get: function (selector) {
            var retArr = Kinetic.Node.prototype._get.call(this, selector);
            var children = this.getChildren();
            var len = children.length;
            for (var n = 0; n < len; n++) {
                retArr = retArr.concat(children[n]._get(selector));
            }
            return retArr;
        },
        toObject: function () {
            var obj = Kinetic.Node.prototype.toObject.call(this);
            obj.children = [];
            var children = this.getChildren();
            var len = children.length;
            for (var n = 0; n < len; n++) {
                var child = children[n];
                obj.children.push(child.toObject());
            }
            return obj;
        },
        _getDescendants: function (arr) {
            var retArr = [];
            var len = arr.length;
            for (var n = 0; n < len; n++) {
                var node = arr[n];
                if (this.isAncestorOf(node)) {
                    retArr.push(node);
                }
            }
            return retArr;
        },
        isAncestorOf: function (node) {
            var parent = node.getParent();
            while (parent) {
                if (parent._id === this._id) {
                    return true;
                }
                parent = parent.getParent();
            }
            return false;
        },
        clone: function (obj) {
            var node = Kinetic.Node.prototype.clone.call(this, obj);
            this.getChildren().each(function (no) {
                node.add(no.clone());
            });
            return node;
        },
        getAllIntersections: function () {
            var pos = Kinetic.Util._getXY(Array.prototype.slice.call(arguments));
            var arr = [];
            var shapes = this.find('Shape');
            var len = shapes.length;
            for (var n = 0; n < len; n++) {
                var shape = shapes[n];
                if (shape.isVisible() && shape.intersects(pos)) {
                    arr.push(shape);
                }
            }
            return arr;
        },
        _setChildrenIndices: function () {
            this.children.each(function (child, n) {
                child.index = n;
            });
        },
        drawScene: function (canvas) {
            var layer = this.getLayer(), clip = this.getClipWidth() && this.getClipHeight(), children, n, len;
            if (!canvas && layer) {
                canvas = layer.getCanvas();
            }
            if (this.isVisible()) {
                if (clip) {
                    canvas.getContext()._clip(this);
                } else {
                    this._drawChildren(canvas);
                }
            }
            return this;
        },
        _drawChildren: function (canvas) {
            this.children.each(function (child) {
                child.drawScene(canvas);
            });
        },
        drawHit: function () {
            var hasClip = this.getClipWidth() && this.getClipHeight() && this.nodeType !== 'Stage', n = 0, len = 0, children = [], hitCanvas;
            if (this.shouldDrawHit()) {
                if (hasClip) {
                    hitCanvas = this.getLayer().hitCanvas;
                    hitCanvas.getContext()._clip(this);
                }
                children = this.children;
                len = children.length;
                for (n = 0; n < len; n++) {
                    children[n].drawHit();
                }
                if (hasClip) {
                    hitCanvas.getContext()._context.restore();
                }
            }
            return this;
        }
    });
    Kinetic.Util.extend(Kinetic.Container, Kinetic.Node);
    Kinetic.Container.prototype.get = Kinetic.Container.prototype.find;
    Kinetic.Factory.addBoxGetterSetter(Kinetic.Container, 'clip');
}());
;
(function () {
    var HAS_SHADOW = 'hasShadow';
    function _fillFunc(context) {
        context.fill();
    }
    function _strokeFunc(context) {
        context.stroke();
    }
    function _fillFuncHit(context) {
        context.fill();
    }
    function _strokeFuncHit(context) {
        context.stroke();
    }
    function _clearHasShadowCache() {
        this._clearCache(HAS_SHADOW);
    }
    Kinetic.Util.addMethods(Kinetic.Shape, {
        __init: function (config) {
            this.nodeType = 'Shape';
            this._fillFunc = _fillFunc;
            this._strokeFunc = _strokeFunc;
            this._fillFuncHit = _fillFuncHit;
            this._strokeFuncHit = _strokeFuncHit;
            var shapes = Kinetic.shapes;
            var key;
            while (true) {
                key = Kinetic.Util.getRandomColor();
                if (key && !(key in shapes)) {
                    break;
                }
            }
            this.colorKey = key;
            shapes[key] = this;
            Kinetic.Node.call(this, config);
            this._setDrawFuncs();
            this.on('shadowColorChange.kinetic shadowBlurChange.kinetic shadowOffsetChange.kinetic shadowOpacityChange.kinetic', _clearHasShadowCache);
        },
        hasChildren: function () {
            return false;
        },
        getChildren: function () {
            return [];
        },
        getContext: function () {
            return this.getLayer().getContext();
        },
        getCanvas: function () {
            return this.getLayer().getCanvas();
        },
        hasShadow: function () {
            return this._getCache(HAS_SHADOW, this._hasShadow);
        },
        _hasShadow: function () {
            return this.getShadowOpacity() !== 0 && !!(this.getShadowColor() || this.getShadowBlur() || this.getShadowOffsetX() || this.getShadowOffsetY());
        },
        hasFill: function () {
            return !!(this.getFill() || this.getFillPatternImage() || this.getFillLinearGradientColorStops() || this.getFillRadialGradientColorStops());
        },
        _get: function (selector) {
            return this.className === selector || this.nodeType === selector ? [this] : [];
        },
        intersects: function () {
            var pos = Kinetic.Util._getXY(Array.prototype.slice.call(arguments));
            var stage = this.getStage();
            var hitCanvas = stage.hitCanvas;
            hitCanvas.getContext().clear();
            this.drawScene(hitCanvas);
            var p = hitCanvas.context.getImageData(pos.x | 0, pos.y | 0, 1, 1).data;
            return p[3] > 0;
        },
        enableFill: function () {
            this._setAttr('fillEnabled', true);
            return this;
        },
        disableFill: function () {
            this._setAttr('fillEnabled', false);
            return this;
        },
        enableStroke: function () {
            this._setAttr('strokeEnabled', true);
            return this;
        },
        disableStroke: function () {
            this._setAttr('strokeEnabled', false);
            return this;
        },
        enableStrokeScale: function () {
            this._setAttr('strokeScaleEnabled', true);
            return this;
        },
        disableStrokeScale: function () {
            this._setAttr('strokeScaleEnabled', false);
            return this;
        },
        enableShadow: function () {
            this._setAttr('shadowEnabled', true);
            return this;
        },
        disableShadow: function () {
            this._setAttr('shadowEnabled', false);
            return this;
        },
        enableDashArray: function () {
            this._setAttr('dashArrayEnabled', true);
            return this;
        },
        disableDashArray: function () {
            this._setAttr('dashArrayEnabled', false);
            return this;
        },
        destroy: function () {
            Kinetic.Node.prototype.destroy.call(this);
            delete Kinetic.shapes[this.colorKey];
            return this;
        },
        drawScene: function (canvas) {
            canvas = canvas || this.getLayer().getCanvas();
            var drawFunc = this.getDrawFunc(), context = canvas.getContext();
            if (drawFunc && this.isVisible()) {
                context.save();
                context._applyOpacity(this);
                context._applyLineJoin(this);
                context._applyAncestorTransforms(this);
                drawFunc.call(this, context);
                context.restore();
            }
            return this;
        },
        drawHit: function () {
            var attrs = this.getAttrs(), drawFunc = attrs.drawHitFunc || attrs.drawFunc, canvas = this.getLayer().hitCanvas, context = canvas.getContext();
            if (drawFunc && this.shouldDrawHit()) {
                context.save();
                context._applyLineJoin(this);
                context._applyAncestorTransforms(this);
                drawFunc.call(this, context);
                context.restore();
            }
            return this;
        },
        _setDrawFuncs: function () {
            if (!this.attrs.drawFunc && this.drawFunc) {
                this.setDrawFunc(this.drawFunc);
            }
            if (!this.attrs.drawHitFunc && this.drawHitFunc) {
                this.setDrawHitFunc(this.drawHitFunc);
            }
        }
    });
    Kinetic.Util.extend(Kinetic.Shape, Kinetic.Node);
    Kinetic.Factory.addColorGetterSetter(Kinetic.Shape, 'stroke');
    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'lineJoin');
    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'lineCap');
    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'strokeWidth');
    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'drawFunc');
    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'drawHitFunc');
    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'dashArray');
    Kinetic.Factory.addColorGetterSetter(Kinetic.Shape, 'shadowColor');
    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'shadowBlur');
    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'shadowOpacity');
    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillPatternImage');
    Kinetic.Factory.addColorGetterSetter(Kinetic.Shape, 'fill');
    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillPatternX');
    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillPatternY');
    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillLinearGradientColorStops');
    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillRadialGradientStartRadius');
    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillRadialGradientEndRadius');
    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillRadialGradientColorStops');
    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillPatternRepeat');
    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillEnabled', true);
    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'strokeEnabled', true);
    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'shadowEnabled', true);
    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'dashArrayEnabled', true);
    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'fillPriority', 'color');
    Kinetic.Factory.addGetterSetter(Kinetic.Shape, 'strokeScaleEnabled', true);
    Kinetic.Factory.addPointGetterSetter(Kinetic.Shape, 'fillPatternOffset', 0);
    Kinetic.Factory.addPointGetterSetter(Kinetic.Shape, 'fillPatternScale', 1);
    Kinetic.Factory.addPointGetterSetter(Kinetic.Shape, 'fillLinearGradientStartPoint', 0);
    Kinetic.Factory.addPointGetterSetter(Kinetic.Shape, 'fillLinearGradientEndPoint', 0);
    Kinetic.Factory.addPointGetterSetter(Kinetic.Shape, 'fillRadialGradientStartPoint', 0);
    Kinetic.Factory.addPointGetterSetter(Kinetic.Shape, 'fillRadialGradientEndPoint', 0);
    Kinetic.Factory.addPointGetterSetter(Kinetic.Shape, 'shadowOffset', 0);
    Kinetic.Factory.addRotationGetterSetter(Kinetic.Shape, 'fillPatternRotation', 0);
}());
;
(function () {
    var STAGE = 'Stage', STRING = 'string', PX = 'px', MOUSEOUT = 'mouseout', MOUSELEAVE = 'mouseleave', MOUSEOVER = 'mouseover', MOUSEENTER = 'mouseenter', MOUSEMOVE = 'mousemove', MOUSEDOWN = 'mousedown', MOUSEUP = 'mouseup', CLICK = 'click', DBL_CLICK = 'dblclick', TOUCHSTART = 'touchstart', TOUCHEND = 'touchend', TAP = 'tap', DBL_TAP = 'dbltap', TOUCHMOVE = 'touchmove', CONTENT_MOUSEOUT = 'contentMouseout', CONTENT_MOUSELEAVE = 'contentMouseleave', CONTENT_MOUSEOVER = 'contentMouseover', CONTENT_MOUSEENTER = 'contentMouseenter', CONTENT_MOUSEMOVE = 'contentMousemove', CONTENT_MOUSEDOWN = 'contentMousedown', CONTENT_MOUSEUP = 'contentMouseup', CONTENT_CLICK = 'contentClick', CONTENT_DBL_CLICK = 'contentDblclick', CONTENT_TOUCHSTART = 'contentTouchstart', CONTENT_TOUCHEND = 'contentTouchend', CONTENT_TAP = 'contentTap', CONTENT_DBL_TAP = 'contentDbltap', CONTENT_TOUCHMOVE = 'contentTouchmove', DIV = 'div', RELATIVE = 'relative', INLINE_BLOCK = 'inline-block', KINETICJS_CONTENT = 'kineticjs-content', SPACE = ' ', UNDERSCORE = '_', CONTAINER = 'container', EMPTY_STRING = '', EVENTS = [
            MOUSEDOWN,
            MOUSEMOVE,
            MOUSEUP,
            MOUSEOUT,
            TOUCHSTART,
            TOUCHMOVE,
            TOUCHEND,
            MOUSEOVER
        ], eventsLength = EVENTS.length;
    function addEvent(ctx, eventName) {
        ctx.content.addEventListener(eventName, function (evt) {
            ctx[UNDERSCORE + eventName](evt);
        }, false);
    }
    Kinetic.Util.addMethods(Kinetic.Stage, {
        ___init: function (config) {
            Kinetic.Container.call(this, config);
            this.nodeType = STAGE;
            this._id = Kinetic.idCounter++;
            this._buildDOM();
            this._bindContentEvents();
            Kinetic.stages.push(this);
        },
        _validateAdd: function (child) {
            if (child.getType() !== 'Layer') {
                Kinetic.Util.error('You may only add layers to the stage.');
            }
        },
        setContainer: function (container) {
            if (typeof container === STRING) {
                container = document.getElementById(container);
            }
            this._setAttr(CONTAINER, container);
            return this;
        },
        draw: function () {
            Kinetic.Node.prototype.draw.call(this);
            return this;
        },
        setHeight: function (height) {
            Kinetic.Node.prototype.setHeight.call(this, height);
            this._resizeDOM();
            return this;
        },
        setWidth: function (width) {
            Kinetic.Node.prototype.setWidth.call(this, width);
            this._resizeDOM();
            return this;
        },
        clear: function () {
            var layers = this.children, len = layers.length, n;
            for (n = 0; n < len; n++) {
                layers[n].clear();
            }
            return this;
        },
        destroy: function () {
            var content = this.content;
            Kinetic.Container.prototype.destroy.call(this);
            if (content && Kinetic.Util._isInDocument(content)) {
                this.getContainer().removeChild(content);
            }
        },
        getMousePosition: function () {
            return this.mousePos;
        },
        getTouchPosition: function () {
            return this.touchPos;
        },
        getPointerPosition: function () {
            return this.getTouchPosition() || this.getMousePosition();
        },
        getStage: function () {
            return this;
        },
        getContent: function () {
            return this.content;
        },
        toDataURL: function (config) {
            config = config || {};
            var mimeType = config.mimeType || null, quality = config.quality || null, x = config.x || 0, y = config.y || 0, canvas = new Kinetic.SceneCanvas({
                    width: config.width || this.getWidth(),
                    height: config.height || this.getHeight(),
                    pixelRatio: 1
                }), _context = canvas.getContext()._context, layers = this.children;
            if (x || y) {
                _context.translate(-1 * x, -1 * y);
            }
            function drawLayer(n) {
                var layer = layers[n], layerUrl = layer.toDataURL(), imageObj = new Image();
                imageObj.onload = function () {
                    _context.drawImage(imageObj, 0, 0);
                    if (n < layers.length - 1) {
                        drawLayer(n + 1);
                    } else {
                        config.callback(canvas.toDataURL(mimeType, quality));
                    }
                };
                imageObj.src = layerUrl;
            }
            drawLayer(0);
        },
        toImage: function (config) {
            var cb = config.callback;
            config.callback = function (dataUrl) {
                Kinetic.Util._getImage(dataUrl, function (img) {
                    cb(img);
                });
            };
            this.toDataURL(config);
        },
        getIntersection: function () {
            var pos = Kinetic.Util._getXY(Array.prototype.slice.call(arguments)), layers = this.getChildren(), len = layers.length, end = len - 1, n, obj;
            for (n = end; n >= 0; n--) {
                obj = layers[n].getIntersection(pos);
                if (obj) {
                    return obj;
                }
            }
            return null;
        },
        _resizeDOM: function () {
            if (this.content) {
                var width = this.getWidth(), height = this.getHeight(), layers = this.getChildren(), len = layers.length, n, layer;
                this.content.style.width = width + PX;
                this.content.style.height = height + PX;
                this.bufferCanvas.setSize(width, height, 1);
                this.hitCanvas.setSize(width, height);
                for (n = 0; n < len; n++) {
                    layer = layers[n];
                    layer.getCanvas().setSize(width, height);
                    layer.hitCanvas.setSize(width, height);
                    layer.draw();
                }
            }
        },
        add: function (layer) {
            Kinetic.Container.prototype.add.call(this, layer);
            layer.canvas.setSize(this.attrs.width, this.attrs.height);
            layer.hitCanvas.setSize(this.attrs.width, this.attrs.height);
            layer.draw();
            this.content.appendChild(layer.canvas._canvas);
            return this;
        },
        getParent: function () {
            return null;
        },
        getLayer: function () {
            return null;
        },
        getLayers: function () {
            return this.getChildren();
        },
        _setPointerPosition: function (evt) {
            if (!evt) {
                evt = window.event;
            }
            this._setMousePosition(evt);
            this._setTouchPosition(evt);
        },
        _bindContentEvents: function () {
            var that = this, n;
            for (n = 0; n < eventsLength; n++) {
                addEvent(this, EVENTS[n]);
            }
        },
        _mouseover: function (evt) {
            this._fire(CONTENT_MOUSEOVER, evt);
        },
        _mouseout: function (evt) {
            this._setPointerPosition(evt);
            var targetShape = this.targetShape;
            if (targetShape && !Kinetic.isDragging()) {
                targetShape._fireAndBubble(MOUSEOUT, evt);
                targetShape._fireAndBubble(MOUSELEAVE, evt);
                this.targetShape = null;
            }
            this.mousePos = undefined;
            this._fire(CONTENT_MOUSEOUT, evt);
        },
        _mousemove: function (evt) {
            this._setPointerPosition(evt);
            var dd = Kinetic.DD, obj = this.getIntersection(this.getPointerPosition()), shape = obj && obj.shape ? obj.shape : undefined;
            if (shape) {
                if (!Kinetic.isDragging() && obj.pixel[3] === 255 && (!this.targetShape || this.targetShape._id !== shape._id)) {
                    if (this.targetShape) {
                        this.targetShape._fireAndBubble(MOUSEOUT, evt, shape);
                        this.targetShape._fireAndBubble(MOUSELEAVE, evt, shape);
                    }
                    shape._fireAndBubble(MOUSEOVER, evt, this.targetShape);
                    shape._fireAndBubble(MOUSEENTER, evt, this.targetShape);
                    this.targetShape = shape;
                } else {
                    shape._fireAndBubble(MOUSEMOVE, evt);
                }
            } else {
                if (this.targetShape && !Kinetic.isDragging()) {
                    this.targetShape._fireAndBubble(MOUSEOUT, evt);
                    this.targetShape._fireAndBubble(MOUSELEAVE, evt);
                    this.targetShape = null;
                }
            }
            this._fire(CONTENT_MOUSEMOVE, evt);
            if (dd) {
                dd._drag(evt);
            }
            if (evt.preventDefault) {
                evt.preventDefault();
            }
        },
        _mousedown: function (evt) {
            this._setPointerPosition(evt);
            var obj = this.getIntersection(this.getPointerPosition()), shape = obj && obj.shape ? obj.shape : undefined;
            Kinetic.listenClickTap = true;
            if (shape) {
                this.clickStartShape = shape;
                shape._fireAndBubble(MOUSEDOWN, evt);
            }
            this._fire(CONTENT_MOUSEDOWN);
            if (evt.preventDefault) {
                evt.preventDefault();
            }
        },
        _mouseup: function (evt) {
            this._setPointerPosition(evt);
            var that = this, obj = this.getIntersection(this.getPointerPosition()), shape = obj && obj.shape ? obj.shape : undefined, fireDblClick = false;
            if (Kinetic.inDblClickWindow) {
                fireDblClick = true;
                Kinetic.inDblClickWindow = false;
            } else {
                Kinetic.inDblClickWindow = true;
            }
            setTimeout(function () {
                Kinetic.inDblClickWindow = false;
            }, Kinetic.dblClickWindow);
            if (shape) {
                shape._fireAndBubble(MOUSEUP, evt);
                if (Kinetic.listenClickTap && shape._id === this.clickStartShape._id) {
                    shape._fireAndBubble(CLICK, evt);
                    if (fireDblClick) {
                        shape._fireAndBubble(DBL_CLICK, evt);
                    }
                }
            }
            this._fire(CONTENT_MOUSEUP);
            if (Kinetic.listenClickTap) {
                this._fire(CONTENT_CLICK, evt);
                if (fireDblClick) {
                    this._fire(CONTENT_DBL_CLICK, evt);
                }
            }
            Kinetic.listenClickTap = false;
            if (evt.preventDefault) {
                evt.preventDefault();
            }
        },
        _touchstart: function (evt) {
            this._setPointerPosition(evt);
            var obj = this.getIntersection(this.getPointerPosition()), shape = obj && obj.shape ? obj.shape : undefined;
            Kinetic.listenClickTap = true;
            if (shape) {
                this.tapStartShape = shape;
                shape._fireAndBubble(TOUCHSTART, evt);
                if (shape.isListening() && evt.preventDefault) {
                    evt.preventDefault();
                }
            }
            this._fire(CONTENT_TOUCHSTART, evt);
        },
        _touchend: function (evt) {
            this._setPointerPosition(evt);
            var that = this, obj = this.getIntersection(this.getPointerPosition()), shape = obj && obj.shape ? obj.shape : undefined, fireDblClick = false;
            if (Kinetic.inDblClickWindow) {
                fireDblClick = true;
                Kinetic.inDblClickWindow = false;
            } else {
                Kinetic.inDblClickWindow = true;
            }
            setTimeout(function () {
                Kinetic.inDblClickWindow = false;
            }, Kinetic.dblClickWindow);
            if (shape) {
                shape._fireAndBubble(TOUCHEND, evt);
                if (Kinetic.listenClickTap && shape._id === this.tapStartShape._id) {
                    shape._fireAndBubble(TAP, evt);
                    if (fireDblClick) {
                        shape._fireAndBubble(DBL_TAP, evt);
                    }
                }
                if (shape.isListening() && evt.preventDefault) {
                    evt.preventDefault();
                }
            }
            if (Kinetic.listenClickTap) {
                this._fire(CONTENT_TOUCHEND, evt);
                if (fireDblClick) {
                    this._fire(CONTENT_DBL_TAP, evt);
                }
            }
            Kinetic.listenClickTap = false;
        },
        _touchmove: function (evt) {
            this._setPointerPosition(evt);
            var dd = Kinetic.DD, obj = this.getIntersection(this.getPointerPosition()), shape = obj && obj.shape ? obj.shape : undefined;
            if (shape) {
                shape._fireAndBubble(TOUCHMOVE, evt);
                if (shape.isListening() && evt.preventDefault) {
                    evt.preventDefault();
                }
            }
            this._fire(CONTENT_TOUCHMOVE, evt);
            if (dd) {
                dd._drag(evt);
            }
        },
        _setMousePosition: function (evt) {
            var mouseX = evt.offsetX !== undefined ? evt.offsetX : evt.layerX || evt.clientX - this._getContentPosition().left, mouseY = evt.offsetY !== undefined ? evt.offsetY : evt.layerY || evt.clientY - this._getContentPosition().top;
            this.mousePos = {
                x: mouseX,
                y: mouseY
            };
        },
        _setTouchPosition: function (evt) {
            var touch, touchX, touchY;
            if (evt.touches !== undefined && evt.touches.length === 1) {
                touch = evt.touches[0];
                touchX = touch.clientX - this._getContentPosition().left;
                touchY = touch.clientY - this._getContentPosition().top;
                this.touchPos = {
                    x: touchX,
                    y: touchY
                };
            }
        },
        _getContentPosition: function () {
            var rect = this.content.getBoundingClientRect();
            return {
                top: rect.top,
                left: rect.left
            };
        },
        _buildDOM: function () {
            var container = this.getContainer();
            container.innerHTML = EMPTY_STRING;
            this.content = document.createElement(DIV);
            this.content.style.position = RELATIVE;
            this.content.style.display = INLINE_BLOCK;
            this.content.className = KINETICJS_CONTENT;
            container.appendChild(this.content);
            this.bufferCanvas = new Kinetic.SceneCanvas();
            this.hitCanvas = new Kinetic.HitCanvas();
            this._resizeDOM();
        },
        _onContent: function (typesStr, handler) {
            var types = typesStr.split(SPACE), len = types.length, n, baseEvent;
            for (n = 0; n < len; n++) {
                baseEvent = types[n];
                this.content.addEventListener(baseEvent, handler, false);
            }
        }
    });
    Kinetic.Util.extend(Kinetic.Stage, Kinetic.Container);
    Kinetic.Factory.addGetter(Kinetic.Stage, 'container');
}());
;
(function () {
    var HASH = '#', BEFORE_DRAW = 'beforeDraw', DRAW = 'draw';
    Kinetic.Util.addMethods(Kinetic.Layer, {
        ___init: function (config) {
            this.nodeType = 'Layer';
            this.canvas = new Kinetic.SceneCanvas();
            this.hitCanvas = new Kinetic.HitCanvas();
            Kinetic.Container.call(this, config);
        },
        _validateAdd: function (child) {
            var type = child.getType();
            if (type !== 'Group' && type !== 'Shape') {
                Kinetic.Util.error('You may only add groups and shapes to a layer.');
            }
        },
        getIntersection: function () {
            var pos = Kinetic.Util._getXY(Array.prototype.slice.call(arguments)), p, colorKey, shape;
            if (this.isVisible() && this.isListening()) {
                p = this.hitCanvas.context._context.getImageData(pos.x | 0, pos.y | 0, 1, 1).data;
                if (p[3] === 255) {
                    colorKey = Kinetic.Util._rgbToHex(p[0], p[1], p[2]);
                    shape = Kinetic.shapes[HASH + colorKey];
                    return {
                        shape: shape,
                        pixel: p
                    };
                } else if (p[0] > 0 || p[1] > 0 || p[2] > 0 || p[3] > 0) {
                    return { pixel: p };
                }
            }
            return null;
        },
        drawScene: function (canvas) {
            canvas = canvas || this.getCanvas();
            this._fire(BEFORE_DRAW, { node: this });
            if (this.getClearBeforeDraw()) {
                canvas.getContext().clear();
            }
            Kinetic.Container.prototype.drawScene.call(this, canvas);
            this._fire(DRAW, { node: this });
            return this;
        },
        drawHit: function () {
            var layer = this.getLayer();
            if (layer && layer.getClearBeforeDraw()) {
                layer.getHitCanvas().getContext().clear();
            }
            Kinetic.Container.prototype.drawHit.call(this);
            return this;
        },
        getCanvas: function () {
            return this.canvas;
        },
        getHitCanvas: function () {
            return this.hitCanvas;
        },
        getContext: function () {
            return this.getCanvas().getContext();
        },
        clear: function () {
            var context = this.getContext(), hitContext = this.getHitCanvas().getContext();
            context.clear.apply(context, arguments);
            hitContext.clear.apply(hitContext, arguments);
            return this;
        },
        setVisible: function (visible) {
            Kinetic.Node.prototype.setVisible.call(this, visible);
            if (visible) {
                this.getCanvas()._canvas.style.display = 'block';
                this.hitCanvas._canvas.style.display = 'block';
            } else {
                this.getCanvas()._canvas.style.display = 'none';
                this.hitCanvas._canvas.style.display = 'none';
            }
            return this;
        },
        setZIndex: function (index) {
            Kinetic.Node.prototype.setZIndex.call(this, index);
            var stage = this.getStage();
            if (stage) {
                stage.content.removeChild(this.getCanvas()._canvas);
                if (index < stage.getChildren().length - 1) {
                    stage.content.insertBefore(this.getCanvas()._canvas, stage.getChildren()[index + 1].getCanvas()._canvas);
                } else {
                    stage.content.appendChild(this.getCanvas()._canvas);
                }
            }
            return this;
        },
        moveToTop: function () {
            Kinetic.Node.prototype.moveToTop.call(this);
            var stage = this.getStage();
            if (stage) {
                stage.content.removeChild(this.getCanvas()._canvas);
                stage.content.appendChild(this.getCanvas()._canvas);
            }
        },
        moveUp: function () {
            if (Kinetic.Node.prototype.moveUp.call(this)) {
                var stage = this.getStage();
                if (stage) {
                    stage.content.removeChild(this.getCanvas()._canvas);
                    if (this.index < stage.getChildren().length - 1) {
                        stage.content.insertBefore(this.getCanvas()._canvas, stage.getChildren()[this.index + 1].getCanvas()._canvas);
                    } else {
                        stage.content.appendChild(this.getCanvas()._canvas);
                    }
                }
            }
        },
        moveDown: function () {
            if (Kinetic.Node.prototype.moveDown.call(this)) {
                var stage = this.getStage();
                if (stage) {
                    var children = stage.getChildren();
                    stage.content.removeChild(this.getCanvas()._canvas);
                    stage.content.insertBefore(this.getCanvas()._canvas, children[this.index + 1].getCanvas()._canvas);
                }
            }
        },
        moveToBottom: function () {
            if (Kinetic.Node.prototype.moveToBottom.call(this)) {
                var stage = this.getStage();
                if (stage) {
                    var children = stage.getChildren();
                    stage.content.removeChild(this.getCanvas()._canvas);
                    stage.content.insertBefore(this.getCanvas()._canvas, children[1].getCanvas()._canvas);
                }
            }
        },
        getLayer: function () {
            return this;
        },
        remove: function () {
            var stage = this.getStage(), canvas = this.getCanvas(), _canvas = canvas._canvas;
            Kinetic.Node.prototype.remove.call(this);
            if (stage && _canvas && Kinetic.Util._isInDocument(_canvas)) {
                stage.content.removeChild(_canvas);
            }
            return this;
        },
        getStage: function () {
            return this.parent;
        }
    });
    Kinetic.Util.extend(Kinetic.Layer, Kinetic.Container);
    Kinetic.Factory.addGetterSetter(Kinetic.Layer, 'clearBeforeDraw', true);
}());
;
(function () {
    Kinetic.Util.addMethods(Kinetic.Group, {
        ___init: function (config) {
            this.nodeType = 'Group';
            Kinetic.Container.call(this, config);
        },
        _validateAdd: function (child) {
            var type = child.getType();
            if (type !== 'Group' && type !== 'Shape') {
                Kinetic.Util.error('You may only add groups and shapes to groups.');
            }
        }
    });
    Kinetic.Util.extend(Kinetic.Group, Kinetic.Container);
}());
;
(function () {
    Kinetic.Rect = function (config) {
        this.___init(config);
    };
    Kinetic.Rect.prototype = {
        ___init: function (config) {
            Kinetic.Shape.call(this, config);
            this.className = 'Rect';
        },
        drawFunc: function (context) {
            var cornerRadius = this.getCornerRadius(), width = this.getWidth(), height = this.getHeight();
            context.beginPath();
            if (!cornerRadius) {
                context.rect(0, 0, width, height);
            } else {
                context.moveTo(cornerRadius, 0);
                context.lineTo(width - cornerRadius, 0);
                context.arc(width - cornerRadius, cornerRadius, cornerRadius, Math.PI * 3 / 2, 0, false);
                context.lineTo(width, height - cornerRadius);
                context.arc(width - cornerRadius, height - cornerRadius, cornerRadius, 0, Math.PI / 2, false);
                context.lineTo(cornerRadius, height);
                context.arc(cornerRadius, height - cornerRadius, cornerRadius, Math.PI / 2, Math.PI, false);
                context.lineTo(0, cornerRadius);
                context.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, Math.PI * 3 / 2, false);
            }
            context.closePath();
            context.fillStrokeShape(this);
        }
    };
    Kinetic.Util.extend(Kinetic.Rect, Kinetic.Shape);
    Kinetic.Factory.addGetterSetter(Kinetic.Rect, 'cornerRadius', 0);
}());
;
(function () {
    var PIx2 = Math.PI * 2 - 0.0001, CIRCLE = 'Circle';
    Kinetic.Circle = function (config) {
        this.___init(config);
    };
    Kinetic.Circle.prototype = {
        ___init: function (config) {
            Kinetic.Shape.call(this, config);
            this.className = CIRCLE;
        },
        drawFunc: function (context) {
            context.beginPath();
            context.arc(0, 0, this.getRadius(), 0, PIx2, false);
            context.closePath();
            context.fillStrokeShape(this);
        },
        getWidth: function () {
            return this.getRadius() * 2;
        },
        getHeight: function () {
            return this.getRadius() * 2;
        },
        setWidth: function (width) {
            Kinetic.Node.prototype.setWidth.call(this, width);
            this.setRadius(width / 2);
        },
        setHeight: function (height) {
            Kinetic.Node.prototype.setHeight.call(this, height);
            this.setRadius(height / 2);
        }
    };
    Kinetic.Util.extend(Kinetic.Circle, Kinetic.Shape);
    Kinetic.Factory.addGetterSetter(Kinetic.Circle, 'radius', 0);
}());
;
(function () {
    var PIx2 = Math.PI * 2 - 0.0001, ELLIPSE = 'Ellipse';
    Kinetic.Ellipse = function (config) {
        this.___init(config);
    };
    Kinetic.Ellipse.prototype = {
        ___init: function (config) {
            Kinetic.Shape.call(this, config);
            this.className = ELLIPSE;
        },
        drawFunc: function (context) {
            var r = this.getRadius();
            context.beginPath();
            context.save();
            if (r.x !== r.y) {
                context.scale(1, r.y / r.x);
            }
            context.arc(0, 0, r.x, 0, PIx2, false);
            context.restore();
            context.closePath();
            context.fillStrokeShape(this);
        },
        getWidth: function () {
            return this.getRadius().x * 2;
        },
        getHeight: function () {
            return this.getRadius().y * 2;
        },
        setWidth: function (width) {
            Kinetic.Node.prototype.setWidth.call(this, width);
            this.setRadius({ x: width / 2 });
        },
        setHeight: function (height) {
            Kinetic.Node.prototype.setHeight.call(this, height);
            this.setRadius({ y: height / 2 });
        }
    };
    Kinetic.Util.extend(Kinetic.Ellipse, Kinetic.Shape);
    Kinetic.Factory.addPointGetterSetter(Kinetic.Ellipse, 'radius', 0);
}());
;
(function () {
    Kinetic.Wedge = function (config) {
        this.___init(config);
    };
    Kinetic.Wedge.prototype = {
        ___init: function (config) {
            Kinetic.Shape.call(this, config);
            this.className = 'Wedge';
        },
        drawFunc: function (context) {
            context.beginPath();
            context.arc(0, 0, this.getRadius(), 0, this.getAngle(), this.getClockwise());
            context.lineTo(0, 0);
            context.closePath();
            context.fillStrokeShape(this);
        }
    };
    Kinetic.Util.extend(Kinetic.Wedge, Kinetic.Shape);
    Kinetic.Factory.addGetterSetter(Kinetic.Wedge, 'radius', 0);
    Kinetic.Factory.addRotationGetterSetter(Kinetic.Wedge, 'angle', 0);
    Kinetic.Factory.addGetterSetter(Kinetic.Wedge, 'clockwise', false);
}());
;
(function () {
    var IMAGE = 'Image', CROP = 'crop', SET = 'set';
    Kinetic.Image = function (config) {
        this.___init(config);
    };
    Kinetic.Image.prototype = {
        ___init: function (config) {
            var that = this;
            Kinetic.Shape.call(this, config);
            this.className = IMAGE;
        },
        drawFunc: function (context) {
            var width = this.getWidth(), height = this.getHeight(), params, that = this, cropX = this.getCropX() || 0, cropY = this.getCropY() || 0, cropWidth = this.getCropWidth(), cropHeight = this.getCropHeight(), image;
            if (this.getFilter() && this._applyFilter) {
                this.applyFilter();
                this._applyFilter = false;
            }
            if (this.filterCanvas) {
                image = this.filterCanvas._canvas;
            } else {
                image = this.getImage();
            }
            context.beginPath();
            context.rect(0, 0, width, height);
            context.closePath();
            context.fillStrokeShape(this);
            if (image) {
                if (cropWidth && cropHeight) {
                    params = [
                        image,
                        cropX,
                        cropY,
                        cropWidth,
                        cropHeight,
                        0,
                        0,
                        width,
                        height
                    ];
                } else {
                    params = [
                        image,
                        0,
                        0,
                        width,
                        height
                    ];
                }
                if (this.hasShadow()) {
                    context.applyShadow(this, function () {
                        context.drawImage.apply(context, params);
                    });
                } else {
                    context.drawImage.apply(context, params);
                }
            }
        },
        drawHitFunc: function (context) {
            var width = this.getWidth(), height = this.getHeight(), imageHitRegion = this.imageHitRegion;
            if (imageHitRegion) {
                context.drawImage(imageHitRegion, 0, 0, width, height);
                context.beginPath();
                context.rect(0, 0, width, height);
                context.closePath();
                context.strokeShape(this);
            } else {
                context.beginPath();
                context.rect(0, 0, width, height);
                context.closePath();
                context.fillStrokeShape(this);
            }
        },
        applyFilter: function () {
            var image = this.getImage(), that = this, width = this.getWidth(), height = this.getHeight(), filter = this.getFilter(), filterCanvas, context, imageData;
            if (this.filterCanvas) {
                filterCanvas = this.filterCanvas;
                filterCanvas.getContext().clear();
            } else {
                filterCanvas = this.filterCanvas = new Kinetic.SceneCanvas({
                    width: width,
                    height: height,
                    pixelRatio: 1
                });
            }
            context = filterCanvas.getContext();
            try {
                context.drawImage(image, 0, 0, filterCanvas.getWidth(), filterCanvas.getHeight());
                imageData = context.getImageData(0, 0, filterCanvas.getWidth(), filterCanvas.getHeight());
                filter.call(this, imageData);
                context.putImageData(imageData, 0, 0);
            } catch (e) {
                this.clearFilter();
                Kinetic.Util.warn('Unable to apply filter. ' + e.message);
            }
        },
        clearFilter: function () {
            this.filterCanvas = null;
            this._applyFilter = false;
        },
        createImageHitRegion: function (callback) {
            var that = this, width = this.getWidth(), height = this.getHeight(), canvas = new Kinetic.SceneCanvas({
                    width: width,
                    height: height
                }), _context = canvas.getContext()._context, image = this.getImage(), imageData, data, rgbColorKey, i, len;
            _context.drawImage(image, 0, 0);
            try {
                imageData = _context.getImageData(0, 0, width, height);
                data = imageData.data;
                len = data.length;
                rgbColorKey = Kinetic.Util._hexToRgb(this.colorKey);
                for (i = 0; i < len; i += 4) {
                    if (data[i + 3] > 0) {
                        data[i] = rgbColorKey.r;
                        data[i + 1] = rgbColorKey.g;
                        data[i + 2] = rgbColorKey.b;
                    }
                }
                Kinetic.Util._getImage(imageData, function (imageObj) {
                    that.imageHitRegion = imageObj;
                    if (callback) {
                        callback();
                    }
                });
            } catch (e) {
                Kinetic.Util.warn('Unable to create image hit region. ' + e.message);
            }
        },
        clearImageHitRegion: function () {
            delete this.imageHitRegion;
        },
        getWidth: function () {
            var image = this.getImage();
            return this.attrs.width || (image ? image.width : 0);
        },
        getHeight: function () {
            var image = this.getImage();
            return this.attrs.height || (image ? image.height : 0);
        }
    };
    Kinetic.Util.extend(Kinetic.Image, Kinetic.Shape);
    Kinetic.Factory.addFilterGetterSetter = function (constructor, attr, def) {
        this.addGetter(constructor, attr, def);
        this.addFilterSetter(constructor, attr);
    };
    Kinetic.Factory.addFilterSetter = function (constructor, attr) {
        var that = this, method = SET + Kinetic.Util._capitalize(attr);
        constructor.prototype[method] = function (val) {
            this._setAttr(attr, val);
            this._applyFilter = true;
        };
    };
    Kinetic.Factory.addGetterSetter(Kinetic.Image, 'image');
    Kinetic.Factory.addBoxGetterSetter(Kinetic.Image, 'crop');
    Kinetic.Factory.addFilterGetterSetter(Kinetic.Image, 'filter');
}());
;
(function () {
    Kinetic.Polygon = function (config) {
        this.___init(config);
    };
    Kinetic.Polygon.prototype = {
        ___init: function (config) {
            Kinetic.Shape.call(this, config);
            this.className = 'Polygon';
        },
        drawFunc: function (context) {
            var points = this.getPoints(), length = points.length;
            context.beginPath();
            context.moveTo(points[0].x, points[0].y);
            for (var n = 1; n < length; n++) {
                context.lineTo(points[n].x, points[n].y);
            }
            context.closePath();
            context.fillStrokeShape(this);
        }
    };
    Kinetic.Util.extend(Kinetic.Polygon, Kinetic.Shape);
    Kinetic.Factory.addPointsGetterSetter(Kinetic.Polygon, 'points');
}());
;
(function () {
    var AUTO = 'auto', CALIBRI = 'Calibri', CANVAS = 'canvas', CENTER = 'center', CHANGE_KINETIC = 'Change.kinetic', CONTEXT_2D = '2d', DASH = '-', EMPTY_STRING = '', LEFT = 'left', NEW_LINE = '\n', TEXT = 'text', TEXT_UPPER = 'Text', TOP = 'top', MIDDLE = 'middle', NORMAL = 'normal', PX_SPACE = 'px ', SPACE = ' ', RIGHT = 'right', WORD = 'word', CHAR = 'char', NONE = 'none', ATTR_CHANGE_LIST = [
            'fontFamily',
            'fontSize',
            'fontStyle',
            'padding',
            'align',
            'lineHeight',
            'text',
            'width',
            'height',
            'wrap'
        ], attrChangeListLen = ATTR_CHANGE_LIST.length, dummyContext = document.createElement(CANVAS).getContext(CONTEXT_2D);
    Kinetic.Text = function (config) {
        this.___init(config);
    };
    function _fillFunc(context) {
        context.fillText(this.partialText, 0, 0);
    }
    function _strokeFunc(context) {
        context.strokeText(this.partialText, 0, 0);
    }
    Kinetic.Text.prototype = {
        ___init: function (config) {
            var that = this;
            if (config.width === undefined) {
                config.width = AUTO;
            }
            if (config.height === undefined) {
                config.height = AUTO;
            }
            Kinetic.Shape.call(this, config);
            this._fillFunc = _fillFunc;
            this._strokeFunc = _strokeFunc;
            this.className = TEXT_UPPER;
            for (var n = 0; n < attrChangeListLen; n++) {
                this.on(ATTR_CHANGE_LIST[n] + CHANGE_KINETIC, that._setTextData);
            }
            this._setTextData();
        },
        drawFunc: function (context) {
            var p = this.getPadding(), fontStyle = this.getFontStyle(), fontSize = this.getFontSize(), fontFamily = this.getFontFamily(), textHeight = this.getTextHeight(), lineHeightPx = this.getLineHeight() * textHeight, textArr = this.textArr, textArrLen = textArr.length, totalWidth = this.getWidth();
            context.setAttr('font', this._getContextFont());
            context.setAttr('textBaseline', MIDDLE);
            context.setAttr('textAlign', LEFT);
            context.save();
            context.translate(p, 0);
            context.translate(0, p + textHeight / 2);
            for (var n = 0; n < textArrLen; n++) {
                var obj = textArr[n], text = obj.text, width = obj.width;
                context.save();
                if (this.getAlign() === RIGHT) {
                    context.translate(totalWidth - width - p * 2, 0);
                } else if (this.getAlign() === CENTER) {
                    context.translate((totalWidth - width - p * 2) / 2, 0);
                }
                this.partialText = text;
                context.fillStrokeShape(this);
                context.restore();
                context.translate(0, lineHeightPx);
            }
            context.restore();
        },
        drawHitFunc: function (context) {
            var width = this.getWidth(), height = this.getHeight();
            context.beginPath();
            context.rect(0, 0, width, height);
            context.closePath();
            context.fillStrokeShape(this);
        },
        setText: function (text) {
            var str = Kinetic.Util._isString(text) ? text : text.toString();
            this._setAttr(TEXT, str);
        },
        getWidth: function () {
            return this.attrs.width === AUTO ? this.getTextWidth() + this.getPadding() * 2 : this.attrs.width;
        },
        getHeight: function () {
            return this.attrs.height === AUTO ? this.getTextHeight() * this.textArr.length * this.getLineHeight() + this.getPadding() * 2 : this.attrs.height;
        },
        getTextWidth: function () {
            return this.textWidth;
        },
        getTextHeight: function () {
            return this.textHeight;
        },
        _getTextSize: function (text) {
            var _context = dummyContext, fontSize = this.getFontSize(), metrics;
            _context.save();
            _context.font = this._getContextFont();
            metrics = _context.measureText(text);
            _context.restore();
            return {
                width: metrics.width,
                height: parseInt(fontSize, 10)
            };
        },
        _getContextFont: function () {
            return this.getFontStyle() + SPACE + this.getFontSize() + PX_SPACE + this.getFontFamily();
        },
        _addTextLine: function (line, width, height) {
            return this.textArr.push({
                text: line,
                width: width
            });
        },
        _getTextWidth: function (text) {
            return dummyContext.measureText(text).width;
        },
        _setTextData: function () {
            var lines = this.getText().split('\n'), fontSize = +this.getFontSize(), textWidth = 0, lineHeightPx = this.getLineHeight() * fontSize, width = this.attrs.width, height = this.attrs.height, fixedWidth = width !== AUTO, fixedHeight = height !== AUTO, padding = this.getPadding(), maxWidth = width - padding * 2, maxHeightPx = height - padding * 2, currentHeightPx = 0, wrap = this.getWrap(), shouldWrap = wrap !== NONE, wrapAtWord = wrap !== CHAR && shouldWrap;
            this.textArr = [];
            dummyContext.save();
            dummyContext.font = this.getFontStyle() + SPACE + fontSize + PX_SPACE + this.getFontFamily();
            for (var i = 0, max = lines.length; i < max; ++i) {
                var line = lines[i], lineWidth = this._getTextWidth(line);
                if (fixedWidth && lineWidth > maxWidth) {
                    while (line.length > 0) {
                        var low = 0, high = line.length, match = '', matchWidth = 0;
                        while (low < high) {
                            var mid = low + high >>> 1, substr = line.slice(0, mid + 1), substrWidth = this._getTextWidth(substr);
                            if (substrWidth <= maxWidth) {
                                low = mid + 1;
                                match = substr;
                                matchWidth = substrWidth;
                            } else {
                                high = mid;
                            }
                        }
                        if (match) {
                            if (wrapAtWord) {
                                var wrapIndex = Math.max(match.lastIndexOf(SPACE), match.lastIndexOf(DASH)) + 1;
                                if (wrapIndex > 0) {
                                    low = wrapIndex;
                                    match = match.slice(0, low);
                                    matchWidth = this._getTextWidth(match);
                                }
                            }
                            this._addTextLine(match, matchWidth);
                            currentHeightPx += lineHeightPx;
                            if (!shouldWrap || fixedHeight && currentHeightPx + lineHeightPx > maxHeightPx) {
                                break;
                            }
                            line = line.slice(low);
                            if (line.length > 0) {
                                lineWidth = this._getTextWidth(line);
                                if (lineWidth <= maxWidth) {
                                    this._addTextLine(line, lineWidth);
                                    currentHeightPx += lineHeightPx;
                                    break;
                                }
                            }
                        } else {
                            break;
                        }
                    }
                } else {
                    this._addTextLine(line, lineWidth);
                    currentHeightPx += lineHeightPx;
                    textWidth = Math.max(textWidth, lineWidth);
                }
                if (fixedHeight && currentHeightPx + lineHeightPx > maxHeightPx) {
                    break;
                }
            }
            dummyContext.restore();
            this.textHeight = fontSize;
            this.textWidth = textWidth;
        }
    };
    Kinetic.Util.extend(Kinetic.Text, Kinetic.Shape);
    Kinetic.Factory.addGetterSetter(Kinetic.Text, 'fontFamily', CALIBRI);
    Kinetic.Factory.addGetterSetter(Kinetic.Text, 'fontSize', 12);
    Kinetic.Factory.addGetterSetter(Kinetic.Text, 'fontStyle', NORMAL);
    Kinetic.Factory.addGetterSetter(Kinetic.Text, 'padding', 0);
    Kinetic.Factory.addGetterSetter(Kinetic.Text, 'align', LEFT);
    Kinetic.Factory.addGetterSetter(Kinetic.Text, 'lineHeight', 1);
    Kinetic.Factory.addGetterSetter(Kinetic.Text, 'wrap', WORD);
    Kinetic.Factory.addGetter(Kinetic.Text, TEXT, EMPTY_STRING);
    Kinetic.Factory.addSetter(Kinetic.Text, 'width');
    Kinetic.Factory.addSetter(Kinetic.Text, 'height');
}());
;
(function () {
    Kinetic.Line = function (config) {
        this.___init(config);
    };
    Kinetic.Line.prototype = {
        ___init: function (config) {
            Kinetic.Shape.call(this, config);
            this.className = 'Line';
        },
        drawFunc: function (context) {
            var points = this.getPoints(), length = points.length, n, point;
            context.beginPath();
            context.moveTo(points[0].x, points[0].y);
            for (n = 1; n < length; n++) {
                point = points[n];
                context.lineTo(point.x, point.y);
            }
            context.strokeShape(this);
        }
    };
    Kinetic.Util.extend(Kinetic.Line, Kinetic.Shape);
    Kinetic.Factory.addPointsGetterSetter(Kinetic.Line, 'points');
}());
;
(function () {
    Kinetic.Spline = function (config) {
        this.___init(config);
    };
    Kinetic.Spline.prototype = {
        ___init: function (config) {
            var that = this;
            Kinetic.Shape.call(this, config);
            this.className = 'Spline';
            this.on('pointsChange.kinetic tensionChange.kinetic', function () {
                that._setAllPoints();
            });
            this._setAllPoints();
        },
        drawFunc: function (context) {
            var points = this.getPoints(), length = points.length, tension = this.getTension(), ap, len, n, point;
            context.beginPath();
            context.moveTo(points[0].x, points[0].y);
            if (tension !== 0 && length > 2) {
                ap = this.allPoints;
                len = ap.length;
                n = 2;
                context.quadraticCurveTo(ap[0].x, ap[0].y, ap[1].x, ap[1].y);
                while (n < len - 1) {
                    context.bezierCurveTo(ap[n].x, ap[n++].y, ap[n].x, ap[n++].y, ap[n].x, ap[n++].y);
                }
                context.quadraticCurveTo(ap[len - 1].x, ap[len - 1].y, points[length - 1].x, points[length - 1].y);
            } else {
                for (n = 1; n < length; n++) {
                    point = points[n];
                    context.lineTo(point.x, point.y);
                }
            }
            context.strokeShape(this);
        },
        _setAllPoints: function () {
            this.allPoints = Kinetic.Util._expandPoints(this.getPoints(), this.getTension());
        }
    };
    Kinetic.Util.extend(Kinetic.Spline, Kinetic.Shape);
    Kinetic.Factory.addGetterSetter(Kinetic.Spline, 'tension', 1);
    Kinetic.Factory.addPointsGetterSetter(Kinetic.Spline, 'points');
}());
;
(function () {
    Kinetic.Blob = function (config) {
        this.___init(config);
    };
    Kinetic.Blob.prototype = {
        ___init: function (config) {
            var that = this;
            Kinetic.Shape.call(this, config);
            this.className = 'Blob';
            this.on('pointsChange.kinetic tensionChange.kinetic', function () {
                that._setAllPoints();
            });
            this._setAllPoints();
        },
        drawFunc: function (context) {
            var points = this.getPoints(), length = points.length, tension = this.getTension(), ap, len, n, point;
            context.beginPath();
            context.moveTo(points[0].x, points[0].y);
            if (tension !== 0 && length > 2) {
                ap = this.allPoints;
                len = ap.length;
                n = 0;
                while (n < len - 1) {
                    context.bezierCurveTo(ap[n].x, ap[n++].y, ap[n].x, ap[n++].y, ap[n].x, ap[n++].y);
                }
            } else {
                for (n = 1; n < length; n++) {
                    point = points[n];
                    context.lineTo(point.x, point.y);
                }
            }
            context.closePath();
            context.fillStrokeShape(this);
        },
        _setAllPoints: function () {
            var points = this.getPoints(), length = points.length, tension = this.getTension(), util = Kinetic.Util, firstControlPoints = util._getControlPoints(points[length - 1], points[0], points[1], tension), lastControlPoints = util._getControlPoints(points[length - 2], points[length - 1], points[0], tension);
            this.allPoints = Kinetic.Util._expandPoints(this.getPoints(), this.getTension());
            this.allPoints.unshift(firstControlPoints[1]);
            this.allPoints.push(lastControlPoints[0]);
            this.allPoints.push(points[length - 1]);
            this.allPoints.push(lastControlPoints[1]);
            this.allPoints.push(firstControlPoints[0]);
            this.allPoints.push(points[0]);
        }
    };
    Kinetic.Util.extend(Kinetic.Blob, Kinetic.Shape);
    Kinetic.Factory.addGetterSetter(Kinetic.Blob, 'tension', 1);
    Kinetic.Factory.addPointsGetterSetter(Kinetic.Blob, 'points');
}());
;
(function () {
    Kinetic.Sprite = function (config) {
        this.___init(config);
    };
    Kinetic.Sprite.prototype = {
        ___init: function (config) {
            Kinetic.Shape.call(this, config);
            this.className = 'Sprite';
            this.anim = new Kinetic.Animation();
            var that = this;
            this.on('animationChange.kinetic', function () {
                that.setIndex(0);
            });
        },
        drawFunc: function (context) {
            var anim = this.getAnimation(), index = this.getIndex(), f = this.getAnimations()[anim][index], image = this.getImage();
            if (image) {
                context.drawImage(image, f.x, f.y, f.width, f.height, 0, 0, f.width, f.height);
            }
        },
        drawHitFunc: function (context) {
            var anim = this.getAnimation(), index = this.getIndex(), f = this.getAnimations()[anim][index];
            context.beginPath();
            context.rect(0, 0, f.width, f.height);
            context.closePath();
            context.fill(this);
        },
        start: function () {
            var that = this;
            var layer = this.getLayer();
            this.anim.setLayers(layer);
            this.interval = setInterval(function () {
                var index = that.getIndex();
                that._updateIndex();
                if (that.afterFrameFunc && index === that.afterFrameIndex) {
                    that.afterFrameFunc();
                    delete that.afterFrameFunc;
                    delete that.afterFrameIndex;
                }
            }, 1000 / this.getFrameRate());
            this.anim.start();
        },
        stop: function () {
            this.anim.stop();
            clearInterval(this.interval);
        },
        afterFrame: function (index, func) {
            this.afterFrameIndex = index;
            this.afterFrameFunc = func;
        },
        _updateIndex: function () {
            var index = this.getIndex(), animation = this.getAnimation(), animations = this.getAnimations(), anim = animations[animation], len = anim.length;
            if (index < len - 1) {
                this.setIndex(index + 1);
            } else {
                this.setIndex(0);
            }
        }
    };
    Kinetic.Util.extend(Kinetic.Sprite, Kinetic.Shape);
    Kinetic.Factory.addGetterSetter(Kinetic.Sprite, 'animation');
    Kinetic.Factory.addGetterSetter(Kinetic.Sprite, 'animations');
    Kinetic.Factory.addGetterSetter(Kinetic.Sprite, 'image');
    Kinetic.Factory.addGetterSetter(Kinetic.Sprite, 'index', 0);
    Kinetic.Factory.addGetterSetter(Kinetic.Sprite, 'frameRate', 17);
}());
;
(function () {
    Kinetic.Path = function (config) {
        this.___init(config);
    };
    Kinetic.Path.prototype = {
        ___init: function (config) {
            this.dataArray = [];
            var that = this;
            Kinetic.Shape.call(this, config);
            this.className = 'Path';
            this.dataArray = Kinetic.Path.parsePathData(this.getData());
            this.on('dataChange.kinetic', function () {
                that.dataArray = Kinetic.Path.parsePathData(this.getData());
            });
        },
        drawFunc: function (context) {
            var ca = this.dataArray, closedPath = false;
            context.beginPath();
            for (var n = 0; n < ca.length; n++) {
                var c = ca[n].command;
                var p = ca[n].points;
                switch (c) {
                case 'L':
                    context.lineTo(p[0], p[1]);
                    break;
                case 'M':
                    context.moveTo(p[0], p[1]);
                    break;
                case 'C':
                    context.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
                    break;
                case 'Q':
                    context.quadraticCurveTo(p[0], p[1], p[2], p[3]);
                    break;
                case 'A':
                    var cx = p[0], cy = p[1], rx = p[2], ry = p[3], theta = p[4], dTheta = p[5], psi = p[6], fs = p[7];
                    var r = rx > ry ? rx : ry;
                    var scaleX = rx > ry ? 1 : rx / ry;
                    var scaleY = rx > ry ? ry / rx : 1;
                    context.translate(cx, cy);
                    context.rotate(psi);
                    context.scale(scaleX, scaleY);
                    context.arc(0, 0, r, theta, theta + dTheta, 1 - fs);
                    context.scale(1 / scaleX, 1 / scaleY);
                    context.rotate(-psi);
                    context.translate(-cx, -cy);
                    break;
                case 'z':
                    context.closePath();
                    closedPath = true;
                    break;
                }
            }
            if (closedPath) {
                context.fillStrokeShape(this);
            } else {
                context.strokeShape(this);
            }
        }
    };
    Kinetic.Util.extend(Kinetic.Path, Kinetic.Shape);
    Kinetic.Path.getLineLength = function (x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    };
    Kinetic.Path.getPointOnLine = function (dist, P1x, P1y, P2x, P2y, fromX, fromY) {
        if (fromX === undefined) {
            fromX = P1x;
        }
        if (fromY === undefined) {
            fromY = P1y;
        }
        var m = (P2y - P1y) / (P2x - P1x + 1e-8);
        var run = Math.sqrt(dist * dist / (1 + m * m));
        if (P2x < P1x)
            run *= -1;
        var rise = m * run;
        var pt;
        if (P2x === P1x) {
            pt = {
                x: fromX,
                y: fromY + rise
            };
        } else if ((fromY - P1y) / (fromX - P1x + 1e-8) === m) {
            pt = {
                x: fromX + run,
                y: fromY + rise
            };
        } else {
            var ix, iy;
            var len = this.getLineLength(P1x, P1y, P2x, P2y);
            if (len < 1e-8) {
                return undefined;
            }
            var u = (fromX - P1x) * (P2x - P1x) + (fromY - P1y) * (P2y - P1y);
            u = u / (len * len);
            ix = P1x + u * (P2x - P1x);
            iy = P1y + u * (P2y - P1y);
            var pRise = this.getLineLength(fromX, fromY, ix, iy);
            var pRun = Math.sqrt(dist * dist - pRise * pRise);
            run = Math.sqrt(pRun * pRun / (1 + m * m));
            if (P2x < P1x)
                run *= -1;
            rise = m * run;
            pt = {
                x: ix + run,
                y: iy + rise
            };
        }
        return pt;
    };
    Kinetic.Path.getPointOnCubicBezier = function (pct, P1x, P1y, P2x, P2y, P3x, P3y, P4x, P4y) {
        function CB1(t) {
            return t * t * t;
        }
        function CB2(t) {
            return 3 * t * t * (1 - t);
        }
        function CB3(t) {
            return 3 * t * (1 - t) * (1 - t);
        }
        function CB4(t) {
            return (1 - t) * (1 - t) * (1 - t);
        }
        var x = P4x * CB1(pct) + P3x * CB2(pct) + P2x * CB3(pct) + P1x * CB4(pct);
        var y = P4y * CB1(pct) + P3y * CB2(pct) + P2y * CB3(pct) + P1y * CB4(pct);
        return {
            x: x,
            y: y
        };
    };
    Kinetic.Path.getPointOnQuadraticBezier = function (pct, P1x, P1y, P2x, P2y, P3x, P3y) {
        function QB1(t) {
            return t * t;
        }
        function QB2(t) {
            return 2 * t * (1 - t);
        }
        function QB3(t) {
            return (1 - t) * (1 - t);
        }
        var x = P3x * QB1(pct) + P2x * QB2(pct) + P1x * QB3(pct);
        var y = P3y * QB1(pct) + P2y * QB2(pct) + P1y * QB3(pct);
        return {
            x: x,
            y: y
        };
    };
    Kinetic.Path.getPointOnEllipticalArc = function (cx, cy, rx, ry, theta, psi) {
        var cosPsi = Math.cos(psi), sinPsi = Math.sin(psi);
        var pt = {
                x: rx * Math.cos(theta),
                y: ry * Math.sin(theta)
            };
        return {
            x: cx + (pt.x * cosPsi - pt.y * sinPsi),
            y: cy + (pt.x * sinPsi + pt.y * cosPsi)
        };
    };
    Kinetic.Path.parsePathData = function (data) {
        if (!data) {
            return [];
        }
        var cs = data;
        var cc = [
                'm',
                'M',
                'l',
                'L',
                'v',
                'V',
                'h',
                'H',
                'z',
                'Z',
                'c',
                'C',
                'q',
                'Q',
                't',
                'T',
                's',
                'S',
                'a',
                'A'
            ];
        cs = cs.replace(new RegExp(' ', 'g'), ',');
        for (var n = 0; n < cc.length; n++) {
            cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
        }
        var arr = cs.split('|');
        var ca = [];
        var cpx = 0;
        var cpy = 0;
        for (n = 1; n < arr.length; n++) {
            var str = arr[n];
            var c = str.charAt(0);
            str = str.slice(1);
            str = str.replace(new RegExp(',-', 'g'), '-');
            str = str.replace(new RegExp('-', 'g'), ',-');
            str = str.replace(new RegExp('e,-', 'g'), 'e-');
            var p = str.split(',');
            if (p.length > 0 && p[0] === '') {
                p.shift();
            }
            for (var i = 0; i < p.length; i++) {
                p[i] = parseFloat(p[i]);
            }
            while (p.length > 0) {
                if (isNaN(p[0]))
                    break;
                var cmd = null;
                var points = [];
                var startX = cpx, startY = cpy;
                var prevCmd, ctlPtx, ctlPty;
                var rx, ry, psi, fa, fs, x1, y1;
                switch (c) {
                case 'l':
                    cpx += p.shift();
                    cpy += p.shift();
                    cmd = 'L';
                    points.push(cpx, cpy);
                    break;
                case 'L':
                    cpx = p.shift();
                    cpy = p.shift();
                    points.push(cpx, cpy);
                    break;
                case 'm':
                    cpx += p.shift();
                    cpy += p.shift();
                    cmd = 'M';
                    points.push(cpx, cpy);
                    c = 'l';
                    break;
                case 'M':
                    cpx = p.shift();
                    cpy = p.shift();
                    cmd = 'M';
                    points.push(cpx, cpy);
                    c = 'L';
                    break;
                case 'h':
                    cpx += p.shift();
                    cmd = 'L';
                    points.push(cpx, cpy);
                    break;
                case 'H':
                    cpx = p.shift();
                    cmd = 'L';
                    points.push(cpx, cpy);
                    break;
                case 'v':
                    cpy += p.shift();
                    cmd = 'L';
                    points.push(cpx, cpy);
                    break;
                case 'V':
                    cpy = p.shift();
                    cmd = 'L';
                    points.push(cpx, cpy);
                    break;
                case 'C':
                    points.push(p.shift(), p.shift(), p.shift(), p.shift());
                    cpx = p.shift();
                    cpy = p.shift();
                    points.push(cpx, cpy);
                    break;
                case 'c':
                    points.push(cpx + p.shift(), cpy + p.shift(), cpx + p.shift(), cpy + p.shift());
                    cpx += p.shift();
                    cpy += p.shift();
                    cmd = 'C';
                    points.push(cpx, cpy);
                    break;
                case 'S':
                    ctlPtx = cpx, ctlPty = cpy;
                    prevCmd = ca[ca.length - 1];
                    if (prevCmd.command === 'C') {
                        ctlPtx = cpx + (cpx - prevCmd.points[2]);
                        ctlPty = cpy + (cpy - prevCmd.points[3]);
                    }
                    points.push(ctlPtx, ctlPty, p.shift(), p.shift());
                    cpx = p.shift();
                    cpy = p.shift();
                    cmd = 'C';
                    points.push(cpx, cpy);
                    break;
                case 's':
                    ctlPtx = cpx, ctlPty = cpy;
                    prevCmd = ca[ca.length - 1];
                    if (prevCmd.command === 'C') {
                        ctlPtx = cpx + (cpx - prevCmd.points[2]);
                        ctlPty = cpy + (cpy - prevCmd.points[3]);
                    }
                    points.push(ctlPtx, ctlPty, cpx + p.shift(), cpy + p.shift());
                    cpx += p.shift();
                    cpy += p.shift();
                    cmd = 'C';
                    points.push(cpx, cpy);
                    break;
                case 'Q':
                    points.push(p.shift(), p.shift());
                    cpx = p.shift();
                    cpy = p.shift();
                    points.push(cpx, cpy);
                    break;
                case 'q':
                    points.push(cpx + p.shift(), cpy + p.shift());
                    cpx += p.shift();
                    cpy += p.shift();
                    cmd = 'Q';
                    points.push(cpx, cpy);
                    break;
                case 'T':
                    ctlPtx = cpx, ctlPty = cpy;
                    prevCmd = ca[ca.length - 1];
                    if (prevCmd.command === 'Q') {
                        ctlPtx = cpx + (cpx - prevCmd.points[0]);
                        ctlPty = cpy + (cpy - prevCmd.points[1]);
                    }
                    cpx = p.shift();
                    cpy = p.shift();
                    cmd = 'Q';
                    points.push(ctlPtx, ctlPty, cpx, cpy);
                    break;
                case 't':
                    ctlPtx = cpx, ctlPty = cpy;
                    prevCmd = ca[ca.length - 1];
                    if (prevCmd.command === 'Q') {
                        ctlPtx = cpx + (cpx - prevCmd.points[0]);
                        ctlPty = cpy + (cpy - prevCmd.points[1]);
                    }
                    cpx += p.shift();
                    cpy += p.shift();
                    cmd = 'Q';
                    points.push(ctlPtx, ctlPty, cpx, cpy);
                    break;
                case 'A':
                    rx = p.shift(), ry = p.shift(), psi = p.shift(), fa = p.shift(), fs = p.shift();
                    x1 = cpx, y1 = cpy;
                    cpx = p.shift(), cpy = p.shift();
                    cmd = 'A';
                    points = this.convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
                    break;
                case 'a':
                    rx = p.shift(), ry = p.shift(), psi = p.shift(), fa = p.shift(), fs = p.shift();
                    x1 = cpx, y1 = cpy;
                    cpx += p.shift(), cpy += p.shift();
                    cmd = 'A';
                    points = this.convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
                    break;
                }
                ca.push({
                    command: cmd || c,
                    points: points,
                    start: {
                        x: startX,
                        y: startY
                    },
                    pathLength: this.calcLength(startX, startY, cmd || c, points)
                });
            }
            if (c === 'z' || c === 'Z') {
                ca.push({
                    command: 'z',
                    points: [],
                    start: undefined,
                    pathLength: 0
                });
            }
        }
        return ca;
    };
    Kinetic.Path.calcLength = function (x, y, cmd, points) {
        var len, p1, p2;
        var path = Kinetic.Path;
        switch (cmd) {
        case 'L':
            return path.getLineLength(x, y, points[0], points[1]);
        case 'C':
            len = 0;
            p1 = path.getPointOnCubicBezier(0, x, y, points[0], points[1], points[2], points[3], points[4], points[5]);
            for (t = 0.01; t <= 1; t += 0.01) {
                p2 = path.getPointOnCubicBezier(t, x, y, points[0], points[1], points[2], points[3], points[4], points[5]);
                len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                p1 = p2;
            }
            return len;
        case 'Q':
            len = 0;
            p1 = path.getPointOnQuadraticBezier(0, x, y, points[0], points[1], points[2], points[3]);
            for (t = 0.01; t <= 1; t += 0.01) {
                p2 = path.getPointOnQuadraticBezier(t, x, y, points[0], points[1], points[2], points[3]);
                len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                p1 = p2;
            }
            return len;
        case 'A':
            len = 0;
            var start = points[4];
            var dTheta = points[5];
            var end = points[4] + dTheta;
            var inc = Math.PI / 180;
            if (Math.abs(start - end) < inc) {
                inc = Math.abs(start - end);
            }
            p1 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], start, 0);
            if (dTheta < 0) {
                for (t = start - inc; t > end; t -= inc) {
                    p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t, 0);
                    len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                    p1 = p2;
                }
            } else {
                for (t = start + inc; t < end; t += inc) {
                    p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t, 0);
                    len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                    p1 = p2;
                }
            }
            p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], end, 0);
            len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
            return len;
        }
        return 0;
    };
    Kinetic.Path.convertEndpointToCenterParameterization = function (x1, y1, x2, y2, fa, fs, rx, ry, psiDeg) {
        var psi = psiDeg * (Math.PI / 180);
        var xp = Math.cos(psi) * (x1 - x2) / 2 + Math.sin(psi) * (y1 - y2) / 2;
        var yp = -1 * Math.sin(psi) * (x1 - x2) / 2 + Math.cos(psi) * (y1 - y2) / 2;
        var lambda = xp * xp / (rx * rx) + yp * yp / (ry * ry);
        if (lambda > 1) {
            rx *= Math.sqrt(lambda);
            ry *= Math.sqrt(lambda);
        }
        var f = Math.sqrt((rx * rx * (ry * ry) - rx * rx * (yp * yp) - ry * ry * (xp * xp)) / (rx * rx * (yp * yp) + ry * ry * (xp * xp)));
        if (fa == fs) {
            f *= -1;
        }
        if (isNaN(f)) {
            f = 0;
        }
        var cxp = f * rx * yp / ry;
        var cyp = f * -ry * xp / rx;
        var cx = (x1 + x2) / 2 + Math.cos(psi) * cxp - Math.sin(psi) * cyp;
        var cy = (y1 + y2) / 2 + Math.sin(psi) * cxp + Math.cos(psi) * cyp;
        var vMag = function (v) {
            return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        };
        var vRatio = function (u, v) {
            return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v));
        };
        var vAngle = function (u, v) {
            return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(vRatio(u, v));
        };
        var theta = vAngle([
                1,
                0
            ], [
                (xp - cxp) / rx,
                (yp - cyp) / ry
            ]);
        var u = [
                (xp - cxp) / rx,
                (yp - cyp) / ry
            ];
        var v = [
                (-1 * xp - cxp) / rx,
                (-1 * yp - cyp) / ry
            ];
        var dTheta = vAngle(u, v);
        if (vRatio(u, v) <= -1) {
            dTheta = Math.PI;
        }
        if (vRatio(u, v) >= 1) {
            dTheta = 0;
        }
        if (fs === 0 && dTheta > 0) {
            dTheta = dTheta - 2 * Math.PI;
        }
        if (fs == 1 && dTheta < 0) {
            dTheta = dTheta + 2 * Math.PI;
        }
        return [
            cx,
            cy,
            rx,
            ry,
            theta,
            dTheta,
            psi,
            fs
        ];
    };
    Kinetic.Factory.addGetterSetter(Kinetic.Path, 'data');
}());
;
(function () {
    var EMPTY_STRING = '', CALIBRI = 'Calibri', NORMAL = 'normal';
    Kinetic.TextPath = function (config) {
        this.___init(config);
    };
    function _fillFunc(context) {
        context.fillText(this.partialText, 0, 0);
    }
    function _strokeFunc(context) {
        context.strokeText(this.partialText, 0, 0);
    }
    Kinetic.TextPath.prototype = {
        ___init: function (config) {
            var that = this;
            this.dummyCanvas = document.createElement('canvas');
            this.dataArray = [];
            Kinetic.Shape.call(this, config);
            this._fillFunc = _fillFunc;
            this._strokeFunc = _strokeFunc;
            this.className = 'TextPath';
            this.dataArray = Kinetic.Path.parsePathData(this.attrs.data);
            this.on('dataChange.kinetic', function () {
                that.dataArray = Kinetic.Path.parsePathData(this.attrs.data);
            });
            this.on('textChange.kinetic textStroke.kinetic textStrokeWidth.kinetic', that._setTextData);
            that._setTextData();
        },
        drawFunc: function (context) {
            var charArr = this.charArr;
            context.setAttr('font', this._getContextFont());
            context.setAttr('textBaseline', 'middle');
            context.setAttr('textAlign', 'left');
            context.save();
            var glyphInfo = this.glyphInfo;
            for (var i = 0; i < glyphInfo.length; i++) {
                context.save();
                var p0 = glyphInfo[i].p0;
                var p1 = glyphInfo[i].p1;
                var ht = parseFloat(this.attrs.fontSize);
                context.translate(p0.x, p0.y);
                context.rotate(glyphInfo[i].rotation);
                this.partialText = glyphInfo[i].text;
                context.fillStrokeShape(this);
                context.restore();
            }
            context.restore();
        },
        getTextWidth: function () {
            return this.textWidth;
        },
        getTextHeight: function () {
            return this.textHeight;
        },
        setText: function (text) {
            Kinetic.Text.prototype.setText.call(this, text);
        },
        _getTextSize: function (text) {
            var dummyCanvas = this.dummyCanvas;
            var _context = dummyCanvas.getContext('2d');
            _context.save();
            _context.font = this._getContextFont();
            var metrics = _context.measureText(text);
            _context.restore();
            return {
                width: metrics.width,
                height: parseInt(this.attrs.fontSize, 10)
            };
        },
        _setTextData: function () {
            var that = this;
            var size = this._getTextSize(this.attrs.text);
            this.textWidth = size.width;
            this.textHeight = size.height;
            this.glyphInfo = [];
            var charArr = this.attrs.text.split('');
            var p0, p1, pathCmd;
            var pIndex = -1;
            var currentT = 0;
            var getNextPathSegment = function () {
                currentT = 0;
                var pathData = that.dataArray;
                for (var i = pIndex + 1; i < pathData.length; i++) {
                    if (pathData[i].pathLength > 0) {
                        pIndex = i;
                        return pathData[i];
                    } else if (pathData[i].command == 'M') {
                        p0 = {
                            x: pathData[i].points[0],
                            y: pathData[i].points[1]
                        };
                    }
                }
                return {};
            };
            var findSegmentToFitCharacter = function (c, before) {
                var glyphWidth = that._getTextSize(c).width;
                var currLen = 0;
                var attempts = 0;
                var needNextSegment = false;
                p1 = undefined;
                while (Math.abs(glyphWidth - currLen) / glyphWidth > 0.01 && attempts < 25) {
                    attempts++;
                    var cumulativePathLength = currLen;
                    while (pathCmd === undefined) {
                        pathCmd = getNextPathSegment();
                        if (pathCmd && cumulativePathLength + pathCmd.pathLength < glyphWidth) {
                            cumulativePathLength += pathCmd.pathLength;
                            pathCmd = undefined;
                        }
                    }
                    if (pathCmd === {} || p0 === undefined)
                        return undefined;
                    var needNewSegment = false;
                    switch (pathCmd.command) {
                    case 'L':
                        if (Kinetic.Path.getLineLength(p0.x, p0.y, pathCmd.points[0], pathCmd.points[1]) > glyphWidth) {
                            p1 = Kinetic.Path.getPointOnLine(glyphWidth, p0.x, p0.y, pathCmd.points[0], pathCmd.points[1], p0.x, p0.y);
                        } else
                            pathCmd = undefined;
                        break;
                    case 'A':
                        var start = pathCmd.points[4];
                        var dTheta = pathCmd.points[5];
                        var end = pathCmd.points[4] + dTheta;
                        if (currentT === 0)
                            currentT = start + 1e-8;
                        else if (glyphWidth > currLen)
                            currentT += Math.PI / 180 * dTheta / Math.abs(dTheta);
                        else
                            currentT -= Math.PI / 360 * dTheta / Math.abs(dTheta);
                        if (dTheta < 0 && currentT < end || dTheta >= 0 && currentT > end) {
                            currentT = end;
                            needNewSegment = true;
                        }
                        p1 = Kinetic.Path.getPointOnEllipticalArc(pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3], currentT, pathCmd.points[6]);
                        break;
                    case 'C':
                        if (currentT === 0) {
                            if (glyphWidth > pathCmd.pathLength)
                                currentT = 1e-8;
                            else
                                currentT = glyphWidth / pathCmd.pathLength;
                        } else if (glyphWidth > currLen)
                            currentT += (glyphWidth - currLen) / pathCmd.pathLength;
                        else
                            currentT -= (currLen - glyphWidth) / pathCmd.pathLength;
                        if (currentT > 1) {
                            currentT = 1;
                            needNewSegment = true;
                        }
                        p1 = Kinetic.Path.getPointOnCubicBezier(currentT, pathCmd.start.x, pathCmd.start.y, pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3], pathCmd.points[4], pathCmd.points[5]);
                        break;
                    case 'Q':
                        if (currentT === 0)
                            currentT = glyphWidth / pathCmd.pathLength;
                        else if (glyphWidth > currLen)
                            currentT += (glyphWidth - currLen) / pathCmd.pathLength;
                        else
                            currentT -= (currLen - glyphWidth) / pathCmd.pathLength;
                        if (currentT > 1) {
                            currentT = 1;
                            needNewSegment = true;
                        }
                        p1 = Kinetic.Path.getPointOnQuadraticBezier(currentT, pathCmd.start.x, pathCmd.start.y, pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3]);
                        break;
                    }
                    if (p1 !== undefined) {
                        currLen = Kinetic.Path.getLineLength(p0.x, p0.y, p1.x, p1.y);
                    }
                    if (needNewSegment) {
                        needNewSegment = false;
                        pathCmd = undefined;
                    }
                }
            };
            for (var i = 0; i < charArr.length; i++) {
                findSegmentToFitCharacter(charArr[i]);
                if (p0 === undefined || p1 === undefined)
                    break;
                var width = Kinetic.Path.getLineLength(p0.x, p0.y, p1.x, p1.y);
                var kern = 0;
                var midpoint = Kinetic.Path.getPointOnLine(kern + width / 2, p0.x, p0.y, p1.x, p1.y);
                var rotation = Math.atan2(p1.y - p0.y, p1.x - p0.x);
                this.glyphInfo.push({
                    transposeX: midpoint.x,
                    transposeY: midpoint.y,
                    text: charArr[i],
                    rotation: rotation,
                    p0: p0,
                    p1: p1
                });
                p0 = p1;
            }
        }
    };
    Kinetic.TextPath.prototype._getContextFont = Kinetic.Text.prototype._getContextFont;
    Kinetic.Util.extend(Kinetic.TextPath, Kinetic.Shape);
    Kinetic.Factory.addGetterSetter(Kinetic.TextPath, 'fontFamily', CALIBRI);
    Kinetic.Factory.addGetterSetter(Kinetic.TextPath, 'fontSize', 12);
    Kinetic.Factory.addGetterSetter(Kinetic.TextPath, 'fontStyle', NORMAL);
    Kinetic.Factory.addGetter(Kinetic.TextPath, 'text', EMPTY_STRING);
}());
;
(function () {
    Kinetic.RegularPolygon = function (config) {
        this.___init(config);
    };
    Kinetic.RegularPolygon.prototype = {
        ___init: function (config) {
            Kinetic.Shape.call(this, config);
            this.className = 'RegularPolygon';
        },
        drawFunc: function (context) {
            var sides = this.attrs.sides, radius = this.attrs.radius, n, x, y;
            context.beginPath();
            context.moveTo(0, 0 - radius);
            for (n = 1; n < sides; n++) {
                x = radius * Math.sin(n * 2 * Math.PI / sides);
                y = -1 * radius * Math.cos(n * 2 * Math.PI / sides);
                context.lineTo(x, y);
            }
            context.closePath();
            context.fillStrokeShape(this);
        }
    };
    Kinetic.Util.extend(Kinetic.RegularPolygon, Kinetic.Shape);
    Kinetic.Factory.addGetterSetter(Kinetic.RegularPolygon, 'radius', 0);
    Kinetic.Factory.addGetterSetter(Kinetic.RegularPolygon, 'sides', 0);
}());
;
(function () {
    Kinetic.Star = function (config) {
        this.___init(config);
    };
    Kinetic.Star.prototype = {
        ___init: function (config) {
            Kinetic.Shape.call(this, config);
            this.className = 'Star';
        },
        drawFunc: function (context) {
            var _context = context._context, innerRadius = this.attrs.innerRadius, outerRadius = this.attrs.outerRadius, numPoints = this.attrs.numPoints;
            _context.beginPath();
            _context.moveTo(0, 0 - this.attrs.outerRadius);
            for (var n = 1; n < numPoints * 2; n++) {
                var radius = n % 2 === 0 ? outerRadius : innerRadius;
                var x = radius * Math.sin(n * Math.PI / numPoints);
                var y = -1 * radius * Math.cos(n * Math.PI / numPoints);
                _context.lineTo(x, y);
            }
            _context.closePath();
            context.fillStrokeShape(this);
        }
    };
    Kinetic.Util.extend(Kinetic.Star, Kinetic.Shape);
    Kinetic.Factory.addGetterSetter(Kinetic.Star, 'numPoints', 0);
    Kinetic.Factory.addGetterSetter(Kinetic.Star, 'innerRadius', 0);
    Kinetic.Factory.addGetterSetter(Kinetic.Star, 'outerRadius', 0);
}());
;
(function () {
    var ATTR_CHANGE_LIST = [
            'fontFamily',
            'fontSize',
            'fontStyle',
            'padding',
            'lineHeight',
            'text'
        ], CHANGE_KINETIC = 'Change.kinetic', NONE = 'none', UP = 'up', RIGHT = 'right', DOWN = 'down', LEFT = 'left', LABEL = 'Label', attrChangeListLen = ATTR_CHANGE_LIST.length;
    Kinetic.Label = function (config) {
        this.____init(config);
    };
    Kinetic.Label.prototype = {
        ____init: function (config) {
            var that = this;
            this.className = LABEL;
            Kinetic.Group.call(this, config);
            this.on('add.kinetic', function (evt) {
                that._addListeners(evt.child);
                that._sync();
            });
        },
        getText: function () {
            return this.find('Text')[0];
        },
        getTag: function () {
            return this.find('Tag')[0];
        },
        _addListeners: function (text) {
            var that = this, n;
            var func = function () {
                that._sync();
            };
            for (n = 0; n < attrChangeListLen; n++) {
                text.on(ATTR_CHANGE_LIST[n] + CHANGE_KINETIC, func);
            }
        },
        getWidth: function () {
            return this.getText().getWidth();
        },
        getHeight: function () {
            return this.getText().getHeight();
        },
        _sync: function () {
            var text = this.getText(), tag = this.getTag(), width, height, pointerDirection, pointerWidth, x, y;
            if (text && tag) {
                width = text.getWidth(), height = text.getHeight(), pointerDirection = tag.getPointerDirection(), pointerWidth = tag.getPointerWidth(), pointerHeight = tag.getPointerHeight(), x = 0, y = 0;
                switch (pointerDirection) {
                case UP:
                    x = width / 2;
                    y = -1 * pointerHeight;
                    break;
                case RIGHT:
                    x = width + pointerWidth;
                    y = height / 2;
                    break;
                case DOWN:
                    x = width / 2;
                    y = height + pointerHeight;
                    break;
                case LEFT:
                    x = -1 * pointerWidth;
                    y = height / 2;
                    break;
                }
                tag.setAttrs({
                    x: -1 * x,
                    y: -1 * y,
                    width: width,
                    height: height
                });
                text.setAttrs({
                    x: -1 * x,
                    y: -1 * y
                });
            }
        }
    };
    Kinetic.Util.extend(Kinetic.Label, Kinetic.Group);
    Kinetic.Tag = function (config) {
        this.___init(config);
    };
    Kinetic.Tag.prototype = {
        ___init: function (config) {
            Kinetic.Shape.call(this, config);
            this.className = 'Tag';
        },
        drawFunc: function (context) {
            var width = this.getWidth(), height = this.getHeight(), pointerDirection = this.getPointerDirection(), pointerWidth = this.getPointerWidth(), pointerHeight = this.getPointerHeight(), cornerRadius = this.getCornerRadius();
            context.beginPath();
            context.moveTo(0, 0);
            if (pointerDirection === UP) {
                context.lineTo((width - pointerWidth) / 2, 0);
                context.lineTo(width / 2, -1 * pointerHeight);
                context.lineTo((width + pointerWidth) / 2, 0);
            }
            context.lineTo(width, 0);
            if (pointerDirection === RIGHT) {
                context.lineTo(width, (height - pointerHeight) / 2);
                context.lineTo(width + pointerWidth, height / 2);
                context.lineTo(width, (height + pointerHeight) / 2);
            }
            context.lineTo(width, height);
            if (pointerDirection === DOWN) {
                context.lineTo((width + pointerWidth) / 2, height);
                context.lineTo(width / 2, height + pointerHeight);
                context.lineTo((width - pointerWidth) / 2, height);
            }
            context.lineTo(0, height);
            if (pointerDirection === LEFT) {
                context.lineTo(0, (height + pointerHeight) / 2);
                context.lineTo(-1 * pointerWidth, height / 2);
                context.lineTo(0, (height - pointerHeight) / 2);
            }
            context.closePath();
            context.fillStrokeShape(this);
        }
    };
    Kinetic.Util.extend(Kinetic.Tag, Kinetic.Shape);
    Kinetic.Factory.addGetterSetter(Kinetic.Tag, 'pointerDirection', NONE);
    Kinetic.Factory.addGetterSetter(Kinetic.Tag, 'pointerWidth', 0);
    Kinetic.Factory.addGetterSetter(Kinetic.Tag, 'pointerHeight', 0);
    Kinetic.Factory.addGetterSetter(Kinetic.Tag, 'cornerRadius', 0);
}());
;
(function () {
    Kinetic.Filters.Grayscale = function (imageData) {
        var data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
            var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
            data[i] = brightness;
            data[i + 1] = brightness;
            data[i + 2] = brightness;
        }
    };
}());
;
(function () {
    Kinetic.Filters.Brighten = function (imageData) {
        var brightness = this.getFilterBrightness();
        var data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
            data[i] += brightness;
            data[i + 1] += brightness;
            data[i + 2] += brightness;
        }
    };
    Kinetic.Factory.addFilterGetterSetter(Kinetic.Image, 'filterBrightness', 0);
}());
;
(function () {
    Kinetic.Filters.Invert = function (imageData) {
        var data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
        }
    };
}());
;
(function () {
    function BlurStack() {
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.a = 0;
        this.next = null;
    }
    var mul_table = [
            512,
            512,
            456,
            512,
            328,
            456,
            335,
            512,
            405,
            328,
            271,
            456,
            388,
            335,
            292,
            512,
            454,
            405,
            364,
            328,
            298,
            271,
            496,
            456,
            420,
            388,
            360,
            335,
            312,
            292,
            273,
            512,
            482,
            454,
            428,
            405,
            383,
            364,
            345,
            328,
            312,
            298,
            284,
            271,
            259,
            496,
            475,
            456,
            437,
            420,
            404,
            388,
            374,
            360,
            347,
            335,
            323,
            312,
            302,
            292,
            282,
            273,
            265,
            512,
            497,
            482,
            468,
            454,
            441,
            428,
            417,
            405,
            394,
            383,
            373,
            364,
            354,
            345,
            337,
            328,
            320,
            312,
            305,
            298,
            291,
            284,
            278,
            271,
            265,
            259,
            507,
            496,
            485,
            475,
            465,
            456,
            446,
            437,
            428,
            420,
            412,
            404,
            396,
            388,
            381,
            374,
            367,
            360,
            354,
            347,
            341,
            335,
            329,
            323,
            318,
            312,
            307,
            302,
            297,
            292,
            287,
            282,
            278,
            273,
            269,
            265,
            261,
            512,
            505,
            497,
            489,
            482,
            475,
            468,
            461,
            454,
            447,
            441,
            435,
            428,
            422,
            417,
            411,
            405,
            399,
            394,
            389,
            383,
            378,
            373,
            368,
            364,
            359,
            354,
            350,
            345,
            341,
            337,
            332,
            328,
            324,
            320,
            316,
            312,
            309,
            305,
            301,
            298,
            294,
            291,
            287,
            284,
            281,
            278,
            274,
            271,
            268,
            265,
            262,
            259,
            257,
            507,
            501,
            496,
            491,
            485,
            480,
            475,
            470,
            465,
            460,
            456,
            451,
            446,
            442,
            437,
            433,
            428,
            424,
            420,
            416,
            412,
            408,
            404,
            400,
            396,
            392,
            388,
            385,
            381,
            377,
            374,
            370,
            367,
            363,
            360,
            357,
            354,
            350,
            347,
            344,
            341,
            338,
            335,
            332,
            329,
            326,
            323,
            320,
            318,
            315,
            312,
            310,
            307,
            304,
            302,
            299,
            297,
            294,
            292,
            289,
            287,
            285,
            282,
            280,
            278,
            275,
            273,
            271,
            269,
            267,
            265,
            263,
            261,
            259
        ];
    var shg_table = [
            9,
            11,
            12,
            13,
            13,
            14,
            14,
            15,
            15,
            15,
            15,
            16,
            16,
            16,
            16,
            17,
            17,
            17,
            17,
            17,
            17,
            17,
            18,
            18,
            18,
            18,
            18,
            18,
            18,
            18,
            18,
            19,
            19,
            19,
            19,
            19,
            19,
            19,
            19,
            19,
            19,
            19,
            19,
            19,
            19,
            20,
            20,
            20,
            20,
            20,
            20,
            20,
            20,
            20,
            20,
            20,
            20,
            20,
            20,
            20,
            20,
            20,
            20,
            21,
            21,
            21,
            21,
            21,
            21,
            21,
            21,
            21,
            21,
            21,
            21,
            21,
            21,
            21,
            21,
            21,
            21,
            21,
            21,
            21,
            21,
            21,
            21,
            21,
            21,
            21,
            22,
            22,
            22,
            22,
            22,
            22,
            22,
            22,
            22,
            22,
            22,
            22,
            22,
            22,
            22,
            22,
            22,
            22,
            22,
            22,
            22,
            22,
            22,
            22,
            22,
            22,
            22,
            22,
            22,
            22,
            22,
            22,
            22,
            22,
            22,
            22,
            22,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            23,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24,
            24
        ];
    function filterGaussBlurRGBA(imageData, radius) {
        var pixels = imageData.data, width = imageData.width, height = imageData.height;
        var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum, r_out_sum, g_out_sum, b_out_sum, a_out_sum, r_in_sum, g_in_sum, b_in_sum, a_in_sum, pr, pg, pb, pa, rbs;
        var div = radius + radius + 1, widthMinus1 = width - 1, heightMinus1 = height - 1, radiusPlus1 = radius + 1, sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2, stackStart = new BlurStack(), stackEnd = null, stack = stackStart, stackIn = null, stackOut = null, mul_sum = mul_table[radius], shg_sum = shg_table[radius];
        for (i = 1; i < div; i++) {
            stack = stack.next = new BlurStack();
            if (i == radiusPlus1)
                stackEnd = stack;
        }
        stack.next = stackStart;
        yw = yi = 0;
        for (y = 0; y < height; y++) {
            r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;
            r_out_sum = radiusPlus1 * (pr = pixels[yi]);
            g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
            b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
            a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);
            r_sum += sumFactor * pr;
            g_sum += sumFactor * pg;
            b_sum += sumFactor * pb;
            a_sum += sumFactor * pa;
            stack = stackStart;
            for (i = 0; i < radiusPlus1; i++) {
                stack.r = pr;
                stack.g = pg;
                stack.b = pb;
                stack.a = pa;
                stack = stack.next;
            }
            for (i = 1; i < radiusPlus1; i++) {
                p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
                r_sum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - i);
                g_sum += (stack.g = pg = pixels[p + 1]) * rbs;
                b_sum += (stack.b = pb = pixels[p + 2]) * rbs;
                a_sum += (stack.a = pa = pixels[p + 3]) * rbs;
                r_in_sum += pr;
                g_in_sum += pg;
                b_in_sum += pb;
                a_in_sum += pa;
                stack = stack.next;
            }
            stackIn = stackStart;
            stackOut = stackEnd;
            for (x = 0; x < width; x++) {
                pixels[yi + 3] = pa = a_sum * mul_sum >> shg_sum;
                if (pa !== 0) {
                    pa = 255 / pa;
                    pixels[yi] = (r_sum * mul_sum >> shg_sum) * pa;
                    pixels[yi + 1] = (g_sum * mul_sum >> shg_sum) * pa;
                    pixels[yi + 2] = (b_sum * mul_sum >> shg_sum) * pa;
                } else {
                    pixels[yi] = pixels[yi + 1] = pixels[yi + 2] = 0;
                }
                r_sum -= r_out_sum;
                g_sum -= g_out_sum;
                b_sum -= b_out_sum;
                a_sum -= a_out_sum;
                r_out_sum -= stackIn.r;
                g_out_sum -= stackIn.g;
                b_out_sum -= stackIn.b;
                a_out_sum -= stackIn.a;
                p = yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1) << 2;
                r_in_sum += stackIn.r = pixels[p];
                g_in_sum += stackIn.g = pixels[p + 1];
                b_in_sum += stackIn.b = pixels[p + 2];
                a_in_sum += stackIn.a = pixels[p + 3];
                r_sum += r_in_sum;
                g_sum += g_in_sum;
                b_sum += b_in_sum;
                a_sum += a_in_sum;
                stackIn = stackIn.next;
                r_out_sum += pr = stackOut.r;
                g_out_sum += pg = stackOut.g;
                b_out_sum += pb = stackOut.b;
                a_out_sum += pa = stackOut.a;
                r_in_sum -= pr;
                g_in_sum -= pg;
                b_in_sum -= pb;
                a_in_sum -= pa;
                stackOut = stackOut.next;
                yi += 4;
            }
            yw += width;
        }
        for (x = 0; x < width; x++) {
            g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;
            yi = x << 2;
            r_out_sum = radiusPlus1 * (pr = pixels[yi]);
            g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
            b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
            a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);
            r_sum += sumFactor * pr;
            g_sum += sumFactor * pg;
            b_sum += sumFactor * pb;
            a_sum += sumFactor * pa;
            stack = stackStart;
            for (i = 0; i < radiusPlus1; i++) {
                stack.r = pr;
                stack.g = pg;
                stack.b = pb;
                stack.a = pa;
                stack = stack.next;
            }
            yp = width;
            for (i = 1; i <= radius; i++) {
                yi = yp + x << 2;
                r_sum += (stack.r = pr = pixels[yi]) * (rbs = radiusPlus1 - i);
                g_sum += (stack.g = pg = pixels[yi + 1]) * rbs;
                b_sum += (stack.b = pb = pixels[yi + 2]) * rbs;
                a_sum += (stack.a = pa = pixels[yi + 3]) * rbs;
                r_in_sum += pr;
                g_in_sum += pg;
                b_in_sum += pb;
                a_in_sum += pa;
                stack = stack.next;
                if (i < heightMinus1) {
                    yp += width;
                }
            }
            yi = x;
            stackIn = stackStart;
            stackOut = stackEnd;
            for (y = 0; y < height; y++) {
                p = yi << 2;
                pixels[p + 3] = pa = a_sum * mul_sum >> shg_sum;
                if (pa > 0) {
                    pa = 255 / pa;
                    pixels[p] = (r_sum * mul_sum >> shg_sum) * pa;
                    pixels[p + 1] = (g_sum * mul_sum >> shg_sum) * pa;
                    pixels[p + 2] = (b_sum * mul_sum >> shg_sum) * pa;
                } else {
                    pixels[p] = pixels[p + 1] = pixels[p + 2] = 0;
                }
                r_sum -= r_out_sum;
                g_sum -= g_out_sum;
                b_sum -= b_out_sum;
                a_sum -= a_out_sum;
                r_out_sum -= stackIn.r;
                g_out_sum -= stackIn.g;
                b_out_sum -= stackIn.b;
                a_out_sum -= stackIn.a;
                p = x + ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width << 2;
                r_sum += r_in_sum += stackIn.r = pixels[p];
                g_sum += g_in_sum += stackIn.g = pixels[p + 1];
                b_sum += b_in_sum += stackIn.b = pixels[p + 2];
                a_sum += a_in_sum += stackIn.a = pixels[p + 3];
                stackIn = stackIn.next;
                r_out_sum += pr = stackOut.r;
                g_out_sum += pg = stackOut.g;
                b_out_sum += pb = stackOut.b;
                a_out_sum += pa = stackOut.a;
                r_in_sum -= pr;
                g_in_sum -= pg;
                b_in_sum -= pb;
                a_in_sum -= pa;
                stackOut = stackOut.next;
                yi += width;
            }
        }
    }
    Kinetic.Filters.Blur = function (imageData) {
        var radius = this.getFilterRadius() | 0;
        if (radius > 0) {
            filterGaussBlurRGBA(imageData, radius);
        }
    };
    Kinetic.Factory.addFilterGetterSetter(Kinetic.Image, 'filterRadius', 0);
}());
;
(function () {
    function pixelAt(idata, x, y) {
        var idx = (y * idata.width + x) * 4;
        var d = [];
        d.push(idata.data[idx++], idata.data[idx++], idata.data[idx++], idata.data[idx++]);
        return d;
    }
    function rgbDistance(p1, p2) {
        return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2) + Math.pow(p1[2] - p2[2], 2));
    }
    function rgbMean(pTab) {
        var m = [
                0,
                0,
                0
            ];
        for (var i = 0; i < pTab.length; i++) {
            m[0] += pTab[i][0];
            m[1] += pTab[i][1];
            m[2] += pTab[i][2];
        }
        m[0] /= pTab.length;
        m[1] /= pTab.length;
        m[2] /= pTab.length;
        return m;
    }
    function backgroundMask(idata, threshold) {
        var rgbv_no = pixelAt(idata, 0, 0);
        var rgbv_ne = pixelAt(idata, idata.width - 1, 0);
        var rgbv_so = pixelAt(idata, 0, idata.height - 1);
        var rgbv_se = pixelAt(idata, idata.width - 1, idata.height - 1);
        var thres = threshold || 10;
        if (rgbDistance(rgbv_no, rgbv_ne) < thres && rgbDistance(rgbv_ne, rgbv_se) < thres && rgbDistance(rgbv_se, rgbv_so) < thres && rgbDistance(rgbv_so, rgbv_no) < thres) {
            var mean = rgbMean([
                    rgbv_ne,
                    rgbv_no,
                    rgbv_se,
                    rgbv_so
                ]);
            var mask = [];
            for (var i = 0; i < idata.width * idata.height; i++) {
                var d = rgbDistance(mean, [
                        idata.data[i * 4],
                        idata.data[i * 4 + 1],
                        idata.data[i * 4 + 2]
                    ]);
                mask[i] = d < thres ? 0 : 255;
            }
            return mask;
        }
    }
    function applyMask(idata, mask) {
        for (var i = 0; i < idata.width * idata.height; i++) {
            idata.data[4 * i + 3] = mask[i];
        }
    }
    function erodeMask(mask, sw, sh) {
        var weights = [
                1,
                1,
                1,
                1,
                0,
                1,
                1,
                1,
                1
            ];
        var side = Math.round(Math.sqrt(weights.length));
        var halfSide = Math.floor(side / 2);
        var maskResult = [];
        for (var y = 0; y < sh; y++) {
            for (var x = 0; x < sw; x++) {
                var so = y * sw + x;
                var a = 0;
                for (var cy = 0; cy < side; cy++) {
                    for (var cx = 0; cx < side; cx++) {
                        var scy = y + cy - halfSide;
                        var scx = x + cx - halfSide;
                        if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                            var srcOff = scy * sw + scx;
                            var wt = weights[cy * side + cx];
                            a += mask[srcOff] * wt;
                        }
                    }
                }
                maskResult[so] = a === 255 * 8 ? 255 : 0;
            }
        }
        return maskResult;
    }
    function dilateMask(mask, sw, sh) {
        var weights = [
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1
            ];
        var side = Math.round(Math.sqrt(weights.length));
        var halfSide = Math.floor(side / 2);
        var maskResult = [];
        for (var y = 0; y < sh; y++) {
            for (var x = 0; x < sw; x++) {
                var so = y * sw + x;
                var a = 0;
                for (var cy = 0; cy < side; cy++) {
                    for (var cx = 0; cx < side; cx++) {
                        var scy = y + cy - halfSide;
                        var scx = x + cx - halfSide;
                        if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                            var srcOff = scy * sw + scx;
                            var wt = weights[cy * side + cx];
                            a += mask[srcOff] * wt;
                        }
                    }
                }
                maskResult[so] = a >= 255 * 4 ? 255 : 0;
            }
        }
        return maskResult;
    }
    function smoothEdgeMask(mask, sw, sh) {
        var weights = [
                1 / 9,
                1 / 9,
                1 / 9,
                1 / 9,
                1 / 9,
                1 / 9,
                1 / 9,
                1 / 9,
                1 / 9
            ];
        var side = Math.round(Math.sqrt(weights.length));
        var halfSide = Math.floor(side / 2);
        var maskResult = [];
        for (var y = 0; y < sh; y++) {
            for (var x = 0; x < sw; x++) {
                var so = y * sw + x;
                var a = 0;
                for (var cy = 0; cy < side; cy++) {
                    for (var cx = 0; cx < side; cx++) {
                        var scy = y + cy - halfSide;
                        var scx = x + cx - halfSide;
                        if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                            var srcOff = scy * sw + scx;
                            var wt = weights[cy * side + cx];
                            a += mask[srcOff] * wt;
                        }
                    }
                }
                maskResult[so] = a;
            }
        }
        return maskResult;
    }
    Kinetic.Filters.Mask = function (idata) {
        var threshold = this.getFilterThreshold(), mask = backgroundMask(idata, threshold);
        if (mask) {
            mask = erodeMask(mask, idata.width, idata.height);
            mask = dilateMask(mask, idata.width, idata.height);
            mask = smoothEdgeMask(mask, idata.width, idata.height);
            applyMask(idata, mask);
        }
        return idata;
    };
    Kinetic.Factory.addFilterGetterSetter(Kinetic.Image, 'filterThreshold', 0);
}());
;
(function () {
    var rgb_to_hsl = function (r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b), chroma = max - min, luminance = chroma / 2, saturation = chroma / (1 - Math.abs(2 * luminance - 1)), hue = 0;
        if (max == r) {
            hue = (g - b) / chroma % 6;
        } else if (max == g) {
            hue = (b - r) / chroma + 2;
        } else if (max == b) {
            hue = (r - g) / chroma + 4;
        }
        return [
            (hue * 60 + 360) % 360,
            saturation,
            luminance
        ];
    };
    var pixelShiftHue = function (r, g, b, deg) {
        r /= 255;
        g /= 255;
        b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b), chroma = max - min, luminance = chroma / 2, saturation = chroma / (1 - Math.abs(2 * luminance - 1)), hue = 0;
        if (max == r) {
            hue = (g - b) / chroma % 6;
        } else if (max == g) {
            hue = (b - r) / chroma + 2;
        } else if (max == b) {
            hue = (r - g) / chroma + 4;
        }
        hue *= 60;
        hue %= 360;
        hue += deg;
        hue %= 360;
        hue /= 60;
        var rR = 0, rG = 0, rB = 0, tmp = chroma * (1 - Math.abs(hue % 2 - 1)), m = luminance - chroma / 2;
        if (0 <= hue && hue < 1) {
            rR = chroma;
            rG = tmp;
        } else if (1 <= hue && hue < 2) {
            rG = chroma;
            rR = tmp;
        } else if (2 <= hue && hue < 3) {
            rG = chroma;
            rB = tmp;
        } else if (3 <= hue && hue < 4) {
            rB = chroma;
            rG = tmp;
        } else if (4 <= hue && hue < 5) {
            rB = chroma;
            rR = tmp;
        } else if (5 <= hue && hue < 6) {
            rR = chroma;
            rB = tmp;
        }
        rR += m;
        rG += m;
        rB += m;
        rR = 255 * rR;
        rG = 255 * rG;
        rB = 255 * rB;
        return [
            rR,
            rG,
            rB
        ];
    };
    var shift_hue = function (imageData, deg) {
        var data = imageData.data, pixel;
        for (var i = 0; i < data.length; i += 4) {
            pixel = pixelShiftHue(data[i + 0], data[i + 1], data[i + 2], deg);
            data[i + 0] = pixel[0];
            data[i + 1] = pixel[1];
            data[i + 2] = pixel[2];
        }
    };
    Kinetic.Filters.ShiftHue = function (imageData) {
        shift_hue(imageData, this.getFilterHueShiftDeg() % 360);
    };
    Kinetic.Factory.addFilterGetterSetter(Kinetic.Image, 'filterHueShiftDeg', 0);
    Kinetic.Filters.Colorize = function (imageData) {
        var data = imageData.data;
        var color = this.getFilterColorizeColor(), hsl = rgb_to_hsl(color[0], color[1], color[2]), hue = hsl[0];
        for (var i = 0; i < data.length; i += 4) {
            data[i + 1] = 0;
            data[i + 2] = 0;
        }
        shift_hue(imageData, hue);
    };
    Kinetic.Factory.addFilterGetterSetter(Kinetic.Image, 'filterColorizeColor', [
        255,
        0,
        0
    ]);
}());
;
(function () {
    var convolve_internal = function (imageData, matrix) {
        var pixels = imageData.data, imageSizeX = imageData.width, imageSizeY = imageData.height, nPixels = imageSizeX * imageSizeY, pixel;
        var result = [];
        result.length = imageSizeX * imageSizeY * 4;
        var matrixSizeX = matrix.length, matrixSizeY = matrix[0].length, matrixMidX = Math.floor(matrix.length / 2), matrixMidY = Math.floor(matrix[0].length / 2);
        var r, g, b, a, x, y, px, py, pos, i, j;
        for (y = 0; y < imageSizeY; y += 1) {
            for (x = 0; x < imageSizeX; x += 1) {
                r = 0;
                g = 0;
                b = 0;
                a = 0;
                for (i = 0; i < matrixSizeX; i += 1) {
                    for (j = 0; j < matrixSizeY; j += 1) {
                        px = (x + i - matrixMidX) % imageSizeX;
                        px = px > 0 ? px : -px;
                        py = (y + i - matrixMidY) % imageSizeY;
                        py = py > 0 ? py : -py;
                        pos = (py * imageSizeX + px) * 4;
                        r += matrix[j][i] * pixels[pos + 0];
                        g += matrix[j][i] * pixels[pos + 1];
                        b += matrix[j][i] * pixels[pos + 2];
                    }
                }
                pos = (y * imageSizeX + x) * 4;
                result[pos + 0] = r;
                result[pos + 1] = g;
                result[pos + 2] = b;
            }
        }
        var lastPos = nPixels * 4;
        for (pos = 0; pos < lastPos; pos += 4) {
            pixels[pos + 0] = result[pos + 0];
            pixels[pos + 1] = result[pos + 1];
            pixels[pos + 2] = result[pos + 2];
        }
    };
    var gaussian = function (x, mean, sigma) {
        var dx = x - mean;
        return Math.pow(Math.E, -dx * dx / (2 * sigma * sigma));
    };
    var make_blur_kernel = function (size, scale, sigma) {
        if (size % 2 === 0) {
            size += 1;
        }
        var kernel = [], i, j, row;
        for (i = 0; i < size; i += 1) {
            row = [];
            for (j = 0; j < size; j += 1) {
                row.push(scale * gaussian(i, size / 2, sigma) * gaussian(j, size / 2, sigma));
            }
            kernel.push(row);
        }
        return kernel;
    };
    var make_edge_detect_kernel = function (size, scale, sigma) {
        if (size % 2 === 0) {
            size += 1;
        }
        var kernel = [], i, j, row, g;
        for (i = 0; i < size; i += 1) {
            row = [];
            for (j = 0; j < size; j += 1) {
                g1 = gaussian(i, size / 2, sigma) * gaussian(j, size / 2, sigma);
                g2 = gaussian(i, size / 2, sigma * 1.6) * gaussian(j, size / 2, sigma * 1.6);
                row.push(scale * (g2 - g1));
            }
            kernel.push(row);
        }
        return kernel;
    };
    var make_soft_blur_kernel = function (size, percent) {
        var kernel = make_blur_kernel(size, percent, 1), mid = Math.floor(size / 2);
        kernel[mid][mid] += 1 - percent;
        return kernel;
    };
    var make_unsharp_kernel = function (size, percent) {
        var kernel = make_blur_kernel(size, -percent, 1), mid = Math.floor(size / 2);
        kernel[mid][mid] += 1 + percent;
        return kernel;
    };
    Kinetic.Factory.addFilterGetterSetter(Kinetic.Image, 'filterAmount', 50);
    Kinetic.Filters.UnsharpMask = function (imageData) {
        convolve_internal(imageData, make_unsharp_kernel(5, this.getFilterAmount() / 100));
    };
    Kinetic.Filters.SoftBlur = function (imageData) {
        convolve_internal(imageData, make_soft_blur_kernel(5, this.getFilterAmount() / 100));
    };
    Kinetic.Filters.Edge = function (imageData) {
        var s = this.getFilterAmount() / 100;
        if (s === 0) {
            return;
        }
        convolve_internal(imageData, [
            [
                0,
                -1 * s,
                0
            ],
            [
                -1 * s,
                1 - s + 4 * s,
                -1 * s
            ],
            [
                0,
                -1 * s,
                0
            ]
        ]);
    };
    Kinetic.Filters.Emboss = function (imageData) {
        var s = this.getFilterAmount() / 100;
        if (s === 0) {
            return;
        }
        convolve_internal(imageData, [
            [
                -1 * s,
                -0.5 * s,
                0
            ],
            [
                -0.5 * s,
                1 + 0.5 * s,
                0.5 * s
            ],
            [
                0,
                0.5 * s,
                1 * s
            ]
        ]);
    };
}());
});
require.define('25', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Bacon, BufferingSource, Bus, CompositeUnsubscribe, Desc, Dispatcher, End, Error, Event, EventStream, Initial, Next, None, Observable, Property, PropertyDispatcher, Some, Source, UpdateBarrier, addPropertyInitValueToStream, assert, assertArray, assertEventStream, assertFunction, assertNoArguments, assertString, cloneArray, compositeUnsubscribe, containsDuplicateDeps, convertArgsToFunction, describe, end, eventIdCounter, former, idCounter, initial, isArray, isFieldKey, isFunction, isObservable, latterF, liftCallback, makeFunction, makeFunctionArgs, makeFunction_, makeSpawner, next, nop, partiallyApplied, recursionDepth, registerObs, spys, toCombinator, toEvent, toFieldExtractor, toFieldKey, toOption, toSimpleExtractor, withDescription, withMethodCallSupport, _, _ref, _ref1, _ref2, __slice = [].slice, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        }, __bind = function (fn, me) {
            return function () {
                return fn.apply(me, arguments);
            };
        };
    Bacon = {
        toString: function () {
            return 'Bacon';
        }
    };
    Bacon.version = '0.7.0';
    Bacon.fromBinder = function (binder, eventTransformer) {
        if (eventTransformer == null) {
            eventTransformer = _.id;
        }
        return new EventStream(describe(Bacon, 'fromBinder', binder, eventTransformer), function (sink) {
            var unbinder;
            return unbinder = binder(function () {
                var args, event, reply, value, _i, _len;
                args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                value = eventTransformer.apply(null, args);
                if (!(isArray(value) && _.last(value) instanceof Event)) {
                    value = [value];
                }
                reply = Bacon.more;
                for (_i = 0, _len = value.length; _i < _len; _i++) {
                    event = value[_i];
                    reply = sink(event = toEvent(event));
                    if (reply === Bacon.noMore || event.isEnd()) {
                        if (unbinder != null) {
                            unbinder();
                        } else {
                            Bacon.scheduler.setTimeout(function () {
                                return unbinder();
                            }, 0);
                        }
                        return reply;
                    }
                }
                return reply;
            });
        });
    };
    Bacon.$ = {
        asEventStream: function (eventName, selector, eventTransformer) {
            var _ref, _this = this;
            if (isFunction(selector)) {
                _ref = [
                    selector,
                    null
                ], eventTransformer = _ref[0], selector = _ref[1];
            }
            return withDescription(this, 'asEventStream', eventName, Bacon.fromBinder(function (handler) {
                _this.on(eventName, selector, handler);
                return function () {
                    return _this.off(eventName, selector, handler);
                };
            }, eventTransformer));
        }
    };
    if ((_ref = typeof jQuery !== 'undefined' && jQuery !== null ? jQuery : typeof Zepto !== 'undefined' && Zepto !== null ? Zepto : null) != null) {
        _ref.fn.asEventStream = Bacon.$.asEventStream;
    }
    Bacon.fromEventTarget = function (target, eventName, eventTransformer) {
        var sub, unsub, _ref1, _ref2, _ref3, _ref4;
        sub = (_ref1 = target.addEventListener) != null ? _ref1 : (_ref2 = target.addListener) != null ? _ref2 : target.bind;
        unsub = (_ref3 = target.removeEventListener) != null ? _ref3 : (_ref4 = target.removeListener) != null ? _ref4 : target.unbind;
        return withDescription(Bacon, 'fromEventTarget', target, eventName, Bacon.fromBinder(function (handler) {
            sub.call(target, eventName, handler);
            return function () {
                return unsub.call(target, eventName, handler);
            };
        }, eventTransformer));
    };
    Bacon.fromPromise = function (promise, abort) {
        return withDescription(Bacon, 'fromPromise', promise, Bacon.fromBinder(function (handler) {
            promise.then(handler, function (e) {
                return handler(new Error(e));
            });
            return function () {
                if (abort) {
                    return typeof promise.abort === 'function' ? promise.abort() : void 0;
                }
            };
        }, function (value) {
            return [
                value,
                end()
            ];
        }));
    };
    Bacon.noMore = ['<no-more>'];
    Bacon.more = ['<more>'];
    Bacon.later = function (delay, value) {
        return withDescription(Bacon, 'later', delay, value, Bacon.sequentially(delay, [value]));
    };
    Bacon.sequentially = function (delay, values) {
        var index;
        index = 0;
        return withDescription(Bacon, 'sequentially', delay, values, Bacon.fromPoll(delay, function () {
            var value;
            value = values[index++];
            if (index < values.length) {
                return value;
            } else if (index === values.length) {
                return [
                    value,
                    end()
                ];
            } else {
                return end();
            }
        }));
    };
    Bacon.repeatedly = function (delay, values) {
        var index;
        index = 0;
        return withDescription(Bacon, 'repeatedly', delay, values, Bacon.fromPoll(delay, function () {
            return values[index++ % values.length];
        }));
    };
    Bacon.spy = function (spy) {
        return spys.push(spy);
    };
    spys = [];
    registerObs = function (obs) {
        if (spys.length) {
            if (!registerObs.running) {
                try {
                    registerObs.running = true;
                    return _.each(spys, function (_, spy) {
                        return spy(obs);
                    });
                } finally {
                    delete registerObs.running;
                }
            }
        }
    };
    withMethodCallSupport = function (wrapped) {
        return function () {
            var args, context, f, methodName;
            f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            if (typeof f === 'object' && args.length) {
                context = f;
                methodName = args[0];
                f = function () {
                    return context[methodName].apply(context, arguments);
                };
                args = args.slice(1);
            }
            return wrapped.apply(null, [f].concat(__slice.call(args)));
        };
    };
    liftCallback = function (desc, wrapped) {
        return withMethodCallSupport(function () {
            var args, f, stream;
            f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            stream = partiallyApplied(wrapped, [function (values, callback) {
                    return f.apply(null, __slice.call(values).concat([callback]));
                }]);
            return withDescription.apply(null, [
                Bacon,
                desc,
                f
            ].concat(__slice.call(args), [Bacon.combineAsArray(args).flatMap(stream)]));
        });
    };
    Bacon.fromCallback = liftCallback('fromCallback', function () {
        var args, f;
        f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return Bacon.fromBinder(function (handler) {
            makeFunction(f, args)(handler);
            return nop;
        }, function (value) {
            return [
                value,
                end()
            ];
        });
    });
    Bacon.fromNodeCallback = liftCallback('fromNodeCallback', function () {
        var args, f;
        f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return Bacon.fromBinder(function (handler) {
            makeFunction(f, args)(handler);
            return nop;
        }, function (error, value) {
            if (error) {
                return [
                    new Error(error),
                    end()
                ];
            }
            return [
                value,
                end()
            ];
        });
    });
    Bacon.fromPoll = function (delay, poll) {
        return withDescription(Bacon, 'fromPoll', delay, poll, Bacon.fromBinder(function (handler) {
            var id;
            id = Bacon.scheduler.setInterval(handler, delay);
            return function () {
                return Bacon.scheduler.clearInterval(id);
            };
        }, poll));
    };
    Bacon.interval = function (delay, value) {
        if (value == null) {
            value = {};
        }
        return withDescription(Bacon, 'interval', delay, value, Bacon.fromPoll(delay, function () {
            return next(value);
        }));
    };
    Bacon.constant = function (value) {
        return new Property(describe(Bacon, 'constant', value), function (sink) {
            sink(initial(value));
            sink(end());
            return nop;
        });
    };
    Bacon.never = function () {
        return withDescription(Bacon, 'never', Bacon.fromArray([]));
    };
    Bacon.once = function (value) {
        return withDescription(Bacon, 'once', value, Bacon.fromArray([value]));
    };
    Bacon.fromArray = function (values) {
        assertArray(values);
        values = cloneArray(values);
        return new EventStream(describe(Bacon, 'fromArray', values), function (sink) {
            var send, unsubd;
            unsubd = false;
            send = function () {
                var reply, value;
                if (_.empty(values)) {
                    return sink(end());
                } else {
                    value = values.splice(0, 1)[0];
                    reply = sink(toEvent(value));
                    if (reply !== Bacon.noMore && !unsubd) {
                        return send();
                    }
                }
            };
            send();
            return function () {
                return unsubd = true;
            };
        });
    };
    Bacon.mergeAll = function () {
        var streams;
        streams = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (isArray(streams[0])) {
            streams = streams[0];
        }
        return withDescription.apply(null, [
            Bacon,
            'mergeAll'
        ].concat(__slice.call(streams), [_.fold(streams, Bacon.never(), function (a, b) {
                return a.merge(b);
            })]));
    };
    Bacon.zipAsArray = function () {
        var streams;
        streams = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (isArray(streams[0])) {
            streams = streams[0];
        }
        return withDescription.apply(null, [
            Bacon,
            'zipAsArray'
        ].concat(__slice.call(streams), [Bacon.zipWith(streams, function () {
                var xs;
                xs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                return xs;
            })]));
    };
    Bacon.zipWith = function () {
        var f, streams, _ref1;
        f = arguments[0], streams = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (!isFunction(f)) {
            _ref1 = [
                f,
                streams[0]
            ], streams = _ref1[0], f = _ref1[1];
        }
        streams = _.map(function (s) {
            return s.toEventStream();
        }, streams);
        return withDescription.apply(null, [
            Bacon,
            'zipWith',
            f
        ].concat(__slice.call(streams), [Bacon.when(streams, f)]));
    };
    Bacon.groupSimultaneous = function () {
        var s, sources, streams;
        streams = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (streams.length === 1 && isArray(streams[0])) {
            streams = streams[0];
        }
        sources = function () {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = streams.length; _i < _len; _i++) {
                s = streams[_i];
                _results.push(new BufferingSource(s));
            }
            return _results;
        }();
        return withDescription.apply(null, [
            Bacon,
            'groupSimultaneous'
        ].concat(__slice.call(streams), [Bacon.when(sources, function () {
                var xs;
                xs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                return xs;
            })]));
    };
    Bacon.combineAsArray = function () {
        var index, s, sources, stream, streams, _i, _len;
        streams = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (streams.length === 1 && isArray(streams[0])) {
            streams = streams[0];
        }
        for (index = _i = 0, _len = streams.length; _i < _len; index = ++_i) {
            stream = streams[index];
            if (!isObservable(stream)) {
                streams[index] = Bacon.constant(stream);
            }
        }
        if (streams.length) {
            sources = function () {
                var _j, _len1, _results;
                _results = [];
                for (_j = 0, _len1 = streams.length; _j < _len1; _j++) {
                    s = streams[_j];
                    _results.push(new Source(s, true, false, s.subscribeInternal));
                }
                return _results;
            }();
            return withDescription.apply(null, [
                Bacon,
                'combineAsArray'
            ].concat(__slice.call(streams), [Bacon.when(sources, function () {
                    var xs;
                    xs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                    return xs;
                }).toProperty()]));
        } else {
            return Bacon.constant([]);
        }
    };
    Bacon.onValues = function () {
        var f, streams, _i;
        streams = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), f = arguments[_i++];
        return Bacon.combineAsArray(streams).onValues(f);
    };
    Bacon.combineWith = function () {
        var f, streams;
        f = arguments[0], streams = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return withDescription.apply(null, [
            Bacon,
            'combineWith',
            f
        ].concat(__slice.call(streams), [Bacon.combineAsArray(streams).map(function (values) {
                return f.apply(null, values);
            })]));
    };
    Bacon.combineTemplate = function (template) {
        var applyStreamValue, combinator, compile, compileTemplate, constantValue, current, funcs, mkContext, setValue, streams;
        funcs = [];
        streams = [];
        current = function (ctxStack) {
            return ctxStack[ctxStack.length - 1];
        };
        setValue = function (ctxStack, key, value) {
            return current(ctxStack)[key] = value;
        };
        applyStreamValue = function (key, index) {
            return function (ctxStack, values) {
                return setValue(ctxStack, key, values[index]);
            };
        };
        constantValue = function (key, value) {
            return function (ctxStack) {
                return setValue(ctxStack, key, value);
            };
        };
        mkContext = function (template) {
            if (isArray(template)) {
                return [];
            } else {
                return {};
            }
        };
        compile = function (key, value) {
            var popContext, pushContext;
            if (isObservable(value)) {
                streams.push(value);
                return funcs.push(applyStreamValue(key, streams.length - 1));
            } else if (value === Object(value) && typeof value !== 'function') {
                pushContext = function (key) {
                    return function (ctxStack) {
                        var newContext;
                        newContext = mkContext(value);
                        setValue(ctxStack, key, newContext);
                        return ctxStack.push(newContext);
                    };
                };
                popContext = function (ctxStack) {
                    return ctxStack.pop();
                };
                funcs.push(pushContext(key));
                compileTemplate(value);
                return funcs.push(popContext);
            } else {
                return funcs.push(constantValue(key, value));
            }
        };
        compileTemplate = function (template) {
            return _.each(template, compile);
        };
        compileTemplate(template);
        combinator = function (values) {
            var ctxStack, f, rootContext, _i, _len;
            rootContext = mkContext(template);
            ctxStack = [rootContext];
            for (_i = 0, _len = funcs.length; _i < _len; _i++) {
                f = funcs[_i];
                f(ctxStack, values);
            }
            return rootContext;
        };
        return withDescription(Bacon, 'combineTemplate', template, Bacon.combineAsArray(streams).map(combinator));
    };
    eventIdCounter = 0;
    Event = function () {
        function Event() {
            this.id = ++eventIdCounter;
        }
        Event.prototype.isEvent = function () {
            return true;
        };
        Event.prototype.isEnd = function () {
            return false;
        };
        Event.prototype.isInitial = function () {
            return false;
        };
        Event.prototype.isNext = function () {
            return false;
        };
        Event.prototype.isError = function () {
            return false;
        };
        Event.prototype.hasValue = function () {
            return false;
        };
        Event.prototype.filter = function () {
            return true;
        };
        Event.prototype.inspect = function () {
            return this.toString();
        };
        return Event;
    }();
    Next = function (_super) {
        __extends(Next, _super);
        function Next(valueF) {
            Next.__super__.constructor.call(this);
            if (isFunction(valueF)) {
                this.value = _.cached(valueF);
            } else {
                this.value = _.always(valueF);
            }
        }
        Next.prototype.isNext = function () {
            return true;
        };
        Next.prototype.hasValue = function () {
            return true;
        };
        Next.prototype.fmap = function (f) {
            var _this = this;
            return this.apply(function () {
                return f(_this.value());
            });
        };
        Next.prototype.apply = function (value) {
            return new Next(value);
        };
        Next.prototype.filter = function (f) {
            return f(this.value());
        };
        Next.prototype.toString = function () {
            return _.toString(this.value());
        };
        return Next;
    }(Event);
    Initial = function (_super) {
        __extends(Initial, _super);
        function Initial() {
            _ref1 = Initial.__super__.constructor.apply(this, arguments);
            return _ref1;
        }
        Initial.prototype.isInitial = function () {
            return true;
        };
        Initial.prototype.isNext = function () {
            return false;
        };
        Initial.prototype.apply = function (value) {
            return new Initial(value);
        };
        Initial.prototype.toNext = function () {
            return new Next(this.value);
        };
        return Initial;
    }(Next);
    End = function (_super) {
        __extends(End, _super);
        function End() {
            _ref2 = End.__super__.constructor.apply(this, arguments);
            return _ref2;
        }
        End.prototype.isEnd = function () {
            return true;
        };
        End.prototype.fmap = function () {
            return this;
        };
        End.prototype.apply = function () {
            return this;
        };
        End.prototype.toString = function () {
            return '<end>';
        };
        return End;
    }(Event);
    Error = function (_super) {
        __extends(Error, _super);
        function Error(error) {
            this.error = error;
        }
        Error.prototype.isError = function () {
            return true;
        };
        Error.prototype.fmap = function () {
            return this;
        };
        Error.prototype.apply = function () {
            return this;
        };
        Error.prototype.toString = function () {
            return '<error> ' + _.toString(this.error);
        };
        return Error;
    }(Event);
    idCounter = 0;
    Observable = function () {
        function Observable(desc) {
            this.combine = __bind(this.combine, this);
            this.flatMapLatest = __bind(this.flatMapLatest, this);
            this.fold = __bind(this.fold, this);
            this.scan = __bind(this.scan, this);
            this.id = ++idCounter;
            this.assign = this.onValue;
            withDescription(desc, this);
        }
        Observable.prototype.onValue = function () {
            var f;
            f = makeFunctionArgs(arguments);
            return this.subscribe(function (event) {
                if (event.hasValue()) {
                    return f(event.value());
                }
            });
        };
        Observable.prototype.onValues = function (f) {
            return this.onValue(function (args) {
                return f.apply(null, args);
            });
        };
        Observable.prototype.onError = function () {
            var f;
            f = makeFunctionArgs(arguments);
            return this.subscribe(function (event) {
                if (event.isError()) {
                    return f(event.error);
                }
            });
        };
        Observable.prototype.onEnd = function () {
            var f;
            f = makeFunctionArgs(arguments);
            return this.subscribe(function (event) {
                if (event.isEnd()) {
                    return f();
                }
            });
        };
        Observable.prototype.errors = function () {
            return withDescription(this, 'errors', this.filter(function () {
                return false;
            }));
        };
        Observable.prototype.filter = function () {
            var args, f;
            f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            return convertArgsToFunction(this, f, args, function (f) {
                return withDescription(this, 'filter', f, this.withHandler(function (event) {
                    if (event.filter(f)) {
                        return this.push(event);
                    } else {
                        return Bacon.more;
                    }
                }));
            });
        };
        Observable.prototype.takeWhile = function () {
            var args, f;
            f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            return convertArgsToFunction(this, f, args, function (f) {
                return withDescription(this, 'takeWhile', f, this.withHandler(function (event) {
                    if (event.filter(f)) {
                        return this.push(event);
                    } else {
                        this.push(end());
                        return Bacon.noMore;
                    }
                }));
            });
        };
        Observable.prototype.endOnError = function () {
            var args, f;
            f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            if (f == null) {
                f = true;
            }
            return convertArgsToFunction(this, f, args, function (f) {
                return withDescription(this, 'endOnError', this.withHandler(function (event) {
                    if (event.isError() && f(event.error)) {
                        this.push(event);
                        return this.push(end());
                    } else {
                        return this.push(event);
                    }
                }));
            });
        };
        Observable.prototype.take = function (count) {
            if (count <= 0) {
                return Bacon.never();
            }
            return withDescription(this, 'take', count, this.withHandler(function (event) {
                if (!event.hasValue()) {
                    return this.push(event);
                } else {
                    count--;
                    if (count > 0) {
                        return this.push(event);
                    } else {
                        if (count === 0) {
                            this.push(event);
                        }
                        this.push(end());
                        return Bacon.noMore;
                    }
                }
            }));
        };
        Observable.prototype.map = function () {
            var args, p;
            p = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            if (p instanceof Property) {
                return p.sampledBy(this, former);
            } else {
                return convertArgsToFunction(this, p, args, function (f) {
                    return withDescription(this, 'map', f, this.withHandler(function (event) {
                        return this.push(event.fmap(f));
                    }));
                });
            }
        };
        Observable.prototype.mapError = function () {
            var f;
            f = makeFunctionArgs(arguments);
            return withDescription(this, 'mapError', f, this.withHandler(function (event) {
                if (event.isError()) {
                    return this.push(next(f(event.error)));
                } else {
                    return this.push(event);
                }
            }));
        };
        Observable.prototype.mapEnd = function () {
            var f;
            f = makeFunctionArgs(arguments);
            return withDescription(this, 'mapEnd', f, this.withHandler(function (event) {
                if (event.isEnd()) {
                    this.push(next(f(event)));
                    this.push(end());
                    return Bacon.noMore;
                } else {
                    return this.push(event);
                }
            }));
        };
        Observable.prototype.doAction = function () {
            var f;
            f = makeFunctionArgs(arguments);
            return withDescription(this, 'doAction', f, this.withHandler(function (event) {
                if (event.hasValue()) {
                    f(event.value());
                }
                return this.push(event);
            }));
        };
        Observable.prototype.skip = function (count) {
            return withDescription(this, 'skip', count, this.withHandler(function (event) {
                if (!event.hasValue()) {
                    return this.push(event);
                } else if (count > 0) {
                    count--;
                    return Bacon.more;
                } else {
                    return this.push(event);
                }
            }));
        };
        Observable.prototype.skipDuplicates = function (isEqual) {
            if (isEqual == null) {
                isEqual = function (a, b) {
                    return a === b;
                };
            }
            return withDescription(this, 'skipDuplicates', this.withStateMachine(None, function (prev, event) {
                if (!event.hasValue()) {
                    return [
                        prev,
                        [event]
                    ];
                } else if (event.isInitial() || prev === None || !isEqual(prev.get(), event.value())) {
                    return [
                        new Some(event.value()),
                        [event]
                    ];
                } else {
                    return [
                        prev,
                        []
                    ];
                }
            }));
        };
        Observable.prototype.skipErrors = function () {
            return withDescription(this, 'skipErrors', this.withHandler(function (event) {
                if (event.isError()) {
                    return Bacon.more;
                } else {
                    return this.push(event);
                }
            }));
        };
        Observable.prototype.withStateMachine = function (initState, f) {
            var state;
            state = initState;
            return withDescription(this, 'withStateMachine', initState, f, this.withHandler(function (event) {
                var fromF, newState, output, outputs, reply, _i, _len;
                fromF = f(state, event);
                newState = fromF[0], outputs = fromF[1];
                state = newState;
                reply = Bacon.more;
                for (_i = 0, _len = outputs.length; _i < _len; _i++) {
                    output = outputs[_i];
                    reply = this.push(output);
                    if (reply === Bacon.noMore) {
                        return reply;
                    }
                }
                return reply;
            }));
        };
        Observable.prototype.scan = function (seed, f, lazyF) {
            var acc, f_, resultProperty, root, subscribe, _this = this;
            f_ = toCombinator(f);
            f = lazyF ? f_ : function (x, y) {
                return f_(x(), y());
            };
            acc = toOption(seed).map(function (x) {
                return _.always(x);
            });
            root = this;
            subscribe = function (sink) {
                var initSent, reply, sendInit, unsub;
                initSent = false;
                unsub = nop;
                reply = Bacon.more;
                sendInit = function () {
                    if (!initSent) {
                        return acc.forEach(function (valueF) {
                            initSent = true;
                            reply = sink(new Initial(valueF));
                            if (reply === Bacon.noMore) {
                                unsub();
                                return unsub = nop;
                            }
                        });
                    }
                };
                unsub = _this.subscribe(function (event) {
                    var next, prev;
                    if (event.hasValue()) {
                        if (initSent && event.isInitial()) {
                            return Bacon.more;
                        } else {
                            if (!event.isInitial()) {
                                sendInit();
                            }
                            initSent = true;
                            prev = acc.getOrElse(function () {
                                return void 0;
                            });
                            next = _.cached(function () {
                                return f(prev, event.value);
                            });
                            acc = new Some(next);
                            return sink(event.apply(next));
                        }
                    } else {
                        if (event.isEnd()) {
                            reply = sendInit();
                        }
                        if (reply !== Bacon.noMore) {
                            return sink(event);
                        }
                    }
                });
                UpdateBarrier.whenDone(resultProperty, sendInit);
                return unsub;
            };
            return resultProperty = new Property(describe(this, 'scan', seed, f), subscribe);
        };
        Observable.prototype.fold = function (seed, f) {
            return withDescription(this, 'fold', seed, f, this.scan(seed, f).sampledBy(this.filter(false).mapEnd().toProperty()));
        };
        Observable.prototype.zip = function (other, f) {
            if (f == null) {
                f = Array;
            }
            return withDescription(this, 'zip', other, Bacon.zipWith([
                this,
                other
            ], f));
        };
        Observable.prototype.diff = function (start, f) {
            f = toCombinator(f);
            return withDescription(this, 'diff', start, f, this.scan([start], function (prevTuple, next) {
                return [
                    next,
                    f(prevTuple[0], next)
                ];
            }).filter(function (tuple) {
                return tuple.length === 2;
            }).map(function (tuple) {
                return tuple[1];
            }));
        };
        Observable.prototype.flatMap = function (f, firstOnly) {
            var root;
            f = makeSpawner(f);
            root = this;
            return new EventStream(describe(root, 'flatMap' + (firstOnly ? 'First' : ''), f), function (sink) {
                var checkEnd, composite;
                composite = new CompositeUnsubscribe();
                checkEnd = function (unsub) {
                    unsub();
                    if (composite.empty()) {
                        return sink(end());
                    }
                };
                composite.add(function (__, unsubRoot) {
                    return root.subscribe(function (event) {
                        var child;
                        if (event.isEnd()) {
                            return checkEnd(unsubRoot);
                        } else if (event.isError()) {
                            return sink(event);
                        } else if (firstOnly && composite.count() > 1) {
                            return Bacon.more;
                        } else {
                            if (composite.unsubscribed) {
                                return Bacon.noMore;
                            }
                            child = f(event.value());
                            if (!isObservable(child)) {
                                child = Bacon.once(child);
                            }
                            return composite.add(function (unsubAll, unsubMe) {
                                return child.subscribe(function (event) {
                                    var reply;
                                    if (event.isEnd()) {
                                        checkEnd(unsubMe);
                                        return Bacon.noMore;
                                    } else {
                                        if (event instanceof Initial) {
                                            event = event.toNext();
                                        }
                                        reply = sink(event);
                                        if (reply === Bacon.noMore) {
                                            unsubAll();
                                        }
                                        return reply;
                                    }
                                });
                            });
                        }
                    });
                });
                return composite.unsubscribe;
            });
        };
        Observable.prototype.flatMapFirst = function (f) {
            return this.flatMap(f, true);
        };
        Observable.prototype.flatMapLatest = function (f) {
            var stream, _this = this;
            f = makeSpawner(f);
            stream = this.toEventStream();
            return withDescription(this, 'flatMapLatest', f, stream.flatMap(function (value) {
                return f(value).takeUntil(stream);
            }));
        };
        Observable.prototype.not = function () {
            return withDescription(this, 'not', this.map(function (x) {
                return !x;
            }));
        };
        Observable.prototype.log = function () {
            var args;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            this.subscribe(function (event) {
                return typeof console !== 'undefined' && console !== null ? typeof console.log === 'function' ? console.log.apply(console, __slice.call(args).concat([event.toString()])) : void 0 : void 0;
            });
            return this;
        };
        Observable.prototype.slidingWindow = function (n, minValues) {
            if (minValues == null) {
                minValues = 0;
            }
            return withDescription(this, 'slidingWindow', n, minValues, this.scan([], function (window, value) {
                return window.concat([value]).slice(-n);
            }).filter(function (values) {
                return values.length >= minValues;
            }));
        };
        Observable.prototype.combine = function (other, f) {
            var combinator;
            combinator = toCombinator(f);
            return withDescription(this, 'combine', other, f, Bacon.combineAsArray(this, other).map(function (values) {
                return combinator(values[0], values[1]);
            }));
        };
        Observable.prototype.decode = function (cases) {
            return withDescription(this, 'decode', cases, this.combine(Bacon.combineTemplate(cases), function (key, values) {
                return values[key];
            }));
        };
        Observable.prototype.awaiting = function (other) {
            return withDescription(this, 'awaiting', other, Bacon.groupSimultaneous(this, other).map(function (_arg) {
                var myValues, otherValues;
                myValues = _arg[0], otherValues = _arg[1];
                return otherValues.length === 0;
            }).toProperty(false).skipDuplicates());
        };
        Observable.prototype.name = function (name) {
            this.toString = function () {
                return name;
            };
            return this;
        };
        return Observable;
    }();
    Observable.prototype.reduce = Observable.prototype.fold;
    EventStream = function (_super) {
        __extends(EventStream, _super);
        function EventStream(desc, subscribe) {
            this.takeUntil = __bind(this.takeUntil, this);
            this.sampledBy = __bind(this.sampledBy, this);
            var dispatcher;
            if (isFunction(desc)) {
                subscribe = desc;
                desc = [];
            }
            EventStream.__super__.constructor.call(this, desc);
            assertFunction(subscribe);
            dispatcher = new Dispatcher(subscribe);
            this.subscribe = dispatcher.subscribe;
            this.subscribeInternal = this.subscribe;
            this.hasSubscribers = dispatcher.hasSubscribers;
            registerObs(this);
        }
        EventStream.prototype.delay = function (delay) {
            return withDescription(this, 'delay', delay, this.flatMap(function (value) {
                return Bacon.later(delay, value);
            }));
        };
        EventStream.prototype.debounce = function (delay) {
            return withDescription(this, 'debounce', delay, this.flatMapLatest(function (value) {
                return Bacon.later(delay, value);
            }));
        };
        EventStream.prototype.debounceImmediate = function (delay) {
            return withDescription(this, 'debounceImmediate', delay, this.flatMapFirst(function (value) {
                return Bacon.once(value).concat(Bacon.later(delay).filter(false));
            }));
        };
        EventStream.prototype.throttle = function (delay) {
            return withDescription(this, 'throttle', delay, this.bufferWithTime(delay).map(function (values) {
                return values[values.length - 1];
            }));
        };
        EventStream.prototype.bufferWithTime = function (delay) {
            return withDescription(this, 'bufferWithTime', delay, this.bufferWithTimeOrCount(delay, Number.MAX_VALUE));
        };
        EventStream.prototype.bufferWithCount = function (count) {
            return withDescription(this, 'bufferWithCount', count, this.bufferWithTimeOrCount(void 0, count));
        };
        EventStream.prototype.bufferWithTimeOrCount = function (delay, count) {
            var flushOrSchedule;
            flushOrSchedule = function (buffer) {
                if (buffer.values.length === count) {
                    return buffer.flush();
                } else if (delay !== void 0) {
                    return buffer.schedule();
                }
            };
            return withDescription(this, 'bufferWithTimeOrCount', delay, count, this.buffer(delay, flushOrSchedule, flushOrSchedule));
        };
        EventStream.prototype.buffer = function (delay, onInput, onFlush) {
            var buffer, delayMs, reply;
            if (onInput == null) {
                onInput = function () {
                };
            }
            if (onFlush == null) {
                onFlush = function () {
                };
            }
            buffer = {
                scheduled: false,
                end: null,
                values: [],
                flush: function () {
                    var reply;
                    this.scheduled = false;
                    if (this.values.length > 0) {
                        reply = this.push(next(this.values));
                        this.values = [];
                        if (this.end != null) {
                            return this.push(this.end);
                        } else if (reply !== Bacon.noMore) {
                            return onFlush(this);
                        }
                    } else {
                        if (this.end != null) {
                            return this.push(this.end);
                        }
                    }
                },
                schedule: function () {
                    var _this = this;
                    if (!this.scheduled) {
                        this.scheduled = true;
                        return delay(function () {
                            return _this.flush();
                        });
                    }
                }
            };
            reply = Bacon.more;
            if (!isFunction(delay)) {
                delayMs = delay;
                delay = function (f) {
                    return Bacon.scheduler.setTimeout(f, delayMs);
                };
            }
            return withDescription(this, 'buffer', this.withHandler(function (event) {
                buffer.push = this.push;
                if (event.isError()) {
                    reply = this.push(event);
                } else if (event.isEnd()) {
                    buffer.end = event;
                    if (!buffer.scheduled) {
                        buffer.flush();
                    }
                } else {
                    buffer.values.push(event.value());
                    onInput(buffer);
                }
                return reply;
            }));
        };
        EventStream.prototype.merge = function (right) {
            var left;
            assertEventStream(right);
            left = this;
            return new EventStream(describe(left, 'merge', right), function (sink) {
                var ends, smartSink;
                ends = 0;
                smartSink = function (obs) {
                    return function (unsubBoth) {
                        return obs.subscribe(function (event) {
                            var reply;
                            if (event.isEnd()) {
                                ends++;
                                if (ends === 2) {
                                    return sink(end());
                                } else {
                                    return Bacon.more;
                                }
                            } else {
                                reply = sink(event);
                                if (reply === Bacon.noMore) {
                                    unsubBoth();
                                }
                                return reply;
                            }
                        });
                    };
                };
                return compositeUnsubscribe(smartSink(left), smartSink(right));
            });
        };
        EventStream.prototype.toProperty = function (initValue) {
            if (arguments.length === 0) {
                initValue = None;
            }
            return withDescription(this, 'toProperty', initValue, this.scan(initValue, latterF, true));
        };
        EventStream.prototype.toEventStream = function () {
            return this;
        };
        EventStream.prototype.sampledBy = function (sampler, combinator) {
            return withDescription(this, 'sampledBy', sampler, combinator, this.toProperty().sampledBy(sampler, combinator));
        };
        EventStream.prototype.concat = function (right) {
            var left;
            left = this;
            return new EventStream(describe(left, 'concat', right), function (sink) {
                var unsubLeft, unsubRight;
                unsubRight = nop;
                unsubLeft = left.subscribe(function (e) {
                    if (e.isEnd()) {
                        return unsubRight = right.subscribe(sink);
                    } else {
                        return sink(e);
                    }
                });
                return function () {
                    unsubLeft();
                    return unsubRight();
                };
            });
        };
        EventStream.prototype.takeUntil = function (stopper) {
            var endMarker;
            endMarker = {};
            return withDescription(this, 'takeUntil', stopper, Bacon.groupSimultaneous(this.mapEnd(endMarker), stopper.skipErrors()).withHandler(function (event) {
                var data, reply, value, _i, _len, _ref3;
                if (!event.hasValue()) {
                    return this.push(event);
                } else {
                    _ref3 = event.value(), data = _ref3[0], stopper = _ref3[1];
                    if (stopper.length) {
                        return this.push(end());
                    } else {
                        reply = Bacon.more;
                        for (_i = 0, _len = data.length; _i < _len; _i++) {
                            value = data[_i];
                            if (value === endMarker) {
                                reply = this.push(end());
                            } else {
                                reply = this.push(next(value));
                            }
                        }
                        return reply;
                    }
                }
            }));
        };
        EventStream.prototype.skipUntil = function (starter) {
            var started;
            started = starter.take(1).map(true).toProperty(false);
            return withDescription(this, 'skipUntil', starter, this.filter(started));
        };
        EventStream.prototype.skipWhile = function () {
            var args, f, ok;
            f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            ok = false;
            return convertArgsToFunction(this, f, args, function (f) {
                return withDescription(this, 'skipWhile', f, this.withHandler(function (event) {
                    if (ok || !event.hasValue() || !f(event.value())) {
                        if (event.hasValue()) {
                            ok = true;
                        }
                        return this.push(event);
                    } else {
                        return Bacon.more;
                    }
                }));
            });
        };
        EventStream.prototype.startWith = function (seed) {
            return withDescription(this, 'startWith', seed, Bacon.once(seed).concat(this));
        };
        EventStream.prototype.withHandler = function (handler) {
            var dispatcher;
            dispatcher = new Dispatcher(this.subscribe, handler);
            return new EventStream(describe(this, 'withHandler', handler), dispatcher.subscribe);
        };
        return EventStream;
    }(Observable);
    Property = function (_super) {
        __extends(Property, _super);
        function Property(desc, subscribe, handler) {
            this.toEventStream = __bind(this.toEventStream, this);
            this.toProperty = __bind(this.toProperty, this);
            this.changes = __bind(this.changes, this);
            this.sample = __bind(this.sample, this);
            var _this = this;
            if (isFunction(desc)) {
                handler = subscribe;
                subscribe = desc;
                desc = [];
            }
            Property.__super__.constructor.call(this, desc);
            assertFunction(subscribe);
            if (handler === true) {
                this.subscribeInternal = subscribe;
            } else {
                this.subscribeInternal = new PropertyDispatcher(this, subscribe, handler).subscribe;
            }
            this.sampledBy = function (sampler, combinator) {
                var lazy, result, samplerSource, stream, thisSource;
                if (combinator != null) {
                    combinator = toCombinator(combinator);
                } else {
                    lazy = true;
                    combinator = function (f) {
                        return f();
                    };
                }
                thisSource = new Source(_this, false, false, _this.subscribeInternal, lazy);
                samplerSource = new Source(sampler, true, false, sampler.subscribe, lazy);
                stream = Bacon.when([
                    thisSource,
                    samplerSource
                ], combinator);
                result = sampler instanceof Property ? stream.toProperty() : stream;
                return withDescription(_this, 'sampledBy', sampler, combinator, result);
            };
            this.subscribe = this.subscribeInternal;
            registerObs(this);
        }
        Property.prototype.sample = function (interval) {
            return withDescription(this, 'sample', interval, this.sampledBy(Bacon.interval(interval, {})));
        };
        Property.prototype.changes = function () {
            var _this = this;
            return new EventStream(describe(this, 'changes'), function (sink) {
                return _this.subscribe(function (event) {
                    if (!event.isInitial()) {
                        return sink(event);
                    }
                });
            });
        };
        Property.prototype.withHandler = function (handler) {
            return new Property(describe(this, 'withHandler', handler), this.subscribeInternal, handler);
        };
        Property.prototype.toProperty = function () {
            assertNoArguments(arguments);
            return this;
        };
        Property.prototype.toEventStream = function () {
            var _this = this;
            return new EventStream(describe(this, 'toEventStream'), function (sink) {
                return _this.subscribe(function (event) {
                    if (event.isInitial()) {
                        event = event.toNext();
                    }
                    return sink(event);
                });
            });
        };
        Property.prototype.and = function (other) {
            return withDescription(this, 'and', other, this.combine(other, function (x, y) {
                return x && y;
            }));
        };
        Property.prototype.or = function (other) {
            return withDescription(this, 'or', other, this.combine(other, function (x, y) {
                return x || y;
            }));
        };
        Property.prototype.delay = function (delay) {
            return this.delayChanges('delay', delay, function (changes) {
                return changes.delay(delay);
            });
        };
        Property.prototype.debounce = function (delay) {
            return this.delayChanges('debounce', delay, function (changes) {
                return changes.debounce(delay);
            });
        };
        Property.prototype.throttle = function (delay) {
            return this.delayChanges('throttle', delay, function (changes) {
                return changes.throttle(delay);
            });
        };
        Property.prototype.delayChanges = function () {
            var desc, f, _i;
            desc = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), f = arguments[_i++];
            return withDescription.apply(null, [this].concat(__slice.call(desc), [addPropertyInitValueToStream(this, f(this.changes()))]));
        };
        Property.prototype.takeUntil = function (stopper) {
            var changes;
            changes = this.changes().takeUntil(stopper);
            return withDescription(this, 'takeUntil', stopper, addPropertyInitValueToStream(this, changes));
        };
        Property.prototype.startWith = function (value) {
            return withDescription(this, 'startWith', value, this.scan(value, function (prev, next) {
                return next;
            }));
        };
        return Property;
    }(Observable);
    convertArgsToFunction = function (obs, f, args, method) {
        var sampled;
        if (f instanceof Property) {
            sampled = f.sampledBy(obs, function (p, s) {
                return [
                    p,
                    s
                ];
            });
            return method.apply(sampled, [function (_arg) {
                    var p, s;
                    p = _arg[0], s = _arg[1];
                    return p;
                }]).map(function (_arg) {
                var p, s;
                p = _arg[0], s = _arg[1];
                return s;
            });
        } else {
            f = makeFunction(f, args);
            return method.apply(obs, [f]);
        }
    };
    addPropertyInitValueToStream = function (property, stream) {
        var justInitValue;
        justInitValue = new EventStream(describe(property, 'justInitValue'), function (sink) {
            var unsub, value;
            value = null;
            unsub = property.subscribe(function (event) {
                if (event.hasValue()) {
                    value = event;
                }
                return Bacon.noMore;
            });
            UpdateBarrier.whenDone(justInitValue, function () {
                if (value != null) {
                    sink(value);
                }
                return sink(end());
            });
            return unsub;
        });
        return justInitValue.concat(stream).toProperty();
    };
    Dispatcher = function () {
        function Dispatcher(subscribe, handleEvent) {
            var done, ended, prevError, pushIt, pushing, queue, removeSub, subscriptions, unsubscribeFromSource, waiters, _this = this;
            if (subscribe == null) {
                subscribe = function () {
                    return nop;
                };
            }
            subscriptions = [];
            queue = null;
            pushing = false;
            ended = false;
            this.hasSubscribers = function () {
                return subscriptions.length > 0;
            };
            prevError = null;
            unsubscribeFromSource = nop;
            removeSub = function (subscription) {
                return subscriptions = _.without(subscription, subscriptions);
            };
            waiters = null;
            done = function () {
                var w, ws, _i, _len, _results;
                if (waiters != null) {
                    ws = waiters;
                    waiters = null;
                    _results = [];
                    for (_i = 0, _len = ws.length; _i < _len; _i++) {
                        w = ws[_i];
                        _results.push(w());
                    }
                    return _results;
                }
            };
            pushIt = function (event) {
                var reply, sub, success, tmp, _i, _len;
                if (!pushing) {
                    if (event === prevError) {
                        return;
                    }
                    if (event.isError()) {
                        prevError = event;
                    }
                    success = false;
                    try {
                        pushing = true;
                        tmp = subscriptions;
                        for (_i = 0, _len = tmp.length; _i < _len; _i++) {
                            sub = tmp[_i];
                            reply = sub.sink(event);
                            if (reply === Bacon.noMore || event.isEnd()) {
                                removeSub(sub);
                            }
                        }
                        success = true;
                    } finally {
                        pushing = false;
                        if (!success) {
                            queue = null;
                        }
                    }
                    success = true;
                    while (queue != null ? queue.length : void 0) {
                        event = _.head(queue);
                        queue = _.tail(queue);
                        this.push(event);
                    }
                    done(event);
                    if (this.hasSubscribers()) {
                        return Bacon.more;
                    } else {
                        return Bacon.noMore;
                    }
                } else {
                    queue = (queue || []).concat([event]);
                    return Bacon.more;
                }
            };
            this.push = function (event) {
                return UpdateBarrier.inTransaction(event, _this, pushIt, [event]);
            };
            if (handleEvent == null) {
                handleEvent = function (event) {
                    return this.push(event);
                };
            }
            this.handleEvent = function (event) {
                if (event.isEnd()) {
                    ended = true;
                }
                return handleEvent.apply(_this, [event]);
            };
            this.subscribe = function (sink) {
                var subscription;
                if (ended) {
                    sink(end());
                    return nop;
                } else {
                    assertFunction(sink);
                    subscription = { sink: sink };
                    subscriptions = subscriptions.concat(subscription);
                    if (subscriptions.length === 1) {
                        unsubscribeFromSource = subscribe(_this.handleEvent);
                    }
                    assertFunction(unsubscribeFromSource);
                    return function () {
                        removeSub(subscription);
                        if (!_this.hasSubscribers()) {
                            return unsubscribeFromSource();
                        }
                    };
                }
            };
        }
        return Dispatcher;
    }();
    PropertyDispatcher = function (_super) {
        __extends(PropertyDispatcher, _super);
        function PropertyDispatcher(p, subscribe, handleEvent) {
            var current, currentValueRootId, ended, push, _this = this;
            PropertyDispatcher.__super__.constructor.call(this, subscribe, handleEvent);
            current = None;
            currentValueRootId = void 0;
            push = this.push;
            subscribe = this.subscribe;
            ended = false;
            this.push = function (event) {
                if (event.isEnd()) {
                    ended = true;
                }
                if (event.hasValue()) {
                    current = new Some(event);
                    currentValueRootId = UpdateBarrier.currentEventId();
                }
                return push.apply(_this, [event]);
            };
            this.subscribe = function (sink) {
                var dispatchingId, initSent, maybeSubSource, reply, valId;
                initSent = false;
                reply = Bacon.more;
                maybeSubSource = function () {
                    if (reply === Bacon.noMore) {
                        return nop;
                    } else if (ended) {
                        sink(end());
                        return nop;
                    } else {
                        return subscribe.apply(this, [sink]);
                    }
                };
                if (current.isDefined && (_this.hasSubscribers() || ended)) {
                    dispatchingId = UpdateBarrier.currentEventId();
                    valId = currentValueRootId;
                    if (!ended && valId && dispatchingId && dispatchingId !== valId) {
                        UpdateBarrier.whenDone(p, function () {
                            if (currentValueRootId === valId) {
                                return sink(initial(current.get().value()));
                            }
                        });
                        return maybeSubSource();
                    } else {
                        UpdateBarrier.inTransaction(void 0, _this, function () {
                            return reply = sink(initial(current.get().value()));
                        }, []);
                        return maybeSubSource();
                    }
                } else {
                    return maybeSubSource();
                }
            };
        }
        return PropertyDispatcher;
    }(Dispatcher);
    Bus = function (_super) {
        __extends(Bus, _super);
        function Bus() {
            var ended, guardedSink, sink, subscribeAll, subscribeInput, subscriptions, unsubAll, unsubscribeInput, _this = this;
            sink = void 0;
            subscriptions = [];
            ended = false;
            guardedSink = function (input) {
                return function (event) {
                    if (event.isEnd()) {
                        unsubscribeInput(input);
                        return Bacon.noMore;
                    } else {
                        return sink(event);
                    }
                };
            };
            unsubAll = function () {
                var sub, _i, _len, _results;
                _results = [];
                for (_i = 0, _len = subscriptions.length; _i < _len; _i++) {
                    sub = subscriptions[_i];
                    _results.push(typeof sub.unsub === 'function' ? sub.unsub() : void 0);
                }
                return _results;
            };
            subscribeInput = function (subscription) {
                return subscription.unsub = subscription.input.subscribe(guardedSink(subscription.input));
            };
            unsubscribeInput = function (input) {
                var i, sub, _i, _len;
                for (i = _i = 0, _len = subscriptions.length; _i < _len; i = ++_i) {
                    sub = subscriptions[i];
                    if (sub.input === input) {
                        if (typeof sub.unsub === 'function') {
                            sub.unsub();
                        }
                        subscriptions.splice(i, 1);
                        return;
                    }
                }
            };
            subscribeAll = function (newSink) {
                var subscription, _i, _len, _ref3;
                sink = newSink;
                _ref3 = cloneArray(subscriptions);
                for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
                    subscription = _ref3[_i];
                    subscribeInput(subscription);
                }
                return unsubAll;
            };
            Bus.__super__.constructor.call(this, describe(Bacon, 'Bus'), subscribeAll);
            this.plug = function (input) {
                var sub;
                if (ended) {
                    return;
                }
                sub = { input: input };
                subscriptions.push(sub);
                if (sink != null) {
                    subscribeInput(sub);
                }
                return function () {
                    return unsubscribeInput(input);
                };
            };
            this.push = function (value) {
                return typeof sink === 'function' ? sink(next(value)) : void 0;
            };
            this.error = function (error) {
                return typeof sink === 'function' ? sink(new Error(error)) : void 0;
            };
            this.end = function () {
                ended = true;
                unsubAll();
                return typeof sink === 'function' ? sink(end()) : void 0;
            };
        }
        return Bus;
    }(EventStream);
    Source = function () {
        function Source(obs, sync, consume, subscribe, lazy, queue) {
            var invoke;
            this.obs = obs;
            this.sync = sync;
            this.subscribe = subscribe;
            if (lazy == null) {
                lazy = false;
            }
            if (queue == null) {
                queue = [];
            }
            invoke = lazy ? _.id : function (f) {
                return f();
            };
            if (this.subscribe == null) {
                this.subscribe = obs.subscribe;
            }
            this.markEnded = function () {
                return this.ended = true;
            };
            this.toString = this.obs.toString;
            if (consume) {
                this.consume = function () {
                    return invoke(queue.shift());
                };
                this.push = function (x) {
                    return queue.push(x);
                };
                this.mayHave = function (c) {
                    return !this.ended || queue.length >= c;
                };
                this.hasAtLeast = function (c) {
                    return queue.length >= c;
                };
                this.flatten = false;
            } else {
                this.consume = function () {
                    return invoke(queue[0]);
                };
                this.push = function (x) {
                    return queue = [x];
                };
                this.mayHave = function () {
                    return true;
                };
                this.hasAtLeast = function () {
                    return queue.length;
                };
                this.flatten = true;
            }
        }
        return Source;
    }();
    BufferingSource = function (_super) {
        __extends(BufferingSource, _super);
        function BufferingSource(obs) {
            var queue;
            this.obs = obs;
            queue = [];
            BufferingSource.__super__.constructor.call(this, this.obs, true, false, this.obs.subscribe, false, queue);
            this.consume = function () {
                var values;
                values = queue;
                queue = [];
                return values;
            };
            this.push = function (x) {
                return queue.push(x());
            };
            this.hasAtLeast = function () {
                return true;
            };
        }
        return BufferingSource;
    }(Source);
    Source.fromObservable = function (s) {
        if (s instanceof Source) {
            return s;
        } else if (s instanceof Property) {
            return new Source(s, false, false);
        } else {
            return new Source(s, true, true);
        }
    };
    describe = function () {
        var args, context, method;
        context = arguments[0], method = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
        if ((context || method) instanceof Desc) {
            return context || method;
        } else {
            return new Desc(context, method, args);
        }
    };
    Desc = function () {
        function Desc(context, method, args) {
            var collectDeps, dependsOn, findDeps, flatDeps;
            findDeps = function (x) {
                if (isArray(x)) {
                    return _.flatMap(findDeps, x);
                } else if (isObservable(x)) {
                    return [x];
                } else if (x instanceof Source) {
                    return [x.obs];
                } else {
                    return [];
                }
            };
            flatDeps = null;
            collectDeps = function (o) {
                var deps;
                deps = o.internalDeps();
                return _.each(deps, function (i, dep) {
                    flatDeps[dep.id] = true;
                    return collectDeps(dep);
                });
            };
            dependsOn = function (b) {
                if (flatDeps == null) {
                    flatDeps = {};
                    collectDeps(this);
                }
                return flatDeps[b.id];
            };
            this.apply = function (obs) {
                var deps;
                deps = _.cached(function () {
                    return findDeps([context].concat(args));
                });
                obs.internalDeps = obs.internalDeps || deps;
                obs.dependsOn = dependsOn;
                obs.deps = deps;
                obs.toString = function () {
                    return _.toString(context) + '.' + _.toString(method) + '(' + _.map(_.toString, args) + ')';
                };
                obs.inspect = function () {
                    return obs.toString();
                };
                obs.desc = function () {
                    return {
                        context: context,
                        method: method,
                        args: args
                    };
                };
                return obs;
            };
        }
        return Desc;
    }();
    withDescription = function () {
        var desc, obs, _i;
        desc = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), obs = arguments[_i++];
        return describe.apply(null, desc).apply(obs);
    };
    Bacon.when = function () {
        var f, i, index, ix, len, needsBarrier, pat, patSources, pats, patterns, resultStream, s, sources, usage, _i, _j, _len, _len1, _ref3;
        patterns = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (patterns.length === 0) {
            return Bacon.never();
        }
        len = patterns.length;
        usage = 'when: expecting arguments in the form (Observable+,function)+';
        assert(usage, len % 2 === 0);
        sources = [];
        pats = [];
        i = 0;
        while (i < len) {
            patSources = _.toArray(patterns[i]);
            f = patterns[i + 1];
            pat = {
                f: isFunction(f) ? f : function () {
                    return f;
                },
                ixs: []
            };
            for (_i = 0, _len = patSources.length; _i < _len; _i++) {
                s = patSources[_i];
                assert(isObservable(s), usage);
                index = _.indexOf(sources, s);
                if (index < 0) {
                    sources.push(s);
                    index = sources.length - 1;
                }
                _ref3 = pat.ixs;
                for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
                    ix = _ref3[_j];
                    if (ix.index === index) {
                        ix.count++;
                    }
                }
                pat.ixs.push({
                    index: index,
                    count: 1
                });
            }
            if (patSources.length > 0) {
                pats.push(pat);
            }
            i = i + 2;
        }
        if (!sources.length) {
            return Bacon.never();
        }
        sources = _.map(Source.fromObservable, sources);
        needsBarrier = _.any(sources, function (s) {
            return s.flatten;
        }) && containsDuplicateDeps(_.map(function (s) {
            return s.obs;
        }, sources));
        return resultStream = new EventStream(describe.apply(null, [
            Bacon,
            'when'
        ].concat(__slice.call(patterns))), function (sink) {
            var cannotMatch, cannotSync, ends, match, nonFlattened, part, triggers;
            triggers = [];
            ends = false;
            match = function (p) {
                var _k, _len2, _ref4;
                _ref4 = p.ixs;
                for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) {
                    i = _ref4[_k];
                    if (!sources[i.index].hasAtLeast(i.count)) {
                        return false;
                    }
                }
                return true;
            };
            cannotSync = function (source) {
                return !source.sync || source.ended;
            };
            cannotMatch = function (p) {
                var _k, _len2, _ref4;
                _ref4 = p.ixs;
                for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) {
                    i = _ref4[_k];
                    if (!sources[i.index].mayHave(i.count)) {
                        return true;
                    }
                }
            };
            nonFlattened = function (trigger) {
                return !trigger.source.flatten;
            };
            part = function (source) {
                return function (unsubAll) {
                    var flush, flushLater, flushWhileTriggers;
                    flushLater = function () {
                        return UpdateBarrier.whenDone(resultStream, flush);
                    };
                    flushWhileTriggers = function () {
                        var p, reply, trigger, val, _k, _len2;
                        if (triggers.length > 0) {
                            reply = Bacon.more;
                            trigger = triggers.pop();
                            for (_k = 0, _len2 = pats.length; _k < _len2; _k++) {
                                p = pats[_k];
                                if (match(p)) {
                                    val = function () {
                                        return p.f.apply(p, function () {
                                            var _l, _len3, _ref4, _results;
                                            _ref4 = p.ixs;
                                            _results = [];
                                            for (_l = 0, _len3 = _ref4.length; _l < _len3; _l++) {
                                                i = _ref4[_l];
                                                _results.push(sources[i.index].consume());
                                            }
                                            return _results;
                                        }());
                                    };
                                    reply = sink(trigger.e.apply(val));
                                    if (triggers.length && needsBarrier) {
                                        triggers = _.filter(nonFlattened, triggers);
                                    }
                                    if (reply === Bacon.noMore) {
                                        return reply;
                                    } else {
                                        return flushWhileTriggers();
                                    }
                                }
                            }
                        } else {
                            return Bacon.more;
                        }
                    };
                    flush = function () {
                        var reply;
                        reply = flushWhileTriggers();
                        if (ends) {
                            ends = false;
                            if (_.all(sources, cannotSync) || _.all(pats, cannotMatch)) {
                                reply = Bacon.noMore;
                                sink(end());
                            }
                        }
                        if (reply === Bacon.noMore) {
                            unsubAll();
                        }
                        return reply;
                    };
                    return source.subscribe(function (e) {
                        var reply;
                        if (e.isEnd()) {
                            ends = true;
                            source.markEnded();
                            flushLater();
                        } else if (e.isError()) {
                            reply = sink(e);
                        } else {
                            source.push(e.value);
                            if (source.sync) {
                                triggers.push({
                                    source: source,
                                    e: e
                                });
                                if (needsBarrier) {
                                    flushLater();
                                } else {
                                    flush();
                                }
                            }
                        }
                        if (reply === Bacon.noMore) {
                            unsubAll();
                        }
                        return reply || Bacon.more;
                    });
                };
            };
            return compositeUnsubscribe.apply(null, function () {
                var _k, _len2, _results;
                _results = [];
                for (_k = 0, _len2 = sources.length; _k < _len2; _k++) {
                    s = sources[_k];
                    _results.push(part(s));
                }
                return _results;
            }());
        });
    };
    containsDuplicateDeps = function (observables, state) {
        var checkObservable;
        if (state == null) {
            state = [];
        }
        checkObservable = function (obs) {
            var deps;
            if (Bacon._.contains(state, obs)) {
                return true;
            } else {
                deps = obs.internalDeps();
                if (deps.length) {
                    state.push(obs);
                    return Bacon._.any(deps, checkObservable);
                } else {
                    state.push(obs);
                    return false;
                }
            }
        };
        return Bacon._.any(observables, checkObservable);
    };
    Bacon.update = function () {
        var i, initial, lateBindFirst, patterns;
        initial = arguments[0], patterns = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        lateBindFirst = function (f) {
            return function () {
                var args;
                args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                return function (i) {
                    return f.apply(null, [i].concat(args));
                };
            };
        };
        i = patterns.length - 1;
        while (i > 0) {
            if (!(patterns[i] instanceof Function)) {
                patterns[i] = function (x) {
                    return function () {
                        return x;
                    };
                }(patterns[i]);
            }
            patterns[i] = lateBindFirst(patterns[i]);
            i = i - 2;
        }
        return withDescription.apply(null, [
            Bacon,
            'update',
            initial
        ].concat(__slice.call(patterns), [Bacon.when.apply(Bacon, patterns).scan(initial, function (x, f) {
                return f(x);
            })]));
    };
    compositeUnsubscribe = function () {
        var ss;
        ss = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return new CompositeUnsubscribe(ss).unsubscribe;
    };
    CompositeUnsubscribe = function () {
        function CompositeUnsubscribe(ss) {
            var s, _i, _len;
            if (ss == null) {
                ss = [];
            }
            this.empty = __bind(this.empty, this);
            this.count = __bind(this.count, this);
            this.unsubscribe = __bind(this.unsubscribe, this);
            this.add = __bind(this.add, this);
            this.unsubscribed = false;
            this.subscriptions = [];
            this.starting = [];
            for (_i = 0, _len = ss.length; _i < _len; _i++) {
                s = ss[_i];
                this.add(s);
            }
        }
        CompositeUnsubscribe.prototype.add = function (subscription) {
            var ended, unsub, unsubMe, _this = this;
            if (this.unsubscribed) {
                return;
            }
            ended = false;
            unsub = nop;
            this.starting.push(subscription);
            unsubMe = function () {
                if (_this.unsubscribed) {
                    return;
                }
                ended = true;
                _this.remove(unsub);
                return _.remove(subscription, _this.starting);
            };
            unsub = subscription(this.unsubscribe, unsubMe);
            if (!(this.unsubscribed || ended)) {
                this.subscriptions.push(unsub);
            }
            _.remove(subscription, this.starting);
            return unsub;
        };
        CompositeUnsubscribe.prototype.remove = function (unsub) {
            if (this.unsubscribed) {
                return;
            }
            if (_.remove(unsub, this.subscriptions) !== void 0) {
                return unsub();
            }
        };
        CompositeUnsubscribe.prototype.unsubscribe = function () {
            var s, _i, _len, _ref3;
            if (this.unsubscribed) {
                return;
            }
            this.unsubscribed = true;
            _ref3 = this.subscriptions;
            for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
                s = _ref3[_i];
                s();
            }
            this.subscriptions = [];
            return this.starting = [];
        };
        CompositeUnsubscribe.prototype.count = function () {
            if (this.unsubscribed) {
                return 0;
            }
            return this.subscriptions.length + this.starting.length;
        };
        CompositeUnsubscribe.prototype.empty = function () {
            return this.count() === 0;
        };
        return CompositeUnsubscribe;
    }();
    Bacon.CompositeUnsubscribe = CompositeUnsubscribe;
    Some = function () {
        function Some(value) {
            this.value = value;
        }
        Some.prototype.getOrElse = function () {
            return this.value;
        };
        Some.prototype.get = function () {
            return this.value;
        };
        Some.prototype.filter = function (f) {
            if (f(this.value)) {
                return new Some(this.value);
            } else {
                return None;
            }
        };
        Some.prototype.map = function (f) {
            return new Some(f(this.value));
        };
        Some.prototype.forEach = function (f) {
            return f(this.value);
        };
        Some.prototype.isDefined = true;
        Some.prototype.toArray = function () {
            return [this.value];
        };
        Some.prototype.inspect = function () {
            return 'Some(' + this.value + ')';
        };
        Some.prototype.toString = function () {
            return this.inspect();
        };
        return Some;
    }();
    None = {
        getOrElse: function (value) {
            return value;
        },
        filter: function () {
            return None;
        },
        map: function () {
            return None;
        },
        forEach: function () {
        },
        isDefined: false,
        toArray: function () {
            return [];
        },
        inspect: function () {
            return 'None';
        },
        toString: function () {
            return this.inspect();
        }
    };
    UpdateBarrier = function () {
        var currentEventId, findIndependent, flush, inTransaction, independent, rootEvent, waiters, whenDone;
        rootEvent = void 0;
        waiters = [];
        independent = function (waiter) {
            return !_.any(waiters, function (other) {
                return waiter.obs.dependsOn(other.obs);
            });
        };
        whenDone = function (obs, f) {
            if (rootEvent) {
                return waiters.push({
                    obs: obs,
                    f: f
                });
            } else {
                return f();
            }
        };
        findIndependent = function () {
            while (!independent(waiters[0])) {
                waiters.push(waiters.splice(0, 1)[0]);
            }
            return waiters.splice(0, 1)[0];
        };
        flush = function () {
            if (waiters.length) {
                findIndependent().f();
                return flush();
            }
        };
        inTransaction = function (event, context, f, args) {
            var result;
            if (rootEvent) {
                return f.apply(context, args);
            } else {
                rootEvent = event;
                try {
                    result = f.apply(context, args);
                    flush();
                } finally {
                    rootEvent = void 0;
                }
                return result;
            }
        };
        currentEventId = function () {
            if (rootEvent) {
                return rootEvent.id;
            } else {
                return void 0;
            }
        };
        return {
            whenDone: whenDone,
            inTransaction: inTransaction,
            currentEventId: currentEventId
        };
    }();
    Bacon.EventStream = EventStream;
    Bacon.Property = Property;
    Bacon.Observable = Observable;
    Bacon.Bus = Bus;
    Bacon.Initial = Initial;
    Bacon.Next = Next;
    Bacon.End = End;
    Bacon.Error = Error;
    nop = function () {
    };
    latterF = function (_, x) {
        return x();
    };
    former = function (x, _) {
        return x;
    };
    initial = function (value) {
        return new Initial(_.always(value));
    };
    next = function (value) {
        return new Next(_.always(value));
    };
    end = function () {
        return new End();
    };
    toEvent = function (x) {
        if (x instanceof Event) {
            return x;
        } else {
            return next(x);
        }
    };
    cloneArray = function (xs) {
        return xs.slice(0);
    };
    assert = function (message, condition) {
        if (!condition) {
            throw message;
        }
    };
    assertEventStream = function (event) {
        if (!(event instanceof EventStream)) {
            throw 'not an EventStream : ' + event;
        }
    };
    assertFunction = function (f) {
        return assert('not a function : ' + f, isFunction(f));
    };
    isFunction = function (f) {
        return typeof f === 'function';
    };
    isArray = function (xs) {
        return xs instanceof Array;
    };
    isObservable = function (x) {
        return x instanceof Observable;
    };
    assertArray = function (xs) {
        if (!isArray(xs)) {
            throw 'not an array : ' + xs;
        }
    };
    assertNoArguments = function (args) {
        return assert('no arguments supported', args.length === 0);
    };
    assertString = function (x) {
        if (typeof x !== 'string') {
            throw 'not a string : ' + x;
        }
    };
    partiallyApplied = function (f, applied) {
        return function () {
            var args;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return f.apply(null, applied.concat(args));
        };
    };
    makeSpawner = function (f) {
        if (isObservable(f)) {
            f = _.always(f);
        }
        assertFunction(f);
        return f;
    };
    makeFunctionArgs = function (args) {
        args = Array.prototype.slice.call(args);
        return makeFunction_.apply(null, args);
    };
    makeFunction_ = withMethodCallSupport(function () {
        var args, f;
        f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (isFunction(f)) {
            if (args.length) {
                return partiallyApplied(f, args);
            } else {
                return f;
            }
        } else if (isFieldKey(f)) {
            return toFieldExtractor(f, args);
        } else {
            return _.always(f);
        }
    });
    makeFunction = function (f, args) {
        return makeFunction_.apply(null, [f].concat(__slice.call(args)));
    };
    isFieldKey = function (f) {
        return typeof f === 'string' && f.length > 1 && f.charAt(0) === '.';
    };
    Bacon.isFieldKey = isFieldKey;
    toFieldExtractor = function (f, args) {
        var partFuncs, parts;
        parts = f.slice(1).split('.');
        partFuncs = _.map(toSimpleExtractor(args), parts);
        return function (value) {
            var _i, _len;
            for (_i = 0, _len = partFuncs.length; _i < _len; _i++) {
                f = partFuncs[_i];
                value = f(value);
            }
            return value;
        };
    };
    toSimpleExtractor = function (args) {
        return function (key) {
            return function (value) {
                var fieldValue;
                if (value == null) {
                    return void 0;
                } else {
                    fieldValue = value[key];
                    if (isFunction(fieldValue)) {
                        return fieldValue.apply(value, args);
                    } else {
                        return fieldValue;
                    }
                }
            };
        };
    };
    toFieldKey = function (f) {
        return f.slice(1);
    };
    toCombinator = function (f) {
        var key;
        if (isFunction(f)) {
            return f;
        } else if (isFieldKey(f)) {
            key = toFieldKey(f);
            return function (left, right) {
                return left[key](right);
            };
        } else {
            return assert('not a function or a field key: ' + f, false);
        }
    };
    toOption = function (v) {
        if (v instanceof Some || v === None) {
            return v;
        } else {
            return new Some(v);
        }
    };
    _ = {
        indexOf: Array.prototype.indexOf ? function (xs, x) {
            return xs.indexOf(x);
        } : function (xs, x) {
            var i, y, _i, _len;
            for (i = _i = 0, _len = xs.length; _i < _len; i = ++_i) {
                y = xs[i];
                if (x === y) {
                    return i;
                }
            }
            return -1;
        },
        indexWhere: function (xs, f) {
            var i, y, _i, _len;
            for (i = _i = 0, _len = xs.length; _i < _len; i = ++_i) {
                y = xs[i];
                if (f(y)) {
                    return i;
                }
            }
            return -1;
        },
        head: function (xs) {
            return xs[0];
        },
        always: function (x) {
            return function () {
                return x;
            };
        },
        negate: function (f) {
            return function (x) {
                return !f(x);
            };
        },
        empty: function (xs) {
            return xs.length === 0;
        },
        tail: function (xs) {
            return xs.slice(1, xs.length);
        },
        filter: function (f, xs) {
            var filtered, x, _i, _len;
            filtered = [];
            for (_i = 0, _len = xs.length; _i < _len; _i++) {
                x = xs[_i];
                if (f(x)) {
                    filtered.push(x);
                }
            }
            return filtered;
        },
        map: function (f, xs) {
            var x, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = xs.length; _i < _len; _i++) {
                x = xs[_i];
                _results.push(f(x));
            }
            return _results;
        },
        each: function (xs, f) {
            var key, value, _results;
            _results = [];
            for (key in xs) {
                value = xs[key];
                _results.push(f(key, value));
            }
            return _results;
        },
        toArray: function (xs) {
            if (isArray(xs)) {
                return xs;
            } else {
                return [xs];
            }
        },
        contains: function (xs, x) {
            return _.indexOf(xs, x) !== -1;
        },
        id: function (x) {
            return x;
        },
        last: function (xs) {
            return xs[xs.length - 1];
        },
        all: function (xs, f) {
            var x, _i, _len;
            if (f == null) {
                f = _.id;
            }
            for (_i = 0, _len = xs.length; _i < _len; _i++) {
                x = xs[_i];
                if (!f(x)) {
                    return false;
                }
            }
            return true;
        },
        any: function (xs, f) {
            var x, _i, _len;
            if (f == null) {
                f = _.id;
            }
            for (_i = 0, _len = xs.length; _i < _len; _i++) {
                x = xs[_i];
                if (f(x)) {
                    return true;
                }
            }
            return false;
        },
        without: function (x, xs) {
            return _.filter(function (y) {
                return y !== x;
            }, xs);
        },
        remove: function (x, xs) {
            var i;
            i = _.indexOf(xs, x);
            if (i >= 0) {
                return xs.splice(i, 1);
            }
        },
        fold: function (xs, seed, f) {
            var x, _i, _len;
            for (_i = 0, _len = xs.length; _i < _len; _i++) {
                x = xs[_i];
                seed = f(seed, x);
            }
            return seed;
        },
        flatMap: function (f, xs) {
            return _.fold(xs, [], function (ys, x) {
                return ys.concat(f(x));
            });
        },
        cached: function (f) {
            var value;
            value = None;
            return function () {
                if (value === None) {
                    value = f();
                    f = null;
                }
                return value;
            };
        },
        toString: function (obj) {
            var key, value;
            try {
                recursionDepth++;
                if (obj == null) {
                    return 'undefined';
                } else if (isFunction(obj)) {
                    return 'function';
                } else if (isArray(obj)) {
                    if (recursionDepth > 5) {
                        return '[..]';
                    }
                    return '[' + _.map(_.toString, obj).toString() + ']';
                } else if ((obj != null ? obj.toString : void 0) != null && obj.toString !== Object.prototype.toString) {
                    return obj.toString();
                } else if (typeof obj === 'object') {
                    if (recursionDepth > 5) {
                        return '{..}';
                    }
                    return '{' + function () {
                        var _results;
                        _results = [];
                        for (key in obj) {
                            value = obj[key];
                            _results.push(_.toString(key) + ':' + _.toString(value));
                        }
                        return _results;
                    }() + '}';
                } else {
                    return obj;
                }
            } finally {
                recursionDepth--;
            }
        }
    };
    recursionDepth = 0;
    Bacon._ = _;
    Bacon.scheduler = {
        setTimeout: function (f, d) {
            return setTimeout(f, d);
        },
        setInterval: function (f, i) {
            return setInterval(f, i);
        },
        clearInterval: function (id) {
            return clearInterval(id);
        },
        now: function () {
            return new Date().getTime();
        }
    };
    if (typeof module !== 'undefined' && module !== null) {
        module.exports = Bacon;
        Bacon.Bacon = Bacon;
    } else {
        if (typeof define !== 'undefined' && define !== null && define.amd != null) {
            define([], function () {
                return Bacon;
            });
        }
        this.Bacon = Bacon;
    }
}.call(this));
});
require.define('23', function(module, exports, __dirname, __filename, undefined){
var TAFFY, exports, T;
(function () {
    'use strict';
    var typeList, makeTest, idx, typeKey, version, TC, idpad, cmax, API, protectJSON, each, eachin, isIndexable, returnFilter, runFilters, numcharsplit, orderByCol, run, intersection, filter, makeCid, safeForJson, isRegexp;
    ;
    if (!TAFFY) {
        version = '2.7';
        TC = 1;
        idpad = '000000';
        cmax = 1000;
        API = {};
        protectJSON = function (t) {
            if (TAFFY.isArray(t) || TAFFY.isObject(t)) {
                return t;
            } else {
                return JSON.parse(t);
            }
        };
        intersection = function (array1, array2) {
            return filter(array1, function (item) {
                return array2.indexOf(item) >= 0;
            });
        };
        filter = function (obj, iterator, context) {
            var results = [];
            if (obj == null)
                return results;
            if (Array.prototype.filter && obj.filter === Array.prototype.filter)
                return obj.filter(iterator, context);
            each(obj, function (value, index, list) {
                if (iterator.call(context, value, index, list))
                    results[results.length] = value;
            });
            return results;
        };
        isRegexp = function (aObj) {
            return Object.prototype.toString.call(aObj) === '[object RegExp]';
        };
        safeForJson = function (aObj) {
            var myResult = T.isArray(aObj) ? [] : T.isObject(aObj) ? {} : null;
            if (aObj === null)
                return aObj;
            for (var i in aObj) {
                myResult[i] = isRegexp(aObj[i]) ? aObj[i].toString() : T.isArray(aObj[i]) || T.isObject(aObj[i]) ? safeForJson(aObj[i]) : aObj[i];
            }
            return myResult;
        };
        makeCid = function (aContext) {
            var myCid = JSON.stringify(aContext);
            if (myCid.match(/regex/) === null)
                return myCid;
            return JSON.stringify(safeForJson(aContext));
        };
        each = function (a, fun, u) {
            var r, i, x, y;
            if (a && (T.isArray(a) && a.length === 1 || !T.isArray(a))) {
                fun(T.isArray(a) ? a[0] : a, 0);
            } else {
                for (r, i, x = 0, a = T.isArray(a) ? a : [a], y = a.length; x < y; x++) {
                    i = a[x];
                    if (!T.isUndefined(i) || (u || false)) {
                        r = fun(i, x);
                        if (r === T.EXIT) {
                            break;
                        }
                    }
                }
            }
        };
        eachin = function (o, fun) {
            var x = 0, r, i;
            for (i in o) {
                if (o.hasOwnProperty(i)) {
                    r = fun(o[i], i, x++);
                    if (r === T.EXIT) {
                        break;
                    }
                }
            }
        };
        API.extend = function (m, f) {
            API[m] = function () {
                return f.apply(this, arguments);
            };
        };
        isIndexable = function (f) {
            var i;
            if (T.isString(f) && /[t][0-9]*[r][0-9]*/i.test(f)) {
                return true;
            }
            if (T.isObject(f) && f.___id && f.___s) {
                return true;
            }
            if (T.isArray(f)) {
                i = true;
                each(f, function (r) {
                    if (!isIndexable(r)) {
                        i = false;
                        return TAFFY.EXIT;
                    }
                });
                return i;
            }
            return false;
        };
        runFilters = function (r, filter) {
            var match = true;
            each(filter, function (mf) {
                switch (T.typeOf(mf)) {
                case 'function':
                    if (!mf.apply(r)) {
                        match = false;
                        return TAFFY.EXIT;
                    }
                    break;
                case 'array':
                    match = mf.length === 1 ? runFilters(r, mf[0]) : mf.length === 2 ? runFilters(r, mf[0]) || runFilters(r, mf[1]) : mf.length === 3 ? runFilters(r, mf[0]) || runFilters(r, mf[1]) || runFilters(r, mf[2]) : mf.length === 4 ? runFilters(r, mf[0]) || runFilters(r, mf[1]) || runFilters(r, mf[2]) || runFilters(r, mf[3]) : false;
                    if (mf.length > 4) {
                        each(mf, function (f) {
                            if (runFilters(r, f)) {
                                match = true;
                            }
                        });
                    }
                    break;
                }
            });
            return match;
        };
        returnFilter = function (f) {
            var nf = [];
            if (T.isString(f) && /[t][0-9]*[r][0-9]*/i.test(f)) {
                f = { ___id: f };
            }
            if (T.isArray(f)) {
                each(f, function (r) {
                    nf.push(returnFilter(r));
                });
                f = function () {
                    var that = this, match = false;
                    each(nf, function (f) {
                        if (runFilters(that, f)) {
                            match = true;
                        }
                    });
                    return match;
                };
                return f;
            }
            if (T.isObject(f)) {
                if (T.isObject(f) && f.___id && f.___s) {
                    f = { ___id: f.___id };
                }
                eachin(f, function (v, i) {
                    if (!T.isObject(v)) {
                        v = { 'is': v };
                    }
                    eachin(v, function (mtest, s) {
                        var c = [], looper;
                        looper = s === 'hasAll' ? function (mtest, func) {
                            func(mtest);
                        } : each;
                        looper(mtest, function (mtest) {
                            var su = true, f = false, matchFunc;
                            matchFunc = function () {
                                var mvalue = this[i], eqeq = '==', bangeq = '!=', eqeqeq = '===', lt = '<', gt = '>', lteq = '<=', gteq = '>=', bangeqeq = '!==', r;
                                ;
                                if (typeof mvalue === 'undefined') {
                                    return false;
                                }
                                if (s.indexOf('!') === 0 && s !== bangeq && s !== bangeqeq) {
                                    su = false;
                                    s = s.substring(1, s.length);
                                }
                                r = s === 'regex' ? mtest.test(mvalue) : s === 'lt' || s === lt ? mvalue < mtest : s === 'gt' || s === gt ? mvalue > mtest : s === 'lte' || s === lteq ? mvalue <= mtest : s === 'gte' || s === gteq ? mvalue >= mtest : s === 'left' ? mvalue.indexOf(mtest) === 0 : s === 'leftnocase' ? mvalue.toLowerCase().indexOf(mtest.toLowerCase()) === 0 : s === 'right' ? mvalue.substring(mvalue.length - mtest.length) === mtest : s === 'rightnocase' ? mvalue.toLowerCase().substring(mvalue.length - mtest.length) === mtest.toLowerCase() : s === 'like' ? mvalue.indexOf(mtest) >= 0 : s === 'likenocase' ? mvalue.toLowerCase().indexOf(mtest.toLowerCase()) >= 0 : s === eqeqeq || s === 'is' ? mvalue === mtest : s === eqeq ? mvalue == mtest : s === bangeqeq ? mvalue !== mtest : s === bangeq ? mvalue != mtest : s === 'isnocase' ? mvalue.toLowerCase ? mvalue.toLowerCase() === mtest.toLowerCase() : mvalue === mtest : s === 'has' ? T.has(mvalue, mtest) : s === 'hasall' ? T.hasAll(mvalue, mtest) : s === 'contains' ? TAFFY.isArray(mvalue) && mvalue.indexOf(mtest) > -1 : s.indexOf('is') === -1 && !TAFFY.isNull(mvalue) && !TAFFY.isUndefined(mvalue) && !TAFFY.isObject(mtest) && !TAFFY.isArray(mtest) ? mtest === mvalue[s] : T[s] && T.isFunction(T[s]) && s.indexOf('is') === 0 ? T[s](mvalue) === mtest : T[s] && T.isFunction(T[s]) ? T[s](mvalue, mtest) : false;
                                r = r && !su ? false : !r && !su ? true : r;
                                return r;
                            };
                            c.push(matchFunc);
                        });
                        if (c.length === 1) {
                            nf.push(c[0]);
                        } else {
                            nf.push(function () {
                                var that = this, match = false;
                                each(c, function (f) {
                                    if (f.apply(that)) {
                                        match = true;
                                    }
                                });
                                return match;
                            });
                        }
                    });
                });
                f = function () {
                    var that = this, match = true;
                    match = nf.length === 1 && !nf[0].apply(that) ? false : nf.length === 2 && (!nf[0].apply(that) || !nf[1].apply(that)) ? false : nf.length === 3 && (!nf[0].apply(that) || !nf[1].apply(that) || !nf[2].apply(that)) ? false : nf.length === 4 && (!nf[0].apply(that) || !nf[1].apply(that) || !nf[2].apply(that) || !nf[3].apply(that)) ? false : true;
                    if (nf.length > 4) {
                        each(nf, function (f) {
                            if (!runFilters(that, f)) {
                                match = false;
                            }
                        });
                    }
                    return match;
                };
                return f;
            }
            if (T.isFunction(f)) {
                return f;
            }
        };
        orderByCol = function (ar, o) {
            var sortFunc = function (a, b) {
                var r = 0;
                T.each(o, function (sd) {
                    var o, col, dir, c, d;
                    o = sd.split(' ');
                    col = o[0];
                    dir = o.length === 1 ? 'logical' : o[1];
                    if (dir === 'logical') {
                        c = numcharsplit(a[col]);
                        d = numcharsplit(b[col]);
                        T.each(c.length <= d.length ? c : d, function (x, i) {
                            if (c[i] < d[i]) {
                                r = -1;
                                return TAFFY.EXIT;
                            } else if (c[i] > d[i]) {
                                r = 1;
                                return TAFFY.EXIT;
                            }
                        });
                    } else if (dir === 'logicaldesc') {
                        c = numcharsplit(a[col]);
                        d = numcharsplit(b[col]);
                        T.each(c.length <= d.length ? c : d, function (x, i) {
                            if (c[i] > d[i]) {
                                r = -1;
                                return TAFFY.EXIT;
                            } else if (c[i] < d[i]) {
                                r = 1;
                                return TAFFY.EXIT;
                            }
                        });
                    } else if (dir === 'asec' && a[col] < b[col]) {
                        r = -1;
                        return T.EXIT;
                    } else if (dir === 'asec' && a[col] > b[col]) {
                        r = 1;
                        return T.EXIT;
                    } else if (dir === 'desc' && a[col] > b[col]) {
                        r = -1;
                        return T.EXIT;
                    } else if (dir === 'desc' && a[col] < b[col]) {
                        r = 1;
                        return T.EXIT;
                    }
                    if (r === 0 && dir === 'logical' && c.length < d.length) {
                        r = -1;
                    } else if (r === 0 && dir === 'logical' && c.length > d.length) {
                        r = 1;
                    } else if (r === 0 && dir === 'logicaldesc' && c.length > d.length) {
                        r = -1;
                    } else if (r === 0 && dir === 'logicaldesc' && c.length < d.length) {
                        r = 1;
                    }
                    if (r !== 0) {
                        return T.EXIT;
                    }
                });
                return r;
            };
            return ar && ar.push ? ar.sort(sortFunc) : ar;
        };
        (function () {
            var cache = {}, cachcounter = 0;
            numcharsplit = function (thing) {
                if (cachcounter > cmax) {
                    cache = {};
                    cachcounter = 0;
                }
                return cache['_' + thing] || function () {
                    var nthing = String(thing), na = [], rv = '_', rt = '', x, xx, c;
                    for (x = 0, xx = nthing.length; x < xx; x++) {
                        c = nthing.charCodeAt(x);
                        if (c >= 48 && c <= 57 || c === 46) {
                            if (rt !== 'n') {
                                rt = 'n';
                                na.push(rv.toLowerCase());
                                rv = '';
                            }
                            rv = rv + nthing.charAt(x);
                        } else {
                            if (rt !== 's') {
                                rt = 's';
                                na.push(parseFloat(rv));
                                rv = '';
                            }
                            rv = rv + nthing.charAt(x);
                        }
                    }
                    na.push(rt === 'n' ? parseFloat(rv) : rv.toLowerCase());
                    na.shift();
                    cache['_' + thing] = na;
                    cachcounter++;
                    return na;
                }();
            };
        }());
        run = function () {
            this.context({ results: this.getDBI().query(this.context()) });
        };
        API.extend('filter', function () {
            var nc = TAFFY.mergeObj(this.context(), { run: null }), nq = [];
            ;
            each(nc.q, function (v) {
                nq.push(v);
            });
            nc.q = nq;
            each(arguments, function (f) {
                nc.q.push(returnFilter(f));
                nc.filterRaw.push(f);
            });
            return this.getroot(nc);
        });
        API.extend('order', function (o) {
            o = o.split(',');
            var x = [], nc;
            each(o, function (r) {
                x.push(r.replace(/^\s*/, '').replace(/\s*$/, ''));
            });
            nc = TAFFY.mergeObj(this.context(), { sort: null });
            nc.order = x;
            return this.getroot(nc);
        });
        API.extend('limit', function (n) {
            var nc = TAFFY.mergeObj(this.context(), {}), limitedresults;
            ;
            nc.limit = n;
            if (nc.run && nc.sort) {
                limitedresults = [];
                each(nc.results, function (i, x) {
                    if (x + 1 > n) {
                        return TAFFY.EXIT;
                    }
                    limitedresults.push(i);
                });
                nc.results = limitedresults;
            }
            return this.getroot(nc);
        });
        API.extend('start', function (n) {
            var nc = TAFFY.mergeObj(this.context(), {}), limitedresults;
            ;
            nc.start = n;
            if (nc.run && nc.sort && !nc.limit) {
                limitedresults = [];
                each(nc.results, function (i, x) {
                    if (x + 1 > n) {
                        limitedresults.push(i);
                    }
                });
                nc.results = limitedresults;
            } else {
                nc = TAFFY.mergeObj(this.context(), {
                    run: null,
                    start: n
                });
            }
            return this.getroot(nc);
        });
        API.extend('update', function (arg0, arg1, arg2) {
            var runEvent = true, o = {}, args = arguments, that;
            if (TAFFY.isString(arg0) && (arguments.length === 2 || arguments.length === 3)) {
                o[arg0] = arg1;
                if (arguments.length === 3) {
                    runEvent = arg2;
                }
            } else {
                o = arg0;
                if (args.length === 2) {
                    runEvent = arg1;
                }
            }
            that = this;
            run.call(this);
            each(this.context().results, function (r) {
                var c = o;
                if (TAFFY.isFunction(c)) {
                    c = c.apply(TAFFY.mergeObj(r, {}));
                } else {
                    if (T.isFunction(c)) {
                        c = c(TAFFY.mergeObj(r, {}));
                    }
                }
                if (TAFFY.isObject(c)) {
                    that.getDBI().update(r.___id, c, runEvent);
                }
            });
            if (this.context().results.length) {
                this.context({ run: null });
            }
            return this;
        });
        API.extend('remove', function (runEvent) {
            var that = this, c = 0;
            run.call(this);
            each(this.context().results, function (r) {
                that.getDBI().remove(r.___id);
                c++;
            });
            if (this.context().results.length) {
                this.context({ run: null });
                that.getDBI().removeCommit(runEvent);
            }
            return c;
        });
        API.extend('count', function () {
            run.call(this);
            return this.context().results.length;
        });
        API.extend('callback', function (f, delay) {
            if (f) {
                var that = this;
                setTimeout(function () {
                    run.call(that);
                    f.call(that.getroot(that.context()));
                }, delay || 0);
            }
            return null;
        });
        API.extend('get', function () {
            run.call(this);
            return this.context().results;
        });
        API.extend('stringify', function () {
            return JSON.stringify(this.get());
        });
        API.extend('first', function () {
            run.call(this);
            return this.context().results[0] || false;
        });
        API.extend('last', function () {
            run.call(this);
            return this.context().results[this.context().results.length - 1] || false;
        });
        API.extend('sum', function () {
            var total = 0, that = this;
            run.call(that);
            each(arguments, function (c) {
                each(that.context().results, function (r) {
                    total = total + (r[c] || 0);
                });
            });
            return total;
        });
        API.extend('min', function (c) {
            var lowest = null;
            run.call(this);
            each(this.context().results, function (r) {
                if (lowest === null || r[c] < lowest) {
                    lowest = r[c];
                }
            });
            return lowest;
        });
        (function () {
            var innerJoinFunction = function () {
                    var fnCompareList, fnCombineRow, fnMain;
                    fnCompareList = function (left_row, right_row, arg_list) {
                        var data_lt, data_rt, op_code, error;
                        if (arg_list.length === 2) {
                            data_lt = left_row[arg_list[0]];
                            op_code = '===';
                            data_rt = right_row[arg_list[1]];
                        } else {
                            data_lt = left_row[arg_list[0]];
                            op_code = arg_list[1];
                            data_rt = right_row[arg_list[2]];
                        }
                        switch (op_code) {
                        case '===':
                            return data_lt === data_rt;
                        case '!==':
                            return data_lt !== data_rt;
                        case '<':
                            return data_lt < data_rt;
                        case '>':
                            return data_lt > data_rt;
                        case '<=':
                            return data_lt <= data_rt;
                        case '>=':
                            return data_lt >= data_rt;
                        case '==':
                            return data_lt == data_rt;
                        case '!=':
                            return data_lt != data_rt;
                        default:
                            throw String(op_code) + ' is not supported';
                        }
                    };
                    fnCombineRow = function (left_row, right_row) {
                        var out_map = {}, i, prefix;
                        for (i in left_row) {
                            if (left_row.hasOwnProperty(i)) {
                                out_map[i] = left_row[i];
                            }
                        }
                        for (i in right_row) {
                            if (right_row.hasOwnProperty(i) && i !== '___id' && i !== '___s') {
                                prefix = !TAFFY.isUndefined(out_map[i]) ? 'right_' : '';
                                out_map[prefix + String(i)] = right_row[i];
                            }
                        }
                        return out_map;
                    };
                    fnMain = function (table) {
                        var right_table, i, arg_list = arguments, arg_length = arg_list.length, result_list = [];
                        ;
                        if (typeof table.filter !== 'function') {
                            if (table.TAFFY) {
                                right_table = table();
                            } else {
                                throw 'TAFFY DB or result not supplied';
                            }
                        } else {
                            right_table = table;
                        }
                        this.context({ results: this.getDBI().query(this.context()) });
                        TAFFY.each(this.context().results, function (left_row) {
                            right_table.each(function (right_row) {
                                var arg_data, is_ok = true;
                                CONDITION:
                                    for (i = 1; i < arg_length; i++) {
                                        arg_data = arg_list[i];
                                        if (typeof arg_data === 'function') {
                                            is_ok = arg_data(left_row, right_row);
                                        } else if (typeof arg_data === 'object' && arg_data.length) {
                                            is_ok = fnCompareList(left_row, right_row, arg_data);
                                        } else {
                                            is_ok = false;
                                        }
                                        if (!is_ok) {
                                            break CONDITION;
                                        }
                                    }
                                if (is_ok) {
                                    result_list.push(fnCombineRow(left_row, right_row));
                                }
                            });
                        });
                        return TAFFY(result_list)();
                    };
                    return fnMain;
                }();
            API.extend('join', innerJoinFunction);
        }());
        API.extend('max', function (c) {
            var highest = null;
            run.call(this);
            each(this.context().results, function (r) {
                if (highest === null || r[c] > highest) {
                    highest = r[c];
                }
            });
            return highest;
        });
        API.extend('select', function () {
            var ra = [], args = arguments;
            run.call(this);
            if (arguments.length === 1) {
                each(this.context().results, function (r) {
                    ra.push(r[args[0]]);
                });
            } else {
                each(this.context().results, function (r) {
                    var row = [];
                    each(args, function (c) {
                        row.push(r[c]);
                    });
                    ra.push(row);
                });
            }
            return ra;
        });
        API.extend('distinct', function () {
            var ra = [], args = arguments;
            run.call(this);
            if (arguments.length === 1) {
                each(this.context().results, function (r) {
                    var v = r[args[0]], dup = false;
                    each(ra, function (d) {
                        if (v === d) {
                            dup = true;
                            return TAFFY.EXIT;
                        }
                    });
                    if (!dup) {
                        ra.push(v);
                    }
                });
            } else {
                each(this.context().results, function (r) {
                    var row = [], dup = false;
                    each(args, function (c) {
                        row.push(r[c]);
                    });
                    each(ra, function (d) {
                        var ldup = true;
                        each(args, function (c, i) {
                            if (row[i] !== d[i]) {
                                ldup = false;
                                return TAFFY.EXIT;
                            }
                        });
                        if (ldup) {
                            dup = true;
                            return TAFFY.EXIT;
                        }
                    });
                    if (!dup) {
                        ra.push(row);
                    }
                });
            }
            return ra;
        });
        API.extend('supplant', function (template, returnarray) {
            var ra = [];
            run.call(this);
            each(this.context().results, function (r) {
                ra.push(template.replace(/\{([^\{\}]*)\}/g, function (a, b) {
                    var v = r[b];
                    return typeof v === 'string' || typeof v === 'number' ? v : a;
                }));
            });
            return !returnarray ? ra.join('') : ra;
        });
        API.extend('each', function (m) {
            run.call(this);
            each(this.context().results, m);
            return this;
        });
        API.extend('map', function (m) {
            var ra = [];
            run.call(this);
            each(this.context().results, function (r) {
                ra.push(m(r));
            });
            return ra;
        });
        T = function (d) {
            var TOb = [], ID = {}, RC = 1, settings = {
                    template: false,
                    onInsert: false,
                    onUpdate: false,
                    onRemove: false,
                    onDBChange: false,
                    storageName: false,
                    forcePropertyCase: null,
                    cacheSize: 100,
                    name: ''
                }, dm = new Date(), CacheCount = 0, CacheClear = 0, Cache = {}, DBI, runIndexes, root;
            ;
            runIndexes = function (indexes) {
                var records = [], UniqueEnforce = false;
                if (indexes.length === 0) {
                    return TOb;
                }
                each(indexes, function (f) {
                    if (T.isString(f) && /[t][0-9]*[r][0-9]*/i.test(f) && TOb[ID[f]]) {
                        records.push(TOb[ID[f]]);
                        UniqueEnforce = true;
                    }
                    if (T.isObject(f) && f.___id && f.___s && TOb[ID[f.___id]]) {
                        records.push(TOb[ID[f.___id]]);
                        UniqueEnforce = true;
                    }
                    if (T.isArray(f)) {
                        each(f, function (r) {
                            each(runIndexes(r), function (rr) {
                                records.push(rr);
                            });
                        });
                    }
                });
                if (UniqueEnforce && records.length > 1) {
                    records = [];
                }
                return records;
            };
            DBI = {
                dm: function (nd) {
                    if (nd) {
                        dm = nd;
                        Cache = {};
                        CacheCount = 0;
                        CacheClear = 0;
                    }
                    if (settings.onDBChange) {
                        setTimeout(function () {
                            settings.onDBChange.call(TOb);
                        }, 0);
                    }
                    if (settings.storageName) {
                        setTimeout(function () {
                            localStorage.setItem('taffy_' + settings.storageName, JSON.stringify(TOb));
                        });
                    }
                    return dm;
                },
                insert: function (i, runEvent) {
                    var columns = [], records = [], input = protectJSON(i);
                    ;
                    each(input, function (v, i) {
                        var nv, o;
                        if (T.isArray(v) && i === 0) {
                            each(v, function (av) {
                                columns.push(settings.forcePropertyCase === 'lower' ? av.toLowerCase() : settings.forcePropertyCase === 'upper' ? av.toUpperCase() : av);
                            });
                            return true;
                        } else if (T.isArray(v)) {
                            nv = {};
                            each(v, function (av, ai) {
                                nv[columns[ai]] = av;
                            });
                            v = nv;
                        } else if (T.isObject(v) && settings.forcePropertyCase) {
                            o = {};
                            eachin(v, function (av, ai) {
                                o[settings.forcePropertyCase === 'lower' ? ai.toLowerCase() : settings.forcePropertyCase === 'upper' ? ai.toUpperCase() : ai] = v[ai];
                            });
                            v = o;
                        }
                        RC++;
                        v.___id = 'T' + String(idpad + TC).slice(-6) + 'R' + String(idpad + RC).slice(-6);
                        v.___s = true;
                        records.push(v.___id);
                        if (settings.template) {
                            v = T.mergeObj(settings.template, v);
                        }
                        TOb.push(v);
                        ID[v.___id] = TOb.length - 1;
                        if (settings.onInsert && (runEvent || TAFFY.isUndefined(runEvent))) {
                            settings.onInsert.call(v);
                        }
                        DBI.dm(new Date());
                    });
                    return root(records);
                },
                sort: function (o) {
                    TOb = orderByCol(TOb, o.split(','));
                    ID = {};
                    each(TOb, function (r, i) {
                        ID[r.___id] = i;
                    });
                    DBI.dm(new Date());
                    return true;
                },
                update: function (id, changes, runEvent) {
                    var nc = {}, or, nr, tc, hasChange;
                    if (settings.forcePropertyCase) {
                        eachin(changes, function (v, p) {
                            nc[settings.forcePropertyCase === 'lower' ? p.toLowerCase() : settings.forcePropertyCase === 'upper' ? p.toUpperCase() : p] = v;
                        });
                        changes = nc;
                    }
                    or = TOb[ID[id]];
                    nr = T.mergeObj(or, changes);
                    tc = {};
                    hasChange = false;
                    eachin(nr, function (v, i) {
                        if (TAFFY.isUndefined(or[i]) || or[i] !== v) {
                            tc[i] = v;
                            hasChange = true;
                        }
                    });
                    if (hasChange) {
                        if (settings.onUpdate && (runEvent || TAFFY.isUndefined(runEvent))) {
                            settings.onUpdate.call(nr, TOb[ID[id]], tc);
                        }
                        TOb[ID[id]] = nr;
                        DBI.dm(new Date());
                    }
                },
                remove: function (id) {
                    TOb[ID[id]].___s = false;
                },
                removeCommit: function (runEvent) {
                    var x;
                    for (x = TOb.length - 1; x > -1; x--) {
                        if (!TOb[x].___s) {
                            if (settings.onRemove && (runEvent || TAFFY.isUndefined(runEvent))) {
                                settings.onRemove.call(TOb[x]);
                            }
                            ID[TOb[x].___id] = undefined;
                            TOb.splice(x, 1);
                        }
                    }
                    ID = {};
                    each(TOb, function (r, i) {
                        ID[r.___id] = i;
                    });
                    DBI.dm(new Date());
                },
                query: function (context) {
                    var returnq, cid, results, indexed, limitq, ni;
                    if (settings.cacheSize) {
                        cid = '';
                        each(context.filterRaw, function (r) {
                            if (T.isFunction(r)) {
                                cid = 'nocache';
                                return TAFFY.EXIT;
                            }
                        });
                        if (cid === '') {
                            cid = makeCid(T.mergeObj(context, {
                                q: false,
                                run: false,
                                sort: false
                            }));
                        }
                    }
                    if (!context.results || !context.run || context.run && DBI.dm() > context.run) {
                        results = [];
                        if (settings.cacheSize && Cache[cid]) {
                            Cache[cid].i = CacheCount++;
                            return Cache[cid].results;
                        } else {
                            if (context.q.length === 0 && context.index.length === 0) {
                                each(TOb, function (r) {
                                    results.push(r);
                                });
                                returnq = results;
                            } else {
                                indexed = runIndexes(context.index);
                                each(indexed, function (r) {
                                    if (context.q.length === 0 || runFilters(r, context.q)) {
                                        results.push(r);
                                    }
                                });
                                returnq = results;
                            }
                        }
                    } else {
                        returnq = context.results;
                    }
                    if (context.order.length > 0 && (!context.run || !context.sort)) {
                        returnq = orderByCol(returnq, context.order);
                    }
                    if (returnq.length && (context.limit && context.limit < returnq.length || context.start)) {
                        limitq = [];
                        each(returnq, function (r, i) {
                            if (!context.start || context.start && i + 1 >= context.start) {
                                if (context.limit) {
                                    ni = context.start ? i + 1 - context.start : i;
                                    if (ni < context.limit) {
                                        limitq.push(r);
                                    } else if (ni > context.limit) {
                                        return TAFFY.EXIT;
                                    }
                                } else {
                                    limitq.push(r);
                                }
                            }
                        });
                        returnq = limitq;
                    }
                    if (settings.cacheSize && cid !== 'nocache') {
                        CacheClear++;
                        setTimeout(function () {
                            var bCounter, nc;
                            if (CacheClear >= settings.cacheSize * 2) {
                                CacheClear = 0;
                                bCounter = CacheCount - settings.cacheSize;
                                nc = {};
                                eachin(function (r, k) {
                                    if (r.i >= bCounter) {
                                        nc[k] = r;
                                    }
                                });
                                Cache = nc;
                            }
                        }, 0);
                        Cache[cid] = {
                            i: CacheCount++,
                            results: returnq
                        };
                    }
                    return returnq;
                }
            };
            root = function () {
                var iAPI, context;
                iAPI = TAFFY.mergeObj(TAFFY.mergeObj(API, { insert: undefined }), {
                    getDBI: function () {
                        return DBI;
                    },
                    getroot: function (c) {
                        return root.call(c);
                    },
                    context: function (n) {
                        if (n) {
                            context = TAFFY.mergeObj(context, n.hasOwnProperty('results') ? TAFFY.mergeObj(n, {
                                run: new Date(),
                                sort: new Date()
                            }) : n);
                        }
                        return context;
                    },
                    extend: undefined
                });
                context = this && this.q ? this : {
                    limit: false,
                    start: false,
                    q: [],
                    filterRaw: [],
                    index: [],
                    order: [],
                    results: false,
                    run: null,
                    sort: null,
                    settings: settings
                };
                each(arguments, function (f) {
                    if (isIndexable(f)) {
                        context.index.push(f);
                    } else {
                        context.q.push(returnFilter(f));
                    }
                    context.filterRaw.push(f);
                });
                return iAPI;
            };
            TC++;
            if (d) {
                DBI.insert(d);
            }
            root.insert = DBI.insert;
            root.merge = function (i, key, runEvent) {
                var search = {}, finalSearch = [], obj = {};
                ;
                runEvent = runEvent || false;
                key = key || 'id';
                each(i, function (o) {
                    var existingObject;
                    search[key] = o[key];
                    finalSearch.push(o[key]);
                    existingObject = root(search).first();
                    if (existingObject) {
                        DBI.update(existingObject.___id, o, runEvent);
                    } else {
                        DBI.insert(o, runEvent);
                    }
                });
                obj[key] = finalSearch;
                return root(obj);
            };
            root.TAFFY = true;
            root.sort = DBI.sort;
            root.settings = function (n) {
                if (n) {
                    settings = TAFFY.mergeObj(settings, n);
                    if (n.template) {
                        root().update(n.template);
                    }
                }
                return settings;
            };
            root.store = function (n) {
                var r = false, i;
                if (localStorage) {
                    if (n) {
                        i = localStorage.getItem('taffy_' + n);
                        if (i && i.length > 0) {
                            root.insert(i);
                            r = true;
                        }
                        if (TOb.length > 0) {
                            setTimeout(function () {
                                localStorage.setItem('taffy_' + settings.storageName, JSON.stringify(TOb));
                            });
                        }
                    }
                    root.settings({ storageName: n });
                }
                return root;
            };
            return root;
        };
        TAFFY = T;
        T.each = each;
        T.eachin = eachin;
        T.extend = API.extend;
        TAFFY.EXIT = 'TAFFYEXIT';
        TAFFY.mergeObj = function (ob1, ob2) {
            var c = {};
            eachin(ob1, function (v, n) {
                c[n] = ob1[n];
            });
            eachin(ob2, function (v, n) {
                c[n] = ob2[n];
            });
            return c;
        };
        TAFFY.has = function (var1, var2) {
            var re = false, n;
            if (var1.TAFFY) {
                re = var1(var2);
                if (re.length > 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                switch (T.typeOf(var1)) {
                case 'object':
                    if (T.isObject(var2)) {
                        eachin(var2, function (v, n) {
                            if (re === true && !T.isUndefined(var1[n]) && var1.hasOwnProperty(n)) {
                                re = T.has(var1[n], var2[n]);
                            } else {
                                re = false;
                                return TAFFY.EXIT;
                            }
                        });
                    } else if (T.isArray(var2)) {
                        each(var2, function (v, n) {
                            re = T.has(var1, var2[n]);
                            if (re) {
                                return TAFFY.EXIT;
                            }
                        });
                    } else if (T.isString(var2)) {
                        if (!TAFFY.isUndefined(var1[var2])) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    return re;
                case 'array':
                    if (T.isObject(var2)) {
                        each(var1, function (v, i) {
                            re = T.has(var1[i], var2);
                            if (re === true) {
                                return TAFFY.EXIT;
                            }
                        });
                    } else if (T.isArray(var2)) {
                        each(var2, function (v2, i2) {
                            each(var1, function (v1, i1) {
                                re = T.has(var1[i1], var2[i2]);
                                if (re === true) {
                                    return TAFFY.EXIT;
                                }
                            });
                            if (re === true) {
                                return TAFFY.EXIT;
                            }
                        });
                    } else if (T.isString(var2) || T.isNumber(var2)) {
                        re = false;
                        for (n = 0; n < var1.length; n++) {
                            re = T.has(var1[n], var2);
                            if (re) {
                                return true;
                            }
                        }
                    }
                    return re;
                case 'string':
                    if (T.isString(var2) && var2 === var1) {
                        return true;
                    }
                    break;
                default:
                    if (T.typeOf(var1) === T.typeOf(var2) && var1 === var2) {
                        return true;
                    }
                    break;
                }
            }
            return false;
        };
        TAFFY.hasAll = function (var1, var2) {
            var T = TAFFY, ar;
            if (T.isArray(var2)) {
                ar = true;
                each(var2, function (v) {
                    ar = T.has(var1, v);
                    if (ar === false) {
                        return TAFFY.EXIT;
                    }
                });
                return ar;
            } else {
                return T.has(var1, var2);
            }
        };
        TAFFY.typeOf = function (v) {
            var s = typeof v;
            if (s === 'object') {
                if (v) {
                    if (typeof v.length === 'number' && !v.propertyIsEnumerable('length')) {
                        s = 'array';
                    }
                } else {
                    s = 'null';
                }
            }
            return s;
        };
        TAFFY.getObjectKeys = function (ob) {
            var kA = [];
            eachin(ob, function (n, h) {
                kA.push(h);
            });
            kA.sort();
            return kA;
        };
        TAFFY.isSameArray = function (ar1, ar2) {
            return TAFFY.isArray(ar1) && TAFFY.isArray(ar2) && ar1.join(',') === ar2.join(',') ? true : false;
        };
        TAFFY.isSameObject = function (ob1, ob2) {
            var T = TAFFY, rv = true;
            if (T.isObject(ob1) && T.isObject(ob2)) {
                if (T.isSameArray(T.getObjectKeys(ob1), T.getObjectKeys(ob2))) {
                    eachin(ob1, function (v, n) {
                        if (!(T.isObject(ob1[n]) && T.isObject(ob2[n]) && T.isSameObject(ob1[n], ob2[n]) || T.isArray(ob1[n]) && T.isArray(ob2[n]) && T.isSameArray(ob1[n], ob2[n]) || ob1[n] === ob2[n])) {
                            rv = false;
                            return TAFFY.EXIT;
                        }
                    });
                } else {
                    rv = false;
                }
            } else {
                rv = false;
            }
            return rv;
        };
        typeList = [
            'String',
            'Number',
            'Object',
            'Array',
            'Boolean',
            'Null',
            'Function',
            'Undefined'
        ];
        makeTest = function (thisKey) {
            return function (data) {
                return TAFFY.typeOf(data) === thisKey.toLowerCase() ? true : false;
            };
        };
        for (idx = 0; idx < typeList.length; idx++) {
            typeKey = typeList[idx];
            TAFFY['is' + typeKey] = makeTest(typeKey);
        }
    }
}());
if (typeof exports === 'object') {
    exports.taffy = TAFFY;
}
});
require.define('40', function(module, exports, __dirname, __filename, undefined){
;
(function () {
    var block = {
            newline: /^\n+/,
            code: /^( {4}[^\n]+\n*)+/,
            fences: noop,
            hr: /^( *[-*_]){3,} *(?:\n+|$)/,
            heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
            nptable: noop,
            lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
            blockquote: /^( *>[^\n]+(\n[^\n]+)*\n*)+/,
            list: /^( *)(bull) [\s\S]+?(?:hr|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
            html: /^ *(?:comment|closed|closing) *(?:\n{2,}|\s*$)/,
            def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
            table: noop,
            paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
            text: /^[^\n]+/
        };
    block.bullet = /(?:[*+-]|\d+\.)/;
    block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
    block.item = replace(block.item, 'gm')(/bull/g, block.bullet)();
    block.list = replace(block.list)(/bull/g, block.bullet)('hr', /\n+(?=(?: *[-*_]){3,} *(?:\n+|$))/)();
    block._tag = '(?!(?:' + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code' + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo' + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|@)\\b';
    block.html = replace(block.html)('comment', /<!--[\s\S]*?-->/)('closed', /<(tag)[\s\S]+?<\/\1>/)('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g, block._tag)();
    block.paragraph = replace(block.paragraph)('hr', block.hr)('heading', block.heading)('lheading', block.lheading)('blockquote', block.blockquote)('tag', '<' + block._tag)('def', block.def)();
    block.normal = merge({}, block);
    block.gfm = merge({}, block.normal, {
        fences: /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,
        paragraph: /^/
    });
    block.gfm.paragraph = replace(block.paragraph)('(?!', '(?!' + block.gfm.fences.source.replace('\\1', '\\2') + '|' + block.list.source.replace('\\1', '\\3') + '|')();
    block.tables = merge({}, block.gfm, {
        nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
        table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
    });
    function Lexer(options) {
        this.tokens = [];
        this.tokens.links = {};
        this.options = options || marked.defaults;
        this.rules = block.normal;
        if (this.options.gfm) {
            if (this.options.tables) {
                this.rules = block.tables;
            } else {
                this.rules = block.gfm;
            }
        }
    }
    Lexer.rules = block;
    Lexer.lex = function (src, options) {
        var lexer = new Lexer(options);
        return lexer.lex(src);
    };
    Lexer.prototype.lex = function (src) {
        src = src.replace(/\r\n|\r/g, '\n').replace(/\t/g, '    ').replace(/\u00a0/g, ' ').replace(/\u2424/g, '\n');
        return this.token(src, true);
    };
    Lexer.prototype.token = function (src, top) {
        var src = src.replace(/^ +$/gm, ''), next, loose, cap, bull, b, item, space, i, l;
        while (src) {
            if (cap = this.rules.newline.exec(src)) {
                src = src.substring(cap[0].length);
                if (cap[0].length > 1) {
                    this.tokens.push({ type: 'space' });
                }
            }
            if (cap = this.rules.code.exec(src)) {
                src = src.substring(cap[0].length);
                cap = cap[0].replace(/^ {4}/gm, '');
                this.tokens.push({
                    type: 'code',
                    text: !this.options.pedantic ? cap.replace(/\n+$/, '') : cap
                });
                continue;
            }
            if (cap = this.rules.fences.exec(src)) {
                src = src.substring(cap[0].length);
                this.tokens.push({
                    type: 'code',
                    lang: cap[2],
                    text: cap[3]
                });
                continue;
            }
            if (cap = this.rules.heading.exec(src)) {
                src = src.substring(cap[0].length);
                this.tokens.push({
                    type: 'heading',
                    depth: cap[1].length,
                    text: cap[2]
                });
                continue;
            }
            if (top && (cap = this.rules.nptable.exec(src))) {
                src = src.substring(cap[0].length);
                item = {
                    type: 'table',
                    header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
                    align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                    cells: cap[3].replace(/\n$/, '').split('\n')
                };
                for (i = 0; i < item.align.length; i++) {
                    if (/^ *-+: *$/.test(item.align[i])) {
                        item.align[i] = 'right';
                    } else if (/^ *:-+: *$/.test(item.align[i])) {
                        item.align[i] = 'center';
                    } else if (/^ *:-+ *$/.test(item.align[i])) {
                        item.align[i] = 'left';
                    } else {
                        item.align[i] = null;
                    }
                }
                for (i = 0; i < item.cells.length; i++) {
                    item.cells[i] = item.cells[i].split(/ *\| */);
                }
                this.tokens.push(item);
                continue;
            }
            if (cap = this.rules.lheading.exec(src)) {
                src = src.substring(cap[0].length);
                this.tokens.push({
                    type: 'heading',
                    depth: cap[2] === '=' ? 1 : 2,
                    text: cap[1]
                });
                continue;
            }
            if (cap = this.rules.hr.exec(src)) {
                src = src.substring(cap[0].length);
                this.tokens.push({ type: 'hr' });
                continue;
            }
            if (cap = this.rules.blockquote.exec(src)) {
                src = src.substring(cap[0].length);
                this.tokens.push({ type: 'blockquote_start' });
                cap = cap[0].replace(/^ *> ?/gm, '');
                this.token(cap, top);
                this.tokens.push({ type: 'blockquote_end' });
                continue;
            }
            if (cap = this.rules.list.exec(src)) {
                src = src.substring(cap[0].length);
                bull = cap[2];
                this.tokens.push({
                    type: 'list_start',
                    ordered: bull.length > 1
                });
                cap = cap[0].match(this.rules.item);
                next = false;
                l = cap.length;
                i = 0;
                for (; i < l; i++) {
                    item = cap[i];
                    space = item.length;
                    item = item.replace(/^ *([*+-]|\d+\.) +/, '');
                    if (~item.indexOf('\n ')) {
                        space -= item.length;
                        item = !this.options.pedantic ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '') : item.replace(/^ {1,4}/gm, '');
                    }
                    if (this.options.smartLists && i !== l - 1) {
                        b = block.bullet.exec(cap[i + 1])[0];
                        if (bull !== b && !(bull.length > 1 && b.length > 1)) {
                            src = cap.slice(i + 1).join('\n') + src;
                            i = l - 1;
                        }
                    }
                    loose = next || /\n\n(?!\s*$)/.test(item);
                    if (i !== l - 1) {
                        next = item.charAt(item.length - 1) === '\n';
                        if (!loose)
                            loose = next;
                    }
                    this.tokens.push({ type: loose ? 'loose_item_start' : 'list_item_start' });
                    this.token(item, false);
                    this.tokens.push({ type: 'list_item_end' });
                }
                this.tokens.push({ type: 'list_end' });
                continue;
            }
            if (cap = this.rules.html.exec(src)) {
                src = src.substring(cap[0].length);
                this.tokens.push({
                    type: this.options.sanitize ? 'paragraph' : 'html',
                    pre: cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style',
                    text: cap[0]
                });
                continue;
            }
            if (top && (cap = this.rules.def.exec(src))) {
                src = src.substring(cap[0].length);
                this.tokens.links[cap[1].toLowerCase()] = {
                    href: cap[2],
                    title: cap[3]
                };
                continue;
            }
            if (top && (cap = this.rules.table.exec(src))) {
                src = src.substring(cap[0].length);
                item = {
                    type: 'table',
                    header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
                    align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                    cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
                };
                for (i = 0; i < item.align.length; i++) {
                    if (/^ *-+: *$/.test(item.align[i])) {
                        item.align[i] = 'right';
                    } else if (/^ *:-+: *$/.test(item.align[i])) {
                        item.align[i] = 'center';
                    } else if (/^ *:-+ *$/.test(item.align[i])) {
                        item.align[i] = 'left';
                    } else {
                        item.align[i] = null;
                    }
                }
                for (i = 0; i < item.cells.length; i++) {
                    item.cells[i] = item.cells[i].replace(/^ *\| *| *\| *$/g, '').split(/ *\| */);
                }
                this.tokens.push(item);
                continue;
            }
            if (top && (cap = this.rules.paragraph.exec(src))) {
                src = src.substring(cap[0].length);
                this.tokens.push({
                    type: 'paragraph',
                    text: cap[1].charAt(cap[1].length - 1) === '\n' ? cap[1].slice(0, -1) : cap[1]
                });
                continue;
            }
            if (cap = this.rules.text.exec(src)) {
                src = src.substring(cap[0].length);
                this.tokens.push({
                    type: 'text',
                    text: cap[0]
                });
                continue;
            }
            if (src) {
                throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
            }
        }
        return this.tokens;
    };
    var inline = {
            escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
            autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
            url: noop,
            tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
            link: /^!?\[(inside)\]\(href\)/,
            reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
            nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
            strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
            em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
            code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
            br: /^ {2,}\n(?!\s*$)/,
            del: noop,
            text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
        };
    inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
    inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;
    inline.link = replace(inline.link)('inside', inline._inside)('href', inline._href)();
    inline.reflink = replace(inline.reflink)('inside', inline._inside)();
    inline.normal = merge({}, inline);
    inline.pedantic = merge({}, inline.normal, {
        strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
        em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
    });
    inline.gfm = merge({}, inline.normal, {
        escape: replace(inline.escape)('])', '~|])')(),
        url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
        del: /^~~(?=\S)([\s\S]*?\S)~~/,
        text: replace(inline.text)(']|', '~]|')('|', '|https?://|')()
    });
    inline.breaks = merge({}, inline.gfm, {
        br: replace(inline.br)('{2,}', '*')(),
        text: replace(inline.gfm.text)('{2,}', '*')()
    });
    function InlineLexer(links, options) {
        this.options = options || marked.defaults;
        this.links = links;
        this.rules = inline.normal;
        this.renderer = this.options.renderer || new Renderer();
        if (!this.links) {
            throw new Error('Tokens array requires a `links` property.');
        }
        if (this.options.gfm) {
            if (this.options.breaks) {
                this.rules = inline.breaks;
            } else {
                this.rules = inline.gfm;
            }
        } else if (this.options.pedantic) {
            this.rules = inline.pedantic;
        }
    }
    InlineLexer.rules = inline;
    InlineLexer.output = function (src, links, options) {
        var inline = new InlineLexer(links, options);
        return inline.output(src);
    };
    InlineLexer.prototype.output = function (src) {
        var out = '', link, text, href, cap;
        while (src) {
            if (cap = this.rules.escape.exec(src)) {
                src = src.substring(cap[0].length);
                out += cap[1];
                continue;
            }
            if (cap = this.rules.autolink.exec(src)) {
                src = src.substring(cap[0].length);
                if (cap[2] === '@') {
                    text = cap[1].charAt(6) === ':' ? this.mangle(cap[1].substring(7)) : this.mangle(cap[1]);
                    href = this.mangle('mailto:') + text;
                } else {
                    text = escape(cap[1]);
                    href = text;
                }
                out += this.renderer.link(href, null, text);
                continue;
            }
            if (cap = this.rules.url.exec(src)) {
                src = src.substring(cap[0].length);
                text = escape(cap[1]);
                href = text;
                out += this.renderer.link(href, null, text);
                continue;
            }
            if (cap = this.rules.tag.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.options.sanitize ? escape(cap[0]) : cap[0];
                continue;
            }
            if (cap = this.rules.link.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.outputLink(cap, {
                    href: cap[2],
                    title: cap[3]
                });
                continue;
            }
            if ((cap = this.rules.reflink.exec(src)) || (cap = this.rules.nolink.exec(src))) {
                src = src.substring(cap[0].length);
                link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
                link = this.links[link.toLowerCase()];
                if (!link || !link.href) {
                    out += cap[0].charAt(0);
                    src = cap[0].substring(1) + src;
                    continue;
                }
                out += this.outputLink(cap, link);
                continue;
            }
            if (cap = this.rules.strong.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.renderer.strong(this.output(cap[2] || cap[1]));
                continue;
            }
            if (cap = this.rules.em.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.renderer.em(this.output(cap[2] || cap[1]));
                continue;
            }
            if (cap = this.rules.code.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.renderer.codespan(escape(cap[2], true));
                continue;
            }
            if (cap = this.rules.br.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.renderer.br();
                continue;
            }
            if (cap = this.rules.del.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.renderer.del(this.output(cap[1]));
                continue;
            }
            if (cap = this.rules.text.exec(src)) {
                src = src.substring(cap[0].length);
                out += escape(this.smartypants(cap[0]));
                continue;
            }
            if (src) {
                throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
            }
        }
        return out;
    };
    InlineLexer.prototype.outputLink = function (cap, link) {
        var href = escape(link.href), title = link.title ? escape(link.title) : null;
        return cap[0].charAt(0) !== '!' ? this.renderer.link(href, title, this.output(cap[1])) : this.renderer.image(href, title, escape(cap[1]));
    };
    InlineLexer.prototype.smartypants = function (text) {
        if (!this.options.smartypants)
            return text;
        return text.replace(/--/g, '\u2014').replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018').replace(/'/g, '\u2019').replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c').replace(/"/g, '\u201d').replace(/\.{3}/g, '\u2026');
    };
    InlineLexer.prototype.mangle = function (text) {
        var out = '', l = text.length, i = 0, ch;
        for (; i < l; i++) {
            ch = text.charCodeAt(i);
            if (Math.random() > 0.5) {
                ch = 'x' + ch.toString(16);
            }
            out += '&#' + ch + ';';
        }
        return out;
    };
    function Renderer() {
    }
    Renderer.prototype.code = function (code, lang, escaped, options) {
        options = options || {};
        if (options.highlight) {
            var out = options.highlight(code, lang);
            if (out != null && out !== code) {
                escaped = true;
                code = out;
            }
        }
        if (!lang) {
            return '<pre><code>' + (escaped ? code : escape(code, true)) + '\n</code></pre>';
        }
        return '<pre><code class="' + options.langPrefix + lang + '">' + (escaped ? code : escape(code)) + '\n</code></pre>\n';
    };
    Renderer.prototype.blockquote = function (quote) {
        return '<blockquote>\n' + quote + '</blockquote>\n';
    };
    Renderer.prototype.html = function (html) {
        return html;
    };
    Renderer.prototype.heading = function (text, level, raw, options) {
        return '<h' + level + ' id="' + options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-') + '">' + text + '</h' + level + '>\n';
    };
    Renderer.prototype.hr = function () {
        return '<hr>\n';
    };
    Renderer.prototype.list = function (body, ordered) {
        var type = ordered ? 'ol' : 'ul';
        return '<' + type + '>\n' + body + '</' + type + '>\n';
    };
    Renderer.prototype.listitem = function (text) {
        return '<li>' + text + '</li>\n';
    };
    Renderer.prototype.paragraph = function (text) {
        return '<p>' + text + '</p>\n';
    };
    Renderer.prototype.table = function (header, body) {
        return '<table>\n' + '<thead>\n' + header + '</thead>\n' + '<tbody>\n' + body + '</tbody>\n' + '</table>\n';
    };
    Renderer.prototype.tablerow = function (content) {
        return '<tr>\n' + content + '</tr>\n';
    };
    Renderer.prototype.tablecell = function (content, flags) {
        var type = flags.header ? 'th' : 'td';
        var tag = flags.align ? '<' + type + ' style="text-align:' + flags.align + '">' : '<' + type + '>';
        return tag + content + '</' + type + '>\n';
    };
    Renderer.prototype.strong = function (text) {
        return '<strong>' + text + '</strong>';
    };
    Renderer.prototype.em = function (text) {
        return '<em>' + text + '</em>';
    };
    Renderer.prototype.codespan = function (text) {
        return '<code>' + text + '</code>';
    };
    Renderer.prototype.br = function () {
        return '<br>';
    };
    Renderer.prototype.del = function (text) {
        return '<del>' + text + '</del>';
    };
    Renderer.prototype.link = function (href, title, text) {
        var out = '<a href="' + href + '"';
        if (title) {
            out += ' title="' + title + '"';
        }
        out += '>' + text + '</a>';
        return out;
    };
    Renderer.prototype.image = function (href, title, text) {
        var out = '<img src="' + href + '" alt="' + text + '"';
        if (title) {
            out += ' title="' + title + '"';
        }
        out += '>';
        return out;
    };
    function Parser(options) {
        this.tokens = [];
        this.token = null;
        this.options = options || marked.defaults;
        this.options.renderer = this.options.renderer || new Renderer();
        this.renderer = this.options.renderer;
    }
    Parser.parse = function (src, options, renderer) {
        var parser = new Parser(options, renderer);
        return parser.parse(src);
    };
    Parser.prototype.parse = function (src) {
        this.inline = new InlineLexer(src.links, this.options, this.renderer);
        this.tokens = src.reverse();
        var out = '';
        while (this.next()) {
            out += this.tok();
        }
        return out;
    };
    Parser.prototype.next = function () {
        return this.token = this.tokens.pop();
    };
    Parser.prototype.peek = function () {
        return this.tokens[this.tokens.length - 1] || 0;
    };
    Parser.prototype.parseText = function () {
        var body = this.token.text;
        while (this.peek().type === 'text') {
            body += '\n' + this.next().text;
        }
        return this.inline.output(body);
    };
    Parser.prototype.tok = function () {
        switch (this.token.type) {
        case 'space': {
                return '';
            }
        case 'hr': {
                return this.renderer.hr();
            }
        case 'heading': {
                return this.renderer.heading(this.inline.output(this.token.text), this.token.depth, this.token.text, this.options);
            }
        case 'code': {
                return this.renderer.code(this.token.text, this.token.lang, this.token.escaped, this.options);
            }
        case 'table': {
                var header = '', body = '', i, row, cell, flags, j;
                cell = '';
                for (i = 0; i < this.token.header.length; i++) {
                    flags = {
                        header: true,
                        align: this.token.align[i]
                    };
                    cell += this.renderer.tablecell(this.inline.output(this.token.header[i]), {
                        header: true,
                        align: this.token.align[i]
                    });
                }
                header += this.renderer.tablerow(cell);
                for (i = 0; i < this.token.cells.length; i++) {
                    row = this.token.cells[i];
                    cell = '';
                    for (j = 0; j < row.length; j++) {
                        cell += this.renderer.tablecell(this.inline.output(row[j]), {
                            header: false,
                            align: this.token.align[j]
                        });
                    }
                    body += this.renderer.tablerow(cell);
                }
                return this.renderer.table(header, body);
            }
        case 'blockquote_start': {
                var body = '';
                while (this.next().type !== 'blockquote_end') {
                    body += this.tok();
                }
                return this.renderer.blockquote(body);
            }
        case 'list_start': {
                var body = '', ordered = this.token.ordered;
                while (this.next().type !== 'list_end') {
                    body += this.tok();
                }
                return this.renderer.list(body, ordered);
            }
        case 'list_item_start': {
                var body = '';
                while (this.next().type !== 'list_item_end') {
                    body += this.token.type === 'text' ? this.parseText() : this.tok();
                }
                return this.renderer.listitem(body);
            }
        case 'loose_item_start': {
                var body = '';
                while (this.next().type !== 'list_item_end') {
                    body += this.tok();
                }
                return this.renderer.listitem(body);
            }
        case 'html': {
                var html = !this.token.pre && !this.options.pedantic ? this.inline.output(this.token.text) : this.token.text;
                return this.renderer.html(html);
            }
        case 'paragraph': {
                return this.renderer.paragraph(this.inline.output(this.token.text));
            }
        case 'text': {
                return this.renderer.paragraph(this.parseText());
            }
        }
    };
    function escape(html, encode) {
        return html.replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function replace(regex, opt) {
        regex = regex.source;
        opt = opt || '';
        return function self(name, val) {
            if (!name)
                return new RegExp(regex, opt);
            val = val.source || val;
            val = val.replace(/(^|[^\[])\^/g, '$1');
            regex = regex.replace(name, val);
            return self;
        };
    }
    function noop() {
    }
    noop.exec = noop;
    function merge(obj) {
        var i = 1, target, key;
        for (; i < arguments.length; i++) {
            target = arguments[i];
            for (key in target) {
                if (Object.prototype.hasOwnProperty.call(target, key)) {
                    obj[key] = target[key];
                }
            }
        }
        return obj;
    }
    function marked(src, opt, callback) {
        if (callback || typeof opt === 'function') {
            if (!callback) {
                callback = opt;
                opt = null;
            }
            opt = merge({}, marked.defaults, opt || {});
            var highlight = opt.highlight, tokens, pending, i = 0;
            try {
                tokens = Lexer.lex(src, opt);
            } catch (e) {
                return callback(e);
            }
            pending = tokens.length;
            var done = function () {
                var out, err;
                try {
                    out = Parser.parse(tokens, opt);
                } catch (e) {
                    err = e;
                }
                opt.highlight = highlight;
                return err ? callback(err) : callback(null, out);
            };
            if (!highlight || highlight.length < 3) {
                return done();
            }
            delete opt.highlight;
            if (!pending)
                return done();
            for (; i < tokens.length; i++) {
                (function (token) {
                    if (token.type !== 'code') {
                        return --pending || done();
                    }
                    return highlight(token.text, token.lang, function (err, code) {
                        if (code == null || code === token.text) {
                            return --pending || done();
                        }
                        token.text = code;
                        token.escaped = true;
                        --pending || done();
                    });
                }(tokens[i]));
            }
            return;
        }
        try {
            if (opt)
                opt = merge({}, marked.defaults, opt);
            return Parser.parse(Lexer.lex(src, opt), opt);
        } catch (e) {
            e.message += '\nPlease report this to https://github.com/chjj/marked.';
            if ((opt || marked.defaults).silent) {
                return '<p>An error occured:</p><pre>' + escape(e.message + '', true) + '</pre>';
            }
            throw e;
        }
    }
    marked.options = marked.setOptions = function (opt) {
        merge(marked.defaults, opt);
        return marked;
    };
    marked.defaults = {
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: false,
        silent: false,
        highlight: null,
        langPrefix: 'lang-',
        smartypants: false,
        headerPrefix: '',
        renderer: new Renderer()
    };
    marked.Parser = Parser;
    marked.parser = Parser.parse;
    marked.Renderer = Renderer;
    marked.Lexer = Lexer;
    marked.lexer = Lexer.lex;
    marked.InlineLexer = InlineLexer;
    marked.inlineLexer = InlineLexer.output;
    marked.parse = marked;
    if (typeof exports === 'object') {
        module.exports = marked;
    } else if (typeof define === 'function' && define.amd) {
        define(function () {
            return marked;
        });
    } else {
        this.marked = marked;
    }
}.call(function () {
    return this || (typeof window !== 'undefined' ? window : global);
}()));
});
require.define('31', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Mixen, indexOf, moduleSuper, uniqueId, __slice = [].slice, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    indexOf = function (haystack, needle) {
        var i, stalk, _i, _len;
        for (i = _i = 0, _len = haystack.length; _i < _len; i = ++_i) {
            stalk = haystack[i];
            if (stalk === needle) {
                return i;
            }
        }
        return -1;
    };
    uniqueId = function () {
        var id;
        id = 0;
        return function () {
            return id++;
        };
    }();
    Mixen = function () {
        return Mixen.createMixen.apply(Mixen, arguments);
    };
    Mixen.createdMixens = {};
    Mixen.createMixen = function () {
        var Inst, Last, method, mods, module, _base, _i, _len, _ref, _ref1;
        mods = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        Last = mods[mods.length - 1];
        _ref = mods.slice(0).reverse();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            module = _ref[_i];
            Inst = function (_super) {
                __extends(Inst, _super);
                function Inst() {
                    var args, mod, _j, _len1;
                    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                    for (_j = 0, _len1 = mods.length; _j < _len1; _j++) {
                        mod = mods[_j];
                        mod.apply(this, args);
                    }
                }
                return Inst;
            }(Last);
            Last = Inst;
            for (method in module.prototype) {
                Inst.prototype[method] = module.prototype[method];
            }
            _ref1 = module.prototype;
            for (method in _ref1) {
                if (!__hasProp.call(_ref1, method))
                    continue;
                if (method === 'constructor') {
                    continue;
                }
                if (typeof module.prototype[method] !== 'function') {
                    continue;
                }
                if (module.__super__ == null) {
                    module.__super__ = {};
                }
                if ((_base = module.__super__)[method] == null) {
                    _base[method] = moduleSuper(module, method);
                }
            }
        }
        Last.prototype._mixen_id = uniqueId();
        Mixen.createdMixens[Last.prototype._mixen_id] = mods;
        return Last;
    };
    moduleSuper = function (module, method) {
        return function () {
            var args, current, id, modules, nextModule, pos;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            current = this.constructor.prototype;
            id = null;
            while (true) {
                if (current === Object.prototype) {
                    return;
                }
                id = current._mixen_id;
                if (id != null) {
                    break;
                }
                current = current.constructor.__super__.constructor.prototype;
            }
            if (id == null) {
                return;
            }
            modules = Mixen.createdMixens[id];
            pos = indexOf(modules, module);
            nextModule = null;
            while (pos++ < modules.length - 1) {
                nextModule = modules[pos];
                if (nextModule.prototype[method] != null) {
                    break;
                }
            }
            if (nextModule != null && nextModule.prototype != null && nextModule.prototype[method] != null) {
                return nextModule.prototype[method].apply(this, args);
            }
        };
    };
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return Mixen;
        });
    } else if (typeof exports === 'object') {
        module.exports = Mixen;
    } else {
        window.Mixen = Mixen;
    }
}.call(this));
});
require.define('55', function(module, exports, __dirname, __filename, undefined){
var Dots, Exp, Kinetic, Psy, Q, canvas, components, csv, datatable, design, factory, html, include, layout, lib, libs, match, samplers, stimresp, utils, _, _i, _len;
Exp = require('114', module);
Psy = require('83', module);
Dots = require('115', module);
utils = require('76', module);
datatable = require('77', module);
samplers = require('116', module);
stimresp = require('73', module);
layout = require('74', module);
design = require('117', module);
canvas = require('80', module);
html = require('81', module);
components = require('82', module);
factory = require('122', module);
Kinetic = require('27', module).Kinetic;
_ = require('2', module);
Q = require('9', module);
csv = require('120', module);
match = require('123', module).match;
include = function (lib) {
    var key, value, _results;
    _results = [];
    for (key in lib) {
        value = lib[key];
        _results.push(exports[key] = value);
    }
    return _results;
};
libs = [
    Exp,
    Psy,
    Dots,
    utils,
    datatable,
    samplers,
    stimresp,
    layout,
    design,
    canvas,
    html,
    components,
    factory,
    match
];
for (_i = 0, _len = libs.length; _i < _len; _i++) {
    lib = libs[_i];
    include(lib);
}
exports.Q = Q;
exports._ = _;
exports.Kinetic = Kinetic;
exports.csv = csv;
exports.match = match;
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
}
});
require.define('60', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Teacup, doctypes, elements, merge_elements, tagName, _fn, _fn1, _fn2, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, __slice = [].slice, __indexOf = [].indexOf || function (item) {
            for (var i = 0, l = this.length; i < l; i++) {
                if (i in this && this[i] === item)
                    return i;
            }
            return -1;
        };
    doctypes = {
        'default': '<!DOCTYPE html>',
        '5': '<!DOCTYPE html>',
        'xml': '<?xml version="1.0" encoding="utf-8" ?>',
        'transitional': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
        'strict': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
        'frameset': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">',
        '1.1': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">',
        'basic': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">',
        'mobile': '<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.2//EN" "http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd">',
        'ce': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "ce-html-1.0-transitional.dtd">'
    };
    elements = {
        regular: 'a abbr address article aside audio b bdi bdo blockquote body button canvas caption cite code colgroup datalist dd del details dfn div dl dt em fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup html i iframe ins kbd label legend li map mark menu meter nav noscript object ol optgroup option output p pre progress q rp rt ruby s samp section select small span strong sub summary sup table tbody td textarea tfoot th thead time title tr u ul video',
        raw: 'script style',
        'void': 'area base br col command embed hr img input keygen link meta param source track wbr',
        obsolete: 'applet acronym bgsound dir frameset noframes isindex listing nextid noembed plaintext rb strike xmp big blink center font marquee multicol nobr spacer tt',
        obsolete_void: 'basefont frame'
    };
    merge_elements = function () {
        var a, args, element, result, _i, _j, _len, _len1, _ref;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        result = [];
        for (_i = 0, _len = args.length; _i < _len; _i++) {
            a = args[_i];
            _ref = elements[a].split(' ');
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                element = _ref[_j];
                if (__indexOf.call(result, element) < 0) {
                    result.push(element);
                }
            }
        }
        return result;
    };
    Teacup = function () {
        function Teacup() {
            this.htmlOut = null;
        }
        Teacup.prototype.resetBuffer = function (html) {
            var previous;
            if (html == null) {
                html = null;
            }
            previous = this.htmlOut;
            this.htmlOut = html;
            return previous;
        };
        Teacup.prototype.render = function () {
            var args, previous, result, template;
            template = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            previous = this.resetBuffer('');
            try {
                template.apply(null, args);
            } finally {
                result = this.resetBuffer(previous);
            }
            return result;
        };
        Teacup.prototype.cede = function () {
            var args;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return this.render.apply(this, args);
        };
        Teacup.prototype.renderable = function (template) {
            var teacup;
            teacup = this;
            return function () {
                var args, result;
                args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                if (teacup.htmlOut === null) {
                    teacup.htmlOut = '';
                    try {
                        template.apply(this, args);
                    } finally {
                        result = teacup.resetBuffer();
                    }
                    return result;
                } else {
                    return template.apply(this, args);
                }
            };
        };
        Teacup.prototype.renderAttr = function (name, value) {
            var k, v;
            if (value == null) {
                return ' ' + name;
            }
            if (value === false) {
                return '';
            }
            if (name === 'data' && typeof value === 'object') {
                return function () {
                    var _results;
                    _results = [];
                    for (k in value) {
                        v = value[k];
                        _results.push(this.renderAttr('data-' + k, v));
                    }
                    return _results;
                }.call(this).join('');
            }
            if (value === true) {
                value = name;
            }
            return ' ' + name + '=' + this.quote(this.escape(value.toString()));
        };
        Teacup.prototype.attrOrder = [
            'id',
            'class'
        ];
        Teacup.prototype.renderAttrs = function (obj) {
            var name, result, value, _i, _len, _ref;
            result = '';
            _ref = this.attrOrder;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                name = _ref[_i];
                if (!(name in obj)) {
                    continue;
                }
                result += this.renderAttr(name, obj[name]);
                delete obj[name];
            }
            for (name in obj) {
                value = obj[name];
                result += this.renderAttr(name, value);
            }
            return result;
        };
        Teacup.prototype.renderContents = function (contents) {
            if (contents == null) {
            } else if (typeof contents === 'function') {
                return contents.call(this);
            } else {
                return this.text(contents);
            }
        };
        Teacup.prototype.isSelector = function (string) {
            var _ref;
            return string.length > 1 && ((_ref = string[0]) === '#' || _ref === '.');
        };
        Teacup.prototype.parseSelector = function (selector) {
            var classes, id, klass, token, _i, _len, _ref, _ref1;
            id = null;
            classes = [];
            _ref = selector.split('.');
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                token = _ref[_i];
                if (id) {
                    classes.push(token);
                } else {
                    _ref1 = token.split('#'), klass = _ref1[0], id = _ref1[1];
                    if (klass !== '') {
                        classes.push(token);
                    }
                }
            }
            return {
                id: id,
                classes: classes
            };
        };
        Teacup.prototype.normalizeArgs = function (args) {
            var arg, attrs, classes, contents, id, index, selector, _i, _len;
            attrs = {};
            selector = null;
            contents = null;
            for (index = _i = 0, _len = args.length; _i < _len; index = ++_i) {
                arg = args[index];
                if (arg != null) {
                    switch (typeof arg) {
                    case 'string':
                        if (index === 0 && this.isSelector(arg)) {
                            selector = this.parseSelector(arg);
                        } else {
                            contents = arg;
                        }
                        break;
                    case 'function':
                    case 'number':
                    case 'boolean':
                        contents = arg;
                        break;
                    case 'object':
                        if (arg.constructor === Object) {
                            attrs = arg;
                        } else {
                            contents = arg;
                        }
                        break;
                    default:
                        contents = arg;
                    }
                }
            }
            if (selector != null) {
                id = selector.id, classes = selector.classes;
                if (id != null) {
                    attrs.id = id;
                }
                if (classes != null ? classes.length : void 0) {
                    attrs['class'] = classes.join(' ');
                }
            }
            return {
                attrs: attrs,
                contents: contents
            };
        };
        Teacup.prototype.tag = function () {
            var args, attrs, contents, tagName, _ref;
            tagName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            _ref = this.normalizeArgs(args), attrs = _ref.attrs, contents = _ref.contents;
            this.raw('<' + tagName + this.renderAttrs(attrs) + '>');
            this.renderContents(contents);
            return this.raw('</' + tagName + '>');
        };
        Teacup.prototype.rawTag = function () {
            var args, attrs, contents, tagName, _ref;
            tagName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            _ref = this.normalizeArgs(args), attrs = _ref.attrs, contents = _ref.contents;
            this.raw('<' + tagName + this.renderAttrs(attrs) + '>');
            this.raw(contents);
            return this.raw('</' + tagName + '>');
        };
        Teacup.prototype.selfClosingTag = function () {
            var args, attrs, contents, tag, _ref;
            tag = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            _ref = this.normalizeArgs(args), attrs = _ref.attrs, contents = _ref.contents;
            if (contents) {
                throw new Error('Teacup: <' + tag + '/> must not have content.  Attempted to nest ' + contents);
            }
            return this.raw('<' + tag + this.renderAttrs(attrs) + ' />');
        };
        Teacup.prototype.coffeescript = function (fn) {
            return this.raw('<script type="text/javascript">(function() {\n  var __slice = [].slice,\n      __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },\n      __hasProp = {}.hasOwnProperty,\n      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };\n  (' + fn.toString() + ')();\n})();</script>');
        };
        Teacup.prototype.comment = function (text) {
            return this.raw('<!--' + this.escape(text) + '-->');
        };
        Teacup.prototype.doctype = function (type) {
            if (type == null) {
                type = 5;
            }
            return this.raw(doctypes[type]);
        };
        Teacup.prototype.ie = function (condition, contents) {
            this.raw('<!--[if ' + this.escape(condition) + ']>');
            this.renderContents(contents);
            return this.raw('<![endif]-->');
        };
        Teacup.prototype.text = function (s) {
            if (this.htmlOut == null) {
                throw new Error('Teacup: can\'t call a tag function outside a rendering context');
            }
            return this.htmlOut += s != null && this.escape(s.toString()) || '';
        };
        Teacup.prototype.raw = function (s) {
            if (s == null) {
                return;
            }
            return this.htmlOut += s;
        };
        Teacup.prototype.escape = function (text) {
            return text.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        };
        Teacup.prototype.quote = function (value) {
            return '"' + value + '"';
        };
        Teacup.prototype.tags = function () {
            var bound, boundMethodNames, method, _fn, _i, _len, _this = this;
            bound = {};
            boundMethodNames = [].concat('cede coffeescript comment doctype escape ie raw render renderable script tag text'.split(' '), merge_elements('regular', 'obsolete', 'raw', 'void', 'obsolete_void'));
            _fn = function (method) {
                return bound[method] = function () {
                    var args;
                    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                    return _this[method].apply(_this, args);
                };
            };
            for (_i = 0, _len = boundMethodNames.length; _i < _len; _i++) {
                method = boundMethodNames[_i];
                _fn(method);
            }
            return bound;
        };
        return Teacup;
    }();
    _ref = merge_elements('regular', 'obsolete');
    _fn = function (tagName) {
        return Teacup.prototype[tagName] = function () {
            var args;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return this.tag.apply(this, [tagName].concat(__slice.call(args)));
        };
    };
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tagName = _ref[_i];
        _fn(tagName);
    }
    _ref1 = merge_elements('raw');
    _fn1 = function (tagName) {
        return Teacup.prototype[tagName] = function () {
            var args;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return this.rawTag.apply(this, [tagName].concat(__slice.call(args)));
        };
    };
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        tagName = _ref1[_j];
        _fn1(tagName);
    }
    _ref2 = merge_elements('void', 'obsolete_void');
    _fn2 = function (tagName) {
        return Teacup.prototype[tagName] = function () {
            var args;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return this.selfClosingTag.apply(this, [tagName].concat(__slice.call(args)));
        };
    };
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        tagName = _ref2[_k];
        _fn2(tagName);
    }
    if (typeof module !== 'undefined' && module !== null ? module.exports : void 0) {
        module.exports = new Teacup().tags();
        module.exports.Teacup = Teacup;
    } else if (typeof define === 'function' && define.amd) {
        define('teacup', [], function () {
            return new Teacup().tags();
        });
    } else {
        window.teacup = new Teacup().tags();
        window.teacup.Teacup = Teacup;
    }
}.call(this));
});
require.define('70', function(module, exports, __dirname, __filename, undefined){
var util = require('util');
var assert = require('assert');
var slice = Array.prototype.slice;
var console;
var times = {};
if (typeof global !== 'undefined' && global.console) {
    console = global.console;
} else if (typeof window !== 'undefined' && window.console) {
    console = window.console;
} else {
    console = {};
}
var functions = [
        [
            log,
            'log'
        ],
        [
            info,
            'info'
        ],
        [
            warn,
            'warn'
        ],
        [
            error,
            'error'
        ],
        [
            time,
            'time'
        ],
        [
            timeEnd,
            'timeEnd'
        ],
        [
            trace,
            'trace'
        ],
        [
            dir,
            'dir'
        ],
        [
            assert,
            'assert'
        ]
    ];
for (var i = 0; i < functions.length; i++) {
    var tuple = functions[i];
    var f = tuple[0];
    var name = tuple[1];
    if (!console[name]) {
        console[name] = f;
    }
}
module.exports = console;
function log() {
}
function info() {
    console.log.apply(console, arguments);
}
function warn() {
    console.log.apply(console, arguments);
}
function error() {
    console.warn.apply(console, arguments);
}
function time(label) {
    times[label] = Date.now();
}
function timeEnd(label) {
    var time = times[label];
    if (!time) {
        throw new Error('No such label: ' + label);
    }
    var duration = Date.now() - time;
    console.log(label + ': ' + duration + 'ms');
}
function trace() {
    var err = new Error();
    err.name = 'Trace';
    err.message = util.format.apply(null, arguments);
    console.error(err.stack);
}
function dir(object) {
    console.log(util.inspect(object) + '\n');
}
function assert(expression) {
    if (!expression) {
        var arr = slice.call(arguments, 1);
        assert.ok(false, util.format.apply(null, arr));
    }
}
});
require.define('71', function(module, exports, __dirname, __filename, undefined){
try {
    if (!setTimeout.call) {
        var slicer = Array.prototype.slice;
        exports.setTimeout = function (fn) {
            var args = slicer.call(arguments, 1);
            return setTimeout(function () {
                return fn.apply(this, args);
            });
        };
        exports.setInterval = function (fn) {
            var args = slicer.call(arguments, 1);
            return setInterval(function () {
                return fn.apply(this, args);
            });
        };
    } else {
        exports.setTimeout = setTimeout;
        exports.setInterval = setInterval;
    }
    exports.clearTimeout = clearTimeout;
    exports.clearInterval = clearInterval;
    if (window.setImmediate) {
        exports.setImmediate = window.setImmediate;
        exports.clearImmediate = window.clearImmediate;
    }
    exports.setTimeout(function () {
    });
} catch (_) {
    function bind(f, context) {
        return function () {
            return f.apply(context, arguments);
        };
    }
    if (typeof window !== 'undefined') {
        exports.setTimeout = bind(setTimeout, window);
        exports.setInterval = bind(setInterval, window);
        exports.clearTimeout = bind(clearTimeout, window);
        exports.clearInterval = bind(clearInterval, window);
        if (window.setImmediate) {
            exports.setImmediate = bind(window.setImmediate, window);
            exports.clearImmediate = bind(window.clearImmediate, window);
        }
    } else {
        if (typeof setTimeout !== 'undefined') {
            exports.setTimeout = setTimeout;
        }
        if (typeof setInterval !== 'undefined') {
            exports.setInterval = setInterval;
        }
        if (typeof clearTimeout !== 'undefined') {
            exports.clearTimeout = clearTimeout;
        }
        if (typeof clearInterval === 'function') {
            exports.clearInterval = clearInterval;
        }
    }
}
exports.unref = function unref() {
};
exports.ref = function ref() {
};
if (!exports.setImmediate) {
    var currentKey = 0, queue = {}, active = false;
    exports.setImmediate = function () {
        function drain() {
            active = false;
            for (var key in queue) {
                if (queue.hasOwnProperty(currentKey, key)) {
                    var fn = queue[key];
                    delete queue[key];
                    fn();
                }
            }
        }
        if (typeof window !== 'undefined' && window.postMessage && window.addEventListener) {
            window.addEventListener('message', function (ev) {
                if (ev.source === window && ev.data === 'browserify-tick') {
                    ev.stopPropagation();
                    drain();
                }
            }, true);
            return function setImmediate(fn) {
                var id = ++currentKey;
                queue[id] = fn;
                if (!active) {
                    active = true;
                    window.postMessage('browserify-tick', '*');
                }
                return id;
            };
        } else {
            return function setImmediate(fn) {
                var id = ++currentKey;
                queue[id] = fn;
                if (!active) {
                    active = true;
                    setTimeout(drain, 0);
                }
                return id;
            };
        }
    }();
    exports.clearImmediate = function clearImmediate(id) {
        delete queue[id];
    };
}
});
require.define('73', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Response, ResponseData, Stimulus, lay, _, _ref, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    _ = require('2', module);
    lay = require('74', module);
    exports.Stimulus = Stimulus = function () {
        Stimulus.prototype.__standardDefaults = {
            x: 0,
            y: 0,
            origin: 'top-left'
        };
        Stimulus.prototype.defaults = {};
        Stimulus.prototype.groupSize = function (group) {
            var children, height, i, width, _i, _ref;
            children = group.getChildren();
            width = 0;
            height = 0;
            for (i = _i = 0, _ref = children.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                if (children[i].getWidth() > width) {
                    width = children[i].getWidth();
                }
                if (children[i].getHeight() > height) {
                    height = children[i].getHeight();
                }
            }
            return {
                width: width,
                height: height
            };
        };
        function Stimulus(spec) {
            var _ref;
            if (spec == null) {
                spec = {};
            }
            this.spec = _.defaults(spec, this.defaults);
            this.spec = _.defaults(spec, this.__standardDefaults);
            this.spec = _.omit(this.spec, function (value, key) {
                return value == null;
            });
            this.name = this.constructor.name;
            if (((_ref = this.spec) != null ? _ref.id : void 0) != null) {
                this.id = this.spec.id;
            } else {
                this.id = _.uniqueId('stim_');
            }
            this.stopped = false;
            if (this.spec.layout != null) {
                this.layout = this.spec.layout;
            } else {
                this.layout = new lay.AbsoluteLayout();
            }
            this.overlay = false;
            this.name = this.constructor.name;
            this.initialize();
        }
        Stimulus.prototype.initialize = function () {
        };
        Stimulus.prototype.xyoffset = function (origin, nodeWidth, nodeHeight) {
            console.log('origin is', origin);
            switch (origin) {
            case 'center':
                return [
                    -nodeWidth / 2,
                    -nodeHeight / 2
                ];
            case 'center-left' || 'left-center':
                return [
                    0,
                    -nodeHeight / 2
                ];
            case 'center-right' || 'right-center':
                return [
                    -nodeWidth,
                    -nodeHeight / 2
                ];
            case 'top-left' || 'left-top':
                return [
                    0,
                    0
                ];
            case 'top-right' || 'right-top':
                return [
                    -nodeWidth,
                    0
                ];
            case 'top-center' || 'center-top':
                return [
                    -nodeWidth / 2,
                    0
                ];
            case 'bottom-left' || 'left-bottom':
                return [
                    0,
                    -nodeHeight
                ];
            case 'bottom-right' || 'right-bottom':
                return [
                    -nodeWidth,
                    -nodeHeight
                ];
            case 'bottom-center' || 'center-bottom':
                return [
                    -nodeWidth / 2,
                    -nodeHeight
                ];
            default:
                throw new Error('failed to match \'origin\' argument:', origin);
            }
        };
        Stimulus.prototype.computeCoordinates = function (context, position, nodeWidth, nodeHeight) {
            var xy, xyoff;
            if (nodeWidth == null) {
                nodeWidth = 0;
            }
            if (nodeHeight == null) {
                nodeHeight = 0;
            }
            xy = position != null ? this.layout.computePosition([
                context.width(),
                context.height()
            ], position) : this.spec.x != null && this.spec.y != null ? [
                this.layout.convertToCoordinate(this.spec.x, context.width()),
                this.layout.convertToCoordinate(this.spec.y, context.height())
            ] : [
                0,
                0
            ];
            console.log('origin', this.spec.origin);
            if (this.spec.origin != null) {
                xyoff = this.xyoffset(this.spec.origin, nodeWidth, nodeHeight);
                xy[0] = xy[0] + xyoff[0];
                xy[1] = xy[1] + xyoff[1];
            }
            return xy;
        };
        Stimulus.prototype.reset = function () {
            return this.stopped = false;
        };
        Stimulus.prototype.render = function (context, layer) {
        };
        Stimulus.prototype.stop = function (context) {
            return this.stopped = true;
        };
        return Stimulus;
    }();
    exports.Response = Response = function (_super) {
        __extends(Response, _super);
        function Response() {
            _ref = Response.__super__.constructor.apply(this, arguments);
            return _ref;
        }
        Response.prototype.start = function (context) {
            return this.activate(context);
        };
        Response.prototype.activate = function (context) {
        };
        return Response;
    }(exports.Stimulus);
    exports.ResponseData = ResponseData = function () {
        function ResponseData(data) {
            this.data = data;
        }
        return ResponseData;
    }();
}.call(this));
});
require.define('74', function(module, exports, __dirname, __filename, undefined){
(function () {
    var AbsoluteLayout, GridLayout, Layout, computeGridCells, convertPercentageToFraction, convertToCoordinate, isPercentage, isPositionLabel, positionToCoord, _, _ref, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    _ = require('2', module);
    isPercentage = function (perc) {
        return _.isString(perc) && perc.slice(-1) === '%';
    };
    isPositionLabel = function (pos) {
        return _.contains([
            'center',
            'center-left',
            'center-right',
            'top-left',
            'top-right',
            'top-center',
            'bottom-left',
            'bottom-right',
            'bottom-center',
            'left-center',
            'right-center',
            'left-top',
            'right-top',
            'center-top',
            'left-bottom',
            'right-bottom',
            'center-bottom'
        ], pos);
    };
    positionToCoord = function (pos, offx, offy, width, height, xy) {
        switch (pos) {
        case 'center':
            return [
                offx + width * 0.5,
                offy + height * 0.5
            ];
        case 'center-left' || 'left-center':
            return [
                offx + width / 6,
                offy + height * 0.5
            ];
        case 'center-right' || 'right-center':
            return [
                offx + width * 5 / 6,
                offy + height * 0.5
            ];
        case 'top-left' || 'left-top':
            return [
                offx + width / 6,
                offy + height / 6
            ];
        case 'top-right' || 'right-top':
            return [
                offx + width * 5 / 6,
                offy + height / 6
            ];
        case 'top-center' || 'center-top':
            return [
                offx + width * 0.5,
                offy + height / 6
            ];
        case 'bottom-left' || 'left-bottom':
            return [
                offx + width / 6,
                offy + height * 5 / 6
            ];
        case 'bottom-right' || 'right-bottom':
            return [
                offx + width * 5 / 6,
                offy + height * 5 / 6
            ];
        case 'bottom-center' || 'center-bottom':
            return [
                offx + width * 0.5,
                offy + height * 5 / 6
            ];
        default:
            return xy;
        }
    };
    convertPercentageToFraction = function (perc, dim) {
        var frac;
        frac = parseFloat(perc) / 100;
        frac = Math.min(1, frac);
        frac = Math.max(0, frac);
        return frac * dim;
    };
    convertToCoordinate = function (val, d) {
        var ret;
        if (isPercentage(val)) {
            return val = convertPercentageToFraction(val, d);
        } else if (isPositionLabel(val)) {
            ret = positionToCoord(val, 0, 0, d[0], d[1], [
                0,
                0
            ]);
            return ret;
        } else {
            return Math.min(val, d);
        }
    };
    computeGridCells = function (rows, cols, bounds) {
        var col, row, _i, _results;
        _results = [];
        for (row = _i = 0; 0 <= rows ? _i < rows : _i > rows; row = 0 <= rows ? ++_i : --_i) {
            _results.push(function () {
                var _j, _results1;
                _results1 = [];
                for (col = _j = 0; 0 <= cols ? _j < cols : _j > cols; col = 0 <= cols ? ++_j : --_j) {
                    _results1.push({
                        x: bounds.x + bounds.width / cols * col,
                        y: bounds.y + bounds.height / rows * row,
                        width: bounds.width / cols,
                        height: bounds.height / rows
                    });
                }
                return _results1;
            }());
        }
        return _results;
    };
    exports.Layout = Layout = function () {
        function Layout() {
        }
        Layout.prototype.computePosition = function (dim, constraints) {
            throw new Error('unimplimented error');
        };
        Layout.prototype.convertToCoordinate = function (val, d) {
            var ret;
            if (isPercentage(val)) {
                return val = convertPercentageToFraction(val, d);
            } else if (isPositionLabel(val)) {
                ret = positionToCoord(val, 0, 0, d[0], d[1], [
                    0,
                    0
                ]);
                return ret;
            } else {
                return Math.min(val, d);
            }
        };
        return Layout;
    }();
    exports.AbsoluteLayout = AbsoluteLayout = function (_super) {
        __extends(AbsoluteLayout, _super);
        function AbsoluteLayout() {
            _ref = AbsoluteLayout.__super__.constructor.apply(this, arguments);
            return _ref;
        }
        AbsoluteLayout.prototype.computePosition = function (dim, constraints) {
            var x, y;
            if (_.isArray(constraints)) {
                x = convertToCoordinate(constraints[0], dim[0]);
                y = convertToCoordinate(constraints[1], dim[1]);
                return [
                    x,
                    y
                ];
            } else {
                return convertToCoordinate(constraints, dim);
            }
        };
        return AbsoluteLayout;
    }(exports.Layout);
    exports.GridLayout = GridLayout = function (_super) {
        __extends(GridLayout, _super);
        function GridLayout(rows, cols, bounds) {
            this.rows = rows;
            this.cols = cols;
            this.bounds = bounds;
            this.ncells = this.rows * this.cols;
            this.cells = this.computeCells();
        }
        GridLayout.prototype.computeCells = function () {
            return computeGridCells(this.rows, this.cols, this.bounds);
        };
        GridLayout.prototype.computePosition = function (dim, constraints) {
            var cell;
            if (dim[0] !== this.bounds.width && dim[1] !== this.bounds.height) {
                this.bounds.width = dim[0];
                this.bounds.height = dim[1];
                this.cells = this.computeCells();
            }
            cell = this.cells[constraints[0]][constraints[1]];
            return [
                cell.x + cell.width / 2,
                cell.y + cell.height / 2
            ];
        };
        return GridLayout;
    }(exports.Layout);
    exports.positionToCoord = positionToCoord;
}.call(this));
});
require.define('79', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Background, Kinetic, Stimulus, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Kinetic = require('27', module).Kinetic;
    Stimulus = require('73', module).Stimulus;
    Background = function (_super) {
        __extends(Background, _super);
        function Background(stims, fill) {
            this.stims = stims != null ? stims : [];
            this.fill = fill != null ? fill : 'white';
            Background.__super__.constructor.call(this, {}, {});
        }
        Background.prototype.render = function (context, layer) {
            var background, stim, _i, _len, _ref, _results;
            background = new Kinetic.Rect({
                x: 0,
                y: 0,
                width: context.width(),
                height: context.height(),
                name: 'background',
                fill: this.fill
            });
            layer.add(background);
            _ref = this.stims;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                stim = _ref[_i];
                _results.push(stim.render(context, layer));
            }
            return _results;
        };
        return Background;
    }(Stimulus);
    exports.Background = Background;
}.call(this));
});
require.define('83', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Background, Bacon, Block, BlockSeq, Coda, DataTable, DefaultComponentFactory, Event, EventData, EventDataLog, Experiment, ExperimentContext, ExperimentState, FeedbackNode, FunctionNode, Kinetic, KineticContext, MockStimFactory, Prelude, Presenter, Q, Response, ResponseData, RunnableNode, StimFactory, Stimulus, TAFFY, Trial, buildCoda, buildEvent, buildPrelude, buildResponse, buildStimulus, buildTrial, createContext, des, functionNode, makeEventSeq, utils, _, __dummySpec, _ref, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    _ = require('2', module);
    Q = require('9', module);
    TAFFY = require('23', module).taffy;
    utils = require('76', module);
    DataTable = require('77', module).DataTable;
    Bacon = require('25', module);
    DefaultComponentFactory = require('122', module).DefaultComponentFactory;
    Background = require('79', module).Background;
    Kinetic = require('27', module).Kinetic;
    Stimulus = require('73', module).Stimulus;
    Response = require('73', module).Response;
    ResponseData = require('73', module).ResponseData;
    exports.EventData = EventData = function () {
        function EventData(name, id, data) {
            this.name = name;
            this.id = id;
            this.data = data;
        }
        return EventData;
    }();
    exports.EventDataLog = EventDataLog = function () {
        function EventDataLog() {
            this.eventStack = [];
        }
        EventDataLog.prototype.push = function (ev) {
            return this.eventStack.push(ev);
        };
        EventDataLog.prototype.last = function () {
            if (this.eventStack.length < 1) {
                throw 'EventLog is Empty, canot access last element';
            }
            return this.eventStack[this.eventStack.length - 1].data;
        };
        EventDataLog.prototype.findAll = function (id) {
            return _.filter(this.eventStack, function (ev) {
                return ev.id === id;
            });
        };
        EventDataLog.prototype.findLast = function (id) {
            var i, len, _i;
            len = this.eventStack.length - 1;
            for (i = _i = len; len <= 0 ? _i <= 0 : _i >= 0; i = len <= 0 ? ++_i : --_i) {
                if (this.eventStack[i].id === id) {
                    return this.eventStack[i];
                }
            }
        };
        return EventDataLog;
    }();
    exports.StimFactory = StimFactory = function () {
        function StimFactory() {
        }
        StimFactory.prototype.buildStimulus = function (spec, context) {
            var params, stimType;
            stimType = _.keys(spec)[0];
            params = _.values(spec)[0];
            return this.makeStimulus(stimType, params, context);
        };
        StimFactory.prototype.buildResponse = function (spec, context) {
            var params, responseType;
            responseType = _.keys(spec)[0];
            params = _.values(spec)[0];
            return this.makeResponse(responseType, params, context);
        };
        StimFactory.prototype.buildEvent = function (spec, context) {
            var response, responseSpec, stim, stimSpec;
            if (spec.Next == null) {
                throw new Error('Event specification does not contain \'Next\' element');
            }
            stimSpec = _.omit(spec, 'Next');
            responseSpec = _.pick(spec, 'Next');
            stim = this.buildStimulus(stimSpec, context);
            response = this.buildResponse(responseSpec.Next, context);
            return this.makeEvent(stim, response, context);
        };
        StimFactory.prototype.makeStimulus = function (name, params, context) {
            throw new Error('unimplemented');
        };
        StimFactory.prototype.makeResponse = function (name, params, context) {
            throw new Error('unimplemented');
        };
        StimFactory.prototype.makeEvent = function (stim, response, context) {
            throw new Error('unimplemented');
        };
        return StimFactory;
    }();
    exports.MockStimFactory = MockStimFactory = function (_super) {
        __extends(MockStimFactory, _super);
        function MockStimFactory() {
            _ref = MockStimFactory.__super__.constructor.apply(this, arguments);
            return _ref;
        }
        MockStimFactory.prototype.makeStimulus = function (name, params, context) {
            var ret;
            ret = {};
            ret[name] = params;
            return ret;
        };
        MockStimFactory.prototype.makeResponse = function (name, params, context) {
            var ret;
            ret = {};
            ret[name] = params;
            return ret;
        };
        MockStimFactory.prototype.makeEvent = function (stim, response, context) {
            return [
                stim,
                response
            ];
        };
        return MockStimFactory;
    }(exports.StimFactory);
    RunnableNode = function () {
        RunnableNode.functionList = function (nodes, context, callback) {
            return _.map(nodes, function (node) {
                return function (arg) {
                    context.handleValue(arg);
                    if (callback != null) {
                        callback(node);
                    }
                    return node.start(context);
                };
            });
        };
        RunnableNode.chainFunctions = function (funArray) {
            var fun, result, _i, _len;
            result = Q.resolve(0);
            for (_i = 0, _len = funArray.length; _i < _len; _i++) {
                fun = funArray[_i];
                result = result.then(fun, function (err) {
                    console.log('error message: ', err);
                    throw new Error('Error during execution: ', err);
                });
            }
            return result;
        };
        function RunnableNode(children) {
            this.children = children;
        }
        RunnableNode.prototype.before = function (context) {
            return new FunctionNode(function () {
                return 0;
            });
        };
        RunnableNode.prototype.after = function (context) {
            return new FunctionNode(function () {
                return 0;
            });
        };
        RunnableNode.prototype.numChildren = function () {
            return this.children.length;
        };
        RunnableNode.prototype.length = function () {
            return this.children.length;
        };
        RunnableNode.prototype.start = function (context) {
            var farray;
            farray = RunnableNode.functionList(_.flatten([
                this.before(context),
                this.children,
                this.after(context)
            ]), context, function (node) {
                return console.log('node done', node);
            });
            return RunnableNode.chainFunctions(farray);
        };
        RunnableNode.prototype.stop = function (context) {
        };
        return RunnableNode;
    }();
    exports.RunnableNode = RunnableNode;
    exports.FunctionNode = FunctionNode = function (_super) {
        __extends(FunctionNode, _super);
        function FunctionNode(fun) {
            this.fun = fun;
        }
        FunctionNode.prototype.start = function (context) {
            return Q.fcall(this.fun);
        };
        return FunctionNode;
    }(RunnableNode);
    functionNode = function (fun) {
        return new FunctionNode(fun);
    };
    exports.FeedbackNode = FeedbackNode = function (_super) {
        __extends(FeedbackNode, _super);
        function FeedbackNode(feedback) {
            this.feedback = feedback;
        }
        FeedbackNode.prototype.numChildren = function () {
            return 1;
        };
        FeedbackNode.prototype.length = function () {
            return 1;
        };
        FeedbackNode.prototype.start = function (context) {
            var args, event, idSet, obj, spec, _i, _len;
            if (this.feedback != null) {
                args = context.trialData().get();
                idSet = {};
                for (_i = 0, _len = args.length; _i < _len; _i++) {
                    obj = args[_i];
                    if (obj['id'] != null) {
                        idSet[obj['id']] = obj;
                    }
                }
                args = _.extend(args, idSet);
                spec = this.feedback.apply(args);
                event = context.stimFactory.buildEvent(spec, context);
                return event.start(context);
            } else {
                return Q(0);
            }
        };
        return FeedbackNode;
    }(RunnableNode);
    exports.Event = Event = function (_super) {
        __extends(Event, _super);
        function Event(stimulus, response) {
            this.stimulus = stimulus;
            this.response = response;
            Event.__super__.constructor.call(this, [this.response]);
        }
        Event.prototype.stop = function (context) {
            this.stimulus.stop(context);
            return this.response.stop(context);
        };
        Event.prototype.before = function (context) {
            var self, _this = this;
            self = this;
            return functionNode(function () {
                if (!context.exState.inPrelude) {
                    context.updateState(function () {
                        return context.exState.nextEvent(self);
                    });
                }
                if (!_this.stimulus.overlay) {
                    context.clearContent();
                }
                _this.stimulus.render(context, context.contentLayer);
                return context.draw();
            });
        };
        Event.prototype.after = function (context) {
            var _this = this;
            return functionNode(function () {
                return _this.stimulus.stop(context);
            });
        };
        Event.prototype.start = function (context) {
            return Event.__super__.start.call(this, context);
        };
        return Event;
    }(RunnableNode);
    exports.Trial = Trial = function (_super) {
        __extends(Trial, _super);
        function Trial(events, record, feedback, background) {
            if (events == null) {
                events = [];
            }
            this.record = record != null ? record : {};
            this.feedback = feedback;
            this.background = background;
            Trial.__super__.constructor.call(this, events);
        }
        Trial.prototype.numEvents = function () {
            return this.children.length;
        };
        Trial.prototype.push = function (event) {
            return this.children.push(event);
        };
        Trial.prototype.before = function (context) {
            var self, _this = this;
            self = this;
            return functionNode(function () {
                context.updateState(function () {
                    return context.exState.nextTrial(self);
                });
                context.clearBackground();
                if (_this.background != null) {
                    context.setBackground(_this.background);
                    return context.drawBackground();
                }
            });
        };
        Trial.prototype.after = function (context) {
            return new FeedbackNode(this.feedback);
        };
        Trial.prototype.start = function (context, callback) {
            var farray;
            farray = RunnableNode.functionList(_.flatten([
                this.before(context),
                this.children,
                this.after(context)
            ]), context, function (event) {
                return console.log('event callback', event);
            });
            return RunnableNode.chainFunctions(farray);
        };
        Trial.prototype.stop = function (context) {
        };
        return Trial;
    }(RunnableNode);
    exports.Block = Block = function (_super) {
        __extends(Block, _super);
        function Block(children, blockSpec) {
            this.blockSpec = blockSpec;
            Block.__super__.constructor.call(this, children);
        }
        Block.prototype.showEvent = function (spec, context) {
            var event;
            event = buildEvent(spec, context);
            return event.start(context);
        };
        Block.prototype.before = function (context) {
            var self, _this = this;
            self = this;
            return functionNode(function () {
                var args, spec;
                context.updateState(function () {
                    return context.exState.nextBlock(self);
                });
                if (_this.blockSpec != null && _this.blockSpec.Start) {
                    args = _.extend(context.exState.toRecord(), { context: context });
                    spec = _this.blockSpec.Start.apply(args);
                    return _this.showEvent(spec, context);
                } else {
                    return Q.fcall(0);
                }
            });
        };
        Block.prototype.after = function (context) {
            var _this = this;
            return functionNode(function () {
                var args, blockData, curid, ids, out, spec, _i, _len;
                if (_this.blockSpec != null && _this.blockSpec.End) {
                    blockData = context.blockData();
                    ids = _.unique(blockData.select('id'));
                    console.log('END ids', ids);
                    out = {};
                    for (_i = 0, _len = ids.length; _i < _len; _i++) {
                        curid = ids[_i];
                        out[curid] = DataTable.fromRecords(blockData.filter({ id: curid }).get());
                    }
                    args = _.extend(context.exState.toRecord(), { context: context }, out);
                    console.log('block end args');
                    spec = _this.blockSpec.End.apply(args);
                    return _this.showEvent(spec, context);
                } else {
                    return Q.fcall(0);
                }
            });
        };
        return Block;
    }(RunnableNode);
    exports.BlockSeq = BlockSeq = function (_super) {
        __extends(BlockSeq, _super);
        function BlockSeq(children) {
            BlockSeq.__super__.constructor.call(this, children);
        }
        return BlockSeq;
    }(RunnableNode);
    exports.Prelude = Prelude = function (_super) {
        __extends(Prelude, _super);
        function Prelude(children) {
            Prelude.__super__.constructor.call(this, children);
        }
        Prelude.prototype.before = function (context) {
            var _this = this;
            return functionNode(function () {
                return context.updateState(function () {
                    return context.exState.insidePrelude();
                });
            });
        };
        Prelude.prototype.after = function (context) {
            var _this = this;
            return functionNode(function () {
                return context.updateState(function () {
                    return context.exState.outsidePrelude();
                });
            });
        };
        return Prelude;
    }(RunnableNode);
    exports.Coda = Coda = function (_super) {
        __extends(Coda, _super);
        function Coda(children) {
            Coda.__super__.constructor.call(this, children);
        }
        return Coda;
    }(RunnableNode);
    exports.ExperimentState = ExperimentState = function () {
        function ExperimentState() {
            this.inPrelude = false;
            this.trial = {};
            this.block = {};
            this.event = {};
            this.blockNumber = 0;
            this.trialNumber = 0;
            this.eventNumber = 0;
            this.stimulus = {};
            this.response = {};
        }
        ExperimentState.prototype.insidePrelude = function () {
            var ret;
            ret = $.extend({}, this);
            ret.inPrelude = true;
            return ret;
        };
        ExperimentState.prototype.outsidePrelude = function () {
            var ret;
            ret = $.extend({}, this);
            ret.inPrelude = false;
            return ret;
        };
        ExperimentState.prototype.nextBlock = function (block) {
            var ret;
            ret = $.extend({}, this);
            ret.blockNumber = this.blockNumber + 1;
            ret.block = block;
            return ret;
        };
        ExperimentState.prototype.nextTrial = function (trial) {
            var ret;
            ret = $.extend({}, this);
            ret.trial = trial;
            ret.trialNumber = this.trialNumber + 1;
            return ret;
        };
        ExperimentState.prototype.nextEvent = function (event) {
            var ret;
            ret = $.extend({}, this);
            ret.event = event;
            ret.eventNumber = this.eventNumber + 1;
            return ret;
        };
        ExperimentState.prototype.toRecord = function () {
            var key, ret, value, _ref1, _ref10, _ref11, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
            ret = {
                blockNumber: this.blockNumber,
                trialNumber: this.trialNumber,
                eventNumber: this.eventNumber,
                stimulus: (_ref1 = this.event) != null ? (_ref2 = _ref1.stimulus) != null ? (_ref3 = _ref2.constructor) != null ? _ref3.name : void 0 : void 0 : void 0,
                response: (_ref4 = this.event) != null ? (_ref5 = _ref4.response) != null ? (_ref6 = _ref5.constructor) != null ? _ref6.name : void 0 : void 0 : void 0,
                stimulusID: (_ref7 = this.event) != null ? (_ref8 = _ref7.stimulus) != null ? _ref8.id : void 0 : void 0,
                responseID: (_ref9 = this.event) != null ? (_ref10 = _ref9.response) != null ? _ref10.id : void 0 : void 0
            };
            if (!_.isEmpty(this.trial) && this.trial.record != null) {
                _ref11 = this.trial.record;
                for (key in _ref11) {
                    value = _ref11[key];
                    ret[key] = value;
                }
            }
            return ret;
        };
        return ExperimentState;
    }();
    createContext = function (id) {
        var stage;
        if (id == null) {
            id = 'container';
        }
        stage = new Kinetic.Stage({
            container: id,
            width: $('#' + id).width(),
            height: $('#' + id).height()
        });
        return new KineticContext(stage);
    };
    exports.createContext = createContext;
    exports.ExperimentContext = ExperimentContext = function () {
        function ExperimentContext(stimFactory) {
            this.stimFactory = stimFactory;
            this.userData = TAFFY({});
            this.exState = new ExperimentState();
            this.eventData = new EventDataLog();
            this.log = [];
            this.trialNumber = 0;
            this.currentTrial = new Trial([], {});
            this.numBlocks = 0;
        }
        ExperimentContext.prototype.updateState = function (fun) {
            this.exState = fun(this.exState);
            return this.exState;
        };
        ExperimentContext.prototype.pushData = function (data, withState) {
            var record;
            if (withState == null) {
                withState = true;
            }
            console.log('pushing data', data);
            if (withState) {
                record = _.extend(this.exState.toRecord(), data);
            } else {
                record = data;
            }
            return this.userData.insert(record);
        };
        ExperimentContext.prototype.handleValue = function (arg) {
            if (arg != null && arg instanceof ResponseData) {
                return this.pushData(arg.data);
            }
        };
        ExperimentContext.prototype.width = function () {
            return 0;
        };
        ExperimentContext.prototype.height = function () {
            return 0;
        };
        ExperimentContext.prototype.offsetX = function () {
            return 0;
        };
        ExperimentContext.prototype.offsetY = function () {
            return 0;
        };
        ExperimentContext.prototype.centerX = function () {
            return this.width() / 2 + this.offsetX();
        };
        ExperimentContext.prototype.centerY = function () {
            return this.height() / 2 + this.offsetY();
        };
        ExperimentContext.prototype.screenInfo = function () {
            return {
                width: this.width(),
                height: this.height(),
                offset: {
                    x: this.offsetX(),
                    y: this.offsetY()
                },
                center: {
                    x: this.centerX(),
                    y: this.centerY()
                }
            };
        };
        ExperimentContext.prototype.logEvent = function (key, value) {
            var record;
            record = _.clone(this.currentTrial.record);
            record[key] = value;
            this.log.push(record);
            return console.log(this.log);
        };
        ExperimentContext.prototype.trialData = function () {
            var ret;
            ret = this.userData().filter({ trialNumber: this.exState.trialNumber });
            if (ret.length === 1) {
                return ret[0];
            } else {
                return ret;
            }
        };
        ExperimentContext.prototype.blockData = function (args) {
            if (args == null) {
                args = {
                    blockNum: null,
                    name: null
                };
            }
            if (args.blockNum == null) {
                args.blockNum = this.exState.blockNumber;
            }
            if (!args.name) {
                return this.userData().filter({ blockNumber: args.blockNum });
            } else {
                return this.userData().filter({ blockNumber: args.blockNum }).select(args.name);
            }
        };
        ExperimentContext.prototype.allData = function (args) {
            if (args == null) {
                args = { name: null };
            }
            if (!args.name) {
                return this.userData();
            } else {
                return this.userData().select(args.name);
            }
        };
        ExperimentContext.prototype.showEvent = function (event) {
            return event.start(this);
        };
        ExperimentContext.prototype.showStimulus = function (stimulus) {
            return stimulus.render(this);
        };
        ExperimentContext.prototype.start = function (blockList) {
            var error, farray;
            this.numBlocks = blockList.length();
            try {
                farray = RunnableNode.functionList(blockList, this, function (block) {
                    return console.log('block callback', block);
                });
                return RunnableNode.chainFunctions(farray);
            } catch (_error) {
                error = _error;
                return console.log('caught error:', error);
            }
        };
        ExperimentContext.prototype.clearContent = function () {
        };
        ExperimentContext.prototype.clearBackground = function () {
        };
        ExperimentContext.prototype.keydownStream = function () {
            return Bacon.fromEventTarget(window, 'keydown');
        };
        ExperimentContext.prototype.keypressStream = function () {
            return Bacon.fromEventTarget(window, 'keypress');
        };
        ExperimentContext.prototype.mousepressStream = function () {
        };
        ExperimentContext.prototype.draw = function () {
        };
        ExperimentContext.prototype.insertHTMLDiv = function () {
            $('canvas').css('position', 'absolute');
            $('#container').append('<div id="htmlcontainer" class="htmllayer"></div>');
            $('#htmlcontainer').css({
                position: 'absolute',
                'z-index': 999,
                outline: 'none',
                padding: '5px'
            });
            $('#container').attr('tabindex', 0);
            return $('#container').css('outline', 'none');
        };
        ExperimentContext.prototype.clearHtml = function () {
            $('#htmlcontainer').empty();
            return $('#htmlcontainer').hide();
        };
        ExperimentContext.prototype.appendHtml = function (input) {
            $('#htmlcontainer').addClass('htmllayer');
            $('#htmlcontainer').append(input);
            return $('#htmlcontainer').show();
        };
        ExperimentContext.prototype.hideHtml = function () {
            return $('#htmlcontainer').hide();
        };
        return ExperimentContext;
    }();
    KineticContext = function (_super) {
        __extends(KineticContext, _super);
        function KineticContext(stage) {
            this.stage = stage;
            KineticContext.__super__.constructor.call(this, new DefaultComponentFactory());
            this.contentLayer = new Kinetic.Layer({ clearBeforeDraw: true });
            this.backgroundLayer = new Kinetic.Layer({ clearBeforeDraw: true });
            this.background = new Background([], { fill: 'white' });
            this.stage.add(this.backgroundLayer);
            this.stage.add(this.contentLayer);
            this.insertHTMLDiv();
        }
        KineticContext.prototype.insertHTMLDiv = function () {
            KineticContext.__super__.insertHTMLDiv.apply(this, arguments);
            return $('.kineticjs-content').css('position', 'absolute');
        };
        KineticContext.prototype.setBackground = function (newBackground) {
            this.background = newBackground;
            this.backgroundLayer.removeChildren();
            return this.background.render(this, this.backgroundLayer);
        };
        KineticContext.prototype.drawBackground = function () {
            return this.backgroundLayer.draw();
        };
        KineticContext.prototype.clearBackground = function () {
            return this.backgroundLayer.removeChildren();
        };
        KineticContext.prototype.clearContent = function (draw) {
            if (draw == null) {
                draw = false;
            }
            this.clearHtml();
            this.backgroundLayer.draw();
            this.contentLayer.removeChildren();
            if (draw) {
                return this.draw();
            }
        };
        KineticContext.prototype.draw = function () {
            $('#container').focus();
            return this.contentLayer.draw();
        };
        KineticContext.prototype.width = function () {
            return this.stage.getWidth();
        };
        KineticContext.prototype.height = function () {
            return this.stage.getHeight();
        };
        KineticContext.prototype.offsetX = function () {
            return this.stage.getOffsetX();
        };
        KineticContext.prototype.offsetY = function () {
            return this.stage.getOffsetY();
        };
        KineticContext.prototype.showStimulus = function (stimulus) {
            return stimulus.render(this, this.contentLayer);
        };
        KineticContext.prototype.keydownStream = function () {
            return Bacon.fromEventTarget(window, 'keydown');
        };
        KineticContext.prototype.keypressStream = function () {
            return Bacon.fromEventTarget(window, 'keypress');
        };
        KineticContext.prototype.mousepressStream = function () {
            var MouseBus;
            MouseBus = function () {
                function MouseBus() {
                    var _this = this;
                    this.stream = new Bacon.Bus();
                    this.handler = function (x) {
                        return _this.stream.push(x);
                    };
                    this.stage.on('mousedown', this.handler);
                }
                MouseBus.prototype.stop = function () {
                    this.stage.off('mousedown', this.handler);
                    return this.stream.end();
                };
                return MouseBus;
            }();
            return new MouseBus();
        };
        return KineticContext;
    }(exports.ExperimentContext);
    exports.KineticContext = KineticContext;
    buildStimulus = function (spec, context) {
        var params, stimType;
        stimType = _.keys(spec)[0];
        params = _.values(spec)[0];
        console.log('stimType', stimType);
        console.log('params', params);
        return context.stimFactory.makeStimulus(stimType, params, context);
    };
    buildResponse = function (spec, context) {
        var params, responseType;
        responseType = _.keys(spec)[0];
        params = _.values(spec)[0];
        return context.stimFactory.makeResponse(responseType, params, context);
    };
    buildEvent = function (spec, context) {
        var response, responseSpec, stim, stimSpec;
        stimSpec = _.omit(spec, 'Next');
        responseSpec = _.pick(spec, 'Next');
        if (responseSpec == null || _.isEmpty(responseSpec)) {
            stim = buildStimulus(stimSpec, context);
            if (!stim instanceof Response) {
                throw new Error('buildEvent: Missing Response from event: ', spec);
            }
            return context.stimFactory.makeEvent(stim, stim, context);
        } else {
            stim = buildStimulus(stimSpec, context);
            response = buildResponse(responseSpec.Next, context);
            return context.stimFactory.makeEvent(stim, response, context);
        }
    };
    buildTrial = function (eventSpec, record, context, feedback, backgroundSpec) {
        var background, events, key, value;
        events = function () {
            var _results;
            _results = [];
            for (key in eventSpec) {
                value = eventSpec[key];
                _results.push(context.stimFactory.buildEvent(value));
            }
            return _results;
        }();
        if (backgroundSpec != null) {
            background = context.stimFactory.makeStimulus('Background', backgroundSpec);
            return new Trial(events, record, feedback, background);
        } else {
            return new Trial(events, record, feedback);
        }
    };
    makeEventSeq = function (spec, context) {
        var key, response, responseSpec, stim, stimSpec, value, _results;
        _results = [];
        for (key in spec) {
            value = spec[key];
            stimSpec = _.omit(value, 'Next');
            responseSpec = _.pick(value, 'Next');
            console.log('building stim', stimSpec);
            stim = buildStimulus(stimSpec, context);
            response = buildResponse(responseSpec.Next, context);
            _results.push(context.stimFactory.makeEvent(stim, response, context));
        }
        return _results;
    };
    buildPrelude = function (preludeSpec, context) {
        var events;
        events = makeEventSeq(preludeSpec, context);
        return new Prelude(events);
    };
    buildCoda = function (codaSpec, context) {
        var events;
        events = makeEventSeq(codaSpec, context);
        return new Coda(events);
    };
    __dummySpec = {
        Events: {
            1: {
                Nothing: '',
                Next: { Timeout: { duration: 0 } }
            }
        }
    };
    exports.Presenter = Presenter = function () {
        function Presenter(trialList, display, context) {
            this.trialList = trialList;
            this.display = display;
            this.context = context;
            this.trialBuilder = this.display.Trial;
            this.prelude = this.display.Prelude != null ? buildPrelude(this.display.Prelude.Events, this.context) : buildPrelude(__dummySpec.Events, this.context);
            this.coda = this.display.Coda != null ? buildCoda(this.display.Coda.Events, this.context) : (console.log('building dummy coda'), buildCoda(__dummySpec.Events, this.context));
        }
        Presenter.prototype.start = function () {
            var args, block, record, trialNum, trialSpec, trials, _this = this;
            this.blockList = new BlockSeq(function () {
                var _i, _len, _ref1, _results;
                _ref1 = this.trialList.blocks;
                _results = [];
                for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                    block = _ref1[_i];
                    trials = function () {
                        var _j, _ref2, _results1;
                        _results1 = [];
                        for (trialNum = _j = 0, _ref2 = block.length; 0 <= _ref2 ? _j < _ref2 : _j > _ref2; trialNum = 0 <= _ref2 ? ++_j : --_j) {
                            record = _.clone(block[trialNum]);
                            args = {};
                            args.trial = record;
                            args.screen = this.context.screenInfo();
                            trialSpec = this.trialBuilder.apply(args);
                            _results1.push(buildTrial(trialSpec.Events, record, this.context, trialSpec.Feedback, trialSpec.Background));
                        }
                        return _results1;
                    }.call(this);
                    _results.push(new Block(trials, this.display.Block));
                }
                return _results;
            }.call(this));
            return this.prelude.start(this.context).then(function () {
                return _this.blockList.start(_this.context);
            }).then(function () {
                console.log('inside coda');
                return _this.coda.start(_this.context);
            });
        };
        return Presenter;
    }();
    exports.Experiment = Experiment = function () {
        function Experiment(designSpec, stimFactory) {
            this.designSpec = designSpec;
            this.stimFactory = stimFactory != null ? stimFactory : new MockStimFactory();
            this.design = new ExpDesign(this.designSpec);
            this.display = this.designSpec.Display;
            this.trialGenerator = this.display.Trial;
        }
        Experiment.prototype.buildStimulus = function (event, context) {
            var params, stimType;
            stimType = _.keys(event)[0];
            params = _.values(event)[0];
            return this.stimFactory.makeStimulus(stimType, params, context);
        };
        Experiment.prototype.buildEvent = function (event, context) {
            var params, responseType;
            responseType = _.keys(event)[0];
            params = _.values(event)[0];
            return this.stimFactory.makeResponse(responseType, params, context);
        };
        Experiment.prototype.buildTrial = function (eventSpec, record, context) {
            var events, key, response, responseSpec, stim, stimSpec, value;
            events = function () {
                var _results;
                _results = [];
                for (key in eventSpec) {
                    value = eventSpec[key];
                    stimSpec = _.omit(value, 'Next');
                    responseSpec = _.pick(value, 'Next');
                    stim = this.buildStimulus(stimSpec);
                    response = this.buildResponse(responseSpec.Next);
                    _results.push(this.stimFactory.makeEvent(stim, response));
                }
                return _results;
            }.call(this);
            return new Trial(events, record);
        };
        Experiment.prototype.start = function (context) {
            var i, record, trialList, trialSpec, trials;
            trials = this.design.fullDesign;
            console.log(trials.nrow());
            trialList = function () {
                var _i, _ref1, _results;
                _results = [];
                for (i = _i = 0, _ref1 = trials.nrow(); 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
                    record = trials.record(i);
                    record.$trialNumber = i;
                    trialSpec = this.trialGenerator(record);
                    _results.push(this.buildTrial(trialSpec, record, context));
                }
                return _results;
            }.call(this);
            return context.start(trialList);
        };
        return Experiment;
    }();
    exports.letters = [
        'a',
        'b',
        'c',
        'd',
        'e',
        'd',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z'
    ];
    des = {
        Design: {
            Blocks: [
                [{
                        a: 1,
                        b: 2,
                        c: 3,
                        a: 2,
                        b: 3,
                        c: 4
                    }],
                [{
                        a: 5,
                        b: 7,
                        c: 6,
                        a: 5,
                        b: 7,
                        c: 6
                    }]
            ]
        }
    };
    console.log(des.Blocks);
    exports.buildStimulus = buildStimulus;
    exports.buildResponse = buildResponse;
    exports.buildEvent = buildEvent;
    exports.buildTrial = buildTrial;
    exports.buildPrelude = buildPrelude;
}.call(this));
});
require.define('77', function(module, exports, __dirname, __filename, undefined){
(function () {
    var DataTable, utils, _, __hasProp = {}.hasOwnProperty;
    _ = require('2', module);
    utils = require('76', module);
    DataTable = function () {
        function DataTable(vars) {
            var key, samelen, value, varlen;
            if (vars == null) {
                vars = {};
            }
            varlen = _.map(vars, function (x) {
                return x.length;
            });
            samelen = _.all(varlen, function (x) {
                return x === varlen[0];
            });
            if (!samelen) {
                throw 'arguments to DataTable must all have same length.';
            }
            for (key in vars) {
                value = vars[key];
                this[key] = value;
            }
        }
        DataTable.prototype.show = function () {
            var i, _i, _ref, _results;
            console.log('DataTable: rows: ' + this.nrow() + ' columns: ' + this.ncol());
            _results = [];
            for (i = _i = 0, _ref = this.nrow(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                _results.push(console.log(this.record(i)));
            }
            return _results;
        };
        DataTable.fromRecords = function (records, union) {
            var allkeys, key, rec, vars, _i, _j, _k, _len, _len1, _len2;
            if (union == null) {
                union = true;
            }
            if (!_.isArray(records)) {
                throw new Error('DataTable.fromRecords: \'records\' arguemnt must be an array of records.');
            }
            allkeys = _.uniq(_.flatten(_.map(records, function (rec) {
                return _.keys(rec);
            })));
            vars = {};
            for (_i = 0, _len = allkeys.length; _i < _len; _i++) {
                key = allkeys[_i];
                vars[key] = [];
            }
            for (_j = 0, _len1 = records.length; _j < _len1; _j++) {
                rec = records[_j];
                for (_k = 0, _len2 = allkeys.length; _k < _len2; _k++) {
                    key = allkeys[_k];
                    if (rec[key] != null) {
                        vars[key].push(rec[key]);
                    } else {
                        vars[key].push(null);
                    }
                }
            }
            return new DataTable(vars);
        };
        DataTable.build = function (vars) {
            if (vars == null) {
                vars = {};
            }
            return Object.seal(new DataTable(vars));
        };
        DataTable.rbind = function (tab1, tab2, union) {
            var col1, col2, keys1, keys2, name, out, sharedKeys, _i, _len;
            if (union == null) {
                union = false;
            }
            keys1 = _.keys(tab1);
            keys2 = _.keys(tab2);
            sharedKeys = union ? _.union(keys1, keys2) : _.intersection(keys1, keys2);
            out = {};
            for (_i = 0, _len = sharedKeys.length; _i < _len; _i++) {
                name = sharedKeys[_i];
                col1 = tab1[name];
                col2 = tab2[name];
                if (!col1) {
                    col1 = utils.repLen([null], tab1.nrow());
                }
                if (!col2) {
                    col2 = utils.repLen([null], tab2.nrow());
                }
                out[name] = col1.concat(col2);
            }
            return new DataTable(out);
        };
        DataTable.cbind = function (tab1, tab2) {
            var diffkeys, key, out, _i, _len;
            if (tab1.nrow() !== tab2.nrow()) {
                throw 'cbind requires arguments to have same number of rows';
            }
            out = _.cloneDeep(tab1);
            diffkeys = _.difference(_.keys(tab2), _.keys(tab1));
            for (_i = 0, _len = diffkeys.length; _i < _len; _i++) {
                key = diffkeys[_i];
                out[key] = tab2[key];
            }
            return out;
        };
        DataTable.expand = function (vars, unique, nreps) {
            var d, i, key, name, nargs, nm, nx, orep, out, r1, r2, r3, repfac, value, _i, _j, _results;
            if (vars == null) {
                vars = {};
            }
            if (unique == null) {
                unique = true;
            }
            if (nreps == null) {
                nreps = 1;
            }
            if (unique) {
                out = {};
                for (name in vars) {
                    value = vars[name];
                    out[name] = _.unique(value);
                }
                vars = out;
            }
            nargs = _.size(vars);
            nm = _.keys(vars);
            repfac = 1;
            d = _.map(vars, function (x) {
                return x.length;
            });
            orep = _.reduce(d, function (x, acc) {
                return x * acc;
            });
            out = {};
            for (key in vars) {
                value = vars[key];
                nx = value.length;
                orep = orep / nx;
                r1 = utils.rep([repfac], nx);
                r2 = utils.rep(function () {
                    _results = [];
                    for (var _i = 0; 0 <= nx ? _i < nx : _i > nx; 0 <= nx ? _i++ : _i--) {
                        _results.push(_i);
                    }
                    return _results;
                }.apply(this), r1);
                r3 = utils.rep(r2, orep);
                out[key] = function () {
                    var _j, _len, _results1;
                    _results1 = [];
                    for (_j = 0, _len = r3.length; _j < _len; _j++) {
                        i = r3[_j];
                        _results1.push(value[i]);
                    }
                    return _results1;
                }();
                repfac = repfac * nx;
            }
            if (nreps > 1) {
                for (i = _j = 1; 1 <= nreps ? _j <= nreps : _j >= nreps; i = 1 <= nreps ? ++_j : --_j) {
                    out = _.merge(out, out);
                }
            }
            return new DataTable(out);
        };
        DataTable.prototype.dropColumn = function (colname) {
            var key, out, value;
            out = {};
            for (key in this) {
                if (!__hasProp.call(this, key))
                    continue;
                value = this[key];
                if (key !== colname) {
                    out[key] = _.clone(value);
                }
            }
            return new DataTable(out);
        };
        DataTable.prototype.subset = function (key, filter) {
            var el, i, keep, name, out, val, value;
            keep = function () {
                var _i, _len, _ref, _results;
                _ref = this[key];
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    val = _ref[_i];
                    if (filter(val)) {
                        _results.push(true);
                    } else {
                        _results.push(false);
                    }
                }
                return _results;
            }.call(this);
            out = {};
            for (name in this) {
                if (!__hasProp.call(this, name))
                    continue;
                value = this[name];
                out[name] = function () {
                    var _i, _len, _results;
                    _results = [];
                    for (i = _i = 0, _len = value.length; _i < _len; i = ++_i) {
                        el = value[i];
                        if (keep[i] === true) {
                            _results.push(el);
                        }
                    }
                    return _results;
                }();
            }
            return new DataTable(out);
        };
        DataTable.prototype.whichRow = function (where) {
            var count, i, key, nkeys, out, rec, value, _i, _ref;
            out = [];
            nkeys = _.keys(where).length;
            for (i = _i = 0, _ref = this.nrow(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                rec = this.record(i);
                count = utils.asArray(function () {
                    var _results;
                    _results = [];
                    for (key in where) {
                        value = where[key];
                        _results.push(rec[key] === value);
                    }
                    return _results;
                }());
                count = _.map(count, function (x) {
                    if (x) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                count = _.reduce(utils.asArray(count), function (sum, num) {
                    return sum + num;
                });
                if (count === nkeys) {
                    out.push(i);
                }
            }
            return out;
        };
        DataTable.prototype.select = function (where) {
            var count, i, key, nkeys, out, rec, value, _i, _ref;
            out = [];
            nkeys = _.keys(where).length;
            for (i = _i = 0, _ref = this.nrow(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                rec = this.record(i);
                count = utils.asArray(function () {
                    var _results;
                    _results = [];
                    for (key in where) {
                        value = where[key];
                        _results.push(rec[key] === value);
                    }
                    return _results;
                }());
                count = _.map(count, function (x) {
                    if (x) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                count = _.reduce(utils.asArray(count), function (sum, num) {
                    return sum + num;
                });
                if (count === nkeys) {
                    out.push(rec);
                }
            }
            return out;
        };
        DataTable.prototype.nrow = function () {
            var lens, name, value;
            lens = function () {
                var _results;
                _results = [];
                for (name in this) {
                    if (!__hasProp.call(this, name))
                        continue;
                    value = this[name];
                    _results.push(value.length);
                }
                return _results;
            }.call(this);
            return _.max(lens);
        };
        DataTable.prototype.ncol = function () {
            return Object.keys(this).length;
        };
        DataTable.prototype.colnames = function () {
            return Object.keys(this);
        };
        DataTable.prototype.record = function (index) {
            var name, rec, value;
            rec = {};
            for (name in this) {
                if (!__hasProp.call(this, name))
                    continue;
                value = this[name];
                rec[name] = value[index];
            }
            return rec;
        };
        DataTable.prototype.replicate = function (nreps) {
            var name, out, value, _this = this;
            out = {};
            for (name in this) {
                if (!__hasProp.call(this, name))
                    continue;
                value = this[name];
                out[name] = _.flatten(_.times(nreps, function (n) {
                    return value;
                }));
            }
            return new DataTable(out);
        };
        DataTable.prototype.bindcol = function (name, column) {
            if (column.length !== this.nrow()) {
                throw 'new column must be same length as existing DataTable object: column.length is  ' + column.length + ' and this.length is  ' + this.nrow();
            }
            this[name] = column;
            return this;
        };
        DataTable.prototype.bindrow = function (rows) {
            var key, record, value, _i, _len;
            if (!_.isArray(rows)) {
                rows = [rows];
            }
            for (_i = 0, _len = rows.length; _i < _len; _i++) {
                record = rows[_i];
                console.log(record);
                for (key in record) {
                    if (!__hasProp.call(record, key))
                        continue;
                    value = record[key];
                    if (!_.has(this, key)) {
                        throw new Error('DataTable has no field named ' + key);
                    } else {
                        this[key].push(value);
                    }
                }
            }
            return this;
        };
        DataTable.prototype.shuffle = function () {
            var i, ind, nr, out, sind, _i, _j, _results;
            nr = this.nrow();
            ind = function () {
                _results = [];
                for (var _i = 0; 0 <= nr ? _i < nr : _i > nr; 0 <= nr ? _i++ : _i--) {
                    _results.push(_i);
                }
                return _results;
            }.apply(this);
            sind = _.shuffle(ind);
            out = [];
            for (i = _j = 0; 0 <= nr ? _j < nr : _j > nr; i = 0 <= nr ? ++_j : --_j) {
                out[i] = this.record(sind[i]);
            }
            return DataTable.fromRecords(out);
        };
        return DataTable;
    }();
    exports.DataTable = DataTable;
}.call(this));
});
require.define('76', function(module, exports, __dirname, __filename, undefined){
(function () {
    var getTimestamp, record, _, _ref, _ref1;
    _ = require('2', module);
    if (typeof window !== 'undefined' && window !== null ? (_ref = window.performance) != null ? _ref.now : void 0 : void 0) {
        getTimestamp = function () {
            return window.performance.now();
        };
    } else if (typeof window !== 'undefined' && window !== null ? (_ref1 = window.performance) != null ? _ref1.webkitNow : void 0 : void 0) {
        getTimestamp = function () {
            return window.performance.webkitNow();
        };
    } else {
        getTimestamp = function () {
            return new Date().getTime();
        };
    }
    exports.getTimestamp = getTimestamp;
    this.browserBackDisabled = false;
    exports.disableBrowserBack = function () {
        var rx;
        if (!this.browserBackDisabled) {
            rx = /INPUT|SELECT|TEXTAREA/i;
            this.browserBackDisabled = true;
            return $(document).bind('keydown keypress', function (e) {
                if (e.which === 8) {
                    if (!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly) {
                        return e.preventDefault();
                    }
                }
            });
        }
    };
    exports.module = function (name) {
        return global[name] = global[name] || {};
    };
    exports.asArray = function (value) {
        if (_.isArray(value)) {
            return value;
        } else if (_.isNumber(value) || _.isBoolean(value)) {
            return [value];
        } else {
            return _.toArray(value);
        }
    };
    exports.permute = function (input) {
        var main, permArr, usedChars;
        permArr = [];
        usedChars = [];
        exports.main = main = function (input) {
            var ch, i, _i, _ref2;
            for (i = _i = 0, _ref2 = input.length; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
                ch = input.splice(i, 1)[0];
                usedChars.push(ch);
                if (input.length === 0) {
                    permArr.push(usedChars.slice());
                }
                main(input);
                input.splice(i, 0, ch);
                usedChars.pop();
            }
            return permArr;
        };
        return main(input);
    };
    exports.rep = function (vec, times) {
        var el, i, j, out, _this = this;
        if (!(times instanceof Array)) {
            times = [times];
        }
        if (times.length !== 1 && vec.length !== times.length) {
            throw 'vec.length must equal times.length or times.length must be 1';
        }
        if (vec.length === times.length) {
            out = function () {
                var _i, _len, _results;
                _results = [];
                for (i = _i = 0, _len = vec.length; _i < _len; i = ++_i) {
                    el = vec[i];
                    _results.push(function () {
                        var _j, _ref2, _results1;
                        _results1 = [];
                        for (j = _j = 1, _ref2 = times[i]; 1 <= _ref2 ? _j <= _ref2 : _j >= _ref2; j = 1 <= _ref2 ? ++_j : --_j) {
                            _results1.push(el);
                        }
                        return _results1;
                    }());
                }
                return _results;
            }();
            return _.flatten(out);
        } else {
            out = _.times(times[0], function (n) {
                return vec;
            });
            return _.flatten(out);
        }
    };
    exports.repLen = function (vec, length) {
        var i, _i, _results;
        if (length < 1) {
            throw 'repLen: length must be greater than or equal to 1';
        }
        _results = [];
        for (i = _i = 0; 0 <= length ? _i < length : _i > length; i = 0 <= length ? ++_i : --_i) {
            _results.push(vec[i % vec.length]);
        }
        return _results;
    };
    exports.sample = function (elements, n, replace) {
        var i, _i, _results;
        if (replace == null) {
            replace = false;
        }
        if (n > elements.length && !replace) {
            throw 'cannot take sample larger than the number of elements when \'replace\' argument is false';
        }
        if (!replace) {
            return _.shuffle(elements).slice(0, n);
        } else {
            _results = [];
            for (i = _i = 0; 0 <= n ? _i < n : _i > n; i = 0 <= n ? ++_i : --_i) {
                _results.push(elements[Math.floor(Math.random() * elements.length)]);
            }
            return _results;
        }
    };
    exports.oneOf = function (elements) {
        return elements[Math.floor(Math.random() * elements.length)];
    };
    exports.doTimer = function (length, oncomplete) {
        var instance, start;
        start = getTimestamp();
        instance = function () {
            var diff, half;
            diff = getTimestamp() - start;
            if (diff >= length) {
                return oncomplete(diff);
            } else {
                half = Math.max((length - diff) / 2, 1);
                if (half < 20) {
                    half = 1;
                }
                return setTimeout(instance, half);
            }
        };
        return setTimeout(instance, 1);
    };
    exports.match = function (record, matcher) {
        var mkeys, rkeys;
        rkeys = _.keys(record);
        mkeys = _.keys(matcher);
        console.log('record keys', rkeys);
        return console.log('matcher keys', mkeys);
    };
    record = {};
    record.flanker = 'congruent';
    record.centerColor = 'red';
}.call(this));
});
require.define('82', function(module, exports, __dirname, __filename, undefined){
(function () {
    var KP;
    exports.Sound = require('84', module).Sound;
    exports.Confirm = require('85', module).Confirm;
    exports.First = require('86', module).First;
    exports.Group = require('87', module).Group;
    KP = require('88', module);
    exports.KeyPress = KP.KeyPress;
    exports.SpaceKey = KP.SpaceKey;
    exports.AnyKey = KP.AnyKey;
    exports.MousePress = require('89', module).MousePress;
    exports.Prompt = require('90', module).Prompt;
    exports.Sequence = require('91', module).Sequence;
    exports.Timeout = require('92', module).Timeout;
    exports.Click = require('93', module).Click;
    exports.Nothing = require('124', module).Nothing;
}.call(this));
});
require.define('93', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Click, Q, Response, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Q = require('9', module);
    Response = require('73', module).Response;
    Click = function (_super) {
        __extends(Click, _super);
        function Click(refid) {
            this.refid = refid;
            Click.__super__.constructor.call(this);
        }
        Click.prototype.activate = function (context) {
            var deferred, element, _this = this;
            element = context.stage.get('#' + this.refid);
            if (!element) {
                throw new Error('cannot find element with id' + this.refid);
            }
            deferred = Q.defer();
            element.on('click', function (ev) {
                return deferred.resolve(ev);
            });
            return deferred.promise;
        };
        return Click;
    }(Response);
    exports.Click = Click;
}.call(this));
});
require.define('92', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Q, Response, ResponseData, Timeout, utils, _ref, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    utils = require('76', module);
    Q = require('9', module);
    Response = require('73', module).Response;
    ResponseData = require('73', module).ResponseData;
    Timeout = function (_super) {
        __extends(Timeout, _super);
        function Timeout() {
            _ref = Timeout.__super__.constructor.apply(this, arguments);
            return _ref;
        }
        Timeout.prototype.defaults = { duration: 1000 };
        Timeout.prototype.activate = function (context) {
            var deferred, _this = this;
            deferred = Q.defer();
            utils.doTimer(this.spec.duration, function (diff) {
                var resp;
                resp = {
                    name: 'Timeout',
                    id: _this.id,
                    timeElapsed: diff,
                    timeRequested: _this.spec.duration
                };
                return deferred.resolve(new ResponseData(resp));
            });
            return deferred.promise;
        };
        return Timeout;
    }(Response);
    exports.Timeout = Timeout;
}.call(this));
});
require.define('91', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Q, Sequence, Stimulus, Timeout, utils, _, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Stimulus = require('73', module).Stimulus;
    Timeout = require('92', module).Timeout;
    Q = require('9', module);
    utils = require('76', module);
    _ = require('2', module);
    Sequence = function (_super) {
        __extends(Sequence, _super);
        function Sequence(stims, soa, clear, times) {
            var i;
            this.stims = stims;
            this.soa = soa;
            this.clear = clear != null ? clear : true;
            this.times = times != null ? times : 1;
            Sequence.__super__.constructor.call(this, {});
            if (this.soa.length !== this.stims.length) {
                this.soa = utils.repLen(this.soa, this.stims.length);
            }
            this.onsets = function () {
                var _i, _ref, _results;
                _results = [];
                for (i = _i = 0, _ref = this.soa.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                    _results.push(_.reduce(this.soa.slice(0, +i + 1 || 9000000000), function (x, acc) {
                        return x + acc;
                    }));
                }
                return _results;
            }.call(this);
        }
        Sequence.prototype.genseq = function (context, layer) {
            var deferred, _i, _ref, _results, _this = this;
            deferred = Q.defer();
            _.forEach(function () {
                _results = [];
                for (var _i = 0, _ref = this.stims.length; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
                    _results.push(_i);
                }
                return _results;
            }.apply(this), function (i) {
                var ev, stim;
                ev = new Timeout({ duration: _this.onsets[i] });
                stim = _this.stims[i];
                return ev.activate(context).then(function () {
                    if (!_this.stopped) {
                        if (_this.clear) {
                            context.clearContent();
                        }
                        stim.render(context, layer);
                        context.draw();
                    }
                    if (i === _this.stims.length - 1) {
                        return deferred.resolve(1);
                    }
                });
            });
            return deferred.promise;
        };
        Sequence.prototype.render = function (context, layer) {
            var i, result, _i, _ref, _this = this;
            result = Q.resolve(0);
            for (i = _i = 0, _ref = this.times; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                result = result.then(function () {
                    return _this.genseq(context, layer);
                });
            }
            return result.then(function () {
                return context.clearContent();
            });
        };
        return Sequence;
    }(Stimulus);
    exports.Sequence = Sequence;
}.call(this));
});
require.define('90', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Prompt, Q, Response, utils, _ref, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    utils = require('76', module);
    Q = require('9', module);
    Response = require('73', module).Response;
    Prompt = function (_super) {
        __extends(Prompt, _super);
        function Prompt() {
            _ref = Prompt.__super__.constructor.apply(this, arguments);
            return _ref;
        }
        Prompt.prototype.defaults = {
            title: 'Prompt',
            delay: 0,
            defaultValue: '',
            theme: 'vex-theme-wireframe'
        };
        Prompt.prototype.activate = function (context) {
            var deferred, promise, _this = this;
            deferred = Q.defer();
            promise = Q.delay(this.spec.delay);
            promise.then(function (f) {
                return vex.dialog.prompt({
                    message: _this.spec.title,
                    placeholder: _this.spec.defaultValue,
                    className: 'vex-theme-wireframe',
                    callback: function (value) {
                        return deferred.resolve(value);
                    }
                });
            });
            return deferred.promise;
        };
        return Prompt;
    }(Response);
    exports.Prompt = Prompt;
}.call(this));
});
require.define('89', function(module, exports, __dirname, __filename, undefined){
(function () {
    var MousePress, Q, Response, ResponseData, utils, _ref, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Q = require('9', module);
    Response = require('73', module).Response;
    ResponseData = require('73', module).ResponseData;
    utils = require('76', module);
    MousePress = function (_super) {
        __extends(MousePress, _super);
        function MousePress() {
            _ref = MousePress.__super__.constructor.apply(this, arguments);
            return _ref;
        }
        MousePress.prototype.activate = function (context) {
            var deferred, mouse, myname, _this = this;
            this.startTime = utils.getTimestamp();
            myname = this.name;
            deferred = Q.defer();
            mouse = context.mousepressStream();
            mouse.stream.take(1).onValue(function (event) {
                var resp, timestamp;
                timestamp = utils.getTimestamp();
                mouse.stop();
                resp = {
                    name: myname,
                    id: _this.id,
                    KeyTime: timestamp,
                    RT: timestamp - _this.startTime,
                    Accuracy: Acc
                };
                return deferred.resolve(new ResponseData(resp));
            });
            return deferred.promise;
        };
        return MousePress;
    }(Response);
    exports.MousePress = MousePress;
}.call(this));
});
require.define('88', function(module, exports, __dirname, __filename, undefined){
(function () {
    var AnyKey, KeyPress, KeyResponse, Q, Response, ResponseData, SpaceKey, i, keyTable, utils, _, _i, _j, _ref, _ref1, _ref2, _ref3, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Q = require('9', module);
    Response = require('73', module).Response;
    ResponseData = require('73', module).ResponseData;
    utils = require('76', module);
    _ = require('2', module);
    keyTable = {
        8: 'backspace',
        9: 'tab',
        13: 'enter',
        16: 'shift',
        17: 'ctrl',
        18: 'alt',
        20: 'capslock',
        27: 'esc',
        32: 'space',
        33: 'pageup',
        34: 'pagedown',
        35: 'end',
        36: 'home',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        45: 'ins',
        46: 'del',
        91: 'meta',
        93: 'meta',
        224: 'meta',
        106: '*',
        107: '+',
        109: '-',
        110: '.',
        111: '/',
        186: ';',
        187: '=',
        188: ',',
        189: '-',
        190: '.',
        191: '/',
        192: '`',
        219: '[',
        220: '\\',
        221: ']'
    };
    for (i = _i = 1; _i < 20; i = ++_i) {
        keyTable[111 + i] = 'f' + i;
    }
    for (i = _j = 1; _j <= 9; i = ++_j) {
        keyTable[i + 96];
    }
    KeyResponse = function (_super) {
        __extends(KeyResponse, _super);
        function KeyResponse() {
            _ref = KeyResponse.__super__.constructor.apply(this, arguments);
            return _ref;
        }
        KeyResponse.prototype.defaults = {
            keys: [
                '1',
                '2'
            ],
            correct: ['1']
        };
        return KeyResponse;
    }(Response);
    KeyPress = function (_super) {
        __extends(KeyPress, _super);
        function KeyPress() {
            _ref1 = KeyPress.__super__.constructor.apply(this, arguments);
            return _ref1;
        }
        KeyPress.prototype.createResponseData = function (timeStamp, startTime, Acc, char) {
            var resp;
            resp = {
                name: this.name,
                id: this.id,
                KeyTime: timeStamp,
                RT: timeStamp - startTime,
                Accuracy: Acc,
                KeyChar: char
            };
            return resp;
        };
        KeyPress.prototype.activate = function (context) {
            var deferred, keyStream, _this = this;
            this.startTime = utils.getTimestamp();
            deferred = Q.defer();
            keyStream = context.keypressStream();
            keyStream.filter(function (event) {
                var char;
                char = String.fromCharCode(event.keyCode);
                return _.contains(_this.spec.keys, char);
            }).take(1).onValue(function (filtered) {
                var Acc, resp, timeStamp;
                timeStamp = utils.getTimestamp();
                Acc = _.contains(_this.spec.correct, String.fromCharCode(filtered.keyCode));
                resp = _this.createResponseData(timeStamp, _this.startTime, Acc, String.fromCharCode(filtered.keyCode));
                return deferred.resolve(new ResponseData(resp));
            });
            return deferred.promise;
        };
        return KeyPress;
    }(KeyResponse);
    exports.KeyPress = KeyPress;
    SpaceKey = function (_super) {
        __extends(SpaceKey, _super);
        function SpaceKey() {
            _ref2 = SpaceKey.__super__.constructor.apply(this, arguments);
            return _ref2;
        }
        SpaceKey.prototype.activate = function (context) {
            var deferred, keyStream, _this = this;
            this.startTime = utils.getTimestamp();
            deferred = Q.defer();
            keyStream = context.keypressStream();
            keyStream.filter(function (event) {
                return event.keyCode === 32;
            }).take(1).onValue(function (event) {
                var resp, timeStamp;
                timeStamp = utils.getTimestamp();
                resp = {
                    name: 'SpaceKey',
                    id: _this.id,
                    KeyTime: timeStamp,
                    RT: timeStamp - _this.startTime,
                    KeyChar: 'space'
                };
                return deferred.resolve(new ResponseData(resp));
            });
            return deferred.promise;
        };
        return SpaceKey;
    }(Response);
    AnyKey = function (_super) {
        __extends(AnyKey, _super);
        function AnyKey() {
            _ref3 = AnyKey.__super__.constructor.apply(this, arguments);
            return _ref3;
        }
        AnyKey.prototype.activate = function (context) {
            var deferred, keyStream, _this = this;
            this.startTime = utils.getTimestamp();
            deferred = Q.defer();
            keyStream = context.keypressStream();
            keyStream.take(1).onValue(function (event) {
                var resp, timeStamp;
                timeStamp = utils.getTimestamp();
                resp = {
                    name: 'AnyKey',
                    id: _this.id,
                    KeyTime: timeStamp,
                    RT: timeStamp - _this.startTime,
                    KeyChar: String.fromCharCode(event.keyCode)
                };
                return deferred.resolve(new ResponseData(resp));
            });
            return deferred.promise;
        };
        return AnyKey;
    }(Response);
    exports.SpaceKey = SpaceKey;
    exports.AnyKey = AnyKey;
}.call(this));
});
require.define('87', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Group, Stimulus, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Stimulus = require('73', module).Stimulus;
    Group = function (_super) {
        __extends(Group, _super);
        function Group(stims, layout) {
            var stim, _i, _len, _ref;
            this.stims = stims;
            Group.__super__.constructor.call(this, {});
            if (layout) {
                this.layout = layout;
                _ref = this.stims;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    stim = _ref[_i];
                    stim.layout = layout;
                }
            }
        }
        Group.prototype.render = function (context, layer) {
            var stim, _i, _len, _ref, _results;
            _ref = this.stims;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                stim = _ref[_i];
                _results.push(stim.render(context, layer));
            }
            return _results;
        };
        return Group;
    }(Stimulus);
    exports.Group = Group;
}.call(this));
});
require.define('86', function(module, exports, __dirname, __filename, undefined){
(function () {
    var First, Q, Response, _, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    _ = require('2', module);
    Q = require('9', module);
    Response = require('73', module).Response;
    First = function (_super) {
        __extends(First, _super);
        function First(responses) {
            this.responses = responses;
            First.__super__.constructor.call(this, {});
        }
        First.prototype.activate = function (context) {
            var deferred, _done, _this = this;
            console.log('activating first');
            _done = false;
            deferred = Q.defer();
            _.forEach(this.responses, function (resp) {
                return resp.activate(context).then(function (obj) {
                    if (!_done) {
                        console.log('resolving response', obj);
                        deferred.resolve(obj);
                        return _done = true;
                    } else {
                        return console.log('not resolving, already done');
                    }
                });
            });
            return deferred.promise;
        };
        return First;
    }(Response);
    exports.First = First;
}.call(this));
});
require.define('85', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Confirm, Q, Response, _ref, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Q = require('9', module);
    Response = require('73', module).Response;
    Confirm = function (_super) {
        __extends(Confirm, _super);
        function Confirm() {
            _ref = Confirm.__super__.constructor.apply(this, arguments);
            return _ref;
        }
        Confirm.prototype.defaults = {
            message: '',
            delay: 0,
            defaultValue: '',
            theme: 'vex-theme-wireframe'
        };
        Confirm.prototype.activate = function (context) {
            var deferred, promise, _this = this;
            console.log('activating confirm dialog');
            deferred = Q.defer();
            promise = Q.delay(this.spec.delay);
            promise.then(function (f) {
                console.log('rendering confirm dialog');
                return vex.dialog.confirm({
                    message: _this.spec.message,
                    className: _this.spec.theme,
                    callback: function (value) {
                        return deferred.resolve(value);
                    }
                });
            });
            return deferred.promise;
        };
        return Confirm;
    }(Response);
    exports.Confirm = Confirm;
}.call(this));
});
require.define('84', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Sound, Stimulus, buzz, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Stimulus = require('73', module).Stimulus;
    buzz = require('11', module);
    Sound = function (_super) {
        __extends(Sound, _super);
        Sound.prototype.defaults = { url: 'http://www.centraloutdoors.com/mp3/sheep/sheep.wav' };
        function Sound(spec) {
            if (spec == null) {
                spec = {};
            }
            Sound.__super__.constructor.call(this, spec);
            this.sound = new buzz.sound(this.spec.url);
        }
        Sound.prototype.render = function (context, layer) {
            return this.sound.play();
        };
        return Sound;
    }(Stimulus);
    exports.Sound = Sound;
}.call(this));
});
require.define('81', function(module, exports, __dirname, __filename, undefined){
(function () {
    var HMixResp, HMixStim, Html, HtmlMixin, HtmlResponse, HtmlStimulus, Mixen, Response, Stimulus, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Stimulus = require('73', module).Stimulus;
    Response = require('73', module).Response;
    Mixen = require('31', module);
    HtmlMixin = function () {
        HtmlMixin.prototype.tag = 'div';
        HtmlMixin.prototype.div = function () {
            return $(document.createElement('div'));
        };
        function HtmlMixin() {
            this.el = document.createElement(this.tag);
            this.el = $(this.el);
        }
        HtmlMixin.prototype.positionElement = function (el, x, y) {
            console.log('placing element at', x, y);
            return el.css({
                position: 'absolute',
                left: x,
                top: y
            });
        };
        HtmlMixin.prototype.centerElement = function (el) {
            return el.css({
                margin: '0 auto',
                position: 'absolute',
                left: '50%',
                top: '50%'
            });
        };
        return HtmlMixin;
    }();
    HMixStim = Mixen(HtmlMixin, Stimulus);
    HMixResp = Mixen(HtmlMixin, Response);
    HtmlStimulus = function (_super) {
        __extends(HtmlStimulus, _super);
        function HtmlStimulus() {
            HtmlStimulus.__super__.constructor.apply(this, arguments);
        }
        HtmlStimulus.prototype.render = function (context, layer) {
            var coords;
            this.el.hide();
            context.appendHtml(this.el);
            coords = this.computeCoordinates(context, this.spec.position, this.el.width(), this.el.height());
            console.log('coords', coords);
            this.positionElement(this.el, coords[0], coords[1]);
            this.el.show();
            console.log('element width is', this.el.width());
            console.log('element height is', this.el.height());
            console.log('spec.position', this.spec.position);
            console.log('spec.x', this.spec.x);
            console.log('spec.y', this.spec.y);
            return HtmlStimulus.__super__.render.call(this, context, layer);
        };
        return HtmlStimulus;
    }(HMixStim);
    HtmlResponse = function (_super) {
        __extends(HtmlResponse, _super);
        function HtmlResponse() {
            HtmlResponse.__super__.constructor.apply(this, arguments);
        }
        return HtmlResponse;
    }(HMixResp);
    exports.HtmlStimulus = HtmlStimulus;
    exports.HtmlResponse = HtmlResponse;
    Html = {};
    Html.HtmlButton = require('94', module).HtmlButton;
    Html.HtmlLink = require('95', module).HtmlLink;
    Html.HtmlLabel = require('96', module).HtmlLabel;
    Html.HtmlIcon = require('97', module).HtmlIcon;
    Html.Instructions = require('98', module).Instructions;
    Html.Markdown = require('99', module).Markdown;
    Html.Message = require('100', module).Message;
    Html.Page = require('101', module).Page;
    Html.HtmlResponse = HtmlResponse;
    Html.HtmlStimulus = HtmlStimulus;
    exports.Html = Html;
}.call(this));
});
require.define('101', function(module, exports, __dirname, __filename, undefined){
(function () {
    var HtmlStimulus, Page, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    HtmlStimulus = require('81', module).HtmlStimulus;
    Page = function (_super) {
        __extends(Page, _super);
        Page.prototype.defaults = { html: '<p>HTML Page</p>' };
        function Page(spec) {
            if (spec == null) {
                spec = {};
            }
            Page.__super__.constructor.call(this, spec);
            this.el.append(this.spec.html);
        }
        Page.prototype.render = function (context, layer) {
            return context.appendHtml(this.el);
        };
        return Page;
    }(HtmlStimulus);
    exports.Page = Page;
}.call(this));
});
require.define('100', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Message, html, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    html = require('81', module);
    Message = function (_super) {
        __extends(Message, _super);
        Message.prototype.defaults = {
            title: 'Message!',
            content: 'your content here',
            color: '',
            size: 'large'
        };
        function Message(spec) {
            if (spec == null) {
                spec = {};
            }
            Message.__super__.constructor.call(this, spec);
            this.el.addClass(this.messageClass());
            this.title = $('<div>' + this.spec.title + '</div>').addClass('header');
            this.content = $('<p>' + this.spec.content + '</p>');
            this.el.append(this.title);
            this.el.append(this.content);
        }
        Message.prototype.messageClass = function () {
            return 'ui message ' + this.spec.color + ' ' + this.spec.size;
        };
        return Message;
    }(html.HtmlStimulus);
    exports.Message = Message;
}.call(this));
});
require.define('99', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Markdown, html, marked, _, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    html = require('81', module);
    marked = require('40', module);
    _ = require('2', module);
    Markdown = function (_super) {
        __extends(Markdown, _super);
        function Markdown(spec) {
            var _this = this;
            if (spec == null) {
                spec = {};
            }
            Markdown.__super__.constructor.call(this, spec);
            if (_.isString(spec)) {
                this.spec = {};
                this.spec.content = spec;
            }
            if (this.spec.url != null) {
                $.ajax({
                    url: this.spec.url,
                    success: function (result) {
                        _this.spec.content = result;
                        return _this.el.append(marked(_this.spec.content));
                    },
                    error: function (result) {
                        return console.log('ajax failure', result);
                    }
                });
            } else {
                this.el.append($(marked(this.spec.content)));
            }
            this.el.addClass('markdown');
        }
        return Markdown;
    }(html.HtmlStimulus);
    exports.Markdown = Markdown;
}.call(this));
});
require.define('98', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Instructions, Markdown, Q, html, _, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    html = require('81', module);
    Q = require('9', module);
    Markdown = require('99', module).Markdown;
    _ = require('2', module);
    Instructions = function (_super) {
        __extends(Instructions, _super);
        function Instructions(spec) {
            var content, div, i, itm, key, md, type, value;
            if (spec == null) {
                spec = {};
            }
            Instructions.__super__.constructor.call(this, spec);
            this.pages = function () {
                var _ref, _results;
                _ref = this.spec.pages;
                _results = [];
                for (key in _ref) {
                    value = _ref[key];
                    type = _.keys(value)[0];
                    content = _.values(value)[0];
                    md = new Markdown(content);
                    div = this.div();
                    div.addClass('ui stacked segment').append(md.el);
                    _results.push(div);
                }
                return _results;
            }.call(this);
            this.menu = this.div();
            this.menu.addClass('ui borderless pagination menu');
            this.back = $('<a class="item">\n  <i class="icon left arrow"></i>  Previous\n </a>').attr('id', 'instructions_back');
            this.next = $('<a class="item">\nNext <i class="icon right arrow"></i>\n</a>').attr('id', 'instructions_next');
            this.menu.append(this.back).append('\n');
            this.items = function () {
                var _i, _ref, _results;
                _results = [];
                for (i = _i = 1, _ref = this.pages.length; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
                    itm = $('<a class="item">' + i + ' of ' + this.pages.length + '</a>');
                    this.menu.append(itm).append('\n');
                    _results.push(itm);
                }
                return _results;
            }.call(this);
            this.items[0].addClass('active');
            this.menu.append(this.next).css('position', 'absolute').css('right', '15px');
            this.currentPage = 0;
            this.el.append(this.pages[this.currentPage]);
            this.el.append(this.menu);
        }
        Instructions.prototype.activate = function (context) {
            this.deferred = Q.defer();
            return this.deferred.promise;
        };
        Instructions.prototype.updateEl = function (currentPage) {
            this.el.empty();
            this.el.append(this.pages[this.currentPage]);
            return this.el.append(this.menu);
        };
        Instructions.prototype.render = function (context, layer) {
            var _this = this;
            this.next.click(function (e) {
                if (_this.currentPage < _this.pages.length - 1) {
                    _this.items[_this.currentPage].removeClass('active');
                    _this.currentPage += 1;
                    _this.items[_this.currentPage].addClass('active');
                    _this.updateEl(_this.currentPage);
                    return _this.render(context);
                } else {
                    return _this.deferred.resolve(0);
                }
            });
            this.back.click(function (e) {
                if (_this.currentPage > 0) {
                    _this.items[_this.currentPage].removeClass('active');
                    _this.currentPage -= 1;
                    _this.items[_this.currentPage].addClass('active');
                    _this.updateEl(_this.currentPage);
                    return _this.render(context);
                }
            });
            if (this.currentPage > 0) {
                this.back.removeClass('disabled');
            }
            $(this.pages[this.currentPage]).css({ 'min-height': context.height() - 50 });
            return context.appendHtml(this.el);
        };
        return Instructions;
    }(html.HtmlResponse);
    exports.Instructions = Instructions;
}.call(this));
});
require.define('97', function(module, exports, __dirname, __filename, undefined){
(function () {
    var HtmlIcon, html, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    html = require('81', module);
    HtmlIcon = function (_super) {
        __extends(HtmlIcon, _super);
        HtmlIcon.prototype.defaults = {
            glyph: 'plane',
            size: 'massive'
        };
        function HtmlIcon(spec) {
            if (spec == null) {
                spec = {};
            }
            HtmlIcon.__super__.constructor.call(this, spec);
            this.html = $('<i></i>');
            this.html.addClass(this.spec.glyph + ' ' + this.spec.size + ' icon');
            this.el.append(this.html);
        }
        return HtmlIcon;
    }(html.HtmlStimulus);
    exports.HtmlIcon = HtmlIcon;
}.call(this));
});
require.define('96', function(module, exports, __dirname, __filename, undefined){
(function () {
    var HtmlLabel, html, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    html = require('81', module);
    HtmlLabel = function (_super) {
        __extends(HtmlLabel, _super);
        HtmlLabel.prototype.defaults = {
            glyph: null,
            size: 'large',
            text: 'label',
            color: 'orange'
        };
        function HtmlLabel(spec) {
            if (spec == null) {
                spec = {};
            }
            HtmlLabel.__super__.constructor.call(this, spec);
            this.el.addClass('ui ' + this.spec.color + ' ' + this.spec.size + ' label');
            this.el.append(this.spec.text + ' ');
            if (this.spec.glyph != null) {
                this.el.append('<i class="' + this.spec.glyph + ' ' + this.spec.size + '  icon"></i>');
            }
        }
        return HtmlLabel;
    }(html.HtmlStimulus);
    exports.HtmlLabel = HtmlLabel;
}.call(this));
});
require.define('95', function(module, exports, __dirname, __filename, undefined){
(function () {
    var HtmlLink, html, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    html = require('81', module);
    HtmlLink = function (_super) {
        __extends(HtmlLink, _super);
        HtmlLink.prototype.defaults = { label: 'link' };
        function HtmlLink(spec) {
            if (spec == null) {
                spec = {};
            }
            HtmlLink.__super__.constructor.call(this, spec);
            this.html = $('<a href=\'#\'>' + this.spec.label + '</a>');
            this.el.append(this.html);
            this.positionElement(this.el);
        }
        return HtmlLink;
    }(html.HtmlStimulus);
    exports.HtmlLink = HtmlLink;
}.call(this));
});
require.define('94', function(module, exports, __dirname, __filename, undefined){
(function () {
    var HtmlButton, html, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    html = require('81', module);
    HtmlButton = function (_super) {
        __extends(HtmlButton, _super);
        HtmlButton.prototype.defaults = {
            label: 'Next',
            'class': ''
        };
        function HtmlButton(spec) {
            if (spec == null) {
                spec = {};
            }
            HtmlButton.__super__.constructor.call(this, spec);
            this.el.addClass('ui button');
            this.el.addClass(this.spec['class']);
            this.el.append(this.spec.label);
            this.positionElement(this.el);
        }
        return HtmlButton;
    }(html.HtmlStimulus);
    exports.HtmlButton = HtmlButton;
}.call(this));
});
require.define('80', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Canvas;
    Canvas = {};
    Canvas.Arrow = require('102', module).Arrow;
    Canvas.Background = require('79', module).Background;
    Canvas.Blank = require('103', module).Blank;
    Canvas.Circle = require('104', module).Circle;
    Canvas.Clear = require('105', module).Clear;
    Canvas.FixationCross = require('106', module).FixationCross;
    Canvas.CanvasBorder = require('107', module).CanvasBorder;
    Canvas.GridLines = require('108', module).GridLines;
    Canvas.Picture = require('109', module).Picture;
    Canvas.Rectangle = require('110', module).Rectangle;
    Canvas.StartButton = require('111', module).StartButton;
    Canvas.Text = require('112', module).Text;
    Canvas.TextInput = require('113', module).TextInput;
    exports.Canvas = Canvas;
}.call(this));
});
require.define('113', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Kinetic, Stimulus, TextInput, utils, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Stimulus = require('73', module).Stimulus;
    utils = require('76', module);
    Kinetic = require('27', module).Kinetic;
    TextInput = function (_super) {
        __extends(TextInput, _super);
        TextInput.prototype.defaults = {
            x: 100,
            y: 100,
            width: 200,
            height: 40,
            defaultValue: '',
            fill: '#FAF5E6',
            stroke: '#0099FF',
            strokeWidth: 1,
            content: ''
        };
        function TextInput(spec) {
            if (spec == null) {
                spec = {};
            }
            TextInput.__super__.constructor.call(this, spec);
            utils.disableBrowserBack();
        }
        TextInput.prototype.getChar = function (e) {
            if (e.keyCode !== 16) {
                if (e.keyCode >= 65 && e.keyCode <= 90) {
                    if (e.shiftKey) {
                        return String.fromCharCode(e.keyCode);
                    } else {
                        return String.fromCharCode(e.keyCode + 32);
                    }
                } else if (e.keyCode >= 48 && e.keyCode <= 57) {
                    return String.fromCharCode(e.keyCode);
                } else {
                    switch (e.keyCode) {
                    case 186:
                        return ';';
                    case 187:
                        return '=';
                    case 188:
                        return ',';
                    case 189:
                        return '-';
                    default:
                        return '';
                    }
                }
            } else {
                return String.fromCharCode(e.keyCode);
            }
        };
        TextInput.prototype.animateCursor = function (layer, cursor) {
            var flashTime, _this = this;
            flashTime = 0;
            return new Kinetic.Animation(function (frame) {
                if (frame.time > flashTime + 500) {
                    flashTime = frame.time;
                    if (cursor.getOpacity() === 1) {
                        cursor.setOpacity(0);
                    } else {
                        cursor.setOpacity(1);
                    }
                    return layer.draw();
                }
            }, layer);
        };
        TextInput.prototype.render = function (context, layer) {
            var cursor, cursorBlink, enterPressed, fsize, group, keyStream, text, textContent, textRect, _this = this;
            textRect = new Kinetic.Rect({
                x: this.spec.x,
                y: this.spec.y,
                width: this.spec.width,
                height: this.spec.height,
                fill: this.spec.fill,
                cornerRadius: 4,
                lineJoin: 'round',
                stroke: this.spec.stroke,
                strokeWidth: this.spec.strokeWidth
            });
            textContent = this.spec.content;
            fsize = 0.85 * this.spec.height;
            text = new Kinetic.Text({
                text: this.spec.content,
                x: this.spec.x + 2,
                y: this.spec.y - 5,
                height: this.spec.height,
                fontSize: fsize,
                fill: 'black',
                padding: 10,
                align: 'left'
            });
            cursor = new Kinetic.Rect({
                x: text.getX() + text.getWidth() - 7,
                y: this.spec.y + 5,
                width: 1.5,
                height: text.getHeight() - 10,
                fill: 'black'
            });
            enterPressed = false;
            keyStream = context.keydownStream();
            keyStream.takeWhile(function (x) {
                return enterPressed === false && !_this.stopped;
            }).onValue(function (event) {
                var char;
                if (event.keyCode === 13) {
                    return enterPressed = true;
                } else if (event.keyCode === 8) {
                    textContent = textContent.slice(0, -1);
                    text.setText(textContent);
                    cursor.setX(text.getX() + text.getWidth() - 7);
                    return layer.draw();
                } else if (text.getWidth() > textRect.getWidth()) {
                } else {
                    char = _this.getChar(event);
                    textContent += char;
                    text.setText(textContent);
                    cursor.setX(text.getX() + text.getWidth() - 7);
                    return layer.draw();
                }
            });
            cursorBlink = this.animateCursor(layer, cursor);
            cursorBlink.start();
            group = new Kinetic.Group({});
            group.add(textRect);
            group.add(cursor);
            group.add(text);
            return layer.add(group);
        };
        return TextInput;
    }(Stimulus);
    exports.TextInput = TextInput;
}.call(this));
});
require.define('112', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Kinetic, Stimulus, Text, layout, _, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Stimulus = require('73', module).Stimulus;
    layout = require('74', module);
    Kinetic = require('27', module).Kinetic;
    _ = require('2', module);
    Text = function (_super) {
        __extends(Text, _super);
        Text.prototype.defaults = {
            content: 'Text',
            x: 5,
            y: 5,
            width: null,
            fill: 'black',
            fontSize: 40,
            fontFamily: 'Arial',
            textAlign: 'center',
            position: null
        };
        function Text(spec) {
            if (spec == null) {
                spec = {};
            }
            Text.__super__.constructor.call(this, spec);
            if (_.isArray(this.spec.content)) {
                this.spec.content = this.spec.content.join('\n');
                if (spec.lineHeight == null) {
                    this.spec.lineHeight = 2;
                }
            }
        }
        Text.prototype.render = function (context, layer) {
            var coords, text;
            text = new Kinetic.Text({
                x: 0,
                y: 0,
                text: this.spec.content,
                fontSize: this.spec.fontSize,
                fontFamily: this.spec.fontFamily,
                fill: this.spec.fill,
                lineHeight: this.spec.lineHeight || 1,
                width: this.spec.width,
                listening: false,
                align: this.spec.textAlign
            });
            coords = this.computeCoordinates(context, this.spec.position, text.getWidth(), text.getHeight());
            text.setPosition({
                x: coords[0],
                y: coords[1]
            });
            return layer.add(text);
        };
        return Text;
    }(Stimulus);
    exports.Text = Text;
}.call(this));
});
require.define('111', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Kinetic, StartButton, Stimulus, _ref, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Stimulus = require('73', module).Stimulus;
    Kinetic = require('27', module).Kinetic;
    StartButton = function (_super) {
        __extends(StartButton, _super);
        function StartButton() {
            _ref = StartButton.__super__.constructor.apply(this, arguments);
            return _ref;
        }
        StartButton.prototype.defaults = {
            width: 150,
            height: 75
        };
        StartButton.prototype.render = function (context, layer) {
            var button, group, text, xcenter, ycenter;
            xcenter = context.width() / 2;
            ycenter = context.height() / 2;
            group = new Kinetic.Group({ id: this.spec.id });
            text = new Kinetic.Text({
                text: 'Start',
                x: xcenter - this.spec.width / 2,
                y: ycenter - this.spec.height / 2,
                width: this.spec.width,
                height: this.spec.height,
                fontSize: 30,
                fill: 'white',
                fontFamily: 'Arial',
                align: 'center',
                padding: 20
            });
            button = new Kinetic.Rect({
                x: xcenter - this.spec.width / 2,
                y: ycenter - text.getHeight() / 2,
                width: this.spec.width,
                height: text.getHeight(),
                fill: 'black',
                cornerRadius: 10,
                stroke: 'LightSteelBlue',
                strokeWidth: 5
            });
            group.add(button);
            group.add(text);
            return layer.add(group);
        };
        return StartButton;
    }(Stimulus);
    exports.StartButton = StartButton;
}.call(this));
});
require.define('110', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Kinetic, Rectangle, Stimulus, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Stimulus = require('73', module).Stimulus;
    Kinetic = require('27', module).Kinetic;
    Rectangle = function (_super) {
        __extends(Rectangle, _super);
        Rectangle.prototype.defaults = {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            fill: 'red',
            opacity: 1
        };
        function Rectangle(spec) {
            if (spec == null) {
                spec = {};
            }
            Rectangle.__super__.constructor.call(this, spec);
        }
        Rectangle.prototype.render = function (context, layer) {
            var coords, rect;
            coords = this.computeCoordinates(context, this.spec.position, this.spec.width, this.spec.height);
            rect = new Kinetic.Rect({
                x: coords[0],
                y: coords[1],
                width: this.spec.width,
                height: this.spec.height,
                fill: this.spec.fill,
                stroke: this.spec.stroke,
                strokeWidth: this.spec.strokeWidth,
                opacity: this.spec.opacity
            });
            return layer.add(rect);
        };
        return Rectangle;
    }(Stimulus);
    exports.Rectangle = Rectangle;
}.call(this));
});
require.define('109', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Kinetic, Picture, Stimulus, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Stimulus = require('73', module).Stimulus;
    Kinetic = require('27', module).Kinetic;
    Picture = function (_super) {
        __extends(Picture, _super);
        Picture.prototype.defaults = {
            url: 'http://www.html5canvastutorials.com/demos/assets/yoda.jpg',
            x: 0,
            y: 0
        };
        function Picture(spec) {
            var _this = this;
            if (spec == null) {
                spec = {};
            }
            Picture.__super__.constructor.call(this, spec);
            this.imageObj = new Image();
            this.image = null;
            this.imageObj.onload = function () {
                return _this.image = new Kinetic.Image({
                    x: _this.spec.x,
                    y: _this.spec.y,
                    image: _this.imageObj,
                    width: _this.spec.width || _this.imageObj.width,
                    height: _this.spec.height || _this.imageObj.height
                });
            };
            this.imageObj.src = this.spec.url;
        }
        Picture.prototype.render = function (context, layer) {
            return layer.add(this.image);
        };
        return Picture;
    }(Stimulus);
    exports.Picture = Picture;
}.call(this));
});
require.define('108', function(module, exports, __dirname, __filename, undefined){
(function () {
    var GridLines, Kinetic, Stimulus, _ref, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Stimulus = require('73', module).Stimulus;
    Kinetic = require('27', module).Kinetic;
    GridLines = function (_super) {
        __extends(GridLines, _super);
        function GridLines() {
            _ref = GridLines.__super__.constructor.apply(this, arguments);
            return _ref;
        }
        GridLines.prototype.defaults = {
            x: 0,
            y: 0,
            rows: 3,
            cols: 3,
            stroke: 'black',
            strokeWidth: 2
        };
        GridLines.prototype.render = function (context, layer) {
            var i, line, x, y, _i, _j, _ref1, _ref2, _results;
            for (i = _i = 0, _ref1 = this.spec.rows; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
                y = this.spec.y + i * context.height() / this.spec.rows;
                line = new Kinetic.Line({
                    points: [
                        this.spec.x,
                        y,
                        this.spec.x + context.width(),
                        y
                    ],
                    stroke: this.spec.stroke,
                    strokeWidth: this.spec.strokeWidth,
                    dashArray: this.spec.dashArray
                });
                layer.add(line);
            }
            _results = [];
            for (i = _j = 0, _ref2 = this.spec.cols; 0 <= _ref2 ? _j <= _ref2 : _j >= _ref2; i = 0 <= _ref2 ? ++_j : --_j) {
                x = this.spec.x + i * context.width() / this.spec.cols;
                line = new Kinetic.Line({
                    points: [
                        x,
                        this.spec.y,
                        x,
                        this.spec.y + context.height()
                    ],
                    stroke: this.spec.stroke,
                    strokeWidth: this.spec.strokeWidth,
                    dashArray: this.spec.dashArray
                });
                _results.push(layer.add(line));
            }
            return _results;
        };
        return GridLines;
    }(Stimulus);
    exports.GridLines = GridLines;
}.call(this));
});
require.define('107', function(module, exports, __dirname, __filename, undefined){
(function () {
    var CanvasBorder, Kinetic, Stimulus, _ref, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Stimulus = require('73', module).Stimulus;
    Kinetic = require('27', module).Kinetic;
    CanvasBorder = function (_super) {
        __extends(CanvasBorder, _super);
        function CanvasBorder() {
            _ref = CanvasBorder.__super__.constructor.apply(this, arguments);
            return _ref;
        }
        CanvasBorder.prototype.defaults = {
            strokeWidth: 5,
            stroke: 'black'
        };
        CanvasBorder.prototype.render = function (context, layer) {
            var border;
            border = new Kinetic.Rect({
                x: 0,
                y: 0,
                width: context.width(),
                height: context.height(),
                strokeWidth: this.spec.strokeWidth,
                stroke: this.spec.stroke
            });
            return layer.add(border);
        };
        return CanvasBorder;
    }(Stimulus);
    exports.CanvasBorder = CanvasBorder;
}.call(this));
});
require.define('106', function(module, exports, __dirname, __filename, undefined){
(function () {
    var FixationCross, Kinetic, Stimulus, _ref, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Stimulus = require('73', module).Stimulus;
    Kinetic = require('27', module).Kinetic;
    FixationCross = function (_super) {
        __extends(FixationCross, _super);
        function FixationCross() {
            _ref = FixationCross.__super__.constructor.apply(this, arguments);
            return _ref;
        }
        FixationCross.prototype.defaults = {
            strokeWidth: 8,
            length: 150,
            fill: 'black'
        };
        FixationCross.prototype.render = function (context, layer) {
            var group, horz, vert, x, y;
            x = context.width() / 2;
            y = context.height() / 2;
            horz = new Kinetic.Rect({
                x: x - this.spec.length / 2,
                y: y,
                width: this.spec.length,
                height: this.spec.strokeWidth,
                fill: this.spec.fill
            });
            vert = new Kinetic.Rect({
                x: x - this.spec.strokeWidth / 2,
                y: y - this.spec.length / 2 + this.spec.strokeWidth / 2,
                width: this.spec.strokeWidth,
                height: this.spec.length,
                fill: this.spec.fill
            });
            group = new Kinetic.Group();
            group.add(horz);
            group.add(vert);
            return layer.add(group);
        };
        return FixationCross;
    }(Stimulus);
    exports.FixationCross = FixationCross;
}.call(this));
});
require.define('105', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Clear, Stimulus, _ref, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Stimulus = require('73', module).Stimulus;
    Clear = function (_super) {
        __extends(Clear, _super);
        function Clear() {
            _ref = Clear.__super__.constructor.apply(this, arguments);
            return _ref;
        }
        Clear.prototype.render = function (context, layer) {
            return context.clearContent(true);
        };
        return Clear;
    }(Stimulus);
    exports.Clear = Clear;
}.call(this));
});
require.define('104', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Circle, Kinetic, Stimulus, _ref, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Stimulus = require('73', module).Stimulus;
    Kinetic = require('27', module).Kinetic;
    Circle = function (_super) {
        __extends(Circle, _super);
        function Circle() {
            _ref = Circle.__super__.constructor.apply(this, arguments);
            return _ref;
        }
        Circle.prototype.defaults = {
            x: 0,
            y: 0,
            radius: 50,
            fill: 'red',
            opacity: 1,
            origin: 'center'
        };
        Circle.prototype.render = function (context, layer) {
            var circ, coords;
            circ = new Kinetic.Circle({
                x: 0,
                y: 0,
                radius: this.spec.radius,
                fill: this.spec.fill,
                stroke: this.spec.stroke,
                strokeWidth: this.spec.strokeWidth,
                opacity: this.spec.opacity
            });
            coords = this.computeCoordinates(context, this.spec.position, circ.getWidth(), circ.getHeight());
            circ.setPosition({
                x: coords[0] + circ.getWidth() / 2,
                y: coords[1] + circ.getHeight() / 2
            });
            return layer.add(circ);
        };
        return Circle;
    }(Stimulus);
    exports.Circle = Circle;
}.call(this));
});
require.define('103', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Blank, Kinetic, Stimulus, _ref, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Kinetic = require('27', module).Kinetic;
    Stimulus = require('73', module).Stimulus;
    Blank = function (_super) {
        __extends(Blank, _super);
        function Blank() {
            _ref = Blank.__super__.constructor.apply(this, arguments);
            return _ref;
        }
        Blank.prototype.defaults = {
            fill: 'white',
            opacity: 1
        };
        Blank.prototype.render = function (context, layer) {
            var blank;
            blank = new Kinetic.Rect({
                x: 0,
                y: 0,
                width: context.width(),
                height: context.height(),
                fill: this.spec.fill,
                opacity: this.spec.opacity
            });
            return layer.add(blank);
        };
        return Blank;
    }(Stimulus);
    exports.Blank = Blank;
}.call(this));
});
require.define('102', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Arrow, Kinetic, Stimulus, _ref, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Stimulus = require('73', module).Stimulus;
    Kinetic = require('27', module).Kinetic;
    Arrow = function (_super) {
        __extends(Arrow, _super);
        function Arrow() {
            _ref = Arrow.__super__.constructor.apply(this, arguments);
            return _ref;
        }
        Arrow.prototype.defaults = {
            x: 100,
            y: 100,
            length: 100,
            direction: 'right',
            thickness: 40,
            fill: 'red',
            arrowSize: 25,
            angle: null
        };
        Arrow.prototype.initialize = function () {
            var computedHeight, computedLength, coords, shaftLength, _this;
            if (this.spec.angle != null) {
                this.angle = this.spec.angle;
            } else {
                this.angle = function () {
                    switch (this.spec.direction) {
                    case 'right':
                        return 0;
                    case 'left':
                        return 180;
                    case 'up':
                        return 90;
                    case 'down':
                        return 270;
                    default:
                        return 0;
                    }
                }.call(this);
            }
            shaftLength = this.spec.length - this.spec.arrowSize;
            this.arrowShaft = new Kinetic.Rect({
                x: 0,
                y: 0,
                width: shaftLength,
                height: this.spec.thickness,
                fill: this.spec.fill,
                stroke: this.spec.stroke,
                strokeWidth: this.spec.strokeWidth,
                opacity: this.spec.opacity
            });
            _this = this;
            this.arrowHead = new Kinetic.Shape({
                drawFunc: function (cx) {
                    cx.beginPath();
                    cx.moveTo(shaftLength, -_this.spec.arrowSize / 2);
                    cx.lineTo(shaftLength + _this.spec.arrowSize, _this.spec.thickness / 2);
                    cx.lineTo(shaftLength, _this.spec.thickness + _this.spec.arrowSize / 2);
                    cx.closePath();
                    return cx.fillStrokeShape(this);
                },
                fill: _this.spec.fill,
                stroke: this.spec.stroke,
                strokeWidth: this.spec.strokeWidth,
                opacity: this.spec.opacity,
                width: _this.spec.arrowSize,
                height: _this.spec.arrowSize + _this.spec.thickness
            });
            console.log('arrowhead width', this.arrowHead.getWidth());
            console.log('arrowhead height', this.arrowHead.getHeight());
            console.log('shaft width', this.arrowShaft.getWidth());
            console.log('shaft height', this.arrowShaft.getHeight());
            computedLength = shaftLength + this.spec.arrowSize;
            computedHeight = this.spec.thickness;
            this.group = new Kinetic.Group({
                x: 0,
                y: 0,
                rotationDeg: this.angle,
                offset: [
                    computedLength / 2,
                    this.spec.thickness / 2
                ]
            });
            this.group.add(this.arrowShaft);
            this.group.add(this.arrowHead);
            console.log('computed height', computedHeight);
            coords = this.computeCoordinates(context, this.spec.position, computedLength, computedHeight);
            console.log('coords', coords);
            return this.group.setPosition({
                x: coords[0] + computedLength / 2,
                y: coords[1] + this.spec.thickness / 2
            });
        };
        Arrow.prototype.render = function (context, layer) {
            return layer.add(this.group);
        };
        return Arrow;
    }(Stimulus);
    exports.Arrow = Arrow;
}.call(this));
});
require.define('117', function(module, exports, __dirname, __filename, undefined){
(function () {
    var ArrayIterator, BlockStructure, CellTable, ConditionSet, DataTable, ExpDesign, Factor, FactorNode, FactorSetNode, FactorSpec, ItemNode, ItemSetNode, Iterator, SamplerNode, TaskNode, TaskSchema, TrialList, VarSpec, csv, sampler, trimWhiteSpace, utils, _, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    _ = require('2', module);
    utils = require('76', module);
    DataTable = require('77', module).DataTable;
    csv = require('120', module);
    sampler = require('116', module);
    exports.Factor = Factor = function (_super) {
        __extends(Factor, _super);
        Factor.asFactor = function (arr) {
            return function (func, args, ctor) {
                ctor.prototype = func.prototype;
                var child = new ctor(), result = func.apply(child, args);
                return Object(result) === result ? result : child;
            }(Factor, arr, function () {
            });
        };
        function Factor(arr) {
            var arg, _i, _len;
            for (_i = 0, _len = arr.length; _i < _len; _i++) {
                arg = arr[_i];
                this.push(arg);
            }
            this.levels = _.uniq(arr).sort();
        }
        return Factor;
    }(Array);
    exports.VarSpec = VarSpec = function () {
        function VarSpec() {
        }
        VarSpec.name = '';
        VarSpec.nblocks = 1;
        VarSpec.reps = 1;
        VarSpec.expanded = {};
        VarSpec.prototype.names = function () {
            return this.name;
        };
        VarSpec.prototype.ntrials = function () {
            return this.nblocks * this.reps;
        };
        VarSpec.prototype.valueAt = function (block, trial) {
        };
        return VarSpec;
    }();
    exports.FactorSpec = FactorSpec = function (_super) {
        __extends(FactorSpec, _super);
        function FactorSpec(name, levels) {
            this.name = name;
            this.levels = levels;
            this.factorSet = {};
            this.factorSet[this.name] = this.levels;
            this.conditionTable = DataTable.expand(this.factorSet);
        }
        FactorSpec.prototype.cross = function (other) {
            return new CrossedFactorSpec(this.nblocks, this.reps, [
                this,
                other
            ]);
        };
        FactorSpec.prototype.expand = function (nblocks, reps) {
            var blocks, concatBlocks, i, prop, vset, _i, _results;
            prop = {};
            prop[this.name] = this.levels;
            vset = new DataTable(prop);
            blocks = function () {
                var _i, _results;
                _results = [];
                for (i = _i = 1; 1 <= nblocks ? _i <= nblocks : _i >= nblocks; i = 1 <= nblocks ? ++_i : --_i) {
                    _results.push(vset.replicate(reps));
                }
                return _results;
            }();
            concatBlocks = _.reduce(blocks, function (sum, nex) {
                return DataTable.rbind(sum, nex);
            });
            concatBlocks.bindcol('$Block', utils.rep(function () {
                _results = [];
                for (var _i = 1; 1 <= nblocks ? _i <= nblocks : _i >= nblocks; 1 <= nblocks ? _i++ : _i--) {
                    _results.push(_i);
                }
                return _results;
            }.apply(this), utils.rep(reps * vset.nrow(), nblocks)));
            return concatBlocks;
        };
        return FactorSpec;
    }(VarSpec);
    exports.CellTable = CellTable = function (_super) {
        __extends(CellTable, _super);
        function CellTable(parents) {
            var fac;
            this.parents = parents;
            this.parentNames = function () {
                var _i, _len, _ref, _results;
                _ref = this.parents;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    fac = _ref[_i];
                    _results.push(fac.name);
                }
                return _results;
            }.call(this);
            this.name = _.reduce(this.parentNames, function (n, n1) {
                return n + ':' + n1;
            });
            this.levels = function () {
                var _i, _len, _ref, _results;
                _ref = this.parents;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    fac = _ref[_i];
                    _results.push(fac.levels);
                }
                return _results;
            }.call(this);
            this.factorSet = _.zipObject(this.parentNames, this.levels);
            this.table = DataTable.expand(this.factorSet);
        }
        CellTable.prototype.names = function () {
            return this.parentNames;
        };
        CellTable.prototype.conditions = function () {
            var i, rec, _i, _ref, _results;
            _results = [];
            for (i = _i = 0, _ref = this.table.nrow(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                rec = this.table.record(i);
                _results.push(_.reduce(rec, function (n, n1) {
                    return n + ':' + n1;
                }));
            }
            return _results;
        };
        CellTable.prototype.expand = function (nblocks, reps) {
            var blocks, i;
            return blocks = function () {
                var _i, _results;
                _results = [];
                for (i = _i = 1; 1 <= nblocks ? _i <= nblocks : _i >= nblocks; i = 1 <= nblocks ? ++_i : --_i) {
                    _results.push(this.table.replicate(reps));
                }
                return _results;
            }.call(this);
        };
        return CellTable;
    }(VarSpec);
    exports.BlockStructure = BlockStructure = function () {
        function BlockStructure(nblocks, trialsPerBlock) {
            this.nblocks = nblocks;
            this.trialsPerBlock = trialsPerBlock;
        }
        return BlockStructure;
    }();
    exports.TaskNode = TaskNode = function () {
        function TaskNode(varNodes, crossedSet) {
            var i, vname, _i, _j, _k, _len, _len1, _ref, _ref1, _ref2;
            this.varNodes = varNodes;
            this.crossedSet = crossedSet != null ? crossedSet : [];
            this.factorNames = _.map(this.varNodes, function (x) {
                return x.name;
            });
            this.varmap = {};
            for (i = _i = 0, _ref = this.factorNames.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                this.varmap[this.factorNames[i]] = this.varSpecs[i];
            }
            if (this.crossedSet.length > 0) {
                _ref1 = this.crossedSet;
                for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
                    vname = _ref1[_j];
                    this.crossedVars = this.varmap[vname];
                }
                this.crossedSpec = new CrossedFactorSpec(this.crossedVars);
            } else {
                this.crossedVars = [];
                this.crossedSpec = {};
            }
            this.uncrossedVars = _.difference(this.factorNames, this.crossedSet);
            _ref2 = this.uncrossedVars;
            for (_k = 0, _len1 = _ref2.length; _k < _len1; _k++) {
                vname = _ref2[_k];
                this.uncrossedSpec = this.varmap[vname];
            }
            ({
                expand: function (nblocks, nreps) {
                    var ctable;
                    if (this.crossedVars.length > 0) {
                        return ctable = this.crossedSpec.expand(nblocks, nreps);
                    }
                }
            });
        }
        return TaskNode;
    }();
    exports.FactorNode = FactorNode = function () {
        FactorNode.build = function (name, spec) {
            return new FactorNode(name, spec.levels);
        };
        function FactorNode(name, levels) {
            this.name = name;
            this.levels = levels;
            this.cellTable = new CellTable([this]);
        }
        FactorNode.prototype.expand = function (nblocks, nreps) {
            return this.cellTable.expand(nblocks, nreps);
        };
        return FactorNode;
    }();
    exports.FactorSetNode = FactorSetNode = function () {
        FactorSetNode.build = function (spec) {
            var fnodes, key, value;
            fnodes = function () {
                var _results;
                _results = [];
                for (key in spec) {
                    value = spec[key];
                    _results.push(FactorNode.build(key, value));
                }
                return _results;
            }();
            return new FactorSetNode(fnodes);
        };
        function FactorSetNode(factors) {
            var i, _i, _ref;
            this.factors = factors;
            this.factorNames = _.map(this.factors, function (x) {
                return x.name;
            });
            this.varmap = {};
            for (i = _i = 0, _ref = this.factorNames.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                this.varmap[this.factorNames[i]] = this.factors[i];
            }
            this.cellTable = new CellTable(this.factors);
            this.name = this.cellTable.name;
        }
        FactorSetNode.prototype.levels = function () {
            return this.cellTable.levels;
        };
        FactorSetNode.prototype.conditions = function () {
            return this.cellTable.conditions();
        };
        FactorSetNode.prototype.expand = function (nblocks, nreps) {
            return this.cellTable.expand(nblocks, nreps);
        };
        FactorSetNode.prototype.trialList = function (nblocks, nreps) {
            var blk, blocks, i, j, tlist, _i, _j, _len, _ref;
            if (nblocks == null) {
                nblocks = 1;
            }
            if (nreps == null) {
                nreps = 1;
            }
            blocks = this.expand(nblocks, nreps);
            tlist = new TrialList(nblocks);
            for (i = _i = 0, _len = blocks.length; _i < _len; i = ++_i) {
                blk = blocks[i];
                for (j = _j = 0, _ref = blk.nrow(); 0 <= _ref ? _j < _ref : _j > _ref; j = 0 <= _ref ? ++_j : --_j) {
                    tlist.add(i, blk.record(j));
                }
            }
            return tlist;
        };
        return FactorSetNode;
    }();
    exports.Iterator = Iterator = function () {
        function Iterator() {
        }
        Iterator.prototype.hasNext = function () {
            return false;
        };
        Iterator.prototype.next = function () {
            throw 'empty iterator';
        };
        Iterator.prototype.map = function (fun) {
            throw 'empty iterator';
        };
        return Iterator;
    }();
    exports.ArrayIterator = ArrayIterator = function (_super) {
        __extends(ArrayIterator, _super);
        function ArrayIterator(arr) {
            this.arr = arr;
            this.cursor = 0;
            ({
                hasNext: function () {
                    return this.cursor < this.arr.length;
                },
                next: function () {
                    var ret;
                    ret = this.arr[this.cursor];
                    this.cursor = this.cursor + 1;
                    return ret;
                },
                map: function (f) {
                    return _.map(this.arr, function (el) {
                        return f(el);
                    });
                }
            });
        }
        return ArrayIterator;
    }(Iterator);
    exports.TrialList = TrialList = function () {
        function TrialList(nblocks) {
            var i, _i;
            this.blocks = [];
            for (i = _i = 0; 0 <= nblocks ? _i < nblocks : _i > nblocks; i = 0 <= nblocks ? ++_i : --_i) {
                this.blocks.push([]);
            }
        }
        TrialList.prototype.add = function (block, trial) {
            return this.blocks[block].push(trial);
        };
        TrialList.prototype.get = function (block, trialNum) {
            return this.blocks[block][trialNum];
        };
        TrialList.prototype.getBlock = function (block) {
            return this.blocks[block];
        };
        TrialList.prototype.nblocks = function () {
            return this.blocks.length;
        };
        TrialList.prototype.ntrials = function () {
            var nt;
            nt = _.map(this.blocks, function (b) {
                return b.length;
            });
            return _.reduce(nt, function (x0, x1) {
                return x0 + x1;
            });
        };
        TrialList.prototype.shuffle = function () {
            return this.blocks = _.map(this.blocks, function (blk) {
                return _.shuffle(blk);
            });
        };
        TrialList.prototype.bind = function (fun) {
            var blk, i, out, ret, trial, _i, _j, _len, _len1, _ref;
            out = new TrialList(this.blocks.length);
            _ref = this.blocks;
            for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
                blk = _ref[i];
                for (_j = 0, _len1 = blk.length; _j < _len1; _j++) {
                    trial = blk[_j];
                    ret = fun(trial);
                    out.add(i, _.assign(trial, ret));
                }
            }
            return out;
        };
        TrialList.prototype.blockIterator = function () {
            return new ArrayIterator(_.map(this.blocks, function (blk) {
                return new ArrayIterator(blk);
            }));
        };
        return TrialList;
    }();
    trimWhiteSpace = function (records) {
        var i, key, out, record, trimmed, value, _i, _ref;
        trimmed = [];
        for (i = _i = 0, _ref = records.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            record = records[i];
            out = {};
            for (key in record) {
                value = record[key];
                out[key.trim()] = value.trim();
            }
            trimmed.push(out);
        }
        return trimmed;
    };
    exports.ItemNode = ItemNode = function () {
        ItemNode.build = function (name, spec) {
            var attrs, dtable, inode, items, snode, _this = this;
            if (spec.type == null) {
                spec.type = 'text';
            }
            snode = spec.sampler != null ? SamplerNode.build(spec.sampler) : new SamplerNode('default', {});
            if (spec.data != null) {
                dtable = DataTable.fromRecords(spec.data);
                attrs = dtable.dropColumn(name);
                items = dtable[name];
                return new ItemNode(name, items, attrs, spec.type, snode.makeSampler(items));
            } else if (spec.csv != null) {
                inode = null;
                $.ajax({
                    url: spec.csv.url,
                    dataType: 'text',
                    async: false,
                    success: function (data) {
                        var records;
                        records = trimWhiteSpace(csv.toObjects(data));
                        dtable = DataTable.fromRecords(records);
                        items = dtable[name];
                        attrs = dtable.dropColumn(name);
                        return inode = new ItemNode(name, items, attrs, spec.type, snode.makeSampler(items));
                    },
                    error: function (x) {
                        return console.log(x);
                    }
                });
                return inode;
            }
        };
        function ItemNode(name, items, attributes, type, sampler) {
            this.name = name;
            this.items = items;
            this.attributes = attributes;
            this.type = type;
            this.sampler = sampler;
            if (this.items.length !== this.attributes.nrow()) {
                throw 'Number of items must equal number of attributes';
            }
        }
        ItemNode.prototype.sample = function (n) {
            return this.sampler.take(n);
        };
        return ItemNode;
    }();
    exports.ItemSetNode = ItemSetNode = function () {
        ItemSetNode.build = function (spec) {
            var key, nodes, value;
            nodes = function () {
                var _results;
                _results = [];
                for (key in spec) {
                    value = spec[key];
                    _results.push(exports.ItemNode.build(key, value));
                }
                return _results;
            }();
            return new ItemSetNode(nodes);
        };
        function ItemSetNode(itemNodes) {
            this.itemNodes = itemNodes;
            this.names = _.map(this.itemNodes, function (n) {
                return n.name;
            });
        }
        ItemSetNode.prototype.sample = function (n) {
            var i, items, j, name, out, record, _i, _j, _len, _ref;
            items = _.map(this.itemNodes, function (node) {
                return node.sample(n);
            });
            out = [];
            for (i = _i = 0; 0 <= n ? _i < n : _i > n; i = 0 <= n ? ++_i : --_i) {
                record = {};
                _ref = this.names;
                for (j = _j = 0, _len = _ref.length; _j < _len; j = ++_j) {
                    name = _ref[j];
                    record[name] = items[j][i];
                }
                out.push(record);
            }
            return out;
        };
        return ItemSetNode;
    }();
    SamplerNode = SamplerNode = function () {
        SamplerNode.build = function (spec) {
            if (spec.type == null) {
                spec.type = 'default';
            }
            return new SamplerNode(spec.type, spec);
        };
        function SamplerNode(type, params) {
            this.makeSampler = function () {
                switch (type) {
                case 'default':
                    return function (items) {
                        return new sampler.Sampler(items, params);
                    };
                case 'exhaustive':
                    return function (items) {
                        return new sampler.ExhaustiveSampler(items, params);
                    };
                case 'replacement':
                    return function (items) {
                        return new sampler.ReplacementSampler(items, params);
                    };
                default:
                    throw new Error('unrecognized sampler type', type);
                }
            }();
        }
        return SamplerNode;
    }();
    exports.SamplerNode = SamplerNode;
    exports.ConditionSet = ConditionSet = function () {
        ConditionSet.build = function (spec) {
            var key, value, _crossed, _uncrossed;
            if (spec.Crossed == null && !spec.Uncrossed) {
                _crossed = exports.FactorSetNode.build(spec.Crossed);
                _uncrossed = {};
            } else {
                _crossed = exports.FactorSetNode.build(spec.Crossed);
                _uncrossed = function () {
                    var _ref, _results;
                    _ref = spec.Uncrossed;
                    _results = [];
                    for (key in _ref) {
                        value = _ref[key];
                        _results.push(FactorNode.build(key, value));
                    }
                    return _results;
                }();
            }
            return new ConditionSet(_crossed, _uncrossed);
        };
        function ConditionSet(crossed, uncrossed) {
            var _this = this;
            this.crossed = crossed;
            this.uncrossed = uncrossed;
            this.factorNames = [].concat(this.crossed.factorNames).concat(_.map(this.uncrossed, function (fac) {
                return fac.name;
            }));
            this.factorArray = _.clone(this.crossed.factors);
            _.forEach(this.uncrossed, function (fac) {
                return _this.factorArray.push(fac);
            });
            this.factorSet = _.zipObject(this.factorNames, this.factorArray);
        }
        return ConditionSet;
    }();
    exports.TaskSchema = TaskSchema = function () {
        TaskSchema.build = function (spec) {
            var key, schema, value;
            schema = {};
            for (key in spec) {
                value = spec[key];
                schema[key] = FactorSetNode.build(value);
            }
            return new TaskSchema(schema);
        };
        function TaskSchema(schema) {
            this.schema = schema;
        }
        TaskSchema.prototype.trialTypes = function () {
            return _.keys(this.schema);
        };
        TaskSchema.prototype.factors = function (type) {
            return this.schema[type];
        };
        return TaskSchema;
    }();
    exports.ExpDesign = ExpDesign = function () {
        ExpDesign.blocks = 1;
        ExpDesign.validate = function (spec) {
            var des;
            if (!('Design' in spec)) {
                throw 'Design is undefined';
            }
            des = spec['Design'];
            if (!('Variables' in des)) {
                throw 'Variables is undefined';
            }
            if (!('Structure' in des)) {
                throw 'Structure is undefined';
            }
            if (!('Items' in spec)) {
                throw 'Items is undefined';
            }
        };
        ExpDesign.splitCrossedItems = function (itemSpec, crossedVariables) {
            var attrnames, conditionTable, i, indices, itemSets, j, keySet, levs, record, values;
            attrnames = crossedVariables.colnames();
            keySet = function () {
                var _i, _ref, _results;
                _results = [];
                for (i = _i = 0, _ref = crossedVariables.nrow(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                    record = crossedVariables.record(i);
                    levs = _.values(record);
                    _results.push(_.reduce(levs, function (a, b) {
                        return a + ':' + b;
                    }));
                }
                return _results;
            }();
            values = itemSpec['values'];
            conditionTable = new DataTable(_.pick(itemSpec, attrnames));
            itemSets = function () {
                var _i, _ref, _results;
                _results = [];
                for (i = _i = 0, _ref = crossedVariables.nrow(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                    record = crossedVariables.record(i);
                    indices = conditionTable.whichRow(record);
                    _results.push(function () {
                        var _j, _len, _results1;
                        _results1 = [];
                        for (_j = 0, _len = indices.length; _j < _len; _j++) {
                            j = indices[_j];
                            _results1.push(values[j]);
                        }
                        return _results1;
                    }());
                }
                return _results;
            }();
            return _.zipObject(keySet, itemSets);
        };
        ExpDesign.prototype.init = function (spec) {
            this.design = spec['Design'];
            this.variables = this.design['Variables'];
            this.itemSpec = spec['Items'];
            this.structure = this.design['Structure'];
            this.factorNames = _.keys(this.variables);
            this.crossed = this.variables['Crossed'];
            return this.auxiliary = this.variables['Auxiliary'];
        };
        ExpDesign.prototype.initStructure = function () {
            if (this.structure['type'] === 'Block') {
                if (!_.has(this.structure, 'reps_per_block')) {
                    this.structure['reps_per_block'] = 1;
                }
                this.reps_per_block = this.structure['reps_per_block'];
                return this.blocks = this.structure['blocks'];
            } else {
                this.reps_per_block = 1;
                return this.blocks = 1;
            }
        };
        ExpDesign.prototype.makeConditionalSampler = function (crossedSpec, crossedItems) {
            var crossedItemMap, crossedItemName, key;
            crossedItemName = _.keys(crossedItems)[0];
            console.log('names:', crossedSpec.names());
            crossedItemMap = function () {
                var _i, _len, _ref, _results;
                _ref = crossedSpec.names();
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    key = _ref[_i];
                    _results.push(crossedItems[crossedItemName][key]);
                }
                return _results;
            }();
            crossedItemMap = _.zipObject(_.keys(this.crossed), crossedItemMap);
            console.log('item map: ', crossedItemMap);
            return new ConditionalSampler(crossedItems[crossedItemName].values, new DataTable(crossedItemMap), crossedSpec);
        };
        ExpDesign.prototype.makeCrossedSpec = function (crossed, nblocks, nreps) {
            var factors, key, val;
            factors = function () {
                var _results;
                _results = [];
                for (key in crossed) {
                    val = crossed[key];
                    _results.push(new FactorSpec(nblocks, nreps, key, val.levels));
                }
                return _results;
            }();
            return crossed = new CrossedFactorSpec(nblocks, nreps, factors);
        };
        ExpDesign.prototype.makeFactorSpec = function (fac, nblocks, nreps) {
            return new FactorSpec(nblocks, nreps, _.keys(fac)[0], _.values(fac)[0]);
        };
        function ExpDesign(spec) {
            var crossedItems, crossedSampler;
            if (spec == null) {
                spec = {};
            }
            ExpDesign.validate(spec);
            this.init(spec);
            this.initStructure();
            this.crossedSpec = this.makeCrossedSpec(this.crossed, this.blocks, this.reps_per_block);
            crossedItems = this.itemSpec.Crossed;
            crossedSampler = this.makeConditionalSampler(this.crossedSpec, crossedItems);
            this.fullDesign = this.crossedSpec.expanded.bindcol(_.keys(crossedItems)[0], crossedSampler.take(this.crossedSpec.expanded.nrow()));
            console.log(this.crossedDesign);
        }
        return ExpDesign;
    }();
}.call(this));
});
require.define('116', function(module, exports, __dirname, __filename, undefined){
(function () {
    var CombinatoricSampler, ConditionalSampler, DataTable, ExhaustiveSampler, GridSampler, MatchSampler, ReplacementSampler, Sampler, UniformSampler, utils, _, _ref, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        }, __slice = [].slice;
    utils = require('76', module);
    _ = require('2', module);
    DataTable = require('77', module).DataTable;
    Sampler = function () {
        function Sampler(items) {
            var _i, _ref, _results;
            this.items = items;
            this.indexBuffer = _.shuffle(function () {
                _results = [];
                for (var _i = 0, _ref = this.items.length; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
                    _results.push(_i);
                }
                return _results;
            }.apply(this));
        }
        Sampler.prototype.next = function () {
            var i, _i, _ref, _results;
            i = this.indexBuffer.length > 0 ? this.indexBuffer.shift() : (this.indexBuffer = _.shuffle(function () {
                _results = [];
                for (var _i = 0, _ref = this.items.length; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
                    _results.push(_i);
                }
                return _results;
            }.apply(this)), this.indexBuffer.shift());
            return this.items[i];
        };
        Sampler.prototype.take = function (n) {
            var i, ret, _i, _ref, _results;
            if (n > this.items.length) {
                throw 'cannot take sample larger than the number of items when using non-replacing sampler';
            }
            this.indexBuffer = _.shuffle(function () {
                _results = [];
                for (var _i = 0, _ref = this.items.length; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
                    _results.push(_i);
                }
                return _results;
            }.apply(this));
            ret = function () {
                var _j, _results1;
                _results1 = [];
                for (i = _j = 0; 0 <= n ? _j < n : _j > n; i = 0 <= n ? ++_j : --_j) {
                    _results1.push(this.next());
                }
                return _results1;
            }.call(this);
            return ret;
        };
        Sampler.prototype.takeOne = function () {
            return this.take(1)[0];
        };
        return Sampler;
    }();
    exports.Sampler = Sampler;
    exports.ReplacementSampler = ReplacementSampler = function (_super) {
        __extends(ReplacementSampler, _super);
        function ReplacementSampler() {
            _ref = ReplacementSampler.__super__.constructor.apply(this, arguments);
            return _ref;
        }
        ReplacementSampler.prototype.sampleFrom = function (items, n) {
            return utils.sample(items, n, true);
        };
        ReplacementSampler.prototype.take = function (n) {
            return this.sampleFrom(this.items, n);
        };
        return ReplacementSampler;
    }(Sampler);
    exports.ExhaustiveSampler = ExhaustiveSampler = function (_super) {
        __extends(ExhaustiveSampler, _super);
        ExhaustiveSampler.fillBuffer = function (items, n) {
            var buf, i;
            buf = function () {
                var _i, _results;
                _results = [];
                for (i = _i = 1; 1 <= n ? _i <= n : _i >= n; i = 1 <= n ? ++_i : --_i) {
                    _results.push(_.shuffle(items));
                }
                return _results;
            }();
            return _.flatten(buf);
        };
        function ExhaustiveSampler(items) {
            this.items = items;
            this.buffer = ExhaustiveSampler.fillBuffer(this.items, 10);
        }
        ExhaustiveSampler.prototype.take = function (n) {
            var buf, buflen, res;
            if (n <= this.buffer.length) {
                res = _.take(this.buffer, n);
                this.buffer = _.drop(this.buffer, n);
                return res;
            } else {
                buflen = Math.max(n, 10 * this.items.length);
                buf = ExhaustiveSampler.fillBuffer(this.items, buflen / this.items.length);
                this.buffer = this.buffer.concat(buf);
                return this.take(n);
            }
        };
        return ExhaustiveSampler;
    }(Sampler);
    exports.MatchSampler = MatchSampler = function () {
        function MatchSampler(sampler) {
            this.sampler = sampler;
        }
        MatchSampler.prototype.take = function (n, match) {
            var probe, probeIndex, sam;
            if (match == null) {
                match = true;
            }
            sam = this.sampler.take(n);
            if (match) {
                probe = utils.sample(sam, 1)[0];
            } else {
                probe = this.sampler.take(1)[0];
            }
            probeIndex = _.indexOf(sam, probe);
            return {
                targetSet: sam,
                probe: probe,
                probeIndex: probeIndex,
                match: match
            };
        };
        return MatchSampler;
    }();
    exports.UniformSampler = UniformSampler = function (_super) {
        __extends(UniformSampler, _super);
        UniformSampler.validate = function (range) {
            if (range.length !== 2) {
                throw 'range must be an array with two values (min, max)';
            }
            if (range[1] <= range[0]) {
                throw 'range[1] must > range[0]';
            }
        };
        function UniformSampler(range) {
            this.range = range;
            this.interval = this.range[1] - this.range[0];
        }
        UniformSampler.prototype.take = function (n) {
            var i, nums;
            nums = function () {
                var _i, _results;
                _results = [];
                for (i = _i = 1; 1 <= n ? _i <= n : _i >= n; i = 1 <= n ? ++_i : --_i) {
                    _results.push(Math.round(Math.random() * this.interval));
                }
                return _results;
            }.call(this);
            return nums;
        };
        return UniformSampler;
    }(Sampler);
    exports.CombinatoricSampler = CombinatoricSampler = function (_super) {
        __extends(CombinatoricSampler, _super);
        function CombinatoricSampler() {
            var samplers;
            samplers = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            this.samplers = samplers;
        }
        CombinatoricSampler.prototype.take = function (n) {
            var i, j, xs, _i, _results;
            _results = [];
            for (i = _i = 0; 0 <= n ? _i < n : _i > n; i = 0 <= n ? ++_i : --_i) {
                xs = function () {
                    var _j, _ref1, _results1;
                    _results1 = [];
                    for (j = _j = 0, _ref1 = this.samplers.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
                        _results1.push(this.samplers[j].take(1));
                    }
                    return _results1;
                }.call(this);
                _results.push(_.flatten(xs));
            }
            return _results;
        };
        return CombinatoricSampler;
    }(Sampler);
    exports.GridSampler = GridSampler = function (_super) {
        __extends(GridSampler, _super);
        function GridSampler(x, y) {
            var i;
            this.x = x;
            this.y = y;
            this.grid = DataTable.expand({
                x: this.x,
                y: this.y
            });
            console.log('rows:', this.grid.nrow());
            this.tuples = function () {
                var _i, _ref1, _results;
                _results = [];
                for (i = _i = 0, _ref1 = this.grid.nrow(); 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
                    _results.push(_.values(this.grid.record(i)));
                }
                return _results;
            }.call(this);
        }
        GridSampler.prototype.take = function (n) {
            return utils.sample(this.tuples, n);
        };
        return GridSampler;
    }(Sampler);
    exports.ConditionalSampler = ConditionalSampler = function (_super) {
        __extends(ConditionalSampler, _super);
        ConditionalSampler.prototype.makeItemSubsets = function () {
            var ctable, i, indices, itemSets, j, keySet, levs, record;
            ctable = this.factorSpec.conditionTable;
            keySet = function () {
                var _i, _ref1, _results;
                _results = [];
                for (i = _i = 0, _ref1 = ctable.nrow(); 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
                    record = ctable.record(i);
                    levs = _.values(record);
                    _results.push(_.reduce(levs, function (a, b) {
                        return a + ':' + b;
                    }));
                }
                return _results;
            }();
            console.log(keySet);
            itemSets = function () {
                var _i, _ref1, _results;
                _results = [];
                for (i = _i = 0, _ref1 = ctable.nrow(); 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
                    record = ctable.record(i);
                    indices = this.itemMap.whichRow(record);
                    _results.push(function () {
                        var _j, _len, _results1;
                        _results1 = [];
                        for (_j = 0, _len = indices.length; _j < _len; _j++) {
                            j = indices[_j];
                            _results1.push(this.items[j]);
                        }
                        return _results1;
                    }.call(this));
                }
                return _results;
            }.call(this);
            console.log(itemSets);
            return _.zipObject(keySet, itemSets);
        };
        function ConditionalSampler(items, itemMap, factorSpec) {
            var key, value, _ref1;
            this.items = items;
            this.itemMap = itemMap;
            this.factorSpec = factorSpec;
            this.keyMap = this.makeItemSubsets();
            this.conditions = _.keys(this.keyMap);
            this.samplerSet = {};
            _ref1 = this.keyMap;
            for (key in _ref1) {
                value = _ref1[key];
                this.samplerSet[key] = new ExhaustiveSampler(value);
            }
        }
        ConditionalSampler.prototype.take = function (n) {
            var keys;
            keys = utils.repLen(this.conditions, n);
            return _.flatten(this.takeCondition(keys));
        };
        ConditionalSampler.prototype.takeCondition = function (keys) {
            var key, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = keys.length; _i < _len; _i++) {
                key = keys[_i];
                _results.push(this.samplerSet[key].take(1));
            }
            return _results;
        };
        return ConditionalSampler;
    }(Sampler);
}.call(this));
});
require.define('115', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Base, DotSet, Kinetic, RandomDotMotion, x, _, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Base = require('73', module);
    _ = require('2', module);
    Kinetic = require('27', module);
    DotSet = function () {
        DotSet.randomDelta = function (distance) {
            var rads;
            rads = Math.random() * Math.PI * 2;
            return [
                distance * Math.cos(rads),
                distance * Math.sin(rads)
            ];
        };
        DotSet.coherentDelta = function (distance, direction) {
            return [
                distance * Math.cos(Math.PI * direction / 180),
                distance * Math.sin(Math.PI * direction / 180)
            ];
        };
        DotSet.pointInCircle = function () {
            var r, t, u;
            t = 2 * Math.PI * Math.random();
            u = Math.random() + Math.random();
            r = u > 1 ? 2 - u : u;
            return [
                r * Math.cos(t),
                r * Math.sin(t)
            ];
        };
        DotSet.inCircle = function (center_x, center_y, radius, x, y) {
            var squareDist;
            squareDist = Math.pow(center_x - x, 2) + Math.pow(center_y - y, 2);
            return squareDist <= Math.pow(radius, 2);
        };
        function DotSet(ndots, nparts, coherence) {
            var _this = this;
            this.ndots = ndots;
            this.nparts = nparts != null ? nparts : 3;
            if (coherence == null) {
                coherence = 0.5;
            }
            this.frameNum = 0;
            this.dotsPerSet = Math.round(this.ndots / this.nparts);
            this.dotSets = _.map([
                0,
                1,
                2
            ], function (i) {
                var _i, _ref, _results;
                return _.map(function () {
                    _results = [];
                    for (var _i = 0, _ref = _this.dotsPerSet; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
                        _results.push(_i);
                    }
                    return _results;
                }.apply(this), function (d) {
                    return [
                        Math.random(),
                        Math.random()
                    ];
                });
            });
        }
        DotSet.prototype.getDotPartition = function (i) {
            return this.dotSets[i];
        };
        DotSet.prototype.nextFrame = function (coherence, distance, direction) {
            var delta, dset, i, partition, res, xy;
            partition = this.frameNum % this.nparts;
            dset = this.dotSets[partition];
            res = function () {
                var _i, _ref, _results;
                _results = [];
                for (i = _i = 0, _ref = dset.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                    xy = dset[i];
                    delta = Math.random() < coherence ? DotSet.coherentDelta(distance, direction) : DotSet.randomDelta(distance);
                    xy = [
                        xy[0] + delta[0],
                        xy[1] + delta[1]
                    ];
                    if (xy[0] < 0 || xy[0] > 1 || xy[1] < 0 || xy[1] > 1) {
                        xy = [
                            Math.random(),
                            Math.random()
                        ];
                    }
                    _results.push(dset[i] = xy);
                }
                return _results;
            }();
            this.frameNum = this.frameNum + 1;
            return res;
        };
        return DotSet;
    }();
    exports.RandomDotMotion = RandomDotMotion = function (_super) {
        __extends(RandomDotMotion, _super);
        function RandomDotMotion(spec) {
            if (spec == null) {
                spec = {
                    x: 0,
                    y: 0,
                    numDots: 70,
                    apRadius: 400,
                    dotSpeed: 0.02,
                    dotSize: 2,
                    coherence: 0.55,
                    partitions: 3
                };
            }
            this.numDots = spec.numDots;
            this.apRadius = spec.apRadius;
            this.dotSpeed = spec.dotSpeed;
            this.dotSize = spec.dotSize;
            this.coherence = spec.coherence;
            this.partitions = spec.partitions;
            this.x = spec.x;
            this.y = spec.y;
            this.dotSet = new DotSet(this.numDots, 3, 0.5);
        }
        RandomDotMotion.prototype.createDots = function () {
            var dots, xy, _i, _len, _results;
            dots = this.dotSet.nextFrame(this.coherence, this.dotSpeed, 180);
            _results = [];
            for (_i = 0, _len = dots.length; _i < _len; _i++) {
                xy = dots[_i];
                _results.push(new Kinetic.Rect({
                    x: this.x + this.apRadius * xy[0],
                    y: this.x + this.apRadius * xy[1],
                    width: this.dotSize,
                    height: this.dotSize,
                    fill: 'green'
                }));
            }
            return _results;
        };
        RandomDotMotion.prototype.createInitialDots = function () {
            var dpart, i, xy, _i, _ref, _results;
            _results = [];
            for (i = _i = 0, _ref = this.partitions; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                dpart = this.dotSet.getDotPartition(i);
                _results.push(function () {
                    var _j, _len, _results1;
                    _results1 = [];
                    for (_j = 0, _len = dpart.length; _j < _len; _j++) {
                        xy = dpart[_j];
                        _results1.push(new Kinetic.Rect({
                            x: this.x + this.apRadius * xy[0],
                            y: this.x + this.apRadius * xy[1],
                            width: this.dotSize,
                            height: this.dotSize,
                            fill: 'green'
                        }));
                    }
                    return _results1;
                }.call(this));
            }
            return _results;
        };
        RandomDotMotion.prototype.displayInitialDots = function (nodes, group) {
            var node, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = nodes.length; _i < _len; _i++) {
                node = nodes[_i];
                _results.push(group.add(node));
            }
            return _results;
        };
        RandomDotMotion.prototype.render = function (context, layer) {
            var i, nodeSets, _i, _ref, _this = this;
            this.groups = function () {
                var _i, _ref, _results;
                _results = [];
                for (i = _i = 0, _ref = this.partitions; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                    _results.push(new Kinetic.Group({ listening: false }));
                }
                return _results;
            }.call(this);
            _.map(this.groups, function (g) {
                return layer.add(g);
            });
            nodeSets = this.createInitialDots();
            for (i = _i = 0, _ref = this.partitions; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                this.displayInitialDots(nodeSets[i], this.groups[i]);
            }
            layer.draw();
            this.anim = new Kinetic.Animation(function (frame) {
                var curset, dx, part, xy, _j, _ref1, _results;
                dx = _this.dotSet.nextFrame(_this.coherence, _this.dotSpeed, 180);
                part = _this.dotSet.frameNum % _this.partitions;
                curset = nodeSets[part];
                _results = [];
                for (i = _j = 0, _ref1 = curset.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
                    xy = dx[i];
                    xy = [
                        xy[0] * _this.apRadius,
                        xy[1] * _this.apRadius
                    ];
                    console.log(xy);
                    curset[i].setPosition(xy);
                    if (!DotSet.inCircle(0.5 * _this.apRadius, 0.5 * _this.apRadius, _this.apRadius / 2, xy[0], xy[1])) {
                        _results.push(curset[i].hide());
                    } else {
                        _results.push(curset[i].show());
                    }
                }
                return _results;
            }, layer);
            layer.draw();
            return this.anim.start();
        };
        RandomDotMotion.prototype.render2 = function (context, layer) {
            var i, nodeSets, _i, _ref, _this = this;
            this.layers = function () {
                var _i, _ref, _results;
                _results = [];
                for (i = _i = 0, _ref = this.partitions; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                    _results.push(new Kinetic.Layer({ listening: false }));
                }
                return _results;
            }.call(this);
            _.map(this.layers, function (l) {
                return context.stage.add(l);
            });
            nodeSets = this.createInitialDots();
            for (i = _i = 0, _ref = this.partitions; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                this.displayInitialDots(nodeSets[i], this.layers[i]);
            }
            this.anim = new Kinetic.Animation(function (frame) {
                var curset, dx, part, xy, _j, _ref1;
                dx = _this.dotSet.nextFrame(_this.coherence, _this.dotSpeed, 180);
                part = _this.dotSet.frameNum % _this.partitions;
                curset = nodeSets[part];
                for (i = _j = 0, _ref1 = curset.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
                    xy = dx[i];
                    xy = [
                        xy[0] * _this.apRadius,
                        xy[1] * _this.apRadius
                    ];
                    console.log(xy);
                    curset[i].setPosition(xy);
                }
                return _this.layers[part].draw();
            });
            layer.draw();
            return this.anim.start();
        };
        RandomDotMotion.prototype.stop = function (context) {
            return this.anim.stop();
        };
        return RandomDotMotion;
    }(Base.Stimulus);
    x = new DotSet(51, 3);
    console.log(x.dotSets);
    console.log('NEXT', x.nextFrame(0.5, 0.01, 180));
}.call(this));
});
require.define('114', function(module, exports, __dirname, __filename, undefined){
(function () {
    var AbsoluteLayout, Background, Bacon, Base, GridLayout, Kinetic, KineticStimFactory, Layout, Q, Response, Stimulus, disableBrowserBack, doTimer, getTimestamp, input, lay, li, marked, renderable, ul, utils, _, _ref;
    Bacon = require('25', module).Bacon;
    Kinetic = require('27', module);
    _ = require('2', module);
    Q = require('9', module);
    marked = require('40', module);
    utils = require('76', module);
    lay = require('74', module);
    Base = require('73', module);
    Stimulus = Base.Stimulus;
    Response = Base.Response;
    Background = require('119', module).Background;
    _ref = require('60', module), renderable = _ref.renderable, ul = _ref.ul, li = _ref.li, input = _ref.input;
    Layout = lay.Layout;
    AbsoluteLayout = lay.AbsoluteLayout;
    GridLayout = lay.GridLayout;
    doTimer = utils.doTimer;
    disableBrowserBack = utils.disableBrowserBack;
    getTimestamp = utils.getTimeStamp;
    exports.KineticStimFactory = KineticStimFactory = function () {
        function KineticStimFactory() {
            console.log('making stim factory');
        }
        KineticStimFactory.prototype.makeLayout = function (name, params, context) {
        };
        KineticStimFactory.prototype.makeInstructions = function (spec) {
        };
        KineticStimFactory.prototype.makeStimulus = function (name, params, context) {
        };
        KineticStimFactory.prototype.makeResponse = function (name, params, context) {
        };
        KineticStimFactory.prototype.makeEvent = function (stim, response) {
        };
        return KineticStimFactory;
    }();
}.call(this));
});
require.define('119', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Background, Kinetic, Stimulus, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Kinetic = require('27', module).Kinetic;
    Stimulus = require('73', module).Stimulus;
    Background = function (_super) {
        __extends(Background, _super);
        function Background(stims, fill) {
            this.stims = stims != null ? stims : [];
            this.fill = fill != null ? fill : 'white';
            Background.__super__.constructor.call(this, {}, {});
        }
        Background.prototype.render = function (context, layer) {
            var background, stim, _i, _len, _ref, _results;
            background = new Kinetic.Rect({
                x: 0,
                y: 0,
                width: context.width(),
                height: context.height(),
                name: 'background',
                fill: this.fill
            });
            layer.add(background);
            _ref = this.stims;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                stim = _ref[_i];
                _results.push(stim.render(context, layer));
            }
            return _results;
        };
        return Background;
    }(Stimulus);
    exports.Background = Background;
}.call(this));
});
require.define('120', function(module, exports, __dirname, __filename, undefined){
RegExp.escape = function (s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};
(function (undefined) {
    'use strict';
    var $;
    if (typeof jQuery !== 'undefined' && jQuery) {
        $ = jQuery;
    } else {
        $ = {};
    }
    $.csv = {
        defaults: {
            separator: ',',
            delimiter: '"',
            headers: true
        },
        hooks: {
            castToScalar: function (value, state) {
                var hasDot = /\./;
                if (isNaN(value)) {
                    return value;
                } else {
                    if (hasDot.test(value)) {
                        return parseFloat(value);
                    } else {
                        var integer = parseInt(value);
                        if (isNaN(integer)) {
                            return null;
                        } else {
                            return integer;
                        }
                    }
                }
            }
        },
        parsers: {
            parse: function (csv, options) {
                var separator = options.separator;
                var delimiter = options.delimiter;
                if (!options.state.rowNum) {
                    options.state.rowNum = 1;
                }
                if (!options.state.colNum) {
                    options.state.colNum = 1;
                }
                var data = [];
                var entry = [];
                var state = 0;
                var value = '';
                var exit = false;
                function endOfEntry() {
                    state = 0;
                    value = '';
                    if (options.start && options.state.rowNum < options.start) {
                        entry = [];
                        options.state.rowNum++;
                        options.state.colNum = 1;
                        return;
                    }
                    if (options.onParseEntry === undefined) {
                        data.push(entry);
                    } else {
                        var hookVal = options.onParseEntry(entry, options.state);
                        if (hookVal !== false) {
                            data.push(hookVal);
                        }
                    }
                    entry = [];
                    if (options.end && options.state.rowNum >= options.end) {
                        exit = true;
                    }
                    options.state.rowNum++;
                    options.state.colNum = 1;
                }
                function endOfValue() {
                    if (options.onParseValue === undefined) {
                        entry.push(value);
                    } else {
                        var hook = options.onParseValue(value, options.state);
                        if (hook !== false) {
                            entry.push(hook);
                        }
                    }
                    value = '';
                    state = 0;
                    options.state.colNum++;
                }
                var escSeparator = RegExp.escape(separator);
                var escDelimiter = RegExp.escape(delimiter);
                var match = /(D|S|\r\n|\n|\r|[^DS\r\n]+)/;
                var matchSrc = match.source;
                matchSrc = matchSrc.replace(/S/g, escSeparator);
                matchSrc = matchSrc.replace(/D/g, escDelimiter);
                match = RegExp(matchSrc, 'gm');
                csv.replace(match, function (m0) {
                    if (exit) {
                        return;
                    }
                    switch (state) {
                    case 0:
                        if (m0 === separator) {
                            value += '';
                            endOfValue();
                            break;
                        }
                        if (m0 === delimiter) {
                            state = 1;
                            break;
                        }
                        if (/^(\r\n|\n|\r)$/.test(m0)) {
                            endOfValue();
                            endOfEntry();
                            break;
                        }
                        value += m0;
                        state = 3;
                        break;
                    case 1:
                        if (m0 === delimiter) {
                            state = 2;
                            break;
                        }
                        value += m0;
                        state = 1;
                        break;
                    case 2:
                        if (m0 === delimiter) {
                            value += m0;
                            state = 1;
                            break;
                        }
                        if (m0 === separator) {
                            endOfValue();
                            break;
                        }
                        if (/^(\r\n|\n|\r)$/.test(m0)) {
                            endOfValue();
                            endOfEntry();
                            break;
                        }
                        throw new Error('CSVDataError: Illegal State [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
                    case 3:
                        if (m0 === separator) {
                            endOfValue();
                            break;
                        }
                        if (/^(\r\n|\n|\r)$/.test(m0)) {
                            endOfValue();
                            endOfEntry();
                            break;
                        }
                        if (m0 === delimiter) {
                            throw new Error('CSVDataError: Illegal Quote [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
                        }
                        throw new Error('CSVDataError: Illegal Data [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
                    default:
                        throw new Error('CSVDataError: Unknown State [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
                    }
                });
                if (entry.length !== 0) {
                    endOfValue();
                    endOfEntry();
                }
                return data;
            },
            splitLines: function (csv, options) {
                var separator = options.separator;
                var delimiter = options.delimiter;
                if (!options.state.rowNum) {
                    options.state.rowNum = 1;
                }
                var entries = [];
                var state = 0;
                var entry = '';
                var exit = false;
                function endOfLine() {
                    state = 0;
                    if (options.start && options.state.rowNum < options.start) {
                        entry = '';
                        options.state.rowNum++;
                        return;
                    }
                    if (options.onParseEntry === undefined) {
                        entries.push(entry);
                    } else {
                        var hookVal = options.onParseEntry(entry, options.state);
                        if (hookVal !== false) {
                            entries.push(hookVal);
                        }
                    }
                    entry = '';
                    if (options.end && options.state.rowNum >= options.end) {
                        exit = true;
                    }
                    options.state.rowNum++;
                }
                var escSeparator = RegExp.escape(separator);
                var escDelimiter = RegExp.escape(delimiter);
                var match = /(D|S|\n|\r|[^DS\r\n]+)/;
                var matchSrc = match.source;
                matchSrc = matchSrc.replace(/S/g, escSeparator);
                matchSrc = matchSrc.replace(/D/g, escDelimiter);
                match = RegExp(matchSrc, 'gm');
                csv.replace(match, function (m0) {
                    if (exit) {
                        return;
                    }
                    switch (state) {
                    case 0:
                        if (m0 === separator) {
                            entry += m0;
                            state = 0;
                            break;
                        }
                        if (m0 === delimiter) {
                            entry += m0;
                            state = 1;
                            break;
                        }
                        if (m0 === '\n') {
                            endOfLine();
                            break;
                        }
                        if (/^\r$/.test(m0)) {
                            break;
                        }
                        entry += m0;
                        state = 3;
                        break;
                    case 1:
                        if (m0 === delimiter) {
                            entry += m0;
                            state = 2;
                            break;
                        }
                        entry += m0;
                        state = 1;
                        break;
                    case 2:
                        var prevChar = entry.substr(entry.length - 1);
                        if (m0 === delimiter && prevChar === delimiter) {
                            entry += m0;
                            state = 1;
                            break;
                        }
                        if (m0 === separator) {
                            entry += m0;
                            state = 0;
                            break;
                        }
                        if (m0 === '\n') {
                            endOfLine();
                            break;
                        }
                        if (m0 === '\r') {
                            break;
                        }
                        throw new Error('CSVDataError: Illegal state [Row:' + options.state.rowNum + ']');
                    case 3:
                        if (m0 === separator) {
                            entry += m0;
                            state = 0;
                            break;
                        }
                        if (m0 === '\n') {
                            endOfLine();
                            break;
                        }
                        if (m0 === '\r') {
                            break;
                        }
                        if (m0 === delimiter) {
                            throw new Error('CSVDataError: Illegal quote [Row:' + options.state.rowNum + ']');
                        }
                        throw new Error('CSVDataError: Illegal state [Row:' + options.state.rowNum + ']');
                    default:
                        throw new Error('CSVDataError: Unknown state [Row:' + options.state.rowNum + ']');
                    }
                });
                if (entry !== '') {
                    endOfLine();
                }
                return entries;
            },
            parseEntry: function (csv, options) {
                var separator = options.separator;
                var delimiter = options.delimiter;
                if (!options.state.rowNum) {
                    options.state.rowNum = 1;
                }
                if (!options.state.colNum) {
                    options.state.colNum = 1;
                }
                var entry = [];
                var state = 0;
                var value = '';
                function endOfValue() {
                    if (options.onParseValue === undefined) {
                        entry.push(value);
                    } else {
                        var hook = options.onParseValue(value, options.state);
                        if (hook !== false) {
                            entry.push(hook);
                        }
                    }
                    value = '';
                    state = 0;
                    options.state.colNum++;
                }
                if (!options.match) {
                    var escSeparator = RegExp.escape(separator);
                    var escDelimiter = RegExp.escape(delimiter);
                    var match = /(D|S|\n|\r|[^DS\r\n]+)/;
                    var matchSrc = match.source;
                    matchSrc = matchSrc.replace(/S/g, escSeparator);
                    matchSrc = matchSrc.replace(/D/g, escDelimiter);
                    options.match = RegExp(matchSrc, 'gm');
                }
                csv.replace(options.match, function (m0) {
                    switch (state) {
                    case 0:
                        if (m0 === separator) {
                            value += '';
                            endOfValue();
                            break;
                        }
                        if (m0 === delimiter) {
                            state = 1;
                            break;
                        }
                        if (m0 === '\n' || m0 === '\r') {
                            break;
                        }
                        value += m0;
                        state = 3;
                        break;
                    case 1:
                        if (m0 === delimiter) {
                            state = 2;
                            break;
                        }
                        value += m0;
                        state = 1;
                        break;
                    case 2:
                        if (m0 === delimiter) {
                            value += m0;
                            state = 1;
                            break;
                        }
                        if (m0 === separator) {
                            endOfValue();
                            break;
                        }
                        if (m0 === '\n' || m0 === '\r') {
                            break;
                        }
                        throw new Error('CSVDataError: Illegal State [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
                    case 3:
                        if (m0 === separator) {
                            endOfValue();
                            break;
                        }
                        if (m0 === '\n' || m0 === '\r') {
                            break;
                        }
                        if (m0 === delimiter) {
                            throw new Error('CSVDataError: Illegal Quote [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
                        }
                        throw new Error('CSVDataError: Illegal Data [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
                    default:
                        throw new Error('CSVDataError: Unknown State [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
                    }
                });
                endOfValue();
                return entry;
            }
        },
        helpers: {
            collectPropertyNames: function (objects) {
                var o, propName, props = [];
                for (o in objects) {
                    for (propName in objects[o]) {
                        if (objects[o].hasOwnProperty(propName) && props.indexOf(propName) < 0 && typeof objects[o][propName] !== 'function') {
                            props.push(propName);
                        }
                    }
                }
                return props;
            }
        },
        toArray: function (csv, options, callback) {
            var options = options !== undefined ? options : {};
            var config = {};
            config.callback = callback !== undefined && typeof callback === 'function' ? callback : false;
            config.separator = 'separator' in options ? options.separator : $.csv.defaults.separator;
            config.delimiter = 'delimiter' in options ? options.delimiter : $.csv.defaults.delimiter;
            var state = options.state !== undefined ? options.state : {};
            var options = {
                    delimiter: config.delimiter,
                    separator: config.separator,
                    onParseEntry: options.onParseEntry,
                    onParseValue: options.onParseValue,
                    state: state
                };
            var entry = $.csv.parsers.parseEntry(csv, options);
            if (!config.callback) {
                return entry;
            } else {
                config.callback('', entry);
            }
        },
        toArrays: function (csv, options, callback) {
            var options = options !== undefined ? options : {};
            var config = {};
            config.callback = callback !== undefined && typeof callback === 'function' ? callback : false;
            config.separator = 'separator' in options ? options.separator : $.csv.defaults.separator;
            config.delimiter = 'delimiter' in options ? options.delimiter : $.csv.defaults.delimiter;
            var data = [];
            var options = {
                    delimiter: config.delimiter,
                    separator: config.separator,
                    onParseEntry: options.onParseEntry,
                    onParseValue: options.onParseValue,
                    start: options.start,
                    end: options.end,
                    state: {
                        rowNum: 1,
                        colNum: 1
                    }
                };
            data = $.csv.parsers.parse(csv, options);
            if (!config.callback) {
                return data;
            } else {
                config.callback('', data);
            }
        },
        toObjects: function (csv, options, callback) {
            var options = options !== undefined ? options : {};
            var config = {};
            config.callback = callback !== undefined && typeof callback === 'function' ? callback : false;
            config.separator = 'separator' in options ? options.separator : $.csv.defaults.separator;
            config.delimiter = 'delimiter' in options ? options.delimiter : $.csv.defaults.delimiter;
            config.headers = 'headers' in options ? options.headers : $.csv.defaults.headers;
            options.start = 'start' in options ? options.start : 1;
            if (config.headers) {
                options.start++;
            }
            if (options.end && config.headers) {
                options.end++;
            }
            var lines = [];
            var data = [];
            var options = {
                    delimiter: config.delimiter,
                    separator: config.separator,
                    onParseEntry: options.onParseEntry,
                    onParseValue: options.onParseValue,
                    start: options.start,
                    end: options.end,
                    state: {
                        rowNum: 1,
                        colNum: 1
                    },
                    match: false,
                    transform: options.transform
                };
            var headerOptions = {
                    delimiter: config.delimiter,
                    separator: config.separator,
                    start: 1,
                    end: 1,
                    state: {
                        rowNum: 1,
                        colNum: 1
                    }
                };
            var headerLine = $.csv.parsers.splitLines(csv, headerOptions);
            var headers = $.csv.toArray(headerLine[0], options);
            var lines = $.csv.parsers.splitLines(csv, options);
            options.state.colNum = 1;
            if (headers) {
                options.state.rowNum = 2;
            } else {
                options.state.rowNum = 1;
            }
            for (var i = 0, len = lines.length; i < len; i++) {
                var entry = $.csv.toArray(lines[i], options);
                var object = {};
                for (var j in headers) {
                    object[headers[j]] = entry[j];
                }
                if (options.transform !== undefined) {
                    data.push(options.transform.call(undefined, object));
                } else {
                    data.push(object);
                }
                options.state.rowNum++;
            }
            if (!config.callback) {
                return data;
            } else {
                config.callback('', data);
            }
        },
        fromArrays: function (arrays, options, callback) {
            var options = options !== undefined ? options : {};
            var config = {};
            config.callback = callback !== undefined && typeof callback === 'function' ? callback : false;
            config.separator = 'separator' in options ? options.separator : $.csv.defaults.separator;
            config.delimiter = 'delimiter' in options ? options.delimiter : $.csv.defaults.delimiter;
            var output = '', line, lineValues, i, j;
            for (i = 0; i < arrays.length; i++) {
                line = arrays[i];
                lineValues = [];
                for (j = 0; j < line.length; j++) {
                    var strValue = line[j] === undefined || line[j] === null ? '' : line[j].toString();
                    if (strValue.indexOf(config.delimiter) > -1) {
                        strValue = strValue.replace(config.delimiter, config.delimiter + config.delimiter);
                    }
                    var escMatcher = '\n|\r|S|D';
                    escMatcher = escMatcher.replace('S', config.separator);
                    escMatcher = escMatcher.replace('D', config.delimiter);
                    if (strValue.search(escMatcher) > -1) {
                        strValue = config.delimiter + strValue + config.delimiter;
                    }
                    lineValues.push(strValue);
                }
                output += lineValues.join(config.separator) + '\r\n';
            }
            if (!config.callback) {
                return output;
            } else {
                config.callback('', output);
            }
        },
        fromObjects: function (objects, options, callback) {
            var options = options !== undefined ? options : {};
            var config = {};
            config.callback = callback !== undefined && typeof callback === 'function' ? callback : false;
            config.separator = 'separator' in options ? options.separator : $.csv.defaults.separator;
            config.delimiter = 'delimiter' in options ? options.delimiter : $.csv.defaults.delimiter;
            config.headers = 'headers' in options ? options.headers : $.csv.defaults.headers;
            config.sortOrder = 'sortOrder' in options ? options.sortOrder : 'declare';
            config.manualOrder = 'manualOrder' in options ? options.manualOrder : [];
            config.transform = options.transform;
            if (typeof config.manualOrder === 'string') {
                config.manualOrder = $.csv.toArray(config.manualOrder, config);
            }
            if (config.transform !== undefined) {
                var origObjects = objects;
                objects = [];
                var i;
                for (i = 0; i < origObjects.length; i++) {
                    objects.push(config.transform.call(undefined, origObjects[i]));
                }
            }
            var props = $.csv.helpers.collectPropertyNames(objects);
            if (config.sortOrder === 'alpha') {
                props.sort();
            }
            if (config.manualOrder.length > 0) {
                var propsManual = [].concat(config.manualOrder);
                var p;
                for (p = 0; p < props.length; p++) {
                    if (propsManual.indexOf(props[p]) < 0) {
                        propsManual.push(props[p]);
                    }
                }
                props = propsManual;
            }
            var o, p, line, output = [], propName;
            if (config.headers) {
                output.push(props);
            }
            for (o = 0; o < objects.length; o++) {
                line = [];
                for (p = 0; p < props.length; p++) {
                    propName = props[p];
                    if (propName in objects[o] && typeof objects[o][propName] !== 'function') {
                        line.push(objects[o][propName]);
                    } else {
                        line.push('');
                    }
                }
                output.push(line);
            }
            return $.csv.fromArrays(output, options, config.callback);
        }
    };
    $.csvEntry2Array = $.csv.toArray;
    $.csv2Array = $.csv.toArrays;
    $.csv2Dictionary = $.csv.toObjects;
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = $.csv;
    }
}.call(this));
});
require.define('122', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Canvas, ComponentFactory, Components, DefaultComponentFactory, Html, Layout, Psy, _, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    _ = require('2', module);
    Canvas = require('80', module).Canvas;
    Html = require('81', module).Html;
    Components = require('82', module);
    Psy = require('83', module);
    Layout = require('74', module);
    ComponentFactory = function () {
        function ComponentFactory(context) {
            this.context = context;
        }
        ComponentFactory.prototype.buildStimulus = function (spec) {
            var params, stimType;
            stimType = _.keys(spec)[0];
            params = _.values(spec)[0];
            return this.makeStimulus(stimType, params);
        };
        ComponentFactory.prototype.buildResponse = function (spec) {
            var params, responseType;
            responseType = _.keys(spec)[0];
            params = _.values(spec)[0];
            return this.makeResponse(responseType, params);
        };
        ComponentFactory.prototype.buildEvent = function (spec) {
            var response, responseSpec, stim, stimSpec;
            if (spec.Next == null) {
                console.log('error building event with spec: ', spec);
                throw new Error('Event specification does not contain \'Next\' element');
            }
            stimSpec = _.omit(spec, 'Next');
            responseSpec = _.pick(spec, 'Next');
            stim = this.buildStimulus(stimSpec);
            response = this.buildResponse(responseSpec.Next);
            return this.makeEvent(stim, response);
        };
        ComponentFactory.prototype.make = function (name, params, registry) {
            throw new Error('unimplemented', name, params, registry);
        };
        ComponentFactory.prototype.makeStimulus = function (name, params) {
            throw new Error('unimplemented', name, params);
        };
        ComponentFactory.prototype.makeResponse = function (name, params) {
            throw new Error('unimplemented', name, params);
        };
        ComponentFactory.prototype.makeEvent = function (stim, response) {
            throw new Error('unimplemented', stim, response);
        };
        ComponentFactory.prototype.makeLayout = function (name, params, context) {
            throw new Error('unimplemented', name, params, context);
        };
        return ComponentFactory;
    }();
    exports.ComponentFactory = ComponentFactory;
    DefaultComponentFactory = function (_super) {
        __extends(DefaultComponentFactory, _super);
        function DefaultComponentFactory() {
            this.registry = _.merge(Components, Canvas, Html);
        }
        DefaultComponentFactory.prototype.make = function (name, params, registry) {
            var callee, layoutName, layoutParams, names, props, resps, stims, _i, _j, _k, _ref, _ref1, _ref2, _results, _results1, _results2, _this = this;
            callee = arguments.callee;
            console.log('making', name);
            switch (name) {
            case 'Group':
                console.log('building group');
                names = _.map(params.stims, function (stim) {
                    return _.keys(stim)[0];
                });
                props = _.map(params.stims, function (stim) {
                    return _.values(stim)[0];
                });
                stims = _.map(function () {
                    _results = [];
                    for (var _i = 0, _ref = names.length; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
                        _results.push(_i);
                    }
                    return _results;
                }.apply(this), function (i) {
                    return callee(names[i], props[i], _this.registry);
                });
                if (params.layout != null) {
                    layoutName = _.keys(params.layout)[0];
                    layoutParams = _.values(params.layout)[0];
                    return new Components.Group(stims, this.makeLayout(layoutName, layoutParams, context));
                } else {
                    return new Components.Group(stims);
                }
                break;
            case 'Background':
                console.log('building background', params);
                names = _.keys(params);
                props = _.values(params);
                console.log('names', names);
                console.log('props', props);
                stims = _.map(function () {
                    _results1 = [];
                    for (var _j = 0, _ref1 = names.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; 0 <= _ref1 ? _j++ : _j--) {
                        _results1.push(_j);
                    }
                    return _results1;
                }.apply(this), function (i) {
                    return callee(names[i], props[i], _this.registry);
                });
                return new Canvas.Background(stims);
            case 'First':
                names = _.keys(params);
                props = _.values(params);
                resps = _.map(function () {
                    _results2 = [];
                    for (var _k = 0, _ref2 = names.length; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; 0 <= _ref2 ? _k++ : _k--) {
                        _results2.push(_k);
                    }
                    return _results2;
                }.apply(this), function (i) {
                    return callee(names[i], props[i], _this.registry);
                });
                return new Components.First(resps);
            default:
                if (registry[name] == null) {
                    console.log('registry is', registry);
                    throw new Error('DefaultComponentFactory:make cannot find component in registry named: ', name);
                }
                return new registry[name](params);
            }
        };
        DefaultComponentFactory.prototype.makeStimulus = function (name, params) {
            return this.make(name, params, this.registry);
        };
        DefaultComponentFactory.prototype.makeResponse = function (name, params) {
            return this.make(name, params, this.registry);
        };
        DefaultComponentFactory.prototype.makeEvent = function (stim, response) {
            return new Psy.Event(stim, response);
        };
        DefaultComponentFactory.prototype.makeLayout = function (name, params, context) {
            switch (name) {
            case 'Grid':
                return new Layout.GridLayout(params[0], params[1], {
                    x: 0,
                    y: 0,
                    width: context.width(),
                    height: context.height()
                });
            default:
                return console.log('unrecognized layout', name);
            }
        };
        return DefaultComponentFactory;
    }(ComponentFactory);
    exports.DefaultComponentFactory = DefaultComponentFactory;
    exports.componentFactory = new DefaultComponentFactory();
    console.log('exports.DefaultComponentFactory', DefaultComponentFactory);
}.call(this));
});
require.define('123', function(module, exports, __dirname, __filename, undefined){
(function () {
    var divide_list, get_type, __slice = [].slice;
    get_type = function (varable) {
        var as_string;
        as_string = Object.prototype.toString.call(varable);
        return as_string.slice(1, -1).split(' ')[1].toLowerCase();
    };
    divide_list = function (stack, long_list) {
        var keys;
        if (long_list.length > 0) {
            if (get_type(long_list[0]) === 'object') {
                keys = Object.keys(long_list[0]);
                keys.forEach(function (key) {
                    return stack.push({
                        pattern: key,
                        result: long_list[0][key]
                    });
                });
                return divide_list(stack, long_list.slice(1));
            } else {
                stack.push({
                    pattern: long_list[0],
                    result: long_list[1]
                });
                return divide_list(stack, long_list.slice(2));
            }
        } else {
            return stack;
        }
    };
    exports.match = function () {
        var choices, chosen, data, possible, sure;
        data = arguments[0], choices = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        possible = divide_list([], choices).filter(function (solution) {
            var the_type;
            the_type = get_type(solution.pattern);
            if (solution.pattern === void 0) {
                return true;
            } else if (the_type === 'regexp') {
                if (get_type(data) === 'string') {
                    return data.match(solution.pattern);
                } else {
                    return false;
                }
            } else if (the_type === 'function') {
                return solution.pattern(data);
            } else {
                return data === solution.pattern;
            }
        });
        sure = possible.filter(function (solution) {
            return solution.pattern != null;
        });
        chosen = sure.length > 0 ? sure[0] : possible[0];
        if (chosen != null) {
            if (get_type(chosen.result) === 'function') {
                return chosen.result(data);
            } else {
                return chosen.result;
            }
        } else {
            return chosen;
        }
    };
}.call(this));
});
require.define('124', function(module, exports, __dirname, __filename, undefined){
(function () {
    var Nothing, Stimulus, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    Stimulus = require('73', module).Stimulus;
    Nothing = function (_super) {
        __extends(Nothing, _super);
        function Nothing(spec) {
            if (spec == null) {
                spec = {};
            }
            Nothing.__super__.constructor.call(this, spec);
        }
        Nothing.prototype.render = function (context, layer) {
        };
        return Nothing;
    }(Stimulus);
    exports.Nothing = Nothing;
}.call(this));
});
return require('55');
})((function() {
  var loading = {};
  var files = {};
  var outer;
  if (typeof require === 'function') {
    outer = require;
  }
  function inner(id, parentModule) {
    if({}.hasOwnProperty.call(inner.cache, id))
      return inner.cache[id];

    if({}.hasOwnProperty.call(loading, id))
      return loading[id].exports;

    var resolved = inner.resolve(id);
    if(!resolved && outer) {
      return inner.cache[id] = outer(id);
    }
    if(!resolved) throw new Error("Failed to resolve module '" + id + "'");

    var dirname;
    var filename = files[id] || '';
    if (filename && typeof __dirname === 'string')
      filename = __dirname + '/' + filename;
    if (filename)
      dirname = filename.slice(0, filename.lastIndexOf('/') + 1);
    else
      dirname = '';
    var module$ = {
      id: id,
      require: inner,
      exports: {},
      loaded: false,
      parent: parentModule,
      children: []
    };
    if(parentModule) parentModule.children.push(module$);

    loading[id] = module$;
    resolved.call(this, module$, module$.exports, dirname, filename);
    inner.cache[id] = module$.exports;
    delete loading[id];
    module$.loaded = true;
    return inner.cache[id] = module$.exports;
  }

  inner.modules = {};
  inner.cache = {};

  inner.resolve = function(id){
    return {}.hasOwnProperty.call(inner.modules, id) ? inner.modules[id] : void 0;
  };
  inner.define = function(id, fn){ inner.modules[id] = fn; };

  return inner;
})()));
//# sourceMappingURL=psycloud.js.map
/*! jQuery v1.7 jquery.com | jquery.org/license */
(function(a,b){function cA(a){return f.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1}function cx(a){if(!cm[a]){var b=c.body,d=f("<"+a+">").appendTo(b),e=d.css("display");d.remove();if(e==="none"||e===""){cn||(cn=c.createElement("iframe"),cn.frameBorder=cn.width=cn.height=0),b.appendChild(cn);if(!co||!cn.createElement)co=(cn.contentWindow||cn.contentDocument).document,co.write((c.compatMode==="CSS1Compat"?"<!doctype html>":"")+"<html><body>"),co.close();d=co.createElement(a),co.body.appendChild(d),e=f.css(d,"display"),b.removeChild(cn)}cm[a]=e}return cm[a]}function cw(a,b){var c={};f.each(cs.concat.apply([],cs.slice(0,b)),function(){c[this]=a});return c}function cv(){ct=b}function cu(){setTimeout(cv,0);return ct=f.now()}function cl(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}function ck(){try{return new a.XMLHttpRequest}catch(b){}}function ce(a,c){a.dataFilter&&(c=a.dataFilter(c,a.dataType));var d=a.dataTypes,e={},g,h,i=d.length,j,k=d[0],l,m,n,o,p;for(g=1;g<i;g++){if(g===1)for(h in a.converters)typeof h=="string"&&(e[h.toLowerCase()]=a.converters[h]);l=k,k=d[g];if(k==="*")k=l;else if(l!=="*"&&l!==k){m=l+" "+k,n=e[m]||e["* "+k];if(!n){p=b;for(o in e){j=o.split(" ");if(j[0]===l||j[0]==="*"){p=e[j[1]+" "+k];if(p){o=e[o],o===!0?n=p:p===!0&&(n=o);break}}}}!n&&!p&&f.error("No conversion from "+m.replace(" "," to ")),n!==!0&&(c=n?n(c):p(o(c)))}}return c}function cd(a,c,d){var e=a.contents,f=a.dataTypes,g=a.responseFields,h,i,j,k;for(i in g)i in d&&(c[g[i]]=d[i]);while(f[0]==="*")f.shift(),h===b&&(h=a.mimeType||c.getResponseHeader("content-type"));if(h)for(i in e)if(e[i]&&e[i].test(h)){f.unshift(i);break}if(f[0]in d)j=f[0];else{for(i in d){if(!f[0]||a.converters[i+" "+f[0]]){j=i;break}k||(k=i)}j=j||k}if(j){j!==f[0]&&f.unshift(j);return d[j]}}function cc(a,b,c,d){if(f.isArray(b))f.each(b,function(b,e){c||bG.test(a)?d(a,e):cc(a+"["+(typeof e=="object"||f.isArray(e)?b:"")+"]",e,c,d)});else if(!c&&b!=null&&typeof b=="object")for(var e in b)cc(a+"["+e+"]",b[e],c,d);else d(a,b)}function cb(a,c){var d,e,g=f.ajaxSettings.flatOptions||{};for(d in c)c[d]!==b&&((g[d]?a:e||(e={}))[d]=c[d]);e&&f.extend(!0,a,e)}function ca(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;var h=a[f],i=0,j=h?h.length:0,k=a===bV,l;for(;i<j&&(k||!l);i++)l=h[i](c,d,e),typeof l=="string"&&(!k||g[l]?l=b:(c.dataTypes.unshift(l),l=ca(a,c,d,e,l,g)));(k||!l)&&!g["*"]&&(l=ca(a,c,d,e,"*",g));return l}function b_(a){return function(b,c){typeof b!="string"&&(c=b,b="*");if(f.isFunction(c)){var d=b.toLowerCase().split(bR),e=0,g=d.length,h,i,j;for(;e<g;e++)h=d[e],j=/^\+/.test(h),j&&(h=h.substr(1)||"*"),i=a[h]=a[h]||[],i[j?"unshift":"push"](c)}}}function bE(a,b,c){var d=b==="width"?a.offsetWidth:a.offsetHeight,e=b==="width"?bz:bA;if(d>0){c!=="border"&&f.each(e,function(){c||(d-=parseFloat(f.css(a,"padding"+this))||0),c==="margin"?d+=parseFloat(f.css(a,c+this))||0:d-=parseFloat(f.css(a,"border"+this+"Width"))||0});return d+"px"}d=bB(a,b,b);if(d<0||d==null)d=a.style[b]||0;d=parseFloat(d)||0,c&&f.each(e,function(){d+=parseFloat(f.css(a,"padding"+this))||0,c!=="padding"&&(d+=parseFloat(f.css(a,"border"+this+"Width"))||0),c==="margin"&&(d+=parseFloat(f.css(a,c+this))||0)});return d+"px"}function br(a,b){b.src?f.ajax({url:b.src,async:!1,dataType:"script"}):f.globalEval((b.text||b.textContent||b.innerHTML||"").replace(bi,"/*$0*/")),b.parentNode&&b.parentNode.removeChild(b)}function bq(a){var b=(a.nodeName||"").toLowerCase();b==="input"?bp(a):b!=="script"&&typeof a.getElementsByTagName!="undefined"&&f.grep(a.getElementsByTagName("input"),bp)}function bp(a){if(a.type==="checkbox"||a.type==="radio")a.defaultChecked=a.checked}function bo(a){return typeof a.getElementsByTagName!="undefined"?a.getElementsByTagName("*"):typeof a.querySelectorAll!="undefined"?a.querySelectorAll("*"):[]}function bn(a,b){var c;if(b.nodeType===1){b.clearAttributes&&b.clearAttributes(),b.mergeAttributes&&b.mergeAttributes(a),c=b.nodeName.toLowerCase();if(c==="object")b.outerHTML=a.outerHTML;else if(c!=="input"||a.type!=="checkbox"&&a.type!=="radio"){if(c==="option")b.selected=a.defaultSelected;else if(c==="input"||c==="textarea")b.defaultValue=a.defaultValue}else a.checked&&(b.defaultChecked=b.checked=a.checked),b.value!==a.value&&(b.value=a.value);b.removeAttribute(f.expando)}}function bm(a,b){if(b.nodeType===1&&!!f.hasData(a)){var c,d,e,g=f._data(a),h=f._data(b,g),i=g.events;if(i){delete h.handle,h.events={};for(c in i)for(d=0,e=i[c].length;d<e;d++)f.event.add(b,c+(i[c][d].namespace?".":"")+i[c][d].namespace,i[c][d],i[c][d].data)}h.data&&(h.data=f.extend({},h.data))}}function bl(a,b){return f.nodeName(a,"table")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function X(a){var b=Y.split(" "),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}function W(a,b,c){b=b||0;if(f.isFunction(b))return f.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c});if(b.nodeType)return f.grep(a,function(a,d){return a===b===c});if(typeof b=="string"){var d=f.grep(a,function(a){return a.nodeType===1});if(R.test(b))return f.filter(b,d,!c);b=f.filter(b,d)}return f.grep(a,function(a,d){return f.inArray(a,b)>=0===c})}function V(a){return!a||!a.parentNode||a.parentNode.nodeType===11}function N(){return!0}function M(){return!1}function n(a,b,c){var d=b+"defer",e=b+"queue",g=b+"mark",h=f._data(a,d);h&&(c==="queue"||!f._data(a,e))&&(c==="mark"||!f._data(a,g))&&setTimeout(function(){!f._data(a,e)&&!f._data(a,g)&&(f.removeData(a,d,!0),h.fire())},0)}function m(a){for(var b in a){if(b==="data"&&f.isEmptyObject(a[b]))continue;if(b!=="toJSON")return!1}return!0}function l(a,c,d){if(d===b&&a.nodeType===1){var e="data-"+c.replace(k,"-$1").toLowerCase();d=a.getAttribute(e);if(typeof d=="string"){try{d=d==="true"?!0:d==="false"?!1:d==="null"?null:f.isNumeric(d)?parseFloat(d):j.test(d)?f.parseJSON(d):d}catch(g){}f.data(a,c,d)}else d=b}return d}function h(a){var b=g[a]={},c,d;a=a.split(/\s+/);for(c=0,d=a.length;c<d;c++)b[a[c]]=!0;return b}var c=a.document,d=a.navigator,e=a.location,f=function(){function K(){if(!e.isReady){try{c.documentElement.doScroll("left")}catch(a){setTimeout(K,1);return}e.ready()}}var e=function(a,b){return new e.fn.init(a,b,h)},f=a.jQuery,g=a.$,h,i=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,j=/\S/,k=/^\s+/,l=/\s+$/,m=/\d/,n=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,o=/^[\],:{}\s]*$/,p=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,q=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,r=/(?:^|:|,)(?:\s*\[)+/g,s=/(webkit)[ \/]([\w.]+)/,t=/(opera)(?:.*version)?[ \/]([\w.]+)/,u=/(msie) ([\w.]+)/,v=/(mozilla)(?:.*? rv:([\w.]+))?/,w=/-([a-z]|[0-9])/ig,x=/^-ms-/,y=function(a,b){return(b+"").toUpperCase()},z=d.userAgent,A,B,C,D=Object.prototype.toString,E=Object.prototype.hasOwnProperty,F=Array.prototype.push,G=Array.prototype.slice,H=String.prototype.trim,I=Array.prototype.indexOf,J={};e.fn=e.prototype={constructor:e,init:function(a,d,f){var g,h,j,k;if(!a)return this;if(a.nodeType){this.context=this[0]=a,this.length=1;return this}if(a==="body"&&!d&&c.body){this.context=c,this[0]=c.body,this.selector=a,this.length=1;return this}if(typeof a=="string"){a.charAt(0)!=="<"||a.charAt(a.length-1)!==">"||a.length<3?g=i.exec(a):g=[null,a,null];if(g&&(g[1]||!d)){if(g[1]){d=d instanceof e?d[0]:d,k=d?d.ownerDocument||d:c,j=n.exec(a),j?e.isPlainObject(d)?(a=[c.createElement(j[1])],e.fn.attr.call(a,d,!0)):a=[k.createElement(j[1])]:(j=e.buildFragment([g[1]],[k]),a=(j.cacheable?e.clone(j.fragment):j.fragment).childNodes);return e.merge(this,a)}h=c.getElementById(g[2]);if(h&&h.parentNode){if(h.id!==g[2])return f.find(a);this.length=1,this[0]=h}this.context=c,this.selector=a;return this}return!d||d.jquery?(d||f).find(a):this.constructor(d).find(a)}if(e.isFunction(a))return f.ready(a);a.selector!==b&&(this.selector=a.selector,this.context=a.context);return e.makeArray(a,this)},selector:"",jquery:"1.7",length:0,size:function(){return this.length},toArray:function(){return G.call(this,0)},get:function(a){return a==null?this.toArray():a<0?this[this.length+a]:this[a]},pushStack:function(a,b,c){var d=this.constructor();e.isArray(a)?F.apply(d,a):e.merge(d,a),d.prevObject=this,d.context=this.context,b==="find"?d.selector=this.selector+(this.selector?" ":"")+c:b&&(d.selector=this.selector+"."+b+"("+c+")");return d},each:function(a,b){return e.each(this,a,b)},ready:function(a){e.bindReady(),B.add(a);return this},eq:function(a){return a===-1?this.slice(a):this.slice(a,+a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(G.apply(this,arguments),"slice",G.call(arguments).join(","))},map:function(a){return this.pushStack(e.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:F,sort:[].sort,splice:[].splice},e.fn.init.prototype=e.fn,e.extend=e.fn.extend=function(){var a,c,d,f,g,h,i=arguments[0]||{},j=1,k=arguments.length,l=!1;typeof i=="boolean"&&(l=i,i=arguments[1]||{},j=2),typeof i!="object"&&!e.isFunction(i)&&(i={}),k===j&&(i=this,--j);for(;j<k;j++)if((a=arguments[j])!=null)for(c in a){d=i[c],f=a[c];if(i===f)continue;l&&f&&(e.isPlainObject(f)||(g=e.isArray(f)))?(g?(g=!1,h=d&&e.isArray(d)?d:[]):h=d&&e.isPlainObject(d)?d:{},i[c]=e.extend(l,h,f)):f!==b&&(i[c]=f)}return i},e.extend({noConflict:function(b){a.$===e&&(a.$=g),b&&a.jQuery===e&&(a.jQuery=f);return e},isReady:!1,readyWait:1,holdReady:function(a){a?e.readyWait++:e.ready(!0)},ready:function(a){if(a===!0&&!--e.readyWait||a!==!0&&!e.isReady){if(!c.body)return setTimeout(e.ready,1);e.isReady=!0;if(a!==!0&&--e.readyWait>0)return;B.fireWith(c,[e]),e.fn.trigger&&e(c).trigger("ready").unbind("ready")}},bindReady:function(){if(!B){B=e.Callbacks("once memory");if(c.readyState==="complete")return setTimeout(e.ready,1);if(c.addEventListener)c.addEventListener("DOMContentLoaded",C,!1),a.addEventListener("load",e.ready,!1);else if(c.attachEvent){c.attachEvent("onreadystatechange",C),a.attachEvent("onload",e.ready);var b=!1;try{b=a.frameElement==null}catch(d){}c.documentElement.doScroll&&b&&K()}}},isFunction:function(a){return e.type(a)==="function"},isArray:Array.isArray||function(a){return e.type(a)==="array"},isWindow:function(a){return a&&typeof a=="object"&&"setInterval"in a},isNumeric:function(a){return a!=null&&m.test(a)&&!isNaN(a)},type:function(a){return a==null?String(a):J[D.call(a)]||"object"},isPlainObject:function(a){if(!a||e.type(a)!=="object"||a.nodeType||e.isWindow(a))return!1;try{if(a.constructor&&!E.call(a,"constructor")&&!E.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}var d;for(d in a);return d===b||E.call(a,d)},isEmptyObject:function(a){for(var b in a)return!1;return!0},error:function(a){throw a},parseJSON:function(b){if(typeof b!="string"||!b)return null;b=e.trim(b);if(a.JSON&&a.JSON.parse)return a.JSON.parse(b);if(o.test(b.replace(p,"@").replace(q,"]").replace(r,"")))return(new Function("return "+b))();e.error("Invalid JSON: "+b)},parseXML:function(c){var d,f;try{a.DOMParser?(f=new DOMParser,d=f.parseFromString(c,"text/xml")):(d=new ActiveXObject("Microsoft.XMLDOM"),d.async="false",d.loadXML(c))}catch(g){d=b}(!d||!d.documentElement||d.getElementsByTagName("parsererror").length)&&e.error("Invalid XML: "+c);return d},noop:function(){},globalEval:function(b){b&&j.test(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(x,"ms-").replace(w,y)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,c,d){var f,g=0,h=a.length,i=h===b||e.isFunction(a);if(d){if(i){for(f in a)if(c.apply(a[f],d)===!1)break}else for(;g<h;)if(c.apply(a[g++],d)===!1)break}else if(i){for(f in a)if(c.call(a[f],f,a[f])===!1)break}else for(;g<h;)if(c.call(a[g],g,a[g++])===!1)break;return a},trim:H?function(a){return a==null?"":H.call(a)}:function(a){return a==null?"":(a+"").replace(k,"").replace(l,"")},makeArray:function(a,b){var c=b||[];if(a!=null){var d=e.type(a);a.length==null||d==="string"||d==="function"||d==="regexp"||e.isWindow(a)?F.call(c,a):e.merge(c,a)}return c},inArray:function(a,b,c){var d;if(b){if(I)return I.call(b,a,c);d=b.length,c=c?c<0?Math.max(0,d+c):c:0;for(;c<d;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,c){var d=a.length,e=0;if(typeof c.length=="number")for(var f=c.length;e<f;e++)a[d++]=c[e];else while(c[e]!==b)a[d++]=c[e++];a.length=d;return a},grep:function(a,b,c){var d=[],e;c=!!c;for(var f=0,g=a.length;f<g;f++)e=!!b(a[f],f),c!==e&&d.push(a[f]);return d},map:function(a,c,d){var f,g,h=[],i=0,j=a.length,k=a instanceof e||j!==b&&typeof j=="number"&&(j>0&&a[0]&&a[j-1]||j===0||e.isArray(a));if(k)for(;i<j;i++)f=c(a[i],i,d),f!=null&&(h[h.length]=f);else for(g in a)f=c(a[g],g,d),f!=null&&(h[h.length]=f);return h.concat.apply([],h)},guid:1,proxy:function(a,c){if(typeof c=="string"){var d=a[c];c=a,a=d}if(!e.isFunction(a))return b;var f=G.call(arguments,2),g=function(){return a.apply(c,f.concat(G.call(arguments)))};g.guid=a.guid=a.guid||g.guid||e.guid++;return g},access:function(a,c,d,f,g,h){var i=a.length;if(typeof c=="object"){for(var j in c)e.access(a,j,c[j],f,g,d);return a}if(d!==b){f=!h&&f&&e.isFunction(d);for(var k=0;k<i;k++)g(a[k],c,f?d.call(a[k],k,g(a[k],c)):d,h);return a}return i?g(a[0],c):b},now:function(){return(new Date).getTime()},uaMatch:function(a){a=a.toLowerCase();var b=s.exec(a)||t.exec(a)||u.exec(a)||a.indexOf("compatible")<0&&v.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},sub:function(){function a(b,c){return new a.fn.init(b,c)}e.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.sub=this.sub,a.fn.init=function(d,f){f&&f instanceof e&&!(f instanceof a)&&(f=a(f));return e.fn.init.call(this,d,f,b)},a.fn.init.prototype=a.fn;var b=a(c);return a},browser:{}}),e.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){J["[object "+b+"]"]=b.toLowerCase()}),A=e.uaMatch(z),A.browser&&(e.browser[A.browser]=!0,e.browser.version=A.version),e.browser.webkit&&(e.browser.safari=!0),j.test(" ")&&(k=/^[\s\xA0]+/,l=/[\s\xA0]+$/),h=e(c),c.addEventListener?C=function(){c.removeEventListener("DOMContentLoaded",C,!1),e.ready()}:c.attachEvent&&(C=function(){c.readyState==="complete"&&(c.detachEvent("onreadystatechange",C),e.ready())}),typeof define=="function"&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return e});return e}(),g={};f.Callbacks=function(a){a=a?g[a]||h(a):{};var c=[],d=[],e,i,j,k,l,m=function(b){var d,e,g,h,i;for(d=0,e=b.length;d<e;d++)g=b[d],h=f.type(g),h==="array"?m(g):h==="function"&&(!a.unique||!o.has(g))&&c.push(g)},n=function(b,f){f=f||[],e=!a.memory||[b,f],i=!0,l=j||0,j=0,k=c.length;for(;c&&l<k;l++)if(c[l].apply(b,f)===!1&&a.stopOnFalse){e=!0;break}i=!1,c&&(a.once?e===!0?o.disable():c=[]:d&&d.length&&(e=d.shift(),o.fireWith(e[0],e[1])))},o={add:function(){if(c){var a=c.length;m(arguments),i?k=c.length:e&&e!==!0&&(j=a,n(e[0],e[1]))}return this},remove:function(){if(c){var b=arguments,d=0,e=b.length;for(;d<e;d++)for(var f=0;f<c.length;f++)if(b[d]===c[f]){i&&f<=k&&(k--,f<=l&&l--),c.splice(f--,1);if(a.unique)break}}return this},has:function(a){if(c){var b=0,d=c.length;for(;b<d;b++)if(a===c[b])return!0}return!1},empty:function(){c=[];return this},disable:function(){c=d=e=b;return this},disabled:function(){return!c},lock:function(){d=b,(!e||e===!0)&&o.disable();return this},locked:function(){return!d},fireWith:function(b,c){d&&(i?a.once||d.push([b,c]):(!a.once||!e)&&n(b,c));return this},fire:function(){o.fireWith(this,arguments);return this},fired:function(){return!!e}};return o};var i=[].slice;f.extend({Deferred:function(a){var b=f.Callbacks("once memory"),c=f.Callbacks("once memory"),d=f.Callbacks("memory"),e="pending",g={resolve:b,reject:c,notify:d},h={done:b.add,fail:c.add,progress:d.add,state:function(){return e},isResolved:b.fired,isRejected:c.fired,then:function(a,b,c){i.done(a).fail(b).progress(c);return this},always:function(){return i.done.apply(i,arguments).fail.apply(i,arguments)},pipe:function(a,b,c){return f.Deferred(function(d){f.each({done:[a,"resolve"],fail:[b,"reject"],progress:[c,"notify"]},function(a,b){var c=b[0],e=b[1],g;f.isFunction(c)?i[a](function(){g=c.apply(this,arguments),g&&f.isFunction(g.promise)?g.promise().then(d.resolve,d.reject,d.notify):d[e+"With"](this===i?d:this,[g])}):i[a](d[e])})}).promise()},promise:function(a){if(a==null)a=h;else for(var b in h)a[b]=h[b];return a}},i=h.promise({}),j;for(j in g)i[j]=g[j].fire,i[j+"With"]=g[j].fireWith;i.done(function(){e="resolved"},c.disable,d.lock).fail(function(){e="rejected"},b.disable,d.lock),a&&a.call(i,i);return i},when:function(a){function m(a){return function(b){e[a]=arguments.length>1?i.call(arguments,0):b,j.notifyWith(k,e)}}function l(a){return function(c){b[a]=arguments.length>1?i.call(arguments,0):c,--g||j.resolveWith(j,b)}}var b=i.call(arguments,0),c=0,d=b.length,e=Array(d),g=d,h=d,j=d<=1&&a&&f.isFunction(a.promise)?a:f.Deferred(),k=j.promise();if(d>1){for(;c<d;c++)b[c]&&b[c].promise&&f.isFunction(b[c].promise)?b[c].promise().then(l(c),j.reject,m(c)):--g;g||j.resolveWith(j,b)}else j!==a&&j.resolveWith(j,d?[a]:[]);return k}}),f.support=function(){var a=c.createElement("div"),b=c.documentElement,d,e,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u;a.setAttribute("className","t"),a.innerHTML="   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/><nav></nav>",d=a.getElementsByTagName("*"),e=a.getElementsByTagName("a")[0];if(!d||!d.length||!e)return{};g=c.createElement("select"),h=g.appendChild(c.createElement("option")),i=a.getElementsByTagName("input")[0],k={leadingWhitespace:a.firstChild.nodeType===3,tbody:!a.getElementsByTagName("tbody").length,htmlSerialize:!!a.getElementsByTagName("link").length,style:/top/.test(e.getAttribute("style")),hrefNormalized:e.getAttribute("href")==="/a",opacity:/^0.55/.test(e.style.opacity),cssFloat:!!e.style.cssFloat,unknownElems:!!a.getElementsByTagName("nav").length,checkOn:i.value==="on",optSelected:h.selected,getSetAttribute:a.className!=="t",enctype:!!c.createElement("form").enctype,submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0},i.checked=!0,k.noCloneChecked=i.cloneNode(!0).checked,g.disabled=!0,k.optDisabled=!h.disabled;try{delete a.test}catch(v){k.deleteExpando=!1}!a.addEventListener&&a.attachEvent&&a.fireEvent&&(a.attachEvent("onclick",function(){k.noCloneEvent=!1}),a.cloneNode(!0).fireEvent("onclick")),i=c.createElement("input"),i.value="t",i.setAttribute("type","radio"),k.radioValue=i.value==="t",i.setAttribute("checked","checked"),a.appendChild(i),l=c.createDocumentFragment(),l.appendChild(a.lastChild),k.checkClone=l.cloneNode(!0).cloneNode(!0).lastChild.checked,a.innerHTML="",a.style.width=a.style.paddingLeft="1px",m=c.getElementsByTagName("body")[0],o=c.createElement(m?"div":"body"),p={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},m&&f.extend(p,{position:"absolute",left:"-999px",top:"-999px"});for(t in p)o.style[t]=p[t];o.appendChild(a),n=m||b,n.insertBefore(o,n.firstChild),k.appendChecked=i.checked,k.boxModel=a.offsetWidth===2,"zoom"in a.style&&(a.style.display="inline",a.style.zoom=1,k.inlineBlockNeedsLayout=a.offsetWidth===2,a.style.display="",a.innerHTML="<div style='width:4px;'></div>",k.shrinkWrapBlocks=a.offsetWidth!==2),a.innerHTML="<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>",q=a.getElementsByTagName("td"),u=q[0].offsetHeight===0,q[0].style.display="",q[1].style.display="none",k.reliableHiddenOffsets=u&&q[0].offsetHeight===0,a.innerHTML="",c.defaultView&&c.defaultView.getComputedStyle&&(j=c.createElement("div"),j.style.width="0",j.style.marginRight="0",a.appendChild(j),k.reliableMarginRight=(parseInt((c.defaultView.getComputedStyle(j,null)||{marginRight:0}).marginRight,10)||0)===0);if(a.attachEvent)for(t in{submit:1,change:1,focusin:1})s="on"+t,u=s in a,u||(a.setAttribute(s,"return;"),u=typeof a[s]=="function"),k[t+"Bubbles"]=u;f(function(){var a,b,d,e,g,h,i=1,j="position:absolute;top:0;left:0;width:1px;height:1px;margin:0;",l="visibility:hidden;border:0;",n="style='"+j+"border:5px solid #000;padding:0;'",p="<div "+n+"><div></div></div>"+"<table "+n+" cellpadding='0' cellspacing='0'>"+"<tr><td></td></tr></table>";m=c.getElementsByTagName("body")[0];!m||(a=c.createElement("div"),a.style.cssText=l+"width:0;height:0;position:static;top:0;margin-top:"+i+"px",m.insertBefore(a,m.firstChild),o=c.createElement("div"),o.style.cssText=j+l,o.innerHTML=p,a.appendChild(o),b=o.firstChild,d=b.firstChild,g=b.nextSibling.firstChild.firstChild,h={doesNotAddBorder:d.offsetTop!==5,doesAddBorderForTableAndCells:g.offsetTop===5},d.style.position="fixed",d.style.top="20px",h.fixedPosition=d.offsetTop===20||d.offsetTop===15,d.style.position=d.style.top="",b.style.overflow="hidden",b.style.position="relative",h.subtractsBorderForOverflowNotVisible=d.offsetTop===-5,h.doesNotIncludeMarginInBodyOffset=m.offsetTop!==i,m.removeChild(a),o=a=null,f.extend(k,h))}),o.innerHTML="",n.removeChild(o),o=l=g=h=m=j=a=i=null;return k}(),f.boxModel=f.support.boxModel;var j=/^(?:\{.*\}|\[.*\])$/,k=/([A-Z])/g;f.extend({cache:{},uuid:0,expando:"jQuery"+(f.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){a=a.nodeType?f.cache[a[f.expando]]:a[f.expando];return!!a&&!m(a)},data:function(a,c,d,e){if(!!f.acceptData(a)){var g,h,i,j=f.expando,k=typeof c=="string",l=a.nodeType,m=l?f.cache:a,n=l?a[f.expando]:a[f.expando]&&f.expando,o=c==="events";if((!n||!m[n]||!o&&!e&&!m[n].data)&&k&&d===b)return;n||(l?a[f.expando]=n=++f.uuid:n=f.expando),m[n]||(m[n]={},l||(m[n].toJSON=f.noop));if(typeof c=="object"||typeof c=="function")e?m[n]=f.extend(m[n],c):m[n].data=f.extend(m[n].data,c);g=h=m[n],e||(h.data||(h.data={}),h=h.data),d!==b&&(h[f.camelCase(c)]=d);if(o&&!h[c])return g.events;k?(i=h[c],i==null&&(i=h[f.camelCase(c)])):i=h;return i}},removeData:function(a,b,c){if(!!f.acceptData(a)){var d,e,g,h=f.expando,i=a.nodeType,j=i?f.cache:a,k=i?a[f.expando]:f.expando;if(!j[k])return;if(b){d=c?j[k]:j[k].data;if(d){f.isArray(b)?b=b:b in d?b=[b]:(b=f.camelCase(b),b in d?b=[b]:b=b.split(" "));for(e=0,g=b.length;e<g;e++)delete d[b[e]];if(!(c?m:f.isEmptyObject)(d))return}}if(!c){delete j[k].data;if(!m(j[k]))return}f.support.deleteExpando||!j.setInterval?delete j[k]:j[k]=null,i&&(f.support.deleteExpando?delete a[f.expando]:a.removeAttribute?a.removeAttribute(f.expando):a[f.expando]=null)}},_data:function(a,b,c){return f.data(a,b,c,!0)},acceptData:function(a){if(a.nodeName){var b=f.noData[a.nodeName.toLowerCase()];if(b)return b!==!0&&a.getAttribute("classid")===b}return!0}}),f.fn.extend({data:function(a,c){var d,e,g,h=null;if(typeof a=="undefined"){if(this.length){h=f.data(this[0]);if(this[0].nodeType===1&&!f._data(this[0],"parsedAttrs")){e=this[0].attributes;for(var i=0,j=e.length;i<j;i++)g=e[i].name,g.indexOf("data-")===0&&(g=f.camelCase(g.substring(5)),l(this[0],g,h[g]));f._data(this[0],"parsedAttrs",!0)}}return h}if(typeof a=="object")return this.each(function(){f.data(this,a)});d=a.split("."),d[1]=d[1]?"."+d[1]:"";if(c===b){h=this.triggerHandler("getData"+d[1]+"!",[d[0]]),h===b&&this.length&&(h=f.data(this[0],a),h=l(this[0],a,h));return h===b&&d[1]?this.data(d[0]):h}return this.each(function(){var b=f(this),e=[d[0],c];b.triggerHandler("setData"+d[1]+"!",e),f.data(this,a,c),b.triggerHandler("changeData"+d[1]+"!",e)})},removeData:function(a){return this.each(function(){f.removeData(this,a)})}}),f.extend({_mark:function(a,b){a&&(b=(b||"fx")+"mark",f._data(a,b,(f._data(a,b)||0)+1))},_unmark:function(a,b,c){a!==!0&&(c=b,b=a,a=!1);if(b){c=c||"fx";var d=c+"mark",e=a?0:(f._data(b,d)||1)-1;e?f._data(b,d,e):(f.removeData(b,d,!0),n(b,c,"mark"))}},queue:function(a,b,c){var d;if(a){b=(b||"fx")+"queue",d=f._data(a,b),c&&(!d||f.isArray(c)?d=f._data(a,b,f.makeArray(c)):d.push(c));return d||[]}},dequeue:function(a,b){b=b||"fx";var c=f.queue(a,b),d=c.shift(),e={};d==="inprogress"&&(d=c.shift()),d&&(b==="fx"&&c.unshift("inprogress"),f._data(a,b+".run",e),d.call(a,function(){f.dequeue(a,b)},e)),c.length||(f.removeData(a,b+"queue "+b+".run",!0),n(a,b,"queue"))}}),f.fn.extend({queue:function(a,c){typeof a!="string"&&(c=a,a="fx");if(c===b)return f.queue(this[0],a);return this.each(function(){var b=f.queue(this,a,c);a==="fx"&&b[0]!=="inprogress"&&f.dequeue(this,a)})},dequeue:function(a){return this.each(function(){f.dequeue(this,a)})},delay:function(a,b){a=f.fx?f.fx.speeds[a]||a:a,b=b||"fx";return this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,c){function m(){--h||d.resolveWith(e,[e])}typeof a!="string"&&(c=a,a=b),a=a||"fx";var d=f.Deferred(),e=this,g=e.length,h=1,i=a+"defer",j=a+"queue",k=a+"mark",l;while(g--)if(l=f.data(e[g],i,b,!0)||(f.data(e[g],j,b,!0)||f.data(e[g],k,b,!0))&&f.data(e[g],i,f.Callbacks("once memory"),!0))h++,l.add(m);m();return d.promise()}});var o=/[\n\t\r]/g,p=/\s+/,q=/\r/g,r=/^(?:button|input)$/i,s=/^(?:button|input|object|select|textarea)$/i,t=/^a(?:rea)?$/i,u=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,v=f.support.getSetAttribute,w,x,y;f.fn.extend({attr:function(a,b){return f.access(this,a,b,!0,f.attr)},removeAttr:function(a){return this.each(function(){f.removeAttr(this,a)})},prop:function(a,b){return f.access(this,a,b,!0,f.prop)},removeProp:function(a){a=f.propFix[a]||a;return this.each(function(){try{this[a]=b,delete this[a]}catch(c){}})},addClass:function(a){var b,c,d,e,g,h,i;if(f.isFunction(a))return this.each(function(b){f(this).addClass(a.call(this,b,this.className))});if(a&&typeof a=="string"){b=a.split(p);for(c=0,d=this.length;c<d;c++){e=this[c];if(e.nodeType===1)if(!e.className&&b.length===1)e.className=a;else{g=" "+e.className+" ";for(h=0,i=b.length;h<i;h++)~g.indexOf(" "+b[h]+" ")||(g+=b[h]+" ");e.className=f.trim(g)}}}return this},removeClass:function(a){var c,d,e,g,h,i,j;if(f.isFunction(a))return this.each(function(b){f(this).removeClass(a.call(this,b,this.className))});if(a&&typeof a=="string"||a===b){c=(a||"").split(p);for(d=0,e=this.length;d<e;d++){g=this[d];if(g.nodeType===1&&g.className)if(a){h=(" "+g.className+" ").replace(o," ");for(i=0,j=c.length;i<j;i++)h=h.replace(" "+c[i]+" "," ");g.className=f.trim(h)}else g.className=""}}return this},toggleClass:function(a,b){var c=typeof a,d=typeof b=="boolean";if(f.isFunction(a))return this.each(function(c){f(this).toggleClass(a.call(this,c,this.className,b),b)});return this.each(function(){if(c==="string"){var e,g=0,h=f(this),i=b,j=a.split(p);while(e=j[g++])i=d?i:!h.hasClass(e),h[i?"addClass":"removeClass"](e)}else if(c==="undefined"||c==="boolean")this.className&&f._data(this,"__className__",this.className),this.className=this.className||a===!1?"":f._data(this,"__className__")||""})},hasClass:function(a){var b=" "+a+" ",c=0,d=this.length;for(;c<d;c++)if(this[c].nodeType===1&&(" "+this[c].className+" ").replace(o," ").indexOf(b)>-1)return!0;return!1},val:function(a){var c,d,e,g=this[0];if(!arguments.length){if(g){c=f.valHooks[g.nodeName.toLowerCase()]||f.valHooks[g.type];if(c&&"get"in c&&(d=c.get(g,"value"))!==b)return d;d=g.value;return typeof d=="string"?d.replace(q,""):d==null?"":d}return b}e=f.isFunction(a);return this.each(function(d){var g=f(this),h;if(this.nodeType===1){e?h=a.call(this,d,g.val()):h=a,h==null?h="":typeof h=="number"?h+="":f.isArray(h)&&(h=f.map(h,function(a){return a==null?"":a+""})),c=f.valHooks[this.nodeName.toLowerCase()]||f.valHooks[this.type];if(!c||!("set"in c)||c.set(this,h,"value")===b)this.value=h}})}}),f.extend({valHooks:{option:{get:function(a){var b=a.attributes.value;return!b||b.specified?a.value:a.text}},select:{get:function(a){var b,c,d,e,g=a.selectedIndex,h=[],i=a.options,j=a.type==="select-one";if(g<0)return null;c=j?g:0,d=j?g+1:i.length;for(;c<d;c++){e=i[c];if(e.selected&&(f.support.optDisabled?!e.disabled:e.getAttribute("disabled")===null)&&(!e.parentNode.disabled||!f.nodeName(e.parentNode,"optgroup"))){b=f(e).val();if(j)return b;h.push(b)}}if(j&&!h.length&&i.length)return f(i[g]).val();return h},set:function(a,b){var c=f.makeArray(b);f(a).find("option").each(function(){this.selected=f.inArray(f(this).val(),c)>=0}),c.length||(a.selectedIndex=-1);return c}}},attrFn:{val:!0,css:!0,html:!0,text:!0,data:!0,width:!0,height:!0,offset:!0},attr:function(a,c,d,e){var g,h,i,j=a.nodeType;if(!a||j===3||j===8||j===2)return b;if(e&&c in f.attrFn)return f(a)[c](d);if(!("getAttribute"in a))return f.prop(a,c,d);i=j!==1||!f.isXMLDoc(a),i&&(c=c.toLowerCase(),h=f.attrHooks[c]||(u.test(c)?x:w));if(d!==b){if(d===null){f.removeAttr(a,c);return b}if(h&&"set"in h&&i&&(g=h.set(a,d,c))!==b)return g;a.setAttribute(c,""+d);return d}if(h&&"get"in h&&i&&(g=h.get(a,c))!==null)return g;g=a.getAttribute(c);return g===null?b:g},removeAttr:function(a,b){var c,d,e,g,h=0;if(a.nodeType===1){d=(b||"").split(p),g=d.length;for(;h<g;h++)e=d[h].toLowerCase(),c=f.propFix[e]||e,f.attr(a,e,""),a.removeAttribute(v?e:c),u.test(e)&&c in a&&(a[c]=!1)}},attrHooks:{type:{set:function(a,b){if(r.test(a.nodeName)&&a.parentNode)f.error("type property can't be changed");else if(!f.support.radioValue&&b==="radio"&&f.nodeName(a,"input")){var c=a.value;a.setAttribute("type",b),c&&(a.value=c);return b}}},value:{get:function(a,b){if(w&&f.nodeName(a,"button"))return w.get(a,b);return b in a?a.value:null},set:function(a,b,c){if(w&&f.nodeName(a,"button"))return w.set(a,b,c);a.value=b}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(a,c,d){var e,g,h,i=a.nodeType;if(!a||i===3||i===8||i===2)return b;h=i!==1||!f.isXMLDoc(a),h&&(c=f.propFix[c]||c,g=f.propHooks[c]);return d!==b?g&&"set"in g&&(e=g.set(a,d,c))!==b?e:a[c]=d:g&&"get"in g&&(e=g.get(a,c))!==null?e:a[c]},propHooks:{tabIndex:{get:function(a){var c=a.getAttributeNode("tabindex");return c&&c.specified?parseInt(c.value,10):s.test(a.nodeName)||t.test(a.nodeName)&&a.href?0:b}}}}),f.attrHooks.tabindex=f.propHooks.tabIndex,x={get:function(a,c){var d,e=f.prop(a,c);return e===!0||typeof e!="boolean"&&(d=a.getAttributeNode(c))&&d.nodeValue!==!1?c.toLowerCase():b},set:function(a,b,c){var d;b===!1?f.removeAttr(a,c):(d=f.propFix[c]||c,d in a&&(a[d]=!0),a.setAttribute(c,c.toLowerCase()));return c}},v||(y={name:!0,id:!0},w=f.valHooks.button={get:function(a,c){var d;d=a.getAttributeNode(c);return d&&(y[c]?d.nodeValue!=="":d.specified)?d.nodeValue:b},set:function(a,b,d){var e=a.getAttributeNode(d);e||(e=c.createAttribute(d),a.setAttributeNode(e));return e.nodeValue=b+""}},f.attrHooks.tabindex.set=w.set,f.each(["width","height"],function(a,b){f.attrHooks[b]=f.extend(f.attrHooks[b],{set:function(a,c){if(c===""){a.setAttribute(b,"auto");return c}}})}),f.attrHooks.contenteditable={get:w.get,set:function(a,b,c){b===""&&(b="false"),w.set(a,b,c)}}),f.support.hrefNormalized||f.each(["href","src","width","height"],function(a,c){f.attrHooks[c]=f.extend(f.attrHooks[c],{get:function(a){var d=a.getAttribute(c,2);return d===null?b:d}})}),f.support.style||(f.attrHooks.style={get:function(a){return a.style.cssText.toLowerCase()||b},set:function(a,b){return a.style.cssText=""+b}}),f.support.optSelected||(f.propHooks.selected=f.extend(f.propHooks.selected,{get:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex);return null}})),f.support.enctype||(f.propFix.enctype="encoding"),f.support.checkOn||f.each(["radio","checkbox"],function(){f.valHooks[this]={get:function(a){return a.getAttribute("value")===null?"on":a.value}}}),f.each(["radio","checkbox"],function(){f.valHooks[this]=f.extend(f.valHooks[this],{set:function(a,b){if(f.isArray(b))return a.checked=f.inArray(f(a).val(),b)>=0}})});var z=/\.(.*)$/,A=/^(?:textarea|input|select)$/i,B=/\./g,C=/ /g,D=/[^\w\s.|`]/g,E=/^([^\.]*)?(?:\.(.+))?$/,F=/\bhover(\.\S+)?/,G=/^key/,H=/^(?:mouse|contextmenu)|click/,I=/^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,J=function(a){var b=I.exec(a);b&&
(b[1]=(b[1]||"").toLowerCase(),b[3]=b[3]&&new RegExp("(?:^|\\s)"+b[3]+"(?:\\s|$)"));return b},K=function(a,b){return(!b[1]||a.nodeName.toLowerCase()===b[1])&&(!b[2]||a.id===b[2])&&(!b[3]||b[3].test(a.className))},L=function(a){return f.event.special.hover?a:a.replace(F,"mouseenter$1 mouseleave$1")};f.event={add:function(a,c,d,e,g){var h,i,j,k,l,m,n,o,p,q,r,s;if(!(a.nodeType===3||a.nodeType===8||!c||!d||!(h=f._data(a)))){d.handler&&(p=d,d=p.handler),d.guid||(d.guid=f.guid++),j=h.events,j||(h.events=j={}),i=h.handle,i||(h.handle=i=function(a){return typeof f!="undefined"&&(!a||f.event.triggered!==a.type)?f.event.dispatch.apply(i.elem,arguments):b},i.elem=a),c=L(c).split(" ");for(k=0;k<c.length;k++){l=E.exec(c[k])||[],m=l[1],n=(l[2]||"").split(".").sort(),s=f.event.special[m]||{},m=(g?s.delegateType:s.bindType)||m,s=f.event.special[m]||{},o=f.extend({type:m,origType:l[1],data:e,handler:d,guid:d.guid,selector:g,namespace:n.join(".")},p),g&&(o.quick=J(g),!o.quick&&f.expr.match.POS.test(g)&&(o.isPositional=!0)),r=j[m];if(!r){r=j[m]=[],r.delegateCount=0;if(!s.setup||s.setup.call(a,e,n,i)===!1)a.addEventListener?a.addEventListener(m,i,!1):a.attachEvent&&a.attachEvent("on"+m,i)}s.add&&(s.add.call(a,o),o.handler.guid||(o.handler.guid=d.guid)),g?r.splice(r.delegateCount++,0,o):r.push(o),f.event.global[m]=!0}a=null}},global:{},remove:function(a,b,c,d){var e=f.hasData(a)&&f._data(a),g,h,i,j,k,l,m,n,o,p,q;if(!!e&&!!(m=e.events)){b=L(b||"").split(" ");for(g=0;g<b.length;g++){h=E.exec(b[g])||[],i=h[1],j=h[2];if(!i){j=j?"."+j:"";for(l in m)f.event.remove(a,l+j,c,d);return}n=f.event.special[i]||{},i=(d?n.delegateType:n.bindType)||i,p=m[i]||[],k=p.length,j=j?new RegExp("(^|\\.)"+j.split(".").sort().join("\\.(?:.*\\.)?")+"(\\.|$)"):null;if(c||j||d||n.remove)for(l=0;l<p.length;l++){q=p[l];if(!c||c.guid===q.guid)if(!j||j.test(q.namespace))if(!d||d===q.selector||d==="**"&&q.selector)p.splice(l--,1),q.selector&&p.delegateCount--,n.remove&&n.remove.call(a,q)}else p.length=0;p.length===0&&k!==p.length&&((!n.teardown||n.teardown.call(a,j)===!1)&&f.removeEvent(a,i,e.handle),delete m[i])}f.isEmptyObject(m)&&(o=e.handle,o&&(o.elem=null),f.removeData(a,["events","handle"],!0))}},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(c,d,e,g){if(!e||e.nodeType!==3&&e.nodeType!==8){var h=c.type||c,i=[],j,k,l,m,n,o,p,q,r,s;h.indexOf("!")>=0&&(h=h.slice(0,-1),k=!0),h.indexOf(".")>=0&&(i=h.split("."),h=i.shift(),i.sort());if((!e||f.event.customEvent[h])&&!f.event.global[h])return;c=typeof c=="object"?c[f.expando]?c:new f.Event(h,c):new f.Event(h),c.type=h,c.isTrigger=!0,c.exclusive=k,c.namespace=i.join("."),c.namespace_re=c.namespace?new RegExp("(^|\\.)"+i.join("\\.(?:.*\\.)?")+"(\\.|$)"):null,o=h.indexOf(":")<0?"on"+h:"",(g||!e)&&c.preventDefault();if(!e){j=f.cache;for(l in j)j[l].events&&j[l].events[h]&&f.event.trigger(c,d,j[l].handle.elem,!0);return}c.result=b,c.target||(c.target=e),d=d!=null?f.makeArray(d):[],d.unshift(c),p=f.event.special[h]||{};if(p.trigger&&p.trigger.apply(e,d)===!1)return;r=[[e,p.bindType||h]];if(!g&&!p.noBubble&&!f.isWindow(e)){s=p.delegateType||h,n=null;for(m=e.parentNode;m;m=m.parentNode)r.push([m,s]),n=m;n&&n===e.ownerDocument&&r.push([n.defaultView||n.parentWindow||a,s])}for(l=0;l<r.length;l++){m=r[l][0],c.type=r[l][1],q=(f._data(m,"events")||{})[c.type]&&f._data(m,"handle"),q&&q.apply(m,d),q=o&&m[o],q&&f.acceptData(m)&&q.apply(m,d);if(c.isPropagationStopped())break}c.type=h,c.isDefaultPrevented()||(!p._default||p._default.apply(e.ownerDocument,d)===!1)&&(h!=="click"||!f.nodeName(e,"a"))&&f.acceptData(e)&&o&&e[h]&&(h!=="focus"&&h!=="blur"||c.target.offsetWidth!==0)&&!f.isWindow(e)&&(n=e[o],n&&(e[o]=null),f.event.triggered=h,e[h](),f.event.triggered=b,n&&(e[o]=n));return c.result}},dispatch:function(c){c=f.event.fix(c||a.event);var d=(f._data(this,"events")||{})[c.type]||[],e=d.delegateCount,g=[].slice.call(arguments,0),h=!c.exclusive&&!c.namespace,i=(f.event.special[c.type]||{}).handle,j=[],k,l,m,n,o,p,q,r,s,t,u;g[0]=c,c.delegateTarget=this;if(e&&!c.target.disabled&&(!c.button||c.type!=="click"))for(m=c.target;m!=this;m=m.parentNode||this){o={},q=[];for(k=0;k<e;k++)r=d[k],s=r.selector,t=o[s],r.isPositional?t=(t||(o[s]=f(s))).index(m)>=0:t===b&&(t=o[s]=r.quick?K(m,r.quick):f(m).is(s)),t&&q.push(r);q.length&&j.push({elem:m,matches:q})}d.length>e&&j.push({elem:this,matches:d.slice(e)});for(k=0;k<j.length&&!c.isPropagationStopped();k++){p=j[k],c.currentTarget=p.elem;for(l=0;l<p.matches.length&&!c.isImmediatePropagationStopped();l++){r=p.matches[l];if(h||!c.namespace&&!r.namespace||c.namespace_re&&c.namespace_re.test(r.namespace))c.data=r.data,c.handleObj=r,n=(i||r.handler).apply(p.elem,g),n!==b&&(c.result=n,n===!1&&(c.preventDefault(),c.stopPropagation()))}}return c.result},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){a.which==null&&(a.which=b.charCode!=null?b.charCode:b.keyCode);return a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement wheelDelta".split(" "),filter:function(a,d){var e,f,g,h=d.button,i=d.fromElement;a.pageX==null&&d.clientX!=null&&(e=a.target.ownerDocument||c,f=e.documentElement,g=e.body,a.pageX=d.clientX+(f&&f.scrollLeft||g&&g.scrollLeft||0)-(f&&f.clientLeft||g&&g.clientLeft||0),a.pageY=d.clientY+(f&&f.scrollTop||g&&g.scrollTop||0)-(f&&f.clientTop||g&&g.clientTop||0)),!a.relatedTarget&&i&&(a.relatedTarget=i===a.target?d.toElement:i),!a.which&&h!==b&&(a.which=h&1?1:h&2?3:h&4?2:0);return a}},fix:function(a){if(a[f.expando])return a;var d,e,g=a,h=f.event.fixHooks[a.type]||{},i=h.props?this.props.concat(h.props):this.props;a=f.Event(g);for(d=i.length;d;)e=i[--d],a[e]=g[e];a.target||(a.target=g.srcElement||c),a.target.nodeType===3&&(a.target=a.target.parentNode),a.metaKey===b&&(a.metaKey=a.ctrlKey);return h.filter?h.filter(a,g):a},special:{ready:{setup:f.bindReady},focus:{delegateType:"focusin",noBubble:!0},blur:{delegateType:"focusout",noBubble:!0},beforeunload:{setup:function(a,b,c){f.isWindow(this)&&(this.onbeforeunload=c)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}},simulate:function(a,b,c,d){var e=f.extend(new f.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?f.event.trigger(e,null,b):f.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},f.event.handle=f.event.dispatch,f.removeEvent=c.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){a.detachEvent&&a.detachEvent("on"+b,c)},f.Event=function(a,b){if(!(this instanceof f.Event))return new f.Event(a,b);a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?N:M):this.type=a,b&&f.extend(this,b),this.timeStamp=a&&a.timeStamp||f.now(),this[f.expando]=!0},f.Event.prototype={preventDefault:function(){this.isDefaultPrevented=N;var a=this.originalEvent;!a||(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){this.isPropagationStopped=N;var a=this.originalEvent;!a||(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=N,this.stopPropagation()},isDefaultPrevented:M,isPropagationStopped:M,isImmediatePropagationStopped:M},f.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){f.event.special[a]=f.event.special[b]={delegateType:b,bindType:b,handle:function(a){var b=this,c=a.relatedTarget,d=a.handleObj,e=d.selector,g,h;if(!c||d.origType===a.type||c!==b&&!f.contains(b,c))g=a.type,a.type=d.origType,h=d.handler.apply(this,arguments),a.type=g;return h}}}),f.support.submitBubbles||(f.event.special.submit={setup:function(){if(f.nodeName(this,"form"))return!1;f.event.add(this,"click._submit keypress._submit",function(a){var c=a.target,d=f.nodeName(c,"input")||f.nodeName(c,"button")?c.form:b;d&&!d._submit_attached&&(f.event.add(d,"submit._submit",function(a){this.parentNode&&f.event.simulate("submit",this.parentNode,a,!0)}),d._submit_attached=!0)})},teardown:function(){if(f.nodeName(this,"form"))return!1;f.event.remove(this,"._submit")}}),f.support.changeBubbles||(f.event.special.change={setup:function(){if(A.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio")f.event.add(this,"propertychange._change",function(a){a.originalEvent.propertyName==="checked"&&(this._just_changed=!0)}),f.event.add(this,"click._change",function(a){this._just_changed&&(this._just_changed=!1,f.event.simulate("change",this,a,!0))});return!1}f.event.add(this,"beforeactivate._change",function(a){var b=a.target;A.test(b.nodeName)&&!b._change_attached&&(f.event.add(b,"change._change",function(a){this.parentNode&&!a.isSimulated&&f.event.simulate("change",this.parentNode,a,!0)}),b._change_attached=!0)})},handle:function(a){var b=a.target;if(this!==b||a.isSimulated||a.isTrigger||b.type!=="radio"&&b.type!=="checkbox")return a.handleObj.handler.apply(this,arguments)},teardown:function(){f.event.remove(this,"._change");return A.test(this.nodeName)}}),f.support.focusinBubbles||f.each({focus:"focusin",blur:"focusout"},function(a,b){var d=0,e=function(a){f.event.simulate(b,a.target,f.event.fix(a),!0)};f.event.special[b]={setup:function(){d++===0&&c.addEventListener(a,e,!0)},teardown:function(){--d===0&&c.removeEventListener(a,e,!0)}}}),f.fn.extend({on:function(a,c,d,e,g){var h,i;if(typeof a=="object"){typeof c!="string"&&(d=c,c=b);for(i in a)this.on(i,c,d,a[i],g);return this}d==null&&e==null?(e=c,d=c=b):e==null&&(typeof c=="string"?(e=d,d=b):(e=d,d=c,c=b));if(e===!1)e=M;else if(!e)return this;g===1&&(h=e,e=function(a){f().off(a);return h.apply(this,arguments)},e.guid=h.guid||(h.guid=f.guid++));return this.each(function(){f.event.add(this,a,e,d,c)})},one:function(a,b,c,d){return this.on.call(this,a,b,c,d,1)},off:function(a,c,d){if(a&&a.preventDefault&&a.handleObj){var e=a.handleObj;f(a.delegateTarget).off(e.namespace?e.type+"."+e.namespace:e.type,e.selector,e.handler);return this}if(typeof a=="object"){for(var g in a)this.off(g,c,a[g]);return this}if(c===!1||typeof c=="function")d=c,c=b;d===!1&&(d=M);return this.each(function(){f.event.remove(this,a,d,c)})},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},live:function(a,b,c){f(this.context).on(a,this.selector,b,c);return this},die:function(a,b){f(this.context).off(a,this.selector||"**",b);return this},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return arguments.length==1?this.off(a,"**"):this.off(b,a,c)},trigger:function(a,b){return this.each(function(){f.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0])return f.event.trigger(a,b,this[0],!0)},toggle:function(a){var b=arguments,c=a.guid||f.guid++,d=0,e=function(c){var e=(f._data(this,"lastToggle"+a.guid)||0)%d;f._data(this,"lastToggle"+a.guid,e+1),c.preventDefault();return b[e].apply(this,arguments)||!1};e.guid=c;while(d<b.length)b[d++].guid=c;return this.click(e)},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){f.fn[b]=function(a,c){c==null&&(c=a,a=null);return arguments.length>0?this.bind(b,a,c):this.trigger(b)},f.attrFn&&(f.attrFn[b]=!0),G.test(b)&&(f.event.fixHooks[b]=f.event.keyHooks),H.test(b)&&(f.event.fixHooks[b]=f.event.mouseHooks)}),function(){function x(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}if(j.nodeType===1){g||(j[d]=c,j.sizset=h);if(typeof b!="string"){if(j===b){k=!0;break}}else if(m.filter(b,[j]).length>0){k=j;break}}j=j[a]}e[h]=k}}}function w(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}j.nodeType===1&&!g&&(j[d]=c,j.sizset=h);if(j.nodeName.toLowerCase()===b){k=j;break}j=j[a]}e[h]=k}}}var a=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,d="sizcache"+(Math.random()+"").replace(".",""),e=0,g=Object.prototype.toString,h=!1,i=!0,j=/\\/g,k=/\r\n/g,l=/\W/;[0,0].sort(function(){i=!1;return 0});var m=function(b,d,e,f){e=e||[],d=d||c;var h=d;if(d.nodeType!==1&&d.nodeType!==9)return[];if(!b||typeof b!="string")return e;var i,j,k,l,n,q,r,t,u=!0,v=m.isXML(d),w=[],x=b;do{a.exec(""),i=a.exec(x);if(i){x=i[3],w.push(i[1]);if(i[2]){l=i[3];break}}}while(i);if(w.length>1&&p.exec(b))if(w.length===2&&o.relative[w[0]])j=y(w[0]+w[1],d,f);else{j=o.relative[w[0]]?[d]:m(w.shift(),d);while(w.length)b=w.shift(),o.relative[b]&&(b+=w.shift()),j=y(b,j,f)}else{!f&&w.length>1&&d.nodeType===9&&!v&&o.match.ID.test(w[0])&&!o.match.ID.test(w[w.length-1])&&(n=m.find(w.shift(),d,v),d=n.expr?m.filter(n.expr,n.set)[0]:n.set[0]);if(d){n=f?{expr:w.pop(),set:s(f)}:m.find(w.pop(),w.length===1&&(w[0]==="~"||w[0]==="+")&&d.parentNode?d.parentNode:d,v),j=n.expr?m.filter(n.expr,n.set):n.set,w.length>0?k=s(j):u=!1;while(w.length)q=w.pop(),r=q,o.relative[q]?r=w.pop():q="",r==null&&(r=d),o.relative[q](k,r,v)}else k=w=[]}k||(k=j),k||m.error(q||b);if(g.call(k)==="[object Array]")if(!u)e.push.apply(e,k);else if(d&&d.nodeType===1)for(t=0;k[t]!=null;t++)k[t]&&(k[t]===!0||k[t].nodeType===1&&m.contains(d,k[t]))&&e.push(j[t]);else for(t=0;k[t]!=null;t++)k[t]&&k[t].nodeType===1&&e.push(j[t]);else s(k,e);l&&(m(l,h,e,f),m.uniqueSort(e));return e};m.uniqueSort=function(a){if(u){h=i,a.sort(u);if(h)for(var b=1;b<a.length;b++)a[b]===a[b-1]&&a.splice(b--,1)}return a},m.matches=function(a,b){return m(a,null,null,b)},m.matchesSelector=function(a,b){return m(b,null,null,[a]).length>0},m.find=function(a,b,c){var d,e,f,g,h,i;if(!a)return[];for(e=0,f=o.order.length;e<f;e++){h=o.order[e];if(g=o.leftMatch[h].exec(a)){i=g[1],g.splice(1,1);if(i.substr(i.length-1)!=="\\"){g[1]=(g[1]||"").replace(j,""),d=o.find[h](g,b,c);if(d!=null){a=a.replace(o.match[h],"");break}}}}d||(d=typeof b.getElementsByTagName!="undefined"?b.getElementsByTagName("*"):[]);return{set:d,expr:a}},m.filter=function(a,c,d,e){var f,g,h,i,j,k,l,n,p,q=a,r=[],s=c,t=c&&c[0]&&m.isXML(c[0]);while(a&&c.length){for(h in o.filter)if((f=o.leftMatch[h].exec(a))!=null&&f[2]){k=o.filter[h],l=f[1],g=!1,f.splice(1,1);if(l.substr(l.length-1)==="\\")continue;s===r&&(r=[]);if(o.preFilter[h]){f=o.preFilter[h](f,s,d,r,e,t);if(!f)g=i=!0;else if(f===!0)continue}if(f)for(n=0;(j=s[n])!=null;n++)j&&(i=k(j,f,n,s),p=e^i,d&&i!=null?p?g=!0:s[n]=!1:p&&(r.push(j),g=!0));if(i!==b){d||(s=r),a=a.replace(o.match[h],"");if(!g)return[];break}}if(a===q)if(g==null)m.error(a);else break;q=a}return s},m.error=function(a){throw"Syntax error, unrecognized expression: "+a};var n=m.getText=function(a){var b,c,d=a.nodeType,e="";if(d){if(d===1){if(typeof a.textContent=="string")return a.textContent;if(typeof a.innerText=="string")return a.innerText.replace(k,"");for(a=a.firstChild;a;a=a.nextSibling)e+=n(a)}else if(d===3||d===4)return a.nodeValue}else for(b=0;c=a[b];b++)c.nodeType!==8&&(e+=n(c));return e},o=m.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(a){return a.getAttribute("href")},type:function(a){return a.getAttribute("type")}},relative:{"+":function(a,b){var c=typeof b=="string",d=c&&!l.test(b),e=c&&!d;d&&(b=b.toLowerCase());for(var f=0,g=a.length,h;f<g;f++)if(h=a[f]){while((h=h.previousSibling)&&h.nodeType!==1);a[f]=e||h&&h.nodeName.toLowerCase()===b?h||!1:h===b}e&&m.filter(b,a,!0)},">":function(a,b){var c,d=typeof b=="string",e=0,f=a.length;if(d&&!l.test(b)){b=b.toLowerCase();for(;e<f;e++){c=a[e];if(c){var g=c.parentNode;a[e]=g.nodeName.toLowerCase()===b?g:!1}}}else{for(;e<f;e++)c=a[e],c&&(a[e]=d?c.parentNode:c.parentNode===b);d&&m.filter(b,a,!0)}},"":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("parentNode",b,f,a,d,c)},"~":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("previousSibling",b,f,a,d,c)}},find:{ID:function(a,b,c){if(typeof b.getElementById!="undefined"&&!c){var d=b.getElementById(a[1]);return d&&d.parentNode?[d]:[]}},NAME:function(a,b){if(typeof b.getElementsByName!="undefined"){var c=[],d=b.getElementsByName(a[1]);for(var e=0,f=d.length;e<f;e++)d[e].getAttribute("name")===a[1]&&c.push(d[e]);return c.length===0?null:c}},TAG:function(a,b){if(typeof b.getElementsByTagName!="undefined")return b.getElementsByTagName(a[1])}},preFilter:{CLASS:function(a,b,c,d,e,f){a=" "+a[1].replace(j,"")+" ";if(f)return a;for(var g=0,h;(h=b[g])!=null;g++)h&&(e^(h.className&&(" "+h.className+" ").replace(/[\t\n\r]/g," ").indexOf(a)>=0)?c||d.push(h):c&&(b[g]=!1));return!1},ID:function(a){return a[1].replace(j,"")},TAG:function(a,b){return a[1].replace(j,"").toLowerCase()},CHILD:function(a){if(a[1]==="nth"){a[2]||m.error(a[0]),a[2]=a[2].replace(/^\+|\s*/g,"");var b=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2]==="even"&&"2n"||a[2]==="odd"&&"2n+1"||!/\D/.test(a[2])&&"0n+"+a[2]||a[2]);a[2]=b[1]+(b[2]||1)-0,a[3]=b[3]-0}else a[2]&&m.error(a[0]);a[0]=e++;return a},ATTR:function(a,b,c,d,e,f){var g=a[1]=a[1].replace(j,"");!f&&o.attrMap[g]&&(a[1]=o.attrMap[g]),a[4]=(a[4]||a[5]||"").replace(j,""),a[2]==="~="&&(a[4]=" "+a[4]+" ");return a},PSEUDO:function(b,c,d,e,f){if(b[1]==="not")if((a.exec(b[3])||"").length>1||/^\w/.test(b[3]))b[3]=m(b[3],null,null,c);else{var g=m.filter(b[3],c,d,!0^f);d||e.push.apply(e,g);return!1}else if(o.match.POS.test(b[0])||o.match.CHILD.test(b[0]))return!0;return b},POS:function(a){a.unshift(!0);return a}},filters:{enabled:function(a){return a.disabled===!1&&a.type!=="hidden"},disabled:function(a){return a.disabled===!0},checked:function(a){return a.checked===!0},selected:function(a){a.parentNode&&a.parentNode.selectedIndex;return a.selected===!0},parent:function(a){return!!a.firstChild},empty:function(a){return!a.firstChild},has:function(a,b,c){return!!m(c[3],a).length},header:function(a){return/h\d/i.test(a.nodeName)},text:function(a){var b=a.getAttribute("type"),c=a.type;return a.nodeName.toLowerCase()==="input"&&"text"===c&&(b===c||b===null)},radio:function(a){return a.nodeName.toLowerCase()==="input"&&"radio"===a.type},checkbox:function(a){return a.nodeName.toLowerCase()==="input"&&"checkbox"===a.type},file:function(a){return a.nodeName.toLowerCase()==="input"&&"file"===a.type},password:function(a){return a.nodeName.toLowerCase()==="input"&&"password"===a.type},submit:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"submit"===a.type},image:function(a){return a.nodeName.toLowerCase()==="input"&&"image"===a.type},reset:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"reset"===a.type},button:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&"button"===a.type||b==="button"},input:function(a){return/input|select|textarea|button/i.test(a.nodeName)},focus:function(a){return a===a.ownerDocument.activeElement}},setFilters:{first:function(a,b){return b===0},last:function(a,b,c,d){return b===d.length-1},even:function(a,b){return b%2===0},odd:function(a,b){return b%2===1},lt:function(a,b,c){return b<c[3]-0},gt:function(a,b,c){return b>c[3]-0},nth:function(a,b,c){return c[3]-0===b},eq:function(a,b,c){return c[3]-0===b}},filter:{PSEUDO:function(a,b,c,d){var e=b[1],f=o.filters[e];if(f)return f(a,c,b,d);if(e==="contains")return(a.textContent||a.innerText||n([a])||"").indexOf(b[3])>=0;if(e==="not"){var g=b[3];for(var h=0,i=g.length;h<i;h++)if(g[h]===a)return!1;return!0}m.error(e)},CHILD:function(a,b){var c,e,f,g,h,i,j,k=b[1],l=a;switch(k){case"only":case"first":while(l=l.previousSibling)if(l.nodeType===1)return!1;if(k==="first")return!0;l=a;case"last":while(l=l.nextSibling)if(l.nodeType===1)return!1;return!0;case"nth":c=b[2],e=b[3];if(c===1&&e===0)return!0;f=b[0],g=a.parentNode;if(g&&(g[d]!==f||!a.nodeIndex)){i=0;for(l=g.firstChild;l;l=l.nextSibling)l.nodeType===1&&(l.nodeIndex=++i);g[d]=f}j=a.nodeIndex-e;return c===0?j===0:j%c===0&&j/c>=0}},ID:function(a,b){return a.nodeType===1&&a.getAttribute("id")===b},TAG:function(a,b){return b==="*"&&a.nodeType===1||!!a.nodeName&&a.nodeName.toLowerCase()===b},CLASS:function(a,b){return(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)>-1},ATTR:function(a,b){var c=b[1],d=m.attr?m.attr(a,c):o.attrHandle[c]?o.attrHandle[c](a):a[c]!=null?a[c]:a.getAttribute(c),e=d+"",f=b[2],g=b[4];return d==null?f==="!=":!f&&m.attr?d!=null:f==="="?e===g:f==="*="?e.indexOf(g)>=0:f==="~="?(" "+e+" ").indexOf(g)>=0:g?f==="!="?e!==g:f==="^="?e.indexOf(g)===0:f==="$="?e.substr(e.length-g.length)===g:f==="|="?e===g||e.substr(0,g.length+1)===g+"-":!1:e&&d!==!1},POS:function(a,b,c,d){var e=b[2],f=o.setFilters[e];if(f)return f(a,c,b,d)}}},p=o.match.POS,q=function(a,b){return"\\"+(b-0+1)};for(var r in o.match)o.match[r]=new RegExp(o.match[r].source+/(?![^\[]*\])(?![^\(]*\))/.source),o.leftMatch[r]=new RegExp(/(^(?:.|\r|\n)*?)/.source+o.match[r].source.replace(/\\(\d+)/g,q));var s=function(a,b){a=Array.prototype.slice.call(a,0);if(b){b.push.apply(b,a);return b}return a};try{Array.prototype.slice.call(c.documentElement.childNodes,0)[0].nodeType}catch(t){s=function(a,b){var c=0,d=b||[];if(g.call(a)==="[object Array]")Array.prototype.push.apply(d,a);else if(typeof a.length=="number")for(var e=a.length;c<e;c++)d.push(a[c]);else for(;a[c];c++)d.push(a[c]);return d}}var u,v;c.documentElement.compareDocumentPosition?u=function(a,b){if(a===b){h=!0;return 0}if(!a.compareDocumentPosition||!b.compareDocumentPosition)return a.compareDocumentPosition?-1:1;return a.compareDocumentPosition(b)&4?-1:1}:(u=function(a,b){if(a===b){h=!0;return 0}if(a.sourceIndex&&b.sourceIndex)return a.sourceIndex-b.sourceIndex;var c,d,e=[],f=[],g=a.parentNode,i=b.parentNode,j=g;if(g===i)return v(a,b);if(!g)return-1;if(!i)return 1;while(j)e.unshift(j),j=j.parentNode;j=i;while(j)f.unshift(j),j=j.parentNode;c=e.length,d=f.length;for(var k=0;k<c&&k<d;k++)if(e[k]!==f[k])return v(e[k],f[k]);return k===c?v(a,f[k],-1):v(e[k],b,1)},v=function(a,b,c){if(a===b)return c;var d=a.nextSibling;while(d){if(d===b)return-1;d=d.nextSibling}return 1}),function(){var a=c.createElement("div"),d="script"+(new Date).getTime(),e=c.documentElement;a.innerHTML="<a name='"+d+"'/>",e.insertBefore(a,e.firstChild),c.getElementById(d)&&(o.find.ID=function(a,c,d){if(typeof c.getElementById!="undefined"&&!d){var e=c.getElementById(a[1]);return e?e.id===a[1]||typeof e.getAttributeNode!="undefined"&&e.getAttributeNode("id").nodeValue===a[1]?[e]:b:[]}},o.filter.ID=function(a,b){var c=typeof a.getAttributeNode!="undefined"&&a.getAttributeNode("id");return a.nodeType===1&&c&&c.nodeValue===b}),e.removeChild(a),e=a=null}(),function(){var a=c.createElement("div");a.appendChild(c.createComment("")),a.getElementsByTagName("*").length>0&&(o.find.TAG=function(a,b){var c=b.getElementsByTagName(a[1]);if(a[1]==="*"){var d=[];for(var e=0;c[e];e++)c[e].nodeType===1&&d.push(c[e]);c=d}return c}),a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!="undefined"&&a.firstChild.getAttribute("href")!=="#"&&(o.attrHandle.href=function(a){return a.getAttribute("href",2)}),a=null}(),c.querySelectorAll&&function(){var a=m,b=c.createElement("div"),d="__sizzle__";b.innerHTML="<p class='TEST'></p>";if(!b.querySelectorAll||b.querySelectorAll(".TEST").length!==0){m=function(b,e,f,g){e=e||c;if(!g&&!m.isXML(e)){var h=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);if(h&&(e.nodeType===1||e.nodeType===9)){if(h[1])return s(e.getElementsByTagName(b),f);if(h[2]&&o.find.CLASS&&e.getElementsByClassName)return s(e.getElementsByClassName(h[2]),f)}if(e.nodeType===9){if(b==="body"&&e.body)return s([e.body],f);if(h&&h[3]){var i=e.getElementById(h[3]);if(!i||!i.parentNode)return s([],f);if(i.id===h[3])return s([i],f)}try{return s(e.querySelectorAll(b),f)}catch(j){}}else if(e.nodeType===1&&e.nodeName.toLowerCase()!=="object"){var k=e,l=e.getAttribute("id"),n=l||d,p=e.parentNode,q=/^\s*[+~]/.test(b);l?n=n.replace(/'/g,"\\$&"):e.setAttribute("id",n),q&&p&&(e=e.parentNode);try{if(!q||p)return s(e.querySelectorAll("[id='"+n+"'] "+b),f)}catch(r){}finally{l||k.removeAttribute("id")}}}return a(b,e,f,g)};for(var e in a)m[e]=a[e];b=null}}(),function(){var a=c.documentElement,b=a.matchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||a.msMatchesSelector;if(b){var d=!b.call(c.createElement("div"),"div"),e=!1;try{b.call(c.documentElement,"[test!='']:sizzle")}catch(f){e=!0}m.matchesSelector=function(a,c){c=c.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!m.isXML(a))try{if(e||!o.match.PSEUDO.test(c)&&!/!=/.test(c)){var f=b.call(a,c);if(f||!d||a.document&&a.document.nodeType!==11)return f}}catch(g){}return m(c,null,null,[a]).length>0}}}(),function(){var a=c.createElement("div");a.innerHTML="<div class='test e'></div><div class='test'></div>";if(!!a.getElementsByClassName&&a.getElementsByClassName("e").length!==0){a.lastChild.className="e";if(a.getElementsByClassName("e").length===1)return;o.order.splice(1,0,"CLASS"),o.find.CLASS=function(a,b,c){if(typeof b.getElementsByClassName!="undefined"&&!c)return b.getElementsByClassName(a[1])},a=null}}(),c.documentElement.contains?m.contains=function(a,b){return a!==b&&(a.contains?a.contains(b):!0)}:c.documentElement.compareDocumentPosition?m.contains=function(a,b){return!!(a.compareDocumentPosition(b)&16)}:m.contains=function(){return!1},m.isXML=function(a){var b=(a?a.ownerDocument||a:0).documentElement;return b?b.nodeName!=="HTML":!1};var y=function(a,b,c){var d,e=[],f="",g=b.nodeType?[b]:b;while(d=o.match.PSEUDO.exec(a))f+=d[0],a=a.replace(o.match.PSEUDO,"");a=o.relative[a]?a+"*":a;for(var h=0,i=g.length;h<i;h++)m(a,g[h],e,c);return m.filter(f,e)};m.attr=f.attr,m.selectors.attrMap={},f.find=m,f.expr=m.selectors,f.expr[":"]=f.expr.filters,f.unique=m.uniqueSort,f.text=m.getText,f.isXMLDoc=m.isXML,f.contains=m.contains}();var O=/Until$/,P=/^(?:parents|prevUntil|prevAll)/,Q=/,/,R=/^.[^:#\[\.,]*$/,S=Array.prototype.slice,T=f.expr.match.POS,U={children:!0,contents:!0,next:!0,prev:!0};f.fn.extend({find:function(a){var b=this,c,d;if(typeof a!="string")return f(a).filter(function(){for(c=0,d=b.length;c<d;c++)if(f.contains(b[c],this))return!0});var e=this.pushStack("","find",a),g,h,i;for(c=0,d=this.length;c<d;c++){g=e.length,f.find(a,this[c],e);if(c>0)for(h=g;h<e.length;h++)for(i=0;i<g;i++)if(e[i]===e[h]){e.splice(h--,1);break}}return e},has:function(a){var b=f(a);return this.filter(function(){for(var a=0,c=b.length;a<c;a++)if(f.contains(this,b[a]))return!0})},not:function(a){return this.pushStack(W(this,a,!1),"not",a)},filter:function(a){return this.pushStack(W(this,a,!0),"filter",a)},is:function(a){return!!a&&(typeof a=="string"?T.test(a)?f(a,this.context).index(this[0])>=0:f.filter(a,this).length>0:this.filter(a).length>0)},closest:function(a,b){var c=[],d,e,g=this[0];if(f.isArray(a)){var h=1;while(g&&g.ownerDocument&&g!==b){for(d=0;d<a.length;d++)f(g).is(a[d])&&c.push({selector:a[d],elem:g,level:h});g=g.parentNode,h++}return c}var i=T.test(a)||typeof a!="string"?f(a,b||this.context):0;for(d=0,e=this.length;d<e;d++){g=this[d];while(g){if(i?i.index(g)>-1:f.find.matchesSelector(g,a)){c.push(g);break}g=g.parentNode;if(!g||!g.ownerDocument||g===b||g.nodeType===11)break}}c=c.length>1?f.unique(c):c;return this.pushStack(c,"closest",a)},index:function(a){if(!a)return this[0]&&this[0].parentNode?this.prevAll().length:-1;if(typeof a=="string")return f.inArray(this[0],f(a));return f.inArray(a.jquery?a[0]:a,this)},add:function(a,b){var c=typeof a=="string"?f(a,b):f.makeArray(a&&a.nodeType?[a]:a),d=f.merge(this.get(),c);return this.pushStack(V(c[0])||V(d[0])?d:f.unique(d))},andSelf:function(){return this.add(this.prevObject)}}),f.each({parent:function(a){var b=a.parentNode;return b&&b.nodeType!==11?b:null},parents:function(a){return f.dir(a,"parentNode")},parentsUntil:function(a,b,c){return f.dir(a,"parentNode",c)},next:function(a){return f.nth(a,2,"nextSibling")},prev:function(a){return f.nth(a,2,"previousSibling")},nextAll:function(a){return f.dir(a,"nextSibling")},prevAll:function(a){return f.dir(a,"previousSibling")},nextUntil:function(a,b,c){return f.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return f.dir(a,"previousSibling",c)},siblings:function(a){return f.sibling(a.parentNode.firstChild,a)},children:function(a){return f.sibling(a.firstChild)},contents:function(a){return f.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:f.makeArray(a.childNodes)}},function(a,b){f.fn[a]=function(c,d){var e=f.map(this,b,c),g=S.call(arguments);O.test(a)||(d=c),d&&typeof d=="string"&&(e=f.filter(d,e)),e=this.length>1&&!U[a]?f.unique(e):e,(this.length>1||Q.test(d))&&P.test(a)&&(e=e.reverse());return this.pushStack(e,a,g.join(","))}}),f.extend({filter:function(a,b,c){c&&(a=":not("+a+")");return b.length===1?f.find.matchesSelector(b[0],a)?[b[0]]:[]:f.find.matches(a,b)},dir:function(a,c,d){var e=[],g=a[c];while(g&&g.nodeType!==9&&(d===b||g.nodeType!==1||!f(g).is(d)))g.nodeType===1&&e.push(g),g=g[c];return e},nth:function(a,b,c,d){b=b||1;var e=0;for(;a;a=a[c])if(a.nodeType===1&&++e===b)break;return a},sibling:function(a,b){var c=[];for(;a;a=a.nextSibling)a.nodeType===1&&a!==b&&c.push(a);return c}});var Y="abbr article aside audio canvas datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",Z=/ jQuery\d+="(?:\d+|null)"/g,$=/^\s+/,_=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,ba=/<([\w:]+)/,bb=/<tbody/i,bc=/<|&#?\w+;/,bd=/<(?:script|style)/i,be=/<(?:script|object|embed|option|style)/i,bf=new RegExp("<(?:"+Y.replace(" ","|")+")","i"),bg=/checked\s*(?:[^=]|=\s*.checked.)/i,bh=/\/(java|ecma)script/i,bi=/^\s*<!(?:\[CDATA\[|\-\-)/,bj={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},bk=X(c);bj.optgroup=bj.option,bj.tbody=bj.tfoot=bj.colgroup=bj.caption=bj.thead,bj.th=bj.td,f.support.htmlSerialize||(bj._default=[1,"div<div>","</div>"]),f.fn.extend({text:function(a){if(f.isFunction(a))return this.each(function(b){var c=f(this);c.text(a.call(this,b,c.text()))});if(typeof a!="object"&&a!==b)return this.empty().append((this[0]&&this[0].ownerDocument||c).createTextNode(a));return f.text(this)},wrapAll:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapAll(a.call(this,b))});if(this[0]){var b=f(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&a.firstChild.nodeType===1)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapInner(a.call(this,b))});return this.each(function(){var b=f(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){return this.each(function(){f(this).wrapAll(a)})},unwrap:function(){return this.parent().each(function(){f.nodeName(this,"body")||f(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)});if(arguments.length){var a=f(arguments[0]);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)});if(arguments.length){var a=this.pushStack(this,"after"
,arguments);a.push.apply(a,f(arguments[0]).toArray());return a}},remove:function(a,b){for(var c=0,d;(d=this[c])!=null;c++)if(!a||f.filter(a,[d]).length)!b&&d.nodeType===1&&(f.cleanData(d.getElementsByTagName("*")),f.cleanData([d])),d.parentNode&&d.parentNode.removeChild(d);return this},empty:function(){for(var a=0,b;(b=this[a])!=null;a++){b.nodeType===1&&f.cleanData(b.getElementsByTagName("*"));while(b.firstChild)b.removeChild(b.firstChild)}return this},clone:function(a,b){a=a==null?!1:a,b=b==null?a:b;return this.map(function(){return f.clone(this,a,b)})},html:function(a){if(a===b)return this[0]&&this[0].nodeType===1?this[0].innerHTML.replace(Z,""):null;if(typeof a=="string"&&!bd.test(a)&&(f.support.leadingWhitespace||!$.test(a))&&!bj[(ba.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(_,"<$1></$2>");try{for(var c=0,d=this.length;c<d;c++)this[c].nodeType===1&&(f.cleanData(this[c].getElementsByTagName("*")),this[c].innerHTML=a)}catch(e){this.empty().append(a)}}else f.isFunction(a)?this.each(function(b){var c=f(this);c.html(a.call(this,b,c.html()))}):this.empty().append(a);return this},replaceWith:function(a){if(this[0]&&this[0].parentNode){if(f.isFunction(a))return this.each(function(b){var c=f(this),d=c.html();c.replaceWith(a.call(this,b,d))});typeof a!="string"&&(a=f(a).detach());return this.each(function(){var b=this.nextSibling,c=this.parentNode;f(this).remove(),b?f(b).before(a):f(c).append(a)})}return this.length?this.pushStack(f(f.isFunction(a)?a():a),"replaceWith",a):this},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,d){var e,g,h,i,j=a[0],k=[];if(!f.support.checkClone&&arguments.length===3&&typeof j=="string"&&bg.test(j))return this.each(function(){f(this).domManip(a,c,d,!0)});if(f.isFunction(j))return this.each(function(e){var g=f(this);a[0]=j.call(this,e,c?g.html():b),g.domManip(a,c,d)});if(this[0]){i=j&&j.parentNode,f.support.parentNode&&i&&i.nodeType===11&&i.childNodes.length===this.length?e={fragment:i}:e=f.buildFragment(a,this,k),h=e.fragment,h.childNodes.length===1?g=h=h.firstChild:g=h.firstChild;if(g){c=c&&f.nodeName(g,"tr");for(var l=0,m=this.length,n=m-1;l<m;l++)d.call(c?bl(this[l],g):this[l],e.cacheable||m>1&&l<n?f.clone(h,!0,!0):h)}k.length&&f.each(k,br)}return this}}),f.buildFragment=function(a,b,d){var e,g,h,i,j=a[0];b&&b[0]&&(i=b[0].ownerDocument||b[0]),i.createDocumentFragment||(i=c),a.length===1&&typeof j=="string"&&j.length<512&&i===c&&j.charAt(0)==="<"&&!be.test(j)&&(f.support.checkClone||!bg.test(j))&&!f.support.unknownElems&&bf.test(j)&&(g=!0,h=f.fragments[j],h&&h!==1&&(e=h)),e||(e=i.createDocumentFragment(),f.clean(a,i,e,d)),g&&(f.fragments[j]=h?e:1);return{fragment:e,cacheable:g}},f.fragments={},f.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){f.fn[a]=function(c){var d=[],e=f(c),g=this.length===1&&this[0].parentNode;if(g&&g.nodeType===11&&g.childNodes.length===1&&e.length===1){e[b](this[0]);return this}for(var h=0,i=e.length;h<i;h++){var j=(h>0?this.clone(!0):this).get();f(e[h])[b](j),d=d.concat(j)}return this.pushStack(d,a,e.selector)}}),f.extend({clone:function(a,b,c){var d=a.cloneNode(!0),e,g,h;if((!f.support.noCloneEvent||!f.support.noCloneChecked)&&(a.nodeType===1||a.nodeType===11)&&!f.isXMLDoc(a)){bn(a,d),e=bo(a),g=bo(d);for(h=0;e[h];++h)g[h]&&bn(e[h],g[h])}if(b){bm(a,d);if(c){e=bo(a),g=bo(d);for(h=0;e[h];++h)bm(e[h],g[h])}}e=g=null;return d},clean:function(a,b,d,e){var g;b=b||c,typeof b.createElement=="undefined"&&(b=b.ownerDocument||b[0]&&b[0].ownerDocument||c);var h=[],i;for(var j=0,k;(k=a[j])!=null;j++){typeof k=="number"&&(k+="");if(!k)continue;if(typeof k=="string")if(!bc.test(k))k=b.createTextNode(k);else{k=k.replace(_,"<$1></$2>");var l=(ba.exec(k)||["",""])[1].toLowerCase(),m=bj[l]||bj._default,n=m[0],o=b.createElement("div");b===c?bk.appendChild(o):X(b).appendChild(o),o.innerHTML=m[1]+k+m[2];while(n--)o=o.lastChild;if(!f.support.tbody){var p=bb.test(k),q=l==="table"&&!p?o.firstChild&&o.firstChild.childNodes:m[1]==="<table>"&&!p?o.childNodes:[];for(i=q.length-1;i>=0;--i)f.nodeName(q[i],"tbody")&&!q[i].childNodes.length&&q[i].parentNode.removeChild(q[i])}!f.support.leadingWhitespace&&$.test(k)&&o.insertBefore(b.createTextNode($.exec(k)[0]),o.firstChild),k=o.childNodes}var r;if(!f.support.appendChecked)if(k[0]&&typeof (r=k.length)=="number")for(i=0;i<r;i++)bq(k[i]);else bq(k);k.nodeType?h.push(k):h=f.merge(h,k)}if(d){g=function(a){return!a.type||bh.test(a.type)};for(j=0;h[j];j++)if(e&&f.nodeName(h[j],"script")&&(!h[j].type||h[j].type.toLowerCase()==="text/javascript"))e.push(h[j].parentNode?h[j].parentNode.removeChild(h[j]):h[j]);else{if(h[j].nodeType===1){var s=f.grep(h[j].getElementsByTagName("script"),g);h.splice.apply(h,[j+1,0].concat(s))}d.appendChild(h[j])}}return h},cleanData:function(a){var b,c,d=f.cache,e=f.event.special,g=f.support.deleteExpando;for(var h=0,i;(i=a[h])!=null;h++){if(i.nodeName&&f.noData[i.nodeName.toLowerCase()])continue;c=i[f.expando];if(c){b=d[c];if(b&&b.events){for(var j in b.events)e[j]?f.event.remove(i,j):f.removeEvent(i,j,b.handle);b.handle&&(b.handle.elem=null)}g?delete i[f.expando]:i.removeAttribute&&i.removeAttribute(f.expando),delete d[c]}}}});var bs=/alpha\([^)]*\)/i,bt=/opacity=([^)]*)/,bu=/([A-Z]|^ms)/g,bv=/^-?\d+(?:px)?$/i,bw=/^-?\d/,bx=/^([\-+])=([\-+.\de]+)/,by={position:"absolute",visibility:"hidden",display:"block"},bz=["Left","Right"],bA=["Top","Bottom"],bB,bC,bD;f.fn.css=function(a,c){if(arguments.length===2&&c===b)return this;return f.access(this,a,c,!0,function(a,c,d){return d!==b?f.style(a,c,d):f.css(a,c)})},f.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=bB(a,"opacity","opacity");return c===""?"1":c}return a.style.opacity}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":f.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,d,e){if(!!a&&a.nodeType!==3&&a.nodeType!==8&&!!a.style){var g,h,i=f.camelCase(c),j=a.style,k=f.cssHooks[i];c=f.cssProps[i]||i;if(d===b){if(k&&"get"in k&&(g=k.get(a,!1,e))!==b)return g;return j[c]}h=typeof d,h==="string"&&(g=bx.exec(d))&&(d=+(g[1]+1)*+g[2]+parseFloat(f.css(a,c)),h="number");if(d==null||h==="number"&&isNaN(d))return;h==="number"&&!f.cssNumber[i]&&(d+="px");if(!k||!("set"in k)||(d=k.set(a,d))!==b)try{j[c]=d}catch(l){}}},css:function(a,c,d){var e,g;c=f.camelCase(c),g=f.cssHooks[c],c=f.cssProps[c]||c,c==="cssFloat"&&(c="float");if(g&&"get"in g&&(e=g.get(a,!0,d))!==b)return e;if(bB)return bB(a,c)},swap:function(a,b,c){var d={};for(var e in b)d[e]=a.style[e],a.style[e]=b[e];c.call(a);for(e in b)a.style[e]=d[e]}}),f.curCSS=f.css,f.each(["height","width"],function(a,b){f.cssHooks[b]={get:function(a,c,d){var e;if(c){if(a.offsetWidth!==0)return bE(a,b,d);f.swap(a,by,function(){e=bE(a,b,d)});return e}},set:function(a,b){if(!bv.test(b))return b;b=parseFloat(b);if(b>=0)return b+"px"}}}),f.support.opacity||(f.cssHooks.opacity={get:function(a,b){return bt.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=f.isNumeric(b)?"alpha(opacity="+b*100+")":"",g=d&&d.filter||c.filter||"";c.zoom=1;if(b>=1&&f.trim(g.replace(bs,""))===""){c.removeAttribute("filter");if(d&&!d.filter)return}c.filter=bs.test(g)?g.replace(bs,e):g+" "+e}}),f(function(){f.support.reliableMarginRight||(f.cssHooks.marginRight={get:function(a,b){var c;f.swap(a,{display:"inline-block"},function(){b?c=bB(a,"margin-right","marginRight"):c=a.style.marginRight});return c}})}),c.defaultView&&c.defaultView.getComputedStyle&&(bC=function(a,c){var d,e,g;c=c.replace(bu,"-$1").toLowerCase();if(!(e=a.ownerDocument.defaultView))return b;if(g=e.getComputedStyle(a,null))d=g.getPropertyValue(c),d===""&&!f.contains(a.ownerDocument.documentElement,a)&&(d=f.style(a,c));return d}),c.documentElement.currentStyle&&(bD=function(a,b){var c,d,e,f=a.currentStyle&&a.currentStyle[b],g=a.style;f===null&&g&&(e=g[b])&&(f=e),!bv.test(f)&&bw.test(f)&&(c=g.left,d=a.runtimeStyle&&a.runtimeStyle.left,d&&(a.runtimeStyle.left=a.currentStyle.left),g.left=b==="fontSize"?"1em":f||0,f=g.pixelLeft+"px",g.left=c,d&&(a.runtimeStyle.left=d));return f===""?"auto":f}),bB=bC||bD,f.expr&&f.expr.filters&&(f.expr.filters.hidden=function(a){var b=a.offsetWidth,c=a.offsetHeight;return b===0&&c===0||!f.support.reliableHiddenOffsets&&(a.style&&a.style.display||f.css(a,"display"))==="none"},f.expr.filters.visible=function(a){return!f.expr.filters.hidden(a)});var bF=/%20/g,bG=/\[\]$/,bH=/\r?\n/g,bI=/#.*$/,bJ=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,bK=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,bL=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,bM=/^(?:GET|HEAD)$/,bN=/^\/\//,bO=/\?/,bP=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bQ=/^(?:select|textarea)/i,bR=/\s+/,bS=/([?&])_=[^&]*/,bT=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,bU=f.fn.load,bV={},bW={},bX,bY,bZ=["*/"]+["*"];try{bX=e.href}catch(b$){bX=c.createElement("a"),bX.href="",bX=bX.href}bY=bT.exec(bX.toLowerCase())||[],f.fn.extend({load:function(a,c,d){if(typeof a!="string"&&bU)return bU.apply(this,arguments);if(!this.length)return this;var e=a.indexOf(" ");if(e>=0){var g=a.slice(e,a.length);a=a.slice(0,e)}var h="GET";c&&(f.isFunction(c)?(d=c,c=b):typeof c=="object"&&(c=f.param(c,f.ajaxSettings.traditional),h="POST"));var i=this;f.ajax({url:a,type:h,dataType:"html",data:c,complete:function(a,b,c){c=a.responseText,a.isResolved()&&(a.done(function(a){c=a}),i.html(g?f("<div>").append(c.replace(bP,"")).find(g):c)),d&&i.each(d,[c,b,a])}});return this},serialize:function(){return f.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?f.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||bQ.test(this.nodeName)||bK.test(this.type))}).map(function(a,b){var c=f(this).val();return c==null?null:f.isArray(c)?f.map(c,function(a,c){return{name:b.name,value:a.replace(bH,"\r\n")}}):{name:b.name,value:c.replace(bH,"\r\n")}}).get()}}),f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){f.fn[b]=function(a){return this.bind(b,a)}}),f.each(["get","post"],function(a,c){f[c]=function(a,d,e,g){f.isFunction(d)&&(g=g||e,e=d,d=b);return f.ajax({type:c,url:a,data:d,success:e,dataType:g})}}),f.extend({getScript:function(a,c){return f.get(a,b,c,"script")},getJSON:function(a,b,c){return f.get(a,b,c,"json")},ajaxSetup:function(a,b){b?cb(a,f.ajaxSettings):(b=a,a=f.ajaxSettings),cb(a,b);return a},ajaxSettings:{url:bX,isLocal:bL.test(bY[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":bZ},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":f.parseJSON,"text xml":f.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:b_(bV),ajaxTransport:b_(bW),ajax:function(a,c){function w(a,c,l,m){if(s!==2){s=2,q&&clearTimeout(q),p=b,n=m||"",v.readyState=a>0?4:0;var o,r,u,w=c,x=l?cd(d,v,l):b,y,z;if(a>=200&&a<300||a===304){if(d.ifModified){if(y=v.getResponseHeader("Last-Modified"))f.lastModified[k]=y;if(z=v.getResponseHeader("Etag"))f.etag[k]=z}if(a===304)w="notmodified",o=!0;else try{r=ce(d,x),w="success",o=!0}catch(A){w="parsererror",u=A}}else{u=w;if(!w||a)w="error",a<0&&(a=0)}v.status=a,v.statusText=""+(c||w),o?h.resolveWith(e,[r,w,v]):h.rejectWith(e,[v,w,u]),v.statusCode(j),j=b,t&&g.trigger("ajax"+(o?"Success":"Error"),[v,d,o?r:u]),i.fireWith(e,[v,w]),t&&(g.trigger("ajaxComplete",[v,d]),--f.active||f.event.trigger("ajaxStop"))}}typeof a=="object"&&(c=a,a=b),c=c||{};var d=f.ajaxSetup({},c),e=d.context||d,g=e!==d&&(e.nodeType||e instanceof f)?f(e):f.event,h=f.Deferred(),i=f.Callbacks("once memory"),j=d.statusCode||{},k,l={},m={},n,o,p,q,r,s=0,t,u,v={readyState:0,setRequestHeader:function(a,b){if(!s){var c=a.toLowerCase();a=m[c]=m[c]||a,l[a]=b}return this},getAllResponseHeaders:function(){return s===2?n:null},getResponseHeader:function(a){var c;if(s===2){if(!o){o={};while(c=bJ.exec(n))o[c[1].toLowerCase()]=c[2]}c=o[a.toLowerCase()]}return c===b?null:c},overrideMimeType:function(a){s||(d.mimeType=a);return this},abort:function(a){a=a||"abort",p&&p.abort(a),w(0,a);return this}};h.promise(v),v.success=v.done,v.error=v.fail,v.complete=i.add,v.statusCode=function(a){if(a){var b;if(s<2)for(b in a)j[b]=[j[b],a[b]];else b=a[v.status],v.then(b,b)}return this},d.url=((a||d.url)+"").replace(bI,"").replace(bN,bY[1]+"//"),d.dataTypes=f.trim(d.dataType||"*").toLowerCase().split(bR),d.crossDomain==null&&(r=bT.exec(d.url.toLowerCase()),d.crossDomain=!(!r||r[1]==bY[1]&&r[2]==bY[2]&&(r[3]||(r[1]==="http:"?80:443))==(bY[3]||(bY[1]==="http:"?80:443)))),d.data&&d.processData&&typeof d.data!="string"&&(d.data=f.param(d.data,d.traditional)),ca(bV,d,c,v);if(s===2)return!1;t=d.global,d.type=d.type.toUpperCase(),d.hasContent=!bM.test(d.type),t&&f.active++===0&&f.event.trigger("ajaxStart");if(!d.hasContent){d.data&&(d.url+=(bO.test(d.url)?"&":"?")+d.data,delete d.data),k=d.url;if(d.cache===!1){var x=f.now(),y=d.url.replace(bS,"$1_="+x);d.url=y+(y===d.url?(bO.test(d.url)?"&":"?")+"_="+x:"")}}(d.data&&d.hasContent&&d.contentType!==!1||c.contentType)&&v.setRequestHeader("Content-Type",d.contentType),d.ifModified&&(k=k||d.url,f.lastModified[k]&&v.setRequestHeader("If-Modified-Since",f.lastModified[k]),f.etag[k]&&v.setRequestHeader("If-None-Match",f.etag[k])),v.setRequestHeader("Accept",d.dataTypes[0]&&d.accepts[d.dataTypes[0]]?d.accepts[d.dataTypes[0]]+(d.dataTypes[0]!=="*"?", "+bZ+"; q=0.01":""):d.accepts["*"]);for(u in d.headers)v.setRequestHeader(u,d.headers[u]);if(d.beforeSend&&(d.beforeSend.call(e,v,d)===!1||s===2)){v.abort();return!1}for(u in{success:1,error:1,complete:1})v[u](d[u]);p=ca(bW,d,c,v);if(!p)w(-1,"No Transport");else{v.readyState=1,t&&g.trigger("ajaxSend",[v,d]),d.async&&d.timeout>0&&(q=setTimeout(function(){v.abort("timeout")},d.timeout));try{s=1,p.send(l,w)}catch(z){s<2?w(-1,z):f.error(z)}}return v},param:function(a,c){var d=[],e=function(a,b){b=f.isFunction(b)?b():b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};c===b&&(c=f.ajaxSettings.traditional);if(f.isArray(a)||a.jquery&&!f.isPlainObject(a))f.each(a,function(){e(this.name,this.value)});else for(var g in a)cc(g,a[g],c,e);return d.join("&").replace(bF,"+")}}),f.extend({active:0,lastModified:{},etag:{}});var cf=f.now(),cg=/(\=)\?(&|$)|\?\?/i;f.ajaxSetup({jsonp:"callback",jsonpCallback:function(){return f.expando+"_"+cf++}}),f.ajaxPrefilter("json jsonp",function(b,c,d){var e=b.contentType==="application/x-www-form-urlencoded"&&typeof b.data=="string";if(b.dataTypes[0]==="jsonp"||b.jsonp!==!1&&(cg.test(b.url)||e&&cg.test(b.data))){var g,h=b.jsonpCallback=f.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,i=a[h],j=b.url,k=b.data,l="$1"+h+"$2";b.jsonp!==!1&&(j=j.replace(cg,l),b.url===j&&(e&&(k=k.replace(cg,l)),b.data===k&&(j+=(/\?/.test(j)?"&":"?")+b.jsonp+"="+h))),b.url=j,b.data=k,a[h]=function(a){g=[a]},d.always(function(){a[h]=i,g&&f.isFunction(i)&&a[h](g[0])}),b.converters["script json"]=function(){g||f.error(h+" was not called");return g[0]},b.dataTypes[0]="json";return"script"}}),f.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){f.globalEval(a);return a}}}),f.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),f.ajaxTransport("script",function(a){if(a.crossDomain){var d,e=c.head||c.getElementsByTagName("head")[0]||c.documentElement;return{send:function(f,g){d=c.createElement("script"),d.async="async",a.scriptCharset&&(d.charset=a.scriptCharset),d.src=a.url,d.onload=d.onreadystatechange=function(a,c){if(c||!d.readyState||/loaded|complete/.test(d.readyState))d.onload=d.onreadystatechange=null,e&&d.parentNode&&e.removeChild(d),d=b,c||g(200,"success")},e.insertBefore(d,e.firstChild)},abort:function(){d&&d.onload(0,1)}}}});var ch=a.ActiveXObject?function(){for(var a in cj)cj[a](0,1)}:!1,ci=0,cj;f.ajaxSettings.xhr=a.ActiveXObject?function(){return!this.isLocal&&ck()||cl()}:ck,function(a){f.extend(f.support,{ajax:!!a,cors:!!a&&"withCredentials"in a})}(f.ajaxSettings.xhr()),f.support.ajax&&f.ajaxTransport(function(c){if(!c.crossDomain||f.support.cors){var d;return{send:function(e,g){var h=c.xhr(),i,j;c.username?h.open(c.type,c.url,c.async,c.username,c.password):h.open(c.type,c.url,c.async);if(c.xhrFields)for(j in c.xhrFields)h[j]=c.xhrFields[j];c.mimeType&&h.overrideMimeType&&h.overrideMimeType(c.mimeType),!c.crossDomain&&!e["X-Requested-With"]&&(e["X-Requested-With"]="XMLHttpRequest");try{for(j in e)h.setRequestHeader(j,e[j])}catch(k){}h.send(c.hasContent&&c.data||null),d=function(a,e){var j,k,l,m,n;try{if(d&&(e||h.readyState===4)){d=b,i&&(h.onreadystatechange=f.noop,ch&&delete cj[i]);if(e)h.readyState!==4&&h.abort();else{j=h.status,l=h.getAllResponseHeaders(),m={},n=h.responseXML,n&&n.documentElement&&(m.xml=n),m.text=h.responseText;try{k=h.statusText}catch(o){k=""}!j&&c.isLocal&&!c.crossDomain?j=m.text?200:404:j===1223&&(j=204)}}}catch(p){e||g(-1,p)}m&&g(j,k,m,l)},!c.async||h.readyState===4?d():(i=++ci,ch&&(cj||(cj={},f(a).unload(ch)),cj[i]=d),h.onreadystatechange=d)},abort:function(){d&&d(0,1)}}}});var cm={},cn,co,cp=/^(?:toggle|show|hide)$/,cq=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,cr,cs=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]],ct;f.fn.extend({show:function(a,b,c){var d,e;if(a||a===0)return this.animate(cw("show",3),a,b,c);for(var g=0,h=this.length;g<h;g++)d=this[g],d.style&&(e=d.style.display,!f._data(d,"olddisplay")&&e==="none"&&(e=d.style.display=""),e===""&&f.css(d,"display")==="none"&&f._data(d,"olddisplay",cx(d.nodeName)));for(g=0;g<h;g++){d=this[g];if(d.style){e=d.style.display;if(e===""||e==="none")d.style.display=f._data(d,"olddisplay")||""}}return this},hide:function(a,b,c){if(a||a===0)return this.animate(cw("hide",3),a,b,c);var d,e,g=0,h=this.length;for(;g<h;g++)d=this[g],d.style&&(e=f.css(d,"display"),e!=="none"&&!f._data(d,"olddisplay")&&f._data(d,"olddisplay",e));for(g=0;g<h;g++)this[g].style&&(this[g].style.display="none");return this},_toggle:f.fn.toggle,toggle:function(a,b,c){var d=typeof a=="boolean";f.isFunction(a)&&f.isFunction(b)?this._toggle.apply(this,arguments):a==null||d?this.each(function(){var b=d?a:f(this).is(":hidden");f(this)[b?"show":"hide"]()}):this.animate(cw("toggle",3),a,b,c);return this},fadeTo:function(a,b,c,d){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){function g(){e.queue===!1&&f._mark(this);var b=f.extend({},e),c=this.nodeType===1,d=c&&f(this).is(":hidden"),g,h,i,j,k,l,m,n,o;b.animatedProperties={};for(i in a){g=f.camelCase(i),i!==g&&(a[g]=a[i],delete a[i]),h=a[g],f.isArray(h)?(b.animatedProperties[g]=h[1],h=a[g]=h[0]):b.animatedProperties[g]=b.specialEasing&&b.specialEasing[g]||b.easing||"swing";if(h==="hide"&&d||h==="show"&&!d)return b.complete.call(this);c&&(g==="height"||g==="width")&&(b.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY],f.css(this,"display")==="inline"&&f.css(this,"float")==="none"&&(!f.support.inlineBlockNeedsLayout||cx(this.nodeName)==="inline"?this.style.display="inline-block":this.style.zoom=1))}b.overflow!=null&&(this.style.overflow="hidden");for(i in a)j=new f.fx(this,b,i),h=a[i],cp.test(h)?(o=f._data(this,"toggle"+i)||(h==="toggle"?d?"show":"hide":0),o?(f._data(this,"toggle"+i,o==="show"?"hide":"show"),j[o]()):j[h]()):(k=cq.exec(h),l=j.cur(),k?(m=parseFloat(k[2]),n=k[3]||(f.cssNumber[i]?"":"px"),n!=="px"&&(f.style(this,i,(m||1)+n),l=(m||1)/j.cur()*l,f.style(this,i,l+n)),k[1]&&(m=(k[1]==="-="?-1:1)*m+l),j.custom(l,m,n)):j.custom(l,h,""));return!0}var e=f.speed(b,c,d);if(f.isEmptyObject(a))return this.each(e.complete,[!1]);a=f.extend({},a);return e.queue===!1?this.each(g):this.queue(e.queue,g)},stop:function(a,c,d){typeof a!="string"&&(d=c,c=a,a=b),c&&a!==!1&&this.queue(a||"fx",[]);return this.each(function(){function h(a,b,c){var e=b[c];f.removeData(a,c,!0),e.stop(d)}var b,c=!1,e=f.timers,g=f._data(this);d||f._unmark(!0,this);if(a==null)for(b in g)g[b].stop&&b.indexOf(".run")===b.length-4&&h(this,g,b);else g[b=a+".run"]&&g[b].stop&&h(this,g,b);for(b=e.length;b--;)e[b].elem===this&&(a==null||e[b].queue===a)&&(d?e[b](!0):e[b].saveState(),c=!0,e.splice(b,1));(!d||!c)&&f.dequeue(this,a)})}}),f.each({slideDown:cw("show",1),slideUp:cw("hide",1),slideToggle:cw("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){f.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),f.extend({speed:function(a,b,c){var d=a&&typeof a=="object"?f.extend({},a):{complete:c||!c&&b||f.isFunction(a)&&a,duration:a,easing:c&&b||b&&!f.isFunction(b)&&b};d.duration=f.fx.off?0:typeof d.duration=="number"?d.duration:d.duration in f.fx.speeds?f.fx.speeds[d.duration]:f.fx.speeds._default;if(d.queue==null||d.queue===!0)d.queue="fx";d.old=d.complete,d.complete=function(a){f.isFunction(d.old)&&d.old.call(this),d.queue?f.dequeue(this,d.queue):a!==!1&&f._unmark(this)};return d},easing:{linear:function(a,b,c,d){return c+d*a},swing:function(a,b,c,d){return(-Math.cos(a*Math.PI)/2+.5)*d+c}},timers:[],fx:function(a,b,c){this.options=b,this.elem=a,this.prop=c,b.orig=b.orig||{}}}),f.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this),(f.fx.step[this.prop]||f.fx.step._default)(this)},cur:function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))return this.elem[this.prop];var a,b=f.css(this.elem,this.prop);return isNaN(a=parseFloat(b))?!b||b==="auto"?0:b:a},custom:function(a,c,d){function h(a){return e.step(a)}var e=this,g=f.fx;this.startTime=ct||cu(),this.end=c,this.now=this.start=a,this.pos=this.state=0,this.unit=d||this.unit||(f.cssNumber[this.prop]?"":"px"),h.queue=this.options.queue,h.elem=this.elem,h.saveState=function(){e.options.hide&&f._data(e.elem,"fxshow"+e.prop)===b&&f._data(e.elem,"fxshow"+e.prop,e.start)},h()&&f.timers.push(h)&&!cr&&(cr=setInterval(g.tick,g.interval))},show:function(){var a=f._data(this.elem,"fxshow"+this.prop);this.options.orig[this.prop]=a||f.style(this.elem,this.prop),this.options.show=!0,a!==b?this.custom(this.cur(),a):this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur()),f(this.elem).show()},hide:function(){this.options.orig[this.prop]=f._data(this.elem,"fxshow"+this.prop)||f.style(this.elem,this.prop),this.options.hide=!0,this.custom(this.cur(),0)},step:function(a){var b,c,d,e=ct||cu(),g=!0,h=this.elem,i=this.options;if(a||e>=i.duration+this.startTime){this.now=this.end,this.pos=this.state=1,this.update(),i.animatedProperties[this.prop]=!0;for(b in i.animatedProperties)i.animatedProperties[b]!==!0&&(g=!1);if(g){i.overflow!=null&&!f.support.shrinkWrapBlocks&&f.each(["","X","Y"],function(a,b){h.style["overflow"+b]=i.overflow[a]}),i.hide&&f(h).hide();if(i.hide||i.show)for(b in i.animatedProperties)f.style(h,b,i.orig[b]),f.removeData(h,"fxshow"+b,!0),f.removeData(h,"toggle"+b,!0);d=i.complete,d&&(i.complete=!1,d.call(h))}return!1}i.duration==Infinity?this.now=e:(c=e-this.startTime,this.state=c/i.duration,this.pos=f.easing[i.animatedProperties[this.prop]](this.state,c,0,1,i.duration),this.now=this.start+(this.end-this.start)*this.pos),this.update();return!0}},f.extend(f.fx,{tick:function(){var a,b=f.timers,c=0;for(;c<b.length;c++)a=b[c],!a()&&b[c]===a&&b.splice(c--,1);b.length||f.fx.stop()},interval:13,stop:function(){clearInterval(cr),cr=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){f.style(a.elem,"opacity",a.now)},_default:function(a){a.elem.style&&a.elem.style[a.prop]!=null?a.elem.style[a.prop]=a.now+a.unit:a.elem[a.prop]=a.now}}}),f.each(["width","height"],function(a,b){f.fx.step[b]=function(a){f.style(a.elem,b,Math.max(0,a.now))}}),f.expr&&f.expr.filters&&(f.expr.filters.animated=function(a){return f.grep(f.timers,function(b){return a===b.elem}).length});var cy=/^t(?:able|d|h)$/i,cz=/^(?:body|html)$/i;"getBoundingClientRect"in c.documentElement?f.fn.offset=function(a){var b=this[0],c;if(a)return this.each(function(b){f.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return f.offset.bodyOffset(b);try{c=b.getBoundingClientRect()}catch(d){}var e=b.ownerDocument,g=e.documentElement;if(!c||!f.contains(g,b))return c?{top:c.top,left:c.left}:{top:0,left:0};var h=e.body,i=cA(e),j=g.clientTop||h.clientTop||0,k=g.clientLeft||h.clientLeft||0,l=i.pageYOffset||f.support.boxModel&&g.scrollTop||h.scrollTop,m=i.pageXOffset||f.support.boxModel&&g.scrollLeft||h.scrollLeft,n=c.top+l-j,o=c.left+m-k;return{top:n,left:o}}:f.fn.offset=function(a){var b=this[0];if(a)return this.each(function(b){f.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return f.offset.bodyOffset(b);var c,d=b.offsetParent,e=b,g=b.ownerDocument,h=g.documentElement,i=g.body,j=g.defaultView,k=j?j.getComputedStyle(b,null):b.currentStyle,l=b.offsetTop,m=b.offsetLeft;while((b=b.parentNode)&&b!==i&&b!==h){if(f.support.fixedPosition&&k.position==="fixed")break;c=j?j.getComputedStyle(b,null):b.currentStyle,l-=b.scrollTop,m-=b.scrollLeft,b===d&&(l+=b.offsetTop,m+=b.offsetLeft,f.support.doesNotAddBorder&&(!f.support.doesAddBorderForTableAndCells||!cy.test(b.nodeName))&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),e=d,d=b.offsetParent),f.support.subtractsBorderForOverflowNotVisible&&c.overflow!=="visible"&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),k=c}if(k.position==="relative"||k.position==="static")l+=i.offsetTop,m+=i.offsetLeft;f.support.fixedPosition&&k.position==="fixed"&&(l+=Math.max(h.scrollTop,i.scrollTop),m+=Math.max(h.scrollLeft,i.scrollLeft));return{top:l,left:m}},f.offset={bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;f.support.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(f.css(a,"marginTop"))||0,c+=parseFloat(f.css(a,"marginLeft"))||0);return{top:b,left:c}},setOffset:function(a,b,c){var d=f.css(a,"position");d==="static"&&(a.style.position="relative");var e=f(a),g=e.offset(),h=f.css(a,"top"),i=f.css(a,"left"),j=(d==="absolute"||d==="fixed")&&f.inArray("auto",[h,i])>-1,k={},l={},m,n;j?(l=e.position(),m=l.top,n=l.left):(m=parseFloat(h)||0,n=parseFloat(i)||0),f.isFunction(b)&&(b=b.call(a,c,g)),b.top!=null&&(k.top=b.top-g.top+m),b.left!=null&&(k.left=b.left-g.left+n),"using"in b?b.using.call(a,k):e.css(k)}},f.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),c=this.offset(),d=cz.test(b[0].nodeName)?{top:0,left:0}:b.offset();c.top-=parseFloat(f.css(a,"marginTop"))||0,c.left-=parseFloat(f.css(a,"marginLeft"))||0,d.top+=parseFloat(f.css(b[0],"borderTopWidth"))||0,d.left+=parseFloat(f.css(b[0],"borderLeftWidth"))||0;return{top:c.top-d.top,left:c.left-d.left}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||c.body;while(a&&!cz.test(a.nodeName)&&f.css(a,"position")==="static")a=a.offsetParent;return a})}}),f.each(["Left","Top"],function(a,c){var d="scroll"+c;f.fn[d]=function(c){var e,g;if(c===b){e=this[0];if(!e)return null;g=cA(e);return g?"pageXOffset"in g?g[a?"pageYOffset":"pageXOffset"]:f.support.boxModel&&g.document.documentElement[d]||g.document.body[d]:e[d]}return this.each(function(){g=cA(this),g?g.scrollTo(a?f(g).scrollLeft():c,a?c:f(g).scrollTop()):this[d]=c})}}),f.each(["Height","Width"],function(a,c){var d=c.toLowerCase();f.fn["inner"+c]=function(){var a=this[0];return a?a.style?parseFloat(f.css(a,d,"padding")):this[d]():null},f.fn["outer"+c]=function(a){var b=this[0];return b?b.style?parseFloat(f.css(b,d,a?"margin":"border")):this[d]():null},f.fn[d]=function(a){var e=this[0];if(!e)return a==null?null:this;if(f.isFunction(a))return this.each(function(b){var c=f(this);c[d](a.call(this,b,c[d]()))});if(f.isWindow(e)){var g=e.document.documentElement["client"+c],h=e.document.body;return e.document.compatMode==="CSS1Compat"&&g||h&&h["client"+c]||g}if(e.nodeType===9)return Math.max(e.documentElement["client"+c],e.body["scroll"+c],e.documentElement["scroll"+c],e.body["offset"+c],e.documentElement["offset"+c]);if(a===b){var i=f.css(e,d),j=parseFloat(i);return f.isNumeric(j)?j:i}return this.css(d,typeof a=="string"?a:a+"px")}}),a.jQuery=a.$=f})(window);