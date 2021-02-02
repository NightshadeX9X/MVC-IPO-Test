import Entity from "../Entity.js";
import Input from "./Input.js";
import Loader, { JSON } from "./Loader.js";
import RoamState from "./states/RoamState.js";
import Vector from "./Vector.js";
import GameMapLayer from './GameMapLayer.js';
import { WallLayer } from './map_layers/WallLayer.js';
import { BaseLayer } from "./map_layers/BaseLayer.js";
import { GrassImage, GrassLayer } from "./map_layers/GrassLayer.js";
import { TallLayer } from "./map_layers/TallLayer.js";
import { PortalLayer } from "./map_layers/PortalLayer.js";

export type TileType = "wall" | "empty";



export default class GameMap implements Entity {
	toUpdate: boolean | null = true;
	toRender: boolean | null = true;
	toPreload: boolean | null = true;
	json: JSONGameMap | null = null;
	image: HTMLImageElement | null = null;
	layers = new Map<string, GameMapLayer>();
	constructor(public name: string, public roamState: RoamState) {


	}

	get size() {
		if (!this.json) return new Vector;
		const size = Vector.fromString(this.json.sizeInTiles);
		return size;
	}
	async preload(loader: Loader) {
		await this.loadJSONData(loader);
		this.layers = new Map<string, GameMapLayer>();
		this.setLayers();

		for (const entry of this.layers) {
			const [key, layer] = entry;
			await layer.preload(loader);
			console.log(`${layer.constructor.name} preloaded`)
		}
	}

	private setLayers() {
		this.layers.set('base', new BaseLayer(this));
		this.layers.set('wall', new WallLayer(this));
		this.layers.set('grass', new GrassLayer(this));
		this.layers.set('tall', new TallLayer(this));
		this.layers.set('portal', new PortalLayer(this));
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
		this.layers.forEach(layer => {
			layer.init();
		})
	}
	update(input: Input): void {
	}
	render(ctx: CanvasRenderingContext2D): void {
		const coords = this.roamState.player.camera.convertCoords(new Vector(14).prod(this.roamState.tileSize))
		this.roamState.player.camera.ctx.save();
		this.roamState.player.camera.ctx.fillStyle = "#4a4a3a"
		this.roamState.player.camera.ctx.fillRect(coords.x, coords.y, 16, 32);
		this.roamState.player.camera.ctx.restore();
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
	layers: {
		walls?: RangedTileSettings<boolean>[];
		grass?: RangedTileSettings<{ table: string, image: GrassImage }>[];
		portals?: RangedTileSettings<{ to: string }>[];
		tall?: RangedTileSettings<boolean>[];
	}
}