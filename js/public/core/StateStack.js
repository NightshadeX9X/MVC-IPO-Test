import Events from '../util/Events.js';
export default class StateStack {
    constructor(parent, game) {
        this.parent = parent;
        this.game = game;
        this.states = [];
        this.evtHandler = new Events.Handler();
    }
    async preload(loader) {
        const toPreload = this.states.filter((state) => state.preload && this.toPreloadState(state));
        await Promise.all(toPreload.map(state => state.preload(loader)));
    }
    update(input) {
        this.states.filter((state) => state.update && this.toUpdateState(state)).forEach(state => state.update(input));
    }
    render(ctx) {
        this.states.filter((state) => state.render && this.toRenderState(state)).forEach(state => state.render(ctx));
    }
    fromTop(n = this.states.length - 1) {
        return this.states[n];
    }
    fromBottom(n = 0) {
        return this.states[n];
    }
    toPreloadState(state) {
        if (typeof state.toPreload === "boolean")
            return state.toPreload;
        return true;
    }
    toUpdateState(state) {
        if (typeof state.toUpdate === "boolean")
            return state.toUpdate;
        return this.fromTop() === state;
    }
    toRenderState(state) {
        if (typeof state.toRender === "boolean")
            return state.toRender;
        return true;
    }
    async push(state) {
        this.states.push(state);
        this.evtHandler.dispatchEvent('state pushed', state);
        state.evtHandler.dispatchEvent('pushed');
        if (this.toPreloadState(state))
            await state.preload(this.game.loader);
    }
    pop() {
        const state = this.states.pop();
        if (!state)
            return;
        this.evtHandler.dispatchEvent('state popped', state);
        state.evtHandler.dispatchEvent('popped');
    }
}
