import Loader from "../../../../core/Loader.js";
import BlankState from "../../../../states/BlankState.js";
import DelayState from "../../../../states/DelayState.js";
import RoamState from "../../../../states/RoamState.js";
import TextBoxState from "../../../../states/TextBoxState.js";
import Direction from "../../../../util/Direction.js";
import { Parents, random } from "../../../../util/functions.js";
import { ArgsType } from "../../../../util/types.js";
import Vector from "../../../../util/Vector.js";
import NPC from "../../types/NPC.js";


interface npc1 extends NPC {

}
@Parents(NPC)
class npc1 {
	constructor(public roamState: RoamState) {
		NPC.call(this, roamState);
		this.pos = new Vector(7, 20);
		this.variables.set('active', true);

		this.facePlayerOnInteraction = false;
	}
	async onInteract() {
		this.roamState.stateStack.push(new TextBoxState(this.roamState.stateStack, "hello there bonu how much among us have you played today huh? while I was busy making tea you were busy playing among us with ashu and ashi! :(((((("))
	}
}


export default npc1;