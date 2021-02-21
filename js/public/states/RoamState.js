import Player from "../../roam_state/Player.js";
import State from "../core/State.js";
import { Mixin, New } from "../util/functions.js";
class RoamState {
    constructor(...args) {
        this.tileSize = 0;
        this.player = null;
        return New(RoamState, ...args);
    }
    static construct(stateStack) {
        State.construct.call(this, stateStack);
        this.tileSize = 16;
        this.player = new Player(this);
        return this;
    }
    async preload() {
        console.log("thhtr");
    }
    update() {
    }
    render(ctx) {
        this.player.render(ctx);
    }
}
Mixin.apply(RoamState, [State]);
export default RoamState;
