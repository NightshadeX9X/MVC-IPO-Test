import Events from "../util/Events.js";
import { Entity } from "./Attributes.js";
import Game from "./Game.js";
import Input from "./Input.js";
import Loader from "./Loader.js";
import StateStack from "./StateStack.js";

export default abstract class State implements Entity {
	public toPreload: boolean | null = null;
	public toUpdate: boolean | null = null;
	public toRender: boolean | null = null;
	public subStateStack = new StateStack(this, this.stateStack.game);
	public evtHandler = new Events.Handler();


	constructor(public stateStack: StateStack<Game | State>) {

	}

	public async preload(loader: Loader) {
		await this.subStateStack.preload(loader);
	}
	public update(input: Input): void {
		this.subStateStack.update(input);
	}
	public render(ctx: CanvasRenderingContext2D): void {
		this.subStateStack.render(ctx);
	}

	public pop() {
		return new Promise<void>((res, rej) => {
			this.evtHandler.addEventListener('popped', () => {
				res();
			})
		})
	}

}