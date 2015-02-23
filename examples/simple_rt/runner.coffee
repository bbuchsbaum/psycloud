_ = Psy._
@SimpleRT = {}

instructions = """

          Welcome to the Experiment!
          ==========================

          This is a simple reaction time experiment. Every time a circle appears on the screen, press any key on the keyboard.


          Press any key to continue
          -------------------------

          """


@SimpleRT.experiment =

  Routines:

    Prelude:
      Events:
        1:
          Markdown: instructions
          Next:
            AnyKey: ""

    Block:
      Start: ->
        Text:
          position: "center"
          origin: "center"
          content: ["Get Ready for next block of trials!", "Press any key to start"]
        Next:
          AnyKey: ""

      End: ->
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

context = new Psy.createContext()

factorSet =
  color:
    levels: ["red", "blue"]
  radius:
    levels: [50, 100]


fnode = Psy.FactorSetNode.build(factorSet)

# create 5 blocks of trials with 5 complete replications per block
trials = fnode.trialList(2, 2)
trials.shuffle()

@SimpleRT.start = =>
  @pres = new Psy.Presentation(trials, @SimpleRT.experiment, context)
  @pres.start()


