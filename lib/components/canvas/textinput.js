(function() {
  var KStimulus, TextInput, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  utils = require("../../utils");

  KStimulus = require("../../stimresp").KineticStimulus;

  TextInput = (function(_super) {
    __extends(TextInput, _super);

    TextInput.prototype.defaults = {
      x: 100,
      y: 100,
      width: 200,
      height: 40,
      defaultValue: "",
      fill: "#FAF5E6",
      stroke: "#0099FF",
      strokeWidth: 1,
      content: ""
    };

    function TextInput(spec) {
      if (spec == null) {
        spec = {};
      }
      TextInput.__super__.constructor.call(this, spec);
      utils.disableBrowserBack();
    }

    TextInput.prototype.getChar = function(e) {
      if (e.keyCode !== 16) {
        if (e.keyCode >= 65 && e.keyCode <= 90) {
          if (e.shiftKey) {
            return String.fromCharCode(e.keyCode);
          } else {
            return String.fromCharCode(e.keyCode + 32);
          }
        } else if (e.keyCode >= 48 && e.keyCode <= 57) {
          return String.fromCharCode(e.keyCode);
        } else {
          switch (e.keyCode) {
            case 186:
              return ";";
            case 187:
              return "=";
            case 188:
              return ",";
            case 189:
              return "-";
            default:
              return "";
          }
        }
      } else {
        return String.fromCharCode(e.keyCode);
      }
    };

    TextInput.prototype.animateCursor = function(layer, cursor) {
      var flashTime;
      flashTime = 0;
      return new Kinetic.Animation((function(_this) {
        return function(frame) {
          if (frame.time > (flashTime + 500)) {
            flashTime = frame.time;
            if (cursor.getOpacity() === 1) {
              cursor.setOpacity(0);
            } else {
              cursor.setOpacity(1);
            }
            return layer.draw();
          }
        };
      })(this), layer);
    };

    TextInput.prototype.render = function(context, layer) {
      var cursor, cursorBlink, enterPressed, fsize, group, keyStream, text, textContent, textRect;
      textRect = new Kinetic.Rect({
        x: this.spec.x,
        y: this.spec.y,
        width: this.spec.width,
        height: this.spec.height,
        fill: this.spec.fill,
        cornerRadius: 4,
        lineJoin: "round",
        stroke: this.spec.stroke,
        strokeWidth: this.spec.strokeWidth
      });
      textContent = this.spec.content;
      fsize = .85 * this.spec.height;
      text = new Kinetic.Text({
        text: this.spec.content,
        x: this.spec.x + 2,
        y: this.spec.y - 5,
        height: this.spec.height,
        fontSize: fsize,
        fill: "black",
        padding: 10,
        align: "left"
      });
      cursor = new Kinetic.Rect({
        x: text.getX() + text.getWidth() - 7,
        y: this.spec.y + 5,
        width: 1.5,
        height: text.getHeight() - 10,
        fill: "black"
      });
      enterPressed = false;
      keyStream = context.keydownStream();
      keyStream.takeWhile((function(_this) {
        return function(x) {
          return enterPressed === false && !_this.stopped;
        };
      })(this)).onValue((function(_this) {
        return function(event) {
          var char;
          if (event.keyCode === 13) {
            return enterPressed = true;
          } else if (event.keyCode === 8) {
            textContent = textContent.slice(0, -1);
            text.setText(textContent);
            cursor.setX(text.getX() + text.getWidth() - 7);
            return layer.draw();
          } else if (text.getWidth() > textRect.getWidth()) {

          } else {
            char = _this.getChar(event);
            textContent += char;
            text.setText(textContent);
            cursor.setX(text.getX() + text.getWidth() - 7);
            return layer.draw();
          }
        };
      })(this));
      cursorBlink = this.animateCursor(layer, cursor);
      cursorBlink.start();
      group = new Kinetic.Group({});
      group.add(textRect);
      group.add(cursor);
      group.add(text);
      return layer.add(group);
    };

    return TextInput;

  })(KStimulus);

  exports.TextInput = TextInput;

}).call(this);
