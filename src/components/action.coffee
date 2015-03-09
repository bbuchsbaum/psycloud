_ = require('lodash')
Q = require("q")


class Action extends require("../stimresp").Response

  defaults:
    execute: (context) ->

  constructor: (spec) ->
    super(spec)

  activate: (context, stimulus) ->
    console.log("calling action code!", @spec.execute)
    @spec.execute(context)


exports.Action = Action