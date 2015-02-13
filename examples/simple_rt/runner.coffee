

@context = new Psy.createContext()
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




factorSet =
  color:
    levels: ["red", "blue"]
  radius:
    levels: [50, 100]


fnode = Psy.FactorSetNode.build(factorSet)

# create 5 blocks of trials with 5 complete replications per block
@trials = fnode.trialList(2, 2)


console.log("trials", @trials)

@trials.shuffle()

instructions = """

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


@experiment =

  Routines:

    Prelude:
      Events:
        1:
          Markdown: instructions
          Next:
            AnyKey: ""

    Block:
      Start: ->
        console.log("START BLOCK")
        Text:
          position: "center"
          origin: "center"
          content: ["Get Ready for next block of trials!", "Press any key to start"]
        Next:
          AnyKey: ""

      End: ->
        console.log("END BLOCK")
        Text:
          position: "center"
          origin: "center"
          content: ["End of block", "Press any key to continue"]
        Next:
          AnyKey: ""

    Trial: ->
      Events:
        1:
          FixationCross:
            fill: "gray"
          Next:
            Timeout:
              duration: 1000
        2:
          Circle:
            x: @screen.center.x
            y: @screen.center.y
            radius: @trial.radius
            fill: @trial.color
          Next:
            AnyKey:
              id: "circleResp"


      Feedback: ->
        console.log("context is", context)
        cresp = @context.selectBy({id: "circleResp"})
        RT = _.last(cresp).RT

        Events:
          1:
            Text:
              content: "RT: " + RT.toFixed(0)
              position: "center"
              origin: "center"
            Next:
              Timeout:
                duration: 1500


    Coda:
      Events:
        1:
          Text:
            content: "The End"
            position: "center"
            origin: "center"
          Next:
            AnyKey: ""


  Flow: (routines) ->
    1: routines.Prelude
    2: BlockSequence:
        trialList: trials
        start: routines.Block.Start
        trial: routines.Trial
        end: routines.Block.End

    3: routines.Coda



@pres = new Psy.Presentation(trials, experiment, context)
@pres.start()
