
_ = require('lodash')
didyoumean = require("didyoumean")
didyoumean.caseSensitive = true

Canvas = require("./components/canvas/canvas").Canvas
Html = require("./components/html/html").Html
Components = require("./components/components")
Psy = require("./psycloud")
Layout = require("./layout")
AutoResponse = require("./stimresp").AutoResponse
Flow = require("./flow")



class ComponentFactory

  @transformPropertySpec: (name, params) ->
    sname = name.split("$")
    if sname.length is 1
      name = sname[0]
    else if sname.length is 2
      name = sname[0]
      id = sname[1]
      params.id = id
    else
      throw new Error("Illegal property name #{name}. Can only have one '$' character in name")

    [name, params]


  constructor: (@context) ->


  buildStimulus: (spec) ->
    stimType = _.keys(spec)[0]
    params = _.values(spec)[0]
    @makeStimulus(stimType, params)

  buildResponse: (spec) ->
    responseType = _.keys(spec)[0]
    params = _.values(spec)[0]
    @makeResponse(responseType, params)


  buildEvent: (spec) ->
    console.log("building event", spec)
    stimSpec = _.omit(spec, "Next")

    if spec.Next?
      responseSpec = _.pick(spec, "Next")
      response = @buildResponse(responseSpec.Next)
    else
      response = new AutoResponse()

    stim = @buildStimulus(stimSpec)

    @makeEvent(stim, response)

  buildTrial: (spec, record) ->
    console.log("building trial from spec", spec)
    espec = _.omit(spec, ["Feedback", "Background"])
    evseq = @buildEventSeq(espec)

    console.log("trial events", evseq)
    console.log("feedback is", spec.Feedback)

    if spec.Background?
      background = @makeStimulus("Background", spec.Background)
      new Flow.Trial(evseq, record, spec.Feedback, background)
    else
      new Flow.Trial(evseq, record, spec.Feedback)


  buildEventSeq: (spec) ->
    console.log("building event sequence", spec)
    if _.isArray(spec)
      ## spec is an array
      for value in spec
        @buildEvent(value)
    else if spec.Events?
      console.log("building event sequence from event key", spec)
      espec = _.omit(spec, "Background")
      for key, value of espec.Events
        console.log("building event from key, value: ", key, value)
        @buildEvent(value)
    else
      espec = _.omit(spec, "Background")
      [@buildEvent(espec)]

  make: (name, params, registry) ->
    throw new Error("unimplemented", name, params, registry)


  makeStimulus: (name, params) ->
    throw new Error("unimplemented", name, params)

  makeResponse: (name, params) ->
    throw new Error("unimplemented", name, params)

  makeEvent: (stim, response) ->
    throw new Error("unimplemented", stim, response)

  makeLayout: (name, params, context) ->
    throw new Error("unimplemented", name, params, context)


spec =
  Blank:
    file: "red"

[name, params] = ComponentFactory.transformPropertySpec(_.keys(spec)[0], _.values(spec)[0])



exports.ComponentFactory = ComponentFactory

class DefaultComponentFactory extends ComponentFactory

  constructor: ->
    @registry = _.merge(Components, Canvas, Html)


  makeStimSet: (params, callee, registry) ->
    names = _.keys(params)
    props = _.values(params)

    stims = _.map([0...names.length], (i) =>
      callee(names[i], props[i], registry)
    )

  makeNestedStims: (params, callee, registry) ->
    names = _.map(params, (stim) -> _.keys(stim)[0])
    props = _.map(params, (stim) -> _.values(stim)[0])

    stims = _.map([0...names.length], (i) =>
      callee(names[i], props[i], registry)
    )


  make: (name, params, registry) ->
    callee = arguments.callee
    [name, params] = ComponentFactory.transformPropertySpec(name, params)


    switch name
      when "Group"
        #layout = _.pick(params, "layout")
        #params = _.omit(params, "layout")
        stims =
          if params.elements?
            @makeNestedStims(params.elements, callee, @registry)
          else
            @makeNestedStims(params, callee, @registry)

        #if layout?
        #  layoutName = _.keys(layout)[0]
        #  layoutParams = _.values(layout)[0]
        #  new Components.Group(stims, @makeLayout(layoutName, layoutParams, context), params)
        #else
        new Components.Group(stims, null, params)

      when "CanvasGroup"
        #layout = _.pick(params, "layout")
        #params = _.omit(params, "layout")
        stims = @makeNestedStims(params, callee, @registry)

        #if layout?
        #  layoutName = _.keys(layout)[0]
        #  layoutParams = _.values(layout)[0]
        #  new Components.CanvasGroup(stims, @makeLayout(layoutName, layoutParams, context), params)
        #else
        new Components.CanvasGroup(stims, null, params)

      when "Grid"
        rows = _.pick(params, "rows")
        columns = _.pick(params, "columns")
        columns = _.pick(params, "bounds")
        params = _.omit(params, ["rows", "columns"])
        stims = @makeNestedStims(params, callee, @registry)
        new Components.Grid(stims, rows or 3, columns or 3, params.bounds or null)

      when "Background"
        stims = @makeStimSet(params, callee, @registry)
        new Canvas.Background(stims)

      when "First"
        resps = @makeNestedStims(params, callee, @registry)

        new Components.First(resps)
      else
        if not registry[name]?
          throw new Error("DefaultComponentFactory: cannot find component named: " + name + "-- did you mean? " + didyoumean(name, _.keys(registry)) + "?")
        new registry[name](params)

  makeStimulus: (name, params) ->
    @make(name, params, @registry)

  makeResponse: (name, params) ->
    @make(name, params, @registry)

  makeEvent: (stim, response) -> new Flow.Event(stim, response)

  makeLayout: (name, params, context) ->
    switch name
      when "Grid"
        new Layout.GridLayout(params[0], params[1], {x: 0, y: 0, width: context.width(), height: context.height()})
      else
        console.log("unrecognized layout", name)


exports.DefaultComponentFactory = DefaultComponentFactory
exports.componentFactory = new DefaultComponentFactory()
