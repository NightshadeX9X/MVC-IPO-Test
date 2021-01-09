export default class Controller {
    constructor(element) {
        this.element = element;
        this.keyDown = Symbol('key down');
        this.keyUp = Symbol('key up');
        this.keyStates = new Map();
    }
    start() {
        this.element.onkeydown = e => {
            this.keyStates.set(e.key, this.keyDown);
        };
        this.element.onkeyup = e => {
            this.keyStates.set(e.key, this.keyUp);
        };
    }
    keyIsDown(key) {
        return this.keyStates.get(key) === this.keyDown;
    }
}
