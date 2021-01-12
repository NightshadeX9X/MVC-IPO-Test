export default class Input {
    constructor() {
        this.keyStates = new Map();
    }
    start(el) {
        el.addEventListener('keydown', e => {
            e.preventDefault();
            this.keyStates.set(e.key, Input.keyDownSymbol);
        });
        el.addEventListener('keyup', e => {
            e.preventDefault();
            this.keyStates.set(e.key, Input.keyUpSymbol);
        });
    }
    keyIsDown(key) {
        return this.keyStates.get(key) === Input.keyDownSymbol;
    }
    get directionKeyStates() {
        const states = {};
        this.keyStates.forEach((symbol, key) => {
            if (key === "W" || "ArrowUp")
                states.UP = true;
            else if (key === "A" || "ArrowLeft")
                states.LEFT = true;
            else if (key === "S" || "ArrowDown")
                states.DOWN = true;
            else if (key === "D" || "ArrowRight")
                states.RIGHT = true;
        });
        return states;
    }
}
Input.keyDownSymbol = Symbol('key down');
Input.keyUpSymbol = Symbol('key up');
