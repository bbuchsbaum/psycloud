(function() {
  var ActionPresentable, ContainerDrawable, Drawable, GraphicalStimulus, Kinetic, KineticDrawable, KineticStimulus, Presentable, Response, ResponseData, Stimulus, lay, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  lay = require("./layout");

  Kinetic = require("../jslibs/kinetic");

  exports.Stimulus = Stimulus = (function() {
    Stimulus.prototype.standardDefaults = {};

    Stimulus.prototype.defaults = {};

    function Stimulus(spec) {
      var _ref;
      if (spec == null) {
        spec = {};
      }
      this.spec = _.defaults(spec, this.defaults);
      this.spec = _.defaults(spec, this.standardDefaults);
      this.spec = _.omit(this.spec, function(value, key) {
        return value == null;
      });
      this.name = this.constructor.name;
      if (((_ref = this.spec) != null ? _ref.id : void 0) != null) {
        this.id = this.spec.id;
      } else {
        this.id = _.uniqueId("stim_");
      }
      this.stopped = false;
      this.name = this.constructor.name;
      this.initialize();
    }

    Stimulus.prototype.initialize = function() {};

    Stimulus.prototype.get = function(name) {
      return this.spec[name];
    };

    Stimulus.prototype.set = function(name, value) {
      return this.spec[name] = value;
    };

    Stimulus.prototype.reset = function() {
      return this.stopped = false;
    };

    Stimulus.prototype.render = function(context, layer) {};

    Stimulus.prototype.stop = function(context) {
      return this.stopped = true;
    };

    return Stimulus;

  })();

  exports.GraphicalStimulus = GraphicalStimulus = (function(_super) {
    __extends(GraphicalStimulus, _super);

    GraphicalStimulus.prototype.standardDefaults = {
      x: 0,
      y: 0,
      origin: "top-left"
    };

    function GraphicalStimulus(spec) {
      if (spec == null) {
        spec = {};
      }
      if (spec.layout != null) {
        this.layout = spec.layout;
      } else {
        this.layout = new lay.AbsoluteLayout();
      }
      this.overlay = false;
      GraphicalStimulus.__super__.constructor.call(this, spec);
    }

    GraphicalStimulus.prototype.drawable = function(knode) {
      return function(context) {
        return console.log("GraphicalStimulus: drawable, no op");
      };
    };

    GraphicalStimulus.prototype.toPixels = function(arg, dim) {
      return lay.toPixels(arg, dim);
    };

    GraphicalStimulus.prototype.xyoffset = function(origin, nodeWidth, nodeHeight) {
      switch (origin) {
        case "center":
          return [-nodeWidth / 2, -nodeHeight / 2];
        case "center-left" || "left-center":
          return [0, -nodeHeight / 2];
        case "center-right" || "right-center":
          return [-nodeWidth, -nodeHeight / 2];
        case "top-left" || "left-top":
          return [0, 0];
        case "top-right" || "right-top":
          return [-nodeWidth, 0];
        case "top-center" || "center-top":
          return [-nodeWidth / 2, 0];
        case "bottom-left" || "left-bottom":
          return [0, -nodeHeight];
        case "bottom-right" || "right-bottom":
          return [-nodeWidth, -nodeHeight];
        case "bottom-center" || "center-bottom":
          return [-nodeWidth / 2, -nodeHeight];
        default:
          throw new Error("failed to match 'origin' argument:", origin);
      }
    };

    GraphicalStimulus.prototype.computeCoordinates = function(context, position, nodeWidth, nodeHeight) {
      var xy, xyoff;
      if (nodeWidth == null) {
        nodeWidth = 0;
      }
      if (nodeHeight == null) {
        nodeHeight = 0;
      }
      xy = (function() {
        if (position != null) {
          return this.layout.computePosition([context.width(), context.height()], position);
        } else if ((this.spec.x != null) && (this.spec.y != null)) {
          return [this.layout.convertToCoordinate(this.spec.x, context.width()), this.layout.convertToCoordinate(this.spec.y, context.height())];
        } else {
          throw new Error("computeCoordinates: either position or x,y coordinates must be defined");
        }
      }).call(this);
      if (this.spec.origin != null) {
        xyoff = this.xyoffset(this.spec.origin, nodeWidth, nodeHeight);
        xy[0] = xy[0] + xyoff[0];
        xy[1] = xy[1] + xyoff[1];
      }
      return xy;
    };

    GraphicalStimulus.prototype.width = function() {
      return 0;
    };

    GraphicalStimulus.prototype.height = function() {
      return 0;
    };

    GraphicalStimulus.prototype.bounds = function() {
      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };
    };

    return GraphicalStimulus;

  })(exports.Stimulus);

  exports.KineticStimulus = KineticStimulus = (function(_super) {
    __extends(KineticStimulus, _super);

    function KineticStimulus() {
      return KineticStimulus.__super__.constructor.apply(this, arguments);
    }

    KineticStimulus.prototype.presentable = function(nodes) {
      console.log("creating presentable of", nodes);
      return new KineticDrawable(nodes);
    };

    KineticStimulus.nodeSize = function(node) {
      if (node.getClassName() === "Group") {
        console.log("class is group!");
        return KineticStimulus.groupSize(node);
      } else {
        return {
          width: node.getWidth(),
          height: node.getHeight()
        };
      }
    };

    KineticStimulus.nodePosition = function(node) {
      var xb, yb;
      if (node.getClassName() === "Group") {
        console.log("class is group!");
        xb = KineticStimulus.groupXBounds(node);
        yb = KineticStimulus.groupYBounds(node);
        console.log("xb is", xb);
        console.log("yb is", yb);
        return {
          x: xb[0],
          y: yb[0]
        };
      } else {
        return {
          x: node.getX(),
          y: node.getY()
        };
      }
    };

    KineticStimulus.groupSize = function(group) {
      var xb, yb;
      xb = this.groupXBounds(group);
      yb = this.groupYBounds(group);
      return {
        width: xb[1] - xb[0],
        height: yb[1] - yb[0]
      };
    };

    KineticStimulus.groupXBounds = function(group) {
      var children, i, pos, xmax, xmin, _i, _ref;
      children = group.getChildren();
      xmin = Number.MAX_VALUE;
      xmax = -1;
      for (i = _i = 0, _ref = children.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        pos = children[i].getAbsolutePosition();
        if (pos.x < xmin) {
          xmin = pos.x;
        }
        if (pos.x + children[i].getWidth() > xmax) {
          xmax = pos.x + children[i].getWidth();
        }
      }
      return [xmin, xmax];
    };

    KineticStimulus.groupYBounds = function(group) {
      var children, i, pos, ymax, ymin, _i, _ref;
      children = group.getChildren();
      ymin = Number.MAX_VALUE;
      ymax = -1;
      for (i = _i = 0, _ref = children.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        pos = children[i].getAbsolutePosition();
        if (pos.y < ymin) {
          ymin = children[i].getY();
        }
        if (pos.y + children[i].getHeight() > ymax) {
          ymax = pos.y + children[i].getHeight();
        }
      }
      return [ymin, ymax];
    };

    KineticStimulus.groupPosition = function(group) {
      var children, i, pos, x, y, _i, _ref;
      children = group.getChildren();
      if (children.length === 0) {
        return {
          x: 0,
          y: 0
        };
      } else {
        x = Number.MAX_VALUE;
        y = -1;
        pos = children[i].getAbsolutePosition();
        for (i = _i = 0, _ref = children.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          if (pos.x < x) {
            x = pos.x;
          }
          if (pos.y < y) {
            y = pos.y;
          }
        }
        return {
          x: x + group.getX(),
          y: y + group.getY()
        };
      }
    };

    return KineticStimulus;

  })(exports.GraphicalStimulus);

  exports.Presentable = Presentable = (function() {
    function Presentable() {}

    Presentable.prototype.present = function(context) {};

    return Presentable;

  })();

  exports.ActionPresentable = ActionPresentable = (function(_super) {
    var _class;

    __extends(ActionPresentable, _super);

    function ActionPresentable() {
      return _class.apply(this, arguments);
    }

    _class = ActionPresentable.action;

    ActionPresentable.prototype.present = function(context) {
      return this.action.apply(context);
    };

    return ActionPresentable;

  })(exports.Presentable);

  exports.Drawable = Drawable = (function(_super) {
    __extends(Drawable, _super);

    function Drawable() {
      return Drawable.__super__.constructor.apply(this, arguments);
    }

    Drawable.prototype.present = function(context) {};

    Drawable.prototype.x = function() {
      return 0;
    };

    Drawable.prototype.y = function() {
      return 0;
    };

    Drawable.prototype.width = function() {
      return 0;
    };

    Drawable.prototype.height = function() {
      return 0;
    };

    Drawable.prototype.bounds = function() {
      return {
        x: this.x(),
        y: this.y(),
        width: this.width(),
        height: this.height()
      };
    };

    return Drawable;

  })(exports.Presentable);

  exports.KineticDrawable = KineticDrawable = (function(_super) {
    __extends(KineticDrawable, _super);

    function KineticDrawable(nodes) {
      this.nodes = nodes;
      if (!_.isArray(this.nodes)) {
        this.nodes = [this.nodes];
      }
    }

    KineticDrawable.prototype.present = function(context, layer) {
      var node, _i, _len, _ref, _results;
      console.log("presenting ", this.nodes);
      _ref = this.nodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        if (layer == null) {
          _results.push(context.contentLayer.add(node));
        } else {
          console.log("drawing in layer supplied as arg");
          _results.push(layer.add(node));
        }
      }
      return _results;
    };

    KineticDrawable.prototype.x = function() {
      var xs;
      xs = _.map(this.nodes, function(node) {
        return exports.KineticStimulus.nodePosition(node).x;
      });
      return _.min(xs);
    };

    KineticDrawable.prototype.y = function() {
      var ys;
      ys = _.map(this.nodes, function(node) {
        return exports.KineticStimulus.nodePosition(node).y;
      });
      return _.min(ys);
    };

    KineticDrawable.prototype.xmax = function() {
      var xs;
      xs = _.map(this.nodes, function(node) {
        return exports.KineticStimulus.nodePosition(node).x + exports.KineticStimulus.nodeSize(node).width;
      });
      return _.max(xs);
    };

    KineticDrawable.prototype.ymax = function() {
      var xs;
      xs = _.map(this.nodes, function(node) {
        return exports.KineticStimulus.nodePosition(node).y + exports.KineticStimulus.nodeSize(node).height;
      });
      return _.max(xs);
    };

    KineticDrawable.prototype.width = function() {
      return this.xmax() - this.x();
    };

    KineticDrawable.prototype.height = function() {
      return this.ymax() - this.y();
    };

    return KineticDrawable;

  })(exports.Drawable);

  exports.ContainerDrawable = ContainerDrawable = (function(_super) {
    __extends(ContainerDrawable, _super);

    function ContainerDrawable(nodes) {
      this.nodes = nodes;
      console.log("creating container drawable");
    }

    ContainerDrawable.prototype.present = function(context, layer) {
      var node, _i, _len, _ref, _results;
      _ref = this.nodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        if (!layer) {
          _results.push(node.present(context));
        } else {
          _results.push(node.present(context, layer));
        }
      }
      return _results;
    };

    return ContainerDrawable;

  })(exports.Drawable);

  exports.Response = Response = (function(_super) {
    __extends(Response, _super);

    function Response() {
      return Response.__super__.constructor.apply(this, arguments);
    }

    Response.prototype.start = function(context) {
      return this.activate(context);
    };

    Response.prototype.activate = function(context) {};

    return Response;

  })(exports.Stimulus);

  exports.ResponseData = ResponseData = (function() {
    function ResponseData(data) {
      this.data = data;
    }

    return ResponseData;

  })();

}).call(this);
