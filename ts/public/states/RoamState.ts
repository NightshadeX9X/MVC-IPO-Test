import Player from "../../roam_state/Player.js";
import State from "../core/State.js";
import StateStack from "../core/StateStack.js";
import { Mixin, New } from "../util/functions.js";
import { ArgsType } from "../util/types.js";

class RoamState {
	tileSize = 0;
	player: Player = null as any;
	constructor(...args: ArgsType<typeof RoamState["construct"]>) {
		return New(RoamState, ...args);
	}

	static construct(this: RoamState, stateStack: StateStack) {
		State.construct.call(this, stateStack);
		this.tileSize = 16;
		this.player = new Player(this);
		return this;
	}

	async preload() {
		console.log("thhtr")
	}

	update() {
	}

	render(ctx: CanvasRenderingContext2D) {
		this.player.render(ctx);
	}
}
interface RoamState extends State { }

Mixin.apply(RoamState, [State]);

export default RoamState;