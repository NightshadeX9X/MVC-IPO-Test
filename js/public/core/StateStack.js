import Events from '../util/Events.js';
import { ArrayUtil } from "../util/ObjectMethods.js";
export default class StateStack {
    constructor(parent, game) {
        this.parent = parent;
        this.game = game;
        this.states = [];
        this.evtHandler = new Events.Handler();
    }
    async preload(loader) {
        const toPreload = this.states.filter((state) => state.preload && this.toPreloadState(state));
        // await Promise.all(toPreload.map(state => (state as any).preload(loader)));
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
    stateIsLinkedToIndependentlyUpdatable(state) {
        return this.states.filter(s => this.stateIsIndependentlyUpdatable(s)).some(s => s.linkedStates.includes(state));
    }
    stateIsIndependentlyUpdatable(state) {
        if (state.toUpdate !== null)
            return state.toUpdate;
        return this.stateIsAboveAllBlocking(state);
    }
    stateIsAboveAllBlocking(state) {
        return ArrayUtil.last(this.states.filter(s => s === state || state.blocking)) === state;
    }
    toUpdateState(state) {
        return this.stateIsIndependentlyUpdatable(state) || this.stateIsLinkedToIndependentlyUpdatable(state);
    }
    toRenderState(state) {
        if (typeof state.toRender === "boolean")
            return state.toRender;
        return true;
    }
    get topBlockingState() {
        return ArrayUtil.invert(this.states).find(s => s.blocking);
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
