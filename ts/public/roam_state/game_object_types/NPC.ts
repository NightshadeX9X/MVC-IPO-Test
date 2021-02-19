import GameObject from "../GameObject.js";
import RoamState from '../../states/RoamState.js';
import MWalker from "../MWalker.js";
import { applyMixins } from "../../util/functions.js";
import Loader from "../../core/Loader.js";
import Direction from "../../util/Direction.js";

interface NPC extends MWalker { }
class NPC extends GameObject {
	passable = false;
	zIndex = 1;
	constructor(public roamState: RoamState) {
		super(roamState);
		MWalker.construct.call(this, "player");
		this.zIndex = 1;

		this.evtHandler.addEventListener('activation', (type: GameObject.ActivationMethod) => {
			if (type !== GameObject.ActivationMethod.INTERACTION) return;
			console.log(Direction.invert(this.roamState.player.direction))
			this.setDirection(Direction.invert(this.roamState.player.direction));
		}, 1)
	}
	async preload(loader: Loader) {
		MWalker.prototype.preload.call(this, loader);
	}
}
applyMixins(NPC, [MWalker])

export default NPC;