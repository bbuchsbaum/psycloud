(function() {
  var Canvas, ComponentFactory, Components, DefaultComponentFactory, Html, Layout, Module, Psy, key, value, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Module = require("../module").Module;

  _ = require('lodash');

  Canvas = require("./canvas/canvas").Canvas;

  Html = require("./html/html").Html;

  Components = require("./components");

  Psy = require("../psycloud");

  Layout = require("../layout");

  ComponentFactory = (function(_super) {
    __extends(ComponentFactory, _super);

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
      if (spec.Next == null) {
        throw new Error("Event specification does not contain 'Next' element");
      }
      stimSpec = _.omit(spec, "Next");
      responseSpec = _.pick(spec, "Next");
      stim = this.buildStimulus(stimSpec);
      response = this.buildResponse(responseSpec.Next);
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

  })(Module);

  exports.ComponentFactory = ComponentFactory;

  DefaultComponentFactory = (function(_super) {
    __extends(DefaultComponentFactory, _super);

    function DefaultComponentFactory() {
      this.registry = _.merge(Components, Canvas, Html);
    }

    DefaultComponentFactory.prototype.make = function(name, params, registry) {
      var callee, layoutName, layoutParams, names, props, stims, _i, _ref, _results,
        _this = this;
      callee = arguments.callee;
      switch (name) {
        case "Group":
          names = _.map(params.stims, function(stim) {
            return _.keys(stim)[0];
          });
          props = _.map(params.stims, function(stim) {
            return _.values(stim)[0];
          });
          stims = _.map((function() {
            _results = [];
            for (var _i = 0, _ref = names.length; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
            return _results;
          }).apply(this), function(i) {
            return callee(names[i], props[i], _this.registry);
          });
          layoutName = _.keys(params.layout)[0];
          layoutParams = _.values(params.layout)[0];
          return new Components.Group(stims, this.makeLayout(layoutName, layoutParams, context));
        default:
          if (registry[name] == null) {
            throw new Error("DefaultComponentFactory:make cannot find component in registry named: ", name);
          }
          return new registry[name](params);
      }
    };

    DefaultComponentFactory.prototype.makeStimulus = function(name, params) {
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
      }
    };

    return DefaultComponentFactory;

  })(ComponentFactory);

  _ref = new DefaultComponentFactory().registry;
  for (key in _ref) {
    value = _ref[key];
    console.log(key, value);
  }

  exports.DefaultComponentFactory = DefaultComponentFactory;

}).call(this);

/*
//# sourceMappingURL=../../lib/canvas/factory.js.map
*/