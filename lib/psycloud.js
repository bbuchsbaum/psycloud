(function() {
  var Background, Bacon, Cont, DataTable, DefaultComponentFactory, Done, DynamicTrialEnumerator, Error, EventData, EventDataLog, ExperimentContext, Flow, Input, Iteratee, KineticContext, MockStimFactory, Presentation, Presenter, Q, Response, ResponseData, RunnableNode, STRIP_COMMENTS, StaticTrialEnumerator, StimFactory, Stimulus, TAFFY, TrialEnumerator, buildTrial, createContext, getParamNames, makeBlockSeq, props, utils, _, __dummySpec,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  Q = require("q");

  TAFFY = require("taffydb").taffy;

  utils = require("./utils");

  DataTable = require("./datatable").DataTable;

  Bacon = require("baconjs");

  DefaultComponentFactory = require("./factory").DefaultComponentFactory;

  Background = require("./components/canvas/background").Background;

  Stimulus = require("./stimresp").Stimulus;

  Response = require("./stimresp").Response;

  ResponseData = require("./stimresp").ResponseData;

  props = require("pathval");

  Flow = require("./flow");

  RunnableNode = Flow.RunnableNode;

  STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/g;

  getParamNames = function(func) {
    var fnStr, result;
    fnStr = func.toString().replace(STRIP_COMMENTS, "");
    result = fnStr.slice(fnStr.indexOf("(") + 1, fnStr.indexOf(")")).match(/([^\s,]+)/g);
    if (result === null) {
      result = [];
    }
    return result;
  };

  Input = (function() {
    function Input() {}

    Input.EOF = new Input();

    Input.EMPTY = new Input();

    return Input;

  })();

  Iteratee = (function() {
    function Iteratee() {}

    return Iteratee;

  })();

  Done = (function(_super) {
    __extends(Done, _super);

    function Done(a, remaining) {
      this.a = a;
      this.remaining = remaining;
    }

    return Done;

  })(Iteratee);

  Error = (function(_super) {
    __extends(Error, _super);

    function Error(msg, input) {
      this.msg = msg;
      this.input = input;
    }

    return Error;

  })(Iteratee);

  Cont = (function(_super) {
    __extends(Cont, _super);

    function Cont(cont) {
      this.cont = cont;
    }

    return Cont;

  })(Iteratee);

  exports.EventData = EventData = (function() {
    function EventData(name, id, data) {
      this.name = name;
      this.id = id;
      this.data = data;
    }

    return EventData;

  })();

  exports.EventDataLog = EventDataLog = (function() {
    function EventDataLog() {
      this.eventStack = [];
    }

    EventDataLog.prototype.push = function(ev) {
      return this.eventStack.push(ev);
    };

    EventDataLog.prototype.last = function() {
      if (this.eventStack.length < 1) {
        throw "EventLog is Empty, canot access last element";
      }
      return this.eventStack[this.eventStack.length - 1].data;
    };

    EventDataLog.prototype.findAll = function(id) {
      return _.filter(this.eventStack, function(ev) {
        return ev.id === id;
      });
    };

    EventDataLog.prototype.findLast = function(id) {
      var i, len, _i;
      len = this.eventStack.length - 1;
      for (i = _i = len; len <= 0 ? _i <= 0 : _i >= 0; i = len <= 0 ? ++_i : --_i) {
        if (this.eventStack[i].id === id) {
          return this.eventStack[i];
        }
      }
    };

    return EventDataLog;

  })();

  exports.StimFactory = StimFactory = (function() {
    function StimFactory() {}

    StimFactory.prototype.buildStimulus = function(spec, context) {
      var params, stimType;
      stimType = _.keys(spec)[0];
      params = _.values(spec)[0];
      return this.makeStimulus(stimType, params, context);
    };

    StimFactory.prototype.buildResponse = function(spec, context) {
      var params, responseType;
      responseType = _.keys(spec)[0];
      params = _.values(spec)[0];
      return this.makeResponse(responseType, params, context);
    };

    StimFactory.prototype.buildEvent = function(spec, context) {
      var response, responseSpec, stim, stimSpec;
      if (spec.Next == null) {
        throw new Error("Event specification does not contain 'Next' element");
      }
      stimSpec = _.omit(spec, "Next");
      responseSpec = _.pick(spec, "Next");
      stim = this.buildStimulus(stimSpec, context);
      response = this.buildResponse(responseSpec.Next, context);
      return this.makeEvent(stim, response, context);
    };

    StimFactory.prototype.makeStimulus = function(name, params, context) {
      throw new Error("unimplemented");
    };

    StimFactory.prototype.makeResponse = function(name, params, context) {
      throw new Error("unimplemented");
    };

    StimFactory.prototype.makeEvent = function(stim, response, context) {
      throw new Error("unimplemented");
    };

    return StimFactory;

  })();

  exports.MockStimFactory = MockStimFactory = (function(_super) {
    __extends(MockStimFactory, _super);

    function MockStimFactory() {
      return MockStimFactory.__super__.constructor.apply(this, arguments);
    }

    MockStimFactory.prototype.makeStimulus = function(name, params, context) {
      var ret;
      ret = {};
      ret[name] = params;
      return ret;
    };

    MockStimFactory.prototype.makeResponse = function(name, params, context) {
      var ret;
      ret = {};
      ret[name] = params;
      return ret;
    };

    MockStimFactory.prototype.makeEvent = function(stim, response, context) {
      return [stim, response];
    };

    return MockStimFactory;

  })(exports.StimFactory);

  TrialEnumerator = (function() {
    function TrialEnumerator() {}

    TrialEnumerator.prototype.next = function(context) {};

    return TrialEnumerator;

  })();

  StaticTrialEnumerator = (function(_super) {
    __extends(StaticTrialEnumerator, _super);

    function StaticTrialEnumerator(trialList) {
      this.trialList = trialList;
      this.index = 0;
    }

    StaticTrialEnumerator.prototype.next = function(context) {
      var len;
      len = this.trialList.length;
      if (this.index < this.len) {
        this.trialList[this.index];
        return this.index = this.index + 1;
      } else {
        throw new Error("TrialEnumerator: illegal index: " + index + " for list of trial of length " + len);
      }
    };

    StaticTrialEnumerator.prototype.hasNext = function() {
      return this.index < this.trialList.length;
    };

    return StaticTrialEnumerator;

  })(TrialEnumerator);

  DynamicTrialEnumerator = (function(_super) {
    __extends(DynamicTrialEnumerator, _super);

    function DynamicTrialEnumerator(generator, maxTrials) {
      this.generator = generator;
      this.maxTrials = maxTrials != null ? maxTrials : 10000;
      this.index = 0;
    }

    DynamicTrialEnumerator.prototype.next = function(context) {
      this.index = this.index + 1;
      if (this.index < this.maxTrials) {
        return this.generator(context);
      }
    };

    DynamicTrialEnumerator.prototype.hasNext = function() {
      return this.index < this.maxTrials;
    };

    return DynamicTrialEnumerator;

  })(TrialEnumerator);

  createContext = function(id) {
    var stage;
    if (id == null) {
      id = "container";
    }
    stage = new Kinetic.Stage({
      container: id,
      width: $("#" + id).width(),
      height: $("#" + id).height()
    });
    return new KineticContext(stage);
  };

  exports.createContext = createContext;


  /*
    class UserData
    constructor: ->
      @userData = TAFFY({})
  
    blockData: (blockNum=null) ->
      if not blockNum?
        blockNum = @exState.blockNumber
  
      @userData.filter({ blockNumber: blockNum })
   */

  exports.ExperimentContext = ExperimentContext = (function() {
    function ExperimentContext(stimFactory) {
      this.variables = {};
      this.responseQueue = [];
      this.stimFactory = stimFactory;
      this.userData = TAFFY({});
      this.eventData = new EventDataLog();
      this.log = [];
      this.exState = {};
    }

    ExperimentContext.prototype.set = function(name, value) {
      return props.set(this.variables, name, value);
    };

    ExperimentContext.prototype.get = function(name) {
      return props.get(this.variables, name);
    };

    ExperimentContext.prototype.find = function(name) {
      return _.findKey(this.variables, name);
    };

    ExperimentContext.prototype.update = function(name, fun) {
      return this.set(name, fun(this.get(name)));
    };

    ExperimentContext.prototype.updateState = function(fun) {};

    ExperimentContext.prototype.pushData = function(data) {
      var record, trial;
      record = data;
      trial = this.get("State.Trial");
      record.trial = trial;
      record.trialNumber = this.get("State.trialNumber");
      record.blockNumber = this.get("State.blockNumber");
      record.eventNumber = this.get("State.eventNumber");
      return this.userData.insert(record);
    };

    ExperimentContext.prototype.handleResponse = function(arg) {
      if ((arg != null) && arg instanceof ResponseData) {
        this.responseQueue.push(arg);
        return this.pushData(arg.data);
      }
    };

    ExperimentContext.prototype.width = function() {
      return 0;
    };

    ExperimentContext.prototype.height = function() {
      return 0;
    };

    ExperimentContext.prototype.offsetX = function() {
      return 0;
    };

    ExperimentContext.prototype.offsetY = function() {
      return 0;
    };

    ExperimentContext.prototype.centerX = function() {
      return this.width() / 2 + this.offsetX();
    };

    ExperimentContext.prototype.centerY = function() {
      return this.height() / 2 + this.offsetY();
    };

    ExperimentContext.prototype.screenInfo = function() {
      return {
        width: this.width(),
        height: this.height(),
        offset: {
          x: this.offsetX(),
          y: this.offsetY()
        },
        center: {
          x: this.centerX(),
          y: this.centerY()
        }
      };
    };

    ExperimentContext.prototype.logEvent = function(key, value) {};

    ExperimentContext.prototype.trialData = function(trialNumber) {
      var ret;
      if (trialNumber == null) {
        trialNumber = this.get("State.trialNumber");
      }
      ret = this.userData().filter({
        trialNumber: trialNumber
      });
      if (ret.length === 1) {
        return ret[0];
      } else {
        return ret;
      }
    };

    ExperimentContext.prototype.selectBy = function(args) {
      if (args == null) {
        args = {};
      }
      return this.userData().filter(args).get();
    };

    ExperimentContext.prototype.responseSet = function(trialNumber, id) {
      if (trialNumber == null) {
        trialNumber = this.get("State.trialNumber");
      }
      if (id != null) {
        return this.userData().filter({
          trialNumber: trialNumber,
          type: "response",
          id: id
        }).get();
      } else {
        return this.userData().filter({
          trialNumber: trialNumber,
          type: "response"
        }).get();
      }
    };

    ExperimentContext.prototype.blockData = function(args) {
      if (args == null) {
        args = {
          blockNum: null,
          name: null
        };
      }
      if (args.blockNum == null) {
        args.blockNum = this.exState.blockNumber;
      }
      if (!args.name) {
        return this.userData().filter({
          blockNumber: args.blockNum
        });
      } else {
        return this.userData().filter({
          blockNumber: args.blockNum
        }).select(args.name);
      }
    };

    ExperimentContext.prototype.allData = function(args) {
      if (args == null) {
        args = {
          name: null
        };
      }
      if (!args.name) {
        return this.userData();
      } else {
        return this.userData().select(args.name);
      }
    };

    ExperimentContext.prototype.showEvent = function(event) {
      return event.start(this);
    };

    ExperimentContext.prototype.findByID = function(id) {};

    ExperimentContext.prototype.findByName = function(name) {};

    ExperimentContext.prototype.showStimulus = function(stimulus) {
      var p;
      p = stimulus.render(this);
      p.present(this);
      console.log("show Stimulus, drawing");
      return this.draw();
    };

    ExperimentContext.prototype.start = function(blockList) {
      var error, farray;
      try {
        farray = Flow.functionList(Flow.lift(function() {}), Flow.lift(function() {}), blockList, this, function(block) {
          return console.log("block callback", block);
        });
        return Flow.chainFunctions(farray);
      } catch (_error) {
        error = _error;
        return console.log("caught error:", error);
      }
    };

    ExperimentContext.prototype.clearContent = function() {};

    ExperimentContext.prototype.clearBackground = function() {};

    ExperimentContext.prototype.keydownStream = function() {
      return Bacon.fromEventTarget(window, "keydown");
    };

    ExperimentContext.prototype.keypressStream = function() {
      return Bacon.fromEventTarget(window, "keypress");
    };

    ExperimentContext.prototype.mousepressStream = function() {};

    ExperimentContext.prototype.draw = function() {};

    ExperimentContext.prototype.insertHTMLDiv = function() {
      $("canvas").css("position", "absolute");
      $("#container").append("<div id=\"htmlcontainer\" class=\"htmllayer\"></div>");
      $("#htmlcontainer").css({
        position: "absolute",
        "z-index": 999,
        outline: "none",
        padding: "5px"
      });
      $("#container").attr("tabindex", 0);
      return $("#container").css("outline", "none");
    };

    ExperimentContext.prototype.clearHtml = function() {
      $("#htmlcontainer").empty();
      return $("#htmlcontainer").hide();
    };

    ExperimentContext.prototype.appendHtml = function(input) {
      $("#htmlcontainer").addClass("htmllayer");
      $("#htmlcontainer").append(input);
      return $("#htmlcontainer").show();
    };

    ExperimentContext.prototype.hideHtml = function() {
      return $("#htmlcontainer").hide();
    };

    return ExperimentContext;

  })();

  KineticContext = (function(_super) {
    __extends(KineticContext, _super);

    function KineticContext(stage) {
      this.stage = stage;
      KineticContext.__super__.constructor.call(this, new DefaultComponentFactory());
      this.contentLayer = new Kinetic.Layer({
        clearBeforeDraw: true
      });
      this.backgroundLayer = new Kinetic.Layer({
        clearBeforeDraw: true
      });
      this.background = new Background([], {
        fill: "white"
      });
      this.stage.add(this.backgroundLayer);
      this.stage.add(this.contentLayer);
      this.insertHTMLDiv();
    }

    KineticContext.prototype.insertHTMLDiv = function() {
      KineticContext.__super__.insertHTMLDiv.apply(this, arguments);
      return $(".kineticjs-content").css("position", "absolute");
    };

    KineticContext.prototype.setBackground = function(newBackground) {
      var p;
      this.background = newBackground;
      this.backgroundLayer.removeChildren();
      p = this.background.render(this);
      return p.present(this, this.backgroundLayer);
    };

    KineticContext.prototype.drawBackground = function() {
      return this.backgroundLayer.draw();
    };

    KineticContext.prototype.clearBackground = function() {
      return this.backgroundLayer.removeChildren();
    };

    KineticContext.prototype.clearContent = function(draw) {
      if (draw == null) {
        draw = false;
      }
      this.clearHtml();
      this.backgroundLayer.draw();
      this.contentLayer.removeChildren();
      if (draw) {
        return this.draw();
      }
    };

    KineticContext.prototype.draw = function() {
      $('#container').focus();
      return this.contentLayer.draw();
    };

    KineticContext.prototype.width = function() {
      return this.stage.getWidth();
    };

    KineticContext.prototype.height = function() {
      return this.stage.getHeight();
    };

    KineticContext.prototype.offsetX = function() {
      return this.stage.getOffsetX();
    };

    KineticContext.prototype.offsetY = function() {
      return this.stage.getOffsetY();
    };

    KineticContext.prototype.showStimulus = function(stimulus) {
      var p;
      p = stimulus.render(this);
      p.present(this);
      console.log("show Stimulus, drawing");
      return this.draw();
    };

    KineticContext.prototype.findByID = function(id) {
      var i, _i, _len, _results;
      if (_.isArray(id)) {
        _results = [];
        for (_i = 0, _len = id.length; _i < _len; _i++) {
          i = id[_i];
          if (i != null) {
            _results.push(this.stage.find("#" + i));
          }
        }
        return _results;
      } else {
        return this.stage.find("#" + id);
      }
    };

    KineticContext.prototype.keydownStream = function() {
      return Bacon.fromEventTarget(window, "keydown");
    };

    KineticContext.prototype.keypressStream = function() {
      return Bacon.fromEventTarget(window, "keypress");
    };

    KineticContext.prototype.mousepressStream = function() {
      var MouseBus;
      MouseBus = (function() {
        function MouseBus() {
          this.stream = new Bacon.Bus();
          this.handler = (function(_this) {
            return function(x) {
              return _this.stream.push(x);
            };
          })(this);
          this.stage.on("mousedown", this.handler);
        }

        MouseBus.prototype.stop = function() {
          this.stage.off("mousedown", this.handler);
          return this.stream.end();
        };

        return MouseBus;

      })();
      return new MouseBus();
    };

    return KineticContext;

  })(exports.ExperimentContext);

  exports.KineticContext = KineticContext;

  buildTrial = function(eventSpec, record, context, feedback, backgroundSpec) {
    var background, events, key, value;
    events = (function() {
      var _results;
      _results = [];
      for (key in eventSpec) {
        value = eventSpec[key];
        _results.push(context.stimFactory.buildEvent(value));
      }
      return _results;
    })();
    if (backgroundSpec != null) {
      background = context.stimFactory.makeStimulus("Background", backgroundSpec);
      return new Flow.Trial(events, record, feedback, background);
    } else {
      return new Flow.Trial(events, record, feedback);
    }
  };

  makeBlockSeq = function(spec, context) {
    var args, block, record, trialNum, trialSpec, trials;
    console.log("making block seq from", spec);
    return new Flow.BlockSeq((function() {
      var _i, _len, _ref, _results;
      _ref = spec.trialList.blocks;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        block = _ref[_i];
        console.log("building block", block);
        trials = (function() {
          var _j, _ref1, _results1;
          _results1 = [];
          for (trialNum = _j = 0, _ref1 = block.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; trialNum = 0 <= _ref1 ? ++_j : --_j) {
            record = _.clone(block[trialNum]);
            args = {};
            args.trial = record;
            args.screen = context.screenInfo();
            trialSpec = spec.trial.apply(args);
            _results1.push(context.stimFactory.buildTrial(trialSpec, record));
          }
          return _results1;
        })();
        _results.push(new Flow.Block(trials, spec.start, spec.end));
      }
      return _results;
    })());
  };

  exports.Presentation = Presentation = (function() {
    function Presentation(trialList, display, context) {
      var body, es, key, val;
      this.trialList = trialList;
      this.display = display;
      this.context = context;
      this.variables = this.display.Define != null ? this.context.variables = this.display.Define : void 0;
      this.routines = this.display.Routines;
      this.flow = this.display.Flow.length === 0 ? this.display.Flow.apply(this.routines) : this.display.Flow(this.routines);
      this.evseq = (function() {
        var _ref, _results;
        _ref = this.flow;
        _results = [];
        for (key in _ref) {
          val = _ref[key];
          if (_.keys(val)[0] === "BlockSequence") {
            _results.push(makeBlockSeq(val.BlockSequence, this.context));
          } else if (_.isFunction(val)) {
            body = val.apply(this.context);
            _results.push(new Flow.EventSequence(context.stimFactory.buildEventSeq(body), body.Background));
          } else {
            es = context.stimFactory.buildEventSeq(val);
            _results.push(new Flow.EventSequence(es, val.Background));
          }
        }
        return _results;
      }).call(this);
      console.log("@evseq", this.evseq);
    }

    Presentation.prototype.start = function() {
      return new Flow.RunnableNode(this.evseq).start(this.context);
    };

    return Presentation;

  })();

  exports.Presenter = Presenter = (function() {
    function Presenter(trialList, display, context) {
      this.trialList = trialList;
      this.display = display;
      this.context = context;
      this.trialBuilder = this.display.Trial;
      this.prelude = this.display.Prelude != null ? void 0 : void 0;
      this.coda = this.display.Coda != null ? void 0 : void 0;
      this.variables = this.display.Define != null ? this.context.variables = this.display.Define : void 0;
    }

    Presenter.prototype.start = function() {
      var args, block, record, trialNum, trialSpec, trials;
      this.blockList = new BlockSeq((function() {
        var _i, _len, _ref, _results;
        _ref = this.trialList.blocks;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          block = _ref[_i];
          console.log("building block", block);
          trials = (function() {
            var _j, _ref1, _results1;
            _results1 = [];
            for (trialNum = _j = 0, _ref1 = block.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; trialNum = 0 <= _ref1 ? ++_j : --_j) {
              record = _.clone(block[trialNum]);
              args = {};
              args.trial = record;
              args.screen = this.context.screenInfo();
              trialSpec = this.trialBuilder.apply(args);
              _results1.push(buildTrial(trialSpec.Events, record, this.context, trialSpec.Feedback, trialSpec.Background));
            }
            return _results1;
          }).call(this);
          _results.push(new Block(trials, this.display.Block));
        }
        return _results;
      }).call(this));
      return this.prelude.start(this.context).then((function(_this) {
        return function() {
          return _this.blockList.start(_this.context);
        };
      })(this)).then((function(_this) {
        return function() {
          console.log("inside coda");
          return _this.coda.start(_this.context);
        };
      })(this));
    };

    return Presenter;

  })();

  __dummySpec = {
    Events: {
      1: {
        Nothing: "",
        Next: {
          Timeout: {
            duration: 0
          }
        }
      }
    }
  };

  exports.buildTrial = buildTrial;

}).call(this);
