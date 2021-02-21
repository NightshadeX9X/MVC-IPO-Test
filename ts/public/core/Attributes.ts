import { New } from "../util/functions.js";
import Input from "./Input.js";
import Loader from "./Loader.js";

export class Updatable {
	toUpdate: boolean | null = null as any;
	constructor() {
		return New(Updatable)
	}
	static construct(this: Updatable) {
		this.toUpdate = null;
		return this;
	}

	update(input: Input): void { };
}

export abstract class Renderable {
	toRender: boolean | null = null as any;
	constructor() {
		return New(Renderable)
	}
	static construct(this: Renderable) {
		this.toRender = null;
		return this;
	}

	render(ctx: CanvasRenderingContext2D): void { };
}

export abstract class Preloadable {
	toPreload: boolean | null = null as any;
	constructor() {
		return New(Preloadable)
	}
	static construct(this: Preloadable) {
		this.toPreload = null;
		return this;
	}

	async preload(loader: Loader): Promise<void> { };
}