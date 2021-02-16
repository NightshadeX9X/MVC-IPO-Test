import Input from "../core/Input.js";
import Loader from "../core/Loader.js";
import RoamState from "../states/RoamState.js";
import Events from "../util/Events.js";
import Vector from "../util/Vector.js";
import NPC_Type from "./game_object_types/NPC.js";

abstract class GameObject {
	pos = new Vector;
	size = new Vector(1);
	passable = true;
	evtHandler = new Events.Handler();
	constructor(public roamState: RoamState) {

	}

	async preload(loader: Loader) {

	}

	update(input: Input) {

	}

	render() {

	}

	get coveredSquares() {
		return this.pos.rangeTo(this.pos.sum(this.size));
	}
}

namespace GameObject {
	export namespace Types {
		export const NPC = NPC_Type;
		export type NPC = NPC_Type;
	}
}


export default GameObject;