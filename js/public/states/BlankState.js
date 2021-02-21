import State from "../core/State.js";
import { Mixin, New } from '../util/functions.js';
class BlankState {
    constructor(...args) {
        return New(BlankState, ...args);
    }
    static construct(stateStack) {
        State.construct.call(this, stateStack);
        return this;
    }
}
Mixin.apply(BlankState, [State]);
export default BlankState;
