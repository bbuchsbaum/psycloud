(function() {
  var First, Q, Response, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  Q = require("q");

  Response = require("../stimresp").Response;

  First = (function(_super) {
    __extends(First, _super);

    function First(responses) {
      this.responses = responses;
      First.__super__.constructor.call(this, {});
    }

    First.prototype.activate = function(context, stimulus) {
      var deferred, _done;
      _done = false;
      deferred = Q.defer();
      _.forEach(this.responses, (function(_this) {
        return function(resp) {
          return resp.activate(context).then(function(obj) {
            if (!_done) {
              console.log("resolving response", obj);
              deferred.resolve(obj);
              return _done = true;
            } else {
              return console.log("not resolving, already done");
            }
          });
        };
      })(this));
      return deferred.promise;
    };

    return First;

  })(Response);

  exports.First = First;

}).call(this);
