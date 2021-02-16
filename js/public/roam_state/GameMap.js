import Vector from "../util/Vector.js";
import GameMapLayer from "./GameMapLayer.js";
class GameMap {
    constructor(roamState, name) {
        this.roamState = roamState;
        this.name = name;
        this.json = null;
        this.layers = [];
    }
    async preload(loader) {
        await this.loadJSON(loader);
        await this.loadLayers(loader);
    }
    async loadJSON(loader) {
        this.json = await loader.loadJSON(`/json/maps/${this.name}.json`);
    }
    async loadLayers(loader) {
        if (this.json) {
            this.json.layers?.forEach(layer => this.layers.push(new GameMap.Layer(this, layer.src, layer.zIndex)));
        }
        await Promise.all(this.layers.map(layer => layer.preload(loader)));
    }
    get size() {
        if (this.json)
            return Vector.fromString(this.json.sizeInTiles);
        return new Vector;
    }
}
(function (GameMap) {
    GameMap.Layer = GameMapLayer;
})(GameMap || (GameMap = {}));
export default GameMap;
