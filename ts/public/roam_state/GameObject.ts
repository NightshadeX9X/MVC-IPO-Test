import { Preloadable, Renderable, Updatable } from "../core/Attributes.js";
import Input from "../core/Input.js";
import RoamState from "../states/RoamState.js";
import Events from "../util/Events.js";
import { Mixin, New } from "../util/functions.js";
import { ArgsType } from "../util/types.js";
import Vector from "../util/Vector.js";

interface GameObject extends Preloadable, Renderable, Updatable {
	roamState: RoamState;
	evtHandler: Events.Handler;
	variables: Map<string, any>;
	pos: Vector;
	size: Vector;
	zIndex: number;
	canBeWalkedThrough: boolean;
}
class GameObject {
	constructor(...args: ArgsType<typeof GameObject["construct"]>) {
		return New(GameObject, ...args);
	}
	static construct(this: GameObject, roamState: RoamState) {
		Preloadable.construct.call(this);
		Updatable.construct.call(this);
		Renderable.construct.call(this);

		this.roamState = roamState;
		this.evtHandler = new Events.Handler();
		this.variables = new Map<string, any>();
		this.pos = new Vector();
		this.zIndex = 1;
		this.size = new Vector(1);
		this.canBeWalkedThrough = false;
		this.initEvtListeners();
		return this;
	}
	private initEvtListeners() {
		this.evtHandler.addEventListener('interact', () => {
			this.onInteract();
		});
		this.evtHandler.addEventListener('playertouch', () => {
			this.onPlayerTouch();
		});
		this.roamState.player.evtHandler.addEventListener('mapenter', () => {
			this.onMapEnter();
		});
	}
	protected onInteract() { }
	protected onPlayerTouch() { }
	protected onMapEnter() { }
	update(input: Input) { }
	render(ctx: CanvasRenderingContext2D) { }

	getCoveredSquares() {
		return this.pos.rangeTo(this.pos.sum(this.size));
	}

}

Mixin.apply(GameObject, [Preloadable, Renderable, Updatable])

export default GameObject;