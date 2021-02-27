import RoamState from "../../../states/RoamState.js";
import Direction from "../../../util/Direction.js";
import { Mixin, New } from "../../../util/functions.js";
import { ArgsType } from "../../../util/types.js";
import Vector from "../../../util/Vector.js";
import GameObject from "../../GameObject.js";
import Walker from "../../Walker.js";

interface NPC extends GameObject, Walker {

}

class NPC {
	constructor(...args: ArgsType<typeof NPC["construct"]>) {
		return New(NPC, ...args);
	}
	static construct(this: NPC, roamState: RoamState) {
		GameObject.construct.call(this, roamState);
		Walker.construct.call(this, roamState, this.pos, `player`);

		this.evtHandler.addEventListener('interact', () => {
			this.setDirection(Direction.invert(this.roamState.player.direction));
		})
		this.evtHandler.addEventListener('walk', () => {
			console.log("walked")
		})
		return this;
	}

}
Mixin.apply(NPC, [Walker, GameObject]);
export default NPC;