(function() {
  var Prompt, Q, Response, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  utils = require("../utils");

  Q = require("q");

  Response = require("../stimresp").Response;

  Prompt = (function(_super) {
    __extends(Prompt, _super);

    function Prompt() {
      return Prompt.__super__.constructor.apply(this, arguments);
    }

    Prompt.prototype.defaults = {
      title: "Prompt",
      delay: 0,
      defaultValue: "",
      theme: 'vex-theme-wireframe'
    };

    Prompt.prototype.activate = function(context, stimulus) {
      var deferred, promise;
      deferred = Q.defer();
      promise = Q.delay(this.spec.delay);
      promise.then((function(_this) {
        return function(f) {
          return vex.dialog.prompt({
            message: _this.spec.title,
            placeholder: _this.spec.defaultValue,
            className: 'vex-theme-wireframe',
            callback: function(value) {
              return deferred.resolve(value);
            }
          });
        };
      })(this));
      return deferred.promise;
    };

    return Prompt;

  })(Response);

  exports.Prompt = Prompt;

}).call(this);
