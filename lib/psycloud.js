(function() {
  var Background, Bacon, Block, BlockSeq, Coda, DataTable, DefaultComponentFactory, Event, EventData, EventDataLog, ExperimentContext, ExperimentState, FeedbackNode, FunctionNode, KineticContext, MockStimFactory, Prelude, Presenter, Q, Response, ResponseData, RunnableNode, STRIP_COMMENTS, StimFactory, Stimulus, TAFFY, Trial, buildCoda, buildPrelude, buildTrial, createContext, functionNode, getParamNames, makeEventSeq, props, utils, _, __dummySpec,
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
          context.handleResponse(arg);
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
        args.context = context;
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
            _this.stimulus.start(context);
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
            return context.clearContent();
          }
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
      var child, self, _i, _len, _ref;
      self = this;
      _ref = this.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        console.log("initializing stimulus", child.stimulus);
        child.stimulus.initialize();
      }
      return functionNode(((function(_this) {
        return function() {
          context.updateState(function() {
            return context.exState.nextTrial(self);
          });
          context.clearBackground();
          if (_this.background != null) {
            console.log("drawing background");
            console.log("background is", _this.background);
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
      event = context.stimFactory.buildEvent(spec, context);
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
      this.variables = {};
      this.responseQueue = [];
      this.stimFactory = stimFactory;
      this.userData = TAFFY({});
      this.exState = new ExperimentState();
      this.eventData = new EventDataLog();
      this.log = [];
      this.trialNumber = 0;
      this.currentTrial = new Trial([], {});
      this.numBlocks = 0;
    }

    ExperimentContext.prototype.set = function(name, value) {
      return props.set(this.variables, name, value);
    };

    ExperimentContext.prototype.get = function(name) {
      return props.get(this.variables, name);
    };

    ExperimentContext.prototype.update = function(name, fun) {
      return this.set(name, fun(this.get(name)));
    };

    ExperimentContext.prototype.updateState = function(fun) {
      this.exState = fun(this.exState);
      return this.exState;
    };

    ExperimentContext.prototype.pushData = function(data, withState) {
      var record;
      if (withState == null) {
        withState = true;
      }
      if (withState) {
        record = _.extend(this.exState.toRecord(), data);
      } else {
        record = data;
      }
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
        console.log("building event", key, ", ", value);
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
    var key, value, _results;
    _results = [];
    for (key in spec) {
      value = spec[key];
      _results.push(context.stimFactory.buildEvent(value));
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
      this.coda = this.display.Coda != null ? buildCoda(this.display.Coda.Events, this.context) : buildCoda(__dummySpec.Events, this.context);
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

  exports.letters = ['a', 'b', 'c', 'd', 'e', 'd', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  exports.buildTrial = buildTrial;

  exports.buildPrelude = buildPrelude;

}).call(this);
