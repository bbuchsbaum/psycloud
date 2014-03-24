(function() {
  var Presentable, Q, Sequence, Stimulus, Timeout, utils, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Stimulus = require("../stimresp").Stimulus;

  Timeout = require("./timeout").Timeout;

  Presentable = require("../stimresp").Presentable;

  Q = require("q");

  utils = require("../utils");

  _ = require("lodash");

  Sequence = (function(_super) {
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
      this.onsets = (function() {
        var _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = this.soa.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          _results.push(_.reduce(this.soa.slice(0, +i + 1 || 9e9), function(x, acc) {
            return x + acc;
          }));
        }
        return _results;
      }).call(this);
    }

    Sequence.prototype.genseq = function(context) {
      var deferred, _i, _ref, _results;
      deferred = Q.defer();
      _.forEach((function() {
        _results = [];
        for (var _i = 0, _ref = this.stims.length; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this), (function(_this) {
        return function(i) {
          var ev, stim;
          ev = new Timeout({
            duration: _this.onsets[i]
          });
          stim = _this.stims[i];
          return ev.activate(context).then(function() {
            var p;
            if (!_this.stopped) {
              if (_this.clear) {
                context.clearContent();
              }
              p = stim.render(context);
              p.present(context);
              context.draw();
              if (i === _this.stims.length - 1) {
                return deferred.resolve(1);
              }
            }
          });
        };
      })(this));
      return deferred.promise;
    };

    Sequence.prototype.render = function(context) {
      return {
        present: (function(_this) {
          return function(context) {
            var i, result, _i, _ref;
            result = Q.resolve(0);
            for (i = _i = 0, _ref = _this.times; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
              result = result.then(function() {
                return _this.genseq(context);
              });
            }
            return result.then(function() {
              return context.clearContent();
            });
          };
        })(this)
      };
    };

    return Sequence;

  })(Stimulus);

  exports.Sequence = Sequence;

}).call(this);
