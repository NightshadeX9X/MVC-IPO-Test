import StateStack from "./StateStack.js";
export default class State {
    constructor(stateStack) {
        this.stateStack = stateStack;
        this.toUpdate = null;
        this.toRender = null;
        this.toPreload = null;
        this.substates = new StateStack(this.stateStack.game);
        this.popEvent = new Event('pop');
        this.evtSource = new EventTarget();
    }
    async pop() {
        return new Promise((res, rej) => {
            this.evtSource.addEventListener('pop', () => {
                res();
            });
        });
    }
}
