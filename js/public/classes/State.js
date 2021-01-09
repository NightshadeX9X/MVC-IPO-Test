export default class State {
    constructor(stateStack) {
        this.stateStack = stateStack;
        this.forceUpdate = null;
        this.toRender = true;
    }
}
