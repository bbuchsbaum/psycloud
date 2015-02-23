(function() {
  var CanvasGroup, Container, ContainerDrawable, Grid, Group, KineticDrawable, Stimulus, layout,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Stimulus = require("../stimresp").Stimulus;

  ContainerDrawable = require("../stimresp").ContainerDrawable;

  KineticDrawable = require("../stimresp").KineticDrawable;

  layout = require("../layout");

  Container = (function(_super) {
    __extends(Container, _super);

    function Container(children, spec) {
      this.children = children;
      if (spec == null) {
        spec = {};
      }
      Container.__super__.constructor.call(this, spec);
    }

    Container.prototype.hasChildren = function() {
      return true;
    };

    Container.prototype.getChildren = function() {
      return this.children;
    };

    Container.prototype.initialize = function(context) {
      var child, _i, _len, _ref, _results;
      Container.__super__.initialize.call(this, context);
      console.log("initializing group");
      _ref = this.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        _results.push(child.initialize(context));
      }
      return _results;
    };

    return Container;

  })(Stimulus);

  Group = (function(_super) {
    __extends(Group, _super);

    function Group(children, layout, spec) {
      var stim, _i, _len, _ref;
      if (spec == null) {
        spec = {};
      }
      Group.__super__.constructor.call(this, children, spec);
      if (layout != null) {
        this.layout = layout;
        _ref = this.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          stim = _ref[_i];
          stim.layout = layout;
        }
      }
    }

    Group.prototype.render = function(context) {
      var nodes, stim;
      console.log("rendering group");
      nodes = (function() {
        var _i, _len, _ref, _results;
        _ref = this.children;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          stim = _ref[_i];
          _results.push(stim.render(context));
        }
        return _results;
      }).call(this);
      return new ContainerDrawable(nodes);
    };

    return Group;

  })(Container);

  exports.Group = Group;

  CanvasGroup = (function(_super) {
    __extends(CanvasGroup, _super);

    function CanvasGroup(children, layout, spec) {
      if (spec == null) {
        spec = {};
      }
      CanvasGroup.__super__.constructor.call(this, children, layout, spec);
      this.group = new Kinetic.Group({
        id: this.spec.id
      });
    }

    CanvasGroup.prototype.render = function(context) {
      var node, stim, _i, _len, _ref;
      console.log("rendering canvas group child nodes", this.children);
      _ref = this.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        stim = _ref[_i];
        console.log("rendering node for stim", stim);
        node = stim.render(context).node;
        this.group.add(node);
      }
      return new KineticDrawable(this, this.group);
    };

    return CanvasGroup;

  })(Group);

  Grid = (function(_super) {
    __extends(Grid, _super);

    function Grid(children, rows, columns, bounds) {
      var stim, _i, _len, _ref;
      this.rows = rows;
      this.columns = columns;
      this.bounds = bounds;
      Grid.__super__.constructor.call(this, children);
      this.layout = new layout.GridLayout(this.rows, this.columns, this.bounds);
      _ref = this.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        stim = _ref[_i];
        stim.layout = this.layout;
      }
    }

    return Grid;

  })(Group);

  exports.Group = Group;

  exports.CanvasGroup = CanvasGroup;

  exports.Grid = Grid;

}).call(this);
