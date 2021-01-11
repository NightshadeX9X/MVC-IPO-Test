import Input from "./classes/Input.js";
import Loader from "./classes/Loader.js";

export default interface Entity {
	toUpdate: boolean | null;
	toRender: boolean | null;
	toPreload: boolean | null;
	preload(loader: Loader): Promise<void>;
	init(): void;
	update(input: Input): void;
	render(ctx: CanvasRenderingContext2D): void;
}