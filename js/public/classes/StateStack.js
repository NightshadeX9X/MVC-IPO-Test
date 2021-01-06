import RoamState from "./states/RoamState.js";
export default class StateStack {
    constructor(loader) {
        this.loader = loader;
        this.states = [];
        this.push(new RoamState(this, this.loader));
    }
    async push(s) {
        this.states.push(s);
        await this.top?.preload(this.loader);
    }
    pop() {
        return this.states.pop();
    }
    get top() {
        return this.states[this.states.length - 1];
    }
    get bottom() {
        return this.states[0];
    }
    async preload(loader) {
        this.loader = loader;
        for await (let s of this.states) {
            await s.preload(loader);
        }
    }
    update(input) {
        this.states.filter(s => s.forceUpdate || s === this.top).forEach(s => s.update(input));
    }
    render(renderer) {
        this.states.forEach(s => s.render(renderer));
    }
}
