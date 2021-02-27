import { Mixin, New } from '../util/functions.js';
import GameMapLayer from "./GameMapLayer.js";
import { Preloadable } from "../core/Attributes.js";
import Vector from "../util/Vector.js";
class GameMap {
    constructor(...args) {
        return New(GameMap, ...args);
    }
    static construct(roamState, name) {
        Preloadable.construct.call(this);
        this.roamState = roamState;
        this.name = name;
        this.layers = [];
        return this;
    }
    loadJSONData(loader) {
        return loader.loadJSON(`/json/maps/${this.name}.json`);
    }
    initLayers() {
        this.json.layers.forEach(layer => {
            this.layers.push(new GameMap.Layer(this, layer.zIndex));
        });
    }
    async preload(loader) {
        this.json = await this.loadJSONData(loader);
        this.initLayers();
        console.log(this.json);
        await Promise.all(this.layers.map(l => l.preload(loader)));
    }
    get size() {
        return Vector.fromString((this.json?.sizeInTiles));
    }
}
Mixin.apply(GameMap, [Preloadable]);
(function (GameMap) {
    GameMap.Layer = GameMapLayer;
})(GameMap || (GameMap = {}));
export default GameMap;
