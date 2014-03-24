(function() {
  var Background, Bacon, Block, BlockSeq, Coda, DataTable, DefaultComponentFactory, Event, EventData, EventDataLog, Experiment, ExperimentContext, ExperimentState, FeedbackNode, FunctionNode, Kinetic, KineticContext, MockStimFactory, Prelude, Presenter, Q, Response, ResponseData, RunnableNode, StimFactory, Stimulus, TAFFY, Trial, buildCoda, buildEvent, buildPrelude, buildResponse, buildStimulus, buildTrial, createContext, des, functionNode, makeEventSeq, utils, _, __dummySpec,
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

  Kinetic = require("../jslibs/kinetic").Kinetic;

  Stimulus = require("./stimresp").Stimulus;

  Response = require("./stimresp").Response;

  ResponseData = require("./stimresp").ResponseData;

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

  RunnableNode = (function() {
    RunnableNode.functionList = function(nodes, context, callback) {
      return _.map(nodes, function(node) {
        return function(arg) {
          context.handleValue(arg);
          if (callback != null) {
            callback(node);
          }
          return node.start(context);
        };
      });
    };

    RunnableNode.chainFunctions = function(funArray) {
      var fun, result, _i, _len;
      result = Q.resolve(0);
      for (_i = 0, _len = funArray.length; _i < _len; _i++) {
        fun = funArray[_i];
        result = result.then(fun, function(err) {
          return console.log("error stack: ", err.stack);
        });
      }
      return result;
    };

    function RunnableNode(children) {
      this.children = children;
    }

    RunnableNode.prototype.before = function(context) {
      return new FunctionNode(function() {
        return 0;
      });
    };

    RunnableNode.prototype.after = function(context) {
      return new FunctionNode(function() {
        return 0;
      });
    };

    RunnableNode.prototype.numChildren = function() {
      return this.children.length;
    };

    RunnableNode.prototype.length = function() {
      return this.children.length;
    };

    RunnableNode.prototype.start = function(context) {
      var farray;
      farray = RunnableNode.functionList(_.flatten([this.before(context), this.children, this.after(context)]), context, function(node) {
        return console.log("node done", node);
      });
      return RunnableNode.chainFunctions(farray);
    };

    RunnableNode.prototype.stop = function(context) {};

    return RunnableNode;

  })();

  exports.RunnableNode = RunnableNode;

  exports.FunctionNode = FunctionNode = (function(_super) {
    __extends(FunctionNode, _super);

    function FunctionNode(fun) {
      this.fun = fun;
    }

    FunctionNode.prototype.start = function(context) {
      return Q.fcall(this.fun);
    };

    return FunctionNode;

  })(RunnableNode);

  functionNode = function(fun) {
    return new FunctionNode(fun);
  };

  exports.FeedbackNode = FeedbackNode = (function(_super) {
    __extends(FeedbackNode, _super);

    function FeedbackNode(feedback) {
      this.feedback = feedback;
    }

    FeedbackNode.prototype.numChildren = function() {
      return 1;
    };

    FeedbackNode.prototype.length = function() {
      return 1;
    };

    FeedbackNode.prototype.start = function(context) {
      var args, event, idSet, obj, spec, _i, _len;
      if (this.feedback != null) {
        args = context.trialData().get();
        idSet = {};
        for (_i = 0, _len = args.length; _i < _len; _i++) {
          obj = args[_i];
          if (obj["id"] != null) {
            idSet[obj["id"]] = obj;
          }
        }
        args = _.extend(args, idSet);
        spec = this.feedback.apply(args);
        event = context.stimFactory.buildEvent(spec, context);
        return event.start(context);
      } else {
        return Q(0);
      }
    };

    return FeedbackNode;

  })(RunnableNode);

  exports.Event = Event = (function(_super) {
    __extends(Event, _super);

    function Event(stimulus, response) {
      var node;
      this.stimulus = stimulus;
      this.response = response;
      node = {
        start: (function(_this) {
          return function(context) {
            return _this.response.start(context, stimulus);
          };
        })(this)
      };
      Event.__super__.constructor.call(this, [node]);
    }

    Event.prototype.stop = function(context) {
      this.stimulus.stop(context);
      return this.response.stop(context);
    };

    Event.prototype.before = function(context) {
      var self;
      self = this;
      return functionNode((function(_this) {
        return function() {
          if (!context.exState.inPrelude) {
            context.updateState(function() {
              return context.exState.nextEvent(self);
            });
          }
          if (!_this.stimulus.overlay) {
            context.clearContent();
          }
          _this.stimulus.render(context).present(context);
          return context.draw();
        };
      })(this));
    };

    Event.prototype.after = function(context) {
      return functionNode((function(_this) {
        return function() {
          return _this.stimulus.stop(context);
        };
      })(this));
    };

    return Event;

  })(RunnableNode);

  exports.Trial = Trial = (function(_super) {
    __extends(Trial, _super);

    function Trial(events, record, feedback, background) {
      if (events == null) {
        events = [];
      }
      this.record = record != null ? record : {};
      this.feedback = feedback;
      this.background = background;
      Trial.__super__.constructor.call(this, events);
    }

    Trial.prototype.numEvents = function() {
      return this.children.length;
    };

    Trial.prototype.push = function(event) {
      return this.children.push(event);
    };

    Trial.prototype.before = function(context) {
      var self;
      self = this;
      return functionNode(((function(_this) {
        return function() {
          context.updateState(function() {
            return context.exState.nextTrial(self);
          });
          context.clearBackground();
          if (_this.background != null) {
            console.log("drawing background");
            context.setBackground(_this.background);
            return context.drawBackground();
          }
        };
      })(this)));
    };

    Trial.prototype.after = function(context) {
      return new FeedbackNode(this.feedback);
    };

    Trial.prototype.start = function(context, callback) {
      var farray;
      farray = RunnableNode.functionList(_.flatten([this.before(context), this.children, this.after(context)]), context, function(event) {
        return console.log("event callback", event);
      });
      return RunnableNode.chainFunctions(farray);
    };

    Trial.prototype.stop = function(context) {};

    return Trial;

  })(RunnableNode);

  exports.Block = Block = (function(_super) {
    __extends(Block, _super);

    function Block(children, blockSpec) {
      this.blockSpec = blockSpec;
      Block.__super__.constructor.call(this, children);
    }

    Block.prototype.showEvent = function(spec, context) {
      var event;
      event = buildEvent(spec, context);
      return event.start(context);
    };

    Block.prototype.before = function(context) {
      var self;
      self = this;
      return functionNode((function(_this) {
        return function() {
          var args, spec;
          context.updateState(function() {
            return context.exState.nextBlock(self);
          });
          if ((_this.blockSpec != null) && _this.blockSpec.Start) {
            args = _.extend(context.exState.toRecord(), {
              context: context
            });
            spec = _this.blockSpec.Start.apply(args);
            return _this.showEvent(spec, context);
          } else {
            return Q.fcall(0);
          }
        };
      })(this));
    };

    Block.prototype.after = function(context) {
      return functionNode(((function(_this) {
        return function() {
          var args, blockData, curid, ids, out, spec, _i, _len;
          if ((_this.blockSpec != null) && _this.blockSpec.End) {
            blockData = context.blockData();
            ids = _.unique(blockData.select("id"));
            console.log("END ids", ids);
            out = {};
            for (_i = 0, _len = ids.length; _i < _len; _i++) {
              curid = ids[_i];
              out[curid] = DataTable.fromRecords(blockData.filter({
                id: curid
              }).get());
            }
            args = _.extend(context.exState.toRecord(), {
              context: context
            }, out);
            console.log("block end args");
            spec = _this.blockSpec.End.apply(args);
            return _this.showEvent(spec, context);
          } else {
            return Q.fcall(0);
          }
        };
      })(this)));
    };

    return Block;

  })(RunnableNode);

  exports.BlockSeq = BlockSeq = (function(_super) {
    __extends(BlockSeq, _super);

    function BlockSeq(children) {
      BlockSeq.__super__.constructor.call(this, children);
    }

    return BlockSeq;

  })(RunnableNode);

  exports.Prelude = Prelude = (function(_super) {
    __extends(Prelude, _super);

    function Prelude(children) {
      Prelude.__super__.constructor.call(this, children);
    }

    Prelude.prototype.before = function(context) {
      return functionNode(((function(_this) {
        return function() {
          return context.updateState(function() {
            return context.exState.insidePrelude();
          });
        };
      })(this)));
    };

    Prelude.prototype.after = function(context) {
      return functionNode(((function(_this) {
        return function() {
          return context.updateState(function() {
            return context.exState.outsidePrelude();
          });
        };
      })(this)));
    };

    return Prelude;

  })(RunnableNode);

  exports.Coda = Coda = (function(_super) {
    __extends(Coda, _super);

    function Coda(children) {
      Coda.__super__.constructor.call(this, children);
    }

    return Coda;

  })(RunnableNode);

  exports.ExperimentState = ExperimentState = (function() {
    function ExperimentState() {
      this.inPrelude = false;
      this.trial = {};
      this.block = {};
      this.event = {};
      this.blockNumber = 0;
      this.trialNumber = 0;
      this.eventNumber = 0;
      this.stimulus = {};
      this.response = {};
    }

    ExperimentState.prototype.insidePrelude = function() {
      var ret;
      ret = $.extend({}, this);
      ret.inPrelude = true;
      return ret;
    };

    ExperimentState.prototype.outsidePrelude = function() {
      var ret;
      ret = $.extend({}, this);
      ret.inPrelude = false;
      return ret;
    };

    ExperimentState.prototype.nextBlock = function(block) {
      var ret;
      ret = $.extend({}, this);
      ret.blockNumber = this.blockNumber + 1;
      ret.block = block;
      return ret;
    };

    ExperimentState.prototype.nextTrial = function(trial) {
      var ret;
      ret = $.extend({}, this);
      ret.trial = trial;
      ret.trialNumber = this.trialNumber + 1;
      return ret;
    };

    ExperimentState.prototype.nextEvent = function(event) {
      var ret;
      ret = $.extend({}, this);
      ret.event = event;
      ret.eventNumber = this.eventNumber + 1;
      return ret;
    };

    ExperimentState.prototype.toRecord = function() {
      var key, ret, value, _ref, _ref1, _ref10, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      ret = {
        blockNumber: this.blockNumber,
        trialNumber: this.trialNumber,
        eventNumber: this.eventNumber,
        stimulus: (_ref = this.event) != null ? (_ref1 = _ref.stimulus) != null ? (_ref2 = _ref1.constructor) != null ? _ref2.name : void 0 : void 0 : void 0,
        response: (_ref3 = this.event) != null ? (_ref4 = _ref3.response) != null ? (_ref5 = _ref4.constructor) != null ? _ref5.name : void 0 : void 0 : void 0,
        stimulusID: (_ref6 = this.event) != null ? (_ref7 = _ref6.stimulus) != null ? _ref7.id : void 0 : void 0,
        responseID: (_ref8 = this.event) != null ? (_ref9 = _ref8.response) != null ? _ref9.id : void 0 : void 0
      };
      if (!_.isEmpty(this.trial) && (this.trial.record != null)) {
        _ref10 = this.trial.record;
        for (key in _ref10) {
          value = _ref10[key];
          ret[key] = value;
        }
      }
      return ret;
    };

    return ExperimentState;

  })();

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
      this.stimFactory = stimFactory;
      this.userData = TAFFY({});
      this.exState = new ExperimentState();
      this.eventData = new EventDataLog();
      this.log = [];
      this.trialNumber = 0;
      this.currentTrial = new Trial([], {});
      this.numBlocks = 0;
    }

    ExperimentContext.prototype.updateState = function(fun) {
      this.exState = fun(this.exState);
      return this.exState;
    };

    ExperimentContext.prototype.pushData = function(data, withState) {
      var record;
      if (withState == null) {
        withState = true;
      }
      console.log("pushing data", data);
      if (withState) {
        record = _.extend(this.exState.toRecord(), data);
      } else {
        record = data;
      }
      return this.userData.insert(record);
    };

    ExperimentContext.prototype.handleValue = function(arg) {
      if ((arg != null) && arg instanceof ResponseData) {
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

    ExperimentContext.prototype.logEvent = function(key, value) {
      var record;
      record = _.clone(this.currentTrial.record);
      record[key] = value;
      this.log.push(record);
      return console.log(this.log);
    };

    ExperimentContext.prototype.trialData = function() {
      var ret;
      ret = this.userData().filter({
        trialNumber: this.exState.trialNumber
      });
      if (ret.length === 1) {
        return ret[0];
      } else {
        return ret;
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

    ExperimentContext.prototype.showStimulus = function(stimulus) {
      var p;
      p = stimulus.render(this);
      p.present(this);
      console.log("show Stimulus, drawing");
      return this.draw();
    };

    ExperimentContext.prototype.start = function(blockList) {
      var error, farray;
      this.numBlocks = blockList.length();
      try {
        farray = RunnableNode.functionList(blockList, this, function(block) {
          return console.log("block callback", block);
        });
        return RunnableNode.chainFunctions(farray);
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

  buildStimulus = function(spec, context) {
    var params, stimType;
    stimType = _.keys(spec)[0];
    params = _.values(spec)[0];
    console.log("stimType", stimType);
    console.log("params", params);
    return context.stimFactory.makeStimulus(stimType, params, context);
  };

  buildResponse = function(spec, context) {
    var params, responseType;
    responseType = _.keys(spec)[0];
    params = _.values(spec)[0];
    return context.stimFactory.makeResponse(responseType, params, context);
  };

  buildEvent = function(spec, context) {
    var response, responseSpec, stim, stimSpec;
    stimSpec = _.omit(spec, "Next");
    responseSpec = _.pick(spec, "Next");
    if ((responseSpec == null) || _.isEmpty(responseSpec)) {
      stim = buildStimulus(stimSpec, context);
      if (!stim instanceof Response) {
        throw new Error("buildEvent: Missing Response from event: ", spec);
      }
      return context.stimFactory.makeEvent(stim, stim, context);
    } else {
      stim = buildStimulus(stimSpec, context);
      response = buildResponse(responseSpec.Next, context);
      return context.stimFactory.makeEvent(stim, response, context);
    }
  };

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
      return new Trial(events, record, feedback, background);
    } else {
      return new Trial(events, record, feedback);
    }
  };

  makeEventSeq = function(spec, context) {
    var key, response, responseSpec, stim, stimSpec, value, _results;
    _results = [];
    for (key in spec) {
      value = spec[key];
      stimSpec = _.omit(value, "Next");
      responseSpec = _.pick(value, "Next");
      console.log("building stim", stimSpec);
      stim = buildStimulus(stimSpec, context);
      response = buildResponse(responseSpec.Next, context);
      _results.push(context.stimFactory.makeEvent(stim, response, context));
    }
    return _results;
  };

  buildPrelude = function(preludeSpec, context) {
    var events;
    events = makeEventSeq(preludeSpec, context);
    return new Prelude(events);
  };

  buildCoda = function(codaSpec, context) {
    var events;
    events = makeEventSeq(codaSpec, context);
    return new Coda(events);
  };

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

  exports.Presenter = Presenter = (function() {
    function Presenter(trialList, display, context) {
      this.trialList = trialList;
      this.display = display;
      this.context = context;
      this.trialBuilder = this.display.Trial;
      this.prelude = this.display.Prelude != null ? buildPrelude(this.display.Prelude.Events, this.context) : buildPrelude(__dummySpec.Events, this.context);
      this.coda = this.display.Coda != null ? buildCoda(this.display.Coda.Events, this.context) : (console.log("building dummy coda"), buildCoda(__dummySpec.Events, this.context));
    }

    Presenter.prototype.start = function() {
      var args, block, record, trialNum, trialSpec, trials;
      this.blockList = new BlockSeq((function() {
        var _i, _len, _ref, _results;
        _ref = this.trialList.blocks;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          block = _ref[_i];
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

  exports.Experiment = Experiment = (function() {
    function Experiment(designSpec, stimFactory) {
      this.designSpec = designSpec;
      this.stimFactory = stimFactory != null ? stimFactory : new MockStimFactory();
      this.design = new ExpDesign(this.designSpec);
      this.display = this.designSpec.Display;
      this.trialGenerator = this.display.Trial;
    }

    Experiment.prototype.buildStimulus = function(event, context) {
      var params, stimType;
      stimType = _.keys(event)[0];
      params = _.values(event)[0];
      return this.stimFactory.makeStimulus(stimType, params, context);
    };

    Experiment.prototype.buildEvent = function(event, context) {
      var params, responseType;
      responseType = _.keys(event)[0];
      params = _.values(event)[0];
      return this.stimFactory.makeResponse(responseType, params, context);
    };

    Experiment.prototype.buildTrial = function(eventSpec, record, context) {
      var events, key, response, responseSpec, stim, stimSpec, value;
      events = (function() {
        var _results;
        _results = [];
        for (key in eventSpec) {
          value = eventSpec[key];
          stimSpec = _.omit(value, "Next");
          responseSpec = _.pick(value, "Next");
          stim = this.buildStimulus(stimSpec);
          response = this.buildResponse(responseSpec.Next);
          _results.push(this.stimFactory.makeEvent(stim, response));
        }
        return _results;
      }).call(this);
      return new Trial(events, record);
    };

    Experiment.prototype.start = function(context) {
      var i, record, trialList, trialSpec, trials;
      trials = this.design.fullDesign;
      console.log(trials.nrow());
      trialList = (function() {
        var _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = trials.nrow(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          record = trials.record(i);
          record.$trialNumber = i;
          trialSpec = this.trialGenerator(record);
          _results.push(this.buildTrial(trialSpec, record, context));
        }
        return _results;
      }).call(this);
      return context.start(trialList);
    };

    return Experiment;

  })();

  exports.letters = ['a', 'b', 'c', 'd', 'e', 'd', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  des = {
    Design: {
      Blocks: [
        [
          {
            a: 1,
            b: 2,
            c: 3,
            a: 2,
            b: 3,
            c: 4
          }
        ], [
          {
            a: 5,
            b: 7,
            c: 6,
            a: 5,
            b: 7,
            c: 6
          }
        ]
      ]
    }
  };

  console.log(des.Blocks);

  exports.buildStimulus = buildStimulus;

  exports.buildResponse = buildResponse;

  exports.buildEvent = buildEvent;

  exports.buildTrial = buildTrial;

  exports.buildPrelude = buildPrelude;

}).call(this);
