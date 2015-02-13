psylib = require('./psylib')

for key, value of psylib
  exports[key] = value


if not String.prototype.trim
  String.prototype.trim = ->
    this.replace(/^\s+|\s+$/g,'')

