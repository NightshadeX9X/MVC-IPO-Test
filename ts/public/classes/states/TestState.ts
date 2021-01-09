import Controller from "../Controller.js";
import State from "../State.js";
import StateStack from "../StateStack.js";
import Tweener from "../Tweener.js";
import Vector from "../Vector.js";

export default class TestState extends State {
	constructor(stateStack: StateStack) {
		super(stateStack);
	}

	async preload() {

	}
	init(): void {

	}
	update(controller: Controller): void {

	}
	render(ctx: CanvasRenderingContext2D): void {
		ctx.font = "30px monospace";
		ctx.fillText("hello", 30, 50)
	}

}