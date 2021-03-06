import { Preloadable, Renderable, Updatable } from "../core/Attributes.js";
import Input from "../core/Input.js";
import RoamState from "../states/RoamState.js";
import Events from "../util/Events.js";
import { Parents } from "../util/functions.js";
import UIDGen from "../util/UIDGen.js";
import Vector from "../util/Vector.js";

interface GameObject extends Preloadable, Renderable, Updatable { }
@Parents(Preloadable, Updatable, Renderable)
class GameObject {
	evtHandler = new Events.Handler();
	variables = new Map<string, any>();
	pos = new Vector();
	zIndex = 1;
	size = new Vector(1);
	canBeWalkedThrough = false;
	static IDGen = new UIDGen("GameObject");
	id = GameObject.IDGen.generate();
	constructor(public roamState: RoamState) {
		Preloadable.call(this)
		Updatable.call(this)
		Renderable.call(this)

		this.initEvtListeners();
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


export default GameObject;