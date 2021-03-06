(function() {
  var AnyKey, KeyPress, KeyResponse, Q, Response, ResponseData, SpaceKey, i, keyTable, utils, _, _i, _j,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Q = require("q");

  Response = require("../stimresp").Response;

  ResponseData = require("../stimresp").ResponseData;

  utils = require("../utils");

  _ = require('lodash');

  keyTable = {
    8: 'backspace',
    9: 'tab',
    13: 'enter',
    16: 'shift',
    17: 'ctrl',
    18: 'alt',
    20: 'capslock',
    27: 'esc',
    32: 'space',
    33: 'pageup',
    34: 'pagedown',
    35: 'end',
    36: 'home',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    45: 'ins',
    46: 'del',
    91: 'meta',
    93: 'meta',
    224: 'meta',
    106: '*',
    107: '+',
    109: '-',
    110: '.',
    111: '/',
    186: ';',
    187: '=',
    188: ',',
    189: '-',
    190: '.',
    191: '/',
    192: '`',
    219: '[',
    220: "\\",
    221: ']'
  };

  for (i = _i = 1; _i < 20; i = ++_i) {
    keyTable[111 + i] = 'f' + i;
  }

  for (i = _j = 1; _j <= 9; i = ++_j) {
    keyTable[i + 96];
  }

  KeyResponse = (function(_super) {
    __extends(KeyResponse, _super);

    function KeyResponse() {
      return KeyResponse.__super__.constructor.apply(this, arguments);
    }

    KeyResponse.prototype.defaults = {
      keys: ['1', '2'],
      correct: ['1'],
      timeout: null
    };

    KeyResponse.prototype.createResponseData = function(timeStamp, startTime, Acc, char, noResponse) {
      var resp;
      if (noResponse == null) {
        noResponse = false;
      }
      resp = {
        keyTime: timeStamp,
        RT: timeStamp - startTime,
        accuracy: Acc,
        keyChar: char,
        nonResponse: noResponse
      };
      return resp;
    };

    KeyResponse.prototype.resolveOnTimeout = function(deferred, timeout, stimulus) {
      return utils.doTimer(timeout, (function(_this) {
        return function(diff) {
          var Acc, resp, timeStamp;
          if (!deferred.isResolved) {
            timeStamp = utils.getTimestamp();
            Acc = false;
            resp = _this.createResponseData(timeStamp, _this.startTime, Acc, '', true);
            resp = _.extend(_this.baseResponse(stimulus), resp);
            return deferred.resolve(new ResponseData(resp));
          }
        };
      })(this));
    };

    return KeyResponse;

  })(Response);

  KeyPress = (function(_super) {
    __extends(KeyPress, _super);

    function KeyPress() {
      return KeyPress.__super__.constructor.apply(this, arguments);
    }

    KeyPress.prototype.activate = function(context, stimulus) {
      var deferred, keyStream;
      this.startTime = utils.getTimestamp();
      deferred = Q.defer();
      keyStream = context.keypressStream();
      if (this.spec.timeout != null) {
        this.resolveOnTimeout(deferred, this.spec.timeout, stimulus);
      }
      keyStream.filter((function(_this) {
        return function(event) {
          var char;
          char = String.fromCharCode(event.keyCode);
          return _.contains(_this.spec.keys, char);
        };
      })(this)).take(1).onValue((function(_this) {
        return function(filtered) {
          var Acc, resp, timeStamp;
          timeStamp = utils.getTimestamp();
          Acc = _.contains(_this.spec.correct, String.fromCharCode(filtered.keyCode));
          resp = _this.createResponseData(timeStamp, _this.startTime, Acc, String.fromCharCode(filtered.keyCode));
          resp = _.extend(_this.baseResponse(stimulus), resp);
          return deferred.resolve(new ResponseData(resp));
        };
      })(this));
      return deferred.promise;
    };

    return KeyPress;

  })(KeyResponse);

  exports.KeyPress = KeyPress;

  SpaceKey = (function(_super) {
    __extends(SpaceKey, _super);

    function SpaceKey() {
      return SpaceKey.__super__.constructor.apply(this, arguments);
    }

    SpaceKey.prototype.defaults = {
      timeout: null
    };

    SpaceKey.prototype.activate = function(context, stimulus) {
      var deferred, keyStream;
      this.startTime = utils.getTimestamp();
      deferred = Q.defer();
      keyStream = context.keypressStream();
      keyStream.filter((function(_this) {
        return function(event) {
          return event.keyCode === 32;
        };
      })(this)).take(1).onValue((function(_this) {
        return function(event) {
          var resp, timeStamp;
          timeStamp = utils.getTimestamp();
          resp = _this.baseResponse(stimulus);
          resp.name = "SpaceKey";
          resp.id = _this.id;
          resp.keyTime = timeStamp;
          resp.RT = timeStamp - _this.startTime;
          resp.keyChar = "space";
          return deferred.resolve(new ResponseData(resp));
        };
      })(this));
      return deferred.promise;
    };

    return SpaceKey;

  })(Response);

  AnyKey = (function(_super) {
    __extends(AnyKey, _super);

    function AnyKey() {
      return AnyKey.__super__.constructor.apply(this, arguments);
    }

    AnyKey.prototype.activate = function(context, stimulus) {
      var deferred, keyStream;
      this.startTime = utils.getTimestamp();
      deferred = Q.defer();
      keyStream = context.keypressStream();
      keyStream.take(1).onValue((function(_this) {
        return function(event) {
          var resp, timeStamp;
          timeStamp = utils.getTimestamp();
          resp = _this.baseResponse(stimulus);
          resp.name = "AnyKey";
          resp.id = _this.id;
          resp.keyTime = timeStamp;
          resp.RT = timeStamp - _this.startTime;
          resp.keyChar = String.fromCharCode(event.keyCode);
          return deferred.resolve(new ResponseData(resp));
        };
      })(this));
      return deferred.promise;
    };

    return AnyKey;

  })(Response);

  exports.SpaceKey = SpaceKey;

  exports.AnyKey = AnyKey;

}).call(this);
