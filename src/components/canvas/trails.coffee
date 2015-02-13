KStimulus = require("../../stimresp").KineticStimulus
#Kinetic = require("../../../jslibs/kinetic").Kinetic
utils = require("../../utils")



class Trails

  @pathLength: (pts, newpt, i) ->
    pts = pts.slice(0)
    pts.splice(i,0,newpt)
    utils.pathLength(pts)

  @minPathLength: (pts, newpt) ->
    lens = for i in [0...pts.length]
      @pathLength(pts, newpt, i)
    utils.whichMin(lens)

  @orderPoints: (pts) ->
    ## list of point indices
    remaining = [0...pts.length]

    ## initialize with first point
    first = remaining[0]

    ## remove from set
    remaining.splice(first,1)

    path = [pts[first]]
    indices = [first]

    for index in remaining
      ## find the index
      insAt = @minPathLength(path, pts[index])
      path.splice(insAt,0,pts[index])

    path



# Component for Trail-making task, version A
#
# @event 'trail_moved' when the correct item is selected
# @event 'trail_completed' when the last item has been selected and the trail is completed
class TrailsA extends KStimulus

  defaults:

    npoints: 24,
    circleRadius: 25,
    circleFill: "blue",
    circleSelectedFill: "#CC6600"

  # Event signals emitted by Trails components
  signals: ["trail_move", "trail_completed"]

  # @param [Object] spec the component specification
  # @option spec [Integer] circleRadius the radius of the circles in pixels (default: 25)
  # @option spec [Integer] npoints the number of items in the trail (default: 24)
  # @option spec [String] circleFill the color of the circles
  # @option spec [String] circleSelectedFill the color of circles after they have been selected
  constructor: (spec) ->
    super(spec)

    # minDist [Float] the minimum distance between any two items
    @minDist = @spec.circleRadius * 4

    @circleRadius = @spec.circleRadius

    @npoints = @spec.npoints

    @maxIter = 100

  circleLabels: -> [1..@npoints]

  layoutPoints: (context) ->
    pts = utils.genPoints(@npoints, { x: @circleRadius, y: @circleRadius, width: context.width() - @circleRadius*2, height: context.height() - @circleRadius*2 })
    nn = utils.nearestNeighbors(pts, 1)[0]
    niter = 0
    while nn.distance < @minDist and niter < @maxIter
      id = nn.index[0]
      pts[id] = utils.genPoints(1, { x: @circleRadius, y: @circleRadius, width: context.width()- @circleRadius*2, height: context.height()- @circleRadius*2 })[0]
      nn = utils.nearestNeighbors(pts, 1)[0]
      niter++

    pts


  addCircleListener: (circle, context) ->
    outer = this
    circle.on "click", ->
      if this.attrs.id == "circle_".concat(outer.pathIndex + 1)
        if outer.pathIndex == (outer.npoints-1)
          this.fill("red")
          console.log("emitting trail_completed signal")
          setTimeout((-> outer.emit("trail_completed")), 200)
        else
          this.fill(outer.spec.circleSelectedFill)

        console.log("emitting trail_move signal")
        outer.emit("trail_move", {
          index: outer.pathIndex
          node_id: this.attrs.id
        })

        if outer.pathIndex == 0
          outer.path.points([this.getPosition().x, this.getPosition().y])
          outer.path.visible(true)
          #outer.group.add(outer.path)
        else

          pts = outer.path.points()
          outer.path.points(pts.concat([this.getPosition().x, this.getPosition().y]))

        outer.pathIndex++
        context.draw()


  render: (context) ->
    labs = @circleLabels()

    @points = Trails.orderPoints(@layoutPoints(context))
    @path = new Kinetic.Line({stroke: "#00CC00", strokeWidth: 2})
    @path.points([0,0])
    @path.visible(false)
    @pathIndex = 0

    @group = new Kinetic.Group()
    @group.add(@path)

    for point, i in @points
      if i is 0
        circle = new Kinetic.Circle({ x: point[0], y: point[1], radius: @circleRadius, fill: @spec.circleFill, stroke: "khaki", strokeWidth: 2, id: "circle_" + (i+1)})
      else
        circle = new Kinetic.Circle({ x: point[0], y: point[1], radius: @circleRadius, fill: @spec.circleFill, id: "circle_" + (i+1)})

      @addCircleListener(circle, context)

      label = new Kinetic.Text({ x: point[0], y: point[1], text: labs[i], fontSize: 24, fontFamily: "Arial", fill: "white", listening: false})

      label.setPosition({x: circle.getPosition().x - label.getWidth()/2, y: circle.getPosition().y - label.getHeight()/2})

      @group.add(circle)

      @group.add(label)

    outer = this

    onPresent = (context) ->
      console.log("onPresent called!")



    @presentable(this, @group)




class TrailsB extends TrailsA

  constructor: (spec) ->
    super(spec)

  circleLabels: ->
    for i in [0...@spec.npoints]
      if i % 2 != 0
        utils.letters[Math.floor(i/2)].toString().toUpperCase()
      else
        Math.round((i+1)/2).toString()




exports.TrailsA = TrailsA
exports.TrailsB = TrailsB




