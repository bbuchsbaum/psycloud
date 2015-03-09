utils = require("../utils")
Q = require("q")
Response = require("../stimresp").Response
ResponseData = require("../stimresp").ResponseData

class Timeout extends Response

  defaults:
    duration: 1000

  activate: (context, stimulus) ->
    deferred = Q.defer()

    utils.doTimer(@spec.duration, (diff) =>
      resp = @baseResponse(stimulus)
      resp.name = "Timeout"
      resp.id = @id
      resp.timeElapsed = diff
      resp.timeRequested = @spec.duration
      console.log("timeout!")
      deferred.resolve(new ResponseData(resp)))

    deferred.promise


exports.Timeout = Timeout