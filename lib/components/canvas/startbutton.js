(function() {
  var KStimulus, StartButton,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  KStimulus = require("../../stimresp").KineticStimulus;

  StartButton = (function(_super) {
    __extends(StartButton, _super);

    function StartButton() {
      return StartButton.__super__.constructor.apply(this, arguments);
    }

    StartButton.prototype.defaults = {
      width: 150,
      height: 75
    };

    StartButton.prototype.render = function(context) {
      var button, group, text, xcenter, ycenter;
      xcenter = context.width() / 2;
      ycenter = context.height() / 2;
      group = new Kinetic.Group({
        id: this.spec.id
      });
      text = new Kinetic.Text({
        text: "Start",
        x: xcenter - this.spec.width / 2,
        y: ycenter - this.spec.height / 2,
        width: this.spec.width,
        height: this.spec.height,
        fontSize: 30,
        fill: "white",
        fontFamily: "Arial",
        align: "center",
        padding: 20
      });
      button = new Kinetic.Rect({
        x: xcenter - this.spec.width / 2,
        y: ycenter - text.getHeight() / 2,
        width: this.spec.width,
        height: text.getHeight(),
        fill: "black",
        cornerRadius: 10,
        stroke: "LightSteelBlue",
        strokeWidth: 5
      });
      group.add(button);
      group.add(text);
      return this.presentable(this, group);
    };

    return StartButton;

  })(KStimulus);

  exports.StartButton = StartButton;

}).call(this);
