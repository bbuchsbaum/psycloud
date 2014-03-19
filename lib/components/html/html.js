(function() {
  var Drawable, GStimulus, HMixResp, HMixStim, Html, HtmlMixin, HtmlResponse, HtmlStimulus, Mixen, Response,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  GStimulus = require("../../stimresp").GraphicalStimulus;

  Drawable = require("../../stimresp").Drawable;

  Response = require("../../stimresp").Response;

  Mixen = require("mixen");

  HtmlMixin = (function() {
    HtmlMixin.prototype.tag = "div";

    HtmlMixin.prototype.div = function() {
      return $(document.createElement("div"));
    };

    function HtmlMixin() {
      this.el = document.createElement(this.tag);
      this.el = $(this.el);
    }

    HtmlMixin.prototype.positionElement = function(el, x, y) {
      return el.css({
        position: "absolute",
        left: x,
        top: y
      });
    };

    HtmlMixin.prototype.centerElement = function(el) {
      return el.css({
        margin: "0 auto",
        position: "absolute",
        left: "50%",
        top: "50%"
      });
    };

    return HtmlMixin;

  })();

  HMixStim = Mixen(HtmlMixin, GStimulus);

  HMixResp = Mixen(HtmlMixin, Response);

  HtmlStimulus = (function(_super) {
    __extends(HtmlStimulus, _super);

    function HtmlStimulus(spec) {
      HtmlStimulus.__super__.constructor.call(this, spec);
    }

    HtmlStimulus.prototype.presentable = function(element) {
      return new ((function(_super1) {
        __extends(_Class, _super1);

        function _Class(element) {
          this.element = element;
        }

        _Class.prototype.x = function() {
          return this.element.position().left;
        };

        _Class.prototype.y = function() {
          return this.element.position().top;
        };

        _Class.prototype.width = function() {
          return this.element.width();
        };

        _Class.prototype.height = function() {
          return this.element.height();
        };

        _Class.prototype.present = function(context) {
          return this.element.show();
        };

        return _Class;

      })(Drawable))(element);
    };

    HtmlStimulus.prototype.render = function(context) {
      var coords;
      console.log("rendering html stimulus", this.name);
      this.el.hide();
      context.appendHtml(this.el);
      console.log("@spec.position", this.spec.position);
      console.log("@spec.x", this.spec.x);
      console.log("@spec.y", this.spec.y);
      console.log("@el width", this.el.width());
      console.log("@el height", this.el.height());
      coords = this.computeCoordinates(context, this.spec.position, this.el.width(), this.el.height());
      console.log("coords", coords);
      this.positionElement(this.el, coords[0], coords[1]);
      return this.presentable(this.el);
    };

    return HtmlStimulus;

  })(HMixStim);

  HtmlResponse = (function(_super) {
    __extends(HtmlResponse, _super);

    function HtmlResponse() {
      HtmlResponse.__super__.constructor.apply(this, arguments);
    }

    return HtmlResponse;

  })(HMixResp);

  exports.HtmlStimulus = HtmlStimulus;

  exports.HtmlResponse = HtmlResponse;

  Html = {};

  Html.HtmlButton = require("./htmlbutton").HtmlButton;

  Html.HtmlLink = require("./htmllink").HtmlLink;

  Html.HtmlLabel = require("./htmllabel").HtmlLabel;

  Html.HtmlIcon = require("./htmlicon").HtmlIcon;

  Html.Instructions = require("./instructions").Instructions;

  Html.Markdown = require("./markdown").Markdown;

  Html.Message = require("./message").Message;

  Html.Page = require("./page").Page;

  Html.HtmlResponse = HtmlResponse;

  Html.HtmlStimulus = HtmlStimulus;

  exports.Html = Html;

}).call(this);
