window.ColorStroop = {}

ColorStroop.experiment =


  Routines:
    Prelude:
      Events:
        1:
          Markdown: """

          Welcome to the Experiment!
          ==========================

          This is a Color Stroop experiment.

          On each trial, click the button matching the color of *font* of the word displayed above.

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
          content: ["Get Ready for Block #{@context.get("State.blockNumber")}!", "Press any key to start"]
        Next:
          AnyKey: ""

      End: ->
        Text:
          position: "center"
          origin: "center"
          content: ["End of Block #{@context.get("State.blockNumber")}", "Press any key to continue"]
        Next:
          AnyKey: ""

    Trial: ->
      Background:
        Blank:
          fill: "black"

      Events:
        1:
          FixationCross:
            fill: "green"
          Next:
            Timeout:
              duration: 1000
        2:
          Group:
            stims: [
              Text:
                position: "center"
                origin: "center"
                content: @trial.word
                fill: @trial.color
            ,
              ButtonGroup$buttonset:
                labels: ["red", "green", "blue", "yellow"]
                x: 280
                y: 500
            ]

          Next:
            Receiver$buttonset:
              signal: "clicked"

      Feedback: ->
        Blank:
          opacity: .1
        Next:
          Timeout:
            duration: 200

    Coda:
      Events:
        1:
          Text:
            content: "You're done, way to go!"
            position: "center"
            origin: "center"
            fontSize: 20
        Next:
          Timeout:
            duration: 5000

  Flow: (routines) ->
    1: routines.Prelude
    2: BlockSequence:
      trialList: trials
      start: routines.Block.Start
      trial: routines.Trial
      end: routines.Block.End
    3: routines.Coda



factorSet =
  condition:
    levels: ["congruent", "incongruent"]


colors = ["red", "green", "blue", "yellow"]


factorNode = Psy.FactorSetNode.build(factorSet)

# create 2 blocks of trials with 2 complete replications per block
trials = factorNode.trialList(2,2)
trials = trials.bind (record) ->
  color = Psy.oneOf(colors)
  word: Psy.match record.condition,
    congruent: color.toUpperCase()
    incongruent: Psy.oneOf(colors.exclude(color)).toUpperCase()
  color: color

trials.shuffle()

ColorStroop.start = ->
  context = Psy.createContext()
  pres = new Psy.Presentation(trials, ColorStroop.experiment, context)
  pres.start()

