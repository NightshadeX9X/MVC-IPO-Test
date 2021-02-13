import Events from "../util/Events.js";
import StateStack from "./StateStack.js";
export default class State {
    constructor(stateStack) {
        this.stateStack = stateStack;
        this.toPreload = null;
        this.toUpdate = null;
        this.toRender = null;
        this.subStateStack = new StateStack(this, this.stateStack.game);
        this.evtHandler = new Events.Handler();
    }
    async preload(loader) {
        await this.subStateStack.preload(loader);
    }
    update(input) {
        this.subStateStack.update(input);
    }
    render(ctx) {
        this.subStateStack.render(ctx);
    }
    pop() {
        return new Promise((res, rej) => {
            this.evtHandler.addEventListener('popped', () => {
                res();
            });
        });
    }
}
