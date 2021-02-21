import Events from "../util/Events.js";
import { New, Mixin } from "../util/functions.js";
import { Preloadable, Renderable, Updatable } from "./Attributes.js";
import StateStack from "./StateStack.js";
class State {
    constructor(...args) {
        this.stateStack = null;
        this.subStateStack = new StateStack(this.stateStack.game, this);
        this.evtHandler = New(Events.Handler);
        return New(State, ...args);
    }
    static construct(stateStack) {
        Renderable.construct.call(this);
        Updatable.construct.call(this);
        Preloadable.construct.call(this);
        this.stateStack = stateStack;
        this.subStateStack = new StateStack(this.stateStack.game, this);
        this.evtHandler = New(Events.Handler);
        return this;
    }
    render(ctx) {
        this.subStateStack.render(ctx);
    }
    update(input) {
        this.subStateStack.update(input);
    }
}
Mixin.apply(State, [Renderable, Updatable, Preloadable]);
export default State;
