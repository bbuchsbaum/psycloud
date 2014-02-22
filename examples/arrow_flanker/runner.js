// Generated by CoffeeScript 1.7.1
(function() {
  var factorSet, fnode, pres, _;

  this.context = new Psy.createContext();

  _ = Psy._;

  factorSet = {
    flanker: {
      levels: ["congruent", "incongruent"]
    },
    centerArrow: {
      levels: ["left", "right"]
    }
  };

  fnode = Psy.FactorSetNode.build(factorSet);

  this.trials = fnode.trialList(5, 5);

  this.trials = this.trials.bind(function(record) {
    return {
      flankerArrow: Psy.match(record.flanker, {
        congruent: record.centerArrow,
        incongruent: function() {
          return Psy.match(record.centerArrow, {
            left: "right",
            right: "left"
          });
        }
      })
    };
  });

  console.log("trials", this.trials);

  this.trials.shuffle();

  window.display = {
    Display: {
      Prelude: {
        Events: {
          1: {
            Markdown: "\nWelcome to the Experiment!\n==========================\n\nOn every trial a central arrow will appear surrounded by arrows on either side.\nYour goal is to focus on the central arrow and decide whether it points left or right.\n\n  * If the central arrow points <-- left, press the 'g' key.\n\n  * If the central arrow points --> right, press the 'h' key.\n\n  * If your response is correct, the screen will briefly turn green.\n\n  * If your response is incorrect, the screen will briefly turn red.\n\n  * make your decision as fast as you can.\n\nPress any key to continue\n-------------------------\n",
            Next: {
              AnyKey: ""
            }
          }
        }
      },
      Block: {
        Start: function() {
          console.log("START BLOCK");
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
          console.log("END BLOCK");
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
        var arrowLen;
        arrowLen = 175;
        return {
          Background: {
            Blank: {
              fill: "white"
            },
            CanvasBorder: {
              stroke: "black"
            }
          },
          Events: {
            1: {
              FixationCross: {
                fill: "gray"
              },
              Next: {
                Timeout: {
                  duration: 1000
                }
              }
            },
            2: {
              Group: {
                stims: [
                  {
                    Arrow: {
                      x: this.screen.center.x - 2 * arrowLen - 20,
                      y: this.screen.center.y,
                      thickness: 35,
                      arrowSize: 75,
                      origin: "center",
                      fill: "black",
                      length: arrowLen,
                      direction: this.trial.flankerArrow
                    }
                  }, {
                    Arrow: {
                      x: this.screen.center.x - arrowLen - 10,
                      y: this.screen.center.y,
                      thickness: 35,
                      arrowSize: 75,
                      origin: "center",
                      fill: "black",
                      length: arrowLen,
                      direction: this.trial.flankerArrow
                    }
                  }, {
                    Arrow: {
                      x: this.screen.center.x,
                      y: this.screen.center.y,
                      thickness: 35,
                      arrowSize: 75,
                      origin: "center",
                      fill: "black",
                      length: arrowLen,
                      direction: this.trial.centerArrow
                    }
                  }, {
                    Arrow: {
                      x: this.screen.center.x + arrowLen + 10,
                      y: this.screen.center.y,
                      thickness: 35,
                      arrowSize: 75,
                      origin: "center",
                      fill: "black",
                      length: arrowLen,
                      direction: this.trial.flankerArrow
                    }
                  }, {
                    Arrow: {
                      x: this.screen.center.x + 2 * arrowLen + 20,
                      y: this.screen.center.y,
                      thickness: 35,
                      arrowSize: 75,
                      origin: "center",
                      fill: "black",
                      length: arrowLen,
                      direction: this.trial.flankerArrow
                    }
                  }
                ]
              },
              Next: {
                KeyPress: {
                  id: "answer",
                  keys: ['g', 'h'],
                  correct: this.trial.centerArrow === "left" ? 'g' : 'h',
                  timeout: 1500
                }
              }
            }
          },
          Feedback: function() {
            return {
              Blank: {
                fill: this.answer.Accuracy ? "green" : "red",
                opacity: .1
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
      }
    }
  };

  pres = new Psy.Presenter(trials, display.Display, context);

  pres.start();

}).call(this);
