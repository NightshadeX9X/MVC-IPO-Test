import Events from "../util/Events.js";
import { New, Mixin } from "../util/functions.js";
import { Preloadable, Renderable, Updatable } from "./Attributes.js";
import StateStack from "./StateStack.js";
class State {
    constructor(...args) {
        return New(State, ...args);
    }
    static construct(stateStack) {
        Renderable.construct.call(this);
        Updatable.construct.call(this);
        Preloadable.construct.call(this);
        this.stateStack = stateStack;
        this.subStateStack = new StateStack(this.stateStack.game, this);
        this.evtHandler = new Events.Handler();
        this.blocking = true;
        this.id = this.stateStack.game.stateIDGen.generate();
        this.linkedStates = [];
        return this;
    }
    render(ctx) {
        this.subStateStack.render(ctx);
    }
    update(input) {
        this.subStateStack.update(input);
    }
    remove() {
        this.stateStack.remove(this.stateStack.states.indexOf(this));
    }
    async waitForRemoval() {
        return new Promise((res, rej) => {
            this.evtHandler.addEventListener('remove', () => {
                res();
            });
        });
    }
    get index() {
        return (this.stateStack?.states.indexOf(this)) ?? -1;
    }
}
Mixin.apply(State, [Renderable, Updatable, Preloadable]);
export default State;
