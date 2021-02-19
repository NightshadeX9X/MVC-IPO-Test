import GameObject from "../GameObject.js";
import MWalker from "../MWalker.js";
import { applyMixins } from "../../util/functions.js";
import Direction from "../../util/Direction.js";
class NPC extends GameObject {
    constructor(roamState) {
        super(roamState);
        this.roamState = roamState;
        this.passable = false;
        this.zIndex = 1;
        MWalker.construct.call(this, "player");
        this.zIndex = 1;
        this.evtHandler.addEventListener('activation', (type) => {
            if (type !== GameObject.ActivationMethod.INTERACTION)
                return;
            console.log(Direction.invert(this.roamState.player.direction));
            this.setDirection(Direction.invert(this.roamState.player.direction));
        }, 1);
    }
    async preload(loader) {
        MWalker.prototype.preload.call(this, loader);
    }
}
applyMixins(NPC, [MWalker]);
export default NPC;
