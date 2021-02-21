import Events from "../util/Events.js";
import { New } from "../util/functions.js";
export default class Input {
    constructor() {
        this.evtHandler = New(Events.Handler);
        this.preventDefault = true;
        this.keyStates = new Map();
        this.specialKeys = {
            CTRL: false,
            SHIFT: false,
            ALT: false
        };
        return New(Input);
    }
    static construct() {
        this.evtHandler = New(Events.Handler);
        this.keyStates = new Map();
        this.specialKeys = {
            CTRL: false,
            SHIFT: false,
            ALT: false
        };
        this.preventDefault = false;
        return this;
    }
    start(el) {
        el.addEventListener('keydown', e => {
            if (this.preventDefault)
                e.preventDefault();
            if (!this.keyIsDown(e.key)) {
                this.evtHandler.dispatchEvent('keypress', e.key);
            }
            this.keyStates.set(e.key, Input.keyDownSymbol);
            this.updateSpecialKeys(e);
        });
        el.addEventListener('keyup', e => {
            if (this.preventDefault)
                e.preventDefault();
            if (this.keyIsDown(e.key)) {
                this.evtHandler.dispatchEvent('keyrelease', e.key);
            }
            this.keyStates.set(e.key, Input.keyUpSymbol);
            this.updateSpecialKeys(e);
        });
    }
    updateSpecialKeys(e) {
        this.specialKeys.SHIFT = e.shiftKey;
        this.specialKeys.ALT = e.altKey;
        this.specialKeys.CTRL = e.ctrlKey;
    }
    keyIsDown(key) {
        return this.keyStates.get(key) === Input.keyDownSymbol;
    }
    get directionKeyStates() {
        const states = {
            UP: false,
            LEFT: false,
            RIGHT: false,
            DOWN: false,
        };
        this.keyStates.forEach((symbol, key) => {
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
    }
    get interactionKey() {
        return this.keyIsDown(' ') || this.keyIsDown('Enter');
    }
    get escapeKey() {
        return this.keyIsDown('Escape') || this.keyIsDown('Return');
    }
}
Input.keyDownSymbol = Symbol('key down');
Input.keyUpSymbol = Symbol('key up');
