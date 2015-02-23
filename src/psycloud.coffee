_ = require('lodash')
Q = require("q")
TAFFY = require("taffydb").taffy
utils = require("./utils")
DataTable = require("./datatable").DataTable
Bacon = require("baconjs")
DefaultComponentFactory = require("./factory").DefaultComponentFactory
Background = require("./components/canvas/background").Background
#Kinetic = require("../jslibs/kinetic").Kinetic
Stimulus = require("./stimresp").Stimulus
Response = require("./stimresp").Response
ResponseData = require("./stimresp").ResponseData
props = require("pathval")

Flow = require("./flow")
RunnableNode = Flow.RunnableNode


STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/g

getParamNames = (func) ->
  fnStr = func.toString().replace(STRIP_COMMENTS, "")
  result = fnStr.slice(fnStr.indexOf("(") + 1, fnStr.indexOf(")")).match(/([^\s,]+)/g)
  result = []  if result is null
  result




class Input

  @EOF: new Input()
  @EMPTY: new Input()

class Iteratee

class Done extends Iteratee
  constructor: (@a, @remaining) ->

class Error extends Iteratee
  constructor: (@msg, @input)  ->

class Cont extends Iteratee
  # cont = input -> iteratee
  constructor: (@cont) ->





exports.EventData =
class EventData
  constructor: (@name, @id, @data) ->

exports.EventDataLog =
class EventDataLog
  constructor: ->
    @eventStack = []

  push: (ev) ->
    @eventStack.push(ev)

  last: ->
    if @eventStack.length < 1
      throw "EventLog is Empty, canot access last element"
    @eventStack[@eventStack.length-1].data

  findAll: (id) ->
    _.filter(@eventStack, (ev) -> ev.id == id)


  findLast: (id) ->
    len = @eventStack.length - 1
    for i in [len .. 0]
      return @eventStack[i] if @eventStack[i].id is id



exports.StimFactory =
  class StimFactory

    buildStimulus: (spec, context) ->
      stimType = _.keys(spec)[0]
      params = _.values(spec)[0]
      @makeStimulus(stimType, params, context)

    buildResponse: (spec, context) ->
      responseType = _.keys(spec)[0]
      params = _.values(spec)[0]
      @makeResponse(responseType, params, context)

    buildEvent: (spec, context) ->
      if not spec.Next?
        throw new Error("Event specification does not contain 'Next' element")

      stimSpec = _.omit(spec, "Next")
      responseSpec = _.pick(spec, "Next")

      stim = @buildStimulus(stimSpec, context)
      response = @buildResponse(responseSpec.Next, context)
      @makeEvent(stim, response, context)

    makeStimulus: (name, params,context) -> throw new Error("unimplemented")

    makeResponse: (name, params, context) -> throw new Error("unimplemented")

    makeEvent: (stim, response, context) -> throw new Error("unimplemented")


exports.MockStimFactory =
  class MockStimFactory extends exports.StimFactory
    makeStimulus: (name, params, context) ->
      ret = {}
      ret[name] = params
      ret

    makeResponse: (name, params, context) ->
      ret = {}
      ret[name] = params
      ret

    makeEvent: (stim, response, context) ->
      [stim, response]




class TrialEnumerator


  next: (context) ->


class StaticTrialEnumerator extends TrialEnumerator

  constructor: (@trialList) ->
    @index = 0

  next: (context) ->
    len = @trialList.length
    if @index < @len
      @trialList[@index]
      @index = @index + 1

    else throw new Error("TrialEnumerator: illegal index: #{index} for list of trial of length #{len}")

  hasNext: -> @index < @trialList.length


class DynamicTrialEnumerator extends TrialEnumerator
  constructor: (@generator, @maxTrials=10000) ->
    @index = 0

  next: (context) ->
    @index = @index + 1
    if (@index < @maxTrials)
      @generator(context)

  hasNext: -> @index < @maxTrials


createContext = (id="container") ->
  stage = new Kinetic.Stage(
    container: id
    width: $("#" + id).width()
    height: $("#" + id).height()
  )

  new KineticContext(stage)

exports.createContext = createContext


###
  class UserData
  constructor: ->
    @userData = TAFFY({})

  blockData: (blockNum=null) ->
    if not blockNum?
      blockNum = @exState.blockNumber

    @userData.filter({ blockNumber: blockNum })
###


#exports.UserData = UserData

exports.ExperimentContext =
  class ExperimentContext
    constructor: (stimFactory) ->

      @variables = {}

      @responseQueue = []

      @stimFactory = stimFactory

      @userData = TAFFY({})

      @eventData = new EventDataLog()

      @log = []

      @exState = {}


    set: (name, value) -> props.set(@variables, name, value)

    get: (name) -> props.get(@variables, name)

    find: (name) -> _.findKey(@variables, name);

    update: (name, fun) -> @set(name, fun(@get(name)))

    updateState: (fun) ->


    pushData: (data) ->
      record = data
      trial = @get("State.Trial")

      record.trial = trial
      record.trialNumber = @get("State.trialNumber")
      record.blockNumber = @get("State.blockNumber")
      record.eventNumber = @get("State.eventNumber")

      @userData.insert(record)

    handleResponse: (arg) ->
      if arg? and arg instanceof ResponseData
        @responseQueue.push(arg)
        @pushData(arg.data)

    width: -> 0

    height: -> 0

    offsetX: -> 0

    offsetY: -> 0

    centerX: -> @width()/2 + @offsetX()

    centerY: -> @height()/2 + @offsetY()

    screenInfo: ->
      {
        width: @width()
        height: @height()

        offset:
          x: @offsetX()
          y: @offsetY()

        center:
          x: @centerX()
          y: @centerY()
      }


    logEvent: (key, value) ->


    trialData: (trialNumber=@get("State.trialNumber")) ->
      ret = @userData().filter({ trialNumber: trialNumber })
      if ret.length == 1
        ret[0]
      else ret


    selectBy: (args={}) ->
      @userData().filter(args).get()

    responseSet: (trialNumber=@get("State.trialNumber"), id) ->
      if id?
        @userData().filter({ trialNumber: trialNumber, type: "response", id: id }).get()
      else
        @userData().filter({ trialNumber: trialNumber, type: "response" }).get()


    blockData: (args={blockNum: null, name: null}) ->
      if not args.blockNum?
        args.blockNum = @exState.blockNumber

      if not args.name
        @userData().filter({ blockNumber: args.blockNum })
      else
        @userData().filter({ blockNumber: args.blockNum }).select(args.name)

    allData: (args= {name: null}) ->
      if not args.name
        @userData()
      else
        @userData().select(args.name)


    showEvent: (event) -> event.start(this)

    findByID: (id) ->

    findByName: (name) ->

    showStimulus: (stimulus) ->
      p = stimulus.render(this)
      p.present(this)
      console.log("show Stimulus, drawing")
      @draw()

    start: (blockList) ->


      try
        farray = Flow.functionList(Flow.lift(->), Flow.lift(->), blockList, this,
          (block) ->
            console.log("block callback", block)
        )

        Flow.chainFunctions(farray)

      catch error
        console.log("caught error:", error)

      #result.done()


    clearContent: ->

    clearBackground: ->

    keydownStream: -> Bacon.fromEventTarget(window, "keydown")

    keypressStream: -> Bacon.fromEventTarget(window, "keypress")

    mousepressStream: ->

    draw: ->

    document: -> $("#htmlcontainer")

    insertHTMLDiv: ->
      $("canvas").css("position", "absolute")
      #$(".kineticjs-content").css("position", "absolute")


      $("#container" ).append("""
        <div id="htmlcontainer" class="htmllayer"></div>
      """)

      $("#htmlcontainer").css(
        position: "absolute"
        "z-index": 999
        outline: "none"
        padding: "5px"
      )

      $("#container").attr("tabindex", 0)
      $("#container").css("outline", "none")
      #$("#container").css("padding", "5px")


    clearHtml: ->
      $("#htmlcontainer").empty()
      $("#htmlcontainer").hide()

    appendHtml: (input) ->
      $("#htmlcontainer").addClass("htmllayer")
      $("#htmlcontainer").append(input)
      $("#htmlcontainer").show()

    hideHtml: ->
      $("#htmlcontainer").hide()
      #$("#htmlcontainer").empty()



class KineticContext extends exports.ExperimentContext

  constructor: (@stage) ->
    super(new DefaultComponentFactory())
    @contentLayer = new Kinetic.Layer({clearBeforeDraw: true})
    @backgroundLayer = new Kinetic.Layer({clearBeforeDraw: true})
    @background = new Background([], fill: "white")

    @stage.add(@backgroundLayer)
    @stage.add(@contentLayer)

    @insertHTMLDiv()

  insertHTMLDiv: ->
    super
    $(".kineticjs-content").css("position", "absolute")


  setBackground: (newBackground) ->
    @background = newBackground
    @backgroundLayer.removeChildren()
    p = @background.render(this)
    p.present(this, @backgroundLayer)
    #@drawBackground()

  drawBackground: ->
    @backgroundLayer.draw()

  clearBackground: ->
    @backgroundLayer.removeChildren()

  clearContent: (draw = false) ->
    #@hideHtml()
    @clearHtml()
    @backgroundLayer.draw()
    @contentLayer.removeChildren()
    if draw
      @draw()


  draw: ->
    $('#container').focus()
    #@backgroundLayer.draw()
    @contentLayer.draw()
    #@stage.draw()


  width: ->
    @stage.getWidth()

  height: ->
    @stage.getHeight()

  offsetX: ->
    @stage.getOffsetX()

  offsetY: ->
    @stage.getOffsetY()

  showStimulus: (stimulus) ->
    p = stimulus.render(this)
    p.present(this)
    console.log("show Stimulus, drawing")
    @draw()

  findByID: (id) ->
    if _.isArray(id)
      @stage.find("#" + i) for i in id when i?
    else
      @stage.find("#" + id)


  keydownStream: -> Bacon.fromEventTarget(window, "keydown")

  keypressStream: ->
     #$("body").asEventStream("keypress")
    Bacon.fromEventTarget(window, "keypress")

  mousepressStream: ->
    class MouseBus
      constructor: () ->
        @stream = new Bacon.Bus()

        @handler = (x) =>
          @stream.push(x)

        @stage.on("mousedown", @handler)

      stop: ->
        @stage.off("mousedown", @handler)
        @stream.end()


    new MouseBus()

exports.KineticContext = KineticContext



buildTrial = (eventSpec, record, context, feedback, backgroundSpec) ->
  events = for key, value of eventSpec
    context.stimFactory.buildEvent(value)
  if backgroundSpec?
    background = context.stimFactory.makeStimulus("Background", backgroundSpec)
    new Flow.Trial(events, record, feedback, background)
  else
    new Flow.Trial(events, record, feedback)




makeBlockSeq = (spec, context) ->
  console.log("making block seq from", spec)
  new Flow.BlockSeq(for block in spec.trialList.blocks
      console.log("building block", block)
      trials = for trialNum in [0...block.length]
        record = _.clone(block[trialNum])
        args = {}
        args.trial = record
        args.screen = context.screenInfo()
        args.context = context
        trialSpec = spec.trial.apply(args)
        context.stimFactory.buildTrial(trialSpec, record)
      new Flow.Block(trials, spec.start, spec.end)
  )


exports.Presentation =
class Presentation
  constructor: (@trialList, @display, @context) ->
    @variables = if @display.Define?
      @context.variables = @display.Define

    @routines = @display.Routines

    @flow = if @display.Flow.length is 0
      ## Flow takes no arguments, @routines is supplied implicitly
      @display.Flow.apply(@routines)
    else
      @display.Flow(@routines)

    @evseq = for key, val of @flow

      if _.keys(val)[0] is "BlockSequence"
        makeBlockSeq(val.BlockSequence, @context)
      else if _.isFunction(val)
        body = val.apply(@context)
        new Flow.EventSequence(context.stimFactory.buildEventSeq(body),  body.Background)
      else
        es = context.stimFactory.buildEventSeq(val)
        new Flow.EventSequence(es, val.Background)

    console.log("@evseq", @evseq)


  start: -> new Flow.RunnableNode(@evseq).start(@context)




exports.Presenter =
class Presenter
  constructor: (@trialList, @display, @context) ->
    @trialBuilder = @display.Trial

    @prelude = if @display.Prelude?
      #buildPrelude(@display.Prelude.Events, @context)
    else
      #buildPrelude(__dummySpec.Events, @context)

    @coda = if @display.Coda?
      #buildCoda(@display.Coda.Events, @context)
    else
      #buildCoda(__dummySpec.Events, @context)

    @variables = if @display.Define?
      @context.variables = @display.Define


  start: () ->
    @blockList = new BlockSeq(for block in @trialList.blocks
      console.log("building block", block)
      trials = for trialNum in [0...block.length]
        record = _.clone(block[trialNum])
        args = {}
        args.trial = record
        args.screen = @context.screenInfo()
        trialSpec = @trialBuilder.apply(args)
        buildTrial(trialSpec.Events, record, @context, trialSpec.Feedback, trialSpec.Background)
      new Block(trials, @display.Block)
    )

    ## compose a "node sequence".
    @prelude.start(@context).then(=> @blockList.start(@context)).then( => console.log("inside coda"); @coda.start(@context))








#des = Design:
#  Blocks: [
#      [
#        a:1, b:2, c:3
#        a:2, b:3, c:4
#      ],
#      [
#        a:5, b:7, c:6
#        a:5, b:7, c:6
#      ]
#
#  ]

#console.log(des.Blocks)

__dummySpec =
  Events:
    1:
      Nothing: ""
      Next:
        Timeout:
          duration: 0


exports.buildTrial = buildTrial





