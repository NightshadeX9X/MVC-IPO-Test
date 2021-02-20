import { Mixin, create } from "../util/functions.js";
import StateStack from "./StateStack.js";

abstract class Game {
	stateStack: StateStack = null as any;
	cnv: HTMLCanvasElement = null as any;
	ctx: CanvasRenderingContext2D = null as any;

	static construct(this: Game) {
		this.stateStack = create(StateStack, this, this);
		this.cnv = document.getElementById('screen') as HTMLCanvasElement;
		this.ctx = this.cnv.getContext('2d') as CanvasRenderingContext2D;
		return this;
	}
}

export default Game;