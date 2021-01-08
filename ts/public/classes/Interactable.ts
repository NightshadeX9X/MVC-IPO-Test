import { Entity } from "../Util.js";
import Input from "./Input.js";
import Loader from "./Loader.js";
import Renderer from "./Renderer.js";
import Vector from "./Vector.js";
import { CutsceneStep } from './states/CutsceneState.js';

export type InteractionData = (CutsceneStep & { requiredStoryPoints?: string[] })[]

export default class Interactable implements Entity {
	public image: HTMLImageElement | null = null;
	public onInteraction: InteractionData = [];
	constructor(public pos: Vector, public size: Vector, public imgUrl: string) {

	}
	preload(loader: Loader): void {
		throw new Error("Method not implemented.");
	}
	update(input: Input): void {
		throw new Error("Method not implemented.");
	}
	render(renderer: Renderer): void {
		throw new Error("Method not implemented.");
	}
}