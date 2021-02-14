import { Preloadable } from "../core/Attributes.js";
import Loader from "../core/Loader.js";
import RoamState from "../states/RoamState.js";
import GameMapLayer from "./GameMapLayer.js";
import Player from "./Player.js";

export default class GameMap implements Preloadable {
	public layers = [
		new GameMapLayer(this, '0', 0),
		new GameMapLayer(this, '1', 1),
		new GameMapLayer(this, '2', 2),
		new GameMapLayer(this, '3', 3),
		new GameMapLayer(this, '4', 4),
	]
	constructor(public roamState: RoamState, public name: string) {

	}
	async preload(loader: Loader) {
		await Promise.all(this.layers.map(layer => layer.preload(loader)))
	}
}