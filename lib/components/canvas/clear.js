(function() {
  var ActionPresentable, Clear, GStimulus,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  GStimulus = require("../../stimresp").GraphicalStimulus;

  ActionPresentable = require("../../stimresp").ActionPresentable;

  Clear = (function(_super) {
    __extends(Clear, _super);

    function Clear() {
      return Clear.__super__.constructor.apply(this, arguments);
    }

    Clear.prototype.render = function(context) {
      var action;
      action = (function(_this) {
        return function(ctx) {
          return context.clearContent(true);
        };
      })(this);
      return new ActionPresentable(action);
    };

    return Clear;

  })(GStimulus);

  exports.Clear = Clear;

}).call(this);
