import Input from "../core/Input.js";
import Loader from "../core/Loader.js";
import State from "../core/State.js";
import StateStack from "../core/StateStack.js";
import Player from "../roam_state/Player.js";
import { Mixin, New } from "../util/functions.js";
import { ArgsType } from "../util/types.js";
import BlankState from "./BlankState.js";

class RoamState {
	tileSize = 0;
	player: Player = null as any;
	backgroundProcesses: StateStack = null as any;
	constructor(...args: ArgsType<typeof RoamState["construct"]>) {
		return New(RoamState, ...args);
	}

	static construct(this: RoamState, stateStack: StateStack) {
		State.construct.call(this, stateStack);
		this.tileSize = 16;
		this.player = new Player(this);
		this.backgroundProcesses = new StateStack(this.stateStack.game, this);
		return this;
	}

	async preload(loader: Loader) {
		await Promise.all([
			this.player.preload(loader)
		]);

	}

	update(input: Input) {
		this.player.update(input);

		this.subStateStack.update(input);
		this.backgroundProcesses.update(input);
	}

	async addBackgroundProcess(s: State) {
		s.toUpdate = true;
		s.blocking = false;
		await this.backgroundProcesses.push(s);
	}

	render(ctx: CanvasRenderingContext2D) {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
		this.player.render(ctx);

		this.backgroundProcesses.render(ctx);
		this.subStateStack.render(ctx);
	}
}
interface RoamState extends State { }

namespace RoamState {
	export interface BackgroundProcess extends State {
		toUpdate: true,
		blocking: false
	}
}

Mixin.apply(RoamState, [State]);

export default RoamState;