import Events from "../util/Events.js";
import { Entity } from "./Attributes.js";
import Game from "./Game.js";
import Input from "./Input.js";
import Loader from "./Loader.js";
import StateStack from "./StateStack.js";

export default abstract class State implements Entity {
	toPreload: boolean | null = null;
	toUpdate: boolean | null = null;
	toRender: boolean | null = null;
	subStateStack = new StateStack(this, this.stateStack.game);
	evtHandler = new Events.Handler();


	constructor(public stateStack: StateStack<Game | State>) {

	}

	async preload(loader: Loader) {
		await this.subStateStack.preload(loader);
	}
	update(input: Input): void {
		this.subStateStack.update(input);
	}
	render(ctx: CanvasRenderingContext2D): void {
		this.subStateStack.render(ctx);
	}

	pop() {
		return new Promise<void>((res, rej) => {
			this.evtHandler.addEventListener('popped', () => {
				res();
			})
		})
	}

}