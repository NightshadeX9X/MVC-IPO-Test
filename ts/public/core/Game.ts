import RoamState from "../states/RoamState.js";
import { Mixin, New } from "../util/functions.js";
import UIDGen from "../util/UIDGen.js";
import { Preloadable, Renderable, Updatable } from "./Attributes.js";
import Input from "./Input.js";
import Loader from "./Loader.js";
import StateStack from "./StateStack.js";

interface Game extends Renderable, Updatable, Preloadable {
	stateStack: StateStack;
	cnv: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	input: Input;
	loader: Loader;
	fps: number;
	stateIDGen: UIDGen;
}
class Game {


	constructor() {
		return New(Game);
	}

	static construct(this: Game) {
		Renderable.construct.call(this);
		Updatable.construct.call(this);
		Preloadable.construct.call(this);

		this.stateStack = new StateStack(this, this);
		this.cnv = document.getElementById('screen') as HTMLCanvasElement;
		this.ctx = this.cnv.getContext('2d') as CanvasRenderingContext2D;
		this.input = new Input();
		this.loader = new Loader();
		this.fps = 60;

		this.stateIDGen = new UIDGen();
		this.stateIDGen.prefix = "STATE";

		return this;
	}

	async preload() {
		this.input.start(document);
		await this.stateStack.push(new RoamState(this.stateStack));
	}

	update() {
		this.stateStack.update(this.input);
	}

	render() {
		this.stateStack.render(this.ctx);
	}
}

Mixin.apply(Game, [Renderable, Updatable, Preloadable]);

export default Game;