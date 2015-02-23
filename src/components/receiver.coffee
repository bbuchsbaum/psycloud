utils = require("../utils")
Q = require("q")
Response = require("../stimresp").Response
ResponseData = require("../stimresp").ResponseData

class Receiver extends Response

  defaults:
    id: null, signal: "", delay: 0



  activate: (context, stimulus) ->
    super(context, stimulus)
    deferred = Q.defer()

    callback = (args) =>
      resp = @baseResponse(stimulus)
      resp.name = "Receiver"
      resp.signal = @spec.signal
      resp.id = @id
      resp.event = args

      if @spec.delay > 0
        utils.doTimer(@spec.delay, => deferred.resolve(new ResponseData(resp)))
      else
        deferred.resolve(new ResponseData(resp))

    if @spec.id?
      stimulus.addReaction(@spec.signal, callback, { id: @spec.id })
    else
      @spec.id = stimulus.id
      console.log("adding reaction for ", @spec.signal)
      stimulus.addReaction(@spec.signal, callback)

    deferred.promise


exports.Receiver = Receiver