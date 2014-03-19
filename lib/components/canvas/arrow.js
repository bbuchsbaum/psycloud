(function() {
  var Arrow, KStimulus, Kinetic,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  KStimulus = require("../../stimresp").KineticStimulus;

  Kinetic = require("../../../jslibs/kinetic").Kinetic;

  Arrow = (function(_super) {
    __extends(Arrow, _super);

    Arrow.prototype.defaults = {
      x: 100,
      y: 100,
      length: 100,
      direction: "right",
      thickness: 40,
      fill: "black",
      arrowSize: 25,
      angle: null
    };

    function Arrow(spec) {
      if (spec == null) {
        spec = {};
      }
      Arrow.__super__.constructor.call(this, spec);
    }

    Arrow.prototype.initialize = function() {
      var height, len, shaftLength, _this;
      if (this.spec.angle != null) {
        this.angle = this.spec.angle;
      } else {
        this.angle = (function() {
          switch (this.spec.direction) {
            case "right":
              return 0;
            case "left":
              return 180;
            case "up":
              return 90;
            case "down":
              return 270;
            default:
              return 0;
          }
        }).call(this);
      }
      shaftLength = this.spec.length - this.spec.arrowSize;
      this.arrowShaft = new Kinetic.Rect({
        x: 0,
        y: 0,
        width: shaftLength,
        height: this.spec.thickness,
        fill: this.spec.fill,
        stroke: this.spec.stroke,
        strokeWidth: this.spec.strokeWidth,
        opacity: this.spec.opacity
      });
      _this = this;
      this.arrowHead = new Kinetic.Shape({
        drawFunc: function(cx) {
          cx.beginPath();
          cx.moveTo(shaftLength, -_this.spec.arrowSize / 2.0);
          cx.lineTo(shaftLength + _this.spec.arrowSize, _this.spec.thickness / 2.0);
          cx.lineTo(shaftLength, _this.spec.thickness + _this.spec.arrowSize / 2.0);
          cx.closePath();
          return cx.fillStrokeShape(this);
        },
        fill: _this.spec.fill,
        stroke: this.spec.stroke,
        strokeWidth: this.spec.strokeWidth,
        opacity: this.spec.opacity,
        width: _this.spec.arrowSize,
        height: _this.spec.arrowSize + _this.spec.thickness
      });
      len = shaftLength + this.spec.arrowSize;
      height = this.spec.thickness;
      this.node = new Kinetic.Group({
        x: 0,
        y: 0,
        rotationDeg: this.angle,
        offset: [len / 2, height / 2]
      });
      this.node.add(this.arrowShaft);
      return this.node.add(this.arrowHead);
    };

    Arrow.prototype.render = function(context) {
      var coords;
      coords = this.computeCoordinates(context, this.spec.position, this.arrowShaft.getWidth(), this.arrowShaft.getHeight());
      this.node.setPosition({
        x: coords[0] + (this.arrowShaft.getWidth() + this.spec.arrowSize) / 2,
        y: coords[1] + this.spec.thickness / 2
      });
      return this.presentable(this.node);
    };

    return Arrow;

  })(KStimulus);

  exports.Arrow = Arrow;

}).call(this);
