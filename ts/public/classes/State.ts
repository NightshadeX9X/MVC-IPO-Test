import Entity from "../interfaces.js";

export default abstract class State implements Entity {
	public forceUpdate: boolean | null = null;
	public toRender = true;
	public preloaded = false;
	abstract preload(): Promise<void>;
	abstract init(): void;
	abstract update(): void;
	abstract render(): void;
}