import Entity from "../interfaces.js";
import Controller from "./Controller.js";
import StateStack from "./StateStack.js";

export default abstract class State implements Entity {
	constructor(public stateStack: StateStack) { }
	public forceUpdate: boolean | null = null;
	public toRender = true;
	abstract preload(): Promise<void>;
	abstract init(): void;
	abstract update(controller: Controller): void;
	abstract render(ctx: CanvasRenderingContext2D): void;
}