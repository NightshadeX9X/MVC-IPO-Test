import Direction from "../../../util/Direction.js";
import { Mixin, New } from "../../../util/functions.js";
import GameObject from "../../GameObject.js";
import Walker from "../../Walker.js";
class NPC {
    constructor(...args) {
        return New(NPC, ...args);
    }
    static construct(roamState) {
        GameObject.construct.call(this, roamState);
        Walker.construct.call(this, roamState, this.pos, `player`);
        this.evtHandler.addEventListener('interact', () => {
            this.setDirection(Direction.invert(this.roamState.player.direction));
        });
        this.evtHandler.addEventListener('walk', () => {
            console.log("walked");
        });
        return this;
    }
}
Mixin.apply(NPC, [Walker, GameObject]);
export default NPC;
