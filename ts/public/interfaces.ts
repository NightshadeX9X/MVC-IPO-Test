import Controller from "./classes/Controller.js";

export default interface Entity {
	preload(): Promise<void>;
	init(): void;
	update(controller: Controller): void;
	render(ctx: CanvasRenderingContext2D): void;
}