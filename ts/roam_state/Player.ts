import RoamState from "../public/states/RoamState.js";
import { Mixin, New } from "../public/util/functions.js";
import { ArgsType } from "../public/util/types.js";
import Vector from "../public/util/Vector.js";
import Walker from "./Walker.js";

class Player {
	constructor(...args: ArgsType<typeof Player["construct"]>) {
		return New(Player, ...args);
	}
	static construct(this: Player, roamState: RoamState) {
		Walker.construct.call(this, roamState, new Vector(), 'player');
		return this;
	}
}

Mixin.apply(Player, [Walker])

interface Player extends Walker { }

export default Player;