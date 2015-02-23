#Kinetic = require("../../../jslibs/kinetic").Kinetic
KStimulus = require("../../stimresp").KineticStimulus

# A canvas-based component that fills available space with solid color
#
class Blank extends KStimulus

  defaults:
    fill: "gray", opacity: 1

  # Construct a new Blank.
  #
  # @param [Object] spec component parameters
  # @option options [String] fill the fill color
  # @option options [Float] opacity the opacity of the fill color
  constructor: (spec = {}) ->
    super(spec)

  render: (context) ->
    blank = new Kinetic.Rect({ x: 0, y: 0, width: context.width(), height: context.height(), fill: @spec.fill, opacity: @spec.opacity })
    @presentable(this, blank)


exports.Blank = Blank






