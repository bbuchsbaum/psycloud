(function() {
  var HtmlIcon, html,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  html = require("./html");

  HtmlIcon = (function(_super) {
    __extends(HtmlIcon, _super);

    HtmlIcon.prototype.defaults = {
      glyph: "plane",
      size: "massive"
    };

    function HtmlIcon(spec) {
      if (spec == null) {
        spec = {};
      }
      HtmlIcon.__super__.constructor.call(this, spec);
      this.html = $("<i></i>");
      this.html.addClass(this.spec.glyph + " " + this.spec.size + " icon");
      this.el.append(this.html);
    }

    return HtmlIcon;

  })(html.HtmlStimulus);

  exports.HtmlIcon = HtmlIcon;

}).call(this);
