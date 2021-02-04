import State from "../State.js";
export default class DelayState extends State {
    constructor(stateStack, totalFrames) {
        super(stateStack);
        this.stateStack = stateStack;
        this.totalFrames = totalFrames;
        this.frames = 0;
    }
    async preload(loader) {
    }
    init() {
    }
    update(input) {
        if (this.frames >= this.totalFrames) {
            this.stateStack.pop();
            return;
        }
        this.frames++;
    }
    render(ctx) {
    }
}
