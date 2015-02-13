(function() {
  var factorial, getTimestamp, swap, _, _ref, _ref1,
    __slice = [].slice;

  _ = require('lodash');

  if (typeof window !== "undefined" && window !== null ? (_ref = window.performance) != null ? _ref.now : void 0 : void 0) {
    getTimestamp = function() {
      return window.performance.now();
    };
  } else if (typeof window !== "undefined" && window !== null ? (_ref1 = window.performance) != null ? _ref1.webkitNow : void 0 : void 0) {
    getTimestamp = function() {
      return window.performance.webkitNow();
    };
  } else {
    getTimestamp = function() {
      return new Date().getTime();
    };
  }

  exports.getTimestamp = getTimestamp;

  this.browserBackDisabled = false;

  exports.disableBrowserBack = function() {
    var rx;
    if (!this.browserBackDisabled) {
      rx = /INPUT|SELECT|TEXTAREA/i;
      this.browserBackDisabled = true;
      return $(document).bind("keydown keypress", function(e) {
        if (e.which === 8) {
          if (!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly) {
            return e.preventDefault();
          }
        }
      });
    }
  };

  exports.module = function(name) {
    return global[name] = global[name] || {};
  };

  exports.asArray = function(value) {
    if (_.isArray(value)) {
      return value;
    } else if (_.isNumber(value) || _.isBoolean(value)) {
      return [value];
    } else {
      return _.toArray(value);
    }
  };

  swap = function(arr, a, b) {
    var temp;
    temp = arr[a];
    arr[a] = arr[b];
    return arr[b] = temp;
  };

  factorial = function(n) {
    var i, val;
    val = 1;
    i = 1;
    while (i < n) {
      val *= i;
      i++;
    }
    return val;
  };

  exports.permute = function(perm, maxlen) {
    var i, inc, j, out, total;
    if (maxlen == null) {
      maxlen = 1000;
    }
    total = factorial(perm.length);
    j = 0;
    i = 0;
    inc = 1;
    out = [];
    maxlen = maxlen - 1;
    while (j < total && out.length < maxlen) {
      console.log("j", j);
      while (i < perm.length - 1 && i >= 0 && out.length < maxlen) {
        out.push(perm.slice(0));
        swap(perm, i, i + 1);
        i += inc;
      }
      out.push(perm.slice(0));
      if (inc === 1) {
        swap(perm, 0, 1);
      } else {
        swap(perm, perm.length - 1, perm.length - 2);
      }
      j++;
      inc *= -1;
      i += inc;
    }
    return out;
  };


  /*
  exports.permute = (input) ->
    input = _.unique(input)
    permArr = []
    usedChars = []
  
    maxlen = _.min([input.length, maxlen])
  
    exports.main = main = (input) ->
  
      for i in [0...input.length]
        ch = input.splice(i, 1)[0]
        usedChars.push(ch)
        if (input.length == 0)
          permArr.push(usedChars.slice())
  
        main(input)
        input.splice(i, 0, ch)
        usedChars.pop()
  
      permArr
  
    main(input)
   */

  exports.rep = function(vec, times) {
    var el, i, j, out;
    if (!(times instanceof Array)) {
      times = [times];
    }
    if (!(vec instanceof Array)) {
      vec = [vec];
    }
    if (times.length !== 1 && vec.length !== times.length) {
      throw "vec.length must equal times.length or times.length must be 1";
    }
    if (vec.length === times.length) {
      out = (function() {
        var _i, _len, _results;
        _results = [];
        for (i = _i = 0, _len = vec.length; _i < _len; i = ++_i) {
          el = vec[i];
          _results.push((function() {
            var _j, _ref2, _results1;
            _results1 = [];
            for (j = _j = 1, _ref2 = times[i]; 1 <= _ref2 ? _j <= _ref2 : _j >= _ref2; j = 1 <= _ref2 ? ++_j : --_j) {
              _results1.push(el);
            }
            return _results1;
          })());
        }
        return _results;
      })();
      return _.flatten(out);
    } else {
      out = _.times(times[0], (function(_this) {
        return function(n) {
          return vec;
        };
      })(this));
      return _.flatten(out);
    }
  };

  exports.repLen = function(vec, length) {
    var i, _i, _results;
    if (length < 1) {
      throw "repLen: length must be greater than or equal to 1";
    }
    _results = [];
    for (i = _i = 0; 0 <= length ? _i < length : _i > length; i = 0 <= length ? ++_i : --_i) {
      _results.push(vec[i % vec.length]);
    }
    return _results;
  };

  exports.sample = function(elements, n, replace) {
    var i, _i, _results;
    if (replace == null) {
      replace = false;
    }
    if (n > elements.length && !replace) {
      throw "cannot take sample larger than the number of elements when 'replace' argument is false";
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

  exports.oneOf = function(elements) {
    return elements[Math.floor(Math.random() * elements.length)];
  };

  exports.genPoints = function(n, bbox) {
    var i, out, x, y, _i;
    if (bbox == null) {
      bbox = {
        X: 0,
        y: 0,
        width: 1,
        height: 1
      };
    }
    out = [];
    for (i = _i = 0; 0 <= n ? _i < n : _i > n; i = 0 <= n ? ++_i : --_i) {
      x = Math.random() * bbox.width + bbox.x;
      y = Math.random() * bbox.height + bbox.y;
      out.push([x, y]);
    }
    return out;
  };

  exports.euclidean = function(a, b) {
    var n, sum, _i, _ref2;
    sum = 0;
    for (n = _i = 0, _ref2 = a.length; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; n = 0 <= _ref2 ? ++_i : --_i) {
      sum = sum + Math.pow(a[n] - b[n], 2);
    }
    return Math.sqrt(sum);
  };

  exports.order = function(els) {
    var i, j, sortIndices, toSort, _i, _j, _ref2, _ref3;
    toSort = els.slice(0);
    for (i = _i = 0, _ref2 = toSort.length; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
      toSort[i] = [toSort[i], i];
    }
    toSort.sort(function(left, right) {
      if (left[0] < right[0]) {
        return -1;
      } else {
        return 1;
      }
    });
    sortIndices = [];
    for (j = _j = 0, _ref3 = toSort.length; 0 <= _ref3 ? _j < _ref3 : _j > _ref3; j = 0 <= _ref3 ? ++_j : --_j) {
      sortIndices.push(toSort[j][1]);
    }
    return sortIndices;
  };

  exports.table = function(els) {
    var counts;
    counts = _.reduce(els, function(sum, x) {
      if (sum[x] != null) {
        sum[x] = sum[x] + 1;
      } else {
        sum[x] = 1;
      }
      return sum;
    }, {});
    return counts;
  };

  exports.transitionProbs = function(els) {
    var classCounts, counts, key, trans, value, zipped;
    zipped = _.zip(_.initial(els), _.rest(els));
    zipped = _.map(zipped, function(x) {
      return {
        from: x[0],
        to: x[1]
      };
    });
    counts = _.reduce(zipped, function(sum, x) {
      var key;
      key = JSON.stringify(x);
      if (sum[key] != null) {
        sum[key] = sum[key] + 1;
      } else {
        sum[key] = 1;
      }
      return sum;
    }, {});
    classCounts = exports.table(els);
    counts = (function() {
      var _results;
      _results = [];
      for (key in counts) {
        value = counts[key];
        trans = JSON.parse(key);
        _results.push({
          from: trans.from,
          to: trans.to,
          count: value,
          prob: value / zipped.length,
          condProb: value / classCounts[trans.from]
        });
      }
      return _results;
    })();
    return counts;
  };

  exports.sd = function(els) {
    var el, mu, ss, sum, _i, _j, _len, _len1;
    sum = 0;
    for (_i = 0, _len = els.length; _i < _len; _i++) {
      el = els[_i];
      sum = sum + el;
    }
    mu = sum / els.length;
    ss = 0;
    for (_j = 0, _len1 = els.length; _j < _len1; _j++) {
      el = els[_j];
      ss = ss + Math.pow(el - mu, 2);
    }
    return Math.sqrt(ss / els.length);
  };

  exports.distanceMatrix = function(pts) {
    var i, j, _i, _ref2, _results;
    _results = [];
    for (i = _i = 0, _ref2 = pts.length; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
      _results.push((function() {
        var _j, _ref3, _results1;
        _results1 = [];
        for (j = _j = 0, _ref3 = pts.length; 0 <= _ref3 ? _j < _ref3 : _j > _ref3; j = 0 <= _ref3 ? ++_j : --_j) {
          _results1.push(exports.euclidean(pts[i], pts[j]));
        }
        return _results1;
      })());
    }
    return _results;
  };

  exports.which = function(vals, fun) {
    var out, v, _i, _len;
    out = [];
    for (_i = 0, _len = vals.length; _i < _len; _i++) {
      v = vals[_i];
      if (fun(v)) {
        out.push(v);
      }
    }
    return v;
  };

  exports.whichMin = function(vals) {
    var i, imin, min, _i, _ref2;
    min = vals[0];
    imin = 0;
    for (i = _i = 0, _ref2 = vals.length; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
      if (vals[i] < min) {
        min = vals[i];
        imin = i;
      }
    }
    return imin;
  };

  exports.nearestTo = function(pt, pointSet, k) {
    var D, Dord, i, _i, _results;
    D = (function() {
      var _i, _ref2, _results;
      _results = [];
      for (i = _i = 0, _ref2 = pointSet.length; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
        _results.push(exports.euclidean(pt, pointSet[i]));
      }
      return _results;
    })();
    Dord = exports.order(D);
    _results = [];
    for (i = _i = 0; 0 <= k ? _i < k : _i > k; i = 0 <= k ? ++_i : --_i) {
      _results.push({
        index: Dord[i],
        distance: D[Dord[i]]
      });
    }
    return _results;
  };

  exports.nearestNeighbors = function(pointSet, k) {
    var D, dlin, dord, i, ind, j, out, _i, _j, _k, _ref2, _ref3;
    D = exports.distanceMatrix(pointSet);
    dlin = [];
    ind = [];
    for (i = _i = 0, _ref2 = D.length; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
      for (j = _j = 0, _ref3 = D.length; 0 <= _ref3 ? _j < _ref3 : _j > _ref3; j = 0 <= _ref3 ? ++_j : --_j) {
        if (!(i !== j && i < j)) {
          continue;
        }
        dlin.push(D[i][j]);
        ind.push([i, j]);
      }
    }
    dord = exports.order(dlin);
    out = [];
    for (i = _k = 0; 0 <= k ? _k < k : _k > k; i = 0 <= k ? ++_k : --_k) {
      out.push({
        index: ind[dord[i]],
        distance: dlin[dord[i]]
      });
    }
    return out;
  };

  exports.pathLength = function(pts) {
    var i, len, _i, _ref2;
    if (pts.length <= 1) {
      return 0;
    } else {
      len = 0;
      for (i = _i = 0, _ref2 = pts.length - 1; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
        len += exports.euclidean(pts[i], pts[i + 1]);
      }
      return len;
    }
  };

  exports.nearestFromIndex = function(pts, index) {
    var D, i, imin;
    D = (function() {
      var _i, _ref2, _results;
      _results = [];
      for (i = _i = 0, _ref2 = pts.length; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
        if (i !== index) {
          _results.push(exports.euclidean(pts[index], pts[i]));
        }
      }
      return _results;
    })();
    imin = exports.whichMin(D);
    if (imin < index) {
      return imin;
    } else {
      return imin + 1;
    }
  };

  exports.inSet = function() {
    var set;
    set = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    set = _.unique(_.flatten(set));
    return function(a) {
      return _.contains(set, a);
    };
  };

  exports.doTimer = function(length, oncomplete) {
    var instance, start;
    start = getTimestamp();
    instance = function() {
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

  exports.letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

}).call(this);
