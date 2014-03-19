(function() {
  var KStimulus, Kinetic, Picture,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Kinetic = require("../../../jslibs/kinetic").Kinetic;

  KStimulus = require("../../stimresp").KineticStimulus;

  Picture = (function(_super) {
    __extends(Picture, _super);

    Picture.prototype.defaults = {
      url: "http://www.html5canvastutorials.com/demos/assets/yoda.jpg",
      x: 0,
      y: 0
    };

    function Picture(spec) {
      if (spec == null) {
        spec = {};
      }
      Picture.__super__.constructor.call(this, spec);
      this.imageObj = new Image();
      this.image = null;
      this.imageObj.onload = (function(_this) {
        return function() {
          return _this.image = new Kinetic.Image({
            x: _this.spec.x,
            y: _this.spec.y,
            image: _this.imageObj,
            width: _this.spec.width || _this.imageObj.width,
            height: _this.spec.height || _this.imageObj.height
          });
        };
      })(this);
      this.imageObj.src = this.spec.url;
    }

    Picture.prototype.render = function(context) {
      return this.presentable(this.image);
    };

    return Picture;

  })(KStimulus);

  exports.Picture = Picture;

}).call(this);
