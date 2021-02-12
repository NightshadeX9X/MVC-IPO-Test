import Input from "./Input.js";
import Loader from "./Loader.js";

export interface Preloadable {
	toPreload: boolean | null;
	preload(loader: Loader): Promise<void>;
}
export interface Updatable {
	toUpdate: boolean | null;
	update(input: Input): void;
}
export interface Renderable {
	toRender: boolean | null;
	render(ctx: CanvasRenderingContext2D): void;
}

export interface Entity extends Preloadable, Updatable, Renderable {

}