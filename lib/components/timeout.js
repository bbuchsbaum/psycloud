(function() {
  var Q, Response, ResponseData, Timeout, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  utils = require("../utils");

  Q = require("q");

  Response = require("../stimresp").Response;

  ResponseData = require("../stimresp").ResponseData;

  Timeout = (function(_super) {
    __extends(Timeout, _super);

    function Timeout() {
      return Timeout.__super__.constructor.apply(this, arguments);
    }

    Timeout.prototype.defaults = {
      duration: 1000
    };

    Timeout.prototype.activate = function(context, stimulus) {
      var deferred;
      deferred = Q.defer();
      utils.doTimer(this.spec.duration, (function(_this) {
        return function(diff) {
          var resp;
          resp = _this.baseResponse(stimulus);
          resp.name = "Timeout";
          resp.id = _this.id;
          resp.timeElapsed = diff;
          resp.timeRequested = _this.spec.duration;
          console.log("timeout!");
          return deferred.resolve(new ResponseData(resp));
        };
      })(this));
      return deferred.promise;
    };

    return Timeout;

  })(Response);

  exports.Timeout = Timeout;

}).call(this);
