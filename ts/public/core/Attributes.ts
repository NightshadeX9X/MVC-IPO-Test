import { New } from "../util/functions.js";
import Input from "./Input.js";
import Loader from "./Loader.js";

export class Updatable {
	toUpdate: boolean | null = null;
	constructor() {
	}

	update(input: Input): void { };
}

export class Renderable {
	toRender: boolean | null = null;
	constructor() {
	}

	render(ctx: CanvasRenderingContext2D): void { };
}
export class Preloadable {
	toPreload: boolean | null = null;
	constructor() {
	}

	async preload(loader: Loader): Promise<void> { };
}