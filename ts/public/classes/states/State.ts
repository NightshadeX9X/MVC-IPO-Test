import { Entity } from "../../Util.js";
import Input from "../Input.js";
import Renderer from "../Renderer.js";
import StateStack from "../StateStack.js";

export default abstract class State implements Entity {
	constructor(public stateStack: StateStack) { }
	public forceUpdate = false;
	abstract preload(): Promise<void>;
	abstract update(input: Input): void;
	abstract render(renderer: Renderer): void;
}