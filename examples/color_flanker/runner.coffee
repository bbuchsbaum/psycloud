_ = Psy._
@ColorFlanker = {}


@ColorFlanker.experiment  =

  #Define:
  #  datalog: []

  Routines:

    Prelude:
      Events:
        1:
          Markdown: """

          Welcome to the Experiment!
          ==========================

          This a simple task.

          On every trial a central square will appear surrounded by two flanking squares.
          Your goal is to focus on the central square and make a judgment about its color.
          You should ignore the color of the flanking squares.

            * If the central square is RED or GREEN, press the '1' key.

            * If the central square is YELLOW or BLUE press the '2' key.

            * If your response is correct, the screen will briefly turn green.

            * If your response is incorrect, the screen will briefly turn red.

          Press any key to continue
          -------------------------

          """
          Next:
            AnyKey: ""

    Block:
      Start: ->
        Text:
          position: "center"
          origin: "center"
          content: ["Get Ready for Block #{@blockNumber}!", "Press Space Bar to start"]
        Next:
          SpaceKey: ""

      End: ->
        Text:
          position: "center"
          origin: "center"
          content: ["End of Block #{@blockNumber}", "Press any key to continue"]
        Next:
          AnyKey: ""

    Trial: ->
      diameter = 170

      Background:
        Blank:
          fill: "gray"
        CanvasBorder:
          stroke: "black"

      Events:
        1:
          FixationCross:
            fill: "black"
          Next:
            Timeout:
              duration: 1000
        2:
          Group:
            elements: [
              Rectangle:
                x: @screen.center.x - 200
                y: @screen.center.y
                origin: "center"
                fill: @trial.flankerColor
                width: diameter
                height: diameter
            ,
              Rectangle:
                x: @screen.center.x
                y: @screen.center.y
                origin: "center"
                fill: @trial.centerColor
                width: diameter
                height: diameter
            ,
              Rectangle:
                x: @screen.center.x + 200
                y: @screen.center.y
                origin: "center"
                fill: @trial.flankerColor
                width: diameter
                height: diameter
            ]

          Next:
            KeyPress:
              id: "answer"
              keys: ['1', '2']
              correct: if @trial.centerColor is "red" or @trial.centerColor is "green" then '1' else '2'
              timeout: 1000

      Feedback: ->
        dlog = @context.get("datalog")
        event = @context.trialData().filter({id: "answer"}).get()[0]
        el = _.pick(event, ["RT", "accuracy", "trialNumber", "keyChar"])
        el.centerColor = event.trial.centerColor
        el.flanker = event.trial.flanker
        el.flankerColor = event.trial.flankerColor
        dlog.push(el)


        Text:
          content: if @response[1].accuracy then "correct!" else "incorrect!"
          fontSize: 40
          position: "center"
          origin: "center"
        Next:
          Timeout:
            duration: 200
    Coda:
      Events:
        1:
          Text:
            position: "center"
            origin: "center"
            content: "The End"
            fontSize: 200

          Next:
            Timeout: duration: 5000



  Flow: (routines) ->
    1: routines.Prelude
    2: BlockSequence:
      trialList: trials
      start: routines.Block.Start
      trial: routines.Trial
      end: routines.Block.End
    3: routines.Coda


context = new Psy.createContext()

factorSet =
  flanker:
    levels: ["congruent", "incongruent"]
  centerColor:
    levels: ["red", "green", "blue", "yellow"]


colorSampler = new Psy.ReplacementSampler(["red", "green", "blue", "yellow"])

fnode = Psy.FactorSetNode.build(factorSet)

# create 1 blocks of trials with 1 complete replications per block
trials = fnode.trialList(1, 1)

## augment design with color flankerColor factor
trials = trials.bind (record) ->
  flankerColor: Psy.match record.flanker,
    congruent: record.centerColor
    incongruent: -> Psy.match record.centerColor,
      red: Psy.oneOf ["blue", "yellow"]
      green: Psy.oneOf ["blue", "yellow"]
      blue: Psy.oneOf ["red", "green"]
      yellow: Psy.oneOf ["red", "green"]



trials.shuffle()


ColorFlanker.start = =>


  context.set("datalog", [])

  @pres = new Psy.Presentation(trials, @ColorFlanker.experiment, context)
  @pres.start()



#pres.start().then( =>
#  console.log("DONE!!")
#
#  dat = {
#    Header:
#      id: 10001
#      date: Date()
#      task: "flanker"
#    Data: pres.context.get("datalog")
#
#
#  }

#  console.log(dat)
#  $.ajax({
#    type: "POST",
#    url: "/results",
#    data: dat,
#    dataType: "json"
#  })
#)