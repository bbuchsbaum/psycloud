(function() {
  var Blank, KStimulus,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  KStimulus = require("../../stimresp").KineticStimulus;

  Blank = (function(_super) {
    __extends(Blank, _super);

    function Blank() {
      return Blank.__super__.constructor.apply(this, arguments);
    }

    Blank.prototype.defaults = {
      fill: "white",
      opacity: 1
    };

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
