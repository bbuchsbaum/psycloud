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


# A base cass for experiment nodes that perform some action
#
class RunnableNode

  constructor: (@children) ->
    @state = {}
    @name = @constructor.name

    ## ?
    ## https://github.com/jashkenas/coffeescript/issues/714
    # classRef = if command.constructor.name? then command.constructor.name else command.constructor.toString().match(/^function\s(.+)\(/)[1]

  # execute an action before running current node
  #
  # @param [ExperimentContext] context
  # @return [promise] output
  #
  before: (context) -> Flow.lift(-> 0)

  # execute an action after running current node
  #
  # @param [ExperimentContext] context
  # @return [promise] output
  #
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


# A node that wraps an ordinary function in a promise
#
class QNode extends RunnableNode

  # Construct a QNode
  #
  # @param [Function] fun the function to wrap in the promise
  constructor: (@fun) ->

  start: (context) => Q.fcall(@fun, context)


# An runnable node used for presenting feedback to user after trial
#
class FeedbackNode extends RunnableNode

  # Construct a FeedbackNode
  #
  # @param [Object] feedback a feedback generator spec.
  # @param [Object] record the current trial condition information
  constructor: (@feedback, @record={}) ->

  numChildren: -> 1

  length: -> 1

  start: (context) ->
    if @feedback?
      response = context.responseSet()

      args = { context: context, response: response, screen: context.screenInfo(), trial: @record }
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
      child.stimulus.initialize(context)

    Flow.lift ( =>
      context.clearBackground()
      context.clearContent()

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
        child.stimulus.initialize(context)


      Flow.lift ( =>
        context.clearBackground()

        if @background?
          context.setBackground(@background)
          context.drawBackground()
      )

    after: (context) =>
      new FeedbackNode(@feedback, @record)



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

  prepBlock: (block, context) ->
    if _.isFunction block
      ## dynamic content
      args = _.extend({}, context: context)
      spec = block.apply(args)
      @makeSeq(spec, context)
    else
      @makeSeq(block, context)


  before: (context) =>
    if @startBlock?
      @prepBlock(@startBlock, context)
    else
      Flow.lift(-> 0)


  after: (context) =>
    if @endBlock?
      @prepBlock(@endBlock, context)
    else
      Flow.lift(-> 0)


class Prelude

class BlockSeq extends RunnableNode
  constructor: (children, @taskName) ->
    super(children)
    if not @taskName
      @taskName = "task"

    @state.blockNumber = 0
    @state.taskName = @taskName

  updateState: (node, context) ->
    @state.blockNumber += 1
    super(node, context)



class Coda extends RunnableNode
  constructor: (children) -> super(children)

exports.EventSequence = EventSequence
exports.FeedbackNode = FeedbackNode
#exports.DeferredNode = DeferredNode
exports.QNode = QNode
exports.Flow = Flow
exports.RunnableNode = RunnableNode
exports.Trial = Trial
exports.Event = Event
exports.Block = Block
exports.BlockSeq = BlockSeq
exports.Prelude= Prelude
exports.Coda = Coda


