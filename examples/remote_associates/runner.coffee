
design_recog = Psy.loadTable("design/RAT_RecList1.txt", separator=",")
design_gen = Psy.loadTable("design/RAT_GenList1.txt", separator=",")

@trialsPart1 = Psy.TrialList.fromBlock(design_recog)
@trialsPart2 = Psy.TrialList.fromBlock(design_gen)

dummyTrials = new Psy.TrialList(1)
dummyTrials.add(0, {})

console.log("design_recog", trialsPart1)
console.log("design_gen", trialsPart2)



@RAT = {}

@RAT.experiment =

  Routines:
    Prelude:
      Events:
        1:
          Markdown:
            url: "./instructions_page1.md"
          Next: AnyKey: {}
        2:
          Markdown:
            url: "./instructions_page2.md"
          Next: AnyKey: {}
        3:
          Markdown:
            url: "./instructions_page3.md"
          Next: AnyKey: {}

    Part1:

      Start:
        Text:
          content: "Press any key to start"
          position: "center"
          origin: "center"
        Next:
          AnyKey: {}

      End:
        Text:
          content: "End of Part 1. Press any key to continue."
          position: "center"
          origin: "center"
        Next:
          AnyKey: {}


      Trial: ->
        console.log(@screen)
        Group:
          1:
            Question:
              x: "20%"
              y: "45%"
              width: "66%"
              question: @trial.ProblemStim.toUpperCase()
              id: "question"
              type: "multichoice"
              choices: [@trial.AnswerStim1, @trial.AnswerStim2, @trial.AnswerStim3]
              react:
                change: (el) =>
                  @context.set("choice", el)
                  $("#nextbutton").removeClass("disabled")

          2:
            HtmlButton:
              id: "nextbutton"
              disabled: true
              label: "Next"
              x: "20%"
              y: "45%"
        Next:
          Receiver:
            id: "nextbutton"
            signal: "clicked"

        Feedback: ->
          console.log("feedback response", @response)
          console.log("trial", @trial)
          correct = @context.get("choice") is @trial.solution
          Events:
            1:
              Text:
                content: if correct then "Correct!" else "Incorrect."
                origin: "center"
                position: "center"
              Next:
                Timeout: duration: 700
    Part2:
      Start:
        Text:
          content: "Press any key to start Part 2."
          origin: "center"
          position: "center"
        Next:
          AnyKey: {}

      End:
        Text:
          content: "End of Part 2. Press any key to continue"
          position: "center"
          origin: "center"
        Next:
          AnyKey: {}

      Trial: ->
        questions = {}
        block = trialsPart2.getBlock(0)
        for record, i in block
          console.log(record)
          questions[(i+1).toString()] =
            Question:
              x: "5%"
              #y: (i*8).toString() + "%"
              width: "50%"
              question: record.Stimulus.toUpperCase()
              id: "question" + (i+1)
              type: "textfield"
              #choices: [record.AnswerStim1, record.AnswerStim2, record.AnswerStim3]
              react:
                change: (el) ->
                  #$("#nextbutton").removeClass("disabled")
        console.log(questions)

        Group:
          questions
        Next:
          Timeout:
            duration: 60000
#        Group:
#          1:
#            Question:
#              x: "20%"
#              y: "45%"
#              width: "66%"
#              question: @trial.Stimulus.toUpperCase()
#              type: "textfield"
#
#        Next:
#          Receiver:
#            id: "nextbutton"
#            signal: "clicked"




  Flow: (routines) ->
    1: routines.Prelude
    2: BlockSequence:
        start: routines.Part1.Start
        trialList: trialsPart1
        trial: routines.Part1.Trial
        end: routines.Part1.End
    3: BlockSequence:
        start: routines.Part2.Start
        trialList: dummyTrials
        trial: routines.Part2.Trial
        end: routines.Part2.End

@RAT.start = =>
  context = Psy.createContext()
  pres = new Psy.Presentation({}, @RAT.experiment, context)
  pres.start()
