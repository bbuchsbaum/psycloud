(function() {
  var Markdown, html, marked, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  html = require("./html");

  marked = require("marked");

  _ = require('lodash');

  Markdown = (function(_super) {
    __extends(Markdown, _super);

    function Markdown(spec) {
      if (spec == null) {
        spec = {};
      }
      Markdown.__super__.constructor.call(this, spec);
      if (_.isString(spec)) {
        this.spec = {};
        this.spec.x = 0;
        this.spec.y = 0;
        this.spec.content = spec;
      }
      if (this.spec.url != null) {
        $.ajax({
          url: this.spec.url,
          success: (function(_this) {
            return function(result) {
              _this.spec.content = result;
              return _this.el.append(marked(_this.spec.content));
            };
          })(this),
          error: (function(_this) {
            return function(result) {
              return console.log("ajax failure", result);
            };
          })(this)
        });
      } else {
        this.el.append($(marked(this.spec.content)));
      }
      this.el.addClass("markdown");
    }

    return Markdown;

  })(html.HtmlStimulus);

  exports.Markdown = Markdown;

}).call(this);
