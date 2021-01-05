import RoamState from "./states/RoamState.js";
export default class StateStack {
    constructor() {
        this.states = [];
        this.push(new RoamState());
    }
    async push(s) {
        this.states.push(s);
        await this.top?.preload();
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
    async preload() {
        for await (let s of this.states) {
            await s.preload();
        }
    }
    update() {
        this.states.filter(s => s.forceUpdate || s === this.top).forEach(s => s.update());
    }
    render(renderer) {
        this.states.forEach(s => s.render(renderer));
    }
}
