import { Direction } from "../../Util.js";
import Controller from "../Controller.js";
import Loader from "../Loader.js";
import Player from "../Player.js";
import State from "../State.js";
import StateStack from "../StateStack.js";

export default class PlayerMovingState extends State {
	constructor(stateStack: StateStack, public direction: Direction, public player: Player) {
		super(stateStack);
		console.log("move player " + Direction[direction])
	}

	async preload(loader: Loader) {

	}
	init(): void {

	}
	update(controller: Controller): void {
	}
	render(ctx: CanvasRenderingContext2D): void {

	}

}