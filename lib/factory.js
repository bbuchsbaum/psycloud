(function() {
  var Canvas, ComponentFactory, Components, DefaultComponentFactory, Html, Layout, Psy, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  Canvas = require("./components/canvas/canvas").Canvas;

  Html = require("./components/html/html").Html;

  Components = require("./components/components");

  Psy = require("./psycloud");

  Layout = require("./layout");

  ComponentFactory = (function() {
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
        console.log("error building event with spec: ", spec);
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

  })();

  exports.ComponentFactory = ComponentFactory;

  DefaultComponentFactory = (function(_super) {
    __extends(DefaultComponentFactory, _super);

    function DefaultComponentFactory() {
      this.registry = _.merge(Components, Canvas, Html);
    }

    DefaultComponentFactory.prototype.make = function(name, params, registry) {
      var callee, layoutName, layoutParams, names, props, resps, stims, _i, _j, _k, _l, _ref, _ref1, _ref2, _ref3, _results, _results1, _results2, _results3;
      callee = arguments.callee;
      console.log("making", name);
      switch (name) {
        case "Group":
          console.log("building group");
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
          }).apply(this), (function(_this) {
            return function(i) {
              return callee(names[i], props[i], _this.registry);
            };
          })(this));
          if (params.layout != null) {
            layoutName = _.keys(params.layout)[0];
            layoutParams = _.values(params.layout)[0];
            return new Components.Group(stims, this.makeLayout(layoutName, layoutParams, context));
          } else {
            return new Components.Group(stims);
          }
          break;
        case "Grid":
          names = _.map(params.stims, function(stim) {
            return _.keys(stim)[0];
          });
          props = _.map(params.stims, function(stim) {
            return _.values(stim)[0];
          });
          stims = _.map((function() {
            _results1 = [];
            for (var _j = 0, _ref1 = names.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; 0 <= _ref1 ? _j++ : _j--){ _results1.push(_j); }
            return _results1;
          }).apply(this), (function(_this) {
            return function(i) {
              return callee(names[i], props[i], _this.registry);
            };
          })(this));
          return new Components.Grid(stims, params.rows || 3, params.columns || 3, params.bounds || null);
        case "Background":
          console.log("building background", params);
          names = _.keys(params);
          props = _.values(params);
          console.log("names", names);
          console.log("props", props);
          stims = _.map((function() {
            _results2 = [];
            for (var _k = 0, _ref2 = names.length; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; 0 <= _ref2 ? _k++ : _k--){ _results2.push(_k); }
            return _results2;
          }).apply(this), (function(_this) {
            return function(i) {
              return callee(names[i], props[i], _this.registry);
            };
          })(this));
          return new Canvas.Background(stims);
        case "First":
          names = _.keys(params);
          props = _.values(params);
          resps = _.map((function() {
            _results3 = [];
            for (var _l = 0, _ref3 = names.length; 0 <= _ref3 ? _l < _ref3 : _l > _ref3; 0 <= _ref3 ? _l++ : _l--){ _results3.push(_l); }
            return _results3;
          }).apply(this), (function(_this) {
            return function(i) {
              return callee(names[i], props[i], _this.registry);
            };
          })(this));
          return new Components.First(resps);
        default:
          if (registry[name] == null) {
            console.log("registry is", registry);
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
        default:
          return console.log("unrecognized layout", name);
      }
    };

    return DefaultComponentFactory;

  })(ComponentFactory);

  exports.DefaultComponentFactory = DefaultComponentFactory;

  exports.componentFactory = new DefaultComponentFactory();

  console.log("exports.DefaultComponentFactory", DefaultComponentFactory);

}).call(this);
