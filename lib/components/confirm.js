(function() {
  var Confirm, Q, Response, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Q = require("q");

  Response = require("../stimresp").Response;

  Confirm = (function(_super) {
    __extends(Confirm, _super);

    function Confirm() {
      _ref = Confirm.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Confirm.prototype.defaults = {
      message: "",
      delay: 0,
      defaultValue: "",
      theme: 'vex-theme-wireframe'
    };

    Confirm.prototype.activate = function(context) {
      var deferred, promise,
        _this = this;
      console.log("activating confirm dialog");
      deferred = Q.defer();
      promise = Q.delay(this.spec.delay);
      promise.then(function(f) {
        console.log("rendering confirm dialog");
        return vex.dialog.confirm({
          message: _this.spec.message,
          className: _this.spec.theme,
          callback: function(value) {
            return deferred.resolve(value);
          }
        });
      });
      return deferred.promise;
    };

    return Confirm;

  })(Response);

  exports.Confirm = Confirm;

}).call(this);

/*
//# sourceMappingURL=../../lib/canvas/confirm.js.map
*/