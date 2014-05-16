(function() {
  var X, Y, args, drawable, f, fun, match, ret, trial, utils, x, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  x = X = (function() {
    function X() {
      this.Y = __bind(this.Y, this);
    }

    X.prototype.zz = 7;

    X.prototype.Y = function() {
      return {
        Z: (function(_this) {
          return function() {
            return _this.zz;
          };
        })(this)
      };
    };

    return X;

  })();

  console.log("z:", new x().Y().Z());

  fun = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    console.log(args.length);
    console.log("arg1", args[0]);
    console.log("arg2", args[1]);
    return console.log("arg3", args[2]);
  };

  fun.apply(null, [0, 1, 2]);

  x = [
    function() {
      return {
        M1: {
          a: 22
        }
      };
    }, function() {
      return {
        M1: {
          a: 44
        }
      };
    }
  ];

  match = require("coffee-pattern").match;

  _ = require("lodash");

  utils = require("./utils");

  trial = {
    Trial: function() {
      return {
        Hello: this.y === 1 ? 25 : 45
      };
    }
  };

  args = {
    y: 1
  };

  console.log(trial.Trial.apply(args));

  drawable = function(knode) {
    return function(context) {
      return console.log("hello?", knode, "context", context);
    };
  };

  f = drawable("mycontext");

  f("arrow");

  X = (function() {
    function X(z) {
      this.z = z;
    }

    X.prototype.x = function() {
      return console.log("X", this.z);
    };

    return X;

  })();

  Y = new ((function(_super) {
    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    return _Class;

  })(X))("hh");

  Y.x();

  ret = match(103, utils.inSet(7, 8), "hello", utils.inSet(103), "goodbye");

  console.log(ret);

  x = utils.permute([2, 1, 3, 4, 5, 6], 12);

  console.log(x);

}).call(this);
