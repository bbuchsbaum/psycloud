(function() {
  var Dots, Exp, Kinetic, Psy, Q, canvas, components, datatable, design, html, include, layout, lib, libs, samplers, stimresp, utils, _, _i, _len;

  Exp = require("./elements");

  Psy = require("./psycloud");

  Dots = require("./dotmotion");

  utils = require("./utils");

  datatable = require("./datatable");

  samplers = require("./samplers");

  stimresp = require("./stimresp");

  layout = require("./layout");

  design = require("./design");

  canvas = require("./components/canvas/canvas");

  html = require("./components/html/html");

  components = require("./components/components");

  Kinetic = require("./lib/kinetic").Kinetic;

  _ = require('lodash');

  Q = require("q");

  include = function(lib) {
    var key, value, _results;
    _results = [];
    for (key in lib) {
      value = lib[key];
      _results.push(exports[key] = value);
    }
    return _results;
  };

  libs = [Exp, Psy, Dots, utils, datatable, samplers, stimresp, layout, design, canvas, html, components];

  for (_i = 0, _len = libs.length; _i < _len; _i++) {
    lib = libs[_i];
    include(lib);
  }

  exports.Q = Q;

  exports._ = _;

  exports.Kinetic = Kinetic;

}).call(this);

/*
//# sourceMappingURL=../lib/canvas/main.js.map
*/