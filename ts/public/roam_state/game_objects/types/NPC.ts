import RoamState from "../../../states/RoamState.js";
import Direction from "../../../util/Direction.js";
import { New, Parents } from "../../../util/functions.js";
import { ArgsType } from "../../../util/types.js";
import Vector from "../../../util/Vector.js";
import GameObject from "../../GameObject.js";
import Walker from "../../Walker.js";

interface NPC extends GameObject, Walker {

}

@Parents(GameObject, Walker)
class NPC {
	facePlayerOnInteraction = true;
	constructor(public roamState: RoamState) {
		GameObject.call(this, roamState)
		Walker.call(this, roamState, this.pos, `player`)
		this.evtHandler.addEventListener('interact', () => {
			if (this.facePlayerOnInteraction)
				this.faceWalker()
		})
		this.evtHandler.addEventListener('walk', () => {
			console.log("walked")
		})
	}

	faceWalker(walker: Walker = this.roamState.player) {
		this.setDirection(Direction.invert(walker.direction));
	}

}
export default NPC;