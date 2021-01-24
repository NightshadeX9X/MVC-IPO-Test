export default class Input {
    constructor() {
        this.keyStates = new Map();
    }
    start(el) {
        el.addEventListener('keydown', e => {
            e.preventDefault();
            this.keyStates.set(e.key, Input.keyDownSymbol);
            // console.log("keydown", this.keyStates.get((e as KeyboardEvent).key))
        });
        el.addEventListener('keyup', e => {
            e.preventDefault();
            this.keyStates.set(e.key, Input.keyUpSymbol);
            // console.log("keyup", this.keyStates.get((e as KeyboardEvent).key))
        });
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
}
Input.keyDownSymbol = Symbol('key down');
Input.keyUpSymbol = Symbol('key up');
