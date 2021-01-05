export default class Input {
    constructor() {
        this.keysPressed = new Map();
        this.keysDown = new Map();
    }
    start(document) {
        document.addEventListener('keydown', e => {
            this.keysDown.set(e.key, true);
        });
        document.addEventListener('keypress', e => {
            this.keysPressed.set(e.key, true);
        });
        document.addEventListener('keyup', e => {
            this.keysDown.set(e.key, false);
            this.keysPressed.set(e.key, false);
        });
    }
    keyIsDown(key) {
        return Boolean(this.keysDown.get(key));
    }
    keyIsPressed(key) {
        return Boolean(this.keysPressed.get(key));
    }
}
