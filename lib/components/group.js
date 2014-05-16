(function() {
  var CanvasGroup, ContainerDrawable, Grid, Group, KineticDrawable, Stimulus, layout,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Stimulus = require("../stimresp").Stimulus;

  ContainerDrawable = require("../stimresp").ContainerDrawable;

  KineticDrawable = require("../stimresp").KineticDrawable;

  layout = require("../layout");

  Group = (function(_super) {
    __extends(Group, _super);

    function Group(stims, layout, spec) {
      var stim, _i, _len, _ref;
      this.stims = stims;
      if (spec == null) {
        spec = {};
      }
      Group.__super__.constructor.call(this, spec);
      console.log("constructing group with stims", stims);
      if (layout != null) {
        this.layout = layout;
        _ref = this.stims;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          stim = _ref[_i];
          stim.layout = layout;
        }
      }
    }

    Group.prototype.render = function(context) {
      var nodes, stim;
      nodes = (function() {
        var _i, _len, _ref, _results;
        _ref = this.stims;
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

  })(Stimulus);

  exports.Group = Group;

  CanvasGroup = (function(_super) {
    __extends(CanvasGroup, _super);

    function CanvasGroup(stims, layout, spec) {
      var stim, _i, _len, _ref;
      if (spec == null) {
        spec = {};
      }
      CanvasGroup.__super__.constructor.call(this, stims, layout, spec);
      this.group = new Kinetic.Group({
        id: this.spec.id
      });
      _ref = this.stims;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        stim = _ref[_i];
        console.log("canvas group stim child", stim);
      }
    }

    CanvasGroup.prototype.render = function(context) {
      var node, stim, _i, _len, _ref;
      console.log("rendering canvas group child nodes", this.stims);
      _ref = this.stims;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        stim = _ref[_i];
        console.log("rendering node for stim", stim);
        node = stim.render(context).node;
        console.log("rendered node", node);
        this.group.add(node);
      }
      return new KineticDrawable(this, this.group);
    };

    return CanvasGroup;

  })(Group);

  Grid = (function(_super) {
    __extends(Grid, _super);

    function Grid(stims, rows, columns, bounds) {
      var stim, _i, _len, _ref;
      this.stims = stims;
      this.rows = rows;
      this.columns = columns;
      this.bounds = bounds;
      this.layout = new layout.GridLayout(this.rows, this.columns, this.bounds);
      _ref = this.stims;
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
