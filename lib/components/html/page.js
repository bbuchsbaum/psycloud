(function() {
  var HtmlStimulus, Page,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  HtmlStimulus = require("./html").HtmlStimulus;

  Page = (function(_super) {
    __extends(Page, _super);

    Page.prototype.defaults = {
      html: "<p>HTML Page</p>"
    };

    function Page(spec) {
      if (spec == null) {
        spec = {};
      }
      Page.__super__.constructor.call(this, spec);
      this.el.append(this.spec.html);
    }

    return Page;

  })(HtmlStimulus);

  exports.Page = Page;

}).call(this);
