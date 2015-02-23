layout = require("../../layout")
#Kinetic = require("../../../jslibs/kinetic").Kinetic
_ = require('lodash')
KStimulus = require("../../stimresp").KineticStimulus

# A canvas-based component that consisting of text framed by a rectangle
class MessageBox extends KStimulus

  defaults:
    content: "Text", x: 5, y: 5, width: 100, background: "green", fill: "black", fontSize: 18, fontFamily: "Arial", align: "center", position: null

  # Construct a new MessageBox
  #
  # @param [Object] spec component parameters
  # @option spec [String] content the text content of the message
  # @option spec [String] x the x coordinate of the message
  # @option spec [Integer] y the y coordinate of the message
  # @option spec [Integer] width the width of the message
  # @option spec [String] background the background color of the rectangle
  # @option spec [String] fill the fill (stroke) color the of the rectangle outline
  # @option spec [String] fontSize the font size of the message
  # @option spec [String] fontFamily the font family of the message
  # @option spec [String] align the horizontal alignment of the message
  # @option spec [String] position the position of the element
  constructor: (spec = {}) ->
    if (spec.content? and _.isArray(spec.content))
      spec.content = spec.content.join(' \n ')
      if not spec.lineHeight?
        spec.lineHeight = 2
    super(spec)

  initialize: ->


    @text = new Kinetic.Text({
      x: 0,
      y: 0,
      text: @spec.content,
      fontSize: @spec.fontSize,
      fontFamily: @spec.fontFamily,
      fill: @spec.fill
      lineHeight: @spec.lineHeight or 1
      width: @spec.width
      listening: false
      align: @spec.align

    })

    @rect = new Kinetic.Rect({
      x: 0,
      y: 0,
      stroke: "black",
      strokeWidth: 2,
      fill: @spec.background,
      width: @spec.width,
      height: @text.height() + 10,
      cornerRadius: 2
    });

    @group = new Kinetic.Group()
    @group.add(@rect)
    @group.add(@text)


  render: (context, layer) ->

    coords = @computeCoordinates(context, @spec.position, @text.getWidth(), @text.getHeight())
    @text.setPosition({x: coords[0], y: coords[1]})
    @rect.setPosition({x: coords[0], y: coords[1] - 5})
    @presentable(this, @group)


exports.MessageBox = MessageBox

