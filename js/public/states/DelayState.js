import State from "../core/State.js";
class DelayState extends State {
    constructor(stateStack, totalFrames) {
        super(stateStack);
        this.stateStack = stateStack;
        this.totalFrames = totalFrames;
        this.elapsedFrames = 0;
    }
    update(input) {
        if (this.remainingFrames <= 1) {
            this.stateStack.pop();
        }
        this.elapsedFrames++;
    }
    get remainingFrames() {
        return this.totalFrames - this.elapsedFrames;
    }
}
(function (DelayState) {
    async function create(stateStack, frames) {
        const ds = new DelayState(stateStack, frames);
        await stateStack.push(ds);
        await ds.pop();
    }
    DelayState.create = create;
})(DelayState || (DelayState = {}));
export default DelayState;
