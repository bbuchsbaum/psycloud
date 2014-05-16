(function() {
  var KStimulus, Picture,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  KStimulus = require("../../stimresp").KineticStimulus;

  Picture = (function(_super) {
    __extends(Picture, _super);

    Picture.prototype.defaults = {
      url: "http://www.html5canvastutorials.com/demos/assets/yoda.jpg",
      x: 0,
      y: 0,
      stroke: null,
      strokeWidth: 0,
      name: "picture",
      position: null
    };

    function Picture(spec) {
      if (spec == null) {
        spec = {};
      }
      Picture.__super__.constructor.call(this, spec);
      this.image = null;
    }

    Picture.prototype.initialize = function() {
      this.imageObj = new Image();
      this.imageObj.onload = (function(_this) {
        return function() {
          console.log("image loaded", _this.spec.url);
          return _this.image = new Kinetic.Image({
            x: _this.spec.x,
            y: _this.spec.y,
            image: _this.imageObj,
            width: _this.spec.width || _this.imageObj.width,
            height: _this.spec.height || _this.imageObj.height,
            stroke: _this.spec.stroke,
            strokeWidth: _this.spec.strokeWidth,
            id: _this.spec.id,
            name: _this.spec.name
          });
        };
      })(this);
      return this.imageObj.src = this.spec.url;
    };

    Picture.prototype.render = function(context) {
      var coords;
      console.log("rendering image", this.image);
      coords = this.computeCoordinates(context, this.spec.position, this.image.getWidth(), this.image.getHeight());
      this.image.setPosition({
        x: coords[0],
        y: coords[1]
      });
      return this.presentable(this, this.image);
    };

    return Picture;

  })(KStimulus);

  exports.Picture = Picture;

}).call(this);
