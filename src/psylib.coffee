
Psy = require("./psycloud")
Dots = require("./dotmotion")
utils = require("./utils")
datatable = require("./datatable")
samplers = require("./samplers")
stimresp = require("./stimresp")
layout = require("./layout")
design = require("./design")
canvas = require("./components/canvas/canvas")
html = require("./components/html/html")
components = require("./components/components")
factory = require("./factory")
sugar = require("sugar")
flow = require("./flow")

#Kinetic = require("../jslibs/kinetic").Kinetic

_ = require('lodash')
Q = require("q")

csv = require('../jslibs/jquery.csv.js')
{match} = require("coffee-pattern")


include = (lib) ->
  for key, value of lib
    exports[key] = value

#libs = [Exp, Psy, Dots, utils, datatable, samplers, stimresp, layout]

libs = [Psy, Dots, utils, datatable, samplers, stimresp, layout, design, canvas, html, components, factory, flow, match]

for lib in libs
  include(lib)


exports.Q = Q
exports._ = _
#exports.Kinetic = Kinetic
exports.csv = csv
exports.match = match
#exports.recline = recline



