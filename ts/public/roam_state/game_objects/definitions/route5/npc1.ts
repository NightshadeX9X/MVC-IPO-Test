import Loader from "../../../../core/Loader.js";
import BlankState from "../../../../states/BlankState.js";
import DelayState from "../../../../states/DelayState.js";
import RoamState from "../../../../states/RoamState.js";
import Direction from "../../../../util/Direction.js";
import { Mixin, New } from "../../../../util/functions.js";
import { ArgsType } from "../../../../util/types.js";
import Vector from "../../../../util/Vector.js";
import NPC from "../../types/NPC.js";


interface npc1 extends NPC {

}

class npc1 {
	constructor(...args: ArgsType<typeof npc1["construct"]>) {
		return New(npc1, ...args);
	}
	static construct(this: npc1, roamState: RoamState) {
		NPC.construct.call(this, roamState);
		this.pos = new Vector(7, 20);
		this.variables.set('active', true)
		return this;
	}
	async preload(loader: Loader) {
		await NPC.prototype.preload.call(this, loader);
	}
	async onInteract() {
		this.variables.set('active', !this.variables.get('active'));
	}
}
Mixin.apply(npc1, [NPC]);


export default npc1;