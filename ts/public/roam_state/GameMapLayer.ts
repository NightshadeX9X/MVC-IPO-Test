import { Preloadable, Renderable } from "../core/Attributes.js";
import Loader from "../core/Loader.js";
import GameMap from "./GameMap.js";
import Vector from '../util/Vector.js';
import { omitKeys } from "../util/functions.js";
import e from "express";

export default class GameMapLayer implements Preloadable, Renderable {
	private image: HTMLImageElement | null = null;
	public pos = new Vector;
	private parts = this.parseParts() || [];
	constructor(public gameMap: GameMap, private imageName: string, public zIndex: number) {

	}

	public async preload(loader: Loader) {
		this.image = await loader.loadImage(`/assets/images/maps/${this.gameMap.name}/${this.imageName}.png`)
	}
	public render(ctx: CanvasRenderingContext2D): void {
		if (!this.image) return;
		const coords = this.gameMap.roamState.camera.convertCoords(this.pos);
		this.gameMap.roamState.camera.ctx.drawImage(this.image, coords.x, coords.y);
	}
	private getParts() {
		const layers = this.gameMap.json?.layers;
		if (!layers) return;
		const jsonLayer = layers.find(layer => layer.zIndex === this.zIndex && layer.src === this.imageName);
		if (!jsonLayer) return;
		const parts = jsonLayer.parts;
		return parts;
	}
	private parseParts() {
		const parts = this.getParts();
		if (!parts) return;
		const arr2: Omit<GameMap.JSONLayerPart, "range">[][][] = [];
		for (let y = 0; y < this.gameMap.size.y; y++) {
			arr2[y] = [];
			for (let x = 0; x < this.gameMap.size.y; x++) {
				arr2[y][x] = [];
			}
		}
		parts.forEach(part => {
			const rangeRemoved = omitKeys("range", part);
			const [start, end] = Vector.fromStringRange(part.range);
			for (let y = start.y; y <= end.y; y++) {
				for (let x = start.x; x <= end.x; x++) {
					let el = arr2?.[y]?.[x];
					if (el) {
						if (el.find(e => e.override) && !part.override) return;
						if (part.override) arr2[y][x] = [rangeRemoved]
						else el.push(rangeRemoved);

					}
				}
			}
		});
		return arr2;
	}
	public partsAt(vec: Vector) {
		return this.parts[vec.y]?.[vec.x];
	}
	public wallAt(vec: Vector) {
		const partsAt = this.partsAt(vec);
		if (!partsAt) return false;
		let value: (typeof partsAt)[number]["value"] = false;
		const found = partsAt.find(p => p.type === "wall")
		if (found) value = found.value;
		return value;
	}
}