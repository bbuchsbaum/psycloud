(function() {
  var AutoResponse, Canvas, ComponentFactory, Components, DefaultComponentFactory, Html, Layout, Psy, didyoumean, name, params, spec, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  didyoumean = require("didyoumean");

  didyoumean.caseSensitive = true;

  Canvas = require("./components/canvas/canvas").Canvas;

  Html = require("./components/html/html").Html;

  Components = require("./components/components");

  Psy = require("./psycloud");

  Layout = require("./layout");

  AutoResponse = require("./stimresp").AutoResponse;

  ComponentFactory = (function() {
    ComponentFactory.transformPropertySpec = function(name, params) {
      var id, sname;
      sname = name.split("$");
      if (sname.length === 1) {
        name = sname[0];
      } else if (sname.length === 2) {
        name = sname[0];
        id = sname[1];
        params.id = id;
      } else {
        throw new Error("Illegal property name " + name + ". Can only have one '$' character in name");
      }
      return [name, params];
    };

    function ComponentFactory(context) {
      this.context = context;
    }

    ComponentFactory.prototype.buildStimulus = function(spec) {
      var params, stimType;
      stimType = _.keys(spec)[0];
      params = _.values(spec)[0];
      return this.makeStimulus(stimType, params);
    };

    ComponentFactory.prototype.buildResponse = function(spec) {
      var params, responseType;
      responseType = _.keys(spec)[0];
      params = _.values(spec)[0];
      return this.makeResponse(responseType, params);
    };

    ComponentFactory.prototype.buildEvent = function(spec) {
      var response, responseSpec, stim, stimSpec;
      stimSpec = _.omit(spec, "Next");
      if (spec.Next != null) {
        responseSpec = _.pick(spec, "Next");
        response = this.buildResponse(responseSpec.Next);
      } else {
        response = new AutoResponse();
      }
      stim = this.buildStimulus(stimSpec);
      return this.makeEvent(stim, response);
    };

    ComponentFactory.prototype.make = function(name, params, registry) {
      throw new Error("unimplemented", name, params, registry);
    };

    ComponentFactory.prototype.makeStimulus = function(name, params) {
      throw new Error("unimplemented", name, params);
    };

    ComponentFactory.prototype.makeResponse = function(name, params) {
      throw new Error("unimplemented", name, params);
    };

    ComponentFactory.prototype.makeEvent = function(stim, response) {
      throw new Error("unimplemented", stim, response);
    };

    ComponentFactory.prototype.makeLayout = function(name, params, context) {
      throw new Error("unimplemented", name, params, context);
    };

    return ComponentFactory;

  })();

  spec = {
    Blank: {
      file: "red"
    }
  };

  _ref = ComponentFactory.transformPropertySpec(_.keys(spec)[0], _.values(spec)[0]), name = _ref[0], params = _ref[1];

  console.log(name, params);

  exports.ComponentFactory = ComponentFactory;

  DefaultComponentFactory = (function(_super) {
    __extends(DefaultComponentFactory, _super);

    function DefaultComponentFactory() {
      this.registry = _.merge(Components, Canvas, Html);
    }

    DefaultComponentFactory.prototype.makeStimSet = function(params, callee, registry) {
      var names, props, stims, _i, _ref1, _results;
      names = _.keys(params);
      props = _.values(params);
      return stims = _.map((function() {
        _results = [];
        for (var _i = 0, _ref1 = names.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; 0 <= _ref1 ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this), (function(_this) {
        return function(i) {
          return callee(names[i], props[i], registry);
        };
      })(this));
    };

    DefaultComponentFactory.prototype.makeNestedStims = function(params, callee, registry) {
      var names, props, stims, _i, _ref1, _results;
      names = _.map(params, function(stim) {
        return _.keys(stim)[0];
      });
      props = _.map(params, function(stim) {
        return _.values(stim)[0];
      });
      return stims = _.map((function() {
        _results = [];
        for (var _i = 0, _ref1 = names.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; 0 <= _ref1 ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this), (function(_this) {
        return function(i) {
          return callee(names[i], props[i], registry);
        };
      })(this));
    };

    DefaultComponentFactory.prototype.make = function(name, params, registry) {
      var callee, layoutName, layoutParams, resps, stims, _ref1;
      callee = arguments.callee;
      _ref1 = ComponentFactory.transformPropertySpec(name, params), name = _ref1[0], params = _ref1[1];
      switch (name) {
        case "Group":
          stims = this.makeNestedStims(params.stims, callee, this.registry);
          if (params.layout != null) {
            layoutName = _.keys(params.layout)[0];
            layoutParams = _.values(params.layout)[0];
            return new Components.Group(stims, this.makeLayout(layoutName, layoutParams, context), params);
          } else {
            return new Components.Group(stims, null, params);
          }
          break;
        case "CanvasGroup":
          stims = this.makeNestedStims(params.stims, callee, this.registry);
          if (params.layout != null) {
            layoutName = _.keys(params.layout)[0];
            layoutParams = _.values(params.layout)[0];
            return new Components.CanvasGroup(stims, this.makeLayout(layoutName, layoutParams, context), params);
          } else {
            return new Components.CanvasGroup(stims, null, params);
          }
          break;
        case "Grid":
          stims = this.makeNestedStims(params.stims, callee, this.registry);
          return new Components.Grid(stims, params.rows || 3, params.columns || 3, params.bounds || null);
        case "Background":
          stims = this.makeStimSet(params, callee, this.registry);
          return new Canvas.Background(stims);
        case "First":
          resps = this.makeNestedStims(params, callee, this.registry);
          return new Components.First(resps);
        default:
          if (registry[name] == null) {
            throw new Error("DefaultComponentFactory: cannot find component named: " + name + "-- did you mean? " + didyoumean(name, _.keys(registry)) + "?");
          }
          return new registry[name](params);
      }
    };

    DefaultComponentFactory.prototype.makeStimulus = function(name, params) {
      console.log("making stimulus", name, "with params", params);
      return this.make(name, params, this.registry);
    };

    DefaultComponentFactory.prototype.makeResponse = function(name, params) {
      return this.make(name, params, this.registry);
    };

    DefaultComponentFactory.prototype.makeEvent = function(stim, response) {
      return new Psy.Event(stim, response);
    };

    DefaultComponentFactory.prototype.makeLayout = function(name, params, context) {
      switch (name) {
        case "Grid":
          return new Layout.GridLayout(params[0], params[1], {
            x: 0,
            y: 0,
            width: context.width(),
            height: context.height()
          });
        default:
          return console.log("unrecognized layout", name);
      }
    };

    return DefaultComponentFactory;

  })(ComponentFactory);

  exports.DefaultComponentFactory = DefaultComponentFactory;

  exports.componentFactory = new DefaultComponentFactory();

}).call(this);
