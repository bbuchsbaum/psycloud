(function() {
  var HtmlButton, html,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  html = require("./html");

  HtmlButton = (function(_super) {
    __extends(HtmlButton, _super);

    HtmlButton.prototype.description = "An html button that can be clicked.";

    HtmlButton.prototype.defaults = {
      label: "Next",
      "class": "",
      disabled: "false"
    };

    HtmlButton.prototype.signals = ["clicked"];

    function HtmlButton(spec) {
      if (spec == null) {
        spec = {};
      }
      HtmlButton.__super__.constructor.call(this, spec);
      this.el = this.div();
      this.el.addClass("ui button");
      if (this.spec.disabled) {
        this.el.addClass("disabled");
      }
      this.el.addClass(this.spec["class"]);
      this.el.append(this.spec.label);
      this.el.attr("id", this.id);
    }

    HtmlButton.prototype.initialize = function() {
      var outer;
      HtmlButton.__super__.initialize.call(this);
      outer = this;
      return this.el.on("click", (function(_this) {
        return function() {
          return outer.emit("clicked", {
            id: outer.id,
            source: _this,
            label: _this.spec.label,
            name: _this.name
          });
        };
      })(this));
    };

    return HtmlButton;

  })(html.HtmlStimulus);

  exports.HtmlButton = HtmlButton;

}).call(this);
