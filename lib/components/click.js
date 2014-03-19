(function() {
  var Click, Q, Response,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Q = require("q");

  Response = require("../stimresp").Response;

  Click = (function(_super) {
    __extends(Click, _super);

    function Click(refid) {
      this.refid = refid;
      Click.__super__.constructor.call(this);
    }

    Click.prototype.activate = function(context) {
      var deferred, element;
      element = context.stage.get("#" + this.refid);
      if (!element) {
        throw new Error("cannot find element with id" + this.refid);
      }
      deferred = Q.defer();
      element.on("click", (function(_this) {
        return function(ev) {
          return deferred.resolve(ev);
        };
      })(this));
      return deferred.promise;
    };

    return Click;

  })(Response);

  exports.Click = Click;

}).call(this);
