html = require("./html")


class HtmlButton extends html.HtmlStimulus

  description: "An html button that can be clicked."

  defaults:
    label: "Next", class: "", disabled: "false"

  signals: ["clicked"]

  constructor: (spec = {}) ->
    super(spec)

  initialize: ->
    super()
    @el = @div()
    @el.addClass("ui button")
    if @spec.disabled
      @el.addClass("disabled")

    @el.addClass(@spec.class)
    @el.append(@spec.label)
    @el.attr("id", @id)
    #@positionElement(@el)

    outer = this
    @el.on("click", =>
      outer.emit("clicked", {
          id: outer.id
          source: this
          label: @spec.label
          name: @name
        }
      )
    )



    #@initReactions(outer)



exports.HtmlButton = HtmlButton