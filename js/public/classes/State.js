import StateStack from "./StateStack.js";
export default class State {
    constructor(stateStack) {
        this.stateStack = stateStack;
        this.toUpdate = null;
        this.toRender = null;
        this.toPreload = null;
        this.substates = new StateStack(this.stateStack.loader);
        this.poppedEvent = new Event('popped');
        this.evtSource = new EventTarget();
        this.onPop = () => { };
    }
    async pop() {
        return new Promise((res, rej) => {
            this.evtSource.addEventListener('popped', () => {
                res();
            });
        });
    }
}
