
#Kinetic = require("../../../jslibs/kinetic").Kinetic
KStimulus = require("../../stimresp").KineticStimulus


# A canvas-based component that draws a border around window perimeter.
#
class CanvasBorder extends KStimulus

  defaults:
    strokeWidth: 5, stroke: "black", opacity: 1

  # Construct a new CanvasBorder.
  #
  # @param [Object] spec component parameters
  # @option options [Int] strokeWidth the width of the border
  # @option options [Int] stroke the color of the border
  # @option options [Float] opacity the opacity of the stroke color
  constructor: (spec = {}) ->
    super(spec)

  render: (context) ->
    border = new Kinetic.Rect({ x: 0, y: 0, width: context.width(), height: context.height(), strokeWidth: @spec.strokeWidth, stroke: @spec.stroke, opacity: @spec.opacity })
    @presentable(this, border)


exports.CanvasBorder = CanvasBorder

