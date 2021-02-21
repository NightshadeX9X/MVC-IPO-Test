import State from "../core/State.js";
import StateStack from "../core/StateStack.js";
import Player from "../roam_state/Player.js";
import { Mixin, New } from "../util/functions.js";
class RoamState {
    constructor(...args) {
        this.tileSize = 0;
        this.player = null;
        this.backgroundProcesses = null;
        return New(RoamState, ...args);
    }
    static construct(stateStack) {
        State.construct.call(this, stateStack);
        this.tileSize = 16;
        this.player = new Player(this);
        this.backgroundProcesses = new StateStack(this.stateStack.game, this);
        return this;
    }
    async preload(loader) {
        await Promise.all([
            this.player.preload(loader)
        ]);
    }
    update(input) {
        this.player.update(input);
        this.subStateStack.update(input);
        this.backgroundProcesses.update(input);
    }
    async addBackgroundProcess(s) {
        s.toUpdate = true;
        s.blocking = false;
        await this.backgroundProcesses.push(s);
    }
    render(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.player.render(ctx);
        this.backgroundProcesses.render(ctx);
        this.subStateStack.render(ctx);
    }
}
Mixin.apply(RoamState, [State]);
export default RoamState;
