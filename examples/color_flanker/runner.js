// Generated by CoffeeScript 1.7.1
(function() {
  var colorSampler, context, factorSet, fnode, trials, _;

  _ = Psy._;

  this.ColorFlanker = {};

  this.ColorFlanker.experiment = {
    Routines: {
      Prelude: {
        Events: {
          1: {
            Markdown: "\nWelcome to the Experiment!\n==========================\n\nThis a simple task.\n\nOn every trial a central square will appear surrounded by two flanking squares.\nYour goal is to focus on the central square and make a judgment about its color.\nYou should ignore the color of the flanking squares.\n\n  * If the central square is RED or GREEN, press the '1' key.\n\n  * If the central square is YELLOW or BLUE press the '2' key.\n\n  * If your response is correct, the screen will briefly turn green.\n\n  * If your response is incorrect, the screen will briefly turn red.\n\nPress any key to continue\n-------------------------\n",
            Next: {
              AnyKey: ""
            }
          }
        }
      },
      Block: {
        Start: function() {
          return {
            Text: {
              position: "center",
              origin: "center",
              content: ["Get Ready for Block " + this.blockNumber + "!", "Press Space Bar to start"]
            },
            Next: {
              SpaceKey: ""
            }
          };
        },
        End: function() {
          return {
            Text: {
              position: "center",
              origin: "center",
              content: ["End of Block " + this.blockNumber, "Press any key to continue"]
            },
            Next: {
              AnyKey: ""
            }
          };
        }
      },
      Trial: function() {
        var diameter;
        diameter = 170;
        return {
          Background: {
            Blank: {
              fill: "gray"
            },
            CanvasBorder: {
              stroke: "black"
            }
          },
          Events: {
            1: {
              FixationCross: {
                fill: "black"
              },
              Next: {
                Timeout: {
                  duration: 1000
                }
              }
            },
            2: {
              Group: {
                elements: [
                  {
                    Rectangle: {
                      x: this.screen.center.x - 200,
                      y: this.screen.center.y,
                      origin: "center",
                      fill: this.trial.flankerColor,
                      width: diameter,
                      height: diameter
                    }
                  }, {
                    Rectangle: {
                      x: this.screen.center.x,
                      y: this.screen.center.y,
                      origin: "center",
                      fill: this.trial.centerColor,
                      width: diameter,
                      height: diameter
                    }
                  }, {
                    Rectangle: {
                      x: this.screen.center.x + 200,
                      y: this.screen.center.y,
                      origin: "center",
                      fill: this.trial.flankerColor,
                      width: diameter,
                      height: diameter
                    }
                  }
                ]
              },
              Next: {
                KeyPress: {
                  id: "answer",
                  keys: ['1', '2'],
                  correct: this.trial.centerColor === "red" || this.trial.centerColor === "green" ? '1' : '2',
                  timeout: 1000
                }
              }
            }
          },
          Feedback: function() {
            var dlog, el, event;
            dlog = this.context.get("datalog");
            event = this.context.trialData().filter({
              id: "answer"
            }).get()[0];
            el = _.pick(event, ["RT", "accuracy", "trialNumber", "keyChar"]);
            el.centerColor = event.trial.centerColor;
            el.flanker = event.trial.flanker;
            el.flankerColor = event.trial.flankerColor;
            dlog.push(el);
            return {
              Text: {
                content: this.response[1].accuracy ? "correct!" : "incorrect!",
                fontSize: 40,
                position: "center",
                origin: "center"
              },
              Next: {
                Timeout: {
                  duration: 200
                }
              }
            };
          }
        };
      },
      Coda: {
        Events: {
          1: {
            Text: {
              position: "center",
              origin: "center",
              content: "The End",
              fontSize: 200
            },
            Next: {
              Timeout: {
                duration: 5000
              }
            }
          }
        }
      },
      Save: function() {
        return {
          Action: {
            execute: function(context) {
              var logdat;
              if (context.get("active_brain")) {
                logdat = context.get("resultObject");
                return $.ajax({
                  type: "POST",
                  url: "/results",
                  data: JSON.stringify(logdat),
                  contentType: "application/json"
                });
              }
            }
          }
        };
      }
    },
    Flow: function(routines) {
      return {
        1: routines.Prelude,
        2: {
          BlockSequence: {
            trialList: trials,
            start: routines.Block.Start,
            trial: routines.Trial,
            end: routines.Block.End
          }
        },
        3: routines.Coda
      };
    }
  };

  context = new Psy.createContext();

  factorSet = {
    flanker: {
      levels: ["congruent", "incongruent"]
    },
    centerColor: {
      levels: ["red", "green", "blue", "yellow"]
    }
  };

  colorSampler = new Psy.ReplacementSampler(["red", "green", "blue", "yellow"]);

  fnode = Psy.FactorSetNode.build(factorSet);

  trials = fnode.trialList(1, 1);

  trials = trials.bind(function(record) {
    return {
      flankerColor: Psy.match(record.flanker, {
        congruent: record.centerColor,
        incongruent: function() {
          return Psy.match(record.centerColor, {
            red: Psy.oneOf(["blue", "yellow"]),
            green: Psy.oneOf(["blue", "yellow"]),
            blue: Psy.oneOf(["red", "green"]),
            yellow: Psy.oneOf(["red", "green"])
          });
        }
      })
    };
  });

  trials.shuffle();

  ColorFlanker.start = (function(_this) {
    return function(subjectNumber, sessionNumber) {
      context.set("datalog", []);
      _this.pres = new Psy.Presentation(trials, _this.ColorFlanker.experiment, context);
      return _this.pres.start();
    };
  })(this);

}).call(this);
