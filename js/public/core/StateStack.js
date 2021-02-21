import Events from "../util/Events.js";
import { insertIntoArray, Mixin, New } from "../util/functions.js";
import { Renderable, Updatable, Preloadable } from "./Attributes.js";
class StateStack {
    constructor(...args) {
        this.game = null;
        this.parent = null;
        this.states = null;
        this.evtHandler = null;
        return New(StateStack, ...args);
    }
    static construct(game, parent) {
        Renderable.construct.call(this);
        Updatable.construct.call(this);
        Preloadable.construct.call(this);
        this.game = game;
        this.parent = parent;
        this.states = [];
        this.evtHandler = new Events.Handler();
        return this;
    }
    isIndependentlyUpdatable(state) {
        if (!this.states.includes(state))
            return false;
        if (state.toUpdate !== null)
            return state.toUpdate;
        return this.states.filter(s => s.blocking).reverse()[0] === state;
    }
    isLinkedToIndependentlyUpdatable(state) {
        return this.states.filter(s => this.isIndependentlyUpdatable(s)).some(s => s.linkedStates.includes(state));
    }
    toUpdateState(state) {
        return this.isIndependentlyUpdatable(state) || this.isLinkedToIndependentlyUpdatable(state);
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
    /* async preload(loader: Loader) {
        console.log("ss", this.states)
        await Promise.all(
            this.states.filter(state => this.toPreloadState(state)).map(state => state.preload(loader))
        );
    } */
    update(input) {
        this.states.filter(state => this.toUpdateState(state)).forEach(state => {
            state.update(input);
        });
    }
    async insert(state, index) {
        if (!state)
            return;
        await state.preload(this.game.loader);
        this.states = insertIntoArray(this.states, index, [state]);
        state.evtHandler.dispatchEvent('insert', this);
        this.evtHandler.dispatchEvent('state insert', state);
    }
    async push(state) {
        await this.insert(state, this.states.length);
    }
    pop() {
        this.remove(this.states.length - 1);
    }
    remove(index) {
        const state = this.states[index];
        this.states.splice(index, 1);
        state?.evtHandler.dispatchEvent('remove');
        this.evtHandler.dispatchEvent('state remove');
    }
}
Mixin.apply(StateStack, [Renderable, Updatable, Preloadable]);
export default StateStack;
