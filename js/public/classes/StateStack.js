export default class StateStack {
    constructor(loader) {
        this.loader = loader;
        this.states = [];
    }
    /**
     * Preloads the state, executes the init function of that state, and then adds it to the `this.states`.
     *
     * @memberof StateStack
     */
    async push(s) {
        await s.preload(this.loader);
        s.init();
        this.states = [...this.states, s];
    }
    pop() {
        return this.states.pop();
    }
    /**
     * Returns the top state from the stack if no argument provided. If an argument is provided, the nth state from the top (where n is that argument) is returned.
     *
     */
    top(nthFromTop = 0) {
        return this.states[this.states.length - (1 + nthFromTop)];
    }
    /**
     * Returns the bottom state from the stack if no argument provided. If an argument is provided, the nth state from the bottom (where n is that argument) is returned.
     *
     */
    bottom(nthFromBottom = 0) {
        return this.states[nthFromBottom];
    }
    async preload() {
        for (const s of this.states) {
            await s.preload(this.loader);
        }
    }
    init() {
        this.states.forEach(s => s.init());
    }
    update(controller) {
        this.states.forEach(s => {
            if (s.forceUpdate === false)
                return;
            if (s.forceUpdate === true)
                s.update(controller);
            if (s === this.top())
                s.update(controller);
        });
    }
    render(ctx) {
        this.states.forEach(s => {
            if (s.toRender === false)
                return;
            s.render(ctx);
        });
    }
}
