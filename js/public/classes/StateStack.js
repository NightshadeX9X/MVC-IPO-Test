export default class StateStack {
    constructor(loader) {
        this.loader = loader;
        this.states = [];
        this.toPreload = true;
        this.toUpdate = true;
        this.toRender = true;
    }
    async preload() {
        await Promise.all(this.states.map(s => s.preload(this.loader)));
    }
    get statesToUpdate() {
        return this.states.filter(s => {
            if (s.toUpdate !== null)
                return s.toUpdate;
            return s === this.fromTop();
        });
    }
    init() {
        this.states.forEach(s => {
            s.init();
        });
    }
    update(input) {
        this.statesToUpdate.forEach(s => s.update(input));
    }
    render(ctx) {
        this.states.forEach(s => s.render(ctx));
    }
    fromTop(n = 0) {
        return this.states[this.states.length - 1 - n];
    }
    fromBottom(n = 0) {
        return this.states[n];
    }
    async push(s) {
        await s.preload(this.loader);
        s.init();
        this.states.push(s);
    }
    pop() {
        return this.states.pop();
    }
}
