(function() {
  var Background, ContainerDrawable, GStimulus, KineticDrawable, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  GStimulus = require("../../stimresp").GraphicalStimulus;

  KineticDrawable = require("../../stimresp").KineticDrawable;

  ContainerDrawable = require("../../stimresp").ContainerDrawable;

  _ = require("lodash");

  Background = (function(_super) {
    __extends(Background, _super);

    function Background(stims, fill) {
      this.stims = stims != null ? stims : [];
      this.fill = fill != null ? fill : "white";
      Background.__super__.constructor.call(this, {}, {});
      if (!_.isArray(this.stims)) {
        this.stims = [this.stims];
      }
    }

    Background.prototype.render = function(context) {
      var background, drawables, stim, _i, _len, _ref;
      background = new Kinetic.Rect({
        x: 0,
        y: 0,
        width: context.width(),
        height: context.height(),
        name: 'background',
        fill: this.fill
      });
      drawables = [];
      drawables.push(new KineticDrawable(this, background));
      _ref = this.stims;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        stim = _ref[_i];
        drawables.push(stim.render(context));
      }
      return new ContainerDrawable(drawables);
    };

    return Background;

  })(GStimulus);

  exports.Background = Background;

}).call(this);
