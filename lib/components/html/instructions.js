(function() {
  var Instructions, Markdown, Q, html, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  html = require("./html");

  Q = require("q");

  Markdown = require("./markdown").Markdown;

  _ = require('lodash');

  Instructions = (function(_super) {
    __extends(Instructions, _super);

    function Instructions(spec) {
      var content, div, i, itm, key, md, type, value;
      if (spec == null) {
        spec = {};
      }
      Instructions.__super__.constructor.call(this, spec);

      /*
      @pages =
      
        if @spec.url
        if _.isArray(@spec.url)
          for u in @spec.url
            md = new Markdown({url: u})
        else
          md = new Markdown(@spec.url)
       */
      this.pages = (function() {
        var _ref, _results;
        _ref = this.spec.pages;
        _results = [];
        for (key in _ref) {
          value = _ref[key];
          type = _.keys(value)[0];
          content = _.values(value)[0];
          md = new Markdown(content);
          div = this.div();
          div.addClass("ui stacked segment").append(md.element());
          div.css("overflow-y", "scroll");
          div.css("height", 800);
          _results.push(div);
        }
        return _results;
      }).call(this);
      this.menu = this.div();
      this.menu.addClass("ui borderless pagination menu");
      this.back = $("<a class=\"item\">\n  <i class=\"icon left arrow\"></i>  Previous\n </a>").attr("id", "instructions_back");
      this.next = $("<a class=\"item\">\nNext <i class=\"icon right arrow\"></i>\n</a>").attr("id", "instructions_next");
      this.menu.append(this.back).append("\n");
      this.items = (function() {
        var _i, _ref, _results;
        _results = [];
        for (i = _i = 1, _ref = this.pages.length; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
          itm = $("<a class=\"item\">" + i + " of " + this.pages.length + "</a>");
          this.menu.append(itm).append("\n");
          _results.push(itm);
        }
        return _results;
      }).call(this);
      this.items[0].addClass("active");
      this.menu.append(this.next).css("position", "absolute").css("right", "15px");
      this.currentPage = 0;
      this.el.append(this.pages[this.currentPage]);
      this.el.append(this.menu);
    }

    Instructions.prototype.activate = function(context) {
      this.deferred = Q.defer();
      return this.deferred.promise;
    };

    Instructions.prototype.updateEl = function(currentPage) {
      this.el.empty();
      this.el.append(this.pages[this.currentPage]);
      return this.el.append(this.menu);
    };

    Instructions.prototype.render = function(context) {
      this.next.click((function(_this) {
        return function(e) {
          if (_this.currentPage < (_this.pages.length - 1)) {
            _this.items[_this.currentPage].removeClass("active");
            _this.currentPage += 1;
            _this.items[_this.currentPage].addClass("active");
            _this.updateEl(_this.currentPage);
            _this.render(context);
            return _this.emit("next_page");
          } else {
            return _this.emit("done");
          }
        };
      })(this));
      this.back.click((function(_this) {
        return function(e) {
          if (_this.currentPage > 0) {
            _this.items[_this.currentPage].removeClass("active");
            _this.currentPage -= 1;
            _this.items[_this.currentPage].addClass("active");
            _this.updateEl(_this.currentPage);
            _this.render(context);
            return _this.emit("previous_page");
          }
        };
      })(this));
      if (this.currentPage > 0) {
        this.back.removeClass("disabled");
      }
      $(this.pages[this.currentPage]).css({
        "min-height": context.height() - 50
      });
      context.appendHtml(this.el);
      return this.presentable(this.el);
    };

    return Instructions;

  })(html.HtmlStimulus);

  exports.Instructions = Instructions;

}).call(this);
