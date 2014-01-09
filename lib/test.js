(function() {
  var args, trial, x;

  x = [
    function() {
      return {
        M1: {
          a: 22
        }
      };
    }, function() {
      return {
        M1: {
          a: 44
        }
      };
    }
  ];

  trial = {
    Trial: function() {
      return {
        Hello: this.y === 1 ? 25 : 45
      };
    }
  };

  args = {
    y: 1
  };

  console.log(trial.Trial.apply(args));

}).call(this);

/*
//# sourceMappingURL=../lib/canvas/test.js.map
*/