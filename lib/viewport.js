(function() {
  var Stimulus, Viewport, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Stimulus = require("../stimresp").Stimulus;

  Viewport = (function(_super) {
    __extends(Viewport, _super);

    /*
    
    defaults:
      x: 0, y: 0, width: 100, height: 100
    
    constructor: (@child) ->
      super({})
    
      @layer = new Kinetic.Layer({
        x: @spec.x
        y: @spec.y
        width: @spec.width
        height: @spec.height
        clip: [0, 0, @spec.width, 100]
      }
    
    render: (context, layer) ->
      for stim in @stims
        stim.render(context, layer)
    */


    function Viewport() {
      _ref = Viewport.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return Viewport;

  })(Stimulus);

}).call(this);

/*
//# sourceMappingURL=../lib/canvas/viewport.js.map
*/