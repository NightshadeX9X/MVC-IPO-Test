import GameObject from "../GameObject.js";
import MWalker from "../MWalker.js";
import { applyMixins } from "../../util/functions.js";
class NPC extends GameObject {
    constructor(roamState) {
        super(roamState);
        this.roamState = roamState;
        MWalker.construct.call(this, "player");
    }
}
applyMixins(NPC, [MWalker]);
export default NPC;
