(function() {
  var KStimulus, Kinetic, Text, layout, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  layout = require("../../layout");

  Kinetic = require("../../../jslibs/kinetic").Kinetic;

  _ = require('lodash');

  KStimulus = require("../../stimresp").KineticStimulus;

  Text = (function(_super) {
    __extends(Text, _super);

    Text.prototype.defaults = {
      content: "Text",
      x: 5,
      y: 5,
      width: null,
      fill: "black",
      fontSize: 40,
      fontFamily: "Arial",
      align: "center",
      position: null
    };

    function Text(spec) {
      if (spec == null) {
        spec = {};
      }
      if ((spec.content != null) && _.isArray(spec.content)) {
        spec.content = spec.content.join(' \n ');
        if (spec.lineHeight == null) {
          spec.lineHeight = 2;
        }
      }
      Text.__super__.constructor.call(this, spec);
    }

    Text.prototype.initialize = function() {
      return this.text = new Kinetic.Text({
        x: 0,
        y: 0,
        text: this.spec.content,
        fontSize: this.spec.fontSize,
        fontFamily: this.spec.fontFamily,
        fill: this.spec.fill,
        lineHeight: this.spec.lineHeight || 1,
        width: this.spec.width,
        listening: false,
        align: this.spec.align
      });
    };

    Text.prototype.render = function(context, layer) {
      var coords;
      coords = this.computeCoordinates(context, this.spec.position, this.text.getWidth(), this.text.getHeight());
      this.text.setPosition({
        x: coords[0],
        y: coords[1]
      });
      return this.presentable(this.text);
    };

    return Text;

  })(KStimulus);

  exports.Text = Text;

}).call(this);
