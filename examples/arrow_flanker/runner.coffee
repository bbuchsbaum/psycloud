


_ = Psy._

###

  Task:
    name: "arrow_flanker"

    Conditions:
      Crossed:
          flanker:
            levels: ["congruent", "incongruent"]
          centerArrow:
            levels: ["left", "right"]
      Uncrossed:
          flankerArrow:
            levels: ["left", "right"]
            choose: (trial) -> ...
    Items:
      flankerArrow:


###



window.ArrowFlanker = {}


@ArrowFlanker.experiment =


  Routines:
    Prelude:
      Events:
        1:
          Markdown: """

          Welcome to the Experiment!
          ==========================

          On every trial a central arrow will appear surrounded by arrows on either side.
          Your goal is to focus on the central arrow and decide whether it points left or right.

            * If the central arrow points <-- left, press the 'g' key.

            * If the central arrow points --> right, press the 'h' key.

            * If your response is correct, the screen will briefly turn green.

            * If your response is incorrect, the screen will briefly turn red.

            * make your decision as fast as you can.

          Press any key to continue
          -------------------------

          """
          Next:
            AnyKey: {}

    Block:
      Start: ->
        Text:
          position: "center"
          origin: "center"
          content: ["Get Ready for Block #{@context.get("State.blockNumber")}!", "Press any key to start"]

        Next: AnyKey: {}

      End: ->
        Text:
          position: "center"
          origin: "center"
          content: ["End of Block #{@context.get("State.blockNumber")}", "Press any key to continue"]

        Next: AnyKey: {}

    Trial: ->
      arrowLen = 150
      arrowx = [@screen.center.x - 2*arrowLen - 20,
                @screen.center.x - arrowLen - 10,
                @screen.center.x,
                @screen.center.x + arrowLen + 10,
                @screen.center.x + 2*arrowLen + 20]

      Background:
        Blank:
          fill: "white"
        CanvasBorder:
          stroke: "black"


      Events:
        1:
          FixationCross:
            fill: "gray"
          Next:
            Timeout:
              duration: 1000
        2:
          Group:
            elements:
              for x, index in arrowx
                Arrow:
                  x: x
                  y: @screen.center.y
                  thickness: 35
                  arrowSize: 75
                  origin: "center"
                  fill: "black"
                  length: arrowLen
                  direction: if index is 2 then @trial.centerArrow else @trial.flankerArrow

          Next:
            KeyPress:
              id: "answer"
              keys: ['g', 'h']
              correct: if @trial.centerArrow is "left" then 'g' else 'h'
              timeout: 1500

      Feedback: ->
        Blank:
          fill: if @response[1].accuracy then "green" else "red"
          opacity: .1
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

    Save: ->
      Action:
        execute: (context) ->
          if context.get("active_brain")
            logdat= context.get("resultObject")
            $.ajax({
              type: "POST"
              url: "/results"
              data: JSON.stringify(logdat)
              contentType: "application/json"
            })


  Flow: (routines) ->
    1: routines.Prelude
    2: BlockSequence:
      trialList: trials
      start: routines.Block.Start
      trial: routines.Trial
      end: routines.Block.End
    3: routines.Coda


factorSet =
  flanker:
    levels: ["congruent", "incongruent"]
  centerArrow:
    levels: ["left", "right"]


fnode = Psy.FactorSetNode.build(factorSet)

# create 5 blocks of trials with 5 complete replications per block
trials = fnode.trialList(5, 5)


trials = trials.bind (record) ->
  flankerArrow: Psy.match record.flanker,
    congruent: record.centerArrow
    incongruent: -> Psy.match record.centerArrow,
      left: "right"
      right: "left"


trials.shuffle()

@ArrowFlanker.start =  (subjectNumber, sessionNumber) =>
  @context = new Psy.createContext()
  pres = new Psy.Presentation(trials, window.ArrowFlanker.experiment, context)
  pres.start()


