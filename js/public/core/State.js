import { create, Mixin } from "../util/functions.js";
import { Renderable } from "./Attributes.js";
import StateStack from "./StateStack.js";
class State {
    constructor() {
        this.stateStack = null;
        this.subStateStack = null;
    }
    static construct(stateStack) {
        Renderable.construct.call(this);
        this.stateStack = stateStack;
        this.subStateStack = create(StateStack, this.stateStack.game, this);
        return this;
    }
}
Mixin.apply(State, [Renderable]);
export default State;
