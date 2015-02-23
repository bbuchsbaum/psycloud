(function() {
  var AutoResponse, Canvas, ComponentFactory, Components, DefaultComponentFactory, Flow, Html, Layout, Psy, didyoumean, name, params, spec, _, _ref,
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

  Flow = require("./flow");

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
      console.log("building event", spec);
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

    ComponentFactory.prototype.buildTrial = function(spec, record) {
      var background, espec, evseq;
      console.log("building trial from spec", spec);
      espec = _.omit(spec, ["Feedback", "Background"]);
      evseq = this.buildEventSeq(espec);
      console.log("trial events", evseq);
      console.log("feedback is", spec.Feedback);
      if (spec.Background != null) {
        background = this.makeStimulus("Background", spec.Background);
        return new Flow.Trial(evseq, record, spec.Feedback, background);
      } else {
        return new Flow.Trial(evseq, record, spec.Feedback);
      }
    };

    ComponentFactory.prototype.buildEventSeq = function(spec) {
      var espec, key, value, _i, _len, _ref, _results, _results1;
      console.log("building event sequence", spec);
      if (_.isArray(spec)) {
        _results = [];
        for (_i = 0, _len = spec.length; _i < _len; _i++) {
          value = spec[_i];
          _results.push(this.buildEvent(value));
        }
        return _results;
      } else if (spec.Events != null) {
        console.log("building event sequence from event key", spec);
        espec = _.omit(spec, "Background");
        _ref = espec.Events;
        _results1 = [];
        for (key in _ref) {
          value = _ref[key];
          console.log("building event from key, value: ", key, value);
          _results1.push(this.buildEvent(value));
        }
        return _results1;
      } else {
        espec = _.omit(spec, "Background");
        return [this.buildEvent(espec)];
      }
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
      var callee, columns, resps, rows, stims, _ref1;
      callee = arguments.callee;
      _ref1 = ComponentFactory.transformPropertySpec(name, params), name = _ref1[0], params = _ref1[1];
      switch (name) {
        case "Group":
          stims = params.elements != null ? this.makeNestedStims(params.elements, callee, this.registry) : this.makeNestedStims(params, callee, this.registry);
          return new Components.Group(stims, null, params);
        case "CanvasGroup":
          stims = this.makeNestedStims(params, callee, this.registry);
          return new Components.CanvasGroup(stims, null, params);
        case "Grid":
          rows = _.pick(params, "rows");
          columns = _.pick(params, "columns");
          columns = _.pick(params, "bounds");
          params = _.omit(params, ["rows", "columns"]);
          stims = this.makeNestedStims(params, callee, this.registry);
          return new Components.Grid(stims, rows || 3, columns || 3, params.bounds || null);
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
      return this.make(name, params, this.registry);
    };

    DefaultComponentFactory.prototype.makeResponse = function(name, params) {
      return this.make(name, params, this.registry);
    };

    DefaultComponentFactory.prototype.makeEvent = function(stim, response) {
      return new Flow.Event(stim, response);
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
