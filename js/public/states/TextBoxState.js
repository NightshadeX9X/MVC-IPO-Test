var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import State from "../core/State.js";
import TextBoxElement from "../UI/TextBox.js";
import { Parents } from "../util/functions.js";
var TextBoxState = /** @class */ (function () {
    function TextBoxState(stateStack, originalSentence) {
        var _this = this;
        this.stateStack = stateStack;
        this.originalSentence = originalSentence;
        this.sentence = this.originalSentence;
        this.location = [0, 0, 0];
        this.element = new TextBoxElement(["", "", ""]);
        this.index = 0;
        this.charsPassed = 0;
        this.toTick = true;
        State.call(this, stateStack);
        console.log(this.originalSentence.length);
        document.body.appendChild(this.element);
        var enterEvtListener = this.stateStack.game.input.evtHandler.addEventListener('keypress', function (e) {
            if (e.key === " ") {
                if (_this.charsPassed >= _this.originalSentence.length - 1) {
                    _this.stateStack.pop();
                }
                else if (_this.location[2] >= TextBoxElement.maxLength && _this.location[1] >= 2) {
                    if (_this.location[2] >= _this.totalParas)
                        _this.stateStack.pop();
                    else {
                        _this.location[0]++;
                        _this.location[1] = 0;
                        _this.location[2] = 0;
                        _this.element.updateRow(0, "");
                        _this.element.updateRow(1, "");
                        _this.element.updateRow(2, "");
                        _this.toTick = true;
                    }
                }
                else {
                    _this.location[2] = TextBoxElement.maxLength;
                    var row = _this.row.split("").map(function (char, i) {
                        var filter = function () {
                            var index = _this.location[1] * TextBoxElement.maxLength + i;
                            return _this.toDrawChar(char, index);
                        };
                        if (!filter())
                            return;
                        var red = false;
                        var before = 0;
                        while (!red) {
                            var index = _this.location[1] * TextBoxElement.maxLength + i - before;
                            if (_this.paragraph.charAt(index) === " " || _this.paragraph.charAt(index) === "$")
                                break;
                            var previousChars = _this.paragraph.slice(index - 2, index).split("");
                            if (previousChars[0] === "%" && previousChars[1] === "%") {
                                red = true;
                            }
                            before++;
                        }
                        if (red)
                            return "<span class=\"red\">" + char + "</span>";
                        return char;
                    }).join("");
                    console.log(row);
                    _this.element.updateRow(_this.location[1], row);
                }
            }
        });
        this.evtHandler.addEventListener('remove', function () {
            _this.element.remove();
            _this.stateStack.game.input.evtHandler.removeEventListener(enterEvtListener);
        });
        console.log(this.paragraph);
    }
    TextBoxState.prototype.update = function (input) {
        this.tick(input);
    };
    Object.defineProperty(TextBoxState.prototype, "totalParas", {
        get: function () {
            return Math.floor(this.originalSentence.length / (TextBoxElement.maxLength * 3)) + 1;
        },
        enumerable: false,
        configurable: true
    });
    TextBoxState.prototype.toDrawChar = function (char, index) {
        if (char !== "[" && char !== "]" && char !== "%" &&
            this.paragraph.charAt(index - 1) !== "[" &&
            this.paragraph.charAt(index + 1) !== "]") {
            return true;
        }
        return false;
    };
    TextBoxState.prototype.tick = function (input) {
        if (!this.toTick)
            return;
        if (this.charsPassed >= this.originalSentence.length - 1) {
            this.toTick = false;
        }
        {
            var before = 0;
            var red = false;
            while (!red) {
                var index = this.location[1] * TextBoxElement.maxLength + this.location[2] - before;
                if (this.paragraph.charAt(index) === " " || this.paragraph.charAt(index) === "$")
                    break;
                var previousChars = this.paragraph.slice(index - 2, index).split("");
                if (previousChars[0] === "%" && previousChars[1] === "%") {
                    red = true;
                }
                before++;
            }
            if (red) {
                console.log("red");
                if (this.toDrawChar(this.char, this.location[1] * TextBoxElement.maxLength + this.location[2])) {
                    this.element.updateRow(this.location[1], this.element.text[this.location[1]] + ("<span class=\"red\">" + this.char + "</span>"));
                }
            }
            else {
                if (this.toDrawChar(this.char, this.location[1] * TextBoxElement.maxLength + this.location[2])) {
                    this.element.updateRow(this.location[1], this.element.text[this.location[1]] + this.char);
                }
            }
        }
        this.location[2]++;
        if (this.location[2] >= TextBoxElement.maxLength) {
            if (this.location[1] < 2) {
                this.location[1]++;
                this.location[2] = 0;
            }
            else {
                this.toTick = false;
                return;
            }
        }
        this.charsPassed++;
    };
    Object.defineProperty(TextBoxState.prototype, "paragraph", {
        get: function () {
            var start = this.location[0] * TextBoxElement.maxLength * 3;
            var paragraph = this.originalSentence.slice(start, start + TextBoxElement.maxLength * 3);
            return paragraph;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextBoxState.prototype, "row", {
        get: function () {
            var start = this.location[1] * TextBoxElement.maxLength;
            var row = this.paragraph.slice(start, start + TextBoxElement.maxLength);
            return row;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextBoxState.prototype, "char", {
        get: function () {
            var char = this.row.charAt(this.location[2]);
            return char;
        },
        enumerable: false,
        configurable: true
    });
    TextBoxState = __decorate([
        Parents(State)
    ], TextBoxState);
    return TextBoxState;
}());
export default TextBoxState;
