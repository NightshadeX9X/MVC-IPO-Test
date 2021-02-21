import State from "../core/State.js";
import { Mixin, New } from '../util/functions.js';
class DelayState {
    constructor(...args) {
        this.totalFrames = null;
        this.elapsedFrames = null;
        return New(DelayState, ...args);
    }
    static construct(stateStack, totalFrames = 60) {
        State.construct.call(this, stateStack);
        this.totalFrames = totalFrames;
        this.elapsedFrames = 0;
        return this;
    }
    get remainingFrames() {
        return this.totalFrames - this.elapsedFrames - 1;
    }
    update() {
        if (this.remainingFrames <= 0) {
            this.remove();
            return;
        }
        this.elapsedFrames++;
    }
}
Mixin.apply(DelayState, [State]);
export default DelayState;
