import GameObject from "../GameObject.js";
import RoamState from '../../states/RoamState.js';
import MWalker from "../MWalker.js";
import { applyMixins } from "../../util/functions.js";

interface NPC extends MWalker { }
class NPC extends GameObject {
	constructor(public roamState: RoamState) {
		super(roamState);
		MWalker.construct.call(this, "player");
	}
}

applyMixins(NPC, [MWalker])

export default NPC;