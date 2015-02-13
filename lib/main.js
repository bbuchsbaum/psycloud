(function() {
  var key, psylib, value;

  psylib = require('./psylib');

  for (key in psylib) {
    value = psylib[key];
    exports[key] = value;
  }

  if (!String.prototype.trim) {
    String.prototype.trim = function() {
      return this.replace(/^\s+|\s+$/g, '');
    };
  }

}).call(this);
