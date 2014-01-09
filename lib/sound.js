(function() {
  var Sound, Stimulus, buzz,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Stimulus = require("../stimresp").Stimulus;

  buzz = require("../lib/buzz");

  Sound = (function(_super) {
    __extends(Sound, _super);

    Sound.prototype.defaults = {
      url: "http://www.centraloutdoors.com/mp3/sheep/sheep.wav"
    };

    function Sound(spec) {
      if (spec == null) {
        spec = {};
      }
      Sound.__super__.constructor.call(this, spec);
      this.sound = new buzz.sound(this.spec.url);
    }

    Sound.prototype.render = function(context, layer) {
      return this.sound.play();
    };

    return Sound;

  })(Stimulus);

  exports.Sound = Sound;

}).call(this);

/*
//# sourceMappingURL=../lib/canvas/sound.js.map
*/