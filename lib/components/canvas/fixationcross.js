(function() {
  var FixationCross, KStimulus, Kinetic,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Kinetic = require("../../../jslibs/kinetic").Kinetic;

  KStimulus = require("../../stimresp").KineticStimulus;

  FixationCross = (function(_super) {
    __extends(FixationCross, _super);

    FixationCross.prototype.defaults = {
      strokeWidth: 8,
      length: 150,
      fill: 'black'
    };

    function FixationCross(spec) {
      if (spec == null) {
        spec = {};
      }
      FixationCross.__super__.constructor.call(this, spec);
    }

    FixationCross.prototype.render = function(context) {
      var group, horz, len, vert, x, y;
      x = context.width() / 2;
      y = context.height() / 2;
      len = this.toPixels(this.spec.length, context.width());
      console.log("FIX len is", len);
      horz = new Kinetic.Rect({
        x: x - len / 2,
        y: y,
        width: len,
        height: this.spec.strokeWidth,
        fill: this.spec.fill
      });
      vert = new Kinetic.Rect({
        x: x - this.spec.strokeWidth / 2,
        y: y - len / 2 + this.spec.strokeWidth / 2,
        width: this.spec.strokeWidth,
        height: len,
        fill: this.spec.fill
      });
      group = new Kinetic.Group();
      group.add(horz);
      group.add(vert);
      return this.presentable(group);
    };

    return FixationCross;

  })(KStimulus);

  exports.FixationCross = FixationCross;

}).call(this);
