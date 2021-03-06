(function() {
  var BucketSampler, CombinatoricSampler, ConditionalSampler, DataTable, ExhaustiveSampler, GridSampler, MatchSampler, ReplacementSampler, Sampler, UniformSampler, utils, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  utils = require("./utils");

  _ = require('lodash');

  DataTable = require("./datatable").DataTable;

  Sampler = (function() {
    function Sampler(items) {
      var _i, _ref, _results;
      this.items = items;
      this.indexBuffer = _.shuffle((function() {
        _results = [];
        for (var _i = 0, _ref = this.items.length; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this));
    }

    Sampler.prototype.next = function() {
      var i, _i, _ref, _results;
      i = this.indexBuffer.length > 0 ? this.indexBuffer.shift() : (this.indexBuffer = _.shuffle((function() {
        _results = [];
        for (var _i = 0, _ref = this.items.length; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this)), this.indexBuffer.shift());
      return this.items[i];
    };

    Sampler.prototype.takeAmong = function(n, among) {
      var count, ret, sam;
      ret = [];
      count = 0;
      while (count < n) {
        sam = takeOne();
        if (_.contains(among, sam)) {
          ret.push(sam);
          count++;
        }
      }
      return ret;
    };

    Sampler.prototype.take = function(n) {
      var i, ret, _i, _ref, _results;
      if (n > this.items.length) {
        throw "cannot take sample larger than the number of items when using non-replacing sampler";
      }
      this.indexBuffer = _.shuffle((function() {
        _results = [];
        for (var _i = 0, _ref = this.items.length; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this));
      ret = (function() {
        var _j, _results1;
        _results1 = [];
        for (i = _j = 0; 0 <= n ? _j < n : _j > n; i = 0 <= n ? ++_j : --_j) {
          _results1.push(this.next());
        }
        return _results1;
      }).call(this);
      return ret;
    };

    Sampler.prototype.takeOne = function() {
      return this.take(1)[0];
    };

    return Sampler;

  })();

  exports.Sampler = Sampler;

  exports.ReplacementSampler = ReplacementSampler = (function(_super) {
    __extends(ReplacementSampler, _super);

    function ReplacementSampler() {
      return ReplacementSampler.__super__.constructor.apply(this, arguments);
    }

    ReplacementSampler.prototype.sampleFrom = function(items, n) {
      return utils.sample(items, n, true);
    };

    ReplacementSampler.prototype.take = function(n) {
      return this.sampleFrom(this.items, n);
    };

    return ReplacementSampler;

  })(Sampler);

  exports.BucketSampler = BucketSampler = (function(_super) {
    __extends(BucketSampler, _super);

    function BucketSampler(items) {
      this.items = items;
      this.remaining = _.shuffle(this.items.slice(0));
    }

    BucketSampler.prototype.take = function(n) {
      if (n > this.remaining.length) {
        throw new Error("cannot remove more items than are left in remaining set");
      }
      return this.remaining.splice(0, n);
    };

    BucketSampler.prototype.size = function() {
      return this.remaining.length;
    };

    BucketSampler.prototype.putBack = function(iset) {
      var item, _i, _len;
      if (_.isArray(iset)) {
        for (_i = 0, _len = iset.length; _i < _len; _i++) {
          item = iset[_i];
          this.remaining.push(item);
        }
      } else {
        this.remaining.push(iset);
      }
      return this.remaining = _.shuffle(this.remaining);
    };

    return BucketSampler;

  })(Sampler);

  exports.ExhaustiveSampler = ExhaustiveSampler = (function(_super) {
    __extends(ExhaustiveSampler, _super);

    ExhaustiveSampler.fillBuffer = function(items, n) {
      var buf, i;
      buf = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 1; 1 <= n ? _i <= n : _i >= n; i = 1 <= n ? ++_i : --_i) {
          _results.push(_.shuffle(items));
        }
        return _results;
      })();
      return _.flatten(buf);
    };

    function ExhaustiveSampler(items) {
      this.items = items;
      this.buffer = ExhaustiveSampler.fillBuffer(this.items, 10);
    }

    ExhaustiveSampler.prototype.take = function(n) {
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

  })(Sampler);

  exports.MatchSampler = MatchSampler = (function() {
    function MatchSampler(sampler) {
      this.sampler = sampler;
    }

    MatchSampler.prototype.take = function(n, match) {
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

  })();

  exports.UniformSampler = UniformSampler = (function(_super) {
    __extends(UniformSampler, _super);

    UniformSampler.validate = function(range) {
      if (range.length !== 2) {
        throw "range must be an array with two values (min, max)";
      }
      if (range[1] <= range[0]) {
        throw "range[1] must > range[0]";
      }
    };

    function UniformSampler(range) {
      this.range = range;
      this.interval = this.range[1] - this.range[0];
    }

    UniformSampler.prototype.take = function(n) {
      var i, nums;
      nums = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 1; 1 <= n ? _i <= n : _i >= n; i = 1 <= n ? ++_i : --_i) {
          _results.push(Math.round(Math.random() * this.interval));
        }
        return _results;
      }).call(this);
      return nums;
    };

    return UniformSampler;

  })(Sampler);

  exports.CombinatoricSampler = CombinatoricSampler = (function(_super) {
    __extends(CombinatoricSampler, _super);

    function CombinatoricSampler() {
      var samplers;
      samplers = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.samplers = samplers;
    }

    CombinatoricSampler.prototype.take = function(n) {
      var i, j, xs, _i, _results;
      _results = [];
      for (i = _i = 0; 0 <= n ? _i < n : _i > n; i = 0 <= n ? ++_i : --_i) {
        xs = (function() {
          var _j, _ref, _results1;
          _results1 = [];
          for (j = _j = 0, _ref = this.samplers.length; 0 <= _ref ? _j < _ref : _j > _ref; j = 0 <= _ref ? ++_j : --_j) {
            _results1.push(this.samplers[j].take(1));
          }
          return _results1;
        }).call(this);
        _results.push(_.flatten(xs));
      }
      return _results;
    };

    return CombinatoricSampler;

  })(Sampler);

  exports.GridSampler = GridSampler = (function(_super) {
    __extends(GridSampler, _super);

    function GridSampler(x, y) {
      var i;
      this.x = x;
      this.y = y;
      this.grid = DataTable.expand({
        x: this.x,
        y: this.y
      });
      console.log("rows:", this.grid.nrow());
      this.tuples = (function() {
        var _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = this.grid.nrow(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          _results.push(_.values(this.grid.record(i)));
        }
        return _results;
      }).call(this);
    }

    GridSampler.prototype.take = function(n) {
      return utils.sample(this.tuples, n);
    };

    return GridSampler;

  })(Sampler);

  exports.ConditionalSampler = ConditionalSampler = (function(_super) {
    __extends(ConditionalSampler, _super);

    ConditionalSampler.prototype.makeItemSubsets = function() {
      var ctable, i, indices, itemSets, j, keySet, levs, record;
      ctable = this.factorSpec.conditionTable;
      keySet = (function() {
        var _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = ctable.nrow(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          record = ctable.record(i);
          levs = _.values(record);
          _results.push(_.reduce(levs, (function(a, b) {
            return a + ":" + b;
          })));
        }
        return _results;
      })();
      console.log(keySet);
      itemSets = (function() {
        var _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = ctable.nrow(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          record = ctable.record(i);
          indices = this.itemMap.whichRow(record);
          _results.push((function() {
            var _j, _len, _results1;
            _results1 = [];
            for (_j = 0, _len = indices.length; _j < _len; _j++) {
              j = indices[_j];
              _results1.push(this.items[j]);
            }
            return _results1;
          }).call(this));
        }
        return _results;
      }).call(this);
      console.log(itemSets);
      return _.zipObject(keySet, itemSets);
    };

    function ConditionalSampler(items, itemMap, factorSpec) {
      var key, value, _ref;
      this.items = items;
      this.itemMap = itemMap;
      this.factorSpec = factorSpec;
      this.keyMap = this.makeItemSubsets();
      this.conditions = _.keys(this.keyMap);
      this.samplerSet = {};
      _ref = this.keyMap;
      for (key in _ref) {
        value = _ref[key];
        this.samplerSet[key] = new ExhaustiveSampler(value);
      }
    }

    ConditionalSampler.prototype.take = function(n) {
      var keys;
      keys = utils.repLen(this.conditions, n);
      return _.flatten(this.takeCondition(keys));
    };

    ConditionalSampler.prototype.takeCondition = function(keys) {
      var key, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        key = keys[_i];
        _results.push(this.samplerSet[key].take(1));
      }
      return _results;
    };

    return ConditionalSampler;

  })(Sampler);

}).call(this);
