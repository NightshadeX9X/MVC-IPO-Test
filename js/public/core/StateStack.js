import Events from "../util/Events.js";
import { insertIntoArray, Mixin, New } from "../util/functions.js";
import { Renderable, Updatable, Preloadable } from "./Attributes.js";
class StateStack {
    constructor(...args) {
        this.game = null;
        this.parent = null;
        this.states = null;
        this.evtHandler = New(Events.Handler);
        return New(StateStack, ...args);
    }
    static construct(game, parent) {
        Renderable.construct.call(this);
        Updatable.construct.call(this);
        Preloadable.construct.call(this);
        this.game = game;
        this.parent = parent;
        this.states = [];
        this.evtHandler = New(Events.Handler);
        return this;
    }
    isIndependentlyUpdatable(state) {
        if (!this.states.includes(state))
            return false;
        if (state.toUpdate !== null)
            return state.toUpdate;
        return state === this.fromTop();
    }
    toUpdateState(state) {
        return this.isIndependentlyUpdatable(state);
    }
    toRenderState(state) {
        if (!this.states.includes(state))
            return false;
        if (state.toUpdate !== null)
            return state.toUpdate;
        return true;
    }
    toPreloadState(state) {
        return this.states.includes(state);
    }
    fromTop(n = 0) {
        return this.states[this.states.length - (n + 1)];
    }
    fromBottom(n = 0) {
        return this.states[n];
    }
    render(ctx) {
        this.states.filter(state => this.toRenderState(state)).forEach(state => {
            state.render(ctx);
        });
    }
    async preload(loader) {
        await Promise.all(this.states.filter(state => this.toPreloadState(state)).map(state => state.preload(loader)));
    }
    update(input) {
        this.states.filter(state => this.toUpdateState(state)).forEach(state => {
            state.update(input);
        });
    }
    async insertState(state, index) {
        await state.preload(this.game.loader);
        insertIntoArray(this.states, index, [state]);
        state.evtHandler.dispatchEvent('insert', this);
        this.evtHandler.dispatchEvent('state insert', state);
    }
    async push(state) {
        await state.preload(this.game.loader);
        this.states.push(state);
        state.evtHandler.dispatchEvent('insert', this);
        this.evtHandler.dispatchEvent('state insert', state);
    }
}
Mixin.apply(StateStack, [Renderable, Updatable, Preloadable]);
export default StateStack;
