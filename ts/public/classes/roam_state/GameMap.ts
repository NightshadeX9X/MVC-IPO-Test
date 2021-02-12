import Entity from "../../Entity.js";
import Input from "../Input.js";
import Loader from "../Loader.js";
import RoamState from "../states/RoamState.js";
import Vector from "../Vector.js";
import GameMapLayer from "./GameMapLayer.js";

export type TileType = "wall" | "empty";



export default class GameMap implements Entity {
	toUpdate: boolean | null = true;
	toRender: boolean | null = true;
	toPreload: boolean | null = true;
	json: JSONGameMap | null = null;
	image: HTMLImageElement | null = null;
	layers: GameMapLayer[] = [];
	constructor(public name: string, public roamState: RoamState) {


	}

	get size() {
		if (!this.json) return new Vector;
		const size = Vector.fromString(this.json.sizeInTiles);
		return size;
	}
	async preload(loader: Loader) {
		this.roamState.gameEvents = [];
		await this.loadJSONData(loader);
		this.json?.layers?.forEach(layer => {
			this.layers.push(new GameMapLayer(this, layer.src, layer.zIndex))
		})
		await Promise.all(this.layers.map(l => l.preload(loader)));
	}
	async loadJSONData(loader: Loader) {
		const promises = [
			loader.loadJSON(`/json/maps/${this.name}.json`),
		];

		const [raw]
			= await Promise.all(promises) as
			[JSONGameMap];
		this.json = raw;
	}
	init(): void {
		this.layers.forEach(l => l.init())
	}
	update(input: Input): void {
	}
	render(ctx: CanvasRenderingContext2D): void {

	}

	get sizeInPx() {
		return this.size.prod(this.roamState.tileSize)
	}



}



export interface RangedTileSettings<T> {
	range: string;
	value: T;

}
export interface JSONGameMap {
	name: string;
	sizeInTiles: string;
	gameEvents?: string[];
	layers: {
		src: string;
		zIndex: number;
		parts: LayerPart[];
	}[]
}
export type LayerPart = {
	type: 'wall',
	range: string,
	value: boolean | string;
} | {
	type: 'tall',
	range: string,
	value: boolean;
}