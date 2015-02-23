

$(document).ready =>
  console.log("READY")
  $('#demotabs .menu .item')
    .tab()

  #$('.dynamic.example .menu .item')
  #  .tab({
  #    context : '.dynamic.example',
  #    auto    : true,
  #    path    : '/modules/tab.html'
  #  })

  activeElement = null
  code = ""

  mirror = CodeMirror.fromTextArea(document.getElementById('code1'), {
    lineNumbers: true
    lineWrapping: true
    mode: "coffeescript"
  })

  setActiveElement = (el) ->
    if activeElement?
      activeElement.removeClass("active")
    el.addClass("active")
    activeElement = el

  $("#arrow_flanker").click( (ev) ->
    setActiveElement($(this))
    code = $(this).data("code")
    window.ArrowFlanker.start()


  )
  $("#color_flanker").click( (ev) ->
    setActiveElement($(this))
    code = $(this).data("code")
    window.ColorFlanker.start()

  )

  $("#color_stroop").click( (ev) ->
    setActiveElement($(this))
    code = $(this).data("code")
    window.ColorStroop.start()

  )

  $("#remote_associates").click( (ev) ->
    setActiveElement($(this))
    code = $(this).data("code")
    window.RAT.start()

  )

  $("#simple_rt").click( (ev) ->
    setActiveElement($(this))
    code = $(this).data("code")
    window.SimpleRT.start()

  )


  $("#codetab").click( (ev) ->

    $.get(code, (data, status) ->
      mirror.setValue(data)
      mirror.setSize(1200, 600);
    )
  )





