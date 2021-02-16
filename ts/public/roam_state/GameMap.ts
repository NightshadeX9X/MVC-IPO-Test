import { Preloadable } from "../core/Attributes.js";
import Loader from "../core/Loader.js";
import RoamState from "../states/RoamState.js";
import Vector from "../util/Vector.js";
import GameMapLayer from "./GameMapLayer.js";
import Player from "./Player.js";

class GameMap implements Preloadable {
	public json: GameMap.JSON | null = null;
	public layers: GameMap.Layer[] = []
	constructor(public roamState: RoamState, public name: string) {

	}
	public async preload(loader: Loader) {
		await this.loadJSON(loader);
		await this.loadLayers(loader);
	}
	private async loadJSON(loader: Loader) {
		this.json = await loader.loadJSON(`/json/maps/${this.name}.json`) as GameMap.JSON;
	}
	private async loadLayers(loader: Loader) {
		if (this.json) {
			this.json.layers?.forEach(layer => this.layers.push(new GameMap.Layer(this, layer.src, layer.zIndex)))
		}
		await Promise.all(this.layers.map(layer => layer.preload(loader)))
	}
	public get size() {
		if (this.json) return Vector.fromString(this.json.sizeInTiles);
		return new Vector;
	}
}
namespace GameMap {
	export interface JSON {
		name: string;
		sizeInTiles: Vector.AsString;
		layers?: {
			src: `${number}`;
			zIndex: number;
			parts?: JSONLayerPart[];
		}[];
		gameEvents?: string[];
	}

	export type JSONLayerPart =
		({
			type: "wall",
			value: boolean | string;
		})
		& {
			range: Vector.AsStringRange,
			override?: boolean;
		};

	export const Layer = GameMapLayer;
	export type Layer = GameMapLayer;
}

export default GameMap;