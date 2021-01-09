import Entity from "../interfaces.js";
import Controller from "./Controller.js";
import Loader from "./Loader.js";
import StateStack from "./StateStack.js";

export default abstract class State implements Entity {
	constructor(public stateStack: StateStack) { }
	public forceUpdate: boolean | null = null;
	public toRender = true;
	abstract preload(loader: Loader): Promise<void>;
	abstract init(): void;
	abstract update(controller: Controller): void;
	abstract render(ctx: CanvasRenderingContext2D): void;
}