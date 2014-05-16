(function() {
  var Circle, KDrawable, KStimulus,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  KStimulus = require("../../stimresp").KineticStimulus;

  KDrawable = require("../../stimresp").KineticDrawable;

  Circle = (function(_super) {
    __extends(Circle, _super);

    Circle.prototype.defaults = {
      x: 50,
      y: 50,
      radius: 50,
      fill: 'red',
      opacity: 1,
      origin: "center"
    };

    function Circle(spec) {
      if (spec == null) {
        spec = {};
      }
      Circle.__super__.constructor.call(this, spec);
    }

    Circle.prototype.initialize = function() {
      return this.circle = new Kinetic.Circle({
        x: this.spec.x,
        y: this.spec.y,
        radius: this.spec.radius,
        fill: this.spec.fill,
        stroke: this.spec.stroke,
        strokeWidth: this.spec.strokeWidth,
        opacity: this.spec.opacity
      });
    };

    Circle.prototype.render = function(context) {
      var coords;
      coords = this.computeCoordinates(context, this.spec.position, this.circle.getWidth(), this.circle.getHeight());
      this.circle.setPosition({
        x: coords[0] + this.circle.getWidth() / 2,
        y: coords[1] + this.circle.getHeight() / 2
      });
      return new ((function(_super1) {
        __extends(_Class, _super1);

        function _Class() {
          return _Class.__super__.constructor.apply(this, arguments);
        }

        _Class.prototype.x = function() {
          return this.node.getX() - this.nodes[0].getWidth() / 2;
        };

        _Class.prototype.y = function() {
          return this.node.getY() - this.nodes[0].getHeight() / 2;
        };

        _Class.prototype.width = function() {
          return this.node.getWidth();
        };

        _Class.prototype.height = function() {
          return this.node.getHeight();
        };

        return _Class;

      })(KDrawable))(this, this.circle);
    };

    return Circle;

  })(KStimulus);

  exports.Circle = Circle;

}).call(this);
