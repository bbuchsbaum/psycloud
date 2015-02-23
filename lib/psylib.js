(function() {
  var Dots, Psy, Q, canvas, components, csv, datatable, design, factory, flow, html, include, layout, lib, libs, match, samplers, stimresp, sugar, utils, _, _i, _len;

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

  factory = require("./factory");

  sugar = require("sugar");

  flow = require("./flow");

  _ = require('lodash');

  Q = require("q");

  csv = require('../jslibs/jquery.csv.js');

  match = require("coffee-pattern").match;

  include = function(lib) {
    var key, value, _results;
    _results = [];
    for (key in lib) {
      value = lib[key];
      _results.push(exports[key] = value);
    }
    return _results;
  };

  libs = [Psy, Dots, utils, datatable, samplers, stimresp, layout, design, canvas, html, components, factory, flow, match];

  for (_i = 0, _len = libs.length; _i < _len; _i++) {
    lib = libs[_i];
    include(lib);
  }

  exports.Q = Q;

  exports._ = _;

  exports.csv = csv;

  exports.match = match;

}).call(this);
