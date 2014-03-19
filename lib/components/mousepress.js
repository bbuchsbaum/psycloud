(function() {
  var MousePress, Q, Response, ResponseData, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Q = require("q");

  Response = require("../stimresp").Response;

  ResponseData = require("../stimresp").ResponseData;

  utils = require("../utils");

  MousePress = (function(_super) {
    __extends(MousePress, _super);

    function MousePress() {
      return MousePress.__super__.constructor.apply(this, arguments);
    }

    MousePress.prototype.activate = function(context) {
      var deferred, mouse, myname;
      this.startTime = utils.getTimestamp();
      myname = this.name;
      deferred = Q.defer();
      mouse = context.mousepressStream();
      mouse.stream.take(1).onValue((function(_this) {
        return function(event) {
          var resp, timestamp;
          timestamp = utils.getTimestamp();
          mouse.stop();
          resp = {
            name: myname,
            id: _this.id,
            KeyTime: timestamp,
            RT: timestamp - _this.startTime,
            Accuracy: Acc
          };
          return deferred.resolve(new ResponseData(resp));
        };
      })(this));
      return deferred.promise;
    };

    return MousePress;

  })(Response);

  exports.MousePress = MousePress;

}).call(this);
