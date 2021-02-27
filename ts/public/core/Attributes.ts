import { New } from "../util/functions.js";
import Input from "./Input.js";
import Loader from "./Loader.js";

export interface Updatable {
	toUpdate: boolean | null;
}
export class Updatable {
	constructor() {
		return New(Updatable)
	}
	static construct(this: Updatable) {
		this.toUpdate = null;
		return this;
	}

	update(input: Input): void { };
}

export interface Renderable {
	toRender: boolean | null;
}
export class Renderable {
	constructor() {
		return New(Renderable)
	}
	static construct(this: Renderable) {
		this.toRender = null;
		return this;
	}

	render(ctx: CanvasRenderingContext2D): void { };
}

export interface Preloadable {
	toPreload: boolean | null;
}
export class Preloadable {
	constructor() {
		return New(Preloadable)
	}
	static construct(this: Preloadable) {
		this.toPreload = null;
		return this;
	}

	async preload(loader: Loader): Promise<void> { };
}