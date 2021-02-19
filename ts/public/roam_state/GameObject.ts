import Input from "../core/Input.js";
import Loader from "../core/Loader.js";
import RoamState from "../states/RoamState.js";
import Dictionairy from "../util/Dictionairy.js";
import Events from "../util/Events.js";
import Vector from "../util/Vector.js";
import NPC_Type from "./game_object_types/NPC.js";

class GameObject {
	public pos = new Vector;
	public size = new Vector(1);
	public passable = true;
	public evtHandler = new Events.Handler();
	protected variables = new Dictionairy<string, any>();
	public zIndex = 1;
	constructor(public roamState: RoamState) {
		this.evtHandler.addEventListener('activation', (type: GameObject.ActivationMethod) => {
			if (type === GameObject.ActivationMethod.PLAYER_TOUCH) this.onPlayerTouch();
			else if (type === GameObject.ActivationMethod.INTERACTION) this.onInteraction();
			else if (type === GameObject.ActivationMethod.MAP_ENTER) this.onMapEnter();
		});
	}

	public onPlayerTouch() {

	}
	public onInteraction() {

	}
	public onMapEnter() {

	}

	public async preload(loader: Loader) {

	}

	public update(input: Input) {

	}

	public render(ctx: CanvasRenderingContext2D) {

	}

	public get coveredSquares() {
		return this.pos.rangeTo(this.pos.sum(this.size));
	}
}

namespace GameObject {
	export namespace Types {

	}
	export enum ActivationMethod {
		INTERACTION,
		PLAYER_TOUCH,
		MAP_ENTER,
	}
}

export default GameObject;