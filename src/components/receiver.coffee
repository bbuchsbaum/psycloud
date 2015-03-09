utils = require("../utils")
Q = require("q")
Response = require("../stimresp").Response
ResponseData = require("../stimresp").ResponseData

class Receiver extends Response

  defaults:
    id: null, signal: "", delay: 0, timeout: false


  resolveOnTimeout: (deferred, timeout, stimulus, startTime) ->
    utils.doTimer(timeout, (diff) =>
      if !deferred.isResolved
        timeStamp = utils.getTimestamp()
        resp = @baseResponse(stimulus)
        resp.name = "Receiver"
        resp.signal = @spec.signal
        resp.id = @id
        resp.event = "timeout"
        resp.RT = timeStamp - startTime
        deferred.resolve(new ResponseData(resp))
    )

  activate: (context, stimulus) ->
    super(context, stimulus)
    deferred = Q.defer()
    startTime = utils.getTimestamp()


    callback = (args) =>
      resp = @baseResponse(stimulus)
      resp.name = "Receiver"
      resp.signal = @spec.signal
      resp.id = @id
      resp.event = args
      resp.RT = utils.getTimestamp() - startTime

      if @spec.delay > 0
        utils.doTimer(@spec.delay, => deferred.resolve(new ResponseData(resp)))
      else
        deferred.resolve(new ResponseData(resp))

    if @spec.id?
      stimulus.addReaction(@spec.signal, callback, { id: @spec.id })
    else
      @spec.id = stimulus.id
      #console.log("adding reaction for ", @spec.signal)
      stimulus.addReaction(@spec.signal, callback)

    if @spec.timeout
      @resolveOnTimeout(deferred, @spec.timeout, stimulus,startTime)

    deferred.promise


exports.Receiver = Receiver