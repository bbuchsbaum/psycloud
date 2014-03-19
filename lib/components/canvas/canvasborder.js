(function() {
  var CanvasBorder, KStimulus, Kinetic,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Kinetic = require("../../../jslibs/kinetic").Kinetic;

  KStimulus = require("../../stimresp").KineticStimulus;

  CanvasBorder = (function(_super) {
    __extends(CanvasBorder, _super);

    CanvasBorder.prototype.defaults = {
      strokeWidth: 5,
      stroke: "black"
    };

    function CanvasBorder(spec) {
      if (spec == null) {
        spec = {};
      }
      CanvasBorder.__super__.constructor.call(this, spec);
    }

    CanvasBorder.prototype.render = function(context) {
      var border;
      border = new Kinetic.Rect({
        x: 0,
        y: 0,
        width: context.width(),
        height: context.height(),
        strokeWidth: this.spec.strokeWidth,
        stroke: this.spec.stroke
      });
      return this.presentable(border);
    };

    return CanvasBorder;

  })(KStimulus);

  exports.CanvasBorder = CanvasBorder;

}).call(this);
