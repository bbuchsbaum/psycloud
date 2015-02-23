(function() {
  var Blank, KStimulus,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  KStimulus = require("../../stimresp").KineticStimulus;

  Blank = (function(_super) {
    __extends(Blank, _super);

    Blank.prototype.defaults = {
      fill: "gray",
      opacity: 1
    };

    function Blank(spec) {
      if (spec == null) {
        spec = {};
      }
      Blank.__super__.constructor.call(this, spec);
    }

    Blank.prototype.render = function(context) {
      var blank;
      blank = new Kinetic.Rect({
        x: 0,
        y: 0,
        width: context.width(),
        height: context.height(),
        fill: this.spec.fill,
        opacity: this.spec.opacity
      });
      return this.presentable(this, blank);
    };

    return Blank;

  })(KStimulus);

  exports.Blank = Blank;

}).call(this);
