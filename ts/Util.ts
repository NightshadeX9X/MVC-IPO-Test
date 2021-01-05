import Renderer from "./classes/Renderer.js";
import Vector from "./classes/Vector.js";

export enum Direction {
	LEFT,
	TOP,
	RIGHT,
	BOTTOM,
}
export interface Entity {
	preload(): void;
	update(): void;
	render(renderer: Renderer): void;
}
export interface Interactable {
	activationPoints: {
		tilePos: Vector;
		directions: Direction[];
	}[];
	/**
	 * Return the string to be displayed upon activation.
	 */
	uponActivation(): string;
}