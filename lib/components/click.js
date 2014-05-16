(function() {
  var Click, Q, Response,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Q = require("q");

  Response = require("../stimresp").Response;

  Click = (function(_super) {
    __extends(Click, _super);

    function Click() {
      return Click.__super__.constructor.apply(this, arguments);
    }

    Click.prototype.defaults = {
      id: null,
      name: null
    };

    Click.prototype.activate = function(context) {
      var deferred, element, node;
      if (this.spec.id != null) {
        node = "#" + this.spec.id;
      } else if (this.spec.name != null) {
        node = "." + this.spec.name;
      }
      element = context.stage.get("." + node);
      if (!element) {
        throw new Error("cannot find element:" + this.node);
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
