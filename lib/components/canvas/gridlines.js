(function() {
  var GridLines, KStimulus, Kinetic,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Kinetic = require("../../../jslibs/kinetic").Kinetic;

  KStimulus = require("../../stimresp").KineticStimulus;

  GridLines = (function(_super) {
    __extends(GridLines, _super);

    GridLines.prototype.defaults = {
      x: 0,
      y: 0,
      width: null,
      height: null,
      rows: 3,
      cols: 3,
      stroke: "black",
      strokeWidth: 2,
      dashArray: null
    };

    function GridLines(spec) {
      if (spec == null) {
        spec = {};
      }
      GridLines.__super__.constructor.call(this, spec);
    }

    GridLines.prototype.render = function(context) {
      var group, height, i, line, width, x, y, _i, _j, _ref, _ref1;
      if (this.spec.height == null) {
        height = context.height();
      } else {
        height = this.spec.height;
      }
      if (this.spec.width == null) {
        width = context.width();
      } else {
        width = this.spec.width;
      }
      group = new Kinetic.Group();
      for (i = _i = 0, _ref = this.spec.rows; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        y = this.spec.y + (i * height / this.spec.rows);
        line = new Kinetic.Line({
          points: [this.spec.x, y, this.spec.x + width, y],
          stroke: this.spec.stroke,
          strokeWidth: this.spec.strokeWidth,
          dashArray: this.spec.dashArray
        });
        group.add(line);
      }
      for (i = _j = 0, _ref1 = this.spec.cols; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
        x = this.spec.x + (i * width / this.spec.cols);
        line = new Kinetic.Line({
          points: [x, this.spec.y, x, this.spec.y + height],
          stroke: this.spec.stroke,
          strokeWidth: this.spec.strokeWidth,
          dashArray: this.spec.dashArray
        });
        group.add(line);
      }
      return this.presentable(group);
    };

    return GridLines;

  })(KStimulus);

  exports.GridLines = GridLines;

}).call(this);
