_ = Psy._
@AST = {}

@design_prac = Psy.loadTable("design/Practice.txt", separator=",")
@design_sub = Psy.loadTable("design/AST_SubList1.txt", separator=",")
@design_mul = Psy.loadTable("design/AST_SubList1.txt", separator=",")

design_sub = @design_sub.shuffle()
design_mul = @design_mul.shuffle()

trialsPart1 = Psy.TrialList.fromBlock(design_sub)
trialsPractice = Psy.TrialList.fromBlock(design_prac)


instructions = """

          Arithmetic Systems Task
          ==========================

          This will be a test of arithmetic skill. You will be solving basic subtraction and multiplication problems.
          Problems will appear on the screen. Solve the problem, and type the answer using the keyboard.
          Then press enter to proceed to the next question.

          Answer these problems as **quickly as possible** while getting most correct.

          A few errors are expected given the speed required.

          If you notice you made an error while you are typing, don’t try to correct it, finish typing your answer and move on.

          Problems will appear in 4 blocks of 28, 2 of subtraction and 2 of multiplication.

          There will be a short practice set so you can get used to answering.

          **Press any key to continue**


          """




@AST.experiment =

  Define:
    task: ""


  Routines:

    Prelude:
      Events:
        1:
          Markdown: instructions
          Next:
            AnyKey: ""

    StartPractice: ->
      @context.set("task", "practice")

      Text:
        content: ["You will now receive 10 practice problems.", "Press any key to continue."]
        origin: "center"
        position: "center"
      Next:
        AnyKey: {}


    EndPractice: ->
      Markdown: """

                Good work!
                ==========

                We will now start the test.

                Remember to answer as quickly as you possibly can while getting most correct.

                There will be no feedback on your performance during the test.

                When you are ready, press any key. """
      Next:
        AnyKey: {}


    Block:
      Start: ->
        Events:
          1:
            Action:
              execute: (context) ->
                context.set("task", "real")
          2:
            Text:
              position: "center"
              origin: "center"
              content: ["Get Ready!", "Press any key to start"]
            Next:
              AnyKey: ""

      End: ->
        console.log(@context.userData({taskName: "main", type: "response", name: "Receiver"}).get())
        Text:
          position: "center"
          origin: "center"
          content: ["End of block", "Press any key to continue"]
        Next:
          AnyKey: ""

    Trial: ->
      problem = @trial.Problem.split(/[\\x=-]/)
      x1 = problem[0]
      x2 = problem[1]
      op = if @trial.Operation is "Multiplication" then "x" else "-"

      Events:
        1:
          FixationCross:
            fill: "gray"
          Next:
            Timeout:
              duration: 500
        2:
          Question:
            #x: @screen.center.x
            #y: @screen.center.y
            position: "center"
            origin: "center"
            width: "33%"
            headerSize: "huge"
            question: x1 + " " + op + " " + x2 + " = " + "?"
            id: "problem" + @trial.ProblemID
            type: "textfield"
            react:
              change: (el) ->
                #$("#nextbutton").removeClass("disabled")
          Next:
            Receiver:
              id: "problem" + @trial.ProblemID
              signal: "change"
              timeout: 6000


      Feedback: ->
        console.log(@response)
        if @context.get("task") is "practice"
          message = if @response[1].event is "timeout"
            "Too Slow"
          else if @response[1].event.val is @response[1].trial.Answer
            "Correct!"
          else
            "Incorrect!"

          if @response[1].RT > 1200
            message += " -- Too slow!"
          Text:
            content: message
            position: "center"
            origin: "center"
          Next:
            Timeout:
              duration: 500

    Coda: ->

      Events:
        1:
          Action:
            execute: (context) ->
              dat = context.userData({taskName: "main", type: "response", name: "Receiver"}).get()
              logdat = for obj in dat
                BlockNumber: obj.blockNumber
                RT: obj.RT
                Response: obj.event.val
                Answer: obj.trial.Answer
                Operation: obj.trial.Operation
                Correct: obj.event.val == obj.trial.Answer
                ProblemID: obj.trial.ProblemID
                Problem: obj.trial.Problem
                Task: "Arithmetic"
              context.set("resultObject", logdat)

        2:
          Text:
            content: "The End"
            position: "center"
            origin: "center"
          Next:
            AnyKey: ""

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
      name: "practice"
      trialList: trialsPractice
      start: routines.StartPractice
      trial: routines.Trial
      end: routines.EndPractice
    #3: routines.EndPractice
    3: BlockSequence:
      name: "main"
      trialList: trialsPart1
      start: routines.Block.Start
      trial: routines.Trial
      end: routines.Block.End

    4: routines.Coda

context = new Psy.createContext()

@AST.start = (subjectNumber, sessionNumber) =>
  @context = context
  if subjectNumber?
    context.set("active_brain", true)
    context.set("subjectNumber", subjectNumber)

  if sessionNumber?
    context.set("sessionNumber", subjectNumber)

  @pres = new Psy.Presentation(trialsPart1, @AST.experiment, context)
  @pres.start()


