(function() {
  var HtmlLabel, html,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  html = require("./html");

  HtmlLabel = (function(_super) {
    __extends(HtmlLabel, _super);

    HtmlLabel.prototype.defaults = {
      glyph: null,
      size: "large",
      text: "label",
      color: "orange"
    };

    function HtmlLabel(spec) {
      if (spec == null) {
        spec = {};
      }
      HtmlLabel.__super__.constructor.call(this, spec);
      this.el.addClass("ui " + this.spec.color + " " + this.spec.size + " label");
      this.el.append(this.spec.text + " ");
      if (this.spec.glyph != null) {
        this.el.append("<i class=\"" + this.spec.glyph + " " + this.spec.size + "  icon\"></i>");
      }
    }

    return HtmlLabel;

  })(html.HtmlStimulus);

  exports.HtmlLabel = HtmlLabel;

}).call(this);
