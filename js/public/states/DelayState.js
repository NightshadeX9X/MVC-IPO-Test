import State from "../core/State.js";
export default class DelayState extends State {
    constructor(stateStack, totalFrames) {
        super(stateStack);
        this.stateStack = stateStack;
        this.totalFrames = totalFrames;
        this.elapsedFrames = 0;
    }
    update(input) {
        if (this.remainingFrames <= 1) {
            console.log(this.stateStack.fromTop() === this);
            this.stateStack.pop();
        }
        this.elapsedFrames++;
    }
    get remainingFrames() {
        return this.totalFrames - this.elapsedFrames;
    }
}
