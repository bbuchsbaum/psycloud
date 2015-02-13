(function() {
  var ActionPresentable, AutoResponse, Component, ContainerDrawable, Drawable, GraphicalStimulus, KineticDrawable, KineticStimulus, Presentable, Q, Reaction, Response, ResponseData, Stimulus, lay, match, signals, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  lay = require("./layout");

  signals = require("smokesignals");

  Q = require("q");

  match = require('coffee-pattern').match;

  exports.Reaction = Reaction = (function() {
    function Reaction(signal, callback, id) {
      this.signal = signal;
      this.callback = callback;
      this.id = id != null ? id : null;
    }

    Reaction.prototype.bind = function(node) {
      if (this.id != null) {
        return "";
      }
    };

    return Reaction;

  })();


  /*
    Routines:
      prelude:
        ---
      trial: ->
        design injected
        ---
      trial2: ->
        design
  
    Flow: ->
      @prelude(),
   */

  exports.Component = Component = (function() {
    Component.prototype.standardDefaults = {};

    Component.prototype.defaults = {};

    Component.prototype.signals = [];

    Component.prototype.hasChildren = function() {
      return false;
    };

    Component.prototype.getChildren = function() {
      return [];
    };

    function Component(spec) {
      if (spec == null) {
        spec = {};
      }
      signals.convert(this);
      this.spec = _.defaults(spec, this.defaults);
      this.spec = _.defaults(spec, this.standardDefaults);
      this.spec = _.omit(this.spec, function(value, key) {
        return value == null;
      });
      this.name = this.constructor.name;
      this.initialize();
    }

    Component.prototype.initialize = function() {};

    Component.prototype.start = function(context) {};

    Component.prototype.stop = function(context) {};

    return Component;

  })();

  exports.Stimulus = Stimulus = (function(_super) {
    __extends(Stimulus, _super);

    Stimulus.prototype.standardDefaults = {
      react: {}
    };

    function Stimulus(spec) {
      if (spec == null) {
        spec = {};
      }
      Stimulus.__super__.constructor.call(this, spec);
    }

    Stimulus.prototype.initialize = function() {
      var _ref;
      if (((_ref = this.spec) != null ? _ref.id : void 0) != null) {
        this.id = this.spec.id;
      } else {
        this.id = _.uniqueId("stim_");
      }
      this.stopped = false;
      return this.react = this.spec.react || {};
    };

    Stimulus.prototype.initReactions = function(self) {
      var key, value, _ref, _results;
      _ref = this.react;
      _results = [];
      for (key in _ref) {
        value = _ref[key];
        if (_.isFunction(value)) {
          _results.push(this.addReaction(key, value));
        } else {
          _results.push(this.addReaction(key, value.callback, value.selector));
        }
      }
      return _results;
    };

    Stimulus.prototype.addReaction = function(name, fun, selector) {
      var child, _i, _len, _ref, _results;
      if (selector == null) {
        return this.on(name, fun);
      } else {
        if (selector.id === this.id) {
          return this.on(name, fun);
        } else if (this.hasChildren()) {
          _ref = this.getChildren();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            child = _ref[_i];
            _results.push(child.addReaction(name, fun, selector));
          }
          return _results;
        }
      }
    };

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

    Stimulus.prototype.start = function(context) {
      var p;
      p = this.render(context);
      p.present(context);
      return context.draw();
    };

    Stimulus.prototype.stop = function(context) {
      return this.stopped = true;
    };

    return Stimulus;

  })(exports.Component);

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

    GraphicalStimulus.prototype.defaultOrigin = "top-left";

    GraphicalStimulus.prototype.xyoffset = function(origin, nodeWidth, nodeHeight) {
      if (this.defaultOrigin === "top-left") {
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
      } else if (this.defaultOrigin === "center") {
        switch (origin) {
          case "center":
            return [0, 0];
          case "center-left" || "left-center":
            return [nodeWidth / 2, 0];
          case "center-right" || "right-center":
            return [-nodeWidth / 2, 0];
          case "top-left" || "left-top":
            return [nodeWidth / 2, nodeHeight / 2];
          case "top-right" || "right-top":
            return [-nodeWidth / 2, nodeHeight / 2];
          case "top-center" || "center-top":
            return [0, nodeHeight / 2];
          case "bottom-left" || "left-bottom":
            return [nodeWidth / 2, -nodeHeight / 2];
          case "bottom-right" || "right-bottom":
            return [-nodeWidth / 2, -nodeHeight / 2];
          case "bottom-center" || "center-bottom":
            return [0, -nodeHeight / 2];
          default:
            throw new Error("failed to match 'origin' argument:", origin);
        }
      } else {
        throw new Error("failed to match 'origin' argument:", this.defaultOrigin);
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
          throw new Error("computeCoordinates: either 'position' constraint or 'x','y' coordinates must be defined");
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

  KineticStimulus = (function(_super) {
    __extends(KineticStimulus, _super);

    function KineticStimulus() {
      return KineticStimulus.__super__.constructor.apply(this, arguments);
    }

    KineticStimulus.prototype.presentable = function(parent, node, onPresent) {
      return new KineticDrawable(parent, node, onPresent);
    };

    KineticStimulus.nodeSize = function(node) {
      if (node.getClassName() === "Group") {
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
        xb = KineticStimulus.groupXBounds(node);
        yb = KineticStimulus.groupYBounds(node);
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
    __extends(ActionPresentable, _super);

    function ActionPresentable(action) {
      this.action = action;
      console.log("constructiong action presentable, action is", this.action);
    }

    ActionPresentable.prototype.present = function(context) {
      console.log("inside action presentable, context is", context, "action is", this.action);
      return this.action(context);
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

    function KineticDrawable(parent, node, onPresent) {
      this.parent = parent;
      this.node = node;
      this.onPresent = onPresent;
    }

    KineticDrawable.prototype.addListeners = function(context) {
      var callback, e, eventTypes, outer, _i, _len, _results;
      eventTypes = ["click", "mouseover", "mousedown", "mouseenter", "mouseleave", "mousemove", "mousedown", "mouseup", "dblclick", "dragstart", "dragend"];
      outer = this;
      _results = [];
      for (_i = 0, _len = eventTypes.length; _i < _len; _i++) {
        e = eventTypes[_i];
        if (this.parent.spec[e] != null) {
          callback = this.parent.spec[e];
          _results.push(this.node.on(e, (function(_this) {
            return function(evt) {
              return callback(outer, context, evt);
            };
          })(this)));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    KineticDrawable.prototype.find = function(selector) {
      return this.node.find(selector);
    };

    KineticDrawable.prototype.present = function(context, layer) {
      this.addListeners(context);
      if (layer == null) {
        context.contentLayer.add(this.node);
      } else {
        layer.add(this.node);
      }
      if (this.onPresent != null) {
        return this.onPresent(context);
      }
    };

    KineticDrawable.prototype.set = function(name, value) {
      return this.node[name](value);
    };

    KineticDrawable.prototype.x = function() {
      return KineticStimulus.nodePosition(this.node).x;
    };

    KineticDrawable.prototype.y = function() {
      return KineticStimulus.nodePosition(this.node).y;
    };

    KineticDrawable.prototype.xmax = function() {
      return KineticStimulus.nodePosition(this.node).x + KineticStimulus.nodeSize(this.node).width;
    };

    KineticDrawable.prototype.ymax = function() {
      return KineticStimulus.nodePosition(this.node).y + KineticStimulus.nodeSize(this.node).height;
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

    Response.prototype.start = function(context, stimulus) {
      return this.activate(context, stimulus);
    };

    Response.prototype.activate = function(context, stimulus) {
      return console.log("Response.activate", context, stimulus);
    };

    Response.prototype.baseResponse = function(stimulus) {
      var resp;
      resp = {
        type: "response",
        name: this.constructor.name,
        stimName: stimulus.name,
        id: this.id
      };
      return resp;
    };

    return Response;

  })(exports.Stimulus);

  exports.AutoResponse = AutoResponse = (function(_super) {
    __extends(AutoResponse, _super);

    function AutoResponse() {
      return AutoResponse.__super__.constructor.apply(this, arguments);
    }

    AutoResponse.prototype.activate = function(context, stimulus) {
      return Q({});
    };

    return AutoResponse;

  })(exports.Response);

  exports.ResponseData = ResponseData = (function() {
    function ResponseData(data) {
      this.data = data;
    }

    return ResponseData;

  })();

  exports.KineticStimulus = KineticStimulus;

}).call(this);
