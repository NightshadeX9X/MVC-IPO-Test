import { Entity } from "../../Util.js";
import Renderer from "../Renderer.js";

export default abstract class State implements Entity {
	public forceUpdate = false;
	abstract preload(): Promise<void>;
	abstract update(): void;
	abstract render(renderer: Renderer): void;
}