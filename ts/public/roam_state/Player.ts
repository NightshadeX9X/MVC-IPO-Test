import { Updatable } from "../core/Attributes.js";
import Input from "../core/Input.js";
import RoamState from "../states/RoamState.js";
import { Mixin, New } from "../util/functions.js";
import { ArgsType } from "../util/types.js";
import Vector from "../util/Vector.js";
import Walker from "./Walker.js";
import Direction from "../util/Direction.js";
import Events from "../util/Events.js";

class Player {
	evtHandler: Events.Handler = null as any;
	constructor(...args: ArgsType<typeof Player["construct"]>) {
		return New(Player, ...args);
	}
	static construct(this: Player, roamState: RoamState) {
		Walker.construct.call(this, roamState, new Vector(), 'player');
		Updatable.construct.call(this);
		this.evtHandler = new Events.Handler();

		console.log(this.evtHandler.addEventListener('walk', (from: Vector, to: Vector, dir: Direction) => {
			console.log("Player walked", { from: from.toString(), to: to.toString(), direction: Direction[dir] })
		}));

		return this;
	}
	update(input: Input) {
		for (const key in input.directionKeyStates) {
			const dirStr = key as Direction.AsString;
			if (input.directionKeyStates[dirStr]) {
				this.walk(Direction[dirStr]);
				break;
			}
		}
	}
}

Mixin.apply(Player, [Walker, Updatable])

interface Player extends Walker, Updatable { }

export default Player;