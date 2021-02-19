import Loader from "../../../core/Loader.js";
import BlankState from "../../../states/BlankState.js";
import DelayState from "../../../states/DelayState.js";
import FadeState from "../../../states/FadeState.js";
import RoamState from "../../../states/RoamState.js";
import Direction from "../../../util/Direction.js";
import Vector from "../../../util/Vector.js";
import Camera from "../../Camera.js";
import NPC from "../../game_object_types/NPC.js";

export default class npc1 extends NPC {
	public pos = new Vector(7, 25);
	private active = true;

	constructor(roamState: RoamState) {
		super(roamState)
		this.pos = new Vector(7, 25);
		this.variables.set('count', 0);
	}

	async preload(loader: Loader) {
		await NPC.prototype.preload.call(this, loader);
		this.init();

	}

	private async init() {
		const bs = new BlankState(this.roamState.stateStack);
		bs.toUpdate = true;
		bs.blocking = false;
		bs.link(this.roamState);
		await this.roamState.stateStack.push(bs)

		while (this.active) {
			const dir = Direction.getRandom();
			await this.walk(dir, bs.subStateStack);
			await DelayState.create(bs.subStateStack, 60);
			console.log(this.roamState.stateStack);
		}

		this.roamState.stateStack.pop();
	}

	async onInteraction() {


	}
}
