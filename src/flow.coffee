DataTable = require("./datatable").DataTable
_ = require('lodash')
Q = require("q")

class Flow


  @lift: (fun) -> new QNode(fun)

  @sandwich: (context, before, children, after, callback) ->

    farray = @functionList(before(context), after(context), children, context, callback)
    @chainFunctions(farray)

  @functionList: (before, after, nodes, context, callback) ->
    ## for every runnable node, create a function that returns a promise via 'node.start'
    cnodes = _.map(nodes, (node) => ( (arg) ->
      context.handleResponse(arg)
      callback(node, context) if callback?
      ## context.setActiveNode(node)
      ## or perhaps node.start emits a signal
      node.start(context)
    ))


    cnodes.unshift((arg)  =>
      context.handleResponse(arg)
      before.start(context)
    )
    cnodes.push((arg)  =>
      context.handleResponse(arg)
      after.start(context)
    )

    cnodes


  @chainFunctions: (funArray) ->
    ## start with a dummy promise
    result = Q.resolve(0)

    ## sequentially chain the promise-producing functions in an array 'funArray'
    ## 'result' is the promise chain.
    for fun in funArray
      result = result.then(fun,
        (err) ->
          console.log("error stack: ", err.stack))
    #throw new Error("Error during execution: ", err)

    result



class RunnableNode

  constructor: (@children) ->
    @state = {}
    @name = @constructor.name

    ## ?
    ## https://github.com/jashkenas/coffeescript/issues/714
    # classRef = if command.constructor.name? then command.constructor.name else command.constructor.toString().match(/^function\s(.+)\(/)[1]

  before: (context) -> Flow.lift(-> 0)

  after: (context) ->  Flow.lift(-> 0)

  updateState: (node, context, namespace="") ->

    ## TODO this should be targeted to the elements that actually need updating
    for key, val of @state
      context.set("State." + namespace + "." + key, val)

  callback: (node, context) =>
    @updateState(node, context)

  numChildren: -> @children.length

  length: -> @children.length

  start: (context) ->
    Flow.sandwich(context, @before, @children, @after, @callback)

  stop: (context) ->


class QNode extends RunnableNode

  constructor: (@fun) ->

  start: (context) => Q.fcall(@fun, context)


class DeferredNode extends RunnableNode

  constructor: (@fun) ->
    super([@fun])

  start: (context) => @fun(context)


class FeedbackNode extends RunnableNode

  constructor: (@feedback) ->

  numChildren: -> 1

  length: -> 1

  start: (context) ->
    if @feedback?
      response = context.responseSet()

      args = { context: context, response: response, screen: context.screenInfo() }

      spec = @feedback.apply(args)

      if spec?
        evseq = new EventSequence(context.stimFactory.buildEventSeq(spec, context))
        evseq.start(context)
      else
        console.warn("feedback node is undefined")
        Flow.lift(=> 0)

    else
      Flow.lift(=> 0)

class EventSequence extends RunnableNode
  constructor: (events = [], @background) ->
    super(events)
    @state.eventNumber = 0

  numEvents: -> @children.length

  push: (event) -> @children.push(event)

  updateState: (node, context) ->
    @state.eventNumber += 1
    super(node, context)

  before: (context) =>
    for child in @children
      console.log("initializing stimulus", child.stimulus)
      # TODO initialize should be removed from constructor call then
      child.stimulus.initialize()

    Flow.lift ( =>
      context.clearBackground()

      if @background?
        context.setBackground(@background)
        context.drawBackground()
    )


class Trial extends EventSequence
    constructor: (events = [], @record={}, @feedback, background) ->
      super(events, background)
      @state.Trial = record
      #for key, val of @record
      #  @state[key] = val


    updateState: (node, context) ->
      @state.eventNumber += 1

      super(node, context)

    before: (context) =>
      self = this

      for child in @children
        # TODO initialize should be removed from constructor call then
        child.stimulus.initialize()


      Flow.lift ( =>
        context.clearBackground()

        if @background?
          context.setBackground(@background)
          context.drawBackground()
      )

    after: (context) =>
      new FeedbackNode(@feedback)



class Event extends RunnableNode

  constructor: (@stimulus, @response) ->

    node = new QNode((context) =>
        @stimulus.start(context)
        @response.start(context, @stimulus)
    )


    super([node])
    @state.stimulusType = @stimulus.name
    @state.responseType = @response.name

  stop: (context) ->
    @stimulus.stop(context)
    @response.stop(context)

  before: (context) =>
    Flow.lift(=>
      if not @stimulus.overlay
        context.clearContent()

      #@stimulus.render(context).present(context)
      #context.draw()
    )

  after: (context) => Flow.lift(=> @stimulus.stop(context))



class Block extends RunnableNode

  constructor: (children, @startBlock, @endBlock) ->
    super(children)
    @state.trialNumber = 0

  makeSeq: (spec, context) ->
    events = context.stimFactory.buildEventSeq(spec)
    evseq = new EventSequence(events)
    #evseq.start(context)
    evseq

  updateState: (node, context) ->
    @state.trialNumber += 1
    super(node, context)

  before: (context) =>
    if @startBlock?
      args = _.extend({}, context: context)
      spec = @startBlock.apply(args)
      @makeSeq(spec, context)
    else
      Flow.lift(-> 0)


  after: (context) =>
    Flow.lift ( =>
      if @endBlock
        #blockData = context.blockData()
        #ids = _.unique(blockData.select("id"))
        #out = {}
        #for curid in ids
        #  out[curid] = DataTable.fromRecords(blockData.filter(id: curid).get())

        #args = _.extend({}, context: context, out)
        args = _.extend({}, context: context)
        spec = @endBlock.apply(args)
        @makeSeq(spec, context)
      else
        0
    )



class BlockSeq extends RunnableNode
  constructor: (children) ->
    super(children)
    @state.blockNumber = 0

  updateState: (node, context) ->
    @state.blockNumber += 1
    super(node, context)

class Prelude extends RunnableNode
  constructor: (children) -> super(children)

  before: (context) ->
    Flow.lift( =>
      #context.updateState(=>
      #  context.exState.insidePrelude()
      #)
    )

  after: (context) ->
    Flow.lift( =>
      #context.updateState(=>
      #  context.exState.outsidePrelude()
      #)
    )



class Coda extends RunnableNode
  constructor: (children) -> super(children)

exports.EventSequence = EventSequence
exports.FeedbackNode = FeedbackNode
exports.DeferredNode = DeferredNode
exports.QNode = QNode
exports.Flow = Flow
exports.RunnableNode = RunnableNode
exports.Trial = Trial
exports.Event = Event
exports.Block = Block
exports.BlockSeq = BlockSeq
exports.Prelude= Prelude
exports.Coda = Coda


