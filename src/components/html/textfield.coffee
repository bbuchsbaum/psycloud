# Generated by CoffeeScript 1.7.1
html = require("./html")

class TextField extends html.HtmlStimulus

    defaults:
      placeholder: ""
      icon: ""
      class: ""
      focus: true

    signals: ["change"]

    initialize: (context) ->
      outer = this
      @el = @div()
      @el.addClass "ui input"
      placeholder = @spec.placeholder


      @input = $("<input type=\"text\" placeholder=\"" + placeholder + "\">  ")
      @input.attr("autofocus", "autofocus")
      @input.attr("id", @id)
      @el.append @input
      @el.addClass @spec["class"]
      outer = this
      @input.on "change", ->
        content = undefined
        content = $(this).val()
        outer.emit "change",
          id: outer.id
          val: content
          source: outer
          name: outer.name


    render: (context) ->
      console.log("rendering textfield")
      p = super(context)
      console.log("setting input focus")
      @input.focus()
      p



exports.TextField = TextField

