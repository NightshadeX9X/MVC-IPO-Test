import Entity from "../Entity.js";
import Input from "./Input.js";
import Loader from "./Loader.js";
import StateStack from "./StateStack.js";

export default abstract class State implements Entity {
	public toUpdate: boolean | null = null;
	public toRender: boolean | null = null;
	public toPreload: boolean | null = null;
	public substates = new StateStack(this.stateStack.loader);

	constructor(public stateStack: StateStack) { }

	abstract preload(loader: Loader): Promise<void>;
	abstract init(): void;
	abstract update(input: Input): void;
	abstract render(ctx: CanvasRenderingContext2D): void;
	onPop: () => any = () => { };
}