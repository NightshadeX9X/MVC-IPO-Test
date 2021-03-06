import Events from "../util/Events.js";
var Input = /** @class */ (function () {
    function Input() {
        this.keyStates = new Map();
        this.evtHandler = new Events.Handler();
        this.specialKeys = {
            CTRL: false,
            SHIFT: false,
            ALT: false
        };
        this.preventDefault = true;
    }
    Input.prototype.start = function (el) {
        var _this = this;
        el.addEventListener('keydown', function (e) {
            if (_this.preventDefault)
                e.preventDefault();
            if (!_this.keyIsDown(e.key)) {
                _this.evtHandler.dispatchEvent('keypress', e);
            }
            _this.keyStates.set(e.key, Input.keyDownSymbol);
            _this.updateSpecialKeys(e);
        });
        el.addEventListener('keyup', function (e) {
            if (_this.preventDefault)
                e.preventDefault();
            if (_this.keyIsDown(e.key)) {
                _this.evtHandler.dispatchEvent('keyrelease', e);
            }
            _this.keyStates.set(e.key, Input.keyUpSymbol);
            _this.updateSpecialKeys(e);
        });
    };
    Input.prototype.updateSpecialKeys = function (e) {
        this.specialKeys.SHIFT = e.shiftKey;
        this.specialKeys.ALT = e.altKey;
        this.specialKeys.CTRL = e.ctrlKey;
    };
    Input.prototype.keyIsDown = function (key) {
        return this.keyStates.get(key) === Input.keyDownSymbol;
    };
    Object.defineProperty(Input.prototype, "directionKeyStates", {
        get: function () {
            var states = {
                UP: false,
                LEFT: false,
                RIGHT: false,
                DOWN: false,
            };
            this.keyStates.forEach(function (symbol, key) {
                if (symbol === Input.keyUpSymbol)
                    return;
                if (key === "w" || key === "ArrowUp")
                    states.UP = true;
                if (key === "a" || key === "ArrowLeft")
                    states.LEFT = true;
                if (key === "s" || key === "ArrowDown")
                    states.DOWN = true;
                if (key === "d" || key === "ArrowRight")
                    states.RIGHT = true;
            });
            return states;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Input.prototype, "interactionKey", {
        get: function () {
            return this.keyIsDown(' ') || this.keyIsDown('Enter');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Input.prototype, "escapeKey", {
        get: function () {
            return this.keyIsDown('Escape') || this.keyIsDown('Return');
        },
        enumerable: false,
        configurable: true
    });
    Input.keyDownSymbol = Symbol('key down');
    Input.keyUpSymbol = Symbol('key up');
    return Input;
}());
export default Input;
