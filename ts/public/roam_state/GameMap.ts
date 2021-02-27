import { ArgsType, JSON } from "../util/types.js";
import { Mixin, New } from '../util/functions.js';
import RoamState from "../states/RoamState.js";
import GameMapLayer from "./GameMapLayer.js";
import { Preloadable } from "../core/Attributes.js";
import Loader from "../core/Loader.js";
import Vector from "../util/Vector.js";

interface GameMap extends Preloadable {
	layers: GameMap.Layer[];
	roamState: RoamState;
	name: string;
	json: GameMap.JSON;
}

class GameMap {
	constructor(...args: ArgsType<typeof GameMap["construct"]>) {
		return New(GameMap, ...args);
	}
	static construct(this: GameMap, roamState: RoamState, name: string) {
		Preloadable.construct.call(this);

		this.roamState = roamState;
		this.name = name;
		this.layers = [];

		return this;
	}

	private loadJSONData(loader: Loader) {
		return loader.loadJSON(`/json/maps/${this.name}.json`);
	}

	private initLayers() {
		this.json.layers.forEach(layer => {
			this.layers.push(new GameMap.Layer(this, layer.zIndex));
		})
	}

	async preload(loader: Loader) {
		this.json = await this.loadJSONData(loader) as GameMap.JSON;
		this.initLayers();
		console.log(this.json)
		await Promise.all(
			this.layers.map(l => l.preload(loader)),
		);
	}

	get size() {
		return Vector.fromString((this.json?.sizeInTiles));
	}
}

Mixin.apply(GameMap, [Preloadable])

namespace GameMap {
	export const Layer = GameMapLayer;
	export type Layer = GameMapLayer;

	export namespace Layer {
		type IndividualPart = {
			type: "wall",
			value: boolean | string;
		};

		export type Part = IndividualPart & {
			range: Vector.AsStringRange,
			priority: number;
		};
	}

	export interface JSON {
		name: string;
		sizeInTiles: Vector.AsString;
		layers: {
			zIndex: number;
			parts: Layer.Part[]
		}[];
		gameObjects: string[];
	}
}

export default GameMap;
